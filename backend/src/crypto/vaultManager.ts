import type { PasskeyFile, Password, VaultFile } from '../lib/type.ts';
import { deriveKey, decrypt } from './encryption.ts';

/**
 * VAULT MANAGER MODULE
 * 
 * Responsibilities:
 * - Verify user credentials against vault
 * - Decrypt and parse password data
 * - Pure business logic (no I/O)
 */

const VERIFICATION_TEXT = 'VAULT_VALID_v1';

export class VaultVerificationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'VaultVerificationError';
  }
}

export class VaultDecryptionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'VaultDecryptionError';
  }
}

/**
 * Verify that master key + passkey can decrypt the vault
 * Throws VaultVerificationError if verification fails
 */
export async function verifyVaultCredentials(
  masterKey: string,
  passkeyFile: PasskeyFile,
  vaultFile: VaultFile
): Promise<Buffer> {
  try {
    // Derive encryption key
    const encryptionKey = await deriveKey(
      masterKey,
      passkeyFile.key,
      vaultFile.salt
    );

    // Decrypt verification section
    const decryptedVerification = decrypt(
      vaultFile.verification.cipherText,
      encryptionKey,
      vaultFile.verification.iv
    );

    // Verify the text matches
    if (decryptedVerification !== VERIFICATION_TEXT) {
      throw new VaultVerificationError(
        'Invalid master key or passkey. Please check your credentials.'
      );
    }

    // Return the key for further use
    return encryptionKey;
  } catch (error) {
    if (error instanceof VaultVerificationError) {
      throw error;
    }
    // Any decryption error means wrong credentials
    throw new VaultVerificationError(
      'Invalid master key or passkey. Please check your credentials.'
    );
  }
}

/**
 * Decrypt the password data from vault
 * Requires verified encryption key from verifyVaultCredentials
 */
export function decryptVaultData(
  vaultFile: VaultFile,
  encryptionKey: Buffer
): Password[] {
  try {
    // Decrypt the data section
    const decryptedData = decrypt(
      vaultFile.data.cipherText,
      encryptionKey,
      vaultFile.data.iv
    );

    // Parse JSON array
    const passwords = JSON.parse(decryptedData);

    // Validate structure
    if (!Array.isArray(passwords)) {
      throw new Error('Invalid vault data structure');
    }

    return passwords;
  } catch (error) {
    throw new VaultDecryptionError(
      `Failed to decrypt vault data: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Verify credentials and decrypt passwords in one operation
 * This is the main entry point for the upload flow
 */
export async function verifyAndDecryptVault(
  masterKey: string,
  passkeyFile: PasskeyFile,
  vaultFile: VaultFile
): Promise<Password[]> {
  // Step 1: Verify credentials
  const encryptionKey = await verifyVaultCredentials(
    masterKey,
    passkeyFile,
    vaultFile
  );

  // Step 2: Decrypt password data
  const passwords = decryptVaultData(vaultFile, encryptionKey);

  return passwords;
}
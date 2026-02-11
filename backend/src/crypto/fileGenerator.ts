import {
  generateRandomKey,
  generateSalt,
  generateIV,
  deriveKey,
  encrypt,
} from './encryption.ts';

/**
 * FILE GENERATOR MODULE
 * 
 * Generates .passkey and .vault files with proper structure
 */

export interface PasskeyFile {
  version: string;
  key: string;
  created_at: string;
}

export interface VaultFile {
  version: string;
  salt: string;
  verification: {
    iv: string;
    cipherText: string;
  };
  data: {
    iv: string;
    cipherText: string;
  };
}

const VERIFICATION_TEXT = 'VAULT_VALID_v1';

/**
 * Generate .passkey file
 * @returns PasskeyFile object (to be JSON stringified)
 */
export function generatePasskeyFile(): PasskeyFile {
  return {
    version: '1.0',
    key: generateRandomKey(),
    created_at: new Date().toISOString(),
  };
}

/**
 * Generate .vault file with verification and empty password array
 * @param masterKey - User's master password
 * @param passkeyFile - Generated passkey file object
 * @returns VaultFile object (to be JSON stringified)
 */
export async function generateVaultFile(
  masterKey: string,
  passkeyFile: PasskeyFile
): Promise<VaultFile> {
  // Generate salt for this vault
  const salt = generateSalt();

  // Derive encryption key from master key + passkey + salt
  const encryptionKey = await deriveKey(masterKey, passkeyFile.key, salt);

  // Generate IVs for verification and data
  const verificationIV = generateIV();
  const dataIV = generateIV();

  // Encrypt verification text
  const verificationEncrypted = encrypt(
    VERIFICATION_TEXT,
    encryptionKey,
    verificationIV
  );

  // Encrypt empty password array
  const emptyData = JSON.stringify([]);
  const dataEncrypted = encrypt(emptyData, encryptionKey, dataIV);

  return {
    version: '1.0',
    salt,
    verification: {
      iv: verificationEncrypted.iv,
      cipherText: verificationEncrypted.cipherText,
    },
    data: {
      iv: dataEncrypted.iv,
      cipherText: dataEncrypted.cipherText,
    },
  };
}
import {
  loadVaultFromSession,
  loadPasskeyFromSession,
  updateVaultInSession,
} from '../lib/sessionManager.ts';
import { deriveKey, encrypt, decrypt } from './encryption.ts';
import type { VaultFile, PasskeyFile, Password } from '../lib/type.ts';

/**
 * DASHBOARD OPERATIONS MODULE
 * 
 * Business logic for password CRUD operations
 * All operations:
 * 1. Load and decrypt vault
 * 2. Modify password array
 * 3. Re-encrypt and save
 * 4. Return updated array
 */

/**
 * Decrypt password array from vault
 */
async function decryptPasswords(
  vaultFile: VaultFile,
  passkeyFile: PasskeyFile,
  masterKey: string
): Promise<Password[]> {
  const encryptionKey = await deriveKey(
    masterKey,
    passkeyFile.key,
    vaultFile.salt
  );

  const decryptedData = decrypt(
    vaultFile.data.cipherText,
    encryptionKey,
    vaultFile.data.iv
  );

  return JSON.parse(decryptedData);
}

/**
 * Re-encrypt password array and update vault
 */
async function encryptAndSavePasswords(
  sessionId: string,
  passwords: Password[],
  vaultFile: VaultFile,
  passkeyFile: PasskeyFile,
  masterKey: string
): Promise<void> {
  const encryptionKey = await deriveKey(
    masterKey,
    passkeyFile.key,
    vaultFile.salt
  );

  // Encrypt password array with new IV
  const encrypted = encrypt(
    JSON.stringify(passwords),
    encryptionKey
  );

  // Update vault data section
  vaultFile.data.iv = encrypted.iv;
  vaultFile.data.cipherText = encrypted.cipherText;

  // Save to session
  await updateVaultInSession(sessionId, vaultFile);
}

/**
 * Add a new password to vault
 */
export async function addPassword(
  sessionId: string,
  masterKey: string,
  newPassword: Omit<Password, 'id' | 'created_at' | 'updated_at'>
): Promise<Password[]> {
  // Load files from session
  const vaultFile = await loadVaultFromSession(sessionId);
  const passkeyFile = await loadPasskeyFromSession(sessionId);

  // Decrypt current passwords
  const passwords = await decryptPasswords(vaultFile, passkeyFile, masterKey);

  // Generate new ID
  const maxId = passwords.length > 0 
    ? Math.max(...passwords.map(p => p.id)) 
    : 0;
  const newId = maxId + 1;

  // Create new password entry
  const passwordEntry: Password = {
    id: newId,
    name: newPassword.name,
    description: newPassword.description,
    password: newPassword.password,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // Add to array
  passwords.push(passwordEntry);

  // Re-encrypt and save
  await encryptAndSavePasswords(
    sessionId,
    passwords,
    vaultFile,
    passkeyFile,
    masterKey
  );

  return passwords;
}

/**
 * Edit an existing password
 */
export async function editPassword(
  sessionId: string,
  masterKey: string,
  passwordId: number,
  updates: Partial<Pick<Password, 'name' | 'description' | 'password'>>
): Promise<Password[]> {
  // Load files from session
  const vaultFile = await loadVaultFromSession(sessionId);
  const passkeyFile = await loadPasskeyFromSession(sessionId);

  // Decrypt current passwords
  const passwords = await decryptPasswords(vaultFile, passkeyFile, masterKey);

  // Find password to edit
  const passwordIndex = passwords.findIndex(p => p.id === passwordId);
  if (passwordIndex === -1) {
    throw new Error('Password not found');
  }

  // Update fields
  passwords[passwordIndex] = {
    ...passwords[passwordIndex],
    ...updates,
    updated_at: new Date().toISOString(),
  };

  // Re-encrypt and save
  await encryptAndSavePasswords(
    sessionId,
    passwords,
    vaultFile,
    passkeyFile,
    masterKey
  );

  return passwords;
}

/**
 * Delete a password
 */
export async function deletePassword(
  sessionId: string,
  masterKey: string,
  passwordId: number
): Promise<Password[]> {
  // Load files from session
  const vaultFile = await loadVaultFromSession(sessionId);
  const passkeyFile = await loadPasskeyFromSession(sessionId);

  // Decrypt current passwords
  const passwords = await decryptPasswords(vaultFile, passkeyFile, masterKey);

  // Filter out the password
  const filteredPasswords = passwords.filter(p => p.id !== passwordId);

  if (filteredPasswords.length === passwords.length) {
    throw new Error('Password not found');
  }

  // Re-encrypt and save
  await encryptAndSavePasswords(
    sessionId,
    filteredPasswords,
    vaultFile,
    passkeyFile,
    masterKey
  );

  return filteredPasswords;
}

/**
 * Increment file version for download
 */
export async function incrementVaultVersion(sessionId: string): Promise<VaultFile> {
  const vaultFile = await loadVaultFromSession(sessionId);
  
  // Increment version number
  const currentVersion = vaultFile.fileVersion || 1;
  vaultFile.fileVersion = currentVersion + 1;
  
  // Save back to session
  await updateVaultInSession(sessionId, vaultFile);
  
  return vaultFile;
}
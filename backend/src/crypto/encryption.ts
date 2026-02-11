import crypto from 'crypto';
import { hashRaw } from '@node-rs/argon2';

/**
 * ENCRYPTION UTILITIES MODULE
 * 
 * This module handles all cryptographic operations:
 * - Key derivation using Argon2id (modern, secure)
 * - AES-256-GCM encryption/decryption
 * - Random key/salt/IV generation
 */

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 12; // 96 bits for GCM
const SALT_LENGTH = 16; // 128 bits
const AUTH_TAG_LENGTH = 16; // 128 bits

/**
 * Generate a random 256-bit key (for passkey file)
 * @returns Base64-encoded random key
 */
export function generateRandomKey(): string {
  const key = crypto.randomBytes(KEY_LENGTH);
  return key.toString('base64');
}

/**
 * Generate a random salt for key derivation
 * @returns Base64-encoded salt
 */
export function generateSalt(): string {
  const salt = crypto.randomBytes(SALT_LENGTH);
  return salt.toString('base64');
}

/**
 * Generate a random IV for encryption
 * @returns Base64-encoded IV
 */
export function generateIV(): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  return iv.toString('base64');
}

/**
 * Derive encryption key from master key + passkey using Argon2id
 * @param masterKey - User's memorable password
 * @param passkeyBase64 - Base64 passkey from .passkey file
 * @param saltBase64 - Base64 salt from .vault file
 * @returns 256-bit derived key
 */
export async function deriveKey(
  masterKey: string,
  passkeyBase64: string,
  saltBase64: string
): Promise<Buffer> {

  //? edge cases
  if (!masterKey || masterKey.length < 8) {
    throw new Error('Master key must be at least 8 characters');
  }
  if (!passkeyBase64 || !saltBase64) {
    throw new Error('Passkey and salt are required');
  }

  // Combine master key and passkey
  const combined = Buffer.concat([
    Buffer.from(masterKey, 'utf8'),
    Buffer.from(passkeyBase64, 'base64')
  ]);
  const salt = Buffer.from(saltBase64, 'base64');

  // Use Argon2id for key derivation
  const hash = await hashRaw(combined, {
    algorithm: 2,
    memoryCost: 131072, // 128 MB
    timeCost: 4, // 4 iterations
    parallelism: 4,
    salt,
    outputLen: KEY_LENGTH,
  });

  return hash;
}

/**
 * Encrypt data using AES-256-GCM
 * @param plaintext - Data to encrypt (string)
 * @param key - 256-bit encryption key
 * @param ivBase64 - Base64 IV (if not provided, generates new one)
 * @returns Object with iv and cipherText (both base64)
 */
export function encrypt(
  plaintext: string,
  key: Buffer,
  ivBase64?: string
): { iv: string; cipherText: string } {
  const iv = ivBase64
    ? Buffer.from(ivBase64, 'base64')
    : crypto.randomBytes(IV_LENGTH);

  //? Cipher is an algorithm that makes data readable->non-readable or vice versa. 
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plaintext, 'utf8', 'base64');
  encrypted += cipher.final('base64');

  //? use as a seal that the encrypted message is authentic
  const authTag = cipher.getAuthTag();

  //? Concatenate cipherText and auth tag
  const cipherTextWithTag = Buffer.concat([
    Buffer.from(encrypted, 'base64'),
    authTag,
  ]);

  return {
    iv: iv.toString('base64'),
    cipherText: cipherTextWithTag.toString('base64'),
  };
}

/**
 * Decrypt data using AES-256-GCM
 * @param cipherTextBase64 - Base64 cipherText (with auth tag)
 * @param key - 256-bit encryption key
 * @param ivBase64 - Base64 IV
 * @returns Decrypted plaintext string
 * @throws Error if decryption fails or auth tag is invalid
 */
export function decrypt(
  cipherTextBase64: string,
  key: Buffer,
  ivBase64: string
): string {
  try {
    const iv = Buffer.from(ivBase64, 'base64');
    const cipherTextWithTag = Buffer.from(cipherTextBase64, 'base64');

    // Extract auth tag (last 16 bytes)
    const cipherText = cipherTextWithTag.subarray(0, -AUTH_TAG_LENGTH);
    const authTag = cipherTextWithTag.subarray(-AUTH_TAG_LENGTH);

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(cipherText.toString('base64'), 'base64', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (err) {
    throw new Error('Decryption failed');
  }
}
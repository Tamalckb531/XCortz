import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import type { VaultFile, PasskeyFile, SessionData} from '../lib/type.ts';

/**
 * SESSION MANAGER MODULE
 * 
 * Responsibilities:
 * - Create session directories
 * - Save/load vault and passkey files
 * - Clean up expired sessions
 * - Pure I/O operations (no business logic)
 */

const SESSIONS_DIR = path.join(process.cwd(), 'sessions');

/**
 * Initialize sessions directory on server start
 */
export async function initializeSessionsDirectory(): Promise<void> {
  try {
    await fs.access(SESSIONS_DIR);
  } catch {
    await fs.mkdir(SESSIONS_DIR, { recursive: true });
  }
}

/**
 * Create a new session and save vault + passkey files
 */
export async function createSession(
  vaultFile: VaultFile,
  passkeyFile: PasskeyFile
): Promise<SessionData> {
  const sessionId = randomUUID();
  const sessionDir = path.join(SESSIONS_DIR, sessionId);

  // Create session directory
  await fs.mkdir(sessionDir, { recursive: true });

  // File paths
  const vaultPath = path.join(sessionDir, 'xcortz.vault');
  const passkeyPath = path.join(sessionDir, 'xcortz.passkey');

  // Save files
  await fs.writeFile(vaultPath, JSON.stringify(vaultFile, null, 2), 'utf-8');
  await fs.writeFile(passkeyPath, JSON.stringify(passkeyFile, null, 2), 'utf-8');

  return {
    sessionId,
    vaultPath,
    passkeyPath,
  };
}

/**
 * Load vault file from session
 */
export async function loadVaultFromSession(sessionId: string): Promise<VaultFile> {
  const vaultPath = path.join(SESSIONS_DIR, sessionId, 'xcortz.vault');
  
  try {
    const content = await fs.readFile(vaultPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Session not found or vault file corrupted: ${sessionId}`);
  }
}

/**
 * Load passkey file from session
 */
export async function loadPasskeyFromSession(sessionId: string): Promise<PasskeyFile> {
  const passkeyPath = path.join(SESSIONS_DIR, sessionId, 'xcortz.passkey');
  
  try {
    const content = await fs.readFile(passkeyPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Session not found or passkey file corrupted: ${sessionId}`);
  }
}

/**
 * Update vault file in session
 * Used when user adds/edits passwords
 */
export async function updateVaultInSession(
  sessionId: string,
  vaultFile: VaultFile
): Promise<void> {
  const vaultPath = path.join(SESSIONS_DIR, sessionId, 'xcortz.vault');
  await fs.writeFile(vaultPath, JSON.stringify(vaultFile, null, 2), 'utf-8');
}

/**
 * Delete session directory and all files
 */
export async function deleteSession(sessionId: string): Promise<void> {
  const sessionDir = path.join(SESSIONS_DIR, sessionId);
  
  try {
    await fs.rm(sessionDir, { recursive: true, force: true });
  } catch (error) {
    // Ignore if already deleted
    console.error(`Failed to delete session ${sessionId}:`, error);
  }
}

/**
 * Check if session exists
 */
export async function sessionExists(sessionId: string): Promise<boolean> {
  const sessionDir = path.join(SESSIONS_DIR, sessionId);
  
  try {
    await fs.access(sessionDir);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get vault file content for download
 */
export async function getVaultFileContent(sessionId: string): Promise<string> {
  const vaultPath = path.join(SESSIONS_DIR, sessionId, 'xcortz.vault');
  return await fs.readFile(vaultPath, 'utf-8');
}
import { Hono } from 'hono';
import {verifyAndDecryptVault} from '../crypto/vaultManager.ts';
import type { 
    VaultFile,
    PasskeyFile,
} from '../lib/type.ts'
import {VaultVerificationError, VaultDecryptionError} from '../lib/utils.ts'
import { createSession } from '../lib/sessionManager.ts';

/**
 * UPLOAD ROUTES MODULE
 * 
 * Handles vault upload and credential verification
 */

const uploadRouter = new Hono();

/**
 * POST /api/upload-vault
 * 
 * Verifies credentials and decrypts vault to load passwords
 * 
 * Request body:
 * {
 *   masterKey: string,
 *   passkeyFile: PasskeyFile,
 *   vaultFile: VaultFile
 * }
 * 
 * Success response:
 * {
 *   success: true,
 *   sessionId: string,
 *   passwords: Password[]
 * }
 * 
 * Error response:
 * {
 *   success: false,
 *   error: string
 * }
 */
uploadRouter.post('/upload-vault', async (c) => {
  try {
    const body = await c.req.json();
    const { masterKey, passkeyFile, vaultFile } = body;

    // Validate required fields
    if (!masterKey || typeof masterKey !== 'string') {
      return c.json(
        {
          success: false,
          error: 'Master key is required',
        },
        400
      );
    }

    if (!passkeyFile || typeof passkeyFile !== 'object') {
      return c.json(
        {
          success: false,
          error: 'Passkey file is required',
        },
        400
      );
    }

    if (!vaultFile || typeof vaultFile !== 'object') {
      return c.json(
        {
          success: false,
          error: 'Vault file is required',
        },
        400
      );
    }

    // Validate file structure
    if (!passkeyFile.key || !passkeyFile.version) {
      return c.json(
        {
          success: false,
          error: 'Invalid passkey file format',
        },
        400
      );
    }

    if (
      !vaultFile.salt ||
      !vaultFile.verification ||
      !vaultFile.data ||
      !vaultFile.version
    ) {
      return c.json(
        {
          success: false,
          error: 'Invalid vault file format',
        },
        400
      );
    }

    // Verify credentials and decrypt passwords
    const passwords = await verifyAndDecryptVault(
      masterKey,
      passkeyFile as PasskeyFile,
      vaultFile as VaultFile
    );

    // Create session and save files
    const session = await createSession(
      vaultFile as VaultFile,
      passkeyFile as PasskeyFile
    );

    // Return success with passwords
    return c.json({
      success: true,
      sessionId: session.sessionId,
      passwords,
    });
  } catch (error) {
    // Handle specific error types
    if (error instanceof VaultVerificationError) {
      return c.json(
        {
          success: false,
          error: error.message,
        },
        401
      );
    }

    if (error instanceof VaultDecryptionError) {
      return c.json(
        {
          success: false,
          error: 'Vault file is corrupted or invalid format',
        },
        400
      );
    }

    // Log unexpected errors
    console.error('Unexpected error in upload-vault:', error);

    return c.json(
      {
        success: false,
        error: 'An unexpected error occurred. Please try again.',
      },
      500
    );
  }
});

export default uploadRouter;
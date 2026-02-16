import type { Context } from "hono";
import { generatePasskeyFile, generateVaultFile } from "../crypto/fileGenerator.ts";
import {
  addPassword,
  editPassword,
  deletePassword,
  incrementVaultVersion,
} from '../crypto/dashboardOperation.ts';
import { sessionExists, deleteSession } from '../lib/sessionManager.ts';

export const addPasswordController = async (c:Context) => {
  try {
    const body = await c.req.json();
    const { sessionId, masterKey, password } = body;

    // Validate input
    if (!sessionId || !masterKey || !password) {
      return c.json(
        {
          success: false,
          error: 'Session ID, master key, and password data are required',
        },
        400
      );
    }

    if (!password.name || !password.description || !password.password) {
      return c.json(
        {
          success: false,
          error: 'Password name, description, and password are required',
        },
        400
      );
    }

    // Check session exists
    const exists = await sessionExists(sessionId);
    if (!exists) {
      return c.json(
        {
          success: false,
          error: 'Session not found. Please re-upload your vault.',
        },
        404
      );
    }

    // Add password
    const updatedPasswords = await addPassword(sessionId, masterKey, password);

    return c.json({
      success: true,
      passwords: updatedPasswords,
    });
  } catch (error) {
    console.error('Error adding password:', error);
    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to add password',
      },
      500
    );
  }
}

export const vaultFileController = async (c:Context) => {
  try {
    const body = await c.req.json();
    const { masterKey, passkeyFile } = body;

    // Validation
    if (!masterKey || typeof masterKey !== 'string') {
      return c.json(
        {
          success: false,
          error: 'Master key is required',
        },
        400
      );
    }

    if (masterKey.length < 8) {
      return c.json(
        {
          success: false,
          error: 'Master key must be at least 8 characters',
        },
        400
      );
    }

    if (!passkeyFile || !passkeyFile.key) {
      return c.json(
        {
          success: false,
          error: 'Valid passkey file is required',
        },
        400
      );
    }

    // Generate vault file
    const vaultFile = await generateVaultFile(masterKey, passkeyFile);

    return c.json({
      success: true,
      data: vaultFile,
    });
  } catch (error) {
    console.error('Error generating vault:', error);
    return c.json(
      {
        success: false,
        error: 'Failed to generate vault file',
      },
      500
    );
  }
}
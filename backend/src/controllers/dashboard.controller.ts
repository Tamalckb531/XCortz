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

export const editPasswordController = async (c:Context) => {
  try {
    const body = await c.req.json();
    const { sessionId, masterKey, passwordId, updates } = body;

    // Validate input
    if (!sessionId || !masterKey || passwordId === undefined || !updates) {
      return c.json(
        {
          success: false,
          error: 'Session ID, master key, password ID, and updates are required',
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

    // Edit password
    const updatedPasswords = await editPassword(
      sessionId,
      masterKey,
      passwordId,
      updates
    );

    return c.json({
      success: true,
      passwords: updatedPasswords,
    });
  } catch (error) {
    console.error('Error editing password:', error);
    
    if (error instanceof Error && error.message === 'Password not found') {
      return c.json(
        {
          success: false,
          error: 'Password not found',
        },
        404
      );
    }

    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to edit password',
      },
      500
    );
  }
}

export const deletePasswordController = async (c:Context) => {
  try {
    const body = await c.req.json();
    const { sessionId, masterKey, passwordId } = body;

    // Validate input
    if (!sessionId || !masterKey || passwordId === undefined) {
      return c.json(
        {
          success: false,
          error: 'Session ID, master key, and password ID are required',
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

    // Delete password
    const updatedPasswords = await deletePassword(
      sessionId,
      masterKey,
      passwordId
    );

    return c.json({
      success: true,
      passwords: updatedPasswords,
    });
  } catch (error) {
    console.error('Error deleting password:', error);
    
    if (error instanceof Error && error.message === 'Password not found') {
      return c.json(
        {
          success: false,
          error: 'Password not found',
        },
        404
      );
    }

    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete password',
      },
      500
    );
  }
}

export const downloadVaultController = async (c:Context) => {
  try {
    const sessionId = c.req.param('sessionId');

    // Check session exists
    const exists = await sessionExists(sessionId);
    if (!exists) {
      return c.json(
        {
          success: false,
          error: 'Session not found',
        },
        404
      );
    }

    // Increment version and get vault
    const updatedVault = await incrementVaultVersion(sessionId);

    // Return as downloadable file
    const filename = `xcortz_${updatedVault.fileVersion}.vault`;
    
    return c.json(updatedVault, 200, {
      'Content-Disposition': `attachment; filename="${filename}"`,
    });
  } catch (error) {
    console.error('Error downloading vault:', error);
    return c.json(
      {
        success: false,
        error: 'Failed to download vault',
      },
      500
    );
  }
}

export const cleanupSessionController =  async (c:Context) => {
  try {
    const body = await c.req.json();
    const { sessionId } = body;

    if (!sessionId) {
      return c.json(
        {
          success: false,
          error: 'Session ID is required',
        },
        400
      );
    }

    await deleteSession(sessionId);

    return c.json({
      success: true,
      message: 'Session cleaned up successfully',
    });
  } catch (error) {
    console.error('Error cleaning up session:', error);
    return c.json(
      {
        success: false,
        error: 'Failed to cleanup session',
      },
      500
    );
  }
}
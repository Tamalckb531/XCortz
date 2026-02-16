import { Hono } from 'hono';
import {
  addPassword,
  editPassword,
  deletePassword,
  incrementVaultVersion,
} from '../crypto/dashboardOperation.ts';
import { sessionExists, deleteSession } from '../lib/sessionManager.ts';
import type { Password } from '../lib/type.ts';
import { addPasswordController } from '../controllers/dashboard.controller.ts';

/**
 * DASHBOARD ROUTES MODULE
 * 
 * API endpoints for password management operations
 */

const dashboardRouter = new Hono();

/**
 * POST /api/add-password
 * Add a new password to the vault
 */
dashboardRouter.post('/add-password', addPasswordController);

/**
 * POST /api/edit-password
 * Edit an existing password
 */
dashboardRouter.post('/edit-password', async (c) => {
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
});

/**
 * POST /api/delete-password
 * Delete a password
 */
dashboardRouter.post('/delete-password', async (c) => {
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
});

/**
 * GET /api/download-vault/:sessionId
 * Download the updated vault file
 */
dashboardRouter.get('/download-vault/:sessionId', async (c) => {
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
});

/**
 * POST /api/cleanup-session
 * Delete session after user is done
 */
dashboardRouter.post('/cleanup-session', async (c) => {
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
});

export default dashboardRouter;
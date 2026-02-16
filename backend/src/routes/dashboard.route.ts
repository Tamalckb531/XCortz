import { Hono } from 'hono';
import {
  addPassword,
  editPassword,
  deletePassword,
  incrementVaultVersion,
} from '../crypto/dashboardOperation.ts';
import { sessionExists, deleteSession } from '../lib/sessionManager.ts';
import type { Password } from '../lib/type.ts';
import { addPasswordController, deletePasswordController, downloadVaultController, editPasswordController } from '../controllers/dashboard.controller.ts';

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
dashboardRouter.post('/edit-password', editPasswordController);

/**
 * POST /api/delete-password
 * Delete a password
 */
dashboardRouter.post('/delete-password', deletePasswordController);

/**
 * GET /api/download-vault/:sessionId
 * Download the updated vault file
 */
dashboardRouter.get('/download-vault/:sessionId', downloadVaultController);

/**
 * POST /api/cleanup-session
 * Delete session after user is done
 */
dashboardRouter.post('/cleanup-session', async (c:Context) => {
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
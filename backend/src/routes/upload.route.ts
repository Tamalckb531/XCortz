import { Hono } from 'hono';
import { uploadController } from '../controllers/upload.controller.ts';

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
uploadRouter.post('/upload-vault', uploadController);

export default uploadRouter;
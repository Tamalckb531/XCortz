import { Hono } from 'hono';
import { passKeyController, vaultFileController } from '../controllers/generate.controller.ts';

/**
 * GENERATE ROUTES MODULE
 * 
 * API endpoints for generating .passkey and .vault files
 */

const generateRouter = new Hono();

/**
 * POST /api/generate-passkey
 * Generates a new .passkey file
 * 
 * Response: PasskeyFile JSON
 */
generateRouter.post('/generate-passkey', passKeyController);

/**
 * POST /api/generate-vault
 * Generates a new .vault file
 * 
 * Request body:
 * {
 *   masterKey: string,
 *   passkeyFile: PasskeyFile
 * }
 * 
 * Response: VaultFile JSON
 */
generateRouter.post('/generate-vault', vaultFileController);

export default generateRouter;
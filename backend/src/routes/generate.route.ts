import { Hono } from 'hono';
import { generatePasskeyFile, generateVaultFile } from '../crypto/fileGenerator.ts';

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
generateRouter.post('/generate-passkey', async (c) => {
  try {
    const passkeyFile = generatePasskeyFile();
    
    return c.json({
      success: true,
      data: passkeyFile,
    });
  } catch (error) {
    console.error('Error generating passkey:', error);
    return c.json(
      {
        success: false,
        error: 'Failed to generate passkey file',
      },
      500
    );
  }
});

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
generateRouter.post('/generate-vault', async (c) => {
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
});

export default generateRouter;
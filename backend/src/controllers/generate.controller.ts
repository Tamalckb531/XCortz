import type { Context } from "hono";
import { generatePasskeyFile, generateVaultFile } from "../crypto/fileGenerator.ts";

export const passKeyController = async (c:Context) => {
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
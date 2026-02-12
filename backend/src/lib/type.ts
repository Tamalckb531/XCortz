export interface PasskeyFile {
  version: string;
  key: string;
  created_at: string;
}

export interface VaultFile {
  version: string;
  fileVersion?: number;
  salt: string;
  verification: {
    iv: string;
    cipherText: string;
  };
  data: {
    iv: string;
    cipherText: string;
  };
}

export interface Password {
  id: number;
  name: string;
  description: string;
  password: string;
  created_at?: string;
  updated_at?: string;
}

export const VERIFICATION_TEXT = 'VAULT_VALID_v1';

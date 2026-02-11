export interface PasskeyFile {
  version: string;
  key: string;
  created_at: string;
}

export interface VaultFile {
  version: string;
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
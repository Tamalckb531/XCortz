export class VaultVerificationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'VaultVerificationError';
  }
}

export class VaultDecryptionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'VaultDecryptionError';
  }
}
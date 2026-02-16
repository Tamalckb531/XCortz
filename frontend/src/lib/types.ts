export type Info = {
    new: {
        text: string,
        route: string,
    },
    old: {
        text: string,
        route: string,
    },
}

export interface PasswordDisplayProps {
  password: string;
  onRegenerate: () => void;
  onCopy: () => void;
}

export interface StrengthIndicatorProps {
  strength: "weak" | "average" | "strong";
}

export interface PasswordCustomizerProps {
  length: number;
  onLengthChange: (value: number[]) => void;
  options: {
    uppercase: boolean;
    lowercase: boolean;
    numbers: boolean;
    symbols: boolean;
  };
  onOptionChange: (option: keyof PasswordCustomizerProps["options"]) => void;
}

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
    ciphertext: string;
  };
  data: {
    iv: string;
    ciphertext: string;
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

export interface UploadResult{
  success: boolean,
  sessionId: string,
  passwords: Password,
  error?: any;
}

export interface UnsavedChangesIndicatorProps {
  changesCount: number;
  onDownload: () => void;
  isDownloading?: boolean;
}

export interface EditPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (passwordId: number, updates: { name: string; description: string; password: string }) => void;
  password: Password | null;
  isLoading?: boolean;
}

export interface AddPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (password: { name: string; description: string; password: string }) => void;
  isLoading?: boolean;
}

export interface PasswordTableProps {
  passwords: Password[];
  onEdit: (password: Password) => void;
  onDelete: (passwordId: number) => void;
}
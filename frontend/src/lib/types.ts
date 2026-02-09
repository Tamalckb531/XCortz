export type Info = {
    new: {
        text: string,
    },
    old: {
        text: string,
    },
}

export interface PasswordDisplayProps {
  password: string;
  onRegenerate: () => void;
  onCopy: () => void;
}
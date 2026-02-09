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
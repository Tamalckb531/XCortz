import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RefreshCw, Copy } from "lucide-react";
import { PasswordDisplayProps } from "@/lib/types";


export const PasswordDisplay = ({
  password,
  onRegenerate,
  onCopy,
}: PasswordDisplayProps) => {
  return (
    <div className="flex items-center gap-2 w-full">
      <Input
        type="text"
        value={password}
        className="flex-1"
      />
      <Button
        variant="outline"
        size="icon"
        onClick={onRegenerate}
      >
        <RefreshCw className="h-4 w-4 text-black" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onCopy}
      >
        <Copy className="h-4 w-4 text-black" />
      </Button>
    </div>
  );
};
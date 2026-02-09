import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { PasswordCustomizerProps } from "@/lib/types";


export const PasswordCustomizer = ({
  length,
  onLengthChange,
  options,
  onOptionChange,
}: PasswordCustomizerProps) => {
  return (
    <div className="w-full flex flex-col gap-6">
      {/* Password Length */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <Label>Password Length</Label>
          <span className="text-sm">{length}</span>
        </div>
        <Slider
          value={[length]}
          onValueChange={onLengthChange}
          min={4}
          max={32}
          step={1}
          className="w-full"
        />
      </div>

      {/* Character Options */}
      <div className="flex flex-col gap-3">
        <Label>Characters</Label>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="uppercase"
              checked={options.uppercase}
              onCheckedChange={() => onOptionChange("uppercase")}
            />
            <Label htmlFor="uppercase" className="cursor-pointer">
              Uppercase (A-Z)
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="lowercase"
              checked={options.lowercase}
              onCheckedChange={() => onOptionChange("lowercase")}
            />
            <Label htmlFor="lowercase" className="cursor-pointer">
              Lowercase (a-z)
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="numbers"
              checked={options.numbers}
              onCheckedChange={() => onOptionChange("numbers")}
            />
            <Label htmlFor="numbers" className="cursor-pointer">
              Numbers (0-9)
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="symbols"
              checked={options.symbols}
              onCheckedChange={() => onOptionChange("symbols")}
            />
            <Label htmlFor="symbols" className="cursor-pointer">
              Symbols (!@#$%^&*)
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
};
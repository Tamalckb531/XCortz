import { StrengthIndicatorProps } from "@/lib/types";

export const StrengthIndicator = ({ strength }: StrengthIndicatorProps) => {
  const getStrengthWidth = () => {
    switch (strength) {
      case "weak":
        return "w-1/3";
      case "average":
        return "w-2/3";
      case "strong":
        return "w-full";
      default:
        return "w-0";
    }
  };

  const getStrengthLabel = () => {
    switch (strength) {
      case "weak":
        return "Weak";
      case "average":
        return "Average";
      case "strong":
        return "Strong";
      default:
        return "";
    }
  };

  return (
    <div className="w-full">
      <div className="w-full h-2 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${getStrengthWidth()}`}
        />
      </div>
      <div className="flex justify-between items-center mt-2">
        <span className="text-sm">{getStrengthLabel()}</span>
      </div>
    </div>
  );
};
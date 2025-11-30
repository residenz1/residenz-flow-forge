import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export const StepIndicator = ({ currentStep, totalSteps, className }: StepIndicatorProps) => {
  return (
    <div className={cn("flex gap-2 justify-center", className)}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "h-1.5 rounded-full transition-all duration-300",
            index < currentStep ? "w-8 bg-primary" : "w-1.5 bg-border"
          )}
        />
      ))}
    </div>
  );
};

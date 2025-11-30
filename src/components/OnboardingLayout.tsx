import { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StepIndicator } from "./StepIndicator";

interface OnboardingLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  currentStep?: number;
  totalSteps?: number;
  onBack?: () => void;
}

export const OnboardingLayout = ({
  children,
  title,
  subtitle,
  currentStep,
  totalSteps,
  onBack,
}: OnboardingLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="p-4 flex items-center justify-between border-b">
        {onBack ? (
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
        ) : (
          <div />
        )}
        {currentStep && totalSteps && (
          <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
        )}
        <div className="w-10" />
      </header>

      <main className="flex-1 p-6 flex flex-col">
        <div className="max-w-md mx-auto w-full space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="font-sora text-3xl font-bold">{title}</h1>
            {subtitle && <p className="text-muted-foreground text-lg">{subtitle}</p>}
          </div>
          {children}
        </div>
      </main>
    </div>
  );
};

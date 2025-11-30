import { useState } from "react";
import { OnboardingLayout } from "@/components/OnboardingLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Check, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const ClientSelectFrequency = () => {
  const navigate = useNavigate();
  const [selectedFrequency, setSelectedFrequency] = useState<string | null>(null);

  const frequencies = [
    {
      id: "weekly",
      label: "Semanal",
      visits: "4 visitas/mes",
      price: 120,
      perVisit: 30,
      popular: true,
    },
    {
      id: "biweekly",
      label: "Quincenal",
      visits: "2 visitas/mes",
      price: 70,
      perVisit: 35,
      popular: false,
    },
    {
      id: "monthly",
      label: "Mensual",
      visits: "1 visita/mes",
      price: 45,
      perVisit: 45,
      popular: false,
    },
  ];

  const handleContinue = () => {
    if (!selectedFrequency) return;
    navigate("/client/plan-summary");
  };

  return (
    <OnboardingLayout
      title="¿Cada cuánto limpiamos?"
      subtitle="Elige la frecuencia que funcione para ti"
      currentStep={5}
      totalSteps={7}
      onBack={() => navigate("/client/select-size")}
    >
      <div className="space-y-6">
        <div className="space-y-3">
          {frequencies.map((freq) => (
            <Card
              key={freq.id}
              className={cn(
                "p-6 cursor-pointer transition-all duration-200 relative",
                selectedFrequency === freq.id
                  ? "border-primary border-2 bg-primary/5"
                  : "hover:border-primary/50"
              )}
              onClick={() => setSelectedFrequency(freq.id)}
            >
              {freq.popular && (
                <Badge className="absolute -top-2 right-4 bg-primary">
                  Más popular
                </Badge>
              )}
              {selectedFrequency === freq.id && (
                <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="font-sora text-xl font-semibold">{freq.label}</h4>
                  <p className="text-sm text-muted-foreground">{freq.visits}</p>
                  <p className="text-xs text-muted-foreground">
                    S/ {freq.perVisit} por visita
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">S/ {freq.price}</div>
                  <div className="text-xs text-muted-foreground">por mes</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="p-4 bg-success/10 border border-success/20 rounded-lg flex items-start gap-3">
          <TrendingDown className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
          <p className="text-sm">
            <strong>Ahorra más:</strong> Planes más frecuentes tienen mejor precio por visita
          </p>
        </div>

        <Button
          size="lg"
          className="w-full"
          onClick={handleContinue}
          disabled={!selectedFrequency}
        >
          Continuar
        </Button>
      </div>
    </OnboardingLayout>
  );
};

export default ClientSelectFrequency;

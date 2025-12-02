import { useState } from "react";
import { OnboardingLayout } from "@/components/OnboardingLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const ClientSelectSize = () => {
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const sizes = [
    { id: "studio", label: "Estudio / 1 ambiente", icon: "🛋️", description: "Hasta 30m²" },
    { id: "1bed", label: "1 habitación", icon: "🛏️", description: "30-60m²" },
    { id: "2bed", label: "2 habitaciones", icon: "🏠", description: "60-90m²" },
    { id: "3bed", label: "3 habitaciones o más", icon: "🏡", description: "Más de 90m²" },
  ];

  const handleContinue = () => {
    if (!selectedSize) return;
    navigate("/client/select-frequency");
  };

  return (
    <OnboardingLayout
      title="¿Qué tamaño tiene tu hogar?"
      subtitle="Esto nos ayuda a planificar mejor"
      currentStep={4}
      totalSteps={7}
      onBack={() => navigate("/client/home-info")}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {sizes.map((size) => (
            <Card
              key={size.id}
              className={cn(
                "p-6 cursor-pointer transition-all duration-200 relative",
                selectedSize === size.id
                  ? "border-primary border-2 bg-primary/5"
                  : "hover:border-primary/50"
              )}
              onClick={() => setSelectedSize(size.id)}
            >
              {selectedSize === size.id && (
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
              <div className="text-center space-y-2">
                <div className="text-4xl mb-2">{size.icon}</div>
                <h4 className="font-semibold">{size.label}</h4>
                <p className="text-xs text-muted-foreground">{size.description}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground">
          💡 <strong>Tip:</strong> Puedes ajustar esto más adelante si es necesario
        </div>

        <Button
          size="lg"
          className="w-full"
          onClick={handleContinue}
          disabled={!selectedSize}
        >
          Continuar
        </Button>
      </div>
    </OnboardingLayout>
  );
};

export default ClientSelectSize;

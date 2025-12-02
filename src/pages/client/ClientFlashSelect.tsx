import { useState } from "react";
import { OnboardingLayout } from "@/components/OnboardingLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const ClientFlashSelect = () => {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const services = [
    { id: "kitchen", label: "Limpieza de cocina", icon: "🍳", description: "Cocina completa" },
    { id: "bathroom", label: "Limpieza de baño", icon: "🚿", description: "Baño completo" },
    { id: "bed", label: "Tender cama", icon: "🛏️", description: "Cama y alrededores" },
    { id: "dishes", label: "Platos y áreas básicas", icon: "🍽️", description: "Cocina y sala" },
  ];

  const handleContinue = () => {
    if (!selectedService) return;
    navigate("/client/flash-confirm", { state: { service: selectedService } });
  };

  return (
    <OnboardingLayout
      title="Selecciona tu servicio rápido"
      subtitle="Llegada en 10 minutos"
      currentStep={1}
      totalSteps={3}
      onBack={() => navigate("/onboarding")}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {services.map((service) => (
            <Card
              key={service.id}
              className={cn(
                "p-6 cursor-pointer transition-all duration-200 relative",
                selectedService === service.id
                  ? "border-primary border-2 bg-primary/5"
                  : "hover:border-primary/50"
              )}
              onClick={() => setSelectedService(service.id)}
            >
              {selectedService === service.id && (
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
              <div className="text-center space-y-2">
                <div className="text-4xl mb-2">{service.icon}</div>
                <h4 className="font-semibold">{service.label}</h4>
                <p className="text-xs text-muted-foreground">{service.description}</p>
              </div>
            </Card>
          ))}
        </div>

        <Button
          size="lg"
          className="w-full"
          onClick={handleContinue}
          disabled={!selectedService}
        >
          Continuar
        </Button>
      </div>
    </OnboardingLayout>
  );
};

export default ClientFlashSelect;

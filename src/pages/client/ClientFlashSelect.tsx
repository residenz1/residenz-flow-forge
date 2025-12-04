import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, UtensilsCrossed, Bath, Bed, Sparkles, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const services = [
  { id: "kitchen", name: "Limpieza de cocina", icon: UtensilsCrossed, price: 25 },
  { id: "bathroom", name: "Limpieza de baño", icon: Bath, price: 20 },
  { id: "bedroom", name: "Tender cama", icon: Bed, price: 15 },
  { id: "basic", name: "Platos y áreas básicas", icon: Sparkles, price: 18 },
];

const ClientFlashSelect = () => {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const handleContinue = () => {
    if (selectedService) {
      const service = services.find((s) => s.id === selectedService);
      if (service) {
        // Only pass serializable data, not the icon component
        navigate("/client/flash-photo", {
          state: { service: { id: service.id, name: service.name, price: service.price } },
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3 max-w-7xl mx-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-sora text-xl font-semibold">Limpieza rápida</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="font-sora text-2xl font-bold">Limpieza rápida en 10 minutos</h2>
          <p className="text-muted-foreground">Selecciona lo que necesitas limpiar ahora mismo.</p>
        </div>

        <div className="space-y-3">
          {services.map((service) => {
            const Icon = service.icon;
            const isSelected = selectedService === service.id;

            return (
              <Card
                key={service.id}
                className={`p-4 cursor-pointer transition-all ${
                  isSelected ? "border-primary bg-primary/5 ring-2 ring-primary" : "hover:border-primary/50"
                }`}
                onClick={() => setSelectedService(service.id)}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isSelected ? "bg-primary/20" : "bg-muted"
                    }`}
                  >
                    <Icon className={`w-6 h-6 ${isSelected ? "text-primary" : ""}`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{service.name}</p>
                    <p className="text-sm text-muted-foreground">S/ {service.price}</p>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        <Button className="w-full" size="lg" disabled={!selectedService} onClick={handleContinue}>
          Continuar
        </Button>
      </main>
    </div>
  );
};

export default ClientFlashSelect;

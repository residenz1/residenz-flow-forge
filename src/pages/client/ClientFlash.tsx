import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, MapPin, Zap, Clock, Star, Sparkles, Shirt, UtensilsCrossed, Bath } from "lucide-react";
import { toast } from "sonner";

const services = [
  {
    id: "express",
    icon: Sparkles,
    name: "Express",
    description: "Limpieza general rápida",
    duration: "1-2 horas",
    price: 35,
  },
  {
    id: "kitchen",
    icon: UtensilsCrossed,
    name: "Cocina",
    description: "Cocina impecable",
    duration: "1 hora",
    price: 25,
  },
  {
    id: "bathroom",
    icon: Bath,
    name: "Baños",
    description: "Baños relucientes",
    duration: "45 min",
    price: 20,
  },
  {
    id: "laundry",
    icon: Shirt,
    name: "Lavandería",
    description: "Ropa lavada y doblada",
    duration: "2 horas",
    price: 30,
  },
];

const ClientFlash = () => {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [address, setAddress] = useState("");

  const handleContinue = () => {
    if (!selectedService) {
      toast.error("Selecciona un servicio");
      return;
    }
    if (!address) {
      toast.error("Ingresa tu dirección");
      return;
    }
    navigate("/client/flash/confirm", { 
      state: { 
        service: services.find(s => s.id === selectedService),
        address 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3 max-w-7xl mx-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-sora text-lg font-semibold">Limpieza Flash</h1>
            <p className="text-xs text-muted-foreground">Tu Resi llega en 10 minutos</p>
          </div>
          <div className="flex items-center gap-1 text-primary">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">10 min</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Address Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">¿Dónde te visitamos?</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Ingresa tu dirección"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Services Grid */}
        <div className="space-y-3">
          <h2 className="font-semibold">¿Qué necesitas?</h2>
          <div className="grid grid-cols-2 gap-3">
            {services.map((service) => {
              const Icon = service.icon;
              const isSelected = selectedService === service.id;
              
              return (
                <Card
                  key={service.id}
                  className={`p-4 cursor-pointer transition-all ${
                    isSelected 
                      ? "border-2 border-primary bg-primary/5" 
                      : "hover:bg-muted/50"
                  }`}
                  onClick={() => setSelectedService(service.id)}
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{service.name}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {service.duration}
                    </span>
                    <span className="font-semibold text-primary">S/ {service.price}</span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Trust Badges */}
        <Card className="p-4 bg-muted/30">
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 text-primary" />
              4.9 promedio
            </span>
            <span className="flex items-center gap-1">
              <Zap className="w-4 h-4 text-primary" />
              10 min llegada
            </span>
          </div>
        </Card>
      </main>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-card border-t">
        <div className="max-w-7xl mx-auto">
          {selectedService && (
            <div className="flex items-center justify-between mb-3 text-sm">
              <span className="text-muted-foreground">Total estimado</span>
              <span className="font-semibold text-lg">
                S/ {services.find(s => s.id === selectedService)?.price || 0}
              </span>
            </div>
          )}
          <Button 
            size="lg" 
            className="w-full"
            onClick={handleContinue}
            disabled={!selectedService}
          >
            <Zap className="w-4 h-4 mr-2" />
            Solicitar ahora
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClientFlash;

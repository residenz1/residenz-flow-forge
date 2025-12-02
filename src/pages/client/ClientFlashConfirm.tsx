import { useState } from "react";
import { OnboardingLayout } from "@/components/OnboardingLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";
import { MapPin, Clock, Sparkles } from "lucide-react";
import { toast } from "sonner";

const serviceNames: Record<string, string> = {
  kitchen: "Limpieza de cocina",
  bathroom: "Limpieza de baño",
  bed: "Tender cama",
  dishes: "Platos y áreas básicas",
};

const ClientFlashConfirm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const service = (location.state as { service: string })?.service || "kitchen";
  
  const [address, setAddress] = useState("");

  const handleContinue = () => {
    if (!address) {
      toast.error("Ingresa tu dirección");
      return;
    }
    navigate("/client/flash-payment", { state: { service, address } });
  };

  return (
    <OnboardingLayout
      title="Confirmación"
      subtitle="Revisa los detalles de tu servicio"
      currentStep={2}
      totalSteps={3}
      onBack={() => navigate("/client/flash-select")}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="address">Dirección *</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Av. Larco 1234, Miraflores"
              className="pl-10"
            />
          </div>
        </div>

        <Card className="p-4 space-y-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Servicio rápido</p>
              <p className="font-semibold">{serviceNames[service]}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Tiempo estimado</p>
              <p className="font-semibold">Llegada en 10 minutos</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="flex justify-between items-baseline">
            <span className="text-sm">Total a pagar:</span>
            <span className="font-sora text-2xl font-bold">S/ 25</span>
          </div>
        </Card>

        <Button
          size="lg"
          className="w-full"
          onClick={handleContinue}
          disabled={!address}
        >
          Ir al pago
        </Button>
      </div>
    </OnboardingLayout>
  );
};

export default ClientFlashConfirm;

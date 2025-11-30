import { OnboardingLayout } from "@/components/OnboardingLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { MapPin, Home, Calendar, CreditCard } from "lucide-react";

const ClientPlanSummary = () => {
  const navigate = useNavigate();

  return (
    <OnboardingLayout
      title="Resumen de tu plan"
      subtitle="Revisa antes de continuar"
      currentStep={6}
      totalSteps={7}
      onBack={() => navigate("/client/select-frequency")}
    >
      <div className="space-y-6">
        <Card className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Dirección</p>
              <p className="font-medium">Av. Larco 1234, Piso 5</p>
              <p className="text-sm text-muted-foreground">Miraflores, Lima</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate("/client/home-info")}>
              Editar
            </Button>
          </div>

          <Separator />

          <div className="flex items-start gap-3">
            <Home className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Tamaño</p>
              <p className="font-medium">2 Habitaciones</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate("/client/select-size")}>
              Editar
            </Button>
          </div>

          <Separator />

          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Frecuencia</p>
              <p className="font-medium">Semanal - 4 visitas/mes</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate("/client/select-frequency")}>
              Editar
            </Button>
          </div>
        </Card>

        {/* Pricing Card */}
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <div className="space-y-4">
            <div className="flex justify-between items-baseline">
              <span className="text-muted-foreground">Costo mensual</span>
              <span className="font-sora text-3xl font-bold">S/ 120</span>
            </div>
            <Separator />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Próxima visita</span>
                <span className="font-medium">Lun 20 Nov, 10:00 AM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Primera facturación</span>
                <span className="font-medium">Hoy</span>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-2 text-xs text-muted-foreground">
          <p>• Cancela cuando quieras, sin penalización</p>
          <p>• Puedes reprogramar visitas con 24h de anticipación</p>
          <p>• Misma Resi de confianza en cada visita</p>
        </div>

        <Button
          size="lg"
          className="w-full h-14"
          onClick={() => navigate("/client/payment")}
        >
          <CreditCard className="w-5 h-5 mr-2" />
          Ir a pago
        </Button>
      </div>
    </OnboardingLayout>
  );
};

export default ClientPlanSummary;

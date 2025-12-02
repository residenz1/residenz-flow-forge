import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircle, Circle, Clock, Star } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const trackingSteps = [
  { id: 1, label: "Resi asignada", completed: true },
  { id: 2, label: "En camino", completed: true, active: true },
  { id: 3, label: "Llegó al edificio", completed: false },
  { id: 4, label: "En limpieza", completed: false },
  { id: 5, label: "Finalizado", completed: false },
];

const ClientFlashTracking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { service } = location.state || {};

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b p-4 sticky top-0 z-10">
        <div className="flex items-center justify-center max-w-7xl mx-auto">
          <h1 className="font-sora text-xl font-semibold">Tu servicio está en camino</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Success message */}
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <h2 className="font-sora text-2xl font-bold">¡Pago confirmado!</h2>
          <p className="text-muted-foreground mt-1">Tu Resi ya está en camino</p>
        </div>

        {/* Resi Card */}
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="text-lg">MG</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold text-lg">María García</p>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="w-4 h-4 fill-primary text-primary" />
                <span>4.9 · 127 servicios</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Time estimate */}
        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="flex items-center justify-center gap-3">
            <Clock className="w-6 h-6 text-primary" />
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Llegada estimada</p>
              <p className="font-sora text-2xl font-bold">10 minutos</p>
            </div>
          </div>
        </Card>

        {/* Tracking Steps */}
        <Card className="p-4">
          <p className="font-medium mb-4">Estado del servicio</p>
          <div className="space-y-4">
            {trackingSteps.map((step, index) => (
              <div key={step.id} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  {step.completed ? (
                    <CheckCircle className={`w-6 h-6 ${step.active ? "text-primary" : "text-success"}`} />
                  ) : (
                    <Circle className="w-6 h-6 text-muted-foreground/30" />
                  )}
                  {index < trackingSteps.length - 1 && (
                    <div className={`w-0.5 h-8 mt-1 ${
                      step.completed ? "bg-success" : "bg-muted"
                    }`} />
                  )}
                </div>
                <div className="flex-1 pt-0.5">
                  <p className={`font-medium ${
                    step.active 
                      ? "text-primary" 
                      : step.completed 
                        ? "text-foreground" 
                        : "text-muted-foreground"
                  }`}>
                    {step.label}
                  </p>
                  {step.active && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Tu Resi está en camino hacia tu ubicación
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Service info */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Servicio</p>
              <p className="font-medium">{service?.name || "Limpieza rápida"}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total pagado</p>
              <p className="font-semibold">S/ {service?.price || 25}</p>
            </div>
          </div>
        </Card>

        <Button 
          className="w-full" 
          size="lg"
          onClick={() => navigate("/client/dashboard")}
        >
          Ir a mi panel
        </Button>
      </main>
    </div>
  );
};

export default ClientFlashTracking;

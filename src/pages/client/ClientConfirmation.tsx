import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Calendar, User, Home } from "lucide-react";

const ClientConfirmation = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-background flex items-center justify-center p-6">
      <div className="max-w-lg w-full space-y-6 animate-fade-in">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-success/10 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-success" />
          </div>
          <h1 className="font-sora text-3xl font-bold">¡Tu plan está activo!</h1>
          <p className="text-muted-foreground text-lg">
            Hemos recibido tu pago correctamente
          </p>
        </div>

        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <Calendar className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Primera visita</p>
              <p className="font-semibold">Lunes 20 Nov, 10:00 AM</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <User className="w-5 h-5 text-primary" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Tu Resi</p>
              <p className="font-semibold">Asignando...</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
          </div>

          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <Home className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Tu plan</p>
              <p className="font-semibold">Semanal - 2 Habitaciones</p>
            </div>
          </div>
        </Card>

        <div className="space-y-3">
          <Card className="p-4 bg-primary/5 border-primary/20">
            <p className="text-sm text-center">
              <strong>¿Qué sigue?</strong> Te notificaremos cuando tu Resi esté asignada. 
              Recibirás un mensaje 24h antes de tu primera visita.
            </p>
          </Card>

          <Button
            size="lg"
            className="w-full h-14"
            onClick={() => navigate("/client/dashboard")}
          >
            Ir a mi panel
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          ¿Necesitas cambiar algo? Puedes hacerlo desde tu panel en cualquier momento
        </p>
      </div>
    </div>
  );
};

export default ClientConfirmation;

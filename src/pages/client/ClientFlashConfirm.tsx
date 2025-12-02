import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, MapPin, Clock, Shield, Zap } from "lucide-react";
import { ResiAvatar } from "@/components/ResiAvatar";
import { toast } from "sonner";

const ClientFlashConfirm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { service, address } = location.state || {};

  // Mock Resi data - would come from matching service
  const assignedResi = {
    name: "María García",
    rating: 4.9,
    visits: 127,
    eta: "8 min",
  };

  const handleConfirm = () => {
    toast.success("¡Servicio confirmado!");
    navigate("/client/flash/payment", { 
      state: { service, address, resi: assignedResi } 
    });
  };

  if (!service) {
    navigate("/client/flash");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3 max-w-7xl mx-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-sora text-lg font-semibold">Confirmar servicio</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-6 pb-32">
        {/* ETA Banner */}
        <Card className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tu Resi llega en</p>
                <p className="text-2xl font-bold">{assignedResi.eta}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Tiempo estimado</p>
              <p className="font-semibold">{service.duration}</p>
            </div>
          </div>
        </Card>

        {/* Assigned Resi */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Tu Resi asignada</h3>
          <ResiAvatar
            name={assignedResi.name}
            rating={assignedResi.rating}
            visits={assignedResi.visits}
            size="lg"
          />
        </Card>

        {/* Service Details */}
        <Card className="p-4 space-y-4">
          <h3 className="font-semibold">Detalles del servicio</h3>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <service.icon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-medium">{service.name}</p>
              <p className="text-sm text-muted-foreground">{service.description}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Dirección</p>
              <p className="text-sm text-muted-foreground">{address}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Duración estimada</p>
              <p className="text-sm text-muted-foreground">{service.duration}</p>
            </div>
          </div>
        </Card>

        {/* Trust */}
        <Card className="p-4 bg-muted/30">
          <div className="flex items-center gap-3 text-sm">
            <Shield className="w-5 h-5 text-primary" />
            <p className="text-muted-foreground">
              Todas nuestras Resis están verificadas y aseguradas
            </p>
          </div>
        </Card>
      </main>

      {/* Fixed Bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-card border-t">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-muted-foreground">Total a pagar</span>
            <span className="text-2xl font-bold">S/ {service.price}</span>
          </div>
          <Button size="lg" className="w-full" onClick={handleConfirm}>
            Confirmar y pagar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClientFlashConfirm;

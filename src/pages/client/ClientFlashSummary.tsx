import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, MapPin, Clock, Info } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const ClientFlashSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { service, photo, address } = location.state || {};

  const handleContinue = () => {
    navigate("/client/flash-payment", { 
      state: { service, photo, address } 
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
          <h1 className="font-sora text-xl font-semibold">Resumen</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="font-sora text-2xl font-bold">Revisa tu pedido</h2>
        </div>

        {/* Service Card */}
        <Card className="p-4">
          <p className="text-sm font-medium text-muted-foreground mb-3">Servicio seleccionado</p>
          <div className="flex gap-4">
            {photo && (
              <img 
                src={photo} 
                alt="Área a limpiar" 
                className="w-24 h-24 rounded-lg object-cover"
              />
            )}
            <div className="flex-1">
              <p className="font-semibold text-lg">{service?.name}</p>
              <p className="text-sm text-muted-foreground mt-1">Limpieza rápida</p>
            </div>
          </div>
        </Card>

        {/* Address Card */}
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Dirección</p>
              <p className="font-medium">{address?.address}</p>
              <p className="text-sm text-muted-foreground">{address?.district}</p>
              {address?.reference && (
                <p className="text-sm text-muted-foreground mt-1">Ref: {address.reference}</p>
              )}
            </div>
          </div>
        </Card>

        {/* Time estimate */}
        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium">Llegada en 10 minutos</p>
              <p className="text-sm text-muted-foreground">Tiempo estimado de limpieza: 20-25 min</p>
            </div>
          </div>
        </Card>

        {/* Price */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="font-medium">Precio total</p>
            <p className="font-sora text-2xl font-bold">S/ {service?.price || 25}</p>
          </div>
        </Card>

        {/* Cancellation policy */}
        <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
          <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground">
            Cancelación sin costo antes de asignar a la Resi
          </p>
        </div>

        <Button 
          className="w-full" 
          size="lg"
          onClick={handleContinue}
        >
          Ir al pago
        </Button>
      </main>
    </div>
  );
};

export default ClientFlashSummary;

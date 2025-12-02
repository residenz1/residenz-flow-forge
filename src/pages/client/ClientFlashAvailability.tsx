import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Clock, Timer, Loader2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const ClientFlashAvailability = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { service, photo, address } = location.state || {};
  const [isSearching, setIsSearching] = useState(true);

  useEffect(() => {
    // Simulate searching for available Resis
    const timer = setTimeout(() => {
      setIsSearching(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    navigate("/client/flash-summary", { 
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
          <h1 className="font-sora text-xl font-semibold">Disponibilidad</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-6">
        {isSearching ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-muted-foreground text-center">
              Buscando la mejor Resi disponible para tu edificio...
            </p>
          </div>
        ) : (
          <>
            <div className="text-center space-y-2">
              <h2 className="font-sora text-2xl font-bold text-success">
                ¡Tenemos Resis disponibles ahora mismo!
              </h2>
            </div>

            {/* Time estimates */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-4 text-center bg-primary/5 border-primary/20">
                <Clock className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-xs text-muted-foreground">Llegada estimada</p>
                <p className="font-sora text-xl font-bold">10 minutos</p>
              </Card>
              <Card className="p-4 text-center">
                <Timer className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-xs text-muted-foreground">Tiempo de limpieza</p>
                <p className="font-sora text-xl font-bold">20-25 min</p>
              </Card>
            </div>

            {/* Service preview */}
            <Card className="p-4">
              <p className="text-sm font-medium text-muted-foreground mb-3">Tu servicio</p>
              <div className="flex gap-3">
                {photo && (
                  <img 
                    src={photo} 
                    alt="Área a limpiar" 
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <p className="font-medium">{service?.name}</p>
                  <p className="text-sm text-muted-foreground">{address?.address}</p>
                  <p className="text-sm text-muted-foreground">{address?.district}</p>
                </div>
              </div>
            </Card>

            {/* Searching message */}
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <p className="text-sm text-muted-foreground">
                Buscando la mejor Resi disponible para tu edificio...
              </p>
            </div>

            <Button 
              className="w-full" 
              size="lg"
              onClick={handleContinue}
            >
              Confirmar servicio
            </Button>
          </>
        )}
      </main>
    </div>
  );
};

export default ClientFlashAvailability;

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Camera, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const ResiVisitCheckin = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isChecking, setIsChecking] = useState(false);

  const visit = {
    building: "Torre Miraflores 305",
    address: "Av. Larco 1234, Miraflores",
  };

  const handleCheckin = () => {
    setIsChecking(true);
    // Simular verificación de ubicación
    setTimeout(() => {
      toast.success("¡Check-in exitoso!");
      navigate(`/resi/visit/${id}/mission`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      <header className="bg-card border-b p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3 max-w-7xl mx-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/resi/visit/${id}`)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="font-sora font-semibold flex-1">Check-in</h2>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-6">
        <div className="text-center space-y-2 pt-4">
          <h1 className="font-sora text-2xl font-bold">Registra tu llegada</h1>
          <p className="text-muted-foreground">
            Verifica que estés en el lugar correcto
          </p>
        </div>

        {/* Location Card */}
        <Card className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-primary mt-1" />
            <div className="flex-1">
              <p className="font-semibold mb-1">{visit.building}</p>
              <p className="text-sm text-muted-foreground">{visit.address}</p>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
            <MapPin className="w-12 h-12 text-muted-foreground" />
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span>Ubicación verificada - Estás cerca</span>
          </div>
        </Card>

        {/* Instructions Card */}
        <Card className="p-4 bg-muted/30">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="space-y-2 text-sm">
              <p className="font-semibold">Antes de hacer check-in:</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Asegúrate de estar en el edificio correcto</li>
                <li>• Toma una selfie clara con buena luz</li>
                <li>• El check-in registra tu hora de llegada</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Selfie Card */}
        <Card className="p-6">
          <div className="text-center space-y-4">
            <div className="w-32 h-32 mx-auto rounded-full bg-muted flex items-center justify-center">
              <Camera className="w-12 h-12 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold mb-1">Toma tu selfie de llegada</p>
              <p className="text-sm text-muted-foreground">
                Esto verifica que estás presente en el lugar
              </p>
            </div>
          </div>
        </Card>

        {/* Action Button */}
        <Button 
          size="lg" 
          className="w-full"
          onClick={handleCheckin}
          disabled={isChecking}
        >
          {isChecking ? (
            "Verificando ubicación..."
          ) : (
            <>
              <Camera className="w-5 h-5 mr-2" />
              Tomar Selfie y Check-in
            </>
          )}
        </Button>
      </main>
    </div>
  );
};

export default ResiVisitCheckin;

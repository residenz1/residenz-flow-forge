import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, User, DollarSign, Navigation } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ResiVisitDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const visit = {
    id: 1,
    time: "10:00 AM",
    duration: "4 horas",
    client: "Ana Rodríguez",
    building: "Torre Miraflores 305",
    address: "Av. Larco 1234, Miraflores",
    type: "Mantenimiento",
    amount: 30,
    notes: "Por favor tener cuidado con el gato. Las plantas necesitan riego.",
    tasks: ["Cocina completa", "Baños principales", "Sala y comedor", "Habitaciones"]
  };

  const handleStartRoute = () => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(visit.address)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      <header className="bg-card border-b p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3 max-w-7xl mx-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate("/resi/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h2 className="font-sora font-semibold">Detalle de Visita</h2>
            <p className="text-xs text-muted-foreground">{visit.time}</p>
          </div>
          <Badge variant="secondary">{visit.type}</Badge>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-4">
        {/* Main Info Card */}
        <Card className="p-6 space-y-4">
          <div>
            <h3 className="font-sora text-xl font-bold mb-1">{visit.building}</h3>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{visit.address}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Duración</p>
                <p className="font-semibold">{visit.duration}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Cliente</p>
                <p className="font-semibold">{visit.client}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Notes Card */}
        {visit.notes && (
          <Card className="p-4 bg-muted/30">
            <p className="text-sm font-semibold mb-2">Notas del Cliente:</p>
            <p className="text-sm text-muted-foreground">{visit.notes}</p>
          </Card>
        )}

        {/* Tasks Preview */}
        <Card className="p-4">
          <p className="text-sm font-semibold mb-3">Tareas Prioritarias:</p>
          <div className="space-y-2">
            {visit.tasks.map((task, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span>{task}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Earnings Card */}
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Ganarás por este trabajo</p>
              <div className="flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-primary" />
                <span className="text-3xl font-bold">S/ {visit.amount}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <Button 
            size="lg" 
            className="w-full"
            onClick={handleStartRoute}
          >
            <Navigation className="w-5 h-5 mr-2" />
            Iniciar Ruta (Maps)
          </Button>
          <Button 
            size="lg" 
            className="w-full" 
            variant="default"
            onClick={() => navigate(`/resi/visit/${id}/checkin`)}
          >
            Llegué – Check-in
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground px-4">
          El check-in se habilitará cuando estés cerca del edificio (30 min antes de tu hora)
        </p>
      </main>
    </div>
  );
};

export default ResiVisitDetail;

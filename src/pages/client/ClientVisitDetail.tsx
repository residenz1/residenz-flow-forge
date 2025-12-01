import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, User, Calendar, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const ClientVisitDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const visit = {
    id: 1,
    date: "Miércoles, 15 Nov",
    time: "10:00 AM",
    duration: "4 horas",
    status: "scheduled",
    resi: {
      name: "María González",
      initials: "MG",
      rating: 4.9,
      completedVisits: 127,
    },
    address: "Av. Larco 1234, Miraflores",
    building: "Torre Miraflores 305",
    tasks: [
      "Limpieza de cocina",
      "Limpieza de baños",
      "Aspirado de sala y comedor",
      "Limpieza de habitaciones",
      "Cambio de sábanas",
    ],
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      <header className="bg-card border-b p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3 max-w-7xl mx-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate("/client/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h2 className="font-sora font-semibold">Detalle de Visita</h2>
            <p className="text-xs text-muted-foreground">{visit.date}</p>
          </div>
          <Badge variant="secondary">Programada</Badge>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-4">
        {/* Date & Time Card */}
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Fecha</p>
                <p className="font-semibold">{visit.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Hora</p>
                <p className="font-semibold">{visit.time} - {visit.duration}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Resi Card */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Tu Resi</h3>
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                {visit.resi.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold text-lg">{visit.resi.name}</p>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                <span>⭐ {visit.resi.rating}</span>
                <span>•</span>
                <span>{visit.resi.completedVisits} visitas</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Location Card */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Ubicación</h3>
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
            <div>
              <p className="font-medium mb-1">{visit.building}</p>
              <p className="text-sm text-muted-foreground">{visit.address}</p>
            </div>
          </div>
        </Card>

        {/* Tasks Card */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Tareas incluidas</h3>
          <div className="space-y-2">
            {visit.tasks.map((task, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span>{task}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <Button
            size="lg"
            className="w-full"
            onClick={() => navigate(`/client/visit/${id}/tracking`)}
          >
            Ver Estado en Vivo
          </Button>
          <Button variant="outline" size="lg" className="w-full">
            <Phone className="w-5 h-5 mr-2" />
            Contactar Soporte
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          Recibirás una notificación cuando tu Resi esté en camino
        </p>
      </main>
    </div>
  );
};

export default ClientVisitDetail;

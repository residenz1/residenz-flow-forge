import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, Star, Settings, HelpCircle, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ResiAvatar } from "@/components/ResiAvatar";
import { BottomNav } from "@/components/BottomNav";

const ClientDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-gradient-to-b from-primary/10 to-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Hola,</p>
              <h2 className="font-sora text-2xl font-bold">Ana</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={() => navigate("/client/support")}>
              <HelpCircle className="w-5 h-5" />
            </Button>
          </div>

          {/* Flash CTA - Prominent */}
          <Card 
            className="p-4 bg-primary text-primary-foreground cursor-pointer hover:bg-primary/90 transition-colors"
            onClick={() => navigate("/client/flash")}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Limpieza en 10 minutos</h3>
                <p className="text-sm opacity-90">Tu Resi llega ahora</p>
              </div>
              <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground">
                Flash
              </Badge>
            </div>
          </Card>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-6 -mt-2">
        {/* Plan Status */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" className="bg-success/20 text-success">
              Plan Activo
            </Badge>
            <Button variant="ghost" size="sm" onClick={() => navigate("/client/settings")}>
              <Settings className="w-4 h-4" />
            </Button>
          </div>
          <h3 className="font-semibold">Plan Semanal</h3>
          <p className="text-sm text-muted-foreground">2 Habitaciones · S/ 120/mes</p>
        </Card>

        {/* Next Visit */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Próxima visita</h3>
            <Badge>En 2 días</Badge>
          </div>

          <ResiAvatar
            name="María García"
            rating={4.9}
            visits={127}
          />

          <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span>Lun 20 Nov</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span>10:00 AM</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2 text-sm">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground truncate">Av. Larco 1234, Miraflores</span>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <Button variant="outline" size="sm">Reprogramar</Button>
            <Button size="sm" onClick={() => navigate("/client/visit/1")}>Ver detalles</Button>
          </div>
        </Card>

        {/* History Preview */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm">Última visita</h3>
            <span className="text-xs text-muted-foreground">13 Nov</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-success/10 text-success">Completada</Badge>
            <div className="flex items-center gap-1 text-sm">
              <Star className="w-3 h-3 fill-primary text-primary" />
              <span>5.0</span>
            </div>
          </div>
        </Card>
      </main>

      <BottomNav type="client" />
    </div>
  );
};

export default ClientDashboard;

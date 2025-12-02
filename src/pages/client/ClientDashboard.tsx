import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Menu,
  Calendar,
  Clock,
  MapPin,
  Star,
  Settings,
  HelpCircle,
  Receipt,
  Home,
  User as UserIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ClientDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-card border-b p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>AR</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold">¡Hola, Ana!</h2>
              <p className="text-xs text-muted-foreground">Miércoles, 15 Nov</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Plan Status */}
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Badge variant="secondary" className="bg-success/20 text-success mb-2">
                Plan Activo
              </Badge>
              <h3 className="font-sora text-xl font-semibold">Plan Semanal</h3>
              <p className="text-sm text-muted-foreground">2 Habitaciones · S/ 120/mes</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate("/client/settings")}>
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </Card>

        {/* Next Visit */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Próxima visita</h3>
            <Badge>En 2 días</Badge>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Avatar>
                  <AvatarFallback>MG</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1">
                <p className="font-medium">María García</p>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="w-3 h-3 fill-primary text-primary" />
                  <span>4.9 · 127 visitas</span>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">Tu Resi</Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-primary" />
                <span>Lun 20 Nov</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-primary" />
                <span>10:00 AM</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-primary" />
              <span>Av. Larco 1234, Piso 5 - Miraflores</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <Button variant="outline">Reprogramar</Button>
            <Button onClick={() => navigate("/client/visit/1")}>Ver detalles</Button>
          </div>
        </Card>

        {/* Recent Visits */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground">Visitas recientes</h3>
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Última visita</span>
              <span className="text-xs text-muted-foreground">13 Nov, 10:00 AM</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">María García completó el servicio</p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-success/10 text-success">
                Completada
              </Badge>
              <Button variant="link" size="sm" className="h-auto p-0">
                Calificar servicio
              </Button>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors">
            <Calendar className="w-6 h-6 mx-auto mb-2 text-primary" />
            <p className="text-xs font-medium">Historial</p>
          </Card>
          <Card className="p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors">
            <Receipt className="w-6 h-6 mx-auto mb-2 text-primary" />
            <p className="text-xs font-medium">Facturas</p>
          </Card>
          <Card 
            className="p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => navigate("/client/support")}
          >
            <HelpCircle className="w-6 h-6 mx-auto mb-2 text-primary" />
            <p className="text-xs font-medium">Ayuda</p>
          </Card>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t p-2">
        <div className="max-w-7xl mx-auto grid grid-cols-4 gap-1">
          <Button variant="ghost" className="flex-col h-auto py-2" onClick={() => navigate("/client/dashboard")}>
            <Home className="w-5 h-5 mb-1 text-primary" />
            <span className="text-xs">Inicio</span>
          </Button>
          <Button variant="ghost" className="flex-col h-auto py-2">
            <Calendar className="w-5 h-5 mb-1" />
            <span className="text-xs">Agenda</span>
          </Button>
          <Button variant="ghost" className="flex-col h-auto py-2">
            <Receipt className="w-5 h-5 mb-1" />
            <span className="text-xs">Pagos</span>
          </Button>
          <Button variant="ghost" className="flex-col h-auto py-2">
            <UserIcon className="w-5 h-5 mb-1" />
            <span className="text-xs">Perfil</span>
          </Button>
        </div>
      </nav>
    </div>
  );
};

export default ClientDashboard;

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
  Home,
  User as UserIcon,
  Zap,
  Edit,
  ChevronRight,
  Receipt,
  CreditCard,
  History,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

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
        {/* Section B: Limpieza rápida (Flash) - Destacada arriba */}
        <Card 
          className="p-5 cursor-pointer hover:shadow-md transition-shadow bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20"
          onClick={() => navigate("/client/flash-select")}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-lg">Limpieza rápida</p>
              <p className="text-sm text-muted-foreground">Llegada en 10 minutos</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </Card>

        {/* Section A: Próxima visita programada */}
        <section className="space-y-3">
          <h3 className="font-semibold text-lg">Próxima visita programada</h3>
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <Badge variant="secondary" className="bg-success/10 text-success">
                Confirmada
              </Badge>
              <span className="text-sm font-medium">En 2 días</span>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <Avatar>
                <AvatarFallback>MG</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">María García</p>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="w-3 h-3 fill-primary text-primary" />
                  <span>4.9 · Tu Resi habitual</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-primary" />
                <span>Lunes 20 Nov, 10:00 AM</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-primary" />
                <span>4 horas estimadas</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => navigate("/client/visit/1/reschedule")}
              >
                Reprogramar
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 text-destructive hover:text-destructive"
                onClick={() => toast.info("Cancelando visita...")}
              >
                Cancelar
              </Button>
            </div>
          </Card>
        </section>

        {/* Section C: Mi hogar */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Mi hogar</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate("/client/home-info")}>
              <Edit className="w-4 h-4 mr-1" />
              Editar
            </Button>
          </div>
          <Card className="p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Dirección</p>
                  <p className="font-medium text-sm">Av. Larco 1234, Piso 5 - Miraflores</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Home className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Tamaño</p>
                  <p className="font-medium text-sm">2 habitaciones</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Frecuencia</p>
                  <p className="font-medium text-sm">Semanal (Lunes)</p>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Section E: Mi suscripción */}
        <section className="space-y-3">
          <h3 className="font-semibold text-lg">Mi suscripción</h3>
          <Card className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <div className="flex items-center justify-between mb-3">
              <Badge variant="secondary" className="bg-success/20 text-success">
                Plan Activo
              </Badge>
              <Button variant="ghost" size="sm">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <h4 className="font-sora text-xl font-semibold mb-1">Plan Semanal</h4>
            <p className="text-sm text-muted-foreground mb-3">2 Habitaciones</p>
            <div className="flex items-center justify-between pt-3 border-t border-border/50">
              <div>
                <p className="text-xs text-muted-foreground">Precio mensual</p>
                <p className="font-semibold text-lg">S/ 120</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Próxima facturación</p>
                <p className="font-medium text-sm">1 Dic, 2024</p>
              </div>
            </div>
          </Card>
        </section>

        {/* Section D: Historial */}
        <section className="space-y-3">
          <h3 className="font-semibold text-lg">Historial</h3>
          <div className="grid grid-cols-3 gap-3">
            <Card 
              className="p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => toast.info("Ver visitas anteriores")}
            >
              <History className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-xs font-medium">Visitas</p>
              <p className="text-xs text-muted-foreground">12 completadas</p>
            </Card>
            <Card 
              className="p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => toast.info("Ver pagos")}
            >
              <Receipt className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-xs font-medium">Pagos</p>
              <p className="text-xs text-muted-foreground">Ver facturas</p>
            </Card>
            <Card 
              className="p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => toast.info("Ver calificaciones")}
            >
              <Star className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-xs font-medium">Calificaciones</p>
              <p className="text-xs text-muted-foreground">8 dadas</p>
            </Card>
          </div>
        </section>

        {/* Soporte rápido */}
        <Card 
          className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => navigate("/client/support")}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <UserIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-sm">¿Necesitas ayuda?</p>
                <p className="text-xs text-muted-foreground">Centro de soporte</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </Card>
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
            <CreditCard className="w-5 h-5 mb-1" />
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

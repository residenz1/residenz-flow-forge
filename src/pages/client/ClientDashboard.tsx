import { useState } from "react";
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
  Plus,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import NotificationsModal from "@/components/NotificationsModal";
import SideDrawerMenu from "@/components/SideDrawerMenu";
import ComingSoonModal from "@/components/ComingSoonModal";

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [comingSoonOpen, setComingSoonOpen] = useState(false);
  const [comingSoonFeature, setComingSoonFeature] = useState("");

  const handleComingSoon = (feature: string) => {
    setComingSoonFeature(feature);
    setComingSoonOpen(true);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Modals */}
      <NotificationsModal 
        open={notificationsOpen} 
        onOpenChange={setNotificationsOpen}
        userType="client"
      />
      <SideDrawerMenu 
        open={menuOpen} 
        onOpenChange={setMenuOpen}
        userType="client"
        userName="Ana Rodríguez"
        userInitials="AR"
      />
      <ComingSoonModal 
        open={comingSoonOpen} 
        onOpenChange={setComingSoonOpen}
        featureName={comingSoonFeature}
      />

      {/* Header */}
      <header className="bg-card border-b px-4 py-3 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 border-2 border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">AR</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold text-foreground">¡Hola, Ana!</h2>
              <p className="text-xs text-muted-foreground">Miércoles, 15 Nov</p>
            </div>
          </div>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="icon"
              className="relative"
              onClick={() => setNotificationsOpen(true)}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Section A: Quick Service CTA */}
        <Card 
          className="p-5 cursor-pointer hover:shadow-md transition-all duration-200 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-l-4 border-l-primary active:scale-[0.99]"
          onClick={() => navigate("/client/flash-select")}
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center shadow-md">
              <Zap className="w-7 h-7 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-foreground">Limpieza rápida</h3>
              <p className="text-sm text-muted-foreground">Tu Housekeeper llega en 10 minutos</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </Card>

        {/* Section B: Próxima visita */}
        <section className="space-y-3">
          <h3 className="font-semibold text-lg text-foreground">Próxima visita programada</h3>
          <Card className="p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <Badge className="bg-success-light text-success-dark border-0">
                Confirmada
              </Badge>
              <span className="text-sm font-medium text-foreground">En 2 días</span>
            </div>

            <div 
              className="flex items-center gap-3 mb-4 cursor-pointer hover:bg-muted/50 -mx-2 px-2 py-2 rounded-lg transition-colors"
              onClick={() => navigate("/client/visit/1")}
            >
              <Avatar className="border-2 border-primary">
                <AvatarFallback className="bg-primary/10 text-primary">MG</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium text-foreground">María García</p>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="w-3 h-3 fill-secondary text-secondary" />
                  <span>4.9 · Tu Resi habitual</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-foreground">Lunes 20 Nov, 10:00 AM</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-foreground">4 horas estimadas</span>
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
                className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => {
                  toast.info("Procesando cancelación...");
                  setTimeout(() => toast.success("Visita cancelada correctamente"), 1500);
                }}
              >
                Cancelar
              </Button>
            </div>
          </Card>
        </section>

        {/* Section C: Tu Saldo - Wallet Card */}
        <section className="space-y-3">
          <h3 className="font-semibold text-lg text-foreground">Tu Saldo</h3>
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-br from-primary to-primary/80 p-5 text-primary-foreground">
              <p className="text-sm opacity-90 mb-1">Saldo disponible</p>
              <h2 className="text-3xl font-bold mb-1">$65.00 USD</h2>
              <p className="text-sm opacity-80 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-primary-foreground/80"></span>
                Listo para el siguiente servicio
              </p>
              <div className="flex gap-2 mt-4">
                <Button 
                  size="sm" 
                  variant="secondary"
                  className="bg-white/90 text-primary hover:bg-white"
                  onClick={() => handleComingSoon("Cargar fondos")}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Cargar Fondos
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost"
                  className="text-primary-foreground hover:bg-white/20"
                  onClick={() => handleComingSoon("Mi Wallet")}
                >
                  <Wallet className="w-4 h-4 mr-1" />
                  Mi Wallet
                </Button>
              </div>
            </div>
          </Card>
        </section>

        {/* Section D: Mi hogar */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg text-foreground">Mi hogar</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-accent"
              onClick={() => handleComingSoon("Editar hogar")}
            >
              <Edit className="w-4 h-4 mr-1" />
              Editar
            </Button>
          </div>
          <Card className="p-4 shadow-sm">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Dirección</p>
                  <p className="font-medium text-sm text-foreground">Av. Larco 1234, Piso 5 - Miraflores</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Home className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Tamaño</p>
                  <p className="font-medium text-sm text-foreground">2 habitaciones</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Frecuencia</p>
                  <p className="font-medium text-sm text-foreground">Semanal (Lunes)</p>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Section E: Historial */}
        <section className="space-y-3">
          <h3 className="font-semibold text-lg text-foreground">Historial</h3>
          <div className="grid grid-cols-3 gap-3">
            <Card 
              className="p-4 text-center cursor-pointer hover:bg-muted/50 hover:shadow-sm transition-all duration-200 active:scale-[0.98]"
              onClick={() => navigate("/client/visit/1")}
            >
              <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-primary/10 flex items-center justify-center">
                <History className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs font-medium text-foreground">Visitas</p>
              <p className="text-xs text-muted-foreground">12 completadas</p>
            </Card>
            <Card 
              className="p-4 text-center cursor-pointer hover:bg-muted/50 hover:shadow-sm transition-all duration-200 active:scale-[0.98]"
              onClick={() => handleComingSoon("Historial de pagos")}
            >
              <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Receipt className="w-5 h-5 text-secondary" />
              </div>
              <p className="text-xs font-medium text-foreground">Pagos</p>
              <p className="text-xs text-muted-foreground">Ver facturas</p>
            </Card>
            <Card 
              className="p-4 text-center cursor-pointer hover:bg-muted/50 hover:shadow-sm transition-all duration-200 active:scale-[0.98]"
              onClick={() => navigate("/client/visit/1/rating")}
            >
              <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-accent/10 flex items-center justify-center">
                <Star className="w-5 h-5 text-accent" />
              </div>
              <p className="text-xs font-medium text-foreground">Calificaciones</p>
              <p className="text-xs text-muted-foreground">8 dadas</p>
            </Card>
          </div>
        </section>

        {/* Soporte rápido */}
        <Card 
          className="p-4 cursor-pointer hover:bg-muted/50 hover:shadow-sm transition-all duration-200 active:scale-[0.98]"
          onClick={() => navigate("/client/support")}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-sm text-foreground">¿Necesitas ayuda?</p>
                <p className="text-xs text-muted-foreground">Centro de soporte</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </Card>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t py-2 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto grid grid-cols-4 gap-1">
          <Button 
            variant="ghost" 
            className="flex-col h-auto py-2 text-primary" 
            onClick={() => navigate("/client/dashboard")}
          >
            <Home className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Inicio</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex-col h-auto py-2 text-muted-foreground hover:text-foreground" 
            onClick={() => navigate("/client/visit/1")}
          >
            <Calendar className="w-5 h-5 mb-1" />
            <span className="text-xs">Agenda</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex-col h-auto py-2 text-muted-foreground hover:text-foreground" 
            onClick={() => handleComingSoon("Pagos")}
          >
            <CreditCard className="w-5 h-5 mb-1" />
            <span className="text-xs">Pagos</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex-col h-auto py-2 text-muted-foreground hover:text-foreground" 
            onClick={() => navigate("/client/support")}
          >
            <UserIcon className="w-5 h-5 mb-1" />
            <span className="text-xs">Perfil</span>
          </Button>
        </div>
      </nav>
    </div>
  );
};

export default ClientDashboard;

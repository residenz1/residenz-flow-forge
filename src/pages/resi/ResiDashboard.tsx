import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Menu,
  MapPin,
  Clock,
  Star,
  Wallet,
  Home,
  Calendar,
  User,
  Navigation,
  Shield,
  CreditCard,
  MessageCircle,
  HelpCircle,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Share2,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import NotificationsModal from "@/components/NotificationsModal";
import SideDrawerMenu from "@/components/SideDrawerMenu";
import ComingSoonModal from "@/components/ComingSoonModal";

const ResiDashboard = () => {
  const navigate = useNavigate();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [comingSoonOpen, setComingSoonOpen] = useState(false);
  const [comingSoonFeature, setComingSoonFeature] = useState("");

  const handleComingSoon = (feature: string) => {
    setComingSoonFeature(feature);
    setComingSoonOpen(true);
  };

  const nextVisit = {
    id: 1,
    time: "10:00 AM",
    duration: "4 horas",
    client: "Ana Rodríguez",
    building: "Torre Miraflores 305",
    address: "Av. Larco 1234, Miraflores",
    type: "Mantenimiento",
    amount: 30,
  };

  const handleShareCode = () => {
    navigator.clipboard.writeText("MARIA2024");
    toast.success("Código copiado al portapapeles");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Modals */}
      <NotificationsModal 
        open={notificationsOpen} 
        onOpenChange={setNotificationsOpen}
        userType="resi"
      />
      <SideDrawerMenu 
        open={menuOpen} 
        onOpenChange={setMenuOpen}
        userType="resi"
        userName="María García"
        userInitials="MG"
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
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">MG</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold text-foreground">¡Hola, María!</h2>
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
        {/* Section A: Mi jornada hoy - Next Service Card */}
        <section className="space-y-3">
          <h3 className="font-semibold text-lg text-foreground">Mi jornada hoy</h3>
          <Card className="overflow-hidden shadow-md">
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-5 border-l-4 border-l-primary">
              <div className="flex items-center justify-between mb-3">
                <Badge className="bg-primary/20 text-primary border-0">
                  Próximo servicio
                </Badge>
                <span className="text-sm font-bold text-foreground">{nextVisit.time}</span>
              </div>

              <h3 className="font-sora text-xl font-semibold text-foreground mb-3">
                {nextVisit.building}
              </h3>

              <div className="space-y-2 mb-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{nextVisit.address}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>{nextVisit.duration} de trabajo</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="w-4 h-4 text-primary" />
                  <span>{nextVisit.client}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <div>
                  <div className="text-xs text-muted-foreground">Ganarás</div>
                  <div className="text-2xl font-bold text-primary">S/ {nextVisit.amount}</div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      toast.info("Abriendo mapa...");
                      setTimeout(() => toast.success("Ruta iniciada en Google Maps"), 1000);
                    }}
                  >
                    <Navigation className="w-4 h-4 mr-1" />
                    Iniciar ruta
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => navigate(`/resi/visit/${nextVisit.id}`)}
                  >
                    Marcar llegada
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Section B: Balance Card - Wallet */}
        <section className="space-y-3">
          <h3 className="font-semibold text-lg text-foreground">Tu Saldo</h3>
          <Card className="overflow-hidden shadow-md">
            <div className="bg-gradient-to-br from-primary to-primary/80 p-5 text-primary-foreground">
              <p className="text-sm opacity-90 mb-1">Saldo disponible</p>
              <h2 className="text-3xl font-bold mb-1">S/ 150.00</h2>
              <p className="text-sm opacity-80 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Listo para retirar
              </p>
              <div className="flex gap-2 mt-4">
                <Button 
                  size="sm" 
                  variant="secondary"
                  className="bg-white/90 text-primary hover:bg-white"
                  onClick={() => navigate("/resi/wallet")}
                >
                  <Wallet className="w-4 h-4 mr-1" />
                  Retirar
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost"
                  className="text-primary-foreground hover:bg-white/20"
                  onClick={() => navigate("/resi/wallet")}
                >
                  Ver historial
                </Button>
              </div>
            </div>
            {/* Balance breakdown */}
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-sm text-foreground">Hoy</span>
                </div>
                <span className="font-semibold text-primary">S/ 55</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground"></div>
                  <span className="text-sm text-foreground">Este mes</span>
                </div>
                <span className="font-semibold text-foreground">S/ 850</span>
              </div>
            </div>
          </Card>
        </section>

        {/* Section C: Estado de cuenta */}
        <section className="space-y-3">
          <h3 className="font-semibold text-lg text-foreground">Estado de cuenta</h3>
          <Card className="divide-y shadow-sm">
            <div
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => navigate("/resi/kyc-document")}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-warning-light flex items-center justify-center">
                  <Shield className="w-5 h-5 text-warning-dark" />
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground">Verificación de identidad</p>
                  <p className="text-xs text-muted-foreground">Documento y selfie</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-warning-light text-warning-dark border-0">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Pendiente
                </Badge>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <div
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => navigate("/resi/bank-account")}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success-light flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-success-dark" />
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground">Método de pago</p>
                  <p className="text-xs text-muted-foreground">Cuenta bancaria</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-success-light text-success-dark border-0">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Configurado
                </Badge>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </Card>
        </section>

        {/* Section D: Mi reputación */}
        <section className="space-y-3">
          <h3 className="font-semibold text-lg text-foreground">Mi reputación</h3>
          <Card className="p-4 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Star className="w-8 h-8 fill-secondary text-secondary" />
                <span className="text-4xl font-bold text-foreground">4.9</span>
              </div>
              <div className="text-sm text-muted-foreground">
                <p className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  127 calificaciones
                </p>
                <p>98% positivas</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="p-3 bg-muted/50 rounded-lg border-l-4 border-l-secondary">
                <p className="text-sm italic text-foreground">"Excelente servicio, muy profesional"</p>
                <p className="text-xs text-muted-foreground mt-1">— Ana R., hace 2 días</p>
              </div>
            </div>
            <Button 
              variant="link" 
              className="p-0 h-auto mt-3 text-accent"
              onClick={() => handleComingSoon("Ver comentarios")}
            >
              Ver todos los comentarios
            </Button>
          </Card>

          {/* Trust Code Card */}
          <Card className="p-4 shadow-sm border-l-4 border-l-accent">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground">Código de confianza</p>
                  <p className="text-lg font-mono font-bold text-accent">MARIA2024</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleShareCode}
              >
                <Share2 className="w-4 h-4 mr-1" />
                Compartir
              </Button>
            </div>
          </Card>
        </section>

        {/* Section E: Centro de soporte */}
        <section className="space-y-3">
          <h3 className="font-semibold text-lg text-foreground">Centro de soporte</h3>
          <div className="grid grid-cols-2 gap-3">
            <Card
              className="p-4 cursor-pointer hover:bg-muted/50 hover:shadow-sm transition-all duration-200 active:scale-[0.98]"
              onClick={() => handleComingSoon("Preguntas frecuentes")}
            >
              <div className="w-10 h-10 rounded-lg bg-info-light flex items-center justify-center mb-2">
                <HelpCircle className="w-5 h-5 text-info-dark" />
              </div>
              <p className="font-medium text-sm text-foreground">Preguntas frecuentes</p>
            </Card>
            <Card
              className="p-4 cursor-pointer hover:bg-muted/50 hover:shadow-sm transition-all duration-200 active:scale-[0.98]"
              onClick={() => handleComingSoon("Chat de soporte")}
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <MessageCircle className="w-5 h-5 text-primary" />
              </div>
              <p className="font-medium text-sm text-foreground">Chat de soporte</p>
            </Card>
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t py-2 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto grid grid-cols-4 gap-1">
          <Button 
            variant="ghost" 
            className="flex-col h-auto py-2 text-primary" 
            onClick={() => navigate("/resi/dashboard")}
          >
            <Home className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Inicio</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex-col h-auto py-2 text-muted-foreground hover:text-foreground" 
            onClick={() => navigate("/resi/visit/1")}
          >
            <Calendar className="w-5 h-5 mb-1" />
            <span className="text-xs">Agenda</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex-col h-auto py-2 text-muted-foreground hover:text-foreground" 
            onClick={() => navigate("/resi/wallet")}
          >
            <Wallet className="w-5 h-5 mb-1" />
            <span className="text-xs">Dinero</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex-col h-auto py-2 text-muted-foreground hover:text-foreground" 
            onClick={() => navigate("/resi/basic-info")}
          >
            <User className="w-5 h-5 mb-1" />
            <span className="text-xs">Perfil</span>
          </Button>
        </div>
      </nav>
    </div>
  );
};

export default ResiDashboard;

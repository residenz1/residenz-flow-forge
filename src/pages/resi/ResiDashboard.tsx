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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const ResiDashboard = () => {
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-card border-b p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>MG</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold">¡Hola, María!</h2>
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
        {/* Section A: Mi jornada hoy */}
        <section className="space-y-3">
          <h3 className="font-semibold text-lg">Mi jornada hoy</h3>
          <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <div className="flex items-center justify-between mb-4">
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                Próximo servicio
              </Badge>
              <span className="text-sm font-semibold">{nextVisit.time}</span>
            </div>

            <h3 className="font-sora text-xl font-semibold mb-2">
              {nextVisit.building}
            </h3>

            <div className="space-y-2 mb-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{nextVisit.address}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{nextVisit.duration} de trabajo</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="w-4 h-4" />
                <span>{nextVisit.client}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground">Ganarás</div>
                <div className="text-2xl font-bold">S/ {nextVisit.amount}</div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => toast.info("Abriendo mapa...")}
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Iniciar ruta
                </Button>
                <Button
                  onClick={() => navigate(`/resi/visit/${nextVisit.id}`)}
                >
                  Marcar llegada
                </Button>
              </div>
            </div>
          </Card>
        </section>

        {/* Section B: Ganancias */}
        <section className="space-y-3">
          <h3 className="font-semibold text-lg">Ganancias</h3>
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-4">
              <div className="text-xs text-muted-foreground mb-1">Hoy</div>
              <div className="text-2xl font-bold text-primary">S/ 55</div>
            </Card>
            <Card className="p-4">
              <div className="text-xs text-muted-foreground mb-1">Este mes</div>
              <div className="text-2xl font-bold">S/ 850</div>
            </Card>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Card
              className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => navigate("/resi/wallet")}
            >
              <div className="flex items-center gap-3">
                <Wallet className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">Retirar dinero</p>
                  <p className="text-xs text-muted-foreground">S/ 150 disponible</p>
                </div>
              </div>
            </Card>
            <Card
              className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => navigate("/resi/wallet")}
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">Historial</p>
                  <p className="text-xs text-muted-foreground">Ver pagos</p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Section C: Estado de cuenta */}
        <section className="space-y-3">
          <h3 className="font-semibold text-lg">Estado de cuenta</h3>
          <Card className="divide-y">
            <div
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => navigate("/resi/kyc-document")}
            >
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">Verificación de identidad</p>
                  <p className="text-xs text-muted-foreground">Documento y selfie</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-warning/10 text-warning">
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
                <CreditCard className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">Método de pago</p>
                  <p className="text-xs text-muted-foreground">Cuenta bancaria</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-success/10 text-success">
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
          <h3 className="font-semibold text-lg">Mi reputación</h3>
          <Card className="p-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Star className="w-6 h-6 fill-primary text-primary" />
                <span className="text-3xl font-bold">4.9</span>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>127 calificaciones</p>
                <p>98% positivas</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm italic">"Excelente servicio, muy profesional"</p>
                <p className="text-xs text-muted-foreground mt-1">— Ana R., hace 2 días</p>
              </div>
            </div>
            <Button variant="link" className="p-0 h-auto mt-2">
              Ver todos los comentarios
            </Button>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">Código de confianza</p>
                  <p className="text-xs text-muted-foreground">MARIA2024</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Compartir</Button>
            </div>
          </Card>
        </section>

        {/* Section E: Centro de soporte */}
        <section className="space-y-3">
          <h3 className="font-semibold text-lg">Centro de soporte</h3>
          <div className="grid grid-cols-2 gap-3">
            <Card
              className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => toast.info("Abriendo preguntas frecuentes...")}
            >
              <HelpCircle className="w-6 h-6 text-primary mb-2" />
              <p className="font-medium text-sm">Preguntas frecuentes</p>
            </Card>
            <Card
              className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => toast.info("Abriendo chat de soporte...")}
            >
              <MessageCircle className="w-6 h-6 text-primary mb-2" />
              <p className="font-medium text-sm">Chat de soporte</p>
            </Card>
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t p-2">
        <div className="max-w-7xl mx-auto grid grid-cols-4 gap-1">
          <Button variant="ghost" className="flex-col h-auto py-2" onClick={() => navigate("/resi/dashboard")}>
            <Home className="w-5 h-5 mb-1 text-primary" />
            <span className="text-xs">Inicio</span>
          </Button>
          <Button variant="ghost" className="flex-col h-auto py-2">
            <Calendar className="w-5 h-5 mb-1" />
            <span className="text-xs">Agenda</span>
          </Button>
          <Button variant="ghost" className="flex-col h-auto py-2" onClick={() => navigate("/resi/wallet")}>
            <Wallet className="w-5 h-5 mb-1" />
            <span className="text-xs">Dinero</span>
          </Button>
          <Button variant="ghost" className="flex-col h-auto py-2">
            <User className="w-5 h-5 mb-1" />
            <span className="text-xs">Perfil</span>
          </Button>
        </div>
      </nav>
    </div>
  );
};

export default ResiDashboard;

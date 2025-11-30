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
  TrendingUp,
  Wallet,
  Home,
  Calendar,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const ResiDashboard = () => {
  const navigate = useNavigate();

  const todayVisits = [
    {
      id: 1,
      time: "10:00 AM",
      duration: "4 horas",
      client: "Ana Rodríguez",
      building: "Torre Miraflores 305",
      address: "Av. Larco 1234, Miraflores",
      type: "Mantenimiento",
      amount: 30,
    },
    {
      id: 2,
      time: "3:00 PM",
      duration: "3 horas",
      client: "Carlos Mendoza",
      building: "Residencial San Isidro 802",
      address: "Jr. Las Palmeras 567, San Isidro",
      type: "Real Life",
      amount: 25,
    },
  ];

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
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">2</div>
            <div className="text-xs text-muted-foreground">Visitas hoy</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold">S/ 55</div>
            <div className="text-xs text-muted-foreground">Por ganar</div>
          </Card>
          <Card className="p-4 text-center flex flex-col items-center justify-center">
            <div className="flex items-center gap-1">
              <span className="text-2xl font-bold">4.9</span>
              <Star className="w-4 h-4 fill-primary text-primary" />
            </div>
            <div className="text-xs text-muted-foreground">Rating</div>
          </Card>
        </div>

        {/* Next Visit - Prominent */}
        {todayVisits.length > 0 && (
          <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <div className="flex items-center justify-between mb-4">
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                Próxima visita
              </Badge>
              <span className="text-sm font-semibold">{todayVisits[0].time}</span>
            </div>

            <h3 className="font-sora text-xl font-semibold mb-2">
              {todayVisits[0].building}
            </h3>

            <div className="space-y-2 mb-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{todayVisits[0].address}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{todayVisits[0].duration} de trabajo</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="w-4 h-4" />
                <span>{todayVisits[0].client}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground">Ganarás</div>
                <div className="text-2xl font-bold">S/ {todayVisits[0].amount}</div>
              </div>
              <Button
                size="lg"
                className="px-8"
                onClick={() => navigate(`/resi/visit/${todayVisits[0].id}`)}
              >
                Llegué – Iniciar
              </Button>
            </div>
          </Card>
        )}

        {/* Other Visits Today */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground">Más visitas hoy</h3>
          {todayVisits.slice(1).map((visit) => (
            <Card
              key={visit.id}
              className="p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/resi/visit/${visit.id}`)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">{visit.time}</span>
                <Badge variant="outline">{visit.type}</Badge>
              </div>
              <p className="font-medium mb-1">{visit.building}</p>
              <p className="text-sm text-muted-foreground">{visit.address}</p>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Card
            className="p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => navigate("/resi/wallet")}
          >
            <Wallet className="w-6 h-6 mx-auto mb-2 text-primary" />
            <p className="text-sm font-medium">Mi Monedero</p>
            <p className="text-xs text-muted-foreground">S/ 150 disponible</p>
          </Card>
          <Card
            className="p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => toast.info("Próximamente")}
          >
            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-primary" />
            <p className="text-sm font-medium">Mis Estadísticas</p>
            <p className="text-xs text-muted-foreground">Ver desempeño</p>
          </Card>
        </div>
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

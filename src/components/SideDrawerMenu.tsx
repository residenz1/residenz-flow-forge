import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  User,
  Calendar,
  CreditCard,
  TrendingUp,
  HelpCircle,
  LogOut,
  Home,
  History,
  ClipboardList,
  Wallet,
  ChevronRight,
} from "lucide-react";

interface SideDrawerMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userType: "client" | "resi";
  userName: string;
  userInitials: string;
}

interface MenuItem {
  icon: React.ElementType;
  label: string;
  description?: string;
  path?: string;
  action?: () => void;
}

const SideDrawerMenu = ({ 
  open, 
  onOpenChange, 
  userType, 
  userName, 
  userInitials 
}: SideDrawerMenuProps) => {
  const navigate = useNavigate();

  const handleNavigation = (path?: string, action?: () => void) => {
    if (action) {
      action();
    } else if (path) {
      navigate(path);
    }
    onOpenChange(false);
  };

  const handleLogout = () => {
    toast.success("Sesión cerrada correctamente");
    navigate("/");
  };

  const handleComingSoon = () => {
    toast.info("Esta función estará disponible pronto. Gracias por tu paciencia.");
  };

  const clientMenuItems: MenuItem[] = [
    {
      icon: Home,
      label: "Mi Hogar",
      description: "Gestiona tu dirección y preferencias",
      action: handleComingSoon,
    },
    {
      icon: ClipboardList,
      label: "Mis Servicios",
      description: "Ver servicios activos",
      path: "/client/visit/1",
    },
    {
      icon: History,
      label: "Historial de Limpiezas",
      description: "Revisa tus servicios anteriores",
      path: "/client/visit/1",
    },
    {
      icon: CreditCard,
      label: "Métodos de Pago",
      description: "Gestiona tus formas de pago",
      action: handleComingSoon,
    },
    {
      icon: HelpCircle,
      label: "Soporte",
      description: "¿Necesitas ayuda?",
      path: "/client/support",
    },
  ];

  const resiMenuItems: MenuItem[] = [
    {
      icon: User,
      label: "Mi Perfil",
      description: "Edita tu información personal",
      path: "/resi/basic-info",
    },
    {
      icon: Calendar,
      label: "Mi Agenda",
      description: "Ve tus próximos servicios",
      path: "/resi/visit/1",
    },
    {
      icon: Wallet,
      label: "Mis Pagos",
      description: "Historial y retiros",
      path: "/resi/wallet",
    },
    {
      icon: TrendingUp,
      label: "Mi Progreso / Mi Nivel",
      description: "Revisa tu desempeño",
      action: handleComingSoon,
    },
    {
      icon: HelpCircle,
      label: "Soporte",
      description: "Centro de ayuda",
      action: handleComingSoon,
    },
  ];

  const menuItems = userType === "client" ? clientMenuItems : resiMenuItems;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
        <SheetHeader className="p-6 pb-4 bg-gradient-to-br from-primary/10 to-primary/5">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 border-2 border-primary/20">
              <AvatarFallback className="text-lg bg-primary/20 text-primary">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="text-left">
              <SheetTitle className="text-lg">{userName}</SheetTitle>
              <p className="text-sm text-muted-foreground">
                {userType === "client" ? "Cliente" : "Resi"}
              </p>
            </div>
          </div>
        </SheetHeader>

        <div className="py-4">
          <nav className="space-y-1">
            {menuItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start h-auto py-3 px-6 rounded-none hover:bg-muted/50"
                onClick={() => handleNavigation(item.path, item.action)}
              >
                <div className="flex items-center gap-4 w-full">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-sm">{item.label}</p>
                    {item.description && (
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </Button>
            ))}
          </nav>

          <Separator className="my-4" />

          <Button
            variant="ghost"
            className="w-full justify-start h-auto py-3 px-6 rounded-none text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <div className="flex items-center gap-4 w-full">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                <LogOut className="w-5 h-5" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-sm">Cerrar Sesión</p>
              </div>
            </div>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SideDrawerMenu;

import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Calendar, Wallet, User, Zap, LucideIcon } from "lucide-react";

interface NavItem {
  icon: LucideIcon;
  label: string;
  path: string;
  highlight?: boolean;
}

interface BottomNavProps {
  type: "client" | "resi";
}

export const BottomNav = ({ type }: BottomNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const clientItems: NavItem[] = [
    { icon: Home, label: "Inicio", path: "/client/dashboard" },
    { icon: Zap, label: "Flash", path: "/client/flash", highlight: true },
    { icon: Calendar, label: "Agenda", path: "/client/schedule" },
    { icon: User, label: "Perfil", path: "/client/profile" },
  ];

  const resiItems: NavItem[] = [
    { icon: Home, label: "Inicio", path: "/resi/dashboard" },
    { icon: Calendar, label: "Agenda", path: "/resi/schedule" },
    { icon: Wallet, label: "Dinero", path: "/resi/wallet" },
    { icon: User, label: "Perfil", path: "/resi/profile" },
  ];

  const items = type === "client" ? clientItems : resiItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t p-2 pb-safe z-50">
      <div className="max-w-7xl mx-auto grid grid-cols-4 gap-1">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          if (item.highlight) {
            return (
              <Button
                key={item.path}
                variant="ghost"
                className="flex-col h-auto py-2 relative"
                onClick={() => navigate(item.path)}
              >
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center -mt-4 shadow-lg">
                  <Icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xs mt-1 text-primary font-medium">{item.label}</span>
              </Button>
            );
          }

          return (
            <Button
              key={item.path}
              variant="ghost"
              className="flex-col h-auto py-2"
              onClick={() => navigate(item.path)}
            >
              <Icon className={`w-5 h-5 mb-1 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
              <span className={`text-xs ${isActive ? "text-primary font-medium" : "text-muted-foreground"}`}>
                {item.label}
              </span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
};

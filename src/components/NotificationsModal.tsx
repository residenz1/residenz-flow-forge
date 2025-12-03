import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { 
  X, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Star, 
  CreditCard,
  MapPin,
  User,
  Zap
} from "lucide-react";

interface Notification {
  id: string;
  icon: "check" | "alert" | "clock" | "star" | "payment" | "location" | "user" | "flash";
  title: string;
  description: string;
  time: string;
  link?: string;
  read: boolean;
}

interface NotificationsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userType: "client" | "resi";
}

const clientNotifications: Notification[] = [
  {
    id: "1",
    icon: "check",
    title: "Servicio completado",
    description: "Tu limpieza del lunes fue completada con éxito",
    time: "Hace 2 horas",
    link: "/client/visit/1",
    read: false,
  },
  {
    id: "2",
    icon: "user",
    title: "Resi asignada",
    description: "María García será tu Resi para el próximo servicio",
    time: "Hace 1 día",
    link: "/client/visit/1",
    read: false,
  },
  {
    id: "3",
    icon: "payment",
    title: "Pago procesado",
    description: "Tu pago de S/ 120 fue procesado correctamente",
    time: "Hace 3 días",
    read: true,
  },
  {
    id: "4",
    icon: "clock",
    title: "Recordatorio",
    description: "Tu próxima limpieza es en 2 días",
    time: "Hace 1 semana",
    link: "/client/visit/1",
    read: true,
  },
];

const resiNotifications: Notification[] = [
  {
    id: "1",
    icon: "flash",
    title: "Nuevo servicio disponible",
    description: "Hay un servicio rápido cerca de ti",
    time: "Hace 5 min",
    link: "/resi/visit/1",
    read: false,
  },
  {
    id: "2",
    icon: "payment",
    title: "Pago recibido",
    description: "Se depositaron S/ 55 a tu cuenta",
    time: "Hace 1 hora",
    link: "/resi/wallet",
    read: false,
  },
  {
    id: "3",
    icon: "star",
    title: "Nueva calificación",
    description: "Ana R. te dio 5 estrellas",
    time: "Hace 2 días",
    read: true,
  },
  {
    id: "4",
    icon: "location",
    title: "Servicio asignado",
    description: "Tienes un nuevo servicio para mañana",
    time: "Hace 3 días",
    link: "/resi/visit/1",
    read: true,
  },
];

const iconMap = {
  check: CheckCircle,
  alert: AlertCircle,
  clock: Clock,
  star: Star,
  payment: CreditCard,
  location: MapPin,
  user: User,
  flash: Zap,
};

const NotificationsModal = ({ open, onOpenChange, userType }: NotificationsModalProps) => {
  const navigate = useNavigate();
  const notifications = userType === "client" ? clientNotifications : resiNotifications;

  const handleNotificationClick = (notification: Notification) => {
    if (notification.link) {
      navigate(notification.link);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[80vh] p-0 gap-0">
        <DialogHeader className="p-4 pb-2 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">Notificaciones</DialogTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => onOpenChange(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh]">
          <div className="divide-y">
            {notifications.map((notification) => {
              const IconComponent = iconMap[notification.icon];
              return (
                <div
                  key={notification.id}
                  className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                    !notification.read ? "bg-primary/5" : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      !notification.read ? "bg-primary/20" : "bg-muted"
                    }`}>
                      <IconComponent className={`w-5 h-5 ${
                        !notification.read ? "text-primary" : "text-muted-foreground"
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm ${!notification.read ? "font-semibold" : "font-medium"}`}>
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {notification.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
        
        <div className="p-3 border-t">
          <Button variant="ghost" className="w-full text-sm text-primary">
            Marcar todas como leídas
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationsModal;

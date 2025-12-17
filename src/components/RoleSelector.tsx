import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Home, Zap, ChevronRight, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RoleSelectorProps {
  onSelectRole: (role: "resi" | "client") => void;
}

export const RoleSelector = ({ onSelectRole }: RoleSelectorProps) => {
  const navigate = useNavigate();

  return (
    <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
      {/* Card: Quiero trabajar */}
      <Card 
        className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group border-2 border-transparent hover:border-primary/20" 
        onClick={() => onSelectRole("resi")}
      >
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
            <Sparkles className="w-7 h-7 text-primary" />
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="font-sora text-xl font-semibold text-foreground">Quiero trabajar</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Gana dinero con tu talento. Pagos instantáneos, sin complicaciones.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-primary" />
                <span>Pagos el mismo día</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-primary" />
                <span>Elige tus horarios</span>
              </div>
            </div>
            <Button size="lg" className="w-full mt-4">
              Ser Resi
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Card: Necesito limpieza */}
      <Card 
        className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group border-2 border-transparent hover:border-primary/20"
        onClick={() => navigate("/client/flash-select")}
      >
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
            <Home className="w-7 h-7 text-primary" />
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="font-sora text-xl font-semibold text-foreground">Necesito limpieza</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Servicio rápido y confiable. Tu Resi llega en minutos.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-primary" />
                <span>Llegada en 10 minutos</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-primary" />
                <span>Housekeepers verificadas</span>
              </div>
            </div>
            <Button 
              size="lg" 
              className="w-full mt-4"
            >
              <Zap className="w-4 h-4 mr-2" />
              Servicio rápido en 10 min
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

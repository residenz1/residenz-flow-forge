import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Home, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RoleSelectorProps {
  onSelectRole: (role: "resi" | "client") => void;
}

export const RoleSelector = ({ onSelectRole }: RoleSelectorProps) => {
  const navigate = useNavigate();

  return (
    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 cursor-pointer group" onClick={() => onSelectRole("resi")}>
        <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <Sparkles className="w-8 h-8 text-primary" />
        </div>
        <h3 className="font-sora text-2xl mb-3">Quiero trabajar</h3>
        <p className="text-muted-foreground mb-6">
          Gana dinero con tu talento. Pagos instantáneos, sin complicaciones.
        </p>
        <Button size="lg" className="w-full">
          Ser Resi
        </Button>
      </Card>

      <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 cursor-pointer group">
        <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <Home className="w-8 h-8 text-primary" />
        </div>
        <h3 className="font-sora text-2xl mb-3">Necesito limpieza</h3>
        <p className="text-muted-foreground mb-6">
          Planes mensuales simples. Misma Resi de confianza siempre.
        </p>
        <div className="space-y-3">
          <Button 
            size="lg" 
            className="w-full"
            onClick={() => navigate("/client/flash-select")}
          >
            <Zap className="w-4 h-4 mr-2" />
            Limpieza rápida (10 minutos)
          </Button>
          <Button 
            size="lg" 
            className="w-full" 
            variant="outline"
            onClick={() => onSelectRole("client")}
          >
            Contratar servicio
          </Button>
        </div>
      </Card>
    </div>
  );
};

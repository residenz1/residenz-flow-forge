import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Calendar, Sparkles, Clock, Star, Shield } from "lucide-react";

const Onboarding = () => {
  const navigate = useNavigate();
  const [showRoleSelect, setShowRoleSelect] = useState(false);

  if (!showRoleSelect) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <main className="flex-1 p-6 flex flex-col justify-center max-w-md mx-auto w-full">
          <div className="text-center space-y-4 mb-8">
            <h1 className="font-sora text-3xl font-bold">
              ¿Qué necesitas hoy?
            </h1>
            <p className="text-muted-foreground">
              Tu hogar quedará impecable como suite de hotel
            </p>
          </div>

          {/* Flash Service - Primary CTA */}
          <Card 
            className="p-6 mb-4 cursor-pointer border-2 border-primary bg-gradient-to-br from-primary/5 to-primary/10 hover:shadow-lg transition-all"
            onClick={() => navigate("/client/flash")}
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center flex-shrink-0">
                <Zap className="w-7 h-7 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-sora text-xl font-semibold mb-1">
                  Limpieza en 10 minutos
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Una Resi verificada llegará a tu hogar ahora
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> 10 min
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3" /> 4.9★
                  </span>
                  <span className="flex items-center gap-1">
                    <Shield className="w-3 h-3" /> Verificada
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Secondary Options */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <Card 
              className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => navigate("/client/register")}
            >
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <h4 className="font-semibold text-sm mb-1">Limpieza única</h4>
              <p className="text-xs text-muted-foreground">Agenda para cuando quieras</p>
            </Card>

            <Card 
              className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => navigate("/client/register")}
            >
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mb-3">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <h4 className="font-semibold text-sm mb-1">Planes mensuales</h4>
              <p className="text-xs text-muted-foreground">Ahorra hasta 30%</p>
            </Card>
          </div>

          {/* Work with us */}
          <div className="text-center">
            <Button
              variant="link"
              className="text-muted-foreground"
              onClick={() => setShowRoleSelect(true)}
            >
              ¿Quieres trabajar como Resi?
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // Role selection for Resi
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 p-6 flex flex-col justify-center max-w-md mx-auto w-full">
        <div className="text-center space-y-4 mb-8">
          <h1 className="font-sora text-3xl font-bold">
            Trabaja como Resi
          </h1>
          <p className="text-muted-foreground">
            Gana dinero al instante haciendo lo que amas
          </p>
        </div>

        <Card className="p-6 mb-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Pagos al instante</p>
                <p className="text-sm text-muted-foreground">Cobra en D+0</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Tu horario</p>
                <p className="text-sm text-muted-foreground">Trabaja cuando quieras</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Star className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Crece como Master Resi</p>
                <p className="text-sm text-muted-foreground">Más visitas, más ingresos</p>
              </div>
            </div>
          </div>
        </Card>

        <Button
          size="lg"
          className="w-full mb-3"
          onClick={() => navigate("/resi/register")}
        >
          Comenzar como Resi
        </Button>

        <Button
          variant="ghost"
          onClick={() => setShowRoleSelect(false)}
        >
          Volver
        </Button>
      </main>
    </div>
  );
};

export default Onboarding;

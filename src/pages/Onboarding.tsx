import { useState } from "react";
import { RoleSelector } from "@/components/RoleSelector";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Onboarding = () => {
  const navigate = useNavigate();
  const [showIntro, setShowIntro] = useState(true);

  const handleRoleSelect = (role: "resi" | "client") => {
    if (role === "resi") {
      navigate("/resi/register");
    } else {
      navigate("/client/register");
    }
  };

  if (showIntro) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h1 className="font-sora text-4xl font-bold">
                Bienvenido a Residenz
              </h1>
              <p className="text-xl text-muted-foreground">
                Una nueva forma de conectar talento con hogares
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 text-center">
                <div className="text-4xl mb-3">💰</div>
                <h3 className="font-semibold mb-2">Gana más</h3>
                <p className="text-sm text-muted-foreground">
                  Pagos justos y transparentes, directo a tu cuenta
                </p>
              </Card>

              <Card className="p-6 text-center">
                <div className="text-4xl mb-3">⚡</div>
                <h3 className="font-semibold mb-2">Cobros al instante</h3>
                <p className="text-sm text-muted-foreground">
                  Retira tu dinero el mismo día que trabajas
                </p>
              </Card>

              <Card className="p-6 text-center">
                <div className="text-4xl mb-3">🤝</div>
                <h3 className="font-semibold mb-2">Confianza, no policía</h3>
                <p className="text-sm text-muted-foreground">
                  Sistema basado en reputación y compromiso mutuo
                </p>
              </Card>
            </div>

            <Button
              size="lg"
              className="w-full"
              onClick={() => setShowIntro(false)}
            >
              Continuar
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="w-full max-w-4xl space-y-8">
          <div className="text-center space-y-2">
            <h2 className="font-sora text-3xl font-bold">¿Qué te trae aquí?</h2>
            <p className="text-muted-foreground text-lg">
              Elige tu perfil para continuar
            </p>
          </div>
          <RoleSelector onSelectRole={handleRoleSelect} />
        </div>
      </div>
    </div>
  );
};

export default Onboarding;

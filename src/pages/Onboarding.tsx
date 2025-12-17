import { useState } from "react";
import { RoleSelector } from "@/components/RoleSelector";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Check } from "lucide-react";
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
          <div className="max-w-lg mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-3">
              <h1 className="font-sora text-[30px] font-bold text-foreground">
                Bienvenido a Residenz
              </h1>
              <p className="text-base text-muted-foreground">
                Una nueva forma de conectar talento con hogares
              </p>
            </div>

            {/* Benefits Cards */}
            <div className="space-y-3">
              <Card className="p-4 flex items-start gap-4 border-l-4 border-l-primary">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">💰</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">Gana más</h3>
                  <p className="text-sm text-muted-foreground">
                    Pagos justos y transparentes, directo a tu cuenta
                  </p>
                </div>
                <Check className="w-5 h-5 text-primary flex-shrink-0" />
              </Card>

              <Card className="p-4 flex items-start gap-4 border-l-4 border-l-secondary">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">⚡</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">Cobros al instante</h3>
                  <p className="text-sm text-muted-foreground">
                    Retira tu dinero el mismo día que trabajas
                  </p>
                </div>
                <Check className="w-5 h-5 text-primary flex-shrink-0" />
              </Card>

              <Card className="p-4 flex items-start gap-4 border-l-4 border-l-accent">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🤝</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">Confianza, no policía</h3>
                  <p className="text-sm text-muted-foreground">
                    Sistema basado en reputación y compromiso mutuo
                  </p>
                </div>
                <Check className="w-5 h-5 text-primary flex-shrink-0" />
              </Card>
            </div>

            {/* CTA */}
            <Button
              size="lg"
              className="w-full h-12"
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
      {/* Navbar */}
      <header className="bg-card border-b px-4 py-3">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <button 
            className="text-sm text-muted-foreground hover:text-foreground"
            onClick={() => setShowIntro(true)}
          >
            ← Atrás
          </button>
          <span className="text-xs text-muted-foreground">1 / 2</span>
        </div>
      </header>

      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="w-full max-w-4xl space-y-8">
          <div className="text-center space-y-2">
            <h2 className="font-sora text-2xl font-semibold text-foreground">
              ¿Qué te trae aquí?
            </h2>
            <p className="text-muted-foreground">
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

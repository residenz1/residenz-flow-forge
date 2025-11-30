import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

const Splash = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-background flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl mx-auto text-center space-y-8 animate-fade-in">
        {/* Logo/Brand */}
        <div className="space-y-4">
          <div className="w-20 h-20 mx-auto bg-primary rounded-3xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="font-sora text-5xl md:text-6xl font-bold tracking-tight">
            Residenz
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-medium">
            Tu talento, tu dinero, tu tiempo
          </p>
        </div>

        {/* Value Props */}
        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto py-8">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary">D+0</div>
            <div className="text-sm text-muted-foreground">Pagos al instante</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary">100%</div>
            <div className="text-sm text-muted-foreground">Confianza mutua</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary">0</div>
            <div className="text-sm text-muted-foreground">Burocracia</div>
          </div>
        </div>

        {/* CTAs */}
        <div className="space-y-4">
          <Button
            size="lg"
            className="w-full max-w-sm text-lg h-14"
            onClick={() => navigate("/onboarding")}
          >
            Comenzar
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="w-full max-w-sm"
            onClick={() => navigate("/login")}
          >
            Ya tengo cuenta
          </Button>
        </div>

        {/* Footer */}
        <p className="text-sm text-muted-foreground pt-8">
          Al continuar, aceptas nuestros Términos y Condiciones
        </p>
      </div>
    </div>
  );
};

export default Splash;

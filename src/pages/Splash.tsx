import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sparkles, Clock, Zap, Shield } from "lucide-react";

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
            Hotel Living en 10 minutos
          </p>
        </div>

        {/* Value Props - Hotel style */}
        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto py-6">
          <div className="space-y-2 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <div className="text-sm font-medium">10 min</div>
            <div className="text-xs text-muted-foreground">Tu Resi llega</div>
          </div>
          <div className="space-y-2 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div className="text-sm font-medium">100%</div>
            <div className="text-xs text-muted-foreground">Verificadas</div>
          </div>
          <div className="space-y-2 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <div className="text-sm font-medium">D+0</div>
            <div className="text-xs text-muted-foreground">Pagos instant</div>
          </div>
        </div>

        {/* CTAs */}
        <div className="space-y-3 max-w-sm mx-auto">
          <Button
            size="lg"
            className="w-full text-lg h-14 shadow-lg"
            onClick={() => navigate("/onboarding")}
          >
            Comenzar
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="w-full"
            onClick={() => navigate("/login")}
          >
            Ya tengo cuenta
          </Button>
        </div>

        {/* Footer - Less legal */}
        <p className="text-xs text-muted-foreground pt-4">
          Tu hogar, impecable como suite de hotel
        </p>
      </div>
    </div>
  );
};

export default Splash;

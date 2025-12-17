import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Check, Building2 } from "lucide-react";

const Splash = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="max-w-md mx-auto text-center space-y-6 animate-fade-in">
        {/* Logo */}
        <div className="space-y-6 mb-4">
          <div className="w-[120px] h-[120px] mx-auto bg-primary rounded-3xl flex items-center justify-center shadow-lg">
            <Building2 className="w-16 h-16 text-primary-foreground" />
          </div>
        </div>

        {/* Headline */}
        <div className="space-y-3">
          <h1 className="font-sora text-[30px] font-bold text-foreground">
            Bienvenido a Casa
          </h1>
          <p className="text-base text-muted-foreground">
            Experimenta el estándar hotelero en tu propio apartamento.
          </p>
        </div>

        {/* Value Props Card */}
        <div className="bg-card rounded-lg border border-border p-4 shadow-sm space-y-3 text-left">
          <div className="flex items-center gap-3">
            <Check className="w-5 h-5 text-primary flex-shrink-0" />
            <span className="text-sm text-foreground">Limpieza en 10 minutos</span>
          </div>
          <div className="flex items-center gap-3">
            <Check className="w-5 h-5 text-primary flex-shrink-0" />
            <span className="text-sm text-foreground">Housekeeper verificada</span>
          </div>
          <div className="flex items-center gap-3">
            <Check className="w-5 h-5 text-primary flex-shrink-0" />
            <span className="text-sm text-foreground">Pago automático & seguro</span>
          </div>
        </div>

        {/* CTAs */}
        <div className="space-y-3 pt-4">
          <Button
            size="lg"
            className="w-full h-12 text-base font-medium"
            onClick={() => navigate("/onboarding")}
          >
            <span className="flex flex-col items-center">
              <span>Comenzar</span>
            </span>
          </Button>
          <p className="text-xs text-muted-foreground/80">(Sin compromisos)</p>
          
          <Button
            variant="link"
            className="w-full text-accent hover:text-accent/80"
            onClick={() => navigate("/login")}
          >
            ¿Ya tienes cuenta? Iniciar sesión
          </Button>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            <button className="hover:underline">Términos</button>
            {" · "}
            <button className="hover:underline">Privacidad</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Splash;

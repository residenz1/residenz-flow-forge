import { useState } from "react";
import { OnboardingLayout } from "@/components/OnboardingLayout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Camera } from "lucide-react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const ResiKYCSelfie = () => {
  const navigate = useNavigate();
  const [captured, setCaptured] = useState(false);

  const handleCapture = () => {
    // Simulate capture with small delay
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% success rate
      if (success) {
        toast.success("Verificación exitosa");
        setCaptured(true);
      } else {
        toast.error("No pudimos verificar. Intenta de nuevo con mejor luz");
      }
    }, 1500);
  };

  const handleContinue = () => {
    navigate("/resi/bank-account");
  };

  return (
    <OnboardingLayout
      title="Verifiquemos que eres tú"
      subtitle="Solo toma un momento"
      currentStep={5}
      totalSteps={8}
      onBack={() => navigate("/resi/kyc-document")}
    >
      <div className="space-y-6">
        <Card className="p-8 bg-muted/30 relative overflow-hidden">
          {!captured ? (
            <div className="text-center space-y-4">
              {/* Face guide oval */}
              <div className="relative w-48 h-64 mx-auto">
                <div className="absolute inset-0 border-4 border-primary/30 rounded-[50%] border-dashed" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Camera className="w-16 h-16 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="font-medium">Centra tu rostro en el óvalo</p>
                <p className="text-sm text-muted-foreground">
                  Asegúrate de tener buena luz y no usar lentes
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4 py-8">
              <div className="w-24 h-24 mx-auto bg-success/10 rounded-full flex items-center justify-center">
                <div className="text-5xl">✓</div>
              </div>
              <div className="space-y-1">
                <p className="font-medium text-success">¡Verificación exitosa!</p>
                <p className="text-sm text-muted-foreground">
                  Tu identidad ha sido confirmada
                </p>
              </div>
            </div>
          )}
        </Card>

        {!captured ? (
          <Button size="lg" className="w-full h-14" onClick={handleCapture}>
            <Camera className="w-5 h-5 mr-2" />
            Escanear mi rostro
          </Button>
        ) : (
          <Button size="lg" className="w-full h-14" onClick={handleContinue}>
            Continuar
          </Button>
        )}

        <div className="text-center text-sm text-muted-foreground">
          Solo para verificar tu identidad. <br />
          Tus datos están protegidos.
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default ResiKYCSelfie;

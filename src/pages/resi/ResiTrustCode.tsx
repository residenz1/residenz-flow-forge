import { useState } from "react";
import { OnboardingLayout } from "@/components/OnboardingLayout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { Shield, Clock, Ban, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const ResiTrustCode = () => {
  const navigate = useNavigate();
  const [accepted, setAccepted] = useState(false);

  const handleContinue = () => {
    if (!accepted) {
      toast.error("Debes aceptar el Código de Confianza para continuar");
      return;
    }
    toast.success("¡Bienvenida a Residenz!");
    navigate("/resi/dashboard");
  };

  return (
    <OnboardingLayout
      title="Código de Confianza"
      subtitle="El corazón de nuestra comunidad"
      currentStep={7}
      totalSteps={8}
      onBack={() => navigate("/resi/bank-account")}
    >
      <div className="space-y-6">
        <Card className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold mb-1">Sé puntual</h4>
              <p className="text-sm text-muted-foreground">
                Llega a tiempo y avisa si algo imprevisto sucede
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold mb-1">Usa el sistema honestamente</h4>
              <p className="text-sm text-muted-foreground">
                El sistema de marcadores es para mejorar el servicio, no para abusar
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Ban className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold mb-1">Cero tolerancia al fraude</h4>
              <p className="text-sm text-muted-foreground">
                Suplantación o manipulación resulta en expulsión inmediata
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-muted/50">
          <p className="text-sm text-muted-foreground">
            <strong>¿Por qué no pedimos antecedentes policiales?</strong>
            <br />
            Porque creemos en dar oportunidades justas. El Código de Confianza y tu reputación son lo que importa.
          </p>
        </Card>

        <div className="flex items-start space-x-3 p-4 border rounded-lg">
          <Checkbox
            id="accept"
            checked={accepted}
            onCheckedChange={(checked) => setAccepted(checked as boolean)}
            className="mt-1"
          />
          <label htmlFor="accept" className="text-sm cursor-pointer leading-relaxed">
            Acepto el Código de Confianza y me comprometo a trabajar con honestidad y profesionalismo
          </label>
        </div>

        <Button
          size="lg"
          className="w-full h-14"
          onClick={handleContinue}
          disabled={!accepted}
        >
          <CheckCircle2 className="w-5 h-5 mr-2" />
          Confirmar y comenzar
        </Button>
      </div>
    </OnboardingLayout>
  );
};

export default ResiTrustCode;

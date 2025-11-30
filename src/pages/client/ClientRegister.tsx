import { useState } from "react";
import { OnboardingLayout } from "@/components/OnboardingLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ClientRegister = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 9) {
      toast.error("Número incompleto");
      return;
    }
    toast.success("Código enviado por SMS");
    navigate("/client/otp");
  };

  return (
    <OnboardingLayout
      title="Tu número de teléfono"
      subtitle="Lo usaremos para tu cuenta"
      currentStep={1}
      totalSteps={7}
      onBack={() => navigate("/onboarding")}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="phone">Número de celular</Label>
          <div className="flex gap-2">
            <div className="w-20">
              <Input value="+51" disabled className="text-center" />
            </div>
            <Input
              id="phone"
              type="tel"
              placeholder="999 999 999"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="flex-1"
              maxLength={9}
            />
          </div>
        </div>

        <div className="p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground">
          Al continuar, aceptas nuestros Términos de Servicio y Política de Privacidad.
        </div>

        <Button type="submit" size="lg" className="w-full">
          Enviar código
        </Button>
      </form>
    </OnboardingLayout>
  );
};

export default ClientRegister;

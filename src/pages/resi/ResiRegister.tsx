import { useState } from "react";
import { OnboardingLayout } from "@/components/OnboardingLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ResiRegister = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 9) {
      toast.error("Número incompleto");
      return;
    }
    toast.success("Código enviado por SMS");
    navigate("/resi/otp");
  };

  return (
    <OnboardingLayout
      title="Tu número de teléfono"
      subtitle="Lo usaremos para verificar tu identidad"
      currentStep={1}
      totalSteps={4}
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

        <div className="p-4 bg-primary/5 rounded-lg text-sm text-muted-foreground">
          Empieza a ganar dinero al instante. Completa tu perfil después.
        </div>

        <Button type="submit" size="lg" className="w-full">
          Enviar código
        </Button>
      </form>
    </OnboardingLayout>
  );
};

export default ResiRegister;

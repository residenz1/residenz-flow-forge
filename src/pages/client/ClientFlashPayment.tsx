import { useState } from "react";
import { OnboardingLayout } from "@/components/OnboardingLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Shield, Lock, CheckCircle2, Sparkles } from "lucide-react";
import { toast } from "sonner";

const ClientFlashPayment = () => {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiry: "",
    cvc: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast.loading("Procesando pago...");
    setTimeout(() => {
      toast.dismiss();
      toast.success("¡Pago exitoso!");
      setShowSuccess(true);
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    return value
      .replace(/\s/g, "")
      .match(/.{1,4}/g)
      ?.join(" ") || value;
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          
          <div className="space-y-2">
            <h1 className="font-sora text-2xl font-bold">¡Tu Resi está en camino!</h1>
            <p className="text-muted-foreground">
              Te notificaremos cuando esté en tu puerta.
            </p>
          </div>

          <Card className="p-4 bg-primary/5 border-primary/20">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-sm">Llegada estimada: 10 minutos</span>
            </div>
          </Card>

          <Button
            size="lg"
            className="w-full"
            onClick={() => navigate("/client/dashboard")}
          >
            Ir al panel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <OnboardingLayout
      title="Método de pago"
      subtitle="Pago seguro"
      currentStep={3}
      totalSteps={3}
      onBack={() => navigate("/client/flash-confirm")}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-4 bg-muted/50 flex items-center gap-3">
          <Shield className="w-5 h-5 text-primary" />
          <div className="flex-1 text-sm">
            <p className="font-medium">Pago seguro</p>
            <p className="text-xs text-muted-foreground">
              Tus datos están protegidos con encriptación SSL
            </p>
          </div>
          <Lock className="w-4 h-4 text-muted-foreground" />
        </Card>

        <div className="space-y-2">
          <Label htmlFor="cardNumber">Número de tarjeta</Label>
          <Input
            id="cardNumber"
            placeholder="1234 5678 9012 3456"
            value={formData.cardNumber}
            onChange={(e) => {
              const formatted = formatCardNumber(e.target.value.replace(/\s/g, ""));
              if (formatted.replace(/\s/g, "").length <= 16) {
                setFormData({ ...formData, cardNumber: formatted });
              }
            }}
            maxLength={19}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expiry">Vencimiento</Label>
            <Input
              id="expiry"
              placeholder="MM/AA"
              value={formData.expiry}
              onChange={(e) => {
                const formatted = formatExpiry(e.target.value);
                if (formatted.replace(/\D/g, "").length <= 4) {
                  setFormData({ ...formData, expiry: formatted });
                }
              }}
              maxLength={5}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cvc">CVC</Label>
            <Input
              id="cvc"
              placeholder="123"
              type="password"
              value={formData.cvc}
              onChange={(e) => {
                if (e.target.value.length <= 3) {
                  setFormData({ ...formData, cvc: e.target.value });
                }
              }}
              maxLength={3}
            />
          </div>
        </div>

        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="flex justify-between items-baseline">
            <span className="text-sm">Total a cobrar:</span>
            <span className="font-sora text-2xl font-bold">S/ 25</span>
          </div>
        </Card>

        <Button type="submit" size="lg" className="w-full h-14">
          Confirmar pago de S/ 25
        </Button>
      </form>
    </OnboardingLayout>
  );
};

export default ClientFlashPayment;

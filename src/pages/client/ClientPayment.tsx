import { useState } from "react";
import { OnboardingLayout } from "@/components/OnboardingLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Shield, Lock } from "lucide-react";
import { toast } from "sonner";

const ClientPayment = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiry: "",
    cvc: "",
    saveCard: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate payment processing
    toast.loading("Procesando pago...");
    setTimeout(() => {
      toast.dismiss();
      toast.success("¡Pago exitoso!");
      navigate("/client/confirmation");
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

  return (
    <OnboardingLayout
      title="Método de pago"
      subtitle="Configura tu suscripción"
      currentStep={7}
      totalSteps={7}
      onBack={() => navigate("/client/plan-summary")}
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

        <div className="flex items-center space-x-2">
          <Checkbox
            id="save"
            checked={formData.saveCard}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, saveCard: checked as boolean })
            }
          />
          <Label htmlFor="save" className="font-normal cursor-pointer text-sm">
            Guardar para mi suscripción mensual
          </Label>
        </div>

        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="space-y-1">
            <div className="flex justify-between items-baseline">
              <span className="text-sm">Total a cobrar hoy:</span>
              <span className="font-sora text-2xl font-bold">S/ 120</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Próximo cobro: 15 Dic, 2024
            </p>
          </div>
        </Card>

        <div className="flex gap-2">
          <img src="/placeholder.svg" alt="Visa" className="h-8" />
          <img src="/placeholder.svg" alt="Mastercard" className="h-8" />
          <img src="/placeholder.svg" alt="AmEx" className="h-8" />
        </div>

        <Button type="submit" size="lg" className="w-full h-14">
          Confirmar pago de S/ 120
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Al confirmar, aceptas nuestros términos de servicio y política de cancelación
        </p>
      </form>
    </OnboardingLayout>
  );
};

export default ClientPayment;

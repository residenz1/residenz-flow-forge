import { useState } from "react";
import { OnboardingLayout } from "@/components/OnboardingLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const ResiBankAccount = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bankType: "bank",
    entity: "",
    accountNumber: "",
    alias: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.entity || !formData.accountNumber) {
      toast.error("Completa todos los campos");
      return;
    }
    toast.success("Cuenta registrada");
    navigate("/resi/trust-code");
  };

  const handleSkip = () => {
    toast.info("Puedes configurar tu cuenta más tarde");
    navigate("/resi/trust-code");
  };

  return (
    <OnboardingLayout
      title="Tu cuenta para pagos"
      subtitle="Configura dónde recibirás tu dinero"
      currentStep={6}
      totalSteps={8}
      onBack={() => navigate("/resi/kyc-selfie")}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="flex items-start gap-3">
            <Wallet className="w-5 h-5 text-primary mt-0.5" />
            <div className="space-y-1">
              <p className="font-medium text-sm">Pagos D+0</p>
              <p className="text-sm text-muted-foreground">
                Por una visita estándar ganas S/ 30 y se deposita el mismo día
              </p>
            </div>
          </div>
        </Card>

        <div className="space-y-2">
          <Label>Tipo de cuenta</Label>
          <Select
            value={formData.bankType}
            onValueChange={(value) =>
              setFormData({ ...formData, bankType: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bank">Cuenta bancaria</SelectItem>
              <SelectItem value="yape">Yape</SelectItem>
              <SelectItem value="plin">Plin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.bankType === "bank" ? (
          <div className="space-y-2">
            <Label>Banco</Label>
            <Select
              value={formData.entity}
              onValueChange={(value) =>
                setFormData({ ...formData, entity: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona tu banco" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bcp">BCP</SelectItem>
                <SelectItem value="interbank">Interbank</SelectItem>
                <SelectItem value="bbva">BBVA</SelectItem>
                <SelectItem value="scotiabank">Scotiabank</SelectItem>
                <SelectItem value="bn">Banco de la Nación</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="entity">Nombre completo</Label>
            <Input
              id="entity"
              value={formData.entity}
              onChange={(e) =>
                setFormData({ ...formData, entity: e.target.value })
              }
              placeholder="Como aparece en tu app"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="account">
            {formData.bankType === "bank" ? "CCI / Número de cuenta" : "Número de celular"}
          </Label>
          <Input
            id="account"
            value={formData.accountNumber}
            onChange={(e) =>
              setFormData({ ...formData, accountNumber: e.target.value })
            }
            placeholder={
              formData.bankType === "bank" ? "20 dígitos del CCI" : "999 999 999"
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="alias">Alias (opcional)</Label>
          <Input
            id="alias"
            value={formData.alias}
            onChange={(e) =>
              setFormData({ ...formData, alias: e.target.value })
            }
            placeholder="Ej: Mi cuenta principal"
          />
        </div>

        <div className="space-y-3">
          <Button type="submit" size="lg" className="w-full">
            Guardar cuenta
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={handleSkip}
          >
            Configurar más tarde
          </Button>
        </div>
      </form>
    </OnboardingLayout>
  );
};

export default ResiBankAccount;

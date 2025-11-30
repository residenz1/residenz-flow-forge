import { useState } from "react";
import { OnboardingLayout } from "@/components/OnboardingLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import { toast } from "sonner";

const ClientHomeInfo = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    address: "",
    type: "apartment",
    floor: "",
    reference: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.address) {
      toast.error("Ingresa tu dirección");
      return;
    }
    navigate("/client/select-size");
  };

  return (
    <OnboardingLayout
      title="Tu hogar"
      subtitle="Cuéntanos dónde vives"
      currentStep={3}
      totalSteps={7}
      onBack={() => navigate("/client/otp")}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="address">Dirección completa *</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              id="address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              placeholder="Av. Larco 1234, Miraflores"
              className="pl-10"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Incluye número, calle y distrito
          </p>
        </div>

        <div className="space-y-2">
          <Label>Tipo de vivienda</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData({ ...formData, type: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apartment">Departamento</SelectItem>
              <SelectItem value="house">Casa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.type === "apartment" && (
          <div className="space-y-2">
            <Label htmlFor="floor">Piso / Torre</Label>
            <Input
              id="floor"
              value={formData.floor}
              onChange={(e) =>
                setFormData({ ...formData, floor: e.target.value })
              }
              placeholder="Ej: Piso 5, Torre B"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="reference">Referencia (opcional)</Label>
          <Input
            id="reference"
            value={formData.reference}
            onChange={(e) =>
              setFormData({ ...formData, reference: e.target.value })
            }
            placeholder="Ej: Edificio blanco al lado del parque"
          />
        </div>

        <Button type="submit" size="lg" className="w-full">
          Continuar
        </Button>
      </form>
    </OnboardingLayout>
  );
};

export default ClientHomeInfo;

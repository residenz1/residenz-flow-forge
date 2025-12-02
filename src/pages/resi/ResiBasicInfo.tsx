import { useState } from "react";
import { OnboardingLayout } from "@/components/OnboardingLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { Camera } from "lucide-react";
import { toast } from "sonner";

const ResiBasicInfo = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    city: "",
    districts: "",
    weekendAvailable: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.city) {
      toast.error("Completa los campos obligatorios");
      return;
    }
    toast.success("Perfil creado");
    navigate("/resi/trust-code");
  };

  return (
    <OnboardingLayout
      title="Tu perfil profesional"
      subtitle="Información básica para asignarte servicios"
      currentStep={3}
      totalSteps={8}
      onBack={() => navigate("/resi/otp")}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Photo */}
        <div className="flex justify-center">
          <div className="relative">
            <Avatar className="w-24 h-24">
              <AvatarFallback className="text-2xl">
                {formData.firstName[0] || "R"}
              </AvatarFallback>
            </Avatar>
            <Button
              type="button"
              size="icon"
              className="absolute bottom-0 right-0 rounded-full w-8 h-8"
              onClick={() => toast.info("Próximamente: Subir foto")}
            >
              <Camera className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Nombre *</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              placeholder="María"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Apellido *</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              placeholder="García"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">Ciudad *</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            placeholder="Lima"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="districts">Distritos donde puedes trabajar</Label>
          <Input
            id="districts"
            value={formData.districts}
            onChange={(e) =>
              setFormData({ ...formData, districts: e.target.value })
            }
            placeholder="Ej: Miraflores, San Isidro, Barranco"
          />
          <p className="text-xs text-muted-foreground">
            Separa con comas los distritos
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="weekend"
            checked={formData.weekendAvailable}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, weekendAvailable: checked as boolean })
            }
          />
          <Label htmlFor="weekend" className="font-normal cursor-pointer">
            Puedo trabajar fines de semana
          </Label>
        </div>

        <Button type="submit" size="lg" className="w-full">
          Continuar
        </Button>
      </form>
    </OnboardingLayout>
  );
};

export default ResiBasicInfo;

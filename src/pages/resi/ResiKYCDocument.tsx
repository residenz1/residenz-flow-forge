import { useState } from "react";
import { OnboardingLayout } from "@/components/OnboardingLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { Camera, Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const ResiKYCDocument = () => {
  const navigate = useNavigate();
  const [docType, setDocType] = useState("dni");
  const [captured, setCaptured] = useState(false);

  const handleCapture = () => {
    toast.success("Documento capturado");
    setCaptured(true);
  };

  const handleContinue = () => {
    if (!captured) {
      toast.error("Primero captura tu documento");
      return;
    }
    navigate("/resi/kyc-selfie");
  };

  return (
    <OnboardingLayout
      title="Verifica tu identidad"
      subtitle="Necesitamos tu documento oficial"
      currentStep={4}
      totalSteps={8}
      onBack={() => navigate("/resi/basic-info")}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Tipo de documento</Label>
          <Select value={docType} onValueChange={setDocType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dni">DNI</SelectItem>
              <SelectItem value="ce">Carnet de Extranjería</SelectItem>
              <SelectItem value="passport">Pasaporte</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card className="p-8 bg-muted/30 border-dashed border-2">
          {!captured ? (
            <div className="text-center space-y-4">
              <div className="w-32 h-32 mx-auto bg-background rounded-2xl flex items-center justify-center border-2 border-dashed">
                <Camera className="w-12 h-12 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="font-medium">Captura tu documento</p>
                <p className="text-sm text-muted-foreground">
                  Asegúrate de que se vea claramente
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-32 h-32 mx-auto bg-success/10 rounded-2xl flex items-center justify-center">
                <div className="text-4xl">✓</div>
              </div>
              <p className="font-medium text-success">Documento capturado</p>
            </div>
          )}
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={handleCapture}
            className="h-14"
          >
            <Camera className="w-5 h-5 mr-2" />
            Tomar foto
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={handleCapture}
            className="h-14"
          >
            <Upload className="w-5 h-5 mr-2" />
            Desde galería
          </Button>
        </div>

        {captured && (
          <Button size="lg" className="w-full" onClick={handleContinue}>
            Continuar
          </Button>
        )}

        <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg text-sm">
          <p className="text-warning-foreground">
            <strong>Importante:</strong> Asegúrate de que la foto esté bien iluminada y sin reflejos.
          </p>
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default ResiKYCDocument;

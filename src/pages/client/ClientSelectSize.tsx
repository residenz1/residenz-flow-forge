import { useState, useRef } from "react";
import { OnboardingLayout } from "@/components/OnboardingLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Check, Camera, ImagePlus } from "lucide-react";
import { cn } from "@/lib/utils";

const ClientSelectSize = () => {
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizes = [
    { 
      id: "studio", 
      label: "Ambiente / Estudio", 
      icon: "🛋️", 
      description: "Ideal si tu hogar es un solo espacio abierto o pequeño." 
    },
    { 
      id: "1bed", 
      label: "1 Habitación", 
      icon: "🛏️", 
      description: "Para hogares con sala + una habitación." 
    },
    { 
      id: "2bed", 
      label: "2 Habitaciones", 
      icon: "🏠", 
      description: "Para hogares con sala + dos habitaciones." 
    },
    { 
      id: "3bed", 
      label: "3 Habitaciones o más", 
      icon: "🏡", 
      description: "Para hogares grandes o con varios cuartos." 
    },
  ];

  const handleContinue = () => {
    if (!selectedSize) return;
    navigate("/client/select-frequency", {
      state: { 
        size: selectedSize,
        hasPhoto: !!photoPreview 
      }
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <OnboardingLayout
      title="¿Qué tamaño tiene tu hogar?"
      subtitle="Esto nos ayuda a planificar mejor"
      currentStep={4}
      totalSteps={7}
      onBack={() => navigate("/client/home-info")}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {sizes.map((size) => (
            <Card
              key={size.id}
              className={cn(
                "p-4 cursor-pointer transition-all duration-200 relative",
                selectedSize === size.id
                  ? "border-primary border-2 bg-primary/5"
                  : "hover:border-primary/50"
              )}
              onClick={() => setSelectedSize(size.id)}
            >
              {selectedSize === size.id && (
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
              <div className="text-center space-y-2">
                <div className="text-3xl mb-2">{size.icon}</div>
                <h4 className="font-semibold text-sm">{size.label}</h4>
                <p className="text-xs text-muted-foreground leading-tight">{size.description}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Optional photo upload */}
        <Card className="p-4 space-y-3">
          <div className="text-center">
            <h4 className="font-medium text-sm">Agrega una foto opcional de tu hogar</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Esto ayuda a asignar mejor a tu RESI.
            </p>
          </div>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {photoPreview ? (
            <div className="relative">
              <img 
                src={photoPreview} 
                alt="Preview del hogar" 
                className="w-full h-32 object-cover rounded-lg"
              />
              <Button
                variant="secondary"
                size="sm"
                className="absolute bottom-2 right-2"
                onClick={triggerFileInput}
              >
                Cambiar foto
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={triggerFileInput}
              >
                <Camera className="w-4 h-4 mr-2" />
                Tomar foto
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={triggerFileInput}
              >
                <ImagePlus className="w-4 h-4 mr-2" />
                Galería
              </Button>
            </div>
          )}
        </Card>

        <div className="p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground">
          💡 <strong>Tip:</strong> Puedes ajustar esto más adelante si es necesario
        </div>

        <Button
          size="lg"
          className="w-full"
          onClick={handleContinue}
          disabled={!selectedSize}
        >
          Continuar
        </Button>
      </div>
    </OnboardingLayout>
  );
};

export default ClientSelectSize;
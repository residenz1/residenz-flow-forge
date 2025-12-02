import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Camera, Image, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useRef } from "react";
import { toast } from "sonner";

const ClientFlashPhoto = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { service } = location.state || {};
  const [photo, setPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTakePhoto = () => {
    // In a real app, this would open the camera
    // For the prototype, we simulate with file input
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('capture', 'environment');
      fileInputRef.current.click();
    }
  };

  const handleChooseFromGallery = () => {
    if (fileInputRef.current) {
      fileInputRef.current.removeAttribute('capture');
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhoto(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleContinue = () => {
    if (!photo) {
      toast.error("Por favor, sube una foto del área a limpiar");
      return;
    }
    navigate("/client/flash-address", { 
      state: { service, photo } 
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3 max-w-7xl mx-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-sora text-xl font-semibold">Foto del área</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="font-sora text-2xl font-bold">Mándanos una foto del área</h2>
          <p className="text-muted-foreground">
            Esto ayuda a tu Resi a prepararse y nos permite estimar el tiempo real de limpieza.
          </p>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {photo ? (
          <Card className="relative overflow-hidden">
            <img 
              src={photo} 
              alt="Área a limpiar" 
              className="w-full h-64 object-cover"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleRemovePhoto}
            >
              <X className="w-4 h-4" />
            </Button>
          </Card>
        ) : (
          <Card className="p-8 border-dashed border-2 flex flex-col items-center justify-center min-h-[200px]">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Camera className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-center">
              Toma o selecciona una foto del área que necesitas limpiar
            </p>
          </Card>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            size="lg"
            className="flex items-center gap-2"
            onClick={handleTakePhoto}
          >
            <Camera className="w-5 h-5" />
            Tomar foto
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="flex items-center gap-2"
            onClick={handleChooseFromGallery}
          >
            <Image className="w-5 h-5" />
            Elegir de galería
          </Button>
        </div>

        <Button 
          className="w-full" 
          size="lg"
          disabled={!photo}
          onClick={handleContinue}
        >
          Continuar
        </Button>

        {!photo && (
          <p className="text-xs text-center text-muted-foreground">
            La foto es obligatoria para continuar
          </p>
        )}
      </main>
    </div>
  );
};

export default ClientFlashPhoto;

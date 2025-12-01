import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { Sparkles, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const ClientVisitUpsell = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const upsellOffer = {
    title: "Limpieza Profunda de Cocina",
    description: "Tu Resi notó que tu cocina podría beneficiarse de una limpieza más profunda. Incluye horno, campana extractora y áreas de difícil acceso.",
    originalPrice: 60,
    discountedPrice: 51,
    discount: 15,
    features: [
      "Limpieza profunda de horno",
      "Campana extractora",
      "Detrás de electrodomésticos",
      "Desengrase completo",
    ],
  };

  const handleAccept = () => {
    toast.success("¡Servicio agregado! Te contactaremos para coordinar.");
    navigate("/client/dashboard");
  };

  const handleSkip = () => {
    navigate("/client/dashboard");
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      <header className="bg-card border-b p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <h2 className="font-sora font-semibold">Oferta Especial</h2>
          <Button variant="ghost" size="icon" onClick={handleSkip}>
            <X className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Hero Section */}
        <div className="text-center pt-4">
          <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
          <h1 className="font-sora text-2xl font-bold mb-2">
            ¡Oferta personalizada para ti!
          </h1>
          <p className="text-muted-foreground">
            Basada en las necesidades de tu hogar
          </p>
        </div>

        {/* Offer Card */}
        <Card className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-sora text-xl font-bold mb-1">
                {upsellOffer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {upsellOffer.description}
              </p>
            </div>
            <Badge variant="secondary" className="bg-primary/20 text-primary">
              -{upsellOffer.discount}%
            </Badge>
          </div>

          <div className="space-y-2 py-2">
            {upsellOffer.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <div className="flex items-baseline gap-3 pt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">S/ {upsellOffer.discountedPrice}</span>
              <span className="text-lg text-muted-foreground line-through">
                S/ {upsellOffer.originalPrice}
              </span>
            </div>
          </div>
        </Card>

        {/* Why This Card */}
        <Card className="p-4 bg-muted/30">
          <div className="space-y-2">
            <p className="text-sm font-semibold">¿Por qué esta oferta?</p>
            <p className="text-sm text-muted-foreground">
              Tu Resi identificó áreas que requieren atención extra durante su última visita. 
              Esta limpieza profunda extenderá la vida útil de tus electrodomésticos y mantendrá 
              tu hogar impecable por más tiempo.
            </p>
          </div>
        </Card>

        {/* Social Proof */}
        <Card className="p-4 bg-primary/5">
          <p className="text-sm text-center">
            <span className="font-semibold">+250 clientes</span> han mejorado sus hogares con este servicio este mes
          </p>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <Button size="lg" className="w-full" onClick={handleAccept}>
            Sí, lo quiero
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={handleSkip}
          >
            Ahora no, gracias
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          Esta oferta es válida por 48 horas
        </p>
      </main>
    </div>
  );
};

export default ClientVisitUpsell;

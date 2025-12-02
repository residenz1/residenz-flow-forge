import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Camera, Sparkles, Bath, UtensilsCrossed, Shirt, Check } from "lucide-react";
import { ResiAvatar } from "@/components/ResiAvatar";
import { toast } from "sonner";

const upsells = [
  { id: "deep-kitchen", icon: UtensilsCrossed, name: "Limpieza profunda cocina", price: 35, originalPrice: 45 },
  { id: "deep-bath", icon: Bath, name: "Limpieza profunda baños", price: 30, originalPrice: 40 },
  { id: "laundry", icon: Shirt, name: "Lavado y planchado", price: 25, originalPrice: 35 },
];

const ClientFlashComplete = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { service, resi } = location.state || {};
  const [rating, setRating] = useState(0);
  const [selectedUpsells, setSelectedUpsells] = useState<string[]>([]);

  const toggleUpsell = (id: string) => {
    setSelectedUpsells(prev => 
      prev.includes(id) 
        ? prev.filter(u => u !== id)
        : [...prev, id]
    );
  };

  const handleComplete = () => {
    if (rating === 0) {
      toast.error("Por favor califica el servicio");
      return;
    }
    toast.success("¡Gracias por tu calificación!");
    navigate("/client/dashboard");
  };

  if (!service || !resi) {
    navigate("/client/flash");
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Success Header */}
      <div className="bg-gradient-to-b from-primary/20 to-background p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-primary mx-auto mb-4 flex items-center justify-center">
          <Check className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="font-sora text-2xl font-bold mb-2">¡Servicio completado!</h1>
        <p className="text-muted-foreground">
          Tu hogar quedó impecable como suite de hotel
        </p>
      </div>

      <main className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Before/After Photos */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Fotos del servicio</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Camera className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Antes</p>
              </div>
            </div>
            <div className="aspect-video bg-primary/10 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Sparkles className="w-6 h-6 text-primary mx-auto mb-1" />
                <p className="text-xs text-primary">Después</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Rate Resi */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Califica a tu Resi</h3>
          <ResiAvatar
            name={resi.name}
            rating={resi.rating}
            visits={resi.visits}
            showBadge={false}
          />
          <div className="flex justify-center gap-2 mt-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="p-1"
              >
                <Star
                  className={`w-8 h-8 transition-colors ${
                    star <= rating
                      ? "fill-primary text-primary"
                      : "text-muted-foreground"
                  }`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-center text-sm text-muted-foreground mt-2">
              {rating === 5 ? "¡Excelente!" : rating >= 4 ? "¡Muy bien!" : rating >= 3 ? "Bien" : "Gracias por tu feedback"}
            </p>
          )}
        </Card>

        {/* Upsells */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">¿Necesitas algo más?</h3>
            <Badge variant="secondary" className="bg-success/20 text-success">
              Descuento 25%
            </Badge>
          </div>
          
          {upsells.map((upsell) => {
            const Icon = upsell.icon;
            const isSelected = selectedUpsells.includes(upsell.id);
            
            return (
              <Card
                key={upsell.id}
                className={`p-4 cursor-pointer transition-all ${
                  isSelected ? "border-2 border-primary bg-primary/5" : ""
                }`}
                onClick={() => toggleUpsell(upsell.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{upsell.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">S/ {upsell.price}</p>
                    <p className="text-xs text-muted-foreground line-through">S/ {upsell.originalPrice}</p>
                  </div>
                  {isSelected && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </main>

      {/* Fixed Bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-card border-t">
        <div className="max-w-7xl mx-auto">
          {selectedUpsells.length > 0 && (
            <div className="flex items-center justify-between mb-3 text-sm">
              <span className="text-muted-foreground">
                {selectedUpsells.length} servicio{selectedUpsells.length > 1 ? "s" : ""} adicional{selectedUpsells.length > 1 ? "es" : ""}
              </span>
              <span className="font-semibold">
                S/ {selectedUpsells.reduce((sum, id) => {
                  const upsell = upsells.find(u => u.id === id);
                  return sum + (upsell?.price || 0);
                }, 0)}
              </span>
            </div>
          )}
          <Button size="lg" className="w-full" onClick={handleComplete}>
            {selectedUpsells.length > 0 ? "Agregar y finalizar" : "Finalizar"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClientFlashComplete;

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { Star, CheckCircle2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const ClientVisitRating = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [sameResi, setSameResi] = useState(true);

  const tags = ["Puntual", "Amable", "Detallista", "Rápida", "Profesional", "Comunicativa"];

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error("Por favor selecciona una calificación");
      return;
    }
    toast.success("¡Gracias por tu calificación!");
    setTimeout(() => {
      navigate(`/client/visit/${id}/upsell`);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      <header className="bg-card border-b p-4 sticky top-0 z-10">
        <div className="flex items-center justify-center max-w-7xl mx-auto">
          <h2 className="font-sora font-semibold">Califica el Servicio</h2>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Success Icon */}
        <div className="text-center pt-4">
          <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <h1 className="font-sora text-2xl font-bold mb-2">¡Trabajo completado!</h1>
          <p className="text-muted-foreground">
            ¿Cómo estuvo el servicio de María?
          </p>
        </div>

        {/* Rating Card */}
        <Card className="p-6">
          <div className="text-center space-y-4">
            <p className="font-semibold">Califica el servicio</p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 ${
                      star <= (hoveredRating || rating)
                        ? "fill-primary text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-muted-foreground">
                {rating === 5 && "¡Excelente!"}
                {rating === 4 && "Muy bueno"}
                {rating === 3 && "Bueno"}
                {rating === 2 && "Regular"}
                {rating === 1 && "Necesita mejorar"}
              </p>
            )}
          </div>
        </Card>

        {/* Tags */}
        {rating >= 4 && (
          <div className="space-y-3">
            <p className="font-semibold text-sm">¿Qué destacas del servicio?</p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer px-4 py-2"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Comment */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">
            Comentario adicional (opcional)
          </label>
          <Textarea
            placeholder="Cuéntanos más sobre tu experiencia..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
          />
        </div>

        {/* Same Resi Preference */}
        {rating >= 4 && (
          <Card className="p-4 bg-primary/5">
            <div className="flex items-center gap-3">
              <Checkbox
                checked={sameResi}
                onCheckedChange={(checked) => setSameResi(checked as boolean)}
              />
              <label className="text-sm font-medium cursor-pointer" onClick={() => setSameResi(!sameResi)}>
                Quiero la misma Resi para mis próximas visitas
              </label>
            </div>
          </Card>
        )}

        {/* Submit Button */}
        <Button
          size="lg"
          className="w-full"
          onClick={handleSubmit}
          disabled={rating === 0}
        >
          Enviar Calificación
        </Button>
      </main>
    </div>
  );
};

export default ClientVisitRating;

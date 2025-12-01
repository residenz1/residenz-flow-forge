import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, MessageSquare, AlertCircle, FileText, DollarSign } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ClientSupportNew = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultType = searchParams.get("type") || "";
  
  const [selectedCategory, setSelectedCategory] = useState(defaultType);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const categories = [
    {
      id: "question",
      label: "Consulta General",
      icon: MessageSquare,
      description: "Preguntas sobre planes, servicios o funciones",
    },
    {
      id: "complaint",
      label: "Problema con Visita",
      icon: AlertCircle,
      description: "Reportar incidencias durante o después del servicio",
    },
    {
      id: "billing",
      label: "Facturación",
      icon: DollarSign,
      description: "Consultas sobre pagos, cargos o reembolsos",
    },
    {
      id: "other",
      label: "Otro",
      icon: FileText,
      description: "Cualquier otra consulta o sugerencia",
    },
  ];

  const handleSubmit = () => {
    if (!selectedCategory) {
      toast.error("Selecciona una categoría");
      return;
    }
    if (!title.trim()) {
      toast.error("Escribe un título");
      return;
    }
    if (!description.trim()) {
      toast.error("Describe tu consulta");
      return;
    }

    toast.success("Consulta enviada. Recibirás una respuesta en 2-4 horas");
    navigate("/client/support");
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      <header className="bg-card border-b p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3 max-w-7xl mx-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate("/client/support")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="font-sora font-semibold flex-1">Nueva Consulta</h2>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Category Selection */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Categoría</Label>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Card
                  key={category.id}
                  className={`p-4 cursor-pointer transition-all ${
                    selectedCategory === category.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "hover:bg-muted/50"
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <Icon className="w-6 h-6 mb-2" />
                  <p className="font-semibold text-sm mb-1">{category.label}</p>
                  <p
                    className={`text-xs ${
                      selectedCategory === category.id
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    }`}
                  >
                    {category.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-base font-semibold">
            Título
          </Label>
          <Input
            id="title"
            placeholder="Ej: No puedo cambiar mi plan"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
          />
          <p className="text-xs text-muted-foreground text-right">
            {title.length}/100
          </p>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-base font-semibold">
            Descripción
          </Label>
          <Textarea
            id="description"
            placeholder="Describe tu consulta con el mayor detalle posible..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            maxLength={500}
          />
          <p className="text-xs text-muted-foreground text-right">
            {description.length}/500
          </p>
        </div>

        {/* Info Card */}
        <Card className="p-4 bg-muted/30">
          <p className="text-sm text-center">
            <span className="font-semibold">Tiempo de respuesta:</span> 2-4 horas
            <br />
            <span className="text-xs text-muted-foreground">
              Lunes a Viernes de 8AM a 8PM
            </span>
          </p>
        </Card>

        {/* CTA */}
        <Button
          className="w-full h-12 text-base"
          onClick={handleSubmit}
          disabled={!selectedCategory || !title.trim() || !description.trim()}
        >
          Enviar Consulta
        </Button>
      </main>
    </div>
  );
};

export default ClientSupportNew;

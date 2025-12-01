import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const ResiVisitFlag = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  const issues = [
    { id: "kitchen", label: "Cocina con grasa acumulada" },
    { id: "bathroom", label: "Baño con sarro" },
    { id: "windows", label: "Ventanas muy sucias" },
    { id: "carpet", label: "Alfombras necesitan limpieza profunda" },
    { id: "walls", label: "Paredes manchadas" },
    { id: "other", label: "Otro (especificar en notas)" },
  ];

  const toggleIssue = (issueId: string) => {
    setSelectedIssues((prev) =>
      prev.includes(issueId)
        ? prev.filter((id) => id !== issueId)
        : [...prev, issueId]
    );
  };

  const handleContinue = () => {
    navigate(`/resi/visit/${id}/checkout`);
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      <header className="bg-card border-b p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3 max-w-7xl mx-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/resi/visit/${id}/mission`)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="font-sora font-semibold flex-1">Limpieza Profunda</h2>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-6">
        <div className="text-center space-y-2 pt-4">
          <h1 className="font-sora text-2xl font-bold">¿Viste algo especial?</h1>
          <p className="text-muted-foreground">
            Ayúdanos a ofrecer servicios adicionales al cliente
          </p>
        </div>

        {/* Info Card */}
        <Card className="p-4 bg-muted/30">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm space-y-1">
              <p className="font-semibold">¿Para qué es esto?</p>
              <p className="text-muted-foreground">
                Si notas áreas que necesitan limpieza más profunda, márcalo aquí. 
                Esto no es una queja, es una oportunidad de servicio extra para el cliente.
              </p>
            </div>
          </div>
        </Card>

        {/* Issues Checklist */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground">
            Selecciona las áreas que necesitan atención extra:
          </h3>
          {issues.map((issue) => (
            <Card
              key={issue.id}
              className="p-4 cursor-pointer transition-all card-hover"
              onClick={() => toggleIssue(issue.id)}
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={selectedIssues.includes(issue.id)}
                  onCheckedChange={() => toggleIssue(issue.id)}
                />
                <span className="font-medium">{issue.label}</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">
            Notas adicionales (opcional)
          </label>
          <Textarea
            placeholder="Describe con más detalle si es necesario..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <Button 
            size="lg" 
            className="w-full"
            onClick={handleContinue}
          >
            {selectedIssues.length > 0 ? "Confirmar y Continuar" : "No, todo bien"}
          </Button>
          {selectedIssues.length > 0 && (
            <Button
              variant="ghost"
              size="lg"
              className="w-full"
              onClick={() => {
                setSelectedIssues([]);
                setNotes("");
              }}
            >
              Limpiar selección
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};

export default ResiVisitFlag;

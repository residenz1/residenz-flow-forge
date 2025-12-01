import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, Clock, DollarSign, Star } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

const ResiVisitCheckout = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [note, setNote] = useState("");
  const [isFinishing, setIsFinishing] = useState(false);

  const visitSummary = {
    building: "Torre Miraflores 305",
    client: "Ana Rodríguez",
    startTime: "10:05 AM",
    endTime: "2:15 PM",
    duration: "4h 10min",
    tasksCompleted: 6,
    totalTasks: 6,
    earnings: 30,
  };

  const handleFinish = () => {
    setIsFinishing(true);
    setTimeout(() => {
      toast.success("¡Visita completada! Tu dinero está en camino.");
      navigate("/resi/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      <header className="bg-card border-b p-4 sticky top-0 z-10">
        <div className="flex items-center justify-center max-w-7xl mx-auto">
          <h2 className="font-sora font-semibold">Finalizar Visita</h2>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Success Icon */}
        <div className="text-center pt-4">
          <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <h1 className="font-sora text-2xl font-bold mb-2">¡Excelente trabajo!</h1>
          <p className="text-muted-foreground">
            Has completado tu visita en {visitSummary.building}
          </p>
        </div>

        {/* Summary Card */}
        <Card className="p-6 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Cliente</span>
              <span className="font-semibold">{visitSummary.client}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Inicio</span>
              <span className="font-semibold">{visitSummary.startTime}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Fin</span>
              <span className="font-semibold">{visitSummary.endTime}</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">Tiempo trabajado</span>
              </div>
              <span className="font-semibold">{visitSummary.duration}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">Tareas completadas</span>
              </div>
              <span className="font-semibold">
                {visitSummary.tasksCompleted} de {visitSummary.totalTasks}
              </span>
            </div>
          </div>
        </Card>

        {/* Earnings Card */}
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">Tu trabajo de hoy genera</p>
            <div className="flex items-center justify-center gap-2">
              <DollarSign className="w-8 h-8 text-primary" />
              <span className="text-4xl font-bold">S/ {visitSummary.earnings}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Se depositará en tu monedero en las próximas horas
            </p>
          </div>
        </Card>

        {/* Rating Reminder */}
        <Card className="p-4 bg-muted/30">
          <div className="flex items-center gap-3">
            <Star className="w-5 h-5 text-primary fill-primary flex-shrink-0" />
            <p className="text-sm">
              <span className="font-semibold">Recuerda:</span> Un buen trabajo ayuda a mantener tu rating alto y recibir más visitas.
            </p>
          </div>
        </Card>

        {/* Optional Note */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">
            Nota para el cliente (opcional)
          </label>
          <Textarea
            placeholder="Ej: Todo quedó impecable. ¡Gracias por la confianza!"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
          />
        </div>

        {/* Finish Button */}
        <Button
          size="lg"
          className="w-full"
          onClick={handleFinish}
          disabled={isFinishing}
        >
          {isFinishing ? "Finalizando..." : "Finalizar Visita"}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Al finalizar, el cliente recibirá una notificación y podrá calificarte
        </p>
      </main>
    </div>
  );
};

export default ResiVisitCheckout;

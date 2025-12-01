import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Clock, Star, CheckCircle2, Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const ResiVisitMission = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [timeLeft, setTimeLeft] = useState(4 * 60 * 60); // 4 hours in seconds

  const [tasks, setTasks] = useState([
    { id: 1, name: "Limpiar cocina completa", status: "completed", priority: false },
    { id: 2, name: "Limpiar baño principal", status: "completed", priority: true },
    { id: 3, name: "Aspirar sala y comedor", status: "in-progress", priority: true },
    { id: 4, name: "Limpiar habitación principal", status: "pending", priority: true },
    { id: 5, name: "Limpiar habitación secundaria", status: "pending", priority: false },
    { id: 6, name: "Limpiar ventanas (Extra)", status: "pending", priority: false },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleTask = (taskId: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: task.status === "completed" ? "pending" : "completed",
            }
          : task
      )
    );
  };

  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const totalCount = tasks.length;
  const criticalTasks = tasks.filter((t) => t.priority);
  const criticalCompleted = criticalTasks.filter((t) => t.status === "completed").length;

  return (
    <div className="min-h-screen bg-background pb-6">
      <header className="bg-card border-b p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3 max-w-7xl mx-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/resi/visit/${id}`)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h2 className="font-sora font-semibold">Misión en Progreso</h2>
            <p className="text-xs text-muted-foreground">
              Torre Miraflores 305
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-4">
        {/* Timer Card */}
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
              <Clock className="w-4 h-4" />
              <span>Tiempo Restante</span>
            </div>
            <div className="text-5xl font-bold font-mono tracking-tight">
              {formatTime(timeLeft)}
            </div>
            <div className="text-sm text-muted-foreground">
              {completedCount} de {totalCount} tareas completadas
            </div>
          </div>
        </Card>

        {/* Warning Banner if time running low */}
        {timeLeft < 30 * 60 && criticalCompleted < criticalTasks.length && (
          <Card className="p-4 bg-warning/10 border-warning/20">
            <p className="text-sm text-center">
              ⚠️ Prioriza las tareas marcadas con <Star className="w-4 h-4 inline fill-primary text-primary" />
            </p>
          </Card>
        )}

        {/* Tasks List */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground">Lista de Tareas</h3>
          {tasks.map((task) => (
            <Card
              key={task.id}
              className={cn(
                "p-4 cursor-pointer transition-all card-hover",
                task.status === "completed" && "bg-muted/30"
              )}
              onClick={() => toggleTask(task.id)}
            >
              <div className="flex items-start gap-3">
                <div className="pt-0.5">
                  {task.status === "completed" ? (
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  ) : (
                    <Circle className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={cn(
                        "font-medium",
                        task.status === "completed" && "line-through text-muted-foreground"
                      )}
                    >
                      {task.name}
                    </span>
                    {task.priority && (
                      <Star className="w-4 h-4 fill-primary text-primary" />
                    )}
                  </div>
                  {task.status === "in-progress" && (
                    <Badge variant="secondary" className="text-xs">
                      En Progreso
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Complete Button */}
        <Button
          size="lg"
          className="w-full"
          onClick={() => navigate(`/resi/visit/${id}/flag`)}
        >
          Marcar como Completado
        </Button>
      </main>
    </div>
  );
};

export default ResiVisitMission;

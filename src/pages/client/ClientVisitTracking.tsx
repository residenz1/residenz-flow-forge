import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState, useEffect } from "react";

const ClientVisitTracking = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [status, setStatus] = useState<"on-way" | "working" | "completed">("working");

  // Simulate status progression
  useEffect(() => {
    if (status === "working") {
      const timer = setTimeout(() => {
        setStatus("completed");
        setTimeout(() => {
          navigate(`/client/visit/${id}/rating`);
        }, 2000);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status, navigate, id]);

  const resi = {
    name: "María González",
    initials: "MG",
  };

  const steps = [
    { id: "on-way", label: "En camino", time: "10:00 AM", completed: true },
    { id: "working", label: "Trabajando", time: "10:05 AM", completed: status !== "on-way" },
    { id: "completed", label: "Finalizado", time: status === "completed" ? "2:15 PM" : "—", completed: status === "completed" },
  ];

  return (
    <div className="min-h-screen bg-background pb-6">
      <header className="bg-card border-b p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3 max-w-7xl mx-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/client/visit/${id}`)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="font-sora font-semibold flex-1">Seguimiento en Vivo</h2>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Status Card */}
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <div className="text-center space-y-4">
            <Avatar className="w-20 h-20 mx-auto">
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
                {resi.initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Tu Resi</p>
              <p className="font-sora text-xl font-bold">{resi.name}</p>
            </div>
            <Badge className="text-sm px-4 py-1">
              {status === "on-way" && "🚶‍♀️ En camino"}
              {status === "working" && "✨ Trabajando en tu hogar"}
              {status === "completed" && "✅ Finalizado"}
            </Badge>
          </div>
        </Card>

        {/* Progress Steps */}
        <Card className="p-6">
          <h3 className="font-semibold mb-6">Estado del Servicio</h3>
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={step.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step.completed
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step.completed ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-current" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-0.5 h-12 my-1 ${
                        step.completed ? "bg-primary" : "bg-border"
                      }`}
                    />
                  )}
                </div>
                <div className="flex-1 pb-6">
                  <p className={`font-semibold mb-1 ${!step.completed && "text-muted-foreground"}`}>
                    {step.label}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{step.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Map Placeholder */}
        {status !== "completed" && (
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Ubicación</h3>
            <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
              <MapPin className="w-12 h-12 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground text-center mt-3">
              {status === "on-way" && "Tu Resi está de camino a tu hogar"}
              {status === "working" && "Tu Resi está trabajando en tu hogar"}
            </p>
          </Card>
        )}

        {/* Info Card */}
        <Card className="p-4 bg-muted/30">
          <p className="text-sm text-center text-muted-foreground">
            {status === "working" && "Recibirás una notificación cuando el trabajo esté completo"}
            {status === "completed" && "Redirigiendo a calificación..."}
          </p>
        </Card>
      </main>
    </div>
  );
};

export default ClientVisitTracking;

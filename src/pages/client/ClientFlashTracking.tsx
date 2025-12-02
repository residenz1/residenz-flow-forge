import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, MessageCircle, Clock, Check, Sparkles } from "lucide-react";
import { ResiAvatar } from "@/components/ResiAvatar";
import { Progress } from "@/components/ui/progress";

const trackingSteps = [
  { id: 1, label: "Resi en camino", time: "10:00 AM" },
  { id: 2, label: "Resi llegó", time: "10:08 AM" },
  { id: 3, label: "Servicio en progreso", time: "10:12 AM" },
  { id: 4, label: "Servicio completado", time: null },
];

const ClientFlashTracking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { service, resi } = location.state || {};
  const [currentStep, setCurrentStep] = useState(1);
  const [eta, setEta] = useState(8);

  // Simulate tracking progress
  useEffect(() => {
    const interval = setInterval(() => {
      setEta((prev) => Math.max(0, prev - 1));
    }, 3000);

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => Math.min(4, prev + 1));
    }, 8000);

    return () => {
      clearInterval(interval);
      clearInterval(stepInterval);
    };
  }, []);

  useEffect(() => {
    if (currentStep === 4) {
      setTimeout(() => {
        navigate("/client/flash/complete", { state: { service, resi } });
      }, 2000);
    }
  }, [currentStep, navigate, service, resi]);

  if (!service || !resi) {
    navigate("/client/flash");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Map placeholder */}
      <div className="h-48 bg-gradient-to-b from-primary/20 to-primary/5 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Mapa de tracking</p>
          </div>
        </div>
        
        {/* ETA Overlay */}
        {currentStep < 3 && (
          <div className="absolute bottom-4 left-4 right-4">
            <Card className="p-3 bg-card/95 backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">
                    {currentStep === 1 ? "Tu Resi llega en" : "Llegó hace"}
                  </p>
                  <p className="text-xl font-bold text-primary">
                    {currentStep === 1 ? `${eta} min` : "2 min"}
                  </p>
                </div>
                <Badge variant="secondary" className="bg-primary/20 text-primary">
                  {currentStep === 1 ? "En camino" : "Llegó"}
                </Badge>
              </div>
            </Card>
          </div>
        )}
      </div>

      <main className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Resi Info */}
        <Card className="p-4">
          <ResiAvatar
            name={resi.name}
            rating={resi.rating}
            visits={resi.visits}
            showBadge={false}
          />
          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm" className="flex-1">
              <Phone className="w-4 h-4 mr-2" />
              Llamar
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <MessageCircle className="w-4 h-4 mr-2" />
              Mensaje
            </Button>
          </div>
        </Card>

        {/* Service Progress */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Progreso del servicio</h3>
            <Badge variant="outline">{service.name}</Badge>
          </div>
          
          <Progress value={(currentStep / 4) * 100} className="mb-4" />
          
          <div className="space-y-4">
            {trackingSteps.map((step, index) => {
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;
              
              return (
                <div key={step.id} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isCompleted 
                      ? "bg-primary text-primary-foreground" 
                      : isCurrent
                        ? "bg-primary/20 text-primary border-2 border-primary"
                        : "bg-muted text-muted-foreground"
                  }`}>
                    {isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <span className="text-xs font-medium">{step.id}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${isCurrent ? "font-medium" : ""}`}>
                      {step.label}
                    </p>
                    {step.time && isCompleted && (
                      <p className="text-xs text-muted-foreground">{step.time}</p>
                    )}
                  </div>
                  {isCurrent && (
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Service Details */}
        <Card className="p-4 bg-muted/30">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm font-medium">{service.name}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>Duración: {service.duration}</span>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default ClientFlashTracking;

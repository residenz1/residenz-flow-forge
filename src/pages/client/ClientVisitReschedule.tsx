import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const ClientVisitReschedule = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const availableDates = [
    { date: "2024-11-18", day: "Lun", dayNum: "18" },
    { date: "2024-11-19", day: "Mar", dayNum: "19" },
    { date: "2024-11-20", day: "Mié", dayNum: "20" },
    { date: "2024-11-21", day: "Jue", dayNum: "21" },
    { date: "2024-11-22", day: "Vie", dayNum: "22" },
  ];

  const availableTimes = [
    "09:00 AM", "10:00 AM", "11:00 AM", 
    "02:00 PM", "03:00 PM", "04:00 PM"
  ];

  const handleReschedule = () => {
    if (!selectedDate || !selectedTime) {
      toast.error("Selecciona fecha y hora");
      return;
    }
    toast.success("Visita reprogramada exitosamente");
    navigate("/client/dashboard");
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      <header className="bg-card border-b p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3 max-w-7xl mx-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="font-sora font-semibold flex-1">Reprogramar Visita</h2>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-6">
        <Card className="p-4 bg-muted/30">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-primary" />
            <p className="font-semibold">Visita Original</p>
          </div>
          <p className="text-sm text-muted-foreground">
            Jueves 14 Nov 2024 - 10:00 AM
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Sin costo adicional por reprogramar con más de 24hrs de anticipación
          </p>
        </Card>

        {/* Date Selection */}
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            Selecciona nueva fecha
          </h3>
          <div className="grid grid-cols-5 gap-2">
            {availableDates.map((item) => (
              <Card
                key={item.date}
                className={`p-3 text-center cursor-pointer transition-all ${
                  selectedDate === item.date
                    ? "bg-primary text-primary-foreground border-primary"
                    : "hover:bg-muted/50"
                }`}
                onClick={() => setSelectedDate(item.date)}
              >
                <p className="text-xs mb-1">{item.day}</p>
                <p className="text-lg font-bold">{item.dayNum}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Time Selection */}
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Selecciona horario
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {availableTimes.map((time) => (
              <Card
                key={time}
                className={`p-3 text-center cursor-pointer transition-all ${
                  selectedTime === time
                    ? "bg-primary text-primary-foreground border-primary"
                    : "hover:bg-muted/50"
                }`}
                onClick={() => setSelectedTime(time)}
              >
                <p className="text-sm font-medium">{time}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Policy Card */}
        <Card className="p-4 bg-warning/10 border-warning/20">
          <p className="text-sm">
            <span className="font-semibold">Política de reprogramación:</span>
            <br />
            • Sin costo con más de 24hrs de anticipación
            <br />
            • S/ 10 de cargo con menos de 24hrs
            <br />• No es posible reprogramar el mismo día de la visita
          </p>
        </Card>

        {/* CTA */}
        <Button
          className="w-full h-12 text-base"
          onClick={handleReschedule}
          disabled={!selectedDate || !selectedTime}
        >
          Confirmar Nueva Fecha
        </Button>
      </main>
    </div>
  );
};

export default ClientVisitReschedule;

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Send, Paperclip } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

const ClientSupportDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [message, setMessage] = useState("");

  const incident = {
    id: 1,
    title: "Resi llegó tarde",
    description: "La Resi llegó 20 minutos tarde a mi visita del 10 de Nov",
    status: "resolved",
    date: "10 Nov 2024",
    messages: [
      {
        id: 1,
        from: "client",
        text: "La Resi llegó 20 minutos tarde a mi visita del 10 de Nov",
        time: "10:00 AM",
      },
      {
        id: 2,
        from: "support",
        text: "Lamentamos mucho lo sucedido. Hemos revisado el caso y vemos que hubo tráfico inesperado. La Resi te notificó con 10 minutos de anticipación. Como compensación, te hemos agregado un 10% de descuento en tu próxima visita.",
        time: "11:30 AM",
      },
      {
        id: 3,
        from: "client",
        text: "Muchas gracias por la atención. Entiendo que estas cosas pasan.",
        time: "2:45 PM",
      },
    ],
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    toast.success("Mensaje enviado");
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-card border-b p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3 max-w-7xl mx-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate("/client/support")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <h2 className="font-sora font-semibold truncate">{incident.title}</h2>
            <p className="text-xs text-muted-foreground">{incident.date}</p>
          </div>
          <Badge variant="secondary" className="bg-success/20 text-success">
            Resuelta
          </Badge>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 space-y-4 overflow-y-auto pb-24">
        {/* Messages */}
        {incident.messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.from === "client" ? "justify-end" : "justify-start"}`}
          >
            <Card
              className={`p-4 max-w-[80%] ${
                msg.from === "client"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              <p className="text-sm mb-1">{msg.text}</p>
              <p
                className={`text-xs ${
                  msg.from === "client"
                    ? "text-primary-foreground/70"
                    : "text-muted-foreground"
                }`}
              >
                {msg.time}
              </p>
            </Card>
          </div>
        ))}
      </main>

      {/* Message Input */}
      <div className="border-t bg-card p-4 sticky bottom-0">
        <div className="max-w-7xl mx-auto flex gap-2">
          <Button variant="outline" size="icon">
            <Paperclip className="w-5 h-5" />
          </Button>
          <Textarea
            placeholder="Escribe tu mensaje..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={1}
            className="flex-1 resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button size="icon" onClick={handleSendMessage}>
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClientSupportDetail;

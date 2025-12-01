import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, MessageSquare, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ClientSupport = () => {
  const navigate = useNavigate();

  const incidents = [
    {
      id: 1,
      title: "Resi llegó tarde",
      description: "La Resi llegó 20 minutos tarde a mi visita del 10 de Nov",
      status: "resolved",
      date: "10 Nov 2024",
      type: "complaint",
    },
    {
      id: 2,
      title: "Consulta sobre plan",
      description: "¿Puedo cambiar mi plan de quincenal a semanal?",
      status: "in-review",
      date: "12 Nov 2024",
      type: "question",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "resolved":
        return <Badge variant="secondary" className="bg-success/20 text-success">Resuelta</Badge>;
      case "in-review":
        return <Badge variant="secondary" className="bg-warning/20 text-warning">En Revisión</Badge>;
      case "open":
        return <Badge variant="secondary">Abierta</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      case "in-review":
        return <Clock className="w-5 h-5 text-warning" />;
      case "open":
        return <AlertCircle className="w-5 h-5 text-primary" />;
      default:
        return <MessageSquare className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      <header className="bg-card border-b p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3 max-w-7xl mx-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate("/client/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="font-sora font-semibold flex-1">Soporte</h2>
          <Button size="sm" onClick={() => navigate("/client/support/new")}>
            <Plus className="w-4 h-4 mr-1" />
            Nueva
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-4">
        <div className="text-center py-4">
          <h1 className="font-sora text-2xl font-bold mb-2">¿En qué podemos ayudarte?</h1>
          <p className="text-muted-foreground">
            Revisa tus consultas o crea una nueva
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Card
            className="p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => navigate("/client/support/new")}
          >
            <MessageSquare className="w-6 h-6 mx-auto mb-2 text-primary" />
            <p className="text-sm font-medium">Nueva Consulta</p>
          </Card>
          <Card
            className="p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => navigate("/client/support/new?type=complaint")}
          >
            <AlertCircle className="w-6 h-6 mx-auto mb-2 text-primary" />
            <p className="text-sm font-medium">Reportar Problema</p>
          </Card>
        </div>

        {/* Incidents List */}
        <div className="space-y-3 pt-2">
          <h3 className="font-semibold text-sm text-muted-foreground">Mis Consultas</h3>
          {incidents.length > 0 ? (
            incidents.map((incident) => (
              <Card
                key={incident.id}
                className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/client/support/${incident.id}`)}
              >
                <div className="flex gap-3">
                  <div className="pt-0.5">{getStatusIcon(incident.status)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="font-semibold">{incident.title}</p>
                      {getStatusBadge(incident.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {incident.description}
                    </p>
                    <p className="text-xs text-muted-foreground">{incident.date}</p>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-8">
              <div className="text-center space-y-2">
                <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No tienes consultas activas
                </p>
              </div>
            </Card>
          )}
        </div>

        {/* Help Card */}
        <Card className="p-4 bg-muted/30">
          <p className="text-sm text-center">
            <span className="font-semibold">Tiempo de respuesta promedio:</span> 2-4 horas
          </p>
        </Card>
      </main>
    </div>
  );
};

export default ClientSupport;

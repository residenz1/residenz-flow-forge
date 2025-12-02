import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  Star, 
  Shield, 
  CreditCard, 
  Camera, 
  FileText, 
  Clock,
  Check,
  ChevronRight,
  TrendingUp
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";

// Account verification steps
const verificationSteps = [
  { id: "phone", label: "Teléfono verificado", completed: true, icon: Check },
  { id: "photo", label: "Foto de perfil", completed: true, icon: Camera },
  { id: "document", label: "Documento de identidad", completed: false, icon: FileText },
  { id: "selfie", label: "Selfie de verificación", completed: false, icon: Camera },
  { id: "bank", label: "Cuenta bancaria", completed: false, icon: CreditCard },
  { id: "availability", label: "Disponibilidad", completed: false, icon: Clock },
];

const ResiProfile = () => {
  const navigate = useNavigate();
  const completedSteps = verificationSteps.filter(s => s.completed).length;
  const progressPercent = (completedSteps / verificationSteps.length) * 100;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-card border-b p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3 max-w-7xl mx-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate("/resi/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-sora text-lg font-semibold">Mi Perfil</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Profile Header */}
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="text-xl bg-primary/10 text-primary">MG</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="font-sora text-xl font-semibold">María García</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="w-4 h-4 fill-primary text-primary" />
                <span>4.9 · 127 visitas</span>
              </div>
            </div>
            <Badge variant="secondary" className="bg-primary/20 text-primary">
              Resi Pro
            </Badge>
          </div>
          
          {/* Progress to Master Resi */}
          <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progreso a Master Resi</span>
              <span className="text-sm text-primary font-semibold">73/100 puntos</span>
            </div>
            <Progress value={73} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              27 puntos más para desbloquear beneficios premium
            </p>
          </div>
        </Card>

        {/* Account Status / Verification */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Estado de cuenta</h3>
            </div>
            <Badge variant={progressPercent === 100 ? "default" : "secondary"}>
              {completedSteps}/{verificationSteps.length} completos
            </Badge>
          </div>

          <Progress value={progressPercent} className="mb-4" />

          <div className="space-y-3">
            {verificationSteps.map((step) => {
              const Icon = step.icon;
              
              return (
                <div
                  key={step.id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    step.completed ? "bg-success/10" : "bg-muted/50 hover:bg-muted"
                  }`}
                  onClick={() => {
                    if (!step.completed) {
                      if (step.id === "document") navigate("/resi/kyc-document");
                      if (step.id === "selfie") navigate("/resi/kyc-selfie");
                      if (step.id === "bank") navigate("/resi/bank-account");
                    }
                  }}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.completed 
                      ? "bg-success text-success-foreground" 
                      : "bg-muted-foreground/20 text-muted-foreground"
                  }`}>
                    {step.completed ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                  <span className={`flex-1 text-sm ${step.completed ? "text-success" : ""}`}>
                    {step.label}
                  </span>
                  {!step.completed && (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              );
            })}
          </div>

          {progressPercent < 100 && (
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Completa tu perfil para recibir más misiones y mejores pagos
            </p>
          )}
        </Card>

        {/* Stats */}
        <Card className="p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Mis estadísticas
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">127</p>
              <p className="text-xs text-muted-foreground">Visitas totales</p>
            </div>
            <div>
              <p className="text-2xl font-bold">S/ 2,450</p>
              <p className="text-xs text-muted-foreground">Este mes</p>
            </div>
            <div>
              <p className="text-2xl font-bold">98%</p>
              <p className="text-xs text-muted-foreground">Satisfacción</p>
            </div>
          </div>
        </Card>
      </main>

      <BottomNav type="resi" />
    </div>
  );
};

export default ResiProfile;

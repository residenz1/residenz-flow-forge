import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, CreditCard, Wallet, Check } from "lucide-react";
import { toast } from "sonner";

interface PaymentMethod {
  id: string;
  name: string;
  icon: string | null;
  IconComponent?: typeof CreditCard;
}

const paymentMethods: PaymentMethod[] = [
  { id: "yape", name: "Yape", icon: "💜" },
  { id: "plin", name: "Plin", icon: "💚" },
  { id: "card", name: "Tarjeta", icon: null, IconComponent: CreditCard },
  { id: "cash", name: "Efectivo", icon: null, IconComponent: Wallet },
];

const ClientFlashPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { service, resi } = location.state || {};
  const [selectedMethod, setSelectedMethod] = useState<string | null>("yape");
  const [processing, setProcessing] = useState(false);

  const handlePay = async () => {
    setProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success("¡Pago exitoso!");
    navigate("/client/flash/tracking", { 
      state: { service, resi } 
    });
  };

  if (!service) {
    navigate("/client/flash");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3 max-w-7xl mx-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-sora text-lg font-semibold">Pago</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-6 pb-32">
        {/* Summary */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Resumen</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{service.name}</span>
              <span>S/ {service.price}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Servicio Flash</span>
              <span>S/ 0</span>
            </div>
            <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
              <span>Total</span>
              <span className="text-primary">S/ {service.price}</span>
            </div>
          </div>
        </Card>

        {/* Payment Methods */}
        <div className="space-y-3">
          <h3 className="font-semibold">Método de pago</h3>
          <div className="grid grid-cols-2 gap-3">
{paymentMethods.map((method) => {
              const isSelected = selectedMethod === method.id;
              const IconComp = method.IconComponent;
              
              return (
                <Card
                  key={method.id}
                  className={`p-4 cursor-pointer transition-all flex items-center gap-3 ${
                    isSelected 
                      ? "border-2 border-primary bg-primary/5" 
                      : "hover:bg-muted/50"
                  }`}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  {IconComp ? (
                    <IconComp className="w-6 h-6 text-primary" />
                  ) : (
                    <span className="text-2xl">{method.icon}</span>
                  )}
                  <span className="font-medium">{method.name}</span>
                  {isSelected && (
                    <Check className="w-4 h-4 text-primary ml-auto" />
                  )}
                </Card>
              );
            })}
          </div>
        </div>

        {/* Card details if selected */}
        {selectedMethod === "card" && (
          <Card className="p-4 space-y-4">
            <Input placeholder="Número de tarjeta" />
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="MM/AA" />
              <Input placeholder="CVV" />
            </div>
            <Input placeholder="Nombre en la tarjeta" />
          </Card>
        )}
      </main>

      {/* Fixed Bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-card border-t">
        <div className="max-w-7xl mx-auto">
          <Button 
            size="lg" 
            className="w-full" 
            onClick={handlePay}
            disabled={!selectedMethod || processing}
          >
            {processing ? "Procesando..." : `Pagar S/ ${service.price}`}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClientFlashPayment;

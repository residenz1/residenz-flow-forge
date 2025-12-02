import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CreditCard, Lock } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

const ClientFlashPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { service, photo, address } = location.state || {};
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      navigate("/client/flash-tracking", { 
        state: { service, photo, address } 
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3 max-w-7xl mx-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-sora text-xl font-semibold">Pago</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Amount */}
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">Total a pagar</p>
          <p className="font-sora text-4xl font-bold">S/ {service?.price || 25}</p>
        </div>

        {/* Card Form */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="w-5 h-5 text-primary" />
            <span className="font-medium">Tarjeta de crédito o débito</span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardNumber">Número de tarjeta</Label>
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              defaultValue="4242 4242 4242 4242"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Vencimiento</Label>
              <Input
                id="expiry"
                placeholder="MM/AA"
                defaultValue="12/25"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                placeholder="123"
                type="password"
                maxLength={4}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nombre en la tarjeta</Label>
            <Input
              id="name"
              placeholder="Como aparece en la tarjeta"
              defaultValue="Ana Rodriguez"
            />
          </div>
        </Card>

        {/* Security note */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Lock className="w-4 h-4" />
          <span>Pago seguro con encriptación SSL</span>
        </div>

        <Button 
          className="w-full" 
          size="lg"
          onClick={handlePayment}
          disabled={isProcessing}
        >
          {isProcessing ? "Procesando..." : `Pagar S/ ${service?.price || 25}`}
        </Button>
      </main>
    </div>
  );
};

export default ClientFlashPayment;

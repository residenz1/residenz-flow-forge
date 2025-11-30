import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowUpRight, ArrowDownRight, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ResiWallet = () => {
  const navigate = useNavigate();

  const transactions = [
    { id: 1, type: "income", description: "Visita - Torre Miraflores 305", amount: 30, date: "Hoy, 2:30 PM" },
    { id: 2, type: "withdrawal", description: "Retiro a BCP", amount: -100, date: "Ayer, 9:15 AM" },
    { id: 3, type: "income", description: "Visita - Residencial San Isidro 802", amount: 25, date: "15 Nov, 5:00 PM" },
    { id: 4, type: "income", description: "Visita - Casa Los Olivos", amount: 35, date: "14 Nov, 11:00 AM" },
    { id: 5, type: "income", description: "Visita - Dpto. Barranco 201", amount: 30, date: "13 Nov, 3:30 PM" },
  ];

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <header className="bg-card border-b p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3 max-w-7xl mx-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate("/resi/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-sora text-xl font-semibold">Mi Monedero</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Balance Card - Neobanco style */}
        <Card className="p-8 bg-gradient-to-br from-primary to-primary-hover text-primary-foreground">
          <div className="space-y-4">
            <div>
              <p className="text-sm opacity-90 mb-1">Saldo disponible</p>
              <p className="font-sora text-5xl font-bold">S/ 150.00</p>
            </div>
            
            <div className="pt-4 border-t border-primary-foreground/20">
              <p className="text-sm opacity-90">Saldo bloqueado: S/ 0.00</p>
            </div>
          </div>
        </Card>

        {/* Action Button */}
        <Button size="lg" className="w-full h-14 text-lg" onClick={() => toast.info("Próximamente: Retiro de dinero")}>
          <ArrowUpRight className="w-5 h-5 mr-2" />
          Retirar dinero
        </Button>

        {/* Account Info */}
        <Card className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm">BCP - Cuenta principal</p>
            <p className="text-xs text-muted-foreground">****5678</p>
          </div>
          <Button variant="ghost" size="sm">Editar</Button>
        </Card>

        {/* Transactions */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground">Movimientos Recientes</h3>
          <div className="space-y-2">
            {transactions.map((transaction) => (
              <Card key={transaction.id} className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === "income" ? "bg-success/10" : "bg-muted"
                  }`}>
                    {transaction.type === "income" ? (
                      <ArrowDownRight className="w-5 h-5 text-success" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{transaction.description}</p>
                    <p className="text-xs text-muted-foreground">{transaction.date}</p>
                  </div>
                  <div className={`font-semibold ${
                    transaction.type === "income" ? "text-success" : "text-foreground"
                  }`}>
                    {transaction.amount > 0 ? "+" : ""}S/ {Math.abs(transaction.amount)}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResiWallet;

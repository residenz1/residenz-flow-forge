import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, MapPin, Check } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

const savedAddresses = [
  { id: 1, name: "Casa", address: "Av. Larco 1234, Piso 5", district: "Miraflores", reference: "Edificio Torre Azul, portero 24h" },
  { id: 2, name: "Oficina", address: "Jr. Las Begonias 456", district: "San Isidro", reference: "Frente al parque" },
];

const ClientFlashAddress = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { service, photo } = location.state || {};
  
  const [selectedAddressId, setSelectedAddressId] = useState<number>(1);
  const [address, setAddress] = useState(savedAddresses[0].address);
  const [reference, setReference] = useState(savedAddresses[0].reference);
  const [district, setDistrict] = useState(savedAddresses[0].district);

  const handleSelectAddress = (addr: typeof savedAddresses[0]) => {
    setSelectedAddressId(addr.id);
    setAddress(addr.address);
    setReference(addr.reference);
    setDistrict(addr.district);
  };

  const handleContinue = () => {
    navigate("/client/flash-availability", { 
      state: { 
        service, 
        photo, 
        address: { address, reference, district } 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3 max-w-7xl mx-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-sora text-xl font-semibold">Dirección</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="font-sora text-2xl font-bold">¿Dónde limpiamos?</h2>
          <p className="text-muted-foreground">Confirma o edita tu dirección</p>
        </div>

        {/* Saved Addresses */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-muted-foreground">Direcciones guardadas</Label>
          {savedAddresses.map((addr) => (
            <Card
              key={addr.id}
              className={`p-4 cursor-pointer transition-all ${
                selectedAddressId === addr.id 
                  ? "border-primary bg-primary/5 ring-2 ring-primary" 
                  : "hover:border-primary/50"
              }`}
              onClick={() => handleSelectAddress(addr)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  selectedAddressId === addr.id ? "bg-primary/20" : "bg-muted"
                }`}>
                  <MapPin className={`w-5 h-5 ${selectedAddressId === addr.id ? "text-primary" : ""}`} />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{addr.name}</p>
                  <p className="text-sm text-muted-foreground">{addr.address}, {addr.district}</p>
                </div>
                {selectedAddressId === addr.id && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Editable Fields */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Dirección</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Ingresa tu dirección"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="district">Distrito</Label>
            <Input
              id="district"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              placeholder="Ingresa tu distrito"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reference">Referencia</Label>
            <Input
              id="reference"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Ej: Edificio azul, portero 24h"
            />
          </div>
        </div>

        <Button 
          className="w-full" 
          size="lg"
          onClick={handleContinue}
        >
          Continuar
        </Button>
      </main>
    </div>
  );
};

export default ClientFlashAddress;

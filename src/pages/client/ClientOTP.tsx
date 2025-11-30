import { useState, useRef, useEffect } from "react";
import { OnboardingLayout } from "@/components/OnboardingLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ClientOTP = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (index === 5 && value) {
      handleSubmit(newOtp);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (otpValue: string[]) => {
    const code = otpValue.join("");
    if (code.length === 6) {
      toast.success("Verificación exitosa");
      navigate("/client/home-info");
    }
  };

  const handleResend = () => {
    if (timer === 0) {
      setTimer(60);
      toast.success("Código reenviado");
    }
  };

  return (
    <OnboardingLayout
      title="Verifica tu número"
      subtitle="Ingresa el código de 6 dígitos"
      currentStep={2}
      totalSteps={7}
      onBack={() => navigate("/client/register")}
    >
      <div className="space-y-6">
        <div className="flex gap-3 justify-center">
          {otp.map((digit, index) => (
            <Input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-14 text-center text-2xl font-semibold"
            />
          ))}
        </div>

        <div className="text-center space-y-2">
          {timer > 0 ? (
            <p className="text-sm text-muted-foreground">
              Reenviar código en {timer}s
            </p>
          ) : (
            <Button variant="link" onClick={handleResend}>
              Reenviar código
            </Button>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="w-full"
          onClick={() => navigate("/client/register")}
        >
          Cambiar número
        </Button>
      </div>
    </OnboardingLayout>
  );
};

export default ClientOTP;

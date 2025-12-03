import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

interface ComingSoonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  featureName?: string;
}

const ComingSoonModal = ({ open, onOpenChange, featureName }: ComingSoonModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader className="items-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-primary" />
          </div>
          <DialogTitle className="text-xl">Próximamente</DialogTitle>
          <DialogDescription className="text-center pt-2">
            {featureName 
              ? `La función "${featureName}" estará disponible pronto.`
              : "Esta función estará disponible pronto."
            }
            <br />
            Gracias por tu paciencia.
          </DialogDescription>
        </DialogHeader>
        <Button 
          className="w-full mt-4" 
          onClick={() => onOpenChange(false)}
        >
          Entendido
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ComingSoonModal;

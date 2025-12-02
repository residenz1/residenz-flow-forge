import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, Shield } from "lucide-react";

interface ResiAvatarProps {
  name: string;
  photoUrl?: string;
  rating?: number;
  visits?: number;
  verified?: boolean;
  size?: "sm" | "md" | "lg";
  showBadge?: boolean;
}

export const ResiAvatar = ({
  name,
  photoUrl,
  rating = 4.9,
  visits,
  verified = true,
  size = "md",
  showBadge = true,
}: ResiAvatarProps) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <Avatar className={sizeClasses[size]}>
          {photoUrl && <AvatarImage src={photoUrl} alt={name} />}
          <AvatarFallback className="bg-primary/10 text-primary font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>
        {verified && (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
            <Shield className="w-3 h-3 text-primary-foreground" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{name}</p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-primary text-primary" />
            {rating}
          </span>
          {visits && <span>· {visits} visitas</span>}
        </div>
      </div>
      {showBadge && (
        <Badge variant="outline" className="text-xs flex-shrink-0">
          Tu Resi
        </Badge>
      )}
    </div>
  );
};

import { Calendar, MapPin, Users, User as UserIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const MeetupCard = ({
  title,
  date,
  location,
  participants,
  maxParticipants,
  categories,
  info,
  description,   
  host,          
}) => {
  // Datum
  const formattedDate = new Date(date).toLocaleString("sv-SE", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  
  const categoryLabel =
    Array.isArray(categories) && categories.length > 0 ? categories[0] : null;

  
  const participantCount = Array.isArray(participants) ? participants.length : 0;
  const maxCount = typeof maxParticipants === "number" ? maxParticipants : "?";

 
  const descriptionText = info ?? description ?? "";

  
  const looksLikeObjectId =
    typeof host === "string" && /^[a-f0-9]{24}$/i.test(host);

  const hostLabel =
    typeof host === "string"
      ? (looksLikeObjectId ? null : host)              
      : host?.name || host?.email || null;            

  return (
    <Card className="overflow-hidden rounded-2xl bg-background/80 border border-border/60 shadow-lg hover:shadow-xl hover:border-primary/60 transition-all duration-200 hover:scale-[1.025] cursor-pointer group backdrop-blur-md">
      {/* Bild/gradient-topp */}
      <div className="aspect-video bg-gradient-to-br from-primary/30 to-cyan-400/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,hsl(var(--primary)/0.08)_50%,transparent_75%)] bg-[length:250%_250%] group-hover:animate-[shimmer_2s_ease-in-out_infinite]" />
        {/* Kategori-badge */}
        {categoryLabel && (
          <div className="absolute bottom-3 left-3">
            <Badge className="bg-primary/90 text-primary-foreground shadow-md px-3 py-1 text-xs font-semibold tracking-wide uppercase">
              {categoryLabel}
            </Badge>
          </div>
        )}
      </div>

      {/* Innehåll */}
      <div className="p-5 space-y-3">
        {/* Titel */}
        <h3 className="font-extrabold text-xl line-clamp-2 text-foreground group-hover:text-primary transition-colors tracking-tight">
          {title}
        </h3>

        {/* Värd */}
        {hostLabel && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <UserIcon className="w-4 h-4 text-amber-600/80" />
            <span className="font-medium text-foreground/80">Värd: {hostLabel}</span>
          </div>
        )}

        {/* Beskrivning */}
        {descriptionText && (
          <div className="text-sm text-muted-foreground line-clamp-2 mb-1">
            {descriptionText}
          </div>
        )}

        {/* Metadata */}
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary/80" />
            <span className="font-medium text-foreground/90">{formattedDate}</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-accent/80" />
            <span className="font-medium text-foreground/80">{location}</span>
          </div>

          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary/70" />
            <span className="font-medium text-foreground/70">
              {participantCount} / {maxCount} deltagare
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MeetupCard;

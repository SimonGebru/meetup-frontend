import { Calendar, MapPin, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const MeetupCard = ({ title, date, location, attendees, maxAttendees, category, info }) => {
  return (
    <Card className="overflow-hidden rounded-2xl bg-background/80 border border-border/60 shadow-lg hover:shadow-xl hover:border-primary/60 transition-all duration-200 hover:scale-[1.025] cursor-pointer group backdrop-blur-md">
      {/* Bild/gradient-topp */}
      <div className="aspect-video bg-gradient-to-br from-primary/30 to-cyan-400/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,hsl(var(--primary)/0.08)_50%,transparent_75%)] bg-[length:250%_250%] group-hover:animate-[shimmer_2s_ease-in-out_infinite]" />
        <div className="absolute bottom-3 left-3">
          <Badge className="bg-primary/90 text-primary-foreground shadow-md px-3 py-1 text-xs font-semibold tracking-wide uppercase">
            {category}
          </Badge>
        </div>
      </div>
      {/* Innehåll */}
      <div className="p-5 space-y-3">
        <h3 className="font-extrabold text-xl line-clamp-2 text-foreground group-hover:text-primary transition-colors tracking-tight">
          {title}
        </h3>
        {info && (
          <div className="text-sm text-muted-foreground line-clamp-2 mb-1">{info}</div>
        )}
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary/80" />
            <span className="font-medium text-foreground/90">{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-accent/80" />
            <span className="font-medium text-foreground/80">{location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary/70" />
            <span className="font-medium text-foreground/70">
              {attendees}
              {typeof maxAttendees === 'number' ? ` / ${maxAttendees}` : ''} deltagare
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MeetupCard;

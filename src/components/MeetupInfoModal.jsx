import { Calendar, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const MeetupInfoModal = ({ meetup, isRegistered, onRegister, onUnregister, onClose }) => {
  if (!meetup) return null;
  const isFull = typeof meetup.maxAttendees === 'number' && meetup.attendees >= meetup.maxAttendees;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-background/90 rounded-3xl shadow-2xl max-w-xl w-full p-0 relative animate-fade-in overflow-hidden border border-border/60">
        {/* Header with image and close */}
        <div className="relative h-40 bg-gradient-to-br from-primary/30 to-cyan-400/20 flex items-center justify-center">
          <Calendar className="w-14 h-14 text-primary drop-shadow-lg" />
          <button
            className="absolute top-4 right-4 text-muted-foreground hover:text-primary text-2xl"
            onClick={onClose}
            aria-label="Stäng"
          >
            ×
          </button>
        </div>
        <div className="p-8">
          <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
            {meetup.title}
          </h3>
          <div className="flex flex-wrap gap-3 mb-4 text-muted-foreground text-sm items-center">
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{meetup.location}</span>
            <span className="flex items-center gap-1"><Users className="w-4 h-4" />
              {meetup.attendees}
              {typeof meetup.maxAttendees === 'number' ? ` / ${meetup.maxAttendees}` : ''} deltagare
              {isFull && <span className="ml-2 text-xs text-red-500 font-semibold">(Fullbokat)</span>}
            </span>
            <span className="inline-block bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-medium">{meetup.category}</span>
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{meetup.date}</span>
          </div>
          <div className="mb-6">
            <p className="text-base text-foreground/90 leading-relaxed">
              {meetup.info ? meetup.info : (
                <>
                  Här kan du läsa mer om detta meetup och se detaljer. <br />
                  (Lägg till beskrivning eller agenda här om du vill.)
                </>
              )}
            </p>
          </div>
          <div className="flex gap-4">
            {isRegistered ? (
              <Button
                variant="destructive"
                className="flex-1 h-12 text-base font-medium"
                onClick={() => { onUnregister(meetup.id); onClose(); }}
              >
                Avregistrera dig
              </Button>
            ) : (
              <Button
                className="flex-1 h-12 text-base font-medium"
                onClick={() => { onRegister(meetup.id); onClose(); }}
                disabled={isFull}
              >
                {isFull ? 'Fullbokat' : 'Anmäl dig'}
              </Button>
            )}
            <Button
              variant="outline"
              className="flex-1 h-12 text-base font-medium"
              onClick={onClose}
            >
              Stäng
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetupInfoModal;

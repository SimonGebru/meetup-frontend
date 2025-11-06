import { useState, useEffect } from "react";
import { Calendar, MapPin, Users, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const MeetupInfoModal = ({ meetup, onRegister, onUnregister, onClose }) => {
  if (!meetup) return null;

  const { toast } = useToast();
  const user = JSON.parse(localStorage.getItem("user"));
  const [loading, setLoading] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [localParticipants, setLocalParticipants] = useState(
    meetup.participants || []
  );

  // Uppdatera lokalt när meetup-propen ändras
  useEffect(() => {
    setLocalParticipants(meetup.participants || []);
  }, [meetup]);

  const norm = (v) =>
    String((v && (v._id || v.id || v.email || v.name)) ?? v ?? "").trim();

  const userKey = norm(user?.id || user?.email || user?.name);
  const participantKeys = localParticipants.map(norm);

  const isRegistered = participantKeys.includes(userKey);
  const participantCount = localParticipants.length;

  const isFull =
    typeof meetup?.maxParticipants === "number" &&
    participantCount >= meetup.maxParticipants;

  const formatDate = (isoDate) =>
    new Date(isoDate).toLocaleString("sv-SE", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const description =
    meetup?.description || meetup?.info || "Ingen beskrivning tillgänglig.";

  const categories = Array.isArray(meetup?.categories)
    ? meetup.categories.join(", ")
    : meetup?.category || "Okänd kategori";

 // Anmälan
const handleRegisterClick = async () => {
  setLoading(true);
  try {
    await onRegister(meetup._id);

    // Lokal uppdatering direkt (utan reload)
    meetup.participants = [...participants, userKey];

    toast({
      title: "Du är anmäld!",
      description: `Du har gått med i "${meetup.title}".`,
      duration: 2500,
    });

    setPulse(true);
    setTimeout(() => setPulse(false), 1500);
  } catch (err) {
    console.error("Register error:", err);
    toast({
      title: "Kunde inte anmäla dig",
      description: "Försök igen om en stund.",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};

// Avanmälan
const handleUnregisterClick = async () => {
  setLoading(true);
  try {
    await onUnregister(meetup._id);

    // Lokal uppdatering direkt (utan reload)
    meetup.participants = participants.filter((p) => norm(p) !== userKey);

    toast({
      title: "Avanmälan genomförd",
      description: `Du har lämnat "${meetup.title}".`,
      duration: 2500,
    });

    
  } catch (err) {
    console.error("Unregister error:", err);
    toast({
      title: "Kunde inte avanmäla dig",
      description: "Försök igen om en stund.",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-background/90 rounded-3xl shadow-2xl max-w-xl w-full p-0 relative animate-fade-in overflow-hidden border border-border/60">
        {/* Header */}
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

        {/* Innehåll */}
        <div className="p-8">
          <h3 className="text-2xl font-bold mb-2">{meetup.title}</h3>

          {/* Metadata */}
          <div className="flex flex-wrap gap-3 mb-4 text-muted-foreground text-sm items-center">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {meetup.location}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {participantCount} / {meetup.maxParticipants || "?"} deltagare
              {isFull && (
                <span className="ml-2 text-xs text-red-500 font-semibold">
                  (Fullbokat)
                </span>
              )}
            </span>
            <span className="inline-block bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-medium">
              {categories}
            </span>
            <span>
              <Calendar className="w-4 h-4 inline mr-1" />
              {formatDate(meetup.date)}
            </span>
          </div>

          {/* Beskrivning */}
          <p className="text-base text-foreground/90 mb-6">{description}</p>

          {/* Knappar */}
          <div className="flex gap-4 items-center">
            <AnimatePresence mode="wait">
              {isRegistered ? (
                <motion.div
                  key="unregister"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1"
                >
                  <Button
                    variant="destructive"
                    className="w-full h-12 text-base font-medium flex items-center justify-center gap-2"
                    onClick={handleUnregisterClick}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Laddar...
                      </>
                    ) : (
                      "Avanmäl dig"
                    )}
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 relative"
                >
                  {/* Pulse-effekt */}
                  {pulse && (
                    <motion.div
                      className="absolute inset-0 rounded-xl bg-primary/30 blur-md"
                      initial={{ opacity: 0.5, scale: 1 }}
                      animate={{ opacity: 0, scale: 1.8 }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                    />
                  )}

                  <Button
                    className="w-full h-12 text-base font-medium relative z-10 flex items-center justify-center gap-2"
                    onClick={handleRegisterClick}
                    disabled={isFull || loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Laddar...
                      </>
                    ) : isFull ? (
                      "Fullbokat"
                    ) : (
                      "Anmäl dig"
                    )}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

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

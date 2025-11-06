import { useEffect, useState } from "react";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import { getReviews } from "@/services/meetupService";

const MeetupDetails = ({ meetup, setSelectedMeetup, formatDate }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hämta recensioner
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const res = await getReviews(meetup._id);
        if (Array.isArray(res)) {
          setReviews(res);
        } else if (res?.reviews) {
          setReviews(res.reviews);
        } else {
          setReviews([]);
        }
        console.log(" Hämtade recensioner:", res);
      } catch (err) {
        console.error("Kunde inte hämta recensioner:", err);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
    if (meetup?._id) fetchReviews();
  }, [meetup?._id]);

  // Uppdatera vid ny recension
  useEffect(() => {
    const handleReviewAdded = async (e) => {
      if (e.detail === meetup._id) {
        try {
          const res = await getReviews(meetup._id);
          const list = Array.isArray(res) ? res : res?.reviews || [];
          setReviews(list);
          console.log("Uppdaterade recensioner (MeetupDetails):", list);
        } catch (err) {
          console.error("Kunde inte uppdatera recensioner:", err);
        }
      }
    };

    document.addEventListener("review-added", handleReviewAdded);
    return () =>
      document.removeEventListener("review-added", handleReviewAdded);
  }, [meetup._id]);

  const participantsCount = Array.isArray(meetup.participants)
    ? meetup.participants.length
    : 0;

  const categoryLabel = Array.isArray(meetup.categories)
    ? meetup.categories.join(", ")
    : meetup.category || "Okänd kategori";

  const reviewCountText =
    reviews.length === 1 ? "1 recension" : `${reviews.length} recensioner`;

  return (
    <div className="animate-fade-in">
      <button
        className="mb-6 text-primary hover:underline flex items-center gap-1 text-sm font-medium"
        onClick={() => setSelectedMeetup(null)}
      >
        <ArrowRight className="w-4 h-4 rotate-180" /> Tillbaka
      </button>

      <div className="flex items-center gap-3 mb-3">
        <div className="bg-primary/10 rounded-full p-2 flex items-center justify-center">
          <Calendar className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-2xl font-bold text-foreground">{meetup.title}</h3>
      </div>

      <div className="flex flex-wrap gap-3 mb-2 text-muted-foreground text-sm">
        <span className="flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          {meetup.location}
        </span>
        <span className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          {participantsCount} / {meetup.maxParticipants || "?"} deltagare
        </span>
        <span className="inline-block bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-medium">
          {categoryLabel}
        </span>
      </div>

      <div className="mb-2 text-xs text-muted-foreground">
        {formatDate(meetup.date)}
      </div>

      <div className="mt-6 bg-background/80 rounded-xl p-4 shadow-inner border border-border/40 mb-6">
        <p className="text-base text-foreground leading-relaxed">
          {meetup.description ||
            meetup.info ||
            "Ingen beskrivning tillgänglig för detta meetup."}
        </p>
      </div>

      <div className="mt-6 bg-muted/20 rounded-xl p-4 border border-border/50 relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-lg font-semibold text-foreground">Recensioner</h4>
          <span className="text-sm text-muted-foreground">
            {loading ? "Laddar..." : reviewCountText}
          </span>
        </div>

        {loading ? (
          <p className="text-muted-foreground text-sm">Hämtar recensioner...</p>
        ) : reviews.length > 0 ? (
          reviews.map((r, i) => (
            <div
              key={i}
              className="border-b border-border/40 pb-3 mb-3 last:border-none last:mb-0"
            >
              <div className="flex items-center gap-2 text-yellow-400 mb-1">
                {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
              </div>
              <p className="text-foreground italic">{r.comment}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {r.user?.name || "Okänd användare"} –{" "}
                {new Date(r.createdAt).toLocaleDateString("sv-SE")}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground italic">
            Ingen recension ännu.
          </p>
        )}
      </div>
    </div>
  );
};

export default MeetupDetails;
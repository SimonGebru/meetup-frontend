import { useState, useEffect } from "react";
import {
  User,
  Calendar,
  MapPin,
  Users,
  ArrowRight,
  LogOut,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ReviewModal from "@/components/ReviewModal";
import { getAllMeetups } from "@/services/meetupService";
import { createReview } from "@/services/meetupService";
import { getReviews } from "@/services/meetupService";


const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const ProfileModal = ({
  show,
  onClose,
  selectedMeetup,
  setSelectedMeetup,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState("joined");
  const [selectedReviewMeetup, setSelectedReviewMeetup] = useState(null);
  const [meetups, setMeetups] = useState([]);
  const [reviews, setReviews] = useState(() => {
    const stored = localStorage.getItem("reviews");
    return stored ? JSON.parse(stored) : [];
  });

   const { toast } = useToast();
  const user = JSON.parse(localStorage.getItem("user"));

  const now = new Date();

  // Filtrera meetups utifrån användarens relation
  const createdMeetups = meetups.filter(
    (m) => m.host === user?.email || m.host === user?.name
  );

  const joinedMeetups = meetups.filter((m) => {
    const meetupDate = new Date(m.date);
    const isFuture = meetupDate > now;
    const isParticipant =
      Array.isArray(m.participants) && m.participants.includes(user?.id);
    return isFuture && isParticipant;
  });

  const pastMeetups = meetups.filter((m) => {
    if (!m.date) return false;
    const meetupDate = new Date(m.date);
    const isPast = meetupDate.getTime() < now.getTime() - 1000 * 60 * 5;
    const isParticipant =
      Array.isArray(m.participants) && m.participants.includes(user?.id);
    const isHost = m.host === user?.email || m.host === user?.name;
    return isPast && (isParticipant || isHost);
  });

 //  Hämta meetups (vid öppning eller uppdatering)
useEffect(() => {
  const fetchMeetups = async () => {
    try {
      const data = await getAllMeetups();
      setMeetups(data);
      console.log("Hämtade meetups:", data);
    } catch (err) {
      console.error("Kunde inte hämta meetups:", err);
    }
  };

  if (show) fetchMeetups();

  const refreshHandler = () => fetchMeetups();
  document.addEventListener("meetup-updated", refreshHandler);

  return () => {
    document.removeEventListener("meetup-updated", refreshHandler);
  };
}, [show]);

// Hämta alla recensioner för tidigare meetups när fliken "Tidigare Meetups" öppnas
useEffect(() => {
  // Kör bara när fliken öppnas
  if (activeTab !== "past" || pastMeetups.length === 0) return;

  let fetched = false; // förhindrar flera anrop

  const fetchAllReviews = async () => {
    if (fetched) return; // om vi redan hämtat, avbryt
    fetched = true;

    try {
      const results = await Promise.all(
        pastMeetups.map((m) =>
          getReviews(m._id).catch(() => ({ reviews: [] }))
        )
      );

      const all = results.flatMap((r) =>
        Array.isArray(r) ? r : r?.reviews ?? []
      );

      setReviews(all);
      console.log(" Hämtade recensioner för tidigare meetups:", all);
    } catch (err) {
      console.error("Kunde inte hämta recensioner:", err);
    }
  };

  fetchAllReviews();
}, [activeTab]);

// Uppdatera recensioner när en ny har skapats
useEffect(() => {
  const handleReviewAdded = async (e) => {
    const meetupId = e.detail;
    if (!meetupId) return;

    try {
      const res = await getReviews(meetupId);
      const newReviews = Array.isArray(res) ? res : res?.reviews ?? [];

      setReviews((prev) => {
        const filtered = prev.filter(
          (r) =>
            (typeof r.meetupId === "object"
              ? r.meetupId._id
              : r.meetupId) !== meetupId
        );
        return [...filtered, ...newReviews];
      });

      console.log(`🔁 Uppdaterade recensioner för meetup ${meetupId}`);
    } catch (err) {
      console.error("Kunde inte uppdatera recensioner:", err);
    }
  };

  document.addEventListener("review-added", handleReviewAdded);
  return () =>
    document.removeEventListener("review-added", handleReviewAdded);
}, []);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString("sv-SE", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const handleAddReview = async (newReview) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast({
            title: "Du måste vara inloggad",
            description: "Logga in för att lämna en recension.",
            variant: "destructive",
          });
          return;
        }
    
        console.log("📦 Skickar review:", newReview);
    
        const savedReview = await createReview(newReview.meetupId, newReview, token);
        document.dispatchEvent(new CustomEvent("review-added", { detail: newReview.meetupId }));
        // Lägg till recensionen direkt i state
        setReviews((prev) => [...prev, savedReview]);
    
        toast({
          title: "Tack för din recension!",
          description: "Din recension har sparats.",
        });
    
      } catch (err) {
        console.error("handleAddReview error:", err);
        toast({
          title: "Kunde inte spara recension",
          description: err.message,
          variant: "destructive",
        });
      }
    };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-background/90 rounded-3xl shadow-2xl w-full max-w-xl h-[85vh] flex flex-col overflow-hidden border border-border/60">
        {/* Header */}
        <div className="relative h-40 flex-shrink-0 bg-gradient-to-br from-primary/30 to-cyan-400/20 flex items-center justify-center">
          <User className="w-14 h-14 text-primary drop-shadow-lg" />
          <button
            className="absolute top-4 right-4 text-muted-foreground hover:text-primary text-2xl"
            onClick={() => {
              onClose();
              setSelectedMeetup(null);
            }}
            aria-label="Stäng"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col px-8 pt-6 pb-4 overflow-hidden">
          <h3 className="text-2xl font-bold mb-6 text-center">Min Profil</h3>

          {!selectedMeetup ? (
            <>
              {/* Tabs */}
              <div className="flex gap-2 mb-4 justify-center">
                {[
                  { id: "joined", label: "Mina Meetups" },
                  { id: "created", label: "Mina skapade Meetups" },
                  { id: "past", label: "Tidigare Meetups" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    className={`px-4 py-2 rounded-lg font-semibold text-base transition-all ${
                      activeTab === tab.id
                        ? "bg-primary/90 text-white shadow"
                        : "bg-muted/40 text-muted-foreground hover:bg-muted/60"
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Scrollable list container */}
              <div className="flex-1 overflow-y-auto pr-2 custom-scroll">
                {activeTab === "joined" &&
                  (joinedMeetups.length === 0 ? (
                    <EmptyState text="Du har inga anmälda meetups ännu." />
                  ) : (
                    <MeetupList
                      meetups={joinedMeetups}
                      setSelectedMeetup={setSelectedMeetup}
                      formatDate={formatDate}
                      activeTab={activeTab}
                    />
                  ))}

                {activeTab === "created" &&
                  (createdMeetups.length === 0 ? (
                    <EmptyState text="Du har inte skapat några meetups ännu." />
                  ) : (
                    <MeetupList
                      meetups={createdMeetups}
                      setSelectedMeetup={setSelectedMeetup}
                      formatDate={formatDate}
                      activeTab={activeTab}
                      isCreatorView
                    />
                  ))}

                {activeTab === "past" &&
                  (pastMeetups.length === 0 ? (
                    <EmptyState text="Du har inga tidigare meetups." />
                  ) : (
                    <MeetupList
                      meetups={pastMeetups}
                      setSelectedMeetup={setSelectedMeetup}
                      formatDate={formatDate}
                      reviews={reviews}
                      setSelectedReviewMeetup={setSelectedReviewMeetup}
                      activeTab={activeTab}
                    />
                  ))}
              </div>

              {/* Logout */}
              <div className="flex justify-center mt-6 mb-2">
                <button
                  onClick={onLogout}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-destructive text-destructive-foreground font-semibold shadow hover:bg-destructive/80 transition-all text-base w-full max-w-xs justify-center"
                >
                  <LogOut className="w-5 h-5" /> Logga ut
                </button>
              </div>
            </>
          ) : (
            <MeetupDetails
              meetup={selectedMeetup}
              setSelectedMeetup={setSelectedMeetup}
              formatDate={formatDate}
              reviews={reviews} 
            />
          )}
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
  show={!!selectedReviewMeetup}
  meetup={selectedReviewMeetup}
  onClose={() => setSelectedReviewMeetup(null)}
  onSubmit={handleAddReview}
/>
    </div>
  );
};

//  Meetup-lista (uppdaterad med korrekt review-räkning)
const MeetupList = ({
  meetups,
  setSelectedMeetup,
  formatDate,
  reviews,
  setSelectedReviewMeetup,
  activeTab,
  isCreatorView = false,
}) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const { toast } = useToast();

  const refresh = () => document.dispatchEvent(new CustomEvent("meetup-updated"));

  const handleUnregister = async (meetupId) => {
    try {
      const res = await fetch(`${API_URL}/meetups/${meetupId}/join`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Kunde inte avanmäla dig.");

      toast({
        title: "Avanmälan lyckades!",
        description: "Du är inte längre registrerad till detta meetup.",
      });
      refresh();
    } catch (err) {
      toast({
        title: "Fel vid avanmälan",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleRegister = async (meetupId) => {
    try {
      const res = await fetch(`${API_URL}/meetups/${meetupId}/join`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Kunde inte anmäla dig.");

      toast({
        title: "Anmälan lyckades!",
        description: "Du är nu registrerad till detta meetup.",
      });
      refresh();
    } catch (err) {
      toast({
        title: "Fel vid anmälan",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteMeetup = async (meetupId) => {
    if (!confirm("Är du säker på att du vill ta bort detta meetup?")) return;
    try {
      const res = await fetch(`${API_URL}/meetups/${meetupId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Kunde inte ta bort meetup.");

      toast({
        title: "Meetup raderat",
        description: "Evenemanget har tagits bort.",
      });
      refresh();
    } catch (err) {
      toast({
        title: "Fel vid radering",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  return (
    <ul className="divide-y divide-border/60 rounded-xl bg-muted/30 shadow-inner custom-scroll">
      {meetups.map((meetup) => {
        // Korrekt filtrering av recensioner
        const reviewCount = reviews?.filter(
          (r) =>
            String(r.meetupId) === String(meetup._id) ||
            String(r.meetup?._id) === String(meetup._id)
        ).length || 0;

        const participantsCount = Array.isArray(meetup.participants)
          ? meetup.participants.length
          : 0;
        const categoryLabel = Array.isArray(meetup.categories)
          ? meetup.categories.join(", ")
          : meetup.category || "Okänd kategori";
        const isUserRegistered =
          Array.isArray(meetup.participants) &&
          meetup.participants.includes(user?.id);

        let actionButton = null;

        if (activeTab === "joined") {
          actionButton = (
            <Button
              size="sm"
              variant="destructive"
              onClick={(e) => {
                e.stopPropagation();
                handleUnregister(meetup._id);
              }}
            >
              Avanmäl dig
            </Button>
          );
        } else if (activeTab === "created") {
          if (isCreatorView && (meetup.host === user?.name || meetup.host === user?.email)) {
            actionButton = (
              <div className="flex gap-2">
                {isUserRegistered ? (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUnregister(meetup._id);
                    }}
                  >
                    Avanmäl dig
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRegister(meetup._id);
                    }}
                  >
                    Anmäl dig
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteMeetup(meetup._id);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            );
          }
        }

        return (
          <li
            key={meetup._id || meetup.id}
            className="group py-5 px-4 flex flex-col gap-1 hover:bg-primary/10 transition-all"
          >
            <div className="flex justify-between items-start">
              <div
                className="flex flex-col cursor-pointer flex-1"
                onClick={() => setSelectedMeetup && setSelectedMeetup(meetup)}
              >
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-primary shrink-0" />
                  <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {meetup.title}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-sm text-muted-foreground pl-8 flex-wrap">
                  <span>
                    <MapPin className="inline w-4 h-4 mr-1" />
                    {meetup.location}
                  </span>
                  <span>
                    <Users className="inline w-4 h-4 mr-1" />
                    {participantsCount} / {meetup.maxParticipants || "?"} deltagare
                  </span>
                  <span className="inline-block bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-medium">
                    {categoryLabel}
                  </span>
                </div>

                <div className="pl-8 text-xs text-primary/80 mt-1">
                  {formatDate(meetup.date)}
                </div>
              </div>

              {actionButton && activeTab !== "past" && (
                <div className="ml-3 mt-1 shrink-0">{actionButton}</div>
              )}
            </div>

            {/* Dynamiskt visning av recensioner */}
            {setSelectedReviewMeetup && activeTab === "past" && (
              <div className="pl-8 mt-3 flex items-center justify-between text-sm text-muted-foreground">
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedReviewMeetup(meetup);
                  }}
                >
                  Lämna recension
                </Button>

                <span className="ml-2 text-xs text-muted-foreground">
                  {reviewCount > 0
                    ? `${reviewCount} recension${reviewCount > 1 ? "er" : ""}`
                    : "Inga recensioner"}
                </span>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
};

const MeetupDetails = ({ meetup, setSelectedMeetup, formatDate }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hämta recensioner vid öppning av meetup
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
      } catch (err) {
        console.error("Kunde inte hämta recensioner:", err);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    if (meetup?._id) fetchReviews();
  }, [meetup?._id]);

  // När en ny recension skapas (hämta om)
  useEffect(() => {
    const handleReviewAdded = async (e) => {
      if (e.detail === meetup._id) {
        try {
          const res = await getReviews(meetup._id);
          const list = Array.isArray(res) ? res : res?.reviews || [];
          setReviews(list);
        } catch (err) {
          console.error("Kunde inte uppdatera recensioner:", err);
        }
      }
    };

    document.addEventListener("review-added", handleReviewAdded);
    return () =>
      document.removeEventListener("review-added", handleReviewAdded);
  }, [meetup._id]);

  // Antal deltagare och kategorier
  const participantsCount = Array.isArray(meetup.participants)
    ? meetup.participants.length
    : 0;

  const categoryLabel = Array.isArray(meetup.categories)
    ? meetup.categories.join(", ")
    : meetup.category || "Okänd kategori";

  // Text för antal recensioner
  const reviewCountText =
    reviews.length === 1
      ? "1 recension"
      : `${reviews.length} recensioner`;

  return (
    <div className="animate-fade-in">
      {/* 🔙 Tillbaka-knapp */}
      <button
        className="mb-6 text-primary hover:underline flex items-center gap-1 text-sm font-medium"
        onClick={() => setSelectedMeetup(null)}
      >
        <ArrowRight className="w-4 h-4 rotate-180" /> Tillbaka
      </button>

      {/* 🧭 Meetup-header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="bg-primary/10 rounded-full p-2 flex items-center justify-center">
          <Calendar className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-2xl font-bold text-foreground">{meetup.title}</h3>
      </div>

      {/* 📍 Metadata */}
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

      {/* 🗓 Datum */}
      <div className="mb-2 text-xs text-muted-foreground">
        {formatDate(meetup.date)}
      </div>

      {/* 📝 Beskrivning */}
      <div className="mt-6 bg-background/80 rounded-xl p-4 shadow-inner border border-border/40 mb-6">
        <p className="text-base text-foreground leading-relaxed">
          {meetup.description ||
            meetup.info ||
            "Ingen beskrivning tillgänglig för detta meetup."}
        </p>
      </div>

      {/* 💬 Recensioner */}
      <div className="mt-6 bg-muted/20 rounded-xl p-4 border border-border/50 relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-lg font-semibold text-foreground">
            Recensioner
          </h4>
          <span className="text-sm text-muted-foreground">
            {loading ? "Laddar..." : reviewCountText}
          </span>
        </div>

        {loading ? (
          <p className="text-muted-foreground text-sm">
            Hämtar recensioner...
          </p>
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

const EmptyState = ({ text }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
    <Calendar className="w-10 h-10 opacity-60 mb-2" />
    <p>{text}</p>
  </div>
);

export default ProfileModal;





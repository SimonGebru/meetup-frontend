import { useState, useEffect } from "react";
import { User, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ReviewModal from "@/components/ReviewModal";
import { getAllMeetups, createReview, getReviews } from "@/services/meetupService";
import MeetupList from "./MeetupList";
import MeetupDetails from "./MeetupDetails";
import EmptyState from "./EmptyState";

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

  // Filtrering av meetups
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

  // Hämta alla meetups
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

  // Hämta recensioner för tidigare meetups
  useEffect(() => {
    if (activeTab !== "past" || pastMeetups.length === 0) return;
    let fetched = false;

    const fetchAllReviews = async () => {
      if (fetched) return;
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
        console.log("Hämtade recensioner för tidigare meetups:", all);
      } catch (err) {
        console.error("Kunde inte hämta recensioner:", err);
      }
    };

    fetchAllReviews();
  }, [activeTab]);

  // Uppdatera recensioner vid nyinlagd
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

  // Formattera datum
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString("sv-SE", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  // Lägg till recension
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

      const savedReview = await createReview(
        newReview.meetupId,
        newReview,
        token
      );
      document.dispatchEvent(
        new CustomEvent("review-added", { detail: newReview.meetupId })
      );

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

              {/* Listor */}
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

export default ProfileModal;
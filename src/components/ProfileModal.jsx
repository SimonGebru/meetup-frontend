import { useState } from "react";
import { User, Calendar, MapPin, Users, ArrowRight, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ReviewModal from "@/components/ReviewModal";

const ProfileModal = ({ show, onClose, userMeetups, selectedMeetup, setSelectedMeetup, onLogout }) => {
  const [activeTab, setActiveTab] = useState("joined");
  const [selectedReviewMeetup, setSelectedReviewMeetup] = useState(null);
  const [reviews, setReviews] = useState(() => {
    const stored = localStorage.getItem("reviews");
    return stored ? JSON.parse(stored) : [];
  });
  const { toast } = useToast(); 

  // Dagens datum (utan tid)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Tidigare meetups: användarens meetups där datumet är före idag
  const pastMeetups = userMeetups.filter((m) => {
    const dateStr = m.date.match(/\d{1,2} \w+ \d{4}/);
    if (!dateStr) return false;
    const meetupDate = new Date(dateStr[0] + " 00:00");
    return meetupDate < today;
  });

  // Mock: Skapade meetups
  const createdMeetups = [
    {
      id: 101,
      title: "Min kodworkshop",
      location: "Kista Science Tower",
      attendees: 12,
      date: "Fre, 8 Nov 2024 · 17:00",
      category: "Tech",
    },
  ];

  const handleAddReview = (newReview) => {
    const updated = [...reviews, newReview];
    setReviews(updated);
    localStorage.setItem("reviews", JSON.stringify(updated));
    toast({
      title: "Tack för din recension!",
      description: "Den har sparats lokalt (mock-läge).",
    });
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-background/90 rounded-3xl shadow-2xl max-w-xl w-full p-0 relative animate-fade-in overflow-hidden border border-border/60">
        {/* Header */}
        <div className="relative h-40 bg-gradient-to-br from-primary/30 to-cyan-400/20 flex items-center justify-center">
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

        <div className="p-8">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 justify-center">
            Min Profil
          </h3>

          {!selectedMeetup ? (
            <>
              {/* Tabs */}
              <div className="flex gap-2 mb-6">
                <button
                  className={`px-4 py-2 rounded-lg font-semibold text-base transition-all ${
                    activeTab === "joined"
                      ? "bg-primary/90 text-white shadow"
                      : "bg-muted/40 text-muted-foreground hover:bg-muted/60"
                  }`}
                  onClick={() => setActiveTab("joined")}
                >
                  Mina Meetups
                </button>
                <button
                  className={`px-4 py-2 rounded-lg font-semibold text-base transition-all ${
                    activeTab === "created"
                      ? "bg-primary/90 text-white shadow"
                      : "bg-muted/40 text-muted-foreground hover:bg-muted/60"
                  }`}
                  onClick={() => setActiveTab("created")}
                >
                  Mina skapade Meetups
                </button>
                <button
                  className={`px-4 py-2 rounded-lg font-semibold text-base transition-all ${
                    activeTab === "past"
                      ? "bg-primary/90 text-white shadow"
                      : "bg-muted/40 text-muted-foreground hover:bg-muted/60"
                  }`}
                  onClick={() => setActiveTab("past")}
                >
                  Tidigare Meetups
                </button>
              </div>

              {/* Tab innehåll */}
              {activeTab === "joined" ? (
                userMeetups.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Calendar className="w-10 h-10 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground text-center">
                      Du har inga anmälda meetups ännu.
                      <br />
                      Anmäl dig till ett event för att se det här!
                    </p>
                  </div>
                ) : (
                  <ul className="divide-y divide-border/60 rounded-xl overflow-hidden bg-muted/30 shadow-inner">
                    {userMeetups.map((meetup) => (
                      <li
                        key={meetup.id}
                        className="group py-5 px-4 cursor-pointer hover:bg-primary/10 transition-all flex flex-col gap-1 focus:outline-none focus:ring-2 focus:ring-primary"
                        onClick={() => setSelectedMeetup(meetup)}
                        tabIndex={0}
                        role="button"
                        aria-label={`Visa ${meetup.title}`}
                      >
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-primary shrink-0" />
                          <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                            {meetup.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground pl-8">
                          <span>
                            <MapPin className="inline w-4 h-4 mr-1" />
                            {meetup.location}
                          </span>
                          <span>
                            <Users className="inline w-4 h-4 mr-1" />
                            {meetup.attendees} deltagare
                          </span>
                        </div>
                        <div className="pl-8 text-xs text-primary/80 mt-1">
                          {meetup.date}
                        </div>
                      </li>
                    ))}
                  </ul>
                )
              ) : activeTab === "created" ? (
                createdMeetups.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Calendar className="w-10 h-10 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground text-center">
                      Du har inte skapat några meetups ännu.
                    </p>
                  </div>
                ) : (
                  <ul className="divide-y divide-border/60 rounded-xl overflow-hidden bg-muted/30 shadow-inner">
                    {createdMeetups.map((meetup) => (
                      <li
                        key={meetup.id}
                        className="group py-5 px-4 flex flex-col gap-1"
                      >
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-primary shrink-0" />
                          <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                            {meetup.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground pl-8">
                          <span>
                            <MapPin className="inline w-4 h-4 mr-1" />
                            {meetup.location}
                          </span>
                          <span>
                            <Users className="inline w-4 h-4 mr-1" />
                            {meetup.attendees} deltagare
                          </span>
                        </div>
                        <div className="pl-8 text-xs text-primary/80 mt-1">
                          {meetup.date}
                        </div>
                      </li>
                    ))}
                  </ul>
                )
              ) : pastMeetups.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Calendar className="w-10 h-10 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground text-center">
                    Du har inga tidigare meetups.
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-border/60 rounded-xl overflow-hidden bg-muted/30 shadow-inner">
                  {pastMeetups.map((meetup) => {
                    const hasReview = reviews.some((r) => r.meetupId === meetup.id);
                    return (
                      <li
                        key={meetup.id}
                        className="group py-5 px-4 flex flex-col gap-1"
                      >
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-primary shrink-0" />
                          <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                            {meetup.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground pl-8">
                          <span>
                            <MapPin className="inline w-4 h-4 mr-1" />
                            {meetup.location}
                          </span>
                          <span>
                            <Users className="inline w-4 h-4 mr-1" />
                            {meetup.attendees} deltagare
                          </span>
                        </div>
                        <div className="pl-8 text-xs text-primary/80 mt-1">
                          {meetup.date}
                        </div>

                        {/* Recension-knapp */}
                        <div className="pl-8 mt-3">
                          {hasReview ? (
                            <p className="text-sm text-green-500 font-medium">
                              ✅ Recension skickad
                            </p>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => setSelectedReviewMeetup(meetup)}
                            >
                              Lämna recension
                            </Button>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}

              <div className="flex justify-center mt-10 mb-2">
                <button
                  onClick={onLogout}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-destructive text-destructive-foreground font-semibold shadow hover:bg-destructive/80 transition-all text-base w-full max-w-xs justify-center"
                >
                  <LogOut className="w-5 h-5" /> Logga ut
                </button>
              </div>
            </>
          ) : (
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
                <h3 className="text-2xl font-bold text-foreground">
                  {selectedMeetup.title}
                </h3>
              </div>
              <div className="flex flex-wrap gap-3 mb-2 text-muted-foreground text-sm">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {selectedMeetup.location}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {selectedMeetup.attendees} deltagare
                </span>
                <span className="inline-block bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-semibold">
                  {selectedMeetup.category}
                </span>
              </div>
              <div className="mb-2 text-xs text-muted-foreground">
                {selectedMeetup.date}
              </div>
              <div className="mt-6 bg-background/80 rounded-xl p-4 shadow-inner border border-border/40">
                <p className="text-base text-foreground">
                  Mer information om detta meetup kan visas här.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ReviewModal */}
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

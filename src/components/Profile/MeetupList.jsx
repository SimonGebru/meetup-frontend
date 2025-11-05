import { MapPin, Calendar, Users, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

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

  const refresh = () =>
    document.dispatchEvent(new CustomEvent("meetup-updated"));

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
        const reviewCount =
          reviews?.filter(
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
          if (
            isCreatorView &&
            (meetup.host === user?.name || meetup.host === user?.email)
          ) {
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

            {/* Dynamisk recension */}
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

export default MeetupList;
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CreateEventModal from "@/components/CreateEventModal";
import { Plus, Search, ArrowRight } from "lucide-react";
import UpcomingEventsSection from "@/components/UpcomingEventsSection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProfileModal from "@/components/Profile/ProfileModal";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/heroimage-meetup.jpg";
import {
  getAllMeetups,
  joinMeetup,
  leaveMeetup,
  createMeetup,
} from "@/services/meetupService";

const Meetups = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const exploreRef = useRef(null);

  // States
  const [meetups, setMeetups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [selectedMeetup, setSelectedMeetup] = useState(null);
  const [meetupModal, setMeetupModal] = useState(null);

  // Hämta meetups vid sidstart och på meetup-updated
  useEffect(() => {
    async function fetchMeetups() {
      try {
        setLoading(true);
        const data = await getAllMeetups();
        setMeetups(data);
      } catch (error) {
        toast({
          title: "Fel vid hämtning av meetups",
          description: error.message || "Kunde inte ladda data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchMeetups();

    // Lyssna på meetup-updated event
    const handler = () => fetchMeetups();
    document.addEventListener("meetup-updated", handler);
    return () => {
      document.removeEventListener("meetup-updated", handler);
    };
  }, []);

  // Unika platser för dropdown
  const uniqueLocations = Array.from(new Set(meetups.map((m) => m.location)));

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast({
      title: "Utloggad",
      description: "Du har loggats ut framgångsrikt.",
    });
    navigate("/");
  };

  // Skapa nytt event
  const handleCreateEvent = async (eventData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "Du måste vara inloggad",
          description: "Logga in för att skapa ett meetup.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      const userRaw = localStorage.getItem("user");
      const user = userRaw ? JSON.parse(userRaw) : null;

      const meetupData = {
        title: eventData.title?.trim(),
        description: eventData.info?.trim(),
        date: eventData.date,
        location: eventData.location?.trim(),
        host: (user?.name && user.name.trim()) || user?.email || "Okänd värd",
        maxParticipants: Number(eventData.maxAttendees),
        categories: Array.isArray(eventData.categories)
          ? eventData.categories
          : eventData.categories
          ? [String(eventData.categories).trim()]
          : [],
      };

      await createMeetup(meetupData, token);

      //  Hämta uppdaterad lista från backend så allt är i sync
      const updatedList = await getAllMeetups();
      setMeetups(updatedList);

      toast({
        title: "Meetup skapat!",
        description: `Eventet "${meetupData.title}" har skapats.`,
      });

      document.dispatchEvent(new CustomEvent("meetup-updated"));
    } catch (error) {
      console.error("handleCreateEvent error:", error);
      toast({
        title: "Fel vid skapande av meetup",
        description: error.message || "Kunde inte skapa eventet.",
        variant: "destructive",
      });
    }
  };

  // Gå med i meetup
  const handleRegister = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({ title: "Du måste logga in", variant: "destructive" });
        navigate("/");
        return;
      }

      await joinMeetup(id, token);
      toast({
        title: "Anmäld!",
        description: "Du är nu anmäld till meetupen.",
      });

      const data = await getAllMeetups();
      setMeetups(data);

      // Trigga global refresh
      document.dispatchEvent(new CustomEvent("meetup-updated"));
    } catch (error) {
      toast({
        title: "Kunde inte anmäla dig",
        description: error.message || "Ett fel uppstod.",
        variant: "destructive",
      });
    }
  };

  //  Lämna meetup
  const handleUnregister = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({ title: "Du måste logga in", variant: "destructive" });
        navigate("/");
        return;
      }

      await leaveMeetup(id, token);
      toast({
        title: "Avregistrerad",
        description: "Du har lämnat meetupen.",
      });

      const data = await getAllMeetups();
      setMeetups(data);

      // Trigga global refresh
      document.dispatchEvent(new CustomEvent("meetup-updated"));
    } catch (error) {
      toast({
        title: "Kunde inte avregistrera dig",
        description: error.message || "Ett fel uppstod.",
        variant: "destructive",
      });
    }
  };

  // Filtreringslogik
  const filteredMeetups = meetups.filter((meetup) => {
    const matchesCategory =
      activeCategory === "All" ||
      (Array.isArray(meetup.categories)
        ? meetup.categories.includes(activeCategory)
        : typeof meetup.category === "string" &&
          meetup.category === activeCategory);
    const matchesSearch = meetup.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesLocation =
      !selectedLocation || meetup.location === selectedLocation;

    if (selectedDate) {
      const meetupDate = new Date(meetup.date);
      return (
        matchesCategory &&
        matchesSearch &&
        matchesLocation &&
        meetupDate.getFullYear() === selectedDate.getFullYear() &&
        meetupDate.getMonth() === selectedDate.getMonth() &&
        meetupDate.getDate() === selectedDate.getDate()
      );
    }

    return matchesCategory && matchesSearch && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Sektion */}
      <section className="relative min-h-[80vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/70" />
        </div>

        <Navbar
          onShowProfile={() => setShowProfile(true)}
          onLogout={handleLogout}
        />

        <ProfileModal
          show={showProfile}
          onClose={() => setShowProfile(false)}
          selectedMeetup={selectedMeetup}
          setSelectedMeetup={setSelectedMeetup}
          onLogout={handleLogout}
        />

        <div className="relative h-full container mx-auto px-4 flex flex-col justify-center max-w-5xl pt-12 pb-20">
          <div className="space-y-8 animate-fade-in">
            {/* Main Header */}
            <div className="space-y-4">
              <h1 className="text-6xl md:text-7xl font-extrabold leading-tight tracking-tight">
                Där idéer{" "}
                <span className="bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent font-extrabold">
                  möts
                </span>
                <br />
                och{" "}
                <span className="bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent font-extrabold">
                  människor
                </span>{" "}
                växer.
              </h1>
              <p className="text-2xl text-muted-foreground max-w-3xl leading-relaxed font-medium">
                Upptäck Meetups som förenar nyfikenhet, kreativitet och
                gemenskap. Hitta ditt nästa äventyr – och de människor som gör
                det oförglömligt.
              </p>
            </div>

            {/* Action-knappar */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                size="lg"
                className="text-lg px-8 py-4 h-auto group"
                onClick={() => {
                  if (exploreRef.current) {
                    exploreRef.current.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                <Search className="w-5 h-5 mr-2" />
                Utforska Meetups
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-4 h-auto backdrop-blur-sm bg-background/10 hover:bg-background/20 border-white/30"
                onClick={() => setShowCreateEvent(true)}
              >
                <Plus className="w-5 h-5 mr-2" />
                Anordna en Meetup
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Laddning / innehåll */}
      {loading ? (
        <div className="text-center py-20 text-lg text-muted-foreground">
          Laddar meetups...
        </div>
      ) : (
        <div ref={exploreRef}>
          <UpcomingEventsSection
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            uniqueLocations={uniqueLocations}
            filteredMeetups={filteredMeetups}
            setFilteredMeetups={setMeetups}
            meetupModal={meetupModal}
            setMeetupModal={setMeetupModal}
            handleRegister={handleRegister}
            handleUnregister={handleUnregister}
          />
        </div>
      )}

      {/* Skapa nytt event */}
      <CreateEventModal
        show={showCreateEvent}
        onClose={() => setShowCreateEvent(false)}
        onCreate={handleCreateEvent}
      />

      <Footer />
    </div>
  );
};

export default Meetups;

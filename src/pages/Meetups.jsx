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

  // State
  const [allMeetups, setAllMeetups] = useState([]); 
  const [filteredMeetups, setFilteredMeetups] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Alla");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [selectedMeetup, setSelectedMeetup] = useState(null);
  const [meetupModal, setMeetupModal] = useState(null);

  // Normalisering av ID:n
  const norm = (v) =>
    String((v && (v._id || v.id || v.email || v.name)) ?? v ?? "").trim();
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const currentUserKey = norm(
    currentUser?.id || currentUser?.email || currentUser?.name
  );

  // Hämta meetups EN gång
  useEffect(() => {
    async function fetchMeetups() {
      try {
        setLoading(true);
        const data = await getAllMeetups();
        setAllMeetups(data);
        setFilteredMeetups(data);
        localStorage.setItem("meetups-cache", JSON.stringify(data));
        console.log("Hämtade alla meetups:", data);
      } catch (error) {
        toast({
          title: "Fel vid hämtning av meetups",
          description: error.message || "Kunde inte ladda data",
          variant: "destructive",
        });
      } finally {
        setTimeout(() => setLoading(false), 200);
      }
    }
    fetchMeetups();
  }, []);

  // Lokal filtrering (ingen fetch)
  useEffect(() => {
    if (!allMeetups.length) return;

    let filtered = [...allMeetups];

    // Kategori
    if (activeCategory !== "Alla") {
      filtered = filtered.filter((m) =>
        Array.isArray(m.categories)
          ? m.categories.includes(activeCategory)
          : m.category === activeCategory
      );
    }

    // Plats
    if (selectedLocation) {
      filtered = filtered.filter(
        (m) => m.location === selectedLocation.trim()
      );
    }

    // Sök
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.description?.toLowerCase().includes(q) ||
          m.location?.toLowerCase().includes(q)
      );
    }

    // Datum
    if (selectedDate) {
      const target = new Date(selectedDate).toDateString();
      filtered = filtered.filter(
        (m) => new Date(m.date).toDateString() === target
      );
    }

    setFilteredMeetups(filtered);
  }, [allMeetups, activeCategory, searchQuery, selectedLocation, selectedDate]);

  // Global refresh (vid avanmälan etc.)
  useEffect(() => {
    const refreshMeetups = async () => {
      try {
        console.log("🔁 Global refresh triggered...");
        const data = await getAllMeetups();
        setAllMeetups(data);
        localStorage.setItem("meetups-cache", JSON.stringify(data));
      } catch (err) {
        console.error("Kunde inte uppdatera meetups:", err);
      }
    };

    const handler = () => {
      clearTimeout(window._meetupRefreshTimeout);
      window._meetupRefreshTimeout = setTimeout(refreshMeetups, 300);
    };

    window.addEventListener("refresh-meetups", handler);
    document.addEventListener("meetup-updated", handler);

    return () => {
      window.removeEventListener("refresh-meetups", handler);
      document.removeEventListener("meetup-updated", handler);
    };
  }, []);

  // Unika platser
  const uniqueLocations = Array.from(
    new Set(allMeetups.map((m) => m.location))
  );

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

  // Skapa event
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
        host:
          (user?.name && user.name.trim()) ||
          user?.email ||
          "Okänd värd",
        maxParticipants: Number(eventData.maxAttendees),
        categories: Array.isArray(eventData.categories)
          ? eventData.categories
          : eventData.categories
          ? [String(eventData.categories).trim()]
          : [],
      };

      await createMeetup(meetupData, token);
      const updatedList = await getAllMeetups();
      setAllMeetups(updatedList);
      setFilteredMeetups(updatedList);

      toast({
        title: "Meetup skapat!",
        description: `Eventet "${meetupData.title}" har skapats.`,
      });
    } catch (error) {
      toast({
        title: "Fel vid skapande",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Gå med
  const handleRegister = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({ title: "Du måste logga in", variant: "destructive" });
        navigate("/");
        return;
      }

      await joinMeetup(id, token);

      setAllMeetups((prev) =>
        prev.map((m) => {
          if (m._id !== id) return m;
          const parts = Array.isArray(m.participants) ? m.participants : [];
          if (parts.map(norm).includes(currentUserKey)) return m;
          return { ...m, participants: [...parts, currentUserKey] };
        })
      );

      toast({ title: "Anmäld!", description: "Du är nu anmäld." });
    } catch (error) {
      toast({
        title: "Kunde inte anmäla dig",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Lämna
  const handleUnregister = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({ title: "Du måste logga in", variant: "destructive" });
        navigate("/");
        return;
      }

      await leaveMeetup(id, token);

      setAllMeetups((prev) =>
        prev.map((m) => {
          if (m._id !== id) return m;
          const parts = Array.isArray(m.participants) ? m.participants : [];
          const filtered = parts.filter((p) => norm(p) !== currentUserKey);
          return { ...m, participants: filtered };
        })
      );

      toast({
        title: "Avregistrerad",
        description: "Du har lämnat meetupen.",
      });
    } catch (error) {
      toast({
        title: "Kunde inte avregistrera dig",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
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
          meetups={allMeetups}
          setMeetups={setAllMeetups}
          onUnregister={handleUnregister}
        />

        <div className="relative h-full container mx-auto px-4 flex flex-col justify-center max-w-5xl pt-12 pb-20">
          <div className="space-y-8 animate-fade-in">
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
                gemenskap.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                size="lg"
                className="text-lg px-8 py-4 h-auto group"
                onClick={() =>
                  exploreRef.current?.scrollIntoView({ behavior: "smooth" })
                }
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

      {/* Innehåll */}
      {loading ? (
        <div className="flex justify-center items-center py-20 animate-fade-in text-lg text-muted-foreground">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            <span>Laddar meetups...</span>
          </div>
        </div>
      ) : (
        <div ref={exploreRef} className="animate-fade-in">
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
            setFilteredMeetups={setFilteredMeetups}
            meetupModal={
              meetupModal
                ? { ...filteredMeetups.find((m) => m._id === meetupModal._id) } ||
                  null
                : null
            }
            setMeetupModal={setMeetupModal}
            handleRegister={handleRegister}
            handleUnregister={handleUnregister}
          />
        </div>
      )}

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

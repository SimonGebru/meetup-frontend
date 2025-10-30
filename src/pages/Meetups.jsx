import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CreateEventModal from "@/components/CreateEventModal";
import { Plus, Search, ArrowRight } from "lucide-react";
import UpcomingEventsSection from "@/components/UpcomingEventsSection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProfileModal from "@/components/ProfileModal";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/heroimage-meetup.jpg";

const mockMeetups = [
  {
    id: 1,
    title: "React Advanced Workshop: Byggande av Skalbar Appar",
    date: "Lör, 2 Nov 2024 · 14:00",
    location: "Tech Hub Stockholm",
    attendees: 45,
    maxAttendees: 50,
    category: "Tech",
    info: "En djupdykning i avancerad React och skalbara applikationer. För dig som vill ta dina React-kunskaper till nästa nivå!"
  },
  {
    id: 2,
    title: "Morgonyoga & Kaffe Meetup",
    date: "Sön, 3 Nov 2024 · 08:00",
    location: "Humlegården",
    attendees: 28,
    maxAttendees: 30,
    category: "Sport",
    info: "Starta dagen med yoga i parken och avsluta med en kopp kaffe tillsammans med nya vänner."
  },
  {
    id: 3,
    title: "Digital Konstutställning Vernissage",
    date: "Fre, 1 Nov 2024 · 18:00",
    location: "Moderna Museet",
    attendees: 67,
    maxAttendees: 70,
    category: "Konst",
    info: "Upptäck digital konst från Sveriges mest spännande konstnärer. Mingel och inspiration utlovas!"
  },
  {
    id: 4,
    title: "Streetfood Festival Stockholm 2024",
    date: "Lör, 2 Nov 2024 · 12:00",
    location: "Södermalm Torg",
    attendees: 156,
    maxAttendees: 200,
    category: "Mat",
    info: "Smaka på världens kök! Foodtrucks, musik och härlig stämning mitt i Stockholm."
  },
  {
    id: 5,
    title: "Indie Musik Kväll Live",
    date: "Tor, 31 Okt 2024 · 20:00",
    location: "Debaser Medis",
    attendees: 89,
    maxAttendees: 100,
    category: "Musik",
    info: "En kväll fylld av indieband, livemusik och nya musikaliska upptäckter."
  },
  {
    id: 6,
    title: "Startup Grundare Nätverksträff",
    date: "Ons, 30 Okt 2024 · 18:30",
    location: "SUP46 Innovation Hub",
    attendees: 52,
    maxAttendees: 60,
    category: "Business",
    info: "Möt andra entreprenörer, dela erfarenheter och hitta nya samarbeten inom startupvärlden."
  },
];


const Meetups = () => {
  // Ref for scroll target
  const exploreRef = useRef(null);

  {/* Logout handler */}
  const handleLogout = () => {
    localStorage.removeItem("mockAuth");
    toast({
      title: "Utloggad",
      description: "Du har loggats ut framgångsrikt.",
    });
    navigate("/");
  };
  {/* Date-picker & plats-filter state */}
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState("");

  {/* Unika platser för dropdown */}
  const uniqueLocations = Array.from(new Set(mockMeetups.map(m => m.location)));
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [showProfile, setShowProfile] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [selectedMeetup, setSelectedMeetup] = useState(null);
  const [meetupModal, setMeetupModal] = useState(null); // För att hantera visning av MeetupInfoModal
  const [registeredMeetupIds, setRegisteredMeetupIds] = useState(() => {
    {/* Load from localStorage or default to [1,3,5] */}
    const stored = localStorage.getItem("registeredMeetupIds");
    return stored ? JSON.parse(stored) : [1, 3, 5];
  });

  {/* Skapa event (mock, kan utökas) */}
  const handleCreateEvent = (eventData) => {
    toast({ title: "Event skapat!", description: `Eventet '${eventData.title}' har skapats.` });
  };

  const userMeetups = mockMeetups.filter(m => registeredMeetupIds.includes(m.id));

  {/* Register/unregister logik */}
  const handleRegister = (id) => {
    if (!registeredMeetupIds.includes(id)) {
      const meetup = mockMeetups.find(m => m.id === id);
      if (meetup && meetup.attendees >= meetup.maxAttendees) {
        toast({ title: "Fullbokat", description: "Detta event har nått max antal deltagare." });
        return;
      }
      const updated = [...registeredMeetupIds, id];
      setRegisteredMeetupIds(updated);
      localStorage.setItem("registeredMeetupIds", JSON.stringify(updated));
      toast({ title: "Anmäld!", description: "Du är nu anmäld till detta meetup." });
    }
  };
  const handleUnregister = (id) => {
    if (registeredMeetupIds.includes(id)) {
      const updated = registeredMeetupIds.filter(mid => mid !== id);
      setRegisteredMeetupIds(updated);
      localStorage.setItem("registeredMeetupIds", JSON.stringify(updated));
      toast({ title: "Avregistrerad", description: "Du är inte längre anmäld till detta meetup." });
    }
  };

  {/* Datum & plats filter logik */}
  const filteredMeetups = mockMeetups.filter((meetup) => {
    const matchesCategory = activeCategory === "All" || meetup.category === activeCategory;
    const matchesSearch = meetup.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = !selectedLocation || meetup.location === selectedLocation;
    {/* Om ett datum är valt, filtrera på det datumet (ignorera tid) */}
    if (selectedDate) {
      const meetupDate = new Date(meetup.date.replace(/^[^,]+,\s*/, '').replace(/·.*$/, ''));
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
        {/* Navbaren */}
        <Navbar onShowProfile={() => setShowProfile(true)} onLogout={handleLogout} />
        {/* Profil Modalen */}
        <ProfileModal
          show={showProfile}
          onClose={() => setShowProfile(false)}
          userMeetups={userMeetups}
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
                och <span className="bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent font-extrabold">människor</span> växer.
              </h1>
              <p className="text-2xl text-muted-foreground max-w-3xl leading-relaxed font-medium">
                Upptäck Meetups som förenar nyfikenhet, kreativitet och gemenskap.
                Hitta ditt nästa äventyr – och de människor som gör det oförglömligt.
              </p>
            </div>
            {/* Action Knappar */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              {/* Scroll to UpcomingEventsSection on click */}
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

      {/* Kommande evenemang-sektion */}
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
          meetupModal={meetupModal}
          setMeetupModal={setMeetupModal}
          handleRegister={handleRegister}
          handleUnregister={handleUnregister}
          registeredMeetupIds={registeredMeetupIds}
        />
      </div>
      <CreateEventModal
        show={showCreateEvent}
        onClose={() => setShowCreateEvent(false)}
        onCreate={handleCreateEvent}
      />
      <Footer />
    </div>
  );
}

export default Meetups;
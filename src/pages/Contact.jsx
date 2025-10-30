import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProfileModal from "@/components/ProfileModal";
import heroImage from "@/assets/heroimage-meetup.jpg";
import { Mail, MessageSquare, User } from "lucide-react";

const Contact = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [selectedMeetup, setSelectedMeetup] = useState(null);
  const [registeredMeetupIds, setRegisteredMeetupIds] = useState(() => {
    const stored = localStorage.getItem("registeredMeetupIds");
    return stored ? JSON.parse(stored) : [1, 3];
  });
  const mockMeetups = [
    {
      id: 1,
      title: "React Advanced Workshop: Byggande av Skalbar Appar",
      date: "Lör, 2 Nov 2024 · 14:00",
      location: "Tech Hub Stockholm",
      attendees: 45,
      maxAttendees: 50,
      category: "Tech",
      info: "En djupdykning i avancerad React och skalbara applikationer. För dig som vill ta dina React-kunskaper till nästa nivå!",
    },
    {
      id: 2,
      title: "Morgonyoga & Kaffe Meetup",
      date: "Sön, 3 Nov 2024 · 08:00",
      location: "Humlegården",
      attendees: 28,
      maxAttendees: 30,
      category: "Sport",
      info: "Starta dagen med yoga i parken och avsluta med en kopp kaffe tillsammans med nya vänner.",
    },
    {
      id: 3,
      title: "Digital Konstutställning Vernissage",
      date: "Fre, 1 Nov 2024 · 18:00",
      location: "Moderna Museet",
      attendees: 67,
      maxAttendees: 70,
      category: "Konst",
      info: "Upptäck digital konst från Sveriges mest spännande konstnärer. Mingel och inspiration utlovas!",
    },
  ];
  const userMeetups = mockMeetups.filter((m) =>
    registeredMeetupIds.includes(m.id)
  );
  const handleLogout = () => {
    localStorage.removeItem("mockAuth");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <section className="relative min-h-[80vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/70" />
        </div>
        <div className="relative z-20">
          <Navbar onShowProfile={() => setShowProfile(true)} />
        </div>
        <div className="relative z-10 w-full flex flex-col items-center animate-fade-in mt-8">
          <div className="max-w-2xl w-full mx-auto px-4">
            <div className="bg-card/80 rounded-3xl shadow-2xl border border-border/60 p-8 md:p-12 backdrop-blur-xl bg-background/80 mt-8 mb-8">
              <div className="flex flex-col gap-10">
                <div className="flex items-center gap-3 mb-2">
                  <Mail className="text-primary w-8 h-8" />
                  <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
                    Kontakta{" "}
                    <span className="bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
                      MeetUpz
                    </span>
                  </h1>
                </div>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-medium mb-2">
                  Har du frågor, feedback eller vill du samarbeta? Hör gärna av
                  dig till oss – vi älskar att prata community och evenemang!
                </p>
                <div className="flex flex-col gap-8 justify-center mt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="text-primary w-6 h-6" />
                    <h2 className="text-2xl font-bold text-primary">
                      Kontaktformulär
                    </h2>
                  </div>
                  <form className="space-y-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-semibold mb-1 text-foreground flex items-center gap-1"
                      >
                        <User className="w-4 h-4 text-muted-foreground" /> Namn
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        className="w-full rounded-lg border border-border bg-background/60 p-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-inner"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-semibold mb-1 text-foreground flex items-center gap-1"
                      >
                        <Mail className="w-4 h-4 text-muted-foreground" />{" "}
                        E-post
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="w-full rounded-lg border border-border bg-background/60 p-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-inner"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-semibold mb-1 text-foreground flex items-center gap-1"
                      >
                        <MessageSquare className="w-4 h-4 text-muted-foreground" />{" "}
                        Meddelande
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        required
                        className="w-full rounded-lg border border-border bg-background/60 p-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-inner resize-none"
                        placeholder="Vad vill du prata om?"
                      />
                    </div>
                    <div className="flex justify-center pt-2">
                      <button
                        type="submit"
                        className="bg-primary text-primary-foreground font-bold px-8 py-3 rounded-xl shadow-lg hover:bg-primary/90 transition-all text-lg"
                      >
                        Skicka meddelande
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ProfileModal
        show={showProfile}
        onClose={() => setShowProfile(false)}
        userMeetups={userMeetups}
        selectedMeetup={selectedMeetup}
        setSelectedMeetup={setSelectedMeetup}
        onLogout={handleLogout}
      />
      <Footer />
    </div>
  );
};

export default Contact;

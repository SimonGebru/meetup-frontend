import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProfileModal from "@/components/ProfileModal";
import heroImage from "@/assets/heroimage-meetup.jpg";
import { FileText, ShieldCheck, Users, Mail } from "lucide-react";

const TITLE_HEIGHT = "min-h-[60px] md:min-h-[56px] lg:min-h-[48px]";
const TITLE_CLASS = "";

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

const TermsOfUse = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [selectedMeetup, setSelectedMeetup] = useState(null);
  const [registeredMeetupIds, setRegisteredMeetupIds] = useState(() => {
    const stored = localStorage.getItem("registeredMeetupIds");
    return stored ? JSON.parse(stored) : [1, 3];
  });
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
          <div className="max-w-5xl w-full mx-auto px-4">
            <div className="bg-card/80 rounded-3xl shadow-2xl border border-border/60 p-8 md:p-12 backdrop-blur-xl bg-background/80 mt-8 mb-8">
              <div className="flex flex-col gap-10">
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="text-primary w-8 h-8" />
                  <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
                    Användarvillkor
                  </h1>
                </div>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-medium mb-2">
                  Läs igenom våra användarvillkor för att förstå dina
                  rättigheter och skyldigheter när du använder
                  MeetUpz-plattformen.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 items-start">
                  <div className="flex flex-col gap-6 justify-start">
                    <div
                      className={`flex items-center gap-2 mt-4 ${TITLE_HEIGHT}`}
                    >
                      <ShieldCheck className="text-primary w-6 h-6" />
                      <h2
                        className={`text-2xl font-bold text-primary ${TITLE_CLASS}`}
                      >
                        1. Godkännande av villkor
                      </h2>
                    </div>
                    <p className="text-base text-foreground/90">
                      Genom att använda denna webbplats godkänner du att följa
                      och vara bunden av dessa användarvillkor. Om du inte
                      accepterar villkoren bör du inte använda tjänsten.
                    </p>
                  </div>
                  <div className="flex flex-col gap-6 justify-start">
                    <div
                      className={`flex items-center gap-2 mt-4 ${TITLE_HEIGHT}`}
                    >
                      <Users className="text-primary w-6 h-6" />
                      <h2
                        className={`text-2xl font-bold text-primary ${TITLE_CLASS}`}
                      >
                        2. Användning av tjänsten
                      </h2>
                    </div>
                    <ul className="list-disc list-inside text-foreground/80 space-y-2 mb-2 pl-4">
                      <li>
                        Du får endast använda plattformen för lagliga ändamål.
                      </li>
                      <li>
                        Du ansvarar för all information du delar och aktiviteter
                        du utför på plattformen.
                      </li>
                      <li>
                        Vi förbehåller oss rätten att stänga av eller ta bort
                        användare som bryter mot dessa villkor.
                      </li>
                    </ul>
                  </div>
                  <div className="flex flex-col gap-6 justify-start">
                    <div
                      className={`flex items-center gap-2 mt-4 ${TITLE_HEIGHT}`}
                    >
                      <FileText className="text-primary w-6 h-6" />
                      <h2
                        className={`text-2xl font-bold text-primary ${TITLE_CLASS}`}
                      >
                        3. Immateriella rättigheter
                      </h2>
                    </div>
                    <p className="text-base text-foreground/90">
                      Allt innehåll på denna webbplats, inklusive text, grafik
                      och logotyper, tillhör MeetUpz eller dess licensgivare och
                      skyddas av upphovsrättslagar.
                    </p>
                  </div>
                  <div className="flex flex-col gap-6 justify-start">
                    <div
                      className={`flex items-center gap-2 mt-4 ${TITLE_HEIGHT}`}
                    >
                      <ShieldCheck className="text-primary w-6 h-6" />
                      <h2
                        className={`text-2xl font-bold text-primary ${TITLE_CLASS}`}
                      >
                        4. Ansvarsbegränsning
                      </h2>
                    </div>
                    <p className="text-base text-foreground/90">
                      MeetUpz ansvarar inte för eventuella skador som uppstår
                      till följd av användning av plattformen.
                    </p>
                  </div>
                  <div className="flex flex-col gap-6 justify-start">
                    <div
                      className={`flex items-center gap-2 mt-4 ${TITLE_HEIGHT}`}
                    >
                      <FileText className="text-primary w-6 h-6" />
                      <h2
                        className={`text-2xl font-bold text-primary ${TITLE_CLASS}`}
                      >
                        5. Ändringar av villkor
                      </h2>
                    </div>
                    <p className="text-base text-foreground/90">
                      Vi kan när som helst uppdatera dessa användarvillkor.
                      Ändringar publiceras på denna sida och gäller omedelbart
                      efter publicering.
                    </p>
                  </div>
                  <div className="flex flex-col gap-6 justify-start">
                    <div
                      className={`flex items-center gap-2 mt-4 ${TITLE_HEIGHT}`}
                    >
                      <Mail className="text-primary w-6 h-6" />
                      <h2
                        className={`text-2xl font-bold text-primary ${TITLE_CLASS}`}
                      >
                        6. Kontakt
                      </h2>
                    </div>
                    <p className="text-base text-foreground/90">
                      Om du har frågor om våra användarvillkor är du välkommen
                      att kontakta oss på{" "}
                      <a
                        href="mailto:kontakt@meetupz.se"
                        className="underline hover:text-primary"
                      >
                        kontakt@meetupz.se
                      </a>
                      .
                    </p>
                  </div>
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

export default TermsOfUse;

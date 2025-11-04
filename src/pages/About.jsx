import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProfileModal from "@/components/ProfileModal";
import heroImage from "@/assets/heroimage-meetup.jpg";
import { Users, Sparkles, ShieldCheck, UserPlus } from "lucide-react";

const About = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [selectedMeetup, setSelectedMeetup] = useState(null);
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
            <div className="bg-card/80 rounded-3xl shadow-2xl border border-border/60 p-8 md:p-12 backdrop-blur-xl mt-8 mb-8">
              <div className="flex flex-col gap-10">
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="text-primary w-8 h-8" />
                  <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
                    Om{" "}
                    <span className="bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
                      MeetUpz
                    </span>
                  </h1>
                </div>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-medium mb-2">
                  MeetUpz är en plattform skapad för att förena människor, idéer
                  och passioner. Vi tror på kraften i möten – oavsett om det
                  handlar om att lära sig nytt, hitta vänner eller skapa
                  minnesvärda upplevelser tillsammans.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 items-start">
                  <div className="flex flex-col gap-6 justify-center">
                    <div className="flex items-center gap-2 mt-4 min-h-[48px]">
                      <Users className="text-primary w-6 h-6" />
                      <h2 className="text-2xl font-bold text-primary">
                        Vår vision
                      </h2>
                    </div>
                    <p className="text-base text-foreground/90">
                      Vi vill göra det enkelt och roligt att hitta, skapa och
                      delta i meetups inom alla möjliga intresseområden. Oavsett
                      om du är ny i stan, vill utveckla dina kunskaper eller
                      bara träffa likasinnade – här finns något för dig.
                    </p>
                  </div>
                  <div className="flex flex-col gap-6 justify-center">
                    <div className="flex items-center gap-2 mt-4 min-h-[48px]">
                      <ShieldCheck className="text-accent w-6 h-6" />
                      <h2 className="text-xl font-semibold text-accent">
                        Vad gör MeetUpz unikt?
                      </h2>
                    </div>
                    <ul className="list-disc list-inside text-foreground/80 space-y-2 mb-2 pl-4">
                      <li>Modern, tillgänglig och mobilvänlig design</li>
                      <li>
                        Smarta filter och sökfunktioner för att hitta rätt event
                      </li>
                      <li>Enkel anmälan och översikt över dina meetups</li>
                      <li>Fokus på gemenskap, trygghet och inspiration</li>
                    </ul>
                  </div>
                  <div className="flex flex-col gap-6 justify-center">
                    <div className="flex items-center gap-2 mt-4 min-h-[48px]">
                      <UserPlus className="text-primary w-6 h-6" />
                      <h2 className="text-xl font-semibold text-primary">
                        Bli en del av MeetUpz
                      </h2>
                    </div>
                    <p className="text-base text-foreground/90 mb-2">
                      Skapa ett konto, utforska kommande evenemang eller starta
                      ditt eget meetup. Tillsammans bygger vi ett starkare och
                      roligare community!
                    </p>
                    <div className="flex justify-center lg:justify-start mt-2">
                      <a
                        href="/meetups"
                        className="inline-block bg-primary text-primary-foreground font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-primary/90 transition-all text-lg"
                      >
                        Utforska Meetups
                      </a>
                    </div>
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
        selectedMeetup={selectedMeetup}
        setSelectedMeetup={setSelectedMeetup}
        onLogout={handleLogout}
      />
      <Footer />
    </div>
  );
};

export default About;

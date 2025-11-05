import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProfileModal from "@/components/Profile/ProfileModal";
import heroImage from "@/assets/heroimage-meetup.jpg";

const TermsOfUse = () => {
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
          <div className="max-w-2xl w-full mx-auto px-4">
            <div className="bg-card/80 rounded-3xl shadow-2xl border border-border/60 p-8 md:p-12 backdrop-blur-xl mt-8 mb-8">
              <div className="flex flex-col gap-10">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
                    Användarvillkor
                  </h1>
                </div>
                <div className="text-lg md:text-xl text-muted-foreground leading-relaxed font-medium mb-2 space-y-4">
                  <p>
                    Välkommen till MeetUpz! Genom att använda vår tjänst
                    godkänner du följande användarvillkor. Läs dem noggrant
                    innan du fortsätter.
                  </p>
                  <h2 className="text-2xl font-bold text-primary mt-6 mb-2">
                    1. Allmänt
                  </h2>
                  <p>
                    MeetUpz är en plattform för att skapa, hitta och delta i
                    evenemang. Du ansvarar själv för den information du delar
                    och de evenemang du deltar i.
                  </p>
                  <h2 className="text-2xl font-bold text-primary mt-6 mb-2">
                    2. Användarkonto
                  </h2>
                  <p>
                    Du måste vara minst 16 år för att skapa ett konto. Du
                    ansvarar för att hålla dina inloggningsuppgifter säkra och
                    för all aktivitet som sker via ditt konto.
                  </p>
                  <h2 className="text-2xl font-bold text-primary mt-6 mb-2">
                    3. Innehåll och uppförande
                  </h2>
                  <p>
                    Det är inte tillåtet att publicera olämpligt, stötande eller
                    olagligt innehåll. MeetUpz förbehåller sig rätten att ta
                    bort innehåll och stänga av användare som bryter mot dessa
                    regler.
                  </p>
                  <h2 className="text-2xl font-bold text-primary mt-6 mb-2">
                    4. Ansvarsbegränsning
                  </h2>
                  <p>
                    MeetUpz ansvarar inte för eventuella skador eller förluster
                    som uppstår genom användning av tjänsten eller deltagande i
                    evenemang.
                  </p>
                  <h2 className="text-2xl font-bold text-primary mt-6 mb-2">
                    5. Ändringar av villkor
                  </h2>
                  <p>
                    Vi kan komma att uppdatera dessa villkor. Vid större
                    ändringar informerar vi dig via e-post eller på plattformen.
                  </p>
                  <h2 className="text-2xl font-bold text-primary mt-6 mb-2">
                    6. Kontakt
                  </h2>
                  <p>
                    Vid frågor om användarvillkoren, kontakta oss på
                    support@meetupz.se.
                  </p>
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

export default TermsOfUse;

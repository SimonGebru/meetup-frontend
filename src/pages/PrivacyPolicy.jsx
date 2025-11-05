import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProfileModal from "@/components/Profile/ProfileModal";
import heroImage from "@/assets/heroimage-meetup.jpg";
import { ShieldCheck, User, Mail } from "lucide-react";

const TITLE_HEIGHT = "min-h-[56px] lg:min-h-[48px]";

const PrivacyPolicy = () => {
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
                  <ShieldCheck className="text-primary w-8 h-8" />
                  <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
                    Integritetspolicy
                  </h1>
                </div>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-medium mb-2">
                  Din integritet är viktig för oss. Här förklarar vi hur vi
                  samlar in, använder och skyddar din information på MeetUpz.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
                  <div className="flex flex-col gap-6 justify-start">
                    <div className={`flex items-center gap-2 ${TITLE_HEIGHT}`}>
                      <User className="text-primary w-6 h-6" />
                      <h3 className="text-xl font-bold text-primary">
                        Vilken data vi samlar in
                      </h3>
                    </div>
                    <ul className="list-disc list-inside text-foreground/80 space-y-2 mb-2 pl-4">
                      <li>Personuppgifter (namn, e-post, profilbild)</li>
                      <li>
                        Användargenererat innehåll (evenemang, kommentarer)
                      </li>
                      <li>Teknisk data (IP-adress, enhet, webbläsare)</li>
                    </ul>
                  </div>
                  <div className="flex flex-col gap-6 justify-start">
                    <div className={`flex items-center gap-2 ${TITLE_HEIGHT}`}>
                      <ShieldCheck className="text-primary w-6 h-6" />
                      <h3 className="text-xl font-bold text-primary">
                        Hur vi använder din data
                      </h3>
                    </div>
                    <ul className="list-disc list-inside text-foreground/80 space-y-2 mb-2 pl-4">
                      <li>För att tillhandahålla och förbättra tjänsten</li>
                      <li>För att kommunicera med dig om evenemang</li>
                      <li>För att skydda mot bedrägeri och missbruk</li>
                    </ul>
                  </div>
                  <div className="flex flex-col gap-6 justify-start">
                    <div className={`flex items-center gap-2 ${TITLE_HEIGHT}`}>
                      <Mail className="text-primary w-6 h-6" />
                      <h3 className="text-xl font-bold text-primary">
                        Dina rättigheter & kontakt
                      </h3>
                    </div>
                    <ul className="list-disc list-inside text-foreground/80 space-y-2 mb-2 pl-4">
                      <li>
                        Du kan begära tillgång till, rättelse eller radering av
                        dina uppgifter
                      </li>
                      <li>
                        Kontakta oss på{" "}
                        <a
                          href="mailto:kontakt@meetupz.se"
                          className="underline hover:text-primary"
                        >
                          kontakt@meetupz.se
                        </a>
                      </li>
                    </ul>
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

export default PrivacyPolicy;

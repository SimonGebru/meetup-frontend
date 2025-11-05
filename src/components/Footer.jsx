import { Sparkles } from "lucide-react";

const Footer = () => (
  <footer className="w-full min-h-[64px] py-8 bg-background border-t border-border flex flex-col items-center flex-shrink-0">
    <div className="container mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-6 animate-fade-in">
      <div className="flex flex-col items-center md:items-start gap-1">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-primary" />
          <span className="text-xl font-extrabold text-white tracking-tight">
            MeetUpz
          </span>
        </div>
        <span className="text-xs text-muted-foreground mt-1">
          Där möten blir minnen
        </span>
      </div>
      <nav className="flex flex-wrap gap-6 text-muted-foreground text-sm">
        <a href="/about" className="hover:text-primary transition-colors">
          Om oss
        </a>
        <a href="/contact" className="hover:text-primary transition-colors">
          Kontakt
        </a>
        <a href="/privacy" className="hover:text-primary transition-colors">
          Integritetspolicy
        </a>
        <a href="/terms" className="hover:text-primary transition-colors">
          Användarvillkor
        </a>
      </nav>
      <div className="text-xs text-muted-foreground text-center md:text-right">
        &copy; {new Date().getFullYear()} MeetUpz. Alla rättigheter förbehållna.
      </div>
    </div>
  </footer>
);

export default Footer;

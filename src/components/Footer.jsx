import { Sparkles } from "lucide-react";

const Footer = () => (
  <footer className="w-full border-t border-border/60 bg-background/80 backdrop-blur-sm">
    <div className="container mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Sparkles className="w-6 h-6 text-primary" />
        <span className="text-xl font-extrabold text-white tracking-tight">MeetUpz</span>
      </div>
      <nav className="flex flex-wrap gap-6 text-muted-foreground text-sm">
        <a href="#" className="hover:text-primary transition-colors">Om oss</a>
        <a href="#" className="hover:text-primary transition-colors">Kontakt</a>
        <a href="#" className="hover:text-primary transition-colors">Integritetspolicy</a>
        <a href="#" className="hover:text-primary transition-colors">Användarvillkor</a>
      </nav>
      <div className="text-xs text-muted-foreground text-center md:text-right">
        &copy; {new Date().getFullYear()} MeetUp. Alla rättigheter förbehållna.
      </div>
    </div>
  </footer>
);

export default Footer;

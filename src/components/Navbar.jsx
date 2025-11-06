import { Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import favicon from "@/assets/favicon.png";

const Navbar = ({ onShowProfile }) => (
  <div className="relative z-10 w-full">
    <div className="container mx-auto px-4 py-6 flex justify-between items-center">
      <a href="/meetups" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
      <img 
  src={favicon} 
  alt="MeetUpz logo" 
  className="w-12 h-12 object-contain drop-shadow-sm"
/>
        <span className="text-2xl font-extrabold text-white tracking-tight">MeetUpz</span>
      </a>
      <div className="flex items-center gap-2">
        <Button
          onClick={onShowProfile}
          variant="outline"
          size="sm"
          className="backdrop-blur-sm bg-background/10 hover:bg-background/20 border-white/20 text-foreground"
        >
          <User className="w-4 h-4 mr-2" />
          Min Profil
        </Button>
      </div>
    </div>
  </div>
);

export default Navbar;

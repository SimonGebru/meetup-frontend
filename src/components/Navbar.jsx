import { Sparkles, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = ({ onShowProfile, onLogout }) => (
  <div className="relative z-10 w-full">
    <div className="container mx-auto px-4 py-6 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Sparkles className="w-8 h-8 text-primary" />
        <span className="text-2xl font-extrabold text-white tracking-tight">MeetUpz</span>
      </div>
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

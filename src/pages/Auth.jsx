import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight } from "lucide-react";
import { CheckCircle2, Lock, Mail, Sparkles, User } from "lucide-react";
import heroImage from "@/assets/heroimage-meetup.jpg";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    
    {/*/ Mock login */}
    setTimeout(() => {
      localStorage.setItem("mockAuth", JSON.stringify({ email, authenticated: true }));
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
      });
      navigate("/meetups");
    }, 1000);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    
  {/*/ Mock registration */}
    setTimeout(() => {
      localStorage.setItem("mockAuth", JSON.stringify({ email, authenticated: true }));
      toast({
        title: "Account created!",
        description: "Welcome to the community.",
      });
      navigate("/meetups");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Vänstersidan - Hero */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/20 via-accent/10 to-background relative overflow-hidden p-12 flex-col justify-center items-center">
        {/* Hero Image */}
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="People meeting and connecting" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="relative z-10 space-y-8 text-center max-w-lg animate-fade-in">

          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-white drop-shadow-lg tracking-tight">
              Hitta din nästa
              <br />
              <span className="bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent font-extrabold">
                fantastiska upplevelse
              </span>
            </h1>
            <p className="text-xl text-gray-200 max-w-md mx-auto leading-relaxed font-medium">
              Anslut dig till tusentals personer som delar dina intressen. Upptäck lokala meetups, träffa nya vänner och skapa minnen för livet.
            </p>
            
            {/* Feature highlights */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
              <div className="flex items-center gap-2 text-white/90">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium">Lokala meetups</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium">Säkra anmälningar</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium">Gratis att använda</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),transparent)]" />
      </div>

      {/* Högersidan - Auth Forms */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-background to-muted/20">
        <div className="w-full max-w-md animate-fade-in">
          <div className="text-center mb-8 space-y-2">
            <div className="inline-flex items-center gap-2 justify-center w-auto h-16 mb-4 px-4">
              <Sparkles className="w-12 h-12 text-primary" />
              <span className="text-3xl font-extrabold text-white tracking-tight">MeetUpz</span>
            </div>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-muted/50 p-1 rounded-xl">
              <TabsTrigger 
                value="login" 
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
              >
                Logga in
              </TabsTrigger>
              <TabsTrigger 
                value="register"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
              >
                Registrera
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <Mail className="w-5 h-5 text-primary" />
                    Logga in
                  </CardTitle>
                  <CardDescription>
                    Logga in för att se dina Meetups och anmälningar
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        E-post
                      </Label>
                      <Input
                        id="login-email"
                        name="email"
                        type="email"
                        placeholder="din@epost.se"
                        autoComplete="username"
                        className="h-12 transition-all focus:ring-2 focus:ring-primary/20"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Lösenord
                      </Label>
                      <Input
                        id="login-password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        className="h-12 transition-all focus:ring-2 focus:ring-primary/20"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full h-12 text-base font-medium transition-all hover:shadow-lg hover:scale-105 group"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        "Loggar in..."
                      ) : (
                        <>
                          Logga in
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Skapa konto
                  </CardTitle>
                  <CardDescription>
                    Bli medlem i vår community och hitta din nästa upplevelse
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRegister} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="register-name" className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Fullständigt namn
                      </Label>
                      <Input
                        id="register-name"
                        name="name"
                        type="text"
                        placeholder="Anna Andersson"
                        className="h-12 transition-all focus:ring-2 focus:ring-primary/20"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email" className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        E-post
                      </Label>
                      <Input
                        id="register-email"
                        name="email"
                        type="email"
                        placeholder="din@epost.se"
                        className="h-12 transition-all focus:ring-2 focus:ring-primary/20"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password" className="flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Lösenord
                      </Label>
                      <Input
                        id="register-password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        className="h-12 transition-all focus:ring-2 focus:ring-primary/20"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full h-12 text-base font-medium transition-all hover:shadow-lg hover:scale-105 group"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        "Skapar konto..."
                      ) : (
                        <>
                          Skapa konto
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Auth;

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CategoryFilter from "@/components/CategoryFilter";
import EventCard from "@/components/MeetupCard";
import MeetupInfoModal from "@/components/MeetupInfoModal";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

const UpcomingEventsSection = ({
  searchQuery = "",
  setSearchQuery = () => {},
  activeCategory = "All",
  setActiveCategory = () => {},
  selectedDate = null,
  setSelectedDate = () => {},
  selectedLocation = "",
  setSelectedLocation = () => {},
  uniqueLocations = [],
  filteredMeetups = [],
  setFilteredMeetups = () => {},
  meetupModal = null,
  setMeetupModal = () => {},
  handleRegister = () => {},
  handleUnregister = () => {},
  registeredMeetupIds = [],
}) => {
  const now = new Date();

  // Håll koll på om filter nyligen ändrats
  const [filtering, setFiltering] = useState(false);
  useEffect(() => {
    setFiltering(true);
    const t = setTimeout(() => setFiltering(false), 120); 
    return () => clearTimeout(t);
  }, [searchQuery, activeCategory, selectedDate, selectedLocation]);

  // Se till att vi alltid använder senaste versionen av meetupen
  const liveMeetupModal = useMemo(() => {
    if (!meetupModal || !filteredMeetups?.length) return null;
    return filteredMeetups.find((m) => m._id === meetupModal._id) || null;
  }, [meetupModal, filteredMeetups]);

  const upcomingMeetups = filteredMeetups.filter((m) => {
    const meetupDate = new Date(m.date);
    return meetupDate.getTime() + 60 * 60 * 1000 >= now.getTime();
  });

  return (
    <section className="py-16 bg-gradient-to-b from-muted/30 to-background border-b border-border/50 overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Titel */}
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight text-foreground drop-shadow-sm">
            Utforska kommande meetups
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Hitta inspiration, nätverka och utvecklas tillsammans med andra.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Filterkolumn */}
          <aside className="lg:w-80 w-full flex-shrink-0 mb-8 lg:mb-0">
            <div className="mb-8 space-y-6">
              {/* Sök */}
              <div className="space-y-1">
                <label
                  htmlFor="search-input"
                  className="block text-xs font-semibold text-muted-foreground mb-1"
                >
                  Sök
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="search-input"
                    type="text"
                    placeholder="Sök evenemang..."
                    className="pl-12 pr-6 h-12 text-base rounded-xl border-2 focus:border-primary/50 shadow bg-background/80 backdrop-blur-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0 rounded-full"
                    >
                      ✕
                    </Button>
                  )}
                </div>
              </div>

              {/* Plats */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Plats
                </label>
                <select
                  className="w-full rounded-lg border border-border bg-background py-2 px-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  <option value="">Alla platser</option>
                  {uniqueLocations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Kategori */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Kategori
                </label>
                <CategoryFilter
                  activeCategory={activeCategory}
                  onCategoryChange={setActiveCategory}
                />
              </div>

              {/* Datum */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Datum
                </label>
                <div className="bg-background/80 rounded-2xl shadow-lg border border-border/50 p-2">
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    showOutsideDays
                    weekStartsOn={1}
                    modifiersClassNames={{
                      selected: "bg-primary text-white",
                      today: "border border-primary",
                    }}
                    className="[&_.rdp-day_selected]:bg-primary [&_.rdp-day_selected]:text-white [&_.rdp-day]:rounded-lg"
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Eventkort */}
          <main className="flex-1 min-w-0">
            <div className="mb-8">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {activeCategory === "All"
                  ? "Kommande evenemang"
                  : `${activeCategory} evenemang`}
              </h2>
              <div className="flex items-center gap-2 text-muted-foreground mt-2">
                <Calendar className="w-4 h-4" />
                <p className="text-lg">
                  {upcomingMeetups.length} evenemang hittade
                </p>
              </div>
            </div>

            
            <motion.div
              layout
              transition={{
                layout: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] },
              }}
              className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 ${
                filtering ? "opacity-90" : "opacity-100"
              } transition-opacity duration-200`}
            >
              <AnimatePresence>
                {upcomingMeetups.length > 0 ? (
                  upcomingMeetups.map((meetup) => (
                    <motion.div
                      key={meetup._id}
                      layout
                      initial={{ opacity: 0, scale: 0.98, y: 5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.97, y: -5 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      onClick={() => {
                        const fresh = filteredMeetups.find(
                          (m) => m._id === meetup._id
                        );
                        setMeetupModal({ ...fresh });
                      }}
                      className="cursor-pointer"
                    >
                      <EventCard {...meetup} />
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    key="no-results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="col-span-full text-center py-20"
                  >
                    <div className="space-y-4 max-w-md mx-auto">
                      <div className="w-16 h-16 mx-auto bg-muted/50 rounded-full flex items-center justify-center">
                        <Search className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-2xl font-semibold">
                        Inga kommande evenemang
                      </h3>
                      <p className="text-muted-foreground text-lg">
                        Alla aktuella evenemang har redan passerat.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSearchQuery("");
                          setActiveCategory("All");
                        }}
                        className="mt-4"
                      >
                        Rensa filter
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* 🪄 Modal */}
            {liveMeetupModal && (
              <MeetupInfoModal
                meetup={liveMeetupModal}
                allMeetups={filteredMeetups}
                isRegistered={registeredMeetupIds?.includes(liveMeetupModal.id)}
                onRegister={handleRegister}
                onUnregister={handleUnregister}
                onClose={() => setMeetupModal(null)}
              />
            )}
          </main>
        </div>
      </div>
    </section>
  );
};

export default UpcomingEventsSection;

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
  // Beräkna “kommande meetups” med tidszons-buffert (+1h)
  const now = new Date();
  const upcomingMeetups = filteredMeetups.filter((m) => {
    const meetupDate = new Date(m.date);
    return meetupDate.getTime() + 60 * 60 * 1000 >= now.getTime();
  });

  return (
    <section className="py-16 bg-gradient-to-b from-muted/30 to-background border-b border-border/50">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Titel och intro */}
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight text-foreground drop-shadow-sm">
            Utforska kommande meetups
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-2">
            Hitta inspiration, nätverka och utvecklas tillsammans med andra.
            Använd de smarta filtren för att snabbt hitta evenemang som passar
            just dig.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Filtreringskolumn */}
          <aside className="lg:w-80 w-full flex-shrink-0 mb-8 lg:mb-0">
            <div className="mb-8 space-y-6">
              {/*  Sökfält */}
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
                    placeholder="Sök evenemang efter namn, ämne eller plats..."
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

              {/* Platsfilter */}
              <div className="space-y-1">
                <label
                  htmlFor="location-filter"
                  className="block text-xs font-semibold text-muted-foreground mb-1"
                >
                  Plats
                </label>
                <select
                  id="location-filter"
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
                {selectedLocation && (
                  <button
                    className="mt-2 text-xs text-primary hover:underline"
                    onClick={() => setSelectedLocation("")}
                  >
                    Rensa platsfilter
                  </button>
                )}
              </div>

              {/* Kategorifilter */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Kategori
                </label>
                <CategoryFilter
                  activeCategory={activeCategory}
                  onCategoryChange={setActiveCategory}
                />
              </div>

              {/* Datumfilter */}
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
                  {selectedDate && (
                    <button
                      className="mt-2 text-xs text-primary hover:underline"
                      onClick={() => setSelectedDate(null)}
                    >
                      Rensa datumfilter
                    </button>
                  )}
                </div>
              </div>
            </div>
          </aside>

          {/* Event-kort */}
          <main className="flex-1 min-w-0">
            <div className="mb-8">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {activeCategory === "All"
                  ? "Kommande evenemang"
                  : `${activeCategory} evenemang`}
              </h2>
              <div className="flex items-center gap-2 text-muted-foreground mt-2">
                <Calendar className="w-4 h-4" />
                <p className="text-lg">{upcomingMeetups.length} evenemang hittade</p>
              </div>
            </div>

            
            {upcomingMeetups.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 animate-fade-in">
                {upcomingMeetups.map((meetup, index) => (
                  <div
                    key={meetup._id || meetup.id || index}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => setMeetupModal(meetup)}
                    tabIndex={0}
                    role="button"
                    aria-label={`Visa ${meetup.title}`}
                  >
                    <EventCard {...meetup} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="space-y-4 max-w-md mx-auto">
                  <div className="w-16 h-16 mx-auto bg-muted/50 rounded-full flex items-center justify-center">
                    <Search className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-semibold">Inga kommande evenemang</h3>
                  <p className="text-muted-foreground text-lg">
                    Alla aktuella evenemang har redan passerat. Prova skapa ett nytt!
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
              </div>
            )}

            {/*  Meetup-modal */}
            {meetupModal && (
              <MeetupInfoModal
                meetup={meetupModal}
                isRegistered={registeredMeetupIds?.includes(meetupModal.id)}
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

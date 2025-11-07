import { useState } from "react";
import { Calendar, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DayPicker } from "react-day-picker";
import { Badge } from "@/components/ui/badge";
import "react-day-picker/dist/style.css";

const defaultEvent = {
  title: "",
  date: "",
  location: "",
  categories: ["Tech"],
  maxAttendees: 50,
  info: "",
};

const CreateEventModal = ({ show, onClose, onCreate }) => {
  const [form, setForm] = useState(defaultEvent);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "categories") {
      setForm((prev) => ({ ...prev, [name]: [value] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  function combineDateTime(date, time) {
    const [hours, minutes] = time.split(":");
    const d = new Date(date);
    d.setHours(Number(hours), Number(minutes), 0, 0);
    const corrected = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return corrected.toISOString();
  }

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    if (date && selectedTime) {
      const iso = combineDateTime(date, selectedTime);
      setForm((prev) => ({ ...prev, date: iso }));
    }
  };

  const handleTimeChange = (e) => {
    const value = e.target.value;
    setSelectedTime(value);
    if (selectedDate && value) {
      const iso = combineDateTime(selectedDate, value);
      setForm((prev) => ({ ...prev, date: iso }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return alert("Titel är obligatorisk.");
    if (!selectedDate || !selectedTime) return alert("Välj både datum och tid.");
    if (!form.location.trim()) return alert("Plats är obligatorisk.");

    const finalDate = combineDateTime(selectedDate, selectedTime);
    let finalCategories = [];
    if (Array.isArray(form.categories)) {
      finalCategories = form.categories.filter(Boolean);
    } else if (typeof form.categories === "string" && form.categories.trim()) {
      finalCategories = [form.categories.trim()];
    }
    if (finalCategories.length === 0) finalCategories = ["Tech"];

    const finalData = { ...form, date: finalDate, categories: finalCategories };

    try {
      setLoading(true);
      await onCreate(finalData);
      setForm(defaultEvent);
      setSelectedDate(null);
      setSelectedTime("");
      onClose();
    } catch (err) {
      console.error("handleSubmit error:", err);
      alert(err.message || "Ett fel uppstod vid skapande av event.");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`
          bg-background/90 rounded-3xl shadow-2xl border border-border/60
          relative overflow-hidden animate-fade-in origin-center
          
          /* 📏 Justerad bredd */
          w-[90vw] max-w-md
          sm:max-w-md md:max-w-md lg:max-w-md xl:max-w-md 2xl:max-w-lg
  
          /* 💻 Skala ned för laptopskärmar */
          md:scale-[0.80]
          lg:scale-[0.78]
          xl:scale-[0.78]
          2xl:scale-100
        `}
      >
        {/* Header */}
<div className="relative bg-gradient-to-br from-primary/30 to-cyan-400/20 flex items-center justify-center h-32 md:h-36 2xl:h-40">
  <Calendar className="w-8 h-8 md:w-9 md:h-9 2xl:w-11 2xl:h-11
 text-primary drop-shadow-lg" />
  <button
    className="absolute top-4 right-5 text-muted-foreground hover:text-primary text-xl md:text-2xl"
    onClick={onClose}
    aria-label="Stäng"
  >
    ×
  </button>
</div>
  
        {/* Innehåll */}
        <div className="px-5 md:px-6 xl:px-5 2xl:px-7 py-3.5 md:py-4.5 2xl:py-5 text-[12.5px] md:text-[13px] 2xl:text-[13.5px]">
          <h3 className="text-base md:text-[17px] 2xl:text-xl font-bold mb-4 flex items-center gap-2 justify-center">
            Skapa ny meetup
          </h3>
  
          {form.categories[0] && (
            <div className="flex justify-center mb-2.5">
              <Badge variant="default" className="text-[11px] md:text-[12px] 2xl:text-[12.5px] px-2 py-0.5">
                {form.categories[0]}
              </Badge>
            </div>
          )}
  
          <form onSubmit={handleSubmit} className="space-y-2 md:space-y-2.5 2xl:space-y-3">
            {/* Titel */}
            <div>
              <Label htmlFor="title" className="text-[11.5px] 2xl:text-[12.5px]">Titel</Label>
              <Input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="h-7 md:h-8 2xl:h-9"
              />
            </div>
  
            {/* Plats */}
            <div>
              <Label htmlFor="location" className="text-[11.5px] 2xl:text-[12.5px]">Plats</Label>
              <Input
                id="location"
                name="location"
                value={form.location}
                onChange={handleChange}
                required
                className="h-7 md:h-8 2xl:h-9"
              />
            </div>
  
            {/* Datum & tid */}
            <div>
              <Label className="text-[11.5px] 2xl:text-[12.5px] -mt-1 block">Datum & tid</Label>
              <div className="flex flex-col md:flex-row gap-2.5 items-start md:items-end md:pb-0.5">
                <div className="scale-[0.88] md:scale-[0.88] 2xl:scale-[0.95] transform origin-top md:-ml-3">
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    fromDate={new Date()}
                    className="bg-background rounded-xl border border-border p-1.5 shadow-inner text-[12px] md:text-[12.5px] 2xl:text-[14px]"
                  />
                </div>
  
                {/* Tid */}
                <div className="flex flex-col gap-1 md:-translate-y-6">
                  <Label htmlFor="time" className="flex items-center gap-1 text-[11.5px] 2xl:text-[12.5px]">
                    <Clock className="w-3 h-3" />
                    Tid
                  </Label>
                  <Input
                    id="time"
                    name="time"
                    type="time"
                    value={selectedTime}
                    onChange={handleTimeChange}
                    required
                    className="w-22 md:w-26 2xl:w-30 h-7 md:h-8 2xl:h-9"
                  />
                </div>
              </div>
            </div>
  
            {/* Kategori */}
            <div>
              <Label htmlFor="categories" className="text-[11.5px] 2xl:text-[12.5px]">Kategori</Label>
              <select
                id="categories"
                name="categories"
                value={form.categories[0] || ""}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-background py-1 px-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-[12.5px] md:text-[13px] 2xl:text-[13.5px]"
                required
              >
                <option value="">Välj kategori</option>
                <option value="Tech">Teknik / Tech</option>
                <option value="Sport">Sport</option>
                <option value="Art">Konst</option>
                <option value="Food">Mat</option>
                <option value="Music">Musik</option>
                <option value="Business">Affärer / Business</option>
              </select>
            </div>
  
            {/* Max deltagare */}
            <div>
              <Label htmlFor="maxAttendees" className="text-[11.5px] 2xl:text-[12.5px]">Max antal deltagare</Label>
              <Input
                id="maxAttendees"
                name="maxAttendees"
                type="number"
                min={1}
                max={500}
                value={form.maxAttendees}
                onChange={handleChange}
                required
                className="h-7 md:h-8 2xl:h-9"
              />
            </div>
  
            {/* Info */}
            <div>
              <Label htmlFor="info" className="text-[11.5px] 2xl:text-[12.5px]">Information om evenemanget</Label>
              <textarea
                id="info"
                name="info"
                value={form.info}
                onChange={handleChange}
                required
                rows={3}
                className="w-full mt-1 rounded-lg border border-border bg-background/60 p-1.5 text-[12.5px] md:text-[13px] 2xl:text-[13.5px] focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none shadow-inner"
                placeholder="Beskriv evenemanget, agenda, målgrupp, etc."
              />
            </div>
  
            {/* Knappar */}
            <div className="flex gap-2.5 pt-1.5">
              <Button
                type="submit"
                className="flex-1 h-8 md:h-8 2xl:h-10 text-[12.5px] md:text-[13px] 2xl:text-[13.5px] font-semibold"
                disabled={loading}
              >
                {loading ? "Skapar..." : "Skapa evenemang"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-8 md:h-8 2xl:h-10 text-[12.5px] md:text-[13px] 2xl:text-[13.5px]"
                onClick={onClose}
              >
                Avbryt
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEventModal;

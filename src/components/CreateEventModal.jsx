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
  categories: ["Tech"], // alltid array-format som backend vill ha
  maxAttendees: 50,
  info: "",
};

const CreateEventModal = ({ show, onClose, onCreate }) => {
  const [form, setForm] = useState(defaultEvent);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");

  // Uppdaterad handleChange – säkerställer array-format för kategori
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "categories") {
      setForm((prev) => ({ ...prev, [name]: [value] })); // alltid en array
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Kombinera datum & tid till ISO (korrigerad tidszon)
  function combineDateTime(date, time) {
    const [hours, minutes] = time.split(":");
    const d = new Date(date);
    d.setHours(Number(hours), Number(minutes), 0, 0);
    // Konvertera till UTC utan att tappa 1 timme
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

  // Submit-funktion
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Grundvalidering
    if (!form.title.trim()) {
      alert("Titel är obligatorisk.");
      return;
    }
    if (!selectedDate || !selectedTime) {
      alert("Välj både datum och tid.");
      return;
    }
    if (!form.location.trim()) {
      alert("Plats är obligatorisk.");
      return;
    }

    // Kombinera korrekt datum + tid
    const finalDate = combineDateTime(selectedDate, selectedTime);

    // Säkerställ korrekt array-format
    let finalCategories = [];
    if (Array.isArray(form.categories)) {
      finalCategories = form.categories.filter(Boolean);
    } else if (typeof form.categories === "string" && form.categories.trim()) {
      finalCategories = [form.categories.trim()];
    }
    if (finalCategories.length === 0) {
      finalCategories = ["Tech"];
    }

    // Objektet som skickas till backend
    const finalData = {
      ...form,
      date: finalDate,
      categories: finalCategories,
    };

    console.log("📦 Event data skickas till backend:", finalData);

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
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-background/90 rounded-3xl shadow-2xl max-w-xl w-full p-0 relative animate-fade-in overflow-hidden border border-border/60">
        {/* Header */}
        <div className="relative h-40 bg-gradient-to-br from-primary/30 to-cyan-400/20 flex items-center justify-center">
          <Calendar className="w-14 h-14 text-primary drop-shadow-lg" />
          <button
            className="absolute top-4 right-4 text-muted-foreground hover:text-primary text-2xl"
            onClick={onClose}
            aria-label="Stäng"
          >
            ×
          </button>
        </div>

        {/* Formulär */}
        <div className="p-8">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 justify-center">
            Skapa nytt evenemang
          </h3>

          {form.categories[0] && (
            <div className="flex justify-center mb-4">
              <Badge variant="default">{form.categories[0]}</Badge>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Titel */}
            <div>
              <Label htmlFor="title">Titel</Label>
              <Input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            {/* Plats */}
            <div>
              <Label htmlFor="location">Plats</Label>
              <Input
                id="location"
                name="location"
                value={form.location}
                onChange={handleChange}
                required
              />
            </div>

            {/* Datum & tid */}
            <div>
              <Label>Datum & tid</Label>
              <div className="flex flex-col md:flex-row gap-3 items-start md:items-end">
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  fromDate={new Date()}
                  className="bg-background rounded-xl border border-border p-2 shadow-inner"
                />
                <div className="flex flex-col gap-1">
                  <Label htmlFor="time" className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Tid
                  </Label>
                  <Input
                    id="time"
                    name="time"
                    type="time"
                    value={selectedTime}
                    onChange={handleTimeChange}
                    required
                    className="w-32"
                  />
                </div>
              </div>
            </div>

            {/* Kategori */}
            <div>
              <Label htmlFor="categories">Kategori</Label>
              <select
                id="categories"
                name="categories"
                value={form.categories[0] || ""}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-background py-2 px-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
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
              <Label htmlFor="maxAttendees">Max antal deltagare</Label>
              <Input
                id="maxAttendees"
                name="maxAttendees"
                type="number"
                min={1}
                max={500}
                value={form.maxAttendees}
                onChange={handleChange}
                required
              />
            </div>

            {/* Info */}
            <div>
              <Label htmlFor="info">Information om evenemanget</Label>
              <textarea
                id="info"
                name="info"
                value={form.info}
                onChange={handleChange}
                required
                rows={4}
                className="w-full mt-1 rounded-lg border border-border bg-background/60 p-2 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none shadow-inner"
                placeholder="Beskriv evenemanget, agenda, målgrupp, etc."
              />
            </div>

            {/* Knappar */}
            <div className="flex gap-4 pt-2">
              <Button
                type="submit"
                className="flex-1 h-12 text-base font-bold"
                disabled={loading}
              >
                {loading ? "Skapar..." : "Skapa evenemang"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-12 text-base"
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

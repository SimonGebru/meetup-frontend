import { useState } from "react";
import { Calendar, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

const defaultEvent = {
  title: "",
  date: "",
  location: "",
  category: "",
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
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Hantera datumval
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    // Om tid redan är vald, uppdatera form.date
    if (date && selectedTime) {
      const iso = combineDateTime(date, selectedTime);
      setForm((prev) => ({ ...prev, date: iso }));
    }
  };
  // Hantera tidval
  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
    if (selectedDate && e.target.value) {
      const iso = combineDateTime(selectedDate, e.target.value);
      setForm((prev) => ({ ...prev, date: iso }));
    }
  };
  // Kombinera datum och tid till ISO-sträng
  function combineDateTime(date, time) {
    const [hours, minutes] = time.split(":");
    const d = new Date(date);
    d.setHours(Number(hours), Number(minutes), 0, 0);
    return d.toISOString();
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      onCreate(form);
      setForm(defaultEvent);
      setLoading(false);
      onClose();
    }, 800);
  };

  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
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
        <div className="p-8">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 justify-center">
            Skapa nytt evenemang
          </h3>
          <form onSubmit={handleSubmit} className="space-y-5">
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
            <div>
              <Label>Datum & tid</Label>
              <div className="flex flex-col md:flex-row gap-3 items-start md:items-end">
                <div>
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    fromDate={new Date()}
                    className="bg-background rounded-xl border border-border p-2 shadow-inner"
                  />
                </div>
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
            <div>
              <Label htmlFor="category">Kategori</Label>
              <Input
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              />
            </div>
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

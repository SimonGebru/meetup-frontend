import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast"; 

export default function ReviewModal({ show, onClose, meetup, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const { toast } = useToast(); 

  if (!show || !meetup) return null;

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Välj ett betyg",
        description: "Du måste välja minst 1 stjärna.",
        variant: "destructive",
      });
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "Inte inloggad",
          description: "Du måste vara inloggad för att lämna recension.",
          variant: "destructive",
        });
        return;
      }
  
      const newReview = {
        meetupId: meetup._id || meetup.id, 
        rating,
        comment,
        createdAt: new Date().toISOString(),
      };
  
      console.log("Skickar review:", newReview);
  
      await onSubmit(newReview); 
  
      toast({
        title: "Tack för din recension!",
        description: "Din feedback har sparats.",
      });
  
      setRating(0);
      setComment("");
      onClose();
    } catch (error) {
      toast({
        title: "Kunde inte spara recension",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-background rounded-2xl shadow-2xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-foreground">
          Lämna en recension
        </h2>
        <p className="text-muted-foreground text-center mb-4">{meetup.title}</p>

        {/* Stjärnor */}
        <div className="flex justify-center gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              className={`text-3xl ${
                rating >= star ? "text-yellow-400" : "text-gray-400"
              } transition-transform hover:scale-110`}
              onClick={() => setRating(star)}
            >
              ★
            </button>
          ))}
        </div>

        {/* Kommentar */}
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Skriv din kommentar..."
          className="w-full rounded-md border border-input bg-muted p-2 text-foreground mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
          rows="3"
        />

        <div className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Avbryt
          </Button>
          <Button onClick={handleSubmit}>Skicka</Button>
        </div>
      </div>
    </div>
  );
}
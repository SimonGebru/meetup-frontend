import { Calendar } from "lucide-react";

const EmptyState = ({ text }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
    <Calendar className="w-10 h-10 opacity-60 mb-2" />
    <p>{text}</p>
  </div>
);

export default EmptyState;
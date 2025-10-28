import { Button } from "@/components/ui/button";
import { Code, Dumbbell, Palette, UtensilsCrossed, Music, Briefcase } from "lucide-react";

const categories = [
  { name: "Alla", icon: null },
  { name: "Teknik", icon: Code },
  { name: "Sport", icon: Dumbbell },
  { name: "Konst", icon: Palette },
  { name: "Mat", icon: UtensilsCrossed },
  { name: "Musik", icon: Music },
  { name: "Affärer", icon: Briefcase },
];

const CategoryFilter = ({ activeCategory, onCategoryChange }) => {
  return (
    <div className="flex flex-wrap gap-3">
      {categories.map((category) => {
        const Icon = category.icon;
        const isActive = activeCategory === category.name;
        return (
          <Button
            key={category.name}
            variant={isActive ? "default" : "outline"}
            onClick={() => onCategoryChange(category.name)}
            className="gap-2"
          >
            {Icon && <Icon className="w-4 h-4" />}
            {category.name}
          </Button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;

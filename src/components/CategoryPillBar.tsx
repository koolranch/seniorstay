import { useState } from "react";

// Define the category mapping to types from our data
const categories = [
  { id: "all", name: "All Communities", icon: "🏠" },
  { id: "Independent Living", name: "Independent Living", icon: "👨‍⚕️" },
  { id: "Assisted Living", name: "Assisted Living", icon: "🧠" },
  { id: "Memory Care", name: "Memory Care", icon: "⚕️" },
  { id: "Continuing Care", name: "Continuing Care", icon: "👵" },
  { id: "55plus", name: "55+ Communities", icon: "🐕" },
  { id: "city", name: "City Living", icon: "🏙️" },
  { id: "rural", name: "Rural Retreats", icon: "🌳" },
  { id: "beachfront", name: "Beachfront", icon: "🏖️" },
  { id: "amenities", name: "Amenities-Rich", icon: "🏊" },
];

interface CategoryPillBarProps {
  onSelectCategory: (category: string | null) => void;
  selected: string | null;
}

export default function CategoryPillBar({ onSelectCategory, selected = "all" }: CategoryPillBarProps) {
  return (
    <div className="overflow-x-auto pb-4 pt-3 px-6 md:px-10 lg:px-20 border-b border-t border-[#A7C4A0] hide-scrollbar bg-white sticky top-[73px] z-30">
      <div className="flex space-x-10">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id === "all" ? null : category.id)}
            className={`flex flex-col items-center min-w-[80px] text-xs ${
              (selected === category.id || (selected === null && category.id === "all"))
                ? "text-[#1b4d70] border-b-2 border-[#1b4d70] pb-2"
                : "text-[#333333]"
            }`}
          >
            <div className="text-2xl mb-1">{category.icon}</div>
            <span className="whitespace-nowrap px-1">{category.name}</span>
          </button>
        ))}
      </div>

      {/* Custom styles for the scrollbar */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
} 
import { useState } from "react";

const categories = [
  { id: "all", name: "All Communities", icon: "🏠" },
  { id: "independent", name: "Independent Living", icon: "👨‍⚕️" },
  { id: "assisted", name: "Assisted Living", icon: "🧠" },
  { id: "memory", name: "Memory Care", icon: "⚕️" },
  { id: "continuing", name: "Continuing Care", icon: "👵" },
  { id: "55plus", name: "55+ Communities", icon: "🐕" },
  { id: "city", name: "City Living", icon: "🏙️" },
  { id: "rural", name: "Rural Retreats", icon: "🌳" },
  { id: "beachfront", name: "Beachfront", icon: "🏖️" },
  { id: "amenities", name: "Amenities-Rich", icon: "🏊" },
];

export default function CategoryPillBar() {
  const [activeCategory, setActiveCategory] = useState("all");

  return (
    <div className="overflow-x-auto pb-4 pt-3 px-6 md:px-10 lg:px-20 border-b border-t border-[#A7C4A0] hide-scrollbar bg-white sticky top-[73px] z-30">
      <div className="flex space-x-10">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`flex flex-col items-center min-w-[80px] text-xs ${
              activeCategory === category.id
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
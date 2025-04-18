"use client";

import { useComparison } from "@/context/ComparisonContext";
import { useRouter } from "next/navigation";
import { FiArrowRight, FiTrash2 } from "react-icons/fi";
import { Scale } from "lucide-react"; // Using Scale icon for compare

const CompareFloatingButton = () => {
  const { comparisonItems, clearComparison, isLoading } = useComparison();
  const router = useRouter();

  // Don't render until context is loaded and has items
  if (isLoading || comparisonItems.length < 1) {
    return null;
  }

  const handleCompareClick = () => {
    if (comparisonItems.length >= 1) {
      const ids = comparisonItems.join(",");
      router.push(`/compare?ids=${ids}`);
    }
  };
  
  const handleClearClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent compare click if clicking clear
    clearComparison();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      <button
        onClick={handleClearClick}
        className="p-3 bg-white text-gray-600 rounded-full shadow-lg hover:bg-gray-100 transition"
        aria-label="Clear comparison selection"
      >
        <FiTrash2 size={18} />
      </button>
      <button
        onClick={handleCompareClick}
        disabled={comparisonItems.length < 2} // Need at least 2 to compare
        className={`flex items-center px-6 py-3 rounded-full shadow-lg transition ${
          comparisonItems.length < 2
            ? "bg-gray-400 text-gray-100 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        <Scale size={18} className="mr-2" />
        <span>
          Compare Selected ({comparisonItems.length})
          {comparisonItems.length < 2 && " - Select more"}
        </span>
        {comparisonItems.length >= 2 && <FiArrowRight className="ml-2" />}
      </button>
    </div>
  );
};

export default CompareFloatingButton; 
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="bg-[#FAFAF5] min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-6 md:px-10 lg:px-20 py-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1b4d70] mb-4">
          City Not Found
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          We couldn't find the city you're looking for. It may not have enough senior living communities listed yet, or the URL might be incorrect.
        </p>
        <Link 
          href="/ohio" 
          className="inline-flex items-center text-[#1b4d70] hover:underline"
        >
          <FiArrowLeft className="mr-2" />
          Back to Ohio Communities
        </Link>
      </div>
    </div>
  );
} 
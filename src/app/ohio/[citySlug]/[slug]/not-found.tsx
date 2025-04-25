import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { getCityPath } from "@/lib/utils/formatSlug";

export default function NotFound({ params }: { params: { city: string } }) {
  const cityName = params.city.split("-").map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(" ");

  return (
    <div className="bg-[#FAFAF5] min-h-screen">
      <div className="container mx-auto px-6 md:px-10 lg:px-20 py-8">
        <Link 
          href={getCityPath("OH", cityName)}
          className="inline-flex items-center text-[#1b4d70] mb-6 hover:underline"
        >
          <FiArrowLeft className="mr-2" />
          Back to {cityName} Communities
        </Link>

        <div className="text-center py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1b4d70] mb-4">
            Community Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            The senior living community you're looking for could not be found in {cityName}, Ohio.
          </p>
          <Link
            href={getCityPath("OH", cityName)}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#1b4d70] hover:bg-[#2F5061] transition-colors"
          >
            View All Communities in {cityName}
          </Link>
        </div>
      </div>
    </div>
  );
} 
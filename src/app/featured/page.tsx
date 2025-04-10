import { Metadata } from "next";
import { FeaturedPageContent } from "./featured-content";

export const metadata: Metadata = {
  title: "Featured Senior Living Communities | SeniorStay",
  description: "Explore our handpicked featured senior living communities. Learn more, view amenities, and request a tour today.",
};

export default function FeaturedPage() {
  return <FeaturedPageContent />;
} 
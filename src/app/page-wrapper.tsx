import { Metadata } from "next";
import HomePage from "./page";

export const metadata: Metadata = {
  title: "Senior Living Communities | SeniorStay",
  description: "Find the perfect senior living community for you or your loved one. Compare amenities, care types, and request a tour today.",
};

export default function PageWrapper() {
  return <HomePage />;
} 
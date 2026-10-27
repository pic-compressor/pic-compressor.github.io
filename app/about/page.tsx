import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "About Pic Compressor",
  description: "About Pic Compressor and its browser-based image tools.",
};

export default function About() {
  return <LegalPage page="about" />;
}
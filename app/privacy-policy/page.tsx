import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Pic Compressor privacy policy.",
};

export default function PrivacyPolicy() {
  return <LegalPage page="privacy" />;
}

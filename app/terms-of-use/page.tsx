import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms for using Pic Compressor.",
};

export default function TermsOfUse() {
  return <LegalPage page="terms" />;
}

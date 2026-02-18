import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy | Pic Compressor",
  description: "Privacy policy for Pic Compressor.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 md:py-12">
      <section className="content-panel">
        <h1 className="content-title">Privacy Policy</h1>
        <p className="content-text">Last updated: February 18, 2026</p>

        <h2 className="content-subtitle">Information We Process</h2>
        <p className="content-text">
          We process image files you upload in order to perform compression and return the output.
        </p>

        <h2 className="content-subtitle">How We Use Data</h2>
        <p className="content-text">
          File data is used strictly to provide compression functionality and improve service reliability.
        </p>

        <h2 className="content-subtitle">Retention</h2>
        <p className="content-text">
          Files are not intended for long-term storage. Any temporary processing data should be minimized
          and removed after processing.
        </p>

        <h2 className="content-subtitle">Contact</h2>
        <p className="content-text">For privacy-related requests, contact the site operator.</p>
      </section>
    </main>
  );
}

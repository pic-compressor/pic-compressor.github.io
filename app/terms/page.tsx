import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms | Pic Compressor",
  description: "Terms of use for Pic Compressor.",
};

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 md:py-12">
      <section className="content-panel">
        <h1 className="content-title">Terms of Use</h1>
        <p className="content-text">Last updated: February 18, 2026</p>

        <h2 className="content-subtitle">Use of Service</h2>
        <p className="content-text">
          By using this service, you agree to use it responsibly and in compliance with applicable laws.
        </p>

        <h2 className="content-subtitle">No Warranty</h2>
        <p className="content-text">
          The service is provided as-is without guarantees of uninterrupted availability or perfect output.
        </p>

        <h2 className="content-subtitle">Limitation of Liability</h2>
        <p className="content-text">
          The operator is not liable for indirect or consequential losses resulting from use of the service.
        </p>
      </section>
    </main>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Policy | Pic Compressor",
  description: "Policy overview for using Pic Compressor.",
};

export default function PolicyPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 md:py-12">
      <section className="content-panel">
        <h1 className="content-title">Policy</h1>
        <p className="content-text">
          This page outlines how Pic Compressor is operated, what users can expect from the service,
          and key boundaries for usage.
        </p>

        <h2 className="content-subtitle">Service Scope</h2>
        <p className="content-text">
          Pic Compressor provides image compression for common formats such as PNG, JPG, GIF and WebP.
          Output quality may vary based on original image characteristics and selected settings.
        </p>

        <h2 className="content-subtitle">Acceptable Use</h2>
        <p className="content-text">
          You may only upload content that you own or are authorized to process. Illegal, abusive, or
          malicious usage is prohibited.
        </p>

        <h2 className="content-subtitle">Data Handling</h2>
        <p className="content-text">
          Uploaded files are processed for compression purposes only. For detailed data handling terms,
          see the Privacy page.
        </p>
      </section>
    </main>
  );
}

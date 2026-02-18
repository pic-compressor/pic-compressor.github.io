import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer mt-10 border-t border-slate-200/80 bg-white/70">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-6 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
        <p>
          &copy; {new Date().getFullYear()} Image Compressor. All rights
          reserved.
        </p>
        <nav
          aria-label="Footer Navigation"
          className="flex flex-wrap items-center gap-3"
        >
          <Link className="footer-link" href="/policy">
            Policy
          </Link>
          <Link className="footer-link" href="/privacy">
            Privacy
          </Link>
          <Link className="footer-link" href="/terms">
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  );
}

import Link from "next/link";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/policy", label: "Policy" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export default function Header() {
  return (
    <header className="site-header">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight text-slate-900">
          <img src="./favicon.svg" className="w-12 h-12"/>
        </Link>

        <nav aria-label="Primary Navigation" className="flex flex-wrap items-center gap-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="nav-link">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

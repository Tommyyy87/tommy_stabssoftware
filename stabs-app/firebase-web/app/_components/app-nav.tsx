import Link from "next/link";

export type PrimaryNavItem = {
  href: string;
  label: string;
  active: boolean;
};

export function buildPrimaryNav(pathname: string): PrimaryNavItem[] {
  return [
    { href: "/", label: "Fuehrungsueberblick", active: pathname === "/" },
    { href: "/s1", label: "S1 Personal / Inneres", active: pathname === "/s1" },
    { href: "/s2", label: "S2 Lage", active: pathname === "/s2" },
    { href: "/s3", label: "S3 Einsatz", active: pathname === "/s3" },
    { href: "/s4", label: "S4 Versorgung", active: pathname === "/s4" },
    {
      href: "/s5",
      label: "S5 Presse / Oeffentlichkeit",
      active: pathname === "/s5"
    },
    {
      href: "/s6",
      label: "S6 Information / Kommunikation",
      active: pathname === "/s6"
    },
    {
      href: "/messages",
      label: "Nachrichten",
      active: pathname === "/messages"
    },
    { href: "/journal", label: "Tagebuch", active: pathname === "/journal" }
  ];
}

export function AppNav({ pathname }: { pathname: string }) {
  const items = buildPrimaryNav(pathname);

  return (
    <nav className="app-nav" aria-label="Hauptnavigation">
      {items.map((item) => (
        <Link
          key={item.href}
          className={item.active ? "nav-item active" : "nav-item"}
          href={item.href}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

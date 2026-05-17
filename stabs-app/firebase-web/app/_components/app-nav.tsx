import Link from "next/link";

export type PrimaryNavItem = {
  href: string;
  label: string;
  active: boolean;
};

export function buildPrimaryNav(pathname: string): PrimaryNavItem[] {
  return [
    { href: "/", label: "Lageuebersicht", active: pathname === "/" },
    {
      href: "/messages",
      label: "Nachrichten",
      active: pathname === "/messages"
    },
    { href: "/journal", label: "Journal", active: pathname === "/journal" }
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

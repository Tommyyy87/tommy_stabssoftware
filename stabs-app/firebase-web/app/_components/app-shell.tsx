"use client";

import { usePathname } from "next/navigation";

import { AppHeader } from "./app-header";
import { AppNav } from "./app-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <AppHeader />
        <AppNav pathname={pathname} />
      </aside>

      <div className="app-main">
        {children}
      </div>
    </div>
  );
}

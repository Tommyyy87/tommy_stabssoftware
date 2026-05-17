import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AppShell } from "./_components/app-shell";

export const metadata: Metadata = {
  title: "Stabs-App",
  description: "Browserbasierte Stabsunterstuetzungssoftware"
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="de">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

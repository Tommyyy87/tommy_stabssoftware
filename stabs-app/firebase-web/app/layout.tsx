import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AppShell } from "./_components/app-shell";
import { WorkspaceProvider } from "./_providers/workspace-provider";
import { loadApiSnapshot } from "../lib/api";

export const metadata: Metadata = {
  title: "Stabs-App",
  description: "Browserbasierte Stabsunterstuetzungssoftware"
};

type RootLayoutProps = {
  children: ReactNode;
};

export default async function RootLayout({ children }: RootLayoutProps) {
  const apiSnapshot = await loadApiSnapshot();

  return (
    <html lang="de">
      <body>
        <WorkspaceProvider initialSnapshot={apiSnapshot}>
          <AppShell>{children}</AppShell>
        </WorkspaceProvider>
      </body>
    </html>
  );
}

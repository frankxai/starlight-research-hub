import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@/app/globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "Starlight Research Hub — Grok 4.6 orchestration architecture",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main className="wrap">{children}</main>
        <div className="wrap footer">Starlight Intelligence Systems · Arcanea Labs · frankx.ai · 31 Aug 2026.</div>
      </body>
    </html>
  );
}

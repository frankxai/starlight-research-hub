"use client";

import Link from "next/link";

import { MarkStar } from "@/components/Logos";

const items = [
  { href: "/", label: "Hub" },
  { href: "/editorial", label: "Editorial" },
  { href: "/architecture", label: "Architecture" },
  { href: "/models", label: "Models" },
  { href: "/week", label: "Last week" },
  { href: "/connectors", label: "MCP" },
  { href: "/work", label: "Repos" },
];

export default function Nav() {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link href="/" className="brand" aria-label="Starlight Research Hub home">
          <MarkStar /> Starlight Research Hub
        </Link>
        <div className="links">
          {items.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

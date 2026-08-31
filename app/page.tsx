import Link from "next/link";

import { logoItems } from "@/components/Logos";

const routes = [
  ["Editorial", "/editorial", "Long argument with honest losses and operator economics."],
  ["Architecture", "/architecture", "Conductor graph across Grok Bot, MCP, GitHub, and Vercel."],
  ["Models", "/models", "Frontier table with turns, cost, evals, and runtime notes."],
  ["Last week", "/week", "12–31 Aug timeline of releases and protocol moments."],
  ["MCP", "/connectors", "Connector stack from protocol to commerce with identity gaps."],
  ["Repos", "/work", "Live work graph across FrankX and Starlight repos."],
] as const;

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <p className="kicker">31 August 2026 · Starlight brief</p>
        <h1 className="lede">Grok 4.6 is the best-orchestrated model at the frontier.</h1>
        <p className="meta">
          <span className="chip">AA Index 61 tied Sol</span>
          <span className="chip">$0.84/task vs Opus $2.03</span>
          <span className="chip">~53 turns vs ~103</span>
          <span className="chip">38 Vercel projects</span>
        </p>
        <div className="logo-row">
          {logoItems.map((logo) => (
            <span key={logo.name} className="logo-pill">
              {logo.icon}
              {logo.name}
            </span>
          ))}
        </div>
      </section>

      <section className="section grid g3">
        {routes.map(([title, href, detail]) => (
          <Link key={href} href={href} className="card">
            <h2 className="sub">{title}</h2>
            <p>{detail}</p>
          </Link>
        ))}
      </section>

      <blockquote className="pull">
        Orchestration means holding a goal across tools, identities, and hours, then handing back a finished artifact.
      </blockquote>
    </>
  );
}

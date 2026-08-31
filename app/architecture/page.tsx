"use client";

import dynamic from "next/dynamic";

const ArchitectureCanvas = dynamic(() => import("@/components/ArchitectureCanvas"), { ssr: false });

export default function ArchitecturePage() {
  return (
    <section className="section">
      <p className="kicker">Architecture</p>
      <h1 className="lede">Conductor over bench theater.</h1>
      <div className="grid g3 section">
        <div className="card">
          <h2 className="sub">Conductor</h2>
          <p>Grok 4.6 carries objective state and routes action to the right identity at the right time.</p>
        </div>
        <div className="card">
          <h2 className="sub">Bus</h2>
          <p>MCP is the transport layer connecting tools, memory surfaces, and execution runtimes.</p>
        </div>
        <div className="card">
          <h2 className="sub">Stop authority</h2>
          <p>The operator remains the terminal authority for risk, publish, and escalation boundaries.</p>
        </div>
      </div>
      <div className="section">
        <ArchitectureCanvas />
      </div>
    </section>
  );
}

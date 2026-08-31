const groups = [
  ["Protocol", "MCP 2026-07-28"],
  ["Runtime", "Grok Bot · Vercel · Automations"],
  ["Surface", "GitHub · X/Grok Bot · Voice"],
  ["Memory", "Linear · Notion · Drive"],
  ["Create", "Canva · Excalidraw · HeyGen · Higgsfield"],
  ["Commerce", "Whop"],
] as const;

export default function ConnectorsPage() {
  return (
    <section className="section">
      <p className="kicker">Connectors</p>
      <h1 className="lede">Layered connector map.</h1>
      <div className="grid g2 section">
        {groups.map(([name, stack]) => (
          <div key={name} className="card">
            <h2 className="sub">{name}</h2>
            <p>{stack}</p>
          </div>
        ))}
      </div>
      <blockquote className="pull">
        Identity remains the unfinished MCP wall: no token passthrough today, DPoP is the next control plane step.
      </blockquote>
    </section>
  );
}

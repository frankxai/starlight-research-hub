const timeline = [
  ["12 Aug", "Launch", "Grok 4.6 release."],
  ["Mid-Aug", "Runtime", "Grok Bot one-computer-per-agent rollout."],
  ["22 Aug", "Protocol", "MCP roadmap: Tasks, agent identity, DPoP."],
  ["24 Aug", "Framework", "Agno 3.0 ships."],
  ["25 Aug", "Model", "Jalapeño release."],
  ["26 Aug", "Collab", "Claude Tag in Slack."],
  ["27 Aug", "Model", "Muse Glimmer ships."],
  ["28 Aug", "Security", "WebMCP and OpenAI agent-escape report."],
  ["29 Aug", "Infra", "Agent Seer + ACP movement."],
  ["30 Aug", "Swarm", "Grok Bot on X, Kiro Crew, four-bot MCP vlog."],
  ["31 Aug", "Ops", "FrankX field notes + Joint Infrastructure."],
] as const;

export default function WeekPage() {
  return (
    <section className="section">
      <p className="kicker">Last week</p>
      <h1 className="lede">12–31 Aug timeline.</h1>
      <div className="section">
        {timeline.map(([date, kind, detail]) => (
          <div key={date} className="week">
            <p className="kind">{kind}</p>
            <h2 className="sub" style={{ marginTop: 0 }}>
              {date}
            </h2>
            <p>{detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

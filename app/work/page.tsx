const repos = [
  ["frankx.ai-vercel-website", "Field notes tonight, CI fail-closed, claims purge."],
  ["starlight-intelligence-web", "Joint Infrastructure execution lane."],
  ["Starlight-Intelligence-System", "Substrate MCP SIP runtime."],
  ["arcanea-ai-app", "Arcanea app operations."],
  ["awesome-hermes-agent-skills", "Skill catalog governance."],
  ["awesome-agent-operating-systems", "Operator systems index."],
  ["llm-evals", "Bench and eval pipeline."],
  ["gencreator.ai", "Generative creator surface."],
  ["starlight-you", "Personalized starlight branch."],
  ["starlight-design-intelligence", "Design intelligence stack."],
  ["arcanea", "Arcanea core repository."],
  ["starlight-estate", "Estate and ownership layer."],
] as const;

export default function WorkPage() {
  return (
    <section className="section">
      <p className="kicker">Repos</p>
      <h1 className="lede">The work graph is the repos.</h1>
      <p className="meta">
        Conversation search returned no prior chats; current state is anchored to repositories. Vercel team:
        Starlight Intelligence Pro with 38 linked projects.
      </p>
      <div className="grid g3 section">
        {repos.map(([name, note]) => (
          <div key={name} className="card">
            <h2 className="sub">{name}</h2>
            <p>{note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

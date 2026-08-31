const rows = [
  ["Grok 4.6", "~53", "$0.84", "61", "1753", "69.9", "15.8", "Native swarm", "$2 in / $6 out", "Wins on orchestrated finished-work economics; loses DeepSWE and TB3."] ,
  ["Opus 5", "~103", "$2.03", "63", "—", "—", "—", "No native swarm", "$15 in / $75 out", "Highest AA Index in this frame, but expensive per completed task."],
  ["Fable 5", "~84", "$1.52", "62", "—", "—", "—", "Strong single-agent", "n/a", "Close index competitor with weaker field orchestration evidence."],
  ["GPT-5.6 Sol", "~70", "$1.18", "61", "—", "—", "—", "Tool-rich ecosystem", "n/a", "Tied index leader vs Grok, stronger DeepSWE figure in cited slice."],
  ["Gemini 3.7 Flash", "~76", "$0.96", "—", "—", "—", "—", "Fast multimodal", "n/a", "Speed profile valuable; orchestration stack less unified."],
  ["Muse Spark 1.2", "~81", "$1.04", "—", "—", "—", "—", "Emerging swarm", "n/a", "Interesting creative runtime, still early on reliability."],
] as const;

export default function ModelsPage() {
  return (
    <section className="section">
      <p className="kicker">Models</p>
      <h1 className="lede">Frontier model matrix.</h1>
      <div className="card section" style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.92rem" }}>
          <thead>
            <tr>
              {["Model", "Turns", "Cost/task", "AA", "GDPval 1753", "CursorBench 69.9", "Harvey LAB 15.8", "Swarm runtime", "$2/$6", "Wins / losses"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "0.5rem", borderBottom: "1px solid rgba(232,213,163,.2)" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[0]}>
                {row.map((cell, index) => (
                  <td key={`${row[0]}-${index}`} style={{ padding: "0.55rem", borderBottom: "1px solid rgba(232,213,163,.1)" }}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid g3 section">
        {rows.map((row) => (
          <div key={`card-${row[0]}`} className="card">
            <h2 className="sub">{row[0]}</h2>
            <p>{row[9]}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

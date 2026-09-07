# Starlight Research

A large language model hub for model evidence, workflow evaluation and economics.

- **Public hub:** https://starlight-research-hub.vercel.app
- **Model registry:** seven selected models, two providers, sources checked 7 September 2026.
- **New dossier:** GPT-6 Astra with API facts, source context and explicit evidence limits.
- **Free articles:** founder, creator and enterprise guides on FrankX; one canonical copy each.
- **Evaluation:** twelve synthetic decision cases in `frankxai/llm-evals`, unrun and unpromoted. Public sanitized record at `/api/evidence`.

## Develop

```sh
npm ci
npm run dev
npm run check
npm run build
```

No API credentials are required. The site makes no inference calls. Calculator input stays in the browser.

See [the operating protocol](docs/OPERATIONS.md), [design direction](docs/design/direction.md) and `data/sources.json` for methodology and scope. Native Vercel Git integration owns preview and production deployment. Use branches and pull requests.

The former scaffolding and open PR #2 are preserved in Git history; this release builds an evidence-led catalog from main without adopting unsupported historical claims.

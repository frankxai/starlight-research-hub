# LLM hub operating protocol

Canonical public reference: this repository. Canonical evaluation cases and runner: `frankxai/llm-evals`. Canonical free articles: `frankxai/frankx.ai-vercel-website/content/blog/`.

## Update a release

1. Read first-party release, model, pricing and affected connector documentation. Record retrieval date and exact claim scope in `data/sources.json`. A vendor score is always a vendor report, including competitors quoted in that vendor's table.
2. Update `data/models.json`. All prices are USD per million tokens at standard short context. Missing results are `null`; workload lanes are editorial candidates. Document tokenizer and processing-tier limits.
3. Define the decision to test in the evaluation repo. Version inputs, policy and expectations. Run unit tests before any model execution. Only D0 public or synthetic inputs may enter the public evidence path.
4. After an explicit model run, export with `python -m sovereign_evals.cli export-hub --suite business --provider codex-astra-readonly --source-commit FULL_SHA` (see evaluation repo for runtime setup and optional run ID). Without a run ID it is a plan. Inspect the sanitized output; commit it to `data/astra-evidence.json` and align registry status. Never commit raw runtime results.
5. Extend the renderer and validator before importing a new evidence stage. Current UI is deliberately scoped to the first unrun synthetic suite. Do not mechanically replace it with live connector or subjective-judge claims.
6. Run `npm ci`, `npm run check`, `npm run build`. Independent review covers source correctness, cost assumptions, evidence boundaries, mobile/keyboard UI and links. Publish through a branch and PR; Vercel provides the deployment.
7. Verify the production root, model dossier, controls, evidence JSON, canonical links, OG image, robots and sitemap. Record deployment SHA and URL outside the production change. Roll back via the previous Git commit/Vercel deployment if necessary.

## Evidence and promotion

Implemented: 12 deterministic synthetic decision cases; a disabled Astra/high Codex adapter; sanitized export that verifies local receipt hashes. Not implemented: live connector testing, subjective judge calibration, a production canary or ongoing automatic model runs. The hub performs no model calls and incurs no inference spend.

Before a production trial, the workload owner sets acceptance, p95 latency and total-cost thresholds. Add representative failure cases and repeat runs. Human reviewers calibrate an independent judge if used. Critical tenant-boundary or unauthorized-write failures block promotion regardless of an average score. Preserve baseline and rollback. See `data/evaluation-policy.json`.

Review sources at each release/pricing change and before a model-selection decision. The site displays the actual reviewed snapshot date; it does not claim continuous freshness or schedule automatic publishing. New articles cross-link this hub but are not duplicated here.

## Maintenance scope

The comparison includes seven selected models from two providers. It is not an exhaustive frontier directory. Dossier slugs are catalog identifiers; only Astra's page makes a verified API-ID claim. No subscription/API equivalence or native video-generation claim is made. No visitor input is sent to a server or retained by the calculator. No analytics added in this release; Vercel deployment health is the operational signal, not conversion measurement.

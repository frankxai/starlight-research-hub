# Research Hub branch convergence

The latest observed failed Vercel candidate built the claim-promotion branch without an App Router. The application exists separately in PR #3. This candidate combines the existing application with the research packet engine and verifies both with one command.

| Source | Treatment |
| --- | --- |
| PR #3, `402f61f56383ac3ac2df41c2a28fd934ec035e1f` | Preserve the application, model data, source ledger, cost calculator and evaluation views. |
| PR #4, `96b114b6517d819cb073a262ab1589039ded4808` | Import only `research/`; keep the packet validation, promotion and drift checks. |
| Current main | Preserve the explicit Vercel automatic-deployment disablement. |
| PR #2 | Preserve separately; no competing application or unsourced thesis is imported. |

`npm run check` now runs both suites plus the data and TypeScript checks. GitHub CI also builds the actual app, including on draft PRs. A successful run is build evidence, not approval to deploy or proof that benchmark sources were refreshed.

The August Grok packet is historical, deliberately unpromotable evidence. Its unsourced performance claims must not be copied into the application. Importing the engine does not automatically connect it to every model record or make the site a live model evaluator.

The buyer is an architect choosing a model for a defined workload. The next product milestone is a saved workload comparison with dated source evidence and an exportable acceptance contract. First prove the current comparison and calculator in a representative browser; then add persistence only when return usage justifies it.

No live model invocation, payment, DNS change or automatic deployment is introduced.

# Research packets

A research week is a typed graph, not a document. This directory holds the contract,
the machinery, and the packets.

```
research/
  schema/research-packet.v1.json   ResearchPacket.v1 — 11 node types
  lib/packet.mjs                   validation, source-status derivation, freshness, contradiction
  lib/promote.mjs                  promotion to a Markdown block, and the drift check on it
  packets/                         one file per dated week
  report.mjs                       CLI gate — exits non-zero on invalid packet or blocked promotion
  test/                            node --test
```

Zero dependencies. Nothing here imports Next, React, or anything in `node_modules`.

```bash
node --test "research/test/*.test.mjs"
node research/report.mjs research/packets/2026-08-31-grok-orchestration.json --as-of 2026-09-02
```

## The rule the machinery exists to enforce

An essay can hold a number that nobody can trace. A packet cannot. `Claim` is the only
node type allowed to carry a value, and every claim carries `sourceIds`, `observedAt`,
and a `freshnessWindowDays`. `deriveStatus` recomputes each claim's status from the
sources and parents it actually has; declaring a status stronger than that is a
validation failure, so an arithmetic step cannot launder a guess into a fact.

`promote()` then refuses to emit a public block containing a numeric claim that is
unsourced, or one whose only source was named but never retrieved. This is
`TRUTH.md`'s rule — never hand-type a number a command can produce — made mechanical.

## Drift

Promotion emits Markdown where every sentence carries the claim id it came from:

```
Grok 4.6 costs $0.84 per finished task. [^clm-grok46-cost-per-task]

[^clm-grok46-cost-per-task]: Artificial Analysis Intelligence Index — observed 2026-08-31.
```

`checkPromotionDrift(markdownFromTheLiveSurface, packet)` then reads the text as it
sits on frankx.ai and reports three failures: a sentence with no claim id, a claim id
the packet does not contain, and a sentence whose wording no longer matches the claim.
That last one is the copy-paste failure — a number quietly edited on the public page
while the research says something else.

## Standing verdict on the current README thesis

The repository README's thesis is expressed as a packet in
`packets/2026-08-31-grok-orchestration.json`. It does not promote:

- `~53 turns` and `$0.84/task` are unsourced numbers.
- The `61` index scores name the Artificial Analysis Intelligence Index, which was not
  retrieved. They may circulate internally; they may not go on a public surface.
- The `63` for Claude Opus 5 is derived from a sourced-by-name score plus an unsourced
  two-point gap, so it inherits the weaker parent and lands on unsourced.

No citation was invented to close these. Filling them is fetch work, not writing work.

## Adding a week

1. Copy the newest packet, change `packetId` and `week`.
2. Add `Source` nodes first. `resolution: "retrieved"` means you opened it in that run.
3. Add claims. Let `report.mjs` tell you the status; do not declare it optimistically.
4. Run the report. Promote only what comes back approved.

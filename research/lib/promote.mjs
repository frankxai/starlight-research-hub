/**
 * Promotion — turn a packet into a Markdown block a public surface can paste,
 * and prove that the pasted text still maps to the packet.
 *
 * The whole point: copy-paste drift is invisible in prose and obvious in a graph.
 * Every promoted sentence carries the claim id it came from. A sentence with no
 * claim id, or a claim id the packet does not contain, is drift.
 */

import { assessFreshness, findContradictions, validatePacket } from './packet.mjs';

const CLAIM_REF_RE = /\[\^([a-z][a-z0-9-]{2,63})\]/g;

/**
 * Reasons a claim may not be promoted to a public surface.
 * Numeric values are held to the hard rule from TRUTH.md: never hand-type a
 * number a source can produce. An unsourced number is a blocker, not a warning.
 */
function claimBlockers(claim, freshnessById, target) {
  const blockers = [];
  const numeric = typeof claim.value === 'number';
  if (claim.status === 'unsourced') {
    blockers.push(
      numeric
        ? `${claim.id}: numeric value ${claim.value} has no source`
        : `${claim.id}: has no source`,
    );
  }
  if (claim.status === 'named-unverified' && numeric && target !== 'internal') {
    blockers.push(`${claim.id}: numeric value ${claim.value} cites a named but unretrieved source`);
  }
  const freshness = freshnessById.get(claim.id);
  if (freshness?.state === 'stale') {
    blockers.push(`${claim.id}: observed ${freshness.observedAt}, ${freshness.ageDays}d old against a ${freshness.freshnessWindowDays}d window`);
  }
  if (freshness?.state === 'future-dated') {
    blockers.push(`${claim.id}: observedAt is in the future relative to asOf`);
  }
  if (!claim.text) {
    blockers.push(`${claim.id}: no promotable text`);
  }
  return blockers;
}

/**
 * @param {object} packet
 * @param {{ claimIds: string[], target?: string, asOf: string, artifactId?: string, promotionId?: string }} options
 * @returns {{ state: 'approved'|'blocked', markdown: string|null, blockedBy: string[], claimIds: string[] }}
 */
export function promote(packet, options) {
  const { claimIds, target = 'frankx.ai', asOf, promotionId = 'prm-adhoc' } = options;
  const structural = validatePacket(packet);
  if (!structural.ok) {
    return {
      state: 'blocked',
      markdown: null,
      claimIds,
      blockedBy: structural.issues.map((i) => `packet: ${i.code} at ${i.path}`),
    };
  }

  const byId = new Map((packet.nodes?.claims ?? []).map((c) => [c.id, c]));
  const freshnessById = new Map(assessFreshness(packet, asOf).map((f) => [f.claimId, f]));

  const blockedBy = [];
  for (const contradiction of findContradictions(packet)) {
    if (contradiction.claims.some((c) => claimIds.includes(c.claimId))) {
      blockedBy.push(
        `contradiction on ${contradiction.subject} ${contradiction.predicate}: ${contradiction.claims
          .map((c) => `${c.claimId}=${JSON.stringify(c.value)}`)
          .join(' vs ')}`,
      );
    }
  }

  const selected = [];
  for (const id of claimIds) {
    const claim = byId.get(id);
    if (!claim) {
      blockedBy.push(`${id}: not a claim in this packet`);
      continue;
    }
    blockedBy.push(...claimBlockers(claim, freshnessById, target));
    selected.push(claim);
  }

  if (blockedBy.length > 0) {
    return { state: 'blocked', markdown: null, claimIds, blockedBy };
  }

  const sourcesById = new Map((packet.nodes?.sources ?? []).map((s) => [s.id, s]));
  const lines = [
    `<!-- promotion:${promotionId} packet:${packet.packetId} schema:${packet.schemaVersion} target:${target} as-of:${asOf} -->`,
    '',
  ];
  for (const claim of selected) {
    lines.push(`${claim.text.trim()} [^${claim.id}]`);
  }
  lines.push('');
  for (const claim of selected) {
    const cites = (claim.sourceIds ?? [])
      .map((sid) => sourcesById.get(sid))
      .filter(Boolean)
      .map((s) => (s.locator ? `${s.name} (${s.locator})` : s.name))
      .join('; ');
    lines.push(`[^${claim.id}]: ${cites} — observed ${claim.observedAt}.`);
  }

  return { state: 'approved', markdown: `${lines.join('\n')}\n`, claimIds, blockedBy: [] };
}

/**
 * Drift check. Run this against the text as it actually sits on the public
 * surface, not against what promote() returned — the gap between those two is
 * exactly the failure this guards.
 *
 * @returns {{ ok: boolean, drift: Array<{kind: string, detail: string}> }}
 */
export function checkPromotionDrift(markdown, packet) {
  const drift = [];
  const claimIds = new Set((packet.nodes?.claims ?? []).map((c) => c.id));
  const claimTexts = new Map((packet.nodes?.claims ?? []).map((c) => [c.id, (c.text ?? '').trim()]));

  const referenced = new Set();
  for (const rawLine of markdown.split('\n')) {
    const line = rawLine.trim();
    if (line === '' || line.startsWith('<!--')) continue;
    if (/^\[\^[a-z][a-z0-9-]*\]:/.test(line)) continue;

    const refs = [...line.matchAll(CLAIM_REF_RE)].map((m) => m[1]);
    if (refs.length === 0) {
      drift.push({ kind: 'unmapped-sentence', detail: line });
      continue;
    }
    for (const ref of refs) {
      referenced.add(ref);
      if (!claimIds.has(ref)) {
        drift.push({ kind: 'unknown-claim', detail: ref });
        continue;
      }
      const body = line.replace(CLAIM_REF_RE, '').trim();
      if (body !== claimTexts.get(ref)) {
        drift.push({
          kind: 'text-drift',
          detail: `${ref}: surface reads "${body}", packet reads "${claimTexts.get(ref)}"`,
        });
      }
    }
  }

  if (referenced.size === 0) {
    drift.push({ kind: 'no-claims-referenced', detail: 'promoted block cites no claim ids' });
  }

  return { ok: drift.length === 0, drift };
}

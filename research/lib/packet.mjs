/**
 * ResearchPacket.v1 — structural validation, freshness, contradiction.
 *
 * Zero dependencies. The JSON Schema in ../schema/research-packet.v1.json is the
 * published contract; this module enforces the parts a schema cannot express:
 * referential integrity, source-status derivation, and the rule that a derived
 * claim is never better sourced than its weakest parent.
 */

export const SCHEMA_VERSION = 'ResearchPacket.v1';

const NODE_KINDS = [
  'models',
  'capabilities',
  'benchmarks',
  'sources',
  'claims',
  'repos',
  'dependencies',
  'decisions',
  'artifacts',
  'reviews',
  'promotions',
];

const ID_RE = /^[a-z][a-z0-9-]{2,63}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function fail(issues, code, path, detail) {
  issues.push({ code, path, detail });
}

function indexNodes(packet) {
  const byId = new Map();
  for (const kind of NODE_KINDS) {
    for (const node of packet.nodes?.[kind] ?? []) {
      byId.set(node.id, { kind, node });
    }
  }
  return byId;
}

/** @returns {{ ok: boolean, issues: Array<{code: string, path: string, detail: string}> }} */
export function validatePacket(packet) {
  const issues = [];

  if (packet?.schemaVersion !== SCHEMA_VERSION) {
    fail(issues, 'schema-version', 'schemaVersion', `expected ${SCHEMA_VERSION}`);
    return { ok: false, issues };
  }
  for (const field of ['packetId', 'owner', 'visibility', 'week', 'nodes']) {
    if (packet[field] === undefined) fail(issues, 'missing-field', field, 'required');
  }
  if (packet.packetId && !ID_RE.test(packet.packetId)) {
    fail(issues, 'bad-id', 'packetId', packet.packetId);
  }

  const byId = indexNodes(packet);
  const seen = new Set();
  for (const kind of NODE_KINDS) {
    for (const node of packet.nodes?.[kind] ?? []) {
      const path = `nodes.${kind}.${node.id}`;
      if (!ID_RE.test(node.id ?? '')) fail(issues, 'bad-id', path, String(node.id));
      if (seen.has(node.id)) fail(issues, 'duplicate-id', path, node.id);
      seen.add(node.id);
    }
  }

  const sources = new Map((packet.nodes?.sources ?? []).map((s) => [s.id, s]));

  for (const claim of packet.nodes?.claims ?? []) {
    const path = `nodes.claims.${claim.id}`;
    if (!byId.has(claim.subject)) {
      fail(issues, 'dangling-subject', path, `subject ${claim.subject} is not a node in this packet`);
    }
    if (!DATE_RE.test(claim.observedAt ?? '')) {
      fail(issues, 'bad-date', `${path}.observedAt`, String(claim.observedAt));
    }
    if (!Number.isInteger(claim.freshnessWindowDays) || claim.freshnessWindowDays < 1) {
      fail(issues, 'bad-freshness-window', path, String(claim.freshnessWindowDays));
    }
    if (claim.benchmarkId && !byId.has(claim.benchmarkId)) {
      fail(issues, 'dangling-benchmark', path, claim.benchmarkId);
    }
    for (const sid of claim.sourceIds ?? []) {
      if (!sources.has(sid)) fail(issues, 'dangling-source', path, sid);
    }
    for (const pid of claim.derivedFrom ?? []) {
      if (!byId.has(pid)) fail(issues, 'dangling-parent-claim', path, pid);
    }
    const derived = deriveStatus(claim, packet);
    if (derived !== claim.status) {
      fail(
        issues,
        'status-mismatch',
        `${path}.status`,
        `declared ${claim.status}, sources and parents imply ${derived}`,
      );
    }
  }

  for (const dep of packet.nodes?.dependencies ?? []) {
    for (const end of ['fromRepoId', 'toRepoId']) {
      if (!byId.has(dep[end])) fail(issues, 'dangling-repo', `nodes.dependencies.${dep.id}.${end}`, dep[end]);
    }
  }
  for (const artifact of packet.nodes?.artifacts ?? []) {
    for (const cid of artifact.claimIds ?? []) {
      if (!byId.has(cid)) fail(issues, 'dangling-claim', `nodes.artifacts.${artifact.id}`, cid);
    }
  }
  for (const promotion of packet.nodes?.promotions ?? []) {
    if (!byId.has(promotion.artifactId)) {
      fail(issues, 'dangling-artifact', `nodes.promotions.${promotion.id}`, promotion.artifactId);
    }
    for (const cid of promotion.claimIds ?? []) {
      if (!byId.has(cid)) fail(issues, 'dangling-claim', `nodes.promotions.${promotion.id}`, cid);
    }
  }
  for (const review of packet.nodes?.reviews ?? []) {
    if (!byId.has(review.targetId)) {
      fail(issues, 'dangling-target', `nodes.reviews.${review.id}`, review.targetId);
    }
  }

  return { ok: issues.length === 0, issues };
}

const STATUS_RANK = { sourced: 2, 'named-unverified': 1, unsourced: 0 };
const RANK_STATUS = ['unsourced', 'named-unverified', 'sourced'];

/**
 * A claim's real status is the weakest of its own sources and every parent it
 * was derived from. Declaring a stronger status is a validation failure, not a
 * style note — this is what stops an arithmetic step from laundering a guess.
 */
export function deriveStatus(claim, packet) {
  const sources = new Map((packet.nodes?.sources ?? []).map((s) => [s.id, s]));
  const claims = new Map((packet.nodes?.claims ?? []).map((c) => [c.id, c]));

  const ids = claim.sourceIds ?? [];
  const parents = claim.derivedFrom ?? [];

  // A claim with neither sources nor parents is unsourced. A purely derived claim
  // inherits its parents rather than starting at zero, so arithmetic over sourced
  // claims stays sourced — and one unsourced parent still drags the result down.
  let rank = ids.length > 0
    ? Math.min(
        ...ids.map((sid) => {
          const resolution = sources.get(sid)?.resolution;
          if (resolution === 'retrieved') return STATUS_RANK.sourced;
          if (resolution === 'named-unretrieved') return STATUS_RANK['named-unverified'];
          return STATUS_RANK.unsourced;
        }),
      )
    : parents.length > 0
      ? Number.POSITIVE_INFINITY
      : STATUS_RANK.unsourced;

  for (const pid of parents) {
    const parent = claims.get(pid);
    if (!parent) return 'unsourced';
    rank = Math.min(rank, STATUS_RANK[deriveStatus(parent, packet)] ?? 0);
  }
  return RANK_STATUS[Number.isFinite(rank) ? rank : STATUS_RANK.unsourced];
}

function daysBetween(fromIso, toIso) {
  const ms = Date.parse(`${toIso}T00:00:00Z`) - Date.parse(`${fromIso}T00:00:00Z`);
  return Math.floor(ms / 86_400_000);
}

/**
 * @param {object} packet
 * @param {string} asOf YYYY-MM-DD. Required — freshness is never read from the wall clock,
 *                      so a report is reproducible from the packet plus one date.
 */
export function assessFreshness(packet, asOf) {
  if (!DATE_RE.test(asOf ?? '')) throw new TypeError('assessFreshness requires an explicit YYYY-MM-DD asOf date');
  return (packet.nodes?.claims ?? []).map((claim) => {
    const ageDays = daysBetween(claim.observedAt, asOf);
    return {
      claimId: claim.id,
      observedAt: claim.observedAt,
      ageDays,
      freshnessWindowDays: claim.freshnessWindowDays,
      state: ageDays < 0 ? 'future-dated' : ageDays <= claim.freshnessWindowDays ? 'fresh' : 'stale',
    };
  });
}

/**
 * Two claims contradict when they share a subject and predicate but disagree on
 * value. Both are kept: the packet records that the field disagrees with itself,
 * it does not pick a winner.
 */
export function findContradictions(packet) {
  const groups = new Map();
  for (const claim of packet.nodes?.claims ?? []) {
    const key = `${claim.subject}::${claim.predicate}::${claim.unit ?? ''}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(claim);
  }
  const contradictions = [];
  for (const [key, claims] of groups) {
    if (claims.length < 2) continue;
    const values = new Set(claims.map((c) => JSON.stringify(c.value)));
    if (values.size < 2) continue;
    const [subject, predicate] = key.split('::');
    contradictions.push({
      subject,
      predicate,
      claims: claims
        .map((c) => ({ claimId: c.id, value: c.value, observedAt: c.observedAt, status: c.status }))
        .sort((a, b) => a.claimId.localeCompare(b.claimId)),
    });
  }
  return contradictions.sort((a, b) => `${a.subject}${a.predicate}`.localeCompare(`${b.subject}${b.predicate}`));
}

export function loadPacket(json) {
  const packet = typeof json === 'string' ? JSON.parse(json) : json;
  const result = validatePacket(packet);
  if (!result.ok) {
    const detail = result.issues.map((i) => `${i.code} at ${i.path}: ${i.detail}`).join('; ');
    throw new Error(`ResearchPacket.v1 invalid: ${detail}`);
  }
  return packet;
}

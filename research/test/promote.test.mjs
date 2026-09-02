import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { checkPromotionDrift, promote } from '../lib/promote.mjs';

const packetPath = fileURLToPath(new URL('../packets/2026-08-31-grok-orchestration.json', import.meta.url));
const realPacket = () => JSON.parse(readFileSync(packetPath, 'utf8'));
const AS_OF = '2026-09-02';

/** Give a claim a real retrieved source so it becomes promotable. */
function withRetrievedSource(packet, claimId) {
  packet.nodes.sources.push({
    id: 'src-test-retrieved',
    name: 'Synthetic retrieved source',
    kind: 'measurement',
    locator: 'file://synthetic',
    resolution: 'retrieved',
  });
  const claim = packet.nodes.claims.find((c) => c.id === claimId);
  claim.sourceIds = ['src-test-retrieved'];
  claim.derivedFrom = [];
  claim.status = 'sourced';
  return packet;
}

test("the README thesis cannot be promoted as written — every economic number is unsourced", () => {
  const result = promote(realPacket(), {
    claimIds: ['clm-grok46-aa-index', 'clm-grok46-turns-per-task', 'clm-grok46-cost-per-task'],
    target: 'frankx.ai',
    asOf: AS_OF,
  });

  assert.equal(result.state, 'blocked');
  assert.equal(result.markdown, null);
  assert.ok(result.blockedBy.some((b) => b.startsWith('clm-grok46-turns-per-task: numeric value 53 has no source')));
  assert.ok(result.blockedBy.some((b) => b.startsWith('clm-grok46-cost-per-task: numeric value 0.84 has no source')));
  assert.ok(result.blockedBy.some((b) => b.includes('named but unretrieved source')));
});

test('a named-but-unretrieved number may circulate internally and not publicly', () => {
  const claimIds = ['clm-grok46-aa-index'];
  assert.equal(promote(realPacket(), { claimIds, target: 'frankx.ai', asOf: AS_OF }).state, 'blocked');
  assert.equal(promote(realPacket(), { claimIds, target: 'internal', asOf: AS_OF }).state, 'approved');
});

test('a sourced, fresh claim promotes to Markdown that carries its claim id and citation', () => {
  const packet = withRetrievedSource(realPacket(), 'clm-grok46-cost-per-task');
  const result = promote(packet, {
    claimIds: ['clm-grok46-cost-per-task'],
    target: 'frankx.ai',
    asOf: AS_OF,
    promotionId: 'prm-test',
  });

  assert.equal(result.state, 'approved');
  assert.match(result.markdown, /Grok 4\.6 costs \$0\.84 per finished task\. \[\^clm-grok46-cost-per-task\]/);
  assert.match(result.markdown, /\[\^clm-grok46-cost-per-task\]: Synthetic retrieved source \(file:\/\/synthetic\) — observed 2026-08-31\./);
  assert.match(result.markdown, /packet:rp-2026-08-31-grok-orchestration/);
});

test('promoted output round-trips through the drift checker', () => {
  const packet = withRetrievedSource(realPacket(), 'clm-grok46-cost-per-task');
  const { markdown } = promote(packet, { claimIds: ['clm-grok46-cost-per-task'], target: 'frankx.ai', asOf: AS_OF });
  assert.deepEqual(checkPromotionDrift(markdown, packet).drift, []);
});

test('a sentence added on the public surface with no claim id is drift', () => {
  const packet = withRetrievedSource(realPacket(), 'clm-grok46-cost-per-task');
  const { markdown } = promote(packet, { claimIds: ['clm-grok46-cost-per-task'], target: 'frankx.ai', asOf: AS_OF });
  const edited = markdown.replace(
    'Grok 4.6 costs',
    'Grok 4.6 is the cheapest frontier model on the market.\nGrok 4.6 costs',
  );

  const result = checkPromotionDrift(edited, packet);
  assert.equal(result.ok, false);
  assert.deepEqual(result.drift, [
    { kind: 'unmapped-sentence', detail: 'Grok 4.6 is the cheapest frontier model on the market.' },
  ]);
});

test('quietly editing the number on the public surface is caught as text drift', () => {
  const packet = withRetrievedSource(realPacket(), 'clm-grok46-cost-per-task');
  const { markdown } = promote(packet, { claimIds: ['clm-grok46-cost-per-task'], target: 'frankx.ai', asOf: AS_OF });
  const edited = markdown.replace('$0.84 per finished task', '$0.42 per finished task');

  const result = checkPromotionDrift(edited, packet);
  assert.equal(result.ok, false);
  assert.equal(result.drift[0].kind, 'text-drift');
  assert.match(result.drift[0].detail, /surface reads .*0\.42.*packet reads .*0\.84/);
});

test('a footnote pointing at a claim the packet does not contain is drift', () => {
  const packet = realPacket();
  const result = checkPromotionDrift('Some sentence. [^clm-invented-claim]\n', packet);
  assert.equal(result.ok, false);
  assert.ok(result.drift.some((d) => d.kind === 'unknown-claim' && d.detail === 'clm-invented-claim'));
});

test('prose with no claim ids at all fails rather than passing vacuously', () => {
  const result = checkPromotionDrift('Grok 4.6 is the best-orchestrated frontier model.\n', realPacket());
  assert.equal(result.ok, false);
  assert.ok(result.drift.some((d) => d.kind === 'unmapped-sentence'));
});

test('a stale claim is blocked even when it is fully sourced', () => {
  const packet = withRetrievedSource(realPacket(), 'clm-grok46-cost-per-task');
  const result = promote(packet, {
    claimIds: ['clm-grok46-cost-per-task'],
    target: 'frankx.ai',
    asOf: '2026-12-01',
  });
  assert.equal(result.state, 'blocked');
  assert.ok(result.blockedBy.some((b) => b.includes('92d old against a 30d window')));
});

test('a contradiction touching a selected claim blocks the whole promotion', () => {
  const packet = withRetrievedSource(realPacket(), 'clm-grok46-cost-per-task');
  packet.nodes.claims.push({
    ...packet.nodes.claims.find((c) => c.id === 'clm-grok46-cost-per-task'),
    id: 'clm-grok46-cost-per-task-alt',
    value: 1.12,
    text: 'Grok 4.6 costs $1.12 per finished task.',
  });

  const result = promote(packet, { claimIds: ['clm-grok46-cost-per-task'], target: 'frankx.ai', asOf: AS_OF });
  assert.equal(result.state, 'blocked');
  assert.ok(result.blockedBy.some((b) => b.startsWith('contradiction on cap-finished-work-economics')));
});

test("the packet's recorded promotion blockers match what promote() computes today", () => {
  const packet = realPacket();
  const recorded = packet.nodes.promotions.find((p) => p.id === 'prm-thesis-to-frankx');
  const result = promote(packet, { claimIds: recorded.claimIds, target: recorded.target, asOf: AS_OF });

  assert.equal(result.state, recorded.state);
  assert.deepEqual([...result.blockedBy].sort(), [...recorded.blockedBy].sort());
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { assessFreshness, deriveStatus, findContradictions, loadPacket, validatePacket } from '../lib/packet.mjs';

const packetPath = fileURLToPath(new URL('../packets/2026-08-31-grok-orchestration.json', import.meta.url));
const realPacket = () => JSON.parse(readFileSync(packetPath, 'utf8'));

test('the shipped packet is structurally valid', () => {
  const result = validatePacket(realPacket());
  assert.deepEqual(result.issues, []);
  assert.equal(result.ok, true);
});

test('loadPacket throws with the failing path when a claim points at nothing', () => {
  const packet = realPacket();
  packet.nodes.claims[0].subject = 'mdl-does-not-exist';
  assert.throws(() => loadPacket(packet), /dangling-subject/);
});

test('a declared status stronger than the sources allow is a validation failure', () => {
  const packet = realPacket();
  const claim = packet.nodes.claims.find((c) => c.id === 'clm-grok46-cost-per-task');
  claim.status = 'sourced';
  const result = validatePacket(packet);
  assert.equal(result.ok, false);
  assert.ok(result.issues.some((i) => i.code === 'status-mismatch' && i.path.includes('clm-grok46-cost-per-task')));
});

test('a derived claim is never better sourced than its weakest parent', () => {
  const packet = realPacket();
  // clm-opus5-aa-index derives from one named-unverified parent and one unsourced parent.
  assert.equal(deriveStatus(packet.nodes.claims.find((c) => c.id === 'clm-opus5-aa-index'), packet), 'unsourced');
});

test('a derived claim inherits a sourced parent rather than decaying to unsourced', () => {
  const packet = realPacket();
  packet.nodes.sources.push({
    id: 'src-test-retrieved',
    name: 'Synthetic retrieved source',
    kind: 'measurement',
    locator: 'file://synthetic',
    resolution: 'retrieved',
  });
  const parent = packet.nodes.claims.find((c) => c.id === 'clm-grok46-aa-index');
  parent.sourceIds = ['src-test-retrieved'];
  parent.status = 'sourced';
  const child = packet.nodes.claims.find((c) => c.id === 'clm-opus5-aa-index');
  child.derivedFrom = ['clm-grok46-aa-index'];
  assert.equal(deriveStatus(child, packet), 'sourced');
});

test('freshness is computed from an explicit date, never the wall clock', () => {
  const packet = realPacket();
  assert.throws(() => assessFreshness(packet, undefined), TypeError);

  const fresh = assessFreshness(packet, '2026-09-02').find((f) => f.claimId === 'clm-grok46-aa-index');
  assert.equal(fresh.ageDays, 2);
  assert.equal(fresh.state, 'fresh');

  const stale = assessFreshness(packet, '2026-10-31').find((f) => f.claimId === 'clm-grok46-aa-index');
  assert.equal(stale.state, 'stale');

  const future = assessFreshness(packet, '2026-08-01').find((f) => f.claimId === 'clm-grok46-aa-index');
  assert.equal(future.state, 'future-dated');
});

test('the shipped packet holds no contradictions', () => {
  assert.deepEqual(findContradictions(realPacket()), []);
});

test('two claims on one subject and predicate with different values are both kept', () => {
  const packet = realPacket();
  packet.nodes.claims.push({
    id: 'clm-grok46-aa-index-revised',
    subject: 'mdl-grok-4-6',
    predicate: 'artificial-analysis-intelligence-index',
    value: 59,
    unit: 'index-points',
    benchmarkId: 'bmk-aa-intelligence-index',
    observedAt: '2026-09-01',
    freshnessWindowDays: 14,
    sourceIds: ['src-artificial-analysis-index'],
    status: 'named-unverified',
    text: 'Grok 4.6 scores 59 on the Artificial Analysis Intelligence Index.',
  });

  const contradictions = findContradictions(packet);
  assert.equal(contradictions.length, 1);
  assert.equal(contradictions[0].subject, 'mdl-grok-4-6');
  assert.deepEqual(
    contradictions[0].claims.map((c) => c.claimId),
    ['clm-grok46-aa-index', 'clm-grok46-aa-index-revised'],
  );
  // Neither is dropped and neither is marked the winner.
  assert.deepEqual(contradictions[0].claims.map((c) => c.value), [61, 59]);
});

test('same subject and predicate with the same value is agreement, not contradiction', () => {
  const packet = realPacket();
  packet.nodes.claims.push({
    ...packet.nodes.claims.find((c) => c.id === 'clm-grok46-aa-index'),
    id: 'clm-grok46-aa-index-confirmed',
    observedAt: '2026-09-01',
  });
  assert.deepEqual(findContradictions(packet), []);
});

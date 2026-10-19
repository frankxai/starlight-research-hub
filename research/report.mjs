#!/usr/bin/env node
/**
 * Packet report. Zero dependencies, no network, no install.
 *
 *   node research/report.mjs research/packets/2026-08-31-grok-orchestration.json --as-of 2026-09-02
 *   node research/report.mjs <packet> --promote clm-a,clm-b --target frankx.ai
 *
 * Exit code 1 when the packet is invalid or a requested promotion is blocked, so
 * this is usable as a gate before anything reaches a public surface.
 */

import { readFileSync } from 'node:fs';
import { assessFreshness, findContradictions, validatePacket } from './lib/packet.mjs';
import { promote } from './lib/promote.mjs';

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? fallback : process.argv[i + 1];
}

const packetPath = process.argv[2];
if (!packetPath) {
  console.error('usage: node research/report.mjs <packet.json> [--as-of YYYY-MM-DD] [--promote id,id] [--target frankx.ai]');
  process.exit(2);
}

const packet = JSON.parse(readFileSync(packetPath, 'utf8'));
const asOf = arg('as-of', new Date().toISOString().slice(0, 10));

const structural = validatePacket(packet);
console.log(`packet   ${packet.packetId} (${packet.schemaVersion}) owner=${packet.owner} visibility=${packet.visibility}`);
console.log(`week     ${packet.week.startsOn} to ${packet.week.endsOn}`);
console.log(`valid    ${structural.ok ? 'yes' : 'no'}`);
for (const issue of structural.issues) console.log(`  ${issue.code} at ${issue.path}: ${issue.detail}`);

const claims = packet.nodes?.claims ?? [];
const byStatus = { sourced: 0, 'named-unverified': 0, unsourced: 0 };
for (const c of claims) byStatus[c.status] = (byStatus[c.status] ?? 0) + 1;
console.log(
  `claims   ${claims.length} — sourced ${byStatus.sourced}, named-unverified ${byStatus['named-unverified']}, unsourced ${byStatus.unsourced}`,
);

const unsourcedNumbers = claims.filter((c) => typeof c.value === 'number' && c.status === 'unsourced');
if (unsourcedNumbers.length > 0) {
  console.log(`numbers  ${unsourcedNumbers.length} hand-typed and unsourced (TRUTH.md violation if promoted):`);
  for (const c of unsourcedNumbers) console.log(`  ${c.id} = ${c.value}${c.unit ? ` ${c.unit}` : ''}`);
}

const stale = assessFreshness(packet, asOf).filter((f) => f.state !== 'fresh');
console.log(`freshness as of ${asOf}: ${stale.length === 0 ? 'all fresh' : `${stale.length} not fresh`}`);
for (const f of stale) console.log(`  ${f.claimId} ${f.state} (${f.ageDays}d / ${f.freshnessWindowDays}d)`);

const contradictions = findContradictions(packet);
console.log(`contradictions ${contradictions.length}`);
for (const c of contradictions) {
  console.log(`  ${c.subject} ${c.predicate}: ${c.claims.map((x) => `${x.claimId}=${JSON.stringify(x.value)}`).join(' vs ')}`);
}

const promoteIds = arg('promote');
let promotionBlocked = false;
if (promoteIds) {
  const result = promote(packet, {
    claimIds: promoteIds.split(',').map((s) => s.trim()).filter(Boolean),
    target: arg('target', 'frankx.ai'),
    asOf,
  });
  console.log(`\npromotion ${result.state}`);
  if (result.state === 'approved') {
    console.log('---');
    process.stdout.write(result.markdown);
    console.log('---');
  } else {
    for (const b of result.blockedBy) console.log(`  ${b}`);
    promotionBlocked = true;
  }
}

process.exit(structural.ok && !promotionBlocked ? 0 : 1);

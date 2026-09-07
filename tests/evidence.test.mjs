import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { validateData } from '../lib/validate.mjs'
const data=['models','sources','astra-evidence','evaluation-policy'].map(name=>JSON.parse(readFileSync(new URL(`../data/${name}.json`,import.meta.url),'utf8')))
test('current registry preserves evidence boundaries',()=>assert.equal(validateData(...data),true))
test('rejects invented pass rate for unrun suite',()=>{const d=structuredClone(data);d[2].metrics.pass_rate=1;assert.throws(()=>validateData(...d),/Unrun/)})
test('rejects results without artifact provenance',()=>{const d=structuredClone(data);d[2].status='measured';assert.throws(()=>validateData(...d),/provenance/)})
test('rejects orphaned price sources',()=>{const d=structuredClone(data);d[0][0].priceSource='missing';assert.throws(()=>validateData(...d),/source/)})
test('rejects silent production promotion',()=>{const d=structuredClone(data);d[2].production_ready=true;assert.throws(()=>validateData(...d),/promote/)})
test('rejects missing rate fields before calculator renders NaN',()=>{const d=structuredClone(data);delete d[0][0].rates.input;assert.throws(()=>validateData(...d),/Rate fields/)})
test('rejects fabricated outcome counters in unrun export',()=>{const d=structuredClone(data);d[2].metrics.passed=12;assert.throws(()=>validateData(...d),/Unrun/)})
test('rejects invented timing in unrun case',()=>{const d=structuredClone(data);d[2].cases[0].latency_ms=42;assert.throws(()=>validateData(...d),/Unrun/)})
test('rejects invented billing in unrun export',()=>{const d=structuredClone(data);d[2].actual_billed_cost_usd=100;assert.throws(()=>validateData(...d),/Unrun/)})

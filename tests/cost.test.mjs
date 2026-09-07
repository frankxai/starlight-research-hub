import test from 'node:test';
import assert from 'node:assert/strict';
import { estimateCost } from '../lib/cost.mjs';
const rates = { input: 10, cached: 1, output: 50 };
const task = {inputTokens:10000,outputTokens:2000,cacheHitPercent:0,attempts:1,successPercent:100,toolCost:0,reviewMinutes:0,hourlyRate:60};
test('standard short-context Astra example is $0.20',()=>assert.equal(estimateCost(task,rates).total,0.2));
test('cache applies to input, retry multiplies inference, review is once per task',()=>{
 const result = estimateCost({...task,cacheHitPercent:100,attempts:2,reviewMinutes:5,toolCost:1,successPercent:50},rates);
 assert.equal(result.inference,0.22);assert.equal(result.total,6.22);assert.equal(result.costPerAccepted,12.44);
});
test('zero accepted tasks has no finite accepted cost',()=>assert.equal(estimateCost({...task,successPercent:0},rates).costPerAccepted,null));
test('invalid values cannot silently produce a cheap quote',()=>{for(const patch of [{inputTokens:NaN},{attempts:0},{successPercent:101},{toolCost:-1},{outputTokens:Infinity}])assert.throws(()=>estimateCost({...task,...patch},rates));});

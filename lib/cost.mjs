export function estimateCost({ inputTokens, outputTokens, cacheHitPercent, attempts, successPercent, toolCost, reviewMinutes, hourlyRate }, rates) {
  const values = { inputTokens, outputTokens, cacheHitPercent, attempts, successPercent, toolCost, reviewMinutes, hourlyRate };
  for (const [key, value] of Object.entries(values)) {
    if (!Number.isFinite(value) || value < 0) throw new RangeError(`${key} must be finite and nonnegative`);
  }
  if (cacheHitPercent > 100 || successPercent > 100 || attempts < 1) throw new RangeError('Invalid percentage or attempts');
  for (const key of ['input','cached','output']) {
    if (!Number.isFinite(rates[key]) || rates[key] < 0) throw new RangeError('Invalid token rate');
  }
  const cacheFraction = cacheHitPercent / 100;
  const inputCost = inputTokens * ((1 - cacheFraction) * rates.input + cacheFraction * rates.cached) / 1e6;
  const outputCost = outputTokens * rates.output / 1e6;
  const inference = (inputCost + outputCost) * attempts;
  const total = inference + toolCost + reviewMinutes * hourlyRate / 60;
  return { inference, total, costPerAccepted: successPercent === 0 ? null : total / (successPercent / 100) };
}

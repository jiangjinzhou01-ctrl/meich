/** Critically damped spring, in CSS pixels and seconds. Absolute time avoids frame-rate drift. */
export function swipeSpring(from: number, velocity: number, target: number, seconds: number) {
  // Higher release energy increases damping while retaining the initial velocity.
  const omega = Math.max(16, Math.abs(velocity) / 120);
  const offset = from - target;
  const b = velocity + omega * offset;
  const decay = Math.exp(-omega * seconds);
  return {
    position: target + (offset + b * seconds) * decay,
    velocity: (velocity - omega * b * seconds) * decay,
  };
}
/** Continuous edge resistance: slope 1 on entry, progressively less travel thereafter. */
export function resistedPosition(position: number, lower: number, upper: number) {
  const bound = Math.max(lower, Math.min(upper, position));
  const extra = position - bound;
  return bound + extra / (1 + Math.abs(extra) / 80);
}
export function sampledVelocity(samples: { position: number; time: number }[], now: number) {
  if (samples.length < 2 || now - samples[samples.length - 1].time > 100) return 0;
  const recent = samples.filter(s => now - s.time <= 100);
  if (recent.length < 2) return 0;
  const origin = recent[0].time;
  const meanT = recent.reduce((sum, s) => sum + s.time - origin, 0) / recent.length;
  const meanX = recent.reduce((sum, s) => sum + s.position, 0) / recent.length;
  let numerator = 0, denominator = 0;
  for (const s of recent) {
    const t = s.time - origin - meanT;
    numerator += t * (s.position - meanX);
    denominator += t * t;
  }
  return denominator ? numerator / denominator * 1000 : 0;
}

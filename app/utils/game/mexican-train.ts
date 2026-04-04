/** Pip ladder rows: 12 down to 0 (13 rounds). */
export function mexicanTrainRowLabels(): readonly number[] {
  const out: number[] = []
  for (let p = 12; p >= 0; p -= 1) {
    out.push(p)
  }
  return out
}

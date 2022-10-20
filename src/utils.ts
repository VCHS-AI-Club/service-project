export function partition<T>(
  array: T[],
  filter: (e: T, i?: number, a?: T[]) => boolean
): [T[], T[]] {
  const pass: T[] = [];
  const fail: T[] = [];
  array.forEach((e, idx, arr) => (filter(e, idx, arr) ? pass : fail).push(e));
  return [pass, fail];
}

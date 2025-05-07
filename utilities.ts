export const do_ = <A>(k: () => A): A => k();

export function fold<A>(xss: A[][]): A[] {
  return xss.reduce((acc, arr) => acc.concat(arr), [] as A[]);
}

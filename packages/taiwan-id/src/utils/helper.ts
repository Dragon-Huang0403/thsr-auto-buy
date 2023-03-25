export function objectKeys<
  T extends Record<string, unknown>,
  Key extends keyof T,
>(object: T) {
  const keys = Object.keys(object) as Key[];
  return keys;
}

export function getRandomItem<T>(arr: readonly T[]) {
  const len = arr.length;
  const randomIndex = Math.floor(Math.random() * len);
  const item = arr[randomIndex] as T;
  return item;
}

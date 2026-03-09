
export function debounce<T extends (...args: unknown[]) => void>(fn: T, ms = 300): T {
  let timer: ReturnType<typeof setTimeout>;
  return ((...args: unknown[]) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), ms); }) as T;
}

export function memoize<T>(fn: (key: string) => T): (key: string) => T {
  const cache = new Map<string, T>();
  return (key: string) => { if (!cache.has(key)) cache.set(key, fn(key)); return cache.get(key)!; };
}

export function objectPick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  return keys.reduce((acc, k) => { if (k in obj) acc[k] = obj[k]; return acc; }, {} as Pick<T, K>);
}

export function safeParseInt(val: unknown, fallback = 0): number {
  const n = parseInt(String(val), 10);
  return isNaN(n) ? fallback : n;
}

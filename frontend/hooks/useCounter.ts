'use client';
import { useState } from 'react';
export function useCounter(initial = 0, { min, max }: { min?: number; max?: number } = {}) {
  const [count, setCount] = useState(initial);
  const inc  = () => setCount(c => max !== undefined ? Math.min(c + 1, max) : c + 1);
  const dec  = () => setCount(c => min !== undefined ? Math.max(c - 1, min) : c - 1);
  const reset = () => setCount(initial);
  return { count, inc, dec, reset, set: setCount };
}
import { useEffect, useRef, useCallback } from 'react';

export function useTimeout(callback: () => void, delay: number | null) {
  const saved = useRef(callback);
  useEffect(() => { saved.current = callback; }, [callback]);
  const clear = useRef<ReturnType<typeof setTimeout>>();
  const reset = useCallback(() => {
    if (clear.current) clearTimeout(clear.current);
    if (delay !== null) clear.current = setTimeout(() => saved.current(), delay);
  }, [delay]);
  useEffect(() => { reset(); return () => { if (clear.current) clearTimeout(clear.current); }; }, [reset]);
  return reset;
}

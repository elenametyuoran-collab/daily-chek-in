import { useEffect, useRef } from 'react';

export function useEventListener<K extends keyof WindowEventMap>(
  type: K,
  handler: (event: WindowEventMap[K]) => void
) {
  const saved = useRef(handler);
  useEffect(() => { saved.current = handler; }, [handler]);
  useEffect(() => {
    const fn = (e: WindowEventMap[K]) => saved.current(e);
    window.addEventListener(type, fn);
    return () => window.removeEventListener(type, fn);
  }, [type]);
}

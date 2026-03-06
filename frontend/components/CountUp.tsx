'use client';
import { useEffect, useRef, useState } from 'react';

interface CountUpProps { to: number; duration?: number; className?: string }

export default function CountUp({ to, duration = 1000, className = '' }: CountUpProps) {
  const [val, setVal] = useState(0);
  const raf = useRef<number>();
  useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setVal(Math.round(t * to));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [to, duration]);
  return <span className={className}>{val.toLocaleString()}</span>;
}

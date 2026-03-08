'use client';
import { useState, useRef, useCallback } from 'react';
export function useHover<T extends HTMLElement>() {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<T>(null);
  const onEnter = useCallback(() => setHovered(true), []);
  const onLeave = useCallback(() => setHovered(false), []);
  return { ref, hovered, props: { onMouseEnter: onEnter, onMouseLeave: onLeave } };
}
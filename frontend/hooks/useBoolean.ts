import { useState, useCallback } from 'react';

export function useBoolean(initial = false) {
  const [value, setValue] = useState(initial);
  return {
    value,
    setTrue:  useCallback(() => setValue(true), []),
    setFalse: useCallback(() => setValue(false), []),
    toggle:   useCallback(() => setValue(v => !v), []),
  };
}

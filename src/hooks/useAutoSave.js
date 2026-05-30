import { useEffect, useRef } from 'react';

export function useAutoSave(state, saveNow, setSaveStatus, delay = 500) {
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      saveNow();
      return undefined;
    }
    setSaveStatus('Saving...');
    const timer = window.setTimeout(saveNow, delay);
    return () => window.clearTimeout(timer);
  }, [state, saveNow, setSaveStatus, delay]);
}

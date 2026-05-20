import { useLayoutEffect, useState } from 'react';
import { startHidingPortalElements } from './portalElementUtils';

/**
 * Hides Pega portal shell elements on mount and returns a boolean mask flag.
 * The mask stays true until `revealDelayMs` has elapsed, giving the portal
 * time to finish rendering before the form is shown.
 */
export function usePortalMask(revealDelayMs = 1000): boolean {
  const [isMasked, setIsMasked] = useState(true);

  useLayoutEffect(() => {
    const stopHiding = startHidingPortalElements();
    const timer = setTimeout(() => setIsMasked(false), revealDelayMs);
    return () => {
      clearTimeout(timer);
      stopHiding();
    };
  }, [revealDelayMs]);

  return isMasked;
}

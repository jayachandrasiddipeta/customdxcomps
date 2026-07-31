/**
 * Best-effort close of the current browser/tab context.
 * @param fallbackUrl Optional https URL used when the window cannot be closed
 *                    (replaces the previous hard-coded about:blank last resort).
 */
export const closeCurrentBrowserContext = (fallbackUrl?: string) => {
  const tryClose = (targetWindow: Window | null | undefined) => {
    if (!targetWindow) {
      return;
    }

    try {
      targetWindow.focus();
    } catch {
      // no-op
    }

    try {
      targetWindow.close();
    } catch {
      // no-op
    }
  };

  // First try direct close attempts on current/top/parent.
  tryClose(window);
  tryClose(window.top);
  tryClose(window.parent);

  // Fallback: convert to script-opened context and retry close.
  try {
    window.open('', '_self');
  } catch {
    // no-op
  }
  tryClose(window);

  // Final fallback when close is blocked by browser policy.
  if (!window.closed) {
    try {
      window.location.replace(fallbackUrl || 'about:blank');
    } catch {
      // no-op
    }
  }
};

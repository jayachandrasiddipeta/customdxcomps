// Selectors for Pega portal shell elements to suppress.
// data-testid is the React Testing Library convention used by Pega Constellation.
// data-test-id (hyphenated) is an older variant kept as a fallback.
// aria-label uses *=  so it matches even when Pega appends the user's name.
const PORTAL_HIDE_SELECTORS = [
  '[data-testid*="summary-item"]',
  '[data-test-id*="summary-item"]',
  'button[type="button"][aria-haspopup="menu"][aria-label*="account" i]'
] as const;

const PORTAL_HIDE_CSS = `
  [data-testid*="summary-item"],
  [data-test-id*="summary-item"],
  button[type="button"][aria-haspopup="menu"][aria-label*="account" i] {
    display: none !important;
  }
`;

const STYLE_TAG_ID = 'tmhcc-portal-hide';

function injectStyleTag(): void {
  if (document.getElementById(STYLE_TAG_ID)) {
    return;
  }
  const style = document.createElement('style');
  style.id = STYLE_TAG_ID;
  style.textContent = PORTAL_HIDE_CSS;
  document.head.appendChild(style);
}

function removeStyleTag(): void {
  document.getElementById(STYLE_TAG_ID)?.remove();
}

function applyHideDirect(): void {
  PORTAL_HIDE_SELECTORS.forEach(selector => {
    document.querySelectorAll<HTMLElement>(selector).forEach(el => {
      el.style.setProperty('display', 'none', 'important');
    });
  });
}

/**
 * Two-layer approach:
 *  1. CSS injection — style tag in <head> hides elements before first paint (no flash).
 *  2. Direct DOM manipulation via MutationObserver — fallback for cases where CSS
 *     injection is blocked (CSP) or the element lives in a context the stylesheet
 *     can't reach.
 * Returns a cleanup function.
 */
export function startHidingPortalElements(): () => void {
  injectStyleTag();
  applyHideDirect();

  const headObserver = new MutationObserver(() => {
    injectStyleTag(); // re-inject if the style tag is ever removed
  });
  headObserver.observe(document.head, { childList: true });

  const bodyObserver = new MutationObserver(applyHideDirect);
  bodyObserver.observe(document.body, { childList: true, subtree: true });

  return () => {
    headObserver.disconnect();
    bodyObserver.disconnect();
    removeStyleTag();
  };
}

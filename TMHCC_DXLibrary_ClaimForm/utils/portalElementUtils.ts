// Selectors for Pega portal shell elements to suppress.
// data-testid is the React Testing Library convention used by Pega Constellation.
// data-test-id (hyphenated) is an older variant kept as a fallback.
// aria-label uses *=  so it matches even when Pega appends the user's name.
const SUMMARY_ITEM_SELECTOR = '[data-testid*="summary-item"], [data-test-id*="summary-item"]';

const PORTAL_HIDE_CSS = `
  header:has([data-testid*="summary-item"]),
  header:has([data-test-id*="summary-item"]) {
    display: none !important;
  }

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
  // Hide the enclosing <header> (if there is one) rather than just the summary
  // item itself — the header can still reserve its own padding/space around an
  // empty child, leaving a gap even once the item inside it is hidden.
  document.querySelectorAll<HTMLElement>(SUMMARY_ITEM_SELECTOR).forEach(el => {
    const header = el.closest<HTMLElement>('header');
    (header ?? el).style.setProperty('display', 'none', 'important');
  });

  document
    .querySelectorAll<HTMLElement>('button[type="button"][aria-haspopup="menu"][aria-label*="account" i]')
    .forEach(el => {
      el.style.setProperty('display', 'none', 'important');
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

  // Coalesce bursts of unrelated body mutations (e.g. this form's own re-renders)
  // into at most one document-wide re-scan per frame, instead of one per mutation.
  let rescanScheduled = false;
  const scheduleApplyHideDirect = () => {
    if (rescanScheduled) return;
    rescanScheduled = true;
    requestAnimationFrame(() => {
      rescanScheduled = false;
      applyHideDirect();
    });
  };

  const bodyObserver = new MutationObserver(scheduleApplyHideDirect);
  bodyObserver.observe(document.body, { childList: true, subtree: true });

  return () => {
    headObserver.disconnect();
    bodyObserver.disconnect();
    removeStyleTag();
  };
}

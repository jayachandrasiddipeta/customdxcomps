/**
 * Best-effort public IPv4/IPv6 for the browser session.
 * Browsers do not expose the client IP; this uses a short-lived lookup.
 * If the request fails (network, CSP, ad blockers), returns an empty string.
 */
export const fetchClientPublicIp = async (timeoutMs = 5000): Promise<string> => {
  if (typeof window === 'undefined') {
    return '';
  }

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch('https://api.ipify.org?format=json', {
      method: 'GET',
      signal: controller.signal,
      cache: 'no-store'
    });

    if (!response.ok) {
      return '';
    }

    const data = (await response.json()) as { ip?: string };
    const ip = typeof data?.ip === 'string' ? data.ip.trim() : '';
    return ip;
  } catch {
    return '';
  } finally {
    window.clearTimeout(timer);
  }
};

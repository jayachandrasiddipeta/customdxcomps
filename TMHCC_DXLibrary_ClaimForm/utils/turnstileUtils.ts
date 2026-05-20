const TURNSTILE_SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: Record<string, unknown>) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
      getResponse?: (widgetId: string) => string | undefined;
    };
  }
}

const scriptExists = (): boolean =>
  Boolean(document.querySelector(`script[src="${TURNSTILE_SCRIPT_SRC}"], script[src^="https://challenges.cloudflare.com/turnstile/v0/api.js"]`));

const waitForTurnstileApi = (): Promise<void> =>
  new Promise((resolve, reject) => {
    const start = Date.now();
    const tick = () => {
      if (window.turnstile?.render) {
        resolve();
        return;
      }
      if (Date.now() - start > 30000) {
        reject(new Error('Turnstile API did not become available'));
        return;
      }
      requestAnimationFrame(tick);
    };
    tick();
  });

export const loadTurnstileScript = (): Promise<void> => {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Turnstile requires a browser environment'));
  }

  if (window.turnstile?.render) {
    return Promise.resolve();
  }

  if (scriptExists()) {
    return waitForTurnstileApi();
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = TURNSTILE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      waitForTurnstileApi().then(resolve).catch(reject);
    };
    script.onerror = () => reject(new Error('Failed to load Turnstile script'));
    document.head.appendChild(script);
  });
};

export interface TurnstileController {
  widgetId: string;
  refreshToken: () => Promise<string>;
  destroy: () => void;
}

export const createTurnstileController = (
  container: HTMLElement,
  sitekey: string,
  handlers: {
    onToken: (token: string) => void;
    onError?: () => void;
    onExpired?: () => void;
  }
): Promise<TurnstileController> =>
  new Promise((resolve, reject) => {
    loadTurnstileScript()
      .then(() => {
        // Do not use turnstile.ready() here: Cloudflare warns when api.js is loaded with
        // async/defer and ready() is used. loadTurnstileScript + waitForTurnstileApi already
        // wait until window.turnstile.render exists.
        try {
          const turnstile = window.turnstile;
          if (!turnstile?.render) {
            reject(new Error('Turnstile render is not available'));
            return;
          }

          let pending: { resolve: (token: string) => void; reject: (error: Error) => void; timer: number } | undefined;

          const callback = (token: string) => {
            handlers.onToken(token);
            if (pending) {
              window.clearTimeout(pending.timer);
              pending.resolve(token);
              pending = undefined;
            }
          };

          const widgetId = turnstile.render(container, {
            sitekey,
            callback,
            'error-callback': () => {
              handlers.onError?.();
            },
            'expired-callback': () => {
              handlers.onExpired?.();
              try {
                turnstile.reset(widgetId);
              } catch {
                // no-op
              }
            }
          });

          resolve({
            widgetId,
            refreshToken: () =>
              new Promise<string>((resolveToken, rejectToken) => {
                pending = {
                  resolve: resolveToken,
                  reject: rejectToken,
                  timer: window.setTimeout(() => {
                    pending = undefined;
                    rejectToken(new Error('Turnstile verification timed out'));
                  }, 120000)
                };
                try {
                  turnstile.reset(widgetId);
                } catch (error: unknown) {
                  if (pending) {
                    window.clearTimeout(pending.timer);
                    pending = undefined;
                  }
                  rejectToken(error instanceof Error ? error : new Error('Turnstile reset failed'));
                }
              }),
            destroy: () => {
              try {
                turnstile.remove(widgetId);
              } catch {
                // no-op
              }
            }
          });
        } catch (error: unknown) {
          reject(error instanceof Error ? error : new Error('Turnstile render failed'));
        }
      })
      .catch(reject);
  });

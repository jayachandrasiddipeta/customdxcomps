const OT_SCRIPT_CONTAINER_ID = 'tmhcc-onetrust-consent-scripts';

interface OneTrustConfigPageResponse {
  pyContentID?: string;
  pyEnableNotifications?: boolean | string;
}

function getApplicationName(): string {
  try {
    return (window as any).PCore?.getEnvironmentInfo?.()?.getApplicationName?.() ?? '';
  } catch {
    return '';
  }
}

async function fetchOneTrustConfig(
  dataPageName: string
): Promise<{ contentId: string; enableNotifications: boolean } | null> {
  try {
    const response: OneTrustConfigPageResponse = await (
      window as any
    ).PCore.getDataPageUtils().getPageDataAsync(dataPageName, '', {
      AppName: getApplicationName()
    });
    return {
      contentId: response?.pyContentID ?? '',
      enableNotifications:
        response?.pyEnableNotifications === true || response?.pyEnableNotifications === 'true'
    };
  } catch {
    return null;
  }
}

function injectOneTrustScripts(domainScriptId: string): void {
  if (!domainScriptId || document.getElementById(OT_SCRIPT_CONTAINER_ID)) return;

  const container = document.createElement('div');
  container.id = OT_SCRIPT_CONTAINER_ID;
  container.style.display = 'none';

  const autoBlockScript = document.createElement('script');
  autoBlockScript.type = 'text/javascript';
  autoBlockScript.src = `https://cdn.cookielaw.org/consent/${domainScriptId}/OtAutoBlock.js`;
  // Keep document order (OtAutoBlock must run before the SDK stub below) —
  // scripts inserted via the DOM default to async=true, which can reorder them.
  autoBlockScript.async = false;

  const sdkStubScript = document.createElement('script');
  sdkStubScript.type = 'text/javascript';
  sdkStubScript.src = 'https://cdn.cookielaw.org/scripttemplates/otSDKStub.js';
  sdkStubScript.charset = 'UTF-8';
  sdkStubScript.setAttribute('data-domain-script', domainScriptId);
  sdkStubScript.async = false;

  const wrapperScript = document.createElement('script');
  wrapperScript.type = 'text/javascript';
  wrapperScript.text = 'function OptanonWrapper() {}';

  container.append(autoBlockScript, sdkStubScript, wrapperScript);
  document.head.appendChild(container);
}

export async function initializeOneTrustConsent(productionLevelDataPageName: string): Promise<void> {
  const config = await fetchOneTrustConfig(productionLevelDataPageName);
  if (config?.enableNotifications && config.contentId) {
    injectOneTrustScripts(config.contentId);
  }
}
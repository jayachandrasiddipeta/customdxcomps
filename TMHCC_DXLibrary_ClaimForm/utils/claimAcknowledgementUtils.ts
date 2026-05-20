const stripPdfDataUrlPrefix = (value: string): string => {
  const match = /^data:application\/pdf;base64,(.+)$/i.exec(value.trim());
  return match ? match[1] : value.trim();
};

const getAckFileSource = (response: unknown): string | undefined => {
  if (!response || typeof response !== 'object') {
    return undefined;
  }
  const record = response as Record<string, unknown>;
  const direct = record.AckFileSource;
  if (typeof direct === 'string' && direct.trim()) {
    return direct;
  }
  const nested = record.data;
  if (nested && typeof nested === 'object' && 'AckFileSource' in nested) {
    const v = (nested as Record<string, unknown>).AckFileSource;
    return typeof v === 'string' ? v : undefined;
  }
  return undefined;
};

/**
 * Fetches the acknowledgement PDF (base64) via a Pega data page.
 *
 * `getPageDataAsync` internally subscribes to `PCore.getMessageService().subscribeMessageService`
 * for live data-page refresh events. In self-service portals the message service is not fully
 * initialised for external sessions, so that subscription step throws. The actual data-page fetch
 * succeeds regardless — Pega sometimes attaches the response to the thrown error object, so we
 * recover from that specific failure before re-throwing anything real.
 */
export const fetchClaimAcknowledgementBase64 = async (pyID: string, dataPageName: string): Promise<string> => {
  const dataPageUtils = (window as any).PCore?.getDataPageUtils?.();
  if (typeof dataPageUtils?.getPageDataAsync !== 'function') {
    throw new Error('PCore data page utils are not available.');
  }

  let response: unknown;
  try {
    response = await dataPageUtils.getPageDataAsync(dataPageName, '', { pyID });
  } catch (err: unknown) {
    // If Pega threw due to subscribeMessageService but still attached the page data to the
    // error object, extract it from there so we can continue normally.
    const errAsRecord = err as Record<string, unknown>;
    const recoveredData = errAsRecord?.data ?? errAsRecord?.pxResults ?? errAsRecord?.pyWorkPage;
    if (recoveredData) {
      response = err; // the error object itself carries the data page fields
    } else {
      throw new Error('Failed to fetch acknowledgement data page. If you see a subscribeMessageService error in the console, ensure the portal session context supports PCore message subscriptions.');
    }
  }

  const raw = getAckFileSource(response);
  if (!raw?.trim()) {
    throw new Error('No acknowledgement document was returned from the data page.');
  }

  return stripPdfDataUrlPrefix(raw);
};

export const downloadPdfFromBase64 = (base64: string, filename: string): void => {
  const clean = stripPdfDataUrlPrefix(base64);
  const binary = atob(clean);
  const length = binary.length;
  const bytes = new Uint8Array(length);
  for (let index = 0; index < length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = 'noopener';
  anchor.click();
  URL.revokeObjectURL(url);
};

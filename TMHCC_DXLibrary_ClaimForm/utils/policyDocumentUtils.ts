// Data page (D_DocumentContent) takes a "ContentName" parameter and returns a single
// row with the base64-encoded PDF in pyFileSource.
export async function fetchPolicyDocumentBase64(
  dataPageName: string,
  paramName: string,
  contentName: string
): Promise<string | null> {
  const parameters = { [paramName]: contentName };
  const record = await (window as any).PCore.getDataPageUtils().getPageDataAsync(
    dataPageName,
    '',
    parameters,
    { invalidateCache: true }
  );
  return record?.pyFileSource ? String(record.pyFileSource) : null;
}

// Data pages commonly wrap base64 content with line breaks (RFC 2045 style) or an
// accidental "data:...;base64," prefix; strip both before decoding.
function decodeBase64ToBuffer(base64Content: string): ArrayBuffer {
  const cleaned = base64Content.replace(/^data:[^,]*,/, '').replace(/\s/g, '');
  const byteString = atob(cleaned);
  const buffer = new ArrayBuffer(byteString.length);
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < byteString.length; i += 1) {
    bytes[i] = byteString.charCodeAt(i);
  }
  return buffer;
}

export function createPdfBlobUrl(base64Content: string): string {
  const blob = new Blob([decodeBase64ToBuffer(base64Content)], { type: 'application/pdf' });
  return URL.createObjectURL(blob);
}
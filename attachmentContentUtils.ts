export interface AttachmentContent {
  base64Content: string;
  fileName: string;
  mimeType: string;
}

// Repositories/browsers commonly report a generic type instead of the real one;
// fall back to the file extension so the viewer can still pick the right renderer.
const GENERIC_MIME_TYPES = new Set(['', 'application/octet-stream', 'binary/octet-stream']);

const EXTENSION_MIME_MAP: Record<string, string> = {
  pdf: 'application/pdf',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  bmp: 'image/bmp',
  svg: 'image/svg+xml',
  webp: 'image/webp'
};

function resolveMimeType(mimeType: string, fileName: string): string {
  const normalized = (mimeType || '').toLowerCase();
  if (!GENERIC_MIME_TYPES.has(normalized)) {
    return normalized;
  }
  const extension = fileName.slice(fileName.lastIndexOf('.') + 1).toLowerCase();
  return EXTENSION_MIME_MAP[extension] ?? normalized;
}

// Data page must return a single row with the OOTB attachment content fields:
// pyAttachStream (base64 content), pyAttachMimeType (file type), pyRepositoryFileName (file name)
export async function fetchAttachmentContent(
  dataPageName: string,
  dataPageParamName: string,
  paramValue: string,
  context?: string
): Promise<AttachmentContent | null> {
  const parameters = { [dataPageParamName]: paramValue };
  const options = {
    invalidateCache: true
  };
  const record = await (window as any).PCore.getDataPageUtils().getPageDataAsync(
    dataPageName,
    context,
    parameters,
    options
  );
  if (!record || !record.pyAttachStream) {
    return null;
  }
  const fileName = record.pyRepositoryFileName ?? '';
  return {
    base64Content: record.pyAttachStream,
    fileName,
    mimeType: resolveMimeType(record.pyAttachMimeType ?? '', fileName)
  };
}

// Data pages commonly wrap base64 content with line breaks (RFC 2045 style) or an
// accidental "data:...;base64," prefix; strip both before decoding.
function sanitizeBase64(base64Content: string): string {
  return base64Content.replace(/^data:[^,]*,/, '').replace(/\s/g, '');
}

function decodeBase64ToBuffer(base64Content: string): ArrayBuffer {
  const byteString = atob(sanitizeBase64(base64Content));
  const buffer = new ArrayBuffer(byteString.length);
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < byteString.length; i += 1) {
    bytes[i] = byteString.charCodeAt(i);
  }
  return buffer;
}

export function createAttachmentBlobUrl(base64Content: string, mimeType: string): string {
  const blob = new Blob([decodeBase64ToBuffer(base64Content)], { type: mimeType || 'application/octet-stream' });
  return URL.createObjectURL(blob);
}

// blob: object URLs render inconsistently for inline PDF preview in iframes across
// non-Chromium browsers (Safari/Firefox); a data: URI is honored much more reliably.
export function createAttachmentDataUrl(base64Content: string, mimeType: string): string {
  return `data:${mimeType || 'application/octet-stream'};base64,${sanitizeBase64(base64Content)}`;
}

export function downloadBase64File(base64Content: string, mimeType: string, fileName: string) {
  const url = createAttachmentBlobUrl(base64Content, mimeType);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName || 'attachment';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

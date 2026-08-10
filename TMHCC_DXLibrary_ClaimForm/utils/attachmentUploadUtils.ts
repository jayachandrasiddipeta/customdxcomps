import type { UploadedAttachment } from '../types';
import { extractPegaErrorMessage } from './pegaErrorUtils';
import type { LocalizationMap } from './useLocalization';

interface UploadAttachmentResponse {
  success: boolean;
  attachment?: UploadedAttachment;
  message?: string;
  fileName?: string;
}

// Cap how many uploads run at once so selecting many files at once doesn't fire
// them all simultaneously and risk server-side rate limiting.
const UPLOAD_CONCURRENCY = 3;
// One retry for a transient failure (network blip, momentary 5xx) before giving up.
const MAX_ATTEMPTS = 2;

const uploadFailedMessage = (l: LocalizationMap, fileName: string): string =>
  String(l['ErrUploadFailedForFile']).replace('{1}', fileName);

// `||` chaining would wrongly skip a falsy-but-valid id (e.g. a literal 0), so walk
// the candidates explicitly and only skip null/undefined/empty values.
const extractAttachmentId = (responseData: any): string => {
  const candidates = [responseData?.ID, responseData?.id, responseData?.attachmentID, responseData?.attachmentId];
  for (const candidate of candidates) {
    if (candidate !== null && candidate !== undefined && String(candidate) !== '') {
      return String(candidate);
    }
  }
  return '';
};

const uploadAttachmentFileOnce = async (
  file: File,
  l: LocalizationMap
): Promise<UploadAttachmentResponse> => {
  try {
    const formData = new FormData();
    formData.append('content', file);
    formData.append('name', file.name);

    const response = await (window as any).PCore.getRestClient().invokeCustomRestApi('/api/application/v2/attachments/upload', {
      method: 'POST',
      body: formData
    });

    const attachmentId = extractAttachmentId(response?.data);
    if (!attachmentId) {
      return { success: false, fileName: file.name, message: uploadFailedMessage(l, file.name) };
    }

    return {
      success: true,
      fileName: file.name,
      attachment: {
        id: attachmentId,
        name: file.name,
        size: file.size,
        docType: ''
      }
    };
  } catch (error: unknown) {
    return {
      success: false,
      fileName: file.name,
      message: extractPegaErrorMessage(error, uploadFailedMessage(l, file.name))
    };
  }
};

export const uploadAttachmentFile = async (
  file: File,
  l: LocalizationMap
): Promise<UploadAttachmentResponse> => {
  let result = await uploadAttachmentFileOnce(file, l);
  for (let attempt = 2; attempt <= MAX_ATTEMPTS && !result.success; attempt += 1) {
    result = await uploadAttachmentFileOnce(file, l);
  }
  return result;
};

export const uploadAttachments = async (
  files: File[],
  l: LocalizationMap
): Promise<UploadAttachmentResponse[]> => {
  const results: UploadAttachmentResponse[] = [];
  for (let i = 0; i < files.length; i += UPLOAD_CONCURRENCY) {
    const batch = files.slice(i, i + UPLOAD_CONCURRENCY);
    const batchResults = await Promise.all(batch.map(file => uploadAttachmentFile(file, l)));
    results.push(...batchResults);
  }
  return results;
};
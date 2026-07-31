import { extractPegaErrorMessage } from './pegaErrorUtils';
import type { LocalizationMap } from './useLocalization';

interface AttachmentItem {
  id: string;
  name: string;
  docType: string;
}

interface AttachToCaseResponse {
  success: boolean;
  message?: string;
}

export const attachUploadedFilesToCase = async (
  caseId: string,
  attachments: AttachmentItem[],
  l: LocalizationMap
): Promise<AttachToCaseResponse> => {
  if (!caseId || attachments.length === 0) {
    return { success: true };
  }

  try {
    const payload = {
      attachments: attachments.map(({ id, docType, name }) => ({
        type: 'File',
        category: docType,
        ID: id,
        name,
      }))
    };

    await (window as any).PCore.getRestClient().invokeCustomRestApi(`/api/application/v2/cases/${caseId}/attachments`, {
      method: 'POST',
      body: payload
    });

    return { success: true };
  } catch (error: unknown) {
    return {
      success: false,
      message: extractPegaErrorMessage(error, String(l['ErrAttachFilesToCaseFailed']))
    };
  }
};

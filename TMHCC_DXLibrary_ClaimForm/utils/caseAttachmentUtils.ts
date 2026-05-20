import { extractPegaErrorMessage } from './pegaErrorUtils';

interface AttachToCaseResponse {
  success: boolean;
  message?: string;
}

export const attachUploadedFilesToCase = async (caseId: string, attachmentIds: string[]): Promise<AttachToCaseResponse> => {
  if (!caseId || attachmentIds.length === 0) {
    return { success: true };
  }

  try {
    const payload = {
      attachments: attachmentIds.map(attachmentId => ({
        type: 'File',
        category: 'File',
        ID: attachmentId
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
      message: extractPegaErrorMessage(error, 'Failed to attach uploaded files to case')
    };
  }
};

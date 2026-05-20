import type { UploadedAttachment } from '../types';
import { extractPegaErrorMessage } from './pegaErrorUtils';

interface UploadAttachmentResponse {
  success: boolean;
  attachment?: UploadedAttachment;
  message?: string;
}

const extractAttachmentId = (responseData: any): string => {
  return responseData?.ID || responseData?.id || responseData?.attachmentID || responseData?.attachmentId || '';
};

export const uploadAttachmentFile = async (file: File): Promise<UploadAttachmentResponse> => {
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
      return { success: false, message: `Upload failed for ${file.name}` };
    }

    return {
      success: true,
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
      message: extractPegaErrorMessage(error, `Upload failed for ${file.name}`)
    };
  }
};

export const uploadAttachments = async (files: File[]): Promise<UploadAttachmentResponse[]> => {
  return Promise.all(files.map(file => uploadAttachmentFile(file)));
};

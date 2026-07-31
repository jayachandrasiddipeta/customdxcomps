const CLAIM_ATTACHMENT_SESSION_KEY = 'tmhcc.claimForm.uploadAttachmentIds';

export const saveAttachmentIdsInSession = (attachmentIds: string[]) => {
  try {
    sessionStorage.setItem(CLAIM_ATTACHMENT_SESSION_KEY, JSON.stringify(attachmentIds));
  } catch {
    // Ignore session storage failures to avoid blocking form usage.
  }
};

export const clearAttachmentIdsInSession = () => {
  try {
    sessionStorage.removeItem(CLAIM_ATTACHMENT_SESSION_KEY);
  } catch {
    // Ignore cleanup failures.
  }
};

import type { ClaimFormData } from '../types';

export const isClaimFormDirty = (formData: ClaimFormData, initialFormData: ClaimFormData): boolean => {
  return (
    formData.firstName.trim() !== initialFormData.firstName ||
    formData.lastName.trim() !== initialFormData.lastName ||
    formData.email.trim() !== initialFormData.email ||
    formData.phoneNumber.trim() !== initialFormData.phoneNumber ||
    formData.policyNumber.trim() !== initialFormData.policyNumber ||
    formData.membershipNumber.trim() !== initialFormData.membershipNumber ||
    formData.serviceNumber.trim() !== initialFormData.serviceNumber ||
    formData.schemeOrProduct.trim() !== initialFormData.schemeOrProduct ||
    formData.attachments.length !== initialFormData.attachments.length
  );
};

export const closeCurrentBrowserContext = () => {
  const tryClose = (targetWindow: Window | null | undefined) => {
    if (!targetWindow) {
      return;
    }

    try {
      targetWindow.focus();
    } catch {
      // no-op
    }

    try {
      targetWindow.close();
    } catch {
      // no-op
    }
  };

  // First try direct close attempts on current/top/parent.
  tryClose(window);
  tryClose(window.top);
  tryClose(window.parent);

  // Fallback: convert to script-opened context and retry close.
  try {
    window.open('', '_self');
  } catch {
    // no-op
  }
  tryClose(window);

  // Final fallback when close is blocked by browser policy.
  if (!window.closed) {
    try {
      window.location.replace('about:blank');
    } catch {
      // no-op
    }
  }
};

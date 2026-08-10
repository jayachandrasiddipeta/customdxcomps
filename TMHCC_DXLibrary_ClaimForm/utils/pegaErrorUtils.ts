type PegaResponseBody = Record<string, unknown>;

const getResponseBody = (error: unknown): PegaResponseBody | undefined => {
  if (!error || typeof error !== 'object') {
    return undefined;
  }
  const e = error as Record<string, unknown>;
  // axios-style: error.response.data
  const axiosData = (e.response as any)?.data;
  if (axiosData && typeof axiosData === 'object') {
    return axiosData as PegaResponseBody;
  }
  // flat: error.data
  if (e.data && typeof e.data === 'object') {
    return e.data as PegaResponseBody;
  }
  // the thrown error itself may be the parsed body
  if ('errorDetails' in e || 'errors' in e) {
    return e as PegaResponseBody;
  }
  return undefined;
};

/**
 * Extracts the most user-friendly error message from a Pega REST API error.
 *
 * Handles two Pega error shapes:
 *  - Attachment/upload: { errorDetails: [{ localizedValue }], localizedValue }
 *  - Case creation:     { errors: [{ message }] }
 */
export const extractPegaErrorMessage = (error: unknown, fallback: string): string => {
  const body = getResponseBody(error);

  if (body) {
    // Attachment / upload errors — prefer the detail-level localizedValue
    const details = body.errorDetails;
    if (Array.isArray(details) && details.length > 0) {
      const first = details[0] as Record<string, unknown>;
      const msg = first.localizedValue;
      if (typeof msg === 'string' && msg.trim()) {
        return msg.trim();
      }
    }

    // Root-level localizedValue (fallback for attachment errors)
    const rootMsg = body.localizedValue;
    if (typeof rootMsg === 'string' && rootMsg.trim()) {
      return rootMsg.trim();
    }

    // Case creation errors
    const errors = body.errors;
    if (Array.isArray(errors) && errors.length > 0) {
      const first = errors[0] as Record<string, unknown>;
      const msg = first.message;
      if (typeof msg === 'string' && msg.trim()) {
        return msg.trim();
      }
    }
  }

  return (error as any)?.message || fallback;
};

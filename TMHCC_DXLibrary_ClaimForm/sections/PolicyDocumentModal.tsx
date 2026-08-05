import { useEffect, useMemo } from 'react';
import { Modal, Text, useModalContext } from '@pega/cosmos-react-core';
import type { LocalizationMap } from '../utils/useLocalization';
import { createPdfBlobUrl } from '../utils/policyDocumentUtils';

interface PolicyDocumentModalProps {
  title: string;
  base64Content: string | null;
  hasError: boolean;
  l: LocalizationMap;
}

// PDF-only viewer for the home-page Privacy Policy / Web Cookie Policy links.
// Toolbar-free by design (#toolbar=0&navpanes=0) — these are read-only reference
// documents, not files a user needs to print/download from within the viewer.
function PolicyDocumentModal({ title, base64Content, hasError, l }: PolicyDocumentModalProps) {
  const { dismiss } = useModalContext();

  const blobUrl = useMemo(() => (base64Content ? createPdfBlobUrl(base64Content) : ''), [base64Content]);

  useEffect(() => {
    if (!blobUrl) return undefined;
    return () => URL.revokeObjectURL(blobUrl);
  }, [blobUrl]);

  return (
    <Modal
      heading={title}
      onDismiss={() => dismiss()}
      center
      progress={!hasError && !blobUrl}
      className='claim-form__policy-modal-box'
    >
      {hasError && <Text>{l['ErrPolicyDocumentLoadFailed']}</Text>}
      {blobUrl && (
        <iframe
          src={`${blobUrl}#toolbar=0&navpanes=0`}
          title={title}
          className='claim-form__policy-modal-frame'
        />
      )}
    </Modal>
  );
}

export default PolicyDocumentModal;

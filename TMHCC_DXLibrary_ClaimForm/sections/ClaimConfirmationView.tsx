import { useState } from 'react';

import { downloadPdfFromBase64, fetchClaimAcknowledgementBase64 } from '../utils/claimAcknowledgementUtils';

interface ClaimConfirmationViewProps {
  caseId: string;
  onClose: () => void;
  /** Pega data page name that returns the acknowledgement PDF as AckFileSource (base64). */
  acknowledgementDataPage: string;
}

function ClaimConfirmationView({ caseId, onClose, acknowledgementDataPage }: ClaimConfirmationViewProps) {
  const referenceId = caseId || 'Pending';
  const hasCaseId = Boolean(caseId?.trim());
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState('');

  const handleDownloadAcknowledgement = async () => {
    if (!hasCaseId) {
      return;
    }
    setDownloadError('');
    setIsDownloading(true);
    try {
      const base64 = await fetchClaimAcknowledgementBase64(caseId.trim(), acknowledgementDataPage);
      const safeName = caseId.trim().replace(/\s+/g, '-');
      downloadPdfFromBase64(base64, `Claim-Acknowledgement-${safeName}.pdf`);
    } catch (error) {
      setDownloadError(error instanceof Error ? error.message : 'Download failed.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className='claim-confirmation-shell'>
      <div className='claim-confirmation'>
        <h2 className='claim-confirmation__title'>Thank you for reporting your claim.</h2>

        <p className='claim-confirmation__lead'>
          We&apos;ve successfully received your First Notification of Loss (FNOL).<br />
          Your claim reference number is:
        </p>

        <p className='claim-confirmation__case-id'>FNOL ID: {referenceId}</p>

        <h3 className='claim-confirmation__section-title'>What happens next?</h3>

        <p className='claim-confirmation__body'>
          Your claim has been logged in our system and is now under review.
          <br />A claims handler will assess the information you&apos;ve provided.
          <br />
          If we need any additional details or documentation, we&apos;ll contact you. Once assigned, your claims handler will guide you through the next steps.
          <br />
          We aim to review new claims as quickly as possible and will keep you updated on progress.
        </p>

        <p className='claim-confirmation__emphasis'>
          If you need to contact us in the meantime, please quote your FNOL ID when getting in touch
        </p>

        {downloadError && (
          <p className='claim-confirmation__download-error' role='alert'>
            {downloadError}
          </p>
        )}

        <div className='claim-confirmation__actions'>
          {hasCaseId && (
            <button
              type='button'
              className='claim-confirmation__button'
              onClick={handleDownloadAcknowledgement}
              disabled={isDownloading}
            >
              {isDownloading ? 'Preparing download…' : 'Download Claim Acknowledgement'}
            </button>
          )}
          <button type='button' className='claim-confirmation__button' onClick={onClose}>
            Return to Home Page
          </button>
        </div>
      </div>
    </div>
  );
}

export default ClaimConfirmationView;

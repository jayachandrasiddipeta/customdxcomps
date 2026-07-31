import { useEffect, useState } from 'react';
import { Banner } from '@pega/cosmos-react-core';
import { LocalizationMap } from '../utils/useLocalization';
import { isSafeUrl } from '../utils/urlUtils';

interface ClaimConfirmationViewProps {
  caseId: string;
  confirmationDataPageName: string;
  onClose: () => void;
  l:LocalizationMap
  attachmentWarning?: string;
}

function ClaimConfirmationView({ caseId, confirmationDataPageName, onClose,l, attachmentWarning }: ClaimConfirmationViewProps) {
  const referenceId = caseId || String(l['ConfirmationRefPending']);
  const [confirmationHtml, setConfirmationHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const context = "";

  const parameters = {
    pyID: caseId,
  };
  const options = {
    invalidateCache: true,
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await (window as any).PCore.getDataPageUtils().getPageDataAsync(
          confirmationDataPageName,
          context,
          parameters,
          options
        );
        setConfirmationHtml(response?.pyConfirmationNote ?? '');
      } catch {
        // fall through — empty content
      } finally {
        setLoading(false);
      }
    })();
  }, [confirmationDataPageName]);

  const handleSaveReference = () => {
    const content = [
      `${l['ConfirmationClaimReferenceLabel']} ${referenceId}`,
      '',
      l['ConfirmationNeedSupportHeading'],
      '',
      l['ConfirmationNeedSupportIntro'],
      '',
      `${l['ConfirmationEmailLabel']} ${l['HelpEmailValue']}`,
      `${l['ConfirmationTelephoneLabel']} ${l['ConfirmationTelephoneValue']}`,
      `${l['ConfirmationOverseasLabel']} ${l['ConfirmationOverseasValue']}`,
      `${l['ConfirmationSupportHoursLabel']} ${l['HelpSupportHoursValue']}`
    ].join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Claim-Reference-${referenceId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className='claim-confirmation-shell'>
      <div className='claim-confirmation'>

        {attachmentWarning && (
          <Banner className='claim-form__banner-gap' variant='warning' messages={[attachmentWarning]} />
        )}

        {!loading && confirmationHtml && (
          <div
            className='claim-confirmation__rich-text'
            /* trusted: confirmationHtml is sourced from a Pega correspondence rule, not user input */
            dangerouslySetInnerHTML={{ __html: confirmationHtml }}
          />
        )}

        <div className='claim-confirmation__actions'>
          <button
            type='button'
            className='claim-form__button claim-form__button--secondary'
            onClick={handleSaveReference}
          >
            {l['ConfirmationSaveRef']}
          </button>

<button
  type='button'
  className='claim-form__button claim-form__button--primary'
  onClick={() => {
    const url = String(l['ReturnHomePageLink']);
    if (isSafeUrl(url)) {
      window.location.href = url;
    } else {
      onClose();
    }
  }}
>
  {l['ConfirmationReturnHome']}
</button>

        </div>

      </div>
    </div>
  );
}

export default ClaimConfirmationView;

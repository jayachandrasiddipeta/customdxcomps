import { Modal, useModalContext } from '@pega/cosmos-react-core';
import { LocalizationMap } from '../utils/useLocalization';

interface DiscardChangesModalProps {
  onDiscard: () => void;
  l: LocalizationMap;
}

function DiscardChangesModal({ onDiscard, l }: DiscardChangesModalProps) {
  const { dismiss } = useModalContext();

  // Exit navigation/close is owned solely by onDiscard (parent) to avoid a
  // double-exit race between location.href and closeCurrentBrowserContext().
  const handleDiscard = () => {
    dismiss();
    onDiscard();
  };

  return (
    <Modal
      heading={l['DiscardModalHeading']}
      onDismiss={() => dismiss()}
      center
      className='claim-form__discard-modal-box'
    >
      <div className='claim-form__discard-modal'>
        <p className='claim-form__discard-modal-text'>
          {l['DiscardModalBody']}
        </p>
        <div className='claim-form__discard-modal-actions'>
          <button
            type='button'
            className='claim-form__button claim-form__button--secondary'
            onClick={() => dismiss()}
          >
            {l['DiscardModalDismiss']}
          </button>
          <button
            type='button'
            className='claim-form__button claim-form__button--cancel'
            onClick={handleDiscard}
          >
            {l['DiscardModalConfirm']}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default DiscardChangesModal;

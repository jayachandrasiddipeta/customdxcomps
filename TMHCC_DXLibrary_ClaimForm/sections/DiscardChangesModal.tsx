import { Modal, useModalContext } from '@pega/cosmos-react-core';

interface DiscardChangesModalProps {
  onDiscard: () => void;
}

function DiscardChangesModal({ onDiscard }: DiscardChangesModalProps) {
  const { dismiss } = useModalContext();

  const handleDiscard = () => {
    dismiss();
    onDiscard();
  };

  return (
    <Modal heading='Discard changes?'>
      <div className='claim-form__discard-modal'>
        <p className='claim-form__discard-modal-text'>
          You have unsaved changes. Are you sure you want to discard and close this page?
        </p>
        <div className='claim-form__discard-modal-actions'>
          <button type='button' className='claim-form__button claim-form__button--primary' onClick={handleDiscard}>
            Discard
          </button>
          <button
            type='button'
            className='claim-form__button claim-form__button--secondary'
            onClick={() => dismiss()}
          >
            Stay on this page
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default DiscardChangesModal;

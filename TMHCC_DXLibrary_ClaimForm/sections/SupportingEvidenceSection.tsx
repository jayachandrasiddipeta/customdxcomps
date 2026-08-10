import { useState, type ChangeEvent, type DragEvent } from 'react';

import type { ClaimFormData, UploadedAttachment } from '../types';
import { HTML, Icon, Progress } from '@pega/cosmos-react-core';
import InfoIcon from './InfoIcon';
import MessageBanner from './MessageBanner';
import type { ListOption } from '../utils/listValuesUtils';
import type { LocalizationMap } from '../utils/useLocalization';
import { isHtmlContent } from '../utils/htmlContentUtils';


const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 MB';
  const mb = bytes / (1024 * 1024);
  return mb < 0.1 ? '< 0.1 MB' : `${mb.toFixed(2)} MB`;
};

interface SupportingEvidenceSectionProps {
  formData: ClaimFormData;
  isUploading: boolean;
  onFileUpload: (files: File[]) => Promise<void>;
  onDeleteAttachment: (attachmentId: string) => void;
  onDocTypeChange: (attachmentId: string, docType: string) => void;
  evidenceTypeOptions: ListOption[];
  attachmentErrors?: Record<string, { docType?: string }>;
  uploadError?: string;
  l: LocalizationMap;
  actions?: React.ReactNode;
}

function SupportingEvidenceSection({
  formData,
  isUploading,
  onFileUpload,
  onDeleteAttachment,
  onDocTypeChange,
  evidenceTypeOptions,
  attachmentErrors,
  uploadError,
  l,
  actions
}: SupportingEvidenceSectionProps) {
  const [showInfo, setShowInfo] = useState(true);
  const [isDragOver, setIsDragOver] = useState(false);

  const isAtMaxAttachments = formData.attachments.length >= l['MaxAttachmentsCount'];
  const isUploadDisabled = isUploading || isAtMaxAttachments;

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length === 0) return;
    void onFileUpload(selectedFiles);
    event.target.value = '';
  };

  const onDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!isUploadDisabled) setIsDragOver(true);
  };
  const onDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };
  const onDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  };
  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    if (isUploadDisabled) return;
    const droppedFiles = Array.from(event.dataTransfer?.files || []);
    if (droppedFiles.length === 0) return;
    void onFileUpload(droppedFiles);
  };

  return (
    <section className='claim-form__section'>
      {uploadError && (
        <MessageBanner className='claim-form__banner-gap' variant='urgent' message={uploadError} />
      )}

      <h3 className='claim-form__section-title claim-form__title-with-icon'>
        {l['Evidence']}
        <button
          type='button'
          className='claim-form__info-icon'
          onClick={() => setShowInfo(prev => !prev)}
          aria-label={showInfo ? String(l['HideInfoLabel']) : String(l['ShowInfoLabel'])}
          aria-expanded={showInfo}
          aria-controls="supporting-evidence-info-box"
        >
          <InfoIcon />
        </button>
      </h3>

      <div className='claim-form__info-box' id="supporting-evidence-info-box" hidden={!showInfo}>
        <div className='claim-form__info-left'>
          <div className='claim-form__info-box-icon'>
            <InfoIcon />
          </div>
          {isHtmlContent(String(l['EvidenceInstruction'])) ? (
            <HTML className='claim-form__info-content' content={String(l['EvidenceInstruction'])} />
          ) : (
          <div className='claim-form__info-content'>
            {l['EvidenceInstruction']}
          </div>
        )}
          
        </div>
        <button
          type='button'
          className='claim-form__info-close'
          onClick={() => setShowInfo(false)}
          aria-label={String(l['CloseLabel'])}
        >
          ×
        </button>
      </div>

      <div
        className={`claim-form__upload-dropzone${isAtMaxAttachments ? ' claim-form__upload-dropzone--disabled' : ''}${isDragOver ? ' claim-form__upload-dropzone--drag-over' : ''}`}
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <input
          className='claim-form__file-input'
          type='file'
          multiple
          accept={String(l['AllowedFileExtensions'])}
          onChange={onFileChange}
          disabled={isUploadDisabled}
        />
        {isUploading ? (
          <div className='claim-form__upload-spinner'>
            <Progress />
            <span className='claim-form__upload-spinner-text'>{l['UploadingLabel']}</span>
          </div>
        ) : (
          <>
            <div className='claim-form__upload-icon'>
              <Icon name='cloud-up' size='l' />
            </div>
            <p className='claim-form__upload-title'>
              {isAtMaxAttachments ? l['MaxAttachmentsReached'] : l['DragDropInstruction']}
            </p>
            <p className='claim-form__upload-subtitle'>
              {l['MaxAttachmentsInstruction']} • {l['FileLimitInstruction']} • {l['AllowedFileTypesLabel']}
            </p>
            <span className='claim-form__upload-select-btn'>{l['SelectFilesLabel']}</span>
          </>
        )}
      </div>

      {formData.attachments.length > 0 && (
        <div className='claim-form__attachment-list'>
          {formData.attachments.map((attachment: UploadedAttachment) => (
            <div className='claim-form__attachment-card' key={attachment.id}>
              <div className='claim-form__attachment-card-body'>
                <div className='claim-form__attachment-file-info'>
                  <span className='claim-form__attachment-card-name'>{attachment.name}</span>
                  <span className='claim-form__attachment-card-size'>{formatFileSize(attachment.size)}</span>
                </div>
                <label className='claim-form__field'>
                  <span>{l['What type of evidence is this?']} <span className='claim-form__required-star'>*</span></span>
                  <select
                    className={attachmentErrors?.[attachment.id]?.docType ? 'claim-form__attachment-input--error' : ''}
                    value={attachment.docType}
                    onChange={e => onDocTypeChange(attachment.id, e.target.value)}
                    aria-required="true"
                  >
                    <option value=''>{l['EvidenceTypeSelectPH']}</option>
                    {evidenceTypeOptions.map(opt => (
                      <option key={opt.key} value={opt.key}>{opt.label}</option>
                    ))}
                  </select>
                  {attachmentErrors?.[attachment.id]?.docType && (
                    <small className='claim-form__error' role='alert'>{attachmentErrors[attachment.id].docType}</small>
                  )}
                </label>
              </div>
              <button
                type='button'
                className='claim-form__attachment-delete-btn'
                aria-label={String(l['DeleteFileLabel']).replace('{1}', attachment.name)}
                onClick={() => onDeleteAttachment(attachment.id)}
              >
                <Icon name='trash' />
              </button>
            </div>
          ))}
        </div>
      )}

      {actions && <div className='claim-form__section-actions'>{actions}</div>}
    </section>
  );
}

export default SupportingEvidenceSection;
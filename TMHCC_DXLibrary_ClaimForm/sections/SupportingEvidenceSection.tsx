import type { ChangeEvent } from 'react';

import type { ClaimFormData, ClaimFormErrors, UploadedAttachment } from '../types';
import { ACCEPTED_FILE_TYPES } from '../utils/fileValidationUtils';

const DOC_TYPE_OPTIONS = [
  '',
  'Policy Document',
  'Proof of Purchase',
  'Police Report',
  'Medical Certificate',
  'Photograph',
  'Invoice / Receipt',
  'Other'
];

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 MB';
  const mb = bytes / (1024 * 1024);
  return mb < 0.1 ? '< 0.1 MB' : `${mb.toFixed(2)} MB`;
};

interface SupportingEvidenceSectionProps {
  formData: ClaimFormData;
  errors: ClaimFormErrors;
  isUploading: boolean;
  onFileUpload: (files: File[]) => Promise<void>;
  onDeleteAttachment: (attachmentId: string) => void;
  onDocTypeChange: (attachmentId: string, docType: string) => void;
  onConsentChange: (checked: boolean) => void;
  onConsentBlur: () => void;
}

function SupportingEvidenceSection({
  formData,
  errors,
  isUploading,
  onFileUpload,
  onDeleteAttachment,
  onDocTypeChange,
  onConsentChange,
  onConsentBlur
}: SupportingEvidenceSectionProps) {
  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length === 0) return;
    void onFileUpload(selectedFiles);
    event.target.value = '';
  };

  return (
    <section className='claim-form__section'>
      <h3 className='claim-form__section-title'>
        <span className='claim-form__section-index'>4</span>
        Supporting Evidence
      </h3>

      <div className='claim-form__upload-dropzone'>
        <input
          className='claim-form__file-input'
          type='file'
          multiple
          accept={ACCEPTED_FILE_TYPES}
          onChange={onFileChange}
          disabled={isUploading}
        />
        <p className='claim-form__upload-title'>
          {isUploading ? 'Uploading…' : 'Click to upload or drag and drop'}
        </p>
        <p className='claim-form__upload-subtitle'>PDF, JPG, PNG up to 10MB</p>
      </div>

      {formData.attachments.length > 0 && (
        <div className='claim-form__attachment-list'>
          {formData.attachments.map((attachment: UploadedAttachment) => (
            <div className='claim-form__attachment-card' key={attachment.id}>
              <div className='claim-form__attachment-card-header'>
                <span className='claim-form__attachment-card-name' title={attachment.name}>
                  {attachment.name}
                </span>
                <button
                  type='button'
                  className='claim-form__attachment-card-delete'
                  aria-label={`Delete ${attachment.name}`}
                  onClick={() => onDeleteAttachment(attachment.id)}
                >
                  ✕
                </button>
              </div>
              <div className='claim-form__attachment-card-meta'>
                <label className='claim-form__attachment-card-type'>
                  <span>Document Type</span>
                  <select
                    value={attachment.docType}
                    onChange={e => onDocTypeChange(attachment.id, e.target.value)}
                  >
                    {DOC_TYPE_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt || 'Select type…'}</option>
                    ))}
                  </select>
                </label>
                <span className='claim-form__attachment-card-size'>
                  {formatFileSize(attachment.size)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className='claim-form__consent-box'>
        <input
          id='claim-consent'
          type='checkbox'
          checked={formData.hasUserConfirmed}
          onChange={event => onConsentChange(event.target.checked)}
          onBlur={onConsentBlur}
        />
        <label htmlFor='claim-consent'>
          I declare that the information provided is true and accurate to the best of my knowledge.
          I understand that providing false information may result in my claim being rejected and
          could constitute fraud.
        </label>
      </div>
      {errors.hasUserConfirmed && (
        <small className='claim-form__error'>{errors.hasUserConfirmed}</small>
      )}
    </section>
  );
}

export default SupportingEvidenceSection;

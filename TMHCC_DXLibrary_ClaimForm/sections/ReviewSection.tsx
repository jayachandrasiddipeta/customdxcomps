import { Fragment, useState } from 'react';
import { Icon } from '@pega/cosmos-react-core';
import type { ClaimFormData, UploadedAttachment } from '../types';
import type { LocalizationMap } from '../utils/useLocalization';
import InfoIcon from './InfoIcon';
import { formatDateForDisplay, getDateFormat } from '../utils/dateUtils';

interface ReviewSectionProps {
  formData: ClaimFormData;
  l: LocalizationMap;
  getLabel: (category: string, key: string) => string;
  onFieldChange: (field: keyof ClaimFormData, value: string | boolean) => void;
  actions?: React.ReactNode;
}

function ReviewField({
  label,
  value,
  l
}: {
  label: string;
  value: string;
  l: LocalizationMap;
}) {
  return (
    <dl className='review-field'>
      <dt className='review-field__label'>{label}</dt>
      <dd className='review-field__value'>{value || String(l['EmptyValuePlaceholder'])}</dd>
    </dl>
  );
}

function ReviewBlock({
  id,
  title,
  isOpen,
  onToggle,
  children,
  onEdit,
  l
}: {
  id: string;
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  onEdit: () => void;
  l: LocalizationMap;
}) {
  return (
    <div className='review-card'>
      <div
        className='review-card__header'
        onClick={onToggle}
        role='button'
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
          }
        }}
        aria-expanded={isOpen}
        aria-controls={id}
      >
        <div className='review-card__title'>
          <span className='review-card__heading'>{title}</span>
        </div>
        <div className='review-card__icons'>
          <button
            type='button'
            className='review-card__icon-btn'
            aria-label={String(l['Edit'])}
            onClick={e => { e.stopPropagation(); onEdit(); }}
          >
            <Icon name='pencil' />
          </button>
          <button
            type='button'
            className='review-card__icon-btn'
            aria-label={isOpen ? String(l['CollapseLabel']) : String(l['ExpandLabel'])}
            onClick={e => { e.stopPropagation(); onToggle(); }}
          >
            <Icon name={isOpen ? 'caret-up' : 'caret-down'} />
          </button>
        </div>
      </div>

      <div className='review-card__content' id={id} hidden={!isOpen}>
        <div className='review-grid'>{children}</div>
      </div>
    </div>
  );
}

function ReviewSection({
  formData,
  setCurrentStep,
  onFieldChange,
  l,
  getLabel,
  actions
}: ReviewSectionProps & { setCurrentStep: (step: number) => void }) {
  const [showInfo, setShowInfo] = useState(false);
  const [openBlocks, setOpenBlocks] = useState<Record<number, boolean>>({
    1: false,
    2: false,
    3: false,
    4: false
  });

  const allOpen = Object.values(openBlocks).every(Boolean);

  const toggleBlock = (step: number) =>
    setOpenBlocks(prev => ({ ...prev, [step]: !prev[step] }));

  const toggleAll = () => {
    const next = !allOpen;
    setOpenBlocks({ 1: next, 2: next, 3: next, 4: next });
  };

  const emptyValue = String(l['EmptyValuePlaceholder']);
  const dateFormat = getDateFormat(l);
  const displayDate = (value: string) =>
    value ? formatDateForDisplay(value, dateFormat) || value : emptyValue;

  const formatAddress = (...parts: (string | undefined)[]): string =>
    parts.filter(p => p?.trim()).join(', ') || emptyValue;

  const policyAddress = formatAddress(
    formData.policyAddressLine1,
    formData.policyAddressLine2,
    formData.policyCity,
    formData.policyPostalCode,
    getLabel('country', formData.policyCountry)
  );

  const riskAddress = formData.lossLocationType === 'PHA'
    ? policyAddress
    : formatAddress(
        formData.lossAddressLine1,
        formData.lossAddressLine2,
        formData.lossCity,
        formData.lossPostalCode,
        getLabel('country', formData.lossCountry)
      );

  const totalClaimedAmount = formData.items.reduce(
    (sum, item) => sum + (parseFloat(item.claimedAmount) || 0),
    0
  );

  return (
    <section className='claim-form__section'>
      <h3 className='claim-form__section-title claim-form__title-with-icon'>
        {l['Review Your Claim']}
        <button
          type='button'
          className='claim-form__info-icon'
          onClick={() => setShowInfo(prev => !prev)}
          aria-label={showInfo ? String(l['HideInfoLabel']) : String(l['ShowInfoLabel'])}
          aria-expanded={showInfo}
          aria-controls="review-section-info-box"
        >
          <InfoIcon />
        </button>
      </h3>

      <div className='claim-form__info-box' id="review-section-info-box" hidden={!showInfo}>
        <div className='claim-form__info-left'>
          <div className='claim-form__info-box-icon'>
            <InfoIcon />
          </div>
          <div className='claim-form__info-content'>
            {l['ReviewInstructions']}
          </div>
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

      <div className='review-expand-all-row'>
        <button type='button' className='review-expand-all-link' onClick={toggleAll}>
          {allOpen ? l['CollapseAll'] : l['ExpandAll']}
        </button>
      </div>

      <ReviewBlock
        id="review-block-your-details"
        l={l}
        title={l['Your Details']}
        isOpen={openBlocks[1]}
        onToggle={() => toggleBlock(1)}
        onEdit={() => setCurrentStep(1)}
      >
        <div className='review-field review-field--full'>
          <span className='review-field__subheading'>{l['Your Details']}</span>
        </div>
        <ReviewField l={l} label={l['First Name']} value={formData.firstName} />
        <ReviewField l={l} label={l['Last Name']} value={formData.lastName} />
        <ReviewField l={l} label={l['Email Address']} value={formData.email} />
        <ReviewField l={l} label={l['Phone Number']} value={formData.phoneNumber} />
        <ReviewField l={l} label={l['Relationship to Policyholder']} value={getLabel('relationship', formData.relationship)} />
        <div className='claim-form__divider review-field--full' />

        {formData.relationship === 'SP' && (
          <>
            <div className='review-field review-field--full'>
              <span className='review-field__subheading'>{l['Spouse Details']}</span>
            </div>
            <ReviewField l={l} label={l['First Name']} value={formData.spouseFirstName || ''} />
            <ReviewField l={l} label={l['Last Name']} value={formData.spouseLastName || ''} />
            <ReviewField l={l} label={l['Email Address']} value={formData.spouseEmail || ''} />
            <ReviewField l={l} label={l['Phone Number']} value={formData.spousePhoneNumber || ''} />
            <div className='claim-form__divider review-field--full' />
          </>
        )}

        {formData.relationship === 'DP' && (
          <>
            <div className='review-field review-field--full'>
              <span className='review-field__subheading'>{l['Dependent Details']}</span>
            </div>
            <ReviewField l={l} label={l['First Name']} value={formData.dependentFirstName || ''} />
            <ReviewField l={l} label={l['Last Name']} value={formData.dependentLastName || ''} />
            <ReviewField l={l} label={l['Date of Birth']} value={displayDate(formData.dependentDateOfBirth || '')} />
            <ReviewField l={l} label={l['Relationship to Policyholder']} value={formData.dependentRelationship || ''} />
            <ReviewField l={l} label={l['Email Address']} value={formData.dependentEmail || ''} />
            <ReviewField l={l} label={l['Phone Number']} value={formData.dependentPhoneNumber || ''} />
            <div className='claim-form__divider review-field--full' />
          </>
        )}

        {formData.relationship === 'AP' && (
          <>
            <div className='review-field review-field--full'>
              <span className='review-field__subheading'>{l['Authorised Person Details']}</span>
            </div>
            <ReviewField l={l} label={l['First Name']} value={formData.authorisedFirstName || ''} />
            <ReviewField l={l} label={l['Last Name']} value={formData.authorisedLastName || ''} />
            <ReviewField l={l} label={l['Email Address']} value={formData.authorisedEmail || ''} />
            <ReviewField l={l} label={l['Phone Number']} value={formData.authorisedPhoneNumber || ''} />
            <div className='claim-form__divider review-field--full' />
          </>
        )}

        {formData.relationship === 'OTH' && (
          <>
            <div className='review-field review-field--full'>
              <span className='review-field__subheading'>{l['Additional Details']}</span>
            </div>
            <ReviewField
              l={l}
              label={l['Describe your relationship to the policyholder']}
              value={formData.otherRelationshipDescription || ''}
            />
            <ReviewField l={l} label={l['First Name']} value={formData.otherPersonFirstName || ''} />
            <ReviewField l={l} label={l['Last Name']} value={formData.otherPersonLastName || ''} />
            <ReviewField l={l} label={l['Email Address']} value={formData.otherPersonEmail || ''} />
            <ReviewField l={l} label={l['Phone Number']} value={formData.otherPersonPhoneNumber || ''} />
            <div className='claim-form__divider review-field--full' />
          </>
        )}
        <div className='review-field review-field--full'>
          <span className='review-field__subheading'>{l['Policy']}</span>
        </div>
        <ReviewField l={l} label={l['Policy Number']} value={formData.policyNumber} />
        <ReviewField l={l} label={l['Service Number']} value={formData.serviceNumber} />
        <ReviewField l={l} label={l['ReviewSchemeProduct']} value={getLabel('product', formData.schemeOrProduct)} />
        <div className='claim-form__divider review-field--full' />
        <ReviewField l={l} label={l['ReviewAddressLabel']} value={policyAddress} />
      </ReviewBlock>

      <ReviewBlock
        id="review-block-what-happened"
        l={l}
        title={l['What Happened']}
        isOpen={openBlocks[2]}
        onToggle={() => toggleBlock(2)}
        onEdit={() => setCurrentStep(2)}
      >
        <ReviewField l={l} label={l['Date of Loss']} value={displayDate(formData.dateOfLoss)} />
        <ReviewField l={l} label={l['Loss Type']} value={getLabel('lossType', formData.lossType)} />
        {formData.lossType === 'OTH' && (
          <ReviewField l={l} label={l['OtherLossType']} value={formData.otherLossType || ''} />
        )}
        {formData.lossType === 'TH' && (
          <ReviewField l={l} label={l['ReportedToPolice']} value={formData.theftReported || ''} />
        )}
        {formData.theftReported === 'Yes' && (
          <ReviewField l={l} label={l['Crime Reference Number']} value={formData.crimeReferenceNumber || ''} />
        )}        
        <dl className='review-field'>
          <dt className='review-field__label'>{l['How did it happen?']}</dt>
          <dd className='review-field__value'>{formData.description || emptyValue}</dd>
        </dl>

        <ReviewField l={l} label={l['Where did this happen']} value={getLabel('lossLocation', formData.lossLocationType)} />

        {formData.lossLocationType === 'ODE' && (
          <>
            <ReviewField l={l} label={l['Country of deployment']} value={getLabel('country', formData.deploymentCountry || '')} />
            <ReviewField l={l} label={l['Base or location name']} value={formData.deploymentLocationName || ''} />
          </>
        )}
        {formData.lossLocationType === 'DL' && (
          <ReviewField l={l} label={l['Risk Address']} value={riskAddress} />
        )}
        {formData.lossLocationType === 'PHA' && (
          <ReviewField l={l} label={l['Policyholder Address']} value={riskAddress} />
        )}
      </ReviewBlock>

      <ReviewBlock
        id="review-block-items-affected"
        l={l}
        title={l['Items Affected']}
        isOpen={openBlocks[3]}
        onToggle={() => toggleBlock(3)}
        onEdit={() => setCurrentStep(3)}
      >
        {formData.items.map((item, index) => (
          <Fragment key={item.id}>
            <div className='review-field review-field--full'>
              <strong>{String(l['ReviewItemNumberLabel']).replace('{1}', String(index + 1))}</strong>
            </div>

            <ReviewField
              l={l}
              label={l['Item Cover Type']}
              value={getLabel('itemCoverType', item.itemCoverType)}
            />

            <ReviewField
              l={l}
              label={l['Item Type']}
              value={getLabel('itemType', item.itemType)}
            />

            <ReviewField
              l={l}
              label={l['Item Description']}
              value={item.itemDescription}
            />

            <ReviewField
              l={l}
              label={l['Date Purchased']}
              value={displayDate(item.datePurchased)}
            />

            <ReviewField
              l={l}
              label={l['Purchase Price']}
              value={item.purchasePrice}
            />

            <ReviewField
              l={l}
              label={l['Claimed Amount']}
              value={item.claimedAmount}
            />

            <div className='claim-form__divider review-field--full' />
          </Fragment>
        ))}
      </ReviewBlock>

      <ReviewBlock
        id="review-block-evidence"
        l={l}
        title={l['ReviewSupportingEvidenceTitle']}
        isOpen={openBlocks[4]}
        onToggle={() => toggleBlock(4)}
        onEdit={() => setCurrentStep(4)}
      >
        <div className='review-field review-field--full'>
          <span className='review-field__label'>
            {l['Files Uploaded']}: <strong>{String(l['FilesNumber']).replace('{1}', String(formData.attachments.length))}</strong>
          </span>
          {formData.attachments.length > 0 && (
            <ul className='review-field__file-list'>
              {formData.attachments.map((a: UploadedAttachment) => {
                const typeLabel = a.docTypeLabel || a.docType;
                return (
                  <li key={a.id}>
                    {a.name}{typeLabel ? ` (${typeLabel})` : ''}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </ReviewBlock>

      <div className='claim-form__summary'>
        <h4 className='claim-form__summary-title'>{l['ClaimSummary']}</h4>
        <div className='claim-form__summary-section claim-form__summary-section--row'>
          <div className='claim-form__summary-label'>{l['TotalClaimValue']}:</div>
          <div className='claim-form__summary-total'>£{totalClaimedAmount.toFixed(2)}</div>
        </div>
      </div>

      <div className='review-declaration'>
        <h3 className='review-declaration__title'>{l['Fraud prevention notice']}</h3>
        <div className='review-notice-box'>
          <p>{l['FPNText']}</p>
          <p>{l['FPNText2']}</p>
          <p>
            {l['PrivacyPolicyNoticeText']}{' '}
            <a 
              className='review-privacy-link'
              href={String(l['PrivacyPolicyLinkUrl'])}
              target='_blank'
              rel='noopener noreferrer'
            >
              {l['PrivacyPolicyLinkLabel']}
            </a>.
          </p>
        </div>

        <h3 className='review-declaration__title'>{l['Declaration']}</h3>
        <div className='review-notice-box review-notice-box--declaration'>
          <p>{l['CACText']}</p>
          <p>{l['CACText2']}</p>
        </div>

        <label className='review-declaration__checkbox review-declaration__checkbox--single'>
          <input
            type='checkbox'
            checked={formData.declarationConsent}
            onChange={e => onFieldChange('declarationConsent', e.target.checked)}
          />
          <span>{l['DeclarationConsentText']}</span>
        </label>
      </div>

      {actions && <div className='claim-form__section-actions'>{actions}</div>}
    </section>
  );
}

export default ReviewSection;

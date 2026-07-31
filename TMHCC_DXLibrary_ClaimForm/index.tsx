import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Banner,
  Icon,
  Progress,
  registerIcon,
  useModalManager,
  withConfiguration
} from '@pega/cosmos-react-core';
import * as check from '@pega/cosmos-react-core/lib/components/Icon/icons/check.icon';
// @ts-ignore
import * as information from '@pega/cosmos-react-core/lib/components/Icon/icons/information.icon';
// @ts-ignore
import * as trash from '@pega/cosmos-react-core/lib/components/Icon/icons/trash.icon';
// @ts-ignore
import * as pencil from '@pega/cosmos-react-core/lib/components/Icon/icons/pencil.icon';
// @ts-ignore
import * as caretUp from '@pega/cosmos-react-core/lib/components/Icon/icons/caret-up.icon';
// @ts-ignore
import * as caretDown from '@pega/cosmos-react-core/lib/components/Icon/icons/caret-down.icon';
// @ts-ignore
import * as plus from '@pega/cosmos-react-core/lib/components/Icon/icons/plus.icon';
// @ts-ignore
import * as cloudUp from '@pega/cosmos-react-core/lib/components/Icon/icons/cloud-up.icon';

import type { PConnFieldProps } from '../shared/PConnProps';

import ClaimConfirmationView from './sections/ClaimConfirmationView';
import DiscardChangesModal from './sections/DiscardChangesModal';
import ItemsAffectedSection from './sections/ItemsAffectedSection';
import ReviewSection from './sections/ReviewSection';
import SupportingEvidenceSection from './sections/SupportingEvidenceSection';
import WhatHappenedSection from './sections/WhatHappenedSection';
import YourDetailsSection from './sections/YourDetailsSection';
import StyledTmhccDxLibraryClaimFormWrapper, { ClaimFormGlobalStyles } from './styles';
import type { ClaimFormData, ClaimFormErrors, ClaimItem } from './types';
import {
  fetchAllListValues,
  fetchCountryList,
  LIST_CATEGORIES,
  type ListOption,
  type CountryOption
} from './utils/listValuesUtils';
import {
  clearAttachmentIdsInSession,
  saveAttachmentIdsInSession
} from './utils/attachmentSessionUtils';
import { uploadAttachments } from './utils/attachmentUploadUtils';
import { attachUploadedFilesToCase } from './utils/caseAttachmentUtils';
import {
  getClaimFieldValidationError,
  getClaimFormValidationErrors,
  getStepValidationErrors
} from './utils/claimFormValidation';
import { closeCurrentBrowserContext } from './utils/claimFormStateUtils';
import { useLocalization } from './utils/useLocalization';
import { createClaimCase } from './utils/claimUtils';
import { validateFileTypes } from './utils/fileValidationUtils';
import { usePortalMask } from './utils/usePortalMask';
import { isSafeUrl } from './utils/urlUtils';
import { getDateFormat, normalizeDisplayDate } from './utils/dateUtils';
import { initializeOneTrustConsent } from './utils/oneTrustUtils';

registerIcon(check);
registerIcon(information);
registerIcon(trash);
registerIcon(pencil);
registerIcon(caretUp);
registerIcon(caretDown);
registerIcon(plus);
registerIcon(cloudUp);

interface TmhccDxLibraryClaimFormProps extends PConnFieldProps {
  caseTypeID?: string;
  createClaimApiPath?: string;
}

const INITIAL_FORM_DATA: ClaimFormData = {
  items: [],
  theftReported: '',
  crimeReferenceNumber: '',
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  policyNumber: '',
  serviceNumber: '',
  schemeOrProduct: '',
  relationship: '',
  spouseFirstName: '',
  spouseLastName: '',
  spouseEmail: '',
  spousePhoneNumber: '',
  dependentFirstName: '',
  dependentLastName: '',
  dependentDateOfBirth: '',
  dependentRelationship: '',
  dependentEmail: '',
  dependentPhoneNumber: '',
  authorisedFirstName: '',
  authorisedLastName: '',
  authorisedEmail: '',
  authorisedPhoneNumber: '',
  otherRelationshipDescription: '',
  otherPersonFirstName: '',
  otherPersonLastName: '',
  otherPersonEmail: '',
  otherPersonPhoneNumber: '',
  authorisationConfirmed: false,
  dateOfLoss: '',
  lossType: '',
  lossLocationType: 'PHA',
  lossCountry: '',
  lossAddressLine1: '',
  lossAddressLine2: '',
  lossCity: '',
  lossPostalCode: '',
  description: '',
  deploymentCountry: '',
  deploymentLocationName: '',
  policyCountry: 'GB',
  policyAddressLine1: '',
  policyAddressLine2: '',
  policyCity: '',
  policyPostalCode: '',
  attachments: [],
  declarationConsent: false
};

// Fields shown by one of the related-person sections (Spouse/Dependent/Authorised Person/
// Additional Details) — cleared whenever `relationship` changes so stale data/errors from a
// previously-selected section don't linger once a different section is shown.
const RELATED_PERSON_FIELDS: (keyof ClaimFormData)[] = [
  'spouseFirstName', 'spouseLastName', 'spouseEmail', 'spousePhoneNumber',
  'dependentFirstName', 'dependentLastName', 'dependentDateOfBirth', 'dependentRelationship',
  'dependentEmail', 'dependentPhoneNumber',
  'authorisedFirstName', 'authorisedLastName', 'authorisedEmail', 'authorisedPhoneNumber',
  'otherRelationshipDescription', 'otherPersonFirstName', 'otherPersonLastName',
  'otherPersonEmail', 'otherPersonPhoneNumber'
];

const getCaseDisplayId = (caseId: string): string => {
  const trimmedCaseId = caseId.trim();
  if (!trimmedCaseId) return '';
  const lastSpaceIndex = trimmedCaseId.lastIndexOf(' ');
  return lastSpaceIndex >= 0 ? trimmedCaseId.substring(lastSpaceIndex + 1) : trimmedCaseId;
};

function TmhccDxLibraryClaimForm(props: TmhccDxLibraryClaimFormProps) {
  const {
    caseTypeID = 'TMH-MCS-Work-MilitaryKitClaim',
    createClaimApiPath = '/api/application/v2/cases'
  } = props;
  const { getPConnect } = props;
  const l = useLocalization(getPConnect);

  const stepContentRef = useRef<HTMLDivElement>(null);
  const isSubmittingRef = useRef(false);
  const isMountedRef = useRef(true);
  useEffect(() => () => { isMountedRef.current = false; }, []);
  // Set synchronously (not via state) so the currently-attached beforeunload
  // listener sees it immediately — closeCurrentBrowserContext() below can
  // close/navigate the page before React gets a chance to re-render and remove
  // the listener via the effect's cleanup.
  const skipUnloadWarningRef = useRef(false);

  const [formData, setFormData] = useState<ClaimFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<ClaimFormErrors>({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showConfirmationView, setShowConfirmationView] = useState(false);
  const [createdCaseId, setCreatedCaseId] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const { create } = useModalManager();
  const isMasked = usePortalMask();
  const [listValues, setListValues] = useState<Record<string, ListOption[]>>({});
  const [countryOptions, setCountryOptions] = useState<CountryOption[]>([]);
  const [configLoadError, setConfigLoadError] = useState(false);
  const [attachmentErrors, setAttachmentErrors] = useState<
    Record<string, { docType?: string }>
  >({});
  const [attachmentUploadError, setAttachmentUploadError] = useState('');
  const [heroImageUrl, setHeroImageUrl] = useState('');

  // OneTrust cookie-consent banner — gated on this environment's Pega Access
  // Group Production Level (2 = Dev, 4 = SIT/UAT, 5 = Prod). Declared first so
  // it fires before the list-values/hero-image loads below.
  useEffect(() => {
    void initializeOneTrustConsent(String(l['ProductionLevelDataPageName']));
  }, [l['ProductionLevelDataPageName']]);

  useEffect(() => {
    const imageKey = String(l['HeroImageKey']).trim();
    if (!imageKey) return;
    let isActive = true;
    let objectUrl: string | undefined;

    const loadHeroImage = async () => {
      const assetLoader =
        (window as any).PCore?.getAssetLoader?.() ??
        (window as any).AssetLoader ??
        (window as any).PCore?.AssetLoader;
      if (!assetLoader?.getSvcImageUrl) return;
      try {
        const result: string | Blob = await assetLoader.getSvcImageUrl(imageKey);
        if (result instanceof Blob) {
          const url = window.URL.createObjectURL(result);
          if (!isActive) {
            window.URL.revokeObjectURL(url);
            return;
          }
          objectUrl = url;
          setHeroImageUrl(url);
          return;
        }
        if (!isActive) return;
        setHeroImageUrl(result);
      } catch {
        // hero panel renders without a background image
      }
    };

    void loadHeroImage();

    return () => {
      isActive = false;
      if (objectUrl) {
        window.URL.revokeObjectURL(objectUrl);
      }
    };
  }, [l['HeroImageKey']]);

  const getLabel = useCallback(
    (category: string, key: string): string => {
      if (!key?.trim()) return key;
      const optionMap: Record<string, ListOption[]> = {
        product: listValues[LIST_CATEGORIES.PRODUCT] ?? [],
        relationship: listValues[LIST_CATEGORIES.RELATIONSHIP] ?? [],
        lossType: listValues[LIST_CATEGORIES.LOSS_TYPE] ?? [],
        lossLocation: listValues[LIST_CATEGORIES.LOSS_LOCATION] ?? [],
        itemType: listValues[LIST_CATEGORIES.ITEM_TYPE] ?? [],
        itemCoverType: listValues[LIST_CATEGORIES.ITEM_COVER_TYPE] ?? [],
        yesNo: listValues[LIST_CATEGORIES.GENERIC_YES_NO] ?? [],
        country: countryOptions
      };
      return optionMap[category]?.find(o => o.key === key)?.label ?? key;
    },
    [listValues, countryOptions]
  );

  useEffect(() => {
    Promise.all([
      fetchAllListValues(String(l['LovDataPageName'])),
      fetchCountryList(String(l['CountriesDataPageName']))
    ]).then(([listValuesResult, countryResult]) => {
      if (!isMountedRef.current) return;

      setListValues(listValuesResult.data);
      setCountryOptions(countryResult.data);

      if (listValuesResult.failed || countryResult.failed) {
        setConfigLoadError(true);
      }
    });
  }, [l]);

  useEffect(() => {
    if (stepContentRef.current) {
      stepContentRef.current.scrollTop = 0;
    }
    stepContentRef.current?.focus({ preventScroll: true });
  }, [currentStep]);

  // Scroll the error/warning banner into view whenever one appears.
  useEffect(() => {
    if ((submitError || configLoadError || attachmentUploadError) && stepContentRef.current) {
      stepContentRef.current.scrollTop = 0;
    }
  }, [submitError, configLoadError, attachmentUploadError]);

  // Warn on refresh/tab-close/navigation while there's unsaved claim data.
  useEffect(() => {
    const isDirty = formData !== INITIAL_FORM_DATA && !showConfirmationView;
    if (!isDirty) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (skipUnloadWarningRef.current) return;
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [formData, showConfirmationView]);

  const handleFieldChange = (field: keyof ClaimFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (field === 'lossType') {
      setFormData(prev => ({ ...prev, description: '' }));
      setErrors(prev => ({
        ...prev,
        lossType: '',
        description: '',
        theftReported: '',
        crimeReferenceNumber: '',
        otherLossType: ''
      }));
    } else if (field === 'policyCountry') {
      setFormData(prev => ({
        ...prev,
        policyPostalCode: '',
        policyCity: '',
        policyAddressLine1: ''
      }));
      setErrors(prev => ({
        ...prev,
        policyCountry: '',
        policyPostalCode: '',
        policyCity: '',
        policyAddressLine1: ''
      }));
    } else if (field === 'lossCountry') {
      setFormData(prev => ({ ...prev, lossPostalCode: '', lossCity: '', lossAddressLine1: '' }));
      setErrors(prev => ({
        ...prev,
        lossCountry: '',
        lossPostalCode: '',
        lossCity: '',
        lossAddressLine1: ''
      }));
    } else if (field === 'lossLocationType') {
      setFormData(prev => ({ ...prev, deploymentCountry: '', deploymentLocationName: '' }));
      setErrors(prev => ({
        ...prev,
        lossLocationType: '',
        deploymentCountry: '',
        deploymentLocationName: ''
      }));
    } else if (field === 'relationship') {
      setFormData(prev => ({
        ...prev,
        authorisationConfirmed: false,
        ...Object.fromEntries(RELATED_PERSON_FIELDS.map(f => [f, '']))
      }));
      setErrors(prev => ({
        ...prev,
        relationship: '',
        authorisationConfirmed: '',
        ...Object.fromEntries(RELATED_PERSON_FIELDS.map(f => [f, '']))
      }));
    } else {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    setSubmitError('');
  };

  const DATE_FIELDS: (keyof ClaimFormData)[] = ['dateOfLoss', 'dependentDateOfBirth'];

  const handleFieldBlur = (field: keyof ClaimFormData) => {
    const format = getDateFormat(l);
    let dataForValidation = formData;

    if (DATE_FIELDS.includes(field)) {
      const raw = String(formData[field] ?? '');
      const normalized = raw.trim() ? normalizeDisplayDate(raw, format) : '';
      if (normalized !== raw) {
        dataForValidation = { ...formData, [field]: normalized };
        setFormData(dataForValidation);
      }
    }

    const fieldError = getClaimFieldValidationError(field, dataForValidation, l);
    setErrors(prev => ({ ...prev, [field]: fieldError }));
  };

  const handleFileUpload = async (files: File[]) => {
    setSubmitError('');
    setAttachmentUploadError('');

    const MAX_FILES = l['MaxAttachmentsCount'];

    const currentCount = formData.attachments.length;
    const remainingSlots = MAX_FILES - currentCount;

    if (remainingSlots <= 0) {
      setSubmitError(l['MaxAttachmentsReached']);
      return;
    }

    const filesToProcess = files.slice(0, remainingSlots);
    const overLimit = files.length > remainingSlots;

    setIsUploading(true);

    try {
      const { valid, rejectedNames, errorMessage } = await validateFileTypes(
        filesToProcess,
        String(l['AllowedFileTypesLabel']),
        String(l['AllowedFileExtensions']),
        l
      );

      if (overLimit && rejectedNames.length > 0) {
        setSubmitError(`${String(l['MaxAttachmentsReached'])} ${errorMessage}`);
      } else if (overLimit) {
        setSubmitError(String(l['MaxAttachmentsReached']));
      } else if (rejectedNames.length > 0) {
        setSubmitError(errorMessage);
      }
      if (valid.length === 0) return;

      const uploadResponses = await uploadAttachments(valid, l);

      if (!isMountedRef.current) return;

      const successfulUploads = uploadResponses
        .filter(r => r.success && r.attachment)
        .map(r => r.attachment!);

      const failedUploads = uploadResponses.filter(r => !r.success);

      if (successfulUploads.length > 0) {
        setFormData(prev => {
          const combined = [...prev.attachments, ...successfulUploads];

          const deduped = combined.filter((a, i, all) => i === all.findIndex(x => x.id === a.id));

          saveAttachmentIdsInSession(deduped.map(a => a.id));

          return { ...prev, attachments: deduped };
        });
      }

      if (failedUploads.length > 0) {
        const summary = failedUploads
          .map(f => f.message || String(l['ErrUploadFailedForFile']).replace('{1}', f.fileName || String(l['GenericFileLabel'])))
          .join(' ');
        setAttachmentUploadError(summary);
      }
    } catch (error: unknown) {
      if (isMountedRef.current) {
        setAttachmentUploadError(
          error instanceof Error ? error.message : String(l['ErrUploadUnexpected'])
        );
      }
    } finally {
      if (isMountedRef.current) setIsUploading(false);
    }
  };

  const handleDeleteAttachment = (attachmentId: string) => {
    setFormData(prev => {
      const updated = prev.attachments.filter(a => a.id !== attachmentId);
      saveAttachmentIdsInSession(updated.map(a => a.id));
      if (updated.length < l['MaxAttachmentsCount']) setSubmitError('');
      return { ...prev, attachments: updated };
    });
  };

  const handleDocTypeChange = (attachmentId: string, docType: string) => {
    const docTypeLabel = (listValues[LIST_CATEGORIES.EVIDENCE_TYPE] ?? []).find(
      o => o.key === docType
    )?.label;
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.map(a =>
        a.id === attachmentId
          ? {
              ...a,
              docType,
              docTypeLabel: docType !== 'Other' ? docTypeLabel : a.docTypeLabel
            }
          : a
      )
    }));
    setAttachmentErrors(prev => {
      if (!prev[attachmentId]) return prev;
      const next = { ...prev };
      delete next[attachmentId];
      return next;
    });
  };

  const handleNext = () => {
    const stepErrors = getStepValidationErrors(currentStep, formData, l);
    setErrors(stepErrors);

    if (Object.values(stepErrors).some(Boolean)) return;

    if (currentStep === 4) {
      const attErrors: Record<string, { docType?: string }> = {};
      formData.attachments.forEach(a => {
        const e: { docType?: string } = {};
        if (!a.docType) e.docType = l['ErrEvidenceTypeRequired'];
        if (Object.keys(e).length > 0) attErrors[a.id] = e;
      });
      if (Object.keys(attErrors).length > 0) {
        setAttachmentErrors(attErrors);
        return;
      }
      setAttachmentErrors({});
    }

    setErrors({});
    setSubmitError('');
    setCurrentStep(prev => (prev < 5 ? prev + 1 : prev));
  };

  const handleSubmit = async () => {
    if (isSubmittingRef.current) return;

    const validationErrors = getClaimFormValidationErrors(formData, l);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setCurrentStep(1);
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await createClaimCase({ createClaimApiPath, caseTypeID, formData, l });

      if (!isMountedRef.current) return;

      const fullCaseId = response.ID || '';

      // createClaimCase already gates on a valid case ID before returning success: true
      if (response.success && fullCaseId) {
        const attachResponse = await attachUploadedFilesToCase(fullCaseId, formData.attachments, l);

        if (!isMountedRef.current) return;

        if (!attachResponse.success) {
          setSubmitError(String(l['ErrAttachmentLinkFailedOnConfirmation']));
        }
        setCreatedCaseId(getCaseDisplayId(fullCaseId));
        setShowConfirmationView(true);
        setFormData(INITIAL_FORM_DATA);
        setErrors({});
        clearAttachmentIdsInSession();
      } else {
        setSubmitError(response.message || String(l['ErrCaseCreationFailed']));
      }
    } finally {
      isSubmittingRef.current = false;
      if (isMountedRef.current) setIsSubmitting(false);
    }
  };

  const handleDiscardAndClose = () => {
    skipUnloadWarningRef.current = true;
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
    setSubmitError('');
    setAttachmentUploadError('');
    setCurrentStep(1);
    clearAttachmentIdsInSession();
    const returnHomeUrl = String(l['ReturnHomePageLink']);
    closeCurrentBrowserContext(isSafeUrl(returnHomeUrl) ? returnHomeUrl : undefined);
  };
  const handleItemsChange = (items: ClaimItem[]) => {
    setFormData(prev => ({
      ...prev,
      items
    }));
  };
  const handleCancel = () => {
    create(
      () => <DiscardChangesModal onDiscard={handleDiscardAndClose} l={l} />,
      {},
      { dismissible: true }
    );
  };
  const stepDefinitions: Array<{ label: string; name: string }> = [
    { label: l['Step 1'], name: l['Your Details'] },
    { label: l['Step 2'], name: l['What Happened'] },
    { label: l['Step 3'], name: l['Items Affected'] },
    { label: l['Step 4'], name: l['Evidence'] }
  ];

  const renderImageOverlay = () => (
    <div className='claim-form__image-overlay'>
      <div className='claim-form__image-content'>
        <h1 className='claim-form__image-title'>
          {l['HelpTextHeaderPrefix'].toUpperCase()}
          <span className='claim-form__image-highlight'>
            {l['HelpTextHeaderHighlight'].toUpperCase()}
          </span>
        </h1>
        <p className='claim-form__image-subtext'>{l['HelpDescription']}</p>

        {/* ✅ Divider below subtext */}
        <div className='claim-form__image-divider' />

        <div className='claim-form__image-contact'>
          <div>
            <strong>{l['HelpTelephoneKey']}</strong>
            <p>{l['HelpTelephoneValue']}</p>
          </div>

          <div>
            <strong>{l['HelpEmailKey']}</strong>
            <p>{l['HelpEmailValue']}</p>
          </div>

          <div>
            <strong>{l['HelpOverseasKey']}</strong>
            <p>{l['HelpOverseasValue']}</p>
          </div>
        </div>

        <div className='claim-form__image-hours'>
          <strong>{l['HelpSupportHoursKey']}</strong>
          <span>{l['HelpSupportHoursValue']}</span>
        </div>
      </div>
    </div>
  );

  const renderStepNav = () => (
    <div className='claim-form__step-nav'>
      {stepDefinitions.map(({ label, name }, i) => {
        const step = i + 1;
        const isComplete = currentStep > step;
        const isCurrent = currentStep === step;
        let stateClass = 'claim-form__step-card--upcoming';
        if (isComplete) stateClass = 'claim-form__step-card--complete';
        else if (isCurrent) stateClass = 'claim-form__step-card--current';
        return (
          <div
            key={step}
            className={`claim-form__step-card ${stateClass}`}
            aria-current={isCurrent ? 'step' : undefined}
          >
            <div className='claim-form__step-card-info'>
              <span className='claim-form__step-card-label'>{label}</span>
              <span className='claim-form__step-card-name'>{name}</span>
            </div>
            <div className='claim-form__step-card-icon'>
              {isComplete ? <Icon name='check' size='s' /> : ''}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderActions = () => {
    const isReview = currentStep === 5;

    const leftButton = (
      <div className='claim-form__actions-left'>
        <button
          type='button'
          className='claim-form__button claim-form__button--secondary'
          onClick={handleCancel}
          disabled={isSubmitting || isUploading}
        >
          {l['Cancel']}
        </button>
      </div>
    );

    const rightButton = isReview ? (
      <button
        type='button'
        className='claim-form__button claim-form__button--primary'
        onClick={handleSubmit}
        disabled={
          isSubmitting ||
          isUploading ||
          !formData.declarationConsent
        }
      >
        {isSubmitting ? (
          <span className='claim-form__processing-content'>
            <Progress />
            <span>{l['Processing...']}</span>
          </span>
        ) : (
          l['Submit']
        )}
      </button>
    ) : (
      <button
        type='button'
        className='claim-form__button claim-form__button--primary'
        onClick={handleNext}
        disabled={isUploading || (currentStep === 3 && formData.items.length === 0)}
      >
        {l['Continue']}
      </button>
    );

    return (
      <div className='claim-form__actions'>
        {leftButton}
        {rightButton}
      </div>
    );
  };

  const renderCurrentSection = () => {
    const actions = renderActions();

    if (currentStep === 5) {
      return (
        <ReviewSection
          formData={formData}
          setCurrentStep={setCurrentStep}
          onFieldChange={handleFieldChange}
          l={l}
          getLabel={getLabel}
          actions={actions}
        />
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <>
            {configLoadError && (
              <Banner className='claim-form__banner-gap' variant='urgent' messages={[String(l['ErrConfigLoadFailed'])]} />
            )}
            <YourDetailsSection
              formData={formData}
              errors={errors}
              onFieldChange={(f, v) => handleFieldChange(f, v as string)}
              onFieldBlur={handleFieldBlur}
              productOptions={listValues[LIST_CATEGORIES.PRODUCT] ?? []}
              relationshipOptions={listValues[LIST_CATEGORIES.RELATIONSHIP] ?? []}
              countryOptions={countryOptions}
              l={l}
              actions={actions}
            />
          </>
        );
      case 2:
        return (
          <WhatHappenedSection
            formData={formData}
            errors={errors}
            onFieldChange={(f, v) => handleFieldChange(f, v)}
            onFieldBlur={handleFieldBlur}
            lossTypeOptions={listValues[LIST_CATEGORIES.LOSS_TYPE] ?? []}
            lossLocationOptions={listValues[LIST_CATEGORIES.LOSS_LOCATION] ?? []}
            theftReportedOptions={listValues[LIST_CATEGORIES.GENERIC_YES_NO] ?? []}
            countryOptions={countryOptions}
            l={l}
            actions={actions}
          />
        );
      case 3:
        return (
          <ItemsAffectedSection
            formData={formData}
            onItemsChange={handleItemsChange}
            itemTypeOptions={listValues[LIST_CATEGORIES.ITEM_TYPE] ?? []}
            itemCoverTypeOptions={listValues[LIST_CATEGORIES.ITEM_COVER_TYPE] ?? []}
            l={l}
            actions={actions}
          />
        );
      case 4:
        return (
          <SupportingEvidenceSection
            formData={formData}
            isUploading={isUploading}
            onFileUpload={handleFileUpload}
            onDeleteAttachment={handleDeleteAttachment}
            onDocTypeChange={handleDocTypeChange}
            evidenceTypeOptions={listValues[LIST_CATEGORIES.EVIDENCE_TYPE] ?? []}
            attachmentErrors={attachmentErrors}
            uploadError={attachmentUploadError}
            l={l}
            actions={actions}
          />
        );
      default:
        return null;
    }
  };

  const portalMaskOverlay = isMasked && (
    <div className='claim-form__portal-mask' aria-hidden='true'>
      <Progress />
    </div>
  );

  const imageStyle = heroImageUrl ? { backgroundImage: `url(${heroImageUrl})` } : undefined;

  if (showConfirmationView) {
    return (
      <>
        {portalMaskOverlay}
        <ClaimFormGlobalStyles />
        <StyledTmhccDxLibraryClaimFormWrapper id='tmhcc-claim-form-root'>
          <div className='claim-form-page'>
            <div className='claim-form-page__image' style={imageStyle}>
              {renderImageOverlay()}
            </div>
            <div className='claim-form-page__panel'>
              <div className='claim-form' ref={stepContentRef} tabIndex={-1}>
                <ClaimConfirmationView
                  caseId={createdCaseId}
                  confirmationDataPageName={String(l['ConfirmationDataPageName'])}
                  onClose={() => {
                    setShowConfirmationView(false);
                    setCurrentStep(1);
                    setSubmitError('');
                  }}
                  l={l}
                  attachmentWarning={submitError || undefined}
                />
              </div>
            </div>
          </div>
        </StyledTmhccDxLibraryClaimFormWrapper>
      </>
    );
  }

  return (
    <>
      {portalMaskOverlay}
      <ClaimFormGlobalStyles />
      <StyledTmhccDxLibraryClaimFormWrapper id='tmhcc-claim-form-root'>
        <div className='claim-form-page'>
          <div className='claim-form-page__image' style={imageStyle}>
            {renderImageOverlay()}
          </div>
          <div className='claim-form-page__panel'>
            {renderStepNav()}
            <div className='claim-form' ref={stepContentRef} tabIndex={-1}>
              {submitError && (
                <Banner className='claim-form__banner-gap' variant='urgent' messages={[submitError]} />
              )}
              {renderCurrentSection()}
            </div>
          </div>
        </div>
      </StyledTmhccDxLibraryClaimFormWrapper>
    </>
  );
}

export default withConfiguration(TmhccDxLibraryClaimForm);

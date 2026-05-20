import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Icon, Progress, registerIcon, useModalManager, withConfiguration } from '@pega/cosmos-react-core';
import * as check from '@pega/cosmos-react-core/lib/components/Icon/icons/check.icon';

import type { PConnFieldProps } from '../shared/PConnProps';

import ClaimConfirmationView from './sections/ClaimConfirmationView';
import DiscardChangesModal from './sections/DiscardChangesModal';
import ItemsAffectedSection from './sections/ItemsAffectedSection';
import ReviewSection from './sections/ReviewSection';
import SupportingEvidenceSection from './sections/SupportingEvidenceSection';
import WhatHappenedSection from './sections/WhatHappenedSection';
import YourDetailsSection from './sections/YourDetailsSection';
import StyledTmhccDxLibraryClaimFormWrapper, { ClaimFormGlobalStyles } from './styles';
import type { ClaimFormData, ClaimFormErrors, FormStyleConfig } from './types';
import { clearAttachmentIdsInSession, saveAttachmentIdsInSession } from './utils/attachmentSessionUtils';
import { uploadAttachments } from './utils/attachmentUploadUtils';
import { attachUploadedFilesToCase } from './utils/caseAttachmentUtils';
import { getClaimFieldValidationError, getClaimFormValidationErrors, getStepValidationErrors } from './utils/claimFormValidation';
import { closeCurrentBrowserContext, isClaimFormDirty } from './utils/claimFormStateUtils';
import { createClaimCase } from './utils/claimUtils';
import { validateFileTypes } from './utils/fileValidationUtils';
import { createTurnstileController, type TurnstileController } from './utils/turnstileUtils';
import { usePortalMask } from './utils/usePortalMask';

registerIcon(check);

interface TmhccDxLibraryClaimFormProps extends PConnFieldProps {
  submitLabel?: string;
  cancelLabel?: string;
  caseTypeID?: string;
  styleVariant?: 'theme' | 'persona';
  styleMode?: string;
  turnstileSiteKey?: string;
  enableTurnstile?: boolean;
  createClaimApiPath?: string;
  acknowledgementDataPage?: string;
  /** URL for the left-column image. */
  imageSrc?: string;
}

const INITIAL_FORM_DATA: ClaimFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  policyNumber: '',
  membershipNumber: '',
  serviceNumber: '',
  schemeOrProduct: 'Military Kit',
  relationship: '',
  dateOfLoss: '',
  lossType: '',
  causeOfLoss: '',
  lossCountry: '',
  lossAddressLine1: '',
  lossAddressLine2: '',
  lossCity: '',
  lossPostalCode: '',
  description: '',
  itemType: '',
  itemDescription: '',
  purchasePrice: '',
  claimedAmount: '',
  policyCountry: '',
  policyAddressLine1: '',
  policyAddressLine2: '',
  policyCity: '',
  policyPostalCode: '',
  hasUserConfirmed: false,
  attachments: []
};

const STEP_NAMES = ['Your Details', 'What Happened', 'Items Affected', 'Supporting Evidence'];

const getCaseDisplayId = (caseId: string): string => {
  const trimmedCaseId = caseId.trim();
  if (!trimmedCaseId) return '';
  const lastSpaceIndex = trimmedCaseId.lastIndexOf(' ');
  return lastSpaceIndex >= 0 ? trimmedCaseId.substring(lastSpaceIndex + 1) : trimmedCaseId;
};

function TmhccDxLibraryClaimForm(props: TmhccDxLibraryClaimFormProps) {
  const {
    submitLabel = 'Submit Claim',
    cancelLabel = 'Cancel',
    caseTypeID = 'TMHCC-Claims-Work-Claim',
    styleVariant = 'theme',
    styleMode = 'default',
    turnstileSiteKey = '',
    enableTurnstile = true,
    createClaimApiPath = 'api/TrinityClaims/v1/create',
    acknowledgementDataPage = 'D_ClaimAcknowledgement',
    imageSrc = 'https://res.cloudinary.com/dnut6tij7/image/upload/v1751602830/samples/chair-and-coffee-table.jpg'
  } = props;
  const { getPConnect } = props;

  useEffect(() => {
    if (typeof getPConnect !== 'function') return;
    const locService = getPConnect().getLocalizationService?.();
    console.log('[ClaimForm] localizationService object:', locService);
  }, [getPConnect]);

  const turnstileSiteKeyTrimmed = enableTurnstile ? (turnstileSiteKey ?? '').trim() : '';
  const turnstileHostRef = useRef<HTMLDivElement | null>(null);
  const turnstileControllerRef = useRef<TurnstileController | null>(null);

  const [formData, setFormData] = useState<ClaimFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<ClaimFormErrors>({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showConfirmationView, setShowConfirmationView] = useState(false);
  const [createdCaseId, setCreatedCaseId] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [turnstileFormUnlocked, setTurnstileFormUnlocked] = useState(!turnstileSiteKeyTrimmed);
  const [isTurnstileBooting, setIsTurnstileBooting] = useState(Boolean(turnstileSiteKeyTrimmed));
  const [turnstileError, setTurnstileError] = useState('');
  const { create } = useModalManager();
  const isMasked = usePortalMask();

  useLayoutEffect(() => {
    if (!turnstileSiteKeyTrimmed) {
      setTurnstileFormUnlocked(true);
      setIsTurnstileBooting(false);
      setTurnstileError('');
      return undefined;
    }

    setTurnstileFormUnlocked(false);
    setIsTurnstileBooting(true);
    setTurnstileError('');

    const host = turnstileHostRef.current;
    if (!host) {
      setIsTurnstileBooting(false);
      setTurnstileError('Security check could not start. Please refresh the page.');
      return undefined;
    }

    let cancelled = false;

    createTurnstileController(host, turnstileSiteKeyTrimmed, {
      onToken: () => {
        if (cancelled) return;
        setTurnstileError('');
        setTurnstileFormUnlocked(true);
      },
      onError: () => {
        if (cancelled) return;
        setTurnstileError('Security verification failed. Please refresh the page and try again.');
      }
    })
      .then(controller => {
        if (cancelled) { controller.destroy(); return; }
        turnstileControllerRef.current = controller;
        setIsTurnstileBooting(false);
      })
      .catch(error => {
        if (!cancelled) {
          setIsTurnstileBooting(false);
          setTurnstileError(error instanceof Error ? error.message : 'Security check failed to load.');
        }
      });

    return () => {
      cancelled = true;
      turnstileControllerRef.current?.destroy();
      turnstileControllerRef.current = null;
    };
  }, [turnstileSiteKeyTrimmed]);

  const styleConfig: FormStyleConfig = useMemo(
    () => ({ styleVariant, styleMode }),
    [styleVariant, styleMode]
  );

  const handleFieldChange = (field: keyof ClaimFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
    setSubmitError('');
  };

  const handleFieldBlur = (field: keyof ClaimFormData) => {
    const fieldError = getClaimFieldValidationError(field, formData);
    setErrors(prev => ({ ...prev, [field]: fieldError }));
  };

  const handleFileUpload = async (files: File[]) => {
    setSubmitError('');
    const { valid, rejectedNames, errorMessage } = validateFileTypes(files);
    if (rejectedNames.length > 0) setSubmitError(errorMessage);
    if (valid.length === 0) return;

    setIsUploading(true);
    const uploadResponses = await uploadAttachments(valid);
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
    if (failedUploads.length > 0) setSubmitError(failedUploads[0].message || 'Some files failed to upload');
    setIsUploading(false);
  };

  const handleDeleteAttachment = (attachmentId: string) => {
    setFormData(prev => {
      const updated = prev.attachments.filter(a => a.id !== attachmentId);
      saveAttachmentIdsInSession(updated.map(a => a.id));
      return { ...prev, attachments: updated };
    });
  };

  const handleDocTypeChange = (attachmentId: string, docType: string) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.map(a => a.id === attachmentId ? { ...a, docType } : a)
    }));
  };

  const handleNext = () => {
    const stepErrors = getStepValidationErrors(currentStep, formData);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(prev => ({ ...prev, ...stepErrors }));
      return;
    }
    setErrors({});
    setCurrentStep(prev => (prev < 5 ? prev + 1 : prev));
  };

  const handleBack = () => {
    setErrors({});
    setSubmitError('');
    setCurrentStep(prev => (prev > 1 ? prev - 1 : prev));
  };

  const handleSubmit = async () => {
    const validationErrors = getClaimFormValidationErrors(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setCurrentStep(1);
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    let turnstileToken: string | undefined;
    if (turnstileSiteKeyTrimmed) {
      const controller = turnstileControllerRef.current;
      if (!controller) {
        setSubmitError('Security verification is not ready. Please refresh the page.');
        setIsSubmitting(false);
        return;
      }
      try {
        turnstileToken = await controller.refreshToken();
      } catch (error) {
        setSubmitError(error instanceof Error ? error.message : 'Security verification failed before submit.');
        setIsSubmitting(false);
        return;
      }
    }

    const response = await createClaimCase({ createClaimApiPath, caseTypeID, formData, turnstileToken });

    if (response.success) {
      const fullCaseId = response.ID || '';
      const attachmentIds = formData.attachments.map(a => a.id);
      const attachResponse = await attachUploadedFilesToCase(fullCaseId, attachmentIds);
      if (!attachResponse.success) {
        setSubmitError(attachResponse.message || 'Case created but file attachment failed');
      }
      setCreatedCaseId(getCaseDisplayId(fullCaseId));
      setShowConfirmationView(true);
      setFormData(INITIAL_FORM_DATA);
      setErrors({});
      clearAttachmentIdsInSession();
    } else {
      setSubmitError(response.message || 'Failed to create claim case.');
    }

    setIsSubmitting(false);
  };

  const handleDiscardAndClose = () => {
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
    setSubmitError('');
    setCurrentStep(1);
    clearAttachmentIdsInSession();
    closeCurrentBrowserContext();
  };

  const handleCancel = () => {
    const hasUnsavedChanges = isClaimFormDirty(formData, INITIAL_FORM_DATA);
    if (hasUnsavedChanges) {
      create(() => <DiscardChangesModal onDiscard={handleDiscardAndClose} />, {}, { dismissible: true });
      return;
    }
    closeCurrentBrowserContext();
  };

  const renderStepNav = () => (
    <div className='claim-form__step-nav'>
      {STEP_NAMES.map((name, i) => {
        const step = i + 1;
        const isComplete = currentStep > step;
        const isCurrent = currentStep === step;
        let stateClass = 'claim-form__step-card--upcoming';
        if (isComplete) stateClass = 'claim-form__step-card--complete';
        else if (isCurrent) stateClass = 'claim-form__step-card--current';
        return (
          <div
            key={step}
            className={`claim-form__step-card ${stateClass}${isComplete ? ' claim-form__step-card--clickable' : ''}`}
            onClick={isComplete ? () => setCurrentStep(step) : undefined}
            role={isComplete ? 'button' : undefined}
            aria-label={isComplete ? `Go back to step ${step}: ${name}` : undefined}
          >
            <div className='claim-form__step-card-info'>
              <span className='claim-form__step-card-label'>Step {step}</span>
              <span className='claim-form__step-card-name'>{name}</span>
            </div>
            <div className='claim-form__step-card-icon'>{isComplete ? '✓' : ''}</div>
          </div>
        );
      })}
    </div>
  );

  const renderCurrentSection = () => {
    if (currentStep === 5) {
      return <ReviewSection formData={formData} />;
    }

    if (Boolean(turnstileSiteKeyTrimmed) && !turnstileFormUnlocked) {
      return (
        <div className='claim-form__turnstile-gate' aria-live='polite'>
          <p className='claim-form__turnstile-gate-text'>
            Complete the security verification below to open the claim form.
          </p>
          {isTurnstileBooting && (
            <div className='claim-form__turnstile-booting'>
              <Progress />
              <span>Loading security check…</span>
            </div>
          )}
          {turnstileError && (
            <div className='claim-form__feedback claim-form__feedback--error' role='alert'>
              {turnstileError}
            </div>
          )}
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <YourDetailsSection
            formData={formData}
            errors={errors}
            onFieldChange={(f, v) => handleFieldChange(f, v as string)}
            onFieldBlur={handleFieldBlur}
          />
        );
      case 2:
        return (
          <WhatHappenedSection
            formData={formData}
            errors={errors}
            onFieldChange={(f, v) => handleFieldChange(f, v)}
            onFieldBlur={handleFieldBlur}
          />
        );
      case 3:
        return (
          <ItemsAffectedSection
            formData={formData}
            errors={errors}
            onFieldChange={(f, v) => handleFieldChange(f, v)}
            onFieldBlur={handleFieldBlur}
          />
        );
      case 4:
        return (
          <SupportingEvidenceSection
            formData={formData}
            errors={errors}
            isUploading={isUploading}
            onFileUpload={handleFileUpload}
            onDeleteAttachment={handleDeleteAttachment}
            onDocTypeChange={handleDocTypeChange}
            onConsentChange={checked => handleFieldChange('hasUserConfirmed', checked)}
            onConsentBlur={() => handleFieldBlur('hasUserConfirmed')}
          />
        );
      default:
        return null;
    }
  };

  const renderActions = () => {
    const isReview = currentStep === 5;
    const isFirst = currentStep === 1;

    const leftButton = isFirst ? (
      <button
        type='button'
        className='claim-form__button claim-form__button--secondary'
        onClick={handleCancel}
        disabled={isSubmitting || isUploading}
      >
        {cancelLabel}
      </button>
    ) : (
      <button
        type='button'
        className='claim-form__button claim-form__button--secondary'
        onClick={handleBack}
        disabled={isSubmitting}
      >
        Back
      </button>
    );

    const rightButton = isReview ? (
      <button
        type='button'
        className='claim-form__button claim-form__button--primary'
        onClick={handleSubmit}
        disabled={isSubmitting || isUploading || (Boolean(turnstileSiteKeyTrimmed) && !turnstileFormUnlocked)}
      >
        {isSubmitting ? (
          <span className='claim-form__processing-content'>
            <Progress />
            <span>Processing...</span>
          </span>
        ) : (
          <span className='claim-form__button-content'>
            <span>{submitLabel}</span>
            <span className='claim-form__button-icon-circle'>
              <Icon name='check' size='s' />
            </span>
          </span>
        )}
      </button>
    ) : (
      <button
        type='button'
        className='claim-form__button claim-form__button--primary'
        onClick={handleNext}
        disabled={isUploading || (Boolean(turnstileSiteKeyTrimmed) && !turnstileFormUnlocked && currentStep === 1)}
      >
        {currentStep === 4 ? 'Review & Submit' : 'Next'}
      </button>
    );

    return (
      <div className='claim-form__actions'>
        {leftButton}
        {rightButton}
      </div>
    );
  };

  const portalMaskOverlay = isMasked && (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}
      aria-hidden='true'
    >
      <Progress />
    </div>
  );

  const imageStyle = imageSrc ? { backgroundImage: `url(${imageSrc})` } : undefined;

  if (showConfirmationView) {
    return (
      <>
        {portalMaskOverlay}
        <ClaimFormGlobalStyles />
        <StyledTmhccDxLibraryClaimFormWrapper styleConfig={styleConfig}>
          <div className='claim-form-page'>
            <div className='claim-form-page__image' style={imageStyle} />
            <div className='claim-form-page__panel'>
              <div className='claim-form'>
                <ClaimConfirmationView
                  caseId={createdCaseId}
                  onClose={closeCurrentBrowserContext}
                  acknowledgementDataPage={acknowledgementDataPage}
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
      <StyledTmhccDxLibraryClaimFormWrapper styleConfig={styleConfig}>
        <div className='claim-form-page'>
          <div className='claim-form-page__image' style={imageStyle} />
          <div className='claim-form-page__panel'>
            {renderStepNav()}
            <div className='claim-form'>
              {Boolean(turnstileSiteKeyTrimmed) && (
                <div
                  ref={turnstileHostRef}
                  className={
                    turnstileFormUnlocked
                      ? 'claim-form__turnstile-host claim-form__turnstile-host--hidden'
                      : 'claim-form__turnstile-host'
                  }
                />
              )}
              {renderCurrentSection()}
              {submitError && (
                <div className='claim-form__feedback claim-form__feedback--error' role='alert'>
                  {submitError}
                </div>
              )}
              {renderActions()}
            </div>
          </div>
        </div>
      </StyledTmhccDxLibraryClaimFormWrapper>
    </>
  );
}

export default withConfiguration(TmhccDxLibraryClaimForm);

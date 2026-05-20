import type { ClaimFormData, ClaimFormErrors } from '../types';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9()+\-\s]{7,15}$/;

const required = (msg: string) => (v: string) => v ? '' : msg;

type FieldValidator = (value: string, formData: ClaimFormData) => string;

const FIELD_VALIDATORS: Partial<Record<keyof ClaimFormData, FieldValidator>> = {
  firstName:        required('First name is required'),
  lastName:         required('Last name is required'),
  policyNumber:     required('Policy number is required'),
  relationship:     required('Relationship to policyholder is required'),
  dateOfLoss:       required('Date of loss is required'),
  lossType:         required('Loss type is required'),
  causeOfLoss:      required('Cause of loss is required'),
  lossCountry:      required('Country is required'),
  lossAddressLine1: required('Address line 1 is required'),
  lossCity:         required('City / Town is required'),
  lossPostalCode:   required('Postal code is required'),
  description:      required('Description is required'),
  itemType:         required('Type of item is required'),
  purchasePrice:    required('Purchase price is required'),
  policyCountry:    required('Country is required'),
  policyAddressLine1: required('Address line 1 is required'),
  policyCity:       required('City / Town is required'),
  policyPostalCode: required('Postal code is required'),

  email: v => {
    if (!v) return 'Email is required';
    return EMAIL_PATTERN.test(v) ? '' : 'Enter a valid email address';
  },
  phoneNumber: v => {
    if (!v) return '';
    return PHONE_PATTERN.test(v) ? '' : 'Enter a valid phone number';
  },
  hasUserConfirmed: (_v, formData) =>
    formData.hasUserConfirmed ? '' : 'Please confirm before submitting the claim'
};

export const getClaimFieldValidationError = (field: keyof ClaimFormData, formData: ClaimFormData): string => {
  const validator = FIELD_VALIDATORS[field];
  if (!validator) return '';
  const value = typeof formData[field] === 'string' ? (formData[field] as string).trim() : '';
  return validator(value, formData);
};

const STEP_FIELDS: Record<number, (keyof ClaimFormData)[]> = {
  1: ['firstName', 'lastName', 'email', 'phoneNumber', 'policyNumber'],
  2: ['relationship', 'dateOfLoss', 'lossType', 'causeOfLoss', 'lossCountry', 'lossAddressLine1', 'lossCity', 'lossPostalCode', 'description'],
  3: ['itemType', 'purchasePrice', 'policyCountry', 'policyAddressLine1', 'policyCity', 'policyPostalCode'],
  4: ['hasUserConfirmed']
};

export const getStepValidationErrors = (step: number, formData: ClaimFormData): ClaimFormErrors => {
  const errors: ClaimFormErrors = {};
  const fields = STEP_FIELDS[step] ?? [];
  fields.forEach(field => {
    const fieldError = getClaimFieldValidationError(field, formData);
    if (fieldError) {
      errors[field] = fieldError;
    }
  });
  return errors;
};

export const getClaimFormValidationErrors = (formData: ClaimFormData): ClaimFormErrors => {
  const errors: ClaimFormErrors = {};
  [1, 2, 3, 4].forEach(step => {
    Object.assign(errors, getStepValidationErrors(step, formData));
  });
  return errors;
};

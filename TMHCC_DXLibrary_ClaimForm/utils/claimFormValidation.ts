import type { ClaimFormData, ClaimFormErrors } from '../types';
import type { LocalizationMap } from './useLocalization';
import type { ClaimItem } from '../types';
import { LIST_CATEGORIES } from './listValuesUtils';
import {
  compareDates,
  getDateFormat,
  isAtLeastAge,
  isFutureDate,
  isValidDisplayDate
} from './dateUtils';

type FieldValidator = (value: string, formData: ClaimFormData) => string;

// module-level cache — re-builds only when l identity changes
let _cachedL: LocalizationMap | undefined;
let _cachedValidators: Partial<Record<keyof ClaimFormData, FieldValidator>> | undefined;

// ── Validator factories (module-level so their branches don't count against buildValidators) ──

const req = (l: LocalizationMap, key: keyof LocalizationMap): FieldValidator =>
  (v) => v ? '' : String(l[key]);

const dateFormatError = (l: LocalizationMap): string =>
  String(l['ErrDateFormatInvalid']).replace('{1}', getDateFormat(l));

const notFuture = (l: LocalizationMap, reqKey: keyof LocalizationMap, futureKey: keyof LocalizationMap): FieldValidator =>
  (v) => {
    if (!v) return String(l[reqKey]);
    const format = getDateFormat(l);
    if (!isValidDisplayDate(v, format)) return dateFormatError(l);
    return isFutureDate(v, format) ? String(l[futureKey]) : '';
  };

const postalCodeFactory = (l: LocalizationMap) =>
  (country: string) =>
    (v: string): string => {
      if(!v){
        // Postal code is mandatory for UK (GB) and not for other countries
        if(country!== 'GB') return '';
        const errKey = `${country}_PCErrMsg`;
        return String(l[errKey as keyof typeof l] || l['PCErrMsg']);
      }
      const patternKey = `${country}_PCPattern`;
      const postalRx = new RegExp(String(l[patternKey as keyof typeof l] || l['PostalCodePattern']));
      if (postalRx.test(v)) return '';
      const formatErrKey = `${country}_PCFormatErrMsg`;
      const formatErrMsg = l[formatErrKey as keyof typeof l];
      if (formatErrMsg) return String(formatErrMsg);
      const labelKey = `${country}_PCLabel`;
      const label = l[labelKey as keyof typeof l] || l['Postal Code'];
      return String(l['ErrPostalCodeInvalid']).replace('{1}', String(label));
    };

const minMax = (
  l: LocalizationMap,
  reqKey: keyof LocalizationMap,
  minKey: keyof LocalizationMap,
  maxKey: keyof LocalizationMap,
  min: number,
  max: number
): FieldValidator =>
  (v) => {
    if (!v) return String(l[reqKey]);
    if (v.length < min) return String(l[minKey]).replace('{1}', String(min));
    if (v.length > max) return String(l[maxKey]).replace('{1}', String(max));
    return '';
  };

const optionalMaxLength = (
  l: LocalizationMap,
  maxKey: keyof LocalizationMap,
  max: number
): FieldValidator =>
  (v) => (v && v.length > max) ? String(l[maxKey]).replace('{1}', String(max)) : '';

const emailValidator = (l: LocalizationMap, emailRx: RegExp): FieldValidator =>
  (v) => {
    if (!v) return String(l['ErrEmailRequired']);
    return emailRx.test(v) ? '' : String(l['ErrEmailInvalid']);
  };

const phoneValidator = (l: LocalizationMap, phoneRx: RegExp, phoneLen: number | string): FieldValidator =>
  (v) => {
    if (!v) return String(l['ErrPhoneRequired']);
    return phoneRx.test(v) ? '' : String(l['ErrPhoneFormat']).replace('{1}', String(phoneLen));
  };

const policyNumberValidator = (l: LocalizationMap, policyRx: RegExp): FieldValidator =>
  (v) => {
    if (!v) return ''
    return policyRx.test(v) ? '' : String(l['PolicyNumberFormatError']);
  };

const serviceNumberValidator = (l: LocalizationMap, serviceRx: RegExp): FieldValidator =>
  (v) => {
    if (!v) return '';
    return serviceRx.test(v) ? '' : String(l['ErrServiceNumberFormat']);
  };

// Plain decimal only, capped at (15,2) precision — up to 13 integer digits plus
// up to 2 decimal digits (15 significant digits total). Also blocks "Infinity" and
// scientific notation ("1e10"), which Number() would otherwise accept as finite/valid.
const PLAIN_DECIMAL_RX = /^\d{1,13}(\.\d{1,2})?$/;

// Optional — the user may not remember the exact price paid — but whatever is
// entered still has to be a valid, positive amount.
const purchasePriceValidator = (l: LocalizationMap): FieldValidator =>
  (v) => {
    if (!v) return '';
    if (!PLAIN_DECIMAL_RX.test(v)) return String(l['ErrPurchasePriceInvalid']);
    const amount = Number(v);
    if (amount <= 0) return String(l['ErrPurchasePriceZero']);
    return '';
  };

const claimedAmountValidator = (l: LocalizationMap): FieldValidator =>
  (v) => {
    if (!v) return String(l['ErrClaimedAmountRequired']);
    if (!PLAIN_DECIMAL_RX.test(v)) return String(l['ErrClaimedAmountInvalid']);
    const claimed = Number(v);
    if (claimed <= 0) return String(l['ErrClaimedAmountZero']);
    return '';
  };

const THIRD_PARTY_NAME_RX = /^(?=.*\p{L})[\p{L} .'-]+$/u;
const isOtherWhatWasAffected = (value: string): boolean =>
  value.trim().toLocaleUpperCase() === 'OTHER' || value.trim().toLocaleUpperCase() === 'OTH';
const thirdPartyNameValidator = (value: string, l: LocalizationMap): string => {
  if (!value) return String(l['ErrThirdPartyNameRequired']);
  if (value.length < Number(l['NameMinLength'])) return String(l['ErrThirdPartyNameTooShort']);
  if (value.length > Number(l['NameMaxLength'])) return String(l['ErrThirdPartyNameTooLong']);
  if (!THIRD_PARTY_NAME_RX.test(value)) return String(l['ErrThirdPartyNameInvalid']);
  return '';
};

const otherWhatWasAffectedValidator = (value: string, l: LocalizationMap): string => {
  if (!value) return String(l['ErrOtherWhatWasAffectedRequired']);
  if (value.length < Number(l['OtherWhatWasAffectedMinLength'])) {
    return String(l['ErrOtherWhatWasAffectedTooShort']);
  }
  if (value.length > Number(l['OtherWhatWasAffectedMaxLength'])) {
    return String(l['ErrOtherWhatWasAffectedTooLong']);
  }
  return '';
};

const liabilityClaimedAmountValidator = (value: string, l: LocalizationMap): string => {
  if (!value) return String(l['ErrLiabilityClaimedAmountRequired']);
  const amount = Number(value);
  // Covers negative and zero (and anything under a penny), not just negative —
  // previously "amount < 0" let 0 and sub-0.01 values silently pass.
  if (amount < 0.01) return String(l['ErrLiabilityClaimedAmountMinimum']);
  if (amount > Number(l['LiabilityClaimedAmountMaximum'])) {
    return String(l['ErrLiabilityClaimedAmountMaximum']);
  }
  return '';
};

// Pattern is data-driven (PropertyAddressPattern) rather than hardcoded, so the
// allowed character set can be reconfigured without a code change.
const propertyAddressValidator = (value: string, l: LocalizationMap): string => {
  if (!value) return String(l['ErrPropertyAddressRequired']);
  if (value.length < Number(l['PropertyAddressMinLength'])) return String(l['ErrPropertyAddressTooShort']);
  if (value.length > Number(l['PropertyAddressMaxLength'])) return String(l['ErrPropertyAddressTooLong']);
  const pattern = new RegExp(String(l['PropertyAddressPattern']), 'u');
  return pattern.test(value) ? '' : String(l['ErrPropertyAddressInvalid']);
};

const licenceStartDateValidator = (l: LocalizationMap): FieldValidator =>
  (v) => {
    if (!v) return String(l['ErrLicenceStartDateRequired']);
    const format = getDateFormat(l);
    if (!isValidDisplayDate(v, format)) return String(l['ErrLicenceStartDateInvalidFormat']);
    return isFutureDate(v, format) ? String(l['ErrLicenceStartDateFuture']) : '';
  };

// End date must be a future date (not today or in the past) AND strictly after the
// start date — both violations are reported with the single message requested.
const licenceEndDateValidator = (l: LocalizationMap) =>
  (endDate: string, startDate: string): string => {
    if (!endDate) return String(l['ErrLicenceEndDateRequired']);
    const format = getDateFormat(l);
    if (!isValidDisplayDate(endDate, format)) return String(l['ErrLicenceEndDateInvalidFormat']);
    if (!isFutureDate(endDate, format)) return String(l['ErrLicenceEndDateNotAfterStart']);
    if (startDate && isValidDisplayDate(startDate, format) && compareDates(endDate, startDate, format) <= 0) {
      return String(l['ErrLicenceEndDateNotAfterStart']);
    }
    return '';
  };

// Loose shape first (so non-numeric input gets the generic "invalid amount" message),
// then a stricter check to call out "too many decimal places" as its own distinct error.
const LOOSE_DECIMAL_RX = /^\d+(\.\d+)?$/;
const TWO_DECIMAL_PLACES_RX = /^\d+(\.\d{1,2})?$/;

const currencyMinValidator = (
  l: LocalizationMap,
  requiredKey: keyof LocalizationMap,
  invalidKey: keyof LocalizationMap,
  decimalPlacesKey: keyof LocalizationMap,
  belowMinimumKey: keyof LocalizationMap
): FieldValidator =>
  (v) => {
    if (!v) return String(l[requiredKey]);
    if (!LOOSE_DECIMAL_RX.test(v)) return String(l[invalidKey]);
    if (!TWO_DECIMAL_PLACES_RX.test(v)) return String(l[decimalPlacesKey]);
    return Number(v) < 0.01 ? String(l[belowMinimumKey]) : '';
  };

const monthlyLicenceFeeValidator = (l: LocalizationMap): FieldValidator =>
  currencyMinValidator(
    l,
    'ErrMonthlyLicenceFeeRequired',
    'ErrMonthlyLicenceFeeInvalid',
    'ErrMonthlyLicenceFeeDecimalPlaces',
    'ErrMonthlyLicenceFeeZero'
  );

const amountYouAreClaimingValidator = (l: LocalizationMap): FieldValidator =>
  currencyMinValidator(
    l,
    'ErrAmountYouAreClaimingRequired',
    'ErrAmountYouAreClaimingInvalid',
    'ErrAmountYouAreClaimingDecimalPlaces',
    'ErrAmountYouAreClaimingZero'
  );

// LTO's "Description" field (distinct from the itemised/PEL description fields, each
// with their own wording) — min/max length plus an allowed-character check.
const licenceDescriptionValidator = (l: LocalizationMap): FieldValidator =>
  (v) => {
    if (v.length < Number(l['LicenceDescriptionMinLength'])) return String(l['ErrLicenceDescriptionTooShort']);
    if (v.length > Number(l['LicenceDescriptionMaxLength'])) return String(l['ErrLicenceDescriptionTooLong']);
    const pattern = new RegExp(String(l['LicenceDescriptionPattern']), 'u');
    return pattern.test(v) ? '' : String(l['ErrLicenceDescriptionInvalid']);
  };

const incidentDescriptionValidator = (
  rawValue: string,
  trimmedValue: string,
  l: LocalizationMap
): string => {
  if (!trimmedValue) return String(l['ErrIncidentDescriptionRequired']);
  if (trimmedValue.length < Number(l['IncidentDescriptionMinLength'])) {
    return String(l['ErrIncidentDescriptionTooShort']);
  }
  if (rawValue.length > Number(l['ItemDescriptionMaxLength'])) {
    return String(l['ErrIncidentDescriptionTooLong']);
  }
  return '';
};

const datePurchasedValidator = (l: LocalizationMap): FieldValidator =>
  (v, fd) => {
    if (!v) return String(l['ErrDatePurchasedRequired']);
    const format = getDateFormat(l);
    if (!isValidDisplayDate(v, format)) return dateFormatError(l);
    if (isFutureDate(v, format)) return String(l['ErrDatePurchasedFuture']);
    if (fd.dateOfLoss && isValidDisplayDate(fd.dateOfLoss, format) && compareDates(v, fd.dateOfLoss, format) > 0) {
      return String(l['ErrDatePurchasedAfterLoss']).replace('{1}', fd.dateOfLoss);
    }
    return '';
  };

const theftReportedValidator = (l: LocalizationMap): FieldValidator =>
  (v, fd) => {
    if (fd.lossType === 'TH' && !v) return l['ErrTheftReportedRequired'];
    return '';
  };

const crimeReferenceValidator = (l: LocalizationMap): FieldValidator =>
  (v, fd) => {
    if (fd.lossType === 'TH' && fd.theftReported === 'Yes' && !v) return l['ErrCrimeReferenceRequired'];
    return '';
  };

// ── Related-person section validators (Spouse/Dependent/Authorised Person/Additional Details) ──
// Each field is only required when `relationship` matches the section it belongs to, so an
// unselected section never blocks submission.

const conditionalReq = (
  l: LocalizationMap,
  reqKey: keyof LocalizationMap,
  isApplicable: (fd: ClaimFormData) => boolean
): FieldValidator =>
  (v, fd) => (isApplicable(fd) && !v) ? String(l[reqKey]) : '';

const conditionalMinMax = (
  l: LocalizationMap,
  reqKey: keyof LocalizationMap,
  minKey: keyof LocalizationMap,
  maxKey: keyof LocalizationMap,
  min: number,
  max: number,
  isApplicable: (fd: ClaimFormData) => boolean
): FieldValidator =>
  (v, fd) => {
    if (!isApplicable(fd)) return '';
    if (!v) return String(l[reqKey]);
    if (v.length < min) return String(l[minKey]).replace('{1}', String(min));
    if (v.length > max) return String(l[maxKey]).replace('{1}', String(max));
    return '';
  };

const conditionalEmail = (
  l: LocalizationMap,
  emailRx: RegExp,
  isApplicable: (fd: ClaimFormData) => boolean
): FieldValidator =>
  (v, fd) => {
    if (!isApplicable(fd)) return '';
    if (!v) return String(l['ErrEmailRequired']);
    return emailRx.test(v) ? '' : String(l['ErrEmailInvalid']);
  };

const conditionalPhone = (
  l: LocalizationMap,
  phoneRx: RegExp,
  phoneLen: number | string,
  isApplicable: (fd: ClaimFormData) => boolean
): FieldValidator =>
  (v, fd) => {
    if (!isApplicable(fd)) return '';
    if (!v) return String(l['ErrPhoneRequired']);
    return phoneRx.test(v) ? '' : String(l['ErrPhoneFormat']).replace('{1}', String(phoneLen));
  };

// Spouse/Dependent phone numbers aren't required, but if one is entered it must
// still match the same format as the main Phone Number field.
const optionalPhoneFormat = (
  l: LocalizationMap,
  phoneRx: RegExp,
  phoneLen: number | string
): FieldValidator =>
  (v) => {
    if (!v) return '';
    return phoneRx.test(v) ? '' : String(l['ErrPhoneFormat']).replace('{1}', String(phoneLen));
  };

const dependentDateOfBirthValidator = (l: LocalizationMap): FieldValidator =>
  (v, fd) => {
    if (fd.relationship !== 'DP') return '';
    if (!v) return String(l['ErrDateOfBirthRequired']);
    const format = getDateFormat(l);
    if (!isValidDisplayDate(v, format)) return dateFormatError(l);
    if (isFutureDate(v, format)) return String(l['ErrDateOfBirthFuture']);
    return isAtLeastAge(v, 18, format) ? '' : String(l['ErrDependentDateOfBirthUnder18']);
  };

const isSpouse = (fd: ClaimFormData) => fd.relationship === 'SP';
const isDependent = (fd: ClaimFormData) => fd.relationship === 'DP';
const isAuthorisedPerson = (fd: ClaimFormData) => fd.relationship === 'AP';
const isOtherRelationship = (fd: ClaimFormData) => fd.relationship === 'OTH';
const isOnDeployment = (fd: ClaimFormData) => fd.lossLocationType === 'ODE';
const isNotPolicyholder = (fd: ClaimFormData) =>
  isSpouse(fd) || isDependent(fd) || isAuthorisedPerson(fd) || isOtherRelationship(fd);

const authorisationConfirmationValidator = (l: LocalizationMap): FieldValidator =>
  (_v, fd) => (isNotPolicyholder(fd) && !fd.authorisationConfirmed)
    ? String(l['ErrAuthorisationConfirmationRequired'])
    : '';

// ── Per-cover-type item validators (kept separate so validateItems' own branching
// stays flat — each of these carries its own, unshared nesting/complexity) ──

const validatePersonalLiabilityItem = (
  item: ClaimItem,
  l: LocalizationMap
): Record<string, string> => {
  const errors: Record<string, string> = {};
  const thirdPartyName = item.thirdPartyName?.trim() ?? '';
  const whatWasAffected = item.whatWasAffected?.trim() ?? '';
  const otherWhatWasAffected = item.otherWhatWasAffected?.trim() ?? '';
  const haveYouAdmittedLiability = item.haveYouAdmittedLiability?.trim() ?? '';
  const claimedAmount = item.claimedAmount?.trim() ?? '';
  const rawItemDescription = item.itemDescription ?? '';
  const itemDescription = rawItemDescription.trim();

  const thirdPartyNameError = thirdPartyNameValidator(thirdPartyName, l);
  if (thirdPartyNameError) errors.thirdPartyName = thirdPartyNameError;

  if (!whatWasAffected) {
    errors.whatWasAffected = String(l['ErrWhatWasAffectedRequired']);
  }
  if (isOtherWhatWasAffected(whatWasAffected)) {
    const otherAffectedError = otherWhatWasAffectedValidator(otherWhatWasAffected, l);
    if (otherAffectedError) errors.otherWhatWasAffected = otherAffectedError;
  }
  if (haveYouAdmittedLiability !== 'Yes' && haveYouAdmittedLiability !== 'No') {
    errors.haveYouAdmittedLiability = String(l['ErrHaveYouAdmittedLiabilityRequired']);
  }

  const claimedError = liabilityClaimedAmountValidator(claimedAmount, l);
  if (claimedError) errors.claimedAmount = claimedError;

  const descError = incidentDescriptionValidator(rawItemDescription, itemDescription, l);
  if (descError) errors.itemDescription = descError;

  return errors;
};

const validateLicenceToOccupyItem = (
  item: ClaimItem,
  formData: ClaimFormData,
  l: LocalizationMap
): Record<string, string> => {
  const errors: Record<string, string> = {};
  const propertyAddress = item.propertyAddress?.trim() ?? '';
  const licenceStartDate = item.licenceStartDate?.trim() ?? '';
  const licenceEndDate = item.licenceEndDate?.trim() ?? '';
  const monthlyLicenceFee = item.monthlyLicenceFee?.trim() ?? '';
  const claimedAmount = item.claimedAmount?.trim() ?? '';
  const whyUnableToUseProperty = item.whyUnableToUseProperty?.trim() ?? '';
  const itemDescription = (item.itemDescription ?? '').trim();

  const addressError = propertyAddressValidator(propertyAddress, l);
  if (addressError) errors.propertyAddress = addressError;

  const startDateError = licenceStartDateValidator(l)(licenceStartDate, formData);
  if (startDateError) errors.licenceStartDate = startDateError;

  const endDateError = licenceEndDateValidator(l)(licenceEndDate, licenceStartDate);
  if (endDateError) errors.licenceEndDate = endDateError;

  const feeError = monthlyLicenceFeeValidator(l)(monthlyLicenceFee, formData);
  if (feeError) errors.monthlyLicenceFee = feeError;

  const claimingError = amountYouAreClaimingValidator(l)(claimedAmount, formData);
  if (claimingError) errors.claimedAmount = claimingError;

  // The two checkbox groups share one comma-separated model field (each entry
  // namespaced "<category>:<code>" — see reasonStorageKey in NonItemisedCoverFields)
  // but are validated independently, each needing at least one selection.
  const selectedReasons = whyUnableToUseProperty ? whyUnableToUseProperty.split(',').filter(Boolean) : [];
  const hasWhatHappenedReason = selectedReasons.some(
    reason => reason.startsWith(`${LIST_CATEGORIES.WHAT_HAPPENED_TYPE}:`)
  );
  const hasPropertyImpactReason = selectedReasons.some(
    reason => reason.startsWith(`${LIST_CATEGORIES.PROPERTY_IMPACT_TYPE}:`)
  );
  if (!hasWhatHappenedReason) {
    errors.whatHappenedReasons = String(l['ErrWhatHappenedReasonsRequired']);
  }
  if (!hasPropertyImpactReason) {
    errors.propertyImpactReasons = String(l['ErrPropertyImpactReasonsRequired']);
  }

  const descError = licenceDescriptionValidator(l)(itemDescription, formData);
  if (descError) errors.itemDescription = descError;

  return errors;
};

const validateItemisedItem = (
  item: ClaimItem,
  formData: ClaimFormData,
  l: LocalizationMap
): Record<string, string> => {
  const errors: Record<string, string> = {};
  const itemType = item.itemType?.trim() ?? '';
  const purchasePrice = item.purchasePrice?.trim() ?? '';
  const claimedAmount = item.claimedAmount?.trim() ?? '';
  const itemDescription = (item.itemDescription ?? '').trim();
  const datePurchased = item.datePurchased?.trim() ?? '';

  if (!itemType) {
    errors.itemType = String(l['ErrItemTypeRequired']);
  }

  const purchaseError = purchasePriceValidator(l)(purchasePrice, formData);
  if (purchaseError) errors.purchasePrice = purchaseError;

  const claimedError = claimedAmountValidator(l)(claimedAmount, formData);
  if (claimedError) errors.claimedAmount = claimedError;

  const descError = minMax(
    l,
    'ErrItemDescriptionRequired',
    'ErrItemDescriptionTooShort',
    'ErrItemDescriptionTooLong',
    l['ItemDescriptionMinLength'],
    l['ItemDescriptionMaxLength']
  )(itemDescription, formData);
  if (descError) errors.itemDescription = descError;

  const dateError = datePurchasedValidator(l)(datePurchased, formData);
  if (dateError) errors.datePurchased = dateError;

  return errors;
};

export const validateItems = (
  items: ClaimItem[],
  formData: ClaimFormData,
  l: LocalizationMap
) => {
  const itemErrors: Array<Record<string, string>> = [];

  items.forEach((item, index) => {
    const itemCoverType = item.itemCoverType?.trim() ?? '';
    const errors: Record<string, string> = {};

    if (!itemCoverType) {
      errors.itemCoverType = String(l['ErrItemCoverTypeRequired']);
    } else if (itemCoverType === 'PEL') {
      Object.assign(errors, validatePersonalLiabilityItem(item, l));
    } else if (itemCoverType === 'LTO') {
      Object.assign(errors, validateLicenceToOccupyItem(item, formData, l));
    } else {
      Object.assign(errors, validateItemisedItem(item, formData, l));
    }

    itemErrors[index] = errors;
  });

  return itemErrors;
};

// ── Assembles the validator map; complexity is low because all logic lives in the factories above ──

const buildValidators = (l: LocalizationMap): Partial<Record<keyof ClaimFormData, FieldValidator>> => {
  if (l === _cachedL && _cachedValidators) return _cachedValidators;
  _cachedL = l;

  

  const emailRx   = new RegExp(String(l['EmailPattern']));
  const serviceRx = new RegExp(String(l['ServiceNumberPattern']));
  const policyRx  = new RegExp(String(l['PolicyNumberPattern']));
  const phoneLen  = l['PhoneLength'];
  const phoneRx   = new RegExp(`^0\\d{${Number(phoneLen) - 1}}$`);
  const postal    = postalCodeFactory(l);

  _cachedValidators = {
    firstName:            minMax(l, 'ErrFirstNameRequired', 'ErrFNTooShort', 'ErrFNTooLong', l['NameMinLength'], l['NameMaxLength']),
    lastName:             minMax(l, 'ErrLastNameRequired', 'ErrLNTooShort', 'ErrLNTooLong', l['NameMinLength'], l['NameMaxLength']),
    policyNumber:         policyNumberValidator(l, policyRx),
    serviceNumber:        serviceNumberValidator(l, serviceRx),
    relationship:         req(l, 'ErrRelationshipRequired'),
    dateOfLoss:           notFuture(l, 'ErrDateOfLossRequired', 'ErrDateOfLossFuture'),
    lossType:             req(l, 'ErrLossTypeRequired'),
    lossCountry:          req(l, 'ErrCountryRequired'),
    deploymentCountry:    conditionalReq(l, 'ErrDeploymentCountryRequired', isOnDeployment),
    lossAddressLine1:     minMax(l, 'ErrAddressLine1Required', 'ErrAddressLine1TooShort', 'ErrAddressLine1TooLong', l['AddressLine1MinLength'], l['AddressLine1MaxLength']),
    lossAddressLine2:     optionalMaxLength(l, 'ErrAddressLine2TooLong', l['AddressLine2MaxLength']),
    lossCity:             minMax(l, 'ErrCityRequired', 'ErrCityTooShort', 'ErrCityTooLong', l['CityMinLength'], l['CityMaxLength']),
    lossPostalCode:       (v, fd) => postal(fd.lossCountry)(v),
    description:          minMax(l, 'ErrDescriptionRequired', 'ErrDescriptionTooShort', 'ErrDescriptionTooLong', l['DescriptionMinLength'], l['DescriptionMaxLength']),
    policyCountry:        req(l, 'ErrCountryRequired'),
    policyAddressLine1:   minMax(l, 'ErrAddressLine1Required', 'ErrAddressLine1TooShort', 'ErrAddressLine1TooLong', l['AddressLine1MinLength'], l['AddressLine1MaxLength']),
    policyAddressLine2:   optionalMaxLength(l, 'ErrAddressLine2TooLong', l['AddressLine2MaxLength']),
    policyCity:           minMax(l, 'ErrCityRequired', 'ErrCityTooShort', 'ErrCityTooLong', l['CityMinLength'], l['CityMaxLength']),
    policyPostalCode:     (v, fd) => postal(fd.policyCountry)(v),
    schemeOrProduct:      req(l, 'ErrProductRequired'),
    theftReported:        theftReportedValidator(l),
    crimeReferenceNumber: crimeReferenceValidator(l),
    email:                emailValidator(l, emailRx),
    phoneNumber:          phoneValidator(l, phoneRx, phoneLen),
    authorisationConfirmed: authorisationConfirmationValidator(l),

    spouseFirstName:      conditionalMinMax(l, 'ErrFirstNameRequired', 'ErrFNTooShort', 'ErrFNTooLong', l['NameMinLength'], l['NameMaxLength'], isSpouse),
    spouseLastName:       conditionalMinMax(l, 'ErrLastNameRequired', 'ErrLNTooShort', 'ErrLNTooLong', l['NameMinLength'], l['NameMaxLength'], isSpouse),
    spouseEmail:          conditionalEmail(l, emailRx, isSpouse),
    spousePhoneNumber:    optionalPhoneFormat(l, phoneRx, phoneLen),

    dependentFirstName:   conditionalMinMax(l, 'ErrFirstNameRequired', 'ErrFNTooShort', 'ErrFNTooLong', l['NameMinLength'], l['NameMaxLength'], isDependent),
    dependentLastName:    conditionalMinMax(l, 'ErrLastNameRequired', 'ErrLNTooShort', 'ErrLNTooLong', l['NameMinLength'], l['NameMaxLength'], isDependent),
    dependentDateOfBirth: dependentDateOfBirthValidator(l),
    dependentRelationship: conditionalReq(l, 'ErrDependentRelationshipRequired', isDependent),
    dependentEmail:       conditionalEmail(l, emailRx, isDependent),
    dependentPhoneNumber: optionalPhoneFormat(l, phoneRx, phoneLen),

    authorisedFirstName:  conditionalMinMax(l, 'ErrFirstNameRequired', 'ErrFNTooShort', 'ErrFNTooLong', l['NameMinLength'], l['NameMaxLength'], isAuthorisedPerson),
    authorisedLastName:   conditionalMinMax(l, 'ErrLastNameRequired', 'ErrLNTooShort', 'ErrLNTooLong', l['NameMinLength'], l['NameMaxLength'], isAuthorisedPerson),
    authorisedEmail:      conditionalEmail(l, emailRx, isAuthorisedPerson),
    authorisedPhoneNumber: conditionalPhone(l, phoneRx, phoneLen, isAuthorisedPerson),

    otherRelationshipDescription: conditionalReq(l, 'ErrOtherRelationshipDescriptionRequired', isOtherRelationship),
    otherPersonFirstName: conditionalMinMax(l, 'ErrFirstNameRequired', 'ErrFNTooShort', 'ErrFNTooLong', l['NameMinLength'], l['NameMaxLength'], isOtherRelationship),
    otherPersonLastName:  conditionalMinMax(l, 'ErrLastNameRequired', 'ErrLNTooShort', 'ErrLNTooLong', l['NameMinLength'], l['NameMaxLength'], isOtherRelationship),
    otherPersonEmail:     conditionalEmail(l, emailRx, isOtherRelationship),
    otherPersonPhoneNumber: conditionalPhone(l, phoneRx, phoneLen, isOtherRelationship),
  };
  return _cachedValidators!;
};

const STEP_FIELDS: Record<number, (keyof ClaimFormData)[]> = {
  1: [
    'firstName', 'lastName', 'email', 'phoneNumber', 'policyNumber', 'serviceNumber',
    'relationship', 'schemeOrProduct',
    'policyCountry', 'policyAddressLine1', 'policyAddressLine2', 'policyCity', 'policyPostalCode',
    'spouseFirstName', 'spouseLastName', 'spouseEmail', 'spousePhoneNumber',
    'dependentFirstName', 'dependentLastName', 'dependentDateOfBirth', 'dependentRelationship', 'dependentEmail', 'dependentPhoneNumber',
    'authorisedFirstName', 'authorisedLastName', 'authorisedEmail', 'authorisedPhoneNumber',
    'otherRelationshipDescription', 'otherPersonFirstName', 'otherPersonLastName',
    'otherPersonEmail', 'otherPersonPhoneNumber', 'authorisationConfirmed'
  ],
  2: ['dateOfLoss', 'lossType', 'description']
  // Step 3 is handled by getItemsStepErrors (not STEP_FIELDS).
  // Step 4 evidence doc-type checks live in handleNext via attachmentErrors — no flat field validators.
};

export const getClaimFieldValidationError = (
  field: keyof ClaimFormData,
  formData: ClaimFormData,
  l: LocalizationMap
): string => {
  const validators = buildValidators(l);
  const validator = validators[field];
  if (!validator) return '';
  const value = typeof formData[field] === 'string' ? (formData[field] as string).trim() : '';
  return validator(value, formData);
};

// ✅ Step 3: at least one item required, then per-item validation
const getItemsStepErrors = (formData: ClaimFormData, l: LocalizationMap): ClaimFormErrors => {
  if (!formData.items || formData.items.length === 0) {
    return {
      items: String(l['ErrAtLeastOneItem'])
    };
  }

  const itemErrors = validateItems(formData.items, formData, l);
  const hasErrors = itemErrors.some(item => Object.keys(item).length > 0);
  if (!hasErrors) return {};

  return {
    // @ts-ignore
    items: itemErrors
  };
};

// Loss address fields, only required when lossLocationType === 'DL'
const getLossLocationErrors = (formData: ClaimFormData, l: LocalizationMap): ClaimFormErrors => {
  const errors: ClaimFormErrors = {};

  const lossCountryErr = getClaimFieldValidationError('lossCountry', formData, l);
  if (lossCountryErr) errors.lossCountry = lossCountryErr;

  const lossAddressLine1Err = getClaimFieldValidationError('lossAddressLine1', formData, l);
  if (lossAddressLine1Err) errors.lossAddressLine1 = lossAddressLine1Err;

  const lossAddressLine2Err = getClaimFieldValidationError('lossAddressLine2', formData, l);
  if (lossAddressLine2Err) errors.lossAddressLine2 = lossAddressLine2Err;

  const lossCityErr = getClaimFieldValidationError('lossCity', formData, l);
  if (lossCityErr) errors.lossCity = lossCityErr;

  const lossPostalCodeErr = getClaimFieldValidationError('lossPostalCode', formData, l);
  if (lossPostalCodeErr) errors.lossPostalCode = lossPostalCodeErr;

  return errors;
};

// ✅ Step 2: loss type / theft / location-specific requirements
const getWhatHappenedStepErrors = (formData: ClaimFormData, l: LocalizationMap): ClaimFormErrors => {
  const errors: ClaimFormErrors = {};

  if (!formData.lossType) {
    errors.lossType = l['ErrLossTypeRequired'];
  }
  if (formData.lossType === 'OTH' && !formData.otherLossType) {
    errors.otherLossType = l['ErrOtherLossTypeRequired'];
  }
  if (formData.lossType === 'TH') {
    if (!formData.theftReported) errors.theftReported = l['ErrTheftReportedRequired'];
    if (formData.theftReported === 'Yes' && !formData.crimeReferenceNumber) {
      errors.crimeReferenceNumber = l['ErrCrimeReferenceRequired'];
    }
  }
  if (!formData.lossLocationType) {
    errors.lossLocationType = l['ErrFieldRequired'];
  }
  if (formData.lossLocationType === 'DL') {
    Object.assign(errors, getLossLocationErrors(formData, l));
  }
  if (formData.lossLocationType === 'ODE') {
    const deploymentCountryErr = getClaimFieldValidationError('deploymentCountry', formData, l);
    if (deploymentCountryErr) errors.deploymentCountry = deploymentCountryErr;
  }

  return errors;
};

export const getStepValidationErrors = (
  step: number,
  formData: ClaimFormData,
  l: LocalizationMap
): ClaimFormErrors => {
  if (step === 3) return getItemsStepErrors(formData, l);

  const errors: ClaimFormErrors = {};
  const fields = STEP_FIELDS[step] ?? [];

  fields.forEach(field => {
    const fieldError = getClaimFieldValidationError(field, formData, l);
    if (fieldError) errors[field] = fieldError;
  });

  if (step === 2) {
    Object.assign(errors, getWhatHappenedStepErrors(formData, l));
  }

  return errors;
};

export const getClaimFormValidationErrors = (
  formData: ClaimFormData,
  l: LocalizationMap
): ClaimFormErrors => {
  const errors: ClaimFormErrors = {};
  // Steps 1–3 only. Step 4 has no flat field validators (doc-type is enforced in handleNext).
  [1, 2, 3].forEach(step => {
    Object.assign(errors, getStepValidationErrors(step, formData, l));
  });
  return errors;
};

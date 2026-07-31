import type { ClaimFormData, ClaimFormErrors } from '../types';
import type { LocalizationMap } from './useLocalization';
import type { ClaimItem } from '../types';
import {
  compareDates,
  getDateFormat,
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

// Strict UK-style format (leading 0, fixed length) is only meaningful for a UK phone
// number — other countries have their own numbering plans, so only presence is checked.
const isUKPhone = (fd: ClaimFormData) => fd.policyCountry === 'GB';

const phoneValidator = (l: LocalizationMap, phoneRx: RegExp, phoneLen: number | string): FieldValidator =>
  (v, fd) => {
    if (!v) return String(l['ErrPhoneRequired']);
    if (!isUKPhone(fd)) return '';
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

const purchasePriceValidator = (l: LocalizationMap): FieldValidator =>
  (v) => {
    if(!v) return String(l['ErrPurchasePriceRequired']);
    if (!PLAIN_DECIMAL_RX.test(v)) return String(l['ErrPurchasePriceInvalid']);
    const amount = Number(v);
    if (amount <= 0) return String(l['ErrPurchasePriceZero']);
    return '';
  };

const claimedAmountValidator = (l: LocalizationMap): FieldValidator =>
  (v, fd) => {
    if (!v) return String(l['ErrClaimedAmountRequired']);
    if (!PLAIN_DECIMAL_RX.test(v)) return String(l['ErrClaimedAmountInvalid']);
    const claimed = Number(v);
    if (claimed <= 0) return String(l['ErrClaimedAmountZero']);
    // @ts-ignore — purchasePrice is injected by validateItems via a spread+cast, not part of ClaimFormData
    const rawPurchasePrice = String(fd.purchasePrice ?? '');
    if (PLAIN_DECIMAL_RX.test(rawPurchasePrice) && claimed > Number(rawPurchasePrice)) {
      return String(l['ErrClaimedAmountExceedsPurchase']);
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
    if (!isUKPhone(fd)) return '';
    return phoneRx.test(v) ? '' : String(l['ErrPhoneFormat']).replace('{1}', String(phoneLen));
  };

// Spouse/Dependent phone numbers aren't required, but if one is entered on a UK policy
// it must still match the same format as the main Phone Number field.
const optionalPhoneFormat = (
  l: LocalizationMap,
  phoneRx: RegExp,
  phoneLen: number | string
): FieldValidator =>
  (v, fd) => {
    if (!v) return '';
    if (!isUKPhone(fd)) return '';
    return phoneRx.test(v) ? '' : String(l['ErrPhoneFormat']).replace('{1}', String(phoneLen));
  };

// Spouse/Dependent email isn't required, but if one is entered it must still be a
// well-formed email address.
const optionalEmailFormat = (l: LocalizationMap, emailRx: RegExp): FieldValidator =>
  (v) => {
    if (!v) return '';
    return emailRx.test(v) ? '' : String(l['ErrEmailInvalid']);
  };

const dependentDateOfBirthValidator = (l: LocalizationMap): FieldValidator =>
  (v, fd) => {
    if (fd.relationship !== 'DP') return '';
    if (!v) return String(l['ErrDateOfBirthRequired']);
    const format = getDateFormat(l);
    if (!isValidDisplayDate(v, format)) return dateFormatError(l);
    return isFutureDate(v, format) ? String(l['ErrDateOfBirthFuture']) : '';
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


export const validateItems = (
  items: ClaimItem[],
  formData: ClaimFormData,
  l: LocalizationMap
) => {
  const itemErrors: Array<Record<string, string>> = [];

  items.forEach((item, index) => {
    const errors: Record<string, string> = {};

    // Trim so whitespace-only input (e.g. a description of just spaces) can't
    // slip past the required/min-length checks below.
    const itemCoverType = item.itemCoverType?.trim() ?? '';
    const itemType = item.itemType?.trim() ?? '';
    const purchasePrice = item.purchasePrice?.trim() ?? '';
    const claimedAmount = item.claimedAmount?.trim() ?? '';
    const itemDescription = item.itemDescription?.trim() ?? '';
    const datePurchased = item.datePurchased?.trim() ?? '';

    // ✅ REQUIRED FIELDS
    if (!itemCoverType) {
      errors.itemCoverType = String(l['ErrItemCoverTypeRequired']);
    }

    if (!itemType) {
      errors.itemType = String(l['ErrItemTypeRequired']);
    }

    // ✅ PURCHASE PRICE
    const purchaseError = purchasePriceValidator(l)(purchasePrice, formData);
    if (purchaseError) errors.purchasePrice = purchaseError;

    // ✅ CLAIMED AMOUNT (important: compare with item's purchase price)
    const claimedError = claimedAmountValidator(l)(
      claimedAmount,
      { ...formData, purchasePrice } as ClaimFormData

    );
    if (claimedError) errors.claimedAmount = claimedError;

    // ✅ DESCRIPTION
    const descError = minMax(
      l,
      'ErrItemDescriptionRequired',
      'ErrItemDescriptionTooShort',
      'ErrItemDescriptionTooLong',
      l['ItemDescriptionMinLength'],
      l['ItemDescriptionMaxLength']
    )(itemDescription, formData);
    if (descError) errors.itemDescription = descError;

    // ✅ DATE
    const dateError = datePurchasedValidator(l)(datePurchased, formData);
    if (dateError) errors.datePurchased = dateError;

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
    spouseEmail:          optionalEmailFormat(l, emailRx),
    spousePhoneNumber:    optionalPhoneFormat(l, phoneRx, phoneLen),

    dependentFirstName:   conditionalMinMax(l, 'ErrFirstNameRequired', 'ErrFNTooShort', 'ErrFNTooLong', l['NameMinLength'], l['NameMaxLength'], isDependent),
    dependentLastName:    conditionalMinMax(l, 'ErrLastNameRequired', 'ErrLNTooShort', 'ErrLNTooLong', l['NameMinLength'], l['NameMaxLength'], isDependent),
    dependentDateOfBirth: dependentDateOfBirthValidator(l),
    dependentRelationship: conditionalReq(l, 'ErrDependentRelationshipRequired', isDependent),
    dependentEmail:       optionalEmailFormat(l, emailRx),
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

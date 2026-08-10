export interface UploadedAttachment {
  id: string;
  name: string;
  size: number; // bytes
  docType: string;
  docTypeLabel?: string;
}

export interface ClaimItem {
  id: string;
  itemCoverType: string;
  itemType: string;
  datePurchased: string;
  itemDescription: string;
  purchasePrice: string;
  claimedAmount: string;
  otherItemType?: string;
}

export interface ClaimFormData {
  // Step 1: Your Details
  firstName: string;
  otherLossType?: string;
  lossLocationType: string
  relationship: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  policyNumber: string;
  serviceNumber: string;
  schemeOrProduct: string;

  // Step 1: Related person details — shown conditionally based on `relationship`
  spouseFirstName?: string;
  spouseLastName?: string;
  spouseEmail?: string;
  spousePhoneNumber?: string;

  dependentFirstName?: string;
  dependentLastName?: string;
  dependentDateOfBirth?: string;
  dependentRelationship?: string;
  dependentEmail?: string;
  dependentPhoneNumber?: string;

  authorisedFirstName?: string;
  authorisedLastName?: string;
  authorisedEmail?: string;
  authorisedPhoneNumber?: string;

  otherRelationshipDescription?: string;
  otherPersonFirstName?: string;
  otherPersonLastName?: string;
  otherPersonEmail?: string;
  otherPersonPhoneNumber?: string;

  // Required confirmation when `relationship` is anyone other than the policyholder
  authorisationConfirmed: boolean;

  // Step 2: What Happened
  dateOfLoss: string;
  theftReported?: string;
  crimeReferenceNumber?: string;

  lossType: string;
  lossCountry: string;
  lossAddressLine1: string;
  lossAddressLine2: string;
  lossCity: string;
  lossPostalCode: string;
  description: string;
  // Shown when lossLocationType === 'ODE' (on deployment or exercise)
  deploymentCountry?: string;
  deploymentLocationName?: string;

  // Step 3: Items Affected
  items: ClaimItem[];
  policyCountry: string;
  policyAddressLine1: string;
  policyAddressLine2: string;
  policyCity: string;
  policyPostalCode: string;

  // Step 4: Supporting Evidence
  attachments: UploadedAttachment[];

  // Step 5: Review declarations
  declarationConsent: boolean;
}

export type ClaimFormErrors = Partial<Record<keyof ClaimFormData, string>>;

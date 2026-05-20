export interface UploadedAttachment {
  id: string;
  name: string;
  size: number; // bytes
  docType: string;
}

export interface ClaimFormData {
  // Step 1: Your Details
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  policyNumber: string;
  membershipNumber: string;
  serviceNumber: string;
  schemeOrProduct: string;

  // Step 2: What Happened
  relationship: string;
  dateOfLoss: string;
  lossType: string;
  causeOfLoss: string;
  lossCountry: string;
  lossAddressLine1: string;
  lossAddressLine2: string;
  lossCity: string;
  lossPostalCode: string;
  description: string;

  // Step 3: Items Affected
  itemType: string;
  itemDescription: string;
  purchasePrice: string;
  claimedAmount: string;
  policyCountry: string;
  policyAddressLine1: string;
  policyAddressLine2: string;
  policyCity: string;
  policyPostalCode: string;

  // Step 4: Supporting Evidence
  hasUserConfirmed: boolean;
  attachments: UploadedAttachment[];
}

export type ClaimFormErrors = Partial<Record<keyof ClaimFormData, string>>;

export interface FormStyleConfig {
  styleVariant: 'theme' | 'persona';
  styleMode: string;
}

import type { ClaimFormData } from '../types';
import { extractPegaErrorMessage } from './pegaErrorUtils';
import type { LocalizationMap } from './useLocalization';
import { getDateFormat, toIsoDate } from './dateUtils';

interface ClaimCaseOptions {
  /** Path for PCore.getRestClient().invokeCustomRestApi (e.g. api/TrinityClaims/v1/create). */
  createClaimApiPath: string;
  caseTypeID: string;
  formData: ClaimFormData;
  l: LocalizationMap;
}

interface ClaimCaseResponse {
  ID?: string;
  success: boolean;
  message?: string;
}

/** A real Pega case ID contains a hyphen followed by its case number (e.g. "...WORK T-1023"). */
export const isValidCaseId = (caseId: string): boolean => /-\d+/.test(caseId);

const buildLossAddress = (formData: ClaimFormData): Record<string, string> => {
  if (formData.lossLocationType === 'ODE') {
    // On deployment/exercise: only the selected country + optional base/location name.
    return {
      BaseLocation: formData.deploymentLocationName || '',
      pyCountry: formData.deploymentCountry || ''
    };
  }

  const isPHA = formData.lossLocationType === 'PHA';
  return {
    pyCity: isPHA ? formData.policyCity : formData.lossCity,
    pyCountry: isPHA ? formData.policyCountry : formData.lossCountry,
    pyPostalCode: isPHA ? formData.policyPostalCode : formData.lossPostalCode,
    pyStreetAddress: isPHA ? formData.policyAddressLine1 : formData.lossAddressLine1,
    pyStreetAddress2: isPHA ? formData.policyAddressLine2 : formData.lossAddressLine2
  };
};

export const createClaimCase = async ({
  createClaimApiPath,
  caseTypeID,
  formData,
  l
}: ClaimCaseOptions): Promise<ClaimCaseResponse> => {
  try {
    const apiPath = createClaimApiPath.trim();
    if (!apiPath) {
      return {
        success: false,
        message: String(l['ErrCreateClaimApiPathMissing'])
      };
    }

    const lossAddress = buildLossAddress(formData);
    const dateFormat = getDateFormat(l);
    const toApiDate = (value: string | undefined): string => {
      if (!value) return '';
      return toIsoDate(value, dateFormat) || value;
    };

    // The policyholder's own contact details + their real policy address — sent as
    // PolicyHolder on every claim, and also as UserDetails when they are the claimant.
    const policyHolderDetails = {
      EmailAddress: formData.email,
      FirstName: formData.firstName,
      LastName: formData.lastName,
      PhoneNumber: formData.phoneNumber,
      PolicyAddress: {
        pyCity: formData.policyCity,
        pyCountry: formData.policyCountry,
        pyPostalCode: formData.policyPostalCode,
        pyStreetAddress: formData.policyAddressLine1,
        pyStreetAddress2: formData.policyAddressLine2
      }
    };

    // When someone other than the policyholder is claiming, UserDetails holds that
    // person's own details instead, with no policy address of their own.
    const blankPolicyAddress = {
      pyCity: '',
      pyCountry: '',
      pyPostalCode: '',
      pyStreetAddress: '',
      pyStreetAddress2: ''
    };

    let userDetails: Record<string, unknown> = policyHolderDetails;
    let otherRelationship = '';

    if (formData.relationship === 'SP') {
      userDetails = {
        EmailAddress: formData.spouseEmail || '',
        FirstName: formData.spouseFirstName || '',
        LastName: formData.spouseLastName || '',
        PhoneNumber: formData.spousePhoneNumber || '',
        PolicyAddress: blankPolicyAddress
      };
    } else if (formData.relationship === 'DP') {
      userDetails = {
        EmailAddress: formData.dependentEmail || '',
        FirstName: formData.dependentFirstName || '',
        LastName: formData.dependentLastName || '',
        PhoneNumber: formData.dependentPhoneNumber || '',
        DateOfBirth: toApiDate(formData.dependentDateOfBirth),
        PolicyAddress: blankPolicyAddress
      };
      otherRelationship = formData.dependentRelationship || '';
    } else if (formData.relationship === 'AP') {
      userDetails = {
        EmailAddress: formData.authorisedEmail || '',
        FirstName: formData.authorisedFirstName || '',
        LastName: formData.authorisedLastName || '',
        PhoneNumber: formData.authorisedPhoneNumber || '',
        PolicyAddress: blankPolicyAddress
      };
    } else if (formData.relationship === 'OTH') {
      userDetails = {
        EmailAddress: formData.otherPersonEmail || '',
        FirstName: formData.otherPersonFirstName || '',
        LastName: formData.otherPersonLastName || '',
        PhoneNumber: formData.otherPersonPhoneNumber || '',
        PolicyAddress: blankPolicyAddress
      };
      otherRelationship = formData.otherRelationshipDescription || '';
    }

    userDetails = {
      ...userDetails,
      AuthorisationConfirmation: String(formData.authorisationConfirmed)
    };

    const requestBody = {
      caseTypeID,
      content: 
      {
        CreationSource: "WebForm",
        PolicyNumber: formData.policyNumber,
        DeclarationConsent: formData.declarationConsent,
        Product: formData.schemeOrProduct,
        ServiceNumber: formData.serviceNumber,
        RelationshipWithPolicyHolder: formData.relationship,
        OtherRelationship: otherRelationship,
        UserDetails: userDetails,
        PolicyHolder: policyHolderDetails,
        ClaimInfo: {
          CrimeReferenceNumber: formData.crimeReferenceNumber,
          IsTheftReportedToPolice: formData.theftReported,
          LossDate: toApiDate(formData.dateOfLoss),
          LossDescription: formData.description,
          LossType: formData.lossType,
          OtherLossType: formData.otherLossType,
          WhereDidThisHappen: formData.lossLocationType,
          LossAddress: lossAddress
        },
        ItemsAffected: formData.items.map(item => ({
            ItemCoverType: item.itemCoverType,
            ClaimAmount: item.claimedAmount,
            Description: item.itemDescription,
            ItemType: item.itemType,
            PurchaseDate: toApiDate(item.datePurchased),
            PurchasePrice: item.purchasePrice,
            OtherItemType: item.otherItemType
        }))
      }
    };

    const response = await (window as any).PCore.getRestClient().invokeCustomRestApi(apiPath, {
      method: 'POST',
      body: requestBody
    });

    const caseId = response.data?.ID != null ? String(response.data.ID) : '';
    if (!isValidCaseId(caseId)) {
      return {
        success: false,
        ID: caseId || undefined,
        message: String(l['ErrInvalidCaseIdReturned'])
      };
    }

    return {
      success: true,
      ID: caseId,
      message: String(l['MsgClaimCaseCreatedSuccess'])
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: extractPegaErrorMessage(error, String(l['ErrCaseCreationFailed']))
    };
  }
};

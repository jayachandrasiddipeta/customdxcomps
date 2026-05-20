import type { ClaimFormData } from '../types';
import { fetchClientPublicIp } from './clientIpUtils';
import { extractPegaErrorMessage } from './pegaErrorUtils';

interface ClaimCaseOptions {
  /** Path for PCore.getRestClient().invokeCustomRestApi (e.g. api/TrinityClaims/v1/create). */
  createClaimApiPath: string;
  caseTypeID: string;
  formData: ClaimFormData;
  turnstileToken?: string;
}

interface ClaimCaseResponse {
  ID?: string;
  success: boolean;
  message?: string;
}

export const createClaimCase = async ({
  createClaimApiPath,
  caseTypeID,
  formData,
  turnstileToken
}: ClaimCaseOptions): Promise<ClaimCaseResponse> => {
  try {
    const apiPath = createClaimApiPath.trim();
    if (!apiPath) {
      return {
        success: false,
        message: 'Create claim API path is not configured.'
      };
    }

    const remoteIp = await fetchClientPublicIp();

    const requestBody = {
      caseTypeID,
      content: {
        FirstName: formData.firstName,
        LastName: formData.lastName,
        ClaimantName: `${formData.firstName} ${formData.lastName}`,
        ContactEmail: formData.email,
        ContactNumber: formData.phoneNumber,
        PolicyNumber: formData.policyNumber,
        MembershipNumber: formData.membershipNumber,
        ServiceNumber: formData.serviceNumber,
        Scheme: formData.schemeOrProduct,
        HasUserConfirmed: formData.hasUserConfirmed,
        IsExternalCreation: true
      }
    };

    const response = await (window as any).PCore.getRestClient().invokeCustomRestApi(apiPath, {
      method: 'POST',
      body: requestBody,
      headers: {
        'Access-Control-Allow-Origin': '*',
        ...(turnstileToken ? { 'X-CF-Turnstile-Token': turnstileToken } : {}),
        ...(remoteIp ? { RemoteIP: remoteIp } : {})
      }
    });

    return {
      success: true,
      ID: response.data?.ID,
      message: 'Claim case created successfully'
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: extractPegaErrorMessage(error, 'Failed to create claim case')
    };
  }
};

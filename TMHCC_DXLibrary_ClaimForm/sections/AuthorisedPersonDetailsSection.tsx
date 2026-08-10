import type { ClaimFormData, ClaimFormErrors } from '../types';
import type { LocalizationMap } from '../utils/useLocalization';
import { PersonNameFields, PersonContactFields } from './PersonContactFields';

interface AuthorisedPersonDetailsSectionProps {
  formData: ClaimFormData;
  errors: ClaimFormErrors;
  onFieldChange: (field: keyof ClaimFormData, value: string) => void;
  onFieldBlur: (field: keyof ClaimFormData) => void;
  l: LocalizationMap;
}

function AuthorisedPersonDetailsSection({
  formData,
  errors,
  onFieldChange,
  onFieldBlur,
  l
}: AuthorisedPersonDetailsSectionProps) {
  return (
    <div className='claim-form__group'>
      <h3 className='claim-form__section-title claim-form__section-title--secondary'>
        {l['Authorised Person Details']}
      </h3>
      <p className='claim-form__section-description'>{l['AuthorisedPersonDetailsDescription']}</p>

      <PersonNameFields
        formData={formData}
        errors={errors}
        onFieldChange={onFieldChange}
        onFieldBlur={onFieldBlur}
        l={l}
        firstNameField='authorisedFirstName'
        lastNameField='authorisedLastName'
      />

      <PersonContactFields
        formData={formData}
        errors={errors}
        onFieldChange={onFieldChange}
        onFieldBlur={onFieldBlur}
        l={l}
        required
        emailField='authorisedEmail'
        phoneField='authorisedPhoneNumber'
      />
    </div>
  );
}

export default AuthorisedPersonDetailsSection;

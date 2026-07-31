import type { ClaimFormData, ClaimFormErrors } from '../types';
import type { LocalizationMap } from '../utils/useLocalization';
import { PersonNameFields, PersonContactFields } from './PersonContactFields';

interface SpouseDetailsSectionProps {
  formData: ClaimFormData;
  errors: ClaimFormErrors;
  onFieldChange: (field: keyof ClaimFormData, value: string) => void;
  onFieldBlur: (field: keyof ClaimFormData) => void;
  l: LocalizationMap;
}

function SpouseDetailsSection({ formData, errors, onFieldChange, onFieldBlur, l }: SpouseDetailsSectionProps) {
  return (
    <div className='claim-form__group'>
      <h3 className='claim-form__section-title claim-form__section-title--secondary'>
        {l['Spouse Details']}
      </h3>
      <p className='claim-form__section-description'>{l['SpouseDetailsDescription']}</p>

      <PersonNameFields
        formData={formData}
        errors={errors}
        onFieldChange={onFieldChange}
        onFieldBlur={onFieldBlur}
        l={l}
        firstNameField='spouseFirstName'
        lastNameField='spouseLastName'
      />

      <PersonContactFields
        formData={formData}
        errors={errors}
        onFieldChange={onFieldChange}
        onFieldBlur={onFieldBlur}
        l={l}
        required={false}
        emailField='spouseEmail'
        phoneField='spousePhoneNumber'
      />
    </div>
  );
}

export default SpouseDetailsSection;

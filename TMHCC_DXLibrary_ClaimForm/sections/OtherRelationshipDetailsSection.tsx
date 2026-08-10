import type { ClaimFormData, ClaimFormErrors } from '../types';
import type { LocalizationMap } from '../utils/useLocalization';
import { PersonNameFields, PersonContactFields } from './PersonContactFields';

interface OtherRelationshipDetailsSectionProps {
  formData: ClaimFormData;
  errors: ClaimFormErrors;
  onFieldChange: (field: keyof ClaimFormData, value: string) => void;
  onFieldBlur: (field: keyof ClaimFormData) => void;
  l: LocalizationMap;
}

function OtherRelationshipDetailsSection({
  formData,
  errors,
  onFieldChange,
  onFieldBlur,
  l
}: OtherRelationshipDetailsSectionProps) {
  return (
    <div className='claim-form__group'>
      <h3 className='claim-form__section-title claim-form__section-title--secondary'>
        {l['Additional Details']}
      </h3>
      <p className='claim-form__section-description'>{l['AdditionalDetailsDescription']}</p>

      <div className='claim-form__grid'>
        <label className='claim-form__field claim-form__field--full'>
          <span>
            {l['Describe your relationship to the policyholder']} <span className='claim-form__required-star'>*</span>
          </span>
          <input
            value={formData.otherRelationshipDescription ?? ''}
            onChange={(e) => onFieldChange('otherRelationshipDescription', e.target.value)}
            onBlur={() => onFieldBlur('otherRelationshipDescription')}
            placeholder={l['DescribeRelationshipPH']}
            aria-required="true"
            aria-invalid={Boolean(errors.otherRelationshipDescription)}
            aria-describedby={errors.otherRelationshipDescription ? 'otherRelationshipDescription-error' : undefined}
          />
          {errors.otherRelationshipDescription && (
            <small id='otherRelationshipDescription-error' className='claim-form__error' role='alert'>{errors.otherRelationshipDescription}</small>
          )}
        </label>
      </div>

      <PersonNameFields
        formData={formData}
        errors={errors}
        onFieldChange={onFieldChange}
        onFieldBlur={onFieldBlur}
        l={l}
        firstNameField='otherPersonFirstName'
        lastNameField='otherPersonLastName'
      />

      <PersonContactFields
        formData={formData}
        errors={errors}
        onFieldChange={onFieldChange}
        onFieldBlur={onFieldBlur}
        l={l}
        required
        emailField='otherPersonEmail'
        phoneField='otherPersonPhoneNumber'
      />
    </div>
  );
}

export default OtherRelationshipDetailsSection;

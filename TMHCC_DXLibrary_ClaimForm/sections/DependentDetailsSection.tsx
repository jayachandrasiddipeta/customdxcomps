import type { ClaimFormData, ClaimFormErrors } from '../types';
import type { LocalizationMap } from '../utils/useLocalization';
import { PersonNameFields, PersonContactFields } from './PersonContactFields';
import DateTextInput from './DateTextInput';
import {todayIso, yearsAgoIso} from '../utils/dateUtils';

interface DependentDetailsSectionProps {
  formData: ClaimFormData;
  errors: ClaimFormErrors;
  onFieldChange: (field: keyof ClaimFormData, value: string) => void;
  onFieldBlur: (field: keyof ClaimFormData) => void;
  l: LocalizationMap;
}

function DependentDetailsSection({ formData, errors, onFieldChange, onFieldBlur, l }: DependentDetailsSectionProps) {
  return (
    <div className='claim-form__group'>
      <h3 className='claim-form__section-title claim-form__section-title--secondary'>
        {l['Dependent Details']}
      </h3>
      <p className='claim-form__section-description'>{l['DependentDetailsDescription']}</p>

      <PersonNameFields
        formData={formData}
        errors={errors}
        onFieldChange={onFieldChange}
        onFieldBlur={onFieldBlur}
        l={l}
        firstNameField='dependentFirstName'
        lastNameField='dependentLastName'
      />

      <div className='claim-form__grid'>
        <label className='claim-form__field'>
          <span>
            {l['Date of Birth']} <span className='claim-form__required-star'>*</span>
          </span>
          <DateTextInput
            value={formData.dependentDateOfBirth ?? ''}
            onChange={v => onFieldChange('dependentDateOfBirth', v)}
            onBlur={() => onFieldBlur('dependentDateOfBirth')}
            l={l}
            min={yearsAgoIso(100)}
            max={todayIso()}
            aria-required="true"
            aria-invalid={Boolean(errors.dependentDateOfBirth)}
            aria-describedby={errors.dependentDateOfBirth ? 'dependentDateOfBirth-error' : undefined}
          />
          {errors.dependentDateOfBirth && (
            <small id='dependentDateOfBirth-error' className='claim-form__error' role='alert'>{errors.dependentDateOfBirth}</small>
          )}
        </label>

        <label className='claim-form__field'>
          <span>
            {l['Relationship to Policyholder']} <span className='claim-form__required-star'>*</span>
          </span>
          <input
            value={formData.dependentRelationship ?? ''}
            onChange={(e) => onFieldChange('dependentRelationship', e.target.value)}
            onBlur={() => onFieldBlur('dependentRelationship')}
            placeholder={l['DependentRelationshipPH']}
            aria-required="true"
            aria-invalid={Boolean(errors.dependentRelationship)}
            aria-describedby={errors.dependentRelationship ? 'dependentRelationship-error' : undefined}
          />
          {errors.dependentRelationship && (
            <small id='dependentRelationship-error' className='claim-form__error' role='alert'>{errors.dependentRelationship}</small>
          )}
        </label>
      </div>

      <PersonContactFields
        formData={formData}
        errors={errors}
        onFieldChange={onFieldChange}
        onFieldBlur={onFieldBlur}
        l={l}
        required={false}
        emailField='dependentEmail'
        phoneField='dependentPhoneNumber'
      />
    </div>
  );
}

export default DependentDetailsSection;

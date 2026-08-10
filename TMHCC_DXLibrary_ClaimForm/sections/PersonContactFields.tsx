import type { ClaimFormData, ClaimFormErrors } from '../types';
import type { LocalizationMap } from '../utils/useLocalization';

interface SharedFieldsProps {
  formData: ClaimFormData;
  errors: ClaimFormErrors;
  onFieldChange: (field: keyof ClaimFormData, value: string) => void;
  onFieldBlur: (field: keyof ClaimFormData) => void;
  l: LocalizationMap;
}

interface PersonNameFieldsProps extends SharedFieldsProps {
  firstNameField: keyof ClaimFormData;
  lastNameField: keyof ClaimFormData;
}

/** First name / Last name row — always required, shared by all related-person sections. */
export function PersonNameFields({
  formData,
  errors,
  onFieldChange,
  onFieldBlur,
  firstNameField,
  lastNameField,
  l
}: PersonNameFieldsProps) {
  return (
    <div className='claim-form__grid'>
      <label className='claim-form__field'>
        <span>
          {l['First Name']} <span className='claim-form__required-star'>*</span>
        </span>
        <input
          value={String(formData[firstNameField] ?? '')}
          onChange={(e) => onFieldChange(firstNameField, e.target.value)}
          onBlur={() => onFieldBlur(firstNameField)}
          placeholder={l['PersonFirstNamePH']}
          aria-required="true"
          aria-invalid={Boolean(errors[firstNameField])}
          aria-describedby={errors[firstNameField] ? `${firstNameField}-error` : undefined}
        />
        {errors[firstNameField] && (
          <small id={`${firstNameField}-error`} className='claim-form__error' role='alert'>{errors[firstNameField]}</small>
        )}
      </label>

      <label className='claim-form__field'>
        <span>
          {l['Last Name']} <span className='claim-form__required-star'>*</span>
        </span>
        <input
          value={String(formData[lastNameField] ?? '')}
          onChange={(e) => onFieldChange(lastNameField, e.target.value)}
          onBlur={() => onFieldBlur(lastNameField)}
          placeholder={l['PersonLastNamePH']}
          aria-required="true"
          aria-invalid={Boolean(errors[lastNameField])}
          aria-describedby={errors[lastNameField] ? `${lastNameField}-error` : undefined}
        />
        {errors[lastNameField] && (
          <small id={`${lastNameField}-error`} className='claim-form__error' role='alert'>{errors[lastNameField]}</small>
        )}
      </label>
    </div>
  );
}

interface PersonContactFieldsProps extends SharedFieldsProps {
  emailField: keyof ClaimFormData;
  phoneField: keyof ClaimFormData;
  /** Whether email/phone are required for this section. */
  required: boolean;
}

/** Email address / Phone number row — required flag varies by section. */
export function PersonContactFields({
  formData,
  errors,
  onFieldChange,
  onFieldBlur,
  emailField,
  phoneField,
  required,
  l
}: PersonContactFieldsProps) {
  return (
    <div className='claim-form__grid'>
      <label className='claim-form__field'>
        <span>
          {l['Email Address']} {required && <span className='claim-form__required-star'>*</span>}
        </span>
        <input
          type='email'
          value={String(formData[emailField] ?? '')}
          onChange={(e) => onFieldChange(emailField, e.target.value)}
          onBlur={() => onFieldBlur(emailField)}
          placeholder={l['PersonEmailPH']}
          aria-required={required}
          aria-invalid={Boolean(errors[emailField])}
          aria-describedby={errors[emailField] ? `${emailField}-error` : undefined}
        />
        {errors[emailField] && (
          <small id={`${emailField}-error`} className='claim-form__error' role='alert'>{errors[emailField]}</small>
        )}
      </label>

      <label className='claim-form__field'>
        <span>
          {l['Phone Number']} {required && <span className='claim-form__required-star'>*</span>}
        </span>
        <input
          type='tel'
          inputMode='numeric'
          maxLength={l['PhoneLength']}
          value={String(formData[phoneField] ?? '')}
          onChange={(e) => {
            const digits = e.target.value.replace(/\D/g, '').slice(0, l['PhoneLength']);
            onFieldChange(phoneField, digits);
          }}
          onBlur={() => onFieldBlur(phoneField)}
          placeholder={l['PersonPhonePH']}
          aria-required={required}
          aria-invalid={Boolean(errors[phoneField])}
          aria-describedby={errors[phoneField] ? `${phoneField}-error` : undefined}
        />
        {errors[phoneField] && (
          <small id={`${phoneField}-error`} className='claim-form__error' role='alert'>{errors[phoneField]}</small>
        )}
      </label>
    </div>
  );
}

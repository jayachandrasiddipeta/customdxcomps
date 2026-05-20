import type { ClaimFormData, ClaimFormErrors } from '../types';

interface YourDetailsSectionProps {
  formData: ClaimFormData;
  errors: ClaimFormErrors;
  onFieldChange: (field: keyof ClaimFormData, value: string) => void;
  onFieldBlur: (field: keyof ClaimFormData) => void;
}

function YourDetailsSection({ formData, errors, onFieldChange, onFieldBlur }: YourDetailsSectionProps) {
  return (
    <section className='claim-form__section'>
      <h3 className='claim-form__section-title'>
        <span className='claim-form__section-index'>1</span>
        Your details
      </h3>
      <div className='claim-form__grid'>
        <label className='claim-form__field'>
          <span>First Name <span className='claim-form__required-star'>*</span></span>
          <input
            type='text'
            required
            value={formData.firstName}
            onChange={event => onFieldChange('firstName', event.target.value)}
            onBlur={() => onFieldBlur('firstName')}
          />
          {errors.firstName && <small className='claim-form__error'>{errors.firstName}</small>}
        </label>

        <label className='claim-form__field'>
          <span>Last Name <span className='claim-form__required-star'>*</span></span>
          <input
            type='text'
            required
            value={formData.lastName}
            onChange={event => onFieldChange('lastName', event.target.value)}
            onBlur={() => onFieldBlur('lastName')}
          />
          {errors.lastName && <small className='claim-form__error'>{errors.lastName}</small>}
        </label>

        <label className='claim-form__field'>
          <span>Email <span className='claim-form__required-star'>*</span></span>
          <input
            type='email'
            required
            value={formData.email}
            onChange={event => onFieldChange('email', event.target.value)}
            onBlur={() => onFieldBlur('email')}
          />
          {errors.email && <small className='claim-form__error'>{errors.email}</small>}
        </label>

        <label className='claim-form__field'>
          <span>Phone Number</span>
          <input
            type='tel'
            placeholder='Optional'
            value={formData.phoneNumber}
            onChange={event => onFieldChange('phoneNumber', event.target.value)}
            onBlur={() => onFieldBlur('phoneNumber')}
          />
          {errors.phoneNumber && <small className='claim-form__error'>{errors.phoneNumber}</small>}
        </label>

        <label className='claim-form__field'>
          <span>Policy Number <span className='claim-form__required-star'>*</span></span>
          <input
            type='text'
            required
            value={formData.policyNumber}
            onChange={event => onFieldChange('policyNumber', event.target.value)}
            onBlur={() => onFieldBlur('policyNumber')}
          />
          {errors.policyNumber && <small className='claim-form__error'>{errors.policyNumber}</small>}
        </label>

        <label className='claim-form__field'>
          <span>Membership Number</span>
          <input
            type='text'
            value={formData.membershipNumber}
            onChange={event => onFieldChange('membershipNumber', event.target.value)}
          />
        </label>

        <label className='claim-form__field'>
          <span>Service Number</span>
          <input
            type='text'
            value={formData.serviceNumber}
            onChange={event => onFieldChange('serviceNumber', event.target.value)}
          />
        </label>

        <label className='claim-form__field'>
          <span>Scheme / Product</span>
          <input
            type='text'
            value={formData.schemeOrProduct}
            onChange={event => onFieldChange('schemeOrProduct', event.target.value)}
          />
        </label>
      </div>
    </section>
  );
}

export default YourDetailsSection;

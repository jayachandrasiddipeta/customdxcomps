import type { ClaimFormData, ClaimFormErrors } from '../types';

const RELATIONSHIP_OPTIONS = ['', 'Policyholder', 'Spouse / Partner', 'Dependent', 'Other'];
const COUNTRY_OPTIONS = ['', 'United Kingdom', 'United States', 'Australia', 'Canada', 'Germany', 'France', 'Other'];

interface WhatHappenedSectionProps {
  formData: ClaimFormData;
  errors: ClaimFormErrors;
  onFieldChange: (field: keyof ClaimFormData, value: string) => void;
  onFieldBlur: (field: keyof ClaimFormData) => void;
}

function WhatHappenedSection({ formData, errors, onFieldChange, onFieldBlur }: WhatHappenedSectionProps) {
  return (
    <section className='claim-form__section'>
      <h3 className='claim-form__section-title'>
        <span className='claim-form__section-index'>2</span>
        What happened
      </h3>
      <div className='claim-form__grid'>
        <label className='claim-form__field'>
          <span>Relationship to Policyholder <span className='claim-form__required-star'>*</span></span>
          <select
            required
            value={formData.relationship}
            onChange={e => onFieldChange('relationship', e.target.value)}
            onBlur={() => onFieldBlur('relationship')}
          >
            {RELATIONSHIP_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt || 'Select...'}</option>
            ))}
          </select>
          {errors.relationship && <small className='claim-form__error'>{errors.relationship}</small>}
        </label>

        <label className='claim-form__field'>
          <span>Date of Loss <span className='claim-form__required-star'>*</span></span>
          <input
            type='date'
            required
            value={formData.dateOfLoss}
            onChange={e => onFieldChange('dateOfLoss', e.target.value)}
            onBlur={() => onFieldBlur('dateOfLoss')}
          />
          {errors.dateOfLoss && <small className='claim-form__error'>{errors.dateOfLoss}</small>}
        </label>

        <label className='claim-form__field'>
          <span>Loss Type <span className='claim-form__required-star'>*</span></span>
          <input
            type='text'
            placeholder='What happened? (e.g. theft, accidental damage, loss)'
            required
            value={formData.lossType}
            onChange={e => onFieldChange('lossType', e.target.value)}
            onBlur={() => onFieldBlur('lossType')}
          />
          {errors.lossType && <small className='claim-form__error'>{errors.lossType}</small>}
        </label>

        <label className='claim-form__field'>
          <span>Cause of Loss <span className='claim-form__required-star'>*</span></span>
          <input
            type='text'
            placeholder='How did it happen? (brief description of cause)'
            required
            value={formData.causeOfLoss}
            onChange={e => onFieldChange('causeOfLoss', e.target.value)}
            onBlur={() => onFieldBlur('causeOfLoss')}
          />
          {errors.causeOfLoss && <small className='claim-form__error'>{errors.causeOfLoss}</small>}
        </label>

        <div className='claim-form__subheading claim-form__field--full'>Loss address</div>

        <label className='claim-form__field claim-form__field--full'>
          <span>Country <span className='claim-form__required-star'>*</span></span>
          <select
            required
            value={formData.lossCountry}
            onChange={e => onFieldChange('lossCountry', e.target.value)}
            onBlur={() => onFieldBlur('lossCountry')}
          >
            {COUNTRY_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt || 'Select...'}</option>
            ))}
          </select>
          {errors.lossCountry && <small className='claim-form__error'>{errors.lossCountry}</small>}
        </label>

        <label className='claim-form__field'>
          <span>Address line 1 <span className='claim-form__required-star'>*</span></span>
          <input
            type='text'
            required
            value={formData.lossAddressLine1}
            onChange={e => onFieldChange('lossAddressLine1', e.target.value)}
            onBlur={() => onFieldBlur('lossAddressLine1')}
          />
          {errors.lossAddressLine1 && <small className='claim-form__error'>{errors.lossAddressLine1}</small>}
        </label>

        <label className='claim-form__field'>
          <span>Address line 2</span>
          <input
            type='text'
            value={formData.lossAddressLine2}
            onChange={e => onFieldChange('lossAddressLine2', e.target.value)}
          />
        </label>

        <label className='claim-form__field'>
          <span>City / Town <span className='claim-form__required-star'>*</span></span>
          <input
            type='text'
            required
            value={formData.lossCity}
            onChange={e => onFieldChange('lossCity', e.target.value)}
            onBlur={() => onFieldBlur('lossCity')}
          />
          {errors.lossCity && <small className='claim-form__error'>{errors.lossCity}</small>}
        </label>

        <label className='claim-form__field'>
          <span>Postal Code <span className='claim-form__required-star'>*</span></span>
          <input
            type='text'
            required
            value={formData.lossPostalCode}
            onChange={e => onFieldChange('lossPostalCode', e.target.value)}
            onBlur={() => onFieldBlur('lossPostalCode')}
          />
          {errors.lossPostalCode && <small className='claim-form__error'>{errors.lossPostalCode}</small>}
        </label>

        <label className='claim-form__field claim-form__field--full'>
          <span>Describe what happened <span className='claim-form__required-star'>*</span></span>
          <textarea
            rows={4}
            placeholder='Include when, where and how it happened, and anything else that may help us understand your claim.'
            value={formData.description}
            onChange={e => onFieldChange('description', e.target.value)}
            onBlur={() => onFieldBlur('description')}
          />
          {errors.description && <small className='claim-form__error'>{errors.description}</small>}
          <small className='claim-form__hint'>Include: when, where, how it happened, and any relevant circumstances</small>
        </label>
      </div>
    </section>
  );
}

export default WhatHappenedSection;

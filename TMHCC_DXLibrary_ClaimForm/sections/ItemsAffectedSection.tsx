import type { ClaimFormData, ClaimFormErrors } from '../types';

const ITEM_TYPE_OPTIONS = ['', 'Electronics', 'Jewellery', 'Clothing', 'Military Equipment', 'Furniture', 'Other'];
const COUNTRY_OPTIONS = ['', 'United Kingdom', 'United States', 'Australia', 'Canada', 'Germany', 'France', 'Other'];

interface ItemsAffectedSectionProps {
  formData: ClaimFormData;
  errors: ClaimFormErrors;
  onFieldChange: (field: keyof ClaimFormData, value: string) => void;
  onFieldBlur: (field: keyof ClaimFormData) => void;
}

function ItemsAffectedSection({ formData, errors, onFieldChange, onFieldBlur }: ItemsAffectedSectionProps) {
  return (
    <section className='claim-form__section'>
      <h3 className='claim-form__section-title'>
        <span className='claim-form__section-index'>3</span>
        Items Affected
      </h3>
      <div className='claim-form__grid'>
        <label className='claim-form__field'>
          <span>Type of Item <span className='claim-form__required-star'>*</span></span>
          <select
            required
            value={formData.itemType}
            onChange={e => onFieldChange('itemType', e.target.value)}
            onBlur={() => onFieldBlur('itemType')}
          >
            {ITEM_TYPE_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt || 'Select...'}</option>
            ))}
          </select>
          {errors.itemType && <small className='claim-form__error'>{errors.itemType}</small>}
        </label>

        <label className='claim-form__field'>
          <span>Item description</span>
          <input
            type='text'
            placeholder='e.g., iPhone 14 Pro'
            value={formData.itemDescription}
            onChange={e => onFieldChange('itemDescription', e.target.value)}
          />
        </label>

        <label className='claim-form__field'>
          <span>Purchase Price (£) <span className='claim-form__required-star'>*</span></span>
          <input
            type='number'
            min='0'
            step='0.01'
            required
            value={formData.purchasePrice}
            onChange={e => onFieldChange('purchasePrice', e.target.value)}
            onBlur={() => onFieldBlur('purchasePrice')}
          />
          {errors.purchasePrice && <small className='claim-form__error'>{errors.purchasePrice}</small>}
        </label>

        <label className='claim-form__field'>
          <span>Claimed Amount (£)</span>
          <input
            type='number'
            min='0'
            step='0.01'
            value={formData.claimedAmount}
            onChange={e => onFieldChange('claimedAmount', e.target.value)}
          />
        </label>

        <div className='claim-form__subheading claim-form__field--full'>Policy address</div>

        <label className='claim-form__field claim-form__field--full'>
          <span>Country <span className='claim-form__required-star'>*</span></span>
          <select
            required
            value={formData.policyCountry}
            onChange={e => onFieldChange('policyCountry', e.target.value)}
            onBlur={() => onFieldBlur('policyCountry')}
          >
            {COUNTRY_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt || 'Select...'}</option>
            ))}
          </select>
          {errors.policyCountry && <small className='claim-form__error'>{errors.policyCountry}</small>}
        </label>

        <label className='claim-form__field'>
          <span>Address line 1 <span className='claim-form__required-star'>*</span></span>
          <input
            type='text'
            required
            value={formData.policyAddressLine1}
            onChange={e => onFieldChange('policyAddressLine1', e.target.value)}
            onBlur={() => onFieldBlur('policyAddressLine1')}
          />
          {errors.policyAddressLine1 && <small className='claim-form__error'>{errors.policyAddressLine1}</small>}
        </label>

        <label className='claim-form__field'>
          <span>Address line 2</span>
          <input
            type='text'
            value={formData.policyAddressLine2}
            onChange={e => onFieldChange('policyAddressLine2', e.target.value)}
          />
        </label>

        <label className='claim-form__field'>
          <span>City / Town <span className='claim-form__required-star'>*</span></span>
          <input
            type='text'
            required
            value={formData.policyCity}
            onChange={e => onFieldChange('policyCity', e.target.value)}
            onBlur={() => onFieldBlur('policyCity')}
          />
          {errors.policyCity && <small className='claim-form__error'>{errors.policyCity}</small>}
        </label>

        <label className='claim-form__field'>
          <span>Postal Code <span className='claim-form__required-star'>*</span></span>
          <input
            type='text'
            required
            value={formData.policyPostalCode}
            onChange={e => onFieldChange('policyPostalCode', e.target.value)}
            onBlur={() => onFieldBlur('policyPostalCode')}
          />
          {errors.policyPostalCode && <small className='claim-form__error'>{errors.policyPostalCode}</small>}
        </label>
      </div>
    </section>
  );
}

export default ItemsAffectedSection;

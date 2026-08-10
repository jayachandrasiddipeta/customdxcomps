
import type { ClaimFormData, ClaimFormErrors } from '../types';
import { useState } from 'react';
import InfoIcon from './InfoIcon';
import FieldInfo from './FieldInfo';
import type { ListOption, CountryOption } from '../utils/listValuesUtils';
import type { LocalizationMap } from '../utils/useLocalization';
import SpouseDetailsSection from './SpouseDetailsSection';
import DependentDetailsSection from './DependentDetailsSection';
import AuthorisedPersonDetailsSection from './AuthorisedPersonDetailsSection';
import OtherRelationshipDetailsSection from './OtherRelationshipDetailsSection';

interface YourDetailsSectionProps {
  formData: ClaimFormData;
  errors: ClaimFormErrors;
  onFieldChange: (field: keyof ClaimFormData, value: string | boolean) => void;
  onFieldBlur: (field: keyof ClaimFormData) => void;
  productOptions: ListOption[];
  relationshipOptions: ListOption[];
  countryOptions: CountryOption[];
  l: LocalizationMap;
  actions?: React.ReactNode;
}

function YourDetailsSection({
  formData,
  errors,
  onFieldChange,
  onFieldBlur,
  productOptions,
  relationshipOptions,
  countryOptions,
  l,
  actions
}: YourDetailsSectionProps) {
  const [showInfo, setShowInfo] = useState(false);

  const postcodeLabelKey = `${formData.policyCountry}_PCLabel`;
  const postcodePHKey = `${formData.policyCountry}_PostCodePH`;
  const postcodeLabel = l[postcodeLabelKey as keyof typeof l] || l['Postal Code'];
  const postcodePlaceholder = l[postcodePHKey as keyof typeof l] || l['PostalCodePH'];

  return (
    <section className="claim-form__section claim-form__section--your-details">

      <h3 className="claim-form__section-title claim-form__section-title--primary claim-form__title-with-icon">
        {l['Your Details']}
        <button
          type="button"
          className="claim-form__info-icon"
          onClick={() => setShowInfo(prev => !prev)}
          aria-label={showInfo ? String(l['HideInfoLabel']) : String(l['ShowInfoLabel'])}
          aria-expanded={showInfo}
          aria-controls="your-details-info-box"
        >
          <InfoIcon />
        </button>
      </h3>

      <div className="claim-form__info-box" id="your-details-info-box" hidden={!showInfo}>
        <div className="claim-form__info-left">
          <div className="claim-form__info-box-icon">
            <InfoIcon />
          </div>
          <div className="claim-form__info-content">
            {l['YourDetailsInstruction']}
          </div>
        </div>
        <button
          type="button"
          className="claim-form__info-close"
          onClick={() => setShowInfo(false)}
          aria-label={String(l['CloseLabel'])}
        >
          ×
        </button>
      </div>

      {/* Your details — gray sub-card */}
      <div className="claim-form__group">

        <h3 className="claim-form__section-title claim-form__section-title--secondary">
          {l['Your Details']}
        </h3>

        <p className="claim-form__section-description">{l['YourDetailsSectionDescription']}</p>

        {/* Personal details fields */}
        <div className="claim-form__grid">

            <label className="claim-form__field">
              <span>{l['First Name']} <span className="claim-form__required-star">*</span>
              </span>

              <input
                value={formData.firstName}
                onChange={(e) => onFieldChange('firstName', e.target.value)}
                onBlur={() => onFieldBlur('firstName')}
                placeholder={l['FNPH']}
                maxLength={l['NameMaxLength']}
                aria-required="true"
                aria-invalid={Boolean(errors.firstName)}
                aria-describedby={errors.firstName ? 'firstName-error' : undefined}
              />
              {errors.firstName && (
                <small id="firstName-error" className="claim-form__error" role="alert">{errors.firstName}</small>
              )}
            </label>

            <label className="claim-form__field">
              <span>{l['Last Name']} <span className="claim-form__required-star">*</span>
              </span>
              <input
                value={formData.lastName}
                onChange={(e) => onFieldChange('lastName', e.target.value)}
                onBlur={() => onFieldBlur('lastName')}
                placeholder={l['LNPH']}
                maxLength={l['NameMaxLength']}
                aria-required="true"
                aria-invalid={Boolean(errors.lastName)}
                aria-describedby={errors.lastName ? 'lastName-error' : undefined}
              />
              {errors.lastName && (
                <small id="lastName-error" className="claim-form__error" role="alert">{errors.lastName}</small>
              )}
            </label>

            <label className="claim-form__field">
              <span className="claim-form__field-label-row">{l['Email Address']}<span className="claim-form__required-star">*</span><FieldInfo text={l['EmailAddressFieldInfo']} l={l} /></span>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => onFieldChange('email', e.target.value)}
                onBlur={() => onFieldBlur('email')}
                placeholder={l['EmailPH']}
                aria-required="true"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <small id="email-error" className="claim-form__error" role="alert">{errors.email}</small>
              )}
            </label>

            <label className="claim-form__field">
              <span className="claim-form__field-label-row">{l['Phone Number']}<span className="claim-form__required-star">*</span><FieldInfo text={l['PhoneNumberFieldInfo']} l={l} /></span>
              <div className="claim-form__phone-group">
                <input
                  className="claim-form__phone-input"
                  type="tel"
                  inputMode="numeric"
                  maxLength={l['PhoneLength']}
                  value={formData.phoneNumber}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, '').slice(0, l['PhoneLength']);
                    onFieldChange('phoneNumber', digits);
                  }}
                  onBlur={() => onFieldBlur('phoneNumber')}
                  placeholder={l['PNPH']}
                  aria-required="true"
                  aria-invalid={Boolean(errors.phoneNumber)}
                  aria-describedby={errors.phoneNumber ? 'phoneNumber-error' : undefined}
                />
              </div>
              {errors.phoneNumber && (
                <small id="phoneNumber-error" className="claim-form__error" role="alert">{errors.phoneNumber}</small>
              )}
            </label>

            <label className="claim-form__field">
              <span>{l['Relationship to Policyholder']} <span className="claim-form__required-star">*</span></span>
              <select
                value={formData.relationship}
                onChange={(e) => onFieldChange('relationship', e.target.value)}
                onBlur={() => onFieldBlur('relationship')}
                aria-required="true"
                aria-invalid={Boolean(errors.relationship)}
                aria-describedby={errors.relationship ? 'relationship-error' : undefined}
              >
                <option value=''>{l['SelectRLPH' as keyof LocalizationMap]}</option>
                {relationshipOptions.map(opt => (
                  <option key={opt.key} value={opt.key}>{opt.label}</option>
                ))}
              </select>
              {errors.relationship && (
                <small id="relationship-error" className="claim-form__error" role="alert">{errors.relationship}</small>
              )}
            </label>

        </div>
      </div>

      {/* Related person details — shown conditionally based on the relationship selected above */}
      {formData.relationship === 'SP' && (
        <SpouseDetailsSection
          formData={formData}
          errors={errors}
          onFieldChange={onFieldChange}
          onFieldBlur={onFieldBlur}
          l={l}
        />
      )}
      {formData.relationship === 'DP' && (
        <DependentDetailsSection
          formData={formData}
          errors={errors}
          onFieldChange={onFieldChange}
          onFieldBlur={onFieldBlur}
          l={l}
        />
      )}
      {formData.relationship === 'AP' && (
        <AuthorisedPersonDetailsSection
          formData={formData}
          errors={errors}
          onFieldChange={onFieldChange}
          onFieldBlur={onFieldBlur}
          l={l}
        />
      )}
      {formData.relationship === 'OTH' && (
        <OtherRelationshipDetailsSection
          formData={formData}
          errors={errors}
          onFieldChange={onFieldChange}
          onFieldBlur={onFieldBlur}
          l={l}
        />
      )}

      {/* Shown only when someone other than the policyholder is claiming */}
      {['SP', 'DP', 'AP', 'OTH'].includes(formData.relationship) && (
        <div className="claim-form__group">
          <h3 className="claim-form__section-title claim-form__section-title--secondary">
            {l['Authorisation Confirmation']}
          </h3>
          <label className="review-declaration__checkbox review-declaration__checkbox--single">
            <input
              type="checkbox"
              checked={formData.authorisationConfirmed}
              onChange={(e) => onFieldChange('authorisationConfirmed', e.target.checked)}
              aria-required="true"
              aria-invalid={Boolean(errors.authorisationConfirmed)}
              aria-describedby={errors.authorisationConfirmed ? 'authorisationConfirmed-error' : undefined}
            />
            <span>
              {l['AuthorisationConfirmationText']} <span className="claim-form__required-star">*</span>
            </span>

          </label>
          {errors.authorisationConfirmed && (
            <small id="authorisationConfirmed-error" className="claim-form__error" role="alert">{errors.authorisationConfirmed}</small>
          )}
        </div>
      )}

      {/* Policy — gray sub-card */}
      <div className="claim-form__group">

        <h3 className="claim-form__section-title claim-form__section-title--secondary">
          {l['Policy']}
        </h3>

        <p className="claim-form__section-description">{l['PolicySectionDescription']}</p>

        {/* Policy fields */}
        <div className="claim-form__grid">

            <label className="claim-form__field">
              <span className="claim-form__field-label-row">{l['Policy Number']}<FieldInfo text={l['PolicyNumberFieldInfo']} l={l} /></span>
              <input
                value={formData.policyNumber}
                onChange={(e) => onFieldChange('policyNumber', e.target.value)}
                onBlur={() => onFieldBlur('policyNumber')}
                placeholder={l['PolicyNumberPH']}
                aria-invalid={Boolean(errors.policyNumber)}
                aria-describedby={errors.policyNumber ? 'policyNumber-error' : undefined}
              />
              {errors.policyNumber && (
                <small id="policyNumber-error" className="claim-form__error" role="alert">{errors.policyNumber}</small>
              )}
            </label>

            <label className="claim-form__field">
              <span className="claim-form__field-label-row">{l['Service Number']}<FieldInfo text={l['ServiceNumberFieldInfo']} l={l} /></span>
              <input
                value={formData.serviceNumber}
                onChange={(e) => onFieldChange('serviceNumber', e.target.value)}
                onBlur={() => onFieldBlur('serviceNumber')}
                placeholder={l['ServiceNumberPH']}
                aria-invalid={Boolean(errors.serviceNumber)}
                aria-describedby={errors.serviceNumber ? 'serviceNumber-error' : undefined}
              />
              {errors.serviceNumber && (
                <small id="serviceNumber-error" className="claim-form__error" role="alert">{errors.serviceNumber}</small>
              )}
            </label>

            <label className="claim-form__field claim-form__field--full">
              <span className="claim-form__field-label-row">{l['Product']}<span className="claim-form__required-star">*</span><FieldInfo text={l['ProductFieldInfo']} l={l} /></span>
              <select
                value={formData.schemeOrProduct}
                onChange={(e) => onFieldChange('schemeOrProduct', e.target.value)}
                onBlur={() => onFieldBlur('schemeOrProduct')}
                aria-required="true"
                aria-invalid={Boolean(errors.schemeOrProduct)}
                aria-describedby={errors.schemeOrProduct ? 'schemeOrProduct-error' : undefined}
              >
                <option value=''>{l['SelectProductPH' as keyof LocalizationMap]}</option>
                {productOptions.map(opt => (
                  <option key={opt.key} value={opt.key}>{opt.label}</option>
                ))}
              </select>
              {errors.schemeOrProduct && (
                <small id="schemeOrProduct-error" className="claim-form__error" role="alert">{errors.schemeOrProduct}</small>
              )}
            </label>

        </div>
      </div>

      {/* Policyholder Address — its own gray sub-card */}
      <div className="claim-form__group">

        <h3 className="claim-form__section-title claim-form__section-title--secondary">
          {l['Policyholder Address']}
        </h3>

        <p className="claim-form__section-description">{l['PolicyholderAddressSectionDescription']}</p>

        <div className="claim-form__grid">

            <label className="claim-form__field claim-form__field--full">
              <span>{l['Country']} <span className="claim-form__required-star">*</span></span>
              <select
                value={formData.policyCountry}
                onChange={(e) => onFieldChange('policyCountry', e.target.value)}
                onBlur={() => onFieldBlur('policyCountry')}
                aria-required="true"
                aria-invalid={Boolean(errors.policyCountry)}
                aria-describedby={errors.policyCountry ? 'policyCountry-error' : undefined}
              >
                <option value=''>{l['CountryPH']}</option>
                {countryOptions.map(opt => (
                  <option key={opt.key} value={opt.key}>{opt.label}</option>
                ))}
              </select>
              {errors.policyCountry && (
                <small id="policyCountry-error" className="claim-form__error" role="alert">{errors.policyCountry}</small>
              )}
            </label>

            <label className="claim-form__field claim-form__field--full">
              <span>{l['Address Line 1']} <span className="claim-form__required-star">*</span></span>
              <input
                value={formData.policyAddressLine1}
                onChange={(e) => onFieldChange('policyAddressLine1', e.target.value)}
                onBlur={() => onFieldBlur('policyAddressLine1')}
                placeholder={l['StreetAddress1PH']}
                aria-required="true"
                aria-invalid={Boolean(errors.policyAddressLine1)}
                aria-describedby={errors.policyAddressLine1 ? 'policyAddressLine1-error' : undefined}
              />
              {errors.policyAddressLine1 && (
                <small id="policyAddressLine1-error" className="claim-form__error" role="alert">{errors.policyAddressLine1}</small>
              )}
            </label>

            <label className="claim-form__field claim-form__field--full">
              <span>{l['Address Line 2']}</span>
              <input
                value={formData.policyAddressLine2}
                onChange={(e) => onFieldChange('policyAddressLine2', e.target.value)}
                onBlur={() => onFieldBlur('policyAddressLine2')}
                placeholder={l['StreetAddress2PH']}
                aria-invalid={Boolean(errors.policyAddressLine2)}
                aria-describedby={errors.policyAddressLine2 ? 'policyAddressLine2-error' : undefined}
              />
              {errors.policyAddressLine2 && (
                <small id="policyAddressLine2-error" className="claim-form__error" role="alert">{errors.policyAddressLine2}</small>
              )}
            </label>
            <label className="claim-form__field">
              <span>{l['CityTown']} <span className="claim-form__required-star">*</span>
              </span>
              <input
                value={formData.policyCity}
                onChange={(e) => onFieldChange('policyCity', e.target.value)}
                onBlur={() => onFieldBlur('policyCity')}
                placeholder={l['CityTownPH']}
                aria-required="true"
                aria-invalid={Boolean(errors.policyCity)}
                aria-describedby={errors.policyCity ? 'policyCity-error' : undefined}
              />
              {errors.policyCity && (
                <small id="policyCity-error" className="claim-form__error" role="alert">{errors.policyCity}</small>
              )}
            </label>

            <label className="claim-form__field">

             <span>{postcodeLabel} {formData.policyCountry === 'GB' && <span className="claim-form__required-star">*</span>}</span>
              <input
                inputMode='text'
                value={formData.policyPostalCode}
                onChange={(e) => onFieldChange('policyPostalCode', e.target.value.replace(new RegExp(String(l['PostalCodeStripPattern']), 'g'), '').toUpperCase())}
                onBlur={() => onFieldBlur('policyPostalCode')}
                placeholder={String(postcodePlaceholder)}
                aria-required={formData.policyCountry === 'GB'}
                aria-invalid={Boolean(errors.policyPostalCode)}
                aria-describedby={errors.policyPostalCode ? 'policyPostalCode-error' : undefined}
              />
              {errors.policyPostalCode && (
                <small id="policyPostalCode-error" className="claim-form__error" role="alert">{errors.policyPostalCode}</small>
              )}
            </label>

        </div>
      </div>

      {actions && <div className="claim-form__section-actions">{actions}</div>}

    </section>
  );
}

export default YourDetailsSection;

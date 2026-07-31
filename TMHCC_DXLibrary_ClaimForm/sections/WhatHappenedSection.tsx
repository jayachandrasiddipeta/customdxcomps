import { useState, useMemo } from 'react';
import type { ClaimFormData, ClaimFormErrors } from '../types';
import InfoIcon from './InfoIcon';
import FieldInfo from './FieldInfo';
import DateTextInput from './DateTextInput';
import type { ListOption } from '../utils/listValuesUtils';
import type { LocalizationMap } from '../utils/useLocalization';

interface WhatHappenedSectionProps {
  formData: ClaimFormData;
  errors: ClaimFormErrors;
  onFieldChange: (field: keyof ClaimFormData, value: string) => void;
  onFieldBlur: (field: keyof ClaimFormData) => void;
  lossTypeOptions: ListOption[];
  lossLocationOptions: ListOption[];
  theftReportedOptions: ListOption[];
  countryOptions: ListOption[];
  l: LocalizationMap;
  actions?: React.ReactNode;
}

function WhatHappenedSection({
  formData,
  errors,
  onFieldChange,
  onFieldBlur,
  lossTypeOptions,
  lossLocationOptions,
  theftReportedOptions,
  countryOptions,
  l,
  actions
}: WhatHappenedSectionProps) {
  const [showInfo, setShowInfo] = useState(false);

  const postcodeLabelKey = `${formData.lossCountry}_PCLabel`;
  const postcodePHKey = `${formData.lossCountry}_PostCodePH`;
  const postcodeLabel = l[postcodeLabelKey as keyof typeof l] || l['Postal Code'];
  const postcodePlaceholder = l[postcodePHKey as keyof typeof l] || l['PostalCodePH'];

  const sortedTheftOptions = useMemo(
    () => [...theftReportedOptions].sort(a => (a.key === 'Yes' ? -1 : 1)),
    [theftReportedOptions]
  );

  return (
    <section className='claim-form__section'>
      <h3 className='claim-form__section-title claim-form__title-with-icon'>
        {l['What Happened']}
        <button
          type='button'
          className='claim-form__info-icon'
          onClick={() => setShowInfo(prev => !prev)}
          aria-label={showInfo ? String(l['HideInfoLabel']) : String(l['ShowInfoLabel'])}
          aria-expanded={showInfo}
          aria-controls="what-happened-info-box"
        >
          <InfoIcon />
        </button>
      </h3>
      {/* ✅ INFO BOX */}
      <div className='claim-form__info-box' id="what-happened-info-box" hidden={!showInfo}>
        {/* ✅ LEFT SIDE */}
        <div className='claim-form__info-left'>
          {/* ✅ ICON */}
          <div className='claim-form__info-box-icon'>
            <InfoIcon />
          </div>

          {/* ✅ TEXT */}
          <div className='claim-form__info-content'>{l['WhatHappenedInstructions']}</div>
        </div>

        {/* ✅ CLOSE BUTTON (RIGHT) */}
        <button
          type='button'
          className='claim-form__info-close'
          onClick={() => setShowInfo(false)}
          aria-label={String(l['CloseLabel'])}
        >
          ×
        </button>
      </div>
      <div className='claim-form__grid'>
        {/* ✅ CARD 1 */}
        <div className='claim-form__group claim-form__field--full'>
          <h3 className='claim-form__section-title claim-form__section-title--secondary'>
            {l['Incident Details']}
          </h3>
          <p className='claim-form__section-description'>{l['IncidentDetailsDescription']}</p>

          <div className='claim-form__grid'>
            {/* Date */}
            <label className='claim-form__field'>
                <span className='claim-form__field-label-row'>
                {l['Date of Loss']}
                <span className='claim-form__required-star'>*</span>
                <FieldInfo text={l['DateOfLossFieldInfo']} l={l} />
              </span>
              <DateTextInput
                value={formData.dateOfLoss}
                onChange={v => onFieldChange('dateOfLoss', v)}
                onBlur={() => onFieldBlur('dateOfLoss')}
                l={l}
                aria-required="true"
              />
              {errors.dateOfLoss && (
                <small className='claim-form__error' role='alert'>
                  {errors.dateOfLoss}
                </small>
              )}
            </label>

            {/* Loss Type */}
            <label className='claim-form__field'>
              <span className='claim-form__field-label-row'>
                {l['Incident Type']}
                <span className='claim-form__required-star'>*</span>
                <FieldInfo text={l['IncidentTypeFieldInfo']} l={l} />
              </span>
              <select
                value={formData.lossType}
                onChange={e => onFieldChange('lossType', e.target.value)}
                onBlur={() => onFieldBlur('lossType')}
                aria-required="true"
              >
                <option value=''>{l['Select incident type']}</option>
                {lossTypeOptions.map(opt => (
                  <option key={opt.key} value={opt.key}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors.lossType && (
                <small className='claim-form__error' role='alert'>
                  {errors.lossType}
                </small>
              )}
            </label>

            {/* Other */}
            {formData.lossType === 'OTH' && (
              <label className='claim-form__field claim-form__field--full'>
                <span>
                  {l['OtherLossType']} <span className='claim-form__required-star'>*</span>
                </span>
                <input
                  value={formData.otherLossType || ''}
                  placeholder={l['OtherLossTypePH']}
                  onChange={e => onFieldChange('otherLossType', e.target.value)}
                  onBlur={() => onFieldBlur('otherLossType')}
                  aria-required="true"
                />
                {errors.otherLossType && (
                  <small className='claim-form__error' role='alert'>
                    {errors.otherLossType}
                  </small>
                )}
              </label>
            )}

            {/* Theft */}
            {formData.lossType === 'TH' && (
              <>
                <h4 className='claim-form__section-title claim-form__section-title--secondary claim-form__field--full'>
                  {l['Theft Details']}
                </h4>

                <label className='claim-form__field'>
                  <span>
                    {l['ReportedToPolice']} <span className='claim-form__required-star'>*</span>
                  </span>
                  <select
                    value={formData.theftReported || ''}
                    onChange={e => {
                      const value = e.target.value;
                      onFieldChange('theftReported', value);
                      if (value === 'No') {
                        onFieldChange('crimeReferenceNumber', '');
                      }
                    }}
                    onBlur={() => onFieldBlur('theftReported')}
                    aria-required="true"
                  >
                    <option value=''>{l['SelectOptionPH']}</option>
                    {sortedTheftOptions.map(opt => (
                      <option key={opt.key} value={opt.key}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {errors.theftReported && (
                    <small className='claim-form__error' role='alert'>
                      {errors.theftReported}
                    </small>
                  )}
                </label>

                {formData.theftReported === 'Yes' && (
                  <label className='claim-form__field'>
                    <span>
                      {l['Crime Reference Number']}{' '}
                      <span className='claim-form__required-star'>*</span>
                    </span>
                    <input
                      value={formData.crimeReferenceNumber || ''}
                      placeholder={l['CrimeReferenceNumberHT']}
                      onChange={e => onFieldChange('crimeReferenceNumber', e.target.value)}
                      onBlur={() => onFieldBlur('crimeReferenceNumber')}
                      aria-required="true"
                    />
                    {errors.crimeReferenceNumber && (
                      <small className='claim-form__error' role='alert'>
                        {errors.crimeReferenceNumber}
                      </small>
                    )}
                  </label>
                )}
              </>
            )}

            {/* Description */}
            <label className='claim-form__field claim-form__field--full'>
              <span className='claim-form__field-label-row'>
                {l['How did it happen?']}
                <span className='claim-form__required-star'>*</span>
                <FieldInfo text={l['HowDidItHappenFieldInfo']} l={l} />
              </span>
              <textarea
                rows={4}
                placeholder={l['DescriptionPlaceholder']}
                value={formData.description}
                onChange={e => onFieldChange('description', e.target.value)}
                onBlur={() => onFieldBlur('description')}
                maxLength={l['DescriptionMaxLength']}
                aria-required="true"
              />
              <div className='claim-form__field-footer'>
                <span>
                  {errors.description && (
                    <small className='claim-form__error' role='alert'>
                      {errors.description}
                    </small>
                  )}
                </span>
                <small
                  className={`claim-form__char-counter${formData.description.length >= l['CharCounterWarnThreshold'] ? ' claim-form__char-counter-warn' : ''}`}
                >
                  {formData.description.length} / {l['DescriptionMaxLength']} {l['CharactersLabel']}
                </small>
              </div>
            </label>
          </div>
        </div>

        {/* ✅ CARD 2 */}
        <div className='claim-form__group claim-form__group--card claim-form__field--full'>
          <h3 className='claim-form__section-title claim-form__section-title--secondary'>
            {l['Where did this happen']}
          </h3>
          <p className='claim-form__section-description'>{l['WhereDidThisHappenDescription']}</p>

          {/* Location options */}
          <div className='claim-form__option-card-group'>
            {lossLocationOptions.map(opt => (
              <label
                key={opt.key}
                className={`claim-form__option-card${formData.lossLocationType === opt.key ? ' claim-form__option-card--selected' : ''}`}
              >
                <input
                  type='radio'
                  name='lossLocationType'
                  value={opt.key}
                  checked={formData.lossLocationType === opt.key}
                  onChange={() => {
                    onFieldChange('lossLocationType', opt.key);
                    onFieldBlur('lossLocationType');
                  }}
                />
                <span>
                  <span className='claim-form__option-card-title'>{opt.label}</span>
                  {opt.subtitle && (
                    <span className='claim-form__option-card-subtitle'>{opt.subtitle}</span>
                  )}
                </span>
              </label>
            ))}
          </div>

          {errors.lossLocationType && (
            <small className='claim-form__error' role='alert'>
              {errors.lossLocationType}
            </small>
          )}

          {/* On deployment or exercise — shown when "On deployment or exercise" (key: ODE) is selected */}
          {formData.lossLocationType === 'ODE' && (
            <>
              <div className='claim-form__divider claim-form__field--full' />
              <div className='claim-form__grid'>
                <label className='claim-form__field claim-form__field--full'>
                  <span>
                    {l['Country of deployment']} <span className='claim-form__required-star'>*</span>
                  </span>
                  <select
                    value={formData.deploymentCountry ?? ''}
                    onChange={e => onFieldChange('deploymentCountry', e.target.value)}
                    onBlur={() => onFieldBlur('deploymentCountry')}
                    aria-required="true"
                  >
                    <option value=''>{l['CountryPH']}</option>
                    {countryOptions.map(opt => (
                      <option key={opt.key} value={opt.key}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {errors.deploymentCountry && (
                    <small className='claim-form__error' role='alert'>
                      {errors.deploymentCountry}
                    </small>
                  )}
                </label>

                <label className='claim-form__field claim-form__field--full'>
                  <span>
                    {l['Base or location name']} <em className='claim-form__optional-tag'>{l['OptionalLabel']}</em>
                  </span>
                  <input
                    value={formData.deploymentLocationName ?? ''}
                    placeholder={l['DeploymentLocationNamePH']}
                    onChange={e => onFieldChange('deploymentLocationName', e.target.value)}
                  />
                </label>
              </div>
            </>
          )}

          {/* Address — shown when "Different location" (key: DL) is selected */}
          {formData.lossLocationType === 'DL' && (
            <>
              <div className='claim-form__divider claim-form__field--full' />
              <div className='claim-form__grid'>
                <label className='claim-form__field claim-form__field--full'>
                  <span>
                    {l['Country']} <span className='claim-form__required-star'>*</span>
                  </span>
                  <select
                    value={formData.lossCountry}
                    onChange={e => onFieldChange('lossCountry', e.target.value)}
                    onBlur={() => onFieldBlur('lossCountry')}
                    aria-required="true"
                  >
                    <option value=''>{l['CountryPH']}</option>
                    {countryOptions.map(opt => (
                      <option key={opt.key} value={opt.key}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {errors.lossCountry && (
                    <small className='claim-form__error' role='alert'>
                      {errors.lossCountry}
                    </small>
                  )}
                </label>

                <label className='claim-form__field claim-form__field--full'>
                  <span>
                    {l['Address Line 1']} <span className='claim-form__required-star'>*</span>
                  </span>
                  <input
                    value={formData.lossAddressLine1}
                    placeholder={l['StreetAddress1PH']}
                    onChange={e => onFieldChange('lossAddressLine1', e.target.value)}
                    onBlur={() => onFieldBlur('lossAddressLine1')}
                    aria-required="true"
                  />
                  {errors.lossAddressLine1 && (
                    <small className='claim-form__error' role='alert'>
                      {errors.lossAddressLine1}
                    </small>
                  )}
                </label>

                <label className='claim-form__field claim-form__field--full'>
                  <span>{l['Address Line 2']}</span>
                  <input
                    value={formData.lossAddressLine2}
                    placeholder={l['StreetAddress2PH']}
                    onChange={e => onFieldChange('lossAddressLine2', e.target.value)}
                    onBlur={() => onFieldBlur('lossAddressLine2')}
                  />
                  {errors.lossAddressLine2 && (
                    <small className='claim-form__error' role='alert'>
                      {errors.lossAddressLine2}
                    </small>
                  )}
                </label>

                <label className='claim-form__field'>
                  <span>
                    {l['CityTown']} <span className='claim-form__required-star'>*</span>
                  </span>
                  <input
                    value={formData.lossCity}
                    placeholder={l['CityTownPH']}
                    onChange={e => onFieldChange('lossCity', e.target.value)}
                    onBlur={() => onFieldBlur('lossCity')}
                    aria-required="true"
                  />
                  {errors.lossCity && (
                    <small className='claim-form__error' role='alert'>
                      {errors.lossCity}
                    </small>
                  )}
                </label>

                <label className='claim-form__field'>
                  <span>
                    {postcodeLabel}
                    {formData.lossCountry === 'GB' && 
                      <span className='claim-form__required-star'>*</span>}
                  </span>
                  <input
                    inputMode='text'
                    value={formData.lossPostalCode}
                    placeholder={String(postcodePlaceholder)}
                    onChange={e =>
                      onFieldChange(
                        'lossPostalCode',
                        e.target.value.replace(
                          new RegExp(String(l['PostalCodeStripPattern']), 'g'),
                          ''
                        ).toUpperCase()
                      )
                    }
                    onBlur={() => onFieldBlur('lossPostalCode')}
                    aria-required={formData.lossCountry === 'GB'}
                  />
                  {errors.lossPostalCode && (
                    <small className='claim-form__error' role='alert'>
                      {errors.lossPostalCode}
                    </small>
                  )}
                </label>
              </div>
            </>
          )}
        </div>
      </div>

      {actions && <div className='claim-form__section-actions'>{actions}</div>}
    </section>
  );
}

export default WhatHappenedSection;

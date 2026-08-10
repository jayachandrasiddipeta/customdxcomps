import type { ClaimFormData, ClaimItem } from '../types';
import { useEffect, useState } from 'react';
import InfoIcon from './InfoIcon';
import FieldInfo from './FieldInfo';
import DateTextInput from './DateTextInput';
import type { ListOption } from '../utils/listValuesUtils';
import type { LocalizationMap } from '../utils/useLocalization';
import { validateItems } from '../utils/claimFormValidation';
import { formatDateForDisplay, getDateFormat, normalizeDisplayDate } from '../utils/dateUtils';
import { Icon } from '@pega/cosmos-react-core';

interface ItemsAffectedSectionProps {
  formData: ClaimFormData;
  onItemsChange: (items: ClaimItem[]) => void;
  itemTypeOptions: ListOption[];
  itemCoverTypeOptions: ListOption[];
  l: LocalizationMap;
  actions?: React.ReactNode;
}

const createBlankItem = (): ClaimItem => ({
  id: `${Date.now()}-${Math.random()}`,
  itemCoverType: '',
  itemType: '',
  itemDescription: '',
  purchasePrice: '',
  claimedAmount: '',
  datePurchased: ''
});

function ItemsAffectedSection({
  formData,
  onItemsChange,
  itemTypeOptions,
  itemCoverTypeOptions,
  l,
  actions
}: ItemsAffectedSectionProps) {
  const maxItems = Number(l['MaxItemsCount']) || 20;
  const [showInfo, setShowInfo] = useState(false);
  const [itemsLimitError, setItemsLimitError] = useState('');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draftItem, setDraftItem] = useState<ClaimItem>(createBlankItem());
  const [draftErrors, setDraftErrors] = useState<Record<string, string>>({});
  const [justSaved, setJustSaved] = useState(false);
  const [toastFading, setToastFading] = useState(false);

  // Auto-dismiss the "Item saved" toast after 5 seconds, fading out over the last 400ms.
  const TOAST_FADE_MS = 400;
  const TOAST_VISIBLE_MS = 5000;
  useEffect(() => {
    if (!justSaved) return;
    setToastFading(false);
    const fadeTimer = setTimeout(() => setToastFading(true), TOAST_VISIBLE_MS - TOAST_FADE_MS);
    const removeTimer = setTimeout(() => setJustSaved(false), TOAST_VISIBLE_MS);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [justSaved]);

  const openAddForm = () => {
    if (formData.items.length >= maxItems) {
      setItemsLimitError(
        String(l['ErrMaxItemsReached']).replace('{1}', String(maxItems))
      );
      return;
    }
    setItemsLimitError('');
    setDraftItem(createBlankItem());
    setDraftErrors({});
    setEditingIndex(null);
    setJustSaved(false);
    setIsFormOpen(true);
  };

  const openEditForm = (index: number) => {
    setDraftItem({ ...formData.items[index] });
    setDraftErrors({});
    setEditingIndex(index);
    setJustSaved(false);
    setIsFormOpen(true);
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingIndex(null);
    setDraftErrors({});
  };

  const handleDraftFieldChange = (field: keyof ClaimItem, value: string) => {
    setDraftItem(prev => ({ ...prev, [field]: value }));
    setDraftErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleDraftFieldBlur = (field: keyof ClaimItem) => {
    let itemForValidation = draftItem;
    if (field === 'datePurchased') {
      const format = getDateFormat(l);
      const raw = draftItem.datePurchased?.trim() ?? '';
      const normalized = raw ? normalizeDisplayDate(raw, format) : '';
      if (normalized !== draftItem.datePurchased) {
        itemForValidation = { ...draftItem, datePurchased: normalized };
        setDraftItem(itemForValidation);
      }
    }
    const [fieldErrors] = validateItems([itemForValidation], formData, l);
    setDraftErrors(prev => ({ ...prev, [field]: fieldErrors?.[field] || '' }));
  };

  const handleSave = () => {
    const format = getDateFormat(l);
    const itemToSave = {
      ...draftItem,
      datePurchased: draftItem.datePurchased?.trim()
        ? normalizeDisplayDate(draftItem.datePurchased, format)
        : ''
    };
    const [fieldErrors] = validateItems([itemToSave], formData, l);
    if (fieldErrors && Object.keys(fieldErrors).length > 0) {
      setDraftItem(itemToSave);
      setDraftErrors(fieldErrors);
      return;
    }

    if (editingIndex === null) {
      onItemsChange([...formData.items, itemToSave]);
    } else {
      const updated = [...formData.items];
      updated[editingIndex] = itemToSave;
      onItemsChange(updated);
    }

    setIsFormOpen(false);
    setEditingIndex(null);
    setDraftErrors({});
    setJustSaved(true);
  };

  const removeItem = (index: number) => {
    const updated = [...formData.items];
    updated.splice(index, 1);
    onItemsChange(updated);
    setJustSaved(false);
    if (updated.length < maxItems) {
      setItemsLimitError('');
    }
  };

  const getItemTitle = (item: ClaimItem): string =>
    item.itemDescription?.trim() ||
    itemTypeOptions.find(opt => opt.key === item.itemType)?.label ||
    `${l['Item Type']} ${item.itemType}`.trim();

  const totalClaimedAmount = formData.items.reduce(
    (sum, item) => sum + (parseFloat(item.claimedAmount) || 0),
    0
  );

  const totalPurchaseAmount = formData.items.reduce(
    (sum, item) => sum + (parseFloat(item.purchasePrice) || 0),
    0
  );

  const isTotalInvalid = totalClaimedAmount > totalPurchaseAmount;

  return (
    <section className='claim-form__section claim-form__items-section'>
      <h3 className='claim-form__section-title claim-form__title-with-icon'>
        <span className="claim-form__item-saved-toast-anchor">
          {l['Items Affected']}
          <button
            type="button"
            className="claim-form__info-icon"
            onClick={() => setShowInfo(prev => !prev)}
            aria-label={showInfo ? String(l['HideInfoLabel']) : String(l['ShowInfoLabel'])}
            aria-expanded={showInfo}
            aria-controls="items-affected-info-box"
          >
            <InfoIcon />
          </button>
        </span>
      </h3>
      <div className="claim-form__info-box" id="items-affected-info-box" hidden={!showInfo}>
        <div className="claim-form__info-left">
          <div className="claim-form__info-box-icon">
            <InfoIcon />
          </div>
          <div className="claim-form__info-content">
            {l['ItemsAffectedInstruction']}
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

      {/* Saved items */}
      {formData.items.length > 0 && (
        <div className="claim-form__group">
          <h3 className="claim-form__section-title claim-form__section-title--secondary">
            {l['Saved Items']}
          </h3>
          <p className="claim-form__section-description">{l['SavedItemsDescription']}</p>

          {formData.items.map((item, index) => (
            <div key={item.id} className="claim-form__saved-item">
              <div>
                <span className="claim-form__saved-item-title">{getItemTitle(item)}</span>
                <span className="claim-form__saved-item-subtitle">
                  <span>{l['PurchasedLabel']} {formatDateForDisplay(item.datePurchased, getDateFormat(l)) || item.datePurchased}</span>
                  <span>{l['ClaimedLabel']} £{item.claimedAmount}</span>
                </span>
              </div>
              <div className="claim-form__saved-item-actions">
                <button
                  type="button"
                  className="claim-form__saved-item-edit"
                  onClick={() => openEditForm(index)}
                >
                  {l['Edit']}
                </button>
                <button
                  type="button"
                  className="claim-form__saved-item-remove"
                  onClick={() => removeItem(index)}
                >
                  {l['Remove']}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isFormOpen ? (
        <div className="claim-form__group">
          <div className="claim-form__item-form-header">
            <div>
              <h3 className="claim-form__section-title claim-form__section-title--secondary">
                {editingIndex === null ? l['Add new item'] : l['Edit item']}
              </h3>
              <p className="claim-form__section-description">
                {editingIndex === null ? l['AddNewItemDescription'] : l['EditItemDescription']}
              </p>
            </div>
            <button
              type="button"
              className="claim-form__item-form-close"
              onClick={handleCancel}
              aria-label={l['Cancel']}
            >
              ×
            </button>
          </div>

          <div className="claim-form__grid">
            {/* ITEM COVER TYPE */}
            <label className="claim-form__field claim-form__field--full">
              <span className="claim-form__field-label-row">
                {l['Item Cover Type']}
                <span className="claim-form__required-star">*</span>
                <FieldInfo text={l['ItemCoverTypeFieldInfo']} l={l} />
              </span>
              <select
                value={draftItem.itemCoverType}
                onChange={e => handleDraftFieldChange('itemCoverType', e.target.value)}
                onBlur={() => handleDraftFieldBlur('itemCoverType')}
                aria-required="true"
              >
                <option value="">{l['SelectItemCoverTypePH']}</option>
                {itemCoverTypeOptions.map(opt => (
                  <option key={opt.key} value={opt.key}>{opt.label}</option>
                ))}
              </select>
              {draftErrors.itemCoverType && (
                <div className="claim-form__error">{draftErrors.itemCoverType}</div>
              )}
            </label>

            {/* The remaining fields only make sense once a cover type has been chosen */}
            {draftItem.itemCoverType && (
              <>
                {/* ITEM TYPE */}
                <label className="claim-form__field">
                  <span className="claim-form__field-label-row">
                    {l['Item Type']}
                    <span className="claim-form__required-star">*</span>
                    <FieldInfo text={l['ItemTypeFieldInfo']} l={l} />
                  </span>
                  <select
                    value={draftItem.itemType}
                    onChange={e => handleDraftFieldChange('itemType', e.target.value)}
                    onBlur={() => handleDraftFieldBlur('itemType')}
                    aria-required="true"
                  >
                    <option value="">{l['SelectItemTypePH' as keyof LocalizationMap]}</option>
                    {itemTypeOptions.map(opt => (
                      <option key={opt.key} value={opt.key}>{opt.label}</option>
                    ))}
                  </select>
                  {draftErrors.itemType && (
                    <div className="claim-form__error">{draftErrors.itemType}</div>
                  )}
                </label>

                {/* DESCRIPTION */}
                <label className="claim-form__field">
                  <span>{l['Item Description']} <span className="claim-form__required-star">*</span></span>
                  <input
                    type="text"
                    placeholder={l['ItemDescPH']}
                    maxLength={l['ItemDescriptionMaxLength']}
                    value={draftItem.itemDescription}
                    onChange={e => handleDraftFieldChange('itemDescription', e.target.value)}
                    onBlur={() => handleDraftFieldBlur('itemDescription')}
                    aria-required="true"
                  />
                  {draftErrors.itemDescription && (
                    <small className="claim-form__error" role="alert">
                      {draftErrors.itemDescription}
                    </small>
                  )}
                </label>

                {/* DATE PURCHASED */}
                <label className="claim-form__field">
                  <span>{l['Date Purchased']} <span className="claim-form__required-star">*</span></span>
                  <DateTextInput
                    value={draftItem.datePurchased || ''}
                    onChange={v => handleDraftFieldChange('datePurchased', v)}
                    onBlur={() => handleDraftFieldBlur('datePurchased')}
                    l={l}
                    aria-required="true"
                  />
                  {draftErrors.datePurchased && (
                    <div className="claim-form__error">{draftErrors.datePurchased}</div>
                  )}
                </label>

                {/* PURCHASE PRICE */}
                <label className="claim-form__field">
                  <span className="claim-form__field-label-row">
                    {l['Purchase Price']}
                    <span className="claim-form__required-star">*</span>
                    <FieldInfo text={l['PurchasePriceFieldInfo']} l={l} />
                  </span>
                  <input
                    placeholder={l['AmountPH']}
                    value={draftItem.purchasePrice}
                    onChange={e =>
                      handleDraftFieldChange(
                        'purchasePrice',
                        e.target.value.replace(/[^\d.]/g, '').replace(/(\..*)\./g, '$1')
                      )
                    }
                    onBlur={() => handleDraftFieldBlur('purchasePrice')}
                    aria-required="true"
                  />
                  {draftErrors.purchasePrice && (
                    <div className="claim-form__error">{draftErrors.purchasePrice}</div>
                  )}
                </label>

                {/* CLAIMED AMOUNT */}
                <label className="claim-form__field">
                  <span className="claim-form__field-label-row">
                    {l['Claimed Amount']}
                    <span className="claim-form__required-star">*</span>
                    <FieldInfo text={l['ClaimedAmountFieldInfo']} l={l} />
                  </span>
                  <input
                    placeholder={l['AmountPH']}
                    value={draftItem.claimedAmount}
                    onChange={e =>
                      handleDraftFieldChange(
                        'claimedAmount',
                        e.target.value.replace(/[^\d.]/g, '').replace(/(\..*)\./g, '$1')
                      )
                    }
                    onBlur={() => handleDraftFieldBlur('claimedAmount')}
                    aria-required="true"
                  />
                  {draftErrors.claimedAmount && (
                    <div className="claim-form__error">{draftErrors.claimedAmount}</div>
                  )}
                </label>
              </>
            )}
          </div>

          <div className="claim-form__item-form-actions">
            <button
              type="button"
              className="claim-form__button claim-form__button--secondary"
              onClick={handleCancel}
            >
              {l['Cancel']}
            </button>
            <button
              type="button"
              className="claim-form__button claim-form__button--primary"
              onClick={handleSave}
            >
              {l['Save item']}
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* "Item saved" toast — placed above the Add item button, fading out on
              its own before disappearing. */}
          {justSaved && (
            <div
              className={`claim-form__item-saved-toast${toastFading ? ' claim-form__item-saved-toast--fade-out' : ''}`}
              role="status"
            >
              <span className="claim-form__item-saved-banner-icon">
                <Icon name="check" size="s" />
              </span>
              {l['Item saved']}
            </div>
          )}

          <div
            className="claim-form__add-item"
            role="button"
            tabIndex={0}
            onClick={openAddForm}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openAddForm();
              }
            }}
          >
            <span className="claim-form__add-item-text">
              <Icon name="plus" size="s" />
              {formData.items.length > 0 ? l['AddAnotherItem'] : l['Add item']}
            </span>
          </div>
        </>
      )}

      {itemsLimitError && (
        <div className="claim-form__error" style={{ marginTop: '8px' }}>
          {itemsLimitError}
        </div>
      )}

      {/* ✅ CLAIM SUMMARY */}
      <div className="claim-form__summary">
        <h4 className="claim-form__summary-title">{l['ClaimSummary']}</h4>
        <p className="claim-form__section-description">{l['ClaimSummaryDescription']}</p>

        <div className="claim-form__summary-section">
          <div className="claim-form__summary-label">{l['ItemsIncluded']}</div>
          {formData.items.length > 0 ? (
            <ul className="claim-form__summary-list">
              {formData.items.map((item, index) => (
                <li key={item.id}>
                  {item.itemType
                    ? itemTypeOptions.find(opt => opt.key === item.itemType)?.label
                      || String(l['ReviewItemNumberLabel']).replace('{1}', String(index + 1))
                    : String(l['ReviewItemNumberLabel']).replace('{1}', String(index + 1))}
                </li>
              ))}
            </ul>
          ) : (
            <div className="claim-form__summary-value">{l['NoItemsSavedYet']}</div>
          )}
        </div>

        <hr className="claim-form__summary-divider" />

        <div className="claim-form__summary-section claim-form__summary-totals-row">
          <div className="claim-form__summary-total-block">
            <div className="claim-form__summary-label">{l['TotalPurchaseValue']}</div>
            <div className="claim-form__summary-total">
              £{totalPurchaseAmount.toFixed(2)}
            </div>
          </div>

          <div className="claim-form__summary-total-block">
            <div className="claim-form__summary-label">{l['TotalClaimValue']}</div>
            <div className="claim-form__summary-total">
              £{totalClaimedAmount.toFixed(2)}
            </div>
          </div>
        </div>

        {isTotalInvalid && (
          <div className="claim-form__error">
            {l['ErrTotalClaimExceeds']}
          </div>
        )}
      </div>

      {actions && <div className="claim-form__section-actions">{actions}</div>}
    </section>
  );
}

export default ItemsAffectedSection;

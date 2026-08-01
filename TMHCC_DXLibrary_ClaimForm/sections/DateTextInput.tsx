import { DateInput } from '@pega/cosmos-react-core';
import type { LocalizationMap } from '../utils/useLocalization';
import {
  formatDateForDisplay,
  getDateFormat,
  getDateFormatPlaceholder,
  toIsoDate
} from '../utils/dateUtils';

interface DateTextInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  l: LocalizationMap;
  id?: string;
  'aria-required'?: boolean | 'true' | 'false';
  'aria-invalid'?: boolean | 'true' | 'false';
  'aria-describedby'?: string;
  className?: string;
}

/**
 * Cosmos DateInput (segmented day/month/year controls + calendar picker) instead of
 * a native <input type="date">, since native date inputs ignore custom placeholder
 * text and always show the browser's own locale-based hint. Form state stays in the
 * localization-driven display format (DateFormat); Cosmos gets/returns plain ISO dates.
 */
function DateTextInput({
  value,
  onChange,
  onBlur,
  l,
  id,
  className,
  ...aria
}: DateTextInputProps) {
  const format = getDateFormat(l);
  const isoValue = toIsoDate(value, format) || undefined;
  const isRequired = aria['aria-required'] === true || aria['aria-required'] === 'true';
  const isInvalid = aria['aria-invalid'] === true || aria['aria-invalid'] === 'true';

  return (
    <DateInput
      id={id}
      className={className}
      value={isoValue}
      info={getDateFormatPlaceholder(l)}
      required={isRequired}
      status={isInvalid ? 'error' : undefined}
      aria-describedby={aria['aria-describedby']}
      onChange={({ valueAsISOString }) => {
        const isoDate = valueAsISOString ? valueAsISOString.slice(0, 10) : '';
        onChange(isoDate ? formatDateForDisplay(isoDate, format) : '');
      }}
      onBlur={onBlur ? () => onBlur() : undefined}
    />
  );
}

export default DateTextInput;

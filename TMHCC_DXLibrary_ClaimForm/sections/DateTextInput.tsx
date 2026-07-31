import type { LocalizationMap } from '../utils/useLocalization';
import {
  formatDateForDisplay,
  getDateFormat,
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
 * Native date picker only (no typed entry). Browser value is yyyy-MM-dd;
 * form state is kept in the localization-driven display format (DateFormat).
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
  const isoValue = toIsoDate(value, format) || '';

  return (
    <input
      id={id}
      type='date'
      value={isoValue}
      className={className}
      onChange={e => {
        const iso = e.target.value;
        onChange(iso ? formatDateForDisplay(iso, format) : '');
      }}
      onBlur={onBlur}
      onKeyDown={e => e.preventDefault()}
      onPaste={e => e.preventDefault()}
      onDrop={e => e.preventDefault()}
      {...aria}
    />
  );
}

export default DateTextInput;

import type { LocalizationMap } from './useLocalization';

/** Default display/intake format when localization is unavailable. */
export const DEFAULT_DATE_FORMAT = 'dd/MM/yyyy';

/** Canonical storage format used when talking to Pega REST APIs. */
export const ISO_DATE_FORMAT = 'yyyy-MM-dd';

export const getDateFormat = (l: LocalizationMap): string =>
  String(l['DateFormat'] || DEFAULT_DATE_FORMAT).trim() || DEFAULT_DATE_FORMAT;

export const getDateFormatPlaceholder = (l: LocalizationMap): string =>
  String(l['DateFormatPlaceholder'] || l['DateFormat'] || DEFAULT_DATE_FORMAT);

const pad2 = (n: number): string => String(n).padStart(2, '0');

/** Today's date as yyyy-MM-dd (UTC-date avoided — uses local calendar day). */
export const todayIso = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`;
};

/** Today's date, `years` years back, as yyyy-MM-dd. */
export const yearsAgoIso = (years: number): string => {
  const [year, month, day] = todayIso().split('-');
  return `${Number(year) - years}-${month}-${day}`;
};

const isValidYmd = (year: number, month: number, day: number): boolean => {
  if (year < 1000 || year > 9999 || month < 1 || month > 12 || day < 1 || day > 31) return false;
  const dt = new Date(year, month - 1, day);
  return dt.getFullYear() === year && dt.getMonth() === month - 1 && dt.getDate() === day;
};

const isoFromParts = (year: number, month: number, day: number): string | null =>
  isValidYmd(year, month, day) ? `${year}-${pad2(month)}-${pad2(day)}` : null;

const DATE_SEPARATORS = ['/', '-', '.'];

/** Separator used by a format string (e.g. "/" for dd/MM/yyyy), defaulting to "/". */
const getSeparator = (format: string): string =>
  DATE_SEPARATORS.find(candidate => format.includes(candidate)) ?? '/';

/**
 * Parse a date string in the configured display format (or ISO) into yyyy-MM-dd.
 * Returns null when the value is empty or not a real calendar date.
 */
export const toIsoDate = (value: string, format: string = DEFAULT_DATE_FORMAT): string | null => {
  const trimmed = value.trim();
  if (!trimmed) return null;

  // Already ISO
  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (isoMatch) {
    return isoFromParts(Number(isoMatch[1]), Number(isoMatch[2]), Number(isoMatch[3]));
  }

  const sep = getSeparator(format);
  const formatParts = format.split(sep);
  const valueParts = trimmed.split(sep);
  if (formatParts.length !== 3 || valueParts.length !== 3) return null;

  const map: Record<string, number> = {};
  for (let i = 0; i < 3; i += 1) {
    const token = formatParts[i];
    const num = Number(valueParts[i]);
    if (!Number.isFinite(num)) return null;
    map[token] = num;
  }

  const day = map.dd ?? map.d;
  const month = map.MM ?? map.M;
  const year = map.yyyy ?? map.yy;
  if (day == null || month == null || year == null) return null;

  const fullYear = year < 100 ? 2000 + year : year;
  return isoFromParts(fullYear, month, day);
};

/** Format an ISO or display-format date string into the configured display format. */
export const formatDateForDisplay = (
  value: string,
  format: string = DEFAULT_DATE_FORMAT
): string => {
  const iso = toIsoDate(value, format);
  if (!iso) return value?.trim() || '';

  const [year, month, day] = iso.split('-');
  return format
    .replace(/yyyy/g, year)
    .replace(/dd/g, day)
    .replace(/MM/g, month);
};

export const isValidDisplayDate = (value: string, format: string = DEFAULT_DATE_FORMAT): boolean =>
  Boolean(toIsoDate(value, format));

/** Compare two dates in display or ISO form. Returns negative / 0 / positive like localeCompare. */
export const compareDates = (
  a: string,
  b: string,
  format: string = DEFAULT_DATE_FORMAT
): number => {
  const isoA = toIsoDate(a, format);
  const isoB = toIsoDate(b, format);
  if (!isoA || !isoB) return 0;
  if (isoA < isoB) return -1;
  return isoA > isoB ? 1 : 0;
};

export const isFutureDate = (value: string, format: string = DEFAULT_DATE_FORMAT): boolean => {
  const iso = toIsoDate(value, format);
  if (!iso) return false;
  return iso > todayIso();
};

/** Whether a birth date (display or ISO form) is at least `years` old as of today. */
export const isAtLeastAge = (
  value: string,
  years: number,
  format: string = DEFAULT_DATE_FORMAT
): boolean => {
  const iso = toIsoDate(value, format);
  if (!iso) return false;
  const [birthYear, birthMonth, birthDay] = iso.split('-').map(Number);
  const [todayYear, todayMonth, todayDay] = todayIso().split('-').map(Number);
  const hadBirthdayThisYear = todayMonth > birthMonth || (todayMonth === birthMonth && todayDay >= birthDay);
  const age = todayYear - birthYear - (hadBirthdayThisYear ? 0 : 1);
  return age >= years;
};

/**
 * Restrict typing for dd/MM/yyyy-style formats: digits only, auto-insert separators.
 * For other formats, returns the raw value unchanged (aside from trimming length).
 */
export const applyDateInputMask = (raw: string, format: string = DEFAULT_DATE_FORMAT): string => {
  if (format !== 'dd/MM/yyyy' && format !== 'dd-MM-yyyy' && format !== 'dd.MM.yyyy') {
    return raw;
  }
  const sep = getSeparator(format);
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}${sep}${digits.slice(2)}`;
  return `${digits.slice(0, 2)}${sep}${digits.slice(2, 4)}${sep}${digits.slice(4)}`;
};

/** Normalize a valid date to the canonical display format (e.g. pad day/month). */
export const normalizeDisplayDate = (
  value: string,
  format: string = DEFAULT_DATE_FORMAT
): string => {
  const iso = toIsoDate(value, format);
  return iso ? formatDateForDisplay(iso, format) : value.trim();
};
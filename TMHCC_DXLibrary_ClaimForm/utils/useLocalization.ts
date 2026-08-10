import { useMemo, useCallback } from 'react';
import localizations from '../localizations.json';

export type LocalizationMap = typeof localizations.fields;

export function useGetLocalizedText(getPConnect: (() => any) | undefined) {
  return useCallback((key: string, args?: any[]): string => {
    try {
      const locService = typeof getPConnect === 'function'
        ? getPConnect()?.getLocalizationService?.()
        : null;
      if (locService?.getLocalizedText) {
        return locService.getLocalizedText(key, args) ?? key;
      }
    } catch {
      // fall through to JSON defaults
    }
    const defaults = localizations.fields as unknown as Record<string, string>;
    let text = defaults[key] ?? key;
    if (args) {
      args.forEach((arg, i) => { text = text.replace(`{${i + 1}}`, String(arg)); });
    }
    return text;
  }, [getPConnect]);
}

export function useLocalization(getPConnect: (() => any) | undefined): LocalizationMap {
  return useMemo(() => {
    const defaults = localizations.fields as LocalizationMap;
    try {
      const locService = typeof getPConnect === 'function'
        ? getPConnect()?.getLocalizationService?.()
        : null;
      if (!locService?.getLocalizedText) return defaults;
      const result = { ...defaults };
      for (const key of Object.keys(defaults) as (keyof LocalizationMap)[]) {
        const translated: string | null | undefined = locService.getLocalizedText(key);
        if (translated != null) {
          const defaultVal = defaults[key];
          if (typeof defaultVal === 'number') {
            const num = Number(translated);
            (result as Record<keyof LocalizationMap, string | number>)[key] = isNaN(num) ? defaultVal : num;
          } else {
            (result as Record<keyof LocalizationMap, string | number>)[key] = translated;
          }
        }
      }
      return result;
    } catch {
      return defaults;
    }
  }, [getPConnect]);
}

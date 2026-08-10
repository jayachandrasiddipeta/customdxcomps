export const isSafeUrl = (url: string): boolean => {
  try { return new URL(url).protocol === 'https:'; } catch { return false; }
};

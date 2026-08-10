const HTML_TAG_PATTERN = /<([a-z][a-z0-9]*)\b[^>]*>/i;

/** True when a Pega-sourced message string contains real markup rather than plain text. */
export const isHtmlContent = (value: string): boolean => HTML_TAG_PATTERN.test(value);
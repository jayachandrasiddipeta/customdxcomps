import { css } from 'styled-components';

import type { FormStyleConfig } from '../types';
import { personaStyles } from './personaStyles';
import { themeStyles } from './themeStyles';

const emptyStyle = css``;

export const resolveVariantStyles = ({ styleVariant, styleMode }: FormStyleConfig) => {
  if (styleVariant === 'persona') {
    return personaStyles[styleMode] || personaStyles.standard || emptyStyle;
  }

  return themeStyles[styleMode] || themeStyles.default || emptyStyle;
};

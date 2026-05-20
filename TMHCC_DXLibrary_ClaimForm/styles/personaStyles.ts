import { css } from 'styled-components';

export const personaStyles: Record<string, ReturnType<typeof css>> = {
  standard: css``,
  broker: css`
    .claim-form__section {
      border-color: #1d4ed8;
    }

    .claim-form__title {
      color: #1d4ed8;
    }
  `,
  customer: css`
    .claim-form__section {
      border-radius: 12px;
      background: #f8fafc;
    }

    .claim-form__title {
      color: #0f766e;
    }
  `
};

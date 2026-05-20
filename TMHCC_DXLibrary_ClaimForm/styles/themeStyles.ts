import { css } from 'styled-components';

export const themeStyles: Record<string, ReturnType<typeof css>> = {
  default: css``,
  dark: css`
    .claim-form {
      background: #0f172a;
    }

    .claim-form__section {
      background: #1e293b;
      border-color: #334155;
      box-shadow: none;
    }

    .claim-form__section-title,
    .claim-form__subheading {
      color: #e2e8f0;
    }

    .claim-form__field {
      color: #cbd5e1;
    }

    .claim-form__field input,
    .claim-form__field select,
    .claim-form__field textarea {
      background: #0f172a;
      color: #e2e8f0;
      border-color: #475569;
    }

    .claim-form__field input::placeholder,
    .claim-form__field textarea::placeholder {
      color: #64748b;
    }
  `
};

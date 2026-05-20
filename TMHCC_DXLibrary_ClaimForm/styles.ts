import styled, { createGlobalStyle, css } from 'styled-components';
import { baseFormStyles } from './styles/baseStyles';
import { resolveVariantStyles } from './styles/styleResolver';
import type { FormStyleConfig } from './types';

export const ClaimFormGlobalStyles = createGlobalStyle`
  .claim-form__discard-modal {
    padding: 1rem;
    font-family: var(--pega-font-family, 'Open Sans', Arial, sans-serif);
  }

  .claim-form__discard-modal-text {
    margin: 0 0 1rem;
    color: #1f2937;
    font-size: 0.95rem;
  }

  .claim-form__discard-modal-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    gap: 1.5rem;
  }

  .claim-form__discard-modal .claim-form__button {
    border-radius: 4px !important;
    min-width: 140px;
    font-weight: 600 !important;
    border: 1px solid transparent;
    padding: 0.7rem 1.25rem;
    cursor: pointer;
    font-size: 1rem;
    line-height: 1;
    transition: background-color 0.2s ease, border-color 0.2s ease;
  }

  .claim-form__discard-modal .claim-form__button--primary {
    background: #111827 !important;
    color: #ffffff !important;
    border-color: #111827 !important;
  }

  .claim-form__discard-modal .claim-form__button--primary:hover:not(:disabled) {
    background: #374151 !important;
    border-color: #374151 !important;
  }

  .claim-form__discard-modal .claim-form__button--secondary {
    background: #ffffff !important;
    color: #374151 !important;
    border-color: #d1d5db !important;
  }

  .claim-form__discard-modal .claim-form__button--secondary:hover:not(:disabled) {
    background: #f9fafb !important;
    border-color: #9ca3af !important;
  }
`;

interface WrapperProps {
  styleConfig: FormStyleConfig;
}

export default styled.div<WrapperProps>(({ styleConfig }) => {
  return css`
    ${baseFormStyles}
    ${resolveVariantStyles(styleConfig)}
  `;
});

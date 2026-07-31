import styled, { createGlobalStyle } from 'styled-components';
import { baseFormStyles } from './styles/baseStyles';

export const ClaimFormGlobalStyles = createGlobalStyle`
  html, body {
    margin: 0;
    height: 100%;
    overflow: hidden;
  }

  @media (max-width: 900px) {
    html, body {
      height: auto;
      overflow: visible;
    }
  }

  /* Pega's own harness wraps this component in several nested containers that
     apply their own padding around it (not just the immediate parent — Pega's
     wrapper chain is several levels deep). We don't know those containers'
     class names (they're Pega's, not ours), so target them structurally via
     :has() instead of guessing selectors — this reaches every ancestor of our
     own root, wherever it's rendered, without touching anything else on the
     page (nothing outside this component's own ancestor chain contains
     #tmhcc-claim-form-root, so nothing else can match). */
  *:has(#tmhcc-claim-form-root) {
    padding: 0 !important;
  }

  .claim-form__discard-modal-box {
    width: 32rem !important;
    max-width: calc(100% - 2rem) !important;
    min-width: 0 !important;
  }

  /* Cosmos's Backdrop component is shared by every Modal, Popover and
     Progress (loading spinner) overlay, and they all get the same
     data-testid$=':backdrop:' pattern. Scope this override to only the
     backdrop that contains our own Discard/Cancel modal box, so it doesn't
     also paint solid black over unrelated loading backdrops (e.g. the one
     shown during file upload). */
  [data-testid$=':backdrop:']:has(.claim-form__discard-modal-box) {
    background: #000000 !important;
  }

  .claim-form__discard-modal {
    padding: 1rem;
    font-family: var(--pega-font-family, 'Open Sans', Arial, sans-serif);
  }

  .claim-form__discard-modal-text {
    margin: 0 0 2rem;
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
    border-radius: 10px !important;
    min-width: 140px;
    font-weight: 600 !important;
    border: 1px solid transparent;
    padding: 0.7rem 1.25rem;
    cursor: pointer;
    font-size: 1rem;
    line-height: 1;
    transition: background-color 0.2s ease, border-color 0.2s ease;
  }

  .claim-form__discard-modal .claim-form__button--cancel {
    background: #b91c1c !important;
    color: #ffffff !important;
    border-color: #b91c1c !important;
  }

  .claim-form__discard-modal .claim-form__button--cancel:hover:not(:disabled) {
    background: #991b1b !important;
    border-color: #991b1b !important;
  }

  .claim-form__discard-modal .claim-form__button--secondary {
    background: #ffffff !important;
    color: #1a3d6b !important;
    border-color: #1a3d6b !important;
  }

  .claim-form__discard-modal .claim-form__button--secondary:hover:not(:disabled) {
    background: #f0f4fa !important;
  }
`;

export default styled.div`
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  font-family: var(--pega-font-family, 'Open Sans', Arial, sans-serif);
  ${baseFormStyles}

  @media (max-width: 900px) {
    height: auto;
    overflow: visible;
  }
`;

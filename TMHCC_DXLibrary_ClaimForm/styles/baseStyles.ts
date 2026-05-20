import { css } from 'styled-components';

export const baseFormStyles = css`
  /* ── Two-column page layout ── */
  .claim-form-page {
    display: flex;
    width: 100%;
    min-height: 100vh;
  }

  .claim-form-page__image {
    flex: 0 0 50%;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-color: #f1f5f9;
  }

  .claim-form-page__panel {
    flex: 0 0 50%;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }

  /* ── Step navigation ── */
  .claim-form__step-nav {
    background: #ffffff;
    padding: 1rem 1.25rem;
    display: flex;
    gap: 0.5rem;
    flex-shrink: 0;
    border-bottom: 2px dashed #e5e7eb;
  }

  .claim-form__step-card {
    flex: 1;
    min-width: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.65rem 0.9rem;
    gap: 0.5rem;
    border-radius: 6px;
  }

  .claim-form__step-card--clickable {
    cursor: pointer;
  }

  .claim-form__step-card--complete {
    background: #111827;
  }

  .claim-form__step-card--current {
    background: #6b7280;
  }

  .claim-form__step-card--upcoming {
    background: #f3f4f6;
  }

  .claim-form__step-card-info {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
  }

  .claim-form__step-card-label {
    font-size: 0.6rem;
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .claim-form__step-card--complete .claim-form__step-card-label,
  .claim-form__step-card--current .claim-form__step-card-label {
    color: rgba(255, 255, 255, 0.65);
  }

  .claim-form__step-card--upcoming .claim-form__step-card-label {
    color: #9ca3af;
  }

  .claim-form__step-card-name {
    font-size: 0.8rem;
    font-weight: 600;
    white-space: normal;
    word-break: break-word;
    line-height: 1.2;
  }

  .claim-form__step-card--complete .claim-form__step-card-name,
  .claim-form__step-card--current .claim-form__step-card-name {
    color: #ffffff;
  }

  .claim-form__step-card--upcoming .claim-form__step-card-name {
    color: #374151;
  }

  .claim-form__step-card-icon {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.72rem;
    font-weight: 700;
  }

  .claim-form__step-card--complete .claim-form__step-card-icon {
    background: #4b5563;
    color: #ffffff;
  }

  .claim-form__step-card--current .claim-form__step-card-icon {
    background: #9ca3af;
    color: #ffffff;
  }

  .claim-form__step-card--upcoming .claim-form__step-card-icon {
    border: 2px solid #d1d5db;
  }

  /* ── Form body ── */
  .claim-form {
    flex: 1;
    background: #f3f4f6;
    padding: 1.5rem;
    font-family: var(--pega-font-family, 'Open Sans', Arial, sans-serif);
  }

  /* ── Sections ── */
  .claim-form__section {
    margin-bottom: 1rem;
    padding: 1.25rem;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background: #ffffff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  }

  .claim-form__section-title {
    margin: 0 0 1rem;
    font-size: 0.95rem;
    color: #111827;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 700;
  }

  .claim-form__section-index {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    font-weight: 700;
    background: #111827;
    color: #ffffff;
    flex-shrink: 0;
  }

  .claim-form__subheading {
    font-size: 0.8rem;
    font-weight: 600;
    color: #374151;
    padding: 0.5rem 0 0.375rem;
    border-bottom: 1px solid #e5e7eb;
    margin-bottom: 0.25rem;
  }

  /* ── Grid & fields ── */
  .claim-form__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }

  .claim-form__field {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    font-size: 0.8rem;
    color: #374151;
    font-weight: 500;
  }

  .claim-form__field--full {
    grid-column: 1 / -1;
  }

  .claim-form__field input,
  .claim-form__field select,
  .claim-form__field textarea {
    width: 100%;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    padding: 0.625rem 0.75rem;
    font-size: 0.875rem;
    background: #ffffff;
    color: #111827;
    box-sizing: border-box;
    font-family: inherit;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }

  .claim-form__field input:focus,
  .claim-form__field select:focus,
  .claim-form__field textarea:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
  }

  .claim-form__field select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%236b7280'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    background-color: #ffffff;
    padding-right: 2rem;
    cursor: pointer;
  }

  .claim-form__field select option {
    background: #ffffff;
    color: #111827;
  }

  .claim-form__field input::placeholder,
  .claim-form__field textarea::placeholder {
    color: #9ca3af;
    font-weight: 400;
  }

  .claim-form__required-star {
    color: #ef4444;
    margin-left: 0.1em;
  }

  .claim-form__error {
    color: #ef4444;
    font-size: 0.75rem;
    font-weight: 400;
  }

  .claim-form__hint {
    color: #6b7280;
    font-size: 0.72rem;
    font-weight: 400;
  }

  /* ── File upload ── */
  .claim-form__upload-dropzone {
    border: 2px dashed #d1d5db;
    min-height: 120px;
    padding: 1.25rem;
    border-radius: 8px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.35rem;
    color: #6b7280;
    position: relative;
    background: #f9fafb;
    transition: border-color 0.15s ease;
  }

  .claim-form__upload-dropzone:hover {
    border-color: #9ca3af;
  }

  .claim-form__file-input {
    opacity: 0;
    position: absolute;
    inset: 0;
    cursor: pointer;
  }

  .claim-form__upload-title {
    margin: 0;
    font-size: 0.875rem;
    color: #374151;
    font-weight: 500;
  }

  .claim-form__upload-subtitle {
    margin: 0;
    font-size: 0.75rem;
    color: #9ca3af;
  }

  .claim-form__file-list {
    margin-top: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .claim-form__file-list-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    padding: 0.4rem 0.6rem;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    background: #f9fafb;
    font-size: 0.8rem;
    color: #374151;
  }

  .claim-form__delete-file {
    border: none;
    background: transparent;
    color: #9ca3af;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.2rem;
  }

  .claim-form__delete-file:hover {
    color: #ef4444;
  }

  /* ── Attachment cards ── */
  .claim-form__attachment-list {
    margin-top: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .claim-form__attachment-card {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background: #ffffff;
    padding: 0.75rem 1rem;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  }

  .claim-form__attachment-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .claim-form__attachment-card-name {
    font-size: 0.825rem;
    font-weight: 600;
    color: #111827;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
  }

  .claim-form__attachment-card-delete {
    border: none;
    background: transparent;
    color: #9ca3af;
    cursor: pointer;
    font-size: 0.8rem;
    line-height: 1;
    padding: 0.2rem 0.3rem;
    border-radius: 4px;
    flex-shrink: 0;
    transition: color 0.15s ease, background-color 0.15s ease;
  }

  .claim-form__attachment-card-delete:hover {
    color: #ef4444;
    background: #fef2f2;
  }

  .claim-form__attachment-card-meta {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .claim-form__attachment-card-type {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    font-size: 0.72rem;
    font-weight: 500;
    color: #6b7280;
  }

  .claim-form__attachment-card-type select {
    width: 100%;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    padding: 0.4rem 2rem 0.4rem 0.6rem;
    font-size: 0.8rem;
    background: #f9fafb;
    color: #111827;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%236b7280'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.6rem center;
    cursor: pointer;
    font-family: inherit;
  }

  .claim-form__attachment-card-type select:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
  }

  .claim-form__attachment-card-size {
    font-size: 0.75rem;
    color: #9ca3af;
    white-space: nowrap;
    flex-shrink: 0;
  }

  /* ── Consent ── */
  .claim-form__consent-box {
    margin-top: 1rem;
    padding: 0.875rem;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    display: flex;
    align-items: flex-start;
    gap: 0.625rem;
    color: #374151;
    font-size: 0.8rem;
    background: #f9fafb;
    line-height: 1.5;
  }

  /* ── Actions ── */
  .claim-form__actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1.5rem;
    gap: 1rem;
  }

  .claim-form .claim-form__button {
    border-radius: 6px !important;
    min-width: 120px;
    font-weight: 600 !important;
    border: 1px solid transparent;
    padding: 0.65rem 1.5rem;
    cursor: pointer;
    font-size: 0.875rem;
    line-height: 1;
    transition: background-color 0.15s ease, border-color 0.15s ease, opacity 0.2s ease;
  }

  .claim-form .claim-form__button--primary {
    background: #111827 !important;
    color: #ffffff !important;
    border-color: #111827 !important;
  }

  .claim-form .claim-form__button--primary:hover:not(:disabled) {
    background: #374151 !important;
    border-color: #374151 !important;
  }

  .claim-form .claim-form__button-content {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
  }

  .claim-form .claim-form__button-icon-circle {
    width: 1.1rem;
    height: 1.1rem;
    border-radius: 9999px;
    border: 1px solid rgba(255, 255, 255, 0.6);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 0;
  }

  .claim-form .claim-form__button--secondary {
    background: #ffffff !important;
    color: #374151 !important;
    border-color: #d1d5db !important;
  }

  .claim-form .claim-form__button--secondary:hover:not(:disabled) {
    background: #f9fafb !important;
    border-color: #9ca3af !important;
  }

  .claim-form .claim-form__button:disabled {
    opacity: 0.5 !important;
    cursor: not-allowed;
  }

  .claim-form .claim-form__processing-content {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    color: #ffffff;
  }

  /* ── Feedback ── */
  .claim-form__feedback {
    margin-top: 0.75rem;
    font-size: 0.875rem;
    border-radius: 6px;
    padding: 0.5rem 0.75rem;
  }

  .claim-form__feedback--error {
    color: #b91c1c;
    background: #fef2f2;
    border: 1px solid #fecaca;
  }

  .claim-form__feedback--success {
    color: #15803d;
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
  }

  /* ── Turnstile ── */
  .claim-form__turnstile-gate {
    margin: 0 0 1rem;
    text-align: center;
  }

  .claim-form__turnstile-gate-text {
    margin: 0 0 0.75rem;
    color: #374151;
    font-size: 0.95rem;
    line-height: 1.45;
  }

  .claim-form__turnstile-booting {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    color: #6b7280;
    font-size: 0.85rem;
    margin-bottom: 0.75rem;
  }

  .claim-form__turnstile-host {
    display: flex;
    justify-content: center;
    margin: 0.5rem 0 1.25rem;
    min-height: 65px;
  }

  .claim-form__turnstile-host--hidden {
    position: fixed;
    left: 0;
    top: 0;
    width: 320px;
    height: 70px;
    margin: 0;
    opacity: 0.02;
    pointer-events: none;
    z-index: 0;
    overflow: hidden;
  }

  /* ── Review screen ── */
  .review-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem 1.25rem;
  }

  .review-field {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .review-field--full {
    grid-column: 1 / -1;
  }

  .review-field__label {
    font-size: 0.68rem;
    color: #6b7280;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .review-field__value {
    font-size: 0.875rem;
    color: #111827;
  }

  .review-field__file-list {
    margin: 0.2rem 0 0;
    padding: 0 0 0 1rem;
    font-size: 0.875rem;
    color: #111827;
    list-style: disc;
  }

  /* ── Discard modal ── */
  .claim-form__discard-modal {
    padding: 1rem;
    font-family: var(--pega-font-family, 'Open Sans', Arial, sans-serif);
  }

  .claim-form__discard-modal-text {
    margin: 0 0 1rem;
    color: #374151;
    font-size: 0.95rem;
  }

  .claim-form__discard-modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
  }

  /* ── Confirmation screen ── */
  .claim-confirmation-shell {
    padding: 0;
    background: transparent;
    font-family: var(--pega-font-family, 'Open Sans', Arial, sans-serif);
  }

  .claim-confirmation {
    background: #ffffff;
    border-radius: 8px;
    padding: 1.75rem 2rem 2rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    border: 1px solid #e5e7eb;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  }

  .claim-confirmation__title {
    margin: 0;
    color: #111827;
    font-size: 1.75rem;
    line-height: 1.25;
    font-weight: 700;
  }

  .claim-confirmation__lead {
    margin: 1.25rem 0 0;
    color: #4b5563;
    font-size: 0.95rem;
    line-height: 1.55;
  }

  .claim-confirmation__case-id {
    margin: 0.875rem 0 0;
    color: #15803d;
    font-size: 1.4rem;
    line-height: 1.1;
    font-weight: 700;
  }

  .claim-confirmation__section-title {
    margin: 1.75rem 0 0;
    color: #111827;
    font-size: 1.25rem;
    line-height: 1.3;
    font-weight: 700;
  }

  .claim-confirmation__body {
    margin: 0.875rem 0 0;
    color: #4b5563;
    font-size: 0.95rem;
    line-height: 1.55;
  }

  .claim-confirmation__emphasis {
    margin: 0.5rem 0 0;
    color: #111827;
    font-size: 0.95rem;
    line-height: 1.5;
    font-weight: 600;
  }

  .claim-confirmation__download-error {
    margin: 0.875rem 0 0;
    color: #ef4444;
    font-size: 0.875rem;
    line-height: 1.4;
  }

  .claim-confirmation__actions {
    margin-top: 1.75rem;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
  }

  .claim-confirmation__actions .claim-confirmation__button {
    min-width: 220px;
    border-radius: 6px;
    border: 1px solid #111827;
    background: #111827;
    color: #ffffff;
    font-size: 0.875rem;
    font-weight: 600;
    padding: 0.65rem 1.5rem;
    cursor: pointer;
    transition: background-color 0.15s ease;
  }

  .claim-confirmation__actions .claim-confirmation__button:hover:not(:disabled) {
    background: #374151;
    border-color: #374151;
  }

  .claim-confirmation__actions .claim-confirmation__button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* ── Responsive ── */

  /* Mid-range: form panel is 450-650px wide — compact the step cards */
  @media (min-width: 901px) and (max-width: 1300px) {
    .claim-form__step-card {
      padding: 0.45rem 0.55rem;
      gap: 0.25rem;
    }

    .claim-form__step-card-label {
      font-size: 0.52rem;
    }

    .claim-form__step-card-name {
      font-size: 0.7rem;
    }

    .claim-form__step-card-icon {
      display: none;
    }
  }

  @media (max-width: 900px) {
    .claim-form-page {
      flex-direction: column;
    }

    .claim-form-page__image {
      flex: 0 0 240px;
      min-height: 240px;
    }

    .claim-form-page__panel {
      flex: 1 0 auto;
    }

    .claim-form__step-nav {
      flex-wrap: wrap;
    }

    .claim-form__step-card {
      flex: 1 0 calc(50% - 0.5rem);
    }

    .claim-form__grid,
    .review-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 480px) {
    .claim-form__step-card {
      flex: 1 0 100%;
    }

    .claim-form__step-card-icon {
      display: none;
    }
  }
`;

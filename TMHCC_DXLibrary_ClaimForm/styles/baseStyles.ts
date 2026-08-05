import { css } from 'styled-components';

export const baseFormStyles = css`
  /* ── Portal mask overlay ── */
  .claim-form__portal-mask {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  }

  /* ── Two-column page layout ── */
  .claim-form-page {
    display: flex;
    width: 100%;
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }

  .claim-form-page__image {
    flex: 0 0 50%;
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    overflow: hidden;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-color: #f1f5f9;
  }

  .claim-form-page__panel {
    flex: 0 0 50%;
    height: 100%;
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
    background:#EFF9FD;
  }

  /* ── Step navigation ── */
  .claim-form__step-nav {
    background: transparent;
    padding: 0.75rem 1.25rem;
    display: flex;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  .claim-form__step-card {
    flex: 1;
    min-width: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.375rem 1rem;
    gap: 0.5rem;
    border-radius: 14px;
  }

  .claim-form__step-card--complete {
    background: #7fc3ea;
  }

  .claim-form__step-card--current {
    background: #7fc3ea;
  }

  .claim-form__step-card--upcoming {
    background: #dcdee1;
  }

  .claim-form__step-card-info {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }

  .claim-form__step-card-label {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.01em;
  }

  .claim-form__step-card--complete .claim-form__step-card-label,
  .claim-form__step-card--current .claim-form__step-card-label {
    color: rgba(0, 0, 0, 0.6);
  }

  .claim-form__step-card--upcoming .claim-form__step-card-label {
    color: #4b5563;
  }

  .claim-form__step-card-name {
    font-size: 0.875rem;
    white-space: normal;
    word-break: break-word;
    line-height: 1.2;
  }

  .claim-form__step-card--complete .claim-form__step-card-name,
  .claim-form__step-card--current .claim-form__step-card-name {
    font-weight: 700;
    color: #111827;
  }

  .claim-form__step-card--upcoming .claim-form__step-card-name {
    font-weight: 700;
    color: #6b7280;
  }

  .claim-form__step-card-icon {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.65rem;
    font-weight: 700;
  }

  .claim-form__step-card--complete .claim-form__step-card-icon {
    background: #ffffff;
    color: #da2128;
  }

  .claim-form__step-card--current .claim-form__step-card-icon {
    border: 2px solid rgba(0, 0, 0, 0.4);
  }

  .claim-form__step-card--upcoming .claim-form__step-card-icon {
    border: 2px solid #9aa1a9;
  }

  /* ── Form body ── */
  .claim-form {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior-y: contain;
    background: transparent;
    padding: 1.25rem 1.5rem;
    font-family: var(--pega-font-family, 'Open Sans', Arial, sans-serif);
  }

  .claim-form:focus {
    outline: none;
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
    font-size: 1.1rem;
    color: #111827;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 700;
  }

  .claim-form__section-description {
    margin: -0.5rem 0 1.25rem;
    font-size: 0.8rem;
    color: #374151;
  }

  .claim-form__subheading {
    font-size: 0.8rem;
    font-weight: 600;
    color: #374151;
    padding: 0.5rem 0 0.375rem;
    border-bottom: 1px solid #e5e7eb;
    margin-bottom: 0.25rem;
  }
    /* ── Section Variants (NEW) ── */

/* ✅ Bigger main title (Your Details) */
.claim-form__section-title--primary {
  font-size: 1.3rem;
  font-weight: 700;
}

/* ✅ Smaller title (Policyholder Address) */
.claim-form__section-title--secondary {
  font-size: 1rem;
  font-weight: 600;
}

/* ✅ Grey container for grouped fields */
.claim-form__group {
  background: #f7f7f8;
  padding: 1.25rem;
  border-radius: 12px;
  margin-bottom: 2rem;
}

/* ✅ Spacing between stacked sections */
.claim-form__section + .claim-form__section {
  margin-top: 1rem;
}
  /* ── Grid & fields ── */
  .claim-form__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }

  .claim-form__grid + .claim-form__grid {
    margin-top: 1rem;
  }

  /* Cards placed directly as grid items (e.g. Incident Details / Where did the loss
     occur?) already get spacing from the grid's own gap — the group's margin-bottom
     would stack on top of that and make the gap too large. */
  .claim-form__grid > .claim-form__group {
    margin-bottom: 0;
  }
.claim-form__section-title--primary {
  margin-bottom: 0.75rem;
}
  .claim-form__field {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    font-size: 0.8rem;
    color: #001b3d;
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
    color: #001b3d;
    box-sizing: border-box;
    font-family: inherit;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }

  .claim-form__field input:focus,
  .claim-form__field select:focus,
  .claim-form__field textarea:focus {
    outline: none;
    border-color: #1A3D6B;
    box-shadow: 0 0 0 3px rgba(26, 61, 107, 0.15);
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
    color: #001b3d;
  }

  .claim-form__field input::placeholder,
  .claim-form__field textarea::placeholder {
    color: #9ca3af;
    font-weight: 400;
  }

  /* Cosmos DateInput (.pega-date-input) renders day/month/year as separate
     native <input>s. The generic field rule above would stretch and border
     each one individually, so hand sizing/border/focus back to Cosmos's own
     per-segment layout instead of fighting it. Width is keyed off maxlength
     (not the HTML size attribute, which browsers resolve inconsistently for
     type="number") so day/month/year are each exactly as wide as their
     digits, with no leftover space from an oversized box. */
  .claim-form__field .pega-date-input input {
    border: 0;
    padding: 0;
    background: transparent;
  }

  .claim-form__field .pega-date-input input[maxlength='2'] {
    width: 2ch;
  }

  .claim-form__field .pega-date-input input[maxlength='4'] {
    width: 4ch;
  }

  .claim-form__field .pega-date-input input:focus {
    box-shadow: none;
  }

  .claim-form__phone-group {
    display: flex;
    gap: 4px;
    align-items: stretch;
  }

  .claim-form__phone-group .claim-form__phone-input {
    flex: 1;
    min-width: 0;
    width: 0;
  }

  .claim-form__required-star {
    color: #d32f2f;
    margin-left: 2px;
    flex-shrink: 0;
  }

  .claim-form__field-label-row {
    display: inline-flex;
    align-items: center;
    align-self: flex-start;
    width: auto;
    gap: 0.35rem;
  }

  .claim-form__field-info-wrapper {
    position: relative;
    display: inline-flex;
    align-items: center;
  }

  .claim-form__field-info-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 15px;
    height: 15px;
    color: #4a7ba6;
    margin-left: 0.1em;
    margin-top: -0.2em;
    vertical-align: middle;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    line-height: 0;
  }

  .claim-form__field-info-icon svg {
    width: 15px;
    height: 15px;
  }

  .claim-form__field-tooltip {
    position: absolute;
    bottom: calc(100% + 10px);
    left: -10px;
    max-width: 260px;
    width: max-content;
    background: #1a3d6b;
    color: #ffffff;
    font-size: 0.78rem;
    font-weight: 700;
    line-height: 1.4;
    padding: 14px 16px;
    border-radius: 10px;
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.25);
    z-index: 20;
  }

  .claim-form__field-tooltip::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 14px;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    border-top: 7px solid #1a3d6b;
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

  .claim-form__field-footer{
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    min-height: 1.2rem;
  }

  .claim-form__char-counter{
    color: #6b7280;
    font-size: 0.72rem;
    white-space: nowrap;
    margin-left: 0.5rem;
  }

  .claim-form__char-counter-warn{
    color: #ef4444;
  }

  /* ── File upload ── */
  .claim-form__upload-dropzone {
    border: 2px dashed #d1d5db;
    min-height: 140px;
    padding: 1.5rem;
    border-radius: 8px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.4rem;
    color: #6b7280;
    position: relative;
    background: transparent;
    transition: border-color 0.15s ease;
  }

  .claim-form__upload-dropzone:hover {
    border-color: #9ca3af;
  }

  .claim-form__upload-dropzone--drag-over {
    border-color: #1a3d6b;
    background: #eef4fb;
  }

  .claim-form__upload-dropzone--disabled {
    background: transparent;
    border-color: #e5e7eb;
    cursor: not-allowed;
    pointer-events: none;
    opacity: 0.5;
  }

  .claim-form__upload-spinner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    pointer-events: none;
  }

  .claim-form__upload-spinner-text {
    font-size: 0.875rem;
    color: #6b7280;
  }

  .claim-form__file-input {
    opacity: 0;
    position: absolute;
    inset: 0;
    cursor: pointer;
  }

  .claim-form__upload-title {
    margin: 0;
    font-size: 1rem;
    color: #4a72a0;
    font-weight: 700;
  }

  .claim-form__upload-subtitle {
    margin: 0;
    font-size: 0.8rem;
    color: #4a72a0;
  }

  .claim-form__upload-select-btn {
    display: inline-block;
    align-self: center;
    width: fit-content;
    margin-top: 0.75rem;
    padding: 0.5rem 1.25rem;
    border-radius: 8px;
    background: #1a3d6b;
    color: #ffffff;
    font-size: 0.85rem;
    font-weight: 700;
    white-space: nowrap;
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
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .claim-form__attachment-card-body {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
  }

  .claim-form__attachment-file-info {
    display: flex;
    align-items: baseline;
    gap: 0.4rem;
    min-width: 0;
  }

  .claim-form__attachment-card-name {
    font-size: 0.875rem;
    font-weight: 600;
    color: #001b3d;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 70%;
  }

  .claim-form__attachment-card-size {
    font-size: 0.75rem;
    color: #6b7280;
    white-space: nowrap;
  }

  .claim-form__attachment-input--error {
    border-color: #ef4444 !important;
  }

  .claim-form__attachment-delete-btn {
    flex-shrink: 0;
    border: none;
    background: transparent;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 4px;
    line-height: 1;
    transition: color 0.15s ease, background-color 0.15s ease;
  }

  .claim-form__attachment-delete-btn:hover {
    color: #ef4444;
    background: #fef2f2;
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
    gap: 1rem;
  }

  .claim-form__actions .claim-form__button{
  font-weight: 550 !important;
  }

  /* Buttons live inside each step's own box, at the bottom, with a divider
     separating them from the fields above and healthy padding below. */
  .claim-form__section-actions {
    margin-top: 1.25rem;
    padding-top: 1.25rem;
    padding-bottom: 0.5rem;
    border-top: 1px solid #e5e7eb;
  }

  .claim-form__actions-left {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .claim-form__button {
    border-radius: 10px !important;
    min-width: 120px;
    font-weight: 400 !important;
    border: 1px solid transparent;
    padding: 0.9rem 1.5rem;
    cursor: pointer;
    font-size: 0.9375rem;
    line-height: 1;
    transition: background-color 0.15s ease, border-color 0.15s ease, opacity 0.2s ease;
  }

  .claim-form__button--primary {
    background: #1a3d6b;
    color: #ffffff !important;
    border-color: #1a3d6b !important;
  }

  .claim-form__button-content {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
  }

  .claim-form__button-icon-circle {
    width: 1.1rem;
    height: 1.1rem;
    border-radius: 9999px;
    border: 1px solid rgba(255, 255, 255, 0.6);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 0;
  }

  .claim-form__button--secondary {
    background: #ffffff !important;
    color: #1a3d6b !important;
    border-color: #1a3d6b !important;
  }

  .claim-form__button:disabled {
    opacity: 0.5 !important;
    cursor: not-allowed;
  }

  .claim-form__processing-content {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    color: #ffffff;
  }

  /* ── Feedback ── */
  .claim-form__feedback--success {
    color: #15803d;
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
  }

  .claim-form__banner-gap {
    margin-bottom: 1rem;
  }

  /* ── HTML-content banner (MessageBanner) ──
     Cosmos's own Banner only ever renders its messages as escaped plain
     text, so HTML-formatted Pega messages (validation/error rules) are
     routed through this instead. Colors below are pulled directly from
     Cosmos's own theme tokens (components.banner.*, base.palette.border-line,
     components.card.background) so this matches the OOTB Banner look. */
  .claim-form__html-banner {
    display: flex;
    align-items: stretch;
    box-sizing: border-box;
    border: 1px solid #cfcfcf;
    border-radius: 0.5rem;
    overflow: hidden;
    font-size: 0.8rem;
  }

  .claim-form__html-banner-icon {
    flex-shrink: 0;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 0.75rem 0.5rem;
    color: #ffffff;
  }

  .claim-form__html-banner-icon--urgent {
    background: #d91c29;
  }

  .claim-form__html-banner-icon--warning {
    background: #fd6000;
  }

  .claim-form__html-banner-icon--success {
    background: #20aa50;
  }

  .claim-form__html-banner-icon--info {
    background: #8397ab;
  }

  .claim-form__html-banner-icon--ai {
    background: #681fc3;
  }

  .claim-form__html-banner-content {
    flex: 1;
    min-width: 0;
    padding: 0.75rem 0.9rem;
    background: #ffffff;
    color: #001b3d;
  }

  /* ── Review screen ── */
  .review-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem 1.5rem;
  }

  .review-field {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .review-field--full {
    grid-column: 1 / -1;
  }

  .review-field__label {
    font-size: 0.75rem;
    font-weight: 500;
    color: #6b7280;
  }

  .review-field__value {
    font-size: 0.875rem;
    font-weight: 500;
    color: #111827;
    word-break: break-word;
  }

  .review-field__file-list {
    margin: 0.25rem 0 0;
    padding: 0 0 0 1rem;
    font-size: 0.875rem;
    color: #111827;
    list-style: disc;
    line-height: 1.6;
  }

  .review-field__file-list li {
    overflow-wrap: break-word;
    word-break: break-word;
  }

  /* Discard-modal styling lives in styles.ts's ClaimFormGlobalStyles, not here —
     Pega's modal manager portals this modal outside this styled component's own
     DOM subtree, so scoped rules in this file can never reach it. */

  /* ── Confirmation screen ── */
  .claim-confirmation-shell {
    background: #eaf3fc;
    min-height: 100%;
    padding: 1rem 1.5rem;
  }

  .claim-confirmation {
    max-width: 900px;
    margin: 0 auto;
    padding: 0;
  }

  .claim-confirmation__title {
    margin: 0;
    color: #1a3d6b;
    font-size: 2rem;
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
    color: #1a3d6b;
    font-size: 2.2rem;
    line-height: 1.1;
    font-weight: 700;
  }

  .claim-confirmation__section-title {
    margin: 24px 0 0;
    color: #1a3d6b;
    font-size: 1.3rem;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-top: 1rem;
  flex-wrap: wrap;
}
  .claim-confirmation__actions button {
  flex: 0 0 auto; /* size to text content, like claim-form__button */
}

  @media (max-width: 480px) {
    .claim-confirmation-shell {
      padding: 1rem;
    }

    .claim-confirmation__title {
      font-size: 1.5rem;
    }

    .claim-confirmation__case-id {
      font-size: 1.6rem;
    }

    .claim-confirmation__actions {
      flex-direction: column;
      align-items: stretch;
    }

    .claim-confirmation__actions button {
      flex: 1 1 auto;
      width: 100%;
    }
  }


/* ✅ Card styling */
.claim-form__group--location {
  background: #f4f5f7;
  border: 1px solid #dcdcdc;
  border-radius: 12px;
  padding: 20px;
}

/* ✅ Selectable option cards (e.g. "Where did the loss occur?") */
.claim-form__option-card-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.claim-form__option-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border: 1px solid #dcdcdc;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease;
}

.claim-form__option-card input[type='radio'] {
  margin-top: 3px;
  width: 18px;
  height: 18px;
  accent-color: #1a3d6b;
  flex-shrink: 0;
  cursor: pointer;
}

.claim-form__option-card--selected {
  background: #eef4fb;
  border-color: #1a3d6b;
}

.claim-form__option-card-title {
  display: block;
  font-weight: 700;
  color: #111827;
  font-size: 0.85rem;
}

.claim-form__option-card--selected .claim-form__option-card-title {
  color: #1a3d6b;
}

.claim-form__option-card-subtitle {
  display: block;
  margin-top: 8px;
  color: #4b5563;
  font-size: 0.85rem;
}

.claim-form__optional-tag {
  color: #6b7280;
  font-size: 0.8rem;
  font-style: italic;
  font-weight: 400;
}

.claim-form__group--white {
  background: #ffffff !important;
  border: 1px solid #d4dce5;
}
/* ✅ Same look as policy address card */
.claim-form__group--card {
  background: #ffffff !important;   /* ✅ remove grey */
  border: 1px solid #dcdcdc;        /* ✅ border line */
  border-radius: 12px;              /* ✅ rounded corners */
  padding: 20px;                   /* ✅ spacing inside */
}

/* ✅ Divider line */
  .claim-confirmation__actions .claim-confirmation__button {
    min-width: 200px;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 600;
    padding: 0.7rem 1.75rem;
    cursor: pointer;
    transition: background-color 0.15s ease, color 0.15s ease;
    line-height: 1;
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
      font-size: 0.7rem;
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
      height: auto;
      overflow: visible;
    }

    .claim-form-page__image {
      flex: 0 0 240px;
      height: 240px;
    }

    .claim-form-page__panel {
      flex: 1 0 auto;
      height: auto;
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

/* ✅ Header alignment */
.claim-form__header {
  display: flex;
  align-items: center;
 gap:6px
}

/* ✅ Info icon button */

 
/* Info icon button — uses Pega Icon component, no hand-drawn circle */
.claim-form__info-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: #4a7ba6;
  padding: 0;
  cursor: pointer;
  line-height: 0;
  vertical-align: middle;
  font-style: normal;
  transition: color 0.15s ease;
}

.claim-form__info-icon i,
.claim-form__info-icon * {
  font-style: normal;
}

.claim-form__info-icon:hover {
  color: #1A3D6B;
}

/* ✅ Fix for hidden/blank icon text */


/* ✅ Info box container */
.claim-form__info-box {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  gap: 12px;
  margin: 0.75rem 0 1rem;
  padding: 0.75rem 1rem;

  border-radius: 10px;

  background: #eff9fd;
  border-left: 5px solid #84c2ea;
}

/* Kept in the DOM (for a stable aria-controls target) but hidden while collapsed —
   overrides the class's own display:flex above, since author CSS otherwise wins
   over the browser's default [hidden] display:none rule. */
.claim-form__info-box[hidden] {
  display: none;
}

/* Left section */
.claim-form__info-left {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  flex: 1;
}

/* Icon inside info box — Pega Icon component, blue to match box accent */
.claim-form__info-box-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1A3D6B;
  flex-shrink: 0;
  line-height: 0;
  font-style: normal;
}

.claim-form__info-box-icon i,
.claim-form__info-box-icon * {
  font-style: normal;
}

/* ✅ Ensure inner icon always shows */


/* Info text */
.claim-form__info-content {
  font-size: 0.9rem;
  color: #001b3d;
  line-height: 1.5;
}

.claim-form__info-close {
  border: none;
  background: transparent;

  font-size: 1.2rem;
  font-weight: 600;

  color: black !important;

  cursor: pointer;
}
  
.claim-form__label {
  display: inline-flex;
  align-items: center;
  gap: 4px;   /* small space between text and star */
  flex-wrap: wrap; /* ✅ prevents wrapping */
  font-weight: 600;
  color: #111827;  /* slightly darker for better readability */
}
.claim-form__field span {
  font-weight: 600;
}
.claim-form__divider {
  border-top: 1px solid #dcdcdc;
  margin: 16px 0;   /* ✅ adds space ABOVE and BELOW */
}

.claim-form-page__image::after {
  content: '';
  position: absolute;
  inset: 0;


  background: linear-gradient(
    to top,
    rgba(0, 25, 55, 0.95) 0%,
    rgba(0, 25, 55, 0.9) 25%,
    rgba(0, 25, 55, 0.7) 35%,
    rgba(0, 25, 55, 0.3) 50%,
    rgba(0, 25, 55, 0) 68%   /* ✅ lowered fade-out */
  );


  z-index: 1;
  pointer-events: none;
}

/* ✅ Support hours container */
.claim-form__image-hours {
  margin-top: 16px;

  display: flex;
  align-items: baseline;   /* ✅ aligns label + value perfectly */
  gap: 8px;

  white-space: nowrap;     /* ✅ stays in single line */
}

/* ✅ Label (same size as TELEPHONE, EMAIL labels) */
.claim-form__image-hours strong {
  color: #84c2ea;

  font-size: 0.85rem;      /* ✅ SAME as other labels */
  letter-spacing: 1px;
  text-transform: uppercase;

  font-weight: 700;
}

/* ✅ Value (same as other values like numbers/email) */
.claim-form__image-hours span {
  color: #ffffff;

  font-size: .85rem;      /* ✅ SAME as other values */
  font-weight: 700;
}
.claim-form__upload-icon {
  color: #93c5e8;
  margin-bottom: 4px;
}

.claim-form__upload-icon svg {
  width: 40px;
  height: 40px;
}

.claim-form__evidence-note {
  margin: 0 0 12px;
  text-align: center;
  color: #6b7280;
  font-size: 0.85rem;
}
.review-card {
  background: #f7f7f8;
  border-radius: 12px;
  padding: 18px;
  margin-bottom: 16px;
  border: 1px solid #e5e7eb;
}

/* HEADER ROW */
.review-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  cursor: pointer;
  user-select: none;
}

/* LEFT SIDE */
.review-card__title {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* TITLE TEXT */
.review-card__heading {
  font-size: 1.1rem;
  font-weight: 400;
}

/* RIGHT SIDE ICONS */
.review-card__icons {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* ICON BUTTON */
.review-card__icon-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #111827;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* CONTENT */
.review-card__content {
  margin-top: 14px;
  padding-top: 10px;
}

.review-card__icon-btn svg {
  width: 18px;
  height: 18px;
}
.review-card__icon-btn:hover {
  color: #1a3d6b;
}
/* ✅ Expand/collapse all review sections */
.review-expand-all-row {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 12px;
}

.review-expand-all-link {
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 700;
  color: #1a3d6b;
  text-decoration: underline;
}

.review-declaration {
  margin-top: 20px;
}

.review-declaration__title {
  font-size: 1.05rem;
  font-weight: 700;
  margin-bottom: 10px;
  color: #111827;
}

.review-notice-box + .review-declaration__title {
  margin-top: 24px;
}

/* ✅ Fraud prevention / declaration text boxes */
.review-notice-box {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #ffffff;
  padding: 18px 20px;
}

.review-notice-box--declaration {
  background: #eef6fb;
  border-color: #dbe7f0;
}

.review-notice-box p {
  margin: 0 0 12px;
  font-size: 0.85rem;
  line-height: 1.6;
  color: #1f2937;
}

.review-notice-box p:last-child {
  margin-bottom: 0;
}

.review-privacy-link {
  color: #1a3d6b;
  font-weight: 600;
  text-decoration: underline;
}

/* Single declaration consent checkbox */
.review-declaration__checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  color: #111827;
}

.review-declaration__checkbox.review-declaration__checkbox--single {
  margin-top: 20px;
  align-items: flex-start;
  font-weight: 600;
  font-size: 0.8125rem;
  cursor: pointer;
  gap: 10px;
  accent-color: #1A3D6B;
}

.review-declaration__checkbox--single input {
  margin-top: 3px;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}
.claim-confirmation {
  color: #1a3d6b;
}

.claim-confirmation__subtitle {
  margin-top: 6px;
  color: #6b7280;
}
  .claim-confirmation__reference-card {
  
 background: #9fc3dd;     /* ✅ darker blue */
  padding: 24px;
  border-left: 6px solid #1a3d6b;
  margin: 24px 0

}
.claim-confirmation__list {
  margin-top: 10px;
  padding-left: 20px;
  line-height: 1.6;
}
  .claim-confirmation__button--primary {
    background: #001b3d;
    color: #ffffff;
    border: 2px solid #001b3d;
  }

  .claim-confirmation__button--primary:hover:not(:disabled) {
    background: #1A3D6B;
    border-color: #1A3D6B;
  }

  .claim-confirmation__button--outline {
    background: #ffffff;
    color: #001b3d;
    border: 2px solid #001b3d;
  }

  .claim-confirmation__button--outline:hover:not(:disabled) {
    background: #f0f4f8;
  }
.claim-confirmation__body {
  margin-top: 12px;
  line-height: 1.6;
}

.claim-confirmation__rich-text {
  line-height: 1.6;
  color: #111827;
  font-size: 0.9rem;
}

.claim-confirmation__rich-text h1,
.claim-confirmation__rich-text h2,
.claim-confirmation__rich-text h3 {
  color: #001b3d;
  margin: 0.5rem 0 0.25rem;
  font-weight: 700;
}

.claim-confirmation__rich-text p {
  margin: 0.25rem 0;
}

.claim-confirmation__rich-text ul,
.claim-confirmation__rich-text ol {
  padding-left: 1.25rem;
  margin: 0.25rem 0;
}

.claim-confirmation__rich-text a {
  color: #1A3D6B;
}

.claim-confirmation__list {
  margin-top: 12px;
  margin-bottom: 20px;
  padding-left: 20px;
  line-height: 1.6;
}
.claim-confirmation p {
  margin: 10px 0;
}
.claim-form__add-item {
  border: 2px dashed #93c5e8;
  border-radius: 8px;
  padding: 20px;
  margin: 32px 0;
  background-color: #ffffff;

  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;

  transition: border-color 0.15s ease, background-color 0.15s ease;
}

/* hover */
.claim-form__add-item:hover {
  border-color: #1a3d6b;
  background-color: #eef4fb;
}
.claim-form__add-item-text {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 400;
  font-size: 16px;
  color: #1a3d6b;
}

/* ✅ Saved item row */
.claim-form__saved-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  border: 1px solid #dcdcdc;
  border-radius: 10px;
  background: #ffffff;
}

.claim-form__saved-item + .claim-form__saved-item {
  margin-top: 12px;
}

.claim-form__saved-item-title {
  display: block;
  font-weight: 700;
  color: #111827;
  font-size: 0.95rem;
}

.claim-form__saved-item-subtitle {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 4px;
  color: #4b5563;
  font-size: 0.85rem;
}

.claim-form__saved-item-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.claim-form__saved-item-edit,
.claim-form__saved-item-remove {
  background: none;
  border: none;
  padding: 0;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
}

.claim-form__saved-item-edit {
  color: #1a3d6b;
}

.claim-form__saved-item-remove {
  color: #c04820;
}

/* ✅ Item saved success banner */
.claim-form__item-saved-toast-anchor {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

/* Sits above the Add item button as a compact full-width bar. */
.claim-form__item-saved-toast {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 12px;
  padding: 12px 14px;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  background: #f0fdf4;
  color: #166534;
  font-size: 0.8rem;
  font-weight: 600;

  opacity: 1;
  transition: opacity 0.4s ease;
}

.claim-form__item-saved-toast--fade-out {
  opacity: 0;
}

.claim-form__item-saved-banner-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #16a34a;
  color: #ffffff;
  flex-shrink: 0;
}

.claim-form__item-saved-banner-icon svg {
  width: 11px;
  height: 11px;
}

/* ✅ Add/edit item form actions */
.claim-form__item-form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
}

.claim-form__item-form-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.claim-form__item-form-close {
  flex-shrink: 0;
  border: none;
  background: transparent;
  padding: 0;
  font-size: 1.5rem;
  line-height: 1;
  color: #6b7280;
  cursor: pointer;
}

.claim-form__item-form-close:hover {
  color: #111827;
}
  /* ✅ Claim Summary Container */
/* Saved items / Add item button / Add-or-edit item form / Claim summary — keep these
   evenly and closely spaced, scoped to this section only so it doesn't affect the
   shared .claim-form__group spacing used elsewhere. */
.claim-form__items-section > .claim-form__section-title,
.claim-form__items-section > .claim-form__group,
.claim-form__items-section > .claim-form__add-item {
  margin-top: 0;
  margin-bottom: 20px;
}

/* When the "Item saved" toast follows the saved items card, match its own
   margin-bottom (12px) so the gap above and below the toast is even. */
.claim-form__items-section > .claim-form__group:has(+ .claim-form__item-saved-toast) {
  margin-bottom: 12px;
}

/* Your Details / Policy / related-person / Policyholder Address cards — match the
   tighter spacing used on the other steps, and drop the trailing gap before the
   white box's own bottom padding closes it off. */
.claim-form__section--your-details > .claim-form__group {
  margin-bottom: 20px;
}

.claim-form__section--your-details > .claim-form__group:last-child {
  margin-bottom: 0;
}

.claim-form__items-section > .claim-form__summary {
  margin-top: 0;
  margin-bottom: 0;
}

.claim-form__summary {
  margin-top: 24px;
  padding: 20px;
  border-radius: 10px;
  background: #f7f7f8;
  border: 1px solid #dcdcdc;
}
.claim-form__summary-divider {
  border: none;
  border-top: 1px solid #e5e7eb;   /* ✅ light grey */

  margin: 12px 0;   /* ✅ space above & below */
}
/* ✅ Title — matches the "Saved items" secondary heading size/weight */
.claim-form__summary-title {
  margin: 0 0 16px;
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
}

/* ✅ Section spacing */
.claim-form__summary-section {
  margin-bottom: 12px;
}

/* Label on the far left, value on the far right, same row (used on the Review screen). */
.claim-form__summary-section--row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.claim-form__summary-section--row .claim-form__summary-label {
  margin-bottom: 0;
}

/* ✅ Total purchase value + total claim value shown side by side in one row */
.claim-form__summary-totals-row {
  display: flex;
  align-items: flex-start;
  gap: 48px;
}

.claim-form__summary-total-block {
  display: flex;
  flex-direction: column;
}

/* ✅ Labels */
.claim-form__summary-label {
  font-size: 0.9rem;
  color: #374151;
  margin-bottom: 6px;
}

/* ✅ List */
.claim-form__summary-list {
  margin: 0;
  padding-left: 18px;
  color: #001b3d;
}

.claim-form__summary-list li {
  margin-bottom: 4px;
}
.claim-form__summary-list li {
  font-weight: 700;   /* ✅ bold */
}

/* ✅ Values */
.claim-form__summary-value {
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
}

/* ✅ Total (bold highlight like screenshot) */
.claim-form__summary-total {
  font-size: 1.25rem;
  font-weight: 700;
  color: #001b3d;
}

/* ✅ Divider */



/* ✅ Overlay container */
.claim-form__image-overlay {
  padding: 40px 40px 56px;
  color: white;
  position: relative;
  z-index: 2;

  background: none;
}


/* ✅ Main content wrapper — CONTROLS WIDTH */
.claim-form__image-content {
  display: block;
  width: 100%;   /* ✅ fills overlay padding box evenly on both sides */
}

/* ✅ Title (WIDTH REFERENCE) */
.claim-form__image-title {
  display: inline-block;   /* ✅ important */

  font-size: 3rem;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  color: #84c2ea;

  margin-bottom: 12px;

  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
}

/* ✅ Subtext (FIXED ISSUE HERE) */
.claim-form__image-subtext {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #e5e7eb;

  margin-bottom: 12px;

  max-width: 100%;   /* ✅ stays inside wrapper */
  display: block;
  white-space: normal;
  word-break: break-word; /* ✅ prevents overflow */
}

/* ✅ Divider */
.claim-form__image-divider {
  height: 1px;
  background-color: #84c2ea;

  width: 100%;        /* ✅ matches wrapper width */
  margin: 14px 0 22px 0;  /* ✅ spacing fix */
}

/* ✅ Contact section */
.claim-form__image-contact {
  display: flex;
  gap: 64px;              /* ✅ better spacing */

  justify-content: flex-start;
  flex-wrap: wrap;        /* ✅ prevents overflow */
  
  margin-bottom: 18px;
}

/* ✅ Items inside contact */
.claim-form__image-contact > div {
  flex: 0 0 auto;
}

/* ✅ Contact labels */
.claim-form__image-contact strong {
  display: block;

  color: #84c2ea;
  font-size: 0.85rem;

  letter-spacing: 1px;
  text-transform: uppercase;

  white-space: nowrap;   /* ✅ prevents breaking */
  margin-bottom: 10px;
}

/* ✅ Contact values */
.claim-form__image-contact p {
  margin: 0;

  color: #ffffff;
  font-size: 0.9rem;

  font-weight: 700;
}

.claim-form__image-highlight {
  font-weight: 800;   /* ✅ extra bold */
}
/* ✅ Support hours */

/* ✅ Privacy Policy / Web Cookie Policy links — below the support-hours line */
.claim-form__image-policy-links {
  display: flex;
  gap: 32px;
  margin-top: 20px;
  margin-bottom: 8px;
}

.claim-form__image-policy-link {
  background: none;
  border: none;
  padding: 0;
  color: #84c2ea;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.3px;
  text-decoration: underline;
  cursor: pointer;
}

.claim-form__image-policy-link:hover {
  color: #ffffff;
}

.claim-form__image-policy-link:focus-visible {
  outline: 2px solid #84c2ea;
  outline-offset: 2px;
}
`;

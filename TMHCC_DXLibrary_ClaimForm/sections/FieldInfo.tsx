import { useEffect, useRef, useState } from 'react';
import InfoIcon from './InfoIcon';
import type { LocalizationMap } from '../utils/useLocalization';

interface FieldInfoProps {
  text: string;
  l: LocalizationMap;
}

/** Small (i) icon next to a field label that toggles a popover with helper text on click. */
function FieldInfo({ text, l }: FieldInfoProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [open]);

  return (
    <span className="claim-form__field-info-wrapper" ref={wrapperRef}>
      {/*
        Intentionally a <span role="button"> and not a <button>: a native <button>
        is a "labelable" element, and since this sits inside a <label> ahead of the
        real <input>/<select>, the browser's implicit label association would pick
        this button as the label's control instead of the actual field — causing
        any click on the label (not just this icon) to toggle it.
      */}
      <span
        role="button"
        tabIndex={0}
        className="claim-form__field-info-icon"
        onClick={() => setOpen(prev => !prev)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen(prev => !prev);
          }
        }}
        aria-label={open ? String(l['HideInfoLabel']) : String(l['ShowInfoLabel'])}
      >
        <InfoIcon />
      </span>
      {open && (
        <span className="claim-form__field-tooltip" role="tooltip">
          {text}
        </span>
      )}
    </span>
  );
}

export default FieldInfo;

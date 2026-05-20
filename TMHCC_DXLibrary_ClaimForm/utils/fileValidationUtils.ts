const ALLOWED_MIME_TYPES = new Set(['application/pdf', 'image/jpeg', 'image/png']);
const ALLOWED_EXTENSIONS = new Set(['.pdf', '.jpg', '.jpeg', '.png']);
const ALLOWED_LABEL = 'PDF, JPG, or PNG';

const getExtension = (filename: string): string =>
  filename.slice(filename.lastIndexOf('.')).toLowerCase();

export const isFileTypeAllowed = (file: File): boolean =>
  ALLOWED_MIME_TYPES.has(file.type) || ALLOWED_EXTENSIONS.has(getExtension(file.name));

export interface FileValidationResult {
  valid: File[];
  rejectedNames: string[];
  errorMessage: string;
}

export const validateFileTypes = (files: File[]): FileValidationResult => {
  const valid: File[] = [];
  const rejectedNames: string[] = [];

  files.forEach(file => {
    if (isFileTypeAllowed(file)) {
      valid.push(file);
    } else {
      rejectedNames.push(file.name);
    }
  });

  const errorMessage =
    rejectedNames.length === 1
      ? `"${rejectedNames[0]}" is not a supported file type. Please upload ${ALLOWED_LABEL} files only.`
      : `${rejectedNames.length} files were rejected (unsupported type): ${rejectedNames.join(', ')}. Please upload ${ALLOWED_LABEL} files only.`;

  return { valid, rejectedNames, errorMessage };
};

/** Value for the <input accept> attribute. */
export const ACCEPTED_FILE_TYPES = '.pdf,.jpg,.jpeg,.png';

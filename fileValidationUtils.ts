const EXT_TO_MIME: Record<string, string> = {
  '.pdf':  'application/pdf',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png':  'image/png',
  '.gif':  'image/gif',
  '.webp': 'image/webp',
  '.doc':  'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

const parseExtensions = (allowedExtensions: string): { exts: Set<string>; mimes: Set<string> } => {
  const exts = new Set(allowedExtensions.split(',').map(e => e.trim().toLowerCase()).filter(Boolean));
  const mimes = new Set([...exts].map(e => EXT_TO_MIME[e]).filter(Boolean) as string[]);
  return { exts, mimes };
};

const getExtension = (filename: string): string =>
  filename.slice(filename.lastIndexOf('.')).toLowerCase();

export const isFileTypeAllowed = (file: File, allowedExtensions: string): boolean => {
  const { exts, mimes } = parseExtensions(allowedExtensions);
  return mimes.has(file.type) || exts.has(getExtension(file.name));
};

export interface FileValidationResult {
  valid: File[];
  rejectedNames: string[];
  errorMessage: string;
}

export const validateFileTypes = (files: File[], allowedLabel: string, allowedExtensions: string): FileValidationResult => {
  const valid: File[] = [];
  const rejectedNames: string[] = [];

  files.forEach(file => {
    if (isFileTypeAllowed(file, allowedExtensions)) {
      valid.push(file);
    } else {
      rejectedNames.push(file.name);
    }
  });

  const errorMessage =
    rejectedNames.length === 1
      ? `"${rejectedNames[0]}" is not a supported file type. Please upload ${allowedLabel} files only.`
      : `${rejectedNames.length} files were rejected (unsupported type): ${rejectedNames.join(', ')}. Please upload ${allowedLabel} files only.`;

  return { valid, rejectedNames, errorMessage };
};

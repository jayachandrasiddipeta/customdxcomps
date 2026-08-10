import type { LocalizationMap } from './useLocalization';

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

// Known file signatures (magic bytes). offset is where in the file to start reading.
const MAGIC_SIGNATURES: Array<{ exts: string[]; offset: number; bytes: number[] }> = [
  { exts: ['.pdf'],          offset: 0, bytes: [0x25, 0x50, 0x44, 0x46] },                         // %PDF
  { exts: ['.jpg', '.jpeg'], offset: 0, bytes: [0xFF, 0xD8, 0xFF] },                               // JPEG SOI marker
  { exts: ['.png'],          offset: 0, bytes: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A] }, // PNG header
  { exts: ['.gif'],          offset: 0, bytes: [0x47, 0x49, 0x46, 0x38] },                         // GIF8
  { exts: ['.webp'],         offset: 8, bytes: [0x57, 0x45, 0x42, 0x50] },                         // WEBP (inside RIFF)
  { exts: ['.doc'],          offset: 0, bytes: [0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1] }, // OLE2 compound doc
  { exts: ['.docx'],         offset: 0, bytes: [0x50, 0x4B, 0x03, 0x04] },                         // ZIP/PK (OOXML)
];

const parseExtensions = (allowedExtensions: string): { exts: Set<string>; mimes: Set<string> } => {
  const exts = new Set(allowedExtensions.split(',').map(e => e.trim().toLowerCase()).filter(Boolean));
  const mimes = new Set([...exts].map(e => EXT_TO_MIME[e]).filter(Boolean) as string[]);
  return { exts, mimes };
};

const getExtension = (filename: string): string =>
  filename.slice(filename.lastIndexOf('.')).toLowerCase();

const checkMagicBytes = async (file: File): Promise<boolean> => {
  const ext = getExtension(file.name);
  const sig = MAGIC_SIGNATURES.find(s => s.exts.includes(ext));
  if (!sig) return true;
  const buffer = await file.slice(0, sig.offset + sig.bytes.length).arrayBuffer();
  const bytes = new Uint8Array(buffer);
  return sig.bytes.every((b, i) => bytes[sig.offset + i] === b);
};

export const isFileTypeAllowed = (file: File, allowedExtensions: string): boolean => {
  const { exts, mimes } = parseExtensions(allowedExtensions);
  return mimes.has(file.type) || exts.has(getExtension(file.name));
};

export interface FileValidationResult {
  valid: File[];
  rejectedNames: string[];
  errorMessage: string;
}

export const validateFileTypes = async (
  files: File[],
  allowedLabel: string,
  allowedExtensions: string,
  l: LocalizationMap
): Promise<FileValidationResult> => {
  const valid: File[] = [];
  const rejectedNames: string[] = [];

  for (const file of files) {
    const allowedType = isFileTypeAllowed(file, allowedExtensions);
    const validContent = allowedType && await checkMagicBytes(file);
    if (validContent) {
      valid.push(file);
    } else {
      rejectedNames.push(file.name);
    }
  }

  const errorMessage =
    rejectedNames.length === 1
      ? String(l['ErrFileTypeSingular']).replace('{1}', rejectedNames[0]).replace('{2}', allowedLabel)
      : String(l['ErrFileTypePlural'])
          .replace('{1}', String(rejectedNames.length))
          .replace('{2}', rejectedNames.join(', '))
          .replace('{3}', allowedLabel);

  return { valid, rejectedNames, errorMessage };
};
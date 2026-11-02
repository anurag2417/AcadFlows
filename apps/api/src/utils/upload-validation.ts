import { AppError } from '../middleware/error-handler';

export function assertImageFile(file: { mimetype: string; buffer: Buffer }) {
  const signatures: Record<string, (buffer: Buffer) => boolean> = {
    'image/jpeg': buffer => buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff])),
    'image/png': buffer => buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
    'image/gif': buffer => buffer.subarray(0, 6).toString('ascii') === 'GIF89a' || buffer.subarray(0, 6).toString('ascii') === 'GIF87a',
    'image/webp': buffer => buffer.subarray(0, 4).toString('ascii') === 'RIFF' && buffer.subarray(8, 12).toString('ascii') === 'WEBP',
  };
  const validator = signatures[file.mimetype];
  if (!validator || !validator(file.buffer)) {
    throw new AppError('Uploaded image content does not match an allowed image format', 400);
  }
}

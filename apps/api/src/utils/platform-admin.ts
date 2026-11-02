import { config } from '../config';

export function isPlatformAdminEmail(email: string | undefined): boolean {
  if (!email) return false;
  const adminEmail = config.platformAdmin.email;
  if (!adminEmail) return false;
  return email.toLowerCase().trim() === adminEmail.toLowerCase().trim();
}

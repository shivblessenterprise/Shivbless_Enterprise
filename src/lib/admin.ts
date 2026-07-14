export const ADMIN_PASSWORD =
  process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "shivbless2024";

export const ADMIN_SESSION_KEY = "shivbless_admin_auth";

export function verifyAdminPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

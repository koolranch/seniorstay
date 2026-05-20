export const MOVE_IN_TIMELINE_OPTIONS = [
  { value: 'Within 30 days', label: 'Within 30 days' },
  { value: '1-3 months', label: '1–3 months' },
  { value: '3-6 months', label: '3–6 months' },
  { value: '6+ months', label: '6+ months / just researching' },
] as const;

export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10;
}

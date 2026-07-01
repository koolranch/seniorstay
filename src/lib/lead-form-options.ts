export const MOVE_IN_TIMELINE_OPTIONS = [
  { value: 'Within 30 days', label: 'Within 30 days' },
  { value: '1-3 months', label: '1–3 months' },
  { value: '3-6 months', label: '3–6 months' },
  { value: '6+ months', label: '6+ months / just researching' },
] as const;

export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  const normalized = digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits;
  if (normalized.length !== 10) {
    return false;
  }

  const areaCode = normalized.slice(0, 3);
  const exchange = normalized.slice(3, 6);
  if (/^[01]/.test(areaCode) || /^[01]/.test(exchange)) {
    return false;
  }

  return true;
}

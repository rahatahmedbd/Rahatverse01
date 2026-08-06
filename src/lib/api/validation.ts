const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[+\d][\d\s()\-]{5,24}$/;

export function requiredText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return null;

  const text = value.trim();
  return text.length > 0 && text.length <= maxLength ? text : null;
}

export function optionalText(value: unknown, maxLength: number) {
  if (value === undefined || value === null || value === "") return null;
  return requiredText(value, maxLength);
}

export function validEmail(value: unknown) {
  const email = requiredText(value, 254);
  return email && EMAIL_PATTERN.test(email) ? email.toLowerCase() : null;
}

export function validPhone(value: unknown, required = false) {
  if (value === undefined || value === null || value === "") {
    return required ? null : null;
  }

  const phone = requiredText(value, 25);
  return phone && PHONE_PATTERN.test(phone) ? phone : null;
}

export function enumValue<T extends string>(value: unknown, allowed: readonly T[]) {
  return typeof value === "string" && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : null;
}

export function stringArray(value: unknown, maxItems: number, maxItemLength: number) {
  if (!Array.isArray(value) || value.length > maxItems) return null;

  const values = value.map((item) => requiredText(item, maxItemLength));
  return values.every((item): item is string => item !== null) ? values : null;
}

export function positiveInteger(value: unknown, fallback: number, max: number) {
  if (value === undefined || value === null || value === "") return fallback;
  const number = typeof value === "number" ? value : Number(value);
  return Number.isInteger(number) && number > 0 && number <= max ? number : null;
}

export function rating(value: unknown) {
  if (value === undefined || value === null || value === "") return 5;
  const number = typeof value === "number" ? value : Number(value);
  return Number.isInteger(number) && number >= 1 && number <= 5 ? number : null;
}

export const MIN_PASSWORD_LENGTH = 8;

export type PasswordRule = "length" | "uppercase" | "special";

export const PASSWORD_RULES: PasswordRule[] = [
  "length",
  "uppercase",
  "special",
];

export type PasswordChecks = Record<PasswordRule, boolean>;

export function getPasswordChecks(value: string): PasswordChecks {
  return {
    length: value.length >= MIN_PASSWORD_LENGTH,
    uppercase: /\p{Lu}/u.test(value),
    special: /[^\p{L}\p{N}]/u.test(value),
  };
}

export function isPasswordValid(value: string) {
  const checks = getPasswordChecks(value);
  return PASSWORD_RULES.every((rule) => checks[rule]);
}

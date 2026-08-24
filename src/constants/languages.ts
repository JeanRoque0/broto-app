import { getLocales } from "expo-localization";

export const LANGUAGES = [
  { code: "pt-BR", label: "Português", nativeLabel: "Português (Brasil)" },
  { code: "en-US", label: "English", nativeLabel: "English" },
  { code: "es-ES", label: "Español", nativeLabel: "Español" },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]["code"];

export const FALLBACK_LANGUAGE: LanguageCode = "en-US";

const LANGUAGE_BY_CODE: Record<string, LanguageCode> = {
  pt: "pt-BR",
  es: "es-ES",
  en: "en-US",
};

const LANGUAGE_BY_REGION: Record<string, LanguageCode> = {
  BR: "pt-BR",
  PT: "pt-BR",
  AR: "es-ES",
  BO: "es-ES",
  CL: "es-ES",
  CO: "es-ES",
  CR: "es-ES",
  CU: "es-ES",
  DO: "es-ES",
  EC: "es-ES",
  ES: "es-ES",
  GQ: "es-ES",
  GT: "es-ES",
  HN: "es-ES",
  MX: "es-ES",
  NI: "es-ES",
  PA: "es-ES",
  PE: "es-ES",
  PR: "es-ES",
  PY: "es-ES",
  SV: "es-ES",
  UY: "es-ES",
  VE: "es-ES",
};

export function isSupportedLanguage(code: string): code is LanguageCode {
  return LANGUAGES.some((language) => language.code === code);
}

export function detectDeviceLanguage(): LanguageCode {
  const [locale] = getLocales();
  if (!locale) return FALLBACK_LANGUAGE;

  if (locale.languageTag && isSupportedLanguage(locale.languageTag)) {
    return locale.languageTag;
  }

  const byCode = locale.languageCode
    ? LANGUAGE_BY_CODE[locale.languageCode]
    : undefined;
  if (byCode) return byCode;

  const byRegion = locale.regionCode
    ? LANGUAGE_BY_REGION[locale.regionCode]
    : undefined;
  if (byRegion) return byRegion;

  return FALLBACK_LANGUAGE;
}

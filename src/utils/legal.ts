import * as WebBrowser from "expo-web-browser";

import {
  FALLBACK_LANGUAGE,
  isSupportedLanguage,
  LanguageCode,
} from "@/constants/languages";
import {
  LEGAL_PATHS,
  LegalDocument,
  SITE_BASE_URL,
  TERMS_VERSION,
} from "@/constants/legal";
import i18n from "@/i18n";
import { theme } from "@/style/theme";
import { Profile } from "@/types/profile";

function currentLanguage(): LanguageCode {
  return isSupportedLanguage(i18n.language) ? i18n.language : FALLBACK_LANGUAGE;
}

export function needsConsent(profile: Profile) {
  return !profile.accepted_terms_at || profile.terms_version !== TERMS_VERSION;
}

export function legalUrl(document: LegalDocument) {
  return `${SITE_BASE_URL}${LEGAL_PATHS[currentLanguage()][document]}`;
}

export function openLegal(document: LegalDocument) {
  return WebBrowser.openBrowserAsync(legalUrl(document), {
    presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
    controlsColor: theme.primary.clay,
    toolbarColor: theme.surface.base,
    dismissButtonStyle: "close",
  });
}

export function openTerms() {
  return openLegal("terms");
}

export function openPrivacy() {
  return openLegal("privacy");
}

export function openRefund() {
  return openLegal("refund");
}

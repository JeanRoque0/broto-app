import { LanguageCode } from "@/constants/languages";

export const TERMS_VERSION = "2026-08-22";

export const SUPPORT_EMAIL = "falecombroto@gmail.com";

export const SITE_BASE_URL = "https://brotoplantas.netlify.app";

export type LegalDocument =
  | "privacy"
  | "terms"
  | "refund"
  | "deletion"
  | "help";

export const LEGAL_PATHS: Record<
  LanguageCode,
  Record<LegalDocument, string>
> = {
  "pt-BR": {
    privacy: "/privacidade",
    terms: "/termos",
    refund: "/reembolso",
    deletion: "/exclusao",
    help: "/ajuda",
  },
  "en-US": {
    privacy: "/en/privacy",
    terms: "/en/terms",
    refund: "/en/refund",
    deletion: "/en/delete-account",
    help: "/en/help",
  },
  "es-ES": {
    privacy: "/es/privacidad",
    terms: "/es/terminos",
    refund: "/es/reembolso",
    deletion: "/es/eliminar-cuenta",
    help: "/es/ayuda",
  },
};

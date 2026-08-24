import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { detectDeviceLanguage, FALLBACK_LANGUAGE } from "@/constants/languages";

import enUS from "./locales/en-US";
import esES from "./locales/es-ES";
import ptBR from "./locales/pt-BR";

const resources = {
  "pt-BR": ptBR,
  "en-US": enUS,
  "es-ES": esES,
};

i18n.use(initReactI18next).init({
  resources,
  lng: detectDeviceLanguage(),
  fallbackLng: FALLBACK_LANGUAGE,
  defaultNS: "common",
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
  load: "currentOnly",
});

export default i18n;

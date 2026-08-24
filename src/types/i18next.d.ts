import "i18next";

import ptBR from "@/i18n/locales/pt-BR";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "common";
    resources: typeof ptBR;
  }
}

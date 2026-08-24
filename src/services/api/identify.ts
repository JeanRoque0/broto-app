import i18n from "@/i18n";
import { AnalysisResponse } from "@/types/identification";

import { api } from "./config";

export interface IdentifyPayload {
  photoPaths: string[];
  plantId?: string;
}

export async function identify(payload: IdentifyPayload) {
  const response = await api.post<AnalysisResponse>("/identify", {
    ...payload,
    language: i18n.language,
  });
  return response.data;
}

import axios from "axios";

import { Toast } from "@/components/ui/Toast";
import i18n from "@/i18n";
import { supabase } from "@/services/supabase/client";

export const api = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1`,
  timeout: 120000,
  headers: {
    apikey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "",
  },
});

api.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    if (axios.isAxiosError(error)) {
      if (!error.response) {
        return Promise.reject(error);
      }

      const status = error.response.status;

      if (status === 402 || status === 401) {
        return Promise.reject(error);
      }

      Toast.show({
        text: i18n.t("requestFailed"),
        subtitle:
          (error.response.data as { message?: string } | undefined)?.message ??
          i18n.t("requestFailedSubtitle"),
      });
    }

    return Promise.reject(error);
  },
);

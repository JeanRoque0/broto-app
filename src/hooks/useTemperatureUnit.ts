import { getLocales } from "expo-localization";
import { useCallback } from "react";

import { useProfile, useUpdateProfile } from "@/hooks/useProfile";

export type TemperatureUnit = "celsius" | "fahrenheit";

export function detectDeviceUnit(): TemperatureUnit {
  const [locale] = getLocales();
  if (locale?.temperatureUnit) return locale.temperatureUnit;
  return locale?.regionCode === "US" ? "fahrenheit" : "celsius";
}

export function useTemperatureUnit() {
  const { data: profile } = useProfile();
  const { mutate } = useUpdateProfile();

  const chosen = (profile?.temperature_unit as TemperatureUnit | null) ?? null;
  const unit = chosen ?? detectDeviceUnit();

  const setUnit = useCallback(
    (next: TemperatureUnit) => mutate({ temperature_unit: next }),
    [mutate],
  );

  return { unit, chosen, setUnit };
}

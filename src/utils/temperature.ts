import { TemperatureUnit } from "@/store/unitsStore";
import { Temperature } from "@/types/identification";

export function toFahrenheit(celsius: number) {
  return Math.round((celsius * 9) / 5 + 32);
}

export function convertRange(range: Temperature, unit: TemperatureUnit) {
  if (unit === "fahrenheit") {
    return {
      min: toFahrenheit(range.min_c),
      max: toFahrenheit(range.max_c),
      symbol: "°F",
    };
  }

  return { min: range.min_c, max: range.max_c, symbol: "°C" };
}

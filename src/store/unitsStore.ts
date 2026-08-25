import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import storage from "./storage";

export type TemperatureUnit = "celsius" | "fahrenheit";

interface UnitsState {
  temperature: TemperatureUnit;
  setTemperature: (unit: TemperatureUnit) => void;
}

export const useUnitsStore = create<UnitsState>()(
  persist(
    (set) => ({
      temperature: "celsius",
      setTemperature: (temperature) => set({ temperature }),
    }),
    {
      name: "units-storage",
      storage: createJSONStorage(() => storage),
    },
  ),
);

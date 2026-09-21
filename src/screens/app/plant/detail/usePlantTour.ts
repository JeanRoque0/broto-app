import { useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";

import { TourStep } from "@/components/tour/tourStore";
import { useTour } from "@/components/tour/useTour";

export function usePlantTour(ready: boolean, goTo: (section: string) => void) {
  const { t } = useTranslation("tour");
  const jump = useRef(goTo);
  jump.current = goTo;

  const steps = useMemo<TourStep[]>(
    () => [
      {
        anchor: "plant.today",
        title: t("plantTodayTitle"),
        body: t("plantTodayBody"),
        reveal: () => jump.current("today"),
      },
      {
        anchor: "plant.care",
        title: t("plantCareTitle"),
        body: t("plantCareBody"),
        reveal: () => jump.current("routine"),
      },
      {
        anchor: "plant.menu",
        title: t("plantMenuTitle"),
        body: t("plantMenuBody"),
      },
    ],
    [t],
  );

  useTour("plant", steps, ready);
}

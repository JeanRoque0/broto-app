import { useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";

import { TourStep } from "@/components/tour/tourStore";
import { useTour } from "@/components/tour/useTour";

export function useResultTour(ready: boolean, goTo: (section: string) => void) {
  const { t } = useTranslation("tour");
  const jump = useRef(goTo);
  jump.current = goTo;

  const steps = useMemo<TourStep[]>(
    () => [
      {
        anchor: "result.causes",
        title: t("resultCausesTitle"),
        body: t("resultCausesBody"),
        reveal: () => jump.current("diagnosis"),
      },
      {
        anchor: "result.confirm",
        title: t("resultConfirmTitle"),
        body: t("resultConfirmBody"),
        reveal: () => jump.current("confirm"),
      },
      {
        anchor: "result.save",
        title: t("resultSaveTitle"),
        body: t("resultSaveBody"),
      },
    ],
    [t],
  );

  useTour("result", steps, ready);
}

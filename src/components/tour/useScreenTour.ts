import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { TourStep } from "./tourStore";
import { useTour } from "./useTour";

export type TourSpec = readonly {
  anchor: string;
  copy: string;
}[];

export function useScreenTour(id: string, specs: TourSpec, ready: boolean) {
  const { t } = useTranslation("tour");

  const steps = useMemo<TourStep[]>(
    () =>
      specs.map((spec) => ({
        anchor: spec.anchor,
        title: t(`${spec.copy}Title` as never),
        body: t(`${spec.copy}Body` as never),
      })),
    [t, specs],
  );

  useTour(id, steps, ready);
}

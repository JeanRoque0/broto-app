import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { TourStep } from "@/components/tour/tourStore";
import { useTour } from "@/components/tour/useTour";

export function useCameraTour(ready: boolean) {
  const { t } = useTranslation("tour");

  const steps = useMemo<TourStep[]>(
    () => [
      {
        anchor: "camera.tips",
        title: t("cameraTipsTitle"),
        body: t("cameraTipsBody"),
      },
      {
        anchor: "camera.gallery",
        title: t("cameraGalleryTitle"),
        body: t("cameraGalleryBody"),
      },
    ],
    [t],
  );

  useTour("camera", steps, ready);
}

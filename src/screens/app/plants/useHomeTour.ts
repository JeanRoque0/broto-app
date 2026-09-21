import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { TourStep } from "@/components/tour/tourStore";
import { useTour } from "@/components/tour/useTour";
import { useOnboardingStore } from "@/store/onboardingStore";

export function useHomeTour(hasPlants: boolean, ready: boolean) {
  const { t } = useTranslation("tour");
  const sawEmpty = useOnboardingStore((state) =>
    state.toursSeen.includes("homeEmpty"),
  );

  const tabs = useMemo<TourStep[]>(
    () => [
      {
        anchor: "tab.analyze",
        title: t("homeAnalyzeTitle"),
        body: t("homeAnalyzeBody"),
      },
      {
        anchor: "tab.chat",
        title: t("homeChatTitle"),
        body: t("homeChatBody"),
      },
    ],
    [t],
  );

  const full = useMemo<TourStep[]>(
    () => [
      { anchor: "home.add", title: t("homeAddTitle"), body: t("homeAddBody") },
      {
        anchor: "home.tabs",
        title: t("homeTabsTitle"),
        body: t("homeTabsBody"),
      },
      ...(sawEmpty ? [] : tabs),
      { anchor: "home.bell", title: t("homeBellTitle"), body: t("homeBellBody") },
    ],
    [t, tabs, sawEmpty],
  );

  useTour("homeEmpty", tabs, ready && !hasPlants);
  useTour("home", full, ready && hasPlants);
}

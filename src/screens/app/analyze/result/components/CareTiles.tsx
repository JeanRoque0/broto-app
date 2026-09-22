import { useTranslation } from "react-i18next";

import { CareGrid, CareItem } from "@/components/CareGrid";
import { useTemperatureUnit } from "@/hooks/useTemperatureUnit";
import { Care, Temperature } from "@/types/identification";
import { convertRange } from "@/utils/temperature";

export function CareTiles({
  cuidados,
  temperatura,
}: {
  cuidados: Care;
  temperatura?: Temperature | null;
}) {
  const { t } = useTranslation("analysis");
  const { unit } = useTemperatureUnit();

  const items: CareItem[] = [
    {
      icon: "water-outline",
      label: t("wateringLabel"),
      value: t("watering", { count: cuidados.rega_dias }),
      note: "",
      tone: "moss",
    },
    {
      icon: "white-balance-sunny",
      label: t("lightLabel"),
      value: t(`luz_${cuidados.luz}`),
      note: cuidados.luz_nota,
      tone: "ochre",
    },
    {
      icon: "sprout-outline",
      label: t("fertilizerLabel"),
      value: t(`adubo_${cuidados.adubo}`),
      note: cuidados.adubo_nota,
      tone: "clay",
    },
  ];

  if (temperatura) {
    items.push({
      icon: "thermometer",
      label: t("temperatureLabel"),
      value: t("temperatureRange", convertRange(temperatura, unit)),
      note: temperatura.nota,
      tone: "neutral",
    });
  }

  return <CareGrid items={items} />;
}

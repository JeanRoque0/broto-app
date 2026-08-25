import { MaterialCommunityIcons } from "@expo/vector-icons";
import { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import ViewShot from "react-native-view-shot";

import { PlantPhoto } from "@/components/PlantPhoto";
import { Text } from "@/components/ui/Text";
import { theme } from "@/style/theme";
import { useTemperatureUnit } from "@/hooks/useTemperatureUnit";
import { Care, Temperature } from "@/types/identification";
import { convertRange } from "@/utils/temperature";

const WIDTH = 1080;
const SCALE = WIDTH / 360;

export type ShareCardData = {
  title: string;
  scientific?: string | null;
  photoPath?: string | null;
  photoUri?: string | null;
  cuidados?: Care | null;
  temperatura?: Temperature | null;
  toxic?: boolean | null;
};

type Line = { icon: "water-outline" | "white-balance-sunny" | "sprout-outline" | "thermometer"; label: string; value: string };

export const PlantShareCard = forwardRef<ViewShot, { data: ShareCardData }>(
  function PlantShareCard({ data }, ref) {
    const { t } = useTranslation("analysis");
    const { unit } = useTemperatureUnit();

    const lines: Line[] = [];

    if (data.cuidados) {
      lines.push({
        icon: "water-outline",
        label: t("wateringLabel"),
        value: t("watering", { count: data.cuidados.rega_dias }),
      });
      lines.push({
        icon: "white-balance-sunny",
        label: t("lightLabel"),
        value: t(`luz_${data.cuidados.luz}`),
      });
      lines.push({
        icon: "sprout-outline",
        label: t("fertilizerLabel"),
        value: t(`adubo_${data.cuidados.adubo}`),
      });
    }

    if (data.temperatura) {
      lines.push({
        icon: "thermometer",
        label: t("temperatureLabel"),
        value: t("temperatureRange", convertRange(data.temperatura, unit)),
      });
    }


    return (
      <View style={styles.offscreen} pointerEvents="none">
        <ViewShot ref={ref} options={{ format: "png", quality: 1 }}>
          <View style={styles.card}>
            <View style={styles.photoFrame}>
              <PlantPhoto
                path={data.photoPath ?? null}
                uri={data.photoUri ?? undefined}
                style={styles.photo}
              />
            </View>

            <View style={styles.body}>
              <Text family="display" style={styles.title} numberOfLines={2}>
                {data.title}
              </Text>

              {data.scientific ? (
                <Text style={styles.scientific} numberOfLines={1}>
                  {data.scientific}
                </Text>
              ) : null}

              <View style={styles.lines}>
                {lines.map((line) => (
                  <View key={line.label} style={styles.line}>
                    <MaterialCommunityIcons
                      name={line.icon}
                      size={11 * SCALE}
                      color={theme.primary.clay}
                    />
                    <Text style={styles.lineLabel}>{line.label}</Text>
                    <Text style={styles.lineValue} numberOfLines={1}>
                      {line.value}
                    </Text>
                  </View>
                ))}
              </View>

              {data.toxic ? (
                <View style={styles.toxic}>
                  <MaterialCommunityIcons
                    name="paw"
                    size={11 * SCALE}
                    color={theme.functional.danger}
                  />
                  <Text style={styles.toxicText}>{t("toxicTitle")}</Text>
                </View>
              ) : null}
            </View>
          </View>
        </ViewShot>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  offscreen: {
    position: "absolute",
    left: -9999,
    top: 0,
  },
  card: {
    width: WIDTH,
    backgroundColor: theme.surface.card,
  },
  photoFrame: {
    width: WIDTH,
    height: WIDTH * 0.78,
    backgroundColor: theme.surface.container,
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  body: {
    padding: 20 * SCALE,
    gap: 4 * SCALE,
  },
  title: {
    fontSize: 24 * SCALE,
    lineHeight: 30 * SCALE,
    fontWeight: "600",
    color: theme.text.primary,
  },
  scientific: {
    fontSize: 13 * SCALE,
    fontStyle: "italic",
    color: theme.text.secondary,
  },
  lines: {
    marginTop: 12 * SCALE,
    gap: 8 * SCALE,
  },
  line: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8 * SCALE,
  },
  lineLabel: {
    fontSize: 12 * SCALE,
    color: theme.text.secondary,
    width: 78 * SCALE,
  },
  lineValue: {
    flex: 1,
    fontSize: 13 * SCALE,
    color: theme.text.primary,
  },
  toxic: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6 * SCALE,
    marginTop: 12 * SCALE,
  },
  toxicText: {
    fontSize: 12 * SCALE,
    color: theme.functional.danger,
  },
});

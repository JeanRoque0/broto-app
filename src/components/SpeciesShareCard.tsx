import { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import ViewShot from "react-native-view-shot";

import { Logo } from "@/components/illustrations/Logo";
import { PlantPhoto } from "@/components/PlantPhoto";
import { Text } from "@/components/ui/Text";
import { theme } from "@/style/theme";

const WIDTH = 1080;
const SCALE = WIDTH / 360;
const GAP = 3 * SCALE;

export type SpeciesShareData = {
  title: string;
  scientific: string;
  description?: string | null;
  images: string[];
};

export const SpeciesShareCard = forwardRef<
  ViewShot,
  { data: SpeciesShareData }
>(function SpeciesShareCard({ data }, ref) {
  const { t } = useTranslation("search");
  const [hero, ...rest] = data.images;
  const side = rest.slice(0, 2);

  return (
    <View style={styles.offscreen} pointerEvents="none">
      <ViewShot ref={ref} options={{ format: "png", quality: 1 }}>
        <View style={styles.card}>
          <View style={styles.mosaic}>
            <View style={styles.hero}>
              <PlantPhoto path={null} uri={hero} style={styles.photo} />
            </View>

            {side.length > 0 && (
              <View style={styles.side}>
                {side.map((image) => (
                  <View key={image} style={styles.sideCell}>
                    <PlantPhoto path={null} uri={image} style={styles.photo} />
                  </View>
                ))}
              </View>
            )}
          </View>

          <View style={styles.body}>
            <Text family="display" style={styles.title} numberOfLines={2}>
              {data.title}
            </Text>

            <Text style={styles.scientific} numberOfLines={1}>
              {data.scientific}
            </Text>

            {data.description ? (
              <Text style={styles.description} numberOfLines={5}>
                {data.description}
              </Text>
            ) : null}

            <View style={styles.footer}>
              <Logo size={22 * SCALE} />
              <Text family="mono" style={styles.credit}>
                {t("shareCredit")}
              </Text>
            </View>
          </View>
        </View>
      </ViewShot>
    </View>
  );
});

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
  mosaic: {
    flexDirection: "row",
    height: WIDTH * 0.62,
    gap: GAP,
    backgroundColor: theme.surface.container,
  },
  hero: {
    flex: 2,
  },
  side: {
    flex: 1,
    gap: GAP,
  },
  sideCell: {
    flex: 1,
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  body: {
    padding: 20 * SCALE,
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
    marginTop: 2 * SCALE,
  },
  description: {
    fontSize: 13 * SCALE,
    lineHeight: 19 * SCALE,
    color: theme.text.primary,
    marginTop: 12 * SCALE,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8 * SCALE,
    marginTop: 16 * SCALE,
    paddingTop: 12 * SCALE,
    borderTopWidth: StyleSheet.hairlineWidth * SCALE,
    borderTopColor: theme.functional.line,
  },
  credit: {
    flex: 1,
    fontSize: 10 * SCALE,
    color: theme.text.tertiary,
  },
});

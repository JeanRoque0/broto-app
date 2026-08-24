import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { MarkedPhoto } from "@/components/MarkedPhoto";
import { Card } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";
import { theme } from "@/style/theme";
import { fontSize, type } from "@/style/typography";
import { Diagnosis } from "@/types/identification";

export const DIAGNOSIS_CARD_WIDTH = 290;
const THUMB_HEIGHT = 118;

type DiagnosisCardProps = {
  item: Diagnosis;
  photo?: string;
  photoPath?: string | null;
  onOpenPhoto: () => void;
};

export function DiagnosisCard({
  item,
  photo,
  photoPath,
  onOpenPhoto,
}: DiagnosisCardProps) {
  const { t } = useTranslation("analysis");

  return (
    <Card style={styles.card}>
      <Text family="display" style={styles.cause}>
        {item.causa}
      </Text>

      {(photo || photoPath) && item.marcacao && (
        <View style={styles.photoBlock}>
          <MarkedPhoto
            uri={photo}
            path={photoPath}
            mark={item.marcacao}
            onPress={onOpenPhoto}
            height={THUMB_HEIGHT}
            accessibilityLabel={t("markHint")}
          />
          <Text family="mono" style={styles.photoHint}>
            {t("markHint")}
          </Text>
        </View>
      )}

      <View style={styles.block}>
        <Text family="mono" style={styles.label}>
          {t("signsLabel")}
        </Text>
        <Text style={styles.body}>{item.sinais}</Text>
      </View>

      <View style={styles.block}>
        <Text family="mono" style={styles.label}>
          {t("actionLabel")}
        </Text>
        <Text style={styles.body}>{item.acao}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: DIAGNOSIS_CARD_WIDTH,
    gap: theme.spacing.s4,
  },
  cause: {
    ...type.displayXs,
    flex: 1,
  },
  photoBlock: {
    gap: theme.spacing.s2,
  },
  photoHint: {
    fontSize: fontSize.s1,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: theme.text.tertiary,
    textAlign: "center",
  },
  block: {
    gap: theme.spacing.s1,
  },
  label: {
    fontSize: fontSize.s1,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: theme.text.tertiary,
  },
  body: {
    ...type.body,
    color: theme.text.primary,
  },
});

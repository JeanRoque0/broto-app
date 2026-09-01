import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { PlantPhoto } from "@/components/PlantPhoto";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { FlashListContainer } from "@/components/ui/FlashListContainer";
import { Loader } from "@/components/ui/Loader";
import { RipplePressable } from "@/components/ui/RipplePressable";
import { Text } from "@/components/ui/Text";
import { theme } from "@/style/theme";
import { fontSize } from "@/style/typography";
import { formatShortDate } from "@/utils/format";

import { useAnalyses } from "./useAnalyses";

const KEEP_DAYS = 7;

function expiresAt(created: string) {
  const date = new Date(created);
  date.setDate(date.getDate() + KEEP_DAYS);
  return date;
}

const HEALTH = {
  saudavel: { key: "historyHealthy", color: theme.secondary.moss },
  atencao: { key: "historyAttention", color: theme.secondary.ochre },
  problema: { key: "historyIssue", color: theme.primary.clay },
} as const;

type AnalysesPanelProps = {
  header: ReactElement;
  bottomSpace: number;
};

export function AnalysesPanel({ header, bottomSpace }: AnalysesPanelProps) {
  const { t } = useTranslation("analysis");
  const { items, isLoading, isError, refetch, open, startAnalysis } =
    useAnalyses();

  const failed = isError && items.length === 0;

  if (isLoading || failed || items.length === 0) {
    return (
      <View>
        {header}

        <View style={styles.panel}>
          {isLoading && <Loader />}

          {!isLoading && failed && (
            <ErrorState description={t("historyLoadFailed")} onRetry={refetch} />
          )}

          {!isLoading && !failed && (
            <EmptyState
              title={t("historyEmptyTitle")}
              description={t("historyEmptyDescription")}
              actionLabel={t("historyEmptyAction")}
              onAction={startAnalysis}
            />
          )}
        </View>
      </View>
    );
  }

  return (
    <FlashListContainer
      data={items}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={header}
      ListHeaderComponentStyle={styles.headSpace}
      contentContainerStyle={{ paddingBottom: bottomSpace }}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => {
        const health = HEALTH[item.result?.saude ?? "saudavel"];

        return (
          <View style={styles.padded}>
            <RipplePressable
              onPress={() => open(item)}
              style={styles.row}
              accessibilityRole="button"
            >
              <PlantPhoto
                path={item.photo_path}
                style={styles.thumb}
                fallback={
                  <MaterialCommunityIcons
                    name="sprout-outline"
                    size={20}
                    color={theme.illustration.leaf}
                  />
                }
              />

              <View style={styles.texts}>
                <Text style={styles.species} numberOfLines={2}>
                  {item.result?.especie?.comum ?? t("historyUnknownSpecies")}
                </Text>

                <View style={styles.meta}>
                  <View
                    style={[styles.dot, { backgroundColor: health.color }]}
                  />
                  <Text style={styles.health}>{t(health.key)}</Text>
                  <Text family="mono" style={styles.date}>
                    {formatShortDate(item.created_at)}
                  </Text>
                </View>

                <Text
                  family="mono"
                  style={[
                    styles.lifetime,
                    item.plant_id ? styles.saved : styles.expires,
                  ]}
                >
                  {item.plant_id
                    ? t("historySaved")
                    : t("historyExpires", {
                        date: formatShortDate(expiresAt(item.created_at)),
                      })}
                </Text>
              </View>

              <Feather
                name="chevron-right"
                size={18}
                color={theme.text.secondary}
              />
            </RipplePressable>
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  panel: {
    marginTop: theme.spacing.s6,
    paddingHorizontal: theme.screenPadding,
  },
  headSpace: {
    marginBottom: theme.spacing.s5,
  },
  padded: {
    paddingHorizontal: theme.screenPadding,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.s4,
    padding: theme.spacing.s3,
    marginBottom: theme.spacing.s2,
    backgroundColor: theme.surface.card,
    borderWidth: 1,
    borderColor: theme.functional.line,
    borderRadius: theme.radius.md,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: theme.radius.field,
  },
  texts: {
    flex: 1,
    gap: 3,
  },
  species: {
    fontSize: fontSize.s6,
    fontWeight: "700",
    color: theme.text.primary,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  health: {
    fontSize: fontSize.s3,
    color: theme.text.secondary,
  },
  date: {
    fontSize: fontSize.s2,
    color: theme.text.tertiary,
  },
  lifetime: {
    fontSize: fontSize.s3,
    fontWeight: "500",
  },
  saved: {
    color: theme.secondary.moss,
  },
  expires: {
    color: theme.secondary.ochre,
  },
});

import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { PlantPhoto } from "@/components/PlantPhoto";
import { TourAnchor } from "@/components/tour/TourAnchor";
import { useScreenTour } from "@/components/tour/useScreenTour";
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
const WARN_DAYS = 2;
const DAY = 86400000;

function expiresAt(created: string) {
  const date = new Date(created);
  date.setDate(date.getDate() + KEEP_DAYS);
  return date;
}

const HEALTH = {
  saudavel: {
    key: "historyHealthy",
    color: theme.secondary.moss,
    soft: theme.secondary.mossSoft,
  },
  atencao: {
    key: "historyAttention",
    color: theme.secondary.ochre,
    soft: theme.secondary.ochreSoft,
  },
  problema: {
    key: "historyIssue",
    color: theme.primary.clay,
    soft: theme.primary.claySoft,
  },
} as const;

const ANALYSES_TOUR = [
  { anchor: "analyses.row", copy: "analysesRow" },
] as const;

type AnalysesPanelProps = {
  active: boolean;
  topSpace: number;
  bottomSpace: number;
};

export function AnalysesPanel({
  active,
  topSpace,
  bottomSpace,
}: AnalysesPanelProps) {
  const { t } = useTranslation("analysis");
  const [now] = useState(() => Date.now());
  const { items, isLoading, isError, refetch, open, startAnalysis } =
    useAnalyses();

  const failed = isError && items.length === 0;
  useScreenTour("analyses", ANALYSES_TOUR, active && items.length > 0);

  if (isLoading || failed || items.length === 0) {
    return (
      <View>
        <View style={[styles.panel, { paddingTop: topSpace }]}>
          {isLoading && <Loader />}

          {!isLoading && failed && (
            <ErrorState
              description={t("historyLoadFailed")}
              onRetry={refetch}
            />
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
      ListHeaderComponent={
        <View style={styles.padded}>
          <Text style={styles.note}>
            {t("historyKeepNote", { count: KEEP_DAYS })}
          </Text>
        </View>
      }
      contentContainerStyle={{
        paddingTop: topSpace + theme.spacing.s3,
        paddingBottom: bottomSpace,
      }}
      showsVerticalScrollIndicator={false}
      renderItem={({ item, index }) => {
        const health = HEALTH[item.result?.saude ?? "saudavel"];
        const expires = expiresAt(item.created_at);
        const expiringSoon =
          !item.plant_id && expires.getTime() - now < WARN_DAYS * DAY;

        return (
          <View style={styles.padded}>
            <RipplePressable
              onPress={() => open(item)}
              style={styles.row}
              accessibilityRole="button"
            >
              {index === 0 && <TourAnchor id="analyses.row" />}
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
                  <View style={[styles.pill, { backgroundColor: health.soft }]}>
                    <Text style={[styles.health, { color: health.color }]}>
                      {t(health.key)}
                    </Text>
                  </View>
                  <Text style={styles.date}>
                    {formatShortDate(item.created_at)}
                  </Text>
                  {item.plant_id && (
                    <View style={styles.savedTag}>
                      <Feather
                        name="check"
                        size={12}
                        color={theme.secondary.moss}
                      />
                      <Text style={styles.saved}>{t("historySaved")}</Text>
                    </View>
                  )}
                </View>
                {expiringSoon && (
                  <Text style={styles.expires}>
                    {t("historyExpires", { date: formatShortDate(expires) })}
                  </Text>
                )}
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
  padded: {
    paddingHorizontal: theme.screenPadding,
  },
  note: {
    fontSize: fontSize.s4,
    color: theme.text.tertiary,
    marginBottom: theme.spacing.s3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.s3,
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
  pill: {
    paddingHorizontal: theme.spacing.s2,
    paddingVertical: 2,
    borderRadius: theme.radius.pill,
  },
  health: {
    fontSize: fontSize.s3,
    fontWeight: "700",
  },
  date: {
    fontSize: fontSize.s4,
    color: theme.text.tertiary,
  },
  savedTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  saved: {
    fontSize: fontSize.s4,
    fontWeight: "500",
    color: theme.secondary.moss,
  },
  expires: {
    fontSize: fontSize.s4,
    fontWeight: "500",
    color: theme.secondary.ochre,
  },
});

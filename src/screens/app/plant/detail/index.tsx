import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, Pressable, ScrollView, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  DIAGNOSIS_CARD_WIDTH,
  DiagnosisCard,
} from "@/components/DiagnosisCard";
import { ConfirmCard } from "@/components/ConfirmCard";
import { CareRoutine } from "@/components/CareRoutine";
import { CopyableName } from "@/components/CopyableName";
import { PlantShareCard } from "@/components/PlantShareCard";

import { TodayCard } from "./components/TodayCard";
import { PhotoZoom } from "@/components/PhotoZoom";
import { TaskEditSheet } from "@/components/TaskEditSheet";
import { ChatSuggestions } from "@/components/ChatSuggestions";
import { QuizCard } from "@/components/QuizCard";
import { PlantPhoto } from "@/components/PlantPhoto";
import { BackIcon } from "@/components/ui/BackIcon";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CircleButton } from "@/components/ui/CircleButton";
import { ContainerModalCenter } from "@/components/ui/ContainerModalCenter";
import { ErrorState } from "@/components/ui/ErrorState";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Loader } from "@/components/ui/Loader";
import { RipplePressable } from "@/components/ui/RipplePressable";
import { MenuRow } from "@/components/ui/Row";
import { Text } from "@/components/ui/Text";
import { useShareCard } from "@/hooks/useShareCard";
import { useSpeciesFacts } from "@/hooks/useSpeciesFacts";
import { useStatusBarStyle } from "@/hooks/useStatusBarStyle";
import { useTemperatureUnit } from "@/hooks/useTemperatureUnit";
import { convertRange } from "@/utils/temperature";
import { theme } from "@/style/theme";
import { Diagnosis, SymptomMark } from "@/types/identification";
import { formatShortDate } from "@/utils/format";

import { HEADER_PHOTO, styles } from "./style";
import { usePlantDetail } from "./usePlantDetail";

const SNAP = DIAGNOSIS_CARD_WIDTH + theme.spacing.s3;
const BAR_IN = 110;
const BAR_OUT = 210;

export default function PlantDetailScreen() {
  const { t } = useTranslation("plants");
  const { t: tAnalysis } = useTranslation("analysis");
  const { t: tCommon } = useTranslation();
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);
  const [darkBar, setDarkBar] = useState(false);
  const [zoom, setZoom] = useState<{
    mark: SymptomMark | null;
    path: string | null;
    index: number | null;
    causes?: Diagnosis[];
  } | null>(null);

  useStatusBarStyle(darkBar && !zoom ? "dark" : "light");
  const { unit } = useTemperatureUnit();
  const {
    plant,
    events,
    careTasks,
    isPro,
    lockedKinds,
    openPaywall,
    todayTasks,
    upcoming,
    complete,
    pendingTask,
    editingTask,
    editTask,
    closeTaskEdit,
    savingTask,
    saveTask,
    toggleTask,
    diagnoses,
    resolve,
    resolving,
    startNewAnalysis,
    isLoading,
    isError,
    refetch,
    removing,
    removeVisible,
    openRemove,
    closeRemove,
    remove,
    edit,
    goBack,
  } = usePlantDetail();

  const { facts } = useSpeciesFacts(plant?.species_scientific);
  const { shot, share, sharing } = useShareCard();

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  useAnimatedReaction(
    () => scrollY.value > (BAR_IN + BAR_OUT) / 2,
    (isDark, previous) => {
      if (isDark !== previous) runOnJS(setDarkBar)(isDark);
    },
  );

  const heroStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          [-HEADER_PHOTO, 0, HEADER_PHOTO],
          [0, 0, -HEADER_PHOTO * 0.4],
          Extrapolation.CLAMP,
        ),
      },
      {
        scale: interpolate(
          scrollY.value,
          [-HEADER_PHOTO, 0],
          [2, 1],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  const barStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [BAR_IN, BAR_OUT],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  const overPhotoStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [BAR_IN, BAR_OUT],
      [1, 0],
      Extrapolation.CLAMP,
    ),
  }));

  if (isLoading) {
    return (
      <View style={[styles.flex, styles.centered]}>
        <Loader />
      </View>
    );
  }

  if (isError || !plant) {
    return (
      <View style={[styles.flex, styles.centered]}>
        <ErrorState
          description={t("plantLoadFailed")}
          onRetry={() => refetch()}
        />
      </View>
    );
  }

  const care = [
    {
      icon: "water-outline" as const,
      label: t("intervalLabel"),
      value: plant.watering_interval_days
        ? t("interval", { count: plant.watering_interval_days })
        : t("noInterval"),
      note: "",
    },
    plant.light && {
      icon: "white-balance-sunny" as const,
      label: t("lightLabel"),
      value: tAnalysis(`luz_${plant.light}`, plant.light),
      note: plant.light_note ?? "",
    },
    plant.fertilizer && {
      icon: "sprout-outline" as const,
      label: t("fertilizerLabel"),
      value: tAnalysis(`adubo_${plant.fertilizer}`, plant.fertilizer),
      note: plant.fertilizer_note ?? "",
    },
    facts?.temperatura && {
      icon: "thermometer" as const,
      label: tAnalysis("temperatureLabel"),
      value: tAnalysis(
        "temperatureRange",
        convertRange(facts.temperatura, unit),
      ),
      note: facts.temperatura.nota,
    },
    plant.care_notes && {
      icon: "note-text-outline" as const,
      label: t("notesLabel"),
      value: plant.care_notes,
      note: "",
    },
  ].filter(Boolean) as {
    icon: "water-outline";
    label: string;
    value: string;
    note: string;
  }[];

  return (
    <View style={styles.flex}>
      <Animated.View style={[styles.hero, heroStyle]}>
        <PlantPhoto
          path={plant.photo_path}
          style={styles.heroFallback}
          fallback={
            <MaterialCommunityIcons
              name="sprout-outline"
              size={44}
              color={theme.illustration.leaf}
            />
          }
        />
      </Animated.View>

      <Animated.ScrollView
        style={styles.flex}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          onPress={() =>
            plant.photo_path
              ? setZoom({ mark: null, path: plant.photo_path, index: null })
              : edit()
          }
          style={styles.heroTouch}
          accessibilityRole="imagebutton"
          accessibilityLabel={
            plant.photo_path ? tAnalysis("markHint") : t("photoAdd")
          }
        />

        <View style={styles.sheet}>
          <View style={styles.padded}>
            <Eyebrow>{plant.species_common ?? t("title")}</Eyebrow>
            <CopyableName
              label={plant.nickname}
              common={plant.species_common}
              scientific={plant.species_scientific}
              textStyle={styles.nickname}
            />
            {plant.species_scientific && (
              <Text style={styles.species}>{plant.species_scientific}</Text>
            )}

            <TodayCard
              tasks={todayTasks}
              upcoming={upcoming}
              pending={pendingTask}
              onComplete={complete}
            />
          </View>
          <View style={[styles.section, styles.padded]}>
            <ChatSuggestions
              seed={plant.id}
              scopes={["plant", "diagnosis"]}
              plantId={plant.id}
              plantName={plant.nickname}
              speciesName={plant.species_common}
              met={[
                ...(plant.toxic_to_pets ? (["toxic"] as const) : []),
                ...(diagnoses.some((item) => !item.resolved_at)
                  ? (["hasDiagnosis"] as const)
                  : []),
                ...(events.length === 0 ? (["neverWatered"] as const) : []),
              ]}
            />
          </View>

          <View style={[styles.section, styles.padded]}>
            <Eyebrow>{t("careEyebrow")}</Eyebrow>
            <Card style={styles.careCard}>
              {care.map((item, index) => (
                <View
                  key={item.label}
                  style={[
                    styles.careRow,
                    index === care.length - 1 && styles.careRowLast,
                  ]}
                >
                  <View style={styles.careIcon}>
                    <MaterialCommunityIcons
                      name={item.icon}
                      size={18}
                      color={theme.primary.clay}
                    />
                  </View>
                  <View style={styles.careTexts}>
                    <Text family="mono" style={styles.careLabel}>
                      {item.label}
                    </Text>
                    <Text style={styles.careValue}>{item.value}</Text>
                    {!!item.note && (
                      <Text style={styles.careNote}>{item.note}</Text>
                    )}
                  </View>
                </View>
              ))}
            </Card>
          </View>

          {careTasks.length > 0 && (
            <View style={[styles.section, styles.padded]}>
              <Eyebrow>{t("careEyebrowTasks")}</Eyebrow>
              <Text family="display" style={styles.sectionTitle}>
                {t("careTasksTitle")}
              </Text>
              <Text style={styles.sectionHint}>{t("careTasksHint")}</Text>

              <View style={styles.routine}>
                <CareRoutine
                  tasks={careTasks}
                  onEdit={editTask}
                  lockedKinds={lockedKinds}
                  onLocked={openPaywall}
                />
              </View>

              {!isPro && (
                <RipplePressable
                  onPress={openPaywall}
                  style={styles.routineUpsell}
                  accessibilityRole="button"
                >
                  <MaterialCommunityIcons
                    name="lock-outline"
                    size={16}
                    color={theme.secondary.ochre}
                  />
                  <Text style={styles.routineUpsellText}>
                    {t("careTasksLocked")}
                  </Text>
                  <Feather
                    name="chevron-right"
                    size={16}
                    color={theme.secondary.ochre}
                  />
                </RipplePressable>
              )}
            </View>
          )}

          {plant.toxic_to_pets && (
            <View style={styles.padded}>
              <Card style={styles.toxic}>
                <MaterialCommunityIcons
                  name="paw"
                  size={20}
                  color={theme.functional.danger}
                />
                <View style={styles.toxicTexts}>
                  <Text style={styles.toxicTitle}>{t("toxicTitle")}</Text>
                  <Text style={styles.toxicText}>{t("toxicText")}</Text>
                </View>
              </Card>
            </View>
          )}

          {facts?.cultivo ? (
            <View style={[styles.section, styles.padded]}>
              <Eyebrow>{tAnalysis("growEyebrow")}</Eyebrow>
              <Text family="display" style={styles.sectionTitle}>
                {tAnalysis("growTitle")}
              </Text>
              <Card style={styles.infoCard}>
                <Text style={styles.cardText}>{facts.cultivo}</Text>
              </Card>
            </View>
          ) : null}

          {facts?.simbolismo ? (
            <View style={[styles.section, styles.padded]}>
              <Eyebrow>{tAnalysis("loreEyebrow")}</Eyebrow>
              <Text family="display" style={styles.sectionTitle}>
                {tAnalysis("loreTitle")}
              </Text>
              <Card style={styles.infoCard}>
                <Text style={styles.cardText}>{facts.simbolismo}</Text>
              </Card>
            </View>
          ) : null}

          {diagnoses.length > 0 && (
            <View style={styles.section}>
              <View style={styles.padded}>
                <Eyebrow>{t("diagEyebrow")}</Eyebrow>
              </View>

              {diagnoses.map((analysis) => {
                const causes = analysis.result?.diagnostico ?? [];
                const marked = causes.filter((cause) => cause.marcacao);
                const done = !!analysis.resolved_at;

                if (done) {
                  return (
                    <View
                      key={analysis.id}
                      style={[styles.padded, styles.resolvedRow]}
                    >
                      <Feather
                        name="check-circle"
                        size={16}
                        color={theme.secondary.moss}
                      />
                      <Text style={styles.resolvedText} numberOfLines={2}>
                        {causes.map((cause) => cause.causa).join(" · ")}
                      </Text>
                      <Text family="mono" style={styles.resolvedDate}>
                        {formatShortDate(analysis.created_at)}
                      </Text>
                    </View>
                  );
                }

                return (
                  <View key={analysis.id} style={styles.analysis}>
                    <View style={styles.padded}>
                      <Text family="mono" style={styles.analysisDate}>
                        {formatShortDate(analysis.created_at)}
                      </Text>
                    </View>

                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      snapToInterval={SNAP}
                      decelerationRate="fast"
                      contentContainerStyle={styles.carousel}
                    >
                      {causes.map((cause) => (
                        <DiagnosisCard
                          key={cause.causa}
                          item={cause}
                          photoPath={analysis.photo_path}
                          onOpenPhoto={() =>
                            setZoom({
                              mark: cause.marcacao,
                              path: analysis.photo_path,
                              index: marked.indexOf(cause),
                              causes: marked,
                            })
                          }
                        />
                      ))}
                    </ScrollView>

                    {analysis.result?.como_confirmar ? (
                      <View style={[styles.padded, styles.confirmBlock]}>
                        <Eyebrow>{tAnalysis("confirmEyebrow")}</Eyebrow>
                        <Text family="display" style={styles.sectionTitle}>
                          {tAnalysis("confirmTitle")}
                        </Text>
                        <ConfirmCard
                          value={analysis.result.como_confirmar}
                          style={styles.infoCard}
                        />
                      </View>
                    ) : null}

                    <View style={styles.padded}>
                      <Button
                        label={t("diagResolve")}
                        onPress={() => resolve(analysis.id)}
                        loading={resolving}
                        variant="outline"
                        size="md"
                        style={styles.resolveButton}
                      />
                    </View>
                  </View>
                );
              })}

              {diagnoses.every((item) => item.resolved_at) && (
                <View style={[styles.padded, styles.newAnalysis]}>
                  <Button
                    label={t("newAnalysis")}
                    onPress={startNewAnalysis}
                    size="md"
                  />
                </View>
              )}
            </View>
          )}

          {events.length > 0 && (
            <View style={[styles.section, styles.padded]}>
              <Eyebrow>{t("historyEyebrow")}</Eyebrow>
              <Card style={styles.historyCard}>
                {events.map((event) => (
                  <View key={event.id} style={styles.event}>
                    <Feather
                      name="check"
                      size={15}
                      color={theme.secondary.moss}
                    />
                    <Text style={styles.eventKind}>
                      {t(`kind_${event.kind}`)}
                    </Text>
                    <Text family="mono" style={styles.eventDate}>
                      {formatShortDate(event.happened_at)}
                    </Text>
                  </View>
                ))}
              </Card>
            </View>
          )}

          <View style={[styles.section, styles.padded]}>
            <QuizCard />
          </View>

          <View style={[styles.section, styles.padded]}>
            <Card style={styles.menuCard}>
              <MenuRow label={t("editPlant")} icon="edit-2" onPress={edit} />
              <MenuRow
                label={t("removePlant")}
                icon="trash-2"
                danger
                onPress={openRemove}
                last
              />
            </Card>
          </View>
        </View>
      </Animated.ScrollView>

      <Animated.View
        style={[styles.bar, barStyle, { paddingTop: insets.top }]}
        pointerEvents="none"
      >
        <View style={styles.barInner}>
          <Text style={styles.barTitle} numberOfLines={1}>
            {plant.nickname}
          </Text>
        </View>
      </Animated.View>

      <View style={[styles.back, { top: insets.top + theme.spacing.s2 }]}>
        <Animated.View style={barStyle}>
          <CircleButton onPress={goBack} accessibilityLabel={tCommon("back")}>
            <BackIcon />
          </CircleButton>
        </Animated.View>

        <Animated.View
          style={[styles.backOverlay, overPhotoStyle]}
          pointerEvents="none"
        >
          <CircleButton
            onPress={goBack}
            style={styles.backOnPhoto}
            accessibilityLabel={tCommon("back")}
          >
            <BackIcon color={theme.text.onDark} />
          </CircleButton>
        </Animated.View>
      </View>
      <View style={[styles.share, { top: insets.top + theme.spacing.s2 }]}>
        <Animated.View style={barStyle}>
          <CircleButton
            onPress={share}
            accessibilityLabel={tAnalysis("shareTitle")}
          >
            <Feather
              name={Platform.OS === "ios" ? "share" : "share-2"}
              size={17}
              color={sharing ? theme.text.tertiary : theme.text.primary}
            />
          </CircleButton>
        </Animated.View>

        <Animated.View
          style={[styles.backOverlay, overPhotoStyle]}
          pointerEvents="none"
        >
          <CircleButton
            onPress={share}
            style={styles.backOnPhoto}
            accessibilityLabel={tAnalysis("shareTitle")}
          >
            <Feather
              name={Platform.OS === "ios" ? "share" : "share-2"}
              size={17}
              color={theme.text.onDark}
            />
          </CircleButton>
        </Animated.View>
      </View>

      <PlantShareCard
        ref={shot}
        data={{
          title: plant.nickname,
          scientific: plant.species_scientific,
          photoPath: plant.photo_path,
          cuidados: facts?.cuidados,
          temperatura: facts?.temperatura,
          toxic: plant.toxic_to_pets,
        }}
      />

      <TaskEditSheet
        task={editingTask}
        plantName={plant.nickname}
        saving={savingTask}
        onClose={closeTaskEdit}
        onSave={saveTask}
        onToggle={toggleTask}
      />

      <PhotoZoom
        visible={zoom !== null}
        path={zoom?.path}
        mark={zoom?.mark}
        diagnoses={zoom?.causes}
        initialIndex={zoom?.index ?? 0}
        onClose={() => setZoom(null)}
        closeLabel={tCommon("back")}
      />

      <ContainerModalCenter
        visible={removeVisible}
        onClose={closeRemove}
        title={t("removeTitle")}
        description={t("removeText")}
      >
        <Button
          label={t("removeConfirm")}
          onPress={remove}
          loading={removing}
          variant="danger"
        />
        <Button
          label={tCommon("cancel")}
          onPress={closeRemove}
          variant="ghost"
        />
      </ContainerModalCenter>
    </View>
  );
}

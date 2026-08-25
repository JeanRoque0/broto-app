import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
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
import { CareRoutine } from "@/components/CareRoutine";
import { ConfirmCard } from "@/components/ConfirmCard";
import { CopyableName } from "@/components/CopyableName";
import { PlantShareCard } from "@/components/PlantShareCard";
import { GroupSheet } from "@/components/GroupSheet";
import { ChatSuggestions } from "@/components/ChatSuggestions";
import { QuizCard } from "@/components/QuizCard";
import { ResultFeedback } from "@/components/ResultFeedback";
import { PhotoZoom } from "@/components/PhotoZoom";
import { PlantPhoto } from "@/components/PlantPhoto";
import { BackIcon } from "@/components/ui/BackIcon";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { CircleButton } from "@/components/ui/CircleButton";
import { RipplePressable } from "@/components/ui/RipplePressable";
import { ContainerModalCenter } from "@/components/ui/ContainerModalCenter";
import { ErrorState } from "@/components/ui/ErrorState";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { StepDots } from "@/components/ui/ProgressBar";
import { Text } from "@/components/ui/Text";
import { useShareCard } from "@/hooks/useShareCard";
import { useStatusBarStyle } from "@/hooks/useStatusBarStyle";
import { theme } from "@/style/theme";
import { Diagnosis, SymptomMark } from "@/types/identification";

import { previewCareTasks } from "@/utils/carePreview";

import { CareTiles } from "./components/CareTiles";
import { HEADER_PHOTO, styles } from "./style";
import { useResult } from "./useResult";

const SNAP = DIAGNOSIS_CARD_WIDTH + theme.spacing.s3;
const BAR_IN = 120;
const BAR_OUT = 230;

export default function ResultScreen() {
  const { t } = useTranslation("analysis");
  const { t: tCommon } = useTranslation();
  const { t: tPlants } = useTranslation("plants");
  const insets = useSafeAreaInsets();
  const {
    result,
    fromHistory,
    photo,
    photoPath,
    feedback,
    sendFeedback,
    canRate,
    report,
    saving,
    canSave,
    save,
    close,
    plantId,
    backToPlant,
    groups,
    selectedGroup,
    selectGroup,
    confirmSave,
    groupModal,
    closeGroupModal,
    groupSheet,
    openGroupSheet,
    closeGroupSheet,
    savingGroup,
    submitGroup,
  } = useResult();
  const [card, setCard] = useState(1);
  const { shot, share, sharing } = useShareCard();
  const [zoom, setZoom] = useState<{
    mark: SymptomMark | null;
    index: number | null;
    causes?: Diagnosis[];
  } | null>(null);
  const scrollY = useSharedValue(0);
  const [darkBar, setDarkBar] = useState(false);

  useStatusBarStyle(darkBar && !zoom ? "dark" : "light");

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

  if (!result) {
    return (
      <View style={styles.flex}>
        <ErrorState onRetry={close} />
      </View>
    );
  }

  const { especie, cuidados, diagnostico, saude } = result;
  const marked = diagnostico.filter((item) => item.marcacao);
  const previewTasks = previewCareTasks(cuidados);
  const healthy = saude === "saudavel";
  const title = especie?.comum ?? t("unknownSpecies");
  const showFooter = fromHistory ? canSave && !plantId : true;

  return (
    <View style={styles.flex}>
      <Animated.View style={[styles.hero, heroStyle]}>
        {photo ? (
          <Image
            source={{ uri: photo }}
            style={styles.heroImage}
            contentFit="cover"
          />
        ) : (
          <PlantPhoto path={photoPath} style={styles.heroImage} />
        )}
      </Animated.View>

      <Animated.ScrollView
        style={styles.flex}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          onPress={() => setZoom({ mark: null, index: null })}
          style={styles.heroTouch}
          accessibilityRole="imagebutton"
          accessibilityLabel={t("markHint")}
        />

        <View style={styles.sheet}>
          <View style={styles.padded}>
            <Eyebrow>{t("speciesEyebrow")}</Eyebrow>

            {especie ? (
              <>
                <CopyableName
                  label={especie.comum}
                  common={especie.comum}
                  scientific={especie.cientifico}
                  textStyle={styles.species}
                />
                <Text style={styles.scientific}>{especie.cientifico}</Text>
              </>
            ) : (
              <>
                <Text family="display" style={styles.species}>
                  {t("unknownSpecies")}
                </Text>
                <Text style={styles.unknownHint}>
                  {t("unknownSpeciesHint")}
                </Text>
              </>
            )}

            {fromHistory && plantId && (
              <RipplePressable
                onPress={backToPlant}
                style={styles.savedCard}
                accessibilityRole="button"
              >
                <MaterialCommunityIcons
                  name="check-circle"
                  size={20}
                  color={theme.secondary.moss}
                />
                <View style={styles.savedTexts}>
                  <Text style={styles.savedTitle}>{t("savedPlantTitle")}</Text>
                  <Text style={styles.savedAction}>
                    {t("savedPlantAction")}
                  </Text>
                </View>
                <Feather
                  name="chevron-right"
                  size={18}
                  color={theme.text.secondary}
                />
              </RipplePressable>
            )}

            {canRate && (
              <ResultFeedback answer={feedback} onAnswer={sendFeedback} />
            )}

            <View
              style={[
                styles.status,
                healthy ? styles.statusOk : styles.statusWarn,
              ]}
            >
              <MaterialCommunityIcons
                name={healthy ? "check-circle" : "alert-circle"}
                size={20}
                color={healthy ? theme.secondary.moss : theme.primary.clay}
              />
              <Text style={styles.statusText}>
                {healthy
                  ? t("healthyTitle")
                  : t("diagnosisHint", { count: diagnostico.length })}
              </Text>
            </View>
          </View>

          {!healthy && diagnostico.length > 0 && (
            <View style={styles.section}>
              <View style={styles.padded}>
                <Eyebrow>{t("diagnosisEyebrow")}</Eyebrow>
                <Text family="display" style={styles.sectionTitle}>
                  {t("diagnosisTitle")}
                </Text>
                {diagnostico.length > 1 && (
                  <Text style={styles.swipeHint}>{t("swipeHint")}</Text>
                )}
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={SNAP}
                decelerationRate="fast"
                contentContainerStyle={styles.carousel}
                onMomentumScrollEnd={(event) =>
                  setCard(
                    Math.round(event.nativeEvent.contentOffset.x / SNAP) + 1,
                  )
                }
              >
                {diagnostico.map((item) => (
                  <DiagnosisCard
                    key={item.causa}
                    item={item}
                    photo={photo}
                    photoPath={photoPath}
                    onOpenPhoto={() =>
                      setZoom({
                        mark: item.marcacao,
                        index: marked.indexOf(item),
                        causes: marked,
                      })
                    }
                  />
                ))}
              </ScrollView>

              {diagnostico.length > 1 && (
                <StepDots
                  total={diagnostico.length}
                  current={card}
                  style={styles.dots}
                />
              )}
            </View>
          )}

          {result.como_confirmar ? (
            <View style={[styles.section, styles.padded]}>
              <Eyebrow>{t("confirmEyebrow")}</Eyebrow>
              <Text family="display" style={styles.sectionTitle}>
                {t(healthy ? "confirmTitleHealthy" : "confirmTitle")}
              </Text>
              <ConfirmCard
                value={result.como_confirmar}
                style={styles.confirm}
              />
            </View>
          ) : null}

          <View style={[styles.suggestionsBlock, styles.padded]}>
            <ChatSuggestions
              seed={result.especie?.cientifico ?? "analise"}
              scopes={["species", "diagnosis", "general"]}
              speciesName={result.especie?.comum ?? null}
              met={[
                ...(result.toxica_para_pets ? (["toxic"] as const) : []),
                ...(!healthy ? (["hasDiagnosis"] as const) : []),
              ]}
            />
          </View>

          <View style={[styles.suggestionsBlock, styles.padded]}>
            <QuizCard />
          </View>

          {cuidados && (
            <View style={[styles.section, styles.padded]}>
              <Eyebrow>{t("careTitle")}</Eyebrow>
              <CareTiles
                cuidados={cuidados}
                temperatura={result.temperatura}
              />
            </View>
          )}

          {result.toxica_para_pets && (
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

          {result.cultivo ? (
            <View style={[styles.section, styles.padded]}>
              <Eyebrow>{t("growEyebrow")}</Eyebrow>
              <Text family="display" style={styles.sectionTitle}>
                {t("growTitle")}
              </Text>
              <Card style={styles.infoCard}>
                <Text style={styles.confirmText}>{result.cultivo}</Text>
              </Card>
            </View>
          ) : null}

          {result.simbolismo ? (
            <View style={[styles.section, styles.padded]}>
              <Eyebrow>{t("loreEyebrow")}</Eyebrow>
              <Text family="display" style={styles.sectionTitle}>
                {t("loreTitle")}
              </Text>
              <Card style={styles.infoCard}>
                <Text style={styles.confirmText}>{result.simbolismo}</Text>
              </Card>
            </View>
          ) : null}

          <View style={styles.padded}>
            <Pressable onPress={report} hitSlop={8} style={styles.report}>
              <Text style={styles.reportLead}>{t("reportLead")}</Text>
              <Text style={styles.reportAction}>{t("reportAction")}</Text>
            </Pressable>
          </View>
        </View>
      </Animated.ScrollView>

      <Animated.View
        style={[styles.bar, barStyle, { paddingTop: insets.top }]}
        pointerEvents="none"
      >
        <View style={styles.barInner}>
          <Text style={styles.barTitle} numberOfLines={1}>
            {title}
          </Text>
        </View>
      </Animated.View>

      <View style={[styles.back, { top: insets.top + theme.spacing.s2 }]}>
        <Animated.View style={barStyle}>
          <CircleButton onPress={close} accessibilityLabel={tCommon("back")}>
            <BackIcon />
          </CircleButton>
        </Animated.View>

        <Animated.View
          style={[styles.backOverlay, overPhotoStyle]}
          pointerEvents="none"
        >
          <CircleButton
            onPress={close}
            style={styles.backOnPhoto}
            accessibilityLabel={tCommon("back")}
          >
            <BackIcon color={theme.text.onDark} />
          </CircleButton>
        </Animated.View>
      </View>
      <View style={[styles.share, { top: insets.top + theme.spacing.s2 }]}>
        <Animated.View style={barStyle}>
          <CircleButton onPress={share} accessibilityLabel={t("shareTitle")}>
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
            accessibilityLabel={t("shareTitle")}
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
          title: especie?.comum ?? title,
          scientific: especie?.cientifico,
          photoPath,
          photoUri: photo,
          cuidados,
          temperatura: result.temperatura,
          toxic: result.toxica_para_pets,
        }}
      />

      {showFooter && (
        <View
          style={[
            styles.footer,
            { paddingBottom: insets.bottom + theme.spacing.s3 },
          ]}
        >
          {fromHistory ? (
            <Button label={t("save")} onPress={save} loading={saving} />
          ) : plantId ? (
            <Button label={tCommon("back")} onPress={backToPlant} />
          ) : (
            <>
              {canSave && (
                <Button label={t("save")} onPress={save} loading={saving} />
              )}
              <Button label={t("discard")} onPress={close} variant="ghost" />
            </>
          )}
        </View>
      )}

      <ContainerModalCenter
        visible={groupModal}
        onClose={closeGroupModal}
        title={tPlants("saveCareTitle")}
        description={tPlants("saveCareHint")}
      >
        <View style={styles.routinePreview}>
          <CareRoutine tasks={previewTasks} />
        </View>

        <Text style={styles.groupsLabel}>{t("saveGroupTitle")}</Text>

        <View style={styles.groupChips}>
          <Chip
            label={tPlants("groupNone")}
            selected={selectedGroup === null}
            onPress={() => selectGroup(null)}
          />
          {groups.map((group) => (
            <Chip
              key={group.id}
              label={group.name}
              selected={selectedGroup === group.id}
              onPress={() => selectGroup(group.id)}
            />
          ))}

          <Chip
            label={tPlants("newGroup")}
            tone="warn"
            onPress={openGroupSheet}
            left={<Feather name="plus" size={12} color={theme.primary.clay} />}
          />
        </View>

        <Button
          label={t("save")}
          onPress={confirmSave}
          loading={saving}
          style={styles.groupConfirm}
        />
      </ContainerModalCenter>

      <GroupSheet
        visible={groupSheet}
        saving={savingGroup}
        onClose={closeGroupSheet}
        onSubmit={submitGroup}
      />

      <PhotoZoom
        visible={zoom !== null}
        uri={photo}
        path={photoPath}
        mark={zoom?.mark}
        diagnoses={zoom?.causes}
        initialIndex={zoom?.index ?? 0}
        onClose={() => setZoom(null)}
        closeLabel={t("closePhoto")}
      />
    </View>
  );
}

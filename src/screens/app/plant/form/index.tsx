import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, View } from "react-native";

import { CareRoutine } from "@/components/CareRoutine";
import { GroupSheet } from "@/components/GroupSheet";
import { PlantPhoto } from "@/components/PlantPhoto";
import { PlantPhotoSheet } from "@/components/PlantPhotoSheet";
import { TaskEditSheet } from "@/components/TaskEditSheet";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { CircleButton } from "@/components/ui/CircleButton";
import { Container } from "@/components/ui/Container";
import { ContainerModalCenter } from "@/components/ui/ContainerModalCenter";
import { Header } from "@/components/ui/Header";
import { Input } from "@/components/ui/Input";
import { KeyboardAwareView } from "@/components/ui/KeyboardAwareView";
import { StepProgress } from "@/components/ui/ProgressBar";
import { Stepper } from "@/components/ui/Stepper";
import { StepTransition } from "@/components/ui/StepTransition";
import { Text } from "@/components/ui/Text";
import { theme } from "@/style/theme";
import { FertilizerPace, LightLevel } from "@/types/identification";

import { SwitchRow } from "./components/SwitchRow";
import { styles } from "./style";
import { usePlantForm } from "./usePlantForm";

const LIGHT_OPTIONS: LightLevel[] = [
  "sol_direto",
  "sol_parcial",
  "luz_indireta",
  "meia_sombra",
  "sombra",
];

const FERTILIZER_OPTIONS: FertilizerPace[] = [
  "quinzenal",
  "mensal",
  "bimestral",
  "estacional",
  "nao_precisa",
];

export default function PlantFormScreen() {
  const { t } = useTranslation("plants");
  const { t: tAnalysis } = useTranslation("analysis");
  const { t: tCommon } = useTranslation();
  const {
    control,
    errors,
    groups,
    isPro,
    isEditing,
    saving,
    step,
    stepIndex,
    direction,
    stepCount,
    isLastStep,
    canAdvance,
    openPaywall,
    handleAdvance,
    handleBack,
    photoUri,
    photoPath,
    photoSheet,
    photoWarning,
    openPhotoSheet,
    closePhotoSheet,
    pickPhoto,
    clearPhoto,
    confirmPhotoChange,
    cancelPhotoChange,
    groupSheet,
    openGroupSheet,
    closeGroupSheet,
    savingGroup,
    submitGroup,
    routineTasks,
    untouch,
    lockedKinds,
    editingTask,
    plantName,
    editTask,
    closeTaskEdit,
    savingTask,
    saveTask,
    toggleTask,
  } = usePlantForm();

  const hasPhoto = !!photoUri || !!photoPath;
  const filledPhotoStep = step === "photo" && hasPhoto;

  return (
    <Container>
      <Header
        showBack
        onBack={handleBack}
        center={
          <StepProgress
            total={stepCount}
            current={stepIndex + 1}
            style={styles.progress}
          />
        }
      />

      <KeyboardAwareView style={styles.flex}>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
        >
          <StepTransition stepKey={step} direction={direction}>
            <Text family="display" style={styles.title}>
              {filledPhotoStep
                ? t("photoStepTitleFilled")
                : t(`${step}StepTitle` as const)}
            </Text>
            <Text style={styles.subtitle}>
              {filledPhotoStep
                ? t("photoStepSubtitleFilled")
                : t(`${step}StepSubtitle` as const)}
            </Text>
          </StepTransition>

          <StepTransition
            stepKey={step}
            direction={direction}
            style={styles.form}
          >
            {step === "photo" && (
              <Pressable
                onPress={openPhotoSheet}
                style={styles.photoTile}
                accessibilityRole="button"
                accessibilityLabel={t("photoAdd")}
              >
                {photoUri ? (
                  <Image
                    source={{ uri: photoUri }}
                    style={styles.photoImage}
                    contentFit="cover"
                  />
                ) : photoPath ? (
                  <PlantPhoto path={photoPath} style={styles.photoImage} />
                ) : (
                  <>
                    <View style={styles.photoPlus}>
                      <Feather name="plus" size={26} color={theme.text.onDark} />
                    </View>
                    <Text style={styles.photoHint}>{t("photoAdd")}</Text>
                  </>
                )}

                {hasPhoto && (
                  <View style={styles.photoEdit}>
                    <CircleButton
                      onPress={openPhotoSheet}
                      size={46}
                      style={styles.photoEditButton}
                      accessibilityLabel={t("photoSheetTitle")}
                    >
                      <Feather
                        name="edit-2"
                        size={19}
                        color={theme.text.onDark}
                      />
                    </CircleButton>
                  </View>
                )}
              </Pressable>
            )}

            {step === "identity" && (
              <>
                <Controller
                  control={control}
                  name="nickname"
                  rules={{ required: t("nicknameRequired") }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label={t("nicknameLabel")}
                      placeholder={t("nicknamePlaceholder")}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      autoCapitalize="sentences"
                      autoFocus
                      returnKeyType="next"
                      error={errors.nickname?.message}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="groupId"
                  render={({ field: { onChange, value } }) => (
                    <View style={styles.groups}>
                      <Text style={styles.groupsLabel}>{t("groupLabel")}</Text>

                      <View style={styles.groupChips}>
                        <Chip
                          size="lg"
                          label={t("groupNone")}
                          selected={value === null}
                          onPress={() => onChange(null)}
                        />
                        {groups.map((item) => (
                          <Chip
                            key={item.id}
                            size="lg"
                            label={item.name}
                            selected={value === item.id}
                            onPress={() => onChange(item.id)}
                          />
                        ))}
                        <Chip
                          size="lg"
                          label={t("newGroup")}
                          tone="warn"
                          onPress={openGroupSheet}
                          left={
                            <Feather
                              name="plus"
                              size={12}
                              color={theme.primary.clay}
                            />
                          }
                        />
                      </View>
                    </View>
                  )}
                />

                <Controller
                  control={control}
                  name="species"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label={t("speciesLabel")}
                      hint={t("optional")}
                      placeholder={t("speciesPlaceholder")}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      autoCapitalize="sentences"
                      returnKeyType="done"
                      onSubmitEditing={handleAdvance}
                    />
                  )}
                />
              </>
            )}

            {step === "care" && (
              <>
                <View style={styles.field}>
                  <Text style={styles.fieldLabel}>{t("intervalLabel")}</Text>
                  <Controller
                    control={control}
                    name="interval"
                    render={({ field: { onChange, value } }) => (
                      <Stepper
                        value={value}
                        onChange={(days) => {
                          onChange(days);
                          untouch("water");
                        }}
                        min={1}
                        max={90}
                        format={(days) => t("interval", { count: days })}
                      />
                    )}
                  />
                </View>

                {!isEditing && (
                  <Controller
                    control={control}
                    name="wateredToday"
                    render={({ field: { onChange, value } }) => (
                      <SwitchRow
                        label={t("wateredTodayLabel")}
                        hint={t("wateredTodayHint")}
                        value={value}
                        onChange={onChange}
                      />
                    )}
                  />
                )}

                <View style={styles.field}>
                  <Text style={styles.fieldLabel}>{t("lightLabel")}</Text>
                  <Controller
                    control={control}
                    name="light"
                    render={({ field: { onChange, value } }) => (
                      <View style={styles.groupChips}>
                        {LIGHT_OPTIONS.map((option) => (
                          <Chip
                            key={option}
                            size="lg"
                            label={tAnalysis(`luz_${option}` as const)}
                            selected={value === option}
                            onPress={() => onChange(option)}
                          />
                        ))}
                        <Chip
                          size="lg"
                          label={t("unknownOption")}
                          selected={value === null}
                          onPress={() => onChange(null)}
                        />
                      </View>
                    )}
                  />
                </View>

                <View style={styles.field}>
                  <Text style={styles.fieldLabel}>{t("fertilizerLabel")}</Text>
                  <Controller
                    control={control}
                    name="fertilizer"
                    render={({ field: { onChange, value } }) => (
                      <View style={styles.groupChips}>
                        {FERTILIZER_OPTIONS.map((option) => (
                          <Chip
                            key={option}
                            size="lg"
                            label={tAnalysis(`adubo_${option}` as const)}
                            selected={value === option}
                            onPress={() => {
                              onChange(option);
                              untouch("fertilize");
                            }}
                          />
                        ))}
                        <Chip
                          size="lg"
                          label={t("unknownOption")}
                          selected={value === null}
                          onPress={() => {
                            onChange(null);
                            untouch("fertilize");
                          }}
                        />
                      </View>
                    )}
                  />
                </View>

                <Controller
                  control={control}
                  name="toxic"
                  render={({ field: { onChange, value } }) => (
                    <SwitchRow
                      label={t("toxicLabel")}
                      hint={t("toxicHint")}
                      value={value}
                      onChange={onChange}
                    />
                  )}
                />
              </>
            )}

            {step === "routine" && (
              <>
                <CareRoutine
                  tasks={routineTasks}
                  creating={!isEditing}
                  onEdit={editTask}
                  lockedKinds={lockedKinds}
                  onLocked={openPaywall}
                />

                {!isPro && (
                  <Card style={styles.upsell}>
                    <MaterialCommunityIcons
                      name="bag-personal-outline"
                      size={20}
                      color={theme.primary.clay}
                    />
                    <View style={styles.upsellTexts}>
                      <Text style={styles.upsellTitle}>
                        {t("tasksProTitle")}
                      </Text>
                      <Text style={styles.upsellText}>{t("tasksProText")}</Text>
                      <Button
                        label={t("tasksProAction")}
                        onPress={openPaywall}
                        variant="outline"
                        style={styles.upsellAction}
                      />
                    </View>
                  </Card>
                )}
              </>
            )}
          </StepTransition>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            label={
              isLastStep
                ? isEditing
                  ? tCommon("save")
                  : t("createPlant")
                : tCommon("continue")
            }
            onPress={handleAdvance}
            loading={saving}
            disabled={!canAdvance}
          />
        </View>
      </KeyboardAwareView>

      <PlantPhotoSheet
        visible={photoSheet}
        onClose={closePhotoSheet}
        onPick={pickPhoto}
        onRemove={hasPhoto ? clearPhoto : undefined}
      />

      <GroupSheet
        visible={groupSheet}
        saving={savingGroup}
        onClose={closeGroupSheet}
        onSubmit={submitGroup}
      />

      <TaskEditSheet
        task={editingTask}
        creating={!isEditing}
        plantName={plantName}
        saving={savingTask}
        onClose={closeTaskEdit}
        onSave={saveTask}
        onToggle={toggleTask}
      />

      <ContainerModalCenter
        visible={photoWarning}
        onClose={cancelPhotoChange}
        title={t("photoChangeTitle")}
        description={t("photoChangeText")}
      >
        <Button
          label={t("photoChangeConfirm")}
          onPress={confirmPhotoChange}
          loading={saving}
        />
        <Button
          label={tCommon("cancel")}
          onPress={cancelPhotoChange}
          variant="ghost"
        />
      </ContainerModalCenter>
    </Container>
  );
}

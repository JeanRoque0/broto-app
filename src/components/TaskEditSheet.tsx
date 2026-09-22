import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { DEFAULT_REMINDER_TIME } from "@/constants";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Calendar } from "@/components/ui/Calendar";
import {
  ContainerModal,
  ModalScrollView,
} from "@/components/ui/ContainerModal";
import { RipplePressable } from "@/components/ui/RipplePressable";
import { Text } from "@/components/ui/Text";
import { WheelBand, WheelPicker } from "@/components/ui/WheelPicker";
import { theme } from "@/style/theme";
import { fontSize, type } from "@/style/typography";
import { PlantTask } from "@/types/plant";
import { formatShortDate, formatWeekday } from "@/utils/format";
import { TASK_ICONS, TASK_LABELS } from "@/utils/taskLabels";
import {
  addDays,
  isSameDay,
  isTaskKind,
  parseDay,
  startOfDay,
} from "@/utils/tasks";

type Unit = "day" | "week" | "month";

type Step = "main" | "date" | "every" | "time";

const HOURS = Array.from({ length: 24 }, (_, index) => ({
  value: index,
  label: String(index).padStart(2, "0"),
}));

const MINUTES = [0, 15, 30, 45].map((value) => ({
  value,
  label: String(value).padStart(2, "0"),
}));

const DEFAULT_TIME = DEFAULT_REMINDER_TIME;

function splitTime(value: string | null) {
  const [hour, minute] = (value ?? DEFAULT_TIME)
    .slice(0, 5)
    .split(":")
    .map(Number);
  return {
    hour: Number.isFinite(hour) ? hour : 9,
    minute: MINUTES.some((item) => item.value === minute) ? minute : 0,
  };
}

function joinTime(hour: number, minute: number) {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

const UNITS: Unit[] = ["day", "week", "month"];

const DATE_PRESETS = [
  { key: "presetToday", days: 0 },
  { key: "presetTomorrow", days: 1 },
  { key: "presetNextWeek", days: 7 },
] as const;

const EVERY_PRESETS = [
  { key: "presetDaily", amount: 1, unit: "day" },
  { key: "presetEvery3", amount: 3, unit: "day" },
  { key: "presetWeekly", amount: 1, unit: "week" },
  { key: "presetEvery15", amount: 15, unit: "day" },
  { key: "presetMonthly", amount: 1, unit: "month" },
] as const;

const TIME_PRESETS = [
  { key: "presetMorning", hour: 8 },
  { key: "presetNoon", hour: 12 },
  { key: "presetAfternoon", hour: 17 },
  { key: "presetEvening", hour: 20 },
] as const;

const UNIT_DAYS: Record<Unit, number> = { day: 1, week: 7, month: 30 };

const UNIT_MAX: Record<Unit, number> = { day: 31, week: 52, month: 24 };

const UNIT_LABELS = {
  day: "unitDays",
  week: "unitWeeks",
  month: "unitMonths",
} as const satisfies Record<Unit, string>;

const EVERY_LABELS = {
  day: "taskEveryDays",
  week: "taskEveryWeeks",
  month: "taskEveryMonths",
} as const satisfies Record<Unit, string>;

function splitInterval(days: number): { amount: number; unit: Unit } {
  if (days % 30 === 0) return { amount: days / 30, unit: "month" };
  if (days % 7 === 0) return { amount: days / 7, unit: "week" };
  return { amount: days, unit: "day" };
}

type FieldTone = "moss" | "ochre" | "clay";

const FIELD_TONES: Record<FieldTone, { bg: string; fg: string }> = {
  moss: { bg: theme.secondary.mossSoft, fg: theme.secondary.moss },
  ochre: { bg: theme.secondary.ochreSoft, fg: theme.secondary.ochre },
  clay: { bg: theme.primary.claySoft, fg: theme.primary.clay },
};

type FieldRowProps = {
  icon: React.ComponentProps<typeof Feather>["name"];
  tone: FieldTone;
  label: string;
  value: string;
  last?: boolean;
  onPress: () => void;
};

function FieldRow({ icon, tone, label, value, last, onPress }: FieldRowProps) {
  const palette = FIELD_TONES[tone];

  return (
    <RipplePressable
      onPress={onPress}
      style={[styles.field, !last && styles.fieldDivider]}
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${value}`}
    >
      <View style={[styles.fieldIcon, { backgroundColor: palette.bg }]}>
        <Feather name={icon} size={16} color={palette.fg} />
      </View>

      <Text style={styles.fieldLabel} numberOfLines={1}>
        {label}
      </Text>
      <Text style={styles.fieldValue} numberOfLines={1}>
        {value}
      </Text>

      <Feather name="chevron-right" size={17} color={theme.text.tertiary} />
    </RipplePressable>
  );
}

type TaskEditSheetProps = {
  task: PlantTask | null;
  creating?: boolean;
  plantName: string;
  saving: boolean;
  onClose: () => void;
  onSave: (payload: {
    interval_days: number;
    next_at: Date;
    remind_at: string;
    enabled?: boolean;
  }) => void;
  onToggle: (enabled: boolean) => void;
};

export function TaskEditSheet({
  task,
  creating = false,
  plantName,
  saving,
  onClose,
  onSave,
  onToggle,
}: TaskEditSheetProps) {
  const { t } = useTranslation("plants");
  const { t: tCommon } = useTranslation();
  const [amount, setAmount] = useState(7);
  const [unit, setUnit] = useState<Unit>("day");
  const [nextAt, setNextAt] = useState(() => startOfDay(new Date()));
  const [hour, setHour] = useState(9);
  const [minute, setMinute] = useState(0);
  const [step, setStep] = useState<Step>("main");

  const [loadedTask, setLoadedTask] = useState(task);

  if (task !== loadedTask) {
    setLoadedTask(task);
    if (task) {
      const split = splitInterval(task.interval_days);
      setAmount(split.amount);
      setUnit(split.unit);
      setNextAt(parseDay(task.next_at));

      const time = splitTime(task.remind_at);
      setHour(time.hour);
      setMinute(time.minute);

      setStep("main");
    }
  }

  const amounts = useMemo(
    () =>
      Array.from({ length: UNIT_MAX[unit] }, (_, index) => ({
        value: index + 1,
        label: String(index + 1),
      })),
    [unit],
  );

  const units = useMemo(
    () =>
      UNITS.map((option) => ({
        value: option,
        label: t(UNIT_LABELS[option], { count: amount }),
      })),
    [t, amount],
  );

  function changeUnit(next: Unit) {
    setUnit(next);
    setAmount((current) => Math.min(current, UNIT_MAX[next]));
  }

  const taskLabel =
    task && isTaskKind(task.kind) ? t(TASK_LABELS[task.kind]) : "";

  const everyLabel = t(EVERY_LABELS[unit], { count: amount });

  const remindAt = joinTime(hour, minute);
  const [today] = useState(() => startOfDay(new Date()));
  const lateDays = Math.round(
    (today.getTime() - startOfDay(nextAt).getTime()) / 86400000,
  );
  const taskIcon =
    task && isTaskKind(task.kind) ? TASK_ICONS[task.kind] : "sprout-outline";

  const titles: Record<Step, string> = {
    main: taskLabel,
    date: t("taskEditFirst"),
    every: t("taskEditEvery"),
    time: t("taskEditTime"),
  };

  return (
    <ContainerModal
      visible={task !== null}
      onClose={step === "main" ? onClose : () => setStep("main")}
      eyebrow={step === "main" ? undefined : taskLabel}
      title={titles[step]}
      description={step === "main" ? plantName : undefined}
    >
      {step === "main" && (
        <>
          {task?.enabled === false && (
            <View style={styles.off}>
              <Feather name="bell-off" size={18} color={theme.text.secondary} />
              <Text style={styles.offText}>
                {t(creating ? "taskNewDisabled" : "taskEditDisabled")}
              </Text>
            </View>
          )}

          {task?.enabled !== false && (
            <View style={styles.summary}>
              <View style={styles.summaryIcon}>
                <MaterialCommunityIcons
                  name={taskIcon}
                  size={22}
                  color={theme.text.onPrimary}
                />
              </View>
              <View style={styles.summaryTexts}>
                <Text style={styles.summaryLabel}>{t("taskNextReminder")}</Text>
                <Text style={styles.summaryValue}>
                  {`${formatWeekday(nextAt)}, ${formatShortDate(nextAt)} · ${remindAt}`}
                </Text>
                <Text style={styles.summaryHint}>{everyLabel}</Text>
                {lateDays > 0 && (
                  <View style={styles.late}>
                    <Text style={styles.lateText}>
                      {t("taskLate", { count: lateDays })}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}

          <View
            style={[
              styles.fields,
              task?.enabled === false && styles.fieldsTight,
            ]}
          >
            <FieldRow
              icon="calendar"
              tone="moss"
              label={t("taskEditFirst")}
              value={formatShortDate(nextAt)}
              onPress={() => setStep("date")}
            />

            <FieldRow
              icon="repeat"
              tone="ochre"
              label={t("taskEditRepeat")}
              value={everyLabel}
              onPress={() => setStep("every")}
            />

            <FieldRow
              icon="clock"
              tone="clay"
              label={t("taskEditTime")}
              value={remindAt}
              onPress={() => setStep("time")}
              last
            />
          </View>

          {task?.enabled === false ? (
            <>
              <Button
                label={t(creating ? "taskNewAdd" : "taskEditRestore")}
                onPress={() =>
                  onSave({
                    interval_days: amount * UNIT_DAYS[unit],
                    next_at: nextAt,
                    remind_at: remindAt,
                    enabled: true,
                  })
                }
                loading={saving}
                style={styles.save}
              />

              <Button
                label={t("taskEditClose")}
                onPress={onClose}
                variant="ghost"
                style={styles.toggle}
              />
            </>
          ) : (
            <>
              <Button
                label={t(creating ? "taskNewSave" : "taskEditSave")}
                onPress={() =>
                  onSave({
                    interval_days: amount * UNIT_DAYS[unit],
                    next_at: nextAt,
                    remind_at: remindAt,
                  })
                }
                loading={saving}
                style={styles.save}
              />

              <Button
                label={t(creating ? "taskNewRemove" : "taskEditRemove")}
                onPress={() => onToggle(false)}
                variant="ghost"
                style={styles.toggle}
                labelStyle={styles.removeLabel}
                iconLeft={
                  <Feather
                    name="trash-2"
                    size={16}
                    color={theme.functional.danger}
                  />
                }
              />
            </>
          )}
        </>
      )}

      {step === "date" && (
        <>
          <ModalScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.presets}>
              {DATE_PRESETS.map((preset) => {
                const day = addDays(today, preset.days);
                return (
                  <Chip
                    key={preset.key}
                    size="lg"
                    label={t(preset.key)}
                    selected={isSameDay(day, nextAt)}
                    onPress={() => {
                      setNextAt(day);
                      setStep("main");
                    }}
                  />
                );
              })}
            </View>
            <View style={styles.pickerTight}>
              <Calendar
                value={nextAt}
                onChange={(day) => {
                  setNextAt(day);
                  setStep("main");
                }}
              />
            </View>
          </ModalScrollView>

          <Button
            label={tCommon("back")}
            onPress={() => setStep("main")}
            variant="ghost"
            style={styles.stepBack}
          />
        </>
      )}

      {step === "time" && (
        <>
          <Text family="display" style={styles.preview}>
            {t("taskTimePreview", { time: remindAt })}
          </Text>

          <View style={styles.presets}>
            {TIME_PRESETS.map((preset) => (
              <Chip
                key={preset.key}
                size="lg"
                label={`${t(preset.key)} · ${joinTime(preset.hour, 0)}`}
                selected={hour === preset.hour && minute === 0}
                onPress={() => {
                  setHour(preset.hour);
                  setMinute(0);
                }}
              />
            ))}
          </View>

          <View style={[styles.pickerTight, styles.wheels]}>
            <WheelBand />
            <WheelPicker items={HOURS} value={hour} onChange={setHour} />
            <View style={styles.colon} pointerEvents="none">
              <Text style={styles.colonText}>:</Text>
            </View>
            <WheelPicker items={MINUTES} value={minute} onChange={setMinute} />
          </View>

          <Button
            label={t("taskEditDone")}
            onPress={() => setStep("main")}
            style={styles.save}
          />
        </>
      )}

      {step === "every" && (
        <>
          <Text family="display" style={styles.preview}>
            {everyLabel}
          </Text>

          <View style={styles.presets}>
            {EVERY_PRESETS.map((preset) => (
              <Chip
                key={preset.key}
                size="lg"
                label={t(preset.key)}
                selected={amount === preset.amount && unit === preset.unit}
                onPress={() => {
                  setUnit(preset.unit);
                  setAmount(preset.amount);
                }}
              />
            ))}
          </View>

          <View style={[styles.pickerTight, styles.wheels]}>
            <WheelBand />
            <WheelPicker items={amounts} value={amount} onChange={setAmount} />
            <WheelPicker items={units} value={unit} onChange={changeUnit} />
          </View>

          <Button
            label={t("taskEditDone")}
            onPress={() => setStep("main")}
            style={styles.save}
          />
        </>
      )}
    </ContainerModal>
  );
}

const styles = StyleSheet.create({
  off: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.s3,
    marginTop: theme.spacing.s5,
    paddingVertical: theme.spacing.s3,
    paddingHorizontal: theme.spacing.s4,
    backgroundColor: theme.surface.container,
    borderRadius: theme.radius.md,
  },
  offText: {
    ...type.bodySm,
    flex: 1,
    color: theme.text.primary,
  },
  summary: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.s3,
    marginTop: theme.spacing.s5,
    padding: theme.spacing.s4,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.secondary.mossSoft,
  },
  summaryIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.secondary.moss,
  },
  summaryTexts: {
    flex: 1,
    gap: 2,
  },
  summaryLabel: {
    fontSize: fontSize.s3,
    fontWeight: "700",
    color: theme.secondary.moss,
  },
  summaryValue: {
    fontSize: fontSize.s9,
    fontWeight: "700",
    color: theme.text.primary,
  },
  summaryHint: {
    ...type.bodySm,
  },
  late: {
    alignSelf: "flex-start",
    marginTop: theme.spacing.s2,
    paddingVertical: 3,
    paddingHorizontal: theme.spacing.s2,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.primary.claySoft,
  },
  lateText: {
    fontSize: fontSize.s2,
    fontWeight: "700",
    color: theme.primary.clay,
  },
  fields: {
    marginTop: theme.spacing.s3,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.functional.line,
    backgroundColor: theme.surface.card,
    overflow: "hidden",
  },
  removeLabel: {
    color: theme.functional.danger,
  },
  fieldsTight: {
    marginTop: theme.spacing.s3,
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.s3,
    minHeight: 56,
    paddingHorizontal: theme.spacing.s4,
  },
  fieldDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.functional.line,
  },
  fieldIcon: {
    width: 32,
    height: 32,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  fieldLabel: {
    flex: 1,
    fontSize: fontSize.s6,
    color: theme.text.primary,
  },
  fieldValue: {
    flexShrink: 1,
    fontSize: fontSize.s6,
    fontWeight: "700",
    color: theme.text.primary,
  },
  picker: {
    marginTop: theme.spacing.s5,
  },
  pickerTight: {
    marginTop: theme.spacing.s4,
  },
  presets: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.s2,
    marginTop: theme.spacing.s4,
  },
  preview: {
    ...type.displaySm,
    marginTop: theme.spacing.s4,
    color: theme.primary.clay,
  },
  colon: {
    width: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  colonText: {
    fontSize: fontSize.s10,
    fontWeight: "700",
    color: theme.text.primary,
  },
  wheels: {
    flexDirection: "row",
    justifyContent: "center",
  },
  save: {
    marginTop: theme.spacing.s5,
  },
  toggle: {
    marginTop: theme.spacing.s2,
  },
  stepBack: {
    marginTop: theme.spacing.s3,
  },
});

import { Feather } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { DEFAULT_REMINDER_TIME } from "@/constants";
import { Button } from "@/components/ui/Button";
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
import { formatLongDate } from "@/utils/format";
import { TASK_LABELS } from "@/utils/taskLabels";
import { isTaskKind, parseDay, startOfDay } from "@/utils/tasks";

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
  const [hour, minute] = (value ?? DEFAULT_TIME).slice(0, 5).split(":").map(Number);
  return {
    hour: Number.isFinite(hour) ? hour : 9,
    minute: MINUTES.some((item) => item.value === minute) ? minute : 0,
  };
}

function joinTime(hour: number, minute: number) {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

const UNITS: Unit[] = ["day", "week", "month"];

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

type FieldRowProps = {
  icon: React.ComponentProps<typeof Feather>["name"];
  label: string;
  value: string;
  onPress: () => void;
};

function FieldRow({ icon, label, value, onPress }: FieldRowProps) {
  return (
    <RipplePressable
      onPress={onPress}
      style={styles.field}
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${value}`}
    >
      <View style={styles.fieldIcon}>
        <Feather name={icon} size={17} color={theme.primary.clay} />
      </View>

      <View style={styles.fieldTexts}>
        <Text family="mono" style={styles.fieldLabel}>
          {label}
        </Text>
        <Text style={styles.fieldValue}>{value}</Text>
      </View>

      <Feather
        name="chevron-right"
        size={18}
        color={theme.text.secondary}
      />
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

  useEffect(() => {
    if (!task) return;

    const split = splitInterval(task.interval_days);
    setAmount(split.amount);
    setUnit(split.unit);
    setNextAt(parseDay(task.next_at));

    const time = splitTime(task.remind_at);
    setHour(time.hour);
    setMinute(time.minute);

    setStep("main");
  }, [task]);

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

          <View
            style={[
              styles.fields,
              task?.enabled === false && styles.fieldsTight,
            ]}
          >
            <FieldRow
              icon="calendar"
              label={t("taskEditFirst")}
              value={formatLongDate(nextAt)}
              onPress={() => setStep("date")}
            />

            <FieldRow
              icon="repeat"
              label={t("taskEditEvery")}
              value={everyLabel}
              onPress={() => setStep("every")}
            />

            <FieldRow
              icon="clock"
              label={t("taskEditTime")}
              value={remindAt}
              onPress={() => setStep("time")}
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
              />
            </>
          )}
        </>
      )}

      {step === "date" && (
        <>
          <ModalScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.picker}>
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
          <View style={[styles.picker, styles.wheels]}>
            <WheelBand />
            <WheelPicker items={HOURS} value={hour} onChange={setHour} />
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
          <View style={[styles.picker, styles.wheels]}>
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
  fields: {
    marginTop: theme.spacing.s5,
    gap: theme.spacing.s2,
  },
  fieldsTight: {
    marginTop: theme.spacing.s3,
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.s4,
    paddingVertical: theme.spacing.s3,
    paddingHorizontal: theme.spacing.s4,
    backgroundColor: theme.surface.card,
    borderWidth: 1,
    borderColor: theme.functional.line,
    borderRadius: theme.radius.md,
  },
  fieldIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.primary.clayTint,
    borderWidth: 1,
    borderColor: theme.primary.clayBorder,
  },
  fieldTexts: {
    flex: 1,
    gap: 2,
  },
  fieldLabel: {
    fontSize: fontSize.s1,
    letterSpacing: 1.1,
    textTransform: "uppercase",
    color: theme.text.tertiary,
  },
  fieldValue: {
    ...type.sectionTitle,
    fontSize: fontSize.s7,
  },
  picker: {
    marginTop: theme.spacing.s5,
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

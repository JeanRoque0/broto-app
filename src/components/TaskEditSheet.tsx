import { Feather } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

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

const UNITS: Unit[] = ["day", "week", "month"];

const UNIT_DAYS: Record<Unit, number> = { day: 1, week: 7, month: 30 };

const UNIT_MAX: Record<Unit, number> = { day: 31, week: 52, month: 24 };

const UNIT_LABELS = {
  day: "unitDays",
  week: "unitWeeks",
  month: "unitMonths",
} as const satisfies Record<Unit, string>;

function splitInterval(days: number): { amount: number; unit: Unit } {
  if (days % 30 === 0) return { amount: days / 30, unit: "month" };
  if (days % 7 === 0) return { amount: days / 7, unit: "week" };
  return { amount: days, unit: "day" };
}

type TaskEditSheetProps = {
  task: PlantTask | null;
  plantName: string;
  saving: boolean;
  onClose: () => void;
  onSave: (payload: { interval_days: number; next_at: Date }) => void;
  onToggle: (enabled: boolean) => void;
};

export function TaskEditSheet({
  task,
  plantName,
  saving,
  onClose,
  onSave,
  onToggle,
}: TaskEditSheetProps) {
  const { t } = useTranslation("plants");
  const [amount, setAmount] = useState(7);
  const [unit, setUnit] = useState<Unit>("day");
  const [nextAt, setNextAt] = useState(() => startOfDay(new Date()));
  const [calendarOpen, setCalendarOpen] = useState(false);

  useEffect(() => {
    if (!task) return;

    const split = splitInterval(task.interval_days);
    setAmount(split.amount);
    setUnit(split.unit);
    setNextAt(parseDay(task.next_at));
    setCalendarOpen(false);
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

  return (
    <ContainerModal
      visible={task !== null}
      onClose={onClose}
      title={task && isTaskKind(task.kind) ? t(TASK_LABELS[task.kind]) : ""}
      description={plantName}
    >
      <ModalScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>{t("taskEditFirst")}</Text>

        <RipplePressable
          onPress={() => setCalendarOpen((open) => !open)}
          style={styles.field}
          accessibilityRole="button"
          accessibilityState={{ expanded: calendarOpen }}
        >
          <Text family="mono" style={styles.fieldValue}>
            {formatLongDate(nextAt)}
          </Text>
          <Feather
            name={calendarOpen ? "chevron-up" : "calendar"}
            size={18}
            color={theme.text.secondary}
          />
        </RipplePressable>

        {calendarOpen && (
          <View style={styles.calendar}>
            <Calendar
              value={nextAt}
              onChange={(day) => {
                setNextAt(day);
                setCalendarOpen(false);
              }}
            />
          </View>
        )}

        <Text style={[styles.label, styles.labelSpaced]}>
          {t("taskEditEvery")}
        </Text>

        <View style={styles.wheels}>
          <WheelBand />
          <WheelPicker items={amounts} value={amount} onChange={setAmount} />
          <WheelPicker items={units} value={unit} onChange={changeUnit} />
        </View>
      </ModalScrollView>

      <Button
        label={t("taskEditSave")}
        onPress={() =>
          onSave({ interval_days: amount * UNIT_DAYS[unit], next_at: nextAt })
        }
        loading={saving}
        style={styles.save}
      />

      <Button
        label={t(task?.enabled ? "taskEditRemove" : "taskEditRestore")}
        onPress={() => onToggle(!task?.enabled)}
        variant="ghost"
      />
    </ContainerModal>
  );
}

const styles = StyleSheet.create({
  label: {
    ...type.label,
    fontSize: fontSize.s3,
    color: theme.text.secondary,
    marginTop: theme.spacing.s5,
    marginBottom: theme.spacing.s2,
  },
  labelSpaced: {
    marginTop: theme.spacing.s6,
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: theme.spacing.s4,
    backgroundColor: theme.surface.card,
    borderWidth: 1.5,
    borderColor: theme.functional.line,
    borderRadius: theme.radius.field,
  },
  fieldValue: {
    fontSize: fontSize.s7,
    color: theme.text.primary,
  },
  calendar: {
    marginTop: theme.spacing.s2,
  },
  wheels: {
    flexDirection: "row",
    justifyContent: "center",
  },
  save: {
    marginTop: theme.spacing.s5,
  },
});

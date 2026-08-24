import { Feather } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  FadeIn,
  SlideInLeft,
  SlideInRight,
} from "react-native-reanimated";

import { RipplePressable } from "@/components/ui/RipplePressable";
import { Text } from "@/components/ui/Text";
import { theme } from "@/style/theme";
import { fontSize } from "@/style/typography";
import { formatMonthYear, formatWeekday } from "@/utils/format";
import { isSameDay, startOfDay } from "@/utils/tasks";

type CalendarProps = {
  value: Date;
  onChange: (day: Date) => void;
  minDate?: Date;
};

function buildGrid(month: Date) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const lead = (first.getDay() + 6) % 7;
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();

  return [
    ...Array.from({ length: lead }, () => null),
    ...Array.from(
      { length: days },
      (_, index) => new Date(month.getFullYear(), month.getMonth(), index + 1),
    ),
  ];
}

export function Calendar({ value, onChange, minDate }: CalendarProps) {
  const [month, setMonth] = useState(
    () => new Date(value.getFullYear(), value.getMonth(), 1),
  );
  const [direction, setDirection] = useState(0);

  const today = startOfDay(new Date());
  const floor = minDate ? startOfDay(minDate) : null;
  const grid = useMemo(() => buildGrid(month), [month]);

  const weekdays = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) =>
        formatWeekday(new Date(2024, 0, index + 1)).slice(0, 1),
      ),
    [],
  );

  function shift(months: number) {
    setDirection(months);
    setMonth(new Date(month.getFullYear(), month.getMonth() + months, 1));
  }

  return (
    <View style={styles.calendar}>
      <View style={styles.head}>
        <RipplePressable
          onPress={() => shift(-1)}
          borderless
          radius={18}
          style={styles.arrow}
          accessibilityRole="button"
        >
          <Feather name="chevron-left" size={17} color={theme.text.secondary} />
        </RipplePressable>

        <Animated.View
          key={month.toISOString()}
          entering={FadeIn.duration(180)}
        >
          <Text family="mono" style={styles.month}>
            {formatMonthYear(month)}
          </Text>
        </Animated.View>

        <RipplePressable
          onPress={() => shift(1)}
          borderless
          radius={18}
          style={styles.arrow}
          accessibilityRole="button"
        >
          <Feather
            name="chevron-right"
            size={17}
            color={theme.text.secondary}
          />
        </RipplePressable>
      </View>

      <View style={styles.week}>
        {weekdays.map((label, index) => (
          <Text key={index} family="mono" style={styles.weekday}>
            {label}
          </Text>
        ))}
      </View>

      <Animated.View
        key={month.toISOString()}
        entering={
          direction === 0
            ? FadeIn.duration(160)
            : direction > 0
              ? SlideInRight.duration(220)
              : SlideInLeft.duration(220)
        }
        style={styles.grid}
      >
        {grid.map((day, index) => {
          if (!day) return <View key={`empty-${index}`} style={styles.cell} />;

          const selected = isSameDay(day, value);
          const disabled = !!floor && day.getTime() < floor.getTime();

          return (
            <RipplePressable
              key={day.toISOString()}
              onPress={() => onChange(day)}
              disabled={disabled}
              borderless
              radius={20}
              style={styles.cell}
              accessibilityRole="button"
              accessibilityState={{ selected, disabled }}
            >
              <View style={[styles.day, selected && styles.daySelected]}>
                <Text
                  family="mono"
                  style={[
                    styles.dayLabel,
                    disabled && styles.dayDisabled,
                    selected && styles.dayLabelSelected,
                  ]}
                >
                  {day.getDate()}
                </Text>
              </View>

              {isSameDay(day, today) && !selected && (
                <View style={styles.todayDot} />
              )}
            </RipplePressable>
          );
        })}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  calendar: {
    backgroundColor: theme.surface.card,
    borderWidth: 1.5,
    borderColor: theme.functional.line,
    borderRadius: theme.radius.field,
    paddingHorizontal: theme.spacing.s2,
    paddingBottom: theme.spacing.s3,
  },
  head: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.s2,
  },
  arrow: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
  },
  month: {
    fontSize: fontSize.s3,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    color: theme.text.primary,
  },
  week: {
    flexDirection: "row",
    marginBottom: theme.spacing.s1,
  },
  weekday: {
    flex: 1,
    textAlign: "center",
    fontSize: fontSize.s1,
    textTransform: "uppercase",
    color: theme.text.tertiary,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cell: {
    width: `${100 / 7}%`,
    alignItems: "center",
    paddingVertical: 1,
  },
  day: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  daySelected: {
    backgroundColor: theme.primary.clay,
  },
  dayLabel: {
    fontSize: fontSize.s5,
    color: theme.text.primary,
  },
  dayDisabled: {
    color: theme.text.tertiary,
  },
  dayLabelSelected: {
    color: theme.text.onPrimary,
  },
  todayDot: {
    position: "absolute",
    bottom: 1,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.primary.clay,
  },
});

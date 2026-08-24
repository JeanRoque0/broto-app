import { useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";

import { RipplePressable } from "@/components/ui/RipplePressable";
import { Text } from "@/components/ui/Text";
import { theme } from "@/style/theme";
import { fontSize } from "@/style/typography";
import { formatMonthYear, formatWeekday } from "@/utils/format";
import { isSameDay } from "@/utils/tasks";

const DAY_WIDTH = 52;
const DAY_GAP = 6;
const ITEM_WIDTH = DAY_WIDTH + DAY_GAP;

type DayStripProps = {
  days: Date[];
  selected: Date;
  initialIndex: number;
  onSelect: (day: Date) => void;
};

export function DayStrip({
  days,
  selected,
  initialIndex,
  onSelect,
}: DayStripProps) {
  const today = useRef(new Date()).current;
  const listRef = useRef<FlatList<Date>>(null);
  const settled = useRef(false);
  const { width } = useWindowDimensions();
  const [visibleMonth, setVisibleMonth] = useState(selected);

  const centerOffset = Math.floor(
    (width - theme.screenPadding * 2) / ITEM_WIDTH / 2,
  );

  const selectedIndex = useMemo(
    () => days.findIndex((day) => isSameDay(day, selected)),
    [days, selected],
  );

  useEffect(() => {
    if (selectedIndex < 0) return;

    if (!settled.current) {
      settled.current = true;
      return;
    }

    listRef.current?.scrollToIndex({
      index: selectedIndex,
      viewPosition: 0.5,
      animated: true,
    });
  }, [selectedIndex]);

  function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / ITEM_WIDTH + 2.5,
    );
    const day = days[Math.min(Math.max(index, 0), days.length - 1)];

    if (day && day.getMonth() !== visibleMonth.getMonth()) {
      setVisibleMonth(day);
    }
  }

  return (
    <View>
      <Text family="mono" style={styles.month}>
        {formatMonthYear(visibleMonth)}
      </Text>

      <FlatList
        ref={listRef}
        data={days}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(day) => day.toISOString()}
        contentContainerStyle={styles.strip}
        getItemLayout={(_data, index) => ({
          length: ITEM_WIDTH,
          offset: ITEM_WIDTH * index,
          index,
        })}
        initialScrollIndex={Math.max(0, initialIndex - centerOffset)}
        onScrollToIndexFailed={() => undefined}
        onScroll={handleScroll}
        scrollEventThrottle={32}
        renderItem={({ item }) => {
          const active = isSameDay(item, selected);

          return (
            <RipplePressable
              onPress={() => onSelect(item)}
              style={[styles.day, active && styles.dayActive]}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
            >
              <Text
                family="mono"
                style={[styles.weekday, active && styles.textActive]}
              >
                {formatWeekday(item)}
              </Text>
              <Text
                family="mono"
                style={[styles.number, active && styles.textActive]}
              >
                {item.getDate()}
              </Text>
              {isSameDay(item, today) && (
                <View style={[styles.dot, active && styles.dotActive]} />
              )}
            </RipplePressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  month: {
    fontSize: fontSize.s2,
    textTransform: "uppercase",
    letterSpacing: 1.1,
    color: theme.text.tertiary,
    marginBottom: theme.spacing.s3,
    marginHorizontal: theme.screenPadding,
  },
  strip: {
    gap: DAY_GAP,
    paddingHorizontal: theme.screenPadding,
  },
  day: {
    width: DAY_WIDTH,
    alignItems: "center",
    gap: 2,
    paddingVertical: theme.spacing.s3,
    borderRadius: theme.radius.md,
    backgroundColor: theme.surface.card,
    borderWidth: 1,
    borderColor: theme.functional.line,
  },
  dayActive: {
    backgroundColor: theme.primary.clay,
    borderColor: theme.primary.clay,
  },
  weekday: {
    fontSize: fontSize.s1,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    color: theme.text.tertiary,
  },
  number: {
    fontSize: fontSize.s8,
    fontWeight: "500",
    color: theme.text.primary,
  },
  textActive: {
    color: theme.text.onPrimary,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.primary.clay,
  },
  dotActive: {
    backgroundColor: theme.text.onPrimary,
  },
});

import { useEffect, useRef } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from "react-native";
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import { Text } from "@/components/ui/Text";
import { useContainerModalScroll } from "@/components/ui/ContainerModal";
import { theme } from "@/style/theme";
import { fontSize } from "@/style/typography";

export const WHEEL_ITEM_HEIGHT = 40;

const VISIBLE = 5;
const WHEEL_HEIGHT = WHEEL_ITEM_HEIGHT * VISIBLE;
const PAD = WHEEL_ITEM_HEIGHT * Math.floor(VISIBLE / 2);
const SETTLE_VELOCITY = 0.15;

type WheelPickerProps<T extends string | number> = {
  items: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
};

function WheelItem({
  label,
  index,
  offset,
}: {
  label: string;
  index: number;
  offset: SharedValue<number>;
}) {
  const style = useAnimatedStyle(() => {
    const distance = Math.abs(offset.value / WHEEL_ITEM_HEIGHT - index);

    return {
      opacity: interpolate(
        distance,
        [0, 1, 2],
        [1, 0.4, 0.16],
        Extrapolation.CLAMP,
      ),
      transform: [
        {
          scale: interpolate(
            distance,
            [0, 1, 2],
            [1, 0.84, 0.72],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  return (
    <Animated.View style={[styles.item, style]}>
      <Text family="mono" style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </Animated.View>
  );
}

export function WheelPicker<T extends string | number>({
  items,
  value,
  onChange,
}: WheelPickerProps<T>) {
  const scroll = useAnimatedRef<Animated.ScrollView>();
  const offset = useSharedValue(0);
  const dragging = useRef(false);
  const { setHasScrollable } = useContainerModalScroll();

  useEffect(() => {
    setHasScrollable(true);
    return () => setHasScrollable(false);
  }, [setHasScrollable]);

  const index = Math.max(
    0,
    items.findIndex((item) => item.value === value),
  );

  useEffect(() => {
    if (dragging.current) return;
    scroll.current?.scrollTo({
      y: index * WHEEL_ITEM_HEIGHT,
      animated: false,
    });
  }, [index, scroll]);

  const onScroll = useAnimatedScrollHandler((event) => {
    offset.value = event.contentOffset.y;
  });

  function settle(event: NativeSyntheticEvent<NativeScrollEvent>) {
    dragging.current = false;

    const next = Math.round(
      event.nativeEvent.contentOffset.y / WHEEL_ITEM_HEIGHT,
    );
    const item = items[Math.min(Math.max(next, 0), items.length - 1)];
    if (item && item.value !== value) onChange(item.value);
  }

  return (
    <Animated.ScrollView
      ref={scroll}
      style={styles.wheel}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      snapToInterval={WHEEL_ITEM_HEIGHT}
      disableIntervalMomentum={false}
      decelerationRate="normal"
      onScroll={onScroll}
      scrollEventThrottle={16}
      onScrollBeginDrag={() => {
        dragging.current = true;
      }}
      onScrollEndDrag={(event) => {
        const velocity = Math.abs(event.nativeEvent.velocity?.y ?? 0);
        if (velocity < SETTLE_VELOCITY) settle(event);
      }}
      onMomentumScrollEnd={settle}
    >
      {items.map((item, position) => (
        <WheelItem
          key={item.value}
          label={item.label}
          index={position}
          offset={offset}
        />
      ))}
    </Animated.ScrollView>
  );
}

export function WheelBand() {
  return <View style={styles.band} pointerEvents="none" />;
}

const styles = StyleSheet.create({
  wheel: {
    flex: 1,
    height: WHEEL_HEIGHT,
  },
  content: {
    paddingVertical: PAD,
  },
  item: {
    height: WHEEL_ITEM_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: fontSize.s8,
    color: theme.text.primary,
  },
  band: {
    position: "absolute",
    left: 0,
    right: 0,
    top: PAD,
    height: WHEEL_ITEM_HEIGHT,
    borderRadius: theme.radius.field,
    backgroundColor: theme.surface.container,
  },
});

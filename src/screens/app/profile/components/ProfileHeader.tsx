import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  runOnJS,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
} from "react-native-reanimated";

import { CircleButton } from "@/components/ui/CircleButton";
import { Text } from "@/components/ui/Text";
import { theme } from "@/style/theme";
import { type } from "@/style/typography";

import { HEADER_ROW, useCollapseProgress } from "./useCollapse";

type ProfileHeaderProps = {
  title: string;
  editLabel: string;
  onEdit: () => void;
  scrollY: SharedValue<number>;
  collapseAt: SharedValue<number>;
};

export function ProfileHeader({
  title,
  editLabel,
  onEdit,
  scrollY,
  collapseAt,
}: ProfileHeaderProps) {
  const progress = useCollapseProgress(scrollY, collapseAt);
  const [collapsed, setCollapsed] = useState(false);

  useAnimatedReaction(
    () => progress.value > 0.9,
    (done, previous) => {
      if (done !== previous) runOnJS(setCollapsed)(done);
    },
  );

  const titleStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    transform: [{ translateY: -10 * progress.value }],
  }));

  const editStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: 0.8 + 0.2 * progress.value }],
  }));

  return (
    <View style={styles.row}>
      <Animated.View style={[styles.stack, titleStyle]}>
        <Text family="display" style={styles.title}>
          {title}
        </Text>
      </Animated.View>

      <Animated.View
        style={editStyle}
        pointerEvents={collapsed ? "auto" : "none"}
      >
        <CircleButton onPress={onEdit} accessibilityLabel={editLabel}>
          <Feather name="edit-3" size={17} color={theme.text.primary} />
        </CircleButton>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: HEADER_ROW,
  },
  stack: {
    justifyContent: "center",
  },
  title: {
    ...type.display,
  },
});

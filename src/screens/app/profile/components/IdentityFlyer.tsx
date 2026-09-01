import { Feather } from "@expo/vector-icons";
import { StyleSheet, useWindowDimensions } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

import { PlantPhoto } from "@/components/PlantPhoto";
import { Text } from "@/components/ui/Text";
import { theme } from "@/style/theme";
import { fontSize } from "@/style/typography";

import {
  AVATAR_BIG,
  AVATAR_SMALL,
  HEADER_GAP,
  HEADER_ROW,
  HEADER_TOP,
  useCollapseProgress,
} from "./useCollapse";

type Anchor = {
  x: SharedValue<number>;
  y: SharedValue<number>;
  height: SharedValue<number>;
};

type IdentityFlyerProps = {
  path: string | null;
  initial: string;
  name: string;
  scrollY: SharedValue<number>;
  collapseAt: SharedValue<number>;
  origin: { x: SharedValue<number>; y: SharedValue<number> };
  avatarAt: Anchor;
  nameAt: Anchor;
  headerAt: Anchor;
};

export function IdentityFlyer({
  path,
  initial,
  name,
  scrollY,
  collapseAt,
  origin,
  avatarAt,
  nameAt,
  headerAt,
}: IdentityFlyerProps) {
  const { width } = useWindowDimensions();
  const progress = useCollapseProgress(scrollY, collapseAt);

  const avatar = useAnimatedStyle(() => {
    const p = progress.value;

    const headerMiddle =
      headerAt.y.value - origin.y.value + HEADER_TOP + HEADER_ROW / 2;
    const headerLeft = headerAt.x.value - origin.x.value + theme.screenPadding;

    const restX = avatarAt.x.value - origin.x.value + AVATAR_BIG / 2;
    const restY =
      avatarAt.y.value - origin.y.value + AVATAR_BIG / 2 - scrollY.value;

    const targetX = headerLeft + AVATAR_SMALL / 2;

    return {
      transform: [
        { translateX: restX + (targetX - restX) * p - AVATAR_BIG / 2 },
        { translateY: restY + (headerMiddle - restY) * p - AVATAR_BIG / 2 },
        { scale: 1 + (AVATAR_SMALL / AVATAR_BIG - 1) * p },
      ],
    };
  });

  const badge = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
  }));

  const label = useAnimatedStyle(() => {
    const p = progress.value;

    const headerMiddle =
      headerAt.y.value - origin.y.value + HEADER_TOP + HEADER_ROW / 2;
    const nameTargetX =
      headerAt.x.value -
      origin.x.value +
      theme.screenPadding +
      AVATAR_SMALL +
      HEADER_GAP;

    const restX = nameAt.x.value - origin.x.value;
    const restY = nameAt.y.value - origin.y.value - scrollY.value;
    const targetY = headerMiddle - nameAt.height.value / 2;

    return {
      maxWidth:
        width -
        2 * theme.screenPadding -
        (nameTargetX + AVATAR_SMALL + theme.screenPadding) * p,
      transform: [
        { translateX: restX + (nameTargetX - restX) * p },
        { translateY: restY + (targetY - restY) * p },
      ],
    };
  });

  return (
    <Animated.View style={styles.layer} pointerEvents="none">
      <Animated.View style={[styles.avatarBox, avatar]}>
        <PlantPhoto
          path={path}
          style={styles.avatar}
          fallback={
            <Text family="display" style={styles.avatarLetter}>
              {initial}
            </Text>
          }
        />
        <Animated.View style={[styles.badge, badge]}>
          <Feather name="edit-2" size={13} color={theme.text.onPrimary} />
        </Animated.View>
      </Animated.View>

      <Animated.View style={[styles.nameBox, label]}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFillObject,
  },
  avatarBox: {
    position: "absolute",
    top: 0,
    left: 0,
    width: AVATAR_BIG,
    height: AVATAR_BIG,
  },
  avatar: {
    width: AVATAR_BIG,
    height: AVATAR_BIG,
    borderRadius: AVATAR_BIG / 2,
    backgroundColor: theme.primary.claySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLetter: {
    fontSize: fontSize.s13,
    fontWeight: "600",
    color: theme.primary.clay,
  },
  badge: {
    position: "absolute",
    right: 0,
    bottom: 2,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.primary.clay,
    borderWidth: 2.5,
    borderColor: theme.surface.base,
  },
  nameBox: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  name: {
    fontSize: fontSize.s9,
    fontWeight: "700",
    color: theme.text.primary,
  },
});

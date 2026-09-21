import * as Haptics from "expo-haptics";

function quietly(effect: () => Promise<void>) {
  effect().catch(() => undefined);
}

export const haptic = {
  tap: () => quietly(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)),
  select: () => quietly(() => Haptics.selectionAsync()),
  success: () =>
    quietly(() =>
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
    ),
  warn: () =>
    quietly(() =>
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
    ),
};

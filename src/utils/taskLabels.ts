import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";

import { TaskKind } from "@/utils/tasks";

export const TASK_LABELS = {
  water: "taskWater",
  fertilize: "taskFertilize",
  mist: "taskMist",
  rotate: "taskRotate",
  repot: "taskRepot",
  prune: "taskPrune",
  recheck: "taskRecheck",
} as const satisfies Record<TaskKind, string>;

export const TASK_ICONS: Record<
  TaskKind,
  React.ComponentProps<typeof MaterialCommunityIcons>["name"]
> = {
  water: "water-outline",
  fertilize: "bag-personal-outline",
  mist: "spray",
  rotate: "rotate-3d-variant",
  repot: "flower-tulip-outline",
  prune: "content-cut",
  recheck: "camera-outline",
};

import type { WaterStatus } from "@/components/ui/StatusDot";
import { Plant } from "@/types/plant";

const DAY_MS = 24 * 60 * 60 * 1000;

function startOfDay(date: Date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export type WateringLabelKey =
  | "pending"
  | "today"
  | "tomorrow"
  | "inDays"
  | "late";

export interface WateringInfo {
  daysUntil: number | null;
  dueDate: Date | null;
  status: WaterStatus;
  labelKey: WateringLabelKey;
  labelParams: { count: number };
}

export function getWateringInfo(plant: Plant, now = new Date()): WateringInfo {
  if (!plant.watering_interval_days) {
    return {
      daysUntil: null,
      dueDate: null,
      status: "pending",
      labelKey: "pending",
      labelParams: { count: 0 },
    };
  }

  if (!plant.last_watered_at) {
    return {
      daysUntil: 0,
      dueDate: startOfDay(now),
      status: "today",
      labelKey: "today",
      labelParams: { count: 0 },
    };
  }

  const lastWatered = startOfDay(new Date(plant.last_watered_at));
  const dueDate = new Date(
    lastWatered.getTime() + plant.watering_interval_days * DAY_MS,
  );
  const daysUntil = Math.round(
    (dueDate.getTime() - startOfDay(now).getTime()) / DAY_MS,
  );

  if (daysUntil < 0) {
    return {
      daysUntil,
      dueDate,
      status: "today",
      labelKey: "late",
      labelParams: { count: Math.abs(daysUntil) },
    };
  }

  if (daysUntil === 0) {
    return {
      daysUntil,
      dueDate,
      status: "today",
      labelKey: "today",
      labelParams: { count: 0 },
    };
  }

  if (daysUntil === 1) {
    return {
      daysUntil,
      dueDate,
      status: "soon",
      labelKey: "tomorrow",
      labelParams: { count: 1 },
    };
  }

  return {
    daysUntil,
    dueDate,
    status: daysUntil <= 7 ? "soon" : "far",
    labelKey: "inDays",
    labelParams: { count: daysUntil },
  };
}

import { CareEvent, Plant, PlantTask } from "@/types/plant";

const DAY_MS = 24 * 60 * 60 * 1000;

export const TASK_KINDS = [
  "water",
  "fertilize",
  "mist",
  "rotate",
  "repot",
  "prune",
] as const;

export type TaskKind = (typeof TASK_KINDS)[number];

export const FREE_TASK_KINDS: TaskKind[] = ["water"];

const TASK_ORDER: Record<TaskKind, number> = {
  water: 0,
  mist: 1,
  fertilize: 2,
  rotate: 3,
  repot: 4,
  prune: 5,
};

export interface Task {
  plant: Plant;
  task: PlantTask;
  kind: TaskKind;
  dueDate: Date;
  overdue: boolean;
  lateDays: number;
  done: boolean;
}

export function startOfDay(date: Date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export function isSameDay(a: Date, b: Date) {
  return startOfDay(a).getTime() === startOfDay(b).getTime();
}

export function addDays(date: Date, days: number) {
  return new Date(startOfDay(date).getTime() + days * DAY_MS);
}

export function parseDay(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function isTaskKind(value: string): value is TaskKind {
  return (TASK_KINDS as readonly string[]).includes(value);
}

export function buildTasks(params: {
  plants: Plant[];
  tasks: PlantTask[];
  events: CareEvent[];
  day: Date;
  kinds: readonly TaskKind[];
  now?: Date;
}): Task[] {
  const { plants, tasks, events, day, kinds, now = new Date() } = params;
  const today = startOfDay(now);
  const target = startOfDay(day);
  const isToday = target.getTime() === today.getTime();
  const byId = new Map(plants.map((plant) => [plant.id, plant]));
  const result: Task[] = [];

  for (const task of tasks) {
    if (!task.enabled) continue;
    if (!isTaskKind(task.kind)) continue;
    if (!kinds.includes(task.kind)) continue;

    const plant = byId.get(task.plant_id);
    if (!plant) continue;

    const doneOnDay = events.some(
      (event) =>
        event.plant_id === task.plant_id &&
        event.kind === task.kind &&
        isSameDay(new Date(event.happened_at), target),
    );

    if (doneOnDay) {
      result.push({
        plant,
        task,
        kind: task.kind,
        dueDate: target,
        overdue: false,
        lateDays: 0,
        done: true,
      });
      continue;
    }

    const dueDate = parseDay(task.next_at);
    const isDue = isSameDay(dueDate, target);
    const isLate = isToday && dueDate.getTime() < today.getTime();

    if (!isDue && !isLate) continue;

    result.push({
      plant,
      task,
      kind: task.kind,
      dueDate,
      overdue: isLate,
      lateDays: isLate
        ? Math.round((today.getTime() - dueDate.getTime()) / DAY_MS)
        : 0,
      done: false,
    });
  }

  return result.sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    if (a.overdue !== b.overdue) return a.overdue ? -1 : 1;

    const byPlant = a.plant.nickname.localeCompare(b.plant.nickname);
    if (byPlant !== 0) return byPlant;

    return TASK_ORDER[a.kind] - TASK_ORDER[b.kind];
  });
}

export function dayRange(from: Date, past: number, future: number) {
  const start = addDays(from, -past);
  return Array.from({ length: past + future + 1 }, (_, index) =>
    addDays(start, index),
  );
}

export function daysBetween(from: Date, to: Date) {
  return Math.round(
    (startOfDay(to).getTime() - startOfDay(from).getTime()) / DAY_MS,
  );
}

export function remindableTasks(tasks: PlantTask[], isPro: boolean) {
  const kinds = isPro ? TASK_KINDS : FREE_TASK_KINDS;

  return tasks.filter(
    (task) =>
      task.enabled && isTaskKind(task.kind) && kinds.includes(task.kind),
  );
}

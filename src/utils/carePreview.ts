import { toDateString } from "@/services/supabase/plantTasks";
import { PlantTask } from "@/types/plant";
import { addDays } from "@/utils/tasks";

export const DEFAULT_WATER_DAYS = 7;
export const DEFAULT_FERTILIZE_DAYS = 30;
export const ROTATE_DAYS = 14;
export const PRUNE_DAYS = 365;
export const PRUNE_MONTH = 8;

const FERTILIZER_DAYS: Record<string, number> = {
  quinzenal: 15,
  mensal: 30,
  bimestral: 60,
  estacional: 30,
};

function nextPruneDate(now: Date, month = PRUNE_MONTH) {
  const anchor = new Date(now.getFullYear(), month, 1);
  if (anchor < now) anchor.setFullYear(anchor.getFullYear() + 1);
  return anchor;
}

type CarePreviewInput = {
  rega_dias?: number | null;
  adubo?: string | null;
  vaporizar_dias?: number | null;
  girar_dias?: number | null;
  replantar_meses?: number | null;
  podar_mes?: number | null;
} | null;

export function previewCareTasks(
  cuidados: CarePreviewInput,
  now = new Date(),
): PlantTask[] {
  const waterDays = cuidados?.rega_dias ?? DEFAULT_WATER_DAYS;
  const fertilizeDays = cuidados?.adubo
    ? FERTILIZER_DAYS[cuidados.adubo]
    : undefined;

  const base = { id: "", plant_id: "", user_id: "", created_at: "" };

  return [
    {
      ...base,
      id: "water",
      kind: "water",
      interval_days: waterDays,
      next_at: toDateString(now),
      enabled: true,
    },
    {
      ...base,
      id: "fertilize",
      kind: "fertilize",
      interval_days: fertilizeDays ?? DEFAULT_FERTILIZE_DAYS,
      next_at: toDateString(
        addDays(now, fertilizeDays ?? DEFAULT_FERTILIZE_DAYS),
      ),
      enabled: fertilizeDays !== undefined,
    },
    {
      ...base,
      id: "mist",
      kind: "mist",
      interval_days: cuidados?.vaporizar_dias ?? 7,
      next_at: toDateString(addDays(now, cuidados?.vaporizar_dias ?? 7)),
      enabled: !!cuidados?.vaporizar_dias,
    },
    {
      ...base,
      id: "rotate",
      kind: "rotate",
      interval_days: cuidados?.girar_dias ?? ROTATE_DAYS,
      next_at: toDateString(addDays(now, cuidados?.girar_dias ?? ROTATE_DAYS)),
      enabled: true,
    },
    {
      ...base,
      id: "repot",
      kind: "repot",
      interval_days: (cuidados?.replantar_meses ?? 12) * 30,
      next_at: toDateString(
        addDays(now, (cuidados?.replantar_meses ?? 12) * 30),
      ),
      enabled: true,
    },
    {
      ...base,
      id: "prune",
      kind: "prune",
      interval_days: PRUNE_DAYS,
      next_at: toDateString(
        nextPruneDate(
          now,
          cuidados?.podar_mes ? cuidados.podar_mes - 1 : PRUNE_MONTH,
        ),
      ),
      enabled: cuidados ? !!cuidados.podar_mes : false,
    },
  ];
}

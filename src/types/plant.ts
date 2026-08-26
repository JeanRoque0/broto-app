export interface PlantGroup {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
}

export interface Plant {
  id: string;
  user_id: string;

  nickname: string;
  species_scientific: string | null;
  species_common: string | null;
  photo_path: string | null;
  room: string | null;
  group_id: string | null;

  watering_interval_days: number | null;
  light: string | null;
  fertilizer: string | null;
  light_note: string | null;
  fertilizer_note: string | null;
  toxic_to_pets: boolean | null;
  mist_days: number | null;
  rotate_days: number | null;
  repot_months: number | null;
  prune_month: number | null;
  care_notes: string | null;

  last_watered_at: string | null;
  notify_watering: boolean;

  archived_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PlantTask {
  id: string;
  plant_id: string;
  user_id: string;
  kind: string;
  interval_days: number;
  next_at: string;
  remind_at: string | null;
  enabled: boolean;
  created_at: string;
}

export type CareEventKind =
  | "water"
  | "fertilize"
  | "mist"
  | "rotate"
  | "repot"
  | "prune";

export interface CareEvent {
  id: string;
  plant_id: string;
  user_id: string;
  kind: CareEventKind;
  note: string | null;
  happened_at: string;
}

export type PlantInput = Pick<Plant, "nickname"> &
  Partial<
    Pick<
      Plant,
      | "species_scientific"
      | "species_common"
      | "photo_path"
      | "room"
      | "group_id"
      | "watering_interval_days"
      | "light"
      | "fertilizer"
      | "light_note"
      | "fertilizer_note"
      | "toxic_to_pets"
      | "mist_days"
      | "rotate_days"
      | "repot_months"
      | "prune_month"
      | "care_notes"
      | "last_watered_at"
      | "notify_watering"
    >
  >;

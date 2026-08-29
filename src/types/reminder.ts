export type ReminderKind = "care" | "late" | "chat" | "notice";

export interface ReminderEvent {
  id: string;
  plant_id: string | null;
  kind: ReminderKind;
  title: string;
  body: string;
  sent_at: string;
  read_at: string | null;
}

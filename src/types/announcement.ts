export type AnnouncementKind = "price" | "general";

export interface Announcement {
  id: string;
  kind: AnnouncementKind;
  title: Record<string, string>;
  body: Record<string, string>;
  detail: Record<string, string> | null;
  starts_at: string;
  notify_at: string | null;
  ends_at: string | null;
}

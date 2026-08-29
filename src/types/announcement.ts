export type AnnouncementKind = "price" | "general";

export interface Announcement {
  id: string;
  kind: AnnouncementKind;
  title: Record<string, string>;
  body: Record<string, string>;
  starts_at: string;
  ends_at: string | null;
}

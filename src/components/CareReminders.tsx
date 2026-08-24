import { useCareReminders } from "@/hooks/useCareReminders";
import { useNotificationTap } from "@/hooks/useNotificationTap";

export function CareReminders() {
  useCareReminders();
  useNotificationTap();
  return null;
}

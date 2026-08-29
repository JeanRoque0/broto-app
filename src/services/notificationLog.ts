import AsyncStorage from "@react-native-async-storage/async-storage";

const LEGACY_KEY = "broto.notifications.log";

function keyFor(userId: string) {
  return `broto.notifications.log.${userId}`;
}
const KEEP_DAYS = 30;
const LIMIT = 60;

export type LogKind = "care" | "late" | "chat";

export interface LogEntry {
  id: string;
  at: number;
  kind: LogKind;
  plantId: string | null;
  title: string;
  body: string;
  read: boolean;
}

function isEntry(value: unknown): value is LogEntry {
  const entry = value as LogEntry;

  return (
    !!entry &&
    typeof entry.id === "string" &&
    typeof entry.at === "number" &&
    ["care", "late", "chat"].includes(entry.kind) &&
    typeof entry.title === "string" &&
    typeof entry.body === "string"
  );
}

async function readAll(userId: string): Promise<LogEntry[]> {
  const stored = await AsyncStorage.getItem(keyFor(userId));
  if (!stored) return [];

  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.filter(isEntry) : [];
  } catch {
    return [];
  }
}

async function writeAll(userId: string, entries: LogEntry[]) {
  const floor = Date.now() - KEEP_DAYS * 24 * 60 * 60 * 1000;

  const kept = entries
    .filter((entry) => entry.at > floor)
    .sort((a, b) => b.at - a.at)
    .slice(0, LIMIT);

  await AsyncStorage.setItem(keyFor(userId), JSON.stringify(kept));
  return kept;
}

export async function recordPlanned(
  userId: string,
  planned: Omit<LogEntry, "read">[],
) {
  const current = await readAll(userId);
  const now = Date.now();
  const byId = new Map(current.map((entry) => [entry.id, entry]));

  for (const entry of planned) {
    const known = byId.get(entry.id);

    if (!known) {
      byId.set(entry.id, { ...entry, read: false });
      continue;
    }

    if (known.at > now) {
      byId.set(entry.id, { ...known, ...entry });
    }
  }

  return writeAll(userId, [...byId.values()]);
}

export async function listDelivered(userId: string, now = Date.now()) {
  const all = await readAll(userId);
  return all.filter((entry) => entry.at <= now);
}

export async function countUnread(userId: string, now = Date.now()) {
  const all = await readAll(userId);
  return all.filter((entry) => entry.at <= now && !entry.read).length;
}

export async function clearLog(userId: string) {
  await AsyncStorage.multiRemove([keyFor(userId), LEGACY_KEY]);
}

export async function markAllRead(userId: string) {
  const all = await readAll(userId);
  return writeAll(userId, all.map((entry) => ({ ...entry, read: true })));
}


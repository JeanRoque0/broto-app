import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "broto.notifications.log";
const KEEP_DAYS = 30;
const LIMIT = 60;

export interface LogEntry {
  id: string;
  at: number;
  count: number;
  read: boolean;
}

async function readAll(): Promise<LogEntry[]> {
  const stored = await AsyncStorage.getItem(KEY);
  if (!stored) return [];

  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeAll(entries: LogEntry[]) {
  const floor = Date.now() - KEEP_DAYS * 24 * 60 * 60 * 1000;

  const kept = entries
    .filter((entry) => entry.at > floor)
    .sort((a, b) => b.at - a.at)
    .slice(0, LIMIT);

  await AsyncStorage.setItem(KEY, JSON.stringify(kept));
  return kept;
}

export async function recordPlanned(
  planned: { id: string; at: number; count: number }[],
) {
  const current = await readAll();
  const now = Date.now();
  const byId = new Map(current.map((entry) => [entry.id, entry]));

  for (const entry of planned) {
    const known = byId.get(entry.id);

    if (!known) {
      byId.set(entry.id, { ...entry, read: false });
      continue;
    }

    if (known.at > now) {
      byId.set(entry.id, { ...known, at: entry.at, count: entry.count });
    }
  }

  return writeAll([...byId.values()]);
}

export async function listDelivered(now = Date.now()) {
  const all = await readAll();
  return all.filter((entry) => entry.at <= now);
}

export async function countUnread(now = Date.now()) {
  const all = await readAll();
  return all.filter((entry) => entry.at <= now && !entry.read).length;
}

export async function markAllRead() {
  const all = await readAll();
  return writeAll(all.map((entry) => ({ ...entry, read: true })));
}

export async function removeEntry(id: string) {
  const all = await readAll();
  return writeAll(all.filter((entry) => entry.id !== id));
}

export async function clearLog() {
  await AsyncStorage.removeItem(KEY);
  return [];
}

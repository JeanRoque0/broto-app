import { supabase } from "./client";

const PHOTO_BUCKET = "plant-photos";
const PHOTO_TTL = 60 * 60 * 24 * 7;

type Row = Record<string, unknown>;

async function rows(table: string, userId: string): Promise<Row[]> {
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("user_id", userId);

  if (error) throw error;
  return (data ?? []) as Row[];
}

async function photoLinks(paths: string[]) {
  const unique = [...new Set(paths.filter(Boolean))];
  if (unique.length === 0) return {};

  const { data } = await supabase.storage
    .from(PHOTO_BUCKET)
    .createSignedUrls(unique, PHOTO_TTL);

  return Object.fromEntries(
    (data ?? [])
      .filter((item) => item.path && item.signedUrl)
      .map((item) => [item.path as string, item.signedUrl]),
  );
}

export async function collectUserData(userId: string, email: string) {
  const [profile, plants, groups, tasks, events, analyses, threads, reminders] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).single(),
      rows("plants", userId),
      rows("plant_groups", userId),
      rows("plant_tasks", userId),
      rows("care_events", userId),
      rows("identifications", userId),
      rows("chat_threads", userId),
      rows("reminder_events", userId),
    ]);

  const threadIds = threads.map((thread) => thread.id as string);

  const { data: messages } = threadIds.length
    ? await supabase
        .from("chat_messages")
        .select("id, thread_id, role, content, created_at")
        .in("thread_id", threadIds)
        .order("created_at", { ascending: true })
    : { data: [] };

  const paths = [...plants, ...analyses]
    .map((row) => row.photo_path)
    .filter((path): path is string => typeof path === "string");

  const { avatar_path: avatar, ...perfil } = (profile.data ?? {}) as Record<
    string,
    unknown
  > & { avatar_path?: string | null };

  const fotos = await photoLinks(avatar ? [...paths, avatar] : paths);

  return {
    exportado_em: new Date().toISOString(),
    conta: { id: userId, email },
    perfil: { ...perfil, avatar_path: avatar ?? null },
    plantas: plants,
    grupos: groups,
    tarefas: tasks,
    historico_de_cuidados: events,
    analises: analyses,
    conversas: threads,
    mensagens: messages ?? [],
    lembretes_recebidos: reminders,
    fotos,
  };
}

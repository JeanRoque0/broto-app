import { supabase } from "./client";

export interface ChatThread {
  id: string;
  plant_id: string | null;
  title: string | null;
  created_at: string;
  last_message_at: string;
}

export interface ChatMessage {
  id: string;
  thread_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export async function listThreads(userId: string) {
  const { data, error } = await supabase
    .from("chat_threads")
    .select("id, plant_id, title, created_at, last_message_at")
    .eq("user_id", userId)
    .order("last_message_at", { ascending: false })
    .limit(50);

  if (error) throw error;
  return (data ?? []) as ChatThread[];
}

export async function listMessages(threadId: string) {
  const { data, error } = await supabase
    .from("chat_messages")
    .select("id, thread_id, role, content, created_at")
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true })
    .limit(200);

  if (error) throw error;
  return (data ?? []) as ChatMessage[];
}

export async function removeThread(threadId: string) {
  const { error } = await supabase
    .from("chat_threads")
    .delete()
    .eq("id", threadId);

  if (error) throw error;
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { Toast } from "@/components/ui/Toast";
import { useAuth } from "@/hooks/useAuth";
import { useCredits, useProfile } from "@/hooks/useProfile";
import { sendMessage } from "@/services/api/chat";
import {
  ChatMessage,
  listMessages,
  listThreads,
  removeThread,
} from "@/services/supabase/chat";

export const chatKeys = {
  threads: (userId: string) => ["chatThreads", userId] as const,
  messages: (threadId: string) => ["chatMessages", threadId] as const,
};

export function useChat() {
  const { t: tCommon } = useTranslation();
  const [cap, setCap] = useState<"day" | "month" | "plan" | null>(null);
  const router = useRouter();
  const { userId } = useAuth();
  const queryClient = useQueryClient();
  const credits = useCredits();
  const { refetch: refetchProfile } = useProfile();

  const params = useLocalSearchParams<{ q?: string; plantId?: string }>();

  const [threadId, setThreadId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [plantId, setPlantId] = useState<string | null>(params.plantId ?? null);
  const [pending, setPending] = useState<string | null>(null);
  const [threadsVisible, setThreadsVisible] = useState(false);

  const restored = useRef(false);
  const autoSent = useRef(false);

  const threads = useQuery({
    queryKey: chatKeys.threads(userId ?? ""),
    queryFn: () => listThreads(userId!),
    enabled: !!userId && credits.hasChat,
  });

  useEffect(() => {
    if (restored.current) return;
    if (params.q) {
      restored.current = true;
      return;
    }
    if (threads.data?.length) {
      restored.current = true;
      setThreadId(threads.data[0].id);
    }
  }, [params.q, threads.data]);

  const messages = useQuery({
    queryKey: chatKeys.messages(threadId ?? ""),
    queryFn: () => listMessages(threadId!),
    enabled: !!threadId,
  });

  const send = useMutation({
    mutationFn: (text: string) =>
      sendMessage({ message: text, threadId, plantId }),
    onSuccess: (result) => {
      setPending(null);
      setThreadId(result.threadId);
      queryClient.invalidateQueries({
        queryKey: chatKeys.messages(result.threadId),
      });
      queryClient.invalidateQueries({
        queryKey: chatKeys.threads(userId ?? ""),
      });
      refetchProfile();
    },
    onError: (error) => {
      setPending(null);
      refetchProfile();

      const response = (
        error as {
          response?: { status?: number; data?: { erro?: string } };
        }
      )?.response;

      if (response?.status === 402) {
        setCap("plan");
        return;
      }

      if (response?.status === 429) {
        setCap(response.data?.erro === "daily_cap" ? "day" : "month");
        return;
      }

      Toast.show({
        text: tCommon("requestFailed"),
        subtitle: tCommon("requestFailedSubtitle"),
      });
    },
  });

  useEffect(() => {
    if (!params.q || autoSent.current) return;
    autoSent.current = true;
    setPending(params.q);
    send.mutate(params.q);
  }, [params.q, send]);

  const remove = useMutation({
    mutationFn: removeThread,
    onSuccess: (_data, removedId) => {
      if (removedId === threadId) setThreadId(null);
      queryClient.invalidateQueries({
        queryKey: chatKeys.threads(userId ?? ""),
      });
    },
  });

  const items = useMemo<ChatMessage[]>(() => {
    const stored = messages.data ?? [];
    if (!pending) return stored;

    return [
      ...stored,
      {
        id: "pending",
        thread_id: threadId ?? "",
        role: "user",
        content: pending,
        created_at: new Date().toISOString(),
      },
    ];
  }, [messages.data, pending, threadId]);

  function submit() {
    const text = draft.trim();
    if (!text || send.isPending) return;

    setDraft("");
    setPending(text);
    send.mutate(text);
  }

  function startNew() {
    restored.current = true;
    setThreadId(null);
    setPlantId(null);
    setDraft("");
    setThreadsVisible(false);
    queryClient.removeQueries({ queryKey: chatKeys.messages("") });
  }

  function pickThread(id: string) {
    setThreadId(id);
    setThreadsVisible(false);
  }

  return {
    hasChat: credits.hasChat,
    remaining: credits.chatRemaining,
    remainingToday: credits.chatRemainingToday,
    threads: threads.data ?? [],
    threadsLoading: threads.isLoading,
    threadId,
    items,
    isLoading: !!threadId && messages.isLoading,
    isSending: send.isPending,
    failed: send.isError,
    draft,
    setDraft,
    submit,
    startNew,
    pickThread,
    removeThread: remove.mutate,
    removing: remove.isPending,
    threadsVisible,
    openThreads: () => setThreadsVisible(true),
    closeThreads: () => setThreadsVisible(false),
    cap,
    closeCap: () => setCap(null),
    openPaywall: (plan: "pro" | "chat" = "chat") =>
      router.push({ pathname: "/(app)/paywall", params: { kind: plan } }),
    fromSuggestion: !!params.q,
  };
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { Toast } from "@/components/ui/Toast";
import { useAuth } from "@/hooks/useAuth";
import { useCredits, useProfile } from "@/hooks/useProfile";
import { useOnline } from "@/hooks/useOnline";
import { formatOrdinalDate } from "@/utils/format";
import { sendMessage } from "@/services/api/chat";
import {
  ChatMessage,
  listMessages,
  listThreads,
  removeThread,
} from "@/services/supabase/chat";

const TYPING_TICK_MS = 24;
const TYPING_STEP = 3;
const TYPING_SETTLE_MS = 220;
const THINKING_ROTATE_MS = 2600;

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
  const online = useOnline();
  const { refetch: refetchProfile } = useProfile();

  const params = useLocalSearchParams<{ q?: string; plantId?: string }>();

  const [threadId, setThreadId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [plantId, setPlantId] = useState<string | null>(params.plantId ?? null);
  const [pending, setPending] = useState<string | null>(null);
  const [threadsVisible, setThreadsVisible] = useState(false);
  const [typing, setTyping] = useState<{ full: string; shown: number } | null>(
    null,
  );
  const [thinking, setThinking] = useState(0);
  const [menuVisible, setMenuVisible] = useState(false);
  const [usageVisible, setUsageVisible] = useState(false);

  const autoSent = useRef(false);

  const threads = useQuery({
    queryKey: chatKeys.threads(userId ?? ""),
    queryFn: () => listThreads(userId!),
    enabled: !!userId && credits.hasChat,
  });

  const messages = useQuery({
    queryKey: chatKeys.messages(threadId ?? ""),
    queryFn: () => listMessages(threadId!),
    enabled: !!threadId,
  });

  const send = useMutation({
    mutationFn: (text: string) =>
      sendMessage({ message: text, threadId, plantId }),
    onSuccess: (result) => {
      setThreadId(result.threadId);
      setTyping({ full: result.reply, shown: 0 });
      queryClient.invalidateQueries({
        queryKey: chatKeys.threads(userId ?? ""),
      });
      refetchProfile();
    },
    onError: (error) => {
      setPending(null);
      setTyping(null);
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

  useEffect(() => {
    if (!typing) return;

    if (typing.shown >= typing.full.length) {
      const timer = setTimeout(async () => {
        if (threadId) {
          await queryClient.refetchQueries({
            queryKey: chatKeys.messages(threadId),
          });
        }

        setPending(null);
        setTyping(null);
      }, TYPING_SETTLE_MS);

      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setTyping((current) =>
        current
          ? {
              ...current,
              shown: Math.min(current.full.length, current.shown + TYPING_STEP),
            }
          : current,
      );
    }, TYPING_TICK_MS);

    return () => clearTimeout(timer);
  }, [typing, threadId, queryClient]);

  useEffect(() => {
    if (!send.isPending) {
      setThinking(0);
      return;
    }

    const timer = setInterval(
      () => setThinking((index) => index + 1),
      THINKING_ROTATE_MS,
    );

    return () => clearInterval(timer);
  }, [send.isPending]);

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
    const extra: ChatMessage[] = [];

    if (pending) {
      extra.push({
        id: "pending",
        thread_id: threadId ?? "",
        role: "user",
        content: pending,
        created_at: new Date().toISOString(),
      });
    }

    if (typing) {
      extra.push({
        id: "typing",
        thread_id: threadId ?? "",
        role: "assistant",
        content: typing.full.slice(0, typing.shown),
        created_at: new Date().toISOString(),
      });
    }

    const all = extra.length ? [...stored, ...extra] : stored;
    return all.filter((message) => message.content.trim().length > 0);
  }, [messages.data, pending, typing, threadId]);

  function submit() {
    const text = draft.trim();
    if (!text || send.isPending || !online) return;

    setDraft("");
    setPending(text);
    send.mutate(text);
  }

  function startNew() {
    setTyping(null);
    setPending(null);
    setMenuVisible(false);
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
    renewsLabel: formatOrdinalDate(credits.renewsAt),
    hasChat: credits.hasChat,
    remaining: credits.chatRemaining,
    remainingToday: credits.chatRemainingToday,
    threads: threads.data ?? [],
    threadsLoading: threads.isLoading,
    threadId,
    items,
    isLoading: !!threadId && messages.isLoading,
    isSending: send.isPending,
    isTyping: !!typing,
    online,
    thinkingIndex: thinking,
    menuVisible,
    openMenu: () => setMenuVisible(true),
    closeMenu: () => setMenuVisible(false),
    usageVisible,
    openUsage: () => setUsageVisible(true),
    closeUsage: () => {
      setUsageVisible(false);
      setMenuVisible(true);
    },
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
    closeThreads: () => {
      setThreadsVisible(false);
      setMenuVisible(true);
    },
    cap,
    closeCap: () => setCap(null),
    openPaywall: (plan: "pro" | "chat" = "chat") =>
      router.push({ pathname: "/(app)/paywall", params: { kind: plan } }),
    fromSuggestion: !!params.q,
  };
}

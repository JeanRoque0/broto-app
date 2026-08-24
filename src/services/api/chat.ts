import { api } from "./config";

interface SendResponse {
  threadId: string;
  reply: string;
  restantes: number;
}

export async function sendMessage(params: {
  message: string;
  threadId?: string | null;
  plantId?: string | null;
}) {
  const response = await api.post<SendResponse>("/chat", {
    message: params.message,
    threadId: params.threadId ?? undefined,
    plantId: params.plantId ?? undefined,
  });

  return response.data;
}

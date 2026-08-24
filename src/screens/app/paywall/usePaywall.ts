import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Toast } from "@/components/ui/Toast";
import { CHAT_MONTH_CAP, MONTH_CAP } from "@/constants";
import { useCredits } from "@/hooks/useProfile";
import {
  CATALOG,
  ProductId,
  ProductKind,
  purchaseProduct,
  purchasesAvailable,
  restorePurchases,
} from "@/services/purchases";

export function usePaywall() {
  const router = useRouter();
  const { t } = useTranslation("paywall");
  const credits = useCredits();

  const params = useLocalSearchParams<{ kind?: string }>();
  const initial: ProductKind = params.kind === "chat" ? "chat" : "pro";

  const [kind, setKind] = useState<ProductKind>(initial);
  const [selected, setSelected] = useState<ProductId>(
    initial === "chat" ? "broto_chat_annual" : "broto_pro_annual",
  );
  const [busy, setBusy] = useState(false);

  const products = CATALOG.filter((product) => product.kind === kind);

  function pickKind(next: ProductKind) {
    setKind(next);
    setSelected(next === "pro" ? "broto_pro_annual" : "broto_chat_annual");
  }

  async function run(action: () => Promise<void>) {
    setBusy(true);

    try {
      await action();
    } catch {
      Toast.show({
        text: t("unavailableTitle"),
        subtitle: t("unavailableText"),
      });
    } finally {
      setBusy(false);
    }
  }

  return {
    kind,
    pickKind,
    products,
    selected,
    setSelected,
    busy,
    available: purchasesAvailable,
    isPro: credits.isPro,
    hasChat: credits.hasChat,
    usage: {
      analysesUsed: credits.monthUsed,
      analysesCap: MONTH_CAP,
      analysesLeft: credits.isPro ? credits.monthRemaining : credits.total,
      chatUsed: credits.chatUsed,
      chatCap: CHAT_MONTH_CAP,
      chatLeft: credits.chatRemaining,
      renewsAt: credits.renewsAt,
    },
    buy: () => run(() => purchaseProduct(selected)),
    restore: () => run(restorePurchases),
    close: () => router.back(),
  };
}

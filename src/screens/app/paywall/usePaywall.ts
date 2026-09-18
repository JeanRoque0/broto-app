import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Toast } from "@/components/ui/Toast";
import { CHAT_MONTH_CAP, MONTH_CAP } from "@/constants";
import { useCredits } from "@/hooks/useProfile";
import {
  CATALOG,
  ProductId,
  purchaseProduct,
  purchasesAvailable,
  restorePurchases,
  SINGLE_ANALYSIS,
} from "@/services/purchases";

export function usePaywall() {
  const router = useRouter();
  const { t } = useTranslation("paywall");
  const credits = useCredits();

  const [selected, setSelected] = useState<ProductId>("broto_pro_annual");
  const [busy, setBusy] = useState(false);

  const products = CATALOG.filter((product) => product.kind === "pro");

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
    products,
    selected,
    setSelected,
    busy,
    available: purchasesAvailable,
    isPro: credits.isPro,
    inTrial: credits.inTrial,
    fullAccess: credits.fullAccess,
    trialEndsAt: credits.trialEndsAt,
    hasChat: credits.hasChat,
    usage: {
      analysesUsed: credits.monthUsed,
      analysesCap: MONTH_CAP,
      analysesLeft: credits.fullAccess
        ? credits.monthRemaining
        : credits.paidCredits,
      chatUsed: credits.chatUsed,
      chatCap: CHAT_MONTH_CAP,
      chatLeft: credits.chatRemaining,
      renewsAt: credits.renewsAt,
    },
    buy: () => run(() => purchaseProduct(selected)),
    singlePrice: SINGLE_ANALYSIS.price,
    buySingle: () => run(() => purchaseProduct(SINGLE_ANALYSIS.id)),
    restore: () => run(restorePurchases),
    close: () => router.back(),
  };
}

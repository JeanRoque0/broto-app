import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";

import { CHAT_MONTH_CAP, MONTH_CAP } from "@/constants";
import { BrotinhoFace } from "@/components/illustrations/BrotinhoArt";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Header } from "@/components/ui/Header";
import { RipplePressable } from "@/components/ui/RipplePressable";
import { SegmentedTabs } from "@/components/ui/SegmentedTabs";
import { Text } from "@/components/ui/Text";
import { theme } from "@/style/theme";
import { formatShortDate } from "@/utils/format";
import { openLegal } from "@/utils/legal";

import { styles } from "./style";
import { usePaywall } from "./usePaywall";

const PRO_FEATURES = [
  "proFeature1",
  "proFeature2",
  "proFeature3",
  "proFeature4",
] as const;

const CHAT_FEATURES = ["chatFeature1", "chatFeature2", "chatFeature3"] as const;

type MeterProps = {
  label: string;
  used: number;
  cap: number;
};

function Meter({ label, used, cap }: MeterProps) {
  const { t } = useTranslation("paywall");
  const ratio = cap > 0 ? Math.min(1, used / cap) : 0;

  return (
    <View style={styles.usageRow}>
      <View style={styles.usageHead}>
        <Text style={styles.usageLabel}>{label}</Text>
        <Text family="mono" style={styles.usageValue}>
          {t("usageOf", { used, cap })}
        </Text>
      </View>

      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            ratio > 0.8 && styles.fillWarn,
            { width: `${Math.round(ratio * 100)}%` },
          ]}
        />
      </View>
    </View>
  );
}

export default function PaywallScreen() {
  const { t } = useTranslation("paywall");
  const {
    kind,
    pickKind,
    products,
    selected,
    setSelected,
    busy,
    isPro,
    hasChat,
    usage,
    buy,
    restore,
    singlePrice,
    buySingle,
  } = usePaywall();

  const features = kind === "pro" ? PRO_FEATURES : CHAT_FEATURES;
  const owned = kind === "pro" ? isPro : hasChat && !isPro;

  return (
    <Container>
      <Header showBack />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text family="display" style={styles.title}>
          {t("title")}
        </Text>
        <Text style={styles.subtitle}>{t("subtitle")}</Text>

        <View style={styles.usage}>
          <Eyebrow>{isPro ? t("usageEyebrow") : t("usageFreeTitle")}</Eyebrow>

          {isPro ? (
            <Meter
              label={t("usageAnalyses")}
              used={usage.analysesUsed}
              cap={usage.analysesCap}
            />
          ) : (
            <>
              <Text family="mono" style={styles.credits}>
                {t("usageCredits", { count: usage.analysesLeft })}
              </Text>
              <Text style={styles.creditsHint}>{t("usageFreeHint")}</Text>
            </>
          )}

          {hasChat && (
            <Meter
              label={t("usageChat")}
              used={usage.chatUsed}
              cap={usage.chatCap}
            />
          )}

          <Text family="mono" style={styles.renews}>
            {t("usageRenews", { date: formatShortDate(usage.renewsAt) })}
          </Text>
        </View>

        <SegmentedTabs
          options={[
            { value: "pro", label: t("tabPro") },
            {
              value: "chat",
              label: t("tabChat"),
              icon: <BrotinhoFace size={18} />,
            },
          ]}
          value={kind}
          onChange={pickKind}
          style={styles.segment}
        />

        <View style={styles.plans}>
          {products.map((product) => (
            <RipplePressable
              key={product.id}
              onPress={() => setSelected(product.id)}
              style={[
                styles.plan,
                selected === product.id && styles.planActive,
              ]}
              accessibilityRole="radio"
              accessibilityState={{ selected: selected === product.id }}
            >
              <View style={styles.planTexts}>
                <View style={styles.planHead}>
                  <Text style={styles.planName}>
                    {t(
                      product.period === "year" ? "planAnnual" : "planMonthly",
                    )}
                  </Text>

                  {product.saves && (
                    <View style={styles.badge}>
                      <Text family="mono" style={styles.badgeText}>
                        {t("saves", { amount: product.saves })}
                      </Text>
                    </View>
                  )}
                </View>

                <Text family="mono" style={styles.planPrice}>
                  {product.price}
                </Text>

                {product.monthly && (
                  <Text style={styles.planPeriod}>
                    {t("equivalent", { price: product.monthly })}
                  </Text>
                )}
              </View>

              <Feather
                name={selected === product.id ? "check-circle" : "circle"}
                size={20}
                color={
                  selected === product.id
                    ? theme.secondary.moss
                    : theme.functional.line
                }
              />
            </RipplePressable>
          ))}
        </View>

        <View style={styles.features}>
          {features.map((key) => (
            <View key={key} style={styles.feature}>
              <Feather name="check" size={16} color={theme.secondary.moss} />
              <Text style={styles.featureText}>{t(key)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.caps}>
          <Text style={styles.capsTitle}>{t("capsTitle")}</Text>
          <Text style={styles.capsText}>
            {kind === "chat"
              ? t("capsTextChat", { chat: CHAT_MONTH_CAP })
              : t("capsText", { analyses: MONTH_CAP, chat: CHAT_MONTH_CAP })}
          </Text>
        </View>

        <View style={styles.single}>
          <View style={styles.singleTexts}>
            <Text style={styles.singleTitle}>{t("singleTitle")}</Text>
            <Text style={styles.singleText}>{t("singleText")}</Text>
          </View>
          <Button
            label={singlePrice}
            onPress={buySingle}
            loading={busy}
            variant="outline"
            fullWidth={false}
          />
        </View>

        <Button
          label={owned ? t("current") : t("subscribe")}
          onPress={buy}
          loading={busy}
          disabled={owned}
          style={styles.action}
        />

        <Button
          label={t("restore")}
          onPress={restore}
          variant="ghost"
          style={styles.restore}
        />

        <Text style={styles.storeNote}>{t("storeNote")}</Text>

        <View style={styles.links}>
          <Text style={styles.link} onPress={() => openLegal("terms")}>
            {t("terms")}
          </Text>
          <Text style={styles.link} onPress={() => openLegal("privacy")}>
            {t("privacy")}
          </Text>
        </View>
      </ScrollView>
    </Container>
  );
}

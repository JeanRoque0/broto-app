import { Feather } from "@expo/vector-icons";
import type { FlashListRef } from "@shopify/flash-list";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";
import { BackHandler, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  BrotinhoArt,
  BrotinhoFace,
} from "@/components/illustrations/BrotinhoArt";
import { CHAT_DAILY_CAP, CHAT_MONTH_CAP } from "@/constants";
import { Appear } from "@/components/ui/Appear";
import { Button } from "@/components/ui/Button";
import { CircleButton } from "@/components/ui/CircleButton";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { ContainerModal } from "@/components/ui/ContainerModal";
import { QuotaBar } from "@/components/ui/QuotaBar";
import { MenuRow } from "@/components/ui/Row";
import { ContainerModalCenter } from "@/components/ui/ContainerModalCenter";
import { Floating } from "@/components/ui/Floating";
import { FlashListContainer } from "@/components/ui/FlashListContainer";
import { Header } from "@/components/ui/Header";
import { KeyboardAwareView } from "@/components/ui/KeyboardAwareView";
import { Loader } from "@/components/ui/Loader";
import { RipplePressable } from "@/components/ui/RipplePressable";
import { Text } from "@/components/ui/Text";
import type { ChatMessage } from "@/services/supabase/chat";
import { theme } from "@/style/theme";
import { haptic } from "@/utils/haptics";

import { RichText } from "./components/RichText";
import { ThreadsSheet } from "./components/ThreadsSheet";
import { TypingDots } from "./components/TypingDots";
import { styles } from "./style";
import { useChat } from "./useChat";

const TAIL_RESERVE = 260;
const FOCUS_DELAY = 420;
const THINKING = ["thinkingA", "thinkingB", "thinkingC", "thinkingD"] as const;

export default function ChatScreen() {
  const router = useRouter();
  const { t } = useTranslation("chat");
  const insets = useSafeAreaInsets();
  const list = useRef<FlashListRef<ChatMessage>>(null);
  const field = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);
  const [viewport, setViewport] = useState(0);
  const {
    hasChat,
    remaining,
    threads,
    threadsLoading,
    threadId,
    items,
    isLoading,
    isSending,
    failed,
    draft,
    setDraft,
    submit,
    startNew,
    pickThread,
    removeThread,
    removing,
    threadsVisible,
    openThreads,
    closeThreads,
    openPaywall,
    cap,
    closeCap,
    renewsLabel,
    greeting,
    isTyping,
    thinkingIndex,
    menuVisible,
    openMenu,
    closeMenu,
    usageVisible,
    goBack,
    openUsage,
    closeUsage,
    remainingToday,
  } = useChat();

  const tail = Math.max(0, viewport - TAIL_RESERVE);
  const suggestions = t("suggestions", {
    returnObjects: true,
  }) as unknown as string[];

  useEffect(() => {
    if (!hasChat) return;

    const timer = setTimeout(() => field.current?.focus(), FOCUS_DELAY);
    return () => clearTimeout(timer);
  }, [hasChat]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      goBack,
    );

    return () => subscription.remove();
  }, [goBack]);

  useEffect(() => {
    if (items.length === 0) return;

    const timer = setTimeout(
      () => list.current?.scrollToEnd({ animated: true }),
      80,
    );

    return () => clearTimeout(timer);
  }, [items.length, isSending, isTyping]);

  if (!hasChat) {
    return (
      <Container>
        <Header showBack title={t("title")} />

        <View style={styles.locked}>
          <Appear index={0}>
            <Floating>
              <BrotinhoArt />
            </Floating>
          </Appear>

          <Appear index={1} style={styles.lockedCopy}>
            <Text
              family="display"
              style={styles.lockedTitle}
              accessibilityRole="header"
            >
              {t("lockedTitle")}
            </Text>
            <Text style={styles.introText}>{t("lockedDescription")}</Text>
          </Appear>

          <Appear index={2} style={styles.lockedActions}>
            <Button label={t("lockedProAction")} onPress={openPaywall} />
          </Appear>
        </View>
      </Container>
    );
  }

  return (
    <Container>
      <Header
        showBack
        onBack={() => {
          if (!goBack()) router.back();
        }}
        title={t("title")}
        rightAction={
          <CircleButton onPress={openMenu} accessibilityLabel={t("menu")}>
            <Feather
              name="more-horizontal"
              size={18}
              color={theme.text.primary}
            />
          </CircleButton>
        }
      />

      <KeyboardAwareView style={styles.flex}>
        <View
          style={styles.flex}
          onLayout={(event) => setViewport(event.nativeEvent.layout.height)}
        >
          {isLoading ? (
            <View style={styles.loading}>
              <Loader />
            </View>
          ) : (
            <FlashListContainer
              maintainVisibleContentPosition={{
                autoscrollToBottomThreshold: 0.2,
              }}
              ref={list}
              data={items}
              keyExtractor={(item) => item.id}
              getItemType={(item) => item.role}
              contentContainerStyle={styles.list}
              keyboardDismissMode="none"
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View>
                  <Appear index={0} style={[styles.bubbleRow, styles.botRow]}>
                    <BrotinhoFace size={28} />
                    <View style={[styles.bubble, styles.fromBot]}>
                      <Text style={styles.bubbleText}>{greeting}</Text>
                    </View>
                  </Appear>

                  {!isSending && (
                    <View
                      style={styles.suggestions}
                      accessibilityLabel={t("suggestionsLabel")}
                    >
                      {suggestions.map((suggestion, index) => (
                        <Appear key={suggestion} index={index + 2}>
                          <RipplePressable
                            onPress={() => {
                              haptic.tap();
                              submit(suggestion);
                            }}
                            pressScale={0.97}
                            style={styles.suggestion}
                            accessibilityRole="button"
                          >
                            <Feather
                              name="message-circle"
                              size={14}
                              color={theme.primary.clay}
                            />
                            <Text style={styles.suggestionText}>
                              {suggestion}
                            </Text>
                          </RipplePressable>
                        </Appear>
                      ))}
                    </View>
                  )}
                </View>
              }
              ListFooterComponent={
                <>
                  {isSending && (
                    <View style={styles.typing}>
                      <BrotinhoFace size={28} />
                      <TypingDots />
                      <Text
                        style={styles.thinking}
                        accessibilityLiveRegion="polite"
                      >
                        {t(THINKING[thinkingIndex % THINKING.length])}
                      </Text>
                    </View>
                  )}
                  {(isSending || isTyping) && <View style={{ height: tail }} />}
                  {failed && !isSending && (
                    <Text style={styles.failed}>{t("failed")}</Text>
                  )}
                </>
              }
              renderItem={({ item }) =>
                item.role === "user" ? (
                  <View style={styles.bubbleRow}>
                    <View style={[styles.bubble, styles.fromUser]}>
                      <Text style={styles.bubbleText}>{item.content}</Text>
                    </View>
                  </View>
                ) : (
                  <View style={[styles.bubbleRow, styles.botRow]}>
                    <BrotinhoFace size={28} />
                    <View style={[styles.bubble, styles.fromBot]}>
                      <RichText
                        content={item.content}
                        style={styles.bubbleText}
                      />
                    </View>
                  </View>
                )
              }
            />
          )}
        </View>

        <View
          style={[
            styles.composer,
            { paddingBottom: insets.bottom + theme.spacing.s3 },
          ]}
        >
          <TextInput
            ref={field}
            style={[styles.field, focused && styles.fieldFocused]}
            value={draft}
            onChangeText={setDraft}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={t("placeholder")}
            placeholderTextColor={theme.text.tertiary}
            accessibilityLabel={t("messageLabel")}
            multiline
            textAlignVertical="top"
            maxLength={800}
          />

          <RipplePressable
            onPress={() => {
              haptic.tap();
              submit();
            }}
            pressScale={0.9}
            disabled={!draft.trim() || isSending}
            style={[
              styles.send,
              (!draft.trim() || isSending) && styles.sendOff,
            ]}
            accessibilityRole="button"
            accessibilityLabel={t("send")}
            accessibilityState={{ disabled: !draft.trim() || isSending }}
          >
            <Feather name="arrow-up" size={20} color={theme.text.onDark} />
          </RipplePressable>
        </View>
      </KeyboardAwareView>

      <ThreadsSheet
        visible={threadsVisible}
        threads={threads}
        loading={threadsLoading}
        activeId={threadId}
        removing={removing}
        onClose={closeThreads}
        onPick={pickThread}
        onRemove={removeThread}
        onNew={startNew}
      />

      <ContainerModal
        visible={menuVisible}
        onClose={closeMenu}
        title={t("menuTitle")}
      >
        <Card style={styles.menuCard}>
          <MenuRow
            label={t("menuUsage")}
            icon="bar-chart-2"
            onPress={() => {
              closeMenu();
              openUsage();
            }}
          />
          <MenuRow
            label={t("newThread")}
            icon="plus"
            onPress={() => {
              closeMenu();
              startNew();
            }}
          />
          <MenuRow
            label={t("menuHistory")}
            icon="clock"
            onPress={() => {
              closeMenu();
              openThreads();
            }}
            last
          />
        </Card>
      </ContainerModal>

      <ContainerModal
        visible={usageVisible}
        onClose={closeUsage}
        title={t("menuUsage")}
        description={t("usageDescription")}
      >
        <View style={styles.gauges}>
          <QuotaBar
            label={t("gaugeDay")}
            left={remainingToday}
            total={CHAT_DAILY_CAP}
          />
          <QuotaBar
            label={t("gaugeMonth")}
            left={remaining}
            total={CHAT_MONTH_CAP}
          />
        </View>

        <Text style={styles.gaugeHint}>
          {t("gaugeRenews", { date: renewsLabel })}
        </Text>
      </ContainerModal>

      <ContainerModalCenter
        visible={!!cap}
        onClose={closeCap}
        title={
          cap === "plan"
            ? t("capPlanTitle")
            : cap === "day"
              ? t("capDayTitle")
              : t("capMonthTitle")
        }
        description={
          cap === "plan"
            ? t("capPlanText")
            : cap === "day"
              ? t("capDayText", { day: CHAT_DAILY_CAP })
              : t("capMonthText", {
                  month: CHAT_MONTH_CAP,
                  date: renewsLabel,
                })
        }
      >
        {cap === "plan" && (
          <Button
            label={t("capPlans")}
            onPress={() => {
              closeCap();
              openPaywall();
            }}
          />
        )}
        <Button
          label={t("capAction")}
          onPress={closeCap}
          variant={cap === "plan" ? "ghost" : "primary"}
        />
      </ContainerModalCenter>
    </Container>
  );
}

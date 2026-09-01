import { Feather } from "@expo/vector-icons";
import type { FlashListRef } from "@shopify/flash-list";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  BrotinhoArt,
  BrotinhoFace,
} from "@/components/illustrations/BrotinhoArt";
import { CHAT_DAILY_CAP, CHAT_MONTH_CAP } from "@/constants";
import { Button } from "@/components/ui/Button";
import { CircleButton } from "@/components/ui/CircleButton";
import { Container } from "@/components/ui/Container";
import { ContainerModalCenter } from "@/components/ui/ContainerModalCenter";
import { FlashListContainer } from "@/components/ui/FlashListContainer";
import { Header } from "@/components/ui/Header";
import { KeyboardAwareView } from "@/components/ui/KeyboardAwareView";
import { Loader } from "@/components/ui/Loader";
import { RipplePressable } from "@/components/ui/RipplePressable";
import { Text } from "@/components/ui/Text";
import type { ChatMessage } from "@/services/supabase/chat";
import { theme } from "@/style/theme";

import { RichText } from "./components/RichText";
import { ThreadsSheet } from "./components/ThreadsSheet";
import { TypingDots } from "./components/TypingDots";
import { styles } from "./style";
import { useChat } from "./useChat";

const TAIL_RESERVE = 260;

const THINKING = [
  "thinkingA",
  "thinkingB",
  "thinkingC",
  "thinkingD",
] as const;

export default function ChatScreen() {
  const { t } = useTranslation("chat");
  const insets = useSafeAreaInsets();
  const list = useRef<FlashListRef<ChatMessage>>(null);
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
    thinkingIndex,
    stop,
    edit,
    editing,
    cancelEdit,
    busy,
  } = useChat();

  const tail = Math.max(0, viewport - TAIL_RESERVE);

  useEffect(() => {
    if (items.length === 0) return;

    const timer = setTimeout(
      () => list.current?.scrollToEnd({ animated: true }),
      80,
    );

    return () => clearTimeout(timer);
  }, [items.length, busy]);

  if (!hasChat) {
    return (
      <Container>
        <Header showBack title={t("title")} />

        <View style={styles.locked}>
          <BrotinhoArt />

          <Text family="display" style={styles.lockedTitle}>
            {t("lockedTitle")}
          </Text>
          <Text style={styles.introText}>{t("lockedDescription")}</Text>

          <View style={styles.lockedActions}>
            <Button
              label={t("lockedChatAction")}
              onPress={() => openPaywall("chat")}
            />

            <Button
              label={t("lockedProAction")}
              onPress={() => openPaywall("pro")}
              variant="outline"
            />
          </View>
        </View>
      </Container>
    );
  }

  return (
    <Container>
      <Header
        showBack
        title={t("title")}
        rightAction={
          <View style={styles.actions}>
            <CircleButton
              onPress={openThreads}
              accessibilityLabel={t("threads")}
            >
              <Feather name="clock" size={16} color={theme.text.primary} />
            </CircleButton>

            <CircleButton
              onPress={startNew}
              accessibilityLabel={t("newThread")}
            >
              <Feather name="plus" size={17} color={theme.text.primary} />
            </CircleButton>
          </View>
        }
      />

      <Text family="mono" style={styles.quota}>
        {t("remaining", { count: remaining })}
      </Text>

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
              <View style={styles.intro}>
                <BrotinhoArt size={132} />

                <Text family="display" style={styles.introTitle}>
                  {t("introTitle")}
                </Text>
              </View>
            }
            ListFooterComponent={
              <>
                {isSending && (
                  <View style={styles.typing}>
                    <BrotinhoFace size={28} />
                    <TypingDots />
                    <Text style={styles.thinking}>
                      {t(THINKING[thinkingIndex % THINKING.length])}
                    </Text>
                  </View>
                )}
                {busy && <View style={{ height: tail }} />}
                {failed && !isSending && (
                  <Text style={styles.failed}>{t("failed")}</Text>
                )}
              </>
            }
            renderItem={({ item }) =>
              item.role === "user" ? (
                <View style={styles.bubbleRow}>
                  <RipplePressable
                    onPress={() => edit(item)}
                    style={[
                      styles.bubble,
                      styles.fromUser,
                      editing?.id === item.id && styles.bubbleEditing,
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel={t("editMessage")}
                  >
                    <Text style={styles.bubbleText}>{item.content}</Text>
                  </RipplePressable>
                </View>
              ) : (
                <View style={[styles.bubbleRow, styles.botRow]}>
                  <BrotinhoFace size={28} />
                  <View style={[styles.bubble, styles.fromBot]}>
                    <RichText content={item.content} style={styles.bubbleText} />
                  </View>
                </View>
              )
            }
          />
        )}

        </View>

        {editing && (
          <View style={styles.editingBar}>
            <Feather name="edit-2" size={13} color={theme.primary.clay} />

            <View style={styles.editingTexts}>
              <Text style={styles.editingLabel}>{t("editingTitle")}</Text>
              <Text style={styles.editingText} numberOfLines={1}>
                {editing.content}
              </Text>
            </View>

            <RipplePressable
              onPress={cancelEdit}
              style={styles.editingClose}
              accessibilityRole="button"
              accessibilityLabel={t("editingCancel")}
            >
              <Feather name="x" size={15} color={theme.text.secondary} />
            </RipplePressable>
          </View>
        )}

        <View
          style={[
            styles.composer,
            { paddingBottom: insets.bottom + theme.spacing.s3 },
          ]}
        >
          <TextInput
            style={[styles.field, focused && styles.fieldFocused]}
            value={draft}
            onChangeText={setDraft}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={t("placeholder")}
            placeholderTextColor={theme.text.tertiary}
            multiline
            textAlignVertical="top"
            maxLength={800}
          />

          <RipplePressable
            onPress={busy ? stop : submit}
            disabled={!busy && !draft.trim()}
            style={[styles.send, !busy && !draft.trim() && styles.sendOff]}
            accessibilityRole="button"
            accessibilityLabel={
              busy ? t("stop") : editing ? t("editingSave") : t("send")
            }
          >
            <Feather
              name={busy ? "square" : editing ? "check" : "arrow-up"}
              size={busy ? 15 : 20}
              color={theme.text.onDark}
            />
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
              openPaywall("chat");
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

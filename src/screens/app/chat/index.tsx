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
import { Button } from "@/components/ui/Button";
import { CircleButton } from "@/components/ui/CircleButton";
import { Container } from "@/components/ui/Container";
import { FlashListContainer } from "@/components/ui/FlashListContainer";
import { Header } from "@/components/ui/Header";
import { KeyboardAwareView } from "@/components/ui/KeyboardAwareView";
import { Loader } from "@/components/ui/Loader";
import { RipplePressable } from "@/components/ui/RipplePressable";
import { Text } from "@/components/ui/Text";
import type { ChatMessage } from "@/services/supabase/chat";
import { theme } from "@/style/theme";

import { ThreadsSheet } from "./components/ThreadsSheet";
import { TypingDots } from "./components/TypingDots";
import { styles } from "./style";
import { useChat } from "./useChat";

export default function ChatScreen() {
  const { t } = useTranslation("chat");
  const insets = useSafeAreaInsets();
  const list = useRef<FlashListRef<ChatMessage>>(null);
  const [focused, setFocused] = useState(false);
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
  } = useChat();

  useEffect(() => {
    if (items.length === 0) return;
    const timer = setTimeout(
      () => list.current?.scrollToEnd({ animated: true }),
      80,
    );
    return () => clearTimeout(timer);
  }, [items.length, isSending]);

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
        {isLoading ? (
          <View style={styles.loading}>
            <Loader />
          </View>
        ) : (
          <FlashListContainer
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
                  </View>
                )}
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
                    <Text style={styles.bubbleText}>{item.content}</Text>
                  </View>
                </View>
              )
            }
          />
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
            onPress={submit}
            disabled={!draft.trim() || isSending}
            style={[
              styles.send,
              (!draft.trim() || isSending) && styles.sendOff,
            ]}
            accessibilityRole="button"
            accessibilityLabel={t("send")}
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
    </Container>
  );
}

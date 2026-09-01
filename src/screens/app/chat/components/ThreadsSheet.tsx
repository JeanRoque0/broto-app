import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { Button } from "@/components/ui/Button";
import {
  ContainerModal,
  ModalScrollView,
} from "@/components/ui/ContainerModal";
import { Loader } from "@/components/ui/Loader";
import { RipplePressable } from "@/components/ui/RipplePressable";
import { Text } from "@/components/ui/Text";
import type { ChatThread } from "@/services/supabase/chat";
import { theme } from "@/style/theme";
import { formatShortDate } from "@/utils/format";

import { styles } from "../style";

type ThreadsSheetProps = {
  visible: boolean;
  threads: ChatThread[];
  loading: boolean;
  activeId: string | null;
  removing: boolean;
  onClose: () => void;
  onPick: (threadId: string) => void;
  onRemove: (threadId: string) => void;
  onNew: () => void;
};

export function ThreadsSheet({
  visible,
  threads,
  loading,
  activeId,
  removing,
  onClose,
  onPick,
  onRemove,
  onNew,
}: ThreadsSheetProps) {
  const { t } = useTranslation("chat");
  const [confirmId, setConfirmId] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) setConfirmId(null);
  }, [visible]);

  return (
    <ContainerModal
      visible={visible}
      onClose={onClose}
      title={t("threadsTitle")}
      description={t("threadsSubtitle")}
    >
      {loading ? (
        <View style={styles.threadsLoading}>
          <Loader />
        </View>
      ) : threads.length === 0 ? (
        <Text style={styles.introText}>{t("threadsEmpty")}</Text>
      ) : (
        <ModalScrollView
          style={styles.threadList}
          showsVerticalScrollIndicator={false}
        >
          {threads.map((item) => {
            const active = item.id === activeId;
            const confirming = confirmId === item.id;

            return (
              <RipplePressable
                key={item.id}
                onPress={() => onPick(item.id)}
                style={[styles.threadRow, active && styles.threadActive]}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
              >
                <View style={styles.threadTexts}>
                  <Text style={styles.threadTitle} numberOfLines={2}>
                    {item.title ?? t("threadUntitled")}
                  </Text>
                  <Text family="mono" style={styles.threadDate}>
                    {formatShortDate(item.last_message_at)}
                  </Text>
                </View>

                {confirming ? (
                  <View style={styles.threadConfirm}>
                    <RipplePressable
                      onPress={() => setConfirmId(null)}
                      style={styles.threadIcon}
                      accessibilityRole="button"
                      accessibilityLabel={t("cancel", { ns: "common" })}
                    >
                      <Feather
                        name="x"
                        size={17}
                        color={theme.text.secondary}
                      />
                    </RipplePressable>

                    <RipplePressable
                      onPress={() => {
                        setConfirmId(null);
                        onRemove(item.id);
                      }}
                      disabled={removing}
                      style={[styles.threadIcon, styles.threadIconDanger]}
                      accessibilityRole="button"
                      accessibilityLabel={t("removeThread")}
                    >
                      <Feather
                        name="check"
                        size={17}
                        color={theme.text.onPrimary}
                      />
                    </RipplePressable>
                  </View>
                ) : (
                  <RipplePressable
                    onPress={() => setConfirmId(item.id)}
                    style={[styles.threadIcon, styles.threadIconTrash]}
                    hitSlop={6}
                    accessibilityRole="button"
                    accessibilityLabel={t("removeThread")}
                  >
                    <Feather
                      name="trash-2"
                      size={17}
                      color={theme.functional.danger}
                    />
                  </RipplePressable>
                )}
              </RipplePressable>
            );
          })}
        </ModalScrollView>
      )}

      <Button
        label={t("newThread")}
        onPress={onNew}
        variant="outline"
        style={styles.newThread}
      />
    </ContainerModal>
  );
}

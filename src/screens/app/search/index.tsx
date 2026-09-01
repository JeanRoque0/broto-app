import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { Container } from "@/components/ui/Container";
import { FlashListContainer } from "@/components/ui/FlashListContainer";
import { Input } from "@/components/ui/Input";
import { Loader } from "@/components/ui/Loader";
import { RipplePressable } from "@/components/ui/RipplePressable";
import { Text } from "@/components/ui/Text";
import { useTabBarSpace } from "@/hooks/useTabBarSpace";
import { theme } from "@/style/theme";

import { styles } from "./style";
import { useSearch } from "./useSearch";

export default function SearchScreen() {
  const { t } = useTranslation("search");
  const tabBarSpace = useTabBarSpace();
  const {
    term,
    setTerm,
    inputRef,
    results,
    isLoading,
    isError,
    hasQuery,
    open,
    history,
    forgetTerm,
    showHistory,
    onFocus,
    onBlur,
  } = useSearch();

  return (
    <Container>
      <View style={styles.header}>
        <Text family="display" style={styles.title}>
          {t("title")}
        </Text>

        <Input
          ref={inputRef}
          placeholder={t("placeholder")}
          value={term}
          onChangeText={setTerm}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          onFocus={onFocus}
          onBlur={onBlur}
          iconLeft={
            <Feather name="search" size={17} color={theme.text.secondary} />
          }
          iconRight={
            term.length > 0 ? (
              <RipplePressable
                onPress={() => setTerm("")}
                hitSlop={10}
                style={styles.clear}
                accessibilityRole="button"
                accessibilityLabel={t("clear")}
              >
                <Feather name="x" size={14} color={theme.primary.clay} />
              </RipplePressable>
            ) : null
          }
          containerStyle={styles.field}
        />
      </View>

      <FlashListContainer
        data={results}
        keyExtractor={(species) => species.scientific}
        contentContainerStyle={{ paddingBottom: tabBarSpace }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.content}>
            {showHistory && (
              <View style={styles.history}>
                <Text family="mono" style={styles.historyLabel}>
                  {t("recent")}
                </Text>

                {history.map((item) => (
                  <View key={item} style={styles.historyRow}>
                    <RipplePressable
                      onPress={() => setTerm(item)}
                      style={styles.historyTerm}
                      accessibilityRole="button"
                    >
                      <Feather
                        name="clock"
                        size={15}
                        color={theme.text.tertiary}
                      />
                      <Text style={styles.historyText} numberOfLines={1}>
                        {item}
                      </Text>
                    </RipplePressable>

                    <RipplePressable
                      onPress={() => forgetTerm(item)}
                      hitSlop={8}
                      style={styles.historyRemove}
                      accessibilityRole="button"
                      accessibilityLabel={t("removeRecent")}
                    >
                      <Feather
                        name="x"
                        size={14}
                        color={theme.text.secondary}
                      />
                    </RipplePressable>
                  </View>
                ))}
              </View>
            )}

            {!hasQuery && !showHistory && (
              <Text style={styles.hint}>{t("hint")}</Text>
            )}

            {hasQuery && isLoading && <Loader />}

            {hasQuery && !isLoading && isError && (
              <Text style={styles.hint}>{t("failed")}</Text>
            )}

            {hasQuery && !isLoading && !isError && (
              <View style={styles.empty}>
                <Text family="display" style={styles.emptyTitle}>
                  {t("empty")}
                </Text>
                <Text style={styles.hint}>{t("emptyHint")}</Text>
              </View>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.content}>
            <RipplePressable
              onPress={() => open(item)}
              style={styles.row}
              accessibilityRole="button"
            >
              <View style={[styles.thumb, styles.thumbEmpty]}>
                <MaterialCommunityIcons
                  name="sprout-outline"
                  size={20}
                  color={theme.illustration.leaf}
                />

                {item.images[0] && (
                  <Image
                    source={{ uri: item.images[0] }}
                    style={styles.thumbImage}
                    contentFit="cover"
                    transition={200}
                    cachePolicy="memory-disk"
                  />
                )}
              </View>

              <View style={styles.texts}>
                <Text style={styles.name} numberOfLines={2}>
                  {item.common ?? item.scientific}
                </Text>
                <Text style={styles.scientific} numberOfLines={1}>
                  {item.scientific}
                </Text>
              </View>

              <Feather
                name="chevron-right"
                size={18}
                color={theme.text.secondary}
              />
            </RipplePressable>
          </View>
        )}
      />
    </Container>
  );
}

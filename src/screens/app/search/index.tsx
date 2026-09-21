import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { Appear } from "@/components/ui/Appear";
import { Chip } from "@/components/ui/Chip";
import { Container } from "@/components/ui/Container";
import { FlashListContainer } from "@/components/ui/FlashListContainer";
import { Floating } from "@/components/ui/Floating";
import { Input } from "@/components/ui/Input";
import { PlantListSkeleton } from "@/components/ui/Skeleton";
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
  const popular = t("popularTerms", {
    returnObjects: true,
  }) as unknown as string[];

  return (
    <Container>
      <View style={styles.header}>
        <Text family="display" style={styles.title} accessibilityRole="header">
          {t("title")}
        </Text>

        <Input
          ref={inputRef}
          placeholder={t("placeholder")}
          accessibilityLabel={t("title")}
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
          hasQuery && isLoading ? (
            <PlantListSkeleton rows={5} />
          ) : (
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

              {!hasQuery && (
                <View style={styles.history}>
                  <Text family="mono" style={styles.historyLabel}>
                    {t("popular")}
                  </Text>
                  <View style={styles.popular}>
                    {popular.map((item, index) => (
                      <Appear key={item} index={index}>
                        <Chip label={item} onPress={() => setTerm(item)} />
                      </Appear>
                    ))}
                  </View>
                </View>
              )}

              {hasQuery && !isLoading && isError && (
                <Text style={styles.hint}>{t("failed")}</Text>
              )}

              {hasQuery && !isLoading && !isError && (
                <Appear index={0} style={styles.empty}>
                  <Floating>
                    <MaterialCommunityIcons
                      name="leaf-off"
                      size={34}
                      color={theme.illustration.leaf}
                    />
                  </Floating>
                  <Text
                    family="display"
                    style={styles.emptyTitle}
                    accessibilityRole="header"
                  >
                    {t("empty")}
                  </Text>
                  <Text style={styles.hint}>{t("emptyHint")}</Text>
                </Appear>
              )}
            </View>
          )
        }
        renderItem={({ item }) => (
          <View style={styles.content}>
            <RipplePressable
              onPress={() => open(item)}
              pressScale={0.98}
              style={styles.row}
              accessibilityRole="button"
              accessibilityLabel={
                item.common
                  ? `${item.common}, ${item.scientific}`
                  : item.scientific
              }
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

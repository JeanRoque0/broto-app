import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";

import { ChatSuggestions } from "@/components/ChatSuggestions";
import { PhotoGallery } from "@/components/PhotoGallery";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import {
  ContainerModal,
  ModalScrollView,
} from "@/components/ui/ContainerModal";
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
    selected,
    open,
    close,
    adding,
    add,
    photoIndex,
    history,
    forgetTerm,
    showHistory,
    onFocus,
    onBlur,
    openPhoto,
    closePhoto,
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

      <ContainerModal
        visible={selected !== null}
        onClose={close}
        title={selected?.common ?? selected?.scientific ?? ""}
        description={selected?.scientific}
      >
        <ModalScrollView showsVerticalScrollIndicator={false}>
          {selected && selected.images.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.gallery}
            >
              {selected.images.map((source, index) => (
                <RipplePressable
                  key={source}
                  onPress={() => openPhoto(index)}
                  style={styles.photoTouch}
                  accessibilityRole="imagebutton"
                  accessibilityLabel={t("expandPhoto")}
                >
                  <MaterialCommunityIcons
                    name="sprout-outline"
                    size={34}
                    color={theme.illustration.leaf}
                  />

                  <Image
                    source={{ uri: source }}
                    style={styles.photo}
                    contentFit="cover"
                    transition={200}
                    cachePolicy="memory-disk"
                  />
                </RipplePressable>
              ))}
            </ScrollView>
          )}

          {selected?.extract && (
            <Text style={styles.extract}>{selected.extract}</Text>
          )}

          <Text family="mono" style={styles.credit}>
            {t("photoCredit")}
          </Text>

          <Text style={styles.careHint}>{t("careHint")}</Text>

          {selected && (
            <View style={styles.suggestions}>
              <ChatSuggestions
                seed={selected.scientific}
                scopes={["species"]}
                count={3}
                speciesName={selected.common ?? selected.scientific}
                beforeNavigate={close}
              />
            </View>
          )}
        </ModalScrollView>

        <Button
          label={t("add")}
          onPress={() => selected && add(selected)}
          loading={adding}
          style={styles.action}
        />
      </ContainerModal>

      <PhotoGallery
        visible={photoIndex !== null}
        images={selected?.images ?? []}
        initialIndex={photoIndex ?? 0}
        onClose={closePhoto}
        closeLabel={t("closePhoto")}
      />
    </Container>
  );
}

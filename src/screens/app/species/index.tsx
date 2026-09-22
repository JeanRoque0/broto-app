import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";

import { Appear } from "@/components/ui/Appear";
import { ChatSuggestions } from "@/components/ChatSuggestions";
import { PhotoGallery } from "@/components/PhotoGallery";
import { SpeciesShareCard } from "@/components/SpeciesShareCard";
import { Button } from "@/components/ui/Button";
import { CircleButton } from "@/components/ui/CircleButton";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { Glass } from "@/components/ui/Glass";
import { Header } from "@/components/ui/Header";
import { RipplePressable } from "@/components/ui/RipplePressable";
import { Text } from "@/components/ui/Text";
import { theme } from "@/style/theme";

import { styles } from "./style";
import { useSpecies } from "./useSpecies";

const EXTRACT_LINES = 6;
const LONG_EXTRACT = 280;

export default function SpeciesScreen() {
  const { t } = useTranslation("search");
  const {
    species,
    title,
    images,
    adding,
    add,
    copy,
    shot,
    share,
    footerHeight,
    onFooterLayout,
    photoIndex,
    openPhoto,
    closePhoto,
  } = useSpecies();
  const [expanded, setExpanded] = useState(false);

  if (!species) {
    return (
      <Container>
        <Header showBack title={t("title")} />
        <EmptyState title={t("gone")} description={t("goneDescription")} />
      </Container>
    );
  }

  return (
    <Container>
      <Header
        showBack
        title={title}
        rightAction={
          <CircleButton onPress={share} accessibilityLabel={t("share")}>
            <Feather name="share-2" size={17} color={theme.text.primary} />
          </CircleButton>
        }
      />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: footerHeight + theme.spacing.s5 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {images.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.galleryRow}
            contentContainerStyle={styles.gallery}
          >
            {images.map((source, index) => (
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

        <Appear index={1}>
          <View style={styles.block}>
            <Text
              accessibilityRole="header"
              family="display"
              style={styles.title}
            >
              {title}
            </Text>

            <View style={styles.nameRow}>
              {species.common && (
                <Text style={styles.scientific}>{species.scientific}</Text>
              )}
              <RipplePressable
                onPress={copy}
                style={styles.copy}
                accessibilityRole="button"
                accessibilityLabel={t("copyAction")}
              >
                <Feather name="copy" size={13} color={theme.primary.clay} />
                <Text style={styles.copyLabel}>{t("copyAction")}</Text>
              </RipplePressable>
            </View>

            {species.extract && (
              <>
                <Text
                  selectable
                  style={styles.extract}
                  numberOfLines={expanded ? undefined : EXTRACT_LINES}
                >
                  {species.extract}
                </Text>
                {species.extract.length > LONG_EXTRACT && (
                  <RipplePressable
                    onPress={() => setExpanded((open) => !open)}
                    style={styles.more}
                    accessibilityRole="button"
                    accessibilityState={{ expanded }}
                  >
                    <Text style={styles.moreLabel}>
                      {expanded ? t("readLess") : t("readMore")}
                    </Text>
                    <Feather
                      name={expanded ? "chevron-up" : "chevron-down"}
                      size={15}
                      color={theme.primary.clay}
                    />
                  </RipplePressable>
                )}
              </>
            )}

            <Text style={styles.credit}>{t("photoCredit")}</Text>

            <View style={styles.careHint}>
              <MaterialCommunityIcons
                name="sprout-outline"
                size={20}
                color={theme.secondary.moss}
              />
              <Text style={styles.careHintText}>{t("careHint")}</Text>
            </View>

            <View style={styles.suggestions}>
              <ChatSuggestions
                seed={species.scientific}
                scopes={["species"]}
                count={3}
                speciesName={species.common ?? species.scientific}
              />
            </View>
          </View>
        </Appear>
      </ScrollView>

      <View style={styles.footer} onLayout={onFooterLayout}>
        <Glass style={StyleSheet.absoluteFill} />
        <Button label={t("add")} onPress={add} loading={adding} />
      </View>

      <SpeciesShareCard
        ref={shot}
        data={{
          title,
          scientific: species.scientific,
          description: species.extract,
          images,
        }}
      />

      <PhotoGallery
        visible={photoIndex !== null}
        images={images}
        initialIndex={photoIndex ?? 0}
        onClose={closePhoto}
        closeLabel={t("closePhoto")}
      />
    </Container>
  );
}

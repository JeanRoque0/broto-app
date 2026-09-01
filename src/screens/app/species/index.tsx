import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";

import { ChatSuggestions } from "@/components/ChatSuggestions";
import { PhotoGallery } from "@/components/PhotoGallery";
import { SpeciesShareCard } from "@/components/SpeciesShareCard";
import { Button } from "@/components/ui/Button";
import { CircleButton } from "@/components/ui/CircleButton";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { Header } from "@/components/ui/Header";
import { RipplePressable } from "@/components/ui/RipplePressable";
import { Text } from "@/components/ui/Text";
import { theme } from "@/style/theme";

import { styles } from "./style";
import { useSpecies } from "./useSpecies";

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
    photoIndex,
    openPhoto,
    closePhoto,
  } = useSpecies();

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
        contentContainerStyle={styles.content}
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

        <View style={styles.block}>
          <Text family="display" style={styles.title}>
            {title}
          </Text>

          {species.common && (
            <Text style={styles.scientific}>{species.scientific}</Text>
          )}

          {species.extract && (
            <Text selectable style={styles.extract}>
              {species.extract}
            </Text>
          )}

          <RipplePressable
            onPress={copy}
            style={styles.copy}
            accessibilityRole="button"
            accessibilityLabel={t("copyAction")}
          >
            <Feather name="copy" size={14} color={theme.primary.clay} />
            <Text style={styles.copyLabel}>{t("copyAction")}</Text>
          </RipplePressable>

          <Text family="mono" style={styles.credit}>
            {t("photoCredit")}
          </Text>

          <Text style={styles.careHint}>{t("careHint")}</Text>

          <View style={styles.suggestions}>
            <ChatSuggestions
              seed={species.scientific}
              scopes={["species"]}
              count={3}
              speciesName={species.common ?? species.scientific}
            />
          </View>
        </View>

        <View style={[styles.block, styles.action]}>
          <Button label={t("add")} onPress={add} loading={adding} />
        </View>
      </ScrollView>

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

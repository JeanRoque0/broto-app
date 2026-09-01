import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";

import { ChatSuggestions } from "@/components/ChatSuggestions";
import { CopyableName } from "@/components/CopyableName";
import { PhotoGallery } from "@/components/PhotoGallery";
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
    adding,
    add,
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
        {species.images.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.gallery}
          >
            {species.images.map((source, index) => (
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
          <CopyableName
            label={title}
            common={species.common}
            scientific={species.scientific}
            textStyle={styles.title}
          />

          {species.common && (
            <Text style={styles.scientific}>{species.scientific}</Text>
          )}

          {species.extract && (
            <Text selectable style={styles.extract}>
              {species.extract}
            </Text>
          )}

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

        <Button
          label={t("add")}
          onPress={add}
          loading={adding}
          style={styles.action}
        />
      </ScrollView>

      <PhotoGallery
        visible={photoIndex !== null}
        images={species.images}
        initialIndex={photoIndex ?? 0}
        onClose={closePhoto}
        closeLabel={t("closePhoto")}
      />
    </Container>
  );
}

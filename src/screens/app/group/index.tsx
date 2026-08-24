import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AddPlantSheet } from "@/components/AddPlantSheet";
import { GroupPlantsSheet } from "@/components/GroupPlantsSheet";
import { GroupSheet } from "@/components/GroupSheet";
import { PlantCard } from "@/components/PlantCard";
import { Button } from "@/components/ui/Button";
import { CircleButton } from "@/components/ui/CircleButton";
import { Container } from "@/components/ui/Container";
import { ContainerModalCenter } from "@/components/ui/ContainerModalCenter";
import { ErrorState } from "@/components/ui/ErrorState";
import { FlashListContainer } from "@/components/ui/FlashListContainer";
import { Header } from "@/components/ui/Header";
import { Loader } from "@/components/ui/Loader";
import { Text } from "@/components/ui/Text";
import { theme } from "@/style/theme";

import { styles } from "./style";
import { useGroup } from "./useGroup";

export default function GroupScreen() {
  const { t } = useTranslation("plants");
  const { t: tCommon } = useTranslation();
  const insets = useSafeAreaInsets();
  const {
    group,
    plants,
    allPlants,
    isLoading,
    renameVisible,
    removeVisible,
    pickVisible,
    renaming,
    removing,
    saving,
    openRename,
    closeRename,
    openRemove,
    closeRemove,
    openPick,
    closePick,
    addVisible,
    closeAdd,
    createNew,
    startAnalysis,
    addWithoutPhoto,
    rename,
    remove,
    savePlants,
    openPlant,
  } = useGroup();

  if (isLoading) {
    return (
      <Container>
        <Header showBack />
        <Loader />
      </Container>
    );
  }

  if (!group) {
    return (
      <Container>
        <Header showBack />
        <ErrorState description={t("loadFailed")} />
      </Container>
    );
  }

  return (
    <Container>
      <Header
        showBack
        title={group.name}
        rightAction={
          <View style={styles.actions}>
            <CircleButton
              onPress={openRemove}
              accessibilityLabel={t("groupDelete")}
            >
              <Feather
                name="trash-2"
                size={15}
                color={theme.functional.danger}
              />
            </CircleButton>

            <CircleButton
              onPress={openRename}
              accessibilityLabel={t("groupRename")}
            >
              <Feather name="edit-2" size={15} color={theme.text.primary} />
            </CircleButton>
          </View>
        }
      />

      <FlashListContainer
        data={plants}
        keyExtractor={(plant) => plant.id}
        contentContainerStyle={{
          paddingBottom: insets.bottom + theme.spacing.s6,
        }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.content}>
            {plants.length === 0 ? (
              <View style={styles.empty}>
                <MaterialCommunityIcons
                  name="leaf"
                  size={40}
                  color={theme.illustration.leaf}
                />
                <Text family="display" style={styles.emptyTitle}>
                  {t("groupEmptyTitle")}
                </Text>
                <Text style={styles.emptyHint}>{t("groupEmptyHint")}</Text>
              </View>
            ) : (
              <Text family="mono" style={styles.count}>
                {t("groupPlantCount", { count: plants.length })}
              </Text>
            )}
          </View>
        }
        ListFooterComponent={
          <View style={styles.content}>
            <Button
              label={t("groupAddPlant")}
              onPress={openPick}
              variant="outline"
              style={styles.add}
            />
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.content}>
            <PlantCard plant={item} onPress={() => openPlant(item.id)} />
          </View>
        )}
      />

      <GroupSheet
        visible={renameVisible}
        initialName={group.name}
        saving={renaming}
        onClose={closeRename}
        onSubmit={rename}
      />

      <GroupPlantsSheet
        visible={pickVisible}
        groupName={group.name}
        plants={allPlants}
        selectedIds={plants.map((plant) => plant.id)}
        saving={saving}
        onClose={closePick}
        onSubmit={savePlants}
        onCreateNew={createNew}
      />

      <AddPlantSheet
        visible={addVisible}
        onClose={closeAdd}
        onWithPhoto={startAnalysis}
        onManual={addWithoutPhoto}
      />

      <ContainerModalCenter
        visible={removeVisible}
        onClose={closeRemove}
        title={t("groupDeleteTitle")}
        description={t("groupDeleteText")}
      >
        <Button
          label={t("groupDelete")}
          onPress={remove}
          loading={removing}
          variant="danger"
        />
        <Button
          label={tCommon("cancel")}
          onPress={closeRemove}
          variant="ghost"
        />
      </ContainerModalCenter>
    </Container>
  );
}

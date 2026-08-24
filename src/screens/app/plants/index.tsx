import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { AddPlantSheet } from "@/components/AddPlantSheet";
import { GroupPlantsSheet } from "@/components/GroupPlantsSheet";
import { NotificationBell } from "@/components/NotificationBell";
import { GroupSheet } from "@/components/GroupSheet";
import { EmptyPlantArt } from "@/components/illustrations/OnboardingArt";
import { CircleButton } from "@/components/ui/CircleButton";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Loader } from "@/components/ui/Loader";
import { Text } from "@/components/ui/Text";
import { theme } from "@/style/theme";

import { useTabBarSpace } from "@/hooks/useTabBarSpace";

import { SegmentedTabs } from "@/components/ui/SegmentedTabs";
import { AnalysesPanel } from "./components/AnalysesPanel";
import { PlantsPanel } from "./components/PlantsPanel";
import { TasksPanel } from "./components/TasksPanel";
import { styles } from "./style";
import { usePlantsScreen } from "./usePlantsScreen";

type Tab = "plants" | "tasks" | "analyses";

export default function PlantsScreen() {
  const { t } = useTranslation("plants");
  const tabBarSpace = useTabBarSpace();
  const params = useLocalSearchParams<{ tab?: string }>();
  const [tab, setTab] = useState<Tab>("plants");

  useEffect(() => {
    if (params.tab === "tasks" || params.tab === "analyses") {
      setTab(params.tab);
    }
  }, [params.tab]);
  const {
    plants,
    isLoading,
    isError,
    isRefetching,
    refetch,
    openPlant,
    groups,
    plantsByGroup,
    openGroup,
    pickGroup,
    openPick,
    closePick,
    savingPick,
    savePickedPlants,
    createInGroup,
    groupSheet,
    openGroupSheet,
    closeGroupSheet,
    savingGroup,
    submitGroup,
    startAnalysis,
    addWithoutPhoto,
    addVisible,
    openAdd,
    closeAdd,
  } = usePlantsScreen();

  const sheets = (
    <>
      <AddPlantSheet
        visible={addVisible}
        onClose={closeAdd}
        onWithPhoto={startAnalysis}
        onManual={addWithoutPhoto}
      />

      <GroupSheet
        visible={groupSheet}
        saving={savingGroup}
        onClose={closeGroupSheet}
        onSubmit={submitGroup}
      />

      <GroupPlantsSheet
        visible={pickGroup !== null}
        groupName={pickGroup?.name ?? ""}
        plants={plants}
        selectedIds={plants
          .filter((plant) => plant.group_id === pickGroup?.id)
          .map((plant) => plant.id)}
        saving={savingPick}
        onClose={closePick}
        onSubmit={savePickedPlants}
        onCreateNew={createInGroup}
      />
    </>
  );

  const screenTitle = (
    <View style={styles.topbar}>
      <Text family="display" style={styles.screenTitle}>
        {t("title")}
      </Text>
    </View>
  );

  if (isError) {
    return (
      <Container>
        {screenTitle}
        <ErrorState description={t("loadFailed")} onRetry={refetch} />
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container>
        {screenTitle}
        <Loader />
      </Container>
    );
  }

  if (plants.length === 0) {
    return (
      <Container>
        {screenTitle}

        <EmptyState
          illustration={<EmptyPlantArt />}
          title={t("emptyTitle")}
          description={t("emptyDescription")}
          actionLabel={t("emptyAction")}
          onAction={startAnalysis}
          secondaryLabel={t("emptySecondary")}
          onSecondary={addWithoutPhoto}
        />

        {sheets}
      </Container>
    );
  }

  const header = (
    <>
      <View style={styles.topbar}>
        <View style={styles.titleGroup}>
          <Text family="display" style={styles.screenTitle}>
            {t("title")}
          </Text>
          <Text family="mono" style={styles.count}>
            {t("plantCount", { count: plants.length })}
          </Text>
        </View>

        <View style={styles.headerActions}>
          <NotificationBell />

          <CircleButton onPress={openAdd} accessibilityLabel={t("addPlant")}>
            <Feather name="plus" size={18} color={theme.text.primary} />
          </CircleButton>
        </View>
      </View>

      <SegmentedTabs
        options={[
          { value: "plants", label: t("tabPlants") },
          { value: "tasks", label: t("tabTasks") },
          { value: "analyses", label: t("tabAnalyses") },
        ]}
        value={tab}
        onChange={setTab}
      />
    </>
  );

  return (
    <Container>
      {tab === "tasks" ? (
        <TasksPanel header={header} bottomSpace={tabBarSpace} />
      ) : tab === "analyses" ? (
        <AnalysesPanel header={header} bottomSpace={tabBarSpace} />
      ) : (
        <PlantsPanel
          header={header}
          bottomSpace={tabBarSpace}
          plants={plants}
          groups={groups}
          plantsByGroup={plantsByGroup}
          refreshing={isRefetching}
          onRefresh={refetch}
          onOpenPlant={openPlant}
          onOpenGroup={openGroup}
          onAddToGroup={openPick}
          onNewGroup={openGroupSheet}
        />
      )}

      {sheets}
    </Container>
  );
}

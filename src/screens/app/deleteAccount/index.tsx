import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/Checkbox";
import { Container } from "@/components/ui/Container";
import { ContainerModalCenter } from "@/components/ui/ContainerModalCenter";
import { Header } from "@/components/ui/Header";
import { RipplePressable } from "@/components/ui/RipplePressable";
import { Text } from "@/components/ui/Text";
import { theme } from "@/style/theme";

import { styles } from "./style";
import { useDeleteAccount } from "./useDeleteAccount";

const ITEMS = [
  "deleteItemPlants",
  "deleteItemPhotos",
  "deleteItemAnalyses",
  "deleteItemAccount",
] as const;

export default function DeleteAccountScreen() {
  const { t } = useTranslation("profile");
  const { t: tCommon } = useTranslation();
  const {
    understood,
    confirmVisible,
    deleting,
    toggleUnderstood,
    openConfirm,
    closeConfirm,
    confirm,
    goBack,
  } = useDeleteAccount();

  return (
    <Container>
      <Header showBack title={t("deleteTitle")} />

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text family="display" style={styles.headline}>
          {t("deleteHeadline")}
        </Text>
        <Text style={styles.lead}>{t("deleteLead")}</Text>

        <View style={styles.list}>
          {ITEMS.map((item) => (
            <View key={item} style={styles.item}>
              <Feather
                name="x"
                size={17}
                color={theme.functional.danger}
                style={styles.itemIcon}
              />
              <Text style={styles.itemText}>{t(item)}</Text>
            </View>
          ))}
        </View>

        <Card style={styles.warning}>
          <MaterialCommunityIcons
            name="alert-circle"
            size={20}
            color={theme.functional.danger}
          />
          <View style={styles.warningTexts}>
            <Text style={styles.warningTitle}>
              {t("deleteSubscriptionTitle")}
            </Text>
            <Text style={styles.warningText}>
              {t("deleteSubscriptionText")}
            </Text>
          </View>
        </Card>

        <RipplePressable
          onPress={toggleUnderstood}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: understood }}
          accessibilityLabel={t("deleteConfirmCheck")}
          style={styles.check}
        >
          <View
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            <Checkbox value={understood} onChange={toggleUnderstood} />
          </View>
          <Text style={styles.checkLabel}>{t("deleteConfirmCheck")}</Text>
        </RipplePressable>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label={t("deleteAction")}
          onPress={openConfirm}
          disabled={!understood}
          variant="danger"
        />
        <Button label={tCommon("cancel")} onPress={goBack} variant="ghost" />
      </View>

      <ContainerModalCenter
        visible={confirmVisible}
        onClose={closeConfirm}
        title={t("deleteModalTitle")}
        description={t("deleteModalText")}
      >
        <Button
          label={t("deleteModalConfirm")}
          onPress={confirm}
          loading={deleting}
          variant="danger"
        />
        <Button
          label={tCommon("cancel")}
          onPress={closeConfirm}
          variant="ghost"
        />
      </ContainerModalCenter>
    </Container>
  );
}

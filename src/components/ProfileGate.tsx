import React from "react";
import { StyleSheet, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { Loader } from "@/components/ui/Loader";
import { useTranslation } from "react-i18next";

import { useProfile } from "@/hooks/useProfile";
import { signOut } from "@/services/supabase/auth";
import { theme } from "@/style/theme";
import { Profile } from "@/types/profile";

type ProfileGateProps = {
  children: (profile: Profile) => React.ReactNode;
};

export function ProfileGate({ children }: ProfileGateProps) {
  const { t } = useTranslation("profile");
  const { data: profile, isLoading, isError, refetch } = useProfile();

  if (isError && !profile) {
    return (
      <View style={styles.container}>
        <ErrorState onRetry={refetch} />
        <View style={styles.escape}>
          <Button label={t("signOut")} onPress={signOut} variant="ghost" />
        </View>
      </View>
    );
  }

  if (isLoading || !profile) {
    return (
      <View style={styles.container}>
        <Loader />
      </View>
    );
  }

  return <>{children(profile)}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.surface.base,
  },
  escape: {
    alignSelf: "stretch",
    paddingHorizontal: theme.screenPadding,
    paddingBottom: theme.spacing.s5,
  },
});

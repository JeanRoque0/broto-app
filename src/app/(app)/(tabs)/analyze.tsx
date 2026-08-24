import { Redirect } from "expo-router";

import { useAnalysisStore } from "@/store";

export default function AnalyzeTab() {
  useAnalysisStore.getState().reset();

  return <Redirect href="/(app)/analyze/camera" />;
}

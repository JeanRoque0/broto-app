import React from "react";

import {
  DiagnoseArt,
  IdentifyArt,
  ReminderArt,
} from "@/components/illustrations/OnboardingArt";

export type Slide = {
  key: "identify" | "diagnose" | "reminder";
  art: React.ReactNode;
};

export const SLIDES: Slide[] = [
  { key: "identify", art: <IdentifyArt /> },
  { key: "diagnose", art: <DiagnoseArt /> },
  { key: "reminder", art: <ReminderArt /> },
];

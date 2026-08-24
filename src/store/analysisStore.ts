import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { MAX_ANALYSIS_PHOTOS } from "@/constants";
import { AnalysisResult } from "@/types/identification";

import storage from "./storage";

interface AnalysisState {
  photos: string[];
  photoPaths: string[];
  result: AnalysisResult | null;
  identificationId: string | null;
  plantId: string | null;
  groupId: string | null;
  wasHelpful: boolean | null;
  fromHistory: boolean;

  addPhoto: (uri: string) => void;
  setPhotoPaths: (paths: string[]) => void;
  removePhoto: (index: number) => void;
  clearPhotos: () => void;
  setResult: (result: AnalysisResult | null) => void;
  setIdentificationId: (id: string | null) => void;
  setPlantId: (plantId: string | null) => void;
  setGroupId: (groupId: string | null) => void;
  setWasHelpful: (wasHelpful: boolean | null) => void;
  setFromHistory: (fromHistory: boolean) => void;
  reset: () => void;
}

const initialState = {
  photos: [],
  photoPaths: [],
  result: null,
  identificationId: null,
  plantId: null,
  groupId: null,
  wasHelpful: null,
  fromHistory: false,
};

export const useAnalysisStore = create<AnalysisState>()(
  persist(
    (set) => ({
      ...initialState,

      addPhoto: (uri) =>
        set((state) =>
          state.photos.length >= MAX_ANALYSIS_PHOTOS
            ? state
            : { photos: [...state.photos, uri] },
        ),
      setPhotoPaths: (photoPaths) => set({ photoPaths }),
      removePhoto: (index) =>
        set((state) => ({
          photos: state.photos.filter((_, item) => item !== index),
        })),
      clearPhotos: () =>
        set({
          photos: [],
          photoPaths: [],
          result: null,
          identificationId: null,
          wasHelpful: null,
        }),
      setResult: (result) => set({ result }),
      setIdentificationId: (identificationId) => set({ identificationId }),
      setPlantId: (plantId) => set({ plantId }),
      setGroupId: (groupId) => set({ groupId }),
      setWasHelpful: (wasHelpful) => set({ wasHelpful }),
      setFromHistory: (fromHistory) => set({ fromHistory }),
      reset: () => set(initialState),
    }),
    {
      name: "analysis-storage",
      storage: createJSONStorage(() => storage),
    },
  ),
);

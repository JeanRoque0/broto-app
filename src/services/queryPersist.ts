import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { PersistQueryClientProviderProps } from "@tanstack/react-query-persist-client";

const KEY = "broto.query.cache";

const NEVER_PERSIST = ["chatMessages", "chatThreads", "announcement"];

export const CACHE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: KEY,
  throttleTime: 2000,
});

export const persistOptions: PersistQueryClientProviderProps["persistOptions"] =
  {
    persister,
    maxAge: CACHE_MAX_AGE,
    dehydrateOptions: {
      shouldDehydrateQuery: (query) => {
        if (query.state.status !== "success") return false;

        const root = query.queryKey[0];
        return typeof root === "string" && !NEVER_PERSIST.includes(root);
      },
    },
  };

export async function clearPersistedCache() {
  await AsyncStorage.removeItem(KEY);
}

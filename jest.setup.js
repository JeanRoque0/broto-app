require("react-native-reanimated").setUpTests?.();

jest.mock("expo-font", () => ({
  useFonts: () => [true, null],
  isLoaded: () => true,
  loadAsync: jest.fn(),
}));

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

import { useOnboardingStore } from "@/store/onboardingStore";

import { TourStep, useTourStore } from "../tourStore";

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

const steps: TourStep[] = [
  { anchor: "a", title: "A", body: "a" },
  { anchor: "b", title: "B", body: "b" },
];

beforeEach(() => {
  useTourStore.setState({ id: null, steps: [], index: 0 });
  useOnboardingStore.setState({ toursSeen: [] });
});

describe("tour", () => {
  it("começa no primeiro passo", () => {
    useTourStore.getState().start("home", steps);

    expect(useTourStore.getState().id).toBe("home");
    expect(useTourStore.getState().index).toBe(0);
  });

  it("não começa sem passos", () => {
    useTourStore.getState().start("home", []);

    expect(useTourStore.getState().id).toBeNull();
  });

  it("não atropela um tour que já está rodando", () => {
    useTourStore.getState().start("home", steps);
    useTourStore.getState().start("plant", steps);

    expect(useTourStore.getState().id).toBe("home");
  });

  it("só marca como visto quando termina", () => {
    useTourStore.getState().start("home", steps);
    useTourStore.getState().next();

    expect(useOnboardingStore.getState().toursSeen).toEqual([]);

    useTourStore.getState().next();

    expect(useTourStore.getState().id).toBeNull();
    expect(useOnboardingStore.getState().toursSeen).toEqual(["home"]);
  });

  it("pular também conta como visto", () => {
    useTourStore.getState().start("home", steps);
    useTourStore.getState().finish();

    expect(useOnboardingStore.getState().toursSeen).toEqual(["home"]);
  });

  it("não repete o mesmo tour na lista de vistos", () => {
    useOnboardingStore.getState().seeTour("home");
    useOnboardingStore.getState().seeTour("home");

    expect(useOnboardingStore.getState().toursSeen).toEqual(["home"]);
  });

  it("rever apaga tudo o que foi visto", () => {
    useOnboardingStore.getState().seeTour("home");
    useOnboardingStore.getState().resetTours();

    expect(useOnboardingStore.getState().toursSeen).toEqual([]);
  });
});

import { Plant } from "@/types/plant";
import { getWateringInfo } from "@/utils/watering";

const HOJE = new Date("2026-09-15T10:00:00");

function plant(overrides: Partial<Plant> = {}): Plant {
  return {
    id: "p1",
    user_id: "user",
    nickname: "Jiboia",
    species_scientific: null,
    species_common: null,
    photo_path: null,
    room: null,
    group_id: null,
    watering_interval_days: 7,
    light: null,
    fertilizer: null,
    light_note: null,
    fertilizer_note: null,
    toxic_to_pets: null,
    mist_days: null,
    rotate_days: null,
    repot_months: null,
    prune_month: null,
    temp_min_c: null,
    temp_max_c: null,
    care_notes: null,
    last_watered_at: null,
    notify_watering: true,
    archived_at: null,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("planta sem rotina", () => {
  it("fica pendente quando não tem intervalo", () => {
    const info = getWateringInfo(plant({ watering_interval_days: null }), HOJE);

    expect(info.status).toBe("pending");
    expect(info.labelKey).toBe("pending");
    expect(info.dueDate).toBeNull();
  });

  it("pede rega hoje quando nunca foi regada", () => {
    const info = getWateringInfo(plant({ last_watered_at: null }), HOJE);

    expect(info.status).toBe("today");
    expect(info.labelKey).toBe("today");
  });
});

describe("contagem a partir da última rega", () => {
  const regadaEm = (day: string) => plant({ last_watered_at: day });

  it("vence hoje quando fecha o intervalo", () => {
    const info = getWateringInfo(regadaEm("2026-09-08T09:00:00"), HOJE);

    expect(info.daysUntil).toBe(0);
    expect(info.labelKey).toBe("today");
  });

  it("conta o atraso em dias inteiros", () => {
    const info = getWateringInfo(regadaEm("2026-09-05T09:00:00"), HOJE);

    expect(info.daysUntil).toBe(-3);
    expect(info.labelKey).toBe("late");
    expect(info.labelParams.count).toBe(3);
  });

  it("atrasada continua no barro, não vira tranquila", () => {
    const info = getWateringInfo(regadaEm("2026-08-01T09:00:00"), HOJE);

    expect(info.status).toBe("today");
  });

  it("amanhã tem texto próprio", () => {
    const info = getWateringInfo(regadaEm("2026-09-09T09:00:00"), HOJE);

    expect(info.daysUntil).toBe(1);
    expect(info.labelKey).toBe("tomorrow");
    expect(info.status).toBe("soon");
  });

  it("até uma semana é logo, depois é longe", () => {
    const emSete = getWateringInfo(
      plant({ last_watered_at: "2026-09-15T09:00:00" }),
      HOJE,
    );
    const emTrinta = getWateringInfo(
      plant({ watering_interval_days: 30, last_watered_at: "2026-09-15T09:00:00" }),
      HOJE,
    );

    expect(emSete.status).toBe("soon");
    expect(emTrinta.status).toBe("far");
  });

  it("ignora a hora do dia, só a data conta", () => {
    const cedo = getWateringInfo(regadaEm("2026-09-08T00:10:00"), HOJE);
    const tarde = getWateringInfo(regadaEm("2026-09-08T23:50:00"), HOJE);

    expect(cedo.daysUntil).toBe(tarde.daysUntil);
  });
});

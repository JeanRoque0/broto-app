import { CareEvent, Plant, PlantTask } from "@/types/plant";
import {
  buildTasks,
  dayRange,
  FREE_TASK_KINDS,
  remindableTasks,
  TASK_KINDS,
  TaskKind,
} from "@/utils/tasks";

const HOJE = new Date("2026-09-15T10:00:00.000Z");

function plant(id: string, nickname = id): Plant {
  return {
    id,
    user_id: "user",
    nickname,
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
  };
}

function task(overrides: Partial<PlantTask> & { plant_id: string }): PlantTask {
  return {
    id: `${overrides.plant_id}-${overrides.kind ?? "water"}`,
    user_id: "user",
    kind: "water",
    interval_days: 7,
    next_at: "2026-09-15",
    remind_at: null,
    enabled: true,
    created_at: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

function event(plant_id: string, kind: CareEvent["kind"], when: string): CareEvent {
  return {
    id: `${plant_id}-${kind}-${when}`,
    plant_id,
    user_id: "user",
    kind,
    note: null,
    happened_at: when,
  };
}

function build(params: {
  plants?: Plant[];
  tasks?: PlantTask[];
  events?: CareEvent[];
  day?: Date;
  kinds?: readonly TaskKind[];
}) {
  return buildTasks({
    plants: params.plants ?? [plant("p1", "Jiboia")],
    tasks: params.tasks ?? [],
    events: params.events ?? [],
    day: params.day ?? HOJE,
    kinds: params.kinds ?? TASK_KINDS,
    now: HOJE,
  });
}

describe("buildTasks", () => {
  it("traz a tarefa que vence no dia pedido", () => {
    const result = build({ tasks: [task({ plant_id: "p1" })] });

    expect(result).toHaveLength(1);
    expect(result[0].kind).toBe("water");
    expect(result[0].done).toBe(false);
    expect(result[0].overdue).toBe(false);
  });

  it("ignora tarefa desligada", () => {
    const result = build({ tasks: [task({ plant_id: "p1", enabled: false })] });

    expect(result).toHaveLength(0);
  });

  it("ignora tarefa de planta que não existe mais", () => {
    const result = build({ tasks: [task({ plant_id: "sumiu" })] });

    expect(result).toHaveLength(0);
  });

  it("ignora tipo fora da lista pedida", () => {
    const result = build({
      tasks: [task({ plant_id: "p1", kind: "fertilize" })],
      kinds: FREE_TASK_KINDS,
    });

    expect(result).toHaveLength(0);
  });

  it("ignora tipo desconhecido vindo do banco", () => {
    const result = build({ tasks: [task({ plant_id: "p1", kind: "dançar" })] });

    expect(result).toHaveLength(0);
  });

  it("marca como feita quando existe evento no mesmo dia", () => {
    const result = build({
      tasks: [task({ plant_id: "p1" })],
      events: [event("p1", "water", "2026-09-15T08:00:00.000Z")],
    });

    expect(result[0].done).toBe(true);
  });

  it("não marca como feita por evento de outro tipo", () => {
    const result = build({
      tasks: [task({ plant_id: "p1" })],
      events: [event("p1", "mist", "2026-09-15T08:00:00.000Z")],
    });

    expect(result[0].done).toBe(false);
  });
});

describe("atraso", () => {
  it("aparece hoje com a contagem de dias", () => {
    const result = build({
      tasks: [task({ plant_id: "p1", next_at: "2026-09-12" })],
    });

    expect(result[0].overdue).toBe(true);
    expect(result[0].lateDays).toBe(3);
  });

  it("não vaza para outro dia da tira", () => {
    const result = build({
      tasks: [task({ plant_id: "p1", next_at: "2026-09-12" })],
      day: new Date("2026-09-16T10:00:00.000Z"),
    });

    expect(result).toHaveLength(0);
  });

  it("tarefa futura não aparece hoje", () => {
    const result = build({
      tasks: [task({ plant_id: "p1", next_at: "2026-09-20" })],
    });

    expect(result).toHaveLength(0);
  });
});

describe("ordem", () => {
  it("põe atrasada antes, feita depois, e ordena por planta e tipo", () => {
    const result = build({
      plants: [plant("p1", "Zamioculca"), plant("p2", "Alocasia")],
      tasks: [
        task({ plant_id: "p1", kind: "water" }),
        task({ plant_id: "p2", kind: "prune" }),
        task({ plant_id: "p2", kind: "water" }),
        task({ plant_id: "p1", kind: "mist", next_at: "2026-09-13" }),
      ],
      events: [event("p2", "water", "2026-09-15T08:00:00.000Z")],
    });

    expect(result.map((item) => `${item.plant.nickname}:${item.kind}`)).toEqual([
      "Zamioculca:mist",
      "Alocasia:prune",
      "Zamioculca:water",
      "Alocasia:water",
    ]);
  });
});

describe("dayRange", () => {
  it("devolve o passado, o dia e o futuro em ordem", () => {
    const days = dayRange(HOJE, 2, 3);

    expect(days).toHaveLength(6);
    expect(days[2].getDate()).toBe(15);
    expect(days[0].getDate()).toBe(13);
    expect(days[5].getDate()).toBe(18);
  });
});

describe("remindableTasks", () => {
  const todas = TASK_KINDS.map((kind) => task({ plant_id: "p1", kind }));

  it("o assinante recebe todos os tipos", () => {
    expect(remindableTasks(todas, true)).toHaveLength(TASK_KINDS.length);
  });

  it("o grátis só recebe rega e reanálise", () => {
    const kinds = remindableTasks(todas, false).map((item) => item.kind);

    expect(kinds).toEqual([...FREE_TASK_KINDS]);
  });

  it("desligada não lembra ninguém", () => {
    const off = todas.map((item) => ({ ...item, enabled: false }));

    expect(remindableTasks(off, true)).toHaveLength(0);
  });
});

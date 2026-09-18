import { CHAT_DAILY_CAP, CHAT_MONTH_CAP, MONTH_CAP } from "@/constants";
import { Profile } from "@/types/profile";
import { getCredits } from "@/utils/credits";

const NOW = new Date("2026-09-15T12:00:00.000Z");

function profile(overrides: Partial<Profile> = {}): Profile {
  return {
    id: "user",
    display_name: null,
    avatar_path: null,
    plan: "free",
    plan_period: null,
    plan_expires_at: null,
    free_used: 0,
    period_start: "2026-09-01",
    welcome_credits: 0,
    trial_ends_at: "2026-09-04T00:00:00.000Z",
    analyses_month: 0,
    analyses_today: 0,
    analyses_day: "2026-09-15",
    chat_month: 0,
    chat_today: 0,
    chat_day: "2026-09-15",
    ad_credits: 0,
    paid_credits: 0,
    ads_today: 0,
    ads_today_date: "2026-09-15",
    accepted_terms_at: null,
    terms_version: null,
    revoked_terms_at: null,
    dismissed_announcement: null,
    accepted_tips: false,
    accepted_tips_at: null,
    timezone: null,
    language: null,
    last_seen_at: null,
    temperature_unit: null,
    reminder_time: null,
    notifications_enabled: true,
    created_at: "2026-09-01T00:00:00.000Z",
    ...overrides,
  };
}

const pro = (extra: Partial<Profile> = {}) =>
  profile({
    plan: "pro",
    plan_expires_at: "2026-10-15T00:00:00.000Z",
    ...extra,
  });

const emTeste = (extra: Partial<Profile> = {}) =>
  profile({ trial_ends_at: "2026-09-17T00:00:00.000Z", ...extra });

describe("teste de três dias", () => {
  it("libera tudo o que o assinante tem", () => {
    const credits = getCredits(emTeste(), NOW);

    expect(credits.inTrial).toBe(true);
    expect(credits.fullAccess).toBe(true);
    expect(credits.hasChat).toBe(true);
    expect(credits.total).toBe(MONTH_CAP);
    expect(credits.chatRemaining).toBe(CHAT_MONTH_CAP);
  });

  it("não se chama de assinatura", () => {
    const credits = getCredits(emTeste(), NOW);

    expect(credits.isPro).toBe(false);
    expect(credits.period).toBeNull();
  });

  it("gasta do mesmo teto do assinante", () => {
    const credits = getCredits(emTeste({ analyses_month: 12 }), NOW);

    expect(credits.monthRemaining).toBe(MONTH_CAP - 12);
  });

  it("expõe quando termina", () => {
    const credits = getCredits(emTeste(), NOW);

    expect(credits.trialEndsAt?.toISOString()).toBe("2026-09-17T00:00:00.000Z");
  });

  it("termina no instante marcado, não no fim do dia", () => {
    const umMinutoDepois = new Date("2026-09-17T00:01:00.000Z");

    expect(getCredits(emTeste(), umMinutoDepois).fullAccess).toBe(false);
  });
});

describe("depois do teste, sem assinatura", () => {
  it("fecha análise e Brotinho", () => {
    const credits = getCredits(profile(), NOW);

    expect(credits.inTrial).toBe(false);
    expect(credits.fullAccess).toBe(false);
    expect(credits.hasChat).toBe(false);
    expect(credits.total).toBe(0);
    expect(credits.chatRemaining).toBe(0);
  });

  it("a avulsa comprada continua valendo", () => {
    expect(getCredits(profile({ paid_credits: 2 }), NOW).total).toBe(2);
  });

  it("não ressuscita crédito antigo de boas-vindas nem de anúncio", () => {
    const antigo = profile({ welcome_credits: 2, ad_credits: 1, free_used: 0 });

    expect(getCredits(antigo, NOW).total).toBe(0);
  });

  it("sem data de teste é tratado como fora do teste", () => {
    expect(getCredits(profile({ trial_ends_at: null }), NOW).fullAccess).toBe(
      false,
    );
  });
});

describe("virada de mês", () => {
  it("zera o gasto do mês do assinante na virada", () => {
    const rolled = pro({ analyses_month: 30, period_start: "2026-08-01" });

    expect(getCredits(rolled, NOW).monthUsed).toBe(0);
    expect(getCredits(rolled, NOW).monthRemaining).toBe(MONTH_CAP);
  });
});

describe("assinante", () => {
  it("desconta o mês do teto e soma as avulsas", () => {
    const credits = getCredits(
      pro({ analyses_month: 10, paid_credits: 3 }),
      NOW,
    );

    expect(credits.monthRemaining).toBe(MONTH_CAP - 10);
    expect(credits.total).toBe(MONTH_CAP - 10 + 3);
  });

  it("nunca fica negativo no teto do mês", () => {
    expect(getCredits(pro({ analyses_month: 99 }), NOW).monthRemaining).toBe(0);
  });

  it("volta a ser grátis quando a assinatura vence", () => {
    const expired = pro({ plan_expires_at: "2026-09-01T00:00:00.000Z" });

    expect(getCredits(expired, NOW).isPro).toBe(false);
    expect(getCredits(expired, NOW).hasChat).toBe(false);
  });

  it("leva o chat junto", () => {
    const credits = getCredits(pro({ chat_month: 20 }), NOW);

    expect(credits.hasChat).toBe(true);
    expect(credits.chatRemaining).toBe(CHAT_MONTH_CAP - 20);
  });
});

describe("o Brotinho vem só no plano completo", () => {
  it("fica fechado para o grátis", () => {
    const credits = getCredits(profile({ chat_month: 0 }), NOW);

    expect(credits.hasChat).toBe(false);
    expect(credits.chatRemainingToday).toBe(0);
  });

  it("conta o teto do dia separado do teto do mês", () => {
    const credits = getCredits(pro({ chat_today: 5, chat_month: 40 }), NOW);

    expect(credits.chatRemainingToday).toBe(CHAT_DAILY_CAP - 5);
    expect(credits.chatRemaining).toBe(CHAT_MONTH_CAP - 40);
  });

  it("fecha junto quando a assinatura vence", () => {
    const vencida = pro({ plan_expires_at: "2026-09-01T00:00:00.000Z" });

    expect(getCredits(vencida, NOW).hasChat).toBe(false);
  });
});

describe("a virada do dia é em UTC, como no servidor", () => {
  it("mantém o gasto de hoje quando ainda é o mesmo dia UTC", () => {
    const noite = new Date("2026-09-15T23:30:00.000Z");
    const credits = getCredits(
      pro({ chat_today: 4, chat_day: "2026-09-15" }),
      noite,
    );

    expect(credits.chatRemainingToday).toBe(CHAT_DAILY_CAP - 4);
  });

  it("zera depois da meia-noite UTC, mesmo ainda sendo ontem no Brasil", () => {
    const virada = new Date("2026-09-16T00:30:00.000Z");
    const credits = getCredits(
      pro({ chat_today: 4, chat_day: "2026-09-15" }),
      virada,
    );

    expect(credits.chatRemainingToday).toBe(CHAT_DAILY_CAP);
  });
});

describe("sem perfil", () => {
  it("não quebra e não inventa crédito", () => {
    const credits = getCredits(null, NOW);

    expect(credits.total).toBe(0);
    expect(credits.isPro).toBe(false);
    expect(credits.renewsAt.getTime()).toBeGreaterThan(NOW.getTime());
  });
});

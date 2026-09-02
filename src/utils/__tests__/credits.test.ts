import {
  CHAT_DAILY_CAP,
  CHAT_MONTH_CAP,
  FREE_QUOTA,
  MONTH_CAP,
} from "@/constants";
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
    analyses_month: 0,
    analyses_today: 0,
    analyses_day: "2026-09-15",
    chat_period: null,
    chat_expires_at: null,
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

describe("plano grátis", () => {
  it("dá a cota do mês para quem nunca usou", () => {
    expect(getCredits(profile(), NOW).total).toBe(FREE_QUOTA);
  });

  it("soma as boas-vindas depois da cota, sem passar do teto do mês", () => {
    const credits = getCredits(
      profile({ free_used: FREE_QUOTA, welcome_credits: 2 }),
      NOW,
    );

    expect(credits.freeRemaining).toBe(0);
    expect(credits.total).toBe(2);
  });

  it("zera quando acabou tudo", () => {
    expect(getCredits(profile({ free_used: FREE_QUOTA }), NOW).total).toBe(0);
  });

  it("não libera o chat", () => {
    const credits = getCredits(profile(), NOW);

    expect(credits.hasChat).toBe(false);
    expect(credits.chatRemaining).toBe(0);
  });
});

describe("virada de mês", () => {
  it("devolve a cota quando o period_start é de um mês anterior", () => {
    const stale = profile({
      free_used: FREE_QUOTA,
      period_start: "2026-08-01",
    });

    expect(getCredits(stale, NOW).total).toBe(FREE_QUOTA);
  });

  it("mantém o consumo dentro do mesmo mês", () => {
    const current = profile({
      free_used: FREE_QUOTA,
      period_start: "2026-09-01",
    });

    expect(getCredits(current, NOW).total).toBe(0);
  });

  it("zera o gasto do mês do assinante na virada", () => {
    const rolled = pro({ analyses_month: 30, period_start: "2026-08-01" });

    expect(getCredits(rolled, NOW).monthUsed).toBe(0);
    expect(getCredits(rolled, NOW).monthRemaining).toBe(MONTH_CAP);
  });
});

describe("assinante", () => {
  it("desconta o mês do teto e soma as avulsas", () => {
    const credits = getCredits(pro({ analyses_month: 10, paid_credits: 3 }), NOW);

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

describe("plano do Brotinho", () => {
  const chat = profile({ chat_expires_at: "2026-10-01T00:00:00.000Z" });

  it("libera as mensagens sem virar assinatura de análise", () => {
    const credits = getCredits(chat, NOW);

    expect(credits.isPro).toBe(false);
    expect(credits.hasChat).toBe(true);
    expect(credits.total).toBe(FREE_QUOTA);
  });

  it("conta o teto do dia separado do teto do mês", () => {
    const credits = getCredits(
      profile({
        chat_expires_at: "2026-10-01T00:00:00.000Z",
        chat_today: 5,
        chat_month: 40,
      }),
      NOW,
    );

    expect(credits.chatRemainingToday).toBe(CHAT_DAILY_CAP - 5);
    expect(credits.chatRemaining).toBe(CHAT_MONTH_CAP - 40);
  });
});

describe("a virada do dia é em UTC, como no servidor", () => {
  const chatPlan = { chat_expires_at: "2026-10-01T00:00:00.000Z" };

  it("mantém o gasto de hoje quando ainda é o mesmo dia UTC", () => {
    const noite = new Date("2026-09-15T23:30:00.000Z");
    const credits = getCredits(
      profile({ ...chatPlan, chat_today: 4, chat_day: "2026-09-15" }),
      noite,
    );

    expect(credits.chatRemainingToday).toBe(CHAT_DAILY_CAP - 4);
  });

  it("zera depois da meia-noite UTC, mesmo ainda sendo ontem no Brasil", () => {
    const virada = new Date("2026-09-16T00:30:00.000Z");
    const credits = getCredits(
      profile({ ...chatPlan, chat_today: 4, chat_day: "2026-09-15" }),
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

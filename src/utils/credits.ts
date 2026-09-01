import {
  CHAT_DAILY_CAP,
  CHAT_MONTH_CAP,
  FREE_QUOTA,
  MONTH_CAP,
} from "@/constants";
import { Credits, Profile } from "@/types/profile";

function utcDay(now: Date) {
  return now.toISOString().slice(0, 10);
}

function isPastMonth(periodStart: string, now: Date) {
  if (!periodStart) return false;
  return periodStart.slice(0, 7) < utcDay(now).slice(0, 7);
}

function isPastDay(day: string | null, now: Date) {
  if (!day) return true;
  return day.slice(0, 10) < utcDay(now);
}

function nextPeriodStart(now: Date) {
  return new Date(now.getFullYear(), now.getMonth() + 1, 1);
}

const EMPTY: Credits = {
  plan: "free",
  isPro: false,
  hasChat: false,
  freeRemaining: 0,
  welcomeCredits: 0,
  adCredits: 0,
  paidCredits: 0,
  monthUsed: 0,
  monthRemaining: 0,
  chatUsed: 0,
  chatRemaining: 0,
  chatRemainingToday: 0,
  total: 0,
  renewsAt: new Date(),
};

export function getCredits(profile: Profile | null, now = new Date()): Credits {
  if (!profile) return { ...EMPTY, renewsAt: nextPeriodStart(now) };

  const isPro =
    profile.plan === "pro" &&
    !!profile.plan_expires_at &&
    new Date(profile.plan_expires_at) > now;

  const hasChat =
    isPro ||
    (!!profile.chat_expires_at && new Date(profile.chat_expires_at) > now);

  const rolled = isPastMonth(profile.period_start, now);

  const freeUsed = rolled ? 0 : profile.free_used;
  const monthUsed = rolled ? 0 : (profile.analyses_month ?? 0);
  const chatUsed = rolled ? 0 : (profile.chat_month ?? 0);
  const chatToday = isPastDay(profile.chat_day, now)
    ? 0
    : (profile.chat_today ?? 0);

  const freeRemaining = Math.max(0, FREE_QUOTA - freeUsed);
  const welcomeCredits = profile.welcome_credits ?? 0;
  const adCredits = profile.ad_credits ?? 0;
  const paidCredits = profile.paid_credits ?? 0;
  const monthRemaining = Math.max(0, MONTH_CAP - monthUsed);

  return {
    plan: profile.plan,
    isPro,
    hasChat,
    freeRemaining,
    welcomeCredits,
    adCredits,
    paidCredits,
    monthUsed,
    monthRemaining,
    chatUsed,
    chatRemaining: hasChat ? Math.max(0, CHAT_MONTH_CAP - chatUsed) : 0,
    chatRemainingToday: hasChat ? Math.max(0, CHAT_DAILY_CAP - chatToday) : 0,
    total: isPro
      ? monthRemaining + paidCredits
      : Math.min(
          monthRemaining,
          freeRemaining + welcomeCredits + adCredits,
        ) + paidCredits,
    renewsAt: nextPeriodStart(now),
  };
}

export type PlanTier = "free" | "pro";

export interface Profile {
  id: string;
  display_name: string | null;
  avatar_path: string | null;
  plan: PlanTier;
  plan_expires_at: string | null;

  free_used: number;
  period_start: string;

  welcome_credits: number;
  analyses_month: number;
  analyses_today: number;
  analyses_day: string;

  chat_expires_at: string | null;
  chat_month: number;
  chat_today: number;
  chat_day: string;

  ad_credits: number;
  paid_credits: number;
  ads_today: number;
  ads_today_date: string;

  accepted_terms_at: string | null;
  terms_version: string | null;
  dismissed_announcement: string | null;
  accepted_tips: boolean;
  accepted_tips_at: string | null;

  timezone: string | null;
  temperature_unit: "celsius" | "fahrenheit" | null;
  reminder_time: string | null;
  notifications_enabled: boolean;

  created_at: string;
}

export interface Credits {
  plan: PlanTier;
  isPro: boolean;
  hasChat: boolean;
  freeRemaining: number;
  welcomeCredits: number;
  adCredits: number;
  paidCredits: number;
  monthUsed: number;
  monthRemaining: number;
  chatUsed: number;
  chatRemaining: number;
  chatRemainingToday: number;
  total: number;
  renewsAt: Date;
}

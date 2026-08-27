import PostHog from "posthog-react-native";

const KEY = process.env.EXPO_PUBLIC_POSTHOG_KEY;
const HOST = process.env.EXPO_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";
const ENVIRONMENT = __DEV__ ? "development" : "production";

const REDACTED = "[removido]";
const MAX_DEPTH = 6;

const SENSITIVE: [RegExp, string][] = [
  [/eyJ[\w-]{8,}\.[\w-]{8,}\.[\w-]+/g, REDACTED],
  [/[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}/g, REDACTED],
  [
    /\b(token|apikey|api_key|access_token|refresh_token|password|senha)=[^&\s"']+/gi,
    `$1=${REDACTED}`,
  ],
];

function scrubText(value: string): string {
  return SENSITIVE.reduce(
    (text, [pattern, replacement]) => text.replace(pattern, replacement),
    value,
  );
}

function scrub(value: unknown, depth = 0): unknown {
  if (typeof value === "string") return scrubText(value);
  if (depth >= MAX_DEPTH) return value;
  if (Array.isArray(value)) return value.map((item) => scrub(item, depth + 1));
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, scrub(item, depth + 1)]),
    );
  }
  return value;
}

export const monitoring = KEY
  ? new PostHog(KEY, {
      host: HOST,
      captureAppLifecycleEvents: false,
      personProfiles: "never",
      errorTracking: {
        autocapture: {
          uncaughtExceptions: true,
          unhandledRejections: true,
          console: false,
        },
      },
      before_send: (event) => {
        if (!event) return event;
        return {
          ...event,
          properties: {
            ...(scrub(event.properties ?? {}) as Record<string, unknown>),
            environment: ENVIRONMENT,
          },
        };
      },
    })
  : null;

type ErrorContext = Record<string, string | number | boolean | null>;

export function captureError(error: unknown, context?: ErrorContext): void {
  monitoring?.captureException(error, context);
}

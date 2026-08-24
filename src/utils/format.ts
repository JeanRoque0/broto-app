import i18n from "@/i18n";

function locale() {
  return i18n.language;
}

export function formatNumber(value: number, fractionDigits = 0) {
  return new Intl.NumberFormat(locale(), {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat(locale(), {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatShortDate(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat(locale(), {
    day: "2-digit",
    month: "short",
  })
    .format(date)
    .replace(".", "");
}

export function formatLongDate(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat(locale(), {
    day: "numeric",
    month: "long",
  }).format(date);
}

export function formatOrdinalDate(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value;

  if (date.getDate() === 1 && i18n.language === "pt-BR") {
    const month = new Intl.DateTimeFormat(locale(), { month: "long" }).format(
      date,
    );
    return `1º de ${month}`;
  }

  return formatLongDate(date);
}

export function formatWeekday(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat(locale(), { weekday: "short" })
    .format(date)
    .replace(".", "")
    .slice(0, 3);
}

export function formatMonthYear(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat(locale(), {
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatMonth(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat(locale(), { month: "short" })
    .format(date)
    .replace(".", "")
    .toUpperCase();
}

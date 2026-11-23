const dayFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

/** "2026-11-20" becomes "20 Nov 2026". */
export function formatDay(date: string): string {
  return dayFormat.format(new Date(`${date}T00:00:00Z`));
}

const countFormat = new Intl.NumberFormat("en-GB");

export function formatCount(count: number): string {
  return countFormat.format(count);
}

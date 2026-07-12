export function todayStr(): string {
  return toDateStr(new Date())
}

export function toDateStr(d: Date): string {
  return d.toISOString().split("T")[0]
}

export function parseDateStr(s: string): Date {
  if (!s) return new Date(NaN)

  if (s.includes("T")) {
    return new Date(s)
  }

  return new Date(`${s}T00:00:00`)
}

export function addDays(s: string, days: number): string {
  const d = parseDateStr(s)
  d.setDate(d.getDate() + days)
  return toDateStr(d)
}

export function daysBetween(a: string, b: string): number {
  return Math.round(
    (parseDateStr(b).getTime() - parseDateStr(a).getTime()) / 86400000
  )
}

export function isSameDay(a: string, b: string): boolean {
  return toDateStr(parseDateStr(a)) === toDateStr(parseDateStr(b))
}

export function formatShort(s: string): string {
  const date = s.split("T")[0]
  const [y, m, d] = date.split("-").map(Number)

  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}

export function formatLong(s: string): string {
  return parseDateStr(s).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function monthLabel(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

export function firstWeekdayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

export function weekKey(dateStr: string): string {
  const d = parseDateStr(dateStr)
  const monday = new Date(d)
  monday.setDate(d.getDate() - ((d.getDay() + 6) % 7))
  return toDateStr(monday)
}

export function monthKey(dateStr: string): string {
  return toDateStr(parseDateStr(dateStr)).slice(0, 7)
}

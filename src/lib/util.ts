export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/** Deterministic PRNG so the demo never re-shuffles between renders. */
export function seeded(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    s >>>= 0;
    return s / 4294967296;
  };
}

export function hashString(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** "4:32" from 272 seconds */
export function mmss(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.round(totalSeconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

/** Demo "now": fixed reference point so screenshots stay stable. */
export const DEMO_NOW = new Date(2026, 8, 25, 9, 42, 0);

export function minutesAgo(min: number) {
  return new Date(DEMO_NOW.getTime() - min * 60_000);
}

export function hhmm(d: Date) {
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function hhmmss(d: Date) {
  return `${hhmm(d)}:${String(d.getSeconds()).padStart(2, "0")}`;
}

export function relTime(d: Date, lang: "tr" | "en", from: Date = DEMO_NOW) {
  const diff = Math.round((from.getTime() - d.getTime()) / 60000);
  if (diff < 1) return lang === "tr" ? "şimdi" : "just now";
  if (diff < 60) return lang === "tr" ? `${diff} dk önce` : `${diff} min ago`;
  const h = Math.floor(diff / 60);
  if (h < 24) return lang === "tr" ? `${h} sa önce` : `${h} h ago`;
  const days = Math.floor(h / 24);
  return lang === "tr" ? `${days} gün önce` : `${days} d ago`;
}

export const severityRank = { critical: 3, high: 2, medium: 1, low: 0 } as const;

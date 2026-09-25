import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type Lang = "tr" | "en";

/** Localized string: every piece of demo content carries both languages inline. */
export type LS = { tr: string; en: string };

export const ls = (tr: string, en: string): LS => ({ tr, en });

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** pick the active language out of an LS (or pass through a plain string) */
  l: (v: LS | string | undefined) => string;
};

const LangCtx = createContext<Ctx>(null as unknown as Ctx);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(
    () => (localStorage.getItem("hv.lang") as Lang) || "tr"
  );

  useEffect(() => {
    localStorage.setItem("hv.lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const l = useCallback(
    (v: LS | string | undefined) => {
      if (v == null) return "";
      if (typeof v === "string") return v;
      return v[lang] ?? v.tr;
    },
    [lang]
  );

  const value = useMemo(() => ({ lang, setLang: setLangState, l }), [lang, l]);
  return <LangCtx.Provider value={value}>{children}</LangCtx.Provider>;
}

export const useLang = () => useContext(LangCtx);

/** Number formatting that follows the active language. */
export function useFmt() {
  const { lang } = useLang();
  const locale = lang === "tr" ? "tr-TR" : "en-US";
  return useMemo(
    () => ({
      n: (v: number, d = 0) =>
        new Intl.NumberFormat(locale, {
          minimumFractionDigits: d,
          maximumFractionDigits: d,
        }).format(v),
      pct: (v: number, d = 0) =>
        lang === "tr"
          ? `%${new Intl.NumberFormat(locale, { maximumFractionDigits: d, minimumFractionDigits: d }).format(v)}`
          : `${new Intl.NumberFormat(locale, { maximumFractionDigits: d, minimumFractionDigits: d }).format(v)}%`,
      locale,
    }),
    [locale, lang]
  );
}

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Mode = "dark" | "light";
type Ctx = { mode: Mode; toggle: () => void };

const ThemeCtx = createContext<Ctx>(null as unknown as Ctx);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>(
    () => (localStorage.getItem("hv.theme") as Mode) || "light"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("light", mode === "light");
    localStorage.setItem("hv.theme", mode);
  }, [mode]);

  const value = useMemo(
    () => ({ mode, toggle: () => setMode((m) => (m === "dark" ? "light" : "dark")) }),
    [mode]
  );
  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export const useTheme = () => useContext(ThemeCtx);

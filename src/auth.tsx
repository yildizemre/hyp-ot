import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ls, type LS } from "./i18n";

/** Route keys used both by the sidebar and by role based access. */
export type NavKey =
  | "overview"
  | "cameras"
  | "events"
  | "screens"
  | "reception"
  | "lobby"
  | "fnb"
  | "wellness"
  | "housekeeping"
  | "boh"
  | "banquet"
  | "parking"
  | "security"
  | "lpr"
  | "rules"
  | "assistant"
  | "ai-reports"
  | "occupancy"
  | "reports"
  | "settings";

export type DemoRole = {
  id: string;
  name: LS;
  scope: LS;
  title: LS;
  email: string;
  initials: string;
  /** "*" means every page */
  allowed: NavKey[] | "*";
};

export const DEMO_ROLES: DemoRole[] = [
  {
    id: "gm",
    name: ls("Selin Aydın", "Selin Aydın"),
    title: ls("Otel Müdürü", "General Manager"),
    scope: ls("Tüm oteller · KPI · güvenlik · raporlar", "All properties · KPI · security · reports"),
    email: "mudur@demootel.com",
    initials: "SA",
    allowed: "*",
  },
  {
    id: "fo",
    name: ls("Burak Demir", "Burak Demir"),
    title: ls("Ön Büro Şefi", "Front Office Manager"),
    scope: ls("Resepsiyon · lobi · kuyruk · LCD ekranlar", "Reception · lobby · queue · LCD screens"),
    email: "onbuiro@demootel.com",
    initials: "BD",
    allowed: [
      "overview",
      "cameras",
      "events",
      "screens",
      "reception",
      "lobby",
      "banquet",
      "occupancy",
      "assistant",
      "reports",
    ],
  },
  {
    id: "sec",
    name: ls("Mert Kaya", "Mert Kaya"),
    title: ls("Güvenlik Şefi", "Security Chief"),
    scope: ls("Güvenlik olayları · otopark · back-of-house", "Security events · parking · back-of-house"),
    email: "guvenlik@demootel.com",
    initials: "MK",
    allowed: [
      "overview",
      "cameras",
      "events",
      "security",
      "lpr",
      "parking",
      "boh",
      "rules",
      "assistant",
      "reports",
    ],
  },
  {
    id: "fnb",
    name: ls("Ayça Toprak", "Ayça Toprak"),
    title: ls("F&B Müdürü", "F&B Manager"),
    scope: ls("Restoran · kahvaltı · buffet kuyruğu", "Restaurant · breakfast · buffet queue"),
    email: "fb@demootel.com",
    initials: "AT",
    allowed: ["overview", "cameras", "events", "fnb", "banquet", "occupancy", "assistant", "reports"],
  },
  {
    id: "hk",
    name: ls("Hakan Çelik", "Hakan Çelik"),
    title: ls("Housekeeping Şefi", "Housekeeping Supervisor"),
    scope: ls("Kat hizmetleri · SOP kontrolü · koridorlar", "Housekeeping · SOP checks · corridors"),
    email: "housekeeping@demootel.com",
    initials: "HÇ",
    allowed: ["overview", "cameras", "events", "housekeeping", "boh", "wellness", "assistant", "reports"],
  },
];

type Ctx = {
  user: DemoRole | null;
  login: (roleId: string) => void;
  logout: () => void;
  can: (k: NavKey) => boolean;
};

const AuthCtx = createContext<Ctx>(null as unknown as Ctx);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [roleId, setRoleId] = useState<string | null>(() => localStorage.getItem("hv.role"));

  useEffect(() => {
    if (roleId) localStorage.setItem("hv.role", roleId);
    else localStorage.removeItem("hv.role");
  }, [roleId]);

  const user = useMemo(() => DEMO_ROLES.find((r) => r.id === roleId) ?? null, [roleId]);

  const value = useMemo<Ctx>(
    () => ({
      user,
      login: setRoleId,
      logout: () => setRoleId(null),
      can: (k) => !user ? false : user.allowed === "*" || user.allowed.includes(k),
    }),
    [user]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);

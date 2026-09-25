import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Bell,
  BedDouble,
  BrainCircuit,
  Building2,
  CalendarRange,
  Car,
  ClipboardList,
  Coffee,
  FileBarChart,
  LayoutDashboard,
  LogOut,
  Maximize,
  Monitor,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  ScanLine,
  Settings,
  ShieldAlert,
  Siren,
  Sparkles,
  Sun,
  Users,
  Video,
  Waves,
  Warehouse,
  type LucideIcon,
} from "lucide-react";
import { useAuth, type NavKey } from "../auth";
import { useTheme } from "../theme";
import { HOTEL } from "../data/hotel";
import { openEvents } from "../data/events";
import { ls, useLang, type LS } from "../i18n";
import { cx, DEMO_NOW, hhmmss } from "../lib/util";
import { Badge, Btn } from "./ui";
import { EventRow, SnapshotModal } from "./events";
import type { VisionEvent } from "../data/events";

type NavItem = { key: NavKey; label: LS; icon: LucideIcon; to: string; badge?: number };
type NavGroup = { title: LS; items: NavItem[] };

const NAV: NavGroup[] = [
  {
    title: ls("İzleme", "Monitoring"),
    items: [
      { key: "overview", label: ls("Genel Bakış", "Overview"), icon: LayoutDashboard, to: "/" },
      { key: "cameras", label: ls("Kameralar", "Cameras"), icon: Video, to: "/cameras" },
      { key: "events", label: ls("Olaylar & Bildirimler", "Events & Alerts"), icon: Siren, to: "/events" },
      { key: "screens", label: ls("LCD Ekranlar", "LCD Screens"), icon: Monitor, to: "/screens" },
    ],
  },
  {
    title: ls("Operasyon", "Operations"),
    items: [
      { key: "reception", label: ls("Resepsiyon & Kuyruk", "Reception & Queue"), icon: Users, to: "/reception" },
      { key: "lobby", label: ls("Lobi & Akış", "Lobby & Flow"), icon: Building2, to: "/lobby" },
      { key: "fnb", label: ls("F&B / Restoran", "F&B / Restaurant"), icon: Coffee, to: "/fnb" },
      { key: "wellness", label: ls("Havuz · Spa · Gym", "Pool · Spa · Gym"), icon: Waves, to: "/wellness" },
      { key: "housekeeping", label: ls("Housekeeping", "Housekeeping"), icon: BedDouble, to: "/housekeeping" },
      { key: "boh", label: ls("Back-of-House", "Back-of-House"), icon: Warehouse, to: "/boh" },
      { key: "banquet", label: ls("Etkinlik & Balo", "Events & Ballroom"), icon: CalendarRange, to: "/banquet" },
      { key: "parking", label: ls("Otopark", "Parking"), icon: Car, to: "/parking" },
    ],
  },
  {
    title: ls("Güvenlik", "Security"),
    items: [
      { key: "security", label: ls("Güvenlik Olayları", "Security Events"), icon: ShieldAlert, to: "/security" },
      { key: "lpr", label: ls("Plaka Tanıma", "Licence Plates"), icon: ScanLine, to: "/lpr" },
      { key: "rules", label: ls("Alarm Kuralları", "Alarm Rules"), icon: ClipboardList, to: "/rules" },
    ],
  },
  {
    title: ls("Yapay Zeka", "Artificial Intelligence"),
    items: [
      { key: "assistant", label: ls("AI Asistan", "AI Assistant"), icon: Sparkles, to: "/assistant" },
      { key: "ai-reports", label: ls("AI Raporları", "AI Reports"), icon: BrainCircuit, to: "/ai-reports" },
    ],
  },
  {
    title: ls("Analitik", "Analytics"),
    items: [
      { key: "occupancy", label: ls("Doluluk & Akış", "Occupancy & Flow"), icon: FileBarChart, to: "/occupancy" },
      { key: "reports", label: ls("Raporlar", "Reports"), icon: FileBarChart, to: "/reports" },
    ],
  },
  {
    title: ls("Sistem", "System"),
    items: [{ key: "settings", label: ls("Ayarlar", "Settings"), icon: Settings, to: "/settings" }],
  },
];

export function Logo({ height = 36 }: { height?: number }) {
  return (
    <span className="logo-wrap">
      <img src="/logo.png" alt="orbisoft" style={{ height }} className="w-auto select-none bg-transparent" />
    </span>
  );
}

/* ------------------------------------------------------------------ */

function Clock() {
  const [now, setNow] = useState(DEMO_NOW);
  useEffect(() => {
    const id = setInterval(() => setNow((d) => new Date(d.getTime() + 1000)), 1000);
    return () => clearInterval(id);
  }, []);
  const { lang } = useLang();
  return (
    <div className="hidden text-right leading-tight sm:block">
      <div className="num text-[13px] font-bold text-ink">{hhmmss(now)}</div>
      <div className="text-[10px] text-mute">
        {now.toLocaleDateString(lang === "tr" ? "tr-TR" : "en-US", {
          day: "numeric",
          month: "short",
          weekday: "short",
        })}
      </div>
    </div>
  );
}

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [sel, setSel] = useState<VisionEvent | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const { lang } = useLang();
  const { can } = useAuth();
  const items = openEvents.filter((e) => can(e.area === "security" ? "security" : "events"));

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cx(
          "relative grid size-8 place-items-center rounded-lg border border-line bg-panel2 text-dim transition hover:text-ink",
          open && "border-accent/50 text-accent"
        )}
      >
        <Bell size={14} />
        {items.length > 0 && (
          <span className="num absolute -right-1 -top-1 grid min-w-4 place-items-center rounded-full bg-danger px-1 text-[9px] font-bold text-white">
            {items.length}
          </span>
        )}
      </button>

      {open && (
        <div className="fade-up absolute right-0 top-10 z-40 w-[min(92vw,420px)] overflow-hidden rounded-xl border border-line bg-panel shadow-2xl">
          <div className="flex items-center justify-between border-b border-line px-3 py-2.5">
            <span className="text-[12.5px] font-semibold text-ink">
              {lang === "tr" ? "Açık bildirimler" : "Open alerts"}
            </span>
            <Badge tone="danger">{items.length}</Badge>
          </div>
          <div className="max-h-[60vh] space-y-2 overflow-y-auto p-2">
            {items.map((ev) => (
              <EventRow key={ev.id} ev={ev} onOpen={setSel} />
            ))}
          </div>
          <NavLink
            to="/events"
            onClick={() => setOpen(false)}
            className="block border-t border-line px-3 py-2.5 text-center text-[11.5px] font-semibold text-accent hover:bg-panel2"
          >
            {lang === "tr" ? "Tüm olayları gör" : "See all events"}
          </NavLink>
        </div>
      )}
      {sel && <SnapshotModal ev={sel} onClose={() => setSel(null)} />}
    </div>
  );
}

/* ------------------------------------------------------------------ */

export function Layout() {
  const { l, lang, setLang } = useLang();
  const { user, logout, can } = useAuth();
  const nav = useNavigate();
  const { mode, toggle: toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return null;

  const sidebar = (
    <aside
      className={cx(
        "flex h-full flex-col border-r border-line bg-bgsoft transition-all",
        collapsed ? "w-[68px]" : "w-[236px]"
      )}
    >
      <div className={cx("flex h-[72px] shrink-0 items-center border-b border-line", collapsed ? "justify-center px-2" : "px-3")}>
        {collapsed ? (
          <img src="/logo.png" alt="orbisoft" className="h-10 w-10 object-cover object-left" />
        ) : (
          <Logo height={42} />
        )}
      </div>

      <nav className="flex-1 space-y-4 overflow-y-auto px-2.5 py-3.5">
        {NAV.map((group) => {
          const items = group.items.filter((i) => can(i.key));
          if (!items.length) return null;
          return (
            <div key={l(group.title)}>
              {!collapsed && (
                <div className="mb-1.5 px-2 text-[10px] font-bold uppercase tracking-wider text-mute">
                  {l(group.title)}
                </div>
              )}
              <div className="space-y-0.5">
                {items.map((item) => (
                  <NavLink
                    key={item.key}
                    to={item.to}
                    end={item.to === "/"}
                    onClick={() => setMobileOpen(false)}
                    title={collapsed ? l(item.label) : undefined}
                    className={({ isActive }) =>
                      cx(
                        "flex items-center gap-2.5 rounded-lg px-2 py-[7px] text-[12.5px] font-medium transition",
                        collapsed && "justify-center px-0",
                        isActive
                          ? "bg-accent/12 text-accent ring-1 ring-accent/25"
                          : "text-dim hover:bg-panel2 hover:text-ink"
                      )
                    }
                  >
                    <item.icon size={15} className="shrink-0" />
                    {!collapsed && <span className="truncate">{l(item.label)}</span>}
                  </NavLink>
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="shrink-0 border-t border-line p-2.5">
        <button
          onClick={() => {
            logout();
            nav("/login");
          }}
          className={cx(
            "flex w-full items-center gap-2.5 rounded-lg border border-line bg-panel2 p-2 text-left transition hover:border-accent/40",
            collapsed && "justify-center"
          )}
        >
          <span className="num grid size-7 shrink-0 place-items-center rounded-md bg-accent/15 text-[11px] font-bold text-accent">
            {user.initials}
          </span>
          {!collapsed && (
            <>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[12px] font-semibold text-ink">{l(user.name)}</span>
                <span className="block truncate text-[10.5px] text-mute">{l(user.title)}</span>
              </span>
              <LogOut size={13} className="shrink-0 text-mute" />
            </>
          )}
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-full overflow-hidden bg-bg">
      <div className="hidden lg:flex">{sidebar}</div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="h-full">{sidebar}</div>
          <button className="flex-1 bg-black/60" onClick={() => setMobileOpen(false)} aria-label="close" />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-1.5 border-b border-line bg-bgsoft px-2 pt-[env(safe-area-inset-top)] sm:gap-2 sm:px-4">
          <button
            onClick={() => {
              if (window.innerWidth < 1024) {
                setCollapsed(false);
                setMobileOpen(true);
              } else setCollapsed((v) => !v);
            }}
            className="grid size-10 place-items-center rounded-lg border border-line bg-panel2 text-dim transition hover:text-ink sm:size-8"
          >
            {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          </button>

          <div className="hidden items-center gap-2 md:flex">
            <Badge tone="ok" className="px-2 py-1">
              {l(HOTEL.shift)}
            </Badge>
            <span className="hidden text-[11.5px] text-mute xl:inline">{l(HOTEL.property)}</span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Clock />
            <div className="hidden sm:flex">
              <Btn icon={Maximize} size="sm">
                {lang === "tr" ? "Tam ekran" : "Fullscreen"}
              </Btn>
            </div>
            <Btn icon={Sparkles} variant="outline" size="sm" onClick={() => nav("/assistant")}>
              <span className="hidden sm:inline">{lang === "tr" ? "AI'a sor" : "Ask AI"}</span>
            </Btn>

            <div className="flex overflow-hidden rounded-lg border border-line">
              {(["tr", "en"] as const).map((code) => (
                <button
                  key={code}
                  onClick={() => setLang(code)}
                  className={cx(
                    "px-2 py-1.5 text-[10.5px] font-bold uppercase transition",
                    lang === code ? "bg-accent text-[#04161a]" : "bg-panel2 text-mute hover:text-ink"
                  )}
                >
                  {code}
                </button>
              ))}
            </div>

            <button
              onClick={toggleTheme}
              className="grid size-8 place-items-center rounded-lg border border-line bg-panel2 text-dim transition hover:text-ink"
            >
              {mode === "light" ? <Moon size={14} /> : <Sun size={14} />}
            </button>

            <NotificationBell />
          </div>
        </header>

        <main className="min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1500px] p-4 sm:p-5">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, LogIn, Moon, ShieldCheck, Sparkles, Sun, Users } from "lucide-react";
import { DEMO_ROLES, useAuth } from "../auth";
import { LOGIN_STILLS } from "../data/photos";
import { useLang } from "../i18n";
import { useTheme } from "../theme";
import { cx } from "../lib/util";
import { Logo } from "../components/Layout";

const FEATURES = [
  {
    icon: Camera,
    tr: ["Mevcut kameralarla AI", "Lobi, resepsiyon, F&B, havuz"],
    en: ["AI on existing cameras", "Lobby, reception, F&B, pool"],
  },
  {
    icon: Users,
    tr: ["Kuyruk ve bekleme", "7 kişi · ek banko önerisi"],
    en: ["Queue and wait time", "7 guests · extra desk prompt"],
  },
  {
    icon: ShieldCheck,
    tr: ["Güvenlik olayları", "Valiz, loitering, düşme"],
    en: ["Security events", "Bag, loitering, fall"],
  },
];

export default function Login() {
  const { lang, setLang } = useLang();
  const { mode, toggle } = useTheme();
  const { login } = useAuth();
  const nav = useNavigate();
  const [roleId, setRoleId] = useState(DEMO_ROLES[0].id);
  const role = DEMO_ROLES.find((r) => r.id === roleId)!;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    login(roleId);
    nav("/");
  };

  return (
    <div className="relative min-h-full overflow-x-hidden bg-bg">
      <img
        src={LOGIN_STILLS[0]}
        alt=""
        className="pointer-events-none absolute inset-0 size-full object-cover opacity-40 lg:hidden"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg/70 via-bg/82 to-bg lg:hidden" />

      <header className="relative z-10 flex items-center justify-between gap-3 px-4 pb-2 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6 lg:px-10 lg:pt-6">
        <Logo height={34} />
        <div className="flex items-center gap-2">
          <div className="flex overflow-hidden rounded-full border border-line/80 bg-panel/80 backdrop-blur-md">
            {(["tr", "en"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setLang(c)}
                className={cx(
                  "px-3 py-2 text-[11px] font-bold uppercase transition",
                  lang === c ? "bg-accent text-[#04161a]" : "text-mute"
                )}
              >
                {c}
              </button>
            ))}
          </div>
          <button
            onClick={toggle}
            className="grid size-10 place-items-center rounded-full border border-line/80 bg-panel/80 text-dim backdrop-blur-md"
            aria-label="theme"
          >
            {mode === "light" ? <Moon size={15} /> : <Sun size={15} />}
          </button>
        </div>
      </header>

      <div className="relative z-10 mx-auto grid w-full max-w-[1200px] items-center gap-6 px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-2 sm:px-6 lg:grid-cols-[1.05fr_420px] lg:gap-12 lg:px-10 lg:pb-12 lg:pt-6">
        <div className="order-2 hidden lg:order-1 lg:block">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-accent">
            orbisoft · image intelligence
          </p>
          <h1 className="max-w-[560px] text-[34px] font-bold leading-[1.12] tracking-tight text-ink xl:text-[42px]">
            {lang === "tr" ? (
              <>
                Kameralar izlesin,
                <br />
                AI ölçsün.
              </>
            ) : (
              <>
                Cameras watch.
                <br />
                AI measures.
              </>
            )}
          </h1>
          <p className="mt-4 max-w-[480px] text-[14px] leading-relaxed text-mute">
            {lang === "tr"
              ? "Resepsiyon kuyruğu, lobi akışı, F&B doluluk, havuz kapasitesi ve güvenlik olayları tek panelde."
              : "Reception queues, lobby flow, F&B occupancy, pool capacity and security events in one panel."}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-2">
            {LOGIN_STILLS.map((src, i) => (
              <div key={src} className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10">
                <img src={src} alt="" className="size-full object-cover" />
                <span className="absolute left-2 top-2 flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-bold text-white">
                  <span className="rec-dot size-1.5 rounded-full bg-danger" />
                  LIVE
                </span>
                <span className="absolute bottom-2 left-2 num rounded bg-black/55 px-1.5 py-0.5 text-[9px] text-white/80">
                  CAM-0{i + 1}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-6">
            {[
              { v: "-38%", t: lang === "tr" ? "check-in bekleme" : "check-in wait" },
              { v: "%99,1", t: lang === "tr" ? "sayım doğruluğu" : "counting accuracy" },
              { v: "18", t: lang === "tr" ? "canlı CCTV sahnesi" : "live CCTV scenes" },
            ].map((s) => (
              <div key={s.t}>
                <div className="num text-[22px] font-bold text-accent">{s.v}</div>
                <div className="text-[11px] text-mute">{s.t}</div>
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={submit}
          className="order-1 w-full rounded-3xl border border-white/10 bg-panel/90 p-4 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.65)] backdrop-blur-xl sm:p-6 lg:order-2"
        >
          <div className="mb-4 flex items-end justify-between gap-3 lg:hidden">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-accent">orbisoft</p>
              <h1 className="mt-1 text-[22px] font-bold leading-tight text-ink">
                {lang === "tr" ? "Panele giriş" : "Sign in"}
              </h1>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-black/45 px-2 py-1 text-[9px] font-bold text-white">
              <span className="rec-dot size-1.5 rounded-full bg-danger" />
              LIVE
            </span>
          </div>

          <div className="hidden lg:block">
            <Logo height={36} />
            <h2 className="mt-4 text-[20px] font-bold tracking-tight text-ink">
              {lang === "tr" ? "Panele giriş" : "Sign in"}
            </h2>
          </div>

          <p className="mt-1 text-[12px] text-mute">
            {lang === "tr" ? "Rolünü seç, ekranlar otomatik düzenlenir." : "Pick a role — screens adapt automatically."}
          </p>

          <div className="mt-4 grid grid-cols-1 gap-2">
            {DEMO_ROLES.map((r) => {
              const active = r.id === roleId;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRoleId(r.id)}
                  className={cx(
                    "flex min-h-12 w-full items-center gap-3 rounded-2xl border px-3 py-2.5 text-left transition",
                    active
                      ? "border-accent/60 bg-accent/12 ring-1 ring-accent/30"
                      : "border-line bg-panel2/80 hover:border-accent/30"
                  )}
                >
                  <span
                    className={cx(
                      "num grid size-10 shrink-0 place-items-center rounded-xl text-[12px] font-bold",
                      active ? "bg-accent text-[#04161a]" : "bg-panel3 text-mute"
                    )}
                  >
                    {r.initials}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={cx("block truncate text-[13.5px] font-semibold", active ? "text-accent" : "text-ink")}>
                      {r.title[lang]}
                    </span>
                    <span className="block truncate text-[11px] text-mute">{r.scope[lang]}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <label className="mt-4 block">
            <span className="text-[10.5px] font-bold uppercase tracking-wide text-mute">
              {lang === "tr" ? "E-posta" : "Email"}
            </span>
            <input
              readOnly
              value={role.email}
              className="num mt-1.5 h-12 w-full rounded-2xl border border-line bg-panel2 px-3.5 text-[14px] text-ink outline-none"
            />
          </label>

          <label className="mt-3 block">
            <span className="text-[10.5px] font-bold uppercase tracking-wide text-mute">
              {lang === "tr" ? "Şifre" : "Password"}
            </span>
            <input
              type="password"
              defaultValue="demo"
              className="mt-1.5 h-12 w-full rounded-2xl border border-line bg-panel2 px-3.5 text-[14px] tracking-widest text-ink outline-none focus:border-accent/50"
            />
          </label>

          <button
            type="submit"
            className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-accent text-[15px] font-bold text-[#04161a] transition active:scale-[0.99] hover:brightness-110"
          >
            <LogIn size={17} />
            {lang === "tr" ? "Giriş yap" : "Sign in"}
          </button>

          <div className="mt-4 grid grid-cols-3 gap-2 lg:hidden">
            {FEATURES.map((f) => (
              <div key={f.tr[0]} className="rounded-2xl border border-line/70 bg-panel2/70 px-2 py-2.5 text-center">
                <f.icon size={14} className="mx-auto text-accent" />
                <div className="mt-1 text-[10px] font-semibold leading-tight text-ink">{lang === "tr" ? f.tr[0] : f.en[0]}</div>
              </div>
            ))}
          </div>

          <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[11px] text-mute">
            <Sparkles size={11} className="text-accent" />
            {lang === "tr" ? "Demo · şifre: demo" : "Demo · password: demo"}
          </p>
        </form>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Camera, LogIn, ShieldCheck, Sparkles, Users } from "lucide-react";
import { DEMO_ROLES, useAuth } from "../auth";
import { LOGIN_STILLS } from "../data/photos";
import { useLang } from "../i18n";
import { cx } from "../lib/util";
import { Logo } from "../components/Layout";

const FEATURES = [
  {
    icon: Camera,
    tr: ["Mevcut kameralarla AI", "Lobi, resepsiyon, F&B ve havuz"],
    en: ["AI on existing cameras", "Lobby, reception, F&B and pool"],
  },
  {
    icon: Users,
    tr: ["Kuyruk ve bekleme", "3+ kişide ek banko önerisi"],
    en: ["Queue and wait time", "Extra desk when 3+ wait"],
  },
  {
    icon: ShieldCheck,
    tr: ["Güvenlik olayları", "Valiz, loitering, düşme, giriş"],
    en: ["Security events", "Bag, loitering, fall, access"],
  },
];

export default function Login() {
  const { lang, setLang } = useLang();
  const { login } = useAuth();
  const nav = useNavigate();
  const [roleId, setRoleId] = useState(DEMO_ROLES[0].id);
  const role = DEMO_ROLES.find((r) => r.id === roleId)!;

  useEffect(() => {
    document.documentElement.classList.add("light");
    localStorage.setItem("hype.theme", "light");
    localStorage.removeItem("orb.theme");
    localStorage.removeItem("hv.theme");
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    login(roleId);
    nav("/");
  };

  return (
    <div className="relative min-h-full overflow-x-hidden bg-[#f4f6f8] text-[#0d1a26]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_at_top,_rgba(10,160,90,0.10),_transparent_58%)]" />

      <header className="relative z-10 flex items-center justify-between gap-3 px-4 pb-1 pt-[max(1rem,env(safe-area-inset-top))] sm:px-8 lg:px-12">
        <Logo height={52} />
        <div className="flex overflow-hidden rounded-full border border-[#dbe3ea] bg-white shadow-sm">
          {(["tr", "en"] as const).map((c) => (
            <button
              key={c}
              onClick={() => setLang(c)}
              className={cx(
                "px-3.5 py-2 text-[11px] font-bold uppercase transition",
                lang === c ? "bg-[#0a9a58] text-white" : "text-[#7c8b9a] hover:text-[#0d1a26]"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </header>

      <div className="relative z-10 mx-auto grid w-full max-w-[1180px] items-center gap-8 px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4 sm:px-8 lg:grid-cols-[1.1fr_440px] lg:gap-16 lg:px-12 lg:pb-16 lg:pt-8">
        <div className="order-2 hidden lg:order-1 lg:block">
          <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.18em] text-[#0a9a58]">
            image intelligence
          </p>
          <h1 className="max-w-[540px] text-[40px] font-bold leading-[1.1] tracking-tight xl:text-[46px]">
            {lang === "tr" ? (
              <>
                Otelinizi kameralar
                <br />
                izlesin, AI ölçsün.
              </>
            ) : (
              <>
                Let cameras watch
                <br />
                the hotel. AI measures.
              </>
            )}
          </h1>
          <p className="mt-4 max-w-[480px] text-[15px] leading-relaxed text-[#5b6b7a]">
            {lang === "tr"
              ? "Resepsiyon kuyruğu, lobi akışı, F&B doluluk, havuz kapasitesi ve güvenlik olayları tek beyaz panelde."
              : "Reception queues, lobby flow, F&B occupancy, pool capacity and security events in one light panel."}
          </p>

          <div className="mt-7 grid grid-cols-2 gap-3">
            {LOGIN_STILLS.map((src, i) => (
              <div
                key={src}
                className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-[#e4ebf0] bg-white shadow-[0_10px_30px_-18px_rgba(15,30,45,0.35)]"
              >
                <img src={src} alt="" className="size-full object-cover" />
                <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-bold text-[#c0392b] shadow-sm">
                  <span className="rec-dot size-1.5 rounded-full bg-[#e74c3c]" />
                  LIVE
                </span>
                <span className="absolute bottom-2 left-2 num rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-semibold text-[#4a5b6d]">
                  CAM-0{i + 1}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-8">
            {[
              { v: "−38%", t: lang === "tr" ? "check-in bekleme" : "check-in wait" },
              { v: "%99,1", t: lang === "tr" ? "sayım doğruluğu" : "counting accuracy" },
              { v: "18", t: lang === "tr" ? "canlı CCTV sahnesi" : "live CCTV scenes" },
            ].map((s) => (
              <div key={s.t}>
                <div className="num text-[26px] font-bold text-[#0a9a58]">{s.v}</div>
                <div className="mt-0.5 text-[12px] text-[#7c8b9a]">{s.t}</div>
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={submit}
          className="order-1 w-full rounded-[28px] border border-[#e6edf2] bg-white p-5 shadow-[0_28px_80px_-32px_rgba(15,30,45,0.28)] sm:p-7 lg:order-2"
        >
          <div className="mb-5 flex flex-col items-start gap-4">
            <Logo height={58} />
            <div>
              <h2 className="text-[24px] font-bold tracking-tight">
                {lang === "tr" ? "Panele giriş" : "Sign in"}
              </h2>
              <p className="mt-1 text-[13px] text-[#7c8b9a]">
                {lang === "tr"
                  ? "Rolünü seç, ekranlar otomatik düzenlenir."
                  : "Pick a role — screens adapt automatically."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {DEMO_ROLES.map((r) => {
              const active = r.id === roleId;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRoleId(r.id)}
                  className={cx(
                    "flex min-h-[56px] w-full items-center gap-3 rounded-2xl border px-3 py-2.5 text-left transition",
                    active
                      ? "border-[#0a9a58] bg-[#0a9a58]/8 ring-1 ring-[#0a9a58]/25"
                      : "border-[#e6edf2] bg-[#f7f9fb] hover:border-[#0a9a58]/40"
                  )}
                >
                  <span
                    className={cx(
                      "num grid size-11 shrink-0 place-items-center rounded-xl text-[12px] font-bold",
                      active ? "bg-[#0a9a58] text-white" : "bg-white text-[#7c8b9a] ring-1 ring-[#e6edf2]"
                    )}
                  >
                    {r.initials}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={cx("block truncate text-[14px] font-semibold", active ? "text-[#0a7d48]" : "text-[#0d1a26]")}>
                      {r.title[lang]}
                    </span>
                    <span className="block truncate text-[11.5px] text-[#7c8b9a]">{r.scope[lang]}</span>
                  </span>
                  {active && <ArrowRight size={16} className="shrink-0 text-[#0a9a58]" />}
                </button>
              );
            })}
          </div>

          <label className="mt-5 block">
            <span className="text-[11px] font-bold uppercase tracking-wide text-[#7c8b9a]">
              {lang === "tr" ? "E-posta" : "Email"}
            </span>
            <input
              readOnly
              value={role.email}
              className="num mt-1.5 h-12 w-full rounded-2xl border border-[#e6edf2] bg-[#f7f9fb] px-3.5 text-[14px] outline-none"
            />
          </label>

          <label className="mt-3 block">
            <span className="text-[11px] font-bold uppercase tracking-wide text-[#7c8b9a]">
              {lang === "tr" ? "Şifre" : "Password"}
            </span>
            <input
              type="password"
              defaultValue="demo"
              className="mt-1.5 h-12 w-full rounded-2xl border border-[#e6edf2] bg-[#f7f9fb] px-3.5 text-[14px] tracking-widest outline-none focus:border-[#0a9a58]"
            />
          </label>

          <button
            type="submit"
            className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#0a9a58] text-[15px] font-bold text-white transition active:scale-[0.99] hover:bg-[#088a4e]"
          >
            <LogIn size={17} />
            {lang === "tr" ? "Giriş yap" : "Sign in"}
          </button>

          <div className="mt-5 grid grid-cols-3 gap-2 lg:hidden">
            {FEATURES.map((f) => (
              <div key={f.tr[0]} className="rounded-2xl border border-[#e6edf2] bg-[#f7f9fb] px-2 py-3 text-center">
                <f.icon size={15} className="mx-auto text-[#0a9a58]" />
                <div className="mt-1.5 text-[10px] font-semibold leading-tight text-[#0d1a26]">
                  {lang === "tr" ? f.tr[0] : f.en[0]}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11.5px] text-[#7c8b9a]">
            <Sparkles size={12} className="text-[#0a9a58]" />
            {lang === "tr" ? "Demo ortamı · şifre: demo" : "Demo environment · password: demo"}
          </p>
        </form>
      </div>
    </div>
  );
}

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import { useLang } from "../i18n";
import { Logo } from "../components/Layout";

export default function NotFound() {
  const nav = useNavigate();
  const { user } = useAuth();
  const { lang } = useLang();
  const home = user ? "/" : "/login";

  useEffect(() => {
    const t = setTimeout(() => nav(home, { replace: true }), 1600);
    return () => clearTimeout(t);
  }, [nav, home]);

  return (
    <div className="grid min-h-full place-items-center bg-[#f4f6f8] px-5">
      <div className="w-full max-w-md rounded-[28px] border border-[#e6edf2] bg-white p-8 text-center shadow-[0_28px_80px_-32px_rgba(15,30,45,0.28)]">
        <Logo height={44} />
        <h1 className="mt-5 text-[22px] font-bold text-[#0d1a26]">
          {lang === "tr" ? "Sayfa bulunamadı" : "Page not found"}
        </h1>
        <p className="mt-2 text-[13.5px] leading-relaxed text-[#7c8b9a]">
          {lang === "tr"
            ? "Bu adres yok. Sizi ana sayfaya alıyoruz."
            : "This address doesn’t exist. Taking you back home."}
        </p>
        <button
          onClick={() => nav(home, { replace: true })}
          className="mt-5 inline-flex h-11 items-center justify-center rounded-2xl bg-[#0a9a58] px-5 text-[13.5px] font-bold text-white"
        >
          {lang === "tr" ? "Ana sayfaya dön" : "Back to home"}
        </button>
      </div>
    </div>
  );
}

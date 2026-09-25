import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLang, type LS } from "../i18n";
import { Badge, Btn, RichText } from "./ui";

export function AiSummary({
  text,
  title,
  actions = true,
}: {
  text: LS;
  title?: LS;
  actions?: boolean;
}) {
  const { l, lang } = useLang();
  const nav = useNavigate();
  return (
    <div className="relative overflow-hidden rounded-2xl border border-accent/25 bg-panel p-4">
      <div
        className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--c-accent), transparent 70%)" }}
      />
      <div className="relative flex flex-col gap-3 sm:flex-row sm:items-start">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent ring-1 ring-accent/30">
          <Sparkles size={17} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <span className="text-[12.5px] font-bold text-ink">
              {title ? l(title) : lang === "tr" ? "AI günlük özet" : "AI daily brief"}
            </span>
            <Badge tone="accent" icon={Sparkles}>
              {lang === "tr" ? "AI ile üretildi" : "AI generated"}
            </Badge>
          </div>
          <RichText value={text} className="text-[12.5px] leading-relaxed text-dim" />
        </div>
        {actions && (
          <div className="flex shrink-0 gap-2 sm:flex-col">
            <Btn icon={ArrowRight} onClick={() => nav("/ai-reports")}>
              {lang === "tr" ? "Tam rapor" : "Full report"}
            </Btn>
            <Btn variant="outline" icon={Sparkles} onClick={() => nav("/assistant")}>
              {lang === "tr" ? "Soru sor" : "Ask"}
            </Btn>
          </div>
        )}
      </div>
    </div>
  );
}

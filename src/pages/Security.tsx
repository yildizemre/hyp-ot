import { useMemo, useState } from "react";
import { Activity, Briefcase, EyeOff, Flame, PersonStanding, ShieldAlert, Swords, Timer } from "lucide-react";
import { AiSummary } from "../components/AiSummary";
import { C, Chart, Legend, RankBars } from "../components/charts";
import { EventList } from "../components/events";
import { Badge, Btn, Card, CardHead, Kpi, PageHead } from "../components/ui";
import { EVENTS, SEVERITY_META, type Severity } from "../data/events";
import { eventsByType, eventsTrend, responseTimes } from "../data/series";
import { ls, useLang } from "../i18n";
import { mmss, severityRank } from "../lib/util";

const SECURITY_TYPES = [
  "unauthorized",
  "abandoned",
  "aggression",
  "fall",
  "smoke",
  "loitering",
  "after_hours",
  "tailgating",
  "camera_health",
] as const;

const trendSeries = [
  { key: "security", name: ls("Güvenlik olayı", "Security events"), color: C.danger, type: "area" as const },
];

export default function Security() {
  const { l, lang } = useLang();
  const [sev, setSev] = useState<Severity | "all">("all");

  const list = useMemo(() => {
    const base = EVENTS.filter((e) => (SECURITY_TYPES as readonly string[]).includes(e.type));
    const filtered = sev === "all" ? base : base.filter((e) => e.severity === sev);
    return [...filtered].sort((a, b) => severityRank[b.severity] - severityRank[a.severity] || +b.at - +a.at);
  }, [sev]);

  return (
    <>
      <PageHead
        title={ls("Güvenlik Olayları", "Security Events")}
        sub={ls(
          "Yetkisiz giriş · loitering · terk edilmiş nesne · agresif davranış · düşme · duman",
          "Unauthorized access · loitering · abandoned object · aggression · fall · smoke"
        )}
        right={
          <div className="flex flex-wrap gap-1.5">
            <Btn size="sm" active={sev === "all"} onClick={() => setSev("all")}>
              {lang === "tr" ? "Tümü" : "All"}
            </Btn>
            {(["critical", "high", "medium", "low"] as Severity[]).map((s) => (
              <Btn key={s} size="sm" active={sev === s} onClick={() => setSev(s)}>
                {l(SEVERITY_META[s].label)}
              </Btn>
            ))}
          </div>
        }
      />

      <AiSummary
        actions={false}
        title={ls("Güvenlik yorumu", "Security insight")}
        text={ls(
          "Son 24 saatte **7 güvenlik olayı** kaydedildi, **2'si kritik**. Kritik olaylar: lobide **6 dakikadır sahipsiz valiz** (güvenlik yönlendirildi) ve **personel alanına yetkisiz giriş** — turnike kaydı olmayan kişi BOH koridoruna girdi. Ortalama güvenlik yanıt süresi **1:24 dk** (hedef 2:00) — hedefin içinde. Tekrar eden risk: **yükleme rampası** 24 saatte 6 olayla en riskli bölge; araç ve personel akışı ayrılmalı.",
          "**7 security events** were recorded in the last 24 hours, **2 critical**. Critical: an **unattended suitcase in the lobby for 6 minutes** (security dispatched) and **unauthorized entry into a staff area** — a person with no turnstile record entered the BOH corridor. Average security response is **1:24** (target 2:00) — within target. Recurring risk: the **loading dock** is the highest-risk zone with 6 events in 24 hours; vehicle and staff flows should be separated."
        )}
      />

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Kpi label={ls("Açık güvenlik olayı", "Open security events")} value="4" icon={ShieldAlert} tone="danger" delta={lang === "tr" ? "2 kritik" : "2 critical"} sub={ls("24 saat", "24 hours")} />
        <Kpi label={ls("Yetkisiz giriş", "Unauthorized access")} value="9" icon={ShieldAlert} tone="danger" delta="+3" deltaGood={false} sub={ls("7 gün", "7 days")} />
        <Kpi label={ls("Terk edilmiş nesne", "Abandoned objects")} value="6" icon={Briefcase} tone="warn" sub={ls("lobi + concierge", "lobby + concierge")} />
        <Kpi label={ls("Loitering", "Loitering")} value="12" icon={EyeOff} tone="warn" delta="-2" deltaGood sub={ls("kat koridorları", "guest corridors")} />
        <Kpi label={ls("Düşme / man-down", "Fall / man-down")} value="2" icon={PersonStanding} tone="danger" sub={ls("kapalı havuz · gym", "indoor pool · gym")} />
        <Kpi label={ls("Ort. yanıt süresi", "Avg. response time")} value={mmss(84)} icon={Timer} tone="ok" delta={lang === "tr" ? "hedef 2:00" : "target 2:00"} deltaGood />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.25fr_1fr]">
        <Card>
          <CardHead
            title={ls("Olay listesi", "Event list")}
            sub={ls("Önceliğe göre sıralı · snapshot için tıklayın", "Sorted by severity · click for the snapshot")}
            icon={ShieldAlert}
            tone="danger"
            right={<Badge tone="mute">{list.length}</Badge>}
          />
          <EventList events={list} />
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHead
              title={ls("Olay tipine göre dağılım", "Distribution by event type")}
              sub={ls("Son 7 gün · tüm bölgeler", "Last 7 days · all areas")}
              icon={Activity}
              tone="violet"
            />
            <RankBars
              items={eventsByType.map((t) => ({
                label: t.label,
                value: t.count,
                tone: t.key === "unauthorized" || t.key === "safety" || t.key === "abandoned" ? "danger" : t.key === "loitering" || t.key === "parking" ? "warn" : "accent",
              }))}
            />
          </Card>

          <Card>
            <CardHead
              title={ls("Güvenlik olay trendi", "Security event trend")}
              sub={ls("Günlük olay sayısı", "Daily event count")}
              icon={Activity}
              tone="danger"
              right={<Legend series={trendSeries} />}
            />
            <Chart data={eventsTrend.map((d) => ({ ...d, t: lang === "tr" ? d.t : d.en }))} series={trendSeries} height={160} />
          </Card>

          <Card>
            <CardHead
              title={ls("Ekip yanıt süreleri", "Team response times")}
              sub={ls("Bildirimden ilk aksiyona", "From alert to first action")}
              icon={Timer}
            />
            <RankBars
              items={responseTimes.map((r) => ({
                label: r.team,
                value: r.avgSec,
                tone: r.avgSec <= r.target ? "ok" : "warn",
              }))}
              formatter={(v) => mmss(v)}
            />
          </Card>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Briefcase, tone: "danger" as const, title: ls("Terk edilmiş nesne", "Abandoned object"), rule: ls("3 m yarıçapta sahibi 90 sn görünmezse alarm", "Alarm if no owner within 3 m for 90 s") },
          { icon: Swords, tone: "danger" as const, title: ls("Agresif davranış", "Aggressive behaviour"), rule: ls("Hızlı el hareketi + yakın temas paterni", "Rapid arm motion + close contact pattern") },
          { icon: PersonStanding, tone: "danger" as const, title: ls("Düşme / man-down", "Fall / man-down"), rule: ls("Yatay poz 8 saniyeden uzun sürerse", "Horizontal pose longer than 8 seconds") },
          { icon: Flame, tone: "warn" as const, title: ls("Duman / yangın", "Smoke / fire"), rule: ls("Duman paterni 10 sn + sıcaklık artışı", "Smoke pattern 10 s + temperature rise") },
        ].map((m, i) => (
          <Card key={i}>
            <CardHead title={m.title} sub={m.rule} icon={m.icon} tone={m.tone} />
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] text-mute">{lang === "tr" ? "Model aktif" : "Model active"}</span>
              <Badge tone="ok">{lang === "tr" ? "çalışıyor" : "running"}</Badge>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

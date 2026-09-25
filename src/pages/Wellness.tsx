import { AlertTriangle, Dumbbell, Flower2, TrendingUp, Users, Waves } from "lucide-react";
import { AiSummary } from "../components/AiSummary";
import { CameraFrame } from "../components/CameraFrame";
import { C, Chart, Donut, Legend } from "../components/charts";
import { EventList } from "../components/events";
import { Badge, Bar, Card, CardHead, Insight, Kpi, PageHead } from "../components/ui";
import { cameraById } from "../data/hotel";
import { EVENTS, eventsOf } from "../data/events";
import { wellnessHourly, wellnessVenues } from "../data/series";
import { ls, useFmt, useLang } from "../i18n";
import { DEMO_NOW, hhmm, hhmmss } from "../lib/util";

const usageSeries = [
  { key: "pool", name: ls("Havuz", "Pool"), color: C.accent, type: "area" as const },
  { key: "spa", name: ls("Spa", "Spa"), color: C.violet, type: "area" as const },
  { key: "gym", name: ls("Fitness", "Fitness"), color: C.ok, type: "area" as const },
];

export default function Wellness() {
  const { l, lang } = useLang();
  const { pct } = useFmt();
  const poolEvent = EVENTS.find((e) => e.id === "EV-2416")!;

  return (
    <>
      <PageHead
        title={ls("Havuz · Spa · Gym Doluluk", "Pool · Spa · Gym Occupancy")}
        sub={ls(
          "4 kamera · doluluk, kapasite aşımı alarmı, gün/saat bazında kullanım analizi",
          "4 cameras · occupancy, capacity breach alarms, usage analysis by day and hour"
        )}
        right={<Badge tone="warn" icon={AlertTriangle}>{lang === "tr" ? "Havuz %78 — eşiğe 18 dk" : "Pool 78% — 18 min to threshold"}</Badge>}
      />

      <AiSummary
        actions={false}
        title={ls("Wellness yorumu", "Wellness insight")}
        text={ls(
          "Açık havuz **94/120 kişi (%78)** ile günün en yüksek değerinde; son 30 dakikada **+22 kişi** girdi ve mevcut hızda **%85 alarm eşiğine 18 dakika** kaldı. Fitness salonu **%68** ile sabah zirvesini geçti. Spa **%30** kapasitede — 16:00–18:00 aralığı için **3 boş slot** var, lobi LCD'sinde promosyon gösterilebilir. Kapalı havuzda **düşme olayı** 24 dakika önce kapatıldı; cankurtaran müdahalesi **9 saniye** içinde gerçekleşti.",
          "The outdoor pool is at its daily high with **94/120 people (78%)**; **+22 guests** entered in the last 30 minutes and at this rate the **85% alarm threshold is 18 minutes away**. Fitness is at **68%**, past its morning peak. The spa sits at **30%** — there are **3 open slots** for 16:00–18:00 that could be promoted on the lobby LCD. A **fall event** at the indoor pool was closed 24 minutes ago; lifeguard response took **9 seconds**."
        )}
      />

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {wellnessVenues.map((v) => {
          const p = (v.current / v.capacity) * 100;
          const cam = cameraById(v.cameraId);
          return (
            <Card key={v.cameraId}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="truncate text-[13px] font-semibold text-ink">{l(v.name)}</h3>
                  <p className="num mt-0.5 text-[10.5px] text-mute">
                    {v.cameraId} · {lang === "tr" ? "zirve" : "peak"} {l(v.peak)}
                  </p>
                </div>
                <Badge tone={p >= v.threshold ? "danger" : p >= v.threshold - 12 ? "warn" : "ok"}>
                  {p >= v.threshold ? (lang === "tr" ? "aşım" : "breach") : lang === "tr" ? "normal" : "normal"}
                </Badge>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <Donut
                  value={v.current}
                  max={v.capacity}
                  size={92}
                  thickness={10}
                  center={
                    <div>
                      <div className="num text-[15px] font-bold text-ink">{pct(p)}</div>
                      <div className="num text-[9px] text-mute">
                        {v.current}/{v.capacity}
                      </div>
                    </div>
                  }
                />
                <div className="min-w-0 flex-1 space-y-2">
                  <div>
                    <div className="mb-1 flex justify-between text-[10.5px] text-mute">
                      <span>{lang === "tr" ? "Alarm eşiği" : "Alarm threshold"}</span>
                      <span className="num font-semibold text-dim">{pct(v.threshold)}</span>
                    </div>
                    <Bar value={v.current} max={v.capacity} threshold={v.threshold} />
                  </div>
                  <CameraFrame
                    kind={cam?.kind ?? "pool"}
                    seed={v.cameraId}
                    cameraId={v.cameraId}
                    time={hhmm(DEMO_NOW)}
                    status={cam?.status}
                    compact
                    showLabels={false}
                    boxes={EVENTS.find((e) => e.cameraId === v.cameraId)?.boxes.slice(0, 4) ?? []}
                  />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label={ls("Toplam wellness kullanıcısı", "Total wellness users")} value="141" icon={Users} tone="accent" delta="+18" deltaGood sub={ls("anlık", "live")} />
        <Kpi label={ls("Havuz doluluğu", "Pool occupancy")} value={pct(78)} icon={Waves} tone="warn" delta="+22" deltaGood={false} sub={ls("94 / 120", "94 / 120")} />
        <Kpi label={ls("Spa kullanımı", "Spa utilisation")} value={pct(30)} icon={Flower2} tone="ok" delta="-4" sub={ls("3 boş slot", "3 free slots")} />
        <Kpi label={ls("Fitness doluluğu", "Fitness occupancy")} value={pct(68)} icon={Dumbbell} tone="ok" sub={ls("17 / 25", "17 / 25")} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHead
            title={ls("Gün içi kullanım analizi", "Intraday usage analysis")}
            sub={ls("Saat bazında alan kullanımı — kapasite planlaması için", "Venue usage by hour — for capacity planning")}
            icon={TrendingUp}
            right={<Legend series={usageSeries} />}
          />
          <Chart data={wellnessHourly} series={usageSeries} height={244} refLines={[{ y: 102, label: lang === "tr" ? "havuz %85 eşik" : "pool 85% threshold", color: C.danger }]} />
        </Card>

        <Card>
          <CardHead
            title={ls("Açık havuz — canlı", "Outdoor pool — live")}
            sub={ls("CAM-30 · kapasite bölgesi ve kişi tespiti", "CAM-30 · capacity zone and person detection")}
            icon={Waves}
            right={<Badge tone="danger">{lang === "tr" ? "canlı" : "live"}</Badge>}
          />
          <CameraFrame
            kind="pool"
            seed="CAM-30"
            cameraId="CAM-30"
            name={lang === "tr" ? "Açık havuz — şezlong alanı" : "Outdoor pool — sunbed area"}
            time={hhmmss(poolEvent.at)}
            boxes={poolEvent.boxes}
            zone={poolEvent.zone}
          />
          <div className="mt-3">
            <Insight tone="warn" icon={AlertTriangle}>
              {lang === "tr"
                ? "Kapasite kuralı: %85'e ulaşıldığında havuz barına ve resepsiyona otomatik alarm gider, LCD ekranda “havuz yoğun” bilgisi yayınlanır. Şu anki hız ile eşiğe 18 dakika kaldı."
                : "Capacity rule: at 85% an automatic alarm is sent to the pool bar and reception, and the LCD shows a “pool busy” notice. At the current rate the threshold is 18 minutes away."}
            </Insight>
          </div>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHead
          title={ls("Wellness olayları", "Wellness events")}
          sub={ls("Kapasite aşımı, düşme ve yetkisiz giriş", "Capacity breach, falls and unauthorized access")}
          icon={AlertTriangle}
          tone="danger"
        />
        <EventList events={eventsOf("wellness")} />
      </Card>
    </>
  );
}

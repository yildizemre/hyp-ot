import { useNavigate } from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  Car,
  Clock,
  Monitor,
  RefreshCw,
  Timer,
  Users,
  Video,
  Waves,
} from "lucide-react";
import { AiSummary } from "../components/AiSummary";
import { CameraFrame } from "../components/CameraFrame";
import { Chart, C, Legend, RankBars } from "../components/charts";
import { EventList } from "../components/events";
import { Badge, Bar, Btn, Card, CardHead, Kpi, PageHead } from "../components/ui";
import { CAMERAS, HOTEL } from "../data/hotel";
import { EVENTS, openEvents } from "../data/events";
import { entryExitFlow, eventsTrend, responseTimes, zoneOccupancy } from "../data/series";
import { ls, useFmt, useLang } from "../i18n";
import { hhmm, DEMO_NOW, mmss } from "../lib/util";

const flowSeries = [
  { key: "in", name: ls("Giriş", "Entries"), color: C.accent, type: "area" as const },
  { key: "out", name: ls("Çıkış", "Exits"), color: C.violet, type: "area" as const },
];

const trendSeries = [
  { key: "ops", name: ls("Operasyon olayı", "Operations events"), color: C.accent, type: "bar" as const },
  { key: "security", name: ls("Güvenlik olayı", "Security events"), color: C.danger, type: "bar" as const },
];

export default function Overview() {
  const { l, lang } = useLang();
  const { n, pct } = useFmt();
  const nav = useNavigate();

  const online = CAMERAS.filter((c) => c.status === "online").length;
  const wall = ["CAM-01", "CAM-11", "CAM-20", "CAM-30", "CAM-41", "CAM-70"]
    .map((id) => CAMERAS.find((c) => c.id === id)!)
    .filter(Boolean);

  return (
    <>
      <PageHead
        title={ls("Genel Bakış", "Overview")}
        sub={HOTEL.subtitle}
        right={
          <>
            <Badge tone="mute" icon={RefreshCw} className="px-2 py-1">
              {HOTEL.pmsName} · {lang === "tr" ? "son senkron" : "last sync"} {HOTEL.pmsSync}
            </Badge>
            <Btn icon={Monitor} onClick={() => nav("/screens")}>
              {lang === "tr" ? "LCD önizleme" : "LCD preview"}
            </Btn>
          </>
        }
      />

      <AiSummary
        text={ls(
          "Otel bugün **%84 doluluk** ile çalışıyor. **Check-in kuyruğu 7 kişi** ve ortalama bekleme **4:32 dk** — hedefin (3:00) üzerinde, 3. bankonun açılması bekleme süresini **2:10**'a düşürür. **Açık havuz %78** dolulukta ve 18 dakika içinde kapasite eşiğine yaklaşıyor. Gece vardiyasında **ana depoda mesai dışı hareket** kaydı doğrulandı, risk kapandı. Kritik konu: **lobide 6 dakikadır sahipsiz valiz** — güvenlik yönlendirildi.",
          "The property is running at **84% occupancy** today. The **check-in queue holds 7 guests** with an average wait of **4:32** — above the 3:00 target; opening desk 3 would bring it down to **2:10**. The **outdoor pool is at 78%** and approaches its capacity threshold within 18 minutes. Overnight **after-hours motion in main storage** was verified and closed. Critical: an **unattended suitcase in the lobby for 6 minutes** — security dispatched."
        )}
      />

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Kpi
          label={ls("Anlık misafir (lobi)", "Live guests (lobby)")}
          value={n(34)}
          unit="/ 60"
          icon={Users}
          tone="accent"
          delta="+6"
          deltaGood
          sub={ls("son 30 dk", "last 30 min")}
          onClick={() => nav("/lobby")}
        />
        <Kpi
          label={ls("Check-in kuyruğu", "Check-in queue")}
          value="7"
          unit={lang === "tr" ? "kişi" : "pax"}
          icon={Timer}
          tone="warn"
          delta="+2"
          deltaGood={false}
          sub={ls("eşik: 3 kişi", "threshold: 3")}
          onClick={() => nav("/reception")}
        />
        <Kpi
          label={ls("Ort. bekleme", "Avg. wait")}
          value={mmss(272)}
          unit={lang === "tr" ? "dk" : "min"}
          icon={Clock}
          tone="warn"
          delta={lang === "tr" ? "hedef 3:00" : "target 3:00"}
          sub={ls("check-in", "check-in")}
          onClick={() => nav("/reception")}
        />
        <Kpi
          label={ls("Havuz doluluğu", "Pool occupancy")}
          value={pct(78)}
          icon={Waves}
          tone="warn"
          delta="+22"
          deltaGood={false}
          sub={ls("94 / 120 kişi", "94 / 120 people")}
          onClick={() => nav("/wellness")}
        />
        <Kpi
          label={ls("Açık olay", "Open events")}
          value={n(openEvents.length)}
          icon={AlertTriangle}
          tone="danger"
          delta={lang === "tr" ? "2 kritik" : "2 critical"}
          sub={ls("24 saat", "24 hours")}
          onClick={() => nav("/events")}
        />
        <Kpi
          label={ls("Aktif kamera", "Active cameras")}
          value={`${online}/${CAMERAS.length}`}
          icon={Video}
          tone="ok"
          delta="1 offline"
          deltaGood={false}
          sub={ls("CAM-63 arızalı", "CAM-63 faulty")}
          onClick={() => nav("/cameras")}
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.35fr_1fr]">
        <Card>
          <CardHead
            title={ls("Saatlik misafir akışı", "Hourly guest flow")}
            sub={ls("Ana giriş kameralarından giriş/çıkış sayımı", "In/out counting from main entrance cameras")}
            icon={Activity}
            right={<Legend series={flowSeries} />}
          />
          <Chart data={entryExitFlow} series={flowSeries} height={228} />
        </Card>

        <Card>
          <CardHead
            title={ls("Bölge doluluk durumu", "Zone occupancy")}
            sub={ls("Anlık kişi sayısı / kapasite", "Live people count / capacity")}
            icon={Users}
            right={<Badge tone="accent">{lang === "tr" ? "canlı" : "live"}</Badge>}
          />
          <div className="space-y-2.5">
            {zoneOccupancy.map((z, i) => {
              const p = (z.current / z.capacity) * 100;
              return (
                <div key={i}>
                  <div className="mb-1 flex items-baseline justify-between gap-2">
                    <span className="truncate text-[12px] text-dim">{l(z.zone)}</span>
                    <span className="flex shrink-0 items-baseline gap-1.5">
                      <span className="num text-[12px] font-semibold text-ink">
                        {z.current}
                        <span className="text-mute">/{z.capacity}</span>
                      </span>
                      <span
                        className={`num text-[11px] font-bold ${
                          p >= 85 ? "text-danger" : p >= 70 ? "text-warn" : "text-ok"
                        }`}
                      >
                        {pct(p)}
                      </span>
                      <span className={`num text-[10px] ${z.trend >= 0 ? "text-ok" : "text-mute"}`}>
                        {z.trend >= 0 ? "+" : ""}
                        {z.trend}
                      </span>
                    </span>
                  </div>
                  <Bar value={z.current} max={z.capacity} threshold={85} />
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_1.35fr]">
        <Card>
          <CardHead
            title={ls("Canlı olay akışı", "Live event feed")}
            sub={ls("Snapshot için olaya tıklayın", "Click an event for the snapshot")}
            icon={AlertTriangle}
            tone="danger"
            right={
              <Btn size="sm" onClick={() => nav("/events")}>
                {lang === "tr" ? "Tümü" : "All"}
              </Btn>
            }
          />
          <EventList events={EVENTS} max={4} />
        </Card>

        <Card>
          <CardHead
            title={ls("Kamera duvarı", "Camera wall")}
            sub={ls("6 kritik nokta · AI katmanı açık", "6 critical points · AI layer on")}
            icon={Video}
            right={
              <Btn size="sm" onClick={() => nav("/cameras")}>
                {lang === "tr" ? "38 kamera" : "38 cameras"}
              </Btn>
            }
          />
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {wall.map((cam) => (
              <div key={cam.id}>
                <CameraFrame
                  kind={cam.kind}
                  seed={cam.id}
                  cameraId={cam.id}
                  time={hhmm(DEMO_NOW)}
                  status={cam.status}
                  compact
                  boxes={
                    EVENTS.find((e) => e.cameraId === cam.id)?.boxes.slice(0, 5) ?? []
                  }
                  onClick={() => nav("/cameras")}
                />
                <div className="mt-1.5 flex items-center justify-between gap-2">
                  <span className="truncate text-[10.5px] text-mute">{l(cam.name)}</span>
                  <span className="num shrink-0 text-[10.5px] font-semibold text-accent">
                    {cam.capacity ? `${cam.count}/${cam.capacity}` : cam.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHead
            title={ls("Olay trendi — 7 gün", "Event trend — 7 days")}
            sub={ls("Operasyon ve güvenlik olayları", "Operations and security events")}
            icon={Activity}
            right={<Legend series={trendSeries} />}
          />
          <Chart
            data={eventsTrend.map((d) => ({ ...d, t: lang === "tr" ? d.t : d.en }))}
            series={trendSeries}
            height={188}
            stacked
          />
        </Card>

        <Card>
          <CardHead
            title={ls("Ekip yanıt süreleri", "Team response times")}
            sub={ls("Bildirimden ilk aksiyona kadar", "From alert to first action")}
            icon={Timer}
            tone="violet"
          />
          <RankBars
            items={responseTimes.map((r) => ({
              label: r.team,
              value: r.avgSec,
              tone: r.avgSec <= r.target ? "ok" : "warn",
              hint:
                r.avgSec <= r.target
                  ? ls(`Hedef ${mmss(r.target)} · içinde`, `Target ${mmss(r.target)} · within`)
                  : ls(`Hedef ${mmss(r.target)} · aşıldı`, `Target ${mmss(r.target)} · exceeded`),
            }))}
            formatter={(v) => mmss(v)}
          />
        </Card>

        <Card>
          <CardHead
            title={ls("Otopark & araç", "Parking & vehicles")}
            sub={ls("Plaka tanıma ve doluluk", "Plate recognition and occupancy")}
            icon={Car}
            tone="ok"
            right={
              <Btn size="sm" onClick={() => nav("/parking")}>
                {lang === "tr" ? "Detay" : "Detail"}
              </Btn>
            }
          />
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { k: ls("Anlık doluluk", "Live occupancy"), v: "283/372", t: "text-warn" },
              { k: ls("Bugün giriş", "Entries today"), v: "412", t: "text-accent" },
              { k: ls("Plaka okuma", "Plate reads"), v: "398", t: "text-accent" },
              { k: ls("Yanlış park", "Illegal parking"), v: "3", t: "text-danger" },
            ].map((s, i) => (
              <div key={i} className="rounded-xl border border-line bg-panel2 p-2.5">
                <div className="text-[10.5px] text-mute">{l(s.k)}</div>
                <div className={`num mt-1 text-[17px] font-bold ${s.t}`}>{s.v}</div>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <CameraFrame
              kind="gate"
              seed="CAM-40"
              cameraId="CAM-40"
              time={hhmm(DEMO_NOW)}
              compact
              boxes={[{ x: 0.30, y: 0.26, w: 0.28, h: 0.70, label: "34 VIP 007", tone: "ok", conf: 0.98, shape: "vehicle" }]}
              onClick={() => nav("/lpr")}
            />
          </div>
        </Card>
      </div>
    </>
  );
}

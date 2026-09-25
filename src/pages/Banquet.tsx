import { CalendarRange, DoorOpen, Gauge, Users } from "lucide-react";
import { AiSummary } from "../components/AiSummary";
import { CameraFrame } from "../components/CameraFrame";
import { C, Chart, Donut, Legend } from "../components/charts";
import { EventList } from "../components/events";
import { Badge, Bar, Card, CardHead, Insight, Kpi, PageHead, Table, Td, Tr } from "../components/ui";
import { EVENTS, eventsOf } from "../data/events";
import { banquetEvents, banquetTimeline } from "../data/series";
import { ls, useFmt, useLang } from "../i18n";
import { hhmmss } from "../lib/util";

const timelineSeries = [
  { key: "inside", name: ls("Salondaki kişi", "People inside"), color: C.violet, type: "area" as const },
  { key: "queue", name: ls("Registration kuyruğu", "Registration queue"), color: C.warn, type: "bar" as const },
];

export default function Banquet() {
  const { l, lang } = useLang();
  const { n, pct } = useFmt();
  const capEvent = EVENTS.find((e) => e.id === "EV-2408")!;

  return (
    <>
      <PageHead
        title={ls("Etkinlik & Balo Salonu", "Events & Ballroom")}
        sub={ls(
          "3 kamera · salon kapasitesi, giriş/çıkış yoğunluğu, registration kuyruğu",
          "3 cameras · hall capacity, entry/exit density, registration queue"
        )}
        right={<Badge tone="warn" icon={Gauge}>{lang === "tr" ? "Balo salonu %86" : "Ballroom 86%"}</Badge>}
      />

      <AiSummary
        actions={false}
        title={ls("Etkinlik yorumu", "Event insight")}
        text={ls(
          "Ana balo salonunda **386/450 kişi (%86)** var; kapasite aşımı eşiği **%90** ve giriş hızı **42 kişi/dk**. Mevcut hızda eşiğe **2 dakika** kaldı — **2. salon kapısının açılması** ve giriş hızının yavaşlatılması öneriliyor. Registration kuyruğu **09:00'da 44 kişi** ile zirve yaptı, şu anda **23 kişi**. Foyer'de akış **11:00'dan sonra** tersine dönüyor (coffee break). Bosphorus salonu 19:00 düğünü için hazırlıkta, kamera **boş salon** doğruluyor.",
          "The main ballroom holds **386/450 people (86%)**; the breach threshold is **90%** with an entry rate of **42 people/min**. At this rate the threshold is **2 minutes** away — **opening the second hall door** and slowing entry is recommended. The registration queue peaked at **44 people at 09:00** and now sits at **23**. Foyer flow reverses **after 11:00** (coffee break). The Bosphorus hall is in setup for the 19:00 wedding and the camera confirms an **empty hall**."
        )}
      />

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Kpi label={ls("Balo salonu doluluğu", "Ballroom occupancy")} value={pct(86)} icon={Gauge} tone="danger" delta="+14" deltaGood={false} sub={ls("386 / 450", "386 / 450")} />
        <Kpi label={ls("Toplam etkinlik misafiri", "Total event guests")} value={n(451)} icon={Users} tone="accent" sub={ls("4 etkinlik", "4 events")} />
        <Kpi label={ls("Registration kuyruğu", "Registration queue")} value="23" unit={lang === "tr" ? "kişi" : "pax"} icon={Users} tone="warn" delta="-21" deltaGood sub={ls("zirve 44", "peak 44")} />
        <Kpi label={ls("Giriş hızı", "Entry rate")} value="42" unit={lang === "tr" ? "kişi/dk" : "pax/min"} icon={DoorOpen} tone="warn" sub={ls("2 kapı açık", "2 doors open")} />
        <Kpi label={ls("Kapasite eşiğine", "To capacity threshold")} value="2" unit={lang === "tr" ? "dk" : "min"} icon={Gauge} tone="danger" sub={ls("eşik %90", "threshold 90%")} />
        <Kpi label={ls("Aktif salon", "Active halls")} value="3" unit="/ 6" icon={CalendarRange} tone="ok" sub={ls("1 hazırlıkta", "1 in setup")} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_1fr]">
        <Card>
          <CardHead
            title={ls("Balo salonu — canlı", "Ballroom — live")}
            sub={ls("CAM-70 · salon alanı doluluk bölgesi", "CAM-70 · hall occupancy zone")}
            icon={Gauge}
            tone="danger"
            right={<Badge tone="danger">{lang === "tr" ? "canlı" : "live"}</Badge>}
          />
          <CameraFrame
            kind="ballroom"
            seed="CAM-70"
            cameraId="CAM-70"
            name={lang === "tr" ? "Ana balo salonu" : "Main ballroom"}
            time={hhmmss(capEvent.at)}
            boxes={capEvent.boxes}
            zone={capEvent.zone}
          />
          <div className="mt-3 flex flex-wrap items-center gap-4">
            <Donut
              value={386}
              max={450}
              size={104}
              center={
                <div>
                  <div className="num text-[17px] font-bold text-ink">{pct(86)}</div>
                  <div className="num text-[9.5px] text-mute">386/450</div>
                </div>
              }
            />
            <div className="min-w-0 flex-1">
              <Insight tone="danger" icon={Gauge}>
                {lang === "tr"
                  ? "Kapasite kuralı: %90'a ulaşıldığında etkinlik sorumlusuna ve güvenliğe alarm gider, foyer LCD'sinde “salon dolu” uyarısı yayınlanır."
                  : "Capacity rule: at 90% an alarm reaches the event manager and security, and the foyer LCD shows a “hall full” notice."}
              </Insight>
            </div>
          </div>
        </Card>

        <Card>
          <CardHead
            title={ls("Etkinlik zaman çizelgesi", "Event timeline")}
            sub={ls("Salondaki kişi sayısı ve registration kuyruğu", "People inside and registration queue")}
            icon={CalendarRange}
            tone="violet"
            right={<Legend series={timelineSeries} />}
          />
          <Chart data={banquetTimeline} series={timelineSeries} height={232} refLines={[{ y: 405, label: lang === "tr" ? "%90 eşik" : "90% threshold", color: C.danger }]} />
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              { k: ls("Tepe doluluk", "Peak occupancy"), v: "386", t: "text-danger" },
              { k: ls("Tepe kuyruk", "Peak queue"), v: "44", t: "text-warn" },
              { k: ls("Ort. giriş süresi", "Avg. entry time"), v: "1:12", t: "text-accent" },
            ].map((s, i) => (
              <div key={i} className="rounded-xl border border-line bg-panel2 p-2.5">
                <div className="text-[10.5px] text-mute">{l(s.k)}</div>
                <div className={`num mt-1 text-[16px] font-bold ${s.t}`}>{s.v}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.25fr_1fr]">
        <Card>
          <CardHead
            title={ls("Bugünün etkinlikleri", "Today's events")}
            sub={ls("Salon kapasitesi ve anlık katılım", "Hall capacity and live attendance")}
            icon={CalendarRange}
          />
          <Table
            head={[
              ls("Etkinlik", "Event"),
              ls("Salon", "Hall"),
              ls("Saat", "Window"),
              ls("Katılım", "Attendance"),
              ls("Durum", "Status"),
            ]}
          >
            {banquetEvents.map((e, i) => (
              <Tr key={i}>
                <Td className="font-semibold text-ink">{l(e.name)}</Td>
                <Td>{l(e.hall)}</Td>
                <Td className="num">{e.window}</Td>
                <Td className="w-32">
                  <div className="flex items-center gap-2">
                    <span className="num shrink-0 text-[11px]">
                      {e.attendees}/{e.capacity}
                    </span>
                    <Bar value={e.attendees} max={e.capacity} height={5} threshold={90} />
                  </div>
                </Td>
                <Td>
                  <Badge tone={e.tone}>{l(e.status)}</Badge>
                </Td>
              </Tr>
            ))}
          </Table>
        </Card>

        <Card>
          <CardHead
            title={ls("Registration & foyer", "Registration & foyer")}
            sub={ls("CAM-71 · giriş kuyruğu ve akış yönü", "CAM-71 · entry queue and flow direction")}
            icon={Users}
            tone="warn"
          />
          <CameraFrame
            kind="ballroom"
            seed="CAM-71"
            cameraId="CAM-71"
            name={lang === "tr" ? "Balo foyer — registration" : "Ballroom foyer — registration"}
            time="10:30:18"
            boxes={[
              { x: 0.14, y: 0.5, w: 0.09, h: 0.3, label: ls("Misafir · 2:10", "Guest · 2:10"), tone: "warn", conf: 0.93, shape: "person" },
              { x: 0.26, y: 0.51, w: 0.09, h: 0.29, label: ls("Misafir · 1:44", "Guest · 1:44"), tone: "accent", conf: 0.92, shape: "person" },
              { x: 0.38, y: 0.5, w: 0.09, h: 0.28, label: ls("Misafir · 1:02", "Guest · 1:02"), tone: "accent", conf: 0.9, shape: "person" },
              { x: 0.5, y: 0.49, w: 0.09, h: 0.28, label: ls("Misafir · 0:34", "Guest · 0:34"), tone: "accent", conf: 0.89, shape: "person" },
              { x: 0.72, y: 0.47, w: 0.1, h: 0.3, label: ls("Görevli", "Staff"), tone: "ok", conf: 0.95, shape: "person" },
            ]}
            zone={{ points: [[0.1, 0.58], [0.66, 0.52], [0.76, 0.96], [0.04, 0.97]], label: ls("Registration kuyruğu", "Registration queue") }}
          />
          <div className="mt-3">
            <EventList events={eventsOf("banquet")} showThumb={false} />
          </div>
        </Card>
      </div>
    </>
  );
}

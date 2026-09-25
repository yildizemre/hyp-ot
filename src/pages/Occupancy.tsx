import { Activity, ArrowRightLeft, CalendarClock, Gauge, Users } from "lucide-react";
import { CameraFrame } from "../components/CameraFrame";
import { C, Chart, FlowPath, Heatmap, Legend, RankBars } from "../components/charts";
import { Badge, Bar, Card, CardHead, Kpi, PageHead, Table, Td, Tr } from "../components/ui";
import {
  densityHeatmap,
  dwellBuckets,
  entryExitFlow,
  lobbyOccupancy,
  wellnessHourly,
  zoneOccupancy,
} from "../data/series";
import { ls, useFmt, useLang } from "../i18n";
import { DEMO_NOW, hhmm } from "../lib/util";

const combinedSeries = [
  { key: "people", name: ls("Lobi", "Lobby"), color: C.accent, type: "area" as const },
  { key: "pool", name: ls("Havuz", "Pool"), color: C.ok, type: "line" as const },
  { key: "gym", name: ls("Fitness", "Fitness"), color: C.violet, type: "line" as const },
];

const ioSeries = [
  { key: "in", name: ls("Giriş", "In"), color: C.ok, type: "area" as const },
  { key: "out", name: ls("Çıkış", "Out"), color: C.violet, type: "area" as const },
];

export default function Occupancy() {
  const { l, lang } = useLang();
  const { n, pct } = useFmt();

  const combined = lobbyOccupancy.map((d) => {
    const w = wellnessHourly.find((x) => x.t === d.t);
    return { t: d.t, people: d.people, pool: w?.pool ?? 0, gym: w?.gym ?? 0 };
  });

  const totalCurrent = zoneOccupancy.reduce((s, z) => s + z.current, 0);
  const totalCapacity = zoneOccupancy.reduce((s, z) => s + z.capacity, 0);

  return (
    <>
      <PageHead
        title={ls("Doluluk & Akış Analitiği", "Occupancy & Flow Analytics")}
        sub={ls(
          "Tüm bölgelerin karşılaştırmalı doluluk, akış ve dwell time analizi",
          "Comparative occupancy, flow and dwell time analysis across all areas"
        )}
        right={<Badge tone="accent" icon={Users}>{n(totalCurrent)} / {n(totalCapacity)}</Badge>}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Kpi label={ls("Toplam anlık kişi", "Total live people")} value={n(totalCurrent)} icon={Users} tone="accent" delta="+38" deltaGood sub={ls("8 bölge", "8 zones")} />
        <Kpi label={ls("Ortalama doluluk", "Average occupancy")} value={pct((totalCurrent / totalCapacity) * 100)} icon={Gauge} tone="warn" sub={ls("kapasite ağırlıklı", "capacity weighted")} />
        <Kpi label={ls("En dolu bölge", "Busiest zone")} value={pct(86)} icon={Gauge} tone="danger" sub={ls("balo salonu", "ballroom")} />
        <Kpi label={ls("En boş bölge", "Quietest zone")} value={pct(30)} icon={Gauge} tone="ok" sub={ls("spa", "spa")} />
        <Kpi label={ls("Bina giriş/çıkış", "Building in/out")} value="742 / 658" icon={ArrowRightLeft} tone="violet" sub={ls("bugün", "today")} />
        <Kpi label={ls("Ort. dwell time", "Avg. dwell time")} value="18:20" icon={CalendarClock} tone="warn" delta="+40%" deltaGood={false} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHead
            title={ls("Bölgeler arası doluluk karşılaştırması", "Cross-zone occupancy comparison")}
            sub={ls("Lobi, havuz ve fitness aynı zaman ekseninde", "Lobby, pool and fitness on the same time axis")}
            icon={Activity}
            right={<Legend series={combinedSeries} />}
          />
          <Chart data={combined} series={combinedSeries} height={250} />
        </Card>

        <Card>
          <CardHead
            title={ls("Anlık bölge doluluğu", "Live zone occupancy")}
            sub={ls("Kapasite ve %85 eşik göstergesi", "Capacity with 85% threshold marker")}
            icon={Gauge}
          />
          <Table head={[ls("Bölge", "Zone"), ls("Kişi", "People"), ls("Oran", "Rate"), ls("Trend", "Trend")]}>
            {zoneOccupancy.map((z, i) => {
              const p = (z.current / z.capacity) * 100;
              return (
                <Tr key={i}>
                  <Td className="font-semibold text-ink">{l(z.zone)}</Td>
                  <Td className="w-28">
                    <div className="flex items-center gap-2">
                      <span className="num shrink-0 text-[11px]">
                        {z.current}/{z.capacity}
                      </span>
                      <Bar value={z.current} max={z.capacity} height={5} threshold={85} />
                    </div>
                  </Td>
                  <Td className={`num font-bold ${p >= 85 ? "text-danger" : p >= 70 ? "text-warn" : "text-ok"}`}>{pct(p)}</Td>
                  <Td className={`num ${z.trend >= 0 ? "text-ok" : "text-mute"}`}>
                    {z.trend >= 0 ? "+" : ""}
                    {z.trend}
                  </Td>
                </Tr>
              );
            })}
          </Table>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHead
            title={ls("Bina giriş / çıkış dengesi", "Building in / out balance")}
            sub={ls("Ana giriş kamerasından saatlik sayım", "Hourly counts from the main entrance camera")}
            icon={ArrowRightLeft}
            right={<Legend series={ioSeries} />}
          />
          <Chart data={entryExitFlow} series={ioSeries} height={196} />
        </Card>

        <Card>
          <CardHead
            title={ls("Dwell time dağılımı", "Dwell time distribution")}
            sub={ls("Lobi bölgesinde kalış süreleri", "Time spent in the lobby zone")}
            icon={CalendarClock}
            tone="violet"
          />
          <RankBars
            items={dwellBuckets.map((b, i) => ({
              label: lang === "tr" ? b.bucket : b.en,
              value: b.people,
              tone: i >= 4 ? "warn" : "accent",
            }))}
            unit={lang === "tr" ? "kişi" : "pax"}
          />
        </Card>

        <Card>
          <CardHead
            title={ls("İnsan akışı zinciri", "People flow chain")}
            sub={ls("Giriş → resepsiyon → asansör → kat", "Entrance → reception → elevator → floor")}
            icon={Activity}
            tone="ok"
          />
          <FlowPath
            steps={[
              { label: ls("Giriş", "Entry"), value: 742, tone: "accent" },
              { label: ls("Resepsiyon", "Reception"), value: 611, tone: "warn" },
              { label: ls("Asansör", "Elevator"), value: 588, tone: "violet" },
              { label: ls("Kat", "Floor"), value: 574, tone: "ok" },
            ]}
          />
          <div className="mt-4 space-y-2">
            {[
              { k: ls("Giriş → resepsiyon dönüşümü", "Entry → reception conversion"), v: "%82" },
              { k: ls("Resepsiyon → asansör süresi", "Reception → elevator time"), v: "4:32" },
              { k: ls("F&B'ye yönelen", "Headed to F&B"), v: "214" },
            ].map((s, i) => (
              <div key={i} className="flex items-baseline justify-between gap-2 border-b border-linesoft pb-1.5 last:border-0">
                <span className="text-[11.5px] text-mute">{l(s.k)}</span>
                <span className="num text-[13px] font-semibold text-ink">{s.v}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.25fr_1fr]">
        <Card>
          <CardHead
            title={ls("Haftalık / saatlik yoğunluk haritası", "Weekly / hourly density map")}
            sub={ls("Resepsiyon ve lobi birleşik yoğunluğu", "Combined reception and lobby density")}
            icon={CalendarClock}
            tone="violet"
          />
          <Heatmap rows={densityHeatmap} />
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              { k: ls("En yoğun gün", "Busiest day"), v: lang === "tr" ? "Cumartesi" : "Saturday", t: "text-danger" },
              { k: ls("En yoğun saat", "Busiest hour"), v: "14:00", t: "text-warn" },
              { k: ls("En sakin saat", "Quietest hour"), v: "03:00", t: "text-ok" },
            ].map((s, i) => (
              <div key={i} className="rounded-xl border border-line bg-panel2 p-2.5">
                <div className="text-[10.5px] text-mute">{l(s.k)}</div>
                <div className={`mt-1 text-[14px] font-bold ${s.t}`}>{s.v}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHead
            title={ls("Sayım kameraları", "Counting cameras")}
            sub={ls("Giriş, lobi ve asansör holü sayım hatları", "Entrance, lobby and elevator hall counting lines")}
            icon={Users}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { id: "CAM-10", kind: "entrance" as const, name: lang === "tr" ? "Ana giriş" : "Main entrance" },
              { id: "CAM-11", kind: "lobby" as const, name: lang === "tr" ? "Lobi oturma" : "Lobby seating" },
              { id: "CAM-12", kind: "elevator" as const, name: lang === "tr" ? "Asansör holü" : "Elevator hall" },
              { id: "CAM-33", kind: "gym" as const, name: lang === "tr" ? "Fitness" : "Fitness" },
            ].map((c) => (
              <div key={c.id}>
                <CameraFrame
                  kind={c.kind}
                  seed={c.id}
                  cameraId={c.id}
                  time={hhmm(DEMO_NOW)}
                  compact
                  boxes={[
                    { x: 0.2, y: 0.46, w: 0.09, h: 0.3, label: lang === "tr" ? "kişi" : "person", tone: "accent", conf: 0.93, shape: "person" },
                    { x: 0.42, y: 0.48, w: 0.09, h: 0.3, label: lang === "tr" ? "kişi" : "person", tone: "accent", conf: 0.91, shape: "person" },
                    { x: 0.64, y: 0.45, w: 0.09, h: 0.29, label: lang === "tr" ? "kişi" : "person", tone: "accent", conf: 0.9, shape: "person" },
                  ]}
                  showLabels={false}
                />
                <div className="mt-1.5 text-[10.5px] text-mute">{c.name}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

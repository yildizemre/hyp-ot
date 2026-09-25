import { Coffee, RefreshCcw, Timer, UtensilsCrossed, Users } from "lucide-react";
import { AiSummary } from "../components/AiSummary";
import { CameraFrame } from "../components/CameraFrame";
import { C, Chart, Donut, Legend } from "../components/charts";
import { EventList } from "../components/events";
import { Badge, Bar, Card, CardHead, Insight, Kpi, PageHead, Table, Td, Tr } from "../components/ui";
import { EVENTS, eventsOf } from "../data/events";
import { breakfastProfile, outlets, tableTurnover } from "../data/series";
import { ls, useFmt, useLang } from "../i18n";
import { hhmmss, mmss } from "../lib/util";

const bfSeries = [
  { key: "people", name: ls("Restoranda kişi", "People in restaurant"), color: C.accent, type: "area" as const },
  { key: "queue", name: ls("Giriş kuyruğu", "Entry queue"), color: C.warn, type: "bar" as const },
];

const turnoverSeries = [
  { key: "min", name: ls("Masa kullanım süresi (dk)", "Table turnover (min)"), color: C.violet, type: "bar" as const },
];

export default function Fnb() {
  const { l, lang } = useLang();
  const { n, pct } = useFmt();
  const buffetEvent = EVENTS.find((e) => e.id === "EV-2414")!;
  const totalOcc = outlets.reduce((s, o) => s + o.occupied, 0);
  const totalCap = outlets.reduce((s, o) => s + o.capacity, 0);

  return (
    <>
      <PageHead
        title={ls("F&B · Restoran & Buffet Analitiği", "F&B · Restaurant & Buffet Analytics")}
        sub={ls(
          "4 kamera · masa doluluğu, kahvaltı yoğunluğu, buffet kuyruğu, table turnover",
          "4 cameras · table occupancy, breakfast density, buffet queue, table turnover"
        )}
        right={<Badge tone="warn" icon={Timer}>{lang === "tr" ? "Buffet beklemesi 5:10" : "Buffet wait 5:10"}</Badge>}
      />

      <AiSummary
        actions={false}
        title={ls("F&B yorumu", "F&B insight")}
        text={ls(
          "Kahvaltı zirvesi **08:15'te 141 kişi** ile gerçekleşti; **08:00–09:00 aralığı** günün en yoğun profili. Omlet istasyonundaki bekleme **5:10 dk** ile hedefin (3:00) **%72 üzerinde** — **2. istasyonun açılması** kuyruğu 14 kişiden 6 kişiye indiriyor. Ana restoran **%69 dolulukta** (96/140). Masa kullanım süresi bu hafta **54 dk**, hafta sonu **74 dk**'ya çıkıyor; akşam servisi için 2 tur planlanabilir.",
          "Breakfast peaked at **141 people at 08:15**; the **08:00–09:00 window** is the busiest profile of the day. The omelette station wait of **5:10** is **72% above** the 3:00 target — **opening a second station** cuts the queue from 14 to 6 people. The main restaurant is at **69% occupancy** (96/140). Table turnover is **54 min** this week, rising to **74 min** at weekends; two seatings can be planned for dinner service."
        )}
      />

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Kpi label={ls("Anlık F&B doluluğu", "Live F&B occupancy")} value={n(totalOcc)} unit={`/ ${totalCap}`} icon={Users} tone="warn" delta="-12" sub={ls("5 outlet", "5 outlets")} />
        <Kpi label={ls("Ana restoran", "Main restaurant")} value={pct(69)} icon={UtensilsCrossed} tone="warn" sub={ls("96 / 140 masa alanı", "96 / 140 seats")} />
        <Kpi label={ls("Kahvaltı zirvesi", "Breakfast peak")} value="141" unit={lang === "tr" ? "kişi" : "pax"} icon={Coffee} tone="accent" sub="08:15" />
        <Kpi label={ls("Buffet kuyruğu", "Buffet queue")} value="14" unit={lang === "tr" ? "kişi" : "pax"} icon={Users} tone="danger" delta="+6" deltaGood={false} sub={ls("sıcak hat", "hot line")} />
        <Kpi label={ls("Ort. buffet beklemesi", "Avg. buffet wait")} value={mmss(310)} icon={Timer} tone="danger" delta={lang === "tr" ? "hedef 3:00" : "target 3:00"} />
        <Kpi label={ls("Masa kullanım süresi", "Table turnover")} value="54" unit={lang === "tr" ? "dk" : "min"} icon={RefreshCcw} tone="ok" delta="-7" deltaGood sub={ls("hafta ortalaması", "week average")} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.35fr_1fr]">
        <Card>
          <CardHead
            title={ls("Kahvaltı yoğunluk profili", "Breakfast density profile")}
            sub={ls("06:30–10:15 · 15 dakikalık dilimler", "06:30–10:15 · 15 minute buckets")}
            icon={Coffee}
            right={<Legend series={bfSeries} />}
          />
          <Chart data={breakfastProfile} series={bfSeries} height={228} refLines={[{ y: 140, label: lang === "tr" ? "kapasite" : "capacity", color: C.danger }]} />
          <div className="mt-3">
            <Insight tone="warn" icon={Timer}>
              {lang === "tr"
                ? "08:00–09:00 arasında kapasitenin %94'üne ulaşıldı. Bu aralıkta 2. omlet istasyonu ve ek host önerilir; geçen hafta aynı aksiyon beklemeyi 2:40'a indirdi."
                : "Capacity reached 94% between 08:00–09:00. A second omelette station plus an extra host is recommended; the same action last week brought the wait down to 2:40."}
            </Insight>
          </div>
        </Card>

        <Card>
          <CardHead
            title={ls("Buffet kuyruğu — canlı", "Buffet queue — live")}
            sub={ls("CAM-21 · kişi başı bekleme süresi", "CAM-21 · per-person wait time")}
            icon={Users}
            tone="warn"
            right={<Badge tone="danger">{lang === "tr" ? "canlı" : "live"}</Badge>}
          />
          <CameraFrame
            kind="buffet"
            seed="CAM-21"
            cameraId="CAM-21"
            name={lang === "tr" ? "Kahvaltı buffet — sıcak hat" : "Breakfast buffet — hot line"}
            time={hhmmss(buffetEvent.at)}
            boxes={buffetEvent.boxes}
            zone={buffetEvent.zone}
          />
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              { k: ls("Kuyruktaki kişi", "In queue"), v: "14", t: "text-danger" },
              { k: ls("Ort. bekleme", "Avg. wait"), v: "5:10", t: "text-warn" },
              { k: ls("Servis hızı", "Service rate"), v: "2,8/dk", t: "text-accent" },
            ].map((s, i) => (
              <div key={i} className="rounded-xl border border-line bg-panel2 p-2.5">
                <div className="text-[10.5px] text-mute">{l(s.k)}</div>
                <div className={`num mt-1 text-[16px] font-bold ${s.t}`}>{s.v}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_1fr]">
        <Card>
          <CardHead
            title={ls("Outlet doluluk durumu", "Outlet occupancy")}
            sub={ls("Anlık masa/alan doluluğu ve giriş kuyruğu", "Live table occupancy and entry queue")}
            icon={UtensilsCrossed}
          />
          <Table
            head={[
              ls("Outlet", "Outlet"),
              ls("Doluluk", "Occupancy"),
              ls("Oran", "Rate"),
              ls("Kuyruk", "Queue"),
              ls("Turnover", "Turnover"),
            ]}
          >
            {outlets.map((o, i) => {
              const p = o.capacity ? (o.occupied / o.capacity) * 100 : 0;
              return (
                <Tr key={i}>
                  <Td className="font-semibold text-ink">{l(o.name)}</Td>
                  <Td className="w-28">
                    <div className="flex items-center gap-2">
                      <span className="num shrink-0 text-[11px]">
                        {o.occupied}/{o.capacity}
                      </span>
                      <Bar value={o.occupied} max={o.capacity} height={5} />
                    </div>
                  </Td>
                  <Td className={`num font-bold ${p >= 85 ? "text-danger" : p >= 65 ? "text-warn" : "text-ok"}`}>
                    {pct(p)}
                  </Td>
                  <Td>
                    {o.queue > 0 ? <Badge tone={o.queue >= 6 ? "danger" : "warn"}>{o.queue}</Badge> : <span className="text-mute">—</span>}
                  </Td>
                  <Td className="num">{o.turnover ? `${o.turnover} dk` : "—"}</Td>
                </Tr>
              );
            })}
          </Table>
          <div className="mt-4 flex flex-wrap items-center gap-5">
            <Donut
              value={totalOcc}
              max={totalCap}
              size={116}
              center={
                <div>
                  <div className="num text-[19px] font-bold text-ink">{pct((totalOcc / totalCap) * 100)}</div>
                  <div className="text-[9.5px] text-mute">{lang === "tr" ? "F&B toplam" : "F&B total"}</div>
                </div>
              }
            />
            <div className="min-w-0 flex-1 space-y-2">
              {[
                { k: ls("Bugün servis edilen kuver", "Covers served today"), v: n(864) },
                { k: ls("Kişi başı ort. oturma", "Avg. seating per guest"), v: "47 dk" },
                { k: ls("Boş masa (ana restoran)", "Free tables (main restaurant)"), v: "11" },
              ].map((s, i) => (
                <div key={i} className="flex items-baseline justify-between gap-2 border-b border-linesoft pb-1.5 last:border-0">
                  <span className="text-[11.5px] text-mute">{l(s.k)}</span>
                  <span className="num text-[13px] font-semibold text-ink">{s.v}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHead
              title={ls("Masa kullanım süresi (table turnover)", "Table turnover")}
              sub={ls("Gün bazında ortalama masa dolu kalma süresi", "Average time a table stays occupied per day")}
              icon={RefreshCcw}
              tone="violet"
            />
            <Chart
              data={tableTurnover.map((d) => ({ ...d, t: lang === "tr" ? d.t : d.en }))}
              series={turnoverSeries}
              height={170}
              refLines={[{ y: 55, label: lang === "tr" ? "hedef" : "target", color: C.ok }]}
            />
          </Card>

          <Card>
            <CardHead title={ls("F&B olayları", "F&B events")} sub={ls("Kuyruk ve bekleme bildirimleri", "Queue and wait alerts")} icon={Timer} tone="danger" />
            <EventList events={eventsOf("fnb")} showThumb={false} />
          </Card>
        </div>
      </div>
    </>
  );
}

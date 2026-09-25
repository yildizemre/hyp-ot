import { AlertTriangle, CalendarClock, ConciergeBell, LayoutGrid, Timer, UserCheck, Users } from "lucide-react";
import { AiSummary } from "../components/AiSummary";
import { CameraFrame } from "../components/CameraFrame";
import { C, Chart, Heatmap, Legend } from "../components/charts";
import { EventList } from "../components/events";
import { Badge, Bar, Card, CardHead, Insight, Kpi, PageHead, Table, Td, Tr } from "../components/ui";
import { EVENTS, eventsOf } from "../data/events";
import { deskPerformance, densityHeatmap, receptionHourly, receptionLive } from "../data/series";
import { ls, useFmt, useLang } from "../i18n";
import { hhmmss, mmss } from "../lib/util";

const liveSeries = [
  { key: "queue", name: ls("Kuyruktaki kişi", "People in queue"), color: C.accent, type: "area" as const },
  { key: "desks", name: ls("Açık banko", "Open desks"), color: C.violet, type: "line" as const },
];

const hourlySeries = [
  { key: "arrivals", name: ls("Check-in sayısı", "Check-ins"), color: C.accent, type: "bar" as const },
  { key: "queue", name: ls("Ort. kuyruk", "Avg. queue"), color: C.warn, type: "line" as const },
];

export default function Reception() {
  const { l, lang } = useLang();
  const { n, pct } = useFmt();
  const queueEvent = EVENTS.find((e) => e.id === "EV-2418")!;

  return (
    <>
      <PageHead
        title={ls("Resepsiyon & Kuyruk Analizi", "Reception & Queue Analytics")}
        sub={ls(
          "3 kamera · kuyruk uzunluğu, bekleme süresi ve banko verimliliği",
          "3 cameras · queue length, wait time and desk efficiency"
        )}
        right={<Badge tone="warn" icon={AlertTriangle}>{lang === "tr" ? "Kuyruk eşiği aşıldı" : "Queue threshold exceeded"}</Badge>}
      />

      <AiSummary
        actions={false}
        title={ls("Resepsiyon yorumu", "Reception insight")}
        text={ls(
          "Şu anda **7 kişi bekliyor** ve ortalama check-in beklemesi **4:32 dk** (hedef 3:00). Kuyruk 35 dakikadır eşiğin üzerinde; **2 banko açık**, Banko 3 kapalı. Geçmiş veriye göre 3. bankonun açılması beklemeyi **2:10**'a indiriyor. Günün zirvesi **14:00–15:00** aralığında (96 check-in) — grup girişleri bu saate denk geliyor.",
          "**7 guests are waiting** and the average check-in wait is **4:32** (target 3:00). The queue has been above threshold for 35 minutes; **2 desks are open** and desk 3 is closed. Historically, opening desk 3 reduces the wait to **2:10**. Today's peak is **14:00–15:00** (96 check-ins) — group arrivals land in that window."
        )}
      />

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Kpi
          label={ls("Şu anda bekleyen", "Waiting now")}
          value="7"
          unit={lang === "tr" ? "kişi" : "pax"}
          icon={Users}
          tone="warn"
          delta="+2"
          deltaGood={false}
          sub={ls("eşik 3 kişi", "threshold 3")}
        />
        <Kpi
          label={ls("Ort. check-in bekleme", "Avg. check-in wait")}
          value={mmss(272)}
          icon={Timer}
          tone="warn"
          delta={lang === "tr" ? "hedef 3:00" : "target 3:00"}
          sub={ls("bugün", "today")}
        />
        <Kpi
          label={ls("En uzun bekleme", "Longest wait")}
          value={mmss(748)}
          icon={CalendarClock}
          tone="danger"
          sub={ls("14:20 · grup girişi", "14:20 · group arrival")}
        />
        <Kpi
          label={ls("Bugün check-in", "Check-ins today")}
          value={n(412)}
          icon={UserCheck}
          tone="accent"
          delta="+9%"
          deltaGood
          sub={ls("dün 378", "yesterday 378")}
        />
        <Kpi
          label={ls("Açık banko", "Open desks")}
          value="2"
          unit="/ 4"
          icon={ConciergeBell}
          tone="danger"
          sub={ls("3. banko kapalı", "desk 3 closed")}
        />
        <Kpi
          label={ls("SLA uyumu", "SLA compliance")}
          value={pct(68)}
          icon={LayoutGrid}
          tone="warn"
          delta="-14%"
          deltaGood={false}
          sub={ls("3 dk altı check-in", "check-ins under 3 min")}
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_1fr]">
        <Card>
          <CardHead
            title={ls("Canlı kuyruk görüntüsü", "Live queue view")}
            sub={ls("CAM-01 · kuyruk bölgesi ve kişi başı bekleme süresi", "CAM-01 · queue zone with per-person wait")}
            icon={Users}
            right={<Badge tone="danger">{lang === "tr" ? "canlı" : "live"}</Badge>}
          />
          <CameraFrame
            kind="reception"
            seed="CAM-01"
            cameraId="CAM-01"
            name={lang === "tr" ? "Check-in bankosu" : "Check-in desk"}
            time={hhmmss(queueEvent.at)}
            boxes={queueEvent.boxes}
            zone={queueEvent.zone}
          />
          <div className="mt-3">
            <Insight tone="warn" icon={AlertTriangle}>
              {lang === "tr" ? (
                <>
                  <b className="text-ink">Personel / kuyruk kuralı:</b> 3+ kişi 120 saniyeden uzun beklerse ek banko
                  açılması önerilir. Şu an <b className="text-ink">7 kişi</b> · en uzun bekleme{" "}
                  <b className="text-ink">3:10</b>. Önerilen aksiyon: <b className="text-ink">Banko 3'ü aç</b>.
                </>
              ) : (
                <>
                  <b className="text-ink">Staffing rule:</b> when 3+ guests wait longer than 120 seconds, an extra desk
                  is recommended. Currently <b className="text-ink">7 guests</b> · longest wait{" "}
                  <b className="text-ink">3:10</b>. Suggested action: <b className="text-ink">open desk 3</b>.
                </>
              )}
            </Insight>
          </div>
        </Card>

        <Card>
          <CardHead
            title={ls("Son 90 dakika · kuyruk ve banko", "Last 90 minutes · queue and desks")}
            sub={ls("Kesikli çizgi: alarm eşiği (3 kişi)", "Dashed line: alarm threshold (3 people)")}
            icon={Timer}
            right={<Legend series={liveSeries} />}
          />
          <Chart
            data={receptionLive}
            series={liveSeries}
            height={212}
            refLines={[{ y: 3, label: lang === "tr" ? "eşik" : "threshold" }]}
          />
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              { k: ls("Eşik aşım süresi", "Time above threshold"), v: "35 dk", t: "text-warn" },
              { k: ls("Tepe kuyruk", "Peak queue"), v: "7", t: "text-danger" },
              { k: ls("Tahmini boşalma", "Est. clear time"), v: "12 dk", t: "text-accent" },
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
            title={ls("Saatlik resepsiyon yoğunluğu", "Hourly reception density")}
            sub={ls("Check-in adedi ve ortalama kuyruk uzunluğu", "Check-in volume and average queue length")}
            icon={LayoutGrid}
            right={<Legend series={hourlySeries} />}
          />
          <Chart data={receptionHourly} series={hourlySeries} height={210} />
        </Card>

        <Card>
          <CardHead
            title={ls("Haftalık / saatlik yoğunluk", "Weekly / hourly density")}
            sub={ls("Koyu kırmızı = kapasite baskısı", "Deep red = capacity pressure")}
            icon={CalendarClock}
            tone="violet"
          />
          <Heatmap rows={densityHeatmap} />
          <div className="mt-3 flex flex-wrap items-center gap-2 text-[10.5px] text-mute">
            <Badge tone="accent">{lang === "tr" ? "düşük" : "low"}</Badge>
            <Badge tone="warn">{lang === "tr" ? "orta" : "medium"}</Badge>
            <Badge tone="danger">{lang === "tr" ? "yüksek" : "high"}</Badge>
            <span className="ml-auto">
              {lang === "tr" ? "En yoğun: Cmt 14:00 (%100)" : "Peak: Sat 14:00 (100%)"}
            </span>
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_1.2fr]">
        <Card>
          <CardHead
            title={ls("Banko performansı", "Desk performance")}
            sub={ls("Bugünkü işlem adedi ve ortalama süre", "Today's transactions and average handling time")}
            icon={ConciergeBell}
          />
          <Table
            head={[
              ls("Banko", "Desk"),
              ls("Durum", "Status"),
              ls("İşlem", "Handled"),
              ls("Ort. süre", "Avg. time"),
              ls("Yük", "Load"),
            ]}
          >
            {deskPerformance.map((d, i) => (
              <Tr key={i}>
                <Td className="font-semibold text-ink">{l(d.desk)}</Td>
                <Td>
                  <Badge tone={d.open ? "ok" : "mute"}>
                    {d.open ? (lang === "tr" ? "Açık" : "Open") : lang === "tr" ? "Kapalı" : "Closed"}
                  </Badge>
                </Td>
                <Td className="num">{d.handled}</Td>
                <Td className="num">{d.avg ? `${d.avg.toFixed(1)} dk` : "—"}</Td>
                <Td className="w-28">
                  <Bar value={d.handled} max={70} tone={d.open ? "accent" : "mute"} height={5} />
                </Td>
              </Tr>
            ))}
          </Table>
        </Card>

        <Card>
          <CardHead
            title={ls("Resepsiyon olayları", "Reception events")}
            sub={ls("Kuyruk, bekleme ve sahipsiz nesne bildirimleri", "Queue, wait and abandoned object alerts")}
            icon={AlertTriangle}
            tone="danger"
          />
          <EventList events={eventsOf("reception")} />
        </Card>
      </div>
    </>
  );
}

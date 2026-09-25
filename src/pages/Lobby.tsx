import { ArrowRightLeft, Building2, Hourglass, LogIn, LogOut, Route, Users } from "lucide-react";
import { AiSummary } from "../components/AiSummary";
import { CameraFrame } from "../components/CameraFrame";
import { C, Chart, FlowPath, Legend, RankBars } from "../components/charts";
import { EventList } from "../components/events";
import { Badge, Card, CardHead, Kpi, PageHead, Table, Td, Tr } from "../components/ui";
import { camerasOf } from "../data/hotel";
import { EVENTS, eventsOf } from "../data/events";
import { dwellBuckets, entryExitFlow, flowFunnel, lobbyOccupancy } from "../data/series";
import { ls, useFmt, useLang } from "../i18n";
import { DEMO_NOW, hhmm, mmss } from "../lib/util";

const occSeries = [
  { key: "people", name: ls("Lobi doluluk", "Lobby occupancy"), color: C.accent, type: "area" as const },
  { key: "cap", name: ls("Kapasite", "Capacity"), color: C.mute, type: "line" as const, dashed: true },
];

const ioSeries = [
  { key: "in", name: ls("Giriş", "In"), color: C.ok, type: "bar" as const },
  { key: "out", name: ls("Çıkış", "Out"), color: C.violet, type: "bar" as const },
];

export default function Lobby() {
  const { l, lang } = useLang();
  const { n, pct } = useFmt();
  const cams = camerasOf("lobby");

  return (
    <>
      <PageHead
        title={ls("Lobi · İnsan Sayımı & Akış", "Lobby · People Counting & Flow")}
        sub={ls(
          "4 kamera · anlık doluluk, giriş → resepsiyon → asansör akışı, dwell time",
          "4 cameras · live occupancy, entrance → reception → elevator flow, dwell time"
        )}
        right={<Badge tone="accent" icon={Users}>{lang === "tr" ? "34 kişi lobide" : "34 people in lobby"}</Badge>}
      />

      <AiSummary
        actions={false}
        title={ls("Lobi yorumu", "Lobby insight")}
        text={ls(
          "Lobide **34 kişi** var (kapasite 60, **%57**). Ana girişten bugün **742 kişi** geçti; bunların **%82'si resepsiyona** yöneldi ve resepsiyon ile asansör arasındaki ortalama geçiş **4:32 dk** sürüyor — bu gecikme doğrudan check-in kuyruğundan kaynaklanıyor. Oturma alanında ortalama **dwell time 18 dk**, normalin **%40 üzerinde**. Tur otobüsü kaynaklı **186 kişi/15 dk** giriş dalgası 07:45'te kaydedildi.",
          "There are **34 people** in the lobby (capacity 60, **57%**). **742 people** passed the main entrance today; **82% headed to reception**, and the average transition between reception and the elevators takes **4:32** — that delay comes straight from the check-in queue. Average **dwell time in the seating area is 18 min**, **40% above** normal. A tour-bus surge of **186 people/15 min** was recorded at 07:45."
        )}
      />

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Kpi label={ls("Anlık lobi doluluğu", "Live lobby occupancy")} value="34" unit="/ 60" icon={Users} tone="accent" delta="+6" deltaGood sub={ls("son 30 dk", "last 30 min")} />
        <Kpi label={ls("Doluluk oranı", "Occupancy rate")} value={pct(57)} icon={Building2} tone="ok" sub={ls("eşik %85", "threshold 85%")} />
        <Kpi label={ls("Bugün giriş", "Entries today")} value={n(742)} icon={LogIn} tone="accent" delta="+11%" deltaGood sub={ls("ana giriş", "main entrance")} />
        <Kpi label={ls("Bugün çıkış", "Exits today")} value={n(658)} icon={LogOut} tone="violet" sub={ls("net +84", "net +84")} />
        <Kpi label={ls("Ort. dwell time", "Avg. dwell time")} value="18:20" icon={Hourglass} tone="warn" delta="+40%" deltaGood={false} sub={ls("oturma alanı", "seating area")} />
        <Kpi label={ls("Resepsiyona yönelen", "Headed to reception")} value={pct(82)} icon={Route} tone="accent" sub={ls("611 / 742 kişi", "611 / 742 people")} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.3fr_1fr]">
        <Card>
          <CardHead
            title={ls("Lobi doluluk eğrisi", "Lobby occupancy curve")}
            sub={ls("Saatlik ortalama kişi sayısı · kapasite 60", "Hourly average people count · capacity 60")}
            icon={Users}
            right={<Legend series={occSeries} />}
          />
          <Chart data={lobbyOccupancy} series={occSeries} height={222} refLines={[{ y: 51, label: lang === "tr" ? "%85 eşik" : "85% threshold" }]} />
        </Card>

        <Card>
          <CardHead
            title={ls("İnsan akışı", "People flow")}
            sub={ls("Giriş → resepsiyon → asansör hareketleri", "Entrance → reception → elevator movements")}
            icon={ArrowRightLeft}
            tone="violet"
          />
          <FlowPath
            steps={[
              { label: ls("Ana giriş", "Main entrance"), value: 742, sub: ls("döner kapı", "revolving door"), tone: "accent" },
              { label: ls("Resepsiyon", "Reception"), value: 611, sub: "82%", tone: "warn" },
              { label: ls("Asansör holü", "Elevator hall"), value: 588, sub: "79%", tone: "violet" },
              { label: ls("Kat çıkışı", "Floor exit"), value: 574, sub: "77%", tone: "ok" },
            ]}
          />
          <div className="mt-4">
            <Table head={[ls("Güzergâh", "Route"), ls("Kişi", "People"), ls("Ort. geçiş", "Avg. transit")]}>
              {flowFunnel.map((f, i) => (
                <Tr key={i}>
                  <Td className="text-[11.5px]">
                    <span className="text-ink">{l(f.from)}</span>
                    <span className="mx-1 text-mute">→</span>
                    <span className="text-ink">{l(f.to)}</span>
                  </Td>
                  <Td className="num font-semibold text-ink">{f.people}</Td>
                  <Td className="num">{mmss(f.avgSec)}</Td>
                </Tr>
              ))}
            </Table>
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHead
            title={ls("Dwell time dağılımı", "Dwell time distribution")}
            sub={ls("Misafirlerin lobi bölgesinde kalma süresi", "How long guests stay in the lobby zone")}
            icon={Hourglass}
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
            title={ls("Giriş / çıkış dengesi", "Entry / exit balance")}
            sub={ls("Saatlik sayım · ana giriş kamerası", "Hourly counts · main entrance camera")}
            icon={ArrowRightLeft}
            right={<Legend series={ioSeries} />}
          />
          <Chart data={entryExitFlow} series={ioSeries} height={208} />
        </Card>

        <Card>
          <CardHead
            title={ls("Lobi olayları", "Lobby events")}
            sub={ls("Dwell, akış ve davranış bildirimleri", "Dwell, flow and behaviour alerts")}
            icon={Users}
            tone="danger"
          />
          <EventList events={eventsOf("lobby")} showThumb={false} />
        </Card>
      </div>

      <Card className="mt-4">
        <CardHead
          title={ls("Lobi kameraları", "Lobby cameras")}
          sub={ls("AI katmanı · insan sayımı ve akış yönü", "AI layer · people counting and flow direction")}
          icon={Building2}
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {cams.map((cam) => {
            const ev = EVENTS.find((e) => e.cameraId === cam.id);
            return (
              <div key={cam.id}>
                <CameraFrame
                  kind={cam.kind}
                  seed={cam.id}
                  cameraId={cam.id}
                  time={hhmm(DEMO_NOW)}
                  status={cam.status}
                  boxes={ev?.boxes ?? []}
                  compact
                />
                <div className="mt-1.5 flex items-center justify-between gap-2">
                  <span className="truncate text-[11px] text-dim">{l(cam.name)}</span>
                  <span className="num shrink-0 text-[11px] font-bold text-accent">
                    {cam.capacity ? `${cam.count}/${cam.capacity}` : cam.count}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
}

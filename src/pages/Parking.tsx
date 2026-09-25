import { useNavigate } from "react-router-dom";
import { Car, CarFront, ParkingCircle, ScanLine, TrendingUp, TriangleAlert } from "lucide-react";
import { AiSummary } from "../components/AiSummary";
import { CameraFrame } from "../components/CameraFrame";
import { C, Chart, Donut } from "../components/charts";
import { EventList } from "../components/events";
import { Badge, Bar, Btn, Card, CardHead, Kpi, PageHead, Table, Td, Tr } from "../components/ui";
import { camerasOf } from "../data/hotel";
import { EVENTS, eventsOf } from "../data/events";
import { parkingHourly, parkingLots, plateLog } from "../data/series";
import { ls, useFmt, useLang } from "../i18n";
import { DEMO_NOW, hhmm } from "../lib/util";

const occSeries = [{ key: "occ", name: ls("Dolu araç yeri", "Occupied bays"), color: C.accent, type: "area" as const }];

export default function Parking() {
  const { l, lang } = useLang();
  const { n, pct } = useFmt();
  const nav = useNavigate();
  const occ = parkingLots.reduce((s, p) => s + p.occupied, 0);
  const cap = parkingLots.reduce((s, p) => s + p.capacity, 0);
  const cams = camerasOf("parking");

  return (
    <>
      <PageHead
        title={ls("Otopark · Araç Sayımı & Plaka", "Car Park · Vehicle Counting & Plates")}
        sub={ls(
          "3 kamera · anlık doluluk, plaka tanıma giriş/çıkış kayıtları, yanlış park tespiti",
          "3 cameras · live occupancy, plate recognition in/out log, illegal parking detection"
        )}
        right={
          <>
            <Badge tone="warn" icon={TriangleAlert}>{lang === "tr" ? "1 yangın yolu ihlali" : "1 fire lane violation"}</Badge>
            <Btn icon={ScanLine} onClick={() => nav("/lpr")}>
              {lang === "tr" ? "Plaka kayıtları" : "Plate log"}
            </Btn>
          </>
        }
      />

      <AiSummary
        actions={false}
        title={ls("Otopark yorumu", "Car park insight")}
        text={ls(
          "Otopark **%76 dolulukta** (283/372). Vale alanı **%85** ile en kritik bölge; 18:00 civarında doluluk **318 araca** çıkıyor, bu saatte vale kapasitesi aşılıyor. Bugün **398 plaka okundu**, tanıma başarısı **%97,4**. Aktif ihlal: **34 CV 8821** yangın yolunda **9 dakika** — vale ekibine bildirim gönderildi. Tur otobüsü **35 TUR 442** 09:21'de giriş yaptı ve resepsiyon kuyruğundaki artışla örtüşüyor.",
          "The car park is **76% full** (283/372). The valet area is the most critical zone at **85%**; occupancy climbs to **318 vehicles** around 18:00, exceeding valet capacity. **398 plates were read** today with **97.4%** recognition accuracy. Active violation: **34 CV 8821** in the fire lane for **9 minutes** — the valet team has been notified. Tour bus **35 TUR 442** entered at 09:21, matching the spike in the reception queue."
        )}
      />

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Kpi label={ls("Anlık doluluk", "Live occupancy")} value={n(occ)} unit={`/ ${cap}`} icon={ParkingCircle} tone="warn" delta="+8" deltaGood={false} sub={pct((occ / cap) * 100)} />
        <Kpi label={ls("Bugün giriş", "Entries today")} value={n(412)} icon={CarFront} tone="accent" delta="+6%" deltaGood sub={ls("dün 389", "yesterday 389")} />
        <Kpi label={ls("Bugün çıkış", "Exits today")} value={n(367)} icon={Car} tone="violet" sub={ls("net +45", "net +45")} />
        <Kpi label={ls("Plaka okuma", "Plate reads")} value={n(398)} icon={ScanLine} tone="ok" delta="%97,4" deltaGood sub={ls("tanıma başarısı", "recognition rate")} />
        <Kpi label={ls("Yanlış park", "Illegal parking")} value="3" icon={TriangleAlert} tone="danger" delta="+1" deltaGood={false} sub={ls("1 aktif ihlal", "1 active violation")} />
        <Kpi label={ls("Tepe doluluk", "Peak occupancy")} value={n(318)} icon={TrendingUp} tone="warn" sub="18:00" />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_1.15fr]">
        <Card>
          <CardHead
            title={ls("Blok bazında doluluk", "Occupancy by block")}
            sub={ls("Araç sayımı kameralarından anlık veri", "Live data from vehicle counting cameras")}
            icon={ParkingCircle}
          />
          <div className="flex flex-wrap items-center gap-5">
            <Donut
              value={occ}
              max={cap}
              center={
                <div>
                  <div className="num text-[21px] font-bold text-ink">{pct((occ / cap) * 100)}</div>
                  <div className="num text-[10px] text-mute">
                    {occ}/{cap}
                  </div>
                </div>
              }
            />
            <div className="min-w-0 flex-1 space-y-3">
              {parkingLots.map((p, i) => {
                const pr = (p.occupied / p.capacity) * 100;
                return (
                  <div key={i}>
                    <div className="mb-1 flex items-baseline justify-between gap-2">
                      <span className="truncate text-[12px] text-dim">{l(p.name)}</span>
                      <span className="num shrink-0 text-[11.5px] font-semibold text-ink">
                        {p.occupied}
                        <span className="text-mute">/{p.capacity}</span>
                        <span className={`ml-1.5 ${pr >= 85 ? "text-danger" : pr >= 70 ? "text-warn" : "text-ok"}`}>{pct(pr)}</span>
                      </span>
                    </div>
                    <Bar value={p.occupied} max={p.capacity} threshold={85} />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-4">
            <Chart data={parkingHourly} series={occSeries} height={168} refLines={[{ y: 316, label: lang === "tr" ? "%85 eşik" : "85% threshold", color: C.warn }]} />
          </div>
        </Card>

        <Card>
          <CardHead
            title={ls("Son plaka kayıtları", "Latest plate reads")}
            sub={ls("Giriş / çıkış · kamera bazlı", "Entry / exit · by camera")}
            icon={ScanLine}
            tone="ok"
            right={
              <Btn size="sm" onClick={() => nav("/lpr")}>
                {lang === "tr" ? "Tümü" : "All"}
              </Btn>
            }
          />
          <Table head={[ls("Plaka", "Plate"), ls("Saat", "Time"), ls("Yön", "Dir"), ls("Kamera", "Camera"), ls("Etiket", "Tag")]}>
            {plateLog.slice(0, 8).map((p, i) => (
              <Tr key={i}>
                <Td className="num font-bold text-ink">{p.plate}</Td>
                <Td className="num">{p.at}</Td>
                <Td>
                  <Badge tone={p.dir === "in" ? "accent" : "mute"}>
                    {p.dir === "in" ? (lang === "tr" ? "giriş" : "in") : lang === "tr" ? "çıkış" : "out"}
                  </Badge>
                </Td>
                <Td className="num">{p.camera}</Td>
                <Td>
                  <Badge tone={p.tone}>{l(p.tag)}</Badge>
                </Td>
              </Tr>
            ))}
          </Table>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.15fr_1fr]">
        <Card>
          <CardHead
            title={ls("Otopark kameraları", "Car park cameras")}
            sub={ls("Araç tespiti, plaka okuma ve yanlış park bölgeleri", "Vehicle detection, plate reads and illegal parking zones")}
            icon={Car}
          />
          <div className="grid gap-3 sm:grid-cols-3">
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
                    zone={ev?.zone}
                    compact
                  />
                  <div className="mt-1.5 flex items-center justify-between gap-2">
                    <span className="truncate text-[10.5px] text-dim">{l(cam.name)}</span>
                    <span className="num shrink-0 text-[10.5px] font-bold text-accent">
                      {cam.capacity ? `${cam.count}/${cam.capacity}` : cam.count}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <CardHead
            title={ls("Otopark olayları", "Car park events")}
            sub={ls("Yanlış park ve plaka bildirimleri", "Illegal parking and plate alerts")}
            icon={TriangleAlert}
            tone="warn"
          />
          <EventList events={eventsOf("parking")} />
        </Card>
      </div>
    </>
  );
}

import { BedDouble, ClipboardCheck, ShoppingCart, Sparkles, Timer } from "lucide-react";
import { AiSummary } from "../components/AiSummary";
import { CameraFrame } from "../components/CameraFrame";
import { C, Chart, RankBars } from "../components/charts";
import { EventList } from "../components/events";
import { Badge, Bar, Card, CardHead, Insight, Kpi, PageHead, Table, Td, Tr } from "../components/ui";
import { camerasOf } from "../data/hotel";
import { EVENTS, eventsOf } from "../data/events";
import { floorSop, sopSteps } from "../data/series";
import { ls, useFmt, useLang } from "../i18n";
import { DEMO_NOW, hhmm, hhmmss } from "../lib/util";

const sopSeries = [{ key: "sop", name: ls("SOP uyumu (%)", "SOP compliance (%)"), color: C.violet, type: "bar" as const }];

export default function Housekeeping() {
  const { l, lang } = useLang();
  const { n, pct } = useFmt();
  const trolleyEvent = EVENTS.find((e) => e.id === "EV-2411")!;
  const cams = camerasOf("housekeeping");
  const totalRooms = floorSop.reduce((s, f) => s + f.rooms, 0);
  const doneRooms = floorSop.reduce((s, f) => s + f.done, 0);

  return (
    <>
      <PageHead
        title={ls("Housekeeping · SOP & Koridor Kontrolü", "Housekeeping · SOP & Corridor Control")}
        sub={ls(
          "3 kamera · temizlik adımlarının doğrulanması, koridorda bırakılan ekipman takibi",
          "3 cameras · cleaning step verification, tracking equipment left in corridors"
        )}
        right={<Badge tone="warn" icon={ShoppingCart}>{lang === "tr" ? "4 koridor uyarısı" : "4 corridor alerts"}</Badge>}
      />

      <AiSummary
        actions={false}
        title={ls("Housekeeping yorumu", "Housekeeping insight")}
        text={ls(
          "Bugün **271/342 oda** tamamlandı (**%79**). Genel SOP uyumu **%91**, ancak **4. kat %82** ile en zayıf halka — aynı katta **2 servis arabası uyarısı** var ve koridorda 22 dakika bırakılmış araba tespit edildi. En çok atlanan adım **mini bar kontrolü (%84)**; ikinci sırada **kirli çarşaf ayrımı (%89)**. Oda başına ortalama temizlik süresi **26 dk**, suit katında **41 dk**.",
          "**271/342 rooms** were completed today (**79%**). Overall SOP compliance is **91%**, but **floor 4 at 82%** is the weakest link — it also has **2 trolley alerts**, including a cart left in the corridor for 22 minutes. The most skipped step is the **mini bar check (84%)**, followed by **soiled linen separation (89%)**. Average cleaning time per room is **26 min**, rising to **41 min** on the suite floor."
        )}
      />

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Kpi label={ls("Tamamlanan oda", "Rooms completed")} value={n(doneRooms)} unit={`/ ${totalRooms}`} icon={BedDouble} tone="accent" delta="+12" deltaGood sub={pct((doneRooms / totalRooms) * 100)} />
        <Kpi label={ls("SOP uyumu", "SOP compliance")} value={pct(91)} icon={ClipboardCheck} tone="ok" delta="+3%" deltaGood sub={ls("hedef %95", "target 95%")} />
        <Kpi label={ls("Ort. oda süresi", "Avg. room time")} value="26" unit={lang === "tr" ? "dk" : "min"} icon={Timer} tone="accent" delta="-2" deltaGood />
        <Kpi label={ls("Koridor uyarısı", "Corridor alerts")} value="4" icon={ShoppingCart} tone="warn" delta="+2" deltaGood={false} sub={ls("15 dk SOP limiti", "15 min SOP limit")} />
        <Kpi label={ls("En zayıf kat", "Weakest floor")} value="4" icon={BedDouble} tone="danger" sub={ls("SOP %82", "SOP 82%")} />
        <Kpi label={ls("Atlanan adım", "Skipped step")} value={pct(16)} icon={ClipboardCheck} tone="warn" sub={ls("mini bar kontrolü", "mini bar check")} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_1fr]">
        <Card>
          <CardHead
            title={ls("Kat bazında durum", "Status by floor")}
            sub={ls("Tamamlanan oda, SOP uyumu ve koridor uyarıları", "Rooms completed, SOP compliance and corridor alerts")}
            icon={BedDouble}
          />
          <Table
            head={[
              ls("Kat", "Floor"),
              ls("Oda", "Rooms"),
              ls("İlerleme", "Progress"),
              ls("SOP", "SOP"),
              ls("Uyarı", "Alerts"),
            ]}
          >
            {floorSop.map((f, i) => (
              <Tr key={i}>
                <Td className="font-semibold text-ink">{l(f.floor)}</Td>
                <Td className="num">
                  {f.done}/{f.rooms}
                </Td>
                <Td className="w-28">
                  <Bar value={f.done} max={f.rooms} height={5} />
                </Td>
                <Td>
                  <span className={`num font-bold ${f.sop >= 95 ? "text-ok" : f.sop >= 88 ? "text-warn" : "text-danger"}`}>
                    {pct(f.sop)}
                  </span>
                </Td>
                <Td>
                  {f.trolleyAlerts ? <Badge tone={f.trolleyAlerts > 1 ? "danger" : "warn"}>{f.trolleyAlerts}</Badge> : <span className="text-mute">—</span>}
                </Td>
              </Tr>
            ))}
          </Table>
          <div className="mt-4">
            <Chart
              data={floorSop.map((f) => ({ t: l(f.floor).replace(/[^0-9]/g, "") || l(f.floor), sop: f.sop }))}
              series={sopSeries}
              height={168}
              refLines={[{ y: 95, label: lang === "tr" ? "hedef %95" : "target 95%", color: C.ok }]}
            />
          </div>
        </Card>

        <Card>
          <CardHead
            title={ls("Koridor — bırakılmış ekipman", "Corridor — left equipment")}
            sub={ls("CAM-50 · servis arabası 22 dakikadır aynı noktada", "CAM-50 · trolley parked for 22 minutes")}
            icon={ShoppingCart}
            tone="warn"
            right={<Badge tone="warn">{lang === "tr" ? "SOP ihlali" : "SOP breach"}</Badge>}
          />
          <CameraFrame
            kind="corridor"
            seed="CAM-50"
            cameraId="CAM-50"
            name={lang === "tr" ? "4. kat koridor — batı" : "Floor 4 corridor — west"}
            time={hhmmss(trolleyEvent.at)}
            boxes={trolleyEvent.boxes}
          />
          <div className="mt-3">
            <Insight tone="warn" icon={Timer}>
              {lang === "tr"
                ? "Kural: servis arabası aynı koridor noktasında 15 dakikadan uzun kalırsa kat görevlisine ve housekeeping şefine bildirim gider. Bu olay 22:14 süreyle tespit edildi."
                : "Rule: if a trolley stays at the same corridor point for more than 15 minutes, the floor attendant and housekeeping supervisor are notified. This event lasted 22:14."}
            </Insight>
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHead
            title={ls("SOP adım uyumu", "SOP step compliance")}
            sub={ls("Kamera ile doğrulanan temizlik adımları", "Cleaning steps verified by camera")}
            icon={ClipboardCheck}
            tone="violet"
          />
          <RankBars
            items={sopSteps.map((s) => ({
              label: s.step,
              value: s.rate,
              tone: s.rate >= 95 ? "ok" : s.rate >= 88 ? "accent" : "warn",
            }))}
            max={100}
            unit="%"
          />
        </Card>

        <Card>
          <CardHead
            title={ls("Housekeeping kameraları", "Housekeeping cameras")}
            sub={ls("Koridor ve çamaşırhane", "Corridors and laundry")}
            icon={Sparkles}
          />
          <div className="space-y-3">
            {cams.map((cam) => (
              <div key={cam.id}>
                <CameraFrame
                  kind={cam.kind}
                  seed={cam.id}
                  cameraId={cam.id}
                  time={hhmm(DEMO_NOW)}
                  status={cam.status}
                  compact
                  boxes={EVENTS.find((e) => e.cameraId === cam.id)?.boxes ?? []}
                />
                <div className="mt-1.5 truncate text-[10.5px] text-mute">{l(cam.name)}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHead
            title={ls("Housekeeping olayları", "Housekeeping events")}
            sub={ls("SOP, loitering ve ekipman bildirimleri", "SOP, loitering and equipment alerts")}
            icon={ClipboardCheck}
            tone="danger"
          />
          <EventList events={eventsOf("housekeeping")} showThumb={false} />
        </Card>
      </div>
    </>
  );
}

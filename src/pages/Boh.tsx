import { DoorOpen, MoonStar, Truck, Warehouse, ShieldAlert } from "lucide-react";
import { AiSummary } from "../components/AiSummary";
import { CameraFrame } from "../components/CameraFrame";
import { C, Chart, Legend } from "../components/charts";
import { EventList } from "../components/events";
import { Badge, Card, CardHead, Insight, Kpi, PageHead, Table, Td, Tr } from "../components/ui";
import { cameraById, camerasOf } from "../data/hotel";
import { EVENTS, eventsOf } from "../data/events";
import { bohZones, dockActivity } from "../data/series";
import { ls, useLang } from "../i18n";
import { DEMO_NOW, hhmm, hhmmss } from "../lib/util";

const dockSeries = [
  { key: "trucks", name: ls("Araç", "Vehicles"), color: C.warn, type: "bar" as const },
  { key: "staff", name: ls("Personel", "Staff"), color: C.accent, type: "line" as const },
];

export default function Boh() {
  const { l, lang } = useLang();
  const unauthorized = EVENTS.find((e) => e.id === "EV-2415")!;
  const cams = camerasOf("boh");

  return (
    <>
      <PageHead
        title={ls("Back-of-House Güvenliği", "Back-of-House Security")}
        sub={ls(
          "4 kamera · personel alanı yetkisiz giriş, depo mesai dışı hareket, rampa hareketleri",
          "4 cameras · staff area access control, after-hours storage motion, dock movements"
        )}
        right={<Badge tone="danger" icon={ShieldAlert}>{lang === "tr" ? "1 kritik yetkisiz giriş" : "1 critical unauthorized entry"}</Badge>}
      />

      <AiSummary
        actions={false}
        title={ls("Back-of-house yorumu", "Back-of-house insight")}
        text={ls(
          "Kritik: **turnike kaydı olmayan 1 kişi** BOH koridoruna girdi, üniforma tespit edilmedi — güvenlik müdahalesi devam ediyor. Son 24 saatte **4 tailgating** olayı var (tek kart, iki geçiş); bu davranış personel girişinde tekrar ediyor. **Ana depoda 02:40'ta mesai dışı hareket** doğrulandı, yetkili personel olduğu teyit edildi. **Yükleme rampası 6 olay** ile en riskli bölge: araç ve personel akışı aynı hatta ilerliyor. **CAM-63 (mutfak servis koridoru) 2 sa 26 dk offline** — kör nokta oluştu, iş emri #4821 açık.",
          "Critical: **one person with no turnstile record** entered the BOH corridor with no uniform detected — security is still engaged. There were **4 tailgating** events in the last 24 hours (one badge, two passages), repeating at the staff entrance. **After-hours motion in main storage at 02:40** was verified as authorized staff. The **loading dock leads with 6 events**: vehicle and staff flows share the same lane. **CAM-63 (kitchen service corridor) has been offline for 2 h 26 min** — a blind spot, work order #4821 is open."
        )}
      />

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label={ls("Yetkisiz giriş (24 sa)", "Unauthorized entries (24h)")} value="1" icon={ShieldAlert} tone="danger" sub={ls("kritik · aktif", "critical · active")} />
        <Kpi label={ls("Tailgating", "Tailgating")} value="4" icon={DoorOpen} tone="warn" delta="+1" deltaGood={false} sub={ls("personel turnikesi", "staff turnstile")} />
        <Kpi label={ls("Mesai dışı hareket", "After-hours motion")} value="2" icon={MoonStar} tone="warn" sub={ls("ana depo", "main storage")} />
        <Kpi label={ls("Rampa hareketi", "Dock movements")} value="20" icon={Truck} tone="accent" sub={ls("bugün · 05:00–12:00", "today · 05:00–12:00")} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_1fr]">
        <Card>
          <CardHead
            title={ls("Yetkisiz giriş — snapshot", "Unauthorized entry — snapshot")}
            sub={ls("CAM-60 · kısıtlı bölge ihlali, kart eşleşmesi yok", "CAM-60 · restricted zone breach, no badge match")}
            icon={ShieldAlert}
            tone="danger"
            right={<Badge tone="danger">{lang === "tr" ? "kritik" : "critical"}</Badge>}
          />
          <CameraFrame
            kind="staff"
            seed="CAM-60"
            cameraId="CAM-60"
            name={lang === "tr" ? "Personel girişi — turnike" : "Staff entrance — turnstile"}
            time={hhmmss(unauthorized.at)}
            boxes={unauthorized.boxes}
            zone={unauthorized.zone}
          />
          <div className="mt-3">
            <Insight tone="danger" icon={ShieldAlert}>
              {lang === "tr"
                ? "Kural: kısıtlı bölgeye giren her kişi için turnike kart kaydı ile eşleşme aranır. Eşleşme yoksa 5 saniye içinde güvenlik masasına alarm ve snapshot gönderilir."
                : "Rule: every person entering a restricted zone is matched against turnstile badge records. With no match, an alarm and snapshot reach the security desk within 5 seconds."}
            </Insight>
          </div>
        </Card>

        <Card>
          <CardHead
            title={ls("Bölge risk tablosu", "Zone risk table")}
            sub={ls("24 saatlik olay sayısı ve ana risk tipi", "24-hour event count and primary risk type")}
            icon={Warehouse}
          />
          <Table head={[ls("Bölge", "Zone"), ls("Kamera", "Camera"), ls("Ana risk", "Primary risk"), ls("24 sa", "24h")]}>
            {bohZones.map((z, i) => (
              <Tr key={i}>
                <Td className="font-semibold text-ink">{l(z.zone)}</Td>
                <Td className="num">{z.cameraId}</Td>
                <Td>{l(z.risk)}</Td>
                <Td>
                  <Badge tone={z.tone}>{z.events24h}</Badge>
                </Td>
              </Tr>
            ))}
          </Table>
          <div className="mt-4">
            <CardHead
              title={ls("Yükleme rampası hareketleri", "Loading dock activity")}
              sub={ls("Araç ve personel sayımı — saat bazında", "Vehicle and staff counts by hour")}
              icon={Truck}
              tone="warn"
              right={<Legend series={dockSeries} />}
            />
            <Chart data={dockActivity} series={dockSeries} height={168} />
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.15fr_1fr]">
        <Card>
          <CardHead
            title={ls("Back-of-house kameraları", "Back-of-house cameras")}
            sub={ls("Turnike, depo, rampa ve servis koridoru", "Turnstile, storage, dock and service corridor")}
            icon={Warehouse}
          />
          <div className="grid gap-3 sm:grid-cols-2">
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
                <div className="mt-1.5 flex items-center justify-between gap-2">
                  <span className="truncate text-[10.5px] text-dim">{l(cam.name)}</span>
                  <Badge tone={cam.status === "online" ? "ok" : cam.status === "degraded" ? "warn" : "danger"}>
                    {cam.status === "online" ? (lang === "tr" ? "aktif" : "online") : cam.status === "degraded" ? "low fps" : "offline"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3">
            <Insight tone="warn" icon={Warehouse}>
              {lang === "tr" ? (
                <>
                  <b className="text-ink">{cameraById("CAM-63") ? l(cameraById("CAM-63")!.name) : "CAM-63"}</b> 2 sa 26 dk
                  offline — mutfak servis koridorunda kör nokta var. Teknik servis iş emri #4821 açık.
                </>
              ) : (
                <>
                  <b className="text-ink">{cameraById("CAM-63") ? l(cameraById("CAM-63")!.name) : "CAM-63"}</b> has been
                  offline for 2 h 26 min — blind spot in the kitchen service corridor. Work order #4821 is open.
                </>
              )}
            </Insight>
          </div>
        </Card>

        <Card>
          <CardHead
            title={ls("Back-of-house olayları", "Back-of-house events")}
            sub={ls("Yetkisiz giriş, tailgating, mesai dışı hareket, duman", "Unauthorized access, tailgating, after-hours motion, smoke")}
            icon={ShieldAlert}
            tone="danger"
          />
          <EventList events={eventsOf("boh")} />
        </Card>
      </div>
    </>
  );
}

import { useState } from "react";
import { Bell, ClipboardList, Plus, SlidersHorizontal } from "lucide-react";
import { Badge, Btn, Card, Kpi, PageHead } from "../components/ui";
import { TYPE_ICON } from "../components/events";
import { EVENT_TYPE_META, type EventType } from "../data/events";
import { AREAS, type AreaId } from "../data/hotel";
import { ls, useLang, type LS } from "../i18n";
import { cx } from "../lib/util";

type Rule = {
  id: string;
  type: EventType;
  area: AreaId;
  name: LS;
  condition: LS;
  action: LS;
  severity: "critical" | "high" | "medium" | "low";
  enabled: boolean;
  triggered24h: number;
};

const RULES: Rule[] = [
  {
    id: "R-01",
    type: "queue_threshold",
    area: "reception",
    name: ls("Resepsiyon ek banko kuralı", "Reception extra desk rule"),
    condition: ls("3+ kişi 120 sn'den uzun beklerse", "3+ guests waiting longer than 120 s"),
    action: ls("Ön büro şefine bildirim + LCD güncelleme", "Notify front office manager + update LCD"),
    severity: "high",
    enabled: true,
    triggered24h: 6,
  },
  {
    id: "R-02",
    type: "wait_time",
    area: "reception",
    name: ls("Check-in SLA ihlali", "Check-in SLA breach"),
    condition: ls("Ortalama bekleme > 3:00 dk", "Average wait > 3:00"),
    action: ls("Vardiya özetine ekle + otel müdürüne rapor", "Add to shift digest + report to GM"),
    severity: "medium",
    enabled: true,
    triggered24h: 4,
  },
  {
    id: "R-03",
    type: "capacity",
    area: "wellness",
    name: ls("Havuz kapasite aşımı", "Pool capacity breach"),
    condition: ls("Doluluk ≥ %85 (102/120 kişi)", "Occupancy ≥ 85% (102/120 people)"),
    action: ls("Havuz bar + resepsiyon alarmı, LCD uyarısı", "Alarm to pool bar + reception, LCD notice"),
    severity: "high",
    enabled: true,
    triggered24h: 2,
  },
  {
    id: "R-04",
    type: "abandoned",
    area: "lobby",
    name: ls("Terk edilmiş nesne", "Abandoned object"),
    condition: ls("Nesne 90 sn boyunca sahipsiz (3 m yarıçap)", "Object unattended for 90 s (3 m radius)"),
    action: ls("Güvenlik telsizi + SMS + snapshot", "Security radio + SMS + snapshot"),
    severity: "critical",
    enabled: true,
    triggered24h: 1,
  },
  {
    id: "R-05",
    type: "unauthorized",
    area: "boh",
    name: ls("Personel alanı yetkisiz giriş", "Staff area unauthorized entry"),
    condition: ls("Kısıtlı bölgede kart eşleşmesi olmayan kişi", "Person in restricted zone with no badge match"),
    action: ls("Güvenlik masası alarmı + kapı kaydı", "Security desk alarm + door log"),
    severity: "critical",
    enabled: true,
    triggered24h: 1,
  },
  {
    id: "R-06",
    type: "loitering",
    area: "housekeeping",
    name: ls("Kat koridorunda loitering", "Loitering in guest corridor"),
    condition: ls("Aynı kişi 5 dk'dan uzun, oda girişi yok", "Same person > 5 min with no room entry"),
    action: ls("Güvenlik canlı izleme başlatır", "Security starts live monitoring"),
    severity: "high",
    enabled: true,
    triggered24h: 3,
  },
  {
    id: "R-07",
    type: "fall",
    area: "wellness",
    name: ls("Düşme / man-down", "Fall / man-down"),
    condition: ls("Yatay poz 8 sn'den uzun sürerse", "Horizontal pose longer than 8 s"),
    action: ls("Cankurtaran + sağlık ekibi + güvenlik", "Lifeguard + medical team + security"),
    severity: "critical",
    enabled: true,
    triggered24h: 1,
  },
  {
    id: "R-08",
    type: "smoke",
    area: "boh",
    name: ls("Duman / erken yangın uyarısı", "Smoke / early fire warning"),
    condition: ls("Duman paterni 10 sn + sıcaklık artışı", "Smoke pattern 10 s + temperature rise"),
    action: ls("Teknik servis + güvenlik + yangın paneli", "Technical + security + fire panel"),
    severity: "critical",
    enabled: true,
    triggered24h: 1,
  },
  {
    id: "R-09",
    type: "illegal_parking",
    area: "parking",
    name: ls("Yangın yolu / yanlış park", "Fire lane / illegal parking"),
    condition: ls("Belirlenen alan dışında 5 dk'dan uzun duran araç", "Vehicle outside allowed area for > 5 min"),
    action: ls("Vale ekibi bildirimi + plaka kaydı", "Notify valet team + log plate"),
    severity: "medium",
    enabled: true,
    triggered24h: 3,
  },
  {
    id: "R-10",
    type: "trolley",
    area: "housekeeping",
    name: ls("Koridorda bırakılan ekipman", "Equipment left in corridor"),
    condition: ls("Servis arabası aynı noktada 15 dk", "Trolley at the same point for 15 min"),
    action: ls("Kat görevlisi + housekeeping şefi", "Floor attendant + housekeeping supervisor"),
    severity: "medium",
    enabled: true,
    triggered24h: 4,
  },
  {
    id: "R-11",
    type: "sop",
    area: "housekeeping",
    name: ls("SOP adım kontrolü", "SOP step verification"),
    condition: ls("Beklenen temizlik adımı tespit edilmezse", "Expected cleaning step not detected"),
    action: ls("Eğitim notu + kat raporu", "Training note + floor report"),
    severity: "low",
    enabled: true,
    triggered24h: 7,
  },
  {
    id: "R-12",
    type: "after_hours",
    area: "boh",
    name: ls("Mesai dışı depo hareketi", "After-hours storage motion"),
    condition: ls("00:00–06:00 arası depoda hareket", "Motion in storage between 00:00–06:00"),
    action: ls("Vardiya amiri + kayıt", "Shift supervisor + log"),
    severity: "high",
    enabled: true,
    triggered24h: 2,
  },
  {
    id: "R-13",
    type: "tailgating",
    area: "boh",
    name: ls("Turnike tailgating", "Turnstile tailgating"),
    condition: ls("Tek kart okutmada 2+ kişi geçişi", "2+ people passing on a single badge read"),
    action: ls("İK bilgilendirme + kayıt", "Notify HR + log"),
    severity: "medium",
    enabled: true,
    triggered24h: 4,
  },
  {
    id: "R-14",
    type: "capacity",
    area: "banquet",
    name: ls("Balo salonu kapasite aşımı", "Ballroom capacity breach"),
    condition: ls("Doluluk ≥ %90 (405/450 kişi)", "Occupancy ≥ 90% (405/450 people)"),
    action: ls("Etkinlik sorumlusu + güvenlik + foyer LCD", "Event manager + security + foyer LCD"),
    severity: "high",
    enabled: true,
    triggered24h: 1,
  },
  {
    id: "R-15",
    type: "camera_health",
    area: "security",
    name: ls("Kamera sinyal kaybı", "Camera signal loss"),
    condition: ls("Akış 60 sn'den uzun kesilirse", "Stream interrupted for more than 60 s"),
    action: ls("Teknik servis iş emri", "Technical service work order"),
    severity: "medium",
    enabled: true,
    triggered24h: 1,
  },
  {
    id: "R-16",
    type: "dwell",
    area: "lobby",
    name: ls("Lobi dwell time sapması", "Lobby dwell time deviation"),
    condition: ls("Ortalama dwell normalin %30 üzerinde", "Average dwell 30% above normal"),
    action: ls("Ön büro analiz raporu", "Front office analysis report"),
    severity: "low",
    enabled: false,
    triggered24h: 0,
  },
];

export default function Rules() {
  const { l, lang } = useLang();
  const [rules, setRules] = useState(RULES);
  const [area, setArea] = useState<AreaId | "all">("all");

  const list = rules.filter((r) => area === "all" || r.area === area);
  const active = rules.filter((r) => r.enabled).length;

  return (
    <>
      <PageHead
        title={ls("Alarm Kuralları", "Alarm Rules")}
        sub={ls(
          "Hangi durumda kimin bilgilendirileceğini tanımlayan analitik kuralları",
          "Analytics rules that define who gets notified in which situation"
        )}
        right={
          <Btn variant="solid" icon={Plus}>
            {lang === "tr" ? "Yeni kural" : "New rule"}
          </Btn>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label={ls("Toplam kural", "Total rules")} value={String(rules.length)} icon={ClipboardList} tone="accent" />
        <Kpi label={ls("Aktif kural", "Active rules")} value={String(active)} icon={SlidersHorizontal} tone="ok" />
        <Kpi label={ls("Kritik kural", "Critical rules")} value={String(rules.filter((r) => r.severity === "critical").length)} icon={Bell} tone="danger" />
        <Kpi label={ls("24 saatte tetiklenme", "Triggered in 24h")} value={String(rules.reduce((s, r) => s + r.triggered24h, 0))} icon={Bell} tone="warn" />
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        <Btn size="sm" active={area === "all"} onClick={() => setArea("all")}>
          {lang === "tr" ? "Tüm bölgeler" : "All areas"}
        </Btn>
        {AREAS.map((a) => (
          <Btn key={a.id} size="sm" active={area === a.id} onClick={() => setArea(a.id)}>
            {l(a.name)}
          </Btn>
        ))}
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        {list.map((r) => {
          const Icon = TYPE_ICON[r.type];
          const meta = EVENT_TYPE_META[r.type];
          return (
            <Card key={r.id} className={cx(!r.enabled && "opacity-60")}>
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-panel3 text-accent">
                  <Icon size={15} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="num text-[10.5px] font-bold text-mute">{r.id}</span>
                    <Badge tone={r.severity === "critical" || r.severity === "high" ? "danger" : r.severity === "medium" ? "warn" : "accent"}>
                      {l(meta.label)}
                    </Badge>
                    <span className="ml-auto num text-[10.5px] text-mute">
                      {r.triggered24h} {lang === "tr" ? "tetik / 24sa" : "triggers / 24h"}
                    </span>
                  </div>
                  <h3 className="mt-1 text-[13px] font-semibold text-ink">{l(r.name)}</h3>
                  <div className="mt-2 space-y-1.5 text-[11.5px]">
                    <div className="flex gap-2">
                      <span className="w-14 shrink-0 text-mute">{lang === "tr" ? "Koşul" : "If"}</span>
                      <span className="text-dim">{l(r.condition)}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="w-14 shrink-0 text-mute">{lang === "tr" ? "Aksiyon" : "Then"}</span>
                      <span className="text-dim">{l(r.action)}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setRules((prev) => prev.map((x) => (x.id === r.id ? { ...x, enabled: !x.enabled } : x)))}
                  className={cx(
                    "mt-0.5 h-5 w-9 shrink-0 rounded-full p-0.5 transition",
                    r.enabled ? "bg-accent" : "bg-panel3"
                  )}
                  aria-label="toggle"
                >
                  <span
                    className={cx(
                      "block size-4 rounded-full bg-white transition",
                      r.enabled ? "translate-x-4" : "translate-x-0"
                    )}
                  />
                </button>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}

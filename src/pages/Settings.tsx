import { useState } from "react";
import { Bell, Building2, Cpu, Plug, Settings as Cog, Shield, Users } from "lucide-react";
import { Badge, Bar, Btn, Card, CardHead, PageHead, Table, Td, Tr } from "../components/ui";
import { DEMO_ROLES } from "../auth";
import { HOTEL } from "../data/hotel";
import { ls, useLang, type LS } from "../i18n";
import { cx } from "../lib/util";

const MODELS: { name: LS; cameras: number; accuracy: number; enabled: boolean }[] = [
  { name: ls("İnsan sayımı", "People counting"), cameras: 14, accuracy: 98.6, enabled: true },
  { name: ls("Kuyruk analizi", "Queue analytics"), cameras: 6, accuracy: 97.2, enabled: true },
  { name: ls("Dwell time", "Dwell time"), cameras: 8, accuracy: 95.4, enabled: true },
  { name: ls("Doluluk / kapasite", "Occupancy / capacity"), cameras: 11, accuracy: 97.9, enabled: true },
  { name: ls("Terk edilmiş nesne", "Abandoned object"), cameras: 5, accuracy: 91.3, enabled: true },
  { name: ls("Loitering", "Loitering"), cameras: 9, accuracy: 93.8, enabled: true },
  { name: ls("Yetkisiz giriş", "Unauthorized access"), cameras: 7, accuracy: 96.1, enabled: true },
  { name: ls("Düşme / man-down", "Fall / man-down"), cameras: 6, accuracy: 89.7, enabled: true },
  { name: ls("Agresif davranış", "Aggressive behaviour"), cameras: 4, accuracy: 84.2, enabled: true },
  { name: ls("Duman / yangın", "Smoke / fire"), cameras: 8, accuracy: 92.5, enabled: true },
  { name: ls("Plaka tanıma (LPR)", "Plate recognition (LPR)"), cameras: 3, accuracy: 97.4, enabled: true },
  { name: ls("Yanlış park", "Illegal parking"), cameras: 3, accuracy: 94.6, enabled: true },
  { name: ls("SOP kontrolü", "SOP verification"), cameras: 4, accuracy: 88.9, enabled: true },
  { name: ls("Maske / üniforma kontrolü", "Uniform compliance"), cameras: 2, accuracy: 90.1, enabled: false },
];

const INTEGRATIONS: { name: string; kind: LS; status: "connected" | "pending" | "off"; detail: LS }[] = [
  { name: "Opera PMS", kind: ls("Oda & misafir verisi", "Room & guest data"), status: "connected", detail: ls("Son senkron 09:30 · 5 dk periyot", "Last sync 09:30 · 5 min interval") },
  { name: "Simphony POS", kind: ls("F&B satış verisi", "F&B sales data"), status: "connected", detail: ls("Kuver ↔ doluluk eşleştirmesi", "Covers ↔ occupancy matching") },
  { name: "Hikvision NVR", kind: ls("Kamera akışı", "Camera streams"), status: "connected", detail: ls("38 kanal · RTSP", "38 channels · RTSP") },
  { name: "Salto Access", kind: ls("Kapı & turnike kaydı", "Door & turnstile logs"), status: "connected", detail: ls("Yetkisiz giriş eşleştirme", "Unauthorized access matching") },
  { name: "Microsoft Teams", kind: ls("Bildirim kanalı", "Alert channel"), status: "connected", detail: ls("Kritik olaylar · güvenlik kanalı", "Critical events · security channel") },
  { name: "WhatsApp Business", kind: ls("Bildirim kanalı", "Alert channel"), status: "pending", detail: ls("Doğrulama bekleniyor", "Awaiting verification") },
  { name: "Power BI", kind: ls("Veri ihracı", "Data export"), status: "off", detail: ls("Bağlantı tanımlı değil", "Connection not configured") },
];

export default function Settings() {
  const { l, lang } = useLang();
  const [models, setModels] = useState(MODELS);
  const [retention, setRetention] = useState(30);

  return (
    <>
      <PageHead
        title={ls("Ayarlar", "Settings")}
        sub={ls(
          "Tesis bilgileri, AI modelleri, entegrasyonlar, kullanıcılar ve veri saklama",
          "Property details, AI models, integrations, users and data retention"
        )}
        right={
          <Btn variant="solid" icon={Cog}>
            {lang === "tr" ? "Değişiklikleri kaydet" : "Save changes"}
          </Btn>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[1fr_1.25fr]">
        <div className="space-y-4">
          <Card>
            <CardHead
              title={ls("Tesis bilgileri", "Property details")}
              sub={ls("Panel başlığında ve raporlarda görünür", "Shown in the panel header and reports")}
              icon={Building2}
            />
            <div className="space-y-3">
              {[
                { k: ls("Tesis adı", "Property name"), v: l(HOTEL.property) },
                { k: ls("Oda sayısı", "Room count"), v: String(HOTEL.rooms) },
                { k: ls("Kamera sayısı", "Camera count"), v: "38" },
                { k: ls("Vardiya düzeni", "Shift pattern"), v: lang === "tr" ? "3 vardiya · 07:00 / 15:00 / 23:00" : "3 shifts · 07:00 / 15:00 / 23:00" },
                { k: ls("Zaman dilimi", "Time zone"), v: "Europe/Istanbul (UTC+3)" },
              ].map((f, i) => (
                <label key={i} className="block">
                  <span className="text-[10.5px] font-bold uppercase tracking-wide text-mute">{l(f.k)}</span>
                  <input
                    defaultValue={f.v}
                    className="mt-1 w-full rounded-lg border border-line bg-panel2 px-3 py-2 text-[12.5px] text-ink outline-none focus:border-accent/50"
                  />
                </label>
              ))}
            </div>
          </Card>

          <Card>
            <CardHead
              title={ls("Veri saklama & gizlilik", "Data retention & privacy")}
              sub={ls("KVKK / GDPR uyumu için görüntü saklama politikası", "Image retention policy for KVKK / GDPR compliance")}
              icon={Shield}
              tone="violet"
            />
            <div className="space-y-3">
              <div>
                <div className="mb-1.5 flex items-baseline justify-between">
                  <span className="text-[12px] text-dim">{lang === "tr" ? "Snapshot saklama süresi" : "Snapshot retention"}</span>
                  <span className="num text-[13px] font-bold text-accent">
                    {retention} {lang === "tr" ? "gün" : "days"}
                  </span>
                </div>
                <input
                  type="range"
                  min={7}
                  max={90}
                  value={retention}
                  onChange={(e) => setRetention(+e.target.value)}
                  className="w-full accent-[var(--c-accent)]"
                />
              </div>
              {[
                { k: ls("Yüz bulanıklaştırma", "Face blurring"), on: true, d: ls("Tüm misafir alanlarında zorunlu", "Mandatory in all guest areas") },
                { k: ls("Kimlik tanıma", "Face recognition"), on: false, d: ls("Kapalı — yalnızca anonim sayım", "Disabled — anonymous counting only") },
                { k: ls("Ham video kaydı", "Raw video recording"), on: false, d: ls("NVR'da tutulur, panelde saklanmaz", "Kept on NVR, not stored in the panel") },
                { k: ls("Olay görüntüsü dışa aktarım logu", "Snapshot export audit log"), on: true, d: ls("Her indirme kayıt altında", "Every download is logged") },
              ].map((s, i) => (
                <div key={i} className="flex items-start justify-between gap-3 rounded-xl border border-line bg-panel2 px-3 py-2.5">
                  <div className="min-w-0">
                    <div className="text-[12px] font-semibold text-ink">{l(s.k)}</div>
                    <div className="mt-0.5 text-[10.5px] text-mute">{l(s.d)}</div>
                  </div>
                  <Badge tone={s.on ? "ok" : "mute"}>
                    {s.on ? (lang === "tr" ? "açık" : "on") : lang === "tr" ? "kapalı" : "off"}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHead
              title={ls("Bildirim kanalları", "Notification channels")}
              sub={ls("Ciddiyet bazlı yönlendirme", "Severity based routing")}
              icon={Bell}
              tone="warn"
            />
            <div className="space-y-2">
              {[
                { k: ls("Panel içi bildirim", "In-panel alerts"), v: ls("Tüm seviyeler", "All levels"), tone: "ok" as const },
                { k: "SMS", v: ls("Yalnızca kritik", "Critical only"), tone: "danger" as const },
                { k: ls("Mobil push", "Mobile push"), v: ls("Kritik + yüksek", "Critical + high"), tone: "warn" as const },
                { k: ls("Telsiz / DECT", "Radio / DECT"), v: ls("Güvenlik olayları", "Security events"), tone: "danger" as const },
                { k: ls("E-posta özeti", "Email digest"), v: ls("Vardiya sonu", "End of shift"), tone: "accent" as const },
              ].map((c, i) => (
                <div key={i} className="flex items-center justify-between gap-2 rounded-xl border border-line bg-panel2 px-3 py-2">
                  <span className="text-[12px] text-dim">{l(c.k)}</span>
                  <Badge tone={c.tone}>{l(c.v)}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHead
              title={ls("AI modelleri", "AI models")}
              sub={ls("Kamera başına atanan modeller ve doğruluk oranları", "Models assigned per camera with accuracy rates")}
              icon={Cpu}
              right={<Badge tone="accent">{models.filter((m) => m.enabled).length} {lang === "tr" ? "aktif" : "active"}</Badge>}
            />
            <div className="space-y-2">
              {models.map((m, i) => (
                <div
                  key={i}
                  className={cx(
                    "flex items-center gap-3 rounded-xl border border-line bg-panel2 px-3 py-2.5",
                    !m.enabled && "opacity-55"
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-[12px] font-semibold text-ink">{l(m.name)}</span>
                      <span className="num shrink-0 text-[11px] text-mute">
                        {m.cameras} {lang === "tr" ? "kamera" : "cams"}
                      </span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-2">
                      <Bar value={m.accuracy} max={100} height={5} tone={m.accuracy >= 95 ? "ok" : m.accuracy >= 90 ? "accent" : "warn"} />
                      <span className="num shrink-0 text-[10.5px] font-semibold text-dim">{m.accuracy.toFixed(1)}%</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setModels((prev) => prev.map((x, xi) => (xi === i ? { ...x, enabled: !x.enabled } : x)))}
                    className={cx("h-5 w-9 shrink-0 rounded-full p-0.5 transition", m.enabled ? "bg-accent" : "bg-panel3")}
                    aria-label="toggle"
                  >
                    <span className={cx("block size-4 rounded-full bg-white transition", m.enabled ? "translate-x-4" : "translate-x-0")} />
                  </button>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHead
              title={ls("Entegrasyonlar", "Integrations")}
              sub={ls("PMS, POS, NVR, erişim kontrolü ve bildirim kanalları", "PMS, POS, NVR, access control and alert channels")}
              icon={Plug}
              tone="ok"
            />
            <Table head={[ls("Sistem", "System"), ls("Tür", "Type"), ls("Detay", "Detail"), ls("Durum", "Status")]}>
              {INTEGRATIONS.map((it, i) => (
                <Tr key={i}>
                  <Td className="font-semibold text-ink">{it.name}</Td>
                  <Td>{l(it.kind)}</Td>
                  <Td className="text-[11px]">{l(it.detail)}</Td>
                  <Td>
                    <Badge tone={it.status === "connected" ? "ok" : it.status === "pending" ? "warn" : "mute"}>
                      {it.status === "connected"
                        ? lang === "tr"
                          ? "bağlı"
                          : "connected"
                        : it.status === "pending"
                          ? lang === "tr"
                            ? "beklemede"
                            : "pending"
                          : lang === "tr"
                            ? "kapalı"
                            : "off"}
                    </Badge>
                  </Td>
                </Tr>
              ))}
            </Table>
          </Card>

          <Card>
            <CardHead
              title={ls("Kullanıcılar & yetkiler", "Users & permissions")}
              sub={ls("Demo hesaplar — her rol farklı ekran setini görür", "Demo accounts — each role sees a different screen set")}
              icon={Users}
            />
            <Table head={[ls("Kullanıcı", "User"), ls("Rol", "Role"), ls("Kapsam", "Scope"), ls("Erişim", "Access")]}>
              {DEMO_ROLES.map((r) => (
                <Tr key={r.id}>
                  <Td className="font-semibold text-ink">{l(r.name)}</Td>
                  <Td>{l(r.title)}</Td>
                  <Td className="text-[11px]">{l(r.scope)}</Td>
                  <Td>
                    <Badge tone={r.allowed === "*" ? "violet" : "accent"}>
                      {r.allowed === "*" ? (lang === "tr" ? "tam yetki" : "full") : `${r.allowed.length} ${lang === "tr" ? "ekran" : "screens"}`}
                    </Badge>
                  </Td>
                </Tr>
              ))}
            </Table>
          </Card>
        </div>
      </div>
    </>
  );
}

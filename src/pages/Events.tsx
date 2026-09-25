import { useMemo, useState } from "react";
import { Bell, CheckCircle2, Clock, Siren } from "lucide-react";
import { RankBars } from "../components/charts";
import { EventList, TYPE_ICON } from "../components/events";
import { Badge, Btn, Card, CardHead, Kpi, PageHead } from "../components/ui";
import {
  EVENTS,
  EVENT_TYPE_META,
  STATUS_META,
  type EventStatus,
  type EventType,
} from "../data/events";
import { AREAS, type AreaId } from "../data/hotel";
import { eventsByType } from "../data/series";
import { ls, useLang } from "../i18n";
import { severityRank } from "../lib/util";

export default function Events() {
  const { l, lang } = useLang();
  const [area, setArea] = useState<AreaId | "all">("all");
  const [status, setStatus] = useState<EventStatus | "all">("all");
  const [type, setType] = useState<EventType | "all">("all");

  const list = useMemo(
    () =>
      [...EVENTS]
        .filter(
          (e) =>
            (area === "all" || e.area === area) &&
            (status === "all" || e.status === status) &&
            (type === "all" || e.type === type)
        )
        .sort((a, b) => +b.at - +a.at || severityRank[b.severity] - severityRank[a.severity]),
    [area, status, type]
  );

  const counts = {
    new: EVENTS.filter((e) => e.status === "new").length,
    ack: EVENTS.filter((e) => e.status === "ack").length,
    resolved: EVENTS.filter((e) => e.status === "resolved").length,
    critical: EVENTS.filter((e) => e.severity === "critical").length,
  };

  const activeTypes = Array.from(new Set(EVENTS.map((e) => e.type)));

  return (
    <>
      <PageHead
        title={ls("Olaylar & Bildirimler", "Events & Alerts")}
        sub={ls(
          "Tüm bölgelerden gelen AI bildirimleri · görüntü, öneri ve aksiyon geçmişi",
          "AI alerts from every area · snapshot, recommendation and action history"
        )}
        right={
          <div className="flex flex-wrap gap-1.5">
            <Btn size="sm" active={status === "all"} onClick={() => setStatus("all")}>
              {lang === "tr" ? "Tümü" : "All"}
            </Btn>
            {(["new", "ack", "resolved"] as EventStatus[]).map((s) => (
              <Btn key={s} size="sm" active={status === s} onClick={() => setStatus(s)}>
                {l(STATUS_META[s].label)}
              </Btn>
            ))}
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label={ls("Yeni bildirim", "New alerts")} value={String(counts.new)} icon={Bell} tone="danger" sub={ls("aksiyon bekliyor", "awaiting action")} />
        <Kpi label={ls("İnceleniyor", "Acknowledged")} value={String(counts.ack)} icon={Clock} tone="warn" sub={ls("ekip atandı", "team assigned")} />
        <Kpi label={ls("Kapatıldı (24 sa)", "Resolved (24h)")} value={String(counts.resolved)} icon={CheckCircle2} tone="ok" />
        <Kpi label={ls("Kritik olay", "Critical events")} value={String(counts.critical)} icon={Siren} tone="danger" sub={ls("24 saat", "24 hours")} />
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex flex-wrap gap-1.5">
          <Btn size="sm" active={area === "all"} onClick={() => setArea("all")}>
            {lang === "tr" ? "Tüm bölgeler" : "All areas"}
          </Btn>
          {AREAS.map((a) => (
            <Btn key={a.id} size="sm" active={area === a.id} onClick={() => setArea(a.id)}>
              {l(a.name)}
            </Btn>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Btn size="sm" active={type === "all"} onClick={() => setType("all")}>
            {lang === "tr" ? "Tüm tipler" : "All types"}
          </Btn>
          {activeTypes.map((t) => (
            <Btn key={t} size="sm" icon={TYPE_ICON[t]} active={type === t} onClick={() => setType(t)}>
              {l(EVENT_TYPE_META[t].label)}
            </Btn>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHead
            title={ls("Bildirim akışı", "Alert stream")}
            sub={ls("Yeniden eskiye · snapshot için tıklayın", "Newest first · click for the snapshot")}
            icon={Siren}
            tone="danger"
            right={<Badge tone="mute">{list.length}</Badge>}
          />
          <EventList events={list} />
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHead
              title={ls("Tipe göre dağılım", "Distribution by type")}
              sub={ls("Son 7 gün · tüm bölgeler", "Last 7 days · all areas")}
              icon={Siren}
              tone="violet"
            />
            <RankBars
              items={eventsByType.map((t) => ({
                label: t.label,
                value: t.count,
                tone: ["unauthorized", "safety", "abandoned"].includes(t.key) ? "danger" : ["loitering", "parking", "capacity"].includes(t.key) ? "warn" : "accent",
              }))}
            />
          </Card>

          <Card>
            <CardHead
              title={ls("Bildirim kanalları", "Alert channels")}
              sub={ls("Olay ciddiyetine göre yönlendirme", "Routing based on severity")}
              icon={Bell}
            />
            <div className="space-y-2">
              {[
                { k: ls("Kritik olay", "Critical event"), v: ls("Panel + SMS + telsiz + LCD", "Panel + SMS + radio + LCD"), tone: "danger" as const },
                { k: ls("Yüksek", "High"), v: ls("Panel + mobil bildirim", "Panel + mobile push"), tone: "warn" as const },
                { k: ls("Orta", "Medium"), v: ls("Panel + vardiya özeti", "Panel + shift digest"), tone: "accent" as const },
                { k: ls("Düşük", "Low"), v: ls("Sadece rapor", "Report only"), tone: "mute" as const },
              ].map((c, i) => (
                <div key={i} className="flex items-center justify-between gap-2 rounded-xl border border-line bg-panel2 px-3 py-2">
                  <Badge tone={c.tone}>{l(c.k)}</Badge>
                  <span className="truncate text-[11.5px] text-dim">{l(c.v)}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

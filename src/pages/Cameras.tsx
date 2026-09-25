import { useMemo, useState } from "react";
import { Cpu, Search, Video, VideoOff, X } from "lucide-react";
import { CameraFrame } from "../components/CameraFrame";
import { EventList } from "../components/events";
import { Badge, Btn, Card, CardHead, Kpi, PageHead } from "../components/ui";
import { AREAS, CAMERAS, type AreaId, type Camera } from "../data/hotel";
import { EVENTS, eventsOfCamera } from "../data/events";
import { ls, useLang } from "../i18n";
import { DEMO_NOW, hhmm, hhmmss } from "../lib/util";

function CameraDetail({ cam, onClose }: { cam: Camera; onClose: () => void }) {
  const { l, lang } = useLang();
  const ev = EVENTS.find((e) => e.cameraId === cam.id);
  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
      <div className="fade-up card w-full max-w-3xl p-4">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="num text-[11px] font-bold text-mute">{cam.id}</span>
              <Badge tone={cam.status === "online" ? "ok" : cam.status === "degraded" ? "warn" : "danger"}>
                {cam.status === "online" ? (lang === "tr" ? "aktif" : "online") : cam.status === "degraded" ? "low fps" : "offline"}
              </Badge>
            </div>
            <h3 className="mt-1 text-[15px] font-bold text-ink">{l(cam.name)}</h3>
            <p className="text-[11.5px] text-mute">
              {l(cam.floor)} · {cam.fps} fps
            </p>
          </div>
          <button onClick={onClose} className="grid size-8 shrink-0 place-items-center rounded-lg border border-line bg-panel2 text-mute hover:text-ink">
            <X size={15} />
          </button>
        </div>
        <CameraFrame
          kind={cam.kind}
          seed={cam.id}
          cameraId={cam.id}
          name={l(cam.name)}
          time={hhmmss(DEMO_NOW)}
          status={cam.status}
          boxes={ev?.boxes ?? []}
          zone={ev?.zone}
        />
        <div className="mt-3 flex flex-wrap gap-1.5">
          {cam.models.map((m, i) => (
            <Badge key={i} tone="accent" icon={Cpu}>
              {l(m)}
            </Badge>
          ))}
          {cam.capacity && (
            <Badge tone="violet">
              {cam.count}/{cam.capacity} {lang === "tr" ? "kapasite" : "capacity"}
            </Badge>
          )}
        </div>
        <div className="mt-4">
          <CardHead title={ls("Bu kameranın olayları", "Events from this camera")} icon={Video} />
          <EventList events={eventsOfCamera(cam.id)} showThumb={false} empty={{ tr: "Son 24 saatte olay yok", en: "No events in the last 24 hours" }} />
        </div>
      </div>
      <button className="fixed inset-0 -z-10 cursor-default" onClick={onClose} aria-label="close" />
    </div>
  );
}

export default function Cameras() {
  const { l, lang } = useLang();
  const [area, setArea] = useState<AreaId | "all">("all");
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<Camera | null>(null);

  const list = useMemo(
    () =>
      CAMERAS.filter(
        (c) =>
          (area === "all" || c.area === area) &&
          (q.trim() === "" ||
            c.id.toLowerCase().includes(q.toLowerCase()) ||
            l(c.name).toLowerCase().includes(q.toLowerCase()))
      ),
    [area, q, l]
  );

  const online = CAMERAS.filter((c) => c.status === "online").length;

  return (
    <>
      <PageHead
        title={ls("Kameralar", "Cameras")}
        sub={ls(
          "Tüm kameralar, aktif AI modelleri ve anlık sayım değerleri",
          "All cameras, active AI models and live count values"
        )}
        right={
          <div className="flex items-center gap-1.5 rounded-lg border border-line bg-panel2 px-2.5">
            <Search size={13} className="text-mute" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={lang === "tr" ? "Kamera ara…" : "Search camera…"}
              className="h-8 w-40 bg-transparent text-[12px] text-ink outline-none placeholder:text-mute"
            />
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label={ls("Toplam kamera", "Total cameras")} value={String(CAMERAS.length)} icon={Video} tone="accent" />
        <Kpi label={ls("Aktif", "Online")} value={String(online)} icon={Video} tone="ok" sub={ls("AI analiz açık", "AI analysis on")} />
        <Kpi label={ls("Düşük fps", "Degraded")} value="1" icon={Video} tone="warn" sub="CAM-13" />
        <Kpi label={ls("Offline", "Offline")} value="1" icon={VideoOff} tone="danger" sub="CAM-63" />
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

      <Card className="mt-3">
        <CardHead
          title={ls("Kamera duvarı", "Camera wall")}
          sub={ls("Karede AI tespitleri gösterilir · detay için tıklayın", "AI detections are drawn on the frame · click for detail")}
          icon={Video}
          right={<Badge tone="mute">{list.length}</Badge>}
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {list.map((cam) => {
            const ev = EVENTS.find((e) => e.cameraId === cam.id);
            return (
              <div key={cam.id} className="rounded-xl border border-line bg-panel2 p-2">
                <CameraFrame
                  kind={cam.kind}
                  seed={cam.id}
                  cameraId={cam.id}
                  time={hhmm(DEMO_NOW)}
                  status={cam.status}
                  boxes={ev?.boxes ?? []}
                  compact
                  onClick={() => setSel(cam)}
                />
                <div className="mt-2 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate text-[11.5px] font-semibold text-ink">{l(cam.name)}</div>
                    <div className="truncate text-[10px] text-mute">
                      {l(cam.floor)} · {cam.fps} fps
                    </div>
                  </div>
                  <span className="num shrink-0 text-[11px] font-bold text-accent">
                    {cam.status === "offline" ? "—" : cam.capacity ? `${cam.count}/${cam.capacity}` : cam.count}
                  </span>
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {cam.models.slice(0, 2).map((m, i) => (
                    <span key={i} className="rounded bg-panel3 px-1.5 py-0.5 text-[9.5px] font-medium text-mute">
                      {l(m)}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {sel && <CameraDetail cam={sel} onClose={() => setSel(null)} />}
    </>
  );
}

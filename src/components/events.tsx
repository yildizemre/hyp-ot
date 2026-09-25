import { useState } from "react";
import {
  Briefcase,
  Car,
  Check,
  ClipboardCheck,
  Clock,
  DoorOpen,
  EyeOff,
  Flame,
  Gauge,
  Hourglass,
  MoonStar,
  PersonStanding,
  ScanLine,
  ShieldAlert,
  ShoppingCart,
  Swords,
  Timer,
  TrendingUp,
  Users,
  VideoOff,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import {
  EVENT_TYPE_META,
  SEVERITY_META,
  STATUS_META,
  type EventType,
  type VisionEvent,
} from "../data/events";
import { areaName, cameraById } from "../data/hotel";
import { useLang } from "../i18n";
import { cx, hhmmss, relTime } from "../lib/util";
import { CameraFrame } from "./CameraFrame";
import { Badge, Btn, Empty, TONE, type Tone } from "./ui";

export const TYPE_ICON: Record<EventType, LucideIcon> = {
  queue_threshold: Users,
  wait_time: Timer,
  capacity: Gauge,
  dwell: Hourglass,
  loitering: EyeOff,
  unauthorized: ShieldAlert,
  abandoned: Briefcase,
  aggression: Swords,
  fall: PersonStanding,
  smoke: Flame,
  illegal_parking: Car,
  lpr: ScanLine,
  after_hours: MoonStar,
  trolley: ShoppingCart,
  sop: ClipboardCheck,
  tailgating: DoorOpen,
  flow_spike: TrendingUp,
  camera_health: VideoOff,
};

const sevTone = (s: VisionEvent["severity"]): Tone => SEVERITY_META[s].tone;

/* ------------------------------------------------------------------ */

export function EventRow({
  ev,
  onOpen,
  showThumb = true,
}: {
  ev: VisionEvent;
  onOpen: (ev: VisionEvent) => void;
  showThumb?: boolean;
}) {
  const { l, lang } = useLang();
  const cam = cameraById(ev.cameraId);
  const meta = EVENT_TYPE_META[ev.type];
  const Icon = TYPE_ICON[ev.type];
  const tone = sevTone(ev.severity);

  return (
    <button
      onClick={() => onOpen(ev)}
      className={cx(
        "flex w-full items-start gap-3 rounded-xl border border-line bg-panel2 p-2.5 text-left transition hover:border-accent/40 hover:bg-panel3",
        ev.status === "new" && "border-l-2",
        ev.status === "new" && (tone === "danger" ? "border-l-danger" : tone === "warn" ? "border-l-warn" : "border-l-accent")
      )}
    >
      {showThumb && (
        <div className="w-28 shrink-0 sm:w-32">
          <CameraFrame
            kind={cam?.kind ?? "lobby"}
            seed={ev.id}
            boxes={ev.boxes}
            cameraId={ev.cameraId}
            time={hhmmss(ev.at)}
            status={cam?.status}
            compact
            live={false}
          />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge tone={meta.tone} icon={Icon}>
            {l(meta.label)}
          </Badge>
          <Badge tone={tone}>{l(SEVERITY_META[ev.severity].label)}</Badge>
          {ev.status !== "new" && (
            <span className="text-[10.5px] font-semibold text-mute">{l(STATUS_META[ev.status].label)}</span>
          )}
          <span className="ml-auto num shrink-0 text-[10.5px] text-mute">{relTime(ev.at, lang)}</span>
        </div>
        <p className="mt-1.5 text-[12.5px] font-semibold leading-snug text-ink">{l(ev.title)}</p>
        <p className="mt-0.5 line-clamp-2 text-[11.5px] leading-snug text-mute">{l(ev.detail)}</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10.5px] text-mute">
          <span className="num font-semibold text-dim">{ev.cameraId}</span>
          <span>·</span>
          <span className="truncate">{cam ? l(cam.name) : l(areaName(ev.area))}</span>
        </div>
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */

export function SnapshotModal({ ev, onClose }: { ev: VisionEvent; onClose: () => void }) {
  const { l, lang } = useLang();
  const cam = cameraById(ev.cameraId);
  const meta = EVENT_TYPE_META[ev.type];
  const Icon = TYPE_ICON[ev.type];
  const tone = sevTone(ev.severity);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
      <div className="fade-up card w-full max-w-4xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3 border-b border-line p-4">
          <div className="flex min-w-0 items-start gap-2.5">
            <span className={cx("mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg", TONE[meta.tone].bg, TONE[meta.tone].text)}>
              <Icon size={16} />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="num text-[11px] font-bold text-mute">{ev.id}</span>
                <Badge tone={tone}>{l(SEVERITY_META[ev.severity].label)}</Badge>
                <Badge tone="mute">{l(STATUS_META[ev.status].label)}</Badge>
              </div>
              <h3 className="mt-1 text-[15px] font-bold leading-snug text-ink">{l(ev.title)}</h3>
            </div>
          </div>
          <button onClick={onClose} className="grid size-8 shrink-0 place-items-center rounded-lg border border-line bg-panel2 text-mute transition hover:text-ink">
            <X size={15} />
          </button>
        </div>

        <div className="grid gap-4 p-4 lg:grid-cols-[1.45fr_1fr]">
          <div>
            <CameraFrame
              kind={cam?.kind ?? "lobby"}
              seed={ev.id}
              boxes={ev.boxes}
              zone={ev.zone}
              cameraId={ev.cameraId}
              name={cam ? l(cam.name) : undefined}
              time={hhmmss(ev.at)}
              status={cam?.status}
              live={false}
            />
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {cam?.models.map((m, i) => (
                <Badge key={i} tone="accent">
                  {l(m)}
                </Badge>
              ))}
              <span className="num ml-auto text-[10.5px] text-mute">
                {relTime(ev.at, lang)} · {hhmmss(ev.at)}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <h4 className="mb-1 text-[10.5px] font-bold uppercase tracking-wide text-mute">
                {lang === "tr" ? "Tespit" : "Detection"}
              </h4>
              <p className="text-[12.5px] leading-relaxed text-dim">{l(ev.detail)}</p>
            </div>

            <div className={cx("rounded-xl px-3 py-2.5 ring-1", TONE.accent.bg, TONE.accent.ring)}>
              <h4 className="mb-1 flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-wide text-accent">
                <Zap size={11} />
                {lang === "tr" ? "Önerilen aksiyon" : "Suggested action"}
              </h4>
              <p className="text-[12px] leading-relaxed text-dim">{l(ev.action)}</p>
            </div>

            <dl className="grid grid-cols-2 gap-2 text-[11.5px]">
              {[
                [lang === "tr" ? "Bölge" : "Area", l(areaName(ev.area))],
                [lang === "tr" ? "Kamera" : "Camera", ev.cameraId],
                [lang === "tr" ? "Model" : "Model", l(meta.label)],
                [lang === "tr" ? "Saat" : "Time", hhmmss(ev.at)],
              ].map(([k, v]) => (
                <div key={k} className="rounded-lg border border-line bg-panel2 px-2.5 py-2">
                  <dt className="text-[10px] uppercase tracking-wide text-mute">{k}</dt>
                  <dd className="mt-0.5 truncate text-[12px] font-semibold text-ink">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="flex flex-wrap gap-2 pt-1">
              <Btn variant="solid" icon={Check}>
                {lang === "tr" ? "Olayı kapat" : "Resolve"}
              </Btn>
              <Btn icon={Clock}>{lang === "tr" ? "Ertele" : "Snooze"}</Btn>
              <Btn icon={Users}>{lang === "tr" ? "Ekibe ata" : "Assign"}</Btn>
            </div>
          </div>
        </div>
      </div>
      <button className="fixed inset-0 -z-10 cursor-default" onClick={onClose} aria-label="close" />
    </div>
  );
}

/* ------------------------------------------------------------------ */

export function EventList({
  events,
  showThumb = true,
  empty,
  max,
}: {
  events: VisionEvent[];
  showThumb?: boolean;
  empty?: { tr: string; en: string };
  max?: number;
}) {
  const [open, setOpen] = useState<VisionEvent | null>(null);
  const list = max ? events.slice(0, max) : events;

  if (!list.length)
    return <Empty text={empty ?? { tr: "Bu filtre için olay yok", en: "No events for this filter" }} />;

  return (
    <>
      <div className="space-y-2">
        {list.map((ev) => (
          <EventRow key={ev.id} ev={ev} onOpen={setOpen} showThumb={showThumb} />
        ))}
      </div>
      {open && <SnapshotModal ev={open} onClose={() => setOpen(null)} />}
    </>
  );
}

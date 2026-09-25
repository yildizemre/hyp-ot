import { useMemo, useState } from "react";
import { ArrowDownToLine, ArrowUpFromLine, Search, ScanLine } from "lucide-react";
import { CameraFrame } from "../components/CameraFrame";
import { Badge, Btn, Card, CardHead, Kpi, PageHead, Table, Td, Tr } from "../components/ui";
import { plateLog } from "../data/series";
import { ls, useFmt, useLang } from "../i18n";
import { DEMO_NOW, hhmm } from "../lib/util";

export default function Lpr() {
  const { l, lang } = useLang();
  const { n, pct } = useFmt();
  const [q, setQ] = useState("");
  const [dir, setDir] = useState<"all" | "in" | "out">("all");
  const [sel, setSel] = useState(plateLog[0]);

  const rows = useMemo(
    () =>
      plateLog.filter(
        (p) => (dir === "all" || p.dir === dir) && p.plate.toLowerCase().includes(q.trim().toLowerCase())
      ),
    [q, dir]
  );

  return (
    <>
      <PageHead
        title={ls("Plaka Tanıma (LPR)", "Licence Plate Recognition")}
        sub={ls(
          "Giriş/çıkış kayıtları, VIP ve kara liste eşleşmeleri, tedarikçi rampa geçişleri",
          "Entry/exit records, VIP and blacklist matches, supplier dock movements"
        )}
        right={
          <div className="flex flex-wrap items-center gap-1.5">
            <div className="flex items-center gap-1.5 rounded-lg border border-line bg-panel2 px-2.5">
              <Search size={13} className="text-mute" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={lang === "tr" ? "Plaka ara…" : "Search plate…"}
                className="num h-8 w-32 bg-transparent text-[12px] text-ink outline-none placeholder:text-mute"
              />
            </div>
            {(["all", "in", "out"] as const).map((d) => (
              <Btn key={d} size="sm" active={dir === d} onClick={() => setDir(d)}>
                {d === "all" ? (lang === "tr" ? "Tümü" : "All") : d === "in" ? (lang === "tr" ? "Giriş" : "In") : lang === "tr" ? "Çıkış" : "Out"}
              </Btn>
            ))}
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label={ls("Bugün okuma", "Reads today")} value={n(398)} icon={ScanLine} tone="accent" delta="+6%" deltaGood />
        <Kpi label={ls("Tanıma doğruluğu", "Recognition accuracy")} value={pct(97.4, 1)} icon={ScanLine} tone="ok" sub={ls("gece dâhil", "incl. night")} />
        <Kpi label={ls("Giriş", "Entries")} value={n(214)} icon={ArrowDownToLine} tone="accent" />
        <Kpi label={ls("Çıkış", "Exits")} value={n(184)} icon={ArrowUpFromLine} tone="violet" />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.3fr_1fr]">
        <Card>
          <CardHead
            title={ls("Plaka kayıt defteri", "Plate log")}
            sub={ls("Satıra tıklayarak görüntüyü açın", "Click a row to load its frame")}
            icon={ScanLine}
            right={<Badge tone="mute">{rows.length}</Badge>}
          />
          <Table
            head={[
              ls("Plaka", "Plate"),
              ls("Saat", "Time"),
              ls("Yön", "Dir"),
              ls("Kamera", "Camera"),
              ls("Etiket", "Tag"),
            ]}
          >
            {rows.map((p, i) => (
              <Tr key={i} onClick={() => setSel(p)}>
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

        <Card>
          <CardHead
            title={ls("Okuma görüntüsü", "Read snapshot")}
            sub={`${sel.plate} · ${sel.camera} · ${sel.at}`}
            icon={ScanLine}
            tone="ok"
          />
          <CameraFrame
            kind={sel.camera === "CAM-62" ? "dock" : "gate"}
            seed={sel.plate}
            cameraId={sel.camera}
            time={`${sel.at}:12`}
            boxes={[
              {
                x: 0.3,
                y: 0.44,
                w: 0.34,
                h: 0.3,
                label: sel.plate,
                tone: sel.tone,
                conf: 0.97,
                shape: "vehicle",
              },
            ]}
          />
          <dl className="mt-3 grid grid-cols-2 gap-2 text-[11.5px]">
            {[
              [lang === "tr" ? "Plaka" : "Plate", sel.plate],
              [lang === "tr" ? "Yön" : "Direction", sel.dir === "in" ? (lang === "tr" ? "Giriş" : "Entry") : lang === "tr" ? "Çıkış" : "Exit"],
              [lang === "tr" ? "Kamera" : "Camera", sel.camera],
              [lang === "tr" ? "Etiket" : "Tag", l(sel.tag)],
              [lang === "tr" ? "Güven" : "Confidence", "%97"],
              [lang === "tr" ? "Bariyer" : "Barrier", sel.tone === "ok" ? (lang === "tr" ? "Otomatik açıldı" : "Auto opened") : lang === "tr" ? "Manuel" : "Manual"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-lg border border-line bg-panel2 px-2.5 py-2">
                <dt className="text-[10px] uppercase tracking-wide text-mute">{k}</dt>
                <dd className="num mt-0.5 truncate text-[12px] font-semibold text-ink">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-3">
            <CameraFrame
              kind="parking"
              seed="CAM-41-lpr"
              cameraId="CAM-41"
              name={lang === "tr" ? "P1 — A bloğu" : "P1 — Block A"}
              time={hhmm(DEMO_NOW)}
              compact
              boxes={[
                { x: 0.06, y: 0.46, w: 0.18, h: 0.16, label: "34 HZ 9010", tone: "ok", conf: 0.95, shape: "vehicle" },
                { x: 0.3, y: 0.46, w: 0.18, h: 0.16, label: "06 BLK 117", tone: "ok", conf: 0.93, shape: "vehicle" },
                { x: 0.54, y: 0.46, w: 0.18, h: 0.16, label: "34 ZR 7742", tone: "accent", conf: 0.91, shape: "vehicle" },
              ]}
            />
          </div>
        </Card>
      </div>
    </>
  );
}

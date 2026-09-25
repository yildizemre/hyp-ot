import { Monitor, MonitorOff, Users, Waves } from "lucide-react";
import { Badge, Bar, Card, CardHead, Kpi, PageHead, Table, Td, Tr } from "../components/ui";
import { Logo } from "../components/Layout";
import { lcdScreens } from "../data/series";
import { ls, useFmt, useLang } from "../i18n";
import { DEMO_NOW, hhmm } from "../lib/util";

function LcdFrame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div>
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-line bg-[#04080c] p-4">
        <div className="grid-bg absolute inset-0 opacity-60" />
        <div
          className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--c-accent), transparent 70%)" }}
        />
        <div className="relative flex h-full flex-col">{children}</div>
      </div>
      <div className="mt-1.5 text-[10.5px] text-mute">{label}</div>
    </div>
  );
}

export default function Screens() {
  const { l, lang } = useLang();
  const { pct } = useFmt();
  const online = lcdScreens.filter((s) => s.status === "online").length;

  return (
    <>
      <PageHead
        title={ls("LCD Ekranlar", "LCD Screens")}
        sub={ls(
          "Misafir ve personel ekranlarında yayınlanan canlı analitik içerikler",
          "Live analytics published on guest and staff facing screens"
        )}
        right={<Badge tone="ok" icon={Monitor}>{online}/{lcdScreens.length} {lang === "tr" ? "aktif" : "online"}</Badge>}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label={ls("Toplam ekran", "Total screens")} value={String(lcdScreens.length)} icon={Monitor} tone="accent" />
        <Kpi label={ls("Yayında", "Broadcasting")} value={String(online)} icon={Monitor} tone="ok" />
        <Kpi label={ls("Offline", "Offline")} value={String(lcdScreens.length - online)} icon={MonitorOff} tone="danger" sub={ls("personel yemekhanesi", "staff canteen")} />
        <Kpi label={ls("İçerik güncelleme", "Content refresh")} value="5" unit={lang === "tr" ? "sn" : "s"} icon={Monitor} tone="violet" />
      </div>

      <Card className="mt-4">
        <CardHead
          title={ls("Ekran önizlemeleri", "Screen previews")}
          sub={ls("Misafirin gördüğü içerik · veriler analitik motorundan canlı gelir", "What the guest sees · data streamed live from the analytics engine")}
          icon={Monitor}
        />
        <div className="grid gap-4 lg:grid-cols-3">
          <LcdFrame label={lang === "tr" ? "Resepsiyon LCD · banko arkası" : "Reception LCD · behind the desk"}>
            <div className="flex items-center justify-between">
              <Logo height={26} />
              <span className="num text-[11px] text-white/60">{hhmm(DEMO_NOW)}</span>
            </div>
            <div className="mt-auto">
              <div className="text-[11px] font-medium text-white/60">
                {lang === "tr" ? "Tahmini check-in beklemesi" : "Estimated check-in wait"}
              </div>
              <div className="num mt-1 text-[42px] font-bold leading-none text-accent">4:32</div>
              <div className="mt-2 flex items-center gap-2">
                <Users size={13} className="text-warn" />
                <span className="text-[12px] text-white/75">
                  {lang === "tr" ? "7 misafir bekliyor · 3. banko açılıyor" : "7 guests waiting · desk 3 opening"}
                </span>
              </div>
            </div>
          </LcdFrame>

          <LcdFrame label={lang === "tr" ? "Havuz LCD · havuz bar" : "Pool LCD · pool bar"}>
            <div className="flex items-center justify-between">
              <Logo height={26} />
              <Badge tone="warn">{lang === "tr" ? "yoğun" : "busy"}</Badge>
            </div>
            <div className="mt-auto">
              <div className="flex items-baseline gap-2">
                <Waves size={18} className="text-accent" />
                <span className="num text-[38px] font-bold leading-none text-accent">{pct(78)}</span>
              </div>
              <div className="mt-1 text-[12px] text-white/70">
                {lang === "tr" ? "Açık havuz doluluğu · 94 / 120 kişi" : "Outdoor pool occupancy · 94 / 120 people"}
              </div>
              <div className="mt-2">
                <Bar value={94} max={120} threshold={85} height={7} />
              </div>
              <div className="mt-2 text-[11px] text-white/55">
                {lang === "tr" ? "Kapalı havuzda %47 doluluk — daha sakin" : "Indoor pool at 47% — quieter"}
              </div>
            </div>
          </LcdFrame>

          <LcdFrame label={lang === "tr" ? "Restoran girişi LCD · host bankosu" : "Restaurant entry LCD · host desk"}>
            <div className="flex items-center justify-between">
              <Logo height={26} />
              <span className="num text-[11px] text-white/60">{lang === "tr" ? "Kahvaltı" : "Breakfast"}</span>
            </div>
            <div className="mt-auto space-y-2">
              {[
                { n: lang === "tr" ? "Ana restoran" : "Main restaurant", v: 96, c: 140 },
                { n: lang === "tr" ? "Teras" : "Terrace", v: 41, c: 80 },
              ].map((o, i) => (
                <div key={i}>
                  <div className="flex items-baseline justify-between text-[11.5px] text-white/75">
                    <span>{o.n}</span>
                    <span className="num font-semibold">
                      {o.v}/{o.c}
                    </span>
                  </div>
                  <div className="mt-1">
                    <Bar value={o.v} max={o.c} height={6} />
                  </div>
                </div>
              ))}
              <div className="num pt-1 text-[12px] font-semibold text-warn">
                {lang === "tr" ? "Tahmini bekleme: 5 dk" : "Estimated wait: 5 min"}
              </div>
            </div>
          </LcdFrame>
        </div>
      </Card>

      <Card className="mt-4">
        <CardHead
          title={ls("Ekran envanteri", "Screen inventory")}
          sub={ls("Konum, yayınlanan içerik ve durum", "Location, published content and status")}
          icon={Monitor}
        />
        <Table head={[ls("Ekran", "Screen"), ls("Konum", "Location"), ls("İçerik", "Content"), ls("Durum", "Status")]}>
          {lcdScreens.map((s, i) => (
            <Tr key={i}>
              <Td className="font-semibold text-ink">{l(s.name)}</Td>
              <Td>{l(s.location)}</Td>
              <Td>{l(s.content)}</Td>
              <Td>
                <Badge tone={s.status === "online" ? "ok" : "danger"}>
                  {s.status === "online" ? (lang === "tr" ? "yayında" : "online") : "offline"}
                </Badge>
              </Td>
            </Tr>
          ))}
        </Table>
      </Card>
    </>
  );
}

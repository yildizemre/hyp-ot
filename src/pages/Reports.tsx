import { CalendarDays, Download, FileBarChart, FileText, Mail, TrendingUp } from "lucide-react";
import { C, Chart, Legend } from "../components/charts";
import { Badge, Btn, Card, CardHead, Kpi, PageHead, Table, Td, Tr } from "../components/ui";
import { eventsTrend, guestSatisfaction } from "../data/series";
import { ls, useLang, type LS } from "../i18n";

const satSeries = [
  { key: "score", name: ls("Memnuniyet", "Satisfaction"), color: C.ok, type: "line" as const },
];
const trendSeries = [
  { key: "ops", name: ls("Operasyon", "Operations"), color: C.accent, type: "bar" as const },
  { key: "security", name: ls("Güvenlik", "Security"), color: C.danger, type: "bar" as const },
];

const REPORTS: { name: LS; period: LS; owner: LS; format: string | LS; auto: boolean }[] = [
  { name: ls("Vardiya operasyon özeti", "Shift operations digest"), period: ls("Her vardiya (3×/gün)", "Every shift (3×/day)"), owner: ls("Otel müdürü · ön büro", "GM · front office"), format: "PDF", auto: true },
  { name: ls("Check-in bekleme & SLA raporu", "Check-in wait & SLA report"), period: ls("Günlük 23:59", "Daily 23:59"), owner: ls("Ön büro şefi", "Front office manager"), format: "PDF + XLSX", auto: true },
  { name: ls("Güvenlik olay dosyası", "Security incident file"), period: ls("Olay bazlı", "Per incident"), owner: ls("Güvenlik şefi", "Security chief"), format: ls("PDF + görüntü", "PDF + frames"), auto: true },
  { name: ls("F&B doluluk ve turnover", "F&B occupancy and turnover"), period: ls("Günlük", "Daily"), owner: ls("F&B müdürü", "F&B manager"), format: "XLSX", auto: true },
  { name: ls("Housekeeping SOP uyum raporu", "Housekeeping SOP compliance"), period: ls("Günlük", "Daily"), owner: ls("Housekeeping şefi", "Housekeeping supervisor"), format: "PDF", auto: true },
  { name: ls("Wellness kapasite kullanım analizi", "Wellness capacity utilisation"), period: ls("Haftalık · Pazartesi", "Weekly · Monday"), owner: ls("Wellness · otel müdürü", "Wellness · GM"), format: "PDF", auto: true },
  { name: ls("Otopark & plaka kayıt defteri", "Car park & plate log"), period: ls("Günlük", "Daily"), owner: ls("Güvenlik", "Security"), format: "CSV", auto: true },
  { name: ls("Aylık yönetim KPI raporu", "Monthly management KPI report"), period: ls("Aylık · ayın 1'i", "Monthly · 1st"), owner: ls("Genel müdürlük", "Head office"), format: "PDF", auto: false },
];

const KPI_TABLE: { metric: LS; today: string; week: string; target: string; ok: boolean }[] = [
  { metric: ls("Ort. check-in bekleme", "Avg. check-in wait"), today: "4:32", week: "3:46", target: "3:00", ok: false },
  { metric: ls("Resepsiyon SLA uyumu", "Reception SLA compliance"), today: "%68", week: "%79", target: "%90", ok: false },
  { metric: ls("Lobi doluluk (tepe)", "Lobby occupancy (peak)"), today: "%85", week: "%81", target: "%90", ok: true },
  { metric: ls("F&B kahvaltı tepe doluluk", "F&B breakfast peak"), today: "%94", week: "%88", target: "%95", ok: true },
  { metric: ls("Masa kullanım süresi", "Table turnover"), today: "54 dk", week: "61 dk", target: "55 dk", ok: true },
  { metric: ls("Havuz tepe doluluk", "Pool peak occupancy"), today: "%78", week: "%84", target: "%85", ok: true },
  { metric: ls("Housekeeping SOP uyumu", "Housekeeping SOP"), today: "%91", week: "%89", target: "%95", ok: false },
  { metric: ls("Güvenlik yanıt süresi", "Security response time"), today: "1:24", week: "1:38", target: "2:00", ok: true },
  { metric: ls("Plaka tanıma doğruluğu", "Plate recognition accuracy"), today: "%97,4", week: "%97,1", target: "%95", ok: true },
  { metric: ls("Kamera uptime", "Camera uptime"), today: "%97,4", week: "%99,2", target: "%99", ok: false },
];

export default function Reports() {
  const { l, lang } = useLang();

  return (
    <>
      <PageHead
        title={ls("Raporlar", "Reports")}
        sub={ls(
          "Otomatik dağıtılan raporlar, KPI karnesi ve dönemsel karşılaştırmalar",
          "Automatically distributed reports, KPI scorecard and period comparisons"
        )}
        right={
          <>
            <Btn icon={Mail}>{lang === "tr" ? "Dağıtım listesi" : "Distribution list"}</Btn>
            <Btn icon={Download} variant="solid">
              {lang === "tr" ? "Rapor indir" : "Download report"}
            </Btn>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label={ls("Otomatik rapor", "Automated reports")} value="7" icon={FileText} tone="accent" sub={ls("8 tanımlı rapor", "8 defined reports")} />
        <Kpi label={ls("Bu ay üretilen", "Generated this month")} value="186" icon={FileBarChart} tone="ok" />
        <Kpi label={ls("Hedef altı KPI", "KPIs below target")} value="4" unit="/ 10" icon={TrendingUp} tone="warn" sub={ls("bekleme · SOP · uptime", "wait · SOP · uptime")} />
        <Kpi label={ls("Veri kapsamı", "Data coverage")} value="%97,4" icon={CalendarDays} tone="ok" sub={ls("kamera uptime", "camera uptime")} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.3fr_1fr]">
        <Card>
          <CardHead
            title={ls("KPI karnesi", "KPI scorecard")}
            sub={ls("Bugün · hafta ortalaması · hedef karşılaştırması", "Today · week average · target comparison")}
            icon={FileBarChart}
          />
          <Table
            head={[
              ls("Metrik", "Metric"),
              ls("Bugün", "Today"),
              ls("Hafta ort.", "Week avg."),
              ls("Hedef", "Target"),
              ls("Durum", "Status"),
            ]}
          >
            {KPI_TABLE.map((k, i) => (
              <Tr key={i}>
                <Td className="font-semibold text-ink">{l(k.metric)}</Td>
                <Td className="num">{k.today}</Td>
                <Td className="num">{k.week}</Td>
                <Td className="num text-mute">{k.target}</Td>
                <Td>
                  <Badge tone={k.ok ? "ok" : "danger"}>
                    {k.ok ? (lang === "tr" ? "hedefte" : "on target") : lang === "tr" ? "hedef altı" : "below"}
                  </Badge>
                </Td>
              </Tr>
            ))}
          </Table>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHead
              title={ls("Misafir memnuniyeti trendi", "Guest satisfaction trend")}
              sub={ls("7 haftalık seyir · 10 üzerinden", "7-week trajectory · out of 10")}
              icon={TrendingUp}
              tone="ok"
              right={<Legend series={satSeries} />}
            />
            <Chart
              data={guestSatisfaction.map((d) => ({ ...d, t: lang === "tr" ? d.t : d.en }))}
              series={satSeries}
              height={166}
              yWidth={30}
            />
          </Card>

          <Card>
            <CardHead
              title={ls("Olay hacmi — 7 gün", "Event volume — 7 days")}
              sub={ls("Operasyon ve güvenlik kırılımı", "Operations and security breakdown")}
              icon={FileBarChart}
              tone="violet"
              right={<Legend series={trendSeries} />}
            />
            <Chart
              data={eventsTrend.map((d) => ({ ...d, t: lang === "tr" ? d.t : d.en }))}
              series={trendSeries}
              height={166}
              stacked
            />
          </Card>
        </div>
      </div>

      <Card className="mt-4">
        <CardHead
          title={ls("Rapor tanımları", "Report definitions")}
          sub={ls("Periyot, sahip ve format bilgileri", "Period, owner and format details")}
          icon={FileText}
        />
        <Table
          head={[
            ls("Rapor", "Report"),
            ls("Periyot", "Period"),
            ls("Alıcı", "Owner"),
            ls("Format", "Format"),
            ls("Otomatik", "Automated"),
          ]}
        >
          {REPORTS.map((r, i) => (
            <Tr key={i}>
              <Td className="font-semibold text-ink">{l(r.name)}</Td>
              <Td>{l(r.period)}</Td>
              <Td>{l(r.owner)}</Td>
              <Td className="num text-[11px]">{typeof r.format === "string" ? r.format : l(r.format)}</Td>
              <Td>
                <Badge tone={r.auto ? "ok" : "mute"}>
                  {r.auto ? (lang === "tr" ? "açık" : "on") : lang === "tr" ? "manuel" : "manual"}
                </Badge>
              </Td>
            </Tr>
          ))}
        </Table>
      </Card>
    </>
  );
}

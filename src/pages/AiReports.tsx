import { BrainCircuit, Download, FileText, Share2, Sparkles, TrendingUp } from "lucide-react";
import { AiSummary } from "../components/AiSummary";
import { C, Chart, Legend } from "../components/charts";
import { Badge, Btn, Card, CardHead, Kpi, PageHead, RichText } from "../components/ui";
import { guestSatisfaction } from "../data/series";
import { ls, useLang, type LS } from "../i18n";

const satSeries = [
  { key: "score", name: ls("Misafir memnuniyeti", "Guest satisfaction"), color: C.ok, type: "line" as const },
  { key: "wait", name: ls("Ort. bekleme (sn)", "Avg. wait (s)"), color: C.warn, type: "area" as const },
];

const SECTIONS: { title: LS; body: LS; tone: "accent" | "warn" | "danger" | "ok" }[] = [
  {
    tone: "warn",
    title: ls("1 · Misafir deneyimi ve bekleme süreleri", "1 · Guest experience and wait times"),
    body: ls(
      "Check-in beklemesi günün ortalamasında **4:32 dk** ile hedefin (3:00) **%51 üzerinde** kaldı. Beklemenin **%68'i 13:00–16:00** aralığında oluştu; bu üç saat günün check-in hacminin **%62'sini** taşıyor. Banko 3'ün kapalı tutulması bu pencerede beklemeyi ortalama **1:48 dk** artırıyor. Misafir memnuniyeti son 7 haftada **8,1 → 8,9** yükseldi ve bekleme süresindeki **%28 düşüşle** güçlü negatif korelasyon gösteriyor (r = -0,82).",
      "Check-in wait averaged **4:32** for the day, **51% above** the 3:00 target. **68% of the waiting** occurred between **13:00–16:00**, three hours that carry **62%** of the day's check-in volume. Keeping desk 3 closed adds an average of **1:48** to the wait in that window. Guest satisfaction rose from **8.1 to 8.9** over the last 7 weeks, strongly negatively correlated with the **28% reduction** in wait time (r = -0.82)."
    ),
  },
  {
    tone: "accent",
    title: ls("2 · Alan kullanımı ve kapasite", "2 · Space utilisation and capacity"),
    body: ls(
      "Açık havuz **%78** ile gün içi zirveye yaklaştı; kapasite eşiğine tahmini süre **18 dakika**. Spa **%30** kullanımla en düşük performanslı alan — 16:00–18:00 aralığındaki **3 boş slot** lobi LCD'sinde tanıtılırsa günlük spa cirosunda **%12–15 artış** öngörülüyor. Ana restoran kahvaltıda **%94 kapasiteye** ulaştı, buna karşılık teras **%51** kaldı: misafir yönlendirmesi ile buffet kuyruğu **%40 azaltılabilir**. Balo salonu **%86** ile kapasite eşiğine **2 dakika** uzaklıkta.",
      "The outdoor pool approached its intraday peak at **78%**, an estimated **18 minutes** from its capacity threshold. The spa is the weakest performer at **30%** — promoting the **3 open slots** for 16:00–18:00 on the lobby LCD is forecast to lift daily spa revenue by **12–15%**. The main restaurant hit **94% capacity** at breakfast while the terrace stayed at **51%**: guest redirection could cut the buffet queue by **40%**. The ballroom at **86%** is **2 minutes** from its capacity threshold."
    ),
  },
  {
    tone: "danger",
    title: ls("3 · Güvenlik ve risk", "3 · Security and risk"),
    body: ls(
      "**2 kritik olay** açık: lobide sahipsiz valiz ve personel alanına yetkisiz giriş. Personel turnikesinde **4 tailgating** olayı tekrar ediyor; tek kart ile çoklu geçiş davranışı sistematik hale gelmiş durumda — İK ile davranış eğitimi öneriliyor. **Yükleme rampası** 24 saatte **6 olayla** en riskli bölge: araç ve personel akışının fiziksel olarak ayrılması gerekiyor. **CAM-63** 2 sa 26 dk offline kaldığı için mutfak servis koridorunda **kör nokta** oluştu; bu koridor BOH erişim zincirinin kritik halkası.",
      "**2 critical events** are open: an unattended suitcase in the lobby and unauthorized entry into a staff area. **4 tailgating** events recur at the staff turnstile; multi-passage on a single badge has become systematic — behavioural training with HR is recommended. The **loading dock** is the riskiest zone with **6 events** in 24 hours: vehicle and staff flows need physical separation. Because **CAM-63** stayed offline for 2 h 26 min, a **blind spot** formed in the kitchen service corridor — a critical link in the BOH access chain."
    ),
  },
  {
    tone: "ok",
    title: ls("4 · Operasyonel verimlilik", "4 · Operational efficiency"),
    body: ls(
      "Housekeeping **271/342 oda** tamamladı, SOP uyumu **%91**. 4. kat **%82** ile ortalamanın altında ve aynı katta **2 koridor uyarısı** var — **1 ek görevli** kaydırılması gerekiyor. Güvenlik yanıt süresi **1:24 dk** ile hedefin içinde, buna karşılık **housekeeping 6:52** ve **teknik servis 10:38** hedefi aşıyor. Otopark **%76** dolulukta, plaka tanıma doğruluğu **%97,4**. Toplam **48 operasyonel olay** işlendi, **%73'ü** aynı vardiya içinde kapatıldı.",
      "Housekeeping completed **271/342 rooms** with **91%** SOP compliance. Floor 4 is below average at **82%** with **2 corridor alerts** — **1 extra attendant** should be reassigned. Security response of **1:24** is within target, while **housekeeping at 6:52** and **technical service at 10:38** exceed theirs. The car park is **76%** full with **97.4%** plate recognition accuracy. A total of **48 operational events** were processed, **73%** closed within the same shift."
    ),
  },
];

const ACTIONS: { p: LS; who: LS; impact: LS; tone: "danger" | "warn" | "accent" }[] = [
  { p: ls("Banko 3'ü 13:00–16:00 aralığında kalıcı aç", "Keep desk 3 permanently open 13:00–16:00"), who: ls("Ön büro", "Front office"), impact: ls("Bekleme 4:32 → 2:10", "Wait 4:32 → 2:10"), tone: "danger" },
  { p: ls("Kahvaltıda 2. omlet istasyonu", "Second omelette station at breakfast"), who: ls("F&B", "F&B"), impact: ls("Kuyruk 14 → 6 kişi", "Queue 14 → 6"), tone: "warn" },
  { p: ls("Havuz kapasite alarmını %80'e çek", "Lower pool capacity alarm to 80%"), who: ls("Wellness", "Wellness"), impact: ls("Erken müdahale +12 dk", "Earlier action +12 min"), tone: "warn" },
  { p: ls("Rampada araç/personel yolunu ayır", "Separate vehicle and staff lanes at the dock"), who: ls("Güvenlik", "Security"), impact: ls("Olay -%45 (tahmini)", "Events -45% (est.)"), tone: "danger" },
  { p: ls("4. kata 1 ek housekeeping görevlisi", "1 extra housekeeping attendant on floor 4"), who: ls("Housekeeping", "Housekeeping"), impact: ls("SOP %82 → %92", "SOP 82% → 92%"), tone: "accent" },
  { p: ls("Spa boş slotlarını lobi LCD'sinde tanıt", "Promote spa slots on the lobby LCD"), who: ls("Wellness", "Wellness"), impact: ls("Spa ciro +%12–15", "Spa revenue +12–15%"), tone: "accent" },
];

export default function AiReports() {
  const { l, lang } = useLang();

  return (
    <>
      <PageHead
        title={ls("AI Raporları", "AI Reports")}
        sub={ls(
          "Günlük vardiya raporu · 25 Eylül 2026 · 38 kameradan 14 model çıktısı yorumlandı",
          "Daily shift report · 25 September 2026 · interpreted from 14 models across 38 cameras"
        )}
        right={
          <>
            <Btn icon={Share2}>{lang === "tr" ? "Paylaş" : "Share"}</Btn>
            <Btn icon={Download} variant="solid">
              PDF
            </Btn>
          </>
        }
      />

      <AiSummary
        actions={false}
        title={ls("Yönetici özeti", "Executive summary")}
        text={ls(
          "Otel **%84 doluluk** ile çalıştı ve misafir memnuniyeti **8,9** ile son 7 haftanın zirvesine ulaştı. Buna karşılık **check-in beklemesi 4:32 dk** ile hedefin %51 üzerinde kaldı ve günün en büyük deneyim riski oldu. Alan tarafında **havuz %78**, **balo salonu %86** ile kapasite baskısı altında, **spa %30** ile atıl kapasite taşıyor. Güvenlikte **2 kritik olay** açık ve **CAM-63 kaynaklı kör nokta** devam ediyor. Bugünün tek en yüksek etkili aksiyonu: **13:00–16:00 arası Banko 3'ün kalıcı açılması** — beklemeyi yarıya indirir, memnuniyet trendini korur.",
          "The property ran at **84% occupancy** and guest satisfaction reached a 7-week high of **8.9**. However, the **check-in wait of 4:32** stayed 51% above target and was the day's biggest experience risk. On the space side the **pool at 78%** and the **ballroom at 86%** are under capacity pressure, while the **spa at 30%** carries idle capacity. In security, **2 critical events** are open and the **blind spot caused by CAM-63** persists. The single highest-impact action today: **keeping desk 3 permanently open between 13:00–16:00** — it halves the wait and protects the satisfaction trend."
        )}
      />

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label={ls("Yorumlanan olay", "Events interpreted")} value="48" icon={BrainCircuit} tone="accent" sub={ls("24 saat", "24 hours")} />
        <Kpi label={ls("Önerilen aksiyon", "Recommended actions")} value="6" icon={Sparkles} tone="violet" sub={ls("2 yüksek etkili", "2 high impact")} />
        <Kpi label={ls("Misafir memnuniyeti", "Guest satisfaction")} value="8,9" unit="/10" icon={TrendingUp} tone="ok" delta="+0,1" deltaGood sub={ls("7 hafta zirvesi", "7-week high")} />
        <Kpi label={ls("Aynı vardiyada kapanan", "Closed in same shift")} value="%73" icon={FileText} tone="ok" delta="+8%" deltaGood />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.45fr_1fr]">
        <Card>
          <CardHead
            title={ls("Rapor gövdesi", "Report body")}
            sub={ls("Dört bölümde yorumlanmış analitik çıktısı", "Analytics output interpreted in four sections")}
            icon={FileText}
          />
          <div className="space-y-4">
            {SECTIONS.map((s, i) => (
              <div key={i} className="rounded-xl border border-line bg-panel2 p-3.5">
                <div className="mb-2 flex items-center gap-2">
                  <Badge tone={s.tone}>{l(s.title)}</Badge>
                </div>
                <RichText value={s.body} className="text-[12.5px] leading-relaxed text-dim" />
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHead
              title={ls("Aksiyon planı", "Action plan")}
              sub={ls("Etki tahminleri geçmiş veriden hesaplandı", "Impact estimates computed from historical data")}
              icon={Sparkles}
              tone="violet"
            />
            <div className="space-y-2">
              {ACTIONS.map((a, i) => (
                <div key={i} className="rounded-xl border border-line bg-panel2 p-2.5">
                  <div className="flex items-start gap-2">
                    <span className="num mt-0.5 grid size-5 shrink-0 place-items-center rounded-md bg-panel3 text-[10px] font-bold text-mute">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="text-[12px] font-semibold leading-snug text-ink">{l(a.p)}</div>
                      <div className="mt-1 flex flex-wrap items-center gap-1.5">
                        <Badge tone="mute">{l(a.who)}</Badge>
                        <Badge tone={a.tone}>{l(a.impact)}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHead
              title={ls("Bekleme süresi ↔ memnuniyet", "Wait time ↔ satisfaction")}
              sub={ls("7 haftalık korelasyon: r = -0,82", "7-week correlation: r = -0.82")}
              icon={TrendingUp}
              tone="ok"
              right={<Legend series={satSeries} />}
            />
            <Chart
              data={guestSatisfaction.map((d) => ({ ...d, t: lang === "tr" ? d.t : d.en }))}
              series={satSeries}
              height={180}
              yWidth={34}
            />
          </Card>
        </div>
      </div>
    </>
  );
}

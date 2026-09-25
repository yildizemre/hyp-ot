import { useRef, useState } from "react";
import { ArrowUp, Bot, Sparkles, User } from "lucide-react";
import { Badge, Card, CardHead, PageHead, RichText } from "../components/ui";
import { CameraFrame } from "../components/CameraFrame";
import { EventList } from "../components/events";
import { EVENTS } from "../data/events";
import { ls, useLang, type LS } from "../i18n";
import { cx } from "../lib/util";

type Msg = {
  role: "user" | "ai";
  text: LS;
  /** optional event ids attached as evidence */
  evidence?: string[];
  camera?: { kind: "reception" | "pool" | "corridor"; id: string };
};

const SUGGESTIONS: { q: LS; a: Msg }[] = [
  {
    q: ls("Check-in kuyruğu neden uzadı?", "Why did the check-in queue grow?"),
    a: {
      role: "ai",
      text: ls(
        "Kuyruk **09:05'ten itibaren** büyümeye başladı. Üç neden var: **(1)** 09:21'de giriş yapan **35 TUR 442** plakalı tur otobüsü ana girişten **186 kişi/15 dk** akış yarattı. **(2)** Aynı anda **sadece 2 banko açıktı**, Banko 3 kapalı. **(3)** Grup check-in masası kullanılmadığı için işlem süresi banko başına **3,2 dk'dan 4,1 dk'ya** çıktı.\n\nÖneri: **Banko 3'ü aç** ve grup girişlerini ayrı masaya yönlendir — geçmiş verilerde bu kombinasyon beklemeyi **4:32 → 2:10** aralığına indirdi.",
        "The queue started building **from 09:05**. Three causes: **(1)** the tour bus **35 TUR 442** entering at 09:21 created a flow of **186 people/15 min** at the main entrance. **(2)** Only **2 desks were open** at the time, with desk 3 closed. **(3)** Because the group check-in desk was unused, handling time rose from **3.2 to 4.1 minutes** per desk.\n\nRecommendation: **open desk 3** and route group arrivals to a dedicated desk — historically this combination brought the wait from **4:32 down to 2:10**."
      ),
      evidence: ["EV-2418", "EV-2402"],
      camera: { kind: "reception", id: "CAM-01" },
    },
  },
  {
    q: ls("Havuz kapasitesi ne zaman dolar?", "When will the pool reach capacity?"),
    a: {
      role: "ai",
      text: ls(
        "Açık havuz şu anda **94/120 kişi (%78)**. Son 30 dakikadaki giriş hızı **+22 kişi**, yani dakikada **0,73 kişi** net artış. Bu hızla **%85 alarm eşiğine (102 kişi) 11 dakika**, tam kapasiteye **36 dakika** kalıyor.\n\nGeçen haftanın aynı günü zirve **13:40'ta 112 kişi** ile gerçekleşmişti. Öneri: **şezlong ve havlu stoğunu şimdi takviye et**, kapalı havuz **%47** dolulukta olduğu için LCD'de alternatif olarak gösterilebilir.",
        "The outdoor pool is at **94/120 (78%)**. The entry rate over the last 30 minutes is **+22 people**, i.e. a net **0.73 people per minute**. At this rate the **85% alarm threshold (102 people) is 11 minutes away**, and full capacity is **36 minutes** out.\n\nOn the same day last week the peak was **112 people at 13:40**. Recommendation: **replenish sunbeds and towels now**; since the indoor pool is only **47%** full, it can be promoted as an alternative on the LCDs."
      ),
      evidence: ["EV-2416"],
      camera: { kind: "pool", id: "CAM-30" },
    },
  },
  {
    q: ls("Bugün hangi güvenlik riskleri var?", "What security risks are open today?"),
    a: {
      role: "ai",
      text: ls(
        "**2 kritik** olay açık:\n**(1)** Lobide **6 dakikadır sahipsiz valiz** — concierge bankosunun 4 m güneyinde, güvenlik yönlendirildi.\n**(2)** **Personel alanına yetkisiz giriş** — turnike kart kaydı olmayan kişi BOH koridoruna girdi, üniforma tespit edilmedi.\n\nAyrıca **4 tailgating** olayı personel turnikesinde tekrar ediyor ve **CAM-63 (mutfak servis koridoru) 2 sa 26 dk offline** — bu bölge şu anda kör nokta. Yükleme rampası 24 saatte **6 olayla** en riskli bölge.",
        "**2 critical** events are open:\n**(1)** An **unattended suitcase in the lobby for 6 minutes** — 4 m south of the concierge desk, security dispatched.\n**(2)** **Unauthorized entry into a staff area** — a person with no turnstile badge record entered the BOH corridor, no uniform detected.\n\nIn addition, **4 tailgating** events keep recurring at the staff turnstile, and **CAM-63 (kitchen service corridor) has been offline for 2 h 26 min** — that zone is currently a blind spot. The loading dock leads all zones with **6 events** in 24 hours."
      ),
      evidence: ["EV-2417", "EV-2415", "EV-2401"],
    },
  },
  {
    q: ls("Kahvaltıda kaç personel gerekiyor?", "How many staff are needed at breakfast?"),
    a: {
      role: "ai",
      text: ls(
        "Kahvaltı zirvesi **08:15'te 141 kişi** (kapasitenin **%94'ü**). Servis hızı **2,8 kişi/dk** ve kuyruk **14 kişiye** ulaştı; bekleme **5:10 dk** ile hedefin **%72 üzerinde**.\n\nHesaplama: 08:00–09:00 arası ortalama **134 kişi** ve masa devir hızı **47 dk** → **2 host + 6 servis + 2 omlet istasyonu** gerekiyor. Şu anda 1 omlet istasyonu var; **ikinci istasyon** kuyruğu 14'ten **6 kişiye** düşürür.",
        "Breakfast peaks at **141 people at 08:15** (**94% of capacity**). Service rate is **2.8 people/min** and the queue reached **14 people**; the wait of **5:10** is **72% above** target.\n\nCalculation: an average of **134 people** between 08:00–09:00 with a **47 min** table cycle requires **2 hosts + 6 servers + 2 omelette stations**. There is currently 1 omelette station; a **second station** would cut the queue from 14 to **6 people**."
      ),
      evidence: ["EV-2414"],
    },
  },
  {
    q: ls("Housekeeping'de hangi kat geride?", "Which floor is behind on housekeeping?"),
    a: {
      role: "ai",
      text: ls(
        "**4. kat** geride: **39/58 oda** tamamlandı ve SOP uyumu **%82** (otel ortalaması %91). Aynı katta **2 servis arabası uyarısı** var; biri koridorda **22 dakika** bırakılmış.\n\nEn çok atlanan adımlar: **mini bar kontrolü %84** ve **kirli çarşaf ayrımı %89**. Öneri: 4. kata **1 ek görevli** kaydır ve kat şefine mini bar adımı için hatırlatma gönder.",
        "**Floor 4** is behind: **39/58 rooms** completed with SOP compliance at **82%** (hotel average 91%). The same floor has **2 trolley alerts**, one of them left in the corridor for **22 minutes**.\n\nMost skipped steps: **mini bar check 84%** and **soiled linen separation 89%**. Recommendation: shift **1 extra attendant** to floor 4 and send the floor supervisor a reminder about the mini bar step."
      ),
      evidence: ["EV-2411", "EV-2403"],
      camera: { kind: "corridor", id: "CAM-50" },
    },
  },
];

function Bubble({ msg }: { msg: Msg }) {
  const { l, lang } = useLang();
  const isAi = msg.role === "ai";
  return (
    <div className={cx("flex gap-2.5", !isAi && "flex-row-reverse")}>
      <span
        className={cx(
          "mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg",
          isAi ? "bg-accent/15 text-accent" : "bg-panel3 text-dim"
        )}
      >
        {isAi ? <Bot size={14} /> : <User size={14} />}
      </span>
      <div className={cx("min-w-0 max-w-[85%] space-y-2", !isAi && "text-right")}>
        <div
          className={cx(
            "rounded-xl px-3 py-2.5 text-left text-[12.5px] leading-relaxed",
            isAi ? "border border-line bg-panel2 text-dim" : "bg-accent/12 text-ink ring-1 ring-accent/25"
          )}
        >
          {l(msg.text)
            .split("\n")
            .map((line, i) =>
              line.trim() === "" ? (
                <div key={i} className="h-2" />
              ) : (
                <p key={i} className={i > 0 ? "mt-1" : undefined}>
                  <RichText value={line} />
                </p>
              )
            )}
        </div>
        {msg.camera && (
          <div className="max-w-sm">
            <CameraFrame
              kind={msg.camera.kind}
              seed={msg.camera.id}
              cameraId={msg.camera.id}
              boxes={EVENTS.find((e) => e.cameraId === msg.camera!.id)?.boxes ?? []}
              zone={EVENTS.find((e) => e.cameraId === msg.camera!.id)?.zone}
              compact
              live={false}
            />
          </div>
        )}
        {msg.evidence && (
          <div className="text-left">
            <div className="mb-1.5 flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wide text-mute">
              <Sparkles size={11} className="text-accent" />
              {lang === "tr" ? "Dayanak olaylar" : "Supporting events"}
            </div>
            <EventList events={EVENTS.filter((e) => msg.evidence!.includes(e.id))} showThumb={false} />
          </div>
        )}
      </div>
    </div>
  );
}

export default function Assistant() {
  const { l, lang } = useLang();
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "ai",
      text: ls(
        "Merhaba **Selin**. Bugünün özeti: doluluk **%84**, check-in beklemesi **4:32 dk** (hedef üzeri), havuz **%78** ve **2 kritik güvenlik olayı** açık. Aşağıdaki sorulardan birini seçebilir veya kendi sorunuzu yazabilirsiniz.",
        "Hello **Selin**. Today's brief: occupancy **84%**, check-in wait **4:32** (above target), pool at **78%** and **2 critical security events** open. Pick one of the questions below or type your own."
      ),
    },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const ask = (i: number) => {
    const s = SUGGESTIONS[i];
    setMsgs((m) => [...m, { role: "user", text: s.q }, s.a]);
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 60);
  };

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const text = input.trim();
    setInput("");
    setMsgs((m) => [
      ...m,
      { role: "user", text: ls(text, text) },
      {
        role: "ai",
        text: ls(
          "Bu demo ortamında serbest sorular örnek veriyle yanıtlanır. Sağdaki hazır sorular gerçek analitik çıktısını birebir gösterir: kuyruk nedeni, havuz kapasite tahmini, güvenlik riskleri, kahvaltı personel planı ve housekeeping durumu.",
          "In this demo environment free-form questions are answered with sample data. The ready-made questions on the right reproduce the real analytics output: queue root cause, pool capacity forecast, security risks, breakfast staffing plan and housekeeping status."
        ),
      },
    ]);
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 60);
  };

  return (
    <>
      <PageHead
        title={ls("AI Asistan", "AI Assistant")}
        sub={ls(
          "Operasyon verisi üzerinde doğal dille soru sorun — cevaplar olay ve görüntüyle desteklenir",
          "Ask natural language questions over operational data — answers are backed by events and frames"
        )}
        right={<Badge tone="accent" icon={Sparkles}>{lang === "tr" ? "38 kamera · 14 model" : "38 cameras · 14 models"}</Badge>}
      />

      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <Card className="flex flex-col">
          <CardHead
            title={ls("Sohbet", "Conversation")}
            sub={ls("Yanıtlar canlı analitik verisinden üretilir", "Answers are generated from live analytics data")}
            icon={Bot}
          />
          <div className="max-h-[62vh] min-h-[380px] flex-1 space-y-4 overflow-y-auto pr-1">
            {msgs.map((m, i) => (
              <Bubble key={i} msg={m} />
            ))}
            <div ref={endRef} />
          </div>
          <form onSubmit={send} className="mt-3 flex items-center gap-2 rounded-xl border border-line bg-panel2 px-3 py-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={lang === "tr" ? "Örn. dün akşam lobide kaç kişi vardı?" : "e.g. how many people were in the lobby last night?"}
              className="h-7 flex-1 bg-transparent text-[12.5px] text-ink outline-none placeholder:text-mute"
            />
            <button
              type="submit"
              className="grid size-7 shrink-0 place-items-center rounded-lg bg-accent text-[#04161a] transition hover:brightness-110"
            >
              <ArrowUp size={14} />
            </button>
          </form>
        </Card>

        <Card>
          <CardHead
            title={ls("Hazır sorular", "Ready-made questions")}
            sub={ls("Tek tıkla gerçek analitik çıktısını görün", "See the real analytics output in one click")}
            icon={Sparkles}
            tone="violet"
          />
          <div className="space-y-2">
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                onClick={() => ask(i)}
                className="flex w-full items-center gap-2.5 rounded-xl border border-line bg-panel2 p-3 text-left text-[12.5px] font-medium text-dim transition hover:border-accent/45 hover:text-ink"
              >
                <Sparkles size={13} className="shrink-0 text-accent" />
                {l(s.q)}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

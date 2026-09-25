import { ls, type LS } from "../i18n";
import { minutesAgo } from "../lib/util";
import type { AreaId } from "./hotel";

export type Severity = "critical" | "high" | "medium" | "low";
export type EventStatus = "new" | "ack" | "resolved";

export type EventType =
  | "queue_threshold"
  | "wait_time"
  | "capacity"
  | "dwell"
  | "loitering"
  | "unauthorized"
  | "abandoned"
  | "aggression"
  | "fall"
  | "smoke"
  | "illegal_parking"
  | "lpr"
  | "after_hours"
  | "trolley"
  | "sop"
  | "tailgating"
  | "flow_spike"
  | "camera_health";

export type BoxShape = "person" | "person-down" | "vehicle" | "object" | "smoke";

export type Box = {
  /** normalized 0..1 inside the frame */
  x: number;
  y: number;
  w: number;
  h: number;
  label: LS | string;
  tone?: "accent" | "warn" | "danger" | "ok" | "violet";
  conf?: number;
  shape?: BoxShape;
};

export type VisionEvent = {
  id: string;
  type: EventType;
  cameraId: string;
  area: AreaId;
  at: Date;
  severity: Severity;
  title: LS;
  detail: LS;
  action: LS;
  status: EventStatus;
  boxes: Box[];
  /** optional zone polygon (normalized points) highlighted in the snapshot */
  zone?: { points: [number, number][]; label: LS };
};

export const EVENT_TYPE_META: Record<
  EventType,
  { label: LS; icon: string; tone: "accent" | "warn" | "danger" | "ok" | "violet" }
> = {
  queue_threshold: { label: ls("Kuyruk eşiği", "Queue threshold"), icon: "Users", tone: "warn" },
  wait_time: { label: ls("Bekleme süresi", "Wait time"), icon: "Timer", tone: "warn" },
  capacity: { label: ls("Kapasite aşımı", "Capacity breach"), icon: "Gauge", tone: "danger" },
  dwell: { label: ls("Dwell time", "Dwell time"), icon: "Hourglass", tone: "accent" },
  loitering: { label: ls("Loitering", "Loitering"), icon: "EyeOff", tone: "warn" },
  unauthorized: { label: ls("Yetkisiz giriş", "Unauthorized access"), icon: "ShieldAlert", tone: "danger" },
  abandoned: { label: ls("Terk edilmiş nesne", "Abandoned object"), icon: "Briefcase", tone: "danger" },
  aggression: { label: ls("Agresif davranış", "Aggressive behaviour"), icon: "Swords", tone: "danger" },
  fall: { label: ls("Düşme / man-down", "Fall / man-down"), icon: "PersonStanding", tone: "danger" },
  smoke: { label: ls("Duman / yangın", "Smoke / fire"), icon: "Flame", tone: "danger" },
  illegal_parking: { label: ls("Yanlış park", "Illegal parking"), icon: "Car", tone: "warn" },
  lpr: { label: ls("Plaka tanıma", "Licence plate"), icon: "ScanLine", tone: "accent" },
  after_hours: { label: ls("Mesai dışı hareket", "After-hours motion"), icon: "MoonStar", tone: "warn" },
  trolley: { label: ls("Bırakılmış ekipman", "Left equipment"), icon: "ShoppingCart", tone: "warn" },
  sop: { label: ls("SOP kontrolü", "SOP check"), icon: "ClipboardCheck", tone: "violet" },
  tailgating: { label: ls("Tailgating", "Tailgating"), icon: "DoorOpen", tone: "warn" },
  flow_spike: { label: ls("Akış artışı", "Flow spike"), icon: "TrendingUp", tone: "accent" },
  camera_health: { label: ls("Kamera sağlığı", "Camera health"), icon: "VideoOff", tone: "warn" },
};

export const SEVERITY_META: Record<Severity, { label: LS; tone: "danger" | "warn" | "accent" | "ok" }> = {
  critical: { label: ls("Kritik", "Critical"), tone: "danger" },
  high: { label: ls("Yüksek", "High"), tone: "danger" },
  medium: { label: ls("Orta", "Medium"), tone: "warn" },
  low: { label: ls("Düşük", "Low"), tone: "accent" },
};

export const STATUS_META: Record<EventStatus, { label: LS }> = {
  new: { label: ls("Yeni", "New") },
  ack: { label: ls("İnceleniyor", "Acknowledged") },
  resolved: { label: ls("Kapatıldı", "Resolved") },
};

const person = (x: number, y: number, w: number, h: number, label: LS | string, tone: Box["tone"], conf = 0.93): Box => ({
  x, y, w, h, label, tone, conf, shape: "person",
});

export const EVENTS: VisionEvent[] = [
  {
    id: "EV-2418",
    type: "queue_threshold",
    cameraId: "CAM-01",
    area: "reception",
    at: minutesAgo(2),
    severity: "high",
    title: ls("Check-in kuyruğunda 7 kişi bekliyor", "7 guests waiting in check-in queue"),
    detail: ls(
      "Kuyruk 4 dakikadan uzun süredir 5 kişinin üzerinde. 2 banko açık, 3. banko kapalı.",
      "Queue has been above 5 people for over 4 minutes. 2 desks open, 3rd desk closed."
    ),
    action: ls("3. bankoyu aç — tahmini bekleme 4:32 → 2:10", "Open desk 3 — est. wait 4:32 → 2:10"),
    status: "new",
    zone: { points: [[0.16, 0.56], [0.72, 0.5], [0.86, 0.95], [0.08, 0.98]], label: ls("Kuyruk bölgesi", "Queue zone") },
    boxes: [
      person(0.2, 0.52, 0.1, 0.34, ls("Misafir · 3:10", "Guest · 3:10"), "warn", 0.96),
      person(0.31, 0.5, 0.1, 0.33, ls("Misafir · 2:44", "Guest · 2:44"), "warn", 0.94),
      person(0.42, 0.49, 0.1, 0.32, ls("Misafir · 2:05", "Guest · 2:05"), "accent", 0.92),
      person(0.53, 0.48, 0.09, 0.31, ls("Misafir · 1:32", "Guest · 1:32"), "accent", 0.9),
      person(0.63, 0.47, 0.09, 0.3, ls("Misafir · 0:58", "Guest · 0:58"), "accent", 0.89),
      person(0.72, 0.46, 0.09, 0.29, ls("Misafir · 0:22", "Guest · 0:22"), "accent", 0.87),
      person(0.12, 0.45, 0.09, 0.3, ls("Personel", "Staff"), "ok", 0.95),
    ],
  },
  {
    id: "EV-2417",
    type: "abandoned",
    cameraId: "CAM-03",
    area: "reception",
    at: minutesAgo(6),
    severity: "critical",
    title: ls("Lobide sahipsiz valiz — 6 dk", "Unattended suitcase in lobby — 6 min"),
    detail: ls(
      "Concierge bankosunun 4 m güneyinde bırakılan valiz, sahibi 6 dakikadır 3 m yarıçapında görülmedi.",
      "Suitcase left 4 m south of concierge desk; owner not seen within 3 m radius for 6 minutes."
    ),
    action: ls("Güvenlik ekibi yönlendirildi · lobi devriyesi", "Security team dispatched · lobby patrol"),
    status: "ack",
    boxes: [
      { x: 0.44, y: 0.6, w: 0.11, h: 0.17, label: ls("Valiz · sahipsiz", "Suitcase · unattended"), tone: "danger", conf: 0.91, shape: "object" },
      person(0.7, 0.44, 0.09, 0.3, ls("Personel", "Staff"), "ok", 0.93),
    ],
  },
  {
    id: "EV-2416",
    type: "capacity",
    cameraId: "CAM-30",
    area: "wellness",
    at: minutesAgo(9),
    severity: "high",
    title: ls("Açık havuz kapasitenin %78'inde", "Outdoor pool at 78% capacity"),
    detail: ls(
      "94/120 kişi. Son 30 dakikada +22 kişi girişi; %85 eşiğine tahmini 18 dakika.",
      "94/120 people. +22 entries in the last 30 minutes; 18 minutes to the 85% threshold."
    ),
    action: ls("Ek şezlong ve havlu stoğu hazırlanmalı", "Prepare extra sunbeds and towel stock"),
    status: "new",
    zone: { points: [[0.06, 0.52], [0.94, 0.46], [0.97, 0.97], [0.03, 0.97]], label: ls("Havuz alanı", "Pool area") },
    boxes: [
      person(0.14, 0.55, 0.07, 0.2, ls("Misafir", "Guest"), "accent", 0.88),
      person(0.26, 0.58, 0.07, 0.2, ls("Misafir", "Guest"), "accent", 0.9),
      person(0.38, 0.54, 0.06, 0.18, ls("Misafir", "Guest"), "accent", 0.86),
      person(0.5, 0.6, 0.07, 0.21, ls("Misafir", "Guest"), "accent", 0.91),
      person(0.62, 0.55, 0.06, 0.19, ls("Misafir", "Guest"), "accent", 0.85),
      person(0.74, 0.58, 0.07, 0.2, ls("Misafir", "Guest"), "accent", 0.89),
      person(0.85, 0.53, 0.06, 0.18, ls("Cankurtaran", "Lifeguard"), "ok", 0.94),
    ],
  },
  {
    id: "EV-2415",
    type: "unauthorized",
    cameraId: "CAM-60",
    area: "boh",
    at: minutesAgo(13),
    severity: "critical",
    title: ls("Personel alanına yetkisiz giriş", "Unauthorized entry into staff area"),
    detail: ls(
      "Turnikeden geçiş kaydı olmayan 1 kişi BOH koridoruna girdi. Üniforma tespit edilmedi.",
      "1 person entered the BOH corridor with no turnstile record. No uniform detected."
    ),
    action: ls("Kart kaydı ile eşleşme yok — güvenlik müdahalesi", "No badge match — security intervention"),
    status: "new",
    zone: { points: [[0.52, 0.42], [0.95, 0.4], [0.97, 0.96], [0.46, 0.97]], label: ls("Kısıtlı bölge", "Restricted zone") },
    boxes: [
      person(0.6, 0.38, 0.13, 0.44, ls("Kişi · yetkisiz", "Person · unauthorized"), "danger", 0.88),
      person(0.24, 0.42, 0.1, 0.34, ls("Personel · kart OK", "Staff · badge OK"), "ok", 0.96),
    ],
  },
  {
    id: "EV-2414",
    type: "wait_time",
    cameraId: "CAM-21",
    area: "fnb",
    at: minutesAgo(18),
    severity: "medium",
    title: ls("Buffet sıcak hatta 5:10 bekleme", "5:10 wait at buffet hot line"),
    detail: ls(
      "Omlet istasyonunda ortalama bekleme hedefin (3:00) üzerinde. Kuyrukta 14 kişi.",
      "Average wait at the omelette station is above the 3:00 target. 14 people queued."
    ),
    action: ls("2. omlet istasyonu açılmalı", "Open the 2nd omelette station"),
    status: "ack",
    zone: { points: [[0.1, 0.58], [0.66, 0.52], [0.78, 0.96], [0.04, 0.97]], label: ls("Buffet kuyruğu", "Buffet queue") },
    boxes: [
      person(0.16, 0.5, 0.1, 0.33, ls("Misafir · 4:20", "Guest · 4:20"), "warn", 0.93),
      person(0.28, 0.49, 0.1, 0.32, ls("Misafir · 3:50", "Guest · 3:50"), "warn", 0.92),
      person(0.4, 0.48, 0.09, 0.31, ls("Misafir · 2:40", "Guest · 2:40"), "accent", 0.9),
      person(0.51, 0.47, 0.09, 0.3, ls("Misafir · 1:15", "Guest · 1:15"), "accent", 0.88),
      person(0.78, 0.44, 0.1, 0.32, ls("Şef", "Chef"), "ok", 0.95),
    ],
  },
  {
    id: "EV-2413",
    type: "fall",
    cameraId: "CAM-31",
    area: "wellness",
    at: minutesAgo(24),
    severity: "critical",
    title: ls("Kapalı havuz kenarında düşme", "Fall at indoor pool edge"),
    detail: ls(
      "Islak zeminde düşme tespit edildi, kişi 12 saniye yerde kaldı. Cankurtaran 9 sn içinde müdahale etti.",
      "Fall detected on wet floor, person stayed down for 12 seconds. Lifeguard responded in 9 s."
    ),
    action: ls("Olay kapatıldı · kaza raporu oluşturuldu", "Incident closed · accident report created"),
    status: "resolved",
    boxes: [
      { x: 0.36, y: 0.68, w: 0.22, h: 0.13, label: ls("Düşme · man-down", "Fall · man-down"), tone: "danger", conf: 0.87, shape: "person-down" },
      person(0.66, 0.46, 0.1, 0.33, ls("Cankurtaran", "Lifeguard"), "ok", 0.95),
    ],
  },
  {
    id: "EV-2412",
    type: "illegal_parking",
    cameraId: "CAM-42",
    area: "parking",
    at: minutesAgo(27),
    severity: "medium",
    title: ls("Yangın yolunda park — 34 CV 8821", "Parked in fire lane — 34 CV 8821"),
    detail: ls(
      "Ön yolda yangın şeridine park eden araç 9 dakikadır bekliyor. Vale kaydı bulunamadı.",
      "Vehicle parked in the fire lane on the driveway for 9 minutes. No valet record found."
    ),
    action: ls("Vale ekibine bildirim gönderildi", "Notification sent to valet team"),
    status: "ack",
    zone: { points: [[0.28, 0.6], [0.86, 0.55], [0.92, 0.9], [0.22, 0.95]], label: ls("Yangın yolu", "Fire lane") },
    boxes: [
      { x: 0.34, y: 0.5, w: 0.3, h: 0.28, label: "34 CV 8821", tone: "danger", conf: 0.97, shape: "vehicle" },
      { x: 0.7, y: 0.46, w: 0.2, h: 0.2, label: "06 BLK 117", tone: "ok", conf: 0.94, shape: "vehicle" },
    ],
  },
  {
    id: "EV-2411",
    type: "trolley",
    cameraId: "CAM-50",
    area: "housekeeping",
    at: minutesAgo(33),
    severity: "medium",
    title: ls("Koridorda 22 dk bırakılmış servis arabası", "Service trolley left for 22 min in corridor"),
    detail: ls(
      "4. kat batı koridoru, 412 numaralı odanın önü. SOP limiti 15 dakika.",
      "Floor 4 west corridor, in front of room 412. SOP limit is 15 minutes."
    ),
    action: ls("Kat görevlisine hatırlatma gönderildi", "Reminder sent to the floor attendant"),
    status: "new",
    boxes: [
      { x: 0.52, y: 0.52, w: 0.16, h: 0.26, label: ls("Servis arabası · 22:14", "Trolley · 22:14"), tone: "warn", conf: 0.93, shape: "object" },
    ],
  },
  {
    id: "EV-2410",
    type: "loitering",
    cameraId: "CAM-51",
    area: "housekeeping",
    at: minutesAgo(41),
    severity: "high",
    title: ls("2. kat koridorunda uzun süreli bekleme", "Prolonged loitering in 2nd floor corridor"),
    detail: ls(
      "Aynı kişi 8 dakikadır kat koridorunda dolaşıyor, oda girişi yok.",
      "Same person has been moving in the guest corridor for 8 minutes with no room entry."
    ),
    action: ls("Güvenlik kamerayı canlı izlemeye aldı", "Security started live monitoring"),
    status: "ack",
    boxes: [person(0.42, 0.4, 0.14, 0.45, ls("Kişi · 8:02 loitering", "Person · 8:02 loitering"), "danger", 0.9)],
  },
  {
    id: "EV-2409",
    type: "aggression",
    cameraId: "CAM-13",
    area: "lobby",
    at: minutesAgo(52),
    severity: "critical",
    title: ls("Lobi barda agresif davranış şüphesi", "Possible aggressive behaviour at lobby bar"),
    detail: ls(
      "Hızlı el hareketi ve yakın mesafe temas paterni algılandı, 2 kişi. Güven skoru %78.",
      "Rapid arm motion and close-contact pattern detected between 2 people. Confidence 78%."
    ),
    action: ls("Güvenlik müdahale etti · olay sözlü uyarı ile kapandı", "Security intervened · closed with verbal warning"),
    status: "resolved",
    boxes: [
      person(0.36, 0.4, 0.12, 0.42, ls("Kişi A", "Person A"), "danger", 0.78),
      person(0.5, 0.41, 0.12, 0.41, ls("Kişi B", "Person B"), "danger", 0.76),
    ],
  },
  {
    id: "EV-2408",
    type: "capacity",
    cameraId: "CAM-70",
    area: "banquet",
    at: minutesAgo(58),
    severity: "high",
    title: ls("Balo salonu kapasitenin %86'sında", "Ballroom at 86% of capacity"),
    detail: ls(
      "386/450 kişi. Kapasite aşımı eşiği %90. Giriş hızı 42 kişi/dk.",
      "386/450 people. Breach threshold is 90%. Entry rate 42 people/min."
    ),
    action: ls("Giriş hızını yavaşlat · 2. salon kapısını aç", "Slow entry rate · open second hall door"),
    status: "ack",
    zone: { points: [[0.04, 0.44], [0.96, 0.42], [0.98, 0.97], [0.02, 0.97]], label: ls("Salon alanı", "Hall area") },
    boxes: [
      person(0.12, 0.5, 0.06, 0.18, ls("Misafir", "Guest"), "accent", 0.84),
      person(0.24, 0.52, 0.06, 0.18, ls("Misafir", "Guest"), "accent", 0.86),
      person(0.36, 0.5, 0.05, 0.17, ls("Misafir", "Guest"), "accent", 0.83),
      person(0.48, 0.54, 0.06, 0.19, ls("Misafir", "Guest"), "accent", 0.88),
      person(0.6, 0.51, 0.05, 0.17, ls("Misafir", "Guest"), "accent", 0.82),
      person(0.72, 0.53, 0.06, 0.18, ls("Misafir", "Guest"), "accent", 0.85),
      person(0.84, 0.5, 0.05, 0.17, ls("Misafir", "Guest"), "accent", 0.81),
    ],
  },
  {
    id: "EV-2407",
    type: "smoke",
    cameraId: "CAM-62",
    area: "boh",
    at: minutesAgo(66),
    severity: "critical",
    title: ls("Yükleme rampasında duman tespiti", "Smoke detected at loading dock"),
    detail: ls(
      "Atık konteyneri yakınında 14 saniye süren duman paterni. Sıcaklık artışı kamerada doğrulandı.",
      "Smoke pattern lasting 14 seconds near the waste container. Temperature rise confirmed on camera."
    ),
    action: ls("Teknik servis kontrol etti · sigara kaynaklı, kapatıldı", "Technical service checked · cigarette related, closed"),
    status: "resolved",
    boxes: [
      { x: 0.56, y: 0.34, w: 0.26, h: 0.3, label: ls("Duman · %81", "Smoke · 81%"), tone: "danger", conf: 0.81, shape: "smoke" },
    ],
  },
  {
    id: "EV-2406",
    type: "after_hours",
    cameraId: "CAM-61",
    area: "boh",
    at: minutesAgo(74),
    severity: "high",
    title: ls("Ana depoda mesai dışı hareket", "After-hours motion in main storage"),
    detail: ls(
      "Depo 02:40'ta kapalı olarak işaretliydi; 2 kişi 4 dakika içeride kaldı.",
      "Storage was marked closed at 02:40; 2 people stayed inside for 4 minutes."
    ),
    action: ls("Vardiya amiri raporladı · yetkili personel doğrulandı", "Shift supervisor reported · authorized staff verified"),
    status: "resolved",
    boxes: [
      person(0.3, 0.42, 0.11, 0.36, ls("Personel", "Staff"), "warn", 0.9),
      person(0.56, 0.44, 0.1, 0.34, ls("Personel", "Staff"), "warn", 0.88),
    ],
  },
  {
    id: "EV-2405",
    type: "tailgating",
    cameraId: "CAM-60",
    area: "boh",
    at: minutesAgo(88),
    severity: "medium",
    title: ls("Turnikede tailgating — 2 kişi 1 kart", "Tailgating at turnstile — 2 people 1 badge"),
    detail: ls("Tek kart okutmasında 2 kişi geçiş yaptı.", "2 people passed on a single badge read."),
    action: ls("İK'ya bilgilendirme gönderildi", "Notification sent to HR"),
    status: "resolved",
    boxes: [
      person(0.38, 0.4, 0.11, 0.38, ls("Kart sahibi", "Badge holder"), "ok", 0.94),
      person(0.5, 0.41, 0.11, 0.37, ls("Takip eden", "Follower"), "warn", 0.89),
    ],
  },
  {
    id: "EV-2404",
    type: "dwell",
    cameraId: "CAM-11",
    area: "lobby",
    at: minutesAgo(96),
    severity: "low",
    title: ls("Lobi oturma alanında dwell 18 dk", "18 min dwell in lobby seating"),
    detail: ls(
      "Ortalama bölge kalış süresi normalin %40 üzerinde — check-in gecikmesiyle korele.",
      "Average zone dwell is 40% above normal — correlates with check-in delay."
    ),
    action: ls("Check-in kuyruğu ile ilişkilendirildi", "Correlated with the check-in queue"),
    status: "resolved",
    boxes: [
      person(0.2, 0.5, 0.09, 0.3, ls("Misafir · 21 dk", "Guest · 21 min"), "violet", 0.9),
      person(0.46, 0.52, 0.09, 0.3, ls("Misafir · 17 dk", "Guest · 17 min"), "violet", 0.91),
      person(0.68, 0.49, 0.09, 0.29, ls("Misafir · 14 dk", "Guest · 14 min"), "accent", 0.89),
    ],
  },
  {
    id: "EV-2403",
    type: "sop",
    cameraId: "CAM-52",
    area: "housekeeping",
    at: minutesAgo(112),
    severity: "medium",
    title: ls("Çamaşırhane SOP adımı atlandı", "Laundry SOP step skipped"),
    detail: ls(
      "Kirli-temiz ayrım adımı 3 turda tespit edilemedi (beklenen 12/12).",
      "Soiled-clean separation step not detected in 3 cycles (expected 12/12)."
    ),
    action: ls("Housekeeping şefine eğitim notu oluşturuldu", "Training note created for housekeeping supervisor"),
    status: "ack",
    boxes: [person(0.44, 0.42, 0.13, 0.4, ls("Personel · adım eksik", "Staff · step missing"), "violet", 0.86)],
  },
  {
    id: "EV-2402",
    type: "flow_spike",
    cameraId: "CAM-10",
    area: "lobby",
    at: minutesAgo(128),
    severity: "low",
    title: ls("Ana girişte akış artışı: 186 kişi/15 dk", "Entrance flow spike: 186 people/15 min"),
    detail: ls(
      "Tur otobüsü kaynaklı giriş dalgası. Resepsiyon kuyruğuna 11 dk gecikmeli yansıdı.",
      "Entry surge caused by a tour bus. Reflected on the reception queue with an 11 min delay."
    ),
    action: ls("Grup check-in masası önerildi", "Group check-in desk recommended"),
    status: "resolved",
    boxes: [
      person(0.18, 0.46, 0.09, 0.3, ls("Giriş", "Entry"), "accent", 0.92),
      person(0.34, 0.48, 0.09, 0.3, ls("Giriş", "Entry"), "accent", 0.91),
      person(0.5, 0.45, 0.08, 0.28, ls("Giriş", "Entry"), "accent", 0.9),
      person(0.66, 0.47, 0.09, 0.29, ls("Çıkış", "Exit"), "ok", 0.9),
    ],
  },
  {
    id: "EV-2401",
    type: "camera_health",
    cameraId: "CAM-63",
    area: "boh",
    at: minutesAgo(146),
    severity: "medium",
    title: ls("CAM-63 sinyal kaybı", "CAM-63 signal loss"),
    detail: ls(
      "Mutfak servis koridoru kamerası 2 sa 26 dk offline. PoE switch portu yanıt vermiyor.",
      "Kitchen service corridor camera offline for 2 h 26 min. PoE switch port not responding."
    ),
    action: ls("Teknik servis iş emri #4821 açıldı", "Technical service work order #4821 opened"),
    status: "ack",
    boxes: [],
  },
  {
    id: "EV-2400",
    type: "lpr",
    cameraId: "CAM-40",
    area: "parking",
    at: minutesAgo(154),
    severity: "low",
    title: ls("VIP plaka tanındı — 34 VIP 007", "VIP plate recognized — 34 VIP 007"),
    detail: ls(
      "Suit misafiri aracı P1 girişinde tanındı, bariyer otomatik açıldı.",
      "Suite guest vehicle recognized at P1 entry, barrier opened automatically."
    ),
    action: ls("Resepsiyona karşılama bildirimi gönderildi", "Welcome notification sent to reception"),
    status: "resolved",
    boxes: [{ x: 0.32, y: 0.46, w: 0.34, h: 0.3, label: "34 VIP 007", tone: "ok", conf: 0.98, shape: "vehicle" }],
  },
];

export const eventsOf = (area: AreaId) => EVENTS.filter((e) => e.area === area);
export const eventsOfCamera = (cameraId: string) => EVENTS.filter((e) => e.cameraId === cameraId);
export const openEvents = EVENTS.filter((e) => e.status !== "resolved");

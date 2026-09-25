import { ls, type LS } from "../i18n";

/** ---------- Reception ---------- */
export const receptionHourly = [
  { t: "06:00", queue: 1, wait: 48, arrivals: 6 },
  { t: "07:00", queue: 2, wait: 72, arrivals: 14 },
  { t: "08:00", queue: 3, wait: 118, arrivals: 26 },
  { t: "09:00", queue: 5, wait: 208, arrivals: 41 },
  { t: "10:00", queue: 4, wait: 164, arrivals: 33 },
  { t: "11:00", queue: 3, wait: 122, arrivals: 28 },
  { t: "12:00", queue: 6, wait: 246, arrivals: 52 },
  { t: "13:00", queue: 8, wait: 322, arrivals: 71 },
  { t: "14:00", queue: 11, wait: 412, arrivals: 96 },
  { t: "15:00", queue: 9, wait: 358, arrivals: 88 },
  { t: "16:00", queue: 6, wait: 262, arrivals: 64 },
  { t: "17:00", queue: 4, wait: 178, arrivals: 42 },
  { t: "18:00", queue: 3, wait: 132, arrivals: 31 },
  { t: "19:00", queue: 2, wait: 96, arrivals: 22 },
  { t: "20:00", queue: 2, wait: 84, arrivals: 18 },
  { t: "21:00", queue: 1, wait: 56, arrivals: 11 },
];

/** queue length in 5-minute steps for the last 90 minutes */
export const receptionLive = [
  { t: "08:15", queue: 3, desks: 2 },
  { t: "08:20", queue: 4, desks: 2 },
  { t: "08:25", queue: 4, desks: 2 },
  { t: "08:30", queue: 6, desks: 2 },
  { t: "08:35", queue: 5, desks: 3 },
  { t: "08:40", queue: 3, desks: 3 },
  { t: "08:45", queue: 2, desks: 3 },
  { t: "08:50", queue: 2, desks: 3 },
  { t: "08:55", queue: 3, desks: 2 },
  { t: "09:00", queue: 4, desks: 2 },
  { t: "09:05", queue: 5, desks: 2 },
  { t: "09:10", queue: 5, desks: 2 },
  { t: "09:15", queue: 6, desks: 2 },
  { t: "09:20", queue: 6, desks: 2 },
  { t: "09:25", queue: 7, desks: 2 },
  { t: "09:30", queue: 6, desks: 2 },
  { t: "09:35", queue: 7, desks: 2 },
  { t: "09:40", queue: 7, desks: 2 },
];

export const deskPerformance = [
  { desk: ls("Banko 1", "Desk 1"), handled: 64, avg: 3.2, open: true },
  { desk: ls("Banko 2", "Desk 2"), handled: 58, avg: 3.8, open: true },
  { desk: ls("Banko 3", "Desk 3"), handled: 0, avg: 0, open: false },
  { desk: ls("Grup / Tur", "Group / Tour"), handled: 22, avg: 6.4, open: false },
];

/** 7 days x 24 hours reception density, 0..100 */
export const densityHeatmap: { day: LS; values: number[] }[] = (() => {
  const base = [4, 3, 2, 2, 2, 5, 12, 26, 44, 58, 46, 38, 62, 74, 92, 86, 68, 52, 40, 34, 28, 20, 12, 7];
  const factors: { day: LS; f: number }[] = [
    { day: ls("Pzt", "Mon"), f: 0.82 },
    { day: ls("Sal", "Tue"), f: 0.88 },
    { day: ls("Çar", "Wed"), f: 0.94 },
    { day: ls("Per", "Thu"), f: 1.0 },
    { day: ls("Cum", "Fri"), f: 1.12 },
    { day: ls("Cmt", "Sat"), f: 1.18 },
    { day: ls("Paz", "Sun"), f: 0.96 },
  ];
  return factors.map(({ day, f }, di) => ({
    day,
    values: base.map((v, hi) => Math.min(100, Math.round(v * f + ((di * 7 + hi * 3) % 9) - 4))),
  }));
})();

/** ---------- Lobby ---------- */
export const lobbyOccupancy = [
  { t: "06:00", people: 8, cap: 60 },
  { t: "07:00", people: 18, cap: 60 },
  { t: "08:00", people: 31, cap: 60 },
  { t: "09:00", people: 42, cap: 60 },
  { t: "10:00", people: 34, cap: 60 },
  { t: "11:00", people: 26, cap: 60 },
  { t: "12:00", people: 30, cap: 60 },
  { t: "13:00", people: 38, cap: 60 },
  { t: "14:00", people: 51, cap: 60 },
  { t: "15:00", people: 47, cap: 60 },
  { t: "16:00", people: 36, cap: 60 },
  { t: "17:00", people: 29, cap: 60 },
  { t: "18:00", people: 33, cap: 60 },
  { t: "19:00", people: 40, cap: 60 },
  { t: "20:00", people: 35, cap: 60 },
  { t: "21:00", people: 22, cap: 60 },
];

export const flowFunnel: { from: LS; to: LS; people: number; avgSec: number }[] = [
  { from: ls("Ana giriş", "Main entrance"), to: ls("Resepsiyon", "Reception"), people: 742, avgSec: 38 },
  { from: ls("Resepsiyon", "Reception"), to: ls("Asansör holü", "Elevator hall"), people: 611, avgSec: 272 },
  { from: ls("Asansör holü", "Elevator hall"), to: ls("Kat çıkışı", "Floor exit"), people: 588, avgSec: 64 },
  { from: ls("Ana giriş", "Main entrance"), to: ls("Lobi bar", "Lobby bar"), people: 168, avgSec: 52 },
  { from: ls("Ana giriş", "Main entrance"), to: ls("F&B / Restoran", "F&B / Restaurant"), people: 214, avgSec: 71 },
];

export const dwellBuckets = [
  { bucket: "0-2 dk", en: "0-2 min", people: 186 },
  { bucket: "2-5 dk", en: "2-5 min", people: 254 },
  { bucket: "5-10 dk", en: "5-10 min", people: 198 },
  { bucket: "10-20 dk", en: "10-20 min", people: 121 },
  { bucket: "20-40 dk", en: "20-40 min", people: 58 },
  { bucket: "40+ dk", en: "40+ min", people: 19 },
];

export const entryExitFlow = [
  { t: "06:00", in: 12, out: 5 },
  { t: "07:00", in: 34, out: 11 },
  { t: "08:00", in: 58, out: 41 },
  { t: "09:00", in: 96, out: 72 },
  { t: "10:00", in: 74, out: 88 },
  { t: "11:00", in: 62, out: 66 },
  { t: "12:00", in: 81, out: 58 },
  { t: "13:00", in: 104, out: 64 },
  { t: "14:00", in: 138, out: 71 },
  { t: "15:00", in: 121, out: 84 },
  { t: "16:00", in: 88, out: 92 },
  { t: "17:00", in: 71, out: 78 },
  { t: "18:00", in: 66, out: 61 },
  { t: "19:00", in: 58, out: 47 },
  { t: "20:00", in: 41, out: 38 },
  { t: "21:00", in: 26, out: 31 },
];

/** ---------- F&B ---------- */
export const breakfastProfile = [
  { t: "06:30", people: 14, queue: 0 },
  { t: "06:45", people: 28, queue: 1 },
  { t: "07:00", people: 52, queue: 2 },
  { t: "07:15", people: 74, queue: 4 },
  { t: "07:30", people: 96, queue: 6 },
  { t: "07:45", people: 118, queue: 9 },
  { t: "08:00", people: 134, queue: 14 },
  { t: "08:15", people: 141, queue: 16 },
  { t: "08:30", people: 138, queue: 13 },
  { t: "08:45", people: 126, queue: 11 },
  { t: "09:00", people: 108, queue: 7 },
  { t: "09:15", people: 84, queue: 4 },
  { t: "09:30", people: 62, queue: 2 },
  { t: "09:45", people: 41, queue: 1 },
  { t: "10:00", people: 24, queue: 0 },
  { t: "10:15", people: 11, queue: 0 },
];

export const outlets: { name: LS; occupied: number; capacity: number; turnover: number; queue: number }[] = [
  { name: ls("Ana restoran", "Main restaurant"), occupied: 96, capacity: 140, turnover: 54, queue: 8 },
  { name: ls("Teras restoran", "Terrace restaurant"), occupied: 41, capacity: 80, turnover: 71, queue: 0 },
  { name: ls("Lobi bar", "Lobby bar"), occupied: 18, capacity: 40, turnover: 96, queue: 0 },
  { name: ls("Havuz bar", "Pool bar"), occupied: 26, capacity: 35, turnover: 44, queue: 2 },
  { name: ls("À la carte (akşam)", "À la carte (dinner)"), occupied: 0, capacity: 60, turnover: 0, queue: 0 },
];

export const tableTurnover = [
  { t: "Pzt", en: "Mon", min: 58 },
  { t: "Sal", en: "Tue", min: 61 },
  { t: "Çar", en: "Wed", min: 54 },
  { t: "Per", en: "Thu", min: 49 },
  { t: "Cum", en: "Fri", min: 66 },
  { t: "Cmt", en: "Sat", min: 74 },
  { t: "Paz", en: "Sun", min: 68 },
];

/** ---------- Wellness ---------- */
export const wellnessVenues: {
  name: LS;
  cameraId: string;
  current: number;
  capacity: number;
  threshold: number;
  peak: LS;
}[] = [
  { name: ls("Açık havuz", "Outdoor pool"), cameraId: "CAM-30", current: 94, capacity: 120, threshold: 85, peak: ls("13:00–15:00", "13:00–15:00") },
  { name: ls("Kapalı havuz", "Indoor pool"), cameraId: "CAM-31", current: 21, capacity: 45, threshold: 85, peak: ls("18:00–20:00", "18:00–20:00") },
  { name: ls("Spa & ıslak alan", "Spa & wet area"), cameraId: "CAM-32", current: 9, capacity: 30, threshold: 80, peak: ls("16:00–18:00", "16:00–18:00") },
  { name: ls("Fitness", "Fitness"), cameraId: "CAM-33", current: 17, capacity: 25, threshold: 80, peak: ls("07:00–09:00", "07:00–09:00") },
];

export const wellnessHourly = [
  { t: "07:00", pool: 12, spa: 2, gym: 22 },
  { t: "08:00", pool: 26, spa: 4, gym: 19 },
  { t: "09:00", pool: 44, spa: 6, gym: 14 },
  { t: "10:00", pool: 68, spa: 9, gym: 11 },
  { t: "11:00", pool: 82, spa: 12, gym: 9 },
  { t: "12:00", pool: 88, spa: 14, gym: 7 },
  { t: "13:00", pool: 101, spa: 11, gym: 6 },
  { t: "14:00", pool: 108, spa: 13, gym: 8 },
  { t: "15:00", pool: 96, spa: 18, gym: 12 },
  { t: "16:00", pool: 74, spa: 24, gym: 16 },
  { t: "17:00", pool: 52, spa: 27, gym: 21 },
  { t: "18:00", pool: 31, spa: 22, gym: 24 },
  { t: "19:00", pool: 18, spa: 16, gym: 18 },
  { t: "20:00", pool: 9, spa: 8, gym: 11 },
];

/** ---------- Parking ---------- */
export const parkingLots: { name: LS; occupied: number; capacity: number }[] = [
  { name: ls("P1 — A bloğu", "P1 — Block A"), occupied: 148, capacity: 180 },
  { name: ls("P1 — B bloğu", "P1 — Block B"), occupied: 96, capacity: 140 },
  { name: ls("Vale alanı", "Valet area"), occupied: 34, capacity: 40 },
  { name: ls("Otobüs / servis", "Bus / service"), occupied: 5, capacity: 12 },
];

export const parkingHourly = [
  { t: "00:00", occ: 212 },
  { t: "03:00", occ: 226 },
  { t: "06:00", occ: 218 },
  { t: "09:00", occ: 241 },
  { t: "12:00", occ: 268 },
  { t: "15:00", occ: 302 },
  { t: "18:00", occ: 318 },
  { t: "21:00", occ: 286 },
];

export type PlateRecord = {
  plate: string;
  at: string;
  dir: "in" | "out";
  camera: string;
  tag: LS;
  tone: "ok" | "accent" | "warn" | "danger";
};

export const plateLog: PlateRecord[] = [
  { plate: "34 VIP 007", at: "09:38", dir: "in", camera: "CAM-40", tag: ls("VIP misafir", "VIP guest"), tone: "ok" },
  { plate: "34 CV 8821", at: "09:33", dir: "in", camera: "CAM-42", tag: ls("Yangın yolunda park", "Parked in fire lane"), tone: "danger" },
  { plate: "06 BLK 117", at: "09:29", dir: "in", camera: "CAM-40", tag: ls("Günübirlik", "Day visitor"), tone: "accent" },
  { plate: "35 TUR 442", at: "09:21", dir: "in", camera: "CAM-40", tag: ls("Tur otobüsü", "Tour bus"), tone: "accent" },
  { plate: "34 HZ 9010", at: "09:14", dir: "out", camera: "CAM-40", tag: ls("Misafir çıkışı", "Guest exit"), tone: "ok" },
  { plate: "41 DK 5533", at: "09:06", dir: "in", camera: "CAM-62", tag: ls("Tedarikçi · rampa", "Supplier · dock"), tone: "accent" },
  { plate: "34 ZR 7742", at: "08:58", dir: "out", camera: "CAM-40", tag: ls("Personel", "Staff"), tone: "ok" },
  { plate: "07 AP 1204", at: "08:47", dir: "in", camera: "CAM-42", tag: ls("Vale teslim", "Valet handover"), tone: "ok" },
  { plate: "34 BN 3388", at: "08:41", dir: "in", camera: "CAM-40", tag: ls("Kara liste · uyarı", "Blacklist · alert"), tone: "warn" },
  { plate: "16 EM 6621", at: "08:32", dir: "out", camera: "CAM-62", tag: ls("Tedarikçi çıkışı", "Supplier exit"), tone: "accent" },
];

/** ---------- Housekeeping ---------- */
export const floorSop: { floor: LS; rooms: number; done: number; sop: number; trolleyAlerts: number }[] = [
  { floor: ls("1. Kat", "Floor 1"), rooms: 58, done: 51, sop: 96, trolleyAlerts: 0 },
  { floor: ls("2. Kat", "Floor 2"), rooms: 58, done: 44, sop: 91, trolleyAlerts: 1 },
  { floor: ls("3. Kat", "Floor 3"), rooms: 58, done: 47, sop: 94, trolleyAlerts: 0 },
  { floor: ls("4. Kat", "Floor 4"), rooms: 58, done: 39, sop: 82, trolleyAlerts: 2 },
  { floor: ls("5. Kat", "Floor 5"), rooms: 56, done: 42, sop: 88, trolleyAlerts: 1 },
  { floor: ls("6. Kat — Suit", "Floor 6 — Suites"), rooms: 54, done: 48, sop: 98, trolleyAlerts: 0 },
];

export const sopSteps: { step: LS; rate: number }[] = [
  { step: ls("Odaya giriş bildirimi", "Room entry announcement"), rate: 97 },
  { step: ls("Kirli çarşaf ayrımı", "Soiled linen separation"), rate: 89 },
  { step: ls("Yüzey dezenfeksiyonu", "Surface disinfection"), rate: 93 },
  { step: ls("Mini bar kontrolü", "Mini bar check"), rate: 84 },
  { step: ls("Amenity tamamlama", "Amenity replenishment"), rate: 91 },
  { step: ls("Çıkışta kapı kilidi", "Door lock on exit"), rate: 99 },
];

/** ---------- Back of house ---------- */
export const bohZones: { zone: LS; cameraId: string; risk: LS; events24h: number; tone: "ok" | "warn" | "danger" }[] = [
  { zone: ls("Personel girişi / turnike", "Staff entrance / turnstile"), cameraId: "CAM-60", risk: ls("Tailgating", "Tailgating"), events24h: 4, tone: "warn" },
  { zone: ls("Ana depo", "Main storage"), cameraId: "CAM-61", risk: ls("Mesai dışı hareket", "After-hours motion"), events24h: 2, tone: "warn" },
  { zone: ls("Yükleme rampası", "Loading dock"), cameraId: "CAM-62", risk: ls("Araç/personel karışımı", "Vehicle & staff mix"), events24h: 6, tone: "danger" },
  { zone: ls("Mutfak servis koridoru", "Kitchen service corridor"), cameraId: "CAM-63", risk: ls("Kamera offline", "Camera offline"), events24h: 1, tone: "danger" },
  { zone: ls("Çamaşırhane", "Laundry"), cameraId: "CAM-52", risk: ls("SOP sapması", "SOP deviation"), events24h: 3, tone: "ok" },
];

export const dockActivity = [
  { t: "05:00", trucks: 3, staff: 6 },
  { t: "06:00", trucks: 5, staff: 9 },
  { t: "07:00", trucks: 4, staff: 11 },
  { t: "08:00", trucks: 2, staff: 8 },
  { t: "09:00", trucks: 3, staff: 7 },
  { t: "10:00", trucks: 1, staff: 4 },
  { t: "11:00", trucks: 2, staff: 5 },
  { t: "12:00", trucks: 0, staff: 3 },
];

/** ---------- Banquet ---------- */
export const banquetEvents: {
  name: LS;
  hall: LS;
  attendees: number;
  capacity: number;
  window: string;
  status: LS;
  tone: "ok" | "warn" | "accent";
}[] = [
  { name: ls("Teknoloji Zirvesi 2026", "Tech Summit 2026"), hall: ls("Ana balo salonu", "Main ballroom"), attendees: 386, capacity: 450, window: "08:30–17:00", status: ls("Devam ediyor", "In progress"), tone: "warn" },
  { name: ls("Yılmaz düğünü", "Yılmaz wedding"), hall: ls("Bosphorus salonu", "Bosphorus hall"), attendees: 0, capacity: 260, window: "19:00–00:30", status: ls("Hazırlık", "Setup"), tone: "accent" },
  { name: ls("Bayi toplantısı", "Dealer meeting"), hall: ls("Toplantı 3", "Meeting 3"), attendees: 42, capacity: 60, window: "09:00–12:00", status: ls("Devam ediyor", "In progress"), tone: "ok" },
  { name: ls("Basın lansmanı", "Press launch"), hall: ls("Foyer", "Foyer"), attendees: 23, capacity: 90, window: "11:00–13:00", status: ls("Kayıt açık", "Registration open"), tone: "accent" },
];

export const banquetTimeline = [
  { t: "08:00", inside: 12, queue: 4 },
  { t: "08:30", inside: 86, queue: 31 },
  { t: "09:00", inside: 214, queue: 44 },
  { t: "09:30", inside: 318, queue: 26 },
  { t: "10:00", inside: 372, queue: 12 },
  { t: "10:30", inside: 386, queue: 23 },
  { t: "11:00", inside: 361, queue: 9 },
  { t: "11:30", inside: 344, queue: 6 },
  { t: "12:00", inside: 218, queue: 3 },
];

/** ---------- Security & overview ---------- */
export const eventsByType: { key: string; label: LS; count: number }[] = [
  { key: "queue", label: ls("Kuyruk / bekleme", "Queue / wait"), count: 34 },
  { key: "capacity", label: ls("Kapasite", "Capacity"), count: 21 },
  { key: "loitering", label: ls("Loitering", "Loitering"), count: 12 },
  { key: "unauthorized", label: ls("Yetkisiz giriş", "Unauthorized"), count: 9 },
  { key: "abandoned", label: ls("Terk edilmiş nesne", "Abandoned object"), count: 6 },
  { key: "parking", label: ls("Otopark", "Parking"), count: 14 },
  { key: "sop", label: ls("SOP / housekeeping", "SOP / housekeeping"), count: 17 },
  { key: "safety", label: ls("Düşme / duman", "Fall / smoke"), count: 3 },
];

export const eventsTrend = [
  { t: "19 Eyl", en: "Sep 19", security: 8, ops: 26 },
  { t: "20 Eyl", en: "Sep 20", security: 11, ops: 31 },
  { t: "21 Eyl", en: "Sep 21", security: 6, ops: 24 },
  { t: "22 Eyl", en: "Sep 22", security: 9, ops: 29 },
  { t: "23 Eyl", en: "Sep 23", security: 14, ops: 38 },
  { t: "24 Eyl", en: "Sep 24", security: 12, ops: 44 },
  { t: "25 Eyl", en: "Sep 25", security: 7, ops: 41 },
];

export const responseTimes: { team: LS; avgSec: number; target: number }[] = [
  { team: ls("Güvenlik", "Security"), avgSec: 84, target: 120 },
  { team: ls("Ön büro", "Front office"), avgSec: 146, target: 180 },
  { team: ls("Housekeeping", "Housekeeping"), avgSec: 412, target: 360 },
  { team: ls("Teknik servis", "Technical"), avgSec: 638, target: 600 },
  { team: ls("F&B", "F&B"), avgSec: 208, target: 240 },
];

export const guestSatisfaction = [
  { t: "Hf 30", en: "W30", score: 8.1, wait: 312 },
  { t: "Hf 31", en: "W31", score: 8.0, wait: 336 },
  { t: "Hf 32", en: "W32", score: 8.3, wait: 288 },
  { t: "Hf 33", en: "W33", score: 8.5, wait: 264 },
  { t: "Hf 34", en: "W34", score: 8.6, wait: 251 },
  { t: "Hf 35", en: "W35", score: 8.8, wait: 238 },
  { t: "Hf 36", en: "W36", score: 8.9, wait: 226 },
];

export const zoneOccupancy: { zone: LS; current: number; capacity: number; trend: number }[] = [
  { zone: ls("Lobi", "Lobby"), current: 34, capacity: 60, trend: 6 },
  { zone: ls("Resepsiyon bekleme", "Reception waiting"), current: 11, capacity: 24, trend: 3 },
  { zone: ls("Ana restoran", "Main restaurant"), current: 96, capacity: 140, trend: -12 },
  { zone: ls("Açık havuz", "Outdoor pool"), current: 94, capacity: 120, trend: 22 },
  { zone: ls("Fitness", "Fitness"), current: 17, capacity: 25, trend: -2 },
  { zone: ls("Balo salonu", "Ballroom"), current: 386, capacity: 450, trend: 14 },
  { zone: ls("Spa", "Spa"), current: 9, capacity: 30, trend: 1 },
  { zone: ls("Otopark P1", "Car park P1"), current: 244, capacity: 320, trend: 8 },
];

export const lcdScreens: { name: LS; location: LS; content: LS; status: "online" | "offline" }[] = [
  { name: ls("Lobi LCD 1", "Lobby LCD 1"), location: ls("Ana giriş karşısı", "Facing main entrance"), content: ls("Kuyruk durumu + hava", "Queue status + weather"), status: "online" },
  { name: ls("Resepsiyon LCD", "Reception LCD"), location: ls("Banko arkası", "Behind the desk"), content: ls("Anlık bekleme süresi", "Live wait time"), status: "online" },
  { name: ls("Restoran girişi LCD", "Restaurant entry LCD"), location: ls("Host bankosu", "Host desk"), content: ls("Doluluk + tahmini bekleme", "Occupancy + est. wait"), status: "online" },
  { name: ls("Havuz LCD", "Pool LCD"), location: ls("Havuz bar", "Pool bar"), content: ls("Havuz doluluk %", "Pool occupancy %"), status: "online" },
  { name: ls("Personel LCD (BOH)", "Staff LCD (BOH)"), location: ls("Personel yemekhanesi", "Staff canteen"), content: ls("Vardiya KPI özeti", "Shift KPI summary"), status: "offline" },
  { name: ls("Balo foyer LCD", "Ballroom foyer LCD"), location: ls("Registration", "Registration"), content: ls("Etkinlik kuyruğu", "Event queue"), status: "online" },
];

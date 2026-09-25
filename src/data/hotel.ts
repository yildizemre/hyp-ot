import { ls, type LS } from "../i18n";

export type SceneKind =
  | "reception"
  | "lobby"
  | "entrance"
  | "elevator"
  | "restaurant"
  | "buffet"
  | "pool"
  | "spa"
  | "gym"
  | "corridor"
  | "parking"
  | "gate"
  | "warehouse"
  | "dock"
  | "ballroom"
  | "staff";

export type AreaId =
  | "reception"
  | "lobby"
  | "fnb"
  | "wellness"
  | "security"
  | "parking"
  | "housekeeping"
  | "boh"
  | "banquet";

export type Camera = {
  id: string;
  name: LS;
  area: AreaId;
  kind: SceneKind;
  floor: LS;
  status: "online" | "offline" | "degraded";
  fps: number;
  models: LS[];
  /** live people/vehicle count coming from the analytics engine */
  count: number;
  capacity?: number;
};

export const HOTEL = {
  brand: "hype",
  property: ls("Demo Bosphorus Resort & Spa", "Demo Bosphorus Resort & Spa"),
  subtitle: ls(
    "342 oda · 6 kat · 38 kamera canlı analiz ediliyor",
    "342 rooms · 6 floors · 38 cameras under live analysis"
  ),
  rooms: 342,
  pmsName: "Opera PMS",
  pmsSync: "09:30",
  shift: ls("1. Vardiya · 07:00–15:00", "Shift 1 · 07:00–15:00"),
};

export const AREAS: { id: AreaId; name: LS; path: string }[] = [
  { id: "reception", name: ls("Resepsiyon", "Reception"), path: "/reception" },
  { id: "lobby", name: ls("Lobi", "Lobby"), path: "/lobby" },
  { id: "fnb", name: ls("F&B", "F&B"), path: "/fnb" },
  { id: "wellness", name: ls("Havuz / Spa / Gym", "Pool / Spa / Gym"), path: "/wellness" },
  { id: "security", name: ls("Güvenlik", "Security"), path: "/security" },
  { id: "parking", name: ls("Otopark", "Parking"), path: "/parking" },
  { id: "housekeeping", name: ls("Housekeeping", "Housekeeping"), path: "/housekeeping" },
  { id: "boh", name: ls("Back-of-House", "Back-of-House"), path: "/boh" },
  { id: "banquet", name: ls("Etkinlik / Balo", "Events / Ballroom"), path: "/banquet" },
];

export const areaName = (id: AreaId) => AREAS.find((a) => a.id === id)!.name;

const L0 = ls("Zemin kat", "Ground floor");
const LB = ls("Bodrum", "Basement");
const L1 = ls("1. Kat", "1st floor");
const LOUT = ls("Dış alan", "Outdoor");

export const CAMERAS: Camera[] = [
  {
    id: "CAM-01",
    name: ls("Resepsiyon — Check-in bankosu", "Reception — Check-in desk"),
    area: "reception",
    kind: "reception",
    floor: L0,
    status: "online",
    fps: 25,
    count: 7,
    models: [ls("Kuyruk analizi", "Queue analytics"), ls("Bekleme süresi", "Wait time")],
  },
  {
    id: "CAM-02",
    name: ls("Resepsiyon — Bekleme alanı", "Reception — Waiting area"),
    area: "reception",
    kind: "reception",
    floor: L0,
    status: "online",
    fps: 25,
    count: 11,
    capacity: 24,
    models: [ls("İnsan sayımı", "People counting"), ls("Dwell time", "Dwell time")],
  },
  {
    id: "CAM-03",
    name: ls("Concierge & bagaj", "Concierge & luggage"),
    area: "reception",
    kind: "reception",
    floor: L0,
    status: "online",
    fps: 20,
    count: 4,
    models: [ls("Terk edilmiş nesne", "Abandoned object")],
  },
  {
    id: "CAM-10",
    name: ls("Ana giriş — Döner kapı", "Main entrance — Revolving door"),
    area: "lobby",
    kind: "entrance",
    floor: L0,
    status: "online",
    fps: 30,
    count: 9,
    models: [ls("İnsan akışı", "People flow"), ls("Giriş/çıkış sayımı", "In/out counting")],
  },
  {
    id: "CAM-11",
    name: ls("Lobi — Oturma alanı", "Lobby — Seating area"),
    area: "lobby",
    kind: "lobby",
    floor: L0,
    status: "online",
    fps: 25,
    count: 34,
    capacity: 60,
    models: [ls("İnsan sayımı", "People counting"), ls("Dwell time", "Dwell time")],
  },
  {
    id: "CAM-12",
    name: ls("Lobi — Asansör holü", "Lobby — Elevator hall"),
    area: "lobby",
    kind: "elevator",
    floor: L0,
    status: "online",
    fps: 25,
    count: 6,
    models: [ls("İnsan akışı", "People flow"), ls("Kuyruk analizi", "Queue analytics")],
  },
  {
    id: "CAM-13",
    name: ls("Lobi bar", "Lobby bar"),
    area: "lobby",
    kind: "lobby",
    floor: L0,
    status: "degraded",
    fps: 12,
    count: 18,
    capacity: 40,
    models: [ls("Doluluk", "Occupancy")],
  },
  {
    id: "CAM-20",
    name: ls("Ana restoran — Salon", "Main restaurant — Hall"),
    area: "fnb",
    kind: "restaurant",
    floor: L0,
    status: "online",
    fps: 25,
    count: 96,
    capacity: 140,
    models: [ls("Masa doluluğu", "Table occupancy"), ls("Masa kullanım süresi", "Table turnover")],
  },
  {
    id: "CAM-21",
    name: ls("Kahvaltı buffet — Sıcak hat", "Breakfast buffet — Hot line"),
    area: "fnb",
    kind: "buffet",
    floor: L0,
    status: "online",
    fps: 25,
    count: 14,
    models: [ls("Kuyruk analizi", "Queue analytics")],
  },
  {
    id: "CAM-22",
    name: ls("Restoran girişi — Host", "Restaurant entry — Host"),
    area: "fnb",
    kind: "buffet",
    floor: L0,
    status: "online",
    fps: 20,
    count: 8,
    models: [ls("Giriş kuyruğu", "Entry queue")],
  },
  {
    id: "CAM-23",
    name: ls("Teras restoran", "Terrace restaurant"),
    area: "fnb",
    kind: "restaurant",
    floor: L0,
    status: "online",
    fps: 20,
    count: 41,
    capacity: 80,
    models: [ls("Doluluk", "Occupancy")],
  },
  {
    id: "CAM-30",
    name: ls("Açık havuz — Şezlong alanı", "Outdoor pool — Sunbed area"),
    area: "wellness",
    kind: "pool",
    floor: LOUT,
    status: "online",
    fps: 25,
    count: 94,
    capacity: 120,
    models: [ls("Doluluk", "Occupancy"), ls("Kapasite aşımı", "Capacity breach")],
  },
  {
    id: "CAM-31",
    name: ls("Kapalı havuz", "Indoor pool"),
    area: "wellness",
    kind: "pool",
    floor: LB,
    status: "online",
    fps: 25,
    count: 21,
    capacity: 45,
    models: [ls("Doluluk", "Occupancy"), ls("Düşme algılama", "Fall detection")],
  },
  {
    id: "CAM-32",
    name: ls("Spa resepsiyon & ıslak alan", "Spa reception & wet area"),
    area: "wellness",
    kind: "spa",
    floor: LB,
    status: "online",
    fps: 20,
    count: 9,
    capacity: 30,
    models: [ls("Doluluk", "Occupancy"), ls("Yetkisiz giriş", "Unauthorized access")],
  },
  {
    id: "CAM-33",
    name: ls("Fitness salonu", "Fitness centre"),
    area: "wellness",
    kind: "gym",
    floor: LB,
    status: "online",
    fps: 25,
    count: 17,
    capacity: 25,
    models: [ls("Doluluk", "Occupancy"), ls("Man-down", "Man-down")],
  },
  {
    id: "CAM-40",
    name: ls("Otopark P1 — Giriş bariyeri", "Car park P1 — Entry barrier"),
    area: "parking",
    kind: "gate",
    floor: LB,
    status: "online",
    fps: 30,
    count: 2,
    models: [ls("Plaka tanıma", "LPR"), ls("Araç sayımı", "Vehicle counting")],
  },
  {
    id: "CAM-41",
    name: ls("Otopark P1 — A bloğu", "Car park P1 — Block A"),
    area: "parking",
    kind: "parking",
    floor: LB,
    status: "online",
    fps: 20,
    count: 148,
    capacity: 180,
    models: [ls("Araç sayımı", "Vehicle counting"), ls("Yanlış park", "Illegal parking")],
  },
  {
    id: "CAM-42",
    name: ls("Vale & ön yol", "Valet & driveway"),
    area: "parking",
    kind: "gate",
    floor: LOUT,
    status: "online",
    fps: 25,
    count: 5,
    models: [ls("Plaka tanıma", "LPR"), ls("Yanlış park", "Illegal parking")],
  },
  {
    id: "CAM-50",
    name: ls("4. kat koridor — Batı", "Floor 4 corridor — West"),
    area: "housekeeping",
    kind: "corridor",
    floor: ls("4. Kat", "4th floor"),
    status: "online",
    fps: 15,
    count: 2,
    models: [ls("Servis arabası", "Service trolley"), ls("SOP kontrolü", "SOP check")],
  },
  {
    id: "CAM-51",
    name: ls("2. kat koridor — Doğu", "Floor 2 corridor — East"),
    area: "housekeeping",
    kind: "corridor",
    floor: ls("2. Kat", "2nd floor"),
    status: "online",
    fps: 15,
    count: 1,
    models: [ls("Servis arabası", "Service trolley"), ls("Loitering", "Loitering")],
  },
  {
    id: "CAM-52",
    name: ls("Çamaşırhane", "Laundry"),
    area: "housekeeping",
    kind: "warehouse",
    floor: LB,
    status: "online",
    fps: 15,
    count: 4,
    models: [ls("SOP kontrolü", "SOP check")],
  },
  {
    id: "CAM-60",
    name: ls("Personel girişi — Turnike", "Staff entrance — Turnstile"),
    area: "boh",
    kind: "staff",
    floor: LB,
    status: "online",
    fps: 25,
    count: 3,
    models: [ls("Yetkisiz giriş", "Unauthorized access"), ls("Tailgating", "Tailgating")],
  },
  {
    id: "CAM-61",
    name: ls("Ana depo", "Main storage"),
    area: "boh",
    kind: "warehouse",
    floor: LB,
    status: "online",
    fps: 15,
    count: 0,
    models: [ls("Mesai dışı hareket", "After-hours motion")],
  },
  {
    id: "CAM-62",
    name: ls("Yükleme rampası", "Loading dock"),
    area: "boh",
    kind: "dock",
    floor: LB,
    status: "online",
    fps: 20,
    count: 6,
    models: [ls("Araç/personel hareketi", "Vehicle & staff motion"), ls("Plaka tanıma", "LPR")],
  },
  {
    id: "CAM-63",
    name: ls("Mutfak servis koridoru", "Kitchen service corridor"),
    area: "boh",
    kind: "corridor",
    floor: L0,
    status: "offline",
    fps: 0,
    count: 0,
    models: [ls("Yetkisiz giriş", "Unauthorized access")],
  },
  {
    id: "CAM-70",
    name: ls("Balo salonu — Ana salon", "Ballroom — Main hall"),
    area: "banquet",
    kind: "ballroom",
    floor: L1,
    status: "online",
    fps: 25,
    count: 386,
    capacity: 450,
    models: [ls("Doluluk", "Occupancy"), ls("Kapasite aşımı", "Capacity breach")],
  },
  {
    id: "CAM-71",
    name: ls("Balo foyer — Registration", "Ballroom foyer — Registration"),
    area: "banquet",
    kind: "ballroom",
    floor: L1,
    status: "online",
    fps: 25,
    count: 23,
    models: [ls("Kuyruk analizi", "Queue analytics"), ls("İnsan akışı", "People flow")],
  },
  {
    id: "CAM-72",
    name: ls("Toplantı odaları koridoru", "Meeting rooms corridor"),
    area: "banquet",
    kind: "corridor",
    floor: L1,
    status: "online",
    fps: 20,
    count: 7,
    models: [ls("İnsan akışı", "People flow")],
  },
];

export const camerasOf = (area: AreaId) => CAMERAS.filter((c) => c.area === area);
export const cameraById = (id: string) => CAMERAS.find((c) => c.id === id);

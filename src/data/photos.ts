import type { SceneKind } from "./hotel";

export const KIND_PHOTO: Record<SceneKind, string> = {
  reception: "/cams/reception.png",
  lobby: "/cams/lobby.png",
  entrance: "/cams/entrance.png",
  elevator: "/cams/elevator.png",
  restaurant: "/cams/restaurant.png",
  buffet: "/cams/buffet.png",
  pool: "/cams/pool.png",
  spa: "/cams/spa.png",
  gym: "/cams/gym.png",
  corridor: "/cams/corridor.png",
  parking: "/cams/parking.png",
  gate: "/cams/gate.png",
  warehouse: "/cams/warehouse.png",
  dock: "/cams/dock.png",
  ballroom: "/cams/ballroom.png",
  staff: "/cams/staff.png",
};

/** Cameras that share a kind but have a dedicated still. */
export const CAMERA_PHOTO: Partial<Record<string, string>> = {
  "CAM-31": "/cams/indoor-pool.png",
  "CAM-71": "/cams/foyer.png",
};

export function photoFor(kind: SceneKind, cameraId?: string) {
  if (cameraId && CAMERA_PHOTO[cameraId]) return CAMERA_PHOTO[cameraId]!;
  return KIND_PHOTO[kind];
}

export const LOGIN_STILLS = [
  "/cams/reception.png",
  "/cams/lobby.png",
  "/cams/pool.png",
  "/cams/corridor.png",
] as const;

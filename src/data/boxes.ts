import { ls, type LS } from "../i18n";
import type { Box } from "./events";

const p = (
  x: number,
  y: number,
  w: number,
  h: number,
  label: LS | string,
  tone: Box["tone"],
  conf = 0.93
): Box => ({ x, y, w, h, label, tone, conf, shape: "person" });

/** Boxes aligned to the real CCTV stills in /public/cams — not generic placeholders. */
export const LIVE_BOXES: Record<string, Box[]> = {
  "CAM-12": [
    p(0.155, 0.20, 0.045, 0.16, ls("Misafir", "Guest"), "accent", 0.9),
    p(0.255, 0.26, 0.07, 0.30, ls("Misafir", "Guest"), "accent", 0.94),
    p(0.415, 0.28, 0.06, 0.30, ls("Misafir", "Guest"), "accent", 0.93),
    p(0.615, 0.30, 0.085, 0.34, ls("Misafir", "Guest"), "accent", 0.95),
  ],
  "CAM-33": [
    p(0.12, 0.40, 0.10, 0.22, ls("Misafir", "Guest"), "accent", 0.92),
    p(0.495, 0.18, 0.05, 0.18, ls("Misafir", "Guest"), "accent", 0.9),
    p(0.595, 0.22, 0.05, 0.18, ls("Misafir", "Guest"), "accent", 0.91),
    p(0.715, 0.26, 0.085, 0.26, ls("Misafir", "Guest"), "accent", 0.94),
  ],
  "CAM-41": [
    { x: 0.07, y: 0.30, w: 0.24, h: 0.26, label: "34 HZ 9010", tone: "ok", conf: 0.95, shape: "vehicle" },
    { x: 0.22, y: 0.24, w: 0.16, h: 0.16, label: "06 BLK 117", tone: "ok", conf: 0.93, shape: "vehicle" },
    { x: 0.82, y: 0.30, w: 0.18, h: 0.24, label: "34 ZR 7742", tone: "accent", conf: 0.91, shape: "vehicle" },
  ],
};

export const GATE_CAR: Box = {
  x: 0.30,
  y: 0.26,
  w: 0.28,
  h: 0.70,
  label: "34 VIP 007",
  tone: "ok",
  conf: 0.98,
  shape: "vehicle",
};

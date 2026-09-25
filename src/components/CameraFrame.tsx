import { useId } from "react";
import { Maximize2, VideoOff } from "lucide-react";
import type { Box, BoxShape } from "../data/events";
import type { SceneKind } from "../data/hotel";
import { photoFor } from "../data/photos";
import { cx, hashString, seeded } from "../lib/util";
import { useLang, type LS } from "../i18n";

const W = 400;
const H = 225;

const TONE_HEX: Record<NonNullable<Box["tone"]>, string> = {
  accent: "#18d5e8",
  warn: "#f6ae2d",
  danger: "#fb5d5d",
  ok: "#16c79a",
  violet: "#8b7cf6",
};

const range = (n: number) => Array.from({ length: n }, (_, i) => i);

/* ------------------------------------------------------------------ */
/*  Detected object silhouettes                                        */
/* ------------------------------------------------------------------ */

function Silhouette({ x, y, w, h, shape }: { x: number; y: number; w: number; h: number; shape: BoxShape }) {
  const body = "#111a24";
  const rim = "#2d3b4a";

  if (shape === "vehicle") {
    return (
      <g opacity={0.95}>
        <rect x={x} y={y + h * 0.42} width={w} height={h * 0.44} rx={h * 0.13} fill={body} />
        <path
          d={`M ${x + w * 0.2} ${y + h * 0.45} L ${x + w * 0.3} ${y + h * 0.12} L ${x + w * 0.72} ${y + h * 0.12} L ${x + w * 0.82} ${y + h * 0.45} Z`}
          fill={body}
        />
        <path
          d={`M ${x + w * 0.26} ${y + h * 0.42} L ${x + w * 0.34} ${y + h * 0.18} L ${x + w * 0.68} ${y + h * 0.18} L ${x + w * 0.76} ${y + h * 0.42} Z`}
          fill="#26333f"
        />
        <circle cx={x + w * 0.24} cy={y + h * 0.87} r={h * 0.11} fill="#05090d" />
        <circle cx={x + w * 0.78} cy={y + h * 0.87} r={h * 0.11} fill="#05090d" />
        <rect x={x + w * 0.02} y={y + h * 0.55} width={w * 0.1} height={h * 0.1} rx={2} fill="#f3e4a8" opacity={0.7} />
        <rect x={x + w * 0.88} y={y + h * 0.55} width={w * 0.1} height={h * 0.1} rx={2} fill="#f3e4a8" opacity={0.7} />
      </g>
    );
  }

  if (shape === "object") {
    return (
      <g opacity={0.95}>
        <rect x={x + w * 0.12} y={y + h * 0.22} width={w * 0.76} height={h * 0.74} rx={w * 0.1} fill={body} />
        <rect x={x + w * 0.12} y={y + h * 0.22} width={w * 0.76} height={h * 0.12} rx={w * 0.06} fill={rim} opacity={0.6} />
        <path
          d={`M ${x + w * 0.36} ${y + h * 0.22} L ${x + w * 0.36} ${y + h * 0.06} L ${x + w * 0.64} ${y + h * 0.06} L ${x + w * 0.64} ${y + h * 0.22}`}
          fill="none"
          stroke={rim}
          strokeWidth={1.4}
        />
      </g>
    );
  }

  if (shape === "smoke") {
    return (
      <g opacity={0.8}>
        {range(5).map((i) => (
          <ellipse
            key={i}
            cx={x + w * (0.3 + i * 0.1)}
            cy={y + h * (0.78 - i * 0.16)}
            rx={w * (0.2 + i * 0.05)}
            ry={h * (0.14 + i * 0.03)}
            fill="#9fb0c0"
            opacity={0.26 - i * 0.03}
          />
        ))}
      </g>
    );
  }

  if (shape === "person-down") {
    return (
      <g opacity={0.95}>
        <rect x={x + w * 0.16} y={y + h * 0.42} width={w * 0.74} height={h * 0.42} rx={h * 0.2} fill={body} />
        <circle cx={x + w * 0.11} cy={y + h * 0.6} r={h * 0.22} fill={body} />
        <rect x={x + w * 0.5} y={y + h * 0.78} width={w * 0.34} height={h * 0.16} rx={h * 0.08} fill={body} />
      </g>
    );
  }

  // standing person
  const cx0 = x + w / 2;
  return (
    <g opacity={0.96}>
      <ellipse cx={cx0} cy={y + h * 0.985} rx={w * 0.42} ry={h * 0.035} fill="#04080c" opacity={0.5} />
      <path
        d={`M ${x + w * 0.22} ${y + h} L ${x + w * 0.24} ${y + h * 0.46}
            Q ${cx0} ${y + h * 0.28} ${x + w * 0.76} ${y + h * 0.46}
            L ${x + w * 0.78} ${y + h} Z`}
        fill={body}
      />
      <circle cx={cx0} cy={y + h * 0.14} r={Math.min(w * 0.3, h * 0.13)} fill={body} />
      <path
        d={`M ${x + w * 0.3} ${y + h * 0.44} Q ${cx0} ${y + h * 0.32} ${x + w * 0.7} ${y + h * 0.44}`}
        fill="none"
        stroke={rim}
        strokeWidth={0.9}
        opacity={0.55}
      />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/*  Scenes                                                             */
/* ------------------------------------------------------------------ */

function FloorGrid({ y0, rows = 6, color = "#ffffff", opacity = 0.05 }: { y0: number; rows?: number; color?: string; opacity?: number }) {
  return (
    <g stroke={color} strokeWidth={0.6} opacity={opacity}>
      {range(9).map((i) => (
        <line key={`v${i}`} x1={W / 2 + (i - 4) * 22} y1={y0} x2={W / 2 + (i - 4) * 120} y2={H} />
      ))}
      {range(rows).map((i) => {
        const t = (i + 1) / (rows + 1);
        const y = y0 + (H - y0) * (t * t);
        return <line key={`h${i}`} x1={0} y1={y} x2={W} y2={y} />;
      })}
    </g>
  );
}

function Lamp({ cx, cy, r = 26, color = "#ffe6b0", opacity = 0.3 }: { cx: number; cy: number; r?: number; color?: string; opacity?: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={color} opacity={opacity * 0.4} />
      <circle cx={cx} cy={cy} r={r * 0.38} fill={color} opacity={opacity} />
      <circle cx={cx} cy={cy} r={r * 0.14} fill="#fff8e8" opacity={0.9} />
    </g>
  );
}

function Scene({ kind, rnd }: { kind: SceneKind; rnd: () => number }) {
  switch (kind) {
    case "reception":
      return (
        <g>
          <rect width={W} height={116} fill="#141d27" />
          <rect x={28} y={16} width={230} height={78} fill="#1b2732" />
          <rect x={28} y={16} width={230} height={78} fill="none" stroke="#24333f" />
          <rect x={52} y={38} width={112} height={12} rx={3} fill="#18d5e8" opacity={0.28} />
          <rect x={52} y={58} width={64} height={7} rx={3} fill="#2f4150" />
          <rect x={286} y={8} width={96} height={104} fill="#0e161e" />
          <rect x={292} y={16} width={84} height={40} rx={3} fill="#1d2b36" />
          <rect x={292} y={62} width={84} height={42} rx={3} fill="#1d2b36" />
          <rect y={116} width={W} height={H - 116} fill="#0d141c" />
          <FloorGrid y0={116} rows={5} />
          <path d="M 18 178 L 40 138 L 258 128 L 276 166 Z" fill="#1f2c38" />
          <path d="M 18 178 L 276 166 L 276 182 L 18 196 Z" fill="#16202a" />
          <rect x={64} y={128} width={20} height={9} rx={2} fill="#0a1017" />
          <rect x={150} y={124} width={20} height={9} rx={2} fill="#0a1017" />
          <Lamp cx={92} cy={22} r={30} />
          <Lamp cx={196} cy={18} r={26} />
          <g stroke="#18d5e8" strokeWidth={1} strokeDasharray="6 7" opacity={0.2}>
            <line x1={40} y1={210} x2={330} y2={182} />
          </g>
        </g>
      );

    case "lobby":
      return (
        <g>
          <rect width={W} height={H} fill="#0b121a" />
          <rect x={0} y={0} width={W} height={104} fill="#101a24" />
          {range(26).map((i) => (
            <rect
              key={i}
              x={8 + i * 15}
              y={20 + rnd() * 50}
              width={3 + rnd() * 5}
              height={2 + rnd() * 4}
              fill="#f0d9a8"
              opacity={0.16 + rnd() * 0.3}
            />
          ))}
          <rect x={0} y={96} width={W} height={10} fill="#0a1118" />
          <rect y={106} width={W} height={H - 106} fill="#0e161e" />
          <FloorGrid y0={106} rows={6} opacity={0.045} />
          <rect x={58} y={40} width={16} height={112} fill="#151f29" />
          <rect x={312} y={40} width={16} height={112} fill="#151f29" />
          <g fill="#18222c">
            <rect x={36} y={158} width={92} height={26} rx={7} />
            <rect x={36} y={148} width={92} height={14} rx={6} fill="#1e2a35" />
            <rect x={186} y={168} width={104} height={28} rx={7} />
            <rect x={186} y={157} width={104} height={15} rx={6} fill="#1e2a35" />
            <rect x={300} y={150} width={70} height={22} rx={6} />
          </g>
          <g>
            <ellipse cx={162} cy={140} rx={13} ry={10} fill="#16302b" />
            <rect x={158} y={140} width={8} height={14} fill="#1a2430" />
            <ellipse cx={352} cy={132} rx={11} ry={9} fill="#16302b" />
          </g>
          <Lamp cx={130} cy={14} r={34} opacity={0.22} />
          <Lamp cx={268} cy={10} r={30} opacity={0.2} />
        </g>
      );

    case "entrance":
      return (
        <g>
          <rect width={W} height={H} fill="#0c131b" />
          <rect x={0} y={0} width={W} height={120} fill="#16222e" />
          <rect x={112} y={10} width={176} height={110} rx={4} fill="#22333f" opacity={0.9} />
          <circle cx={200} cy={78} r={54} fill="#2b3f4d" opacity={0.75} />
          <circle cx={200} cy={78} r={54} fill="none" stroke="#3c5364" strokeWidth={1.4} />
          <g stroke="#4a6274" strokeWidth={2} opacity={0.85}>
            <line x1={200} y1={24} x2={200} y2={132} />
            <line x1={146} y1={78} x2={254} y2={78} />
          </g>
          <rect x={22} y={16} width={74} height={104} rx={3} fill="#1d2d3a" opacity={0.8} />
          <rect x={304} y={16} width={74} height={104} rx={3} fill="#1d2d3a" opacity={0.8} />
          <rect y={120} width={W} height={H - 120} fill="#0e161e" />
          <FloorGrid y0={120} rows={4} />
          <path d="M 96 214 L 132 150 L 268 150 L 304 214 Z" fill="#131d26" />
          <Lamp cx={200} cy={132} r={44} color="#cfe8f5" opacity={0.16} />
        </g>
      );

    case "elevator":
      return (
        <g>
          <rect width={W} height={H} fill="#0c131a" />
          <rect width={W} height={128} fill="#161f29" />
          {range(3).map((i) => {
            const x = 44 + i * 108;
            return (
              <g key={i}>
                <rect x={x} y={24} width={72} height={104} fill="#212e3a" />
                <rect x={x} y={24} width={72} height={104} fill="none" stroke="#2d3d4a" />
                <line x1={x + 36} y1={24} x2={x + 36} y2={128} stroke="#0f171f" strokeWidth={1.6} />
                <rect x={x + 22} y={12} width={28} height={8} rx={2} fill="#18d5e8" opacity={i === 1 ? 0.75 : 0.22} />
                <circle cx={x + 82} cy={76} r={3} fill="#18d5e8" opacity={0.5} />
              </g>
            );
          })}
          <rect y={128} width={W} height={H - 128} fill="#101820" />
          <FloorGrid y0={128} rows={4} />
          <Lamp cx={200} cy={8} r={40} color="#d8ecf7" opacity={0.14} />
        </g>
      );

    case "restaurant":
      return (
        <g>
          <rect width={W} height={H} fill="#100e0c" />
          <rect width={W} height={96} fill="#1a1512" />
          {range(4).map((i) => (
            <rect key={i} x={20 + i * 98} y={16} width={64} height={62} rx={3} fill="#241d18" stroke="#33281f" />
          ))}
          <rect y={92} width={W} height={H - 92} fill="#14100d" />
          <FloorGrid y0={92} rows={5} color="#e8c88a" opacity={0.05} />
          {range(3).map((row) => {
            const scale = 0.55 + row * 0.28;
            const y = 104 + row * 38 + row * row * 6;
            return range(4).map((c) => {
              const x = 56 + c * (86 + row * 14) - row * 18;
              if (x > W - 20) return null;
              return (
                <g key={`${row}-${c}`}>
                  <ellipse cx={x} cy={y} rx={24 * scale} ry={9 * scale} fill="#1f1913" />
                  <ellipse cx={x} cy={y - 2.5 * scale} rx={24 * scale} ry={9 * scale} fill="#2c231a" />
                  <ellipse cx={x - 30 * scale} cy={y + 3} rx={7 * scale} ry={5 * scale} fill="#191410" />
                  <ellipse cx={x + 30 * scale} cy={y + 3} rx={7 * scale} ry={5 * scale} fill="#191410" />
                  <circle cx={x} cy={y - 5 * scale} r={2.2 * scale} fill="#ffcf7a" opacity={0.85} />
                </g>
              );
            });
          })}
          <Lamp cx={90} cy={12} r={26} color="#ffc978" opacity={0.26} />
          <Lamp cx={300} cy={8} r={24} color="#ffc978" opacity={0.24} />
        </g>
      );

    case "buffet":
      return (
        <g>
          <rect width={W} height={H} fill="#100f0d" />
          <rect width={W} height={104} fill="#1b1613" />
          <rect x={16} y={18} width={368} height={54} rx={4} fill="#241c16" stroke="#342820" />
          {range(6).map((i) => (
            <rect key={i} x={30 + i * 60} y={28} width={40} height={34} rx={3} fill="#2f241b" />
          ))}
          <rect y={100} width={W} height={H - 100} fill="#15110e" />
          <path d="M 10 176 L 30 118 L 372 112 L 392 172 Z" fill="#2a2119" />
          <path d="M 10 176 L 392 172 L 392 190 L 10 196 Z" fill="#1d1712" />
          <rect x={30} y={96} width={342} height={22} rx={2} fill="#9fd8e4" opacity={0.12} />
          <rect x={30} y={96} width={342} height={22} rx={2} fill="none" stroke="#9fd8e4" strokeWidth={0.6} opacity={0.3} />
          {range(5).map((i) => (
            <g key={i}>
              <rect x={56 + i * 66} y={90} width={44} height={5} rx={2} fill="#ff9a3c" opacity={0.5} />
              <ellipse cx={78 + i * 66} cy={124} rx={18} ry={6} fill="#3a2d21" />
            </g>
          ))}
          <FloorGrid y0={180} rows={2} color="#e8c88a" opacity={0.05} />
        </g>
      );

    case "pool":
      return (
        <g>
          <rect width={W} height={H} fill="#0e1a22" />
          <rect width={W} height={72} fill="#1d3a4c" />
          <rect width={W} height={72} fill="url(#skyGrad)" />
          <rect y={62} width={W} height={16} fill="#20404f" />
          {range(7).map((i) => (
            <g key={i}>
              <rect x={12 + i * 58} y={40} width={5} height={30} fill="#16242c" />
              <ellipse cx={14.5 + i * 58} cy={38} rx={13} ry={5} fill="#1d3a33" />
            </g>
          ))}
          <rect y={76} width={W} height={26} fill="#1a2a33" />
          <path d="M 0 102 L 400 96 L 400 190 L 0 200 Z" fill="#0f6f86" />
          <path d="M 0 102 L 400 96 L 400 190 L 0 200 Z" fill="url(#waterGrad)" />
          <g stroke="#7fe6f6" strokeWidth={1} opacity={0.3}>
            {range(6).map((i) => (
              <path
                key={i}
                d={`M 0 ${116 + i * 13} Q 100 ${110 + i * 13} 200 ${116 + i * 13} T 400 ${112 + i * 13}`}
                fill="none"
              />
            ))}
          </g>
          <path d="M 0 200 L 400 190 L 400 225 L 0 225 Z" fill="#17232b" />
          {range(5).map((i) => (
            <g key={`sb${i}`}>
              <rect x={10 + i * 80} y={204} width={54} height={9} rx={4} fill="#22323c" />
              <rect x={10 + i * 80} y={198} width={18} height={8} rx={3} fill="#2b3d48" />
            </g>
          ))}
          {range(4).map((i) => (
            <g key={`um${i}`} opacity={0.9}>
              <path d={`M ${46 + i * 96} 86 L ${72 + i * 96} 74 L ${98 + i * 96} 86 Z`} fill="#24424f" />
              <rect x={71 + i * 96} y={86} width={2.5} height={14} fill="#1b2a33" />
            </g>
          ))}
        </g>
      );

    case "spa":
      return (
        <g>
          <rect width={W} height={H} fill="#120f14" />
          <rect width={W} height={110} fill="#1a1520" />
          {range(3).map((i) => (
            <path
              key={i}
              d={`M ${50 + i * 110} 108 L ${50 + i * 110} 46 Q ${80 + i * 110} 18 ${110 + i * 110} 46 L ${110 + i * 110} 108 Z`}
              fill="#241b2c"
              stroke="#33263c"
            />
          ))}
          <rect y={106} width={W} height={H - 106} fill="#161119" />
          <path d="M 40 200 L 70 130 L 330 126 L 362 196 Z" fill="#1d1622" opacity={0.9} />
          <g>
            {range(6).map((i) => (
              <g key={i}>
                <circle cx={70 + i * 52} cy={124} r={9} fill="#ffb867" opacity={0.18} />
                <circle cx={70 + i * 52} cy={124} r={2.6} fill="#ffd9a0" opacity={0.85} />
              </g>
            ))}
          </g>
          <rect x={96} y={168} width={78} height={12} rx={6} fill="#251d2c" />
          <rect x={222} y={166} width={78} height={12} rx={6} fill="#251d2c" />
          <Lamp cx={200} cy={100} r={54} color="#e0b98a" opacity={0.12} />
        </g>
      );

    case "gym":
      return (
        <g>
          <rect width={W} height={H} fill="#0b1016" />
          <rect width={W} height={112} fill="#121a22" />
          <rect x={8} y={14} width={188} height={92} fill="#18242e" opacity={0.85} />
          <rect x={8} y={14} width={188} height={92} fill="none" stroke="#24333f" />
          <rect x={212} y={18} width={80} height={88} fill="#151f28" />
          {range(4).map((i) => (
            <rect key={i} x={218} y={26 + i * 20} width={68} height={7} rx={3} fill="#22303c" />
          ))}
          <rect y={110} width={W} height={H - 110} fill="#0f161d" />
          <FloorGrid y0={110} rows={4} />
          {range(3).map((i) => {
            const x = 40 + i * 112;
            return (
              <g key={i}>
                <path d={`M ${x} 176 L ${x + 12} 138 L ${x + 62} 136 L ${x + 72} 174 Z`} fill="#1a2632" />
                <rect x={x + 14} y={124} width={44} height={16} rx={3} fill="#22303c" />
                <rect x={x + 30} y={106} width={5} height={20} fill="#1c2833" />
              </g>
            );
          })}
          <Lamp cx={200} cy={6} r={44} color="#cfe8f5" opacity={0.12} />
        </g>
      );

    case "corridor":
      return (
        <g>
          <rect width={W} height={H} fill="#0d1319" />
          <rect x={150} y={70} width={100} height={92} fill="#18222c" />
          <path d="M 0 0 L 150 70 L 150 162 L 0 225 Z" fill="#131c24" />
          <path d="M 400 0 L 250 70 L 250 162 L 400 225 Z" fill="#111a22" />
          <path d="M 0 0 L 150 70 L 250 70 L 400 0 Z" fill="#161f28" />
          <path d="M 0 225 L 150 162 L 250 162 L 400 225 Z" fill="#1a1512" />
          <g fill="#20303d">
            <path d="M 18 24 L 72 49 L 72 140 L 18 196 Z" />
            <path d="M 86 56 L 124 73 L 124 152 L 86 176 Z" />
            <path d="M 382 24 L 328 49 L 328 140 L 382 196 Z" />
            <path d="M 314 56 L 276 73 L 276 152 L 276 152 L 276 152 L 314 176 Z" />
          </g>
          <g fill="#18d5e8" opacity={0.35}>
            <rect x={66} y={92} width={4} height={7} />
            <rect x={120} y={100} width={3} height={6} />
            <rect x={330} y={92} width={4} height={7} />
          </g>
          {range(4).map((i) => {
            const t = i / 4;
            const w = 44 - t * 30;
            return (
              <rect key={i} x={200 - w / 2} y={12 + i * 16} width={w} height={4} rx={2} fill="#fff3d6" opacity={0.5 - t * 0.2} />
            );
          })}
          <g stroke="#2a211a" strokeWidth={1} opacity={0.6}>
            <line x1={0} y1={225} x2={150} y2={162} />
            <line x1={400} y1={225} x2={250} y2={162} />
          </g>
          <rect x={150} y={70} width={100} height={92} fill="none" stroke="#223040" />
          <rect x={178} y={92} width={44} height={70} fill="#1d2a36" />
        </g>
      );

    case "parking":
      return (
        <g>
          <rect width={W} height={H} fill="#0a0f14" />
          <rect width={W} height={60} fill="#101720" />
          {range(3).map((i) => (
            <rect key={i} x={40 + i * 130} y={10} width={86} height={5} rx={2} fill="#dbe9f2" opacity={0.42} />
          ))}
          <rect y={58} width={W} height={H - 58} fill="#0d141b" />
          <rect x={58} y={58} width={14} height={72} fill="#141e27" />
          <rect x={318} y={58} width={14} height={80} fill="#141e27" />
          <g stroke="#e8edf2" strokeWidth={1.2} opacity={0.22}>
            {range(7).map((i) => (
              <line key={i} x1={-40 + i * 78} y1={225} x2={70 + i * 42} y2={112} />
            ))}
            <line x1={0} y1={112} x2={400} y2={112} />
          </g>
          <g stroke="#f6ae2d" strokeWidth={1.4} opacity={0.35} strokeDasharray="10 8">
            <line x1={0} y1={160} x2={400} y2={160} />
          </g>
          {range(4).map((i) => (
            <g key={i} opacity={0.9}>
              <rect x={20 + i * 96} y={118} width={62} height={20} rx={5} fill="#141d26" />
              <rect x={32 + i * 96} y={108} width={38} height={12} rx={4} fill="#1b2732" />
              <circle cx={34 + i * 96} cy={139} r={4} fill="#06090d" />
              <circle cx={68 + i * 96} cy={139} r={4} fill="#06090d" />
            </g>
          ))}
        </g>
      );

    case "gate":
      return (
        <g>
          <rect width={W} height={H} fill="#0c1218" />
          <rect width={W} height={96} fill="#17232e" />
          <rect width={W} height={52} fill="#20313d" />
          {range(9).map((i) => (
            <rect key={i} x={i * 46} y={18} width={22} height={30} fill="#273a47" opacity={0.6} />
          ))}
          <rect y={94} width={W} height={H - 94} fill="#10171e" />
          <FloorGrid y0={94} rows={3} />
          <rect x={286} y={44} width={78} height={84} rx={4} fill="#1a2733" stroke="#26343f" />
          <rect x={296} y={56} width={58} height={34} rx={3} fill="#2d4250" opacity={0.85} />
          <rect x={30} y={112} width={252} height={6} rx={3} fill="#f6ae2d" opacity={0.85} />
          {range(6).map((i) => (
            <rect key={i} x={44 + i * 42} y={112} width={18} height={6} fill="#1a1207" opacity={0.6} />
          ))}
          <rect x={276} y={100} width={12} height={30} rx={3} fill="#22313d" />
          <g stroke="#ffffff" strokeWidth={2} opacity={0.3} strokeDasharray="14 12">
            <line x1={0} y1={188} x2={400} y2={176} />
          </g>
          <rect x={150} y={150} width={110} height={5} fill="#ffffff" opacity={0.35} />
        </g>
      );

    case "warehouse":
      return (
        <g>
          <rect width={W} height={H} fill="#0a0f14" />
          <rect width={W} height={70} fill="#101821" />
          {range(2).map((i) => (
            <rect key={i} x={70 + i * 170} y={8} width={110} height={5} rx={2} fill="#dbe9f2" opacity={0.34} />
          ))}
          <rect y={68} width={W} height={H - 68} fill="#0e151c" />
          <path d="M 0 40 L 128 84 L 128 178 L 0 225 Z" fill="#141d26" />
          <path d="M 400 40 L 272 84 L 272 178 L 400 225 Z" fill="#121a23" />
          {range(3).map((i) => (
            <g key={i}>
              <line x1={0} y1={70 + i * 36} x2={128} y2={100 + i * 26} stroke="#25333f" strokeWidth={3} />
              <line x1={400} y1={70 + i * 36} x2={272} y2={100 + i * 26} stroke="#25333f" strokeWidth={3} />
            </g>
          ))}
          {range(4).map((i) => (
            <rect key={i} x={14 + i * 26} y={112 + i * 8} width={22} height={16} rx={2} fill="#2b2418" opacity={0.85} />
          ))}
          {range(3).map((i) => (
            <rect key={`r${i}`} x={300 + i * 26} y={120 + i * 8} width={22} height={16} rx={2} fill="#2b2418" opacity={0.85} />
          ))}
          <rect x={128} y={84} width={144} height={94} fill="#161f28" stroke="#212e39" />
          <rect x={172} y={118} width={56} height={60} fill="#1c2833" />
          <FloorGrid y0={178} rows={2} />
        </g>
      );

    case "dock":
      return (
        <g>
          <rect width={W} height={H} fill="#0a1017" />
          <rect width={W} height={112} fill="#121b24" />
          <rect x={22} y={14} width={150} height={98} fill="#1a2631" stroke="#25333f" />
          {range(7).map((i) => (
            <rect key={i} x={26} y={20 + i * 13} width={142} height={9} fill="#1f2d38" />
          ))}
          <rect x={196} y={26} width={182} height={86} rx={4} fill="#1d2a35" />
          <rect x={196} y={26} width={182} height={20} rx={4} fill="#26343f" />
          <rect x={214} y={54} width={146} height={48} rx={3} fill="#131c25" />
          <rect y={110} width={W} height={H - 110} fill="#0e151d" />
          <path d="M 190 112 L 388 112 L 400 152 L 178 152 Z" fill="#172129" />
          <g stroke="#f6ae2d" strokeWidth={2.4} opacity={0.5}>
            <line x1={178} y1={156} x2={400} y2={156} />
          </g>
          {range(4).map((i) => (
            <rect key={i} x={26 + i * 40} y={150} width={7} height={22} rx={3} fill="#f6ae2d" opacity={0.42} />
          ))}
          <FloorGrid y0={160} rows={2} />
        </g>
      );

    case "ballroom":
      return (
        <g>
          <rect width={W} height={H} fill="#0e0c14" />
          <rect width={W} height={100} fill="#161122" />
          <rect x={112} y={16} width={176} height={62} rx={3} fill="#1e2a4a" />
          <rect x={112} y={16} width={176} height={62} rx={3} fill="url(#stageGrad)" />
          <rect x={100} y={78} width={200} height={12} fill="#241c34" />
          <rect y={96} width={W} height={H - 96} fill="#120f1a" />
          <FloorGrid y0={96} rows={5} color="#c8b0ff" opacity={0.05} />
          {range(3).map((row) =>
            range(5).map((c) => {
              const scale = 0.5 + row * 0.24;
              const y = 112 + row * 34 + row * row * 8;
              const x = 44 + c * (78 + row * 10) - row * 14;
              if (x > W - 14) return null;
              return (
                <g key={`${row}-${c}`} opacity={0.95}>
                  <ellipse cx={x} cy={y} rx={22 * scale} ry={8 * scale} fill="#1d1729" />
                  <ellipse cx={x} cy={y - 2 * scale} rx={22 * scale} ry={8 * scale} fill="#2a2038" />
                  {range(6).map((k) => (
                    <ellipse
                      key={k}
                      cx={x + Math.cos((k / 6) * Math.PI * 2) * 28 * scale}
                      cy={y + Math.sin((k / 6) * Math.PI * 2) * 11 * scale}
                      rx={5 * scale}
                      ry={4 * scale}
                      fill="#181322"
                    />
                  ))}
                  <circle cx={x} cy={y - 4 * scale} r={2 * scale} fill="#ffcf7a" opacity={0.8} />
                </g>
              );
            })
          )}
          <Lamp cx={80} cy={6} r={30} color="#e9c9ff" opacity={0.22} />
          <Lamp cx={200} cy={0} r={38} color="#e9c9ff" opacity={0.2} />
          <Lamp cx={322} cy={6} r={30} color="#e9c9ff" opacity={0.22} />
        </g>
      );

    case "staff":
      return (
        <g>
          <rect width={W} height={H} fill="#0b1117" />
          <rect width={W} height={118} fill="#121b23" />
          {range(8).map((i) => (
            <rect key={i} x={10 + i * 48} y={16} width={40} height={98} rx={2} fill="#18232d" stroke="#222f3a" />
          ))}
          <rect y={116} width={W} height={H - 116} fill="#0e161d" />
          <FloorGrid y0={116} rows={4} />
          {range(3).map((i) => {
            const x = 52 + i * 112;
            return (
              <g key={i}>
                <path d={`M ${x} 196 L ${x + 8} 134 L ${x + 30} 132 L ${x + 26} 194 Z`} fill="#1c2833" />
                <path d={`M ${x + 58} 194 L ${x + 54} 132 L ${x + 76} 134 L ${x + 84} 196 Z`} fill="#1c2833" />
                <rect x={x + 26} y={150} width={32} height={4} rx={2} fill="#2b3a47" />
                <circle cx={x + 18} cy={140} r={3.4} fill={i === 0 ? "#16c79a" : "#fb5d5d"} opacity={0.8} />
              </g>
            );
          })}
        </g>
      );
  }
}

/* ------------------------------------------------------------------ */
/*  Frame                                                              */
/* ------------------------------------------------------------------ */

export type CameraFrameProps = {
  kind: SceneKind;
  seed?: string | number;
  boxes?: Box[];
  zone?: { points: [number, number][]; label: LS | string };
  cameraId?: string;
  name?: string;
  time?: string;
  status?: "online" | "offline" | "degraded";
  live?: boolean;
  compact?: boolean;
  showLabels?: boolean;
  className?: string;
  onClick?: () => void;
};

export function CameraFrame({
  kind,
  seed = 1,
  boxes = [],
  zone,
  cameraId,
  name,
  time,
  status = "online",
  live = true,
  compact = false,
  showLabels,
  className,
  onClick,
}: CameraFrameProps) {
  const uid = useId().replace(/[:]/g, "");
  const { l } = useLang();
  const rnd = seeded(typeof seed === "number" ? seed + 7 : hashString(String(seed)));
  const withLabels = showLabels ?? !compact;
  const offline = status === "offline";
  const photo = photoFor(kind, cameraId);

  return (
    <div
      onClick={onClick}
      className={cx(
        "group relative aspect-video w-full overflow-hidden rounded-xl border border-line bg-black",
        onClick && "cursor-pointer transition hover:border-accent/50",
        className
      )}
    >
      {offline ? (
        <div className="absolute inset-0 grid place-items-center bg-[#05080b]">
          <div className="grid-bg absolute inset-0 opacity-50" />
          <div className="relative flex flex-col items-center gap-1.5 text-mute">
            <VideoOff size={22} />
            <span className="text-[11px] font-semibold tracking-wide">NO SIGNAL</span>
          </div>
        </div>
      ) : (
        <>
        {photo && (
          <img src={photo} alt="" className="absolute inset-0 size-full object-cover" draggable={false} />
        )}
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
          <defs>
            <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6fc3dd" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#1d3a4c" stopOpacity="0.08" />
            </linearGradient>
            <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#25c8e0" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#05485a" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="stageGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#4f6ff0" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#8b7cf6" stopOpacity="0.28" />
            </linearGradient>
            <radialGradient id={`vig${uid}`} cx="50%" cy="46%" r="72%">
              <stop offset="55%" stopColor="#000" stopOpacity="0" />
              <stop offset="100%" stopColor="#000" stopOpacity={photo ? 0.38 : 0.62} />
            </radialGradient>
            <filter id={`grain${uid}`}>
              <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
          </defs>

          {!photo && <Scene kind={kind} rnd={rnd} />}

          {/* analytics zone */}
          {zone && (
            <g>
              <polygon
                points={zone.points.map(([x, y]) => `${x * W},${y * H}`).join(" ")}
                fill="#18d5e8"
                fillOpacity={0.1}
                stroke="#18d5e8"
                strokeOpacity={0.7}
                strokeWidth={1.3}
                strokeDasharray="7 5"
              />
              {withLabels && (
                <g>
                  <rect
                    x={zone.points[0][0] * W}
                    y={zone.points[0][1] * H - 13}
                    width={l(zone.label).length * 4.4 + 10}
                    height={11}
                    rx={2.5}
                    fill="#18d5e8"
                    fillOpacity={0.85}
                  />
                  <text
                    x={zone.points[0][0] * W + 5}
                    y={zone.points[0][1] * H - 5}
                    fontSize={7.4}
                    fontWeight={700}
                    fill="#04161a"
                  >
                    {l(zone.label)}
                  </text>
                </g>
              )}
            </g>
          )}

          {/* detections */}
          {boxes.map((b, i) => {
            const bx = b.x * W;
            const by = b.y * H;
            const bw = b.w * W;
            const bh = b.h * H;
            const hex = TONE_HEX[b.tone ?? "accent"];
            const label = typeof b.label === "string" ? b.label : l(b.label);
            const text = b.conf ? `${label} ${Math.round(b.conf * 100)}%` : label;
            const tw = text.length * 4.1 + 8;
            return (
              <g key={i}>
                {!photo && <Silhouette x={bx} y={by} w={bw} h={bh} shape={b.shape ?? "person"} />}
                <rect x={bx} y={by} width={bw} height={bh} fill={hex} fillOpacity={photo ? 0.04 : 0.07} />
                <rect x={bx} y={by} width={bw} height={bh} fill="none" stroke={hex} strokeWidth={1.2} />
                <g stroke={hex} strokeWidth={2.2} strokeLinecap="round">
                  <path d={`M ${bx} ${by + 5} L ${bx} ${by} L ${bx + 5} ${by}`} />
                  <path d={`M ${bx + bw - 5} ${by} L ${bx + bw} ${by} L ${bx + bw} ${by + 5}`} />
                  <path d={`M ${bx} ${by + bh - 5} L ${bx} ${by + bh} L ${bx + 5} ${by + bh}`} />
                  <path d={`M ${bx + bw - 5} ${by + bh} L ${bx + bw} ${by + bh} L ${bx + bw} ${by + bh - 5}`} />
                </g>
                {withLabels && (
                  <g>
                    <rect x={bx} y={Math.max(0, by - 11.5)} width={tw} height={10.5} rx={2} fill={hex} />
                    <text x={bx + 4} y={Math.max(0, by - 11.5) + 7.6} fontSize={7} fontWeight={700} fill="#04161a">
                      {text}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          <rect width={W} height={H} fill={`url(#vig${uid})`} />
          <rect width={W} height={H} filter={`url(#grain${uid})`} opacity={0.055} />
        </svg>
        </>
      )}

      {/* scanline sweep */}
      {!offline && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="scanline h-6 w-full bg-gradient-to-b from-transparent via-white/6 to-transparent" />
        </div>
      )}

      {/* OSD overlay */}
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1.5">
            {cameraId && (
              <span className="num rounded bg-black/65 px-1.5 py-0.5 text-[9.5px] font-bold text-white/90 backdrop-blur-sm">
                {cameraId}
              </span>
            )}
            {name && !compact && (
              <span className="truncate rounded bg-black/55 px-1.5 py-0.5 text-[9.5px] font-medium text-white/80 backdrop-blur-sm">
                {name}
              </span>
            )}
          </div>
          {live && !offline && (
            <span className="flex items-center gap-1 rounded bg-black/65 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-white/90 backdrop-blur-sm">
              <span className="rec-dot inline-block size-1.5 rounded-full bg-danger" />
              {status === "degraded" ? "LOW FPS" : "LIVE"}
            </span>
          )}
        </div>
        <div className="flex items-end justify-between gap-2">
          {boxes.length > 0 ? (
            <span className="num rounded bg-black/65 px-1.5 py-0.5 text-[9px] font-bold text-accent backdrop-blur-sm">
              {boxes.length} obj
            </span>
          ) : (
            <span />
          )}
          {time && (
            <span className="num rounded bg-black/65 px-1.5 py-0.5 text-[9.5px] font-medium text-white/85 backdrop-blur-sm">
              {time}
            </span>
          )}
        </div>
      </div>

      {onClick && (
        <span className="pointer-events-none absolute inset-0 grid place-items-center opacity-0 transition group-hover:opacity-100">
          <span className="grid size-9 place-items-center rounded-full bg-black/60 text-white backdrop-blur-sm">
            <Maximize2 size={15} />
          </span>
        </span>
      )}
    </div>
  );
}

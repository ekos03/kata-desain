import React from "react";
import { Pal } from "./base";

// Potongan rumah gaya "neon blueprint" untuk latar gelap. Panggung 1000×1000.
export type HP = {
  pal: Pal;
  ground?: number;
  found?: number;
  cols1?: number;
  walls1?: number;
  ring1?: number;
  roof1?: number; // 0..1 jatuh masuk
  roofOff?: number; // 0..1 diangkat & hilang
  ghost?: number;
  slab?: number;
  props?: number;
  cols2?: number;
  walls2?: number;
  roof2?: number;
  colHi?: string;
  footHi?: string;
  crack?: number;
  settle?: number;
  jacket?: number;
  footNew?: number;
  frame?: number;
};

export const XS = [260, 500, 740];
export const G = 760;

const drop = (p: number, h = 260) => (1 - p) * -h;

export const House: React.FC<HP> = ({
  pal,
  ground = 1,
  found = 1,
  cols1 = 1,
  walls1 = 1,
  ring1 = 1,
  roof1 = 1,
  roofOff = 0,
  ghost = 0,
  slab = 0,
  props = 0,
  cols2 = 0,
  walls2 = 0,
  roof2 = 0,
  colHi,
  footHi,
  crack = 0,
  settle = 0,
  jacket = 0,
  footNew = 0,
  frame = 0,
}) => {
  const L = pal.line;
  const sw = 4;
  return (
    <g>
      {/* tanah */}
      <g opacity={ground}>
        <line
          x1={60}
          y1={G}
          x2={60 + 880 * ground}
          y2={G}
          stroke={L}
          strokeWidth={5}
          strokeLinecap="round"
        />
        {Array.from({ length: 16 }).map((_, i) => (
          <line
            key={i}
            x1={80 + i * 55}
            y1={G + 20}
            x2={60 + i * 55}
            y2={G + 40}
            stroke={L}
            strokeWidth={2}
            opacity={0.25 * ground}
          />
        ))}
      </g>

      {/* fondasi */}
      {XS.map((x, i) => (
        <g
          key={`f${i}`}
          transform={`translate(0 ${drop(found, 120) + (i === 0 ? settle : 0)})`}
          opacity={found}
        >
          <path
            d={`M ${x - 30} ${G + 6} L ${x + 30} ${G + 6} L ${x + 68} ${G + 120} L ${x - 68} ${G + 120} Z`}
            fill={footHi ?? pal.fill}
            stroke={L}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
        </g>
      ))}
      {footNew > 0 &&
        XS.map((x, i) => (
          <rect
            key={`fn${i}`}
            x={x - 100 * footNew}
            y={G + 122}
            width={200 * footNew}
            height={30}
            rx={4}
            fill={pal.accent}
            opacity={0.9}
          />
        ))}

      {/* sloof */}
      <rect
        x={220}
        y={G - 18}
        width={560}
        height={18}
        fill={pal.fill}
        stroke={L}
        strokeWidth={sw}
        opacity={found}
      />

      {/* dinding lt 1 */}
      <g opacity={walls1} transform={`translate(0 ${(1 - walls1) * 40})`}>
        <rect x={272} y={520} width={216} height={222} fill={pal.fill} />
        <rect x={512} y={520} width={216} height={222} fill={pal.fill} />
        <rect
          x={330}
          y={570}
          width={100}
          height={84}
          fill="none"
          stroke={L}
          strokeWidth={3}
        />
        <path d="M 380 570 V 654 M 330 612 H 430" stroke={L} strokeWidth={2} />
        <rect
          x={590}
          y={600}
          width={70}
          height={142}
          fill="none"
          stroke={L}
          strokeWidth={3}
        />
      </g>

      {/* retak */}
      {crack > 0 && (
        <path
          d="M 478 525 L 462 560 L 480 592 L 458 628 L 476 668 L 460 700"
          pathLength={1}
          fill="none"
          stroke={pal.accent}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray="1 1"
          strokeDashoffset={1 - crack}
        />
      )}

      {/* kolom lt 1 (+ selubung) */}
      {XS.map((x, i) => {
        const h = (G - 18 - 520) * cols1;
        return (
          <g key={`c${i}`}>
            {jacket > 0 && (
              <rect
                x={x - 12 - 14 * jacket}
                y={G - 18 - h}
                width={24 + 28 * jacket}
                height={h}
                fill={pal.accent}
                opacity={0.9}
              />
            )}
            <rect
              x={x - 12}
              y={G - 18 - h}
              width={24}
              height={h}
              fill={colHi ?? pal.bg2}
              stroke={L}
              strokeWidth={sw}
            />
          </g>
        );
      })}

      {/* ring balok */}
      <rect
        x={230}
        y={505}
        width={540 * ring1 + 0}
        height={16}
        fill={pal.fill}
        stroke={L}
        strokeWidth={sw}
        opacity={ring1}
      />

      {/* atap lama */}
      <g
        opacity={roof1 * (1 - roofOff)}
        transform={`translate(${roofOff * 120} ${drop(roof1, 300) - roofOff * 360}) rotate(${roofOff * 14} 500 430)`}
      >
        <path
          d="M 180 505 L 500 360 L 820 505"
          fill="none"
          stroke={pal.accent}
          strokeWidth={16}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path
          d="M 260 505 L 500 396 L 740 505 Z"
          fill="none"
          stroke={L}
          strokeWidth={2}
          opacity={0.5}
        />
      </g>

      {/* rencana lt 2 */}
      {ghost > 0 && (
        <g opacity={ghost}>
          <path
            d="M 230 505 V 290 H 770 V 505 M 180 290 L 500 140 L 820 290"
            fill="none"
            stroke={pal.accent2}
            strokeWidth={5}
            strokeDasharray="16 12"
            strokeDashoffset={-frame * 1.5}
            strokeLinejoin="round"
          />
        </g>
      )}

      {/* perancah */}
      {props > 0 &&
        [320, 400, 440, 560, 600, 680].map((x, i) => {
          const p = Math.max(0, Math.min(1, props * 6 - i * 0.8));
          return (
            <g
              key={`p${i}`}
              opacity={p}
              transform={`translate(0 ${(1 - p) * -60})`}
            >
              <line
                x1={x}
                y1={485}
                x2={x}
                y2={G - 22}
                stroke={pal.accent2}
                strokeWidth={6}
              />
              <line
                x1={x - 16}
                y1={G - 22}
                x2={x + 16}
                y2={G - 22}
                stroke={pal.accent2}
                strokeWidth={6}
              />
            </g>
          );
        })}

      {/* pelat lt 2 (cor) */}
      {slab > 0 && (
        <g>
          <rect
            x={220}
            y={478}
            width={560}
            height={30}
            fill="none"
            stroke={L}
            strokeWidth={3}
            strokeDasharray="10 8"
          />
          <clipPath id="slabclip">
            <rect x={220} y={478} width={560 * slab} height={30} />
          </clipPath>
          <rect
            x={220}
            y={478}
            width={560}
            height={30}
            fill={pal.accent}
            clipPath="url(#slabclip)"
          />
        </g>
      )}

      {/* lt 2 */}
      {cols2 > 0 &&
        XS.map((x, i) => (
          <rect
            key={`k${i}`}
            x={x - 14}
            y={478 - 180 * cols2}
            width={28}
            height={180 * cols2}
            fill={pal.accent}
          />
        ))}
      {walls2 > 0 && (
        <g opacity={walls2} transform={`translate(0 ${(1 - walls2) * 30})`}>
          <rect
            x={274}
            y={300}
            width={212}
            height={178}
            fill={pal.fill}
            stroke={L}
            strokeWidth={2}
          />
          <rect
            x={514}
            y={300}
            width={212}
            height={178}
            fill={pal.fill}
            stroke={L}
            strokeWidth={2}
          />
          <rect
            x={340}
            y={345}
            width={90}
            height={74}
            fill="none"
            stroke={L}
            strokeWidth={3}
          />
          <rect
            x={570}
            y={345}
            width={100}
            height={74}
            fill="none"
            stroke={L}
            strokeWidth={3}
          />
          <rect x={230} y={284} width={540} height={16} fill={pal.accent} />
        </g>
      )}
      {roof2 > 0 && (
        <g opacity={roof2} transform={`translate(0 ${drop(roof2, 200)})`}>
          <path
            d="M 180 284 L 500 140 L 820 284"
            fill="none"
            stroke={pal.accent2}
            strokeWidth={16}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <path
            d="M 260 284 L 500 176 L 740 284 Z"
            fill="none"
            stroke={L}
            strokeWidth={2}
            opacity={0.5}
          />
        </g>
      )}
    </g>
  );
};

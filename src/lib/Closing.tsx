import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Pal, SANS } from "./base";
import { tidy } from "./ui";

// Penutup standar: ajakan comment, like, dan subscribe.
export const Closing: React.FC<{ pal: Pal; question?: string }> = ({
  pal,
  question = "Suka dengan konten seperti ini?",
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const spr = (at: number, damping = 12) =>
    spring({ frame: f - at, fps, config: { damping } });
  const q = spr(4, 14);
  const items = [
    { t: "comment", at: 30 },
    { t: "like", at: 42 },
    { t: "subscribe", at: 54 },
  ];
  const press = f > 95 && f < 104 ? 0.9 : 1;
  const subscribed = f >= 100;
  const bell =
    f >= 104
      ? Math.sin((f - 104) * 1.2) * Math.max(0, 1 - (f - 104) / 30) * 25
      : 0;
  const like =
    f >= 70
      ? Math.sin((f - 70) * 0.8) * Math.max(0, 1 - (f - 70) / 25) * 18
      : 0;
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 620,
          left: 80,
          right: 80,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 66,
          lineHeight: 1.05,
          letterSpacing: -2,
          color: pal.line,
          textWrap: "balance",
          opacity: q,
          transform: `translateY(${(1 - q) * 60}px)`,
        }}
      >
        {tidy(question)}
      </div>
      <div
        style={{
          position: "absolute",
          top: 840,
          left: 60,
          right: 60,
          display: "flex",
          justifyContent: "center",
          gap: 30,
        }}
      >
        {items.map((it) => {
          const p = spr(it.at, 9);
          const isSub = it.t === "subscribe";
          return (
            <div
              key={it.t}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 16,
                width: 220,
                transform: `scale(${p * (isSub ? press : 1)})`,
                opacity: p,
              }}
            >
              <div
                style={{
                  width: 150,
                  height: 150,
                  borderRadius: 40,
                  background: isSub
                    ? subscribed
                      ? pal.accent2
                      : pal.accent
                    : "rgba(255,255,255,0.08)",
                  border: `4px solid ${isSub ? "transparent" : pal.accent}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: isSub ? `0 0 60px ${pal.accent}88` : undefined,
                }}
              >
                {it.t === "comment" && (
                  <svg
                    width={76}
                    height={76}
                    viewBox="0 0 40 40"
                    fill="none"
                    stroke={pal.line}
                    strokeWidth={3.2}
                    strokeLinejoin="round"
                  >
                    <path d="M6 8 H34 V27 H17 L10 33 V27 H6 Z" />
                    <path d="M12 15 H28 M12 20 H23" strokeLinecap="round" />
                  </svg>
                )}
                {it.t === "like" && (
                  <svg
                    width={76}
                    height={76}
                    viewBox="0 0 40 40"
                    style={{ transform: `rotate(${-like}deg)` }}
                  >
                    <path d="M6 18 H12 V34 H6 Z" fill={pal.accent} />
                    <path
                      d="M14 18 L20 6 C23 6 25 8 24 12 L23 16 H32 C34 16 35 18 35 20 L32 32 C31.5 33.5 30 34 29 34 H14 Z"
                      fill={pal.accent}
                    />
                  </svg>
                )}
                {isSub && (
                  <svg
                    width={76}
                    height={76}
                    viewBox="0 0 40 40"
                    style={{
                      transform: `rotate(${bell}deg)`,
                      transformOrigin: "50% 15%",
                    }}
                  >
                    <path
                      d="M20 5 C13 5 10 10 10 16 V24 L6 29 H34 L30 24 V16 C30 10 27 5 20 5 Z"
                      fill={pal.bg2}
                    />
                    <circle cx={20} cy={33} r={4} fill={pal.bg2} />
                  </svg>
                )}
              </div>
              <div
                style={{
                  fontFamily: SANS,
                  fontStyle: "italic",
                  fontWeight: 800,
                  fontSize: 36,
                  color: isSub
                    ? subscribed
                      ? pal.accent2
                      : pal.accent
                    : pal.line,
                }}
              >
                {it.t.charAt(0).toUpperCase() + it.t.slice(1)}
              </div>
            </div>
          );
        })}
      </div>
      {f > 96 && <PulseHtml f={f} at={100} color={pal.accent2} />}
    </>
  );
};

const PulseHtml: React.FC<{ f: number; at: number; color: string }> = ({
  f,
  at,
  color,
}) => {
  const t = (f - at) / 24;
  if (t < 0 || t > 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 790 - 140 * (0.5 + t),
        top: 915 - 140 * (0.5 + t),
        width: 280 * (0.5 + t),
        height: 280 * (0.5 + t),
        borderRadius: "50%",
        border: `${10 * (1 - t)}px solid ${color}`,
        opacity: 1 - t,
      }}
    />
  );
};

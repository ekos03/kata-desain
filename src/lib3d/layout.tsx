import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { clamp, Pal, SANS } from "../lib/base";
import { ease, tidy } from "../lib/ui";

// Tata letak bebas KATA DESAIN: teks bisa ditaruh di mana saja (x, y, lebar, perataan),
// dengan gaya masuk berbeda-beda. Tetap jelas: kontras dari tone, ukuran besar, tanpa kata menggantung.

type Anim = "up" | "down" | "left" | "right" | "scale" | "words" | "fade";
const enter = (anim: Anim, p: number) => {
  switch (anim) {
    case "up":
      return `translateY(${(1 - p) * 50}px)`;
    case "down":
      return `translateY(${(1 - p) * -50}px)`;
    case "left":
      return `translateX(${(1 - p) * -80}px)`;
    case "right":
      return `translateX(${(1 - p) * 80}px)`;
    case "scale":
      return `scale(${0.6 + 0.4 * p})`;
    default:
      return "none";
  }
};

export const Txt: React.FC<{
  x: number;
  y: number;
  w: number;
  at: number;
  children: string;
  size?: number;
  weight?: number;
  color: string;
  align?: "left" | "center" | "right";
  anim?: Anim;
  rot?: number;
  lh?: number;
  ls?: number;
  italic?: boolean;
  bg?: string;
  out?: number;
}> = ({ x, y, w, at, children, size = 64, weight = 900, color, align = "left", anim = "up", rot = 0, lh = 1.02, ls, italic, bg, out }) => {
  const f = useCurrentFrame();
  const p = ease(f, at, at + 16);
  const o = out !== undefined ? 1 - ease(f, out, out + 10) : 1;
  const words = tidy(children).split(" ");
  const common: React.CSSProperties = {
    position: "absolute",
    left: x,
    top: y,
    width: w,
    textAlign: align,
    fontFamily: SANS,
    fontWeight: weight,
    fontSize: size,
    lineHeight: lh,
    letterSpacing: ls ?? (size > 80 ? -size / 28 : -0.5),
    color,
    fontStyle: italic ? "italic" : undefined,
    textWrap: "balance",
    transformOrigin: align === "right" ? "right center" : align === "center" ? "center" : "left center",
  };
  if (anim === "words")
    return (
      <div style={{ ...common, transform: `rotate(${rot}deg)`, opacity: o }}>
        {words.map((wd, i) => {
          const q = interpolate((f - at) / 4 - i, [0, 1], [0, 1], clamp);
          return (
            <span key={i} style={{ display: "inline-block", opacity: q, transform: `translateY(${(1 - q) * 30}px)`, marginRight: size * 0.24 }}>
              {wd}
            </span>
          );
        })}
      </div>
    );
  return (
    <div style={{ ...common, opacity: p * o, transform: `${enter(anim, p)} rotate(${rot}deg)` }}>
      {bg ? (
        <span style={{ background: bg, padding: "0.06em 0.28em", borderRadius: size * 0.22, boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone" }}>{tidy(children)}</span>
      ) : (
        tidy(children)
      )}
    </div>
  );
};

/** Label kecil berbentuk kapsul (mis. "TIPS 1"). */
export const Kicker: React.FC<{ pal: Pal; x: number; y: number; at: number; text: string; align?: "left" | "center" | "right"; w?: number }> = ({ pal, x, y, at, text, align = "left", w = 940 }) => {
  const f = useCurrentFrame();
  const p = ease(f, at, at + 14);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, textAlign: align, opacity: p, transform: `translateY(${(1 - p) * 20}px)` }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 14, fontFamily: SANS, fontWeight: 800, fontSize: 34, letterSpacing: 5, color: pal.accent, background: "rgba(255,255,255,0.75)", padding: "12px 26px", borderRadius: 999, boxShadow: `0 6px 24px ${pal.accent}22` }}>
        <span style={{ width: 14, height: 14, borderRadius: 7, background: pal.accent }} />
        {text}
      </span>
    </div>
  );
};

/** Angka raksasa bergaris (nomor tips). */
export const BigNum: React.FC<{ pal: Pal; x: number; y: number; at: number; n: string; size?: number; align?: "left" | "right" }> = ({ pal, x, y, at, n, size = 300, align = "left" }) => {
  const f = useCurrentFrame();
  const p = ease(f, at, at + 18);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: size * 1.3, textAlign: align, fontFamily: SANS, fontWeight: 900, fontSize: size, lineHeight: 0.85, letterSpacing: -size / 20, color: "transparent", WebkitTextStroke: `5px ${pal.accent}`, opacity: p * 0.9, transform: `scale(${1.3 - 0.3 * p}) rotate(${(1 - p) * -10}deg)`, transformOrigin: align === "right" ? "right top" : "left top" }}>
      {n}
    </div>
  );
};

/** Keterangan dengan garis penunjuk ke titik objek. */
export const Callout: React.FC<{ pal: Pal; at: number; tx: number; ty: number; x: number; y: number; text: string; w?: number; align?: "left" | "right"; out?: number }> = ({ pal, at, tx, ty, x, y, text, w = 360, align = "left", out }) => {
  const f = useCurrentFrame();
  const o = out !== undefined ? 1 - ease(f, out, out + 10) : 1;
  const d = ease(f, at, at + 14);
  const t = ease(f, at + 8, at + 22);
  const ax = align === "left" ? x : x + w;
  const ay = y + 26;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <line x1={tx} y1={ty} x2={tx + (ax - tx) * d} y2={ty + (ay - ty) * d} stroke={pal.line} strokeWidth={3} strokeDasharray="2 8" strokeLinecap="round" opacity={0.7} />
        <circle cx={tx} cy={ty} r={10 * d} fill={pal.accent} />
        <circle cx={tx} cy={ty} r={22 * d} fill="none" stroke={pal.accent} strokeWidth={3} opacity={0.5} />
      </svg>
      <div style={{ position: "absolute", left: x, top: y, width: w, textAlign: align, fontFamily: SANS, fontWeight: 700, fontSize: 36, lineHeight: 1.15, color: pal.line, opacity: t, transform: `translateY(${(1 - t) * 12}px)`, textWrap: "balance" }}>
        <span style={{ background: "rgba(255,255,255,0.8)", padding: "6px 14px", borderRadius: 14, boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone" }}>{tidy(text)}</span>
      </div>
    </div>
  );
};

/** Daftar poin bertahap. */
export const Bullets: React.FC<{ pal: Pal; x: number; y: number; w: number; items: { at: number; text: string }[]; size?: number; marker?: "dot" | "check" | "num" }> = ({ pal, x, y, w, items, size = 40, marker = "dot" }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, display: "flex", flexDirection: "column", gap: size * 0.45 }}>
      {items.map((it, i) => {
        const p = ease(f, it.at, it.at + 14);
        return (
          <div key={i} style={{ display: "flex", gap: 18, alignItems: "flex-start", opacity: p, transform: `translateX(${(1 - p) * -40}px)` }}>
            <div style={{ flex: "none", width: size * 1.05, height: size * 1.05, borderRadius: size, background: pal.accent, color: "#fff", fontFamily: SANS, fontWeight: 900, fontSize: size * 0.6, display: "flex", alignItems: "center", justifyContent: "center", marginTop: size * 0.04 }}>
              {marker === "num" ? i + 1 : marker === "check" ? "✓" : ""}
            </div>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: size, lineHeight: 1.18, color: pal.line, textWrap: "balance" }}>{tidy(it.text)}</div>
          </div>
        );
      })}
    </div>
  );
};

/** Kartu info putih lembut. */
export const Card: React.FC<{ pal: Pal; x: number; y: number; w: number; at: number; title?: string; text: string; rot?: number }> = ({ pal, x, y, w, at, title, text, rot = 0 }) => {
  const f = useCurrentFrame();
  const p = ease(f, at, at + 16);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, padding: "26px 32px", borderRadius: 34, background: "rgba(255,255,255,0.82)", boxShadow: `0 14px 40px ${pal.line}1f`, opacity: p, transform: `translateY(${(1 - p) * 40}px) rotate(${rot}deg)` }}>
      {title && <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 30, letterSpacing: 3, color: pal.accent, marginBottom: 8 }}>{title}</div>}
      <div style={{ fontFamily: SANS, fontWeight: 650, fontSize: 38, lineHeight: 1.2, color: pal.line, textWrap: "balance" }}>{tidy(text)}</div>
    </div>
  );
};

/** Kapsul ajakan berwarna aksen. */
export const Pill: React.FC<{ pal: Pal; x: number; y: number; w: number; at: number; text: string; align?: "left" | "center" | "right" }> = ({ pal, x, y, w, at, text, align = "center" }) => {
  const f = useCurrentFrame();
  const p = ease(f, at, at + 12);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, textAlign: align, opacity: p, transform: `scale(${0.8 + 0.2 * p})` }}>
      <span style={{ display: "inline-block", fontFamily: SANS, fontWeight: 800, fontSize: 46, color: "#fff", background: pal.accent, padding: "16px 40px", borderRadius: 999, boxShadow: `0 10px 30px ${pal.accent}55` }}>{tidy(text)}</span>
    </div>
  );
};

/** Catatan kecil. */
export const Note: React.FC<{ pal: Pal; y: number; at: number; text: string }> = ({ pal, y, at, text }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 90, right: 90, top: y, textAlign: "center", fontFamily: SANS, fontSize: 28, lineHeight: 1.3, color: pal.line, opacity: 0.65 * ease(f, at, at + 14), textWrap: "balance" }}>{tidy(text)}</div>
  );
};

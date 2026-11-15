import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { clamp, Pal, SANS } from "../lib/base";
import { ease, tidy } from "../lib/ui";
import { DISPLAY } from "./fonts";

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
  const lines = children.split("|").map((l) => tidy(l.trim()));
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
    hyphens: "none",
    wordBreak: "normal",
    transformOrigin: align === "right" ? "right center" : align === "center" ? "center" : "left center",
  };
  if (anim === "words")
    return (
      <div style={{ ...common, transform: `rotate(${rot}deg)`, opacity: o }}>
        {lines.map((l, li) => {
          const before = lines.slice(0, li).join(" ").split(" ").filter(Boolean).length;
          return (
            <div key={li}>
              {l.split(" ").map((wd, i) => {
                const q = interpolate((f - at) / 4 - (before + i), [0, 1], [0, 1], clamp);
                return (
                  <span key={i} style={{ display: "inline-block", opacity: q, transform: `translateY(${(1 - q) * 30}px)`, marginRight: size * 0.24 }}>
                    {wd}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  return (
    <div style={{ ...common, opacity: p * o, transform: `${enter(anim, p)} rotate(${rot}deg)` }}>
      {bg ? (
        <span style={{ background: bg, padding: "0.06em 0.28em", borderRadius: size * 0.22, boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone" }}>{lines.join(" ")}</span>
      ) : (
        lines.map((l, i) => (
          <div key={i}>{l}</div>
        ))
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
      <span style={{ display: "inline-flex", alignItems: "center", gap: 14, fontFamily: SANS, fontWeight: 800, fontSize: 34, letterSpacing: 5, color: pal.accent, padding: "12px 26px", borderRadius: 999, background: "rgba(255,255,255,0.38)", backdropFilter: "blur(18px) saturate(160%)", WebkitBackdropFilter: "blur(18px) saturate(160%)", border: "1.5px solid rgba(255,255,255,0.75)", boxShadow: `inset 0 1px 0 rgba(255,255,255,0.9), 0 6px 24px ${pal.accent}22` }}>
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
        <span style={{ background: "rgba(255,255,255,0.5)", border: "1.5px solid rgba(255,255,255,0.8)", padding: "6px 14px", borderRadius: 16, boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone" }}>{tidy(text)}</span>
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
    <div style={{ position: "absolute", left: x, top: y, width: w, padding: "26px 32px", borderRadius: 34, background: "rgba(255,255,255,0.38)", backdropFilter: "blur(18px) saturate(160%)", WebkitBackdropFilter: "blur(18px) saturate(160%)", border: "1.5px solid rgba(255,255,255,0.75)", boxShadow: `inset 0 1px 0 rgba(255,255,255,0.95), inset 0 -10px 30px rgba(255,255,255,0.25), 0 14px 40px ${pal.line}1f`, opacity: p, transform: `translateY(${(1 - p) * 40}px) rotate(${rot}deg)` }}>
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
      <span style={{ display: "inline-block", fontFamily: SANS, fontWeight: 800, fontSize: 46, color: "#fff", background: `linear-gradient(180deg, ${pal.accent}dd, ${pal.accent}aa)`, backdropFilter: "blur(14px)", border: "1.5px solid rgba(255,255,255,0.6)", padding: "16px 40px", borderRadius: 999, boxShadow: `inset 0 2px 0 rgba(255,255,255,0.55), 0 10px 30px ${pal.accent}55` }}>{tidy(text)}</span>
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

// ================== Tipografi tampilan & elemen info (gaya realis) ==================

/**
 * Judul tampilan: `|` = pindah baris, `*kata*` = serif miring berwarna aksen,
 * `_kata_` = distabilo. Contoh: "Kenapa *dilewati*|_pembeli?_"
 */
export const Headline: React.FC<{ pal: Pal; y: number; at: number; text: string; size?: number; out?: number }> = ({ pal, y, at, text, size = 132, out }) => {
  // Semua sans-serif. `*kata*` = warna aksen, `~kata~` = huruf bergaris tepi, `_kata_` = distabilo, `|` = pindah baris.
  const f = useCurrentFrame();
  const o = out !== undefined ? 1 - ease(f, out, out + 10) : 1;
  let wi = 0;
  return (
    <div style={{ position: "absolute", left: 40, right: 40, top: y, textAlign: "center", opacity: o }}>
      {text.split("|").map((line, li) => (
        <div key={li} style={{ lineHeight: 0.96, whiteSpace: "nowrap" }}>
          {line.split(" ").map((raw, i) => {
            const k = wi++;
            const p = ease(f, at + k * 3, at + k * 3 + 12);
            const kind = /^\*.*\*[?!.,]?$/.test(raw) ? "accent" : /^~.*~[?!.,]?$/.test(raw) ? "outline" : /^_.*_[?!.,]?$/.test(raw) ? "mark" : "plain";
            const w = raw.replace(/^[*_~]|[*_~](?=[?!.,]?$)/g, "");
            const hp = ease(f, at + k * 3 + 8, at + k * 3 + 22);
            return (
              <span key={i} style={{ position: "relative", display: "inline-block", marginRight: size * 0.2, opacity: p, transform: `translateY(${(1 - p) * 40}px) scale(${kind === "accent" ? 1 + (1 - p) * 0.3 : 1})` }}>
                {kind === "mark" && (
                  <span style={{ position: "absolute", left: -size * 0.06, right: -size * 0.06, bottom: size * 0.05, height: size * 0.4, background: pal.accent, opacity: 0.4, borderRadius: size * 0.1, transform: `scaleX(${hp}) rotate(-1.5deg)`, transformOrigin: "left" }} />
                )}
                <span
                  style={{
                    position: "relative",
                    fontFamily: DISPLAY,
                    fontWeight: 800,
                    fontSize: size,
                    letterSpacing: -size / 22,
                    color: kind === "accent" ? pal.accent : kind === "outline" ? "transparent" : pal.line,
                    WebkitTextStroke: kind === "outline" ? `${Math.max(3, size / 28)}px ${pal.line}` : undefined,
                  }}
                >
                  {w}
                </span>
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/** Kartu info bernomor tanpa garis penunjuk (nomornya sama dengan titik di produk). */
export const InfoChip: React.FC<{ pal: Pal; x: number; y: number; w: number; at: number; n: number; text: string; out?: number }> = ({ pal, x, y, w, at, n, text, out }) => {
  const f = useCurrentFrame();
  const o = out !== undefined ? 1 - ease(f, out, out + 10) : 1;
  const p = ease(f, at, at + 12);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, display: "flex", alignItems: "center", gap: 18, padding: "18px 24px 18px 18px", background: "#ffffff", borderRadius: 28, boxShadow: `0 14px 34px ${pal.line}22`, opacity: p * o, transform: `translateY(${(1 - p) * 30}px)` }}>
      <div style={{ flex: "none", width: 64, height: 64, borderRadius: 32, background: pal.accent, color: "#fff", fontFamily: DISPLAY, fontWeight: 800, fontSize: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>{n}</div>
      <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 44, lineHeight: 1.05, color: pal.line, letterSpacing: -1, textWrap: "balance" }}>{tidy(text)}</div>
    </div>
  );
};

/** Label penunjuk besar bernomor. */
export const Tag: React.FC<{ pal: Pal; at: number; tx: number; ty: number; x: number; y: number; n?: number; text: string; w?: number; align?: "left" | "right"; out?: number }> = ({ pal, at, tx, ty, x, y, n, text, w = 470, align = "left", out }) => {
  const f = useCurrentFrame();
  const o = out !== undefined ? 1 - ease(f, out, out + 10) : 1;
  const d = ease(f, at, at + 12);
  const t = ease(f, at + 6, at + 18);
  const ax = align === "left" ? x + 30 : x + w - 30;
  const ay = y + 40;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <path d={`M${tx} ${ty} Q ${(tx + ax) / 2} ${Math.min(ty, ay) - 40} ${tx + (ax - tx) * d} ${ty + (ay - ty) * d}`} stroke={pal.line} strokeWidth={5} fill="none" strokeLinecap="round" />
        <circle cx={tx} cy={ty} r={14 * d} fill={pal.accent} stroke="#fff" strokeWidth={5} />
      </svg>
      <div style={{ position: "absolute", left: x, top: y, width: w, display: "flex", justifyContent: align === "left" ? "flex-start" : "flex-end", opacity: t, transform: `scale(${0.85 + 0.15 * t})`, transformOrigin: align === "left" ? "left center" : "right center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 24px 16px 16px", background: "#ffffff", borderRadius: 26, boxShadow: `0 12px 30px ${pal.line}26`, border: `3px solid ${pal.line}` }}>
          {n !== undefined && (
            <div style={{ flex: "none", width: 58, height: 58, borderRadius: 29, background: pal.accent, color: "#fff", fontFamily: DISPLAY, fontWeight: 800, fontSize: 36, display: "flex", alignItems: "center", justifyContent: "center" }}>{n}</div>
          )}
          <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 46, lineHeight: 1.05, color: pal.line, letterSpacing: -1, textWrap: "balance" }}>{tidy(text)}</div>
        </div>
      </div>
    </div>
  );
};

/** Meter keterbacaan (0–10). */
export const Meter: React.FC<{ pal: Pal; x: number; y: number; w: number; at: number; label: string; value: number; good?: boolean; out?: number }> = ({ pal, x, y, w, at, label, value, good, out }) => {
  const f = useCurrentFrame();
  const o = out !== undefined ? 1 - ease(f, out, out + 10) : 1;
  const p = ease(f, at, at + 14);
  const v = ease(f, at + 6, at + 30) * value;
  const col = good ? "#2f9e5a" : "#e0503c";
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, padding: "20px 26px", background: "rgba(255,255,255,0.88)", borderRadius: 26, border: `3px solid ${pal.line}`, opacity: p * o, transform: `translateY(${(1 - p) * 30}px)` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontFamily: DISPLAY, fontWeight: 800, color: pal.line }}>
        <span style={{ fontSize: 32, whiteSpace: "nowrap" }}>{label}</span>
        <span style={{ fontSize: 56, color: col }}>{Math.round(v)}/10</span>
      </div>
      <div style={{ marginTop: 10, height: 22, borderRadius: 11, background: `${pal.line}22`, overflow: "hidden" }}>
        <div style={{ width: `${v * 10}%`, height: "100%", borderRadius: 11, background: col }} />
      </div>
    </div>
  );
};

/** Stiker miring. */
export const Sticker: React.FC<{ x: number; y: number; at: number; text: string; bg: string; color?: string; rot?: number; size?: number; out?: number }> = ({ x, y, at, text, bg, color = "#fff", rot = -8, size = 40, out }) => {
  const f = useCurrentFrame();
  const o = out !== undefined ? 1 - ease(f, out, out + 10) : 1;
  const p = ease(f, at, at + 10);
  return (
    <div style={{ position: "absolute", left: x, top: y, padding: "14px 26px", background: bg, color, borderRadius: 16, border: "4px solid #fff", boxShadow: "0 10px 24px rgba(0,0,0,0.18)", fontFamily: DISPLAY, fontWeight: 800, fontSize: size, letterSpacing: 1, opacity: p * o, transform: `rotate(${rot}deg) scale(${1.6 - 0.6 * p})` }}>{text}</div>
  );
};

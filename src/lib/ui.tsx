import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { clamp, MONO, Pal, SANS } from "./base";

// ---------- teks rapi (EYD, tanpa kata menggantung) ----------
const NB = " ";
// Kata tugas & kata depan selalu menempel ke kata sesudahnya (tidak berdiri di ujung baris).
const TUGAS =
  /(?<=^|\s)(dan|atau|di|ke|yang|untuk|serta|dengan|oleh|dari|pada|lalu|hanya|bukan|agar|supaya|tanpa|seperti|saat|tetap|jadi|per|lebih|tidak|juga|sudah|cukup|si|sang|para|akan|bisa|harus|jangan|walau|tiap|setiap|satu|dua|tiga|empat|lima|maksimal|minimal|sekitar|hingga|sampai|antara|ini|itu)\s(?=\S)/gi;
// Frasa padu yang tidak boleh dipisah baris.
const FRASA = [
  "hitam putih", "media sosial", "foto profil", "label kemasan", "ujung jempol", "hak merek", "merek dagang",
  "file asli", "file vektor", "nama usaha", "nama usahamu", "huruf tebal", "huruf biasa", "jenis huruf", "ciri khas",
  "Kopi Senja", "asal daerah", "nama pemilik", "apa pun", "di mana", "sekecil apa", "jasa desain", "beberapa detik",
];
export const tidy = (s: string) => {
  let t = s
    .replace(/(\d)–(\d)/g, "$1⁠–⁠$2")
    .replace(/(\d[\d.,–⁠]*)\s(?=\S)/g, `$1${NB}`)
    .replace(/([≥≈±*])\s(?=\S)/g, `$1${NB}`);
  for (const fr of FRASA) t = t.replace(new RegExp(fr.replace(/ /g, "\\s"), "gi"), (m) => m.replace(/\s/g, NB));
  t = t.replace(TUGAS, `$1${NB}`);
  // awal kalimat: kata pertama menempel ke kata kedua (tidak tertinggal di ujung baris)
  t = t.replace(/([.!?:]\s+|^)(\S+) (?=\S)/g, `$1$2${NB}`);
  // akhir kalimat: kata terakhir menempel ke kata sebelumnya
  t = t.replace(/ (\S+[.!?,:;])(?=\s|$)/g, `${NB}$1`);
  // tidak ada kata tunggal yang menggantung di baris terakhir
  t = t.replace(/ (\S+)$/, `${NB}$1`);
  return t;
};

// ---------- util animasi ----------
export const useSpr = (delay = 0, damping = 14, mass = 1) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, mass } });
};
export const ease = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.33, 0, 0.2, 1),
  });
export const lerp = (p: number, a: number, b: number) => a + (b - a) * p;

// ---------- latar gelap + grid halus + cahaya aksen ----------
export const Backdrop: React.FC<{
  pal: Pal;
  glowX?: number;
  glowY?: number;
}> = ({ pal }) => <AbsoluteFill style={{ background: pal.bg2 }} />;

// ---------- judul: nomor besar + judul pendek ----------
export const Title: React.FC<{
  pal: Pal;
  num?: string;
  tag?: string;
  title: string;
  sub?: string;
  delay?: number;
}> = ({ pal, num, tag, title, sub, delay = 6 }) => {
  const c = useSpr(delay + 18, 16);
  const a = useSpr(delay, 12);
  const b = useSpr(delay + 6, 14);
  const words = tidy(title).split(" ");
  return (
    <div style={{ position: "absolute", top: 150, left: 70, right: 70 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        {num && (
          <div
            style={{
              fontFamily: MONO,
              fontWeight: 800,
              fontSize: 190,
              lineHeight: 0.9,
              color: "transparent",
              WebkitTextStroke: `4px ${pal.accent}`,
              transform: `scale(${lerp(a, 1.6, 1)}) rotate(${(1 - a) * -12}deg)`,
              opacity: a,
            }}
          >
            {num}
          </div>
        )}
        {tag && (
          <div
            style={{
              fontFamily: MONO,
              fontWeight: 800,
              fontSize: 40,
              letterSpacing: 6,
              color: pal.bg2,
              background: pal.accent,
              padding: "10px 24px",
              borderRadius: 12,
              transform: `translateX(${(1 - a) * -80}px)`,
              opacity: a,
            }}
          >
            {tag}
          </div>
        )}
      </div>
      <div
        style={{
          marginTop: 22,
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 92,
          lineHeight: 1.04,
          letterSpacing: -2,
          color: pal.line,
          textWrap: "balance",
        }}
      >
        {words.map((w, i) => {
          const p = interpolate(b * words.length - i, [0, 1], [0, 1], clamp);
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                opacity: p,
                transform: `translateY(${(1 - p) * 40}px)`,
                marginRight: 22,
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
      {sub && (
        <div
          style={{
            marginTop: 14,
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 40,
            color: pal.accent,
            opacity: c,
            transform: `translateX(${(1 - c) * -40}px)`,
            textWrap: "balance",
          }}
        >
          {tidy(sub)}
        </div>
      )}
    </div>
  );
};

// ---------- satu kata kunci besar di bawah ----------
export const KeyPill: React.FC<{
  pal: Pal;
  text: string;
  delay: number;
  top?: number;
}> = ({ pal, text, delay, top = 1610 }) => {
  const p = useSpr(delay, 11);
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 50,
          color: pal.bg2,
          background: pal.accent,
          padding: "20px 44px",
          borderRadius: 999,
          transform: `scale(${p})`,
          opacity: p,
          boxShadow: `0 0 60px ${pal.accent}55`,
        }}
      >
        {tidy(text)}
      </div>
    </div>
  );
};

/** Panggung animasi utama 1000×1000 di tengah layar. */
export const Stage: React.FC<{
  children: React.ReactNode;
  top?: number;
  shake?: number;
}> = ({ children, top = 540, shake = 0 }) => {
  const f = useCurrentFrame();
  const sx = shake * Math.sin(f * 2.3) * 14;
  const sy = shake * Math.cos(f * 1.9) * 10;
  return (
    <svg
      viewBox="0 0 1000 1000"
      width={1000}
      height={1000}
      style={{
        position: "absolute",
        left: 40,
        top,
        transform: `translate(${sx}px, ${sy}px)`,
        overflow: "visible",
      }}
    >
      {children}
    </svg>
  );
};

/** Label besar di dalam panggung (SVG). */
export const Label: React.FC<{
  x: number;
  y: number;
  text: string;
  p: number;
  color: string;
  anchor?: "start" | "middle" | "end";
  size?: number;
}> = ({ x, y, text, p, color, anchor = "middle", size = 46 }) => (
  <text
    x={x}
    y={y + (1 - p) * 20}
    textAnchor={anchor}
    fontFamily={SANS}
    fontWeight={800}
    fontSize={size}
    fill={color}
    opacity={p}
  >
    {text}
  </text>
);

// ---------- kartu info kecil di bawah ----------
export const InfoCard: React.FC<{
  pal: Pal;
  icon: React.ReactNode;
  text: string;
  delay: number;
  top?: number;
}> = ({ pal, icon, text, delay, top = 1680 }) => {
  const p = useSpr(delay, 15);
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 70,
        right: 70,
        display: "flex",
        alignItems: "center",
        gap: 24,
        padding: "18px 28px",
        borderRadius: 24,
        background: "rgba(255,255,255,0.06)",
        border: `2px solid ${pal.accent}55`,
        transform: `translateY(${(1 - p) * 50}px)`,
        opacity: p,
      }}
    >
      <div
        style={{
          flexShrink: 0,
          width: 64,
          height: 64,
          borderRadius: 18,
          background: `${pal.accent}22`,
          color: pal.accent,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 33,
          lineHeight: 1.25,
          color: pal.line,
          textWrap: "balance",
        }}
      >
        {tidy(text)}
      </div>
    </div>
  );
};

// ---------- progress di bawah ----------
export const Progress: React.FC<{
  step: number;
  color: string;
  total?: number;
}> = ({ step, color, total = 6 }) => (
  <div
    style={{
      position: "absolute",
      left: 70,
      right: 70,
      bottom: 48,
      display: "flex",
      gap: 12,
    }}
  >
    {Array.from({ length: total }, (_, k) => k + 1).map((i) => (
      <div
        key={i}
        style={{
          flex: 1,
          height: 10,
          borderRadius: 5,
          background:
            i === step
              ? color
              : i < step || step > total
                ? `${color}88`
                : `${color}26`,
        }}
      />
    ))}
  </div>
);

import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { tidy } from "./ui";

// Sampul (cover) Instagram & TikTok, 1080×1920.
// format "tiktok": judul di sepertiga atas–tengah (bawah ± 420 px tertutup UI TikTok).
// format "ig": semua teks di pita tengah 3:4 (y 240–1680) agar aman saat dipotong di grid profil.
export type SampulProps = {
  bg: string; // berkas di public/, mis. "fondasi-kuat/sampul-bg.png"
  kicker: string; // label kecil di atas judul
  judul: string; // baris dipisah "|", kata aksen diapit *...*
  sub?: string; // satu baris pendukung
  kanal: string; // nama kanal
  accent: string;
  ink?: string; // warna teks judul
  panel?: string; // warna panel di belakang judul
  font?: string;
  format: "tiktok" | "ig";
  band?: [number, number]; // potong pita ilustrasi dari bingkai latar (y awal, y akhir); latar jadi warna polos
  bgColor?: string;
  bgEdge?: string; // warna tepi latar (gelap untuk NOEKANG, lembut untuk KATA DESAIN)
};

const parts = (line: string, accent: string) =>
  tidy(line)
    .split(/(\*[^*]+\*)/)
    .filter(Boolean)
    .map((p, i) =>
      p.startsWith("*") ? (
        <span key={i} style={{ color: accent }}>
          {p.slice(1, -1)}
        </span>
      ) : (
        <span key={i}>{p}</span>
      ),
    );

export const Sampul: React.FC<SampulProps> = ({ bg, kicker, judul, sub, kanal, accent, ink = "#fff", panel = "rgba(10,12,20,0.72)", font = "Inter, 'DejaVu Sans', Arial, sans-serif", format, band, bgColor = "#1b1d2a", bgEdge = "#0d0e14" }) => {
  const lines = judul.split("|");
  const top = band ? (format === "tiktok" ? 250 : 290) : format === "tiktok" ? 300 : 430;
  const longest = Math.max(...lines.map((l) => l.replace(/\*/g, "").length));
  const size = Math.min(lines.length > 2 ? 118 : 132, Math.floor(780 / (0.56 * longest)));
  return (
    <AbsoluteFill style={{ fontFamily: font, background: "#111" }}>
      {band ? (
        <>
          <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 40%, ${bgColor} 0%, ${bgEdge} 100%)` }} />
          <div style={{ position: "absolute", left: 0, top: 1000, width: 1080, height: 600, overflow: "hidden", WebkitMaskImage: "linear-gradient(180deg, transparent 0%, #000 12%, #000 88%, transparent 100%)" }}>
            <div style={{ position: "absolute", inset: 0, WebkitMaskImage: "linear-gradient(90deg, transparent 0%, #000 22%, #000 78%, transparent 100%)" }}>
            {(() => {
              const k = Math.min(1, 600 / (band[1] - band[0]));
              return <Img src={staticFile(bg)} style={{ position: "absolute", width: 1080 * k, height: 1920 * k, left: (1080 - 1080 * k) / 2, top: -band[0] * k + (600 - (band[1] - band[0]) * k) / 2 }} />;
            })()}
            </div>
          </div>
        </>
      ) : (
        <>
          <Img src={staticFile(bg)} style={{ width: 1080, height: 1920, objectFit: "cover" }} />
          <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.05) 45%, rgba(0,0,0,0.15) 70%, rgba(0,0,0,0.6) 100%)" }} />
        </>
      )}
      <div style={{ position: "absolute", left: 72, right: 136, top, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <div style={{ background: accent, color: "#111", fontWeight: 800, fontSize: 40, letterSpacing: 3, padding: "12px 30px", borderRadius: 999, textTransform: "uppercase" }}>{kicker}</div>
        <div style={{ background: panel, borderRadius: 40, padding: "34px 40px", textAlign: "center", boxShadow: "0 24px 60px rgba(0,0,0,0.35)" }}>
          {lines.map((l, i) => (
            <div key={i} style={{ color: ink, fontWeight: 900, fontSize: size, lineHeight: 1.04, letterSpacing: -1 }}>
              {parts(l, accent)}
            </div>
          ))}
        </div>
        {sub && <div style={{ color: "#fff", fontWeight: 700, fontSize: 46, textAlign: "center", textShadow: "0 3px 14px rgba(0,0,0,0.6)" }}>{tidy(sub)}</div>}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: band ? 1620 : format === "tiktok" ? 1380 : 1560, textAlign: "center", color: "#fff", fontWeight: 800, fontSize: 38, letterSpacing: 6, textShadow: "0 2px 10px rgba(0,0,0,0.6)" }}>{kanal}</div>
    </AbsoluteFill>
  );
};

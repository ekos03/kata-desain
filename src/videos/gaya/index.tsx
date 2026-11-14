import React, { useMemo } from "react";
import { AbsoluteFill } from "remotion";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { Gloss, RoundedBox, Studio } from "../../lib3d/kit";
import { Callout, Card, Kicker, Note, Txt } from "../../lib3d/layout";
import { tonePal } from "../../lib3d/tones";
import { Jar, Pouch, Sachet, SoftShadow, Table, useLabels } from "../../lib3d/real";
import { SANS } from "../../lib/base";

// Contoh gaya (style frame) untuk memilih arah visual KATA DESAIN.
const pal = tonePal("pink", 1);

const useCanvasTex = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void) =>
  useMemo(() => {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    draw(c.getContext("2d")!);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

const rr = (g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  g.beginPath();
  g.roundRect(x, y, w, h, r);
};

const LookAt: React.FC<{ to: [number, number, number] }> = ({ to }) => {
  const { camera } = useThree();
  useMemo(() => camera.lookAt(...to), [camera, to]);
  return null;
};

// Poster "Kopi Senja" versi rapi (dipakai di artboard)
const drawPoster = (g: CanvasRenderingContext2D) => {
  g.fillStyle = "#fff7f0";
  g.fillRect(0, 0, 1024, 1280);
  g.fillStyle = "#3b1f5e";
  g.beginPath();
  g.arc(512, 430, 230, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#ff8a3d";
  g.beginPath();
  g.arc(512, 440, 120, Math.PI, 0);
  g.fill();
  g.fillStyle = "#fff1dc";
  g.beginPath();
  g.moveTo(392, 440);
  g.lineTo(632, 440);
  g.bezierCurveTo(632, 540, 580, 580, 512, 580);
  g.bezierCurveTo(444, 580, 392, 540, 392, 440);
  g.fill();
  g.strokeStyle = "#fff1dc";
  g.lineWidth = 16;
  g.beginPath();
  g.arc(640, 490, 34, -Math.PI / 2, Math.PI / 2);
  g.stroke();
  g.fillStyle = "#3b1f5e";
  g.textAlign = "center";
  g.font = "900 120px Inter, sans-serif";
  g.fillText("KOPI SENJA", 512, 820);
  g.font = "600 46px Inter, sans-serif";
  g.fillStyle = "#c2477a";
  g.fillText("Diseduh pelan, dinikmati hangat", 512, 900);
  g.fillStyle = "#3b1f5e";
  rr(g, 312, 1000, 400, 110, 55);
  g.fill();
  g.fillStyle = "#fff";
  g.font = "800 48px Inter, sans-serif";
  g.fillText("Pesan sekarang", 512, 1072);
};

// ============ 1. ARTBOARD MELAYANG ============
export const GayaArtboard: React.FC = () => {
  const poster = useCanvasTex(1024, 1280, drawPoster);
  return (
    <AbsoluteFill style={{ background: pal.bg2, fontFamily: SANS }}>
      <Kicker pal={pal} x={70} y={100} w={940} align="center" at={-30} text="TIPS 3" />
      <Txt x={70} y={180} w={940} at={-30} align="center" size={116} color={pal.line}>
        Batasi warna
      </Txt>
      <Studio bg={pal.bg2} top={360} height={1120} cam={[0, 0, 10]}>
        <group rotation={[0.08, -0.22, 0.02]} position={[0.45, 0.1, 0]}>
          {/* artboard kaca */}
          <RoundedBox args={[4.4, 5.6, 0.16]} radius={0.12} smoothness={8}>
            <Gloss color="#ffe3ee" />
          </RoundedBox>
          <mesh position={[0, -0.05, 0.1]}>
            <planeGeometry args={[3.9, 4.875]} />
            <meshStandardMaterial map={poster} roughness={0.6} />
          </mesh>
          {/* bilah alat di atas artboard */}
          <RoundedBox args={[2.6, 0.42, 0.12]} radius={0.12} smoothness={6} position={[0, 3.05, 0.2]}>
            <Gloss color="#ffffff" />
          </RoundedBox>
          {[-0.9, -0.45, 0, 0.45, 0.9].map((x, i) => (
            <mesh key={x} position={[x, 3.05, 0.3]}>
              <sphereGeometry args={[0.1, 32, 24]} />
              <Gloss color={i === 2 ? pal.accent : "#c9b6d8"} solid />
            </mesh>
          ))}
          {/* kotak seleksi pada logo */}
          {[
            [0, 1.95, 2.0, 0.025],
            [0, 0.05, 2.0, 0.025],
            [-1.0, 1.0, 0.025, 1.9],
            [1.0, 1.0, 0.025, 1.9],
          ].map(([x, y, w, h], i) => (
            <mesh key={i} position={[x, y, 0.13]}>
              <planeGeometry args={[w, h]} />
              <meshBasicMaterial color={pal.accent} />
            </mesh>
          ))}
          {[
            [-1, 1.95],
            [1, 1.95],
            [-1, 0.05],
            [1, 0.05],
          ].map(([x, y], i) => (
            <RoundedBox key={i} args={[0.14, 0.14, 0.04]} radius={0.02} smoothness={4} position={[x, y, 0.15]}>
              <meshStandardMaterial color="#ffffff" />
            </RoundedBox>
          ))}
        </group>
        {/* panel warna melayang */}
        <group position={[-1.95, -1.7, 1.4]} rotation={[0.05, 0.3, -0.04]} scale={0.85}>
          <RoundedBox args={[1.5, 2.3, 0.14]} radius={0.16} smoothness={8}>
            <Gloss color="#ffffff" />
          </RoundedBox>
          {["#3b1f5e", "#ff8a3d", "#fff1dc"].map((c, i) => (
            <RoundedBox key={c} args={[1.05, 0.5, 0.1]} radius={0.12} smoothness={6} position={[0, 0.65 - i * 0.65, 0.12]}>
              <Gloss color={c} solid />
            </RoundedBox>
          ))}
        </group>
      </Studio>
      {/* kursor */}
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <path d="M700 760 L700 860 L728 834 L748 880 L764 872 L744 828 L780 826 Z" fill="#2a1a24" stroke="#fff" strokeWidth={5} strokeLinejoin="round" />
      </svg>
      <Callout pal={pal} at={-30} tx={250} ty={1300} x={90} y={1460} w={460} text="Cukup 3 warna: ungu, oranye, krem" />
      <Card pal={pal} x={70} y={1580} w={940} at={-30} title="CARA CEK" text="Ubah desain jadi hitam putih. Masih jelas? Warnanya sudah pas." />
    </AbsoluteFill>
  );
};

// ============ 2. SATU OBJEK UTAMA ============
const drawPouch = (g: CanvasRenderingContext2D) => {
  g.fillStyle = "#f6c9d8";
  g.fillRect(0, 0, 1024, 1400);
  g.fillStyle = "#3b1f5e";
  g.beginPath();
  g.arc(512, 360, 170, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#ff8a3d";
  g.beginPath();
  g.arc(512, 370, 90, Math.PI, 0);
  g.fill();
  g.fillStyle = "#fff1dc";
  g.fillRect(422, 370, 180, 70);
  g.textAlign = "center";
  g.fillStyle = "#3b1f5e";
  g.font = "900 130px Inter, sans-serif";
  g.fillText("KOPI", 512, 720);
  g.fillText("SENJA", 512, 850);
  g.font = "700 52px Inter, sans-serif";
  g.fillStyle = "#c2477a";
  g.fillText("Bubuk kopi robusta · 200 g", 512, 960);
  g.fillStyle = "#3b1f5e";
  g.fillRect(0, 1230, 1024, 170);
};
export const GayaHero: React.FC = () => {
  const label = useCanvasTex(1024, 1400, drawPouch);
  return (
    <AbsoluteFill style={{ background: pal.bg2, fontFamily: SANS }}>
      <Kicker pal={pal} x={70} y={100} w={940} align="center" at={-30} text="DESAIN KEMASAN" />
      <Txt x={70} y={180} w={940} at={-30} align="center" size={112} color={pal.line}>
        Nama produk|harus menonjol
      </Txt>
      <Studio bg={pal.bg2} top={420} height={1180} cam={[0, 0.4, 7.2]} fov={34}>
        <group rotation={[0.06, -0.42, 0.05]} position={[0, -0.2, 0]}>
          <RoundedBox args={[2.7, 3.6, 0.9]} radius={0.28} smoothness={10}>
            <Gloss color="#ffd6e6" />
          </RoundedBox>
          <mesh position={[0, -0.05, 0.52]}>
            <planeGeometry args={[2.3, 3.15]} />
            <meshPhysicalMaterial map={label} roughness={0.35} clearcoat={1} />
          </mesh>
          <RoundedBox args={[2.75, 0.22, 0.95]} radius={0.08} smoothness={6} position={[0, 1.9, 0]}>
            <Gloss color="#ffffff" />
          </RoundedBox>
        </group>
        <mesh position={[0, -2.25, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[2.4, 128]} />
          <Gloss color="#ffe9f1" />
        </mesh>
      </Studio>
      <Callout pal={pal} at={-30} tx={600} ty={1020} x={640} y={760} w={380} align="right" text="Nama terbaca dari 2 meter" />
      <Callout pal={pal} at={-30} tx={430} ty={1290} x={60} y={1420} w={420} text="Satu warna utama yang mencolok" />
      <Note pal={pal} y={1690} at={-30} text="*Kopi Senja hanya contoh merek fiktif." />
    </AbsoluteFill>
  );
};

// ============ 3. MEJA DESAINER DARI ATAS ============
const drawSketch = (g: CanvasRenderingContext2D) => {
  g.fillStyle = "#fffdf8";
  g.fillRect(0, 0, 1024, 720);
  g.strokeStyle = "#e9e1d6";
  g.lineWidth = 2;
  for (let y = 40; y < 720; y += 40) {
    g.beginPath();
    g.moveTo(0, y);
    g.lineTo(1024, y);
    g.stroke();
  }
  g.strokeStyle = "#3b1f5e";
  g.lineWidth = 6;
  g.lineCap = "round";
  [
    [250, 300, 130],
    [512, 300, 130],
    [774, 300, 130],
  ].forEach(([x, y, r], i) => {
    g.beginPath();
    g.arc(x, y, r, 0, Math.PI * 2);
    g.stroke();
    if (i === 2) {
      g.strokeStyle = "#e2678f";
      g.lineWidth = 10;
      g.beginPath();
      g.arc(x, y, r + 26, 0, Math.PI * 2);
      g.stroke();
      g.strokeStyle = "#3b1f5e";
      g.lineWidth = 6;
    }
    g.beginPath();
    g.arc(x, y + 10, r * 0.5, Math.PI, 0);
    g.stroke();
  });
  g.fillStyle = "#3b1f5e";
  g.font = "700 44px Inter, sans-serif";
  g.textAlign = "center";
  ["Ide 1", "Ide 2", "Pilih ini!"].forEach((t, i) => g.fillText(t, 250 + i * 262, 520));
};
const drawScreen = (g: CanvasRenderingContext2D) => {
  g.fillStyle = "#ffffff";
  g.fillRect(0, 0, 1024, 640);
  g.fillStyle = "#f3eef7";
  g.fillRect(0, 0, 180, 640);
  g.fillStyle = "#fde2ec";
  g.fillRect(260, 60, 680, 520);
  g.fillStyle = "#3b1f5e";
  g.beginPath();
  g.arc(600, 260, 110, 0, Math.PI * 2);
  g.fill();
  g.font = "900 64px Inter, sans-serif";
  g.textAlign = "center";
  g.fillText("KOPI SENJA", 600, 470);
};
export const GayaMeja: React.FC = () => {
  const sketch = useCanvasTex(1024, 720, drawSketch);
  const screen = useCanvasTex(1024, 640, drawScreen);
  return (
    <AbsoluteFill style={{ background: pal.bg2, fontFamily: SANS }}>
      <Studio bg={pal.bg2} top={0} height={1920} cam={[0, 13, 4.5]} fov={40}>
        <LookAt to={[0, 0, 0]} />
        {/* meja */}
        <RoundedBox args={[7.2, 0.3, 11.5]} radius={0.12} smoothness={8} position={[0, -0.2, 0.3]}>
          <Gloss color="#f2b6ca" solid rough={0.6} />
        </RoundedBox>
        {/* laptop */}
        <group position={[-0.9, 0.05, -2.6]} rotation={[0, 0.12, 0]}>
          <RoundedBox args={[3.4, 0.12, 2.3]} radius={0.08} smoothness={6}>
            <Gloss color="#6d6878" solid metal={0.4} rough={0.3} />
          </RoundedBox>
          <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[3.0, 1.88]} />
            <meshBasicMaterial map={screen} />
          </mesh>
        </group>
        {/* buku sketsa */}
        <group position={[1.1, 0.05, 1.0]} rotation={[0, -0.18, 0]}>
          <RoundedBox args={[3.2, 0.14, 2.3]} radius={0.06} smoothness={6}>
            <Gloss color="#fff4e8" solid rough={0.6} />
          </RoundedBox>
          <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[3.05, 2.15]} />
            <meshStandardMaterial map={sketch} roughness={0.9} />
          </mesh>
        </group>
        {/* kartu warna kaca */}
        {["#3b1f5e", "#ff8a3d", "#fff1dc", "#e2678f"].map((c, i) => (
          <RoundedBox key={c} args={[0.75, 0.08, 1.5]} radius={0.06} smoothness={6} position={[-2.3 + i * 0.25, 0.1 + i * 0.03, 3.6]} rotation={[0, 0.5 - i * 0.28, 0]}>
            <Gloss color={c} />
          </RoundedBox>
        ))}
        {/* cangkir kaca */}
        <group position={[2.4, 0.3, -1.9]}>
          <mesh>
            <cylinderGeometry args={[0.55, 0.48, 0.9, 64, 1, true]} />
            <Gloss color="#ffd6e6" />
          </mesh>
          <mesh position={[0, 0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.5, 64]} />
            <meshPhysicalMaterial color="#6b3a1e" clearcoat={1} roughness={0.1} />
          </mesh>
        </group>
        {/* pensil */}
        <group position={[2.0, 0.12, 3.4]} rotation={[0, 0.7, Math.PI / 2]}>
          <mesh>
            <cylinderGeometry args={[0.08, 0.08, 1.8, 32]} />
            <Gloss color={pal.accent} solid />
          </mesh>
        </group>
      </Studio>
      <div style={{ position: "absolute", left: 90, right: 90, top: 90, padding: "26px 30px", borderRadius: 36, background: "rgba(255,255,255,0.45)", backdropFilter: "blur(16px)", border: "1.5px solid rgba(255,255,255,0.8)", textAlign: "center" }}>
        <div style={{ fontWeight: 800, fontSize: 32, letterSpacing: 5, color: pal.accent }}>TIPS 1</div>
        <div style={{ fontWeight: 900, fontSize: 96, lineHeight: 1, letterSpacing: -3, color: pal.line, marginTop: 8 }}>Mulai dari sketsa</div>
      </div>
      {[
        { x: 70, y: 1180, r: -4, t: "Buat 3 ide, lalu pilih yang paling sederhana" },
        { x: 600, y: 1520, r: 3, t: "Pakai pensil dulu, baru ke aplikasi" },
      ].map((n) => (
        <div key={n.t} style={{ position: "absolute", left: n.x, top: n.y, width: 400, padding: "26px 28px", background: "#fff6a8", borderRadius: 10, boxShadow: "0 12px 26px rgba(74,34,56,0.18)", transform: `rotate(${n.r}deg)`, fontWeight: 700, fontSize: 38, lineHeight: 1.18, color: "#4A2238" }}>
          {n.t}
        </div>
      ))}
    </AbsoluteFill>
  );
};

// ============ 4. REALIS: produk UMKM di meja kayu ============
const FogTo: React.FC<{ color: string; near: number; far: number }> = ({ color, near, far }) => {
  const { scene } = useThree();
  useMemo(() => {
    scene.fog = new THREE.Fog(color, near, far);
  }, [scene, color, near, far]);
  return null;
};
export const GayaRealis: React.FC = () => {
  const L = useLabels();
  return (
    <AbsoluteFill style={{ background: pal.bg2, fontFamily: SANS }}>
      <Kicker pal={pal} x={70} y={100} w={940} align="center" at={-30} text="TIPS KEMASAN UMKM" />
      <Txt x={70} y={180} w={940} at={-30} align="center" size={112} color={pal.line}>
        Kemasan yang|bikin mampir
      </Txt>
      <Studio bg={pal.bg2} top={430} height={1490} cam={[0, 1.4, 10.5]} fov={32}>
        <FogTo color={pal.bg2} near={13} far={21} />
        <Table />
        <SoftShadow x={-0.2} z={0.1} w={2.6} d={1.3} o={0.55} />
        <SoftShadow x={1.3} z={1.2} w={1.9} d={1.4} o={0.5} />
        <SoftShadow x={-1.35} z={2.0} w={1.6} d={1.1} o={0.4} />
        <Pouch label={L.keripik} position={[-0.2, -0.05, 0]} rotation={[0, 0.18, 0]} />
        <Jar label={L.sambal} position={[1.3, -0.6, 1.2]} rotation={[0, -0.35, 0]} />
        <Sachet print={L.kopi} position={[-1.35, -1.32, 2.0]} rotation={[-Math.PI / 2 + 0.06, 0, 0.45]} />
      </Studio>
      <Callout pal={pal} at={-30} tx={470} ty={1140} x={60} y={640} w={380} text="Nama produk paling besar" />
      <Callout pal={pal} at={-30} tx={840} ty={1400} x={600} y={1600} w={420} align="right" text="Label melingkar, mudah dibaca" />
      <Note pal={pal} y={1800} at={-30} text="*Merek pada contoh ini fiktif." />
    </AbsoluteFill>
  );
};

// Versi 2: satu produk dekat (close-up), realis
export const GayaRealisDekat: React.FC = () => {
  const L = useLabels();
  return (
    <AbsoluteFill style={{ background: pal.bg2, fontFamily: SANS }}>
      <Kicker pal={pal} x={70} y={100} w={940} align="center" at={-30} text="TIPS KEMASAN UMKM" />
      <Txt x={70} y={180} w={940} at={-30} align="center" size={108} color={pal.line}>
        Tulis yang|penting saja
      </Txt>
      <Studio bg={pal.bg2} top={430} height={1490} cam={[0.4, 0.8, 6.4]} fov={32}>
        <FogTo color={pal.bg2} near={9} far={15} />
        <Table />
        <SoftShadow x={0} z={0} w={2.8} d={1.4} o={0.6} />
        <Pouch label={L.keripik} position={[0, -0.05, 0]} rotation={[0, 0.32, 0]} />
        <SoftShadow x={-1.9} z={-1.6} w={1.6} d={1.1} o={0.3} />
        <Jar label={L.sambal} position={[-1.9, -0.6, -1.6]} rotation={[0, 0.5, 0]} />
      </Studio>
      <Callout pal={pal} at={-30} tx={600} ty={1050} x={640} y={640} w={380} align="right" text="Nama usaha dan produk" />
      <Callout pal={pal} at={-30} tx={575} ty={1385} x={600} y={1560} w={420} align="right" text="Berat bersih yang jelas" />
      <Callout pal={pal} at={-30} tx={600} ty={1515} x={60} y={1660} w={420} text="Klaim singkat: tanpa pengawet, halal" />
      <Note pal={pal} y={1820} at={-30} text="*Merek pada contoh ini fiktif." />
    </AbsoluteFill>
  );
};

// Versi 3: di rak toko, sebelum dan sesudah
export const GayaRealisRak: React.FC = () => {
  const L = useLabels();
  return (
    <AbsoluteFill style={{ background: pal.bg2, fontFamily: SANS }}>
      <Kicker pal={pal} x={70} y={100} w={940} align="center" at={-30} text="DI RAK TOKO" />
      <Txt x={70} y={180} w={940} at={-30} align="center" size={108} color={pal.line}>
        Mana yang|kamu ambil?
      </Txt>
      <Studio bg={pal.bg2} top={430} height={1490} cam={[0, 0.9, 13]} fov={32}>
        <FogTo color={pal.bg2} near={16} far={24} />
        {/* rak kayu */}
        <RoundedBox args={[5.6, 0.18, 2.0]} radius={0.05} smoothness={4} position={[0, -1.5, 0]}>
          <meshPhysicalMaterial color="#b98256" roughness={0.6} clearcoat={0.3} />
        </RoundedBox>
        {[-1.25, 1.25].map((x, i) => (
          <group key={x}>
            <SoftShadow x={x} z={0} y={-1.4} w={2.4} d={1.2} o={0.5} />
            <Pouch label={i ? L.keripik : L.polos} labelScale={i ? 1 : 0.55} position={[x, -0.05, 0]} rotation={[0, i ? -0.15 : 0.15, 0]} />
          </group>
        ))}
      </Studio>
      <Txt x={80} y={1420} w={420} at={-30} align="center" size={40} weight={800} color={pal.line}>
        Sebelum: label kecil, pucat
      </Txt>
      <Txt x={580} y={1420} w={420} at={-30} align="center" size={40} weight={800} color={pal.accent}>
        Sesudah: nama jelas, warna kontras
      </Txt>
      <Note pal={pal} y={1820} at={-30} text="*Merek pada contoh ini fiktif." />
    </AbsoluteFill>
  );
};

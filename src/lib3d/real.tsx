import React, { useMemo } from "react";
import * as THREE from "three";

// Aset realis KATA DESAIN: produk UMKM sehari-hari (pouch kraft, toples sambal, sachet kopi),
// meja kayu, dan bayangan lembut. Semua tekstur dibuat prosedural (tanpa unduhan).

let seed = 11;
const rnd = () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

const canvasTex = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, srgb = true) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d")!);
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
};

// ---------- tekstur ----------
const kraft = (g: CanvasRenderingContext2D, w: number, h: number, base = "#a8774b") => {
  g.fillStyle = base;
  g.fillRect(0, 0, w, h);
  for (let i = 0; i < 2600; i++) {
    const x = rnd() * w, y = rnd() * h, l = 4 + rnd() * 18, a = rnd() * Math.PI;
    g.strokeStyle = `rgba(${rnd() > 0.5 ? "90,60,30" : "235,205,170"},${0.06 + rnd() * 0.12})`;
    g.lineWidth = 1;
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l);
    g.stroke();
  }
  for (let i = 0; i < 900; i++) {
    g.fillStyle = `rgba(60,35,15,${rnd() * 0.25})`;
    g.fillRect(rnd() * w, rnd() * h, 1.5, 1.5);
  }
};
const noiseBump = (g: CanvasRenderingContext2D, w: number, h: number) => {
  g.fillStyle = "#808080";
  g.fillRect(0, 0, w, h);
  for (let i = 0; i < 5000; i++) {
    const v = Math.floor(100 + rnd() * 60);
    g.fillStyle = `rgba(${v},${v},${v},0.5)`;
    g.fillRect(rnd() * w, rnd() * h, 2 + rnd() * 3, 1 + rnd() * 2);
  }
};

// ---------- meja kayu yang memudar ke latar ----------
export const Table: React.FC<{ y?: number; tint?: string }> = ({ y = -1.4, tint = "#d9a77c" }) => {
  const tex = useMemo(
    () =>
      canvasTex(1024, 1024, (g) => {
        g.fillStyle = tint;
        g.fillRect(0, 0, 1024, 1024);
        for (let p = 0; p < 6; p++) {
          const y0 = p * 170;
          g.fillStyle = `rgba(120,70,35,${0.05 + (p % 2) * 0.05})`;
          g.fillRect(0, y0, 1024, 166);
          g.fillStyle = "rgba(90,50,25,0.35)";
          g.fillRect(0, y0 + 166, 1024, 4);
          for (let i = 0; i < 40; i++) {
            const yy = y0 + rnd() * 166;
            g.strokeStyle = `rgba(110,65,30,${0.08 + rnd() * 0.12})`;
            g.lineWidth = 1 + rnd() * 2;
            g.beginPath();
            g.moveTo(0, yy);
            for (let x = 0; x <= 1024; x += 32) g.lineTo(x, yy + Math.sin(x / (60 + rnd() * 40) + i) * 3);
            g.stroke();
          }
        }
      }),
    [tint],
  );
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  return (
    <mesh position={[0, y, -2]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshPhysicalMaterial map={tex} roughness={0.55} clearcoat={0.35} clearcoatRoughness={0.4} />
    </mesh>
  );
};

/** Bayangan kontak lembut (gradasi radial) di bawah benda. */
export const SoftShadow: React.FC<{ x: number; z: number; y?: number; w: number; d: number; o?: number }> = ({ x, z, y = -1.39, w, d, o = 0.5 }) => {
  const tex = useMemo(
    () =>
      canvasTex(256, 256, (g) => {
        const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
        gr.addColorStop(0, "rgba(40,20,10,0.9)");
        gr.addColorStop(0.5, "rgba(40,20,10,0.35)");
        gr.addColorStop(1, "rgba(40,20,10,0)");
        g.fillStyle = gr;
        g.fillRect(0, 0, 256, 256);
      }),
    [],
  );
  return (
    <mesh position={[x, y, z]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[w, d]} />
      <meshBasicMaterial map={tex} transparent opacity={o} depthWrite={false} />
    </mesh>
  );
};

// ---------- standing pouch kraft ----------
const pouchGeo = (w: number, h: number, d: number) => {
  const g = new THREE.BoxGeometry(w, h, d, 48, 72, 12);
  const p = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const nx = (2 * x) / w, ny = y / (h / 2);
    const side = Math.sqrt(Math.max(0, 1 - Math.pow(Math.abs(nx), 3)));
    const top = ny > 0.82 ? 0.06 : ny > 0.62 ? THREE.MathUtils.lerp(1, 0.06, (ny - 0.62) / 0.2) : 1;
    const bottom = ny < -0.85 ? 1.15 : 1;
    p.setZ(i, z * Math.max(0.05, side * top * bottom));
    p.setX(i, x * (ny < -0.85 ? 1.02 : 1));
  }
  g.computeVertexNormals();
  return g;
};
export const Pouch: React.FC<{ label: THREE.Texture; w?: number; h?: number; labelScale?: number } & React.JSX.IntrinsicElements["group"]> = ({ label, w = 1.9, h = 2.7, labelScale = 1, ...gp }) => {
  const geo = useMemo(() => pouchGeo(w, h, 0.62), [w, h]);
  const mats = useMemo(() => {
    const map = canvasTex(1024, 1024, (g) => kraft(g, 1024, 1024));
    const bump = canvasTex(512, 512, (g) => noiseBump(g, 512, 512), false);
    return { map, bump };
  }, []);
  return (
    <group {...gp}>
      <mesh geometry={geo} castShadow>
        <meshPhysicalMaterial map={mats.map} bumpMap={mats.bump} bumpScale={0.6} roughness={0.85} sheen={0.3} sheenColor="#fff3e0" />
      </mesh>
      {/* garis segel & ritsleting */}
      {[h / 2 - 0.12, h / 2 - 0.42].map((y, i) => (
        <mesh key={y} position={[0, y, 0.03 + i * 0.03]}>
          <boxGeometry args={[w * 0.98, i ? 0.05 : 0.16, 0.02]} />
          <meshStandardMaterial color={i ? "#a77b52" : "#b98a5e"} roughness={0.9} />
        </mesh>
      ))}
      {/* stiker label */}
      <mesh position={[0, -0.15, 0.315]}>
        <planeGeometry args={[w * 0.72 * labelScale, w * 0.72 * 1.15 * labelScale]} />
        <meshPhysicalMaterial map={label} roughness={0.35} clearcoat={0.6} transparent />
      </mesh>
    </group>
  );
};

// ---------- toples kaca sambal ----------
export const Jar: React.FC<{ label: THREE.Texture; isi?: string } & React.JSX.IntrinsicElements["group"]> = ({ label, isi = "#b5281c", ...gp }) => {
  const glassGeo = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    pts.push(new THREE.Vector2(0.0, -0.8), new THREE.Vector2(0.6, -0.8), new THREE.Vector2(0.68, -0.72));
    for (let i = 0; i <= 10; i++) pts.push(new THREE.Vector2(0.7, -0.7 + i * 0.12));
    pts.push(new THREE.Vector2(0.66, 0.58), new THREE.Vector2(0.58, 0.68), new THREE.Vector2(0.58, 0.82));
    return new THREE.LatheGeometry(pts, 96);
  }, []);
  const sambal = useMemo(
    () =>
      canvasTex(512, 512, (g) => {
        g.fillStyle = isi;
        g.fillRect(0, 0, 512, 512);
        for (let i = 0; i < 1400; i++) {
          g.fillStyle = rnd() > 0.7 ? "rgba(250,200,120,0.6)" : `rgba(${80 + rnd() * 80},${30 + rnd() * 30},10,0.5)`;
          g.beginPath();
          g.arc(rnd() * 512, rnd() * 512, 1 + rnd() * 4, 0, 7);
          g.fill();
        }
      }),
    [isi],
  );
  return (
    <group {...gp}>
      <mesh position={[0, -0.18, 0]}>
        <cylinderGeometry args={[0.65, 0.63, 1.15, 64]} />
        <meshPhysicalMaterial map={sambal} roughness={0.35} clearcoat={0.8} />
      </mesh>
      <mesh geometry={glassGeo} castShadow>
        <meshPhysicalMaterial color="#ffffff" roughness={0.03} transmission={0.96} thickness={0.25} ior={1.5} clearcoat={1} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.715, 0.715, 0.62, 96, 1, true, -1.1, 2.2]} />
        <meshPhysicalMaterial map={label} roughness={0.4} clearcoat={0.5} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.92, 0]}>
        <cylinderGeometry args={[0.64, 0.64, 0.26, 96]} />
        <meshPhysicalMaterial color="#d8b04a" metalness={0.85} roughness={0.28} clearcoat={0.6} />
      </mesh>
      {Array.from({ length: 5 }, (_, i) => (
        <mesh key={i} position={[0, 0.82 + i * 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.645, 0.008, 8, 96]} />
          <meshStandardMaterial color="#b8902e" metalness={0.9} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
};

// ---------- sachet kopi ----------
const sachetGeo = (w: number, h: number) => {
  const g = new THREE.BoxGeometry(w, h, 0.16, 40, 56, 4);
  const p = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const nx = (2 * x) / w, ny = (2 * y) / h;
    const e = Math.min(1, (1 - Math.abs(nx)) * 8) * Math.min(1, (1 - Math.abs(ny)) * 7);
    p.setZ(i, z * Math.max(0.08, e));
  }
  g.computeVertexNormals();
  return g;
};
export const Sachet: React.FC<{ print: THREE.Texture } & React.JSX.IntrinsicElements["group"]> = ({ print, ...gp }) => {
  const geo = useMemo(() => sachetGeo(1.1, 1.6), []);
  return (
    <group {...gp}>
      <mesh geometry={geo} castShadow>
        <meshPhysicalMaterial map={print} metalness={0.35} roughness={0.28} clearcoat={1} clearcoatRoughness={0.15} />
      </mesh>
    </group>
  );
};

export const useLabels = () =>
  useMemo(() => {
    const keripik = canvasTex(720, 828, (g) => {
      g.fillStyle = "#fffaf0";
      g.beginPath();
      g.roundRect(0, 0, 720, 828, 60);
      g.fill();
      g.fillStyle = "#2f6b3a";
      g.beginPath();
      g.roundRect(30, 30, 660, 280, 40);
      g.fill();
      g.fillStyle = "#fffaf0";
      g.textAlign = "center";
      g.font = "900 120px Inter, sans-serif";
      g.fillText("KERIPIK", 360, 170);
      g.font = "800 96px Inter, sans-serif";
      g.fillText("MBOK SARI", 360, 275);
      g.fillStyle = "#2f6b3a";
      g.font = "700 54px Inter, sans-serif";
      g.fillText("Singkong Pedas Manis", 360, 400);
      g.fillStyle = "#e46b2c";
      g.beginPath();
      g.arc(360, 560, 110, 0, 7);
      g.fill();
      g.fillStyle = "#fff";
      g.font = "900 60px Inter, sans-serif";
      g.fillText("100 g", 360, 580);
      g.fillStyle = "#6b5b4a";
      g.font = "600 38px Inter, sans-serif";
      g.fillText("Tanpa pengawet · Halal", 360, 740);
    });
    const sambal = canvasTex(1024, 360, (g) => {
      g.fillStyle = "#fff4e2";
      g.fillRect(0, 0, 1024, 360);
      g.fillStyle = "#1d1d1d";
      g.fillRect(0, 0, 1024, 40);
      g.fillRect(0, 320, 1024, 40);
      g.textAlign = "center";
      g.fillStyle = "#b5281c";
      g.font = "900 120px Inter, sans-serif";
      g.fillText("SAMBAL BU RINI", 512, 190);
      g.fillStyle = "#1d1d1d";
      g.font = "700 50px Inter, sans-serif";
      g.fillText("Bawang Pedas · 150 g", 512, 270);
    });
    const kopi = canvasTex(660, 960, (g) => {
      const gr = g.createLinearGradient(0, 0, 0, 960);
      gr.addColorStop(0, "#3a2416");
      gr.addColorStop(1, "#1f130b");
      g.fillStyle = gr;
      g.fillRect(0, 0, 660, 960);
      g.fillStyle = "rgba(255,255,255,0.12)";
      for (let x = 0; x < 660; x += 14) {
        g.fillRect(x, 0, 6, 40);
        g.fillRect(x, 920, 6, 40);
      }
      g.textAlign = "center";
      g.fillStyle = "#f2c46d";
      g.font = "900 110px Inter, sans-serif";
      g.fillText("KOPI", 330, 360);
      g.fillText("SENJA", 330, 470);
      g.fillStyle = "#f7e9d3";
      g.font = "600 44px Inter, sans-serif";
      g.fillText("Kopi susu gula aren", 330, 570);
      g.fillStyle = "#f2c46d";
      g.beginPath();
      g.arc(330, 720, 70, Math.PI, 0);
      g.fill();
    });
    // label polos (contoh kemasan yang kurang menonjol)
    const polos = canvasTex(720, 828, (g) => {
      g.fillStyle = "#ffffff";
      g.beginPath();
      g.roundRect(0, 0, 720, 828, 30);
      g.fill();
      g.textAlign = "center";
      g.fillStyle = "#7a7a7a";
      g.font = "500 54px Inter, sans-serif";
      g.fillText("keripik singkong", 360, 380);
      g.font = "400 40px Inter, sans-serif";
      g.fillText("pedas manis", 360, 450);
    });
    return { keripik, sambal, kopi, polos };
  }, []);

// ---------- aset tambahan kehidupan sehari-hari ----------
export const Mug: React.FC<{ color?: string } & React.JSX.IntrinsicElements["group"]> = ({ color = "#f4efe9", ...gp }) => {
  const geo = useMemo(() => {
    const pts = [new THREE.Vector2(0, -0.5), new THREE.Vector2(0.48, -0.5), new THREE.Vector2(0.52, -0.45), new THREE.Vector2(0.55, 0.5), new THREE.Vector2(0.5, 0.5), new THREE.Vector2(0.47, -0.42), new THREE.Vector2(0, -0.42)];
    return new THREE.LatheGeometry(pts, 80);
  }, []);
  return (
    <group {...gp}>
      <mesh geometry={geo} castShadow>
        <meshPhysicalMaterial color={color} roughness={0.3} clearcoat={0.8} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0.6, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <torusGeometry args={[0.22, 0.06, 24, 48, Math.PI]} />
        <meshPhysicalMaterial color={color} roughness={0.3} clearcoat={0.8} />
      </mesh>
      <mesh position={[0, 0.38, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.49, 64]} />
        <meshPhysicalMaterial color="#5a3420" roughness={0.1} clearcoat={1} />
      </mesh>
    </group>
  );
};

/** Kardus paket online yang terbuka. */
export const Kardus: React.FC<React.JSX.IntrinsicElements["group"]> = (gp) => {
  const tex = useMemo(() => canvasTex(512, 512, (g) => kraft(g, 512, 512, "#c79a68")), []);
  const m = <meshPhysicalMaterial map={tex} roughness={0.9} side={THREE.DoubleSide} />;
  const W = 3.2, D = 2.2, H = 1.3, t = 0.04;
  return (
    <group {...gp}>
      <mesh position={[0, -H / 2, 0]}>
        <boxGeometry args={[W, t, D]} />
        {m}
      </mesh>
      {[
        [0, 0, D / 2, W, H, t],
        [0, 0, -D / 2, W, H, t],
        [W / 2, 0, 0, t, H, D],
        [-W / 2, 0, 0, t, H, D],
      ].map(([x, y, z, w, h, d], i) => (
        <mesh key={i} position={[x, y, z]}>
          <boxGeometry args={[w, h, d]} />
          {m}
        </mesh>
      ))}
      {/* tutup terbuka */}
      <mesh position={[0, H / 2 + 0.5, D / 2 + 0.25]} rotation={[-0.5, 0, 0]}>
        <boxGeometry args={[W, 1.1, t]} />
        {m}
      </mesh>
      <mesh position={[0, H / 2 + 0.45, -D / 2 - 0.3]} rotation={[0.6, 0, 0]}>
        <boxGeometry args={[W, 1.1, t]} />
        {m}
      </mesh>
      {/* plastik gelembung */}
      {Array.from({ length: 60 }, (_, i) => (
        <mesh key={i} position={[-1.4 + (i % 10) * 0.31, H / 2 - 0.05 + (i % 3) * 0.02, -0.9 + Math.floor(i / 10) * 0.33]}>
          <sphereGeometry args={[0.13, 20, 14]} />
          <meshPhysicalMaterial color="#ffffff" transmission={0.9} roughness={0.05} thickness={0.1} transparent opacity={0.85} />
        </mesh>
      ))}
    </group>
  );
};

/** Ponsel dengan tampilan layar dari kanvas. */
export const Phone: React.FC<{ screen: THREE.Texture } & React.JSX.IntrinsicElements["group"]> = ({ screen, ...gp }) => (
  <group {...gp}>
    <mesh>
      <boxGeometry args={[1.5, 3.1, 0.14]} />
      <meshPhysicalMaterial color="#1c1a22" roughness={0.2} metalness={0.5} clearcoat={1} />
    </mesh>
    <mesh position={[0, 0, 0.075]}>
      <planeGeometry args={[1.38, 2.98]} />
      <meshBasicMaterial map={screen} toneMapped={false} />
    </mesh>
  </group>
);

/** Talenan kayu dan mangkuk (meja produksi rumahan). */
export const Talenan: React.FC<React.JSX.IntrinsicElements["group"]> = (gp) => (
  <group {...gp}>
    <mesh>
      <cylinderGeometry args={[1.3, 1.3, 0.12, 96]} />
      <meshPhysicalMaterial color="#c58b52" roughness={0.6} clearcoat={0.2} />
    </mesh>
  </group>
);
export const Mangkuk: React.FC<{ isi?: string } & React.JSX.IntrinsicElements["group"]> = ({ isi = "#e7b34a", ...gp }) => {
  const geo = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    for (let i = 0; i <= 16; i++) {
      const a = (i / 16) * (Math.PI / 2);
      pts.push(new THREE.Vector2(Math.sin(a) * 0.8, -Math.cos(a) * 0.45 + 0.1));
    }
    return new THREE.LatheGeometry(pts, 80);
  }, []);
  return (
    <group {...gp}>
      <mesh geometry={geo}>
        <meshPhysicalMaterial color="#f5f0ea" roughness={0.25} clearcoat={1} side={THREE.DoubleSide} />
      </mesh>
      {Array.from({ length: 26 }, (_, i) => (
        <mesh key={i} position={[Math.cos(i * 2.4) * 0.45 * ((i % 5) / 5 + 0.3), 0.02 + (i % 3) * 0.04, Math.sin(i * 2.4) * 0.45 * ((i % 5) / 5 + 0.3)]} rotation={[i, i * 0.7, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.02, 24]} />
          <meshStandardMaterial color={isi} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
};

/** Taplak bermotif (lapak bazar). */
export const Taplak: React.FC<{ y?: number; c1?: string; c2?: string }> = ({ y = -1.4, c1 = "#f7efe2", c2 = "#d9826b" }) => {
  const tex = useMemo(
    () =>
      canvasTex(512, 512, (g) => {
        g.fillStyle = c1;
        g.fillRect(0, 0, 512, 512);
        g.fillStyle = c2;
        for (let y0 = 0; y0 < 512; y0 += 64)
          for (let x0 = 0; x0 < 512; x0 += 64) {
            g.beginPath();
            g.arc(x0 + 32 + ((y0 / 64) % 2) * 32, y0 + 32, 12, 0, 7);
            g.fill();
          }
      }),
    [c1, c2],
  );
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(6, 6);
  return (
    <mesh position={[0, y, -2]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[20, 20]} />
      <meshPhysicalMaterial map={tex} roughness={0.95} sheen={0.5} sheenColor="#ffffff" />
    </mesh>
  );
};

/** Cahaya jendela pagi yang jatuh di meja (tempelan cahaya). */
export const CahayaJendela: React.FC<{ y?: number; x?: number; z?: number; s?: number }> = ({ y = -1.385, x = 0.6, z = 0.4, s = 1 }) => {
  const tex = useMemo(
    () =>
      canvasTex(512, 512, (g) => {
        g.clearRect(0, 0, 512, 512);
        g.fillStyle = "rgba(255,236,190,0.32)";
        for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) g.fillRect(40 + i * 230, 40 + j * 230, 200, 200);
        g.filter = "blur(10px)";
        g.drawImage(g.canvas, 0, 0);
      }),
    [],
  );
  return (
    <mesh position={[x, y, z]} rotation={[-Math.PI / 2, 0, 0.5]} scale={s}>
      <planeGeometry args={[4.5, 4.5]} />
      <meshBasicMaterial map={tex} transparent blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
    </mesh>
  );
};

export const useLabels2 = () =>
  useMemo(() => {
    const kue = canvasTex(1024, 360, (g) => {
      g.fillStyle = "#fdf3e7";
      g.fillRect(0, 0, 1024, 360);
      g.textAlign = "center";
      g.fillStyle = "#8a4b2a";
      g.font = "900 110px Inter, sans-serif";
      g.fillText("KUE MAMA LIA", 512, 180);
      g.font = "700 50px Inter, sans-serif";
      g.fillText("Nastar Keju · 250 g", 512, 260);
    });
    const market = canvasTex(552, 1192, (g) => {
      g.fillStyle = "#ffffff";
      g.fillRect(0, 0, 552, 1192);
      g.fillStyle = "#f3f3f3";
      g.fillRect(0, 0, 552, 120);
      g.fillStyle = "#ee6c4d";
      g.fillRect(0, 0, 552, 90);
      g.fillStyle = "#fff";
      g.font = "700 34px Inter, sans-serif";
      g.fillText("Cari di toko...", 30, 58);
      const card = (x: number, y: number, good: boolean) => {
        g.fillStyle = "#fafafa";
        g.fillRect(x, y, 240, 430);
        g.fillStyle = good ? "#2f6b3a" : "#d9d4cc";
        g.fillRect(x + 20, y + 20, 200, 220);
        g.fillStyle = good ? "#fffaf0" : "#9a948a";
        g.font = good ? "900 44px Inter, sans-serif" : "500 26px Inter, sans-serif";
        g.textAlign = "center";
        g.fillText(good ? "KERIPIK" : "keripik", x + 120, y + 130);
        if (good) g.fillText("MBOK SARI", x + 120, y + 180);
        g.textAlign = "left";
        g.fillStyle = "#333";
        g.font = "600 26px Inter, sans-serif";
        g.fillText(good ? "Keripik Mbok Sari" : "Keripik singkong", x + 14, y + 290);
        g.fillStyle = "#ee6c4d";
        g.font = "800 30px Inter, sans-serif";
        g.fillText("Rp15.000", x + 14, y + 340);
      };
      card(24, 160, false);
      card(288, 160, true);
      card(24, 620, true);
      card(288, 620, false);
    });
    return { kue, market };
  }, []);

/** Keping keripik berserakan di meja. */
export const KepingKeripik: React.FC<{ n?: number; spread?: [number, number]; y?: number } & React.JSX.IntrinsicElements["group"]> = ({ n = 14, spread = [2.4, 1.2], y = -1.36, ...gp }) => {
  const geo = useMemo(() => {
    const g = new THREE.CircleGeometry(0.16, 28);
    const p = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), yy = p.getY(i);
      p.setZ(i, (x * x + yy * yy) * 1.6 + Math.sin(x * 20) * 0.006);
    }
    g.computeVertexNormals();
    return g;
  }, []);
  return (
    <group {...gp}>
      {Array.from({ length: n }, (_, i) => {
        const a = i * 2.39;
        const r = 0.3 + ((i * 37) % 10) / 10;
        return (
          <mesh key={i} geometry={geo} position={[Math.cos(a) * r * spread[0] * 0.5, y + (i % 3) * 0.015, Math.sin(a) * r * spread[1] * 0.5]} rotation={[-Math.PI / 2 + ((i % 5) - 2) * 0.15, (i % 7) * 0.4, i]} scale={0.8 + (i % 4) * 0.15}>
            <meshPhysicalMaterial color={i % 3 ? "#e9b44c" : "#d9902f"} roughness={0.45} clearcoat={0.5} side={THREE.DoubleSide} />
          </mesh>
        );
      })}
    </group>
  );
};

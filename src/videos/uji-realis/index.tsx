import React, { useMemo } from "react";
import { AbsoluteFill, Html5Audio, staticFile, useCurrentFrame } from "remotion";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { DepthOfField, EffectComposer, ToneMapping } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { Studio } from "../../lib3d/kit";
import { Bullets, Card, Headline, InfoChip, Meter, Note, Pill, Sticker } from "../../lib3d/layout";
import { tonePal } from "../../lib3d/tones";
import { Jar, KepingKeripik, Marker, Pouch, SoftShadow, Table, useLabels } from "../../lib3d/real";
import { ease } from "../../lib/ui";
import { Pal, SANS } from "../../lib/base";
import "../../lib3d/fonts";
import timeline from "./timeline.json";

// Video uji gaya realis (opsi 2: close-up satu produk) — satu "dunia", kamera bergerak terus.
// Latar berganti warna lembut per adegan (adegan "sesudah" sengaja lebih kuat).
const TL = timeline;
const S = TL.scenes;
type Id = keyof typeof S;
const at = (id: Id, k: number) => S[id].from + S[id].beats[k];

const PAL: Record<Id, Pal> = {
  hook: tonePal("pink", 1),
  s1: tonePal("persik", 1),
  s2: { bg1: "#F7A8C4", bg2: "#F391B4", accent: "#FFFFFF", accent2: "#7A1F47", line: "#3A1026", fill: "rgba(255,255,255,0.7)" },
  closing: tonePal("lavender", 1),
};
const ORDER: Id[] = ["hook", "s1", "s2", "closing"];
const bgAt = (f: number) => {
  let c = new THREE.Color(PAL.hook.bg2);
  for (const id of ORDER.slice(1)) {
    const t = ease(f, S[id].from - 6, S[id].from + 10);
    if (t > 0) c = c.clone().lerp(new THREE.Color(PAL[id].bg2), t);
  }
  return c;
};

type V3 = [number, number, number];
const KEYS: { f: number; pos: V3; look: V3 }[] = [
  { f: 0, pos: [1.4, 2.6, 14], look: [0, 1.0, 0] },
  { f: S.hook.to - 10, pos: [0.8, 1.4, 10.5], look: [0, 0.45, 0] },
  { f: S.s1.from + 30, pos: [0.4, 0.6, 8.9], look: [0, 0.25, 0] },
  { f: S.s2.from, pos: [0.2, 0.6, 8.8], look: [0, 0.25, 0] },
  { f: S.s2.to - 25, pos: [-0.4, 0.6, 8.9], look: [0, 0.25, 0] },
  { f: S.closing.from + 20, pos: [0.9, 2.0, 12], look: [0, 0.75, 0] },
  { f: TL.total, pos: [1.0, 2.1, 12.6], look: [0, 0.75, 0] },
];
const camAt = (f: number) => {
  let i = 0;
  while (i < KEYS.length - 2 && f > KEYS[i + 1].f) i++;
  const a = KEYS[i], b = KEYS[i + 1];
  const t = ease(f, a.f, b.f);
  const L = (p: V3, q: V3) => p.map((v, k) => v + (q[k] - v) * t) as V3;
  return { pos: L(a.pos, b.pos), look: L(a.look, b.look) };
};

const Rig: React.FC = () => {
  const f = useCurrentFrame();
  const { camera, scene } = useThree();
  useMemo(() => {
    scene.fog = new THREE.Fog(PAL.hook.bg2, 15, 26);
  }, [scene]);
  const { pos, look } = camAt(f);
  camera.position.set(...pos);
  camera.lookAt(new THREE.Vector3(...look));
  const bg = bgAt(f);
  scene.background = bg;
  if (scene.fog) (scene.fog as THREE.Fog).color = bg;
  return null;
};

const World: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLabels();
  const swap = ease(f, S.s2.from + 6, S.s2.from + 22);
  const pop = f > S.s2.from + 22 ? Math.sin((f - S.s2.from - 22) * 0.5) * Math.max(0, 1 - (f - S.s2.from - 22) / 18) * 0.06 : 0;
  const w = 1.9;
  const cp = camAt(f).pos;
  const focus = Math.hypot(cp[0], cp[1] + 0.05, cp[2]);
  const show = (from: number, to: number) => ease(f, from, from + 10) * (1 - ease(f, to - 8, to));
  return (
    <>
      <Rig />
      <Table />
      <SoftShadow x={0} z={0} w={2.8} d={1.4} o={0.6} />
      <group rotation={[0, 0.12, 0]} position={[0, -0.05, 0]}>
        <Pouch label={L.polos} labelScale={0.55} />
        <mesh position={[0, -0.15, 0.322]} scale={(0.6 + 0.4 * swap) * (1 + pop)}>
          <planeGeometry args={[w * 0.72, w * 0.72 * 1.15]} />
          <meshPhysicalMaterial map={L.keripik} roughness={0.35} clearcoat={0.6} transparent opacity={swap} />
        </mesh>
        {swap > 0 && swap < 1 &&
          Array.from({ length: 14 }, (_, i) => {
            const a = (i / 14) * Math.PI * 2;
            const r = 0.6 + swap * 0.9;
            return (
              <mesh key={i} position={[Math.cos(a) * r, -0.15 + Math.sin(a) * r, 0.4]} scale={0.04 * (1 - swap)}>
                <sphereGeometry args={[1, 16, 12]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
            );
          })}
        {/* titik bernomor pada produk */}
        <Marker n={1} color="#e0503c" p={show(at("s1", 1), S.s1.to)} position={[0.32, -0.12, 0.42]} />
        <Marker n={2} color="#e0503c" p={show(at("s1", 2), S.s1.to)} position={[0.78, 0.55, 0.32]} />
        <Marker n={1} color="#2f9e5a" p={show(at("s2", 1), S.s2.to)} position={[0.62, 0.32, 0.42]} />
        <Marker n={2} color="#2f9e5a" p={show(at("s2", 2), S.s2.to)} position={[0.42, -0.43, 0.42]} />
      </group>
      {/* aset pendukung: keripik di depan (buram) dan toples di belakang (buram) */}
      <KepingKeripik position={[0.9, 0, 2.6]} n={16} />
      <SoftShadow x={-2.1} z={-2.4} w={1.6} d={1.1} o={0.3} />
      <Jar label={L.sambal} position={[-2.1, -0.6, -2.4]} rotation={[0, 0.5, 0]} />
      <Jar label={L.sambal} position={[2.6, -0.6, -3.4]} rotation={[0, -0.5, 0]} />
      <EffectComposer multisampling={4}>
        <DepthOfField worldFocusDistance={focus} worldFocusRange={2.2} bokehScale={4} height={960} />
        <ToneMapping mode={ToneMappingMode.NEUTRAL} />
      </EffectComposer>
    </>
  );
};

export const Video: React.FC = () => {
  const f = useCurrentFrame();
  const inS = (id: Id) => f >= S[id].from - 4 && f < S[id].to + 6;
  const bg = "#" + bgAt(f).getHexString();
  return (
    <AbsoluteFill style={{ background: bg, fontFamily: SANS }}>
      <Studio top={0} height={1920} cam={[1.4, 2.6, 14]} fov={32}>
        <World />
      </Studio>
      {inS("hook") && (
        <>
          <Headline pal={PAL.hook} y={110} at={4} text="Kenapa *dilewati?*" out={S.hook.to - 10} />
          <Sticker x={700} y={330} at={30} text="Rp15.000" bg="#ffd84d" color="#3a2a12" rot={8} out={S.hook.to - 10} />
          <Card pal={PAL.hook} x={70} y={1600} w={940} at={at("hook", 1)} title="FAKTA DI RAK" text="Pembeli cuma melirik sebentar. Label harus menang di detik pertama." />
        </>
      )}
      {inS("s1") && (
        <>
          <Headline pal={PAL.s1} y={110} at={S.s1.from + 4} text="Label _pucat_" out={S.s1.to - 8} />
          <Sticker x={70} y={330} at={S.s1.from + 10} text="SEBELUM" bg="#e0503c" rot={-7} out={S.s1.to - 8} />
          <Meter pal={PAL.s1} x={520} y={310} w={490} at={S.s1.from + 18} label="Terbaca dari jauh" value={2} out={S.s1.to - 8} />
          <InfoChip pal={{ ...PAL.s1, accent: "#e0503c" }} x={40} y={1620} w={490} at={at("s1", 1)} n={1} text="Nama produk kecil" out={S.s1.to - 8} />
          <InfoChip pal={{ ...PAL.s1, accent: "#e0503c" }} x={550} y={1620} w={490} at={at("s1", 2)} n={2} text="Warna tenggelam" out={S.s1.to - 8} />
        </>
      )}
      {inS("s2") && (
        <>
          <Headline pal={PAL.s2} y={110} at={S.s2.from + 4} text="Nama ~besar~" out={S.s2.to - 8} />
          <Sticker x={70} y={330} at={S.s2.from + 10} text="SESUDAH" bg="#2f9e5a" rot={-7} out={S.s2.to - 8} />
          <Meter pal={PAL.s2} x={520} y={310} w={490} at={S.s2.from + 18} label="Terbaca dari jauh" value={9} good out={S.s2.to - 8} />
          <InfoChip pal={{ ...PAL.s2, accent: "#2f9e5a" }} x={40} y={1620} w={490} at={at("s2", 1)} n={1} text="Nama besar dan kontras" out={S.s2.to - 8} />
          <InfoChip pal={{ ...PAL.s2, accent: "#2f9e5a" }} x={550} y={1620} w={490} at={at("s2", 2)} n={2} text="Berat bersih jelas" out={S.s2.to - 8} />
        </>
      )}
      {f >= S.closing.from - 4 && (
        <>
          <Headline pal={PAL.closing} y={110} at={S.closing.from} text="Langsung *terbaca*" size={120} />
          <Bullets
            pal={PAL.closing}
            x={190}
            y={300}
            w={760}
            marker="check"
            size={42}
            items={[
              { at: S.closing.from + 14, text: "Nama produk paling besar" },
              { at: S.closing.from + 22, text: "Warna kontras dengan kemasan" },
              { at: S.closing.from + 30, text: "Berat bersih jelas" },
            ]}
          />
          <Pill pal={PAL.closing} x={70} y={1640} w={940} at={S.closing.from + 36} text="Simpan tips ini" />
          <Note pal={PAL.closing} y={1780} at={S.closing.from + 40} text="*Keripik Mbok Sari dan Sambal Bu Rini hanya contoh merek fiktif." />
        </>
      )}
      <Html5Audio src={staticFile("uji-realis/audio.mp3")} />
    </AbsoluteFill>
  );
};

export const meta = { id: "uji-realis", fps: TL.fps, total: TL.total };

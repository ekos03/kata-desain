import React, { useMemo } from "react";
import { AbsoluteFill, Html5Audio, staticFile, useCurrentFrame } from "remotion";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { Studio } from "../../lib3d/kit";
import { Callout, Kicker, Note, Pill, Txt } from "../../lib3d/layout";
import { tonePal } from "../../lib3d/tones";
import { Jar, Pouch, SoftShadow, Table, useLabels } from "../../lib3d/real";
import { ease } from "../../lib/ui";
import { SANS } from "../../lib/base";
import timeline from "./timeline.json";

// Video uji gaya realis (opsi 2: close-up satu produk) — satu "dunia", kamera bergerak terus.
const TL = timeline;
const S = TL.scenes;
const pal = tonePal("pink", 1);
const at = (id: keyof typeof S, k: number) => S[id].from + S[id].beats[k];

type V3 = [number, number, number];
const KEYS: { f: number; pos: V3; look: V3 }[] = [
  { f: 0, pos: [1.4, 2.4, 12], look: [0, 0.9, 0] },
  { f: S.hook.to - 10, pos: [0.8, 1.4, 8.6], look: [0, 0.7, 0] },
  { f: S.s1.from + 30, pos: [0.35, 0.7, 6.4], look: [0, 0.6, 0] },
  { f: S.s2.from, pos: [0.15, 0.7, 6.3], look: [0, 0.6, 0] },
  { f: S.s2.to - 25, pos: [-0.35, 0.7, 6.4], look: [0, 0.6, 0] },
  { f: S.closing.from + 20, pos: [0.9, 2.2, 11], look: [0, 0.9, 0] },
  { f: TL.total, pos: [1.0, 2.3, 11.6], look: [0, 0.9, 0] },
];
const camAt = (f: number) => {
  let i = 0;
  while (i < KEYS.length - 2 && f > KEYS[i + 1].f) i++;
  const a = KEYS[i], b = KEYS[i + 1];
  const t = ease(f, a.f, b.f);
  const L = (p: V3, q: V3) => p.map((v, k) => v + (q[k] - v) * t) as V3;
  return { pos: L(a.pos, b.pos), look: L(a.look, b.look) };
};
const CamRig: React.FC = () => {
  const f = useCurrentFrame();
  const { camera } = useThree();
  const { pos, look } = camAt(f);
  camera.position.set(...pos);
  camera.lookAt(new THREE.Vector3(...look));
  return null;
};
const FogTo: React.FC = () => {
  const { scene } = useThree();
  useMemo(() => {
    scene.fog = new THREE.Fog(pal.bg2, 14, 23);
  }, [scene]);
  return null;
};

const World: React.FC = () => {
  const f = useCurrentFrame();
  const L = useLabels();
  const swap = ease(f, S.s2.from + 6, S.s2.from + 22);
  const pop = f > S.s2.from + 22 ? Math.sin((f - S.s2.from - 22) * 0.5) * Math.max(0, 1 - (f - S.s2.from - 22) / 18) * 0.06 : 0;
  const w = 1.9;
  return (
    <>
      <CamRig />
      <FogTo />
      <Table />
      <SoftShadow x={0} z={0} w={2.8} d={1.4} o={0.6} />
      <group rotation={[0, 0.12, 0]} position={[0, -0.05, 0]}>
        <Pouch label={L.polos} labelScale={0.55} />
        {/* label baru menimpa label lama */}
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
      </group>
      <SoftShadow x={-1.9} z={-1.6} w={1.6} d={1.1} o={0.3} />
      <Jar label={L.sambal} position={[-1.9, -0.6, -1.6]} rotation={[0, 0.5, 0]} />
    </>
  );
};

export const Video: React.FC = () => {
  const f = useCurrentFrame();
  const inS = (id: keyof typeof S) => f >= S[id].from - 4 && f < S[id].to + 6;
  return (
    <AbsoluteFill style={{ background: pal.bg2, fontFamily: SANS }}>
      <Studio bg={pal.bg2} top={0} height={1920} cam={[1.2, 1.9, 10]} fov={32}>
        <World />
      </Studio>
      {inS("hook") && (
        <>
          <Kicker pal={pal} x={70} y={110} w={940} align="center" at={4} text="TIPS KEMASAN UMKM" />
          <Txt x={70} y={190} w={940} at={8} align="center" size={118} color={pal.line} anim="words" out={S.hook.to - 10}>
            Kenapa dilewati|pembeli?
          </Txt>
        </>
      )}
      {inS("s1") && (
        <>
          <Kicker pal={pal} x={70} y={110} w={940} align="center" at={S.s1.from + 2} text="SEBELUM" />
          <Txt x={70} y={190} w={940} at={S.s1.from + 6} align="center" size={112} color={pal.line} anim="up" out={S.s1.to - 8}>
            Label kecil|dan pucat
          </Txt>
          <Callout pal={pal} at={at("s1", 1)} out={S.s1.to - 8} tx={545} ty={1340} x={60} y={1660} w={420} text="Nama produk tidak terlihat" />
          <Callout pal={pal} at={at("s1", 2)} out={S.s1.to - 8} tx={780} ty={1180} x={600} y={560} w={420} align="right" text="Warna pucat, tenggelam di kertas kraft" />
        </>
      )}
      {inS("s2") && (
        <>
          <Kicker pal={pal} x={70} y={110} w={940} align="center" at={S.s2.from + 2} text="SESUDAH" />
          <Txt x={70} y={190} w={940} at={S.s2.from + 6} align="center" size={112} color={pal.line} anim="scale" out={S.s2.to - 8}>
            Nama besar,|langsung terbaca
          </Txt>
          <Callout pal={pal} at={at("s2", 1)} out={S.s2.to - 8} tx={560} ty={1110} x={600} y={560} w={420} align="right" text="Nama besar, warna kontras" />
          <Callout pal={pal} at={at("s2", 2)} out={S.s2.to - 8} tx={540} ty={1496} x={60} y={1760} w={420} text="Berat bersih jelas" />
        </>
      )}
      {f >= S.closing.from - 4 && (
        <>
          <Txt x={70} y={170} w={940} at={S.closing.from} align="center" size={104} color={pal.line} anim="words">
            Sekali lirik,|langsung terbaca
          </Txt>
          <Pill pal={pal} x={70} y={1700} w={940} at={S.closing.from + 20} text="Simpan tips ini" />
          <Note pal={pal} y={1815} at={S.closing.from + 30} text="*Keripik Mbok Sari dan Sambal Bu Rini hanya contoh merek fiktif." />
        </>
      )}
      <Html5Audio src={staticFile("uji-realis/audio.mp3")} />
    </AbsoluteFill>
  );
};

export const meta = { id: "uji-realis", fps: TL.fps, total: TL.total };

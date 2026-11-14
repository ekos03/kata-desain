import React, { useMemo } from "react";
import { useCurrentFrame } from "remotion";
import * as THREE from "three";
import { Text3D, Center } from "@react-three/drei";
import { SANS } from "../../lib/base";
import { ease, lerp } from "../../lib/ui";
import { Cup, Emblem, Gloss, mix, RoundedBox, Studio, toMono } from "../../lib3d/kit";
import { BigNum, Bullets, Callout, Card, Kicker, Note, Pill, Txt } from "../../lib3d/layout";
import helvB from "../../lib3d/fonts/helvetiker_bold.typeface.json";
import helvR from "../../lib3d/fonts/helvetiker_regular.typeface.json";
import gentB from "../../lib3d/fonts/gentilis_bold.typeface.json";
import optR from "../../lib3d/fonts/optimer_regular.typeface.json";
import { PAL, scene } from "./theme";

type Font = React.ComponentProps<typeof Text3D>["font"];
const F = { helvB, helvR, gentB, optR } as unknown as Record<string, Font>;

const bob = (f: number, k = 1) => Math.sin(f / 22) * 0.06 * k;

// Elemen-elemen logo "ramai"
const BUSY = Array.from({ length: 22 }, (_, i) => {
  const a = (i / 22) * Math.PI * 2;
  const r = 0.55 + (i % 3) * 0.28;
  return {
    x: Math.cos(a) * r,
    y: Math.sin(a) * r,
    kind: i % 3,
    color: ["#ff5a8a", "#5cc8ff", "#c5e86c", "#f6c453", "#a898ff", "#4fe0c8"][i % 6],
    s: 0.12 + (i % 4) * 0.03,
  };
});

const BusyBits: React.FC<{ spread?: number; fade?: number; spin?: number }> = ({ spread = 1, fade = 1, spin = 0 }) => (
  <group rotation={[0, 0, spin]}>
    {BUSY.map((b, i) => (
      <mesh key={i} position={[b.x * spread, b.y * spread, 0.2 + (i % 2) * 0.1]} rotation={[spin * 2 + i, spin + i, 0]} scale={b.s * fade}>
        {b.kind === 0 && <octahedronGeometry args={[1, 3]} />}
        {b.kind === 1 && <sphereGeometry args={[1, 48, 32]} />}
        {b.kind === 2 && <torusGeometry args={[1, 0.35, 24, 64]} />}
        <Gloss color={b.color} opacity={Math.max(0.001, fade)} />
      </mesh>
    ))}
  </group>
);

const Word3D: React.FC<{ text: string; font: Font; size: number; color: string; opacity?: number } & React.JSX.IntrinsicElements["group"]> = ({
  text,
  font,
  size,
  color,
  opacity = 1,
  ...g
}) => (
  <group {...g}>
    <Center>
      <Text3D font={font} size={size} height={size * 0.28} curveSegments={24} bevelEnabled bevelSize={size * 0.025} bevelThickness={size * 0.03} bevelSegments={6} letterSpacing={size * 0.04}>
        {text}
        <Gloss color={color} opacity={opacity} />
      </Text3D>
    </Center>
  </group>
);

// ================= HOOK: judul rata tengah =================
export const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const S = scene("hook");
  const pal = PAL.hook;
  const [, b1, b2] = S.beats;
  const gone = ease(f, b1, b1 + 25);
  const fly = ease(f, b2 - 30, b2);
  const squash = f > b2 ? Math.sin((f - b2) * 0.6) * Math.max(0, 1 - (f - b2) / 20) * 0.18 : 0;
  const big = ease(f, 14, 32);
  return (
    <>
      <Kicker pal={pal} x={70} y={110} w={940} align="center" at={2} text="TIPS LOGO UMKM" />
      <Txt x={70} y={200} w={940} at={8} align="center" size={124} color={pal.line} anim="words">
        Logo yang
      </Txt>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 330,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 240,
          lineHeight: 1,
          letterSpacing: -10,
          background: `linear-gradient(90deg, ${pal.accent}, ${pal.accent2})`,
          WebkitBackgroundClip: "text",
          color: "transparent",
          opacity: big,
          transform: `scale(${1.25 - 0.25 * big})`,
        }}
      >
        NEMPEL
      </div>
      <Txt x={70} y={590} w={940} at={30} align="center" size={50} weight={700} color={pal.line} anim="fade">
        di kepala pembeli
      </Txt>
      <Studio top={660} height={980} cam={[0, 0.4, 7]}>
        <Cup position={[0.3, -0.7, 0]} rotation={[0.15, -0.5 + f / 120, 0]} scale={1.5} />
        {gone < 1 && (
          <mesh position={[0.3, -0.6, 1.4]} scale={0.55 * (1 - gone)}>
            <sphereGeometry args={[1, 48, 32]} />
            <Gloss color="#9a8f99" rough={0.6} opacity={1 - gone} />
          </mesh>
        )}
        <Emblem
          position={[lerp(fly, 3.2, 0.3), lerp(fly, 2.6, -0.5) + bob(f), lerp(fly, 0, 1.65)]}
          rotation={[0, lerp(fly, Math.PI * 3, 0) - 0.25, lerp(fly, 0.6, 0)]}
          scale={[0.62 * (1 + squash), 0.62 * (1 - squash), 0.62]}
        />
      </Studio>
      <Callout pal={pal} at={b1 - 30} out={b1 + 5} tx={600} ty={1300} x={80} y={1150} w={330} text="Logo biasa, mudah terlupa" />
      <Callout pal={pal} at={b2 + 8} tx={760} ty={1180} x={660} y={960} w={360} align="right" text="Logo contoh: Kopi Senja" />
      <Pill pal={pal} x={70} y={1640} w={940} at={b2 + 14} text="5 tips untuk usahamu" />
    </>
  );
};

// ================= MASALAH: teks miring kanan atas + keterangan menunjuk =================
export const Masalah: React.FC = () => {
  const f = useCurrentFrame();
  const S = scene("masalah");
  const pal = PAL.masalah;
  const [, b1, b2] = S.beats;
  const far = ease(f, b1, b1 + 35);
  const prod = ease(f, b2 - 50, b2 - 15);
  return (
    <>
      <Txt x={60} y={130} w={960} at={4} align="right" size={150} color={pal.accent} rot={-4} anim="right">
        Terlalu ramai?
      </Txt>
      <Txt x={70} y={500} w={620} at={14} size={46} weight={700} color={pal.line} lh={1.15}>
        Logo yang penuh hiasan susah dikenali dari jauh.
      </Txt>
      <Studio top={600} height={900} cam={[0, 0.2, 8]}>
        <group position={[lerp(prod, 0, -1.4), lerp(far, 0.3, 1.2), lerp(far, 0, -6)]} rotation={[0, Math.sin(f / 30) * 0.3, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[1.45, 1.45, 0.2, 128]} />
            <Gloss color="#5b4a63" />
          </mesh>
          <BusyBits spin={f / 40} />
        </group>
        {prod > 0 && (
          <group position={[1.35, lerp(prod, -4, -0.6), 0.5]} scale={0.8} rotation={[0.1, -0.5 + f / 90, 0]}>
            <RoundedBox args={[1.9, 2.6, 1.2]} radius={0.12} smoothness={6}>
              <Gloss color="#d8ab7e" rough={0.5} />
            </RoundedBox>
            <Emblem scale={0.35} position={[0, 0.5, 0.65]} />
          </group>
        )}
      </Studio>
      <Callout pal={pal} at={18} out={b1 - 5} tx={650} ty={960} x={690} y={760} w={330} align="right" text="Terlalu banyak warna" />
      <Callout pal={pal} at={30} out={b1 - 5} tx={430} ty={1170} x={70} y={1330} w={360} text="Hiasan kecil-kecil" />
      <Txt x={70} y={1300} w={940} at={b1 + 25} out={b2 - 55} align="center" size={56} color={pal.line} anim="scale">
        Dari jauh: tidak terbaca
      </Txt>
      <Card pal={pal} x={70} y={1500} w={940} at={b2 - 40} title="AKIBATNYA" text="Pembeli cuma ingat produknya, bukan nama usahamu." />
    </>
  );
};

// ================= S1: angka raksasa kanan, poin di kiri bawah =================
export const S1: React.FC = () => {
  const f = useCurrentFrame();
  const S = scene("s1");
  const pal = PAL.s1;
  const [, b1, b2] = S.beats;
  const burst = ease(f, b1 - 10, b1 + 30);
  const draw = ease(f, b2, b2 + 60);
  const curve = useMemo(() => new THREE.EllipseCurve(0, 0, 1.45, 1.45, Math.PI / 2, Math.PI * 2.5, false, 0), []);
  const tube = useMemo(() => {
    const pts = curve.getPoints(200).map((p) => new THREE.Vector3(p.x, p.y, 0.3));
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 400, 0.045, 16, false);
  }, [curve]);
  const tip = curve.getPoint(draw);
  const cnt = Math.floor(draw * 400) * 16 * 6;
  tube.setDrawRange(0, cnt);
  return (
    <>
      <BigNum pal={pal} x={568} y={90} at={2} n="1" size={340} align="right" />
      <Kicker pal={pal} x={70} y={130} at={4} text="TIPS 1" />
      <Txt x={70} y={220} w={620} at={8} size={112} color={pal.line} anim="words">
        Bentuk sederhana
      </Txt>
      <Studio top={500} height={900} cam={[0, 0, 8]}>
        <group rotation={[0, Math.sin(f / 35) * 0.35, 0]} position={[0, bob(f), 0]}>
          <Emblem scale={1.1} />
          {burst < 1 && <BusyBits spread={1 + burst * 3} fade={1 - burst} spin={f / 30} />}
          {draw > 0 && (
            <mesh geometry={tube} scale={1.1}>
              <meshPhysicalMaterial color="#ffffff" emissive={pal.accent} emissiveIntensity={1.0} />
            </mesh>
          )}
        </group>
        {draw > 0 && draw < 1 && (
          <group position={[tip.x * 1.1, tip.y * 1.1, 0.9]} rotation={[0, 0, -0.6]}>
            <mesh position={[0, 0.55, 0]}>
              <cylinderGeometry args={[0.09, 0.09, 1.0, 32]} />
              <Gloss color={pal.accent} />
            </mesh>
            <mesh position={[0, -0.03, 0]} rotation={[Math.PI, 0, 0]}>
              <coneGeometry args={[0.09, 0.18, 32]} />
              <Gloss color="#f2d2a9" />
            </mesh>
          </group>
        )}
      </Studio>
      <Bullets
        pal={pal}
        x={70}
        y={1380}
        w={940}
        items={[
          { at: b1 + 8, text: "Satu bentuk utama sudah cukup" },
          { at: b2 + 5, text: "Hindari detail kecil yang hilang saat dicetak" },
          { at: b2 + 45, text: "Uji: bisa digambar ulang dalam beberapa detik?" },
        ]}
      />
    </>
  );
};

// ================= S2: judul rata kanan, tiga benda, kartu cara cek =================
const ITEMS = [
  { label: "Foto profil", x: -2.0 },
  { label: "Stiker", x: 0 },
  { label: "Label kemasan", x: 2.0 },
];
export const S2: React.FC = () => {
  const f = useCurrentFrame();
  const S = scene("s2");
  const pal = PAL.s2;
  const [, b1, b2] = S.beats;
  const shrink = ease(f, b1 - 10, b1 + 20);
  return (
    <>
      <Kicker pal={pal} x={70} y={120} w={940} align="right" at={2} text="TIPS 2" />
      <Txt x={70} y={200} w={940} at={6} align="right" size={112} color={pal.line} anim="left">
        Cek di ukuran kecil
      </Txt>
      <Txt x={300} y={440} w={710} at={16} align="right" size={44} weight={600} color={pal.accent} lh={1.2}>
        Logo yang bagus tetap jelas walau sekecil apa pun.
      </Txt>
      <Studio top={560} height={800} cam={[0, 0.3, 8.5]}>
        {shrink < 1 && <Emblem scale={lerp(shrink, 1.4, 0.2)} opacity={1 - shrink} rotation={[0, f / 40, 0]} />}
        {ITEMS.map((it, i) => {
          const p = ease(f, b1 + 5 + i * 18, b1 + 30 + i * 18);
          if (p <= 0) return null;
          const y = lerp(p, -3, -0.2) + bob(f + i * 20);
          return (
            <group key={it.label} position={[it.x, y, 0]} rotation={[0.05, Math.sin(f / 30 + i) * 0.25, 0]} scale={p * 0.85}>
              {i === 0 && (
                <>
                  <RoundedBox args={[1.5, 2.9, 0.14]} radius={0.12} smoothness={6}>
                    <Gloss color="#2a2230" rough={0.15} metal={0.3} />
                  </RoundedBox>
                  <mesh position={[0, 0, 0.075]}>
                    <planeGeometry args={[1.32, 2.65]} />
                    <meshStandardMaterial color="#fffafc" />
                  </mesh>
                  <Emblem scale={0.3} position={[-0.32, 0.95, 0.12]} />
                  {[0.45, 0.15, -0.15].map((yy) => (
                    <mesh key={yy} position={[0.15, 0.95 + yy - 0.45, 0.09]}>
                      <planeGeometry args={[0.6 - Math.abs(yy) * 0.4, 0.08]} />
                      <meshStandardMaterial color="#e8d3dd" />
                    </mesh>
                  ))}
                </>
              )}
              {i === 1 && (
                <>
                  <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.8, 0.8, 0.05, 96]} />
                    <Gloss color="#ffffff" rough={0.4} />
                  </mesh>
                  <Emblem scale={0.6} position={[0, 0, 0.05]} />
                </>
              )}
              {i === 2 && (
                <>
                  <RoundedBox args={[1.6, 2.2, 1.0]} radius={0.1} smoothness={6}>
                    <Gloss color="#d8ab7e" rough={0.55} />
                  </RoundedBox>
                  <Emblem scale={0.42} position={[0, 0.3, 0.55]} />
                </>
              )}
            </group>
          );
        })}
      </Studio>
      {ITEMS.map((it, i) => (
        <Txt key={it.label} x={540 + it.x * 171 - 170} y={1270} w={340} at={b1 + 25 + i * 18} align="center" size={36} weight={800} color={pal.line}>
          {it.label}
        </Txt>
      ))}
      <Card pal={pal} x={70} y={1420} w={940} at={b2 - 45} rot={-1.5} title="CARA CEK" text="Kecilkan logo seukuran ujung jempol. Masih terbaca? Berarti aman." />
    </>
  );
};

// ================= S3: judul tengah, angka besar kiri bawah =================
const CHIPS = ["#3b1f5e", "#ff8a3d", "#fff1dc", "#5cc8ff", "#c5e86c", "#ff5a8a", "#4fe0c8", "#a898ff"];
export const S3: React.FC = () => {
  const f = useCurrentFrame();
  const S = scene("s3");
  const pal = PAL.s3;
  const [, b1, b2] = S.beats;
  const drop = ease(f, b1, b1 + 30);
  const mono = ease(f, b2 - 25, b2 + 5);
  return (
    <>
      <Kicker pal={pal} x={70} y={110} w={940} align="center" at={2} text="TIPS 3" />
      <Txt x={70} y={190} w={940} at={6} align="center" size={120} color={pal.line} anim="scale">
        Batasi warna
      </Txt>
      <Studio top={380} height={1000} cam={[0, 0.2, 8.5]}>
        <Emblem scale={1.0} position={[0, -0.9, 0]} rotation={[0, Math.sin(f / 30) * 0.35, 0]} mono={mono} />
        {CHIPS.map((c, i) => {
          const keep = i < 3;
          const p = ease(f, 6 + i * 4, 26 + i * 4);
          const x = keep ? lerp(drop, -2.45 + i * 0.7, -0.85 + i * 0.85) : -2.45 + i * 0.7;
          const y = keep ? 1.9 : 1.9 - drop * 4;
          return (
            <group key={c} position={[x, y + bob(f + i * 9), 0]} rotation={[0.3, f / 25 + i, keep ? 0 : drop * 2]} scale={p * (keep ? lerp(drop, 0.9, 1.2) : 0.9)}>
              <RoundedBox args={[0.55, 0.55, 0.55]} radius={0.12} smoothness={6}>
                <Gloss color={toMono(c, mono)} opacity={keep ? 1 : Math.max(0.001, 1 - drop)} />
              </RoundedBox>
            </group>
          );
        })}
      </Studio>
      <Callout pal={pal} at={b2 - 8} tx={440} ty={1130} x={70} y={1250} w={420} text="Hitam putih tetap jelas, cocok untuk stempel dan fotokopi" />
      <Txt x={70} y={1420} w={520} at={b1 + 20} size={190} color={pal.accent} anim="left">
        2–3
      </Txt>
      <Txt x={520} y={1450} w={490} at={b1 + 28} size={44} weight={700} color={pal.line} lh={1.15}>
        warna sudah cukup, lebih mudah diingat dan lebih hemat saat dicetak
      </Txt>
    </>
  );
};

// ================= S4: kiri atas, keterangan ke huruf 3D, poin bawah =================
const LETTERS = "SENJA".split("");
const MESSY: { font: string; rot: number; s: number; dy: number }[] = [
  { font: "gentB", rot: 0.5, s: 1.3, dy: 0.3 },
  { font: "optR", rot: -0.4, s: 0.8, dy: -0.25 },
  { font: "helvR", rot: 0.3, s: 1.15, dy: 0.2 },
  { font: "gentB", rot: -0.6, s: 0.9, dy: -0.3 },
  { font: "optR", rot: 0.45, s: 1.25, dy: 0.15 },
];
export const S4: React.FC = () => {
  const f = useCurrentFrame();
  const S = scene("s4");
  const pal = PAL.s4;
  const [, b1, b2] = S.beats;
  const tidyUp = ease(f, b1 - 15, b1 + 15);
  const second = ease(f, b2 - 25, b2 + 5);
  return (
    <>
      <BigNum pal={pal} x={50} y={90} at={2} n="4" size={300} />
      <Txt x={330} y={150} w={690} at={6} size={100} color={pal.line} anim="words">
        Huruf mudah dibaca
      </Txt>
      <Studio top={540} height={760} cam={[0, 0.1, 8]}>
        <group rotation={[0, Math.sin(f / 40) * 0.25, 0]} position={[0, 0.7 + bob(f), 0]}>
          {tidyUp < 1 &&
            LETTERS.map((ch, i) => {
              const m = MESSY[i];
              return (
                <Word3D key={i} text={ch} font={F[m.font]} size={0.75 * m.s} color={CHIPS[(i + 3) % CHIPS.length]} opacity={1 - tidyUp} position={[-2.0 + i * 1.0, m.dy, 0]} rotation={[0, 0, m.rot]} />
              );
            })}
          {tidyUp > 0 && <Word3D text="SENJA" font={F.helvB} size={0.85} color="#B83E6E" opacity={tidyUp} scale={lerp(tidyUp, 0.85, 1)} />}
        </group>
        {second > 0 && <Word3D text="KOPI" font={F.helvR} size={0.5} color="#5b3550" opacity={second} position={[0, lerp(second, -1.6, -0.9), 0]} />}
      </Studio>
      <Callout pal={pal} at={b1 + 8} tx={835} ty={820} x={600} y={560} w={420} align="right" text="Nama usaha: huruf tebal" />
      <Callout pal={pal} at={b2} tx={640} ty={1060} x={600} y={1150} w={420} align="right" text="Pelengkap: huruf biasa" />
      <Bullets
        pal={pal}
        x={70}
        y={1330}
        w={940}
        marker="check"
        items={[
          { at: b1 + 20, text: "Hindari huruf sambung yang rumit" },
          { at: b2 + 5, text: "Maksimal dua jenis huruf" },
        ]}
      />
    </>
  );
};

// ================= S5: tengah, perbandingan, kartu ide =================
export const S5: React.FC = () => {
  const f = useCurrentFrame();
  const S = scene("s5");
  const pal = PAL.s5;
  const [, b1, b2] = S.beats;
  const rise = ease(f, b1 - 15, b1 + 15);
  const stamp = ease(f, b2 - 12, b2);
  const sink = ease(f, b2 + 10, b2 + 35);
  return (
    <>
      <Kicker pal={pal} x={70} y={110} w={940} align="center" at={2} text="TIPS 5" />
      <Txt x={70} y={190} w={940} at={6} align="center" size={116} color={pal.line} anim="words">
        Punya ciri khas
      </Txt>
      <Studio top={430} height={860} cam={[0, 0.2, 8.5]}>
        <group position={[-1.7, lerp(sink, 0, -0.6), 0]} scale={lerp(sink, 1, 0.8)} rotation={[0, Math.sin(f / 30) * 0.3, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[1.0, 1.0, 0.2, 96]} />
            <Gloss color={mix("#8d8494", "#6a6270", sink)} />
          </mesh>
          <mesh position={[0, 0, 0.2]} rotation={[0, 0, Math.PI / 2]}>
            <octahedronGeometry args={[0.55, 0]} />
            <Gloss color="#b8b0c0" />
          </mesh>
        </group>
        {stamp > 0 && (
          <group position={[-1.7, 0, lerp(stamp, 3, 0.6)]} scale={lerp(stamp, 1.6, 1)}>
            {[1, -1].map((s) => (
              <RoundedBox key={s} args={[2.2, 0.32, 0.25]} radius={0.12} smoothness={6} rotation={[0, 0, s * 0.785]}>
                <Gloss color="#e8505b" />
              </RoundedBox>
            ))}
          </group>
        )}
        <Emblem scale={lerp(rise, 0.3, 1.0)} position={[1.6, lerp(rise, -3, 0) + bob(f), 0]} rotation={[0, lerp(rise, Math.PI * 2, 0) + Math.sin(f / 28) * 0.3, 0]} />
        {rise > 0 &&
          Array.from({ length: 10 }, (_, i) => {
            const a = (i / 10) * Math.PI * 2 + f / 30;
            const r = 1.55 + Math.sin(f / 10 + i) * 0.1;
            return (
              <mesh key={i} position={[1.6 + Math.cos(a) * r, Math.sin(a) * r, 0.3]} scale={0.06 * rise}>
                <sphereGeometry args={[1, 24, 16]} />
                <meshPhysicalMaterial color="#fff" emissive={pal.accent} emissiveIntensity={1.5} />
              </mesh>
            );
          })}
      </Studio>
      <Txt x={110} y={1170} w={320} at={10} align="center" size={38} weight={800} color={pal.line}>
        Tiruan
      </Txt>
      <Txt x={650} y={1170} w={320} at={b1} align="center" size={38} weight={800} color={pal.accent}>
        Ciri khasmu
      </Txt>
      <Card pal={pal} x={70} y={1300} w={940} at={b2 + 5} title="IDE CIRI KHAS" text="Ambil dari cerita usahamu: bahan, asal daerah, atau nama pemilik." />
      <Note pal={pal} y={1560} at={b2 + 15} text="Meniru logo merek lain bisa melanggar hak merek." />
    </>
  );
};

// ================= OUTRO: tengah, daftar cek, ajakan =================
export const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const S = scene("outro");
  const pal = PAL.outro;
  const [, b1, b2] = S.beats;
  const spin = f / 50;
  return (
    <>
      <Txt x={70} y={150} w={940} at={4} align="center" size={124} color={pal.line} anim="words">
        Satu logo, di mana saja
      </Txt>
      <Studio top={470} height={900} cam={[0, 1.8, 10]}>
        <group rotation={[0, spin, 0]} position={[0, -0.5, 0]}>
          {[0, 1, 2].map((i) => {
            const a = (i / 3) * Math.PI * 2;
            const p = ease(f, b1 + i * 12, b1 + 25 + i * 12);
            return (
              <group key={i} position={[Math.sin(a) * 2.3, 0, Math.cos(a) * 2.3]} rotation={[0, a, 0]} scale={p}>
                {i === 0 && (
                  <>
                    <RoundedBox args={[1.6, 2.2, 1.0]} radius={0.1} smoothness={6}>
                      <Gloss color="#d8ab7e" rough={0.55} />
                    </RoundedBox>
                    <Emblem scale={0.42} position={[0, 0.3, 0.55]} />
                  </>
                )}
                {i === 1 && (
                  <>
                    {[-1.3, 1.3].map((x) => (
                      <mesh key={x} position={[x, -0.4, 0]}>
                        <cylinderGeometry args={[0.05, 0.05, 2.6, 16]} />
                        <Gloss color="#d9d2ea" metal={0.8} />
                      </mesh>
                    ))}
                    <RoundedBox args={[2.8, 1.4, 0.06]} radius={0.03} smoothness={4} position={[0, 0.5, 0]}>
                      <Gloss color="#3b1f5e" />
                    </RoundedBox>
                    <Emblem scale={0.48} position={[-0.8, 0.5, 0.08]} />
                    <Word3D text="KOPI SENJA" font={F.helvB} size={0.19} color="#f6c453" position={[0.55, 0.5, 0.06]} />
                  </>
                )}
                {i === 2 && (
                  <>
                    <RoundedBox args={[1.3, 2.5, 0.14]} radius={0.12} smoothness={6}>
                      <Gloss color="#2a2230" rough={0.15} metal={0.3} />
                    </RoundedBox>
                    <mesh position={[0, 0, 0.075]}>
                      <planeGeometry args={[1.14, 2.3]} />
                      <meshStandardMaterial color="#fffafc" />
                    </mesh>
                    <Emblem scale={0.38} position={[0, 0.4, 0.12]} />
                  </>
                )}
              </group>
            );
          })}
        </group>
        <mesh position={[0, -1.85, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[3.6, 128]} />
          <Gloss color="#ffffff" rough={0.35} />
        </mesh>
      </Studio>
      <Bullets
        pal={pal}
        x={200}
        y={1310}
        w={700}
        marker="check"
        size={40}
        items={[
          { at: b1 + 10, text: "Kemasan" },
          { at: b1 + 22, text: "Spanduk" },
          { at: b1 + 34, text: "Media sosial" },
        ]}
      />
      <Pill pal={pal} x={70} y={1590} w={940} at={b2 - 5} text="Minta file asli logonya" />
      <Note pal={pal} y={1700} at={b2 + 5} text="*Logo Kopi Senja hanya contoh. File asli = file vektor, bisa diperbesar tanpa pecah." />
    </>
  );
};



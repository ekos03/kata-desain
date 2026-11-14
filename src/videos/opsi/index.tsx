import React, { useMemo } from "react";
import { AbsoluteFill } from "remotion";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { RoundedBox, Studio } from "../../lib3d/kit";
import { Callout, Card, Kicker, Note, Pill, Txt } from "../../lib3d/layout";
import { tonePal } from "../../lib3d/tones";
import { CahayaJendela, Jar, Kardus, Mangkuk, Mug, Phone, Pouch, Sachet, SoftShadow, Table, Talenan, Taplak, useLabels, useLabels2 } from "../../lib3d/real";
import { Pal, SANS } from "../../lib/base";

// 10 opsi gaya realis KATA DESAIN (hasil rapat Irena, Arya, Bima). Opsi 1–3 ada di ../gaya.
const FogTo: React.FC<{ color: string; near: number; far: number }> = ({ color, near, far }) => {
  const { scene } = useThree();
  useMemo(() => {
    scene.fog = new THREE.Fog(color, near, far);
  }, [scene, color, near, far]);
  return null;
};

const Frame: React.FC<{
  pal: Pal;
  kicker: string;
  title: string;
  cam: [number, number, number];
  fog?: [number, number];
  children: React.ReactNode;
  overlay?: React.ReactNode;
}> = ({ pal, kicker, title, cam, fog = [12, 20], children, overlay }) => (
  <AbsoluteFill style={{ background: pal.bg2, fontFamily: SANS }}>
    <Studio bg={pal.bg2} top={430} height={1490} cam={cam} fov={32}>
      <FogTo color={pal.bg2} near={fog[0]} far={fog[1]} />
      {children}
    </Studio>
    <Kicker pal={pal} x={70} y={100} w={940} align="center" at={-30} text={kicker} />
    <Txt x={70} y={180} w={940} at={-30} align="center" size={106} color={pal.line}>
      {title}
    </Txt>
    {overlay}
    <Note pal={pal} y={1830} at={-30} text="*Merek pada contoh ini fiktif." />
  </AbsoluteFill>
);

// Opsi 4 — rak warung bertingkat (oranye)
export const Opsi4: React.FC = () => {
  const pal = tonePal("oranye", 1);
  const L = useLabels();
  const L2 = useLabels2();
  return (
    <Frame
      pal={pal}
      kicker="DI RAK WARUNG"
      title="Yang terbaca|duluan dilirik"
      cam={[0, 0.2, 17]}
      fog={[20, 30]}
      overlay={
        <>
          <Callout pal={pal} at={-30} tx={545} ty={1470} x={600} y={1250} w={420} align="right" text="Hanya ini yang terbaca" />
          <Card pal={pal} x={70} y={1660} w={940} at={-30} title="CARA CEK" text="Foto produkmu di rak toko, lalu lihat dari jauh." />
        </>
      }
    >
      {[-1.6, 1.0].map((y) => (
        <RoundedBox key={y} args={[7.5, 0.14, 2]} radius={0.05} smoothness={4} position={[0, y - 1.45, 0]}>
          <meshPhysicalMaterial color="#b98256" roughness={0.6} />
        </RoundedBox>
      ))}
      {[-2.6, -1.3, 0, 1.3, 2.6].map((x, i) => (
        <Pouch key={x} label={i === 2 ? L.keripik : L.polos} labelScale={i === 2 ? 1 : 0.6} w={1.15} h={1.7} position={[x, -2.15, 0]} />
      ))}
      {[-2.4, -0.8, 0.8, 2.4].map((x, i) => (
        <Jar key={x} label={i === 1 ? L.sambal : L2.kue} isi={i === 1 ? "#b5281c" : "#d9a25a"} position={[x, 0.7, 0]} scale={0.8} />
      ))}
    </Frame>
  );
};

// Opsi 5 — dapur rumahan (persik)
export const Opsi5: React.FC = () => {
  const pal = tonePal("persik", 1);
  const L = useLabels();
  return (
    <Frame
      pal={pal}
      kicker="DARI DAPUR"
      title="Dari dapur|ke etalase"
      cam={[0, 2.2, 10]}
      overlay={<Callout pal={pal} at={-30} tx={800} ty={1120} x={60} y={1600} w={520} text="Kemasan rapi bikin dagangan rumahan terlihat profesional" />}
    >
      <Table tint="#e3b48a" />
      <SoftShadow x={-1.3} z={0.8} w={3} d={2.4} o={0.4} />
      <Talenan position={[-1.3, -1.32, 0.8]} />
      <Mangkuk position={[-1.3, -1.0, 0.8]} />
      <SoftShadow x={1.1} z={-0.2} w={2.4} d={1.2} o={0.5} />
      <Pouch label={L.keripik} position={[1.1, -0.05, -0.2]} rotation={[0, -0.25, 0]} />
      <Mug position={[2.6, -0.9, 1.6]} scale={0.9} />
    </Frame>
  );
};

// Opsi 6 — lapak bazar (mentega)
export const Opsi6: React.FC = () => {
  const pal = tonePal("mentega", 1);
  const L = useLabels();
  const L2 = useLabels2();
  return (
    <Frame
      pal={pal}
      kicker="LAPAK BAZAR"
      title="Pembeli cuma|melirik 3 detik"
      cam={[0, 1.6, 11]}
      overlay={
        <>
          <div style={{ position: "absolute", left: 610, top: 1180, padding: "14px 22px", background: "#fff", borderRadius: 12, boxShadow: "0 10px 24px rgba(0,0,0,0.15)", transform: "rotate(6deg)", fontWeight: 900, fontSize: 44, color: pal.line }}>Rp15.000</div>
          <Pill pal={pal} x={70} y={1600} w={940} at={-30} text="Nama dan isi harus langsung terbaca" />
        </>
      }
    >
      <Taplak c1="#fbf3df" c2="#e0a83a" />
      {[-1.9, 0, 1.9].map((x, i) => (
        <group key={x}>
          <SoftShadow x={x} z={i === 1 ? 0 : 0.8} w={2} d={1.1} o={0.45} />
          {i === 1 ? <Pouch label={L.keripik} position={[x, -0.05, 0]} /> : <Jar label={i ? L.sambal : L2.kue} isi={i ? "#b5281c" : "#d9a25a"} position={[x, -0.6, 0.8]} rotation={[0, i ? -0.4 : 0.4, 0]} />}
        </group>
      ))}
    </Frame>
  );
};

// Opsi 7 — paket online (mint)
export const Opsi7: React.FC = () => {
  const pal = tonePal("mint", 1);
  const L = useLabels();
  return (
    <Frame
      pal={pal}
      kicker="PAKET ONLINE"
      title="Kemasan juga|untuk dikirim"
      cam={[0, 7.5, 8.5]}
      overlay={
        <>
          <Callout pal={pal} at={-30} tx={500} ty={1180} x={60} y={640} w={440} text="Kesan pertama saat paket dibuka" />
          <Card pal={pal} x={70} y={1560} w={940} at={-30} title="TIPS" text="Pakai kemasan yang kuat, lalu tambahkan stiker nama usaha di luar." />
        </>
      }
    >
      <Table tint="#d6b08a" />
      <SoftShadow x={0} z={0.4} w={4.2} d={3} o={0.5} />
      <Kardus position={[0, -0.75, 0.4]} rotation={[0, -0.2, 0]} />
      <Pouch label={L.keripik} position={[-0.3, -0.25, 0.4]} rotation={[-0.15, -0.15, 0]} scale={0.85} />
      <Sachet print={L.kopi} position={[1.1, -0.25, 0.7]} rotation={[-0.6, -0.3, 0.2]} scale={0.8} />
    </Frame>
  );
};

// Opsi 8 — marketplace di ponsel (langit)
export const Opsi8: React.FC = () => {
  const pal = tonePal("langit", 1);
  const L = useLabels();
  const L2 = useLabels2();
  return (
    <Frame
      pal={pal}
      kicker="DI MARKETPLACE"
      title="Kemasan yang|jelas di layar kecil"
      cam={[0, 1.2, 11]}
      overlay={<Callout pal={pal} at={-30} tx={860} ty={1300} x={560} y={1580} w={460} align="right" text="Foto kecil tetap terbaca karena nama besar dan warna kontras" />}
    >
      <Table tint="#e2c3a2" />
      <SoftShadow x={-1.3} z={0} w={2.4} d={1.2} o={0.5} />
      <Pouch label={L.keripik} position={[-1.3, -0.05, 0]} rotation={[0, 0.3, 0]} />
      <Phone screen={L2.market} position={[1.4, 0.05, 0.6]} rotation={[-0.08, -0.3, 0.04]} />
    </Frame>
  );
};

// Opsi 9 — skala dengan benda sehari-hari (sage)
export const Opsi9: React.FC = () => {
  const pal = tonePal("sage", 1);
  const L = useLabels();
  const L2 = useLabels2();
  return (
    <Frame
      pal={pal}
      kicker="UKURAN NYATA"
      title="Bandingkan dengan|benda sehari-hari"
      cam={[0, 1.8, 10.5]}
      overlay={<Card pal={pal} x={70} y={1640} w={940} at={-30} title="CARA CEK" text="Cetak label seukuran asli, tempel di kemasan, lalu lihat dari jarak satu meter." />}
    >
      <Table tint="#dcc09e" />
      <SoftShadow x={0} z={0} w={2.4} d={1.2} o={0.5} />
      <Pouch label={L.keripik} position={[0, -0.05, 0]} />
      <SoftShadow x={-2.0} z={0.9} w={1.4} d={1.4} o={0.4} />
      <Mug position={[-2.0, -0.9, 0.9]} />
      <group position={[2.0, -1.32, 0.2]} rotation={[-Math.PI / 2, 0, 0.5]}>
        <Phone screen={L2.market} />
      </group>
    </Frame>
  );
};

// Opsi 10 — cahaya jendela pagi (lavender)
export const Opsi10: React.FC = () => {
  const pal = tonePal("lavender", 1);
  const L = useLabels();
  const L2 = useLabels2();
  return (
    <Frame
      pal={pal}
      kicker="FOTO PRODUK"
      title="Cukup pakai|cahaya pagi"
      cam={[0, 1.4, 10.5]}
      overlay={<Callout pal={pal} at={-30} tx={420} ty={1340} x={60} y={1540} w={460} text="Dekat jendela, tanpa lampu tambahan" />}
    >
      <Table tint="#e6c8a6" />
      <CahayaJendela x={0.2} z={0.6} s={1.1} />
      <SoftShadow x={-0.6} z={0} w={2.4} d={1.2} o={0.45} />
      <Pouch label={L.keripik} position={[-0.6, -0.05, 0]} rotation={[0, 0.2, 0]} />
      <SoftShadow x={1.6} z={0.9} w={1.6} d={1.2} o={0.4} />
      <Jar label={L2.kue} isi="#d9a25a" position={[1.6, -0.6, 0.9]} rotation={[0, -0.4, 0]} />
    </Frame>
  );
};

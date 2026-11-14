import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

// ---------- Studio 3D: kanvas transparan di area panggung, lingkungan cahaya studio ----------
const Env: React.FC = () => {
  const { gl, scene } = useThree();
  useMemo(() => {
    const pm = new THREE.PMREMGenerator(gl);
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.05;
  }, [gl, scene]);
  return null;
};

export const Studio: React.FC<{
  children: React.ReactNode;
  top?: number;
  height?: number;
  cam?: [number, number, number];
  fov?: number;
}> = ({ children, top = 600, height = 1000, cam = [0, 0.3, 8], fov = 38 }) => (
  <div style={{ position: "absolute", left: 0, top, width: 1080, height }}>
    <ThreeCanvas
      width={1080}
      height={height}
      dpr={1}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: cam, fov }}
      style={{ background: "transparent" }}
    >
      <Env />
      <ambientLight intensity={0.25} />
      <directionalLight position={[4, 6, 5]} intensity={1.4} />
      <directionalLight position={[-5, 2, -3]} intensity={0.6} color="#b9a4ff" />
      {children}
    </ThreeCanvas>
  </div>
);

// ---------- bahan mengilap ----------
export const Gloss: React.FC<{
  color: string;
  rough?: number;
  metal?: number;
  opacity?: number;
}> = ({ color, rough = 0.2, metal = 0.05, opacity = 1 }) => (
  <meshPhysicalMaterial
    color={color}
    roughness={rough}
    metalness={metal}
    clearcoat={1}
    clearcoatRoughness={0.08}
    transparent={opacity < 1}
    opacity={opacity}
  />
);

export const mix = (a: string, b: string, t: number) =>
  "#" + new THREE.Color(a).lerp(new THREE.Color(b), Math.min(1, Math.max(0, t))).getHexString();
const gray = (c: string) => {
  const k = new THREE.Color(c);
  const l = 0.3 * k.r + 0.59 * k.g + 0.11 * k.b;
  return "#" + new THREE.Color(l, l, l).getHexString();
};
export const toMono = (c: string, t: number) => mix(c, gray(c), t);

// ---------- geometri halus ----------
const extrude = (s: THREE.Shape, depth: number, bevel = 0.04) => {
  const g = new THREE.ExtrudeGeometry(s, {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 8,
    curveSegments: 64,
  });
  g.center();
  return g;
};

export const useEmblemGeo = () =>
  useMemo(() => {
    const sun = new THREE.Shape();
    sun.absarc(0, 0, 0.5, 0, Math.PI, false);
    sun.lineTo(0.5, 0);
    const cup = new THREE.Shape();
    cup.moveTo(-0.55, 0);
    cup.lineTo(0.55, 0);
    cup.bezierCurveTo(0.55, -0.45, 0.35, -0.62, 0, -0.62);
    cup.bezierCurveTo(-0.35, -0.62, -0.55, -0.45, -0.55, 0);
    return { sun: extrude(sun, 0.1), cup: extrude(cup, 0.14) };
  }, []);

// Logo contoh "Kopi Senja" (fiktif): cakram, cincin, matahari terbit di atas cangkir.
export const Emblem: React.FC<{
  mono?: number;
  opacity?: number;
} & React.JSX.IntrinsicElements["group"]> = ({ mono = 0, opacity = 1, ...g }) => {
  const geo = useEmblemGeo();
  const c = (x: string) => toMono(x, mono);
  return (
    <group {...g}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.15, 1.15, 0.22, 128]} />
        <Gloss color={mono > 0.5 ? mix("#3b1f5e", "#111111", mono) : "#3b1f5e"} opacity={opacity} />
      </mesh>
      <mesh position={[0, 0, 0.11]}>
        <torusGeometry args={[1.08, 0.06, 32, 160]} />
        <Gloss color={c("#f6c453")} metal={0.6} rough={0.15} opacity={opacity} />
      </mesh>
      <mesh geometry={geo.sun} position={[0, 0.22, 0.2]}>
        <Gloss color={c("#ff8a3d")} opacity={opacity} />
      </mesh>
      <mesh geometry={geo.cup} position={[0, -0.14, 0.24]}>
        <Gloss color={c("#fff1dc")} opacity={opacity} />
      </mesh>
      <mesh position={[0.5, -0.1, 0.24]} rotation={[0, 0, -Math.PI / 2]}>
        <torusGeometry args={[0.15, 0.05, 24, 64, Math.PI]} />
        <meshPhysicalMaterial color={c("#fff1dc")} clearcoat={1} roughness={0.2} transparent={opacity < 1} opacity={opacity} />
      </mesh>
    </group>
  );
};

// Cangkir keramik halus (lathe).
export const Cup: React.FC<React.JSX.IntrinsicElements["group"]> = (g) => {
  const geo = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    for (let i = 0; i <= 24; i++) {
      const t = i / 24;
      pts.push(new THREE.Vector2(0.75 + 0.18 * t + 0.04 * Math.sin(t * Math.PI), -0.85 + 1.7 * t));
    }
    pts.push(new THREE.Vector2(0.88, 0.85));
    for (let i = 24; i >= 0; i--) {
      const t = i / 24;
      pts.push(new THREE.Vector2(0.69 + 0.18 * t, -0.78 + 1.63 * t));
    }
    return new THREE.LatheGeometry(pts, 128);
  }, []);
  return (
    <group {...g}>
      <mesh geometry={geo}>
        <meshPhysicalMaterial color="#f7f3ee" roughness={0.25} clearcoat={1} clearcoatRoughness={0.05} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0.98, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <torusGeometry args={[0.38, 0.09, 32, 96, Math.PI]} />
        <meshPhysicalMaterial color="#f7f3ee" roughness={0.25} clearcoat={1} />
      </mesh>
      <mesh position={[0, 0.7, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.8, 96]} />
        <meshPhysicalMaterial color="#4a2a18" roughness={0.1} clearcoat={1} />
      </mesh>
    </group>
  );
};

// Kotak membulat sederhana (kemasan, ponsel, keping warna).
export { RoundedBox } from "@react-three/drei";

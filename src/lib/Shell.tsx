import React from "react";
import {
  AbsoluteFill,
  Html5Audio,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { clamp, Pal, SANS, Timeline } from "./base";
import { Backdrop, Progress } from "./ui";

export type Reveal =
  | "circle"
  | "wipeUp"
  | "wipeLeft"
  | "diagonal"
  | "iris"
  | "wipeDown";

export type SceneDef = {
  id: string;
  C: React.FC;
  /** 0 = pembuka/masalah, 1..N = tahap, N+1 = rangkuman/penutup */
  step: number;
  reveal: Reveal;
};

const clipFor = (r: Reveal, p: number) => {
  const q = (1 - p) * 100;
  switch (r) {
    case "circle":
      return `circle(${p * 150}% at 50% 55%)`;
    case "iris":
      return `circle(${p * 150}% at 85% 15%)`;
    case "wipeUp":
      return `inset(${q}% 0 0 0)`;
    case "wipeDown":
      return `inset(0 0 ${q}% 0)`;
    case "wipeLeft":
      return `inset(0 0 0 ${q}%)`;
    case "diagonal":
      return `polygon(0 0, ${p * 220}% 0, ${p * 220 - 120}% 100%, 0 100%)`;
  }
};

const Layer: React.FC<{
  pal: Pal;
  reveal: Reveal;
  C: React.FC;
  first: boolean;
  overlap: number;
}> = ({ pal, reveal, C, first, overlap }) => {
  const f = useCurrentFrame();
  const p = first
    ? 1
    : interpolate(f, [0, overlap], [0, 1], {
        ...clamp,
        easing: (t) => 1 - Math.pow(1 - t, 3),
      });
  return (
    <AbsoluteFill style={{ clipPath: p < 1 ? clipFor(reveal, p) : undefined }}>
      <Backdrop pal={pal} />
      <C />
    </AbsoluteFill>
  );
};

/**
 * Kerangka video: scene bertumpuk dengan transisi bervariasi, progress tahap, dan audio.
 * `steps` = jumlah tahap bernomor (untuk progress bar).
 */
export const VideoShell: React.FC<{
  order: SceneDef[];
  tl: Timeline;
  pal: Record<string, Pal>;
  audio: string;
  steps: number;
}> = ({ order, tl, pal, audio, steps }) => {
  const f = useCurrentFrame();
  const cur =
    [...order].reverse().find((o) => f >= tl.scenes[o.id].from) ?? order[0];
  return (
    <AbsoluteFill style={{ fontFamily: SANS, background: "#060B18" }}>
      {order.map(({ id, C, reveal }, i) => {
        const s = tl.scenes[id];
        const end =
          i + 1 < order.length
            ? tl.scenes[order[i + 1].id].from + tl.overlap
            : tl.total;
        return (
          <Sequence
            key={id}
            from={s.from}
            durationInFrames={end - s.from}
            layout="none"
          >
            <Layer
              pal={pal[id]}
              reveal={reveal}
              C={C}
              first={i === 0}
              overlap={tl.overlap}
            />
          </Sequence>
        );
      })}
      {cur.id !== "closing" && (
        <Progress step={cur.step} color={pal[cur.id].accent} total={steps} />
      )}
      <Html5Audio src={staticFile(audio)} />
    </AbsoluteFill>
  );
};

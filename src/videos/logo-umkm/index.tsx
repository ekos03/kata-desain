import React from "react";
import { Closing } from "../../lib/Closing";
import { SceneDef, VideoShell } from "../../lib/Shell";
import { Hook, Masalah, Outro, S1, S2, S3, S4, S5 } from "./scenes";
import { PAL, TL } from "./theme";

const ClosingScene: React.FC = () => <Closing pal={PAL.closing} />;

const ORDER: SceneDef[] = [
  { id: "hook", C: Hook, step: 0, reveal: "wipeUp" },
  { id: "masalah", C: Masalah, step: 0, reveal: "iris" },
  { id: "s1", C: S1, step: 1, reveal: "circle" },
  { id: "s2", C: S2, step: 2, reveal: "diagonal" },
  { id: "s3", C: S3, step: 3, reveal: "wipeLeft" },
  { id: "s4", C: S4, step: 4, reveal: "wipeDown" },
  { id: "s5", C: S5, step: 5, reveal: "circle" },
  { id: "outro", C: Outro, step: 6, reveal: "iris" },
  { id: "closing", C: ClosingScene, step: 6, reveal: "wipeUp" },
];

export const Video: React.FC = () => (
  <VideoShell order={ORDER} tl={TL} pal={PAL} audio="logo-umkm/audio.mp3" steps={5} />
);

export const meta = { id: "logo-umkm", fps: TL.fps, total: TL.total };

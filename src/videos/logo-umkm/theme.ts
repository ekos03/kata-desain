import { Pal, Timeline } from "../../lib/base";
import { tonePal } from "../../lib3d/tones";
import timeline from "./timeline.json";

export const TL: Timeline = timeline;
export type SceneId = keyof typeof timeline.scenes;

// Tone video ini: pink lembut.
export const TONE = "pink";
const ids: SceneId[] = ["hook", "masalah", "s1", "s2", "s3", "s4", "s5", "outro", "closing"];
export const PAL = Object.fromEntries(ids.map((id, i) => [id, tonePal(TONE, i)])) as Record<SceneId, Pal>;

export const scene = (id: SceneId) => {
  const s = TL.scenes[id];
  return { ...s, len: s.to - s.from };
};

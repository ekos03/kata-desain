import { Pal, Timeline } from "../../lib/base";
import { PALETTES } from "../../lib/palettes";
import timeline from "./timeline.json";

export const TL: Timeline = timeline;
export type SceneId = keyof typeof timeline.scenes;

export const PAL: Record<SceneId, Pal> = {
  hook: PALETTES.plum,
  masalah: PALETTES.maroon,
  s1: PALETTES.indigo,
  s2: PALETTES.teal,
  s3: PALETTES.umber,
  s4: PALETTES.steel,
  s5: PALETTES.rust,
  outro: PALETTES.navy,
  closing: PALETTES.plum,
};

export const scene = (id: SceneId) => {
  const s = TL.scenes[id];
  return { ...s, len: s.to - s.from };
};

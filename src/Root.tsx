import React from "react";
import { Composition, Still } from "remotion";
import { Sampul, SampulProps } from "./lib/Sampul";
import "./lib3d/fonts";
import { VIDEOS } from "./videos/registry";

export const RemotionRoot: React.FC = () => (
  <>
    {VIDEOS.map((v) => (
      <Composition
        key={v.meta.id}
        id={v.meta.id}
        component={v.Video}
        durationInFrames={v.meta.total}
        fps={v.meta.fps}
        width={1080}
        height={1920}
      />
    ))}
    <Still
      id="sampul"
      component={Sampul}
      width={1080}
      height={1920}
      defaultProps={{ bg: "uji-realis/sampul-bg.png", kicker: "Kemasan UMKM", judul: "Label *pucat*|bikin dilewati", kanal: "KATA DESAIN", accent: "#F391B4", font: "'Bricolage Grotesque', sans-serif", format: "tiktok" } as SampulProps}
    />
  </>
);

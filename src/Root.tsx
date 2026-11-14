import React from "react";
import { Composition } from "remotion";
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
  </>
);

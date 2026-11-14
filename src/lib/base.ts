export const SANS = "Inter, 'DejaVu Sans', Arial, sans-serif";
export const MONO = "'JetBrains Mono', 'DejaVu Sans Mono', monospace";

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

export type Pal = {
  bg1: string; // latar atas
  bg2: string; // latar bawah
  accent: string;
  accent2: string; // aksen pendamping
  line: string; // garis gambar
  fill: string; // isian lembut
};

export type Timeline = {
  fps: number;
  total: number;
  overlap: number;
  voOffset: number;
  scenes: Record<string, { from: number; to: number; beats: number[] }>;
};

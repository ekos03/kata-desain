import { Pal } from "../lib/base";

// Tema warna lembut KATA DESAIN: satu tone per video (video 1 pink, video 2 oranye, dst.).
// Tiap tone punya beberapa variasi latar supaya tiap adegan sedikit berbeda tapi tetap senada.
type Tone = { line: string; accent: string; accent2: string; bgs: [string, string][] };

const T: Record<string, Tone> = {
  pink: { line: "#4A2238", accent: "#E2678F", accent2: "#9B6BD6", bgs: [["#FFF3F7", "#FCDDE8"], ["#FDE6EE", "#F8CADB"], ["#FFF8F5", "#FBE1E9"], ["#FCE9F1", "#F6D3E4"]] },
  oranye: { line: "#5A2E14", accent: "#EE8A4C", accent2: "#D9644A", bgs: [["#FFF6EE", "#FDE3CC"], ["#FEEBDD", "#FAD2B3"], ["#FFF9F2", "#FCE6D2"], ["#FFF1E6", "#F9DCC4"]] },
  lavender: { line: "#33295A", accent: "#8E7BE0", accent2: "#E27BB3", bgs: [["#F7F4FF", "#E6DFFC"], ["#EFEAFE", "#DCD2FA"], ["#FAF8FF", "#E9E3FB"], ["#F2EEFF", "#E1D8FB"]] },
  mint: { line: "#1F4A3D", accent: "#3FB28C", accent2: "#5B9BD5", bgs: [["#F1FBF7", "#D6F2E6"], ["#E6F7EF", "#C9EBDC"], ["#F5FCF9", "#DCF3E9"], ["#EAF8F2", "#D0EEE1"]] },
  langit: { line: "#1E3A5A", accent: "#4F9BDB", accent2: "#E68AA8", bgs: [["#F2F8FE", "#D9EAFB"], ["#E8F2FD", "#CBE1F8"], ["#F6FAFE", "#DFEDFB"], ["#EDF5FD", "#D3E6F9"]] },
  mentega: { line: "#4D3B12", accent: "#E0B23C", accent2: "#E07A5F", bgs: [["#FFFBEF", "#FBEFC6"], ["#FEF6DD", "#F8E6AE"], ["#FFFCF4", "#FAF0CF"], ["#FFF8E6", "#F9EBBB"]] },
  sage: { line: "#2E3F2A", accent: "#7FA06B", accent2: "#C98B6B", bgs: [["#F5F8F1", "#E1EAD6"], ["#EDF2E7", "#D5E1C8"], ["#F8FAF5", "#E5EDDC"], ["#F0F5EA", "#DAE5CE"]] },
  persik: { line: "#5A2A22", accent: "#F28C7A", accent2: "#E7A23F", bgs: [["#FFF4F1", "#FDDCD4"], ["#FEE9E4", "#FAD0C6"], ["#FFF8F6", "#FCE2DB"], ["#FFF0EC", "#F9D6CD"]] },
};
export const TONES = Object.keys(T);

/** Palet adegan ke-i untuk tone tertentu. */
export const tonePal = (tone: keyof typeof T | string, i: number): Pal => {
  const t = T[tone] ?? T.pink;
  const [bg1, bg2] = t.bgs[i % t.bgs.length];
  return { bg1, bg2, accent: t.accent, accent2: t.accent2, line: t.line, fill: "rgba(255,255,255,0.7)" };
};

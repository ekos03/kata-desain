import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Huruf KATA DESAIN (berkas lokal, lisensi OFL dari Fontsource):
// - Bricolage Grotesque: judul tampilan yang berkarakter
// - DM Serif Display Italic: kata kunci aksen
export const DISPLAY = "'Bricolage Grotesque', Inter, sans-serif";
export const SERIF = "'DM Serif Display', Georgia, serif";

let loaded = false;
export const loadKataFonts = () => {
  if (loaded) return;
  loaded = true;
  loadFont({ family: "Bricolage Grotesque", url: staticFile("fonts/bricolage-grotesque-latin-800-normal.woff2"), weight: "800" });
  loadFont({ family: "Bricolage Grotesque", url: staticFile("fonts/bricolage-grotesque-latin-700-normal.woff2"), weight: "700" });
  loadFont({ family: "DM Serif Display", url: staticFile("fonts/dm-serif-display-latin-400-italic.woff2"), weight: "400", style: "italic" });
};
loadKataFonts();

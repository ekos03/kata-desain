// Daftar semua video. Tambahkan satu baris import + satu entri per video baru.
import * as logoUmkm from "./logo-umkm";
import { Opsi4, Opsi5, Opsi6, Opsi7, Opsi8, Opsi9, Opsi10 } from "./opsi";
import { GayaArtboard, GayaHero, GayaMeja, GayaRealis, GayaRealisDekat, GayaRealisRak } from "./gaya";

const still = (id: string, Video: React.FC) => ({ meta: { id, fps: 30, total: 30 }, Video });

export const VIDEOS = [logoUmkm, still("gaya-artboard", GayaArtboard), still("gaya-hero", GayaHero), still("gaya-meja", GayaMeja), still("gaya-realis", GayaRealis), still("gaya-realis-dekat", GayaRealisDekat), still("gaya-realis-rak", GayaRealisRak), still("opsi-04", Opsi4), still("opsi-05", Opsi5), still("opsi-06", Opsi6), still("opsi-07", Opsi7), still("opsi-08", Opsi8), still("opsi-09", Opsi9), still("opsi-10", Opsi10)];

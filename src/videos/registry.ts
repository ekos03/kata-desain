// Daftar semua video. Tambahkan satu baris import + satu entri per video baru.
import * as logoUmkm from "./logo-umkm";
import { GayaArtboard, GayaHero, GayaMeja } from "./gaya";

const still = (id: string, Video: React.FC) => ({ meta: { id, fps: 30, total: 30 }, Video });

export const VIDEOS = [logoUmkm, still("gaya-artboard", GayaArtboard), still("gaya-hero", GayaHero), still("gaya-meja", GayaMeja)];

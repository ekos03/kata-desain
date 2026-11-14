"""Ekspor caption Instagram: content/<slug>/caption-ig.txt -> output/<YYYY-MM-DD>-<slug>-caption-ig.txt

Pemakaian: python3 pipeline/caption_txt.py <slug> [YYYY-MM-DD]
Memeriksa batas Instagram: ≤ 2.200 karakter dan ≤ 30 tagar.
Tanggal default = tanggal file video terakhir untuk slug ini (atau hari ini bila belum ada).
"""
import datetime, glob, os, re, sys, zoneinfo
from common import ROOT, content

def main():
    slug = sys.argv[1]
    src = content(slug) / "caption-ig.txt"
    txt = src.read_text(encoding="utf-8").strip() + "\n"
    if len(sys.argv) > 2:
        tgl = sys.argv[2]
    else:
        vids = sorted(glob.glob(str(ROOT / "output" / f"*-{slug}.mp4")))
        tgl = os.path.basename(vids[-1])[:10] if vids else datetime.datetime.now(zoneinfo.ZoneInfo("Asia/Jakarta")).strftime("%Y-%m-%d")
    tags = re.findall(r"#\w+", txt)
    if len(txt) > 2200: raise SystemExit(f"Caption terlalu panjang: {len(txt)} > 2200 karakter")
    if len(tags) > 30: raise SystemExit(f"Tagar terlalu banyak: {len(tags)} > 30")
    out = ROOT / "output" / f"{tgl}-{slug}-caption-ig.txt"
    out.write_text(txt, encoding="utf-8")
    print(txt); print(f"-> {out.relative_to(ROOT)} ({len(txt)} karakter, {len(tags)} tagar)")

if __name__ == "__main__":
    main()

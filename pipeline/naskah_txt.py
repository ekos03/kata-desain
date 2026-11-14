"""Ekspor naskah voice over ke teks siap tempel (mis. untuk ElevenLabs).

Pemakaian: python3 pipeline/naskah_txt.py <slug>
Output   : output/<YYYY-MM-DD>-<slug>-naskah-vo.txt (juga dicetak ke layar)
"""
import datetime, sys, zoneinfo
from common import ROOT, content, load

def main():
    slug = sys.argv[1]; n = load(content(slug) / "naskah.json")
    tgl = datetime.datetime.now(zoneinfo.ZoneInfo("Asia/Jakarta")).strftime("%Y-%m-%d")
    body = "\n\n".join(s["text"].strip() for s in n["segments"])
    txt = f"{n['title']}\nNaskah voice over — tempel bagian di bawah garis ke ElevenLabs.\n{'-' * 60}\n\n{body}\n"
    out = ROOT / "output" / f"{tgl}-{slug}-naskah-vo.txt"; out.parent.mkdir(exist_ok=True)
    out.write_text(txt, encoding="utf-8")
    print(txt); print(f"-> {out.relative_to(ROOT)} ({len(body)} karakter)")

if __name__ == "__main__":
    main()

"""Cetak frame absolut untuk dicek: python3 pipeline/frames.py <slug> scene:rel [scene:rel ...]
rel boleh angka atau 'bN+K' (beat ke-N ditambah K frame) atau 'end-K'."""
import sys
from common import ROOT, load
S = load(ROOT / "src" / "videos" / sys.argv[1] / "timeline.json")["scenes"]
out = []
for a in sys.argv[2:]:
    sid, r = a.split(":"); sc = S[sid]
    if r.startswith("b"):
        n, _, k = r[1:].partition("+"); v = sc["beats"][int(n)] + int(k or 0)
    elif r.startswith("end"):
        v = sc["to"] - sc["from"] - int(r[4:] or 0)
    else:
        v = int(r)
    out.append(str(sc["from"] + v))
print(" ".join(out))

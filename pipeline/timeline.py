"""Susun timeline scene dari timestamp ElevenLabs.

Pemakaian: python3 pipeline/timeline.py <slug>
Input : content/<slug>/naskah.json (segments: id, text, beats = frasa kunci di dalam text)
        content/<slug>/alignment.json
Output: src/videos/<slug>/timeline.json
  scenes[id] = {from, to, beats}  -> beats[0] = awal kalimat scene, beats[i] = awal frasa kunci ke-i (frame relatif scene)
  Scene "closing" ditambahkan otomatis setelah VO selesai.
"""
import sys
from common import FPS, ROOT, content, load, save

OFF = 0.6        # jeda sebelum VO mulai (detik)
OVERLAP = 14     # frame transisi antar-scene
LEAD = 8         # scene muncul 8 frame sebelum kalimatnya
TAIL = 1.0       # detik setelah VO berakhir sebelum closing
CLOSING = 165    # panjang closing (frame)

def main():
    slug = sys.argv[1]
    d = content(slug)
    n = load(d / "naskah.json")
    al = load(d / "alignment.json")
    text = al["text"]; a = al["alignment"]
    starts = a["character_start_times_seconds"]; ends = a["character_end_times_seconds"]
    fr = lambda t: round((t + OFF) * FPS)
    pos = 0; segs = []
    for s in n["segments"]:
        t = s["text"].strip()
        i = text.index(t, pos); pos = i + len(t)
        beats = [starts[i]]
        for ph in s.get("beats", []):
            j = text.find(ph, i, pos)
            if j < 0:
                raise SystemExit(f"Frasa beat '{ph}' tidak ditemukan di segmen {s['id']}")
            beats.append(starts[j])
        segs.append((s["id"], beats))
    vo_end = ends[-1]
    close_from = fr(vo_end + TAIL)
    total = close_from + CLOSING
    sc = {}
    for k, (sid, b) in enumerate(segs):
        sc[sid] = {"from": 0 if k == 0 else fr(b[0]) - LEAD}
    ids = [s for s, _ in segs]
    for k, (sid, b) in enumerate(segs):
        sc[sid]["to"] = sc[ids[k + 1]]["from"] if k + 1 < len(ids) else close_from
        sc[sid]["beats"] = [fr(t) - sc[sid]["from"] for t in b]
    sc["closing"] = {"from": close_from, "to": total, "beats": [0]}
    out = ROOT / "src" / "videos" / slug / "timeline.json"
    save(out, {"fps": FPS, "total": total, "overlap": OVERLAP, "voOffset": OFF, "scenes": sc})
    print(f"timeline OK: {total} frame = {total / FPS:.1f} dtk")
    for sid, v in sc.items():
        print(f"  {sid:10s} {v['from']:5d}-{v['to']:5d}  beats {v['beats']}")

if __name__ == "__main__":
    main()

"""Efek suara orisinal (disintesis) yang mengikuti animasi.

Pemakaian: python3 pipeline/sfx.py <slug>
Input : src/videos/<slug>/timeline.json, content/<slug>/sfx.json
Output: content/<slug>/sfx.wav

sfx.json = daftar cue:
  {"scene": "s1", "at": "beat:2", "plus": 6, "sound": "pop", "gain": 0.5}
  - at   : "beat:N" (beat ke-N scene), atau angka frame relatif awal scene
  - plus : geser (frame), boleh negatif
  - sound: whoosh | whoosh_down | thud | boom | pop | blip | tick | chime | drill | pour | rain | crack | rise | boing | click
  - opsional "dur" (detik) untuk drill/pour/rain/whoosh/rise/boom/chime
Whoosh transisi di awal tiap scene ditambahkan otomatis.
"""
import sys
import numpy as np, soundfile as sf
from common import FPS, ROOT, SR, content, load

rng = np.random.default_rng(3)
tt = lambda d: np.arange(int(d * SR)) / SR

def _flt(x, fc, high=False):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= 1 / (1 + ((fc / np.maximum(f, 1)) if high else (f / fc)) ** 4)
    return np.fft.irfft(X, len(x))
lp = lambda x, fc: _flt(x, fc); hp = lambda x, fc: _flt(x, fc, True)
norm = lambda x, p=1.0: x / (np.abs(x).max() + 1e-9) * p
def sweep(f0, f1, d):
    t = tt(d); return np.sin(2 * np.pi * np.cumsum(f0 * (f1 / f0) ** (t / d)) / SR)

def whoosh(d=0.5, up=True):
    t = tt(d); n = rng.standard_normal(len(t)); env = np.sin(np.pi * t / d) ** 2
    mix = t / d if up else 1 - t / d
    return norm((lp(n, 900) * (1 - mix) + lp(n, 4000) * mix) * env, 0.8)
def thud(d=0.35, f0=130, f1=42):
    t = tt(d); return norm(sweep(f0, f1, d) * np.exp(-t / 0.11) + 0.5 * lp(rng.standard_normal(len(t)), 1500) * np.exp(-t / 0.012))
def boom(d=1.0):
    t = tt(d); return norm(sweep(90, 32, d) * np.exp(-t / 0.28) + 0.8 * lp(rng.standard_normal(len(t)), 900) * np.exp(-t / 0.09))
def pop(d=0.09):
    t = tt(d); return norm(sweep(420, 1100, d) * np.exp(-t / 0.03), 0.8)
def blip(d=0.08, f=1500):
    t = tt(d); return norm((np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t)) * np.exp(-t / 0.025), 0.55)
def tick(d=0.02):
    t = tt(d); return norm(hp(rng.standard_normal(len(t)), 3000) * np.exp(-t / 0.004), 0.5)
def chime(d=1.4, base=1046.5):
    t = tt(d); s = sum(a * np.sin(2 * np.pi * base * m * t) * np.exp(-t / dd) for m, a, dd in [(1, 1, .9), (1.5, .6, .7), (2, .4, .5), (3, .15, .3)])
    return norm(s * np.minimum(1, t / 0.004), 0.6)
def drill(d=0.7):
    t = tt(d); saw = 2 * ((150 * t) % 1) - 1
    s = lp(saw, 2500) * (0.6 + 0.4 * np.sin(2 * np.pi * 28 * t)) + 0.3 * hp(rng.standard_normal(len(t)), 2000)
    return norm(s * np.minimum(1, t / 0.03) * np.minimum(1, (d - t) / 0.08), 0.45)
def pour(d=1.5):
    t = tt(d); n = lp(rng.standard_normal(len(t)), 1100); am = np.clip(0.6 + 2.4 * np.abs(lp(rng.standard_normal(len(t)), 9)), 0, 1.5)
    return norm(n * am * np.minimum(1, t / 0.15) * np.minimum(1, (d - t) / 0.3), 0.5)
def rain(d=3.0):
    x = np.zeros(int(d * SR))
    for _ in range(int(d * 45)):
        i = rng.integers(0, len(x) - 960); x[i:i + 960] += tick() * rng.uniform(0.2, 0.7)
    x += 0.15 * hp(rng.standard_normal(len(x)), 2500); t = tt(d)
    return norm(x * np.minimum(1, t / 0.3) * np.minimum(1, (d - t) / 0.5), 0.35)
def crack(d=0.35):
    x = np.zeros(int(d * SR)); p = 0
    for k in range(10):
        p += int(rng.uniform(0.004, 0.03) * SR)
        if p + 960 > len(x): break
        x[p:p + 960] += tick() * (1 - k / 10) * 1.4
    return norm(x + 0.4 * lp(rng.standard_normal(len(x)), 600) * np.exp(-tt(d) / 0.06), 0.8)
def rise(d=0.9):
    t = tt(d); s = sweep(180, 900, d) * 0.4 + lp(rng.standard_normal(len(t)), 2500) * 0.6 * (t / d)
    return norm(s * (t / d) ** 1.5 * np.minimum(1, (d - t) / 0.05), 0.6)
def boing(d=0.45):
    t = tt(d); f = 320 + 60 * np.sin(2 * np.pi * 14 * t) * np.exp(-t / 0.15)
    return norm(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.14), 0.6)
def click(d=0.02):
    return norm(tick(d), 0.7)

SOUNDS = {"whoosh": whoosh, "whoosh_down": lambda d=0.5: whoosh(d, False), "thud": thud, "boom": boom, "pop": pop,
          "blip": blip, "tick": tick, "chime": chime, "drill": drill, "pour": pour, "rain": rain, "crack": crack,
          "rise": rise, "boing": boing, "click": click}

def closing_cues():
    # selaras dengan lib/Closing.tsx
    return [("closing", a + 4, "pop", 0.5) for a in (30, 42, 54)] + [
        ("closing", 70, "boing", 0.45), ("closing", 97, "click", 0.9), ("closing", 100, "pop", 0.5), ("closing", 104, "chime", 0.45)]

def main():
    slug = sys.argv[1]
    tl = load(ROOT / "src" / "videos" / slug / "timeline.json"); S = tl["scenes"]
    cues = load(content(slug) / "sfx.json") if (content(slug) / "sfx.json").exists() else []
    N = int((tl["total"] / FPS + 1.5) * SR); bus = np.zeros(N)
    def at(frame, sig, g):
        i = int(frame / FPS * SR); j = min(N, i + len(sig))
        if 0 <= i < N: bus[i:j] += sig[: j - i] * g
    for k in list(S)[1:]:
        at(S[k]["from"], whoosh(0.5), 0.55)
    for c in cues:
        sc = S[c["scene"]]; a = c.get("at", 0)
        rel = sc["beats"][int(a.split(":")[1])] if isinstance(a, str) else int(a)
        fn = SOUNDS[c["sound"]]
        sig = fn(c["dur"]) if "dur" in c else fn()
        at(sc["from"] + rel + c.get("plus", 0), sig, c.get("gain", 0.5))
    for sid, rel, snd, g in closing_cues():
        at(S[sid]["from"] + rel, SOUNDS[snd](), g)
    bus = bus / (np.abs(bus).max() + 1e-9) * 0.9
    sf.write(content(slug) / "sfx.wav", bus, SR)
    print(f"sfx OK: {len(cues)} cue + transisi + closing")

if __name__ == "__main__":
    main()

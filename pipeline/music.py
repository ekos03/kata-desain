"""Musik latar lo-fi orisinal (disintesis, bebas hak cipta).

Pemakaian: python3 pipeline/music.py <slug>
Durasi mengikuti timeline. Progresi akor dipilih dari slug, jadi tiap video sedikit berbeda.
Output: content/<slug>/music.wav
"""
import sys, zlib, subprocess
import numpy as np, soundfile as sf
from common import FPS, ROOT, SR, content, load

PROGS = [
    ([[53,57,60,64,67],[52,55,59,62,65],[50,53,57,60,64],[48,52,55,59,62]], [41,40,38,36]),  # Fmaj9-Em7-Dm9-Cmaj7
    ([[48,52,55,59,62],[45,48,52,55,59],[53,57,60,64,67],[55,59,62,65,69]], [36,33,41,43]),  # C-Am-F-G
    ([[50,53,57,60,64],[55,59,62,65,69],[48,52,55,59,62],[45,48,52,55,60]], [38,43,36,33]),  # Dm-G-C-Am
    ([[45,48,52,55,59],[53,57,60,64,67],[48,52,55,59,62],[55,59,62,65,69]], [33,41,36,43]),  # Am-F-C-G
]

def main():
    slug = sys.argv[1]
    tl = load(ROOT / "src" / "videos" / slug / "timeline.json")
    DUR = tl["total"] / FPS + 1.0
    h = zlib.crc32(slug.encode())
    chords, bass = PROGS[h % len(PROGS)]
    BPM = 92 + h % 9
    rng = np.random.default_rng(h % 1000)
    beat = 60 / BPM; bar = 4 * beat; N = int(SR * DUR)
    L = np.zeros(N); R = np.zeros(N)
    hz = lambda m: 440 * 2 ** ((m - 69) / 12)
    def add(sig, start, pan=0.5, g=1.0):
        i = max(0, int(start * SR)); j = min(N, i + len(sig))
        if j <= i: return
        s = sig[: j - i] * g
        L[i:j] += s * np.cos(pan * np.pi / 2); R[i:j] += s * np.sin(pan * np.pi / 2)
    for b in range(int(DUR / bar) + 1):
        c = chords[(b // 2) % 4]; st = b * bar
        if b % 2 == 0:
            n = int(2 * bar * SR); x = np.arange(n) / SR
            e = np.minimum(1, x / 1.2) * np.minimum(1, (2 * bar - x) / 1.0)
            for k, m in enumerate(c):
                f = hz(m + 12)
                s = sum(np.sin(2 * np.pi * f * (1 + dt) * x + rng.random() * 6) for dt in (-0.003, 0, 0.003)) / 3
                add((s + 0.25 * np.sin(4 * np.pi * f * x)) * e, st, pan=0.2 + 0.6 * k / 4, g=0.045)
            e2 = np.minimum(1, x / 0.05) * np.minimum(1, (2 * bar - x) / 0.3)
            add(np.sin(2 * np.pi * hz(bass[(b // 2) % 4]) * x) * e2, st, g=0.16)
        if b >= 1:
            pat = [0, 2, 4, 3, 1, 3, 4, 2]
            for s8 in range(8):
                if (b + s8) % 5 == 4: continue
                m = c[pat[s8]] + 24; n = int(1.6 * SR); x = np.arange(n) / SR
                env = np.minimum(1, x / 0.004) * np.exp(-x / 0.45)
                sig = (np.sin(2 * np.pi * hz(m) * x) + 0.3 * np.sin(4 * np.pi * hz(m) * x) * np.exp(-x / 0.15)) * env
                add(sig, st + s8 * beat / 2 + 0.012 * rng.standard_normal(), pan=0.3 + 0.4 * (s8 % 2), g=0.05)
        if b >= 2:
            for q in range(4):
                tq = st + q * beat
                if q in (0, 2):
                    n = int(0.35 * SR); x = np.arange(n) / SR; f = 50 + 70 * np.exp(-x / 0.03)
                    add(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x / 0.12), tq, g=0.22)
                else:
                    n = int(0.2 * SR); x = np.arange(n) / SR
                    nz = np.convolve(rng.standard_normal(n), np.ones(6) / 6, "same")
                    add(nz * np.exp(-x / 0.05) + 0.3 * np.sin(2 * np.pi * 190 * x) * np.exp(-x / 0.04), tq, g=0.05)
                for hh in (0, 0.5):
                    n = int(0.06 * SR); x = np.arange(n) / SR
                    nz = np.diff(rng.standard_normal(n), prepend=0)
                    add(nz * np.exp(-x / 0.015), tq + hh * beat, pan=0.65, g=0.018 if hh else 0.012)
    fade = np.ones(N); fi = int(1.5 * SR); fo = int(3 * SR)
    fade[:fi] = np.linspace(0, 1, fi); fade[-fo:] = np.linspace(1, 0, fo)
    y = np.stack([L * fade, R * fade], 1); y /= np.abs(y).max() * 1.12
    raw = content(slug) / "music_raw.wav"; sf.write(raw, y, SR)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(raw), "-af",
                    "lowpass=f=10000,aecho=0.8:0.6:60|110:0.25|0.18,loudnorm=I=-18:TP=-2", "-ar", str(SR),
                    str(content(slug) / "music.wav")], check=True)
    raw.unlink()
    print(f"musik OK: {DUR:.1f} dtk, {BPM} BPM, progresi #{h % len(PROGS)}")

if __name__ == "__main__":
    main()

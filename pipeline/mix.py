"""Gabungkan VO + musik (ducking) + efek suara menjadi public/<slug>/audio.mp3.

Pemakaian: python3 pipeline/mix.py <slug>
"""
import subprocess, sys
from common import FPS, ROOT, content, load

def main():
    slug = sys.argv[1]; d = content(slug)
    tl = load(ROOT / "src" / "videos" / slug / "timeline.json")
    T = tl["total"] / FPS; off = int(tl["voOffset"] * 1000)
    out = ROOT / "public" / slug / "audio.mp3"; out.parent.mkdir(parents=True, exist_ok=True)
    flt = (f"[0:a]aresample=48000,highpass=f=70,adelay={off}|{off},apad,atrim=0:{T},asplit[vo][sc];"
           f"[1:a]volume=0.5,atrim=0:{T},afade=t=out:st={T - 2.5}:d=2.5[mu];"
           "[mu][sc]sidechaincompress=threshold=0.03:ratio=5:attack=40:release=500[duck];"
           "[vo]pan=stereo|c0=c0|c1=c0[vos];"
           f"[2:a]atrim=0:{T},volume=0.42,pan=stereo|c0=c0|c1=c0[fx];"
           "[duck][vos][fx]amix=inputs=3:normalize=0,alimiter=limit=0.89,loudnorm=I=-14:TP=-1.5[out]")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(d / "vo.mp3"), "-i", str(d / "music.wav"), "-i", str(d / "sfx.wav"),
                    "-filter_complex", flt, "-map", "[out]", "-ar", "48000", "-b:a", "192k", str(out)], check=True)
    print(f"audio OK: {out.relative_to(ROOT)} ({T:.1f} dtk)")

if __name__ == "__main__":
    main()

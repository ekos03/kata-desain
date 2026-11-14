"""Buat voice over dengan TTS gratis lokal (Piper, suara wanita Bahasa Indonesia).

Pemakaian: python3 pipeline/tts.py <slug> [--force]
Input : content/<slug>/naskah.json
Output: content/<slug>/vo.mp3, content/<slug>/alignment.json (timestamp per huruf, format sama seperti ElevenLabs)

- Model diunduh otomatis sekali ke ~/.cache/video-arsitek/ dari rilis GitHub sherpa-onnx.
- Setelan "semangat & feminin": tempo sedikit cepat, intonasi lebih bervariasi, nada +1,5 semiton, EQ jernih.
- Timestamp: tiap kalimat disintesis terpisah sehingga awal kalimat tepat; huruf di dalam kalimat dibagi rata.
"""
import json, pathlib, re, subprocess, sys, tarfile, tempfile, urllib.request
from common import content, load, save, duration

MODEL_DIR = pathlib.Path.home() / ".cache" / "video-arsitek" / "vits-piper-id_ID-news_tts-medium"
MODEL = MODEL_DIR / "id_ID-news_tts-medium.onnx"
URL = "https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-id_ID-news_tts-medium.tar.bz2"
SR = 48000
SENT_GAP = 0.15   # jeda antarkalimat (detik)
SEG_GAP = 0.45    # jeda antarbagian
CHAIN = ",".join([
    "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse",
    "rubberband=pitch=1.0905:formant=shifted:pitchq=quality",
    "highpass=f=110", "equalizer=f=280:t=q:w=1.2:g=-3", "equalizer=f=3200:t=q:w=1.0:g=3.5",
    "equalizer=f=9000:t=h:w=4000:g=2.5", "deesser=i=0.35",
    "acompressor=threshold=-22dB:ratio=3.5:attack=4:release=60:makeup=4",
    "aecho=0.9:0.85:28|47:0.12|0.07", f"aresample={SR}",
])

def ensure_model():
    if MODEL.exists():
        return
    MODEL_DIR.parent.mkdir(parents=True, exist_ok=True)
    print("Mengunduh model TTS (sekali saja)...")
    with tempfile.NamedTemporaryFile(suffix=".tar.bz2") as tmp:
        urllib.request.urlretrieve(URL, tmp.name)
        with tarfile.open(tmp.name) as t:
            t.extractall(MODEL_DIR.parent)

def sentences(text):
    return [s for s in re.split(r"(?<=[.!?])\s+", text.strip()) if s]

def synth(text, out):
    raw = out.with_suffix(".raw.wav")
    subprocess.run([sys.executable, "-m", "piper", "-m", str(MODEL), "-c", str(MODEL) + ".json", "-f", str(raw),
                    "--length-scale", "0.82", "--noise-scale", "0.8", "--noise-w-scale", "0.9", "--sentence-silence", "0"],
                   input=text.encode(), check=True, capture_output=True)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(raw), "-af", CHAIN, "-ac", "1", str(out)], check=True)
    raw.unlink()
    return duration(out)

def main():
    slug = sys.argv[1]; d = content(slug)
    if (d / "vo.mp3").exists() and (d / "alignment.json").exists() and "--force" not in sys.argv:
        print("VO sudah ada, dilewati (pakai --force untuk membuat ulang)."); return
    ensure_model()
    n = load(d / "naskah.json")
    work = pathlib.Path(tempfile.mkdtemp())
    pieces = []; full = ""; starts = []; ends = []; t = 0.0
    for si, seg in enumerate(n["segments"]):
        if si:
            full += "\n\n"; starts += [t, t]; ends += [t, t]; t += SEG_GAP - SENT_GAP
        for k, s in enumerate(sentences(seg["text"])):
            if k:
                full += " "; starts.append(t); ends.append(t)
            wav = work / f"{len(pieces):03d}.wav"
            dur = synth(s, wav)
            pieces.append((wav, t))
            for i in range(len(s)):  # bagi rata per huruf
                starts.append(t + dur * i / len(s)); ends.append(t + dur * (i + 1) / len(s))
            full += s; t += dur + SENT_GAP
    # gabungkan dengan jeda presisi
    inputs = []; flt = []
    for i, (wav, st) in enumerate(pieces):
        inputs += ["-i", str(wav)]; ms = int(st * 1000)
        flt.append(f"[{i}:a]adelay={ms}[a{i}]")
    flt.append("".join(f"[a{i}]" for i in range(len(pieces))) + f"amix=inputs={len(pieces)}:normalize=0,atrim=0:{t:.3f}[out]")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *inputs, "-filter_complex", ";".join(flt), "-map", "[out]",
                    "-ar", str(SR), "-b:a", "192k", str(d / "vo.mp3")], check=True)
    assert len(starts) == len(full), (len(starts), len(full))
    save(d / "alignment.json", {"text": full, "engine": "piper-id_ID-news_tts-medium",
                                "alignment": {"characters": list(full), "character_start_times_seconds": starts,
                                              "character_end_times_seconds": ends}})
    print(f"VO OK (TTS lokal): {len(full)} karakter, durasi {t:.2f} dtk")

if __name__ == "__main__":
    main()

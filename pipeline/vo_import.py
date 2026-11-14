"""Pasang VO buatan sendiri (mis. mp3 dari ElevenLabs) ke video, lalu selaraskan dengan naskah.

Pemakaian: python3 pipeline/vo_import.py <slug> <file.mp3>
Lalu jalankan: timeline.py, music.py, sfx.py, mix.py, render.sh (atau pipeline/rebuild.sh <slug>).

Cara kerja: audio dipotong per jeda, tiap potongan ditranskripsikan Whisper (lokal), kata hasil transkripsi
dicocokkan dengan kata naskah (difflib), lalu setiap huruf naskah diberi waktu -> content/<slug>/alignment.json.
Naskah VO harus sama (atau hampir sama) dengan naskah.json.
"""
import difflib, pathlib, re, shutil, subprocess, sys, tarfile, tempfile, unicodedata, urllib.request
import numpy as np, soundfile as sf
from common import content, load, save

ASR_DIR = pathlib.Path.home() / ".cache" / "video-arsitek" / "sherpa-onnx-whisper-small"
ASR_URL = "https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-whisper-small.tar.bz2"

def ensure_asr():
    if (ASR_DIR / "small-encoder.int8.onnx").exists():
        return
    ASR_DIR.parent.mkdir(parents=True, exist_ok=True)
    print("Mengunduh model Whisper (sekali saja)...")
    with tempfile.NamedTemporaryFile(suffix=".tar.bz2") as tmp:
        urllib.request.urlretrieve(ASR_URL, tmp.name)
        with tarfile.open(tmp.name) as t:
            t.extractall(ASR_DIR.parent)

def norm(w):
    w = unicodedata.normalize("NFKD", w.lower())
    return re.sub(r"[^a-z0-9]", "", w)

def speech_chunks(path, total):
    log = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(path), "-af", "silencedetect=noise=-38dB:d=0.22", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    st = [float(v) for v in re.findall(r"silence_start: ([\d.]+)", log)]
    en = [float(v) for v in re.findall(r"silence_end: ([\d.]+)", log)]
    bounds = [0.0] + en; ends = st + [total]
    chunks = []
    for a in bounds:
        nxt = [e for e in ends if e > a + 0.05]
        if nxt:
            chunks.append((a, nxt[0]))
    return [(a, b) for a, b in chunks if b - a > 0.15]

def main():
    slug, src = sys.argv[1], pathlib.Path(sys.argv[2])
    d = content(slug); n = load(d / "naskah.json")
    shutil.copy(src, d / "vo.mp3")
    ensure_asr()
    import sherpa_onnx
    D = str(ASR_DIR / "small-")
    rec = sherpa_onnx.OfflineRecognizer.from_whisper(encoder=D + "encoder.int8.onnx", decoder=D + "decoder.int8.onnx",
                                                     tokens=D + "tokens.txt", language="id", task="transcribe", num_threads=4)
    wav = d / "vo16.wav"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(src), "-ac", "1", "-ar", "16000", str(wav)], check=True)
    x, sr = sf.read(wav); wav.unlink(); total = len(x) / sr
    # kata transkripsi + perkiraan waktu (proporsional dalam potongan)
    hyp = []
    for a, b in speech_chunks(src, total):
        s = rec.create_stream(); s.accept_waveform(sr, x[int(a * sr):int(b * sr)]); rec.decode_stream(s)
        txt = s.result.text.strip(); words = txt.split()
        if not words: continue
        L = max(1, len(txt)); pos = 0
        for w in words:
            i = txt.index(w, pos); pos = i + len(w)
            hyp.append((norm(w), a + (b - a) * i / L))
    # kata naskah
    full = "\n\n".join(seg["text"].strip() for seg in n["segments"])
    ref = [(m.start(), m.end(), norm(m.group())) for m in re.finditer(r"\S+", full)]
    sm = difflib.SequenceMatcher(None, [r[2] for r in ref], [h[0] for h in hyp], autojunk=False)
    t = [None] * len(ref)
    for blk in sm.get_matching_blocks():
        for k in range(blk.size):
            t[blk.a + k] = hyp[blk.b + k][1]
    # sisipkan waktu kata yang tidak cocok (interpolasi linier di antara kata yang cocok)
    known = [i for i, v in enumerate(t) if v is not None]
    if len(known) < len(ref) * 0.4:
        raise SystemExit(f"Hanya {len(known)}/{len(ref)} kata cocok — apakah VO sesuai naskah?")
    idx = np.arange(len(ref))
    t = np.interp(idx, known, [t[i] for i in known])
    # waktu per huruf
    starts = [0.0] * len(full); ends = [0.0] * len(full)
    for k, (a, b, _) in enumerate(ref):
        nxt = t[k + 1] if k + 1 < len(ref) else min(total, t[k] + 0.5)
        dur = max(0.05, nxt - t[k])
        for c in range(a, b):
            starts[c] = t[k] + dur * 0.85 * (c - a) / (b - a); ends[c] = t[k] + dur * 0.85 * (c - a + 1) / (b - a)
        e = b
        while e < len(full) and full[e].isspace():
            starts[e] = ends[e] = ends[b - 1]; e += 1
    save(d / "alignment.json", {"text": full, "engine": f"import:{src.name}",
                                "alignment": {"characters": list(full), "character_start_times_seconds": starts,
                                              "character_end_times_seconds": ends}})
    print(f"VO terpasang: {src.name} ({total:.1f} dtk); {len(known)}/{len(ref)} kata naskah cocok langsung.")

if __name__ == "__main__":
    main()

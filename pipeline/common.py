"""Utilitas bersama pipeline KATA DESAIN."""
import json, os, subprocess, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
FPS = 30
SR = 48000

def content(slug):
    return ROOT / "content" / slug

def load(path):
    return json.load(open(path, encoding="utf-8"))

def save(path, data):
    pathlib.Path(path).parent.mkdir(parents=True, exist_ok=True)
    json.dump(data, open(path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)

def duration(path):
    return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)]))

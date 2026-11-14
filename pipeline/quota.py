"""Tampilkan sisa kuota karakter ElevenLabs."""
import json, urllib.request
r = json.load(urllib.request.urlopen(urllib.request.Request("https://api.elevenlabs.io/v1/user/subscription", headers={"xi-api-key": "proxy-injected"}), timeout=30))
used, lim = r.get("character_count"), r.get("character_limit")
print(f"Paket {r.get('tier')}: terpakai {used}/{lim}, sisa {lim - used} karakter")

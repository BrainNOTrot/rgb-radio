import json
import os
import subprocess
from datetime import date

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

ARCHIVE = os.path.join(ROOT, "archive")
COLORS = os.path.join(ARCHIVE, "colors")
STATS = os.path.join(ARCHIVE, "stats.json")


def load_stats():
    with open(STATS, "r") as f:
        return json.load(f)


def save_stats(stats):
    with open(STATS, "w") as f:
        json.dump(stats, f, indent=2)


stats = load_stats()

hex_code = input("HEX (without #): ").strip().upper()

if len(hex_code) != 6:
    print("HEX must be exactly 6 characters.")
    exit()

folder = hex_code[:2]
folder_path = os.path.join(COLORS, folder)
os.makedirs(folder_path, exist_ok=True)

filename = os.path.join(folder_path, f"{hex_code}.json")

if os.path.exists(filename):
    print("Color already exists.")
    exit()

name = input("Color name: ").strip()
song = input("Song: ").strip()
duration = input("Duration (e.g. 4:11): ").strip()
license_name = input("License: ").strip()
youtube = input("YouTube URL: ").strip()

artist = "RGB RADIO"
upload_date = str(date.today())

r = int(hex_code[0:2], 16)
g = int(hex_code[2:4], 16)
b = int(hex_code[4:6], 16)

video_number = stats["uploaded"] + 1

data = {
    "hex": "#" + hex_code,
    "rgb": [r, g, b],
    "name": name,
    "title": f"#{hex_code} — {name}",
    "videoNumber": video_number,
    "youtubeUrl": youtube,
    "song": song,
    "artist": artist,
    "duration": duration,
    "license": license_name,
    "uploaded": upload_date
}

with open(filename, "w") as f:
    json.dump(data, f, indent=2)

stats["uploaded"] += 1
stats["remaining"] = stats["totalColors"] - stats["uploaded"]
stats["latest"] = "#" + hex_code
stats["latestVideo"] = video_number

save_stats(stats)

print("\n✓ Archive updated")

choice = input("\nPush to GitHub now? [Y/n]: ").strip().lower()

if choice in ("", "y", "yes"):
    subprocess.run(["git", "add", "."], cwd=ROOT)
    subprocess.run(
        ["git", "commit", "-m", f"Added #{hex_code}"],
        cwd=ROOT
    )
    subprocess.run(["git", "push"], cwd=ROOT)
    print("\n✓ GitHub updated")
else:
    print("\nSkipped GitHub push.")
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('constants/videoData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

vids = re.findall(r'"youtubeVideoId":\s*"([^"]+)"', text)
print(f"Total video IDs in videoData.ts: {len(vids)}")
print("Sample unique IDs:", list(set(vids))[:15])

# Find the first few lectures for GSEB / School
lines = text.split('\n')
for i, l in enumerate(lines[:80]):
    if any(k in l for k in ['id', 'title', 'youtubeVideoId', 'grade']):
        print(l)


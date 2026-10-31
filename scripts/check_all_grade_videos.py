import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

with open('constants/academicData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

grades = ['7', '8', '9', '10', '11', '12', 'college']
for g in grades:
    marker = f'"grade": "{g}"'
    idx = text.find(marker)
    if idx != -1:
        snippet = text[idx:idx+15000]
        vids = re.findall(r'"youtubeVideoId":\s*"([^"]+)"', snippet)
        print(f"Grade {g}: Found {len(vids)} video references. Unique: {set(vids[:8])}")
    else:
        print(f"Grade {g}: NOT FOUND")


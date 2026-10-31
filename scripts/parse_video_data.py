import sys
import json
import re

sys.stdout.reconfigure(encoding='utf-8')

with open('constants/videoData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Find all lectures and their grades
lectures = re.findall(r'"id":\s*"([^"]+)".*?"grades":\s*\[([^\]]+)\].*?"category":\s*"([^"]+)".*?"title":\s*"([^"]+)".*?"youtubeVideoId":\s*"([^"]+)"', text, re.DOTALL)
print(f"Total lectures parsed: {len(lectures)}")
for lid, g, cat, title, yid in lectures:
    clean_g = [x.strip().replace('"', '') for x in g.split(',')]
    print(f"{lid} | Grades: {clean_g} | {cat} | {yid} | {title[:35]}")


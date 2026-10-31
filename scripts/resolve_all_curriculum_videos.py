import urllib.request
import urllib.parse
import re
import json
import os
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

sys.stdout.reconfigure(encoding='utf-8')

CACHE_FILE = os.path.join(os.path.dirname(__file__), 'resolved_grade_videos.json')

cache = {}
if os.path.exists(CACHE_FILE):
    try:
        with open(CACHE_FILE, 'r', encoding='utf-8') as f:
            cache = json.load(f)
        print(f"Loaded {len(cache)} cached video resolutions.")
    except Exception as e:
        print(f"Cache load warning: {e}")

def search_youtube(query):
    url = f"https://www.youtube.com/results?search_query={urllib.parse.quote(query)}"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'})
    try:
        with urllib.request.urlopen(req, timeout=8) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            vids = re.findall(r'"videoId":"([a-zA-Z0-9_-]{11})"', html)
            seen = set()
            res = []
            for v in vids:
                if v not in seen:
                    seen.add(v)
                    res.append(v)
            return res[:6]
    except Exception:
        return []

def verify_oembed(vid):
    url = f'https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={vid}&format=json'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=4) as r:
            data = json.loads(r.read().decode('utf-8'))
            title = data.get('title', '')
            author = data.get('author_name', '')
            if 'Shorts' in author or '#shorts' in title.lower():
                return None, None
            return title, author
    except Exception:
        return None, None

def resolve_chapter_task(item):
    grade = item['grade']
    subject_name = item['subject_name']
    subject_guj = item['subject_guj']
    chapter_num = item['chapter_num']
    chapter_title = item['chapter_title']
    chapter_guj = item['chapter_guj']

    cache_key = f"{grade}_{subject_name}_{chapter_num}"
    if cache_key in cache and cache[cache_key].get('youtubeVideoId'):
        return cache_key, cache[cache_key]

    queries = [
        f"dhoran {grade} {subject_guj} chapter {chapter_num} {chapter_guj}",
        f"std {grade} {subject_guj} ch {chapter_num}",
        f"dhoran {grade} {subject_guj} path {chapter_num}",
        f"std {grade} {subject_name} chapter {chapter_num} GSEB"
    ]

    for q in queries:
        candidate_ids = search_youtube(q)
        for vid in candidate_ids:
            title, author = verify_oembed(vid)
            if title and author:
                res = {
                    'grade': grade,
                    'subject': subject_name,
                    'subjectGujarati': subject_guj,
                    'chapterNumber': chapter_num,
                    'chapterTitle': chapter_title,
                    'chapterTitleGujarati': chapter_guj,
                    'youtubeVideoId': vid,
                    'videoTitle': title,
                    'author': author,
                    'duration': '22m'
                }
                return cache_key, res

    return cache_key, None

# Load ACADEMIC_CURRICULUM
with open(os.path.join(os.path.dirname(__file__), '../backend/routes/academicDataSeed.js'), 'r', encoding='utf-8') as f:
    js_content = f.read()

start_marker = 'const ACADEMIC_CURRICULUM = '
end_marker = ';\n\nmodule.exports ='
start_idx = js_content.find(start_marker) + len(start_marker)
end_idx = js_content.rfind(end_marker)
curriculum_json = js_content[start_idx:end_idx].strip()
curriculum = json.loads(curriculum_json)

tasks = []
for grade, grade_data in curriculum.items():
    if grade == 'college':
        continue
    for subject in grade_data.get('subjects', []):
        for chap in subject.get('chapters', []):
            tasks.append({
                'grade': grade,
                'subject_name': subject.get('name', ''),
                'subject_guj': subject.get('nameGujarati', subject.get('name', '')),
                'chapter_num': chap.get('chapterNumber', 1),
                'chapter_title': chap.get('title', ''),
                'chapter_guj': chap.get('titleGujarati', chap.get('title', ''))
            })

print(f"Total chapters to resolve: {len(tasks)}")

resolved_count = 0
with ThreadPoolExecutor(max_workers=6) as executor:
    future_to_task = {executor.submit(resolve_chapter_task, t): t for t in tasks}
    for future in as_completed(future_to_task):
        cache_key, res = future.result()
        if res:
            cache[cache_key] = res
            resolved_count += 1
            if resolved_count % 15 == 0 or resolved_count == len(tasks):
                with open(CACHE_FILE, 'w', encoding='utf-8') as f:
                    json.dump(cache, f, ensure_ascii=False, indent=2)
                print(f"Progress: {resolved_count}/{len(tasks)} chapters resolved...")

with open(CACHE_FILE, 'w', encoding='utf-8') as f:
    json.dump(cache, f, ensure_ascii=False, indent=2)

print(f"\nFinished: {resolved_count}/{len(tasks)} chapters resolved and saved to {CACHE_FILE}")

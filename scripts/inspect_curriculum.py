import sys
import re
import json

sys.stdout.reconfigure(encoding='utf-8')

with open('constants/academicData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's inspect the ACADEMIC_CURRICULUM object
start_marker = "export const ACADEMIC_CURRICULUM: Record<AcademicGrade, GradeCurriculum> = "
start_idx = text.find(start_marker)
if start_idx == -1:
    print("Could not find start marker")
    sys.exit(1)

start_idx += len(start_marker)
end_marker = "\n};\n\nexport const SAMPLE_PAPERS_DATA"
end_idx = text.find(end_marker, start_idx)
if end_idx == -1:
    print("Could not find end marker, finding next export")
    end_marker = "\n};\n"
    end_idx = text.find(end_marker, start_idx)

curriculum_json_str = text[start_idx:end_idx+2].strip()
print(f"Extracted curriculum string length: {len(curriculum_json_str)}")

# Try to parse as json or use regex
try:
    # Notice it might have trailing semicolon or comments
    clean_json = curriculum_json_str.rstrip(';')
    data = json.loads(clean_json)
    print("Successfully parsed ACADEMIC_CURRICULUM as JSON!")
    for grade, gdata in data.items():
        print(f"\n--- Grade {grade}: {gdata.get('title')} ---")
        subjects = gdata.get('subjects', [])
        print(f"  Total subjects: {len(subjects)}")
        for subj in subjects:
            chaps = subj.get('chapters', [])
            has_official_pdf = bool(subj.get('officialTextbookPdf'))
            chaps_with_videos = sum(1 for c in chaps if c.get('videos') and len(c['videos']) > 0)
            chaps_with_pdf = sum(1 for c in chaps if c.get('textbookPdfUrl'))
            print(f"    Subject {subj.get('id')} ({subj.get('name')} / {subj.get('nameGujarati')}):")
            print(f"      Chapters: {len(chaps)} | Chaps with videos: {chaps_with_videos}/{len(chaps)} | Chaps with PDF: {chaps_with_pdf}/{len(chaps)} | Subject PDF: {has_official_pdf}")
            # Check first chapter videos
            if len(chaps) > 0:
                first_c = chaps[0]
                vids = first_c.get('videos', [])
                if vids:
                    print(f"      First chapter video: {vids[0].get('youtubeVideoId')} - {vids[0].get('title')[:40]}")
                else:
                    print(f"      NO videos in first chapter!")
except Exception as e:
    print(f"JSON parse error: {e}")
    # Regex fallback
    print("Checking with regex...")
    for g in ['6', '7', '8', '9', '10', '11', '12', 'college']:
        pos = text.find(f'"{g}":')
        print(f"Grade {g} at pos: {pos}")

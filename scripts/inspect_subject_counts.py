import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

with open('constants/academicData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

start_marker = 'export const ACADEMIC_CURRICULUM: Record<AcademicGrade, GradeCurriculum> = '
start_idx = text.find(start_marker) + len(start_marker)
end_marker = '\n};\n\nexport const SAMPLE_PAPERS_DATA'
end_idx = text.find(end_marker, start_idx)

curriculum_json_str = text[start_idx:end_idx+2].strip().rstrip(';')
data = json.loads(curriculum_json_str)

for g in ['6', '7', '8', '9', '10', '11', '12']:
    print(f'=== Grade {g} ===')
    for s in data[g]['subjects']:
        sid = s['id']
        sname = s['name']
        sname_gu = s.get('nameGujarati', '')
        ch_count = len(s['chapters'])
        pdf = s.get('officialTextbookPdf', '')
        print(f"  {sid}: {sname} ({sname_gu}) -> {ch_count} chaps | PDF: {pdf}")


import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

with open('constants/academicData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

start_marker = "export const ACADEMIC_CURRICULUM: Record<AcademicGrade, GradeCurriculum> = "
start_idx = text.find(start_marker) + len(start_marker)
end_marker = "\n};\n\nexport const SAMPLE_PAPERS_DATA"
end_idx = text.find(end_marker, start_idx)

curriculum_json_str = text[start_idx:end_idx+2].strip().rstrip(';')
data = json.loads(curriculum_json_str)

for grade in ['8', '9', '10', '11', '12']:
    gdata = data.get(grade, {})
    print(f"\n================ GRADE {grade} ================")
    for subj in gdata.get('subjects', []):
        print(f"Subject: {subj.get('id')} ({subj.get('name')}) - Official PDF: {subj.get('officialTextbookPdf')}")
        chaps = subj.get('chapters', [])
        for c in chaps:
            print(f"   Ch {c.get('chapterNumber')}: {c.get('title')} -> PDF: {c.get('textbookPdfUrl')}")


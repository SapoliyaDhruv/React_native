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

pdf_urls = set()
for grade in ['6', '7', '8', '9', '10', '11', '12']:
    gdata = data.get(grade, {})
    for subj in gdata.get('subjects', []):
        if subj.get('officialTextbookPdf'):
            pdf_urls.add((grade, subj.get('name'), 'subject', subj.get('officialTextbookPdf')))
        for c in subj.get('chapters', []):
            if c.get('textbookPdfUrl'):
                pdf_urls.add((grade, subj.get('name'), f"ch_{c.get('chapterNumber')}", c.get('textbookPdfUrl')))

print(f"Total unique PDF URLs: {len(pdf_urls)}")
for grade, subj, item, url in sorted(list(pdf_urls))[:30]:
    print(f"Grade {grade} | {subj} | {item} | {url}")


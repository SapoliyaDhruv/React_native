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

for grade in ['6', '7', '8', '9', '10', '11', '12']:
    gdata = data.get(grade, {})
    print(f"\n================ GRADE {grade} ================")
    subjects = gdata.get('subjects', [])
    for subj in subjects:
        s_id = subj.get('id')
        s_name = subj.get('name')
        official_pdf = subj.get('officialTextbookPdf')
        chaps = subj.get('chapters', [])
        print(f"\nSubject: {s_id} - {s_name} (Total chapters: {len(chaps)})")
        print(f"  Official Textbook PDF: {official_pdf}")
        missing_vids = []
        missing_pdfs = []
        for c in chaps:
            c_num = c.get('chapterNumber')
            c_title = c.get('title')
            vids = c.get('videos', [])
            pdf = c.get('textbookPdfUrl')
            if not vids or any(not v.get('youtubeVideoId') for v in vids):
                missing_vids.append((c_num, c_title))
            if not pdf:
                missing_pdfs.append((c_num, c_title))
        if missing_vids:
            print(f"  MISSING VIDEOS in {len(missing_vids)} chapters: {missing_vids[:3]}...")
        else:
            print(f"  ALL {len(chaps)} chapters have videos!")
        if missing_pdfs:
            print(f"  MISSING PDF in {len(missing_pdfs)} chapters: {missing_pdfs[:3]}...")
        else:
            print(f"  ALL {len(chaps)} chapters have textbookPdfUrl!")


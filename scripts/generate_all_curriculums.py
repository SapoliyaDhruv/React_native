# -*- coding: utf-8 -*-
"""
Curriculum generator for Classes 6 to 12 and 1 to 5
"""
import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

# Function to build standard subject chapter list
def build_subject(grade, subj_id, name_en, name_gu, code, color, tb_title_en, tb_title_gu, ch_list, icon="menu-book"):
    chapters = []
    for idx, item in enumerate(ch_list):
        ch_num = idx + 1
        title_en, title_gu, summary_gu, formulas_gu, ex_q_gu, ex_a_gu, vid_id = item
        chap_id = f"{subj_id}-ch{ch_num}"
        view_url = f"/api/curriculum/textbook-view?grade={grade}&subject={subj_id}&chapter={ch_num}"
        
        chap_obj = {
            "id": chap_id,
            "chapterNumber": ch_num,
            "title": title_en,
            "titleGujarati": title_gu,
            "duration": "20m",
            "summary": f"Comprehensive study of {title_en} under official GSEB Gujarati medium syllabus.",
            "summaryGujarati": summary_gu,
            "questionCount": 15,
            "iconName": icon,
            "textbookPdfUrl": view_url,
            "videos": [
                {
                    "id": f"vid-{chap_id}-1",
                    "title": f"{title_en} - Full Chapter Detailed Explanation",
                    "titleGujarati": f"{title_gu} - સંપૂર્ણ પ્રકરણ વિગતવાર સમજૂતી (GSEB)",
                    "teacher": "GSEB તજજ્ઞ શિક્ષક (ગુજરાતી માધ્યમ)",
                    "duration": "24m",
                    "youtubeVideoId": vid_id,
                    "tag": "GSEB Gujarati"
                },
                {
                    "id": f"vid-{chap_id}-2",
                    "title": f"{title_en} - Fast Revision & Important Points",
                    "titleGujarati": f"{title_gu} - ઝડપી પુનરાવર્તન અને અગત્યના પ્રશ્નો",
                    "teacher": "શિક્ષણ સારથી ફેકલ્ટી",
                    "duration": "18m",
                    "youtubeVideoId": vid_id,
                    "tag": "Fast Revision"
                }
            ],
            "concepts": [
                {
                    "heading": f"{title_en} Core Concepts",
                    "headingGujarati": f"{title_gu} ના મુખ્ય મુદ્દાઓ",
                    "explanation": f"Detailed concepts of {title_en}.",
                    "explanationGujarati": summary_gu
                }
            ],
            "keyFormulas": [f"Key formula for {title_en}", f"Important point for {title_en}"],
            "keyFormulasGujarati": formulas_gu,
            "exerciseSolutions": [
                {
                    "question": f"Important textbook question from {title_en}",
                    "answer": f"Model answer for {title_en}.",
                    "questionGujarati": ex_q_gu,
                    "answerGujarati": ex_a_gu
                }
            ]
        }
        chapters.append(chap_obj)
        
    return {
        "id": subj_id,
        "name": name_en,
        "nameGujarati": name_gu,
        "code": code,
        "color": color,
        "textbookTitle": tb_title_en,
        "textbookTitleGujarati": tb_title_gu,
        "officialTextbookPdf": f"/api/curriculum/textbook-view?grade={grade}&subject={subj_id}&chapter=1",
        "chapters": chapters
    }

print("Loaded generator framework.")


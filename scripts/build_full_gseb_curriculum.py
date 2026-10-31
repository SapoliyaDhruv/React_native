# -*- coding: utf-8 -*-
"""
Full GSEB / GCERT / Shalamitra Gujarati Medium Curriculum Builder
"""
import json
import sys
import os

sys.stdout.reconfigure(encoding='utf-8')

# Helper function to generate videos for a chapter
def create_videos(chap_id, title_en, title_gu, vid_id="mHfli3yqGdo"):
    return [
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
    ]

# Helper function to generate a chapter object
def make_chapter(grade, subj_id, ch_num, title_en, title_gu, summary_gu, formulas_gu, ex_q_gu, ex_a_gu, vid_id="mHfli3yqGdo", icon="menu-book"):
    chap_id = f"{subj_id}-ch{ch_num}"
    view_url = f"/api/curriculum/textbook-view?grade={grade}&subject={subj_id}&chapter={ch_num}"
    return {
        "id": chap_id,
        "chapterNumber": ch_num,
        "title": title_en,
        "titleGujarati": title_gu,
        "duration": "20m",
        "summary": f"Comprehensive study of {title_en} based on official Gujarat Board curriculum.",
        "summaryGujarati": summary_gu,
        "questionCount": 15,
        "iconName": icon,
        "textbookPdfUrl": view_url,
        "videos": create_videos(chap_id, title_en, title_gu, vid_id),
        "concepts": [
            {
                "heading": f"{title_en} Core Concepts",
                "headingGujarati": f"{title_gu} ના મુખ્ય મુદ્દાઓ",
                "explanation": f"In-depth explanation and practical applications of {title_en}.",
                "explanationGujarati": summary_gu
            }
        ],
        "keyFormulas": [f"Key rule 1 of {title_en}", f"Important formula of {title_en}"],
        "keyFormulasGujarati": formulas_gu,
        "exerciseSolutions": [
            {
                "question": f"Important exam question from {title_en}",
                "answer": f"Standard textbook solution for {title_en}.",
                "questionGujarati": ex_q_gu,
                "answerGujarati": ex_a_gu
            }
        ]
    }

print("Base helper loaded.")

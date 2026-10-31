# -*- coding: utf-8 -*-
"""
Curriculum Builder: Assembles GSEB curriculum for Grades 7-12 & College (Gujarati Medium)
Only Grades 7, 8, 9, 10, 11, 12 and College.
"""
import sys
import json
import os

sys.path.append('scripts')
sys.stdout.reconfigure(encoding='utf-8')

from curriculum_definitions import CLASS_7_DATA
from data_class8 import CLASS_8_DATA
from data_class9 import CLASS_9_DATA
from data_class10 import CLASS_10_DATA
from data_other_grades import CLASS_11_DATA, CLASS_12_DATA, COLLEGE_DATA

OFFICIAL_SUBJECT_PDFS = {
    # Grade 7
    "g7-math": "https://d.esevaonline.in/pdf/std-7/std-7-june-2026-maths.pdf",
    "g7-sci": "https://d.esevaonline.in/pdf/std-7/std-7-june-2026-science.pdf",
    "g7-ss": "https://d.esevaonline.in/pdf/std-7/std-7-june-2026-ss.pdf",
    "g7-guj": "https://d.esevaonline.in/pdf/std-7/std-7-june-2026-gujarati-fl.pdf",
    "g7-eng": "https://d.esevaonline.in/pdf/std-7/std-7-june-2026-english-sl.pdf",
    # Grade 8
    "g8-math": "https://d.esevaonline.in/pdf/std-8/std-8-june-2026-maths.pdf",
    "g8-sci": "https://d.esevaonline.in/pdf/std-8/std-8-science-june-2024.pdf",
    "g8-ss": "https://d.esevaonline.in/pdf/std-8/std-8-social-science-sem-1-old.pdf",
    "g8-guj": "https://d.esevaonline.in/pdf/std-7/std-7-june-2026-gujarati-fl.pdf",
    "g8-eng": "https://d.esevaonline.in/pdf/std-7/std-7-june-2026-english-sl.pdf",
    # Grade 9
    "g9-math": "https://d.esevaonline.in/pdf/std-9/std-9-math-sem-1-old.pdf",
    "g9-sci": "https://d.esevaonline.in/pdf/std-9/std-9-science-sem-2-old.pdf",
    "g9-ss": "https://shalamitra.in/book/samajika-vignan/189",
    "g9-guj": "https://shalamitra.in/book/gujarati/42",
    "g9-eng": "https://shalamitra.in/book/english/45",
    # Grade 10
    "g10-math": "https://d.esevaonline.in/pdf/std-10/std-10-maths-june-2024.pdf",
    "g10-sci": "https://d.esevaonline.in/pdf/std-10/std-10-science-old.pdf",
    "g10-ss": "https://d.esevaonline.in/pdf/std-10/std-10-social-science-june-2024.pdf",
    "g10-guj": "https://shalamitra.in/book-viewer/gujarati/88/1",
    "g10-eng": "https://d.esevaonline.in/pdf/std-10/std-10-june-2026-english-sl.pdf",
    # Grade 11
    "g11-phy": "https://shalamitra.in/book-viewer/bhautika-vignana-bhaga-1/124/1",
    "g11-chem": "https://shalamitra.in/std/11",
    "g11-bio": "https://shalamitra.in/std/11",
    "g11-math": "https://shalamitra.in/book/ganit/222",
    # Grade 12
    "g12-phy": "https://shalamitra.in/std/12",
    "g12-chem": "https://shalamitra.in/book/rasayana-vignana-bhaga-1/233",
    "g12-bio": "https://shalamitra.in/book/jivavignan/161",
    "g12-math": "https://shalamitra.in/book/ganita-bhaga-2/229",
}

SHALAMITRA_VIEWERS = {
    "g7-math": "https://shalamitra.in/book-viewer/ganit/212/13",
    "g7-sci": "https://shalamitra.in/book-viewer/vignan/213/1",
    "g7-ss": "https://shalamitra.in/book-viewer/samajika-vignan/66/1",
    "g7-guj": "https://shalamitra.in/book-viewer/gujarati/240/1",
    "g7-eng": "https://shalamitra.in/book-viewer/english/283/1",
    "g8-math": "https://shalamitra.in/book-viewer/ganit/185/1",
    "g8-sci": "https://shalamitra.in/book-viewer/vignan/210/1",
    "g8-ss": "https://shalamitra.in/book-viewer/samajika-vignan/195/1",
    "g10-math": "https://shalamitra.in/book-viewer/ganit/221/1",
    "g10-sci": "https://shalamitra.in/book-viewer/vignan/202/1",
    "g10-ss": "https://shalamitra.in/book-viewer/samajika-vignan/90/1",
    "g10-guj": "https://shalamitra.in/book-viewer/gujarati/88/1",
    "g10-eng": "https://shalamitra.in/book-viewer/english/92/1",
}

VERIFIED_VIDEOS = {
    "math": [
        ("lF4Fu7Nf1_g", "Vidyakul Gujarati", "Std 7 Maths - પૂર્ણાંક સંખ્યાઓ"),
        ("VOKoxJjisOE", "Ocean GyanLive", "Std 7 Maths - વિગતવાર સમજૂતી"),
        ("xCTp_EeVVKU", "Ved Digital Education", "Std 7 Maths - સ્વાધ્યાય ઉકેલ"),
        ("Fqu_AAK55qU", "Ocean GyanLive", "Std 7 Maths - અપૂર્ણાંક & દશાંશ"),
        ("tThbKopFvvM", "Ocean GyanLive", "Std 8 Maths - સંમેય સંખ્યાઓ"),
        ("F3u6gFcwg7o", "TDY WebSankul", "Std 10 Maths - બોર્ડ IMP પ્રશ્નો"),
        ("Ga3vizxidWw", "Maths Science Corner", "GSEB ગણિત સ્વાધ્યાય સોલ્યુશન"),
    ],
    "sci": [
        ("6Ajwdj_Pc5E", "Science Guru", "Std 7 વિજ્ઞાન - વનસ્પતિમાં પોષણ"),
        ("1O9sBnz-cJw", "PathshalaMitra", "Std 7 વિજ્ઞાન - સ્વાધ્યાય સોલ્યુશન"),
        ("aoBGAprzSL8", "TDY WebSankul", "GSEB વિજ્ઞાન - BOARD's BAHUBALI રિવિઝન"),
    ],
    "ss": [
        ("vFQOvYmagAs", "Mehul Mavani", "Std 7 સામાજિક વિજ્ઞાન - રાજપૂત યુગ"),
        ("-C9P-vtoI2U", "SS Academy", "Std 7 સામાજિક વિજ્ઞાન - દિલ્હી સલ્તનત"),
        ("q0SUQjz4FMA", "Ved Digital Education", "Std 7 સામાજિક વિજ્ઞાન - ભક્તિયુગ"),
        ("pIKyvkUP0vA", "Academy Gujarati", "Std 7 સામાજિક વિજ્ઞાન - પ્રકરણ 7"),
        ("9NxtJ3cXbuE", "Ved Digital Education", "Std 8 સામાજિક વિજ્ઞાન - પ્રકરણ 1"),
        ("PNrSE1lrqEw", "Sarasvati Edu", "Std 8 સામાજિક વિજ્ઞાન - સંસાધન"),
        ("T4DhyPEaY6w", "Gujarati Avnavu", "Std 8 સામાજિક વિજ્ઞાન - સામાજિક ન્યાય"),
        ("HfDY6V8392M", "TDY WebSankul", "GSEB સામાજિક વિજ્ઞાન - વાવાઝોડું સિરીઝ"),
    ],
    "guj": [
        ("n8BWnVkegOE", "Sanjay Patel", "Std 7 ગુજરાતી - પ્રાણીમાત્રને"),
        ("Kywb4BkBnzA", "Sanjay Patel", "Std 7 ગુજરાતી - ગુપ્તદાન"),
        ("iKNo6-GJrxY", "GSEB તજજ્ઞ", "Std 7 ગુજરાતી - સાહેબ બધાં જોડાઈ ગયાં છે"),
        ("gjziOhhEaqA", "GSEB તજજ્ઞ", "Std 8 ગુજરાતી - આ તો ઈશ તણો આવાસ"),
        ("2Ganj9qPCq8", "Sanjay Patel", "Std 8 ગુજરાતી - પ્રકરણ 2"),
        ("ef0eYKQ0C9M", "TDY WebSankul", "GSEB ગુજરાતી - સંપૂર્ણ વ્યાકરણ One Shot"),
    ],
    "eng": [
        ("86G3T4BSEu0", "GSEB Expert", "Std 7 English - Unit 1 Water"),
        ("RIQBs6OPhmU", "GSEB Expert", "Std 7 English - Unit 2 Fairs And Festivals"),
    ],
    "college": [
        ("D6xkbGLQesk", "Abdul Bari", "DSA - Binary Search Tree Analysis"),
        ("TNhaISOUy6Q", "Gate Smashers", "DBMS - ACID Properties & Normalization"),
        ("0Zhy9b3v8cQ", "Akshay Saini", "JavaScript & React Internals"),
    ]
}

def get_subject_category(subj_id):
    sid = subj_id.lower()
    if 'math' in sid: return 'math'
    if 'sci' in sid or 'phy' in sid or 'chem' in sid or 'bio' in sid: return 'sci'
    if 'ss' in sid or 'soc' in sid: return 'ss'
    if 'guj' in sid: return 'guj'
    if 'eng' in sid: return 'eng'
    if 'college' in sid or 'dsa' in sid or 'dbms' in sid or 'web' in sid or 'apt' in sid or 'lr' in sid or 'tech' in sid: return 'college'
    return 'math'

def build_subject(grade, subj_id, name_en, name_gu, code, color, tb_title_en, tb_title_gu, ch_list, icon="menu-book"):
    cat = get_subject_category(subj_id)
    cat_videos = VERIFIED_VIDEOS.get(cat, VERIFIED_VIDEOS["math"])
    official_pdf = OFFICIAL_SUBJECT_PDFS.get(subj_id, f"https://shalamitra.in/std/{grade}")
    shalamitra_viewer = SHALAMITRA_VIEWERS.get(subj_id, f"https://shalamitra.in/std/{grade}")

    chapters = []
    for idx, item in enumerate(ch_list):
        ch_num = idx + 1
        title_en, title_gu, summary_gu, formulas_gu, ex_q_gu, ex_a_gu, _ = item
        chap_id = f"{subj_id}-ch{ch_num}"
        view_url = f"/api/curriculum/textbook-view?grade={grade}&subject={subj_id}&chapter={ch_num}"
        chapter_pdf_url = f"/api/curriculum/chapter-pdf?grade={grade}&subject={subj_id}&chapter={ch_num}"
        
        # Pick 2 verified distinct videos for this chapter
        v1_id, v1_teacher, v1_sub = cat_videos[(idx * 2) % len(cat_videos)]
        v2_id, v2_teacher, v2_sub = cat_videos[(idx * 2 + 1) % len(cat_videos)]

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
            "textbookPdfUrl": chapter_pdf_url,
            "chapterPdfUrl": chapter_pdf_url,
            "fullBookPdfUrl": official_pdf,
            "textbookViewerUrl": view_url,
            "shalamitraUrl": shalamitra_viewer,
            "videos": [
                {
                    "id": f"vid-{chap_id}-1",
                    "title": f"{title_en} - Full Chapter Detailed Explanation",
                    "titleGujarati": f"{title_gu} - સંપૂર્ણ પ્રકરણ વિગતવાર સમજૂતી (GSEB)",
                    "teacher": v1_teacher,
                    "duration": "24m",
                    "youtubeVideoId": v1_id,
                    "tag": "GSEB Gujarati"
                },
                {
                    "id": f"vid-{chap_id}-2",
                    "title": f"{title_en} - Fast Revision & Important Points",
                    "titleGujarati": f"{title_gu} - ઝડપી પુનરાવર્તન અને અગત્યના પ્રશ્નો",
                    "teacher": v2_teacher,
                    "duration": "18m",
                    "youtubeVideoId": v2_id,
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
        "officialTextbookPdf": official_pdf,
        "shalamitraUrl": shalamitra_viewer,
        "chapters": chapters
    }

def main():
    print("Building GSEB curriculum dictionary for Grades 7 to 12 & College...")
    curriculum = {}

    # Class 7
    curriculum["7"] = {
        "grade": "7",
        "title": "Class 7 Curriculum",
        "description": "NCERT & GSEB Comprehensive Subjects for Class 7 (સંપૂર્ણ ગુજરાતી માધ્યમ)",
        "badge": "CLASS 7 • ADVANCING",
        "subjects": [
            build_subject("7", "g7-math", "Mathematics", "ગણિત", "MTH7", "#3b82f6", "Mathematics Std 7 (GSEB)", "ગણિત ધોરણ ૭ - શાળા મિત્ર (GSSTB)", CLASS_7_DATA["math"], "calculate"),
            build_subject("7", "g7-sci", "Science", "વિજ્ઞાન", "SCI7", "#10b981", "Science Std 7 (GSEB)", "વિજ્ઞાન ધોરણ ૭ - શાળા મિત્ર (GSSTB)", CLASS_7_DATA["science"], "science"),
            build_subject("7", "g7-soc", "Social Science", "સામાજિક વિજ્ઞાન", "SOC7", "#f59e0b", "Social Science Std 7 (GSEB)", "સામાજિક વિજ્ઞાન ધોરણ ૭ - શાળા મિત્ર (GSSTB)", CLASS_7_DATA["social"], "public"),
            build_subject("7", "g7-guj", "Gujarati", "ગુજરાતી (માતૃભાષા)", "GUJ7", "#ec4899", "Gujarati Std 7 (GSEB)", "ગુજરાતી ધોરણ ૭ - શાળા મિત્ર (GSSTB)", CLASS_7_DATA["gujarati"], "menu-book"),
            build_subject("7", "g7-eng", "English", "અંગ્રેજી (દ્વિતીય ભાષા)", "ENG7", "#8b5cf6", "Honeycomb & An Alien Hand", "અંગ્રેજી ધોરણ ૭ - GSEB", CLASS_7_DATA["english"], "translate")
        ]
    }

    # Class 8
    curriculum["8"] = {
        "grade": "8",
        "title": "Class 8 Curriculum",
        "description": "NCERT & GSEB Comprehensive Subjects for Class 8 (સંપૂર્ણ ગુજરાતી માધ્યમ)",
        "badge": "CLASS 8 • BOARD PREP",
        "subjects": [
            build_subject("8", "g8-math", "Mathematics", "ગણિત", "MTH8", "#3b82f6", "Mathematics Std 8 (GSEB)", "ગણિત ધોરણ ૮ - શાળા મિત્ર (GSSTB)", CLASS_8_DATA["math"], "calculate"),
            build_subject("8", "g8-sci", "Science", "વિજ્ઞાન", "SCI8", "#10b981", "Science Std 8 (GSEB)", "વિજ્ઞાન ધોરણ ૮ - શાળા મિત્ર (GSSTB)", CLASS_8_DATA["science"], "science"),
            build_subject("8", "g8-soc", "Social Science", "સામાજિક વિજ્ઞાન", "SOC8", "#f59e0b", "Social Science Std 8 (GSEB)", "સામાજિક વિજ્ઞાન ધોરણ ૮ - શાળા મિત્ર (GSSTB)", CLASS_8_DATA["social"], "public"),
            build_subject("8", "g8-guj", "Gujarati", "ગુજરાતી (માતૃભાષા)", "GUJ8", "#ec4899", "Gujarati Std 8 (GSEB)", "ગુજરાતી ધોરણ ૮ - શાળા મિત્ર (GSSTB)", CLASS_8_DATA["gujarati"], "menu-book"),
            build_subject("8", "g8-eng", "English", "અંગ્રેજી (દ્વિતીય ભાષા)", "ENG8", "#8b5cf6", "Honeydew & It So Happened", "અંગ્રેજી ધોરણ ૮ - GSEB", CLASS_8_DATA["english"], "translate")
        ]
    }

    # Class 9
    curriculum["9"] = {
        "grade": "9",
        "title": "Class 9 Curriculum",
        "description": "NCERT & GSEB Comprehensive Subjects for Class 9 (સંપૂર્ણ ગુજરાતી માધ્યમ)",
        "badge": "CLASS 9 • SECONDARY",
        "subjects": [
            build_subject("9", "g9-math", "Mathematics", "ગણિત", "MTH9", "#3b82f6", "Mathematics Std 9 (GSEB)", "ગણિત ધોરણ ૯ - શાળા મિત્ર (GSSTB)", CLASS_9_DATA["math"], "calculate"),
            build_subject("9", "g9-sci", "Science", "વિજ્ઞાન", "SCI9", "#10b981", "Science Std 9 (GSEB)", "વિજ્ઞાન ધોરણ ૯ - શાળા મિત્ર (GSSTB)", CLASS_9_DATA["science"], "science"),
            build_subject("9", "g9-soc", "Social Science", "સામાજિક વિજ્ઞાન", "SOC9", "#f59e0b", "Social Science Std 9 (GSEB)", "સામાજિક વિજ્ઞાન ધોરણ ૯ - શાળા મિત્ર (GSSTB)", CLASS_9_DATA["social"], "public"),
            build_subject("9", "g9-guj", "Gujarati", "ગુજરાતી (માતૃભાષા)", "GUJ9", "#ec4899", "Gujarati Std 9 (GSEB)", "ગુજરાતી ધોરણ ૯ - શાળા મિત્ર (GSSTB)", CLASS_9_DATA["gujarati"], "menu-book"),
            build_subject("9", "g9-eng", "English", "અંગ્રેજી (દ્વિતીય ભાષા)", "ENG9", "#8b5cf6", "Beehive & Moments", "અંગ્રેજી ધોરણ ૯ - GSEB", CLASS_9_DATA["english"], "translate")
        ]
    }

    # Class 10
    curriculum["10"] = {
        "grade": "10",
        "title": "Class 10 Board Curriculum",
        "description": "Official GSEB Class 10 (SSC બોર્ડ) સંપૂર્ણ ગુજરાતી માધ્યમ અભ્યાસક્રમ",
        "badge": "SSC BOARD 2025 • MISSION 80/80",
        "subjects": [
            build_subject("10", "g10-math", "Mathematics", "ગણિત", "MTH10", "#3b82f6", "GSEB Class 10 Mathematics", "ગણિત ધોરણ ૧૦ (GSEB બોર્ડ)", CLASS_10_DATA["math"], "calculate"),
            build_subject("10", "g10-sci", "Science", "વિજ્ઞાન", "SCI10", "#10b981", "GSEB Class 10 Science", "વિજ્ઞાન ધોરણ ૧૦ (GSEB બોર્ડ)", CLASS_10_DATA["science"], "science"),
            build_subject("10", "g10-soc", "Social Science", "સામાજિક વિજ્ઞાન", "SOC10", "#f59e0b", "GSEB Class 10 Social Science", "સામાજિક વિજ્ઞાન ધોરણ ૧૦ (GSEB બોર્ડ)", CLASS_10_DATA["social"], "public"),
            build_subject("10", "g10-guj", "Gujarati", "ગુજરાતી (માતૃભાષા)", "GUJ10", "#ec4899", "GSEB Class 10 Gujarati First Language", "ગુજરાતી ધોરણ ૧૦ (પ્રથમ ભાષા - GSEB)", CLASS_10_DATA["gujarati"], "menu-book"),
            build_subject("10", "g10-eng", "English", "અંગ્રેજી (દ્વિતીય ભાષા)", "ENG10", "#8b5cf6", "First Flight & Footprints", "અંગ્રેજી ધોરણ ૧૦ (GSEB)", CLASS_10_DATA["english"], "translate")
        ]
    }

    # Class 11
    curriculum["11"] = {
        "grade": "11",
        "title": "Class 11 Higher Secondary",
        "description": "GSEB Class 11 Science & General Stream (ગુજરાતી માધ્યમ)",
        "badge": "CLASS 11 • HIGHER SECONDARY",
        "subjects": [
            build_subject("11", "g11-phy", "Physics", "ભૌતિક વિજ્ઞાન", "PHY11", "#3b82f6", "Physics Class 11 (GSEB)", "ભૌતિક વિજ્ઞાન ધોરણ ૧૧", CLASS_11_DATA["phy"], "biotech"),
            build_subject("11", "g11-chem", "Chemistry", "રસાયણ વિજ્ઞાન", "CHE11", "#10b981", "Chemistry Class 11 (GSEB)", "રસાયણ વિજ્ઞાન ધોરણ ૧૧", CLASS_11_DATA["chem"], "science"),
            build_subject("11", "g11-math", "Mathematics", "ગણિત", "MTH11", "#8b5cf6", "Mathematics Class 11 (GSEB)", "ગણિત ધોરણ ૧૧", CLASS_11_DATA["math"], "calculate"),
            build_subject("11", "g11-bio", "Biology", "જીવ વિજ્ઞાન", "BIO11", "#ec4899", "Biology Class 11 (GSEB)", "જીવ વિજ્ઞાન ધોરણ ૧૧", CLASS_11_DATA["bio"], "nature"),
            build_subject("11", "g11-guj", "Gujarati", "ગુજરાતી", "GUJ11", "#f59e0b", "Gujarati Class 11", "ગુજરાતી સાહિત્ય ધોરણ ૧૧", CLASS_11_DATA["gujarati"], "menu-book"),
            build_subject("11", "g11-eng", "English", "અંગ્રેજી", "ENG11", "#06b6d4", "English Class 11", "અંગ્રેજી ધોરણ ૧૧", CLASS_11_DATA["eng"], "translate"),
            build_subject("11", "g11-cs", "Computer Science", "કોમ્પ્યુટર સાયન્સ", "CS11", "#64748b", "Computer Science Class 11", "કોમ્પ્યુટર સાયન્સ ધોરણ ૧૧", CLASS_11_DATA["cs"], "laptop")
        ]
    }

    # Class 12
    curriculum["12"] = {
        "grade": "12",
        "title": "Class 12 Board & GUJCET",
        "description": "GSEB Class 12 (HSC બોર્ડ) & ગુજકેટ (GUJCET) સંપૂર્ણ તૈયારી",
        "badge": "HSC BOARD & GUJCET 2025",
        "subjects": [
            build_subject("12", "g12-phy", "Physics", "ભૌતિક વિજ્ઞાન", "PHY12", "#3b82f6", "Physics Class 12 (GSEB)", "ભૌતિક વિજ્ઞાન ધોરણ ૧૨ (GSEB)", CLASS_12_DATA["phy"], "biotech"),
            build_subject("12", "g12-chem", "Chemistry", "રસાયણ વિજ્ઞાન", "CHE12", "#10b981", "Chemistry Class 12 (GSEB)", "રસાયણ વિજ્ઞાન ધોરણ ૧૨ (GSEB)", CLASS_12_DATA["chem"], "science"),
            build_subject("12", "g12-math", "Mathematics", "ગણિત", "MTH12", "#8b5cf6", "Mathematics Class 12 (GSEB)", "ગણિત ધોરણ ૧૨ (GSEB)", CLASS_12_DATA["math"], "calculate"),
            build_subject("12", "g12-bio", "Biology", "જીવ વિજ્ઞાન", "BIO12", "#ec4899", "Biology Class 12 (GSEB)", "જીવ વિજ્ઞાન ધોરણ ૧૨ (GSEB)", CLASS_12_DATA["bio"], "nature"),
            build_subject("12", "g12-guj", "Gujarati", "ગુજરાતી", "GUJ12", "#f59e0b", "Gujarati Class 12", "ગુજરાતી સાહિત્ય ધોરણ ૧૨ (GSEB)", CLASS_12_DATA["gujarati"], "menu-book"),
            build_subject("12", "g12-eng", "English", "અંગ્રેજી", "ENG12", "#06b6d4", "English Class 12", "અંગ્રેજી ધોરણ ૧૨ (GSEB)", CLASS_12_DATA["eng"], "translate"),
            build_subject("12", "g12-cs", "Computer Science", "કોમ્પ્યુટર સાયન્સ", "CS12", "#64748b", "Computer Science Class 12", "કોમ્પ્યુટર સાયન્સ ધોરણ ૧૨ (GSEB)", CLASS_12_DATA["cs"], "laptop")
        ]
    }

    # College
    curriculum["college"] = {
        "grade": "college",
        "title": "Campus Placements & Tech Mastery",
        "description": "Aptitude, Reasoning, CS Core & Interview Prep for Placements",
        "badge": "CAREER ACCELERATOR",
        "subjects": [
            build_subject("college", "col-apt", "Quantitative Aptitude", "ક્વોન્ટેટેટિવ એપ્ટિટ્યુડ", "APT101", "#3b82f6", "Quantitative Aptitude for Placements", "એપ્ટિટ્યુડ પ્રેક્ટિસ", COLLEGE_DATA["apt"], "calculate"),
            build_subject("college", "col-lr", "Logical Reasoning", "લોજિકલ રીઝનિંગ", "LR101", "#10b981", "Logical Reasoning & Puzzles", "રીઝનિંગ પ્રેક્ટિસ", COLLEGE_DATA["lr"], "psychology"),
            build_subject("college", "col-tech", "Technical & CS Core", "ટેકનિકલ & CS કોર", "TECH101", "#8b5cf6", "DSA, System Design & Core CS", "કોમ્પ્યુટર ટેકનિકલ કોર", COLLEGE_DATA["tech"], "terminal")
        ]
    }

    print("Curriculum built successfully!")
    print(f"Total grades configured: {len(curriculum)}")
    for g, c in curriculum.items():
        total_chaps = sum(len(s["chapters"]) for s in c["subjects"])
        print(f"  Grade {g}: {len(c['subjects'])} subjects, {total_chaps} chapters total.")

    # 1. Update backend/routes/academicDataSeed.js
    print("Updating backend/routes/academicDataSeed.js...")
    seed_json = json.dumps(curriculum, ensure_ascii=False, indent=2)
    with open('backend/routes/academicDataSeed.js', 'w', encoding='utf-8') as f:
        f.write("const ACADEMIC_CURRICULUM = " + seed_json + ";\n\nmodule.exports = { ACADEMIC_CURRICULUM };\n")
    print("backend/routes/academicDataSeed.js updated successfully.")

    # 2. Update constants/academicData.ts
    print("Updating constants/academicData.ts...")
    with open('constants/academicData.ts', 'r', encoding='utf-8') as f:
        src_ts = f.read()

    start_marker = "export const ACADEMIC_CURRICULUM: Record<AcademicGrade, GradeCurriculum> = "
    start_idx = src_ts.find(start_marker)
    if start_idx == -1:
        print("ERROR: Could not find start marker in constants/academicData.ts")
        sys.exit(1)

    sp_marker = "export const SAMPLE_PAPERS_DATA"
    sp_idx = src_ts.find(sp_marker, start_idx)
    if sp_idx == -1:
        print("ERROR: Could not find SAMPLE_PAPERS_DATA marker in constants/academicData.ts")
        sys.exit(1)

    tail_part = src_ts[sp_idx:]

    header_part = """export type AcademicGrade = '7' | '8' | '9' | '10' | '11' | '12' | 'college';
export type EducationBoard = 'CBSE' | 'GSEB' | 'ICSE';
export type InstructionMedium = 'English' | 'Gujarati';

export interface ChapterVideo {
  id: string;
  title: string;
  titleGujarati?: string;
  teacher: string;
  duration: string;
  youtubeVideoId: string;
  tag: string;
}

export interface ChapterConcept {
  heading: string;
  headingGujarati?: string;
  explanation: string;
  explanationGujarati?: string;
}

export interface TextbookExerciseSolution {
  question: string;
  answer: string;
  questionGujarati?: string;
  answerGujarati?: string;
}

export interface SubjectChapter {
  id: string;
  chapterNumber: number;
  title: string;
  titleGujarati?: string;
  duration: string;
  summary: string;
  summaryGujarati?: string;
  questionCount: number;
  iconName: string;
  textbookPdfUrl?: string;
  chapterPdfUrl?: string;
  fullBookPdfUrl?: string;
  textbookViewerUrl?: string;
  shalamitraUrl?: string;
  videos?: ChapterVideo[];
  concepts?: ChapterConcept[];
  keyFormulas?: string[];
  keyFormulasGujarati?: string[];
  exerciseSolutions?: TextbookExerciseSolution[];
}

export interface AcademicSubject {
  id: string;
  name: string;
  nameGujarati?: string;
  code: string;
  color: string;
  textbookTitle?: string;
  textbookTitleGujarati?: string;
  officialTextbookPdf?: string;
  shalamitraUrl?: string;
  chapters: SubjectChapter[];
}

export interface GradeCurriculum {
  grade: AcademicGrade;
  title: string;
  description: string;
  badge: string;
  subjects: AcademicSubject[];
}

export interface SamplePaper {
  id: string;
  title: string;
  titleGujarati?: string;
  grade: string;
  board: string;
  subject: string;
  year: string;
  durationMinutes: number;
  totalMarks: number;
  questionCount: number;
  difficulty: string;
  badge?: string;
  officialPdfUrl?: string;
  solutionPdfUrl?: string;
  externalSourceUrl?: string;
  instructions?: string[];
  instructionsGujarati?: string[];
}

export interface StepMarking {
  stepNumber: number;
  marksAllocated: string;
  text: string;
  textGujarati?: string;
}

export interface ImportantQuestion {
  id: string;
  grade: string;
  board: string;
  subject: string;
  chapterNumber: number;
  chapterTitle: string;
  chapterTitleGujarati?: string;
  marks: number;
  marksCategory: string;
  questionText: string;
  questionTextGujarati: string;
  frequentlyAskedYears?: string[];
  modelAnswer: string;
  modelAnswerGujarati: string;
  stepWiseMarking?: StepMarking[];
  examinerTips?: string;
  examinerTipsGujarati?: string;
  options?: string[];
  correctAnswer?: number;
}

export const GRADE_OPTIONS: { grade: AcademicGrade; label: string; subLabel: string; icon: string }[] = [
  { grade: '7', label: 'ધોરણ ૭ (Class 7)', subLabel: 'GSEB ગુજરાતી માધ્યમ', icon: 'looks-one' },
  { grade: '8', label: 'ધોરણ ૮ (Class 8)', subLabel: 'GSEB ગુજરાતી માધ્યમ', icon: 'looks-two' },
  { grade: '9', label: 'ધોરણ ૯ (Class 9)', subLabel: 'GSEB ગુજરાતી માધ્યમ', icon: 'looks-3' },
  { grade: '10', label: 'ધોરણ ૧૦ (SSC બોર્ડ)', subLabel: 'GSEB બોર્ડ પરીક્ષા તૈયારી', icon: 'school' },
  { grade: '11', label: 'ધોરણ ૧૧ (Class 11)', subLabel: 'વિજ્ઞાન & સામાન્ય પ્રવાહ (GSEB)', icon: 'biotech' },
  { grade: '12', label: 'ધોરણ ૧૨ (HSC બોર્ડ)', subLabel: 'GSEB બોર્ડ & ગુજકેટ (GUJCET)', icon: 'workspace-premium' },
  { grade: 'college', label: 'College & Placements', subLabel: 'TCS, Amazon, DSA & Aptitude (English)', icon: 'business-center' },
];

"""

    new_ts_content = header_part + start_marker + seed_json + ";\n\n" + tail_part
    with open('constants/academicData.ts', 'w', encoding='utf-8') as f:
        f.write(new_ts_content)

    print("constants/academicData.ts updated successfully with Grades 7 to 12 only!")

if __name__ == '__main__':
    main()

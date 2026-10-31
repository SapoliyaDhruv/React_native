import pptx
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
import shutil

def style_table(tbl, rows_data):
    col_widths = [Inches(1.6), Inches(1.4), Inches(1.7), Inches(4.0)]
    for c_idx in range(4):
        tbl.columns[c_idx].width = col_widths[c_idx]

    for r_idx, row_values in enumerate(rows_data):
        for c_idx, val in enumerate(row_values):
            cell = tbl.cell(r_idx, c_idx)
            cell.text = val
            cell.margin_top = Inches(0.04)
            cell.margin_bottom = Inches(0.04)
            cell.margin_left = Inches(0.08)
            cell.margin_right = Inches(0.08)

            p = cell.text_frame.paragraphs[0]
            p.word_wrap = True

            if r_idx == 0:
                cell.fill.solid()
                cell.fill.fore_color.rgb = RGBColor(30, 58, 138) # Navy
                p.alignment = PP_ALIGN.CENTER
                p.font.bold = True
                p.font.size = Pt(9.5)
                p.font.color.rgb = RGBColor(255, 255, 255)
            else:
                cell.fill.solid()
                if r_idx % 2 == 1:
                    cell.fill.fore_color.rgb = RGBColor(255, 255, 255)
                else:
                    cell.fill.fore_color.rgb = RGBColor(248, 250, 252) # Light slate

                p.font.size = Pt(8.5)
                if c_idx == 0:
                    p.font.bold = True
                    p.font.color.rgb = RGBColor(30, 58, 138)
                elif c_idx == 1:
                    p.font.color.rgb = RGBColor(14, 116, 144)
                elif c_idx == 2:
                    p.font.color.rgb = RGBColor(180, 83, 9)
                else:
                    p.font.color.rgb = RGBColor(51, 65, 85)

def update_pptx():
    pptx_path = "Review_Presentation.pptx"
    shutil.copy(pptx_path, "Review_Presentation_backup_before_all_schemas.pptx")
    prs = pptx.Presentation(pptx_path)

    all_schemas = [
        ("Table 1: User Schema (users)", [
            ["Field Name", "Data Type", "Constraint", "Description"],
            ["_id", "ObjectId", "Primary Key", "Unique user identifier"],
            ["name", "String", "Required", "Full name of the student"],
            ["email", "String", "Unique, Required", "Student email address"],
            ["passwordHash", "String", "Required", "Bcrypt-hashed password string"],
            ["activeTrack", "String", "Default: 'placement'", "Selected track ('placement', 'school')"],
            ["grade", "String", "Enum: 6-12, 'college'", "Current academic grade / year"],
            ["board", "String", "Enum: CBSE, GSEB, ICSE", "Academic education board"],
            ["medium", "String", "Enum: English, Gujarati", "Medium of instruction"],
            ["streakCount", "Number", "Default: 3", "Daily consecutive study streak"],
            ["targetCompany", "String", "Default: 'All Companies'", "Target placement employer"],
            ["createdAt", "Date", "Default: Now", "Account creation timestamp"]
        ]),
        ("Table 2: Question Schema (questions)", [
            ["Field Name", "Data Type", "Constraint", "Description"],
            ["_id", "ObjectId", "Primary Key", "Unique question identifier"],
            ["id", "Number", "Unique, Indexed", "Numeric question index"],
            ["questionText", "String", "Required", "The practice question statement"],
            ["options", "Array[String]", "Required, Len: 4", "Multiple-choice answer options"],
            ["correctAnswer", "Number", "Required", "0-based index of correct option"],
            ["category", "String", "Required, Indexed", "Aptitude, Logical, Technical topic"],
            ["company", "String", "Optional, Indexed", "Target company tag (TCS, Infosys)"],
            ["difficulty", "String", "Enum: Easy, Med, Hard", "Calibrated difficulty level"],
            ["explanation", "String", "Optional", "Detailed step-by-step solution"],
            ["grades", "Array[String]", "Indexed", "Target grades (['college'], ['10'])"]
        ]),
        ("Table 3: Course Schema (courses)", [
            ["Field Name", "Data Type", "Constraint", "Description"],
            ["_id", "ObjectId", "Primary Key", "Unique course identifier"],
            ["title", "String", "Required", "Title of the IT course / subject"],
            ["category", "String", "Required", "Course domain (DSA, Web Dev, Cloud)"],
            ["instructor", "String", "Required", "Course instructor / educator name"],
            ["duration", "String", "Default: '10 hrs'", "Total instructional video hours"],
            ["lessonsCount", "Number", "Default: 20", "Total number of video lessons"],
            ["rating", "Number", "Default: 4.8", "Student rating out of 5.0"],
            ["tag", "String", "Default: 'Trending'", "Display badge tag"],
            ["level", "String", "Default: 'All Levels'", "Target student skill level"],
            ["thumbnailUrl", "String", "Optional", "Course cover graphic image URL"]
        ]),
        ("Table 4: ExamResult Schema (examresults)", [
            ["Field Name", "Data Type", "Constraint", "Description"],
            ["_id", "ObjectId", "Primary Key", "Unique result identifier"],
            ["userId", "ObjectId", "Foreign Key (User)", "Reference to student account"],
            ["userEmail", "String", "Default: Guest", "Student email address"],
            ["grade", "String", "Default: 'college'", "Academic grade level"],
            ["board", "String", "Default: 'CBSE'", "Examination board context"],
            ["category", "String", "Default: 'General'", "Subject or company test category"],
            ["scorePercentage", "Number", "Required", "Calculated score percentage (0-100)"],
            ["correctCount", "Number", "Required", "Number of correctly answered questions"],
            ["totalQuestions", "Number", "Required", "Total test questions count"],
            ["userAnswers", "Object", "Default: {}", "Key-value pairs of student answers"],
            ["weakCategories", "Array[String]", "Optional", "Topics where accuracy fell <60%"],
            ["createdAt", "Date", "Default: Now", "Exam submission timestamp"]
        ]),
        ("Table 5: DuelRoom Schema (duelrooms)", [
            ["Field Name", "Data Type", "Constraint", "Description"],
            ["_id", "ObjectId", "Primary Key", "Unique duel room identifier"],
            ["roomCode", "String", "Unique, Indexed", "6-character room code for 1v1 PvP"],
            ["grade", "String", "Required", "Academic grade level"],
            ["subject", "String", "Required, Default: 'All'", "Test subject filter"],
            ["status", "String", "Enum, Indexed", "waiting, ready, active, completed, abandoned"],
            ["host", "Object", "Required", "Host details (name, avatar, score, ready)"],
            ["guest", "Object", "Default: null", "Opponent student details"],
            ["questions", "Array[Object]", "Required", "Synchronized test questions for duel"],
            ["createdAt", "Date", "TTL: 3600s (1 hr)", "Auto-expiring session timestamp"]
        ]),
        ("Table 6: SamplePaper Schema (samplepapers)", [
            ["Field Name", "Data Type", "Constraint", "Description"],
            ["_id", "ObjectId", "Primary Key", "Unique sample paper identifier"],
            ["id", "String", "Unique, Required", "Model paper identifier code"],
            ["title", "String", "Required", "Official model paper title"],
            ["grade", "String", "Required, Indexed", "Target grade ('10', '12', 'college')"],
            ["board", "String", "Default: 'CBSE', Indexed", "Board (CBSE, GSEB, Placement)"],
            ["subject", "String", "Required, Indexed", "Examination subject"],
            ["year", "String", "Default: '2024-2025'", "Academic examination year"],
            ["durationMinutes", "Number", "Default: 60", "Total allocated exam duration"],
            ["totalMarks", "Number", "Default: 50", "Total examination marks"],
            ["questionCount", "Number", "Default: 25", "Total question count"],
            ["officialPdfUrl", "String", "Optional", "URL to downloadable paper PDF"]
        ]),
        ("Table 7: VideoLecture Schema (videolectures)", [
            ["Field Name", "Data Type", "Constraint", "Description"],
            ["_id", "ObjectId", "Primary Key", "Unique lecture identifier"],
            ["id", "String", "Unique, Required", "Video lesson identifier code"],
            ["grades", "Array[String]", "Indexed", "Grade tags (['college'], ['10'])"],
            ["boards", "Array[String]", "Indexed", "Educational boards (CBSE, GSEB)"],
            ["category", "String", "Required, Indexed", "Subject or technical topic category"],
            ["title", "String", "Required", "Lecture lesson title"],
            ["instructor", "String", "Required", "Course educator name"],
            ["duration", "String", "Required", "Formatted length (e.g. '18m 30s')"],
            ["durationSeconds", "Number", "Required", "Total playback duration in seconds"],
            ["youtubeVideoId", "String", "Required", "Embedded YouTube video ID"],
            ["thumbnailUrl", "String", "Required", "Thumbnail image URL"]
        ]),
        ("Table 8: Flashcard Schema (flashcards)", [
            ["Field Name", "Data Type", "Constraint", "Description"],
            ["_id", "ObjectId", "Primary Key", "Unique flashcard identifier"],
            ["id", "String", "Unique, Required", "Concept flashcard code"],
            ["topic", "String", "Required", "Subject topic (SQL, OS, Aptitude)"],
            ["question", "String", "Required", "Concept prompt or interview question"],
            ["answer", "String", "Required", "Concise verified answer / definition"],
            ["interviewerTips", "String", "Optional", "Practical advice for campus interview"],
            ["difficulty", "String", "Enum: Beginner, Med, Adv", "Topic complexity level"],
            ["tags", "Array[String]", "Optional", "Search keywords and category tags"],
            ["createdAt", "Date", "Default: Now", "Flashcard creation timestamp"]
        ]),
        ("Table 9: Formula Schema (formulas)", [
            ["Field Name", "Data Type", "Constraint", "Description"],
            ["_id", "ObjectId", "Primary Key", "Unique formula entry identifier"],
            ["id", "String", "Unique, Required", "Formula reference code"],
            ["category", "String", "Required", "Topic (Profit & Loss, Algebra, Calculus)"],
            ["title", "String", "Required", "Cheatsheet title (English & Gujarati)"],
            ["grades", "Array[String]", "Optional", "Applicable student grades"],
            ["formulas", "Array[String]", "Required", "Mathematical equations & expressions"],
            ["notes", "String", "Optional", "Important conditions and memory tips"],
            ["createdAt", "Date", "Default: Now", "Reference creation timestamp"]
        ]),
        ("Table 10: ImportantQuestion Schema (importantquestions)", [
            ["Field Name", "Data Type", "Constraint", "Description"],
            ["_id", "ObjectId", "Primary Key", "Unique question bank identifier"],
            ["id", "String", "Unique, Required", "Reference question identifier"],
            ["grade", "String", "Required, Indexed", "Target grade level (Class 9-12, college)"],
            ["board", "String", "Default: 'All'", "Board designation (GSEB, CBSE)"],
            ["subject", "String", "Required, Indexed", "Academic or placement subject"],
            ["chapterNumber", "Number", "Default: 1", "Chapter number in curriculum"],
            ["chapterTitle", "String", "Required", "Full chapter title"],
            ["marks", "Number", "Required, Indexed", "Question weight (1, 2, 3, 4, 5 marks)"],
            ["marksCategory", "String", "Required", "Category (VSA, Short, Long Answer)"],
            ["questionText", "String", "Required", "Official examination question"],
            ["modelAnswer", "String", "Required", "Complete official step-by-step solution"]
        ]),
        ("Table 11: Curriculum Schema (curriculums)", [
            ["Field Name", "Data Type", "Constraint", "Description"],
            ["_id", "ObjectId", "Primary Key", "Unique curriculum identifier"],
            ["grade", "String", "Unique, Required", "Academic grade identifier ('10', 'college')"],
            ["title", "String", "Required", "Full curriculum track title"],
            ["description", "String", "Optional", "Overview of educational syllabus"],
            ["badge", "String", "Optional", "Display emblem / badge name"],
            ["subjects", "Array[Object]", "Required", "Subjects with nested chapters & videos"],
            ["createdAt", "Date", "Default: Now", "Curriculum release timestamp"]
        ])
    ]

    # Helper function to populate a slide with schema table
    def setup_schema_slide(slide, subtitle_text, rows_data):
        # Clear non-title shapes
        for shp in [s for s in slide.shapes if s != slide.shapes.title]:
            sp = shp._element
            sp.getparent().remove(sp)

        if slide.shapes.title:
            slide.shapes.title.text = "3.5 Data Dictionary"
            slide.shapes.title.left = Inches(0.65)
            slide.shapes.title.top = Inches(0.35)
            slide.shapes.title.width = Inches(8.7)
            slide.shapes.title.height = Inches(0.55)

        # Subtitle textbox
        tb = slide.shapes.add_textbox(Inches(0.65), Inches(0.95), Inches(8.7), Inches(0.35))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = subtitle_text
        p.font.bold = True
        p.font.size = Pt(12)
        p.font.color.rgb = RGBColor(30, 58, 138)

        # Table
        tbl_h = Inches(min(4.0, 0.32 * len(rows_data) + 0.4))
        tbl_shape = slide.shapes.add_table(len(rows_data), 4, Inches(0.65), Inches(1.35), Inches(8.7), tbl_h)
        style_table(tbl_shape.table, rows_data)

    # 1. Update slides 20 to 23 (indices 19, 20, 21, 22) for Tables 1 to 4
    for i in range(4):
        slide = prs.slides[19 + i]
        subtitle, rows = all_schemas[i]
        setup_schema_slide(slide, subtitle, rows)
        print(f"Updated Slide {20 + i}: {subtitle}")

    # 2. Add 7 new slides for Tables 5 to 11
    new_slides = []
    for i in range(4, 11):
        slide = prs.slides.add_slide(prs.slide_layouts[1]) # TITLE_ONLY
        subtitle, rows = all_schemas[i]
        setup_schema_slide(slide, subtitle, rows)
        new_slides.append(slide)
        print(f"Created new Slide for {subtitle}")

    # 3. Reorder sldIdLst so the 7 new slides appear right after slide index 22
    sldIdLst = prs.slides._sldIdLst
    all_elems = list(sldIdLst)
    # The 7 new slides were appended at the end: indices 47..53
    # Original slides: 0..46
    # We want:
    # 0..22 (Slides 1 to 23, where 19..22 are Tables 1..4)
    # followed by the 7 new slide elements: all_elems[47:54]
    # followed by the remaining original slides: all_elems[23:47] (Development, Screenshots, Agile, etc.)
    new_order = all_elems[0:23] + all_elems[47:54] + all_elems[23:47]

    sldIdLst.clear()
    for el in new_order:
        sldIdLst.append(el)

    prs.save(pptx_path)
    print(f"Successfully saved {pptx_path} with all 11 collection schemas! Total slides: {len(prs.slides)}")

if __name__ == "__main__":
    update_pptx()


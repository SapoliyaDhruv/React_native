import pptx
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
import os

def update_presentation():
    input_path = "Review_Presentation_backup_orig.pptx"
    output_path = "Review_Presentation.pptx"

    prs = pptx.Presentation(input_path)

    # 1. Fix typo on Slide 5 (index 4)
    s5 = prs.slides[4]
    for shp in s5.shapes:
        if shp.has_text_frame and "5To offer" in shp.text_frame.text:
            shp.text_frame.text = shp.text_frame.text.replace("5To offer", "To offer")
            print("Fixed typo on Slide 5")

    # 2. Update Slide 7 (1.5 Core Components, index 6)
    s7 = prs.slides[6]
    for shp in s7.shapes:
        if shp.has_text_frame and shp != s7.shapes.title:
            tf = shp.text_frame
            tf.word_wrap = True
            text_lines = [
                "MindSprint is architected into five core software layers and modules:",
                "",
                "1. Cross-Platform Mobile Client: React Native frontend built with Expo v54/v57, TypeScript, and Expo Router, delivering responsive navigation across Android, iOS, and Web.",
                "2. Node.js REST API Backend: Express server handling JWT authentication, question bank filters, course streaming endpoints, and Gemini AI query proxying.",
                "3. Scalable Database Layer: MongoDB database with Mongoose models for User accounts, Question banks, Courses, ExamResults, DuelRooms, and SamplePapers.",
                "4. Offline Resilience Service Layer: Intelligent ApiService fallback mechanism guaranteeing continuous app functionality using local verified static datasets when internet drops.",
                "5. Interactive Practice & AI Engines: Real-time timed mock exams with question palette, 1v1 Quiz Duel battles, Voice Viva player, and AI Doubt Solver with camera OCR."
            ]
            tf.text = "\n".join(text_lines)
            print("Updated Slide 7 with current project components")

    # 3. Update Slide 12 (2.1 Functional Requirements, index 11)
    s12 = prs.slides[11]
    for shp in s12.shapes:
        if shp.has_text_frame and shp != s12.shapes.title:
            tf = shp.text_frame
            tf.word_wrap = True
            req_lines = [
                "Functional Requirements :",
                "",
                "1. User Authentication: Secure registration, login, and guest mode via JWT bearer authentication.",
                "2. Multi-Board Track Selection: Dynamic switching between GTU Engineering and Gujarat School (GSEB) syllabi.",
                "3. Company-Wise Question Bank: Practice questions filtered by company pattern (TCS, Infosys, Amazon, etc.).",
                "4. Timed Mock Exam Engine: Real-time countdown timer, question palette navigation, answer logging, and in-exam scratchpad.",
                "5. Weak Spot Detection: Automated score calculation flagging topics with <60% accuracy for targeted revision.",
                "6. AI Doubt Solver & OCR: Question clearing via camera photo OCR and Gemini-powered step-by-step explanations.",
                "7. Course Hub & Video Masterclasses: Chapter navigator, NCERT/GSEB e-textbooks, and curated YouTube video lectures.",
                "8. Engagement & 1v1 PvP Battles: Swipeable flashcards, daily streaks, campus leaderboard, and live Quiz Duel matchmaking."
            ]
            tf.text = "\n".join(req_lines)
            print("Updated Slide 12 with full functional requirements")

    # Let's inspect slide order from slide 24 (Development) onwards
    # Index 23 is Slide 24: "4. Development" (Section Header)
    # Index 24 is Slide 25: "4.1 Coding Standards"
    # Index 25 is Slide 26: "4.1 Coding Standards"
    # Index 26 to 33 were Slides 27 to 34 (4.2.1 to 4.2.8 Screenshots)

    # We need to replace slides 26..33 (8 slides) with 5 clean screenshot slides (10 screenshots total, 2 per slide, NO text boxes).
    # Also Agile slides were 34..42:
    # Index 34 was Slide 35: "5. Agile Documentation" (Section Header)
    # Index 35 was Slide 36: "5.1 Agile Project Charter"
    # Index 36 was Slide 37: "5.2 Agile Roadmap / Schedule"
    # Index 37 was Slide 38: "5.3 Agile Project Plan"
    # Index 38 was Slide 39: "5.4 User Stories"
    # Index 39 was Slide 40: "5.5 Release Plan"
    # Index 40 was Slide 41: "5.6 Product Backlog & Sprint Backlog"
    # Index 41 was Slide 42: "5.7 Test Plan"
    # Index 42 was Slide 43: "5.8 Burndown Chart"
    # Index 43 was Slide 44: "Thank You!"

    # Rather than risky in-place XML slicing, let's create a new clean presentation using the template's layouts and masters!
    # That ensures 100% stability, perfect layout formatting, and zero corrupted XML.
    print("Building full presentation using prs template...")

    # We can clone slides 0 to 25 from prs into a fresh presentation or modify in place.
    # Actually, modifying in place by updating slides 26..33 and 35..42 is very clean!
    # Let's verify what happens if we delete slides 31, 32, 33 (so 8 screenshot slides become 5):
    # Let's write a python function to delete specific slide indices.

update_presentation()


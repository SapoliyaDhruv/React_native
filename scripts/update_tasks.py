import openpyxl

wb = openpyxl.load_workbook('Agile Document (Recovered).xlsx')
ws = wb['Product Backlog']

replacements = {
    24: "User / Syllabus Selector Module",
    25: "Course & Video Catalog REST APIs",
    26: "Course Catalog UI & Chapter Reader",
    29: "Question Bank Backend & Company Tagging",
    31: "Timed Mock Exam Engine UI & Palette",
    32: "In-Exam Scratchpad & Timer Logic",
    35: "Score Evaluation & Percentage Logic",
    36: "Weak Spot Detection & Accuracy Analytics",
    37: "Results Summary UI & Category Cards",
    40: "AI Doubt Solver Text & Voice Processing",
    41: "Camera OCR Text Extraction & Matching",
    42: "Swipeable Flashcards & Daily Streak",
    45: "Offline Resilience & Local Fallback Layer",
    46: "UAT Testing, Bug Fixes & Optimization",
    47: "Final Project Documentation & Review Prep",
}

for row, text in replacements.items():
    ws.cell(row, 2).value = text

wb.save('Agile Document (Recovered).xlsx')
print("Updated Product Backlog sprint tasks successfully!")


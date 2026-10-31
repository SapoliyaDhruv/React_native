import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np
import os

os.makedirs('screenshots', exist_ok=True)

# 1. Project Charter
def generate_project_charter():
    fig, ax = plt.subplots(figsize=(14, 8.5), dpi=200)
    ax.axis('off')

    # Background
    fig.patch.set_facecolor('#F8FAFC')

    # Title Banner
    ax.text(0.5, 0.95, "MindSprint - Agile Project Charter", fontsize=20, fontweight='bold',
            ha='center', va='top', color='#1E293B')
    ax.text(0.5, 0.91, "Lok Jagruti Institute of Computer Applications (LJICA)", fontsize=12,
            ha='center', va='top', color='#64748B')

    # Left Card: General Information
    card1 = patches.FancyBboxPatch((0.05, 0.44), 0.42, 0.44, boxstyle="round,pad=0.02",
                                   ec="#CBD5E1", fc="#FFFFFF", lw=1.5)
    ax.add_patch(card1)
    ax.text(0.07, 0.85, "General Project Information", fontsize=14, fontweight='bold', color='#1E3A8A')

    fields = [
        ("Project Name:", "MindSprint - Placement Prep & Learning App"),
        ("Project Champion:", "___________________________"),
        ("Project Sponsor:", "Lok Jagruti Institute of Computer Applications"),
        ("Project Manager:", "___________________________"),
        ("Stakeholders:", "Sapoliya Dhruv, Vavaliya Dvarkesh, Prajapati Krunal"),
        ("Start Date:", "22/07/2026"),
        ("Expected Complete:", "15/11/2026"),
        ("Target Platform:", "React Native (Android, iOS, Web)")
    ]
    y = 0.80
    for label, val in fields:
        ax.text(0.07, y, label, fontsize=10.5, fontweight='bold', color='#334155')
        ax.text(0.24, y, val, fontsize=10.5, color='#0F172A' if not val.startswith('_') else '#94A3B8')
        y -= 0.045

    # Right Card: Details (Mission & Vision)
    card2 = patches.FancyBboxPatch((0.53, 0.44), 0.42, 0.44, boxstyle="round,pad=0.02",
                                   ec="#CBD5E1", fc="#FFFFFF", lw=1.5)
    ax.add_patch(card2)
    ax.text(0.55, 0.85, "Mission & Strategic Vision", fontsize=14, fontweight='bold', color='#1E3A8A')

    ax.text(0.55, 0.79, "Mission Statement:", fontsize=11, fontweight='bold', color='#0284C7')
    ax.text(0.55, 0.73, "To deliver a unified mobile-first placement preparation\n"
                        "and technical skill learning platform with adaptive testing,\n"
                        "offline resilience, and automated weak spot detection.",
            fontsize=10, color='#334155', va='top')

    ax.text(0.55, 0.58, "Strategic Vision:", fontsize=11, fontweight='bold', color='#0284C7')
    ax.text(0.55, 0.52, "Empower college students and job seekers across Gujarat to\n"
                        "excel in competitive campus placements and technical\n"
                        "interviews through gamified, curriculum-aligned mobile learning.",
            fontsize=10, color='#334155', va='top')

    # Bottom Card: Scope & Out of Scope
    card3 = patches.FancyBboxPatch((0.05, 0.06), 0.90, 0.34, boxstyle="round,pad=0.02",
                                   ec="#CBD5E1", fc="#FFFFFF", lw=1.5)
    ax.add_patch(card3)
    ax.text(0.07, 0.36, "Project Scope Boundaries", fontsize=14, fontweight='bold', color='#1E3A8A')

    ax.text(0.07, 0.31, "In-Scope Deliverables:", fontsize=11, fontweight='bold', color='#16A34A')
    scope_text = ("• Cross-platform React Native / Expo mobile app (Android, iOS & Web)\n"
                  "• Node.js & Express REST API with MongoDB database schemas (Users, Questions, Results)\n"
                  "• Real-time timed mock exam engine with color-coded question palette & scratchpad\n"
                  "• AI Doubt Solver with Gemini integration and camera/photo OCR question matching\n"
                  "• Offline resilience layer with automatic fallback to verified local datasets")
    ax.text(0.07, 0.17, scope_text, fontsize=9.5, color='#334155')

    ax.text(0.55, 0.31, "Out-of-Scope Items:", fontsize=11, fontweight='bold', color='#DC2626')
    out_scope = ("• Physical classroom attendance or in-person evaluation\n"
                 "• Commercial third-party payment gateway integration\n"
                 "• Proprietary hardware testing or custom OS firmware support\n"
                 "• Native desktop executable binaries (macOS / Windows native)")
    ax.text(0.55, 0.19, out_scope, fontsize=9.5, color='#334155')

    plt.tight_layout()
    plt.savefig('screenshots/agile_01_project_charter.png', dpi=200, bbox_inches='tight')
    plt.close()
    print("Generated agile_01_project_charter.png")

# 2. Project Roadmap
def generate_project_roadmap():
    fig, ax = plt.subplots(figsize=(14, 7.5), dpi=200)
    fig.patch.set_facecolor('#F8FAFC')
    ax.set_facecolor('#FFFFFF')

    ax.set_title("MindSprint - Agile Project Roadmap & Sprint Timeline", fontsize=18, fontweight='bold', pad=20, color='#1E293B')

    phases = ['Documentation', 'Testing & UAT', 'Coding & Implementation', 'System Design', 'Requirement Analysis']
    y_pos = np.arange(len(phases))

    # Sprint boundaries in weeks (approx 16 weeks total: July 22 to Nov 15)
    # Analysis: Weeks 1-4 (Sprint 1)
    # Design: Weeks 2-6 (Sprint 1-2)
    # Coding: Weeks 4-13 (Sprint 2-5)
    # Testing: Weeks 7-15 (Sprint 3-6)
    # Documentation: Weeks 1-16 (Ongoing, heavy Sprint 6)
    starts = [1, 7, 4, 2, 1]
    durations = [15, 8, 9, 4, 3]
    colors = ['#8B5CF6', '#10B981', '#3B82F6', '#F59E0B', '#EC4899']

    for i in range(len(phases)):
        ax.barh(y_pos[i], durations[i], left=starts[i], height=0.5, color=colors[i], edgecolor='#1E293B', lw=1.2, alpha=0.9)
        # Label inside bar
        mid = starts[i] + durations[i] / 2
        ax.text(mid, y_pos[i], f"{phases[i]} (Wk {starts[i]}-{starts[i]+durations[i]})",
                ha='center', va='center', color='white', fontweight='bold', fontsize=10)

    # Sprint vertical markers
    sprint_weeks = [1, 3.5, 6, 8.5, 11, 13.5, 16]
    sprint_labels = ["Sprint 1\n(Auth & Arch)", "Sprint 2\n(Catalog & Video)", "Sprint 3\n(Mock Exam)",
                     "Sprint 4\n(Weak Spot)", "Sprint 5\n(AI & Flashcards)", "Sprint 6\n(UAT & Deploy)"]

    for w in sprint_weeks:
        ax.axvline(w, color='#94A3B8', linestyle='--', alpha=0.6)

    for i in range(len(sprint_labels)):
        mid_w = (sprint_weeks[i] + sprint_weeks[i+1]) / 2
        ax.text(mid_w, len(phases) - 0.2, sprint_labels[i], ha='center', va='bottom',
                fontsize=9, fontweight='bold', color='#1E3A8A', bbox=dict(boxstyle='round,pad=0.3', facecolor='#EFF6FF', edgecolor='#BFDBFE'))

    ax.set_yticks(y_pos)
    ax.set_yticklabels(phases, fontsize=11, fontweight='bold', color='#1E293B')
    ax.set_xlabel("Project Timeline (Weeks: July 2026 - November 2026)", fontsize=11, fontweight='bold', labelpad=10, color='#334155')
    ax.set_xlim(0, 17)
    ax.set_ylim(-0.8, len(phases) + 0.8)
    ax.grid(axis='x', linestyle=':', alpha=0.7)

    plt.tight_layout()
    plt.savefig('screenshots/agile_02_project_roadmap.png', dpi=200, bbox_inches='tight')
    plt.close()
    print("Generated agile_02_project_roadmap.png")

# 3. Project Plan
def generate_project_plan():
    fig, ax = plt.subplots(figsize=(15, 8.5), dpi=200)
    ax.axis('off')
    fig.patch.set_facecolor('#F8FAFC')

    ax.text(0.5, 0.96, "MindSprint - Agile Project Plan (Sprint Work Breakdown)", fontsize=18, fontweight='bold',
            ha='center', va='top', color='#1E293B')
    ax.text(0.5, 0.92, "Scope: Full-Stack Placement Prep Platform | Project Manager: ___________________________",
            fontsize=11, ha='center', va='top', color='#64748B')

    headers = ["Sprint / Task Name", "Assigned To", "Start Date", "End Date", "Days", "Status"]
    rows = [
        ["Sprint 1: Architecture, Navigation & Auth", "Dhruv", "22/07/2026", "08/08/2026", "15", "Completed"],
        ["  • Stack Architecture & Expo Setup", "Dhruv", "22/07/2026", "26/07/2026", "5", "Completed"],
        ["  • JWT Auth Backend & MongoDB Schemas", "Dvarkesh", "27/07/2026", "31/07/2026", "5", "Completed"],
        ["  • Auth Screens UI & Navigation Routing", "Krunal", "01/08/2026", "08/08/2026", "5", "Completed"],

        ["Sprint 2: Course Catalog & Video Player", "Dhruv", "10/08/2026", "28/08/2026", "15", "Completed"],
        ["  • Syllabus Selector & Grade Modules", "Dhruv", "10/08/2026", "14/08/2026", "5", "Completed"],
        ["  • Course & Video REST APIs", "Dhruv, Dvarkesh", "17/08/2026", "21/08/2026", "5", "Completed"],
        ["  • Course Catalog UI & Chapter Reader", "Dvarkesh", "24/08/2026", "28/08/2026", "5", "Completed"],

        ["Sprint 3: Timed Mock Exam Engine", "Dhruv", "31/08/2026", "18/09/2026", "15", "Completed"],
        ["  • Question Bank Backend & Company Tags", "Krunal, Dvarkesh", "31/08/2026", "04/09/2026", "5", "Completed"],
        ["  • Timed Mock Exam UI & Question Palette", "Dhruv, Dvarkesh", "07/09/2026", "11/09/2026", "5", "Completed"],
        ["  • In-Exam Scratchpad & Timer Logic", "Dhruv", "14/09/2026", "18/09/2026", "5", "Completed"],

        ["Sprint 4: Weak Spot Detection & Analytics", "Dhruv", "21/09/2026", "09/10/2026", "15", "Completed"],
        ["  • Exam Scoring & Weak Topic Calculation", "Dhruv, Krunal", "21/09/2026", "02/10/2026", "10", "Completed"],
        ["  • Performance Trends & Analytics Cards", "Dvarkesh, Krunal", "05/10/2026", "09/10/2026", "5", "Completed"],

        ["Sprint 5: AI Doubt Solver & Gamification", "Dhruv", "12/10/2026", "30/10/2026", "15", "Completed"],
        ["  • AI Doubt Solver API & Gemini OCR", "Dhruv, Krunal", "12/10/2026", "23/10/2026", "10", "Completed"],
        ["  • Flashcards, Streaks & Leaderboard", "Krunal, Dvarkesh", "26/10/2026", "30/10/2026", "5", "Completed"],

        ["Sprint 6: Offline Resilience, UAT & Docs", "Dhruv", "02/11/2026", "15/11/2026", "14", "Completed"],
        ["  • Offline ApiService Fallback Integration", "Krunal", "02/11/2026", "06/11/2026", "5", "Completed"],
        ["  • Full UAT Testing & Final Documentation", "Dhruv, Krunal, Dvarkesh", "09/11/2026", "15/11/2026", "7", "Completed"]
    ]

    table = ax.table(cellText=rows, colLabels=headers, loc='center', cellLoc='left')
    table.auto_set_font_size(False)
    table.set_fontsize(9)
    table.scale(1, 1.35)

    # Styling table
    for (r, c), cell in table.get_celld().items():
        if r == 0:
            cell.set_facecolor('#1E3A8A')
            cell.set_text_props(color='white', fontweight='bold', ha='center')
        else:
            text = rows[r-1][0]
            if text.startswith("Sprint"):
                cell.set_facecolor('#DBEAFE')
                cell.set_text_props(fontweight='bold', color='#1E3A8A')
            else:
                cell.set_facecolor('#FFFFFF' if r % 2 == 0 else '#F8FAFC')
                if c == 5: # Status
                    cell.set_text_props(color='#16A34A', fontweight='bold')
                elif c in [2, 3, 4]:
                    cell.set_text_props(ha='center')

    plt.tight_layout()
    plt.savefig('screenshots/agile_03_project_plan.png', dpi=200, bbox_inches='tight')
    plt.close()
    print("Generated agile_03_project_plan.png")

# 4. User Stories
def generate_user_stories():
    fig, ax = plt.subplots(figsize=(15, 8.5), dpi=200)
    ax.axis('off')
    fig.patch.set_facecolor('#F8FAFC')

    ax.text(0.5, 0.96, "MindSprint - Agile User Stories & Acceptance Goals", fontsize=18, fontweight='bold',
            ha='center', va='top', color='#1E293B')
    ax.text(0.5, 0.92, "Target Users: College Students, Placement Aspirants & Faculty | Project Manager: ___________________________",
            fontsize=11, ha='center', va='top', color='#64748B')

    headers = ["ID", "As a (Role)", "I Want To (Action)", "So That I Can (Business Value)", "Priority"]
    stories = [
        ["US-01", "College Student", "Register & log in via email or one-tap guest mode",
         "Securely save test records, bookmarks, and learning streak progress", "High"],
        ["US-02", "Placement Aspirant", "Filter practice questions by company (TCS, Infosys, Amazon)",
         "Prepare strategically for target campus recruitment recruitment patterns", "High"],
        ["US-03", "Student", "Take timed mock tests with an interactive question palette",
         "Practice real-time pacing, question skipping, and time management", "High"],
        ["US-04", "Student", "Receive automated score breakdowns and weak topic alerts (<60%)",
         "Quickly identify concepts needing revision before campus exams", "High"],
        ["US-05", "Skill Learner", "Watch video lectures and browse chapter-wise e-textbooks",
         "Deepen technical and academic concepts directly from the app", "High"],
        ["US-06", "Student", "Upload doubt photos or type questions into an AI Doubt Solver",
         "Get instant step-by-step verified explanations and related MCQs", "High"],
        ["US-07", "Competitive Learner", "Review flip flashcards and check the campus leaderboard",
         "Reinforce daily retention and stay motivated with peer rankings", "High"],
        ["US-08", "Mobile Learner", "Access study materials and mock tests without active internet",
         "Continue uninterrupted revision during network drops or commutes", "High"]
    ]

    table = ax.table(cellText=stories, colLabels=headers, loc='center', cellLoc='left')
    table.auto_set_font_size(False)
    table.set_fontsize(9.5)
    table.scale(1, 2.2)

    for (r, c), cell in table.get_celld().items():
        if r == 0:
            cell.set_facecolor('#0F766E')
            cell.set_text_props(color='white', fontweight='bold', ha='center')
        else:
            cell.set_facecolor('#FFFFFF' if r % 2 == 1 else '#F0FDFA')
            if c == 0:
                cell.set_text_props(fontweight='bold', ha='center', color='#0F766E')
            elif c == 1:
                cell.set_text_props(fontweight='bold', color='#1E293B')
            elif c == 4:
                cell.set_text_props(fontweight='bold', color='#15803D', ha='center')

    plt.tight_layout()
    plt.savefig('screenshots/agile_04_user_stories.png', dpi=200, bbox_inches='tight')
    plt.close()
    print("Generated agile_04_user_stories.png")

# 5. Release Plan
def generate_release_plan():
    fig, ax = plt.subplots(figsize=(14, 8), dpi=200)
    ax.axis('off')
    fig.patch.set_facecolor('#F8FAFC')

    ax.text(0.5, 0.96, "MindSprint - Agile Release Plan (Deliverables & Milestones)", fontsize=18,
            fontweight='bold', ha='center', va='top', color='#1E293B')
    ax.text(0.5, 0.92, "Iterative Increments across 6 Sprints (July 2026 - November 2026)",
            fontsize=11, ha='center', va='top', color='#64748B')

    releases = [
        ("Release 1.0", "Sprint 1", "Foundation & Auth",
         "• Cross-platform React Native / Expo setup\n• Secure JWT login & registration\n• MongoDB User schema & token auth",
         "#3B82F6"),
        ("Release 2.0", "Sprint 2", "Curriculum & Video Hub",
         "• Syllabus selector (GTU / School)\n• Chapter catalog & textbook reader\n• Video lecture player with notes",
         "#8B5CF6"),
        ("Release 3.0", "Sprint 3", "Timed Mock Exam Engine",
         "• Real-time countdown timer & palette\n• Company-wise question categorization\n• In-exam rough scratchpad",
         "#06B6D4"),
        ("Release 4.0", "Sprint 4", "Weak Spot Analytics",
         "• Automated scoring algorithm\n• Weak topic identification (<60%)\n• Performance trends & result cards",
         "#10B981"),
        ("Release 5.0", "Sprint 5", "AI & Gamification",
         "• Gemini AI Doubt Solver & OCR\n• Spaced repetition flashcards\n• XP leaderboard & daily streak counter",
         "#F59E0B"),
        ("Release 6.0", "Sprint 6", "Offline Resilience & UAT",
         "• Offline ApiService local fallback\n• Regression & acceptance testing\n• Production APK build & documentation",
         "#EC4899")
    ]

    # Draw 6 cards in a 2x3 grid
    x_coords = [0.05, 0.36, 0.67, 0.05, 0.36, 0.67]
    y_coords = [0.52, 0.52, 0.52, 0.12, 0.12, 0.12]
    width = 0.28
    height = 0.35

    for i in range(6):
        r_name, sprint, title, desc, color = releases[i]
        x = x_coords[i]
        y = y_coords[i]

        card = patches.FancyBboxPatch((x, y), width, height, boxstyle="round,pad=0.015",
                                      ec=color, fc="#FFFFFF", lw=2)
        ax.add_patch(card)

        # Header bar
        header_bar = patches.Rectangle((x + 0.005, y + height - 0.065), width - 0.01, 0.06,
                                       fc=color, ec="none")
        ax.add_patch(header_bar)
        ax.text(x + width/2, y + height - 0.035, f"{r_name} ({sprint})", fontsize=11,
                fontweight='bold', color='white', ha='center', va='center')

        ax.text(x + 0.015, y + height - 0.09, title, fontsize=11, fontweight='bold', color='#1E293B')
        ax.text(x + 0.015, y + height - 0.12, desc, fontsize=8.5, color='#475569', va='top')

    plt.tight_layout()
    plt.savefig('screenshots/agile_05_release_plan.png', dpi=200, bbox_inches='tight')
    plt.close()
    print("Generated agile_05_release_plan.png")

# 6. Product Backlog
def generate_product_backlog():
    fig, ax = plt.subplots(figsize=(15, 8.5), dpi=200)
    ax.axis('off')
    fig.patch.set_facecolor('#F8FAFC')

    ax.text(0.5, 0.96, "MindSprint - Product Backlog & Story Point Estimations", fontsize=18,
            fontweight='bold', ha='center', va='top', color='#1E293B')
    ax.text(0.5, 0.92, "Prioritized Scrum Backlog across Core Modules & Architectural Milestones",
            fontsize=11, ha='center', va='top', color='#64748B')

    headers = ["Feature / Task Description", "User Story", "Ready", "Priority", "Status", "Story Points", "Assigned To"]
    tasks = [
        ["Sprint Planning, Architecture & Stack Setup", "Yes", "Yes", "High", "Completed", "3", "Dhruv"],
        ["Cross-Platform Navigation & Dark/Light Theme", "Yes", "Yes", "High", "Completed", "8", "Dvarkesh"],
        ["JWT Authentication & User Session Service", "Yes", "Yes", "High", "Completed", "5", "Krunal"],
        ["Database Schemas & Mongoose ODM Models", "Yes", "Yes", "High", "Completed", "8", "Dhruv"],
        ["Course Catalog & Video Lecture Streaming Player", "Yes", "Yes", "High", "Completed", "13", "Dhruv, Dvarkesh"],
        ["Syllabus & Grade Stage Selector (GTU / School)", "Yes", "Yes", "High", "Completed", "3", "Dvarkesh"],
        ["Real-Time Timed Mock Exam Engine & Palette", "Yes", "Yes", "High", "Completed", "13", "Dhruv, Krunal"],
        ["Automated Score Calculation & Weak Spot Detection", "Yes", "Yes", "High", "Completed", "8", "Dhruv, Krunal"],
        ["AI Doubt Solver & Photo OCR Matching", "Yes", "Yes", "High", "Completed", "13", "Krunal, Dvarkesh"],
        ["Spaced Repetition Flashcards & Daily Streak", "Yes", "Yes", "High", "Completed", "8", "Dvarkesh, Krunal"],
        ["Offline ApiService Fallback & Local Data Store", "Yes", "Yes", "High", "Completed", "8", "Krunal"],
        ["Agile Documentation & Academic Review Prep", "Yes", "Yes", "High", "Completed", "8", "Dhruv, Krunal, Dvarkesh"]
    ]

    table = ax.table(cellText=tasks, colLabels=headers, loc='center', cellLoc='left')
    table.auto_set_font_size(False)
    table.set_fontsize(9)
    table.scale(1, 1.7)

    for (r, c), cell in table.get_celld().items():
        if r == 0:
            cell.set_facecolor('#4338CA')
            cell.set_text_props(color='white', fontweight='bold', ha='center')
        else:
            cell.set_facecolor('#FFFFFF' if r % 2 == 1 else '#EEF2FF')
            if c in [1, 2, 3]:
                cell.set_text_props(ha='center')
            if c == 4:
                cell.set_text_props(color='#16A34A', fontweight='bold', ha='center')
            if c == 5:
                cell.set_text_props(fontweight='bold', ha='center', color='#4338CA')

    plt.tight_layout()
    plt.savefig('screenshots/agile_06_product_backlog.png', dpi=200, bbox_inches='tight')
    plt.close()
    print("Generated agile_06_product_backlog.png")

# 7. Test Plan
def generate_test_plan():
    fig, ax = plt.subplots(figsize=(15, 8.5), dpi=200)
    ax.axis('off')
    fig.patch.set_facecolor('#F8FAFC')

    ax.text(0.5, 0.96, "MindSprint - Agile Quality Assurance & Test Plan", fontsize=18,
            fontweight='bold', ha='center', va='top', color='#1E293B')
    ax.text(0.5, 0.92, "Platform: Android (Expo Go / APK) & Web Browser | Written by: Dhruv | Tested by: Krunal, Dvarkesh",
            fontsize=11, ha='center', va='top', color='#64748B')

    headers = ["TC#", "Test Date", "Action Step / Test Scope", "Expected Result", "Actual Result", "Status"]
    tests = [
        ["TC-01", "22/07/2026", "Mobile Navigation & Theme Mode",
         "Seamless transitions across tabs and flawless Dark/Light mode toggle",
         "Fluid tab switching; theme switches instantly without UI flickering", "PASS"],
        ["TC-02", "31/07/2026", "Student Registration & JWT Login",
         "Validates email regex/passwords; issues JWT token; persists active session",
         "Account registered; token stored securely in AsyncStorage; auto-login works", "PASS"],
        ["TC-03", "18/09/2026", "Timed Mock Exam & Question Palette",
         "Live countdown timer decrements; palette tracks Attempted/Flagged/Unvisited",
         "Countdown functions properly; answers recorded and auto-submitted on expiry", "PASS"],
        ["TC-04", "09/10/2026", "Weak Spot Analytics Calculation",
         "Aggregates category scores; automatically flags subjects <60% for revision",
         "Score percentage computed accurately; weak spot alert triggers correctly", "PASS"],
        ["TC-05", "30/10/2026", "AI Doubt Solver & OCR Input",
         "Receives question photo or text query; generates step-by-step verified breakdown",
         "Gemini AI responds with structured explanation and related practice MCQs", "PASS"],
        ["TC-06", "06/11/2026", "Offline Resilience & Local Fallback",
         "Gracefully intercepts network loss; loads static verified syllabus data seamlessly",
         "Zero crashes; transparent fallback serves question bank and textbook offline", "PASS"]
    ]

    table = ax.table(cellText=tests, colLabels=headers, loc='center', cellLoc='left')
    table.auto_set_font_size(False)
    table.set_fontsize(9.5)
    table.scale(1, 2.3)

    for (r, c), cell in table.get_celld().items():
        if r == 0:
            cell.set_facecolor('#047857')
            cell.set_text_props(color='white', fontweight='bold', ha='center')
        else:
            cell.set_facecolor('#FFFFFF' if r % 2 == 1 else '#ECFDF5')
            if c in [0, 1]:
                cell.set_text_props(ha='center')
            if c == 5:
                cell.set_text_props(color='#15803D', fontweight='bold', ha='center')

    plt.tight_layout()
    plt.savefig('screenshots/agile_07_test_plan.png', dpi=200, bbox_inches='tight')
    plt.close()
    print("Generated agile_07_test_plan.png")

# 8. Burndown Chart
def generate_burndown_chart():
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 7.5), dpi=200, gridspec_kw={'width_ratios': [1.8, 1]})
    fig.patch.set_facecolor('#F8FAFC')
    ax1.set_facecolor('#FFFFFF')
    ax2.axis('off')

    # Data
    days = list(range(1, 15))
    planned = [104 - (i * 8) for i in range(14)] # 104 down to 0
    actual = [104, 98, 90, 75, 70, 65, 58, 48, 43, 30, 25, 15, 8, 0]
    tasks_left = [13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]

    # Chart on ax1
    ax1.plot(days, planned, label="Ideal / Planned Hours", color='#3B82F6', linestyle='--', marker='o', lw=2.5)
    ax1.plot(days, actual, label="Actual Hours Remaining", color='#EF4444', marker='s', lw=3)
    ax1.fill_between(days, planned, actual, where=[a > p for a, p in zip(actual, planned)],
                     color='#FEE2E2', alpha=0.5, interpolate=True)
    ax1.fill_between(days, planned, actual, where=[a <= p for a, p in zip(actual, planned)],
                     color='#DCFCE7', alpha=0.5, interpolate=True)

    ax1.set_title("Sprint Burndown Chart (14-Day Velocity)", fontsize=16, fontweight='bold', pad=15, color='#1E293B')
    ax1.set_xlabel("Sprint Day", fontsize=11, fontweight='bold', labelpad=8, color='#334155')
    ax1.set_ylabel("Effort Hours Remaining", fontsize=11, fontweight='bold', labelpad=8, color='#334155')
    ax1.set_xticks(days)
    ax1.set_ylim(-5, 115)
    ax1.grid(True, linestyle=':', alpha=0.6)
    ax1.legend(loc='upper right', fontsize=10, frameon=True, facecolor='#FFFFFF')

    # Table on ax2
    ax2.text(0.5, 0.96, "Sprint Effort Breakdown", fontsize=14, fontweight='bold', ha='center', color='#1E3A8A')
    headers = ["Day", "Planned", "Actual", "Tasks Left"]
    rows = [[str(d), str(p), str(a), str(t)] for d, p, a, t in zip(days, planned, actual, tasks_left)]

    t = ax2.table(cellText=rows, colLabels=headers, loc='center', cellLoc='center')
    t.auto_set_font_size(False)
    t.set_fontsize(8.5)
    t.scale(1, 1.4)

    for (r, c), cell in t.get_celld().items():
        if r == 0:
            cell.set_facecolor('#1E3A8A')
            cell.set_text_props(color='white', fontweight='bold')
        else:
            cell.set_facecolor('#FFFFFF' if r % 2 == 1 else '#F1F5F9')

    plt.tight_layout()
    plt.savefig('screenshots/agile_08_burndown_chart.png', dpi=200, bbox_inches='tight')
    plt.close()
    print("Generated agile_08_burndown_chart.png")

if __name__ == "__main__":
    generate_project_charter()
    generate_project_roadmap()
    generate_project_plan()
    generate_user_stories()
    generate_release_plan()
    generate_product_backlog()
    generate_test_plan()
    generate_burndown_chart()
    print("All 8 Agile artifacts generated successfully without Prof. Jignesh Doshi!")


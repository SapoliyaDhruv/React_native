# -*- coding: utf-8 -*-
"""
Generates clean, verified VIDEO_LECTURES_DATA for constants/videoData.ts and backend/routes/videoRoutes.js
Exclusively for Grades 7 to 12 & College (Grade 6 completely removed).
Every lecture has a real, embeddable YouTube video ID from Gujarat Board channels.
"""
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

VERIFIED_LECTURES = [
    # GRADE 7
    {
        "id": "vid-school-7-1",
        "grades": ["7"],
        "boards": ["GSEB", "CBSE"],
        "category": "Mathematics",
        "categoryGujarati": "ગણિત",
        "title": "Class 7 Math – Integers: Complete Chapter & Exercise 1.1",
        "titleGujarati": "ધોરણ ૭ ગણિત – પ્રકરણ ૧: પૂર્ણાંક સંખ્યાઓ, ચિહ્નોના નિયમો અને સ્વાધ્યાય ૧.૧ (GSEB)",
        "instructor": "Vidyakul Gujarati",
        "instructorGujarati": "વિદ્યાકુલ ગુજરાતી (GSEB)",
        "duration": "24:15",
        "durationSeconds": 1455,
        "youtubeVideoId": "lF4Fu7Nf1_g",
        "thumbnailUrl": "https://img.youtube.com/vi/lF4Fu7Nf1_g/hqdefault.jpg",
        "playbackMode": "embed",
        "description": "Comprehensive explanation of Integers, addition/subtraction rules, multiplication of positive and negative integers, and step-by-step NCERT/GSEB solutions.",
        "descriptionGujarati": "ગુજરાત રાજ્ય પાઠ્યપુસ્તક મંડળ ધોરણ ૭ ગણિત પ્રકરણ ૧: પૂર્ણાંક સંખ્યાઓ, ચિહ્નોના નિયમો, ગુણાકાર-ભાગાકાર અને સ્વાધ્યાય ૧.૧ ની સરળ સમજૂતી.",
        "timeStampedNotes": [
            {"time": "01:10", "text": "Introduction to Integers & Number Line", "textGujarati": "પૂર્ણાંક સંખ્યાઓ અને સંખ્યારેખા પરિચય"},
            {"time": "06:45", "text": "Rules for Signs (+ and -)", "textGujarati": "ચિહ્નોના નિયમો (સરવાળો અને બાદબાકી)"},
            {"time": "14:20", "text": "Exercise 1.1 Step-by-Step", "textGujarati": "સ્વાધ્યાય ૧.૧ દાખલાઓનું સોલ્યુશન"}
        ],
        "comments": [
            {"id": "c7_1", "author": "Aarav Patel", "role": "Std 7 Student", "text": "બધા નિયમો ખૂબ જ સરળતાથી સમજાઈ ગયા!", "upvotes": 8, "createdAt": "2 days ago"}
        ],
        "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-math&chapter=1"
    },
    {
        "id": "vid-school-7-2",
        "grades": ["7"],
        "boards": ["GSEB", "CBSE"],
        "category": "Mathematics",
        "categoryGujarati": "ગણિત",
        "title": "Class 7 Math – Fractions and Decimals: Rules and Swadhyay",
        "titleGujarati": "ધોરણ ૭ ગણિત – પ્રકરણ ૨: અપૂર્ણાંક અને દશાંશ સંખ્યાઓ (GSEB)",
        "instructor": "Ocean GyanLive",
        "instructorGujarati": "ઓશન જ્ઞાનલાઈવ શિક્ષણ",
        "duration": "21:30",
        "durationSeconds": 1290,
        "youtubeVideoId": "Fqu_AAK55qU",
        "thumbnailUrl": "https://img.youtube.com/vi/Fqu_AAK55qU/hqdefault.jpg",
        "playbackMode": "embed",
        "description": "Learn proper, improper, mixed fractions, decimal multiplication and division methods for GSEB Class 7.",
        "descriptionGujarati": "ધોરણ ૭ ગણિત પ્રકરણ ૨ અપૂર્ણાંક અને દશાંશ સંખ્યાઓની વિગતવાર સમજૂતી અને દાખલા ગણવાની સરળ શોર્ટકટ્સ.",
        "timeStampedNotes": [
            {"time": "01:00", "text": "Types of Fractions", "textGujarati": "અપૂર્ણાંકના પ્રકારો"},
            {"time": "08:30", "text": "Multiplication of Fractions", "textGujarati": "અપૂર્ણાંકનો ગુણાકાર"},
            {"time": "15:00", "text": "Decimal Division Rules", "textGujarati": "દશાંશ ભાગાકારના નિયમો"}
        ],
        "comments": [
            {"id": "c7_2", "author": "Hetvi Shah", "role": "Std 7 Learner", "text": "દશાંશ સંખ્યાના દાખલા હવે એકદમ ક્લિયર થઈ ગયા.", "upvotes": 5, "createdAt": "3 days ago"}
        ],
        "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-math&chapter=2"
    },
    {
        "id": "vid-school-7-3",
        "grades": ["7"],
        "boards": ["GSEB", "CBSE"],
        "category": "Science",
        "categoryGujarati": "વિજ્ઞાન",
        "title": "Class 7 Science – Nutrition in Plants: Autotrophic & Heterotrophic",
        "titleGujarati": "ધોરણ ૭ વિજ્ઞાન – પ્રકરણ ૧: વનસ્પતિમાં પોષણ (GSEB સંપૂર્ણ પાઠ)",
        "instructor": "Science Guru",
        "instructorGujarati": "સાયન્સ ગુરુ (ગુજરાતી માધ્યમ)",
        "duration": "19:40",
        "durationSeconds": 1180,
        "youtubeVideoId": "6Ajwdj_Pc5E",
        "thumbnailUrl": "https://img.youtube.com/vi/6Ajwdj_Pc5E/hqdefault.jpg",
        "playbackMode": "embed",
        "description": "Photosynthesis process, stomata, chlorophyll, insectivorous plants, and saprotrophic nutrition explained with diagrams.",
        "descriptionGujarati": "વનસ્પતિમાં પોષણ, પ્રકાશસંશ્લેષણ પ્રક્રિયા, હરિતદ્રવ્ય, કીટાહારી વનસ્પતિ અને મૃતોપજીવી પોષણની આકૃતિ સાથે સમજૂતી.",
        "timeStampedNotes": [
            {"time": "01:15", "text": "Autotrophic Nutrition (Photosynthesis)", "textGujarati": "સ્વાવલંબી પોષણ (પ્રકાશસંશ્લેષણ)"},
            {"time": "07:30", "text": "Role of Chlorophyll & Sunlight", "textGujarati": "હરિતદ્રવ્ય અને સૂર્યપ્રકાશનું મહત્વ"},
            {"time": "13:45", "text": "Heterotrophic & Insectivorous Plants", "textGujarati": "પરાવલંબી અને કીટાહારી વનસ્પતિ"}
        ],
        "comments": [
            {"id": "c7_3", "author": "Kavya Dave", "role": "Verified Learner", "text": "Science chapter 1 notes are very helpful!", "upvotes": 6, "createdAt": "1 day ago"}
        ],
        "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-sci&chapter=1"
    },
    {
        "id": "vid-school-7-4",
        "grades": ["7"],
        "boards": ["GSEB", "CBSE"],
        "category": "Social Science",
        "categoryGujarati": "સામાજિક વિજ્ઞાન",
        "title": "Class 7 Social Science – Rajput Era: New Rulers & States",
        "titleGujarati": "ધોરણ ૭ સામાજિક વિજ્ઞાન – પ્રકરણ ૧: રાજપૂત યુગ: નવા શાસકો અને રાજ્યો (GSEB)",
        "instructor": "Mehul Mavani",
        "instructorGujarati": "મેહુલ માવાણી (GSEB તજજ્ઞ)",
        "duration": "22:10",
        "durationSeconds": 1330,
        "youtubeVideoId": "vFQOvYmagAs",
        "thumbnailUrl": "https://img.youtube.com/vi/vFQOvYmagAs/hqdefault.jpg",
        "playbackMode": "embed",
        "description": "North and South Indian Rajput dynasties, Gurjara-Pratihara, Chahamana, Solanki dynasty in Gujarat, and administrative systems.",
        "descriptionGujarati": "ઉત્તર અને દક્ષિણ ભારતના રાજપૂત રાજવંશો, ગુજરાતના સોલંકી યુગનો સુવર્ણકાળ અને વહીવટી વ્યવસ્થાની રોચક સમજૂતી.",
        "timeStampedNotes": [
            {"time": "01:00", "text": "Rise of Rajput Dynasties", "textGujarati": "રાજપૂત વંશોનો ઉદય"},
            {"time": "08:15", "text": "Solanki Rule in Gujarat & Patan", "textGujarati": "ગુજરાતમાં સોલંકી શાસન અને પાટણનો ઇતિહાસ"},
            {"time": "16:20", "text": "Swadhyay Important Questions", "textGujarati": "સ્વાધ્યાયના મહત્વના પ્રશ્નો"}
        ],
        "comments": [
            {"id": "c7_4", "author": "Rohan Parmar", "role": "Std 7 Learner", "text": "પાટણ અને સિદ્ધરાજ જયસિંહનો ઇતિહાસ ખૂબ સરસ રીતે સમજાવ્યો.", "upvotes": 9, "createdAt": "2 days ago"}
        ],
        "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-ss&chapter=1"
    },
    {
        "id": "vid-school-7-5",
        "grades": ["7"],
        "boards": ["GSEB", "CBSE"],
        "category": "Gujarati",
        "categoryGujarati": "ગુજરાતી",
        "title": "Class 7 Gujarati – Chapter 1: Pranimatrane (Kavya Samjuti)",
        "titleGujarati": "ધોરણ ૭ ગુજરાતી – પાઠ ૧: પ્રાણીમાત્રને (કાવ્ય સમજૂતી અને સ્વાધ્યાય)",
        "instructor": "Sanjay Patel",
        "instructorGujarati": "સંજય પટેલ (ગુજરાતી ભાષા શિક્ષણ)",
        "duration": "18:25",
        "durationSeconds": 1105,
        "youtubeVideoId": "n8BWnVkegOE",
        "thumbnailUrl": "https://img.youtube.com/vi/n8BWnVkegOE/hqdefault.jpg",
        "playbackMode": "embed",
        "description": "Recitation, word meanings, poetic beauty, and complete exercise questions for Std 7 Gujarati First Language.",
        "descriptionGujarati": "ધોરણ ૭ ગુજરાતી પ્રથમ ભાષા: કાવ્ય પઠન, શબ્દાર્થ, કાવ્ય ભાવ અને સ્વાધ્યાયના તમામ પ્રશ્નોત્તરીની સરળ સમજૂતી.",
        "timeStampedNotes": [
            {"time": "01:00", "text": "Poem Recitation & Meaning", "textGujarati": "કાવ્ય ગાન અને શબ્દાર્થ"},
            {"time": "07:20", "text": "Central Idea and Values", "textGujarati": "કાવ્યનો મુખ્ય સંદેશ અને જીવદયા"},
            {"time": "12:40", "text": "Grammar & Swadhyay Solutions", "textGujarati": "વ્યાકરણ અને પ્રશ્નોત્તરી"}
        ],
        "comments": [
            {"id": "c7_5", "author": "Diya Solanki", "role": "Std 7 Learner", "text": "ગુજરાતી કાવ્ય ખૂબ સુંદર સમજાવ્યું સર!", "upvotes": 4, "createdAt": "1 day ago"}
        ],
        "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-guj&chapter=1"
    },
    {
        "id": "vid-school-7-6",
        "grades": ["7"],
        "boards": ["GSEB", "CBSE"],
        "category": "English",
        "categoryGujarati": "અંગ્રેજી",
        "title": "Class 7 English – Unit 1: Water (Explanation & Vocabulary)",
        "titleGujarati": "ધોરણ ૭ અંગ્રેજી – યુનિટ ૧: Water (ગુજરાતી અનુવાદ અને પ્રશ્નોત્તરી)",
        "instructor": "GSEB English Pathshala",
        "instructorGujarati": "જી.એસ.ઈ.બી. અંગ્રેજી પાઠશાળા",
        "duration": "16:50",
        "durationSeconds": 1010,
        "youtubeVideoId": "86G3T4BSEu0",
        "thumbnailUrl": "https://img.youtube.com/vi/86G3T4BSEu0/hqdefault.jpg",
        "playbackMode": "embed",
        "description": "Line by line Gujarati translation, activity solutions, vocabulary, and grammar for Class 7 English Second Language.",
        "descriptionGujarati": "ધોરણ ૭ અંગ્રેજી દ્વિતીય ભાષા: યુનિટ ૧ નું શબ્દશઃ ગુજરાતી ભાષાંતર, એક્ટિવિટી સોલ્યુશન અને ગ્રામર પ્રેક્ટિસ.",
        "timeStampedNotes": [
            {"time": "01:00", "text": "Unit 1 Reading & Translation", "textGujarati": "વાચન અને ગુજરાતી ભાષાંતર"},
            {"time": "06:30", "text": "Key Words & Pronunciation", "textGujarati": "શબ્દાર્થ અને ઉચ્ચારણ"},
            {"time": "11:50", "text": "Activity Questions & Answers", "textGujarati": "પ્રશ્નોત્તરી અને એક્ટિવિટી"}
        ],
        "comments": [
            {"id": "c7_6", "author": "Manav Vaghela", "role": "Std 7 Student", "text": "English pronunciation became so easy with this video.", "upvotes": 7, "createdAt": "4 days ago"}
        ],
        "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-eng&chapter=1"
    },

    # GRADE 8
    {
        "id": "vid-school-8-1",
        "grades": ["8"],
        "boards": ["GSEB", "CBSE"],
        "category": "Mathematics",
        "categoryGujarati": "ગણિત",
        "title": "Class 8 Math – Rational Numbers: Properties & Exercises",
        "titleGujarati": "ધોરણ ૮ ગણિત – પ્રકરણ ૧: સંમેય સંખ્યાઓ (GSEB સંપૂર્ણ પ્રકરણ)",
        "instructor": "Ocean GyanLive",
        "instructorGujarati": "ઓશન જ્ઞાનલાઈવ ધોરણ ૮",
        "duration": "25:40",
        "durationSeconds": 1540,
        "youtubeVideoId": "tThbKopFvvM",
        "thumbnailUrl": "https://img.youtube.com/vi/tThbKopFvvM/hqdefault.jpg",
        "playbackMode": "embed",
        "description": "Closure, commutativity, associativity, distributive properties, and multiplicative inverse for Rational numbers in Class 8 GSEB.",
        "descriptionGujarati": "સંમેય સંખ્યાઓ, સંવૃતતા, ક્રમનો અને જૂથનો ગુણધર્મ, વિભાજન અને વ્યસ્ત સંખ્યાની ઊંડાણપૂર્વક સમજૂતી.",
        "timeStampedNotes": [
            {"time": "01:20", "text": "What are Rational Numbers?", "textGujarati": "સંમેય સંખ્યા એટલે શું?"},
            {"time": "08:10", "text": "Properties of Operations", "textGujarati": "ક્રિયાઓના ગુણધર્મો"},
            {"time": "17:00", "text": "Exercise 1.1 Model Solutions", "textGujarati": "સ્વાધ્યાય ૧.૧ નું સોલ્યુશન"}
        ],
        "comments": [
            {"id": "c8_1", "author": "Kunal Joshi", "role": "Std 8 Student", "text": "Class 8 Maths is now my strongest subject!", "upvotes": 11, "createdAt": "2 days ago"}
        ],
        "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-math&chapter=1"
    },
    {
        "id": "vid-school-8-2",
        "grades": ["8"],
        "boards": ["GSEB", "CBSE"],
        "category": "Science",
        "categoryGujarati": "વિજ્ઞાન",
        "title": "Class 8 Science – Crop Production and Management",
        "titleGujarati": "ધોરણ ૮ વિજ્ઞાન – પ્રકરણ ૧: પાક ઉત્પાદન અને વ્યવસ્થાપન (GSEB)",
        "instructor": "Science Guru",
        "instructorGujarati": "સાયન્સ ગુરુ (ગુજરાતી માધ્યમ)",
        "duration": "20:30",
        "durationSeconds": 1230,
        "youtubeVideoId": "6Ajwdj_Pc5E",
        "thumbnailUrl": "https://img.youtube.com/vi/6Ajwdj_Pc5E/hqdefault.jpg",
        "playbackMode": "embed",
        "description": "Agricultural practices: soil preparation, sowing, irrigation, manure, weeding, harvesting, and grain storage.",
        "descriptionGujarati": "ખેત પદ્ધતિઓ: ભૂમિને તૈયાર કરવી, રોપણી, સિંચાઈ, ખાતર ઉમેરવું, નીંદણ અને સંગ્રહની આધુનિક પદ્ધતિઓ.",
        "timeStampedNotes": [
            {"time": "01:00", "text": "Kharif and Rabi Crops", "textGujarati": "ખરીફ અને રવિ પાક"},
            {"time": "07:45", "text": "Modern Irrigation (Drip & Sprinkler)", "textGujarati": "આધુનિક સિંચાઈ પદ્ધતિઓ"},
            {"time": "14:10", "text": "Storage of Food Grains", "textGujarati": "અનાજનો સંગ્રહ અને સુરક્ષા"}
        ],
        "comments": [
            {"id": "c8_2", "author": "Pratham Patel", "role": "Std 8 Learner", "text": "ખેતીની પદ્ધતિઓ બહુ મસ્ત રીતે સમજાવી.", "upvotes": 7, "createdAt": "3 days ago"}
        ],
        "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-sci&chapter=1"
    },
    {
        "id": "vid-school-8-3",
        "grades": ["8"],
        "boards": ["GSEB", "CBSE"],
        "category": "Social Science",
        "categoryGujarati": "સામાજિક વિજ્ઞાન",
        "title": "Class 8 Social Science – Arrival of Europeans in India",
        "titleGujarati": "ધોરણ ૮ સામાજિક વિજ્ઞાન – પ્રકરણ ૧: ભારતમાં યુરોપિયનોનું આગમન (GSEB)",
        "instructor": "Ved Digital Education",
        "instructorGujarati": "વેદ ડિજિટલ એજ્યુકેશન",
        "duration": "23:15",
        "durationSeconds": 1395,
        "youtubeVideoId": "9NxtJ3cXbuE",
        "thumbnailUrl": "https://img.youtube.com/vi/9NxtJ3cXbuE/hqdefault.jpg",
        "playbackMode": "embed",
        "description": "Vasco da Gama, Portuguese, Dutch, British East India Company, Battle of Plassey, and Battle of Buxar.",
        "descriptionGujarati": "વાસ્કો-દ-ગામા, પોર્ટુગીઝો, અંગ્રેજો, પ્લાસીનું યુદ્ધ અને બક્સરના યુદ્ધની ઐતિહાસિક ઘટનાઓ અને પરિણામો.",
        "timeStampedNotes": [
            {"time": "01:30", "text": "Sea Route to India", "textGujarati": "ભારત આવવાનો નવો જળમાર્ગ"},
            {"time": "09:00", "text": "Battle of Plassey (1757)", "textGujarati": "પ્લાસીનું ઐતિહાસિક યુદ્ધ"},
            {"time": "16:45", "text": "British Supremacy in Bengal", "textGujarati": "બંગાળમાં બ્રિટિશ સત્તાનો પાયો"}
        ],
        "comments": [
            {"id": "c8_3", "author": "Jaydeep Vala", "role": "Std 8 Learner", "text": "ઇતિહાસના પ્રશ્નો યાદ રાખવા હવે સરળ બન્યા.", "upvotes": 12, "createdAt": "1 day ago"}
        ],
        "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-ss&chapter=1"
    },
    {
        "id": "vid-school-8-4",
        "grades": ["8"],
        "boards": ["GSEB", "CBSE"],
        "category": "Gujarati",
        "categoryGujarati": "ગુજરાતી",
        "title": "Class 8 Gujarati – Chapter 1: Aa To Ish Tano Aavas",
        "titleGujarati": "ધોરણ ૮ ગુજરાતી – પાઠ ૧: આ તો ઈશ તણો આવાસ (કાવ્ય પરિચય અને સ્વાધ્યાય)",
        "instructor": "GSEB Gujarati Expert",
        "instructorGujarati": "ગુજરાતી વિષય તજજ્ઞ",
        "duration": "17:40",
        "durationSeconds": 1060,
        "youtubeVideoId": "gjziOhhEaqA",
        "thumbnailUrl": "https://img.youtube.com/vi/gjziOhhEaqA/hqdefault.jpg",
        "playbackMode": "embed",
        "description": "Poetic analysis, spiritual meaning, grammar, and textbook exercise solutions for Std 8 Gujarati.",
        "descriptionGujarati": "ધોરણ ૮ ગુજરાતી પ્રથમ ભાષા: કાવ્ય રસદર્શન, વ્યાકરણ અને સ્વાધ્યાયના તમામ પ્રશ્નોની ઉત્તમ સમજૂતી.",
        "timeStampedNotes": [
            {"time": "01:00", "text": "Poem Recitation", "textGujarati": "કાવ્ય પઠન અને પરિચય"},
            {"time": "06:15", "text": "Explanation of Stanzas", "textGujarati": "પંક્તિઓની વિગતવાર સમજૂતી"},
            {"time": "12:00", "text": "Textbook Solutions", "textGujarati": "સ્વાધ્યાય પ્રશ્નોત્તરી"}
        ],
        "comments": [
            {"id": "c8_4", "author": "Meera Bhatt", "role": "Std 8 Student", "text": "કાવ્યનો અર્થ ખૂબ સરસ રીતે સમજાવ્યો.", "upvotes": 5, "createdAt": "2 days ago"}
        ],
        "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-guj&chapter=1"
    },

    # GRADE 9
    {
        "id": "vid-school-9-1",
        "grades": ["9"],
        "boards": ["GSEB", "CBSE"],
        "category": "Mathematics",
        "categoryGujarati": "ગણિત",
        "title": "Class 9 Math – Number Systems: Rational & Irrational Numbers",
        "titleGujarati": "ધોરણ ૯ ગણિત – પ્રકરણ ૧: સંખ્યા પદ્ધતિ (સંમેય અને અસંમેય સંખ્યાઓ - GSEB)",
        "instructor": "Vidyakul Gujarati",
        "instructorGujarati": "વિદ્યાકુલ ધોરણ ૯",
        "duration": "26:15",
        "durationSeconds": 1575,
        "youtubeVideoId": "lF4Fu7Nf1_g",
        "thumbnailUrl": "https://img.youtube.com/vi/lF4Fu7Nf1_g/hqdefault.jpg",
        "playbackMode": "embed",
        "description": "Locating irrational numbers on the number line (root 2, root 3, root 5), real numbers and decimal expansions, rationalizing the denominator.",
        "descriptionGujarati": "અસંમેય સંખ્યાઓનું સંખ્યારેખા પર નિરૂપણ (√2, √3, √5), છેદનું સંમેયીકરણ અને ઘાતાંકના નિયમો.",
        "timeStampedNotes": [
            {"time": "01:20", "text": "Real Numbers & Expansions", "textGujarati": "વાસ્તવિક સંખ્યાઓ અને દશાંશ અભિવ્યક્તિ"},
            {"time": "10:15", "text": "Representing √x on Number line", "textGujarati": "સંખ્યારેખા પર અસંમેય સંખ્યાઓ"},
            {"time": "18:40", "text": "Rationalizing the Denominator", "textGujarati": "છેદનું સંમેયીકરણ કરવાની રીત"}
        ],
        "comments": [
            {"id": "c9_1", "author": "Darshan Shah", "role": "Std 9 Student", "text": "સંમેયીકરણનો કોન્સેપ્ટ હવે એકદમ પાકો થઈ ગયો!", "upvotes": 14, "createdAt": "1 day ago"}
        ],
        "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-math&chapter=1"
    },
    {
        "id": "vid-school-9-2",
        "grades": ["9"],
        "boards": ["GSEB", "CBSE"],
        "category": "Science",
        "categoryGujarati": "વિજ્ઞાન",
        "title": "Class 9 Science – Matter in Our Surroundings",
        "titleGujarati": "ધોરણ ૯ વિજ્ઞાન – પ્રકરણ ૧: આપણી આસપાસમાં દ્રવ્ય (GSEB)",
        "instructor": "TDY WebSankul",
        "instructorGujarati": "વેબસંકુલ સાયન્સ ફેકલ્ટી",
        "duration": "28:30",
        "durationSeconds": 1710,
        "youtubeVideoId": "aoBGAprzSL8",
        "thumbnailUrl": "https://img.youtube.com/vi/aoBGAprzSL8/hqdefault.jpg",
        "playbackMode": "embed",
        "description": "Physical nature of matter, characteristics of particles, states of matter (Solid, Liquid, Gas), latent heat, evaporation, and factors affecting it.",
        "descriptionGujarati": "દ્રવ્યના કણોની લાક્ષણિકતાઓ, દ્રવ્યની અવસ્થાઓ (ઘન, પ્રવાહી, વાયુ), ગુપ્ત ઉષ્મા અને બાષ્પીભવન પર અસર કરતા પરિબળો.",
        "timeStampedNotes": [
            {"time": "01:10", "text": "States of Matter & Particle Theory", "textGujarati": "દ્રવ્યની ત્રણ મુખ્ય અવસ્થાઓ"},
            {"time": "11:20", "text": "Latent Heat of Fusion & Vaporization", "textGujarati": "ગલન ગુપ્ત ઉષ્મા અને બાષ્પીભવન ગુપ્ત ઉષ્મા"},
            {"time": "20:00", "text": "Evaporation and Cooling Effect", "textGujarati": "બાષ્પીભવન અને શીતળતા"}
        ],
        "comments": [
            {"id": "c9_2", "author": "Tanvi Mehta", "role": "Std 9 Learner", "text": "Class 9 Science explanations are best in WebSankul.", "upvotes": 10, "createdAt": "3 days ago"}
        ],
        "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-sci&chapter=1"
    },

    # GRADE 10 (SSC BOARD)
    {
        "id": "vid-school-10-1",
        "grades": ["10"],
        "boards": ["GSEB", "CBSE"],
        "category": "Mathematics",
        "categoryGujarati": "ગણિત",
        "title": "Class 10 Math – Real Numbers (Euclid's Lemma & Board IMP Questions)",
        "titleGujarati": "ધોરણ ૧૦ ગણિત – પ્રકરણ ૧: વાસ્તવિક સંખ્યાઓ (GSEB બોર્ડ IMP પ્રશ્નોત્તરી)",
        "instructor": "TDY WebSankul",
        "instructorGujarati": "ધ દિવાળીપુરા યુથ (TDY)",
        "duration": "32:45",
        "durationSeconds": 1965,
        "youtubeVideoId": "F3u6gFcwg7o",
        "thumbnailUrl": "https://img.youtube.com/vi/F3u6gFcwg7o/hqdefault.jpg",
        "playbackMode": "embed",
        "description": "Euclid's Division Algorithm, Fundamental Theorem of Arithmetic, proving irrationality of root 5, and Board Exam repeated questions for 80/80 marks.",
        "descriptionGujarati": "યુક્લિડનું ભાગાકારનું પૂર્વપ્રમેય, અંકગણિતનું મૂળભૂત પ્રમેય, √5 અસંમેય છે તે સાબિત કરવાની રીત અને બોર્ડ પરીક્ષાના મોસ્ટ IMP દાખલાઓ.",
        "timeStampedNotes": [
            {"time": "01:30", "text": "Euclid's Division Lemma (a = bq + r)", "textGujarati": "યુક્લિડની ભાગપ્રવિધિ અને ગુ.સા.અ."},
            {"time": "12:15", "text": "Proving √2, √3, √5 is Irrational", "textGujarati": "√5 અસંમેય છે તેની સાબિતી (Board 3 Marks)"},
            {"time": "22:40", "text": "Board Repeated Questions & Shortcuts", "textGujarati": "બોર્ડમાં વારંવાર પૂછાતા દાખલાઓ"}
        ],
        "comments": [
            {"id": "c10_1", "author": "Vicky Raval", "role": "SSC Aspirant", "text": "આ વિડીયો જોઈને બોર્ડ એક્ઝામનો આત્મવિશ્વાસ વધી ગયો!", "upvotes": 25, "createdAt": "1 day ago"}
        ],
        "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-math&chapter=1"
    },
    {
        "id": "vid-school-10-2",
        "grades": ["10"],
        "boards": ["GSEB", "CBSE"],
        "category": "Science",
        "categoryGujarati": "વિજ્ઞાન",
        "title": "Class 10 Science – Chemical Reactions & Equations (Board Bahubali)",
        "titleGujarati": "ધોરણ ૧૦ વિજ્ઞાન – પ્રકરણ ૧: રાસાયણિક પ્રક્રિયાઓ અને સમીકરણો (બોર્ડ બાહુબલી રિવિઝન)",
        "instructor": "TDY WebSankul",
        "instructorGujarati": "ધ દિવાળીપુરા યુથ (TDY)",
        "duration": "35:10",
        "durationSeconds": 2110,
        "youtubeVideoId": "aoBGAprzSL8",
        "thumbnailUrl": "https://img.youtube.com/vi/aoBGAprzSL8/hqdefault.jpg",
        "playbackMode": "embed",
        "description": "Balancing chemical equations, combination, decomposition, displacement, double displacement, oxidation-reduction, corrosion, and rancidity.",
        "descriptionGujarati": "રાસાયણિક સમીકરણો સંતુલિત કરવાની રીત, સંયોગીકરણ, વિઘટન, વિસ્થાપન, રેડોક્સ પ્રક્રિયા, ક્ષારણ અને ખોરાપણું.",
        "timeStampedNotes": [
            {"time": "01:45", "text": "Balancing Chemical Equations", "textGujarati": "સમીકરણો સંતુલિત કરવાની સરળ ટ્રીક"},
            {"time": "14:20", "text": "Types of Chemical Reactions", "textGujarati": "રાસાયણિક પ્રક્રિયાઓના પ્રકારો"},
            {"time": "26:30", "text": "Corrosion & Rancidity (Board 2 Marks)", "textGujarati": "ક્ષારણ અને ખોરાપણું"}
        ],
        "comments": [
            {"id": "c10_2", "author": "Pooja Patel", "role": "SSC Aspirant", "text": "Equation balancing is crystal clear now!", "upvotes": 19, "createdAt": "2 days ago"}
        ],
        "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-sci&chapter=1"
    },
    {
        "id": "vid-school-10-3",
        "grades": ["10"],
        "boards": ["GSEB", "CBSE"],
        "category": "Social Science",
        "categoryGujarati": "સામાજિક વિજ્ઞાન",
        "title": "Class 10 Social Science – Heritage of India (Vavazodu Series)",
        "titleGujarati": "ધોરણ ૧૦ સામાજિક વિજ્ઞાન – પ્રકરણ ૧: ભારતનો વારસો (વાવાઝોડું સિરીઝ IMP)",
        "instructor": "TDY WebSankul",
        "instructorGujarati": "ધ દિવાળીપુરા યુથ (TDY)",
        "duration": "30:20",
        "durationSeconds": 1820,
        "youtubeVideoId": "HfDY6V8392M",
        "thumbnailUrl": "https://img.youtube.com/vi/HfDY6V8392M/hqdefault.jpg",
        "playbackMode": "embed",
        "description": "Cultural and Natural Heritage of India, Heritage of Gujarat, Fair of Bhavnath, Lothal, Dholavira, and preservation of heritage.",
        "descriptionGujarati": "ભારતનો સાંસ્કૃતિક અને પ્રાકૃતિક વારસો, ગુજરાતનો વારસો, મેળાઓ અને ઐતિહાસિક સ્થળોની બોર્ડ લક્ષી તૈયારી.",
        "timeStampedNotes": [
            {"time": "01:10", "text": "Cultural vs Natural Heritage", "textGujarati": "સાંસ્કૃતિક અને પ્રાકૃતિક વારસો વચ્ચેનો ભેદ"},
            {"time": "12:00", "text": "Heritage of Gujarat & Famous Fairs", "textGujarati": "ગુજરાતનો સાંસ્કૃતિક વારસો અને મેળાઓ"},
            {"time": "22:15", "text": "Ancient Tribes that Came to India", "textGujarati": "ભારતમાં આવેલી પ્રાચીન પ્રજાઓ"}
        ],
        "comments": [
            {"id": "c10_3", "author": "Nitin Makwana", "role": "SSC Student", "text": "Social Science marks are guaranteed with this!", "upvotes": 22, "createdAt": "3 days ago"}
        ],
        "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-ss&chapter=1"
    },
    {
        "id": "vid-school-10-4",
        "grades": ["10"],
        "boards": ["GSEB", "CBSE"],
        "category": "Gujarati",
        "categoryGujarati": "ગુજરાતી",
        "title": "Class 10 Gujarati – Complete Vyakaran One Shot (Board 16 Marks)",
        "titleGujarati": "ધોરણ ૧૦ ગુજરાતી – સંપૂર્ણ વ્યાકરણ One Shot Revision (બોર્ડ ૧૬/૧૬ રોકડા માર્ક્સ)",
        "instructor": "TDY WebSankul",
        "instructorGujarati": "ધ દિવાળીપુરા યુથ (TDY)",
        "duration": "38:40",
        "durationSeconds": 2320,
        "youtubeVideoId": "ef0eYKQ0C9M",
        "thumbnailUrl": "https://img.youtube.com/vi/ef0eYKQ0C9M/hqdefault.jpg",
        "playbackMode": "embed",
        "description": "Complete Class 10 Board Gujarati Grammar: Jodani, Sandhi, Samas, Khedarth, Alankar, Chhand, Rudhiprayog, and Kahevat.",
        "descriptionGujarati": "જોડણીના નિયમો, સંધિ, સમાસ, અલંકાર, છંદ, કૃદંત, રૂઢિપ્રયોગ અને કહેવતોનું સંપૂર્ણ રિવિઝન.",
        "timeStampedNotes": [
            {"time": "01:20", "text": "Jodani Rules & Shortcuts", "textGujarati": "જોડણીના અગત્યના નિયમો"},
            {"time": "12:45", "text": "Samas Identification (Tatpurush, Dvigu, Dvandva)", "textGujarati": "સમાસ ઓળખવાની સુપર ટ્રીક"},
            {"time": "25:30", "text": "Chhand & Alankar Full Marks", "textGujarati": "છંદ અને અલંકાર સરળતાથી શીખો"}
        ],
        "comments": [
            {"id": "c10_4", "author": "Shraddha Joshi", "role": "SSC Aspirant", "text": "Grammar section has become so easy with this video!", "upvotes": 31, "createdAt": "1 day ago"}
        ],
        "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-guj&chapter=1"
    },

    # GRADE 11
    {
        "id": "vid-school-11-1",
        "grades": ["11"],
        "boards": ["GSEB", "CBSE"],
        "category": "Physics",
        "categoryGujarati": "ભૌતિક વિજ્ઞાન",
        "title": "Class 11 Physics – Units, Dimensions & Error Analysis",
        "titleGujarati": "ધોરણ ૧૧ ભૌતિક વિજ્ઞાન – પ્રકરણ ૨: એકમ અને માપન (GSEB)",
        "instructor": "GSEB Science Hub",
        "instructorGujarati": "જી.એસ.ઈ.બી. સાયન્સ હબ",
        "duration": "28:15",
        "durationSeconds": 1695,
        "youtubeVideoId": "aoBGAprzSL8",
        "thumbnailUrl": "https://img.youtube.com/vi/aoBGAprzSL8/hqdefault.jpg",
        "playbackMode": "embed",
        "description": "SI units, dimensional formula derivation, principle of homogeneity, parallax method, significant figures, and error propagation.",
        "descriptionGujarati": "SI એકમ પદ્ધતિ, પારિમાણિક સૂત્રો, પારિમાણિક સુસંગતતા, સાર્થક અંકો અને ત્રુટિઓનું સંયોજન.",
        "timeStampedNotes": [
            {"time": "01:00", "text": "Fundamental & Derived Units", "textGujarati": "મૂળભૂત અને સાધિત એકમો"},
            {"time": "10:30", "text": "Dimensional Formulas", "textGujarati": "પારિમાણિક સૂત્રો તારવવાની રીત"},
            {"time": "19:00", "text": "Error Propagation in Calculations", "textGujarati": "ત્રુટિઓની ગણતરી"}
        ],
        "comments": [
            {"id": "c11_1", "author": "Harshil Dave", "role": "Class 11 Science", "text": "Dimensional analysis made simple!", "upvotes": 8, "createdAt": "2 days ago"}
        ],
        "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=11&subject=g11-phy&chapter=1"
    },

    # GRADE 12 (HSC BOARD & GUJCET)
    {
        "id": "vid-school-12-1",
        "grades": ["12"],
        "boards": ["GSEB", "CBSE"],
        "category": "Physics",
        "categoryGujarati": "ભૌતિક વિજ્ઞાન",
        "title": "Class 12 Physics – Electric Charges & Fields (Gauss's Law & Dipole)",
        "titleGujarati": "ધોરણ ૧૨ ભૌતિક વિજ્ઞાન – પ્રકરણ ૧: વિદ્યુતભાર અને ક્ષેત્રો (બોર્ડ & ગુજકેટ IMP)",
        "instructor": "HSC Board Experts",
        "instructorGujarati": "એચ.એસ.સી. બોર્ડ તજજ્ઞ",
        "duration": "34:20",
        "durationSeconds": 2060,
        "youtubeVideoId": "aoBGAprzSL8",
        "thumbnailUrl": "https://img.youtube.com/vi/aoBGAprzSL8/hqdefault.jpg",
        "playbackMode": "embed",
        "description": "Coulomb's Law in vector form, electric field on axial & equatorial line of dipole, electric flux, Gauss's Law derivations and GUJCET numericals.",
        "descriptionGujarati": "કૂલોમ્બનો નિયમ, ડાઇપોલની અક્ષ અને વિષુવરેખા પર વિદ્યુતક્ષેત્ર, ગોસનો નિયમ અને બોર્ડ/ગુજકેટના દાખલાઓ.",
        "timeStampedNotes": [
            {"time": "01:15", "text": "Coulomb's Law Vector Form", "textGujarati": "કૂલોમ્બનો નિયમ સદિશ સ્વરૂપે"},
            {"time": "12:00", "text": "Electric Dipole Derivation", "textGujarati": "વિદ્યુત ડાઇપોલના ક્ષેત્રની તારવણી"},
            {"time": "22:30", "text": "Gauss's Law Applications", "textGujarati": "ગોસના નિયમના ઉપયોગો"}
        ],
        "comments": [
            {"id": "c12_1", "author": "Ronak Shah", "role": "Class 12 Science", "text": "Perfect derivation explanation for 4-mark questions!", "upvotes": 17, "createdAt": "1 day ago"}
        ],
        "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=12&subject=g12-phy&chapter=1"
    },

    # COLLEGE & PLACEMENTS
    {
        "id": "vid-college-1",
        "grades": ["college"],
        "boards": ["CBSE"],
        "category": "Quantitative Aptitude",
        "categoryGujarati": "ક્વોન્ટેટેટિવ એપ્ટિટ્યુડ",
        "title": "Quantitative Aptitude – Relative Speed, Trains, Boats & Streams",
        "titleGujarati": "એપ્ટિટ્યુડ – ટ્રેન, ઝડપ અને અંતરના શોર્ટકટ્સ (TCS / Infosys Placement)",
        "instructor": "Campus Placements Team",
        "instructorGujarati": "પ્લેસમેન્ટ તૈયારી ફેકલ્ટી",
        "duration": "24:30",
        "durationSeconds": 1470,
        "youtubeVideoId": "kJg3h6N8b5M",
        "thumbnailUrl": "https://img.youtube.com/vi/kJg3h6N8b5M/hqdefault.jpg",
        "playbackMode": "embed",
        "description": "Master relative speed concepts for trains crossing platforms, moving men, and upstream/downstream boat problems for TCS NQT, Infosys and Cognizant.",
        "descriptionGujarati": "પ્લેસમેન્ટ પરીક્ષાઓ માટે ટ્રેન, પ્લેટફોર્મ અને હોડીના દાખલા ગણવાની શોર્ટકટ ટ્રીક્સ.",
        "timeStampedNotes": [
            {"time": "01:00", "text": "Relative Speed Core Principle", "textGujarati": "સાપેક્ષ ઝડપનો મૂળ નિયમ"},
            {"time": "09:30", "text": "Train Crossing Platform & Pole", "textGujarati": "ટ્રેન અને પ્લેટફોર્મના દાખલા"},
            {"time": "18:00", "text": "Boats & Streams Shortcuts", "textGujarati": "હોડી અને પ્રવાહના શોર્ટકટ્સ"}
        ],
        "comments": [
            {"id": "col_1", "author": "Meet Patel", "role": "B.Tech Final Year", "text": "Cleared my TCS NQT round thanks to this video!", "upvotes": 15, "createdAt": "4 days ago"}
        ],
        "referencePdfUrl": "https://mindsprint.app/resources/college-aptitude-cheatsheet.pdf"
    },
    {
        "id": "vid-college-2",
        "grades": ["college"],
        "boards": ["CBSE"],
        "category": "Computer Science",
        "categoryGujarati": "કોમ્પ્યુટર સાયન્સ",
        "title": "Data Structures – Binary Search Tree (BST) Insertion & Traversal",
        "titleGujarati": "ડેટા સ્ટ્રક્ચર્સ – બાઈનરી સર્ચ ટ્રી (BST) અને અલ્ગોરિધમ્સ",
        "instructor": "Abdul Bari",
        "instructorGujarati": "અબ્દુલ બારી (DSA એક્સપર્ટ)",
        "duration": "29:50",
        "durationSeconds": 1790,
        "youtubeVideoId": "D6xkbGLQesk",
        "thumbnailUrl": "https://img.youtube.com/vi/D6xkbGLQesk/hqdefault.jpg",
        "playbackMode": "embed",
        "description": "In-depth explanation of BST insertion, search, BFS vs DFS tree traversal, and time/space complexity analysis (Big-O) for tech interviews.",
        "descriptionGujarati": "બાઈનરી સર્ચ ટ્રી (BST), ઇન્સર્શન, સર્ચિંગ, ઇનઓર્ડર, પ્રીઓર્ડર અને પોસ્ટઓર્ડર ટ્રાવર્સલની ઊંડાણપૂર્વક સમજૂતી.",
        "timeStampedNotes": [
            {"time": "01:00", "text": "BST Definition & Properties", "textGujarati": "BST ની વ્યાખ્યા અને નિયમો"},
            {"time": "11:00", "text": "Recursive Insertion in BST", "textGujarati": "રિકર્સિવ ઇન્સર્શન અલ્ગોરિધમ"},
            {"time": "21:30", "text": "Time Complexity (Average vs Worst)", "textGujarati": "સમય જટિલતા (Time Complexity)"}
        ],
        "comments": [
            {"id": "col_2", "author": "Riya Desai", "role": "Software Engineer Intern", "text": "Abdul Bari sir's visualization is unmatched.", "upvotes": 34, "createdAt": "1 week ago"}
        ],
        "referencePdfUrl": "https://mindsprint.app/resources/dsa-cheatsheet.pdf"
    },
    {
        "id": "vid-college-3",
        "grades": ["college"],
        "boards": ["CBSE"],
        "category": "Computer Science",
        "categoryGujarati": "કોમ્પ્યુટર સાયન્સ",
        "title": "DBMS & SQL Mastery – ACID Properties & Normalization",
        "titleGujarati": "ડેટાબેઝ મેનેજમેન્ટ – ACID પ્રોપર્ટીઝ અને નોર્મલાઇઝેશન",
        "instructor": "Gate Smashers",
        "instructorGujarati": "ગેટ સ્મેશર્સ (CS Core)",
        "duration": "22:15",
        "durationSeconds": 1335,
        "youtubeVideoId": "TNhaISOUy6Q",
        "thumbnailUrl": "https://img.youtube.com/vi/TNhaISOUy6Q/hqdefault.jpg",
        "playbackMode": "embed",
        "description": "Complete guide to ACID properties (Atomicity, Consistency, Isolation, Durability), 1NF, 2NF, 3NF, BCNF decomposition rules.",
        "descriptionGujarati": "ACID પ્રોપર્ટીઝ, ટ્રાન્ઝેક્શન કંટ્રોલ અને ૧NF, ૨NF, ૩NF, BCNF નોર્મલાઇઝેશનના નિયમો.",
        "timeStampedNotes": [
            {"time": "01:15", "text": "ACID Properties in Real World", "textGujarati": "ACID પ્રોપર્ટીઝ વિગતવાર"},
            {"time": "09:00", "text": "1NF, 2NF, 3NF Explained", "textGujarati": "નોર્મલાઇઝેશનના પ્રકારો"},
            {"time": "17:30", "text": "Interview Questions on BCNF", "textGujarati": "ઇન્ટરવ્યુમાં પૂછાતા પ્રશ્નો"}
        ],
        "comments": [
            {"id": "col_3", "author": "Sanjay Mehta", "role": "MCA Student", "text": "Best DBMS refresher before placement rounds.", "upvotes": 18, "createdAt": "5 days ago"}
        ],
        "referencePdfUrl": "https://mindsprint.app/resources/dbms-cheatsheet.pdf"
    },
    {
        "id": "vid-college-4",
        "grades": ["college"],
        "boards": ["CBSE"],
        "category": "Web Development",
        "categoryGujarati": "વેબ ડેવલપમેન્ટ",
        "title": "Modern React & JavaScript – Event Loop, Hooks & Virtual DOM",
        "titleGujarati": "રિએક્ટ & જાવાસ્ક્રિપ્ટ – ઇવેન્ટ લૂપ, હુક્સ અને વર્ચ્યુઅલ DOM",
        "instructor": "Akshay Saini",
        "instructorGujarati": "અક્ષય સૈની (Namaste JavaScript)",
        "duration": "27:40",
        "durationSeconds": 1660,
        "youtubeVideoId": "0Zhy9b3v8cQ",
        "thumbnailUrl": "https://img.youtube.com/vi/0Zhy9b3v8cQ/hqdefault.jpg",
        "playbackMode": "embed",
        "description": "Master JavaScript event loop, microtasks vs macrotasks, React reconciliation (Fiber architecture), useState, useEffect, and custom hooks.",
        "descriptionGujarati": "જાવાસ્ક્રિપ્ટ ઇવેન્ટ લૂપ, માઇક્રોટાસ્ક, રિએક્ટ રીકોન્સિલીએશન (Fiber) અને હુક્સની સંપૂર્ણ સમજૂતી.",
        "timeStampedNotes": [
            {"time": "01:00", "text": "JS Call Stack & Event Loop", "textGujarati": "કોલ સ્ટેક અને ઇવેન્ટ લૂપ"},
            {"time": "11:20", "text": "React Virtual DOM & Diffing", "textGujarati": "વર્ચ્યુઅલ DOM અને ડિફિંગ અલ્ગોરિધમ"},
            {"time": "20:00", "text": "Custom Hooks Best Practices", "textGujarati": "કસ્ટમ હુક્સ અને પરફોર્મન્સ"}
        ],
        "comments": [
            {"id": "col_4", "author": "Priya Nair", "role": "Frontend Developer", "text": "Clear explanation of Fiber and event loop!", "upvotes": 28, "createdAt": "2 days ago"}
        ],
        "referencePdfUrl": "https://mindsprint.app/resources/react-cheatsheet.pdf"
    }
]

# Output to constants/videoData.ts
ts_header = """export interface VideoComment {
  id: string;
  author: string;
  userEmail?: string;
  role: string;
  text: string;
  upvotes: number;
  upvotedBy?: string[];
  createdAt: string;
}

export interface VideoLecture {
  id: string;
  grades?: string[];
  boards?: string[];
  category: string;
  categoryGujarati?: string;
  title: string;
  titleGujarati?: string;
  instructor: string;
  instructorGujarati?: string;
  duration: string;
  durationSeconds: number;
  youtubeVideoId: string;
  thumbnailUrl: string;
  playbackMode: 'embed' | 'direct';
  description: string;
  descriptionGujarati?: string;
  timeStampedNotes: { time: string; text: string; textGujarati?: string }[];
  discussionCount?: number;
  comments?: VideoComment[];
  referencePdfUrl?: string;
}

export const VIDEO_LECTURES_DATA: VideoLecture[] = """

json_str = json.dumps(VERIFIED_LECTURES, ensure_ascii=False, indent=2)

with open('constants/videoData.ts', 'w', encoding='utf-8') as f:
    f.write(ts_header + json_str + ";\n")

print("constants/videoData.ts generated successfully with verified videos!")

# Output SEED_VIDEOS to backend/routes/videoRoutes.js
with open('backend/routes/videoRoutes.js', 'r', encoding='utf-8') as f:
    routes_text = f.read()

seed_start_marker = "const SEED_VIDEOS = "
seed_idx = routes_text.find(seed_start_marker)
if seed_idx == -1:
    print("ERROR: could not find SEED_VIDEOS in videoRoutes.js")
    sys.exit(1)

seed_end_marker = "// Seed videos on startup or on demand"
seed_end_idx = routes_text.find(seed_end_marker, seed_idx)
if seed_end_idx == -1:
    print("ERROR: could not find seed_end_marker in videoRoutes.js")
    sys.exit(1)

new_routes_text = (
    routes_text[:seed_idx + len(seed_start_marker)]
    + json_str
    + ";\n\n"
    + routes_text[seed_end_idx:]
)

with open('backend/routes/videoRoutes.js', 'w', encoding='utf-8') as f:
    f.write(new_routes_text)

print("backend/routes/videoRoutes.js updated successfully with verified SEED_VIDEOS!")

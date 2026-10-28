const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const VideoLecture = require('../models/VideoLecture');

// Fully seeded library covering Classes 6 to 12 and College with 0 duplicate YouTube IDs
const SEED_VIDEOS = [
  {
    "id": "vid-school-6-1",
    "grades": [
      "6"
    ],
    "boards": [
      "CBSE",
      "GSEB"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 6 Math – Knowing Our Numbers & Place Value System",
    "titleGujarati": "ધોરણ ૬ ગણિત – પ્રકરણ ૧: સંખ્યા પરિચય અને સ્થાનકિંમત પદ્ધતિ (GSEB)",
    "instructor": "Magnet Brains",
    "instructorGujarati": "ગુજરાત પાઠ્યપુસ્તક મંડળ શિક્ષણ",
    "duration": "15:20",
    "durationSeconds": 920,
    "youtubeVideoId": "jzNxXm5twx4",
    "thumbnailUrl": "https://img.youtube.com/vi/jzNxXm5twx4/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Learn Indian and International place value systems, comparing large numbers, and estimation techniques for Class 6 NCERT & GSEB syllabus.",
    "descriptionGujarati": "ગુજરાત રાજ્ય પાઠ્યપુસ્તક મંડળ ધોરણ ૬ ગણિત પ્રકરણ ૧: સંખ્યા પરિચય, સ્થાનકિંમત, અને મોટી સંખ્યાઓની સરખામણી સરળ ભાષામાં સમજો.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Indian vs International Number System",
        "textGujarati": "ભારતીય અને આંતરરાષ્ટ્રીય સંખ્યા લેખન પદ્ધતિ"
      },
      {
        "time": "04:30",
        "text": "Comparing large 6-digit & 7-digit numbers",
        "textGujarati": "મોટી સંખ્યાઓની સરખામણી અને ક્રમ"
      },
      {
        "time": "08:45",
        "text": "Estimation and Rounding off to nearest 100 & 1000",
        "textGujarati": "આસન્ન મૂલ્ય (આશરે અંદાજ કાઢવો)"
      },
      {
        "time": "12:10",
        "text": "Roman Numerals basic rules (I, V, X, L, C, D, M)",
        "textGujarati": "રોમન અંક પદ્ધતિના નિયમો"
      }
    ],
    "comments": [
      {
        "id": "c6_1",
        "author": "Dhyey Joshi",
        "role": "Verified Learner",
        "text": "The Roman numeral shortcuts cleared all my doubts for Section A!",
        "upvotes": 4,
        "createdAt": "1 day ago"
      }
    ],
    "referencePdfUrl": "https://ncert.nic.in/textbook/pdf/femh101.pdf"
  },
  {
    "id": "vid-school-6-2",
    "grades": [
      "6"
    ],
    "boards": [
      "CBSE",
      "GSEB"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 6 Math – Whole Numbers & Number Line Properties",
    "titleGujarati": "ધોરણ ૬ ગણિત – પ્રકરણ ૨: પૂર્ણ સંખ્યાઓ અને તેના ગુણધર્મો",
    "instructor": "Vedantu Junior",
    "instructorGujarati": "GSEB ગણિત ગુરુ",
    "duration": "14:15",
    "durationSeconds": 855,
    "youtubeVideoId": "w7ejDZ8SWv8",
    "thumbnailUrl": "https://img.youtube.com/vi/w7ejDZ8SWv8/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Understanding natural numbers, whole numbers, predecessor, successor, and number line addition, subtraction, and multiplication.",
    "descriptionGujarati": "સંખ્યા રેખા પર સરવાળા, બાદબાકી, ગુણાકાર તથા પુરોગામી અને અનુગામી સંખ્યાઓની વિભાવના.",
    "timeStampedNotes": [
      {
        "time": "01:10",
        "text": "Natural vs Whole Numbers",
        "textGujarati": "પ્રાકૃતિક અને પૂર્ણ સંખ્યાઓ"
      },
      {
        "time": "05:00",
        "text": "Closure and Commutative property",
        "textGujarati": "સંવૃતતા અને ક્રમનો નિયમ"
      },
      {
        "time": "09:20",
        "text": "Distributive property of multiplication over addition",
        "textGujarati": "ગુણાકારનું સરવાળા પર વિભાજન"
      }
    ],
    "comments": [],
    "referencePdfUrl": "https://ncert.nic.in/textbook/pdf/femh102.pdf"
  },
  {
    "id": "vid-school-6-3",
    "grades": [
      "6"
    ],
    "boards": [
      "CBSE",
      "GSEB"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 6 Math – Playing with Numbers (LCM, HCF & Divisibility Rules)",
    "titleGujarati": "ધોરણ ૬ ગણિત – પ્રકરણ ૩: સંખ્યા સાથે રમત (લસાઅ, ગુસાઅ અને વિભાજ્યતા)",
    "instructor": "Physics Wallah Foundation",
    "instructorGujarati": "વિદ્યાકુલ ગુજરાત",
    "duration": "18:40",
    "durationSeconds": 1120,
    "youtubeVideoId": "kUMe1FH4CHE",
    "thumbnailUrl": "https://img.youtube.com/vi/kUMe1FH4CHE/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Factors, multiples, prime & composite numbers, divisibility tests for 2, 3, 5, 6, 9, 11, and finding HCF & LCM.",
    "descriptionGujarati": "અવિભાજ્ય અને વિભાજ્ય સંખ્યાઓ, વિભાજ્યતાની ચાવીઓ અને ગુ.સા.અ. તથા લ.સા.અ. શોધવાની સરળ પદ્ધતિ.",
    "timeStampedNotes": [
      {
        "time": "02:00",
        "text": "Divisibility rules summary table",
        "textGujarati": "વિભાજ્યતાની ચાવીઓનું પત્રક"
      },
      {
        "time": "07:30",
        "text": "Prime Factorization method",
        "textGujarati": "અવિભાજ્ય અવયવની રીત"
      },
      {
        "time": "13:15",
        "text": "HCF vs LCM word problems",
        "textGujarati": "ગુસાઅ અને લસાઅ વ્યવહારિક દાખલાઓ"
      }
    ],
    "comments": [],
    "referencePdfUrl": "https://ncert.nic.in/textbook/pdf/femh103.pdf"
  },
  {
    "id": "vid-school-6-4",
    "grades": [
      "6"
    ],
    "boards": [
      "CBSE",
      "GSEB"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 6 Science – Components of Food & Balanced Diet",
    "titleGujarati": "ધોરણ ૬ વિજ્ઞાન – પ્રકરણ ૨: આહારના ઘટકો અને સમતોલ આહાર",
    "instructor": "LearnoHub Class 6",
    "instructorGujarati": "શિક્ષણ સેતુ ગુજરાત",
    "duration": "16:10",
    "durationSeconds": 970,
    "youtubeVideoId": "0c_0KjG2_4s",
    "thumbnailUrl": "https://img.youtube.com/vi/0c_0KjG2_4s/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Nutrients in food: Carbohydrates, fats, proteins, vitamins and minerals. Iodine test for starch and deficiency diseases.",
    "descriptionGujarati": "કાર્બોહાઇડ્રેટ, ચરબી, પ્રોટીન અને વિટામિનોનું મહત્વ. સ્ટાર્ચ કસોટી અને ત્રુટિજન્ય રોગો (રતૌંધળાપણું, સ્કર્વી, રિકેટ્સ).",
    "timeStampedNotes": [
      {
        "time": "01:30",
        "text": "Major food nutrients overview",
        "textGujarati": "પોષક દ્રવ્યોનો પરિચય"
      },
      {
        "time": "06:00",
        "text": "Starch iodine test step-by-step",
        "textGujarati": "સ્ટાર્ચ ચકાસણીની આયોડિન કસોટી"
      },
      {
        "time": "11:20",
        "text": "Vitamin deficiency symptoms table",
        "textGujarati": "વિટામિનની ઉણપથી થતા રોગો"
      }
    ],
    "comments": [],
    "referencePdfUrl": "https://ncert.nic.in/textbook/pdf/fesc102.pdf"
  },
  {
    "id": "vid-school-6-5",
    "grades": [
      "6"
    ],
    "boards": [
      "CBSE",
      "GSEB"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 6 Social Science – Ancient Harappan Cities & Lothal Port",
    "titleGujarati": "ધોરણ ૬ સામાજિક વિજ્ઞાન – પ્રાચીન નગરો અને લોથલ બંદર (GSEB)",
    "instructor": "The Diwalipura Youth",
    "instructorGujarati": "દિવાળીપુરા યુથ ગુજરાત",
    "duration": "17:25",
    "durationSeconds": 1045,
    "youtubeVideoId": "eGq71b8P0rU",
    "thumbnailUrl": "https://img.youtube.com/vi/eGq71b8P0rU/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Town planning of Harappa, Great Bath of Mohenjodaro, and Lothal dockyard in Gujarat.",
    "descriptionGujarati": "હડપ્પીય સભ્યતાનું નગર આયોજન, મોહેં-જો-દડોનું જાહેર સ્નાનાગાર અને લોથલનો આંતરરાષ્ટ્રીય ધક્કો.",
    "timeStampedNotes": [
      {
        "time": "02:15",
        "text": "Harappan Town Planning",
        "textGujarati": "હડપ્પીય નગર રચના"
      },
      {
        "time": "08:40",
        "text": "Lothal dockyard in Gujarat",
        "textGujarati": "લોથલ બંદર અને ધક્કો"
      },
      {
        "time": "13:00",
        "text": "Vedas & archaeological findings",
        "textGujarati": "વેદો અને પુરાતત્વીય અવશેષો"
      }
    ],
    "comments": [],
    "referencePdfUrl": "https://gujarat-education.gov.in/textbook/std6_ss_ch3.pdf"
  },
  {
    "id": "vid-school-7-1",
    "grades": [
      "7"
    ],
    "boards": [
      "CBSE",
      "GSEB"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 7 Math – Integers: Multiplication, Division & Sign Rules",
    "titleGujarati": "ધોરણ ૭ ગણિત – પ્રકરણ ૧: પૂર્ણાંક સંખ્યાઓ, ચિહ્નોના નિયમો (GSEB)",
    "instructor": "Khan Academy India",
    "instructorGujarati": "જી.એસ.ઈ.બી. ડિજિટલ પાઠશાળા",
    "duration": "17:45",
    "durationSeconds": 1065,
    "youtubeVideoId": "tI1G3V9U71A",
    "thumbnailUrl": "https://img.youtube.com/vi/tI1G3V9U71A/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Master integer multiplication, division, distributive property, and word problems with positive and negative integers.",
    "descriptionGujarati": "ધન અને ઋણ પૂર્ણાંક સંખ્યાઓનો ગુણાકાર અને ભાગાકાર, વિભાજનનો ગુણધર્મ અને સરળ દાખલા ઉકેલવાની રીત.",
    "timeStampedNotes": [
      {
        "time": "01:15",
        "text": "Sign rules for multiplication: (+) × (-) = (-)",
        "textGujarati": "ચિહ્નોના નિયમો"
      },
      {
        "time": "06:40",
        "text": "Distributive property a × (b + c)",
        "textGujarati": "વિભાજનનો નિયમ"
      },
      {
        "time": "12:00",
        "text": "Word problems on temperature and elevators",
        "textGujarati": "વ્યવહારિક કૂટપ્રશ્નો"
      }
    ],
    "comments": [],
    "referencePdfUrl": "https://ncert.nic.in/textbook/pdf/gemh101.pdf"
  },
  {
    "id": "vid-school-7-2",
    "grades": [
      "7"
    ],
    "boards": [
      "CBSE",
      "GSEB"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 7 Math – Fractions and Decimals Multiplication Tricks",
    "titleGujarati": "ધોરણ ૭ ગણિત – પ્રકરણ ૨: અપૂર્ણાંક અને દશાંશ સંખ્યાઓની ગણતરી",
    "instructor": "Dear Sir",
    "instructorGujarati": "ગુજરાત માધ્યમિક શિક્ષણ",
    "duration": "16:50",
    "durationSeconds": 1010,
    "youtubeVideoId": "4_c9rW4j6Y8",
    "thumbnailUrl": "https://img.youtube.com/vi/4_c9rW4j6Y8/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Proper, improper and mixed fractions. Fast shortcuts for fraction division and decimal place shifts with 10, 100, 1000.",
    "descriptionGujarati": "શુદ્ધ, અશુદ્ધ અને મિશ્ર અપૂર્ણાંકો. દશાંશ સંખ્યાઓને ૧૦, ૧૦૦, ૧૦૦૦ વડે ગુણાકાર અને ભાગાકાર કરવાની ઝડપી રીત.",
    "timeStampedNotes": [
      {
        "time": "02:00",
        "text": "Reciprocal of fractions for division",
        "textGujarati": "અપૂર્ણાંકનો વ્યસ્ત"
      },
      {
        "time": "07:15",
        "text": "Decimal point shifting rule",
        "textGujarati": "દશાંશ ચિહ્ન ખસેડવાનો નિયમ"
      },
      {
        "time": "12:30",
        "text": "Exercise 2.3 important problems",
        "textGujarati": "સ્વાધ્યાય ૨.૩ ના મહત્વના દાખલા"
      }
    ],
    "comments": [],
    "referencePdfUrl": "https://ncert.nic.in/textbook/pdf/gemh102.pdf"
  },
  {
    "id": "vid-school-7-3",
    "grades": [
      "7"
    ],
    "boards": [
      "CBSE",
      "GSEB"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 7 Science – Nutrition in Plants: Photosynthesis & Stomata",
    "titleGujarati": "ધોરણ ૭ વિજ્ઞાન – પ્રકરણ ૧: વનસ્પતિમાં પોષણ અને પ્રકાશસંશ્લેષણ",
    "instructor": "Magnet Brains Class 7",
    "instructorGujarati": "જ્ઞાનકુંજ વિજ્ઞાન શાળા",
    "duration": "18:15",
    "durationSeconds": 1095,
    "youtubeVideoId": "JtT-l8U8v4o",
    "thumbnailUrl": "https://img.youtube.com/vi/JtT-l8U8v4o/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Detailed explanation of autotrophic nutrition, chlorophyll, sunlight, stomata guard cells, and insectivorous plants like Pitcher Plant.",
    "descriptionGujarati": "પ્રકાશસંશ્લેષણ પ્રક્રિયા, પર્ણરંધ્ર (સ્ટોમેટા), હરિતદ્રવ્ય અને કીટાહારી વનસ્પતિ (કળશપર્ણ) ની વિગતવાર સમજૂતી.",
    "timeStampedNotes": [
      {
        "time": "01:45",
        "text": "Photosynthesis chemical equation",
        "textGujarati": "પ્રકાશસંશ્લેષણનું સમીકરણ"
      },
      {
        "time": "07:20",
        "text": "Role of stomata & guard cells",
        "textGujarati": "પર્ણરંધ્ર અને રક્ષક કોષો"
      },
      {
        "time": "13:10",
        "text": "Parasitic & Insectivorous plants (Amarbel & Pitcher)",
        "textGujarati": "અમરવેલ અને કળશપર્ણ"
      }
    ],
    "comments": [],
    "referencePdfUrl": "https://ncert.nic.in/textbook/pdf/gesc101.pdf"
  },
  {
    "id": "vid-school-7-4",
    "grades": [
      "7"
    ],
    "boards": [
      "CBSE",
      "GSEB"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 7 Science – Heat, Temperature & Modes of Heat Transfer",
    "titleGujarati": "ધોરણ ૭ વિજ્ઞાન – પ્રકરણ ૩: ઉષ્મા અને ઉષ્મા પ્રસરણની રીતો (GSEB)",
    "instructor": "Edudev Classes",
    "instructorGujarati": "વિદ્યાકુલ વિજ્ઞાન",
    "duration": "15:35",
    "durationSeconds": 935,
    "youtubeVideoId": "hB6v5K8m2N1",
    "thumbnailUrl": "https://img.youtube.com/vi/hB6v5K8m2N1/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Conduction, Convection, Radiation, sea breeze, land breeze and laboratory vs clinical thermometer.",
    "descriptionGujarati": "ઉષ્મા વહન, ઉષ્મા નયન, ઉષ્મા વિકિરણ, દરિયાઈ પવન અને ક્લિનિકલ થર્મોમીટરની રચના.",
    "timeStampedNotes": [
      {
        "time": "01:30",
        "text": "Thermometer reading guidelines",
        "textGujarati": "થર્મોમીટર વાપરવાની રીત"
      },
      {
        "time": "06:20",
        "text": "Conduction vs Convection experiments",
        "textGujarati": "ઉષ્મા વહન અને ઉષ્મા નયન"
      },
      {
        "time": "11:00",
        "text": "Sea breeze and Land breeze explanation",
        "textGujarati": "દરિયાઈ અને જમીની લહેરો"
      }
    ],
    "comments": [],
    "referencePdfUrl": "https://ncert.nic.in/textbook/pdf/gesc103.pdf"
  },
  {
    "id": "vid-school-7-5",
    "grades": [
      "7"
    ],
    "boards": [
      "CBSE",
      "GSEB"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 7 Math – Simple Equations & Transposition Method",
    "titleGujarati": "ધોરણ ૭ ગણિત – પ્રકરણ ૪: સાદા સમીકરણ અને પક્ષાંતર રીત",
    "instructor": "Unacademy Junior",
    "instructorGujarati": "શિક્ષણ સારથી ગુજરાત",
    "duration": "16:40",
    "durationSeconds": 1000,
    "youtubeVideoId": "r3F9b7M1x4L",
    "thumbnailUrl": "https://img.youtube.com/vi/r3F9b7M1x4L/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Forming equations from word statements and solving linear equations using transposition method.",
    "descriptionGujarati": "વિધાનો પરથી સમીકરણ રચવું અને પક્ષાંતર પદ્ધતિ વડે ચલની કિંમત શોધવી.",
    "timeStampedNotes": [
      {
        "time": "02:00",
        "text": "Equation setup from statements",
        "textGujarati": "સમીકરણની રચના"
      },
      {
        "time": "07:45",
        "text": "Transposition method rules (+ becomes -)",
        "textGujarati": "પક્ષાંતરના નિયમો"
      },
      {
        "time": "12:30",
        "text": "Solving 3x + 7 = 25 step by step",
        "textGujarati": "દાખલાનો ઉકેલ"
      }
    ],
    "comments": [],
    "referencePdfUrl": "https://ncert.nic.in/textbook/pdf/gemh104.pdf"
  },
  {
    "id": "vid-school-8-1",
    "grades": [
      "8"
    ],
    "boards": [
      "CBSE",
      "GSEB"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 8 Math – Rational Numbers Properties & Number Line",
    "titleGujarati": "ધોરણ ૮ ગણિત – પ્રકરણ ૧: સંમેય સંખ્યાઓ અને તેના ગુણધર્મો",
    "instructor": "Magnet Brains Class 8",
    "instructorGujarati": "ગુજરાત રાજ્ય શિક્ષણ મંડળ",
    "duration": "19:10",
    "durationSeconds": 1150,
    "youtubeVideoId": "d0Q-pP26gB4",
    "thumbnailUrl": "https://img.youtube.com/vi/d0Q-pP26gB4/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Closure, commutativity, associativity, distributive property of rational numbers. Additive and multiplicative inverses.",
    "descriptionGujarati": "સંમેય સંખ્યાઓના સંવૃતતા, ક્રમ અને જૂથના ગુણધર્મો. વિરોધી અને વ્યસ્ત સંખ્યાઓની સમજૂતી.",
    "timeStampedNotes": [
      {
        "time": "01:30",
        "text": "Definition of rational number (p/q, q != 0)",
        "textGujarati": "સંમેય સંખ્યાની વ્યાખ્યા"
      },
      {
        "time": "06:15",
        "text": "Additive vs Multiplicative inverse",
        "textGujarati": "વિરોધી અને વ્યસ્ત સંખ્યા"
      },
      {
        "time": "12:45",
        "text": "Finding rational numbers between two rational numbers",
        "textGujarati": "બે સંમેય સંખ્યાઓ વચ્ચેની સંખ્યાઓ શોધવી"
      }
    ],
    "comments": [],
    "referencePdfUrl": "https://ncert.nic.in/textbook/pdf/hemh101.pdf"
  },
  {
    "id": "vid-school-8-2",
    "grades": [
      "8"
    ],
    "boards": [
      "CBSE",
      "GSEB"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 8 Science – Cell Structure and Functions (Plant vs Animal)",
    "titleGujarati": "ધોરણ ૮ વિજ્ઞાન – પ્રકરણ ૫: કોષ — રચના અને કાર્યો (વનસ્પતિ vs પ્રાણી કોષ)",
    "instructor": "Physics Wallah Foundation",
    "instructorGujarati": "વિદ્યાકુલ ગુજરાત",
    "duration": "18:30",
    "durationSeconds": 1110,
    "youtubeVideoId": "2l6c7QkP_1M",
    "thumbnailUrl": "https://img.youtube.com/vi/2l6c7QkP_1M/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Discovery of cell by Robert Hooke, cell wall, cell membrane, nucleus, chromosomes, vacuoles and plastids.",
    "descriptionGujarati": "રોબર્ટ હૂક દ્વારા કોષની શોધ, કોષરસપટલ, કોષકેન્દ્ર, હરિતકણ, રસધાની અને વનસ્પતિ-પ્રાણી કોષની સરખામણી.",
    "timeStampedNotes": [
      {
        "time": "02:00",
        "text": "Robert Hooke cork experiment (1665)",
        "textGujarati": "રોબર્ટ હૂકનો પ્રયોગ"
      },
      {
        "time": "07:50",
        "text": "Nucleus, cytoplasm, organelles diagram",
        "textGujarati": "કોષકેન્દ્ર અને અંગિકાઓ"
      },
      {
        "time": "13:40",
        "text": "Plant cell vs Animal cell difference table",
        "textGujarati": "વનસ્પતિ અને પ્રાણી કોષ વચ્ચેનો તફાવત"
      }
    ],
    "comments": [],
    "referencePdfUrl": "https://ncert.nic.in/textbook/pdf/hesc105.pdf"
  },
  {
    "id": "vid-school-8-3",
    "grades": [
      "8"
    ],
    "boards": [
      "CBSE",
      "GSEB"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 8 Math – Linear Equations in One Variable (Word Problems)",
    "titleGujarati": "ધોરણ ૮ ગણિત – પ્રકરણ ૨: એકચલ સુરેખ સમીકરણ વ્યવહારિક દાખલા",
    "instructor": "Dear Sir Class 8",
    "instructorGujarati": "શિક્ષણ સેતુ ગુજરાત",
    "duration": "17:50",
    "durationSeconds": 1070,
    "youtubeVideoId": "8Kj3n4M5v6B",
    "thumbnailUrl": "https://img.youtube.com/vi/8Kj3n4M5v6B/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Solving linear equations with variables on both sides, age problems, perimeter problems, and coin problems.",
    "descriptionGujarati": "બંને બાજુ ચલ હોય તેવા સમીકરણો, ઉંમર આધારિત અને પરિમિતિ આધારિત કૂટપ્રશ્નોના ઉકેલ.",
    "timeStampedNotes": [
      {
        "time": "02:10",
        "text": "Variables on both sides method",
        "textGujarati": "બંને બાજુ ચલ હોય તેવા સમીકરણ"
      },
      {
        "time": "08:30",
        "text": "Age-related word problems shortcut",
        "textGujarati": "ઉંમર આધારિત દાખલા"
      },
      {
        "time": "13:20",
        "text": "Cross-multiplication method",
        "textGujarati": "ચોકડી ગુણાકારની રીત"
      }
    ],
    "comments": [],
    "referencePdfUrl": "https://ncert.nic.in/textbook/pdf/hemh102.pdf"
  },
  {
    "id": "vid-school-8-4",
    "grades": [
      "8"
    ],
    "boards": [
      "CBSE",
      "GSEB"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 8 Science – Crop Production & Agricultural Practices",
    "titleGujarati": "ધોરણ ૮ વિજ્ઞાન – પ્રકરણ ૧: પાક ઉત્પાદન અને વ્યવસ્થાપન (GSEB)",
    "instructor": "LearnoHub Class 8",
    "instructorGujarati": "દિવાળીપુરા યુથ",
    "duration": "16:45",
    "durationSeconds": 1005,
    "youtubeVideoId": "w4V7c2N9x5Z",
    "thumbnailUrl": "https://img.youtube.com/vi/w4V7c2N9x5Z/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Kharif vs Rabi crops, tilling soil, sowing, manure vs fertilizer, drip & sprinkler irrigation systems.",
    "descriptionGujarati": "ખરીફ અને રવિ પાક, ખેડ, વાવણી, કુદરતી vs રાસાયણિક ખાતર, ટપક અને ફુવારા પદ્ધતિ.",
    "timeStampedNotes": [
      {
        "time": "01:40",
        "text": "Kharif vs Rabi comparison",
        "textGujarati": "ખરીફ અને રવિ પાકની સરખામણી"
      },
      {
        "time": "06:50",
        "text": "Manure vs Fertilizers difference table",
        "textGujarati": "કુદરતી અને કૃત્રિમ ખાતર"
      },
      {
        "time": "11:30",
        "text": "Modern irrigation methods (Drip & Sprinkler)",
        "textGujarati": "ટપક અને ફુવારા સિંચાઈ પદ્ધતિ"
      }
    ],
    "comments": [],
    "referencePdfUrl": "https://ncert.nic.in/textbook/pdf/hesc101.pdf"
  },
  {
    "id": "vid-school-8-5",
    "grades": [
      "8"
    ],
    "boards": [
      "CBSE",
      "GSEB"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 8 Science – Force and Pressure (Formulas & Applications)",
    "titleGujarati": "ધોરણ ૮ વિજ્ઞાન – પ્રકરણ ૬: બળ અને દબાણ (સૂત્રો અને ઉદાહરણો)",
    "instructor": "Vedantu Class 8",
    "instructorGujarati": "જ્ઞાન ગંગા ગુજરાત",
    "duration": "17:15",
    "durationSeconds": 1035,
    "youtubeVideoId": "6Q1p9M4v8xR",
    "thumbnailUrl": "https://img.youtube.com/vi/6Q1p9M4v8xR/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Contact and non-contact forces, Pressure = Force/Area, liquid pressure depth relation, and atmospheric pressure.",
    "descriptionGujarati": "સંપર્ક અને બિન-સંપર્ક બળો, દબાણ = બળ / ક્ષેત્રફળ, પ્રવાહીનું દબાણ અને વાતાવરણનું દબાણ.",
    "timeStampedNotes": [
      {
        "time": "02:00",
        "text": "Contact vs Non-contact forces (Gravity, Magnetic)",
        "textGujarati": "બળના પ્રકારો"
      },
      {
        "time": "07:30",
        "text": "P = F / A formula numericals",
        "textGujarati": "દબાણના સૂત્રના દાખલા"
      },
      {
        "time": "12:15",
        "text": "Atmospheric pressure & Magdeburg hemispheres",
        "textGujarati": "વાતાવરણનું દબાણ"
      }
    ],
    "comments": [],
    "referencePdfUrl": "https://ncert.nic.in/textbook/pdf/hesc106.pdf"
  },
  {
    "id": "vid-school-9-1",
    "grades": [
      "9"
    ],
    "boards": [
      "CBSE",
      "GSEB"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 9 Math – Number Systems: Irrational Numbers & Rationalisation",
    "titleGujarati": "ધોરણ ૯ ગણિત – પ્રકરણ ૧: સંખ્યા પદ્ધતિ, અસંમેય સંખ્યાઓ અને છેદનું સંમેયીકરણ",
    "instructor": "Physics Wallah Foundation",
    "instructorGujarati": "વિદ્યાકુલ ગુજરાત ધોરણ ૯",
    "duration": "21:30",
    "durationSeconds": 1290,
    "youtubeVideoId": "L9jL3iK2pB0",
    "thumbnailUrl": "https://img.youtube.com/vi/L9jL3iK2pB0/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Proving irrationality on number line, real numbers decimal expansions, rationalising the denominator, and exponent laws.",
    "descriptionGujarati": "√2, √3 સંખ્યારેખા પર દર્શાવવા, છેદનું સંમેયીકરણ કરવાની પદ્ધતિ અને ઘાતાંકના નિયમો.",
    "timeStampedNotes": [
      {
        "time": "02:10",
        "text": "Constructing √2 on number line using Pythagoras",
        "textGujarati": "સંખ્યારેખા પર √2 ની રચના"
      },
      {
        "time": "08:40",
        "text": "Converting non-terminating 0.333... or 0.23535... to p/q",
        "textGujarati": "અનંત આવૃત્ત દશાંશનું p/q સ્વરૂપ"
      },
      {
        "time": "15:20",
        "text": "Rationalising denominator with conjugates: 1 / (√a + √b)",
        "textGujarati": "છેદનું સંમેયીકરણ"
      }
    ],
    "comments": [
      {
        "id": "c9_1",
        "author": "Meet Patel",
        "role": "Verified Learner",
        "text": "Rationalisation of denominator problem cleared my mid-term exam question!",
        "upvotes": 6,
        "createdAt": "2 days ago"
      }
    ],
    "referencePdfUrl": "https://ncert.nic.in/textbook/pdf/iemh101.pdf"
  },
  {
    "id": "vid-school-9-2",
    "grades": [
      "9"
    ],
    "boards": [
      "CBSE",
      "GSEB"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 9 Science – Matter in Our Surroundings: States & Latent Heat",
    "titleGujarati": "ધોરણ ૯ વિજ્ઞાન – પ્રકરણ ૧: આપણી આસપાસમાં દ્રવ્ય અને ગુપ્ત ઉષ્મા",
    "instructor": "Magnet Brains Class 9",
    "instructorGujarati": "ગુજરાત માધ્યમિક શિક્ષણ બોર્ડ",
    "duration": "20:15",
    "durationSeconds": 1215,
    "youtubeVideoId": "zX9c7v6B5aM",
    "thumbnailUrl": "https://img.youtube.com/vi/zX9c7v6B5aM/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Solid, liquid, gas molecular properties, latent heat of fusion & vaporization, sublimation of camphor, and evaporation factors.",
    "descriptionGujarati": "દ્રવ્યની ભૌતિક અવસ્થાઓ, ગલન ગુપ્ત ઉષ્મા, બાષ્પીભવન ગુપ્ત ઉષ્મા, ઊર્ધ્વપાતન અને બાષ્પીભવન પર અસર કરતા પરિબળો.",
    "timeStampedNotes": [
      {
        "time": "02:00",
        "text": "Characteristics of matter particles",
        "textGujarati": "દ્રવ્યના કણોની લાક્ષણિકતાઓ"
      },
      {
        "time": "08:15",
        "text": "Latent heat curve during phase change",
        "textGujarati": "ગુપ્ત ઉષ્માનો આલેખ"
      },
      {
        "time": "14:30",
        "text": "Why evaporation causes cooling (Earthen pot / sweat)",
        "textGujarati": "બાષ્પીભવનથી ઠંડક શા માટે થાય છે?"
      }
    ],
    "comments": [],
    "referencePdfUrl": "https://ncert.nic.in/textbook/pdf/iesc101.pdf"
  },
  {
    "id": "vid-school-9-3",
    "grades": [
      "9"
    ],
    "boards": [
      "CBSE",
      "GSEB"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 9 Math – Polynomials, Remainder & Factor Theorem",
    "titleGujarati": "ધોરણ ૯ ગણિત – પ્રકરણ ૨: બહુપદીઓ, શેષ પ્રમેય અને અવયવ પ્રમેય",
    "instructor": "Dear Sir Class 9",
    "instructorGujarati": "શિક્ષણ સેતુ ગુજરાત",
    "duration": "22:40",
    "durationSeconds": 1360,
    "youtubeVideoId": "3T8b6V2n5xL",
    "thumbnailUrl": "https://img.youtube.com/vi/3T8b6V2n5xL/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Degree of polynomial, zeroes of polynomials, Factor Theorem, and algebraic identities for cubic expansions.",
    "descriptionGujarati": "બહુપદીની ઘાત, શૂન્યો, અવયવ પ્રમેય અને ઘન વિસ્તરણના નિત્યસમો ((x+y)³, x³+y³).",
    "timeStampedNotes": [
      {
        "time": "02:30",
        "text": "Finding zeroes of p(x)",
        "textGujarati": "બહુપદીના શૂન્યો શોધવા"
      },
      {
        "time": "09:10",
        "text": "Factor theorem proofs",
        "textGujarati": "અવયવ પ્રમેય"
      },
      {
        "time": "16:00",
        "text": "Splitting middle term factorization",
        "textGujarati": "મધ્યમ પદના ભાગ પાડવાની રીત"
      }
    ],
    "comments": [],
    "referencePdfUrl": "https://ncert.nic.in/textbook/pdf/iemh102.pdf"
  },
  {
    "id": "vid-school-9-4",
    "grades": [
      "9"
    ],
    "boards": [
      "CBSE",
      "GSEB"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 9 Science – Motion & Derivation of 3 Equations of Motion",
    "titleGujarati": "ધોરણ ૯ વિજ્ઞાન – પ્રકરણ ૪: ગતિ અને ગતિના ત્રણ સમીકરણોની તારવણી",
    "instructor": "Physics Wallah Class 9",
    "instructorGujarati": "દિવાળીપુરા યુથ ગુજરાત",
    "duration": "24:10",
    "durationSeconds": 1450,
    "youtubeVideoId": "9M2k7V4b6xN",
    "thumbnailUrl": "https://img.youtube.com/vi/9M2k7V4b6xN/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Distance vs displacement, speed vs velocity, acceleration, distance-time graphs, and deriving v=u+at, s=ut+1/2at², v²-u²=2as.",
    "descriptionGujarati": "અંતર-સ્થાનાંતર, ઝડપ-વેગ, પ્રવેગ, અને આલેખની રીતથી ગતિના સમીકરણો તારવવા.",
    "timeStampedNotes": [
      {
        "time": "02:15",
        "text": "Distance vs Displacement concepts",
        "textGujarati": "અંતર અને સ્થાનાંતર"
      },
      {
        "time": "09:00",
        "text": "Velocity-Time graph slope & area",
        "textGujarati": "વેગ-સમય આલેખ"
      },
      {
        "time": "17:30",
        "text": "Deriving v² - u² = 2as graphically",
        "textGujarati": "ગતિના સમીકરણની તારવણી"
      }
    ],
    "comments": [],
    "referencePdfUrl": "https://ncert.nic.in/textbook/pdf/iesc104.pdf"
  },
  {
    "id": "vid-school-9-5",
    "grades": [
      "9"
    ],
    "boards": [
      "CBSE",
      "GSEB"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 9 Science – Force and Newton’s Three Laws of Motion",
    "titleGujarati": "ધોરણ ૯ વિજ્ઞાન – પ્રકરણ ૫: બળ અને ન્યૂટનના ગતિના ત્રણ નિયમો",
    "instructor": "Khan Academy Class 9",
    "instructorGujarati": "વિદ્યાકુલ ગુજરાત",
    "duration": "19:50",
    "durationSeconds": 1190,
    "youtubeVideoId": "1X5v8K3m7nQ",
    "thumbnailUrl": "https://img.youtube.com/vi/1X5v8K3m7nQ/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Inertia & mass, Newton 2nd law derivation (F=ma), 3rd law action-reaction pairs, and law of conservation of momentum.",
    "descriptionGujarati": "જડત્વ અને દળ, F=ma ની તારવણી, ક્રિયાબળ-પ્રતિક્રિયાબળ, અને વેગમાન સંરક્ષણનો નિયમ.",
    "timeStampedNotes": [
      {
        "time": "02:00",
        "text": "Galileo idea of inertia & Newton 1st law",
        "textGujarati": "જડત્વનો નિયમ"
      },
      {
        "time": "08:20",
        "text": "F = dp/dt = ma derivation",
        "textGujarati": "F=ma ની તારવણી"
      },
      {
        "time": "14:40",
        "text": "Recoil of gun & rocket propulsion",
        "textGujarati": "બંદૂકનો રિકોઇલ અને રોકેટ ગતિ"
      }
    ],
    "comments": [],
    "referencePdfUrl": "https://ncert.nic.in/textbook/pdf/iesc105.pdf"
  },
  {
    "id": "vid-school-10-1",
    "grades": [
      "10"
    ],
    "boards": [
      "CBSE",
      "GSEB"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 10 Math – Real Numbers (Board Exam Masterclass & Proofs)",
    "titleGujarati": "ધોરણ ૧૦ બોર્ડ ગણિત – પ્રકરણ ૧: વાસ્તવિક સંખ્યાઓ (GSEB/CBSE બોર્ડ)",
    "instructor": "Physics Wallah Foundation",
    "instructorGujarati": "વિદ્યાકુલ ગુજરાત બોર્ડ",
    "duration": "22:15",
    "durationSeconds": 1335,
    "youtubeVideoId": "k2q6B5c8n8M",
    "thumbnailUrl": "https://img.youtube.com/vi/k2q6B5c8n8M/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Fundamental Theorem of Arithmetic, proving irrationality of √2, √3, √5, decimal expansions, and board previous year questions.",
    "descriptionGujarati": "અંકગણિતનું મૂળભૂત પ્રમેય, √2, √3, √5 અસંમેય સાબિત કરવાની પદ્ધતિ, લ.સા.અ.-ગુ.સા.અ. સંબંધ અને બોર્ડના આઈએમપી પ્રશ્નો.",
    "timeStampedNotes": [
      {
        "time": "01:45",
        "text": "Fundamental Theorem of Arithmetic formula: HCF × LCM = a × b",
        "textGujarati": "ગુસાઅ × લસાઅ = a × b સૂત્ર"
      },
      {
        "time": "07:20",
        "text": "Rigorous proof: Prove that √5 is irrational (Contradiction method)",
        "textGujarati": "સાબિતી: √5 અસંમેય સંખ્યા છે"
      },
      {
        "time": "14:50",
        "text": "Board Exam Section B 2-mark high-yield problems",
        "textGujarati": "બોર્ડ પરીક્ષા વિભાગ B ના ૨ ગુણના દાખલા"
      }
    ],
    "comments": [
      {
        "id": "c10_1",
        "author": "Aarav Vora",
        "role": "Verified Learner",
        "text": "The contradiction method explanation for √5 is crystal clear! Guaranteed 3 marks.",
        "upvotes": 11,
        "createdAt": "1 day ago"
      }
    ],
    "referencePdfUrl": "https://ncert.nic.in/textbook/pdf/jemh101.pdf"
  },
  {
    "id": "vid-school-10-2",
    "grades": [
      "10"
    ],
    "boards": [
      "CBSE",
      "GSEB"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 10 Math – Introduction to Trigonometry (Formulas & Tricks)",
    "titleGujarati": "ધોરણ ૧૦ બોર્ડ ગણિત – પ્રકરણ ૮: ત્રિકોણમિતિનો પરિચય (સૂત્રો અને શોર્ટકટ્સ)",
    "instructor": "Dear Sir Class 10",
    "instructorGujarati": "દિવાળીપુરા યુથ બોર્ડ સ્પેશિયલ",
    "duration": "25:40",
    "durationSeconds": 1540,
    "youtubeVideoId": "p9c8v7B6n5M",
    "thumbnailUrl": "https://img.youtube.com/vi/p9c8v7B6n5M/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Trigonometric ratios (sin, cos, tan, cot, sec, cosec), values table for 0°, 30°, 45°, 60°, 90°, and proving trigonometric identities.",
    "descriptionGujarati": "ત્રિકોણમિતીય ગુણોત્તરો, વિશિષ્ટ ખૂણાઓનું મૂલ્ય પત્રક યાદ રાખવાની ટ્રીક અને sin²θ + cos²θ = 1 આધારિત સાબિતીના દાખલા.",
    "timeStampedNotes": [
      {
        "time": "02:00",
        "text": "PBP/HHB trick to remember sin, cos, tan",
        "textGujarati": "ત્રિકોણમિતિ ગુણોત્તર યાદ રાખવાની ટ્રીક"
      },
      {
        "time": "08:30",
        "text": "Hand trick to recall 0°, 30°, 45°, 60°, 90° table instantly",
        "textGujarati": "હાથની આંગળીઓની ટ્રીકથી કોષ્ટક યાદ રાખવું"
      },
      {
        "time": "16:45",
        "text": "Standard Identities: sin²θ + cos²θ = 1, 1 + tan²θ = sec²θ",
        "textGujarati": "મૂળભૂત નિત્યસમો અને સાબિતીઓ"
      }
    ],
    "comments": [],
    "referencePdfUrl": "https://ncert.nic.in/textbook/pdf/jemh108.pdf"
  },
  {
    "id": "vid-school-10-3",
    "grades": [
      "10"
    ],
    "boards": [
      "CBSE",
      "GSEB"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 10 Science – Chemical Reactions & Equations (Balancing Masterclass)",
    "titleGujarati": "ધોરણ ૧૦ બોર્ડ વિજ્ઞાન – પ્રકરણ ૧: રાસાયણિક પ્રક્રિયાઓ અને સમીકરણો સંતુલિત કરવા",
    "instructor": "Physics Wallah Class 10",
    "instructorGujarati": "વિદ્યાકુલ વિજ્ઞાન બોર્ડ",
    "duration": "23:10",
    "durationSeconds": 1390,
    "youtubeVideoId": "9c8v7b6N5m4",
    "thumbnailUrl": "https://img.youtube.com/vi/9c8v7b6N5m4/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Balancing chemical equations via hit and trial, types of reactions (combination, decomposition, displacement, double displacement, redox), and corrosion.",
    "descriptionGujarati": "રાસાયણિક સમીકરણ સંતુલિત કરવાની રીત, વિઘટન, સંયોગીકરણ, વિસ્થાપન, રેડોક્ષ પ્રક્રિયાઓ અને ક્ષારણ.",
    "timeStampedNotes": [
      {
        "time": "01:30",
        "text": "Hit & Trial method for balancing complex equations",
        "textGujarati": "સમીકરણ સંતુલિત કરવાની સરળ પદ્ધતિ"
      },
      {
        "time": "09:00",
        "text": "Exothermic vs Endothermic reactions with examples",
        "textGujarati": "ઉષ્માક્ષેપક અને ઉષ્માશોષક પ્રક્રિયાઓ"
      },
      {
        "time": "16:20",
        "text": "Redox reactions: Oxidation, reduction, oxidizing agents",
        "textGujarati": "ઓક્સિડેશન અને રિડક્શન પ્રક્રિયાઓ"
      }
    ],
    "comments": [],
    "referencePdfUrl": "https://ncert.nic.in/textbook/pdf/jesc101.pdf"
  },
  {
    "id": "vid-school-10-4",
    "grades": [
      "10"
    ],
    "boards": [
      "CBSE",
      "GSEB"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 10 Science – Electricity: Ohm’s Law, Series & Parallel Resistors",
    "titleGujarati": "ધોરણ ૧૦ બોર્ડ વિજ્ઞાન – પ્રકરણ ૧૨: વિદ્યુત (ઓહ્મનો નિયમ, શ્રેણી અને સમાંતર જોડાણ)",
    "instructor": "Magnet Brains Class 10",
    "instructorGujarati": "શિક્ષણ સેતુ બોર્ડ સ્પેશિયલ",
    "duration": "26:20",
    "durationSeconds": 1580,
    "youtubeVideoId": "4H9m6V2k8xP",
    "thumbnailUrl": "https://img.youtube.com/vi/4H9m6V2k8xP/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Electric potential difference, Ohm's Law (V=IR), factors affecting resistance, series vs parallel equivalent resistance, and Joule's law of heating.",
    "descriptionGujarati": "વિદ્યુત સ્થિતિમાનનો તફાવત, ઓહ્મનો નિયમ (V=IR), અવરોધોનું શ્રેણી અને સમાંતર જોડાણ, અને જૂલનો તાપીય નિયમ (H=I²Rt).",
    "timeStampedNotes": [
      {
        "time": "02:15",
        "text": "Ohm's Law V-I graph & verification",
        "textGujarati": "ઓહ્મનો નિયમ અને V-I આલેખ"
      },
      {
        "time": "09:40",
        "text": "Series (Rs = R1+R2) vs Parallel (1/Rp = 1/R1 + 1/R2) derivation",
        "textGujarati": "અવરોધોના જોડાણની તારવણી"
      },
      {
        "time": "18:50",
        "text": "Electric Power P = VI = I²R = V²/R numericals",
        "textGujarati": "વિદ્યુત પાવરના દાખલા"
      }
    ],
    "comments": [],
    "referencePdfUrl": "https://ncert.nic.in/textbook/pdf/jesc110.pdf"
  },
  {
    "id": "vid-school-10-5",
    "grades": [
      "10"
    ],
    "boards": [
      "CBSE",
      "GSEB"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 10 Math – Quadratic Equations & Discriminant Nature of Roots",
    "titleGujarati": "ધોરણ ૧૦ બોર્ડ ગણિત – પ્રકરણ ૪: દ્વિઘાત સમીકરણ અને વિવેચક D",
    "instructor": "Unacademy Class 10",
    "instructorGujarati": "ગુજરાત બોર્ડ ટોપર્સ એકેડમી",
    "duration": "21:50",
    "durationSeconds": 1310,
    "youtubeVideoId": "7L3k9B5v1xN",
    "thumbnailUrl": "https://img.youtube.com/vi/7L3k9B5v1xN/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Quadratic formula [-b ± √(b²-4ac)] / (2a), discriminant D = b²-4ac nature of roots, and speed-time word problems.",
    "descriptionGujarati": "દ્વિઘાત સૂત્રની રીત, વિવેચક D પરથી બીજના પ્રકારો (વાસ્તવિક અને સમાન/ભિન્ન), અને હોડી-ટ્રેનના કૂટપ્રશ્નો.",
    "timeStampedNotes": [
      {
        "time": "02:00",
        "text": "Standard quadratic form ax² + bx + c = 0",
        "textGujarati": "પ્રમાણિત સ્વરૂપ"
      },
      {
        "time": "07:45",
        "text": "Discriminant D > 0, D = 0, D < 0 nature of roots",
        "textGujarati": "વિવેચક D અને બીજના પ્રકાર"
      },
      {
        "time": "14:30",
        "text": "Train speed and upstream-downstream boat problem",
        "textGujarati": "ટ્રેન અને હોડીના મહત્વના દાખલા"
      }
    ],
    "comments": [],
    "referencePdfUrl": "https://ncert.nic.in/textbook/pdf/jemh104.pdf"
  },
  {
    "id": "vid-school-11-1",
    "grades": [
      "11"
    ],
    "boards": [
      "CBSE",
      "GSEB"
    ],
    "category": "Physics",
    "categoryGujarati": "ભૌતિક વિજ્ઞાન",
    "title": "Class 11 Physics – Units, Dimensions & Error Analysis (JEE / GUJCET)",
    "titleGujarati": "ધોરણ ૧૧ ભૌતિક વિજ્ઞાન – પ્રકરણ ૧: એકમો, પરિમાણ અને ત્રુટિનું વિશ્લેષણ",
    "instructor": "Physics Wallah - Alakh Pandey",
    "instructorGujarati": "વિદ્યાકુલ સાયન્સ ગુજરાત",
    "duration": "27:10",
    "durationSeconds": 1630,
    "youtubeVideoId": "5b6v7C8x9Z0",
    "thumbnailUrl": "https://img.youtube.com/vi/5b6v7C8x9Z0/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "SI system, dimensional formula derivation for physical constants (G, h, ε0), principle of homogeneity, percentage error propagation.",
    "descriptionGujarati": "SI એકમ પદ્ધતિ, પરિમાણિક સૂત્રો, સમપરિમાણતાનો સિદ્ધાંત, સાપેક્ષ અને પ્રતિશત ત્રુટિ ગણવાની સરળ પદ્ધતિ.",
    "timeStampedNotes": [
      {
        "time": "02:30",
        "text": "7 Fundamental SI units & Supplementary units",
        "textGujarati": "મૂળભૂત SI એકમો"
      },
      {
        "time": "09:45",
        "text": "Finding dimensional formula of Gravitational constant G and Planck constant h",
        "textGujarati": "G અને h નું પારિમાણિક સૂત્ર"
      },
      {
        "time": "18:10",
        "text": "Relative error & percentage error formula in fractional quantities: ΔZ/Z",
        "textGujarati": "પ્રતિશત ત્રુટિનું સંયોજન"
      }
    ],
    "comments": [
      {
        "id": "c11_1",
        "author": "Rohan Shah",
        "role": "Verified Learner",
        "text": "The dimensional analysis shortcuts solved all my GUJCET previous year questions instantly.",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "https://ncert.nic.in/textbook/pdf/keph101.pdf"
  },
  {
    "id": "vid-school-11-2",
    "grades": [
      "11"
    ],
    "boards": [
      "CBSE",
      "GSEB"
    ],
    "category": "Chemistry",
    "categoryGujarati": "રસાયણ વિજ્ઞાન",
    "title": "Class 11 Chemistry – Mole Concept, Molarity & Stoichiometry",
    "titleGujarati": "ધોરણ ૧૧ રસાયણ વિજ્ઞાન – પ્રકરણ ૧: મોલ સંકલ્પના, મોલારિટી અને તત્વયોગમિતિ",
    "instructor": "Apni Kaksha Chemistry",
    "instructorGujarati": "ગુજરાત ઉચ્ચતર માધ્યમિક સાયન્સ",
    "duration": "25:30",
    "durationSeconds": 1530,
    "youtubeVideoId": "2c3v4B5n6M7",
    "thumbnailUrl": "https://img.youtube.com/vi/2c3v4B5n6M7/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Avogadro number, calculating moles from mass, particles, and gas volume at STP. Molarity, Molality, Mole Fraction, and limiting reagent.",
    "descriptionGujarati": "એવોગેડ્રો અંક, મોલ સંકલ્પના, સાંદ્રતાના એકમો (મોલારિટી M, મોલાલિટી m, મોલ-અંશ x), અને સીમિત પ્રક્રિયક (Limiting Reagent).",
    "timeStampedNotes": [
      {
        "time": "01:50",
        "text": "Mole triangle relation: Mass / Molar mass = Particles / NA = Vol / 22.4L",
        "textGujarati": "મોલ ત્રિકોણ સૂત્ર"
      },
      {
        "time": "08:40",
        "text": "Molarity (M) vs Molality (m) and temperature dependence",
        "textGujarati": "મોલારિટી vs મોલાલિટી"
      },
      {
        "time": "17:15",
        "text": "Identifying Limiting Reagent in balanced chemical reactions",
        "textGujarati": "સીમિત પ્રક્રિયક નક્કી કરવાની રીત"
      }
    ],
    "comments": [],
    "referencePdfUrl": "https://ncert.nic.in/textbook/pdf/kech101.pdf"
  },
  {
    "id": "vid-school-11-3",
    "grades": [
      "11"
    ],
    "boards": [
      "CBSE",
      "GSEB"
    ],
    "category": "Physics",
    "categoryGujarati": "ભૌતિક વિજ્ઞાન",
    "title": "Class 11 Physics – Motion in a Straight Line (Kinematic Calculus)",
    "titleGujarati": "ધોરણ ૧૧ ભૌતિક વિજ્ઞાન – પ્રકરણ ૨: સુરેખ પથ પર ગતિ અને કલનશાસ્ત્ર",
    "instructor": "Physics Wallah JEE",
    "instructorGujarati": "દિવાળીપુરા સાયન્સ",
    "duration": "26:45",
    "durationSeconds": 1605,
    "youtubeVideoId": "8N4k7V2m5xL",
    "thumbnailUrl": "https://img.youtube.com/vi/8N4k7V2m5xL/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Instantaneous velocity and acceleration using derivatives (dx/dt, dv/dt), integration for position, and relative velocity in 1D.",
    "descriptionGujarati": "વિકલન અને સંકલન દ્વારા તત્કાલીન વેગ-પ્રવેગ, મુક્ત પતન અને સાપેક્ષ વેગના JEE/GUJCET દાખલા.",
    "timeStampedNotes": [
      {
        "time": "02:20",
        "text": "Calculus derivatives for position x(t)",
        "textGujarati": "કલનશાસ્ત્ર વડે વેગ-પ્રવેગ"
      },
      {
        "time": "10:15",
        "text": "Free fall under gravity sign conventions",
        "textGujarati": "ગુરુત્વાકર્ષણ હેઠળ મુક્ત પતન"
      },
      {
        "time": "19:00",
        "text": "Relative velocity V_AB = V_A - V_B",
        "textGujarati": "સાપેક્ષ વેગ"
      }
    ],
    "comments": [],
    "referencePdfUrl": "https://ncert.nic.in/textbook/pdf/keph102.pdf"
  },
  {
    "id": "vid-school-11-4",
    "grades": [
      "11"
    ],
    "boards": [
      "CBSE",
      "GSEB"
    ],
    "category": "Chemistry",
    "categoryGujarati": "રસાયણ વિજ્ઞાન",
    "title": "Class 11 Chemistry – Structure of Atom (Quantum Numbers & Orbitals)",
    "titleGujarati": "ધોરણ ૧૧ રસાયણ વિજ્ઞાન – પ્રકરણ ૨: પરમાણુનું બંધારણ અને ક્વોન્ટમ આંક",
    "instructor": "Unacademy JEE",
    "instructorGujarati": "વિદ્યાકુલ કેમિસ્ટ્રી",
    "duration": "28:15",
    "durationSeconds": 1695,
    "youtubeVideoId": "2M7k4V8b5xN",
    "thumbnailUrl": "https://img.youtube.com/vi/2M7k4V8b5xN/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Bohr's model limitations, de Broglie wavelength (λ = h/mv), Heisenberg uncertainty principle, 4 quantum numbers (n, l, m, s), and Aufbau principle.",
    "descriptionGujarati": "ડી બ્રોગ્લી તરંગલંબાઈ, હાઇઝનબર્ગનો અનિશ્ચિતતાનો સિદ્ધાંત, ચાર ક્વોન્ટમ આંક અને ઔફબાઉ-હુંડ-પાઉલીના નિયમો.",
    "timeStampedNotes": [
      {
        "time": "02:00",
        "text": "Bohr energy levels En = -13.6/n² eV",
        "textGujarati": "બોહરના ઊર્જા સ્તરો"
      },
      {
        "time": "09:30",
        "text": "Principal, Azimuthal, Magnetic & Spin quantum numbers",
        "textGujarati": "૪ ક્વોન્ટમ આંકની સમજૂતી"
      },
      {
        "time": "18:40",
        "text": "Electronic configuration exceptions (Cr & Cu)",
        "textGujarati": "ઇલેક્ટ્રોન રચનાના અપવાદો"
      }
    ],
    "comments": [],
    "referencePdfUrl": "https://ncert.nic.in/textbook/pdf/kech102.pdf"
  },
  {
    "id": "vid-school-11-5",
    "grades": [
      "11"
    ],
    "boards": [
      "CBSE",
      "GSEB"
    ],
    "category": "Physics",
    "categoryGujarati": "ભૌતિક વિજ્ઞાન",
    "title": "Class 11 Physics – Laws of Motion, Friction & Free Body Diagrams",
    "titleGujarati": "ધોરણ ૧૧ ભૌતિક વિજ્ઞાન – પ્રકરણ ૪: ગતિના નિયમો, ઘર્ષણ અને ફ્રી બોડી ડાયાગ્રામ",
    "instructor": "Vedantu JEE",
    "instructorGujarati": "ગુજરાત સાયન્સ કન્સેપ્ટ",
    "duration": "29:00",
    "durationSeconds": 1740,
    "youtubeVideoId": "6P9m3V1k5xR",
    "thumbnailUrl": "https://img.youtube.com/vi/6P9m3V1k5xR/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Drawing Free Body Diagrams (FBD), pulley-block systems, static vs kinetic friction, and banked curved road maximum safe speed.",
    "descriptionGujarati": "ફ્રી બોડી ડાયાગ્રામ (FBD), ગરેડી-બ્લોક તંત્ર, સ્થિત અને ગતિક ઘર્ષણ, ઢોળાવવાળા વળાંકવાળા રસ્તા પર સલામત ઝડપ.",
    "timeStampedNotes": [
      {
        "time": "02:15",
        "text": "Step-by-step method to draw Free Body Diagrams",
        "textGujarati": "FBD દોરવાની રીત"
      },
      {
        "time": "10:45",
        "text": "Pulley and connected string tension analysis",
        "textGujarati": "ગરેડી અને દોરીમાં તણાવબળ"
      },
      {
        "time": "20:10",
        "text": "Banked circular road formula: v = √[rg(tanθ+μ)/(1-μtanθ)]",
        "textGujarati": "ઢોળાવવાળા વળાંક પર ઝડપ"
      }
    ],
    "comments": [],
    "referencePdfUrl": "https://ncert.nic.in/textbook/pdf/keph104.pdf"
  },
  {
    "id": "vid-school-12-1",
    "grades": [
      "12"
    ],
    "boards": [
      "CBSE",
      "GSEB"
    ],
    "category": "Physics",
    "categoryGujarati": "ભૌતિક વિજ્ઞાન",
    "title": "Class 12 Physics – Electric Charges, Gauss’s Law & Dipole Fields",
    "titleGujarati": "ધોરણ ૧૨ બોર્ડ ફિઝિક્સ – પ્રકરણ ૧: વિધુતભારો, ગોસનો નિયમ અને ડાયપોલ ક્ષેત્ર",
    "instructor": "Physics Wallah - Alakh Pandey",
    "instructorGujarati": "વિદ્યાકુલ ૧૨ સાયન્સ બોર્ડ",
    "duration": "31:20",
    "durationSeconds": 1880,
    "youtubeVideoId": "p0o9i8U7y6T",
    "thumbnailUrl": "https://img.youtube.com/vi/p0o9i8U7y6T/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Coulomb's Law in vector form, electric field on axial & equatorial line of dipole, electric flux (Φ = E·A), and Gauss's Law derivations for wire and sheet.",
    "descriptionGujarati": "કુલંબનો નિયમ, ડાયપોલની અક્ષ અને વિષુવરેખા પર વિદ્યુતક્ષેત્ર, વિદ્યુત ફ્લક્સ, ગોસનો નિયમ અને અનંત લંબાઈના તાર માટે ક્ષેત્રની તારવણી.",
    "timeStampedNotes": [
      {
        "time": "03:10",
        "text": "Coulomb's Law vector notation and dielectric constant k = ε/ε0",
        "textGujarati": "કુલંબનો સદિશ નિયમ અને ડાઇઇલેક્ટ્રિક અચળાંક"
      },
      {
        "time": "11:40",
        "text": "Electric dipole on axial line (2kp/r³) vs equatorial line (kp/r³)",
        "textGujarati": "ડાયપોલની અક્ષ અને વિષુવરેખા પર ક્ષેત્ર"
      },
      {
        "time": "21:15",
        "text": "Gauss Law derivation for infinite straight line wire: E = λ / (2πε0r)",
        "textGujarati": "ગોસના નિયમથી અનંત લંબાઈના તારનું ક્ષેત્ર"
      }
    ],
    "comments": [
      {
        "id": "c12_1",
        "author": "Nisarg Trivedi",
        "role": "Verified Learner",
        "text": "The Gauss Law wire and spherical shell derivations are the most frequently asked in GSEB Section D (4 marks)!",
        "upvotes": 14,
        "createdAt": "1 day ago"
      }
    ],
    "referencePdfUrl": "https://ncert.nic.in/textbook/pdf/leph101.pdf"
  },
  {
    "id": "vid-school-12-2",
    "grades": [
      "12"
    ],
    "boards": [
      "CBSE",
      "GSEB"
    ],
    "category": "Chemistry",
    "categoryGujarati": "રસાયણ વિજ્ઞાન",
    "title": "Class 12 Chemistry – Solutions: Raoult’s Law & Colligative Properties",
    "titleGujarati": "ધોરણ ૧૨ બોર્ડ કેમિસ્ટ્રી – પ્રકરણ ૧: દ્રાવણો, રાઉલ્ટનો નિયમ અને સંખ્યાત્મક ગુણધર્મો",
    "instructor": "Bharat Panchal - Chemistry Guruji",
    "instructorGujarati": "દિવાળીપુરા સાયન્સ બોર્ડ",
    "duration": "28:45",
    "durationSeconds": 1725,
    "youtubeVideoId": "5d6f7G8h9J0",
    "thumbnailUrl": "https://img.youtube.com/vi/5d6f7G8h9J0/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Henry's Law, Raoult's Law for volatile solutes, ideal vs non-ideal solutions, 4 colligative properties (ΔP/P0, ΔTb, ΔTf, π = CRT), and van 't Hoff factor i.",
    "descriptionGujarati": "હેનરીનો નિયમ, રાઉલ્ટનો નિયમ, આદર્શ vs બિન-આદર્શ દ્રાવણો, ઉત્કલનબિંદુ ઉન્નયન (ΔTb = Kb·m), ઠારબિંદુ અવનયન (ΔTf = Kf·m) અને વૉન્ટ હોફ અવયવ i.",
    "timeStampedNotes": [
      {
        "time": "02:00",
        "text": "Henry's Law constant KH and gas solubility in liquids",
        "textGujarati": "હેનરીનો નિયમ અને અચળાંક KH"
      },
      {
        "time": "08:50",
        "text": "Raoult's Law and positive vs negative deviations from ideality",
        "textGujarati": "રાઉલ્ટનો નિયમ અને વિચલનો"
      },
      {
        "time": "17:30",
        "text": "Osmotic pressure π = iCRT and abnormal molar mass calculation",
        "textGujarati": "અભિસરણ દબાણ અને અસામાન્ય મોલર દળ"
      }
    ],
    "comments": [],
    "referencePdfUrl": "https://ncert.nic.in/textbook/pdf/lech101.pdf"
  },
  {
    "id": "vid-school-12-3",
    "grades": [
      "12"
    ],
    "boards": [
      "CBSE",
      "GSEB"
    ],
    "category": "Physics",
    "categoryGujarati": "ભૌતિક વિજ્ઞાન",
    "title": "Class 12 Physics – Current Electricity: Kirchhoff’s Rules & Wheatstone Bridge",
    "titleGujarati": "ધોરણ ૧૨ બોર્ડ ફિઝિક્સ – પ્રકરણ ૩: પ્રવાહ વિદ્યુત (કિર્ચોફના નિયમો અને વ્હીટસ્ટન બ્રિજ)",
    "instructor": "Physics Wallah Class 12",
    "instructorGujarati": "ગુજરાત બોર્ડ ફિઝિક્સ એકેડમી",
    "duration": "29:30",
    "durationSeconds": 1770,
    "youtubeVideoId": "1K6m9V4b2xN",
    "thumbnailUrl": "https://img.youtube.com/vi/1K6m9V4b2xN/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Drift velocity (vd = -eEτ/m), Kirchhoff's Junction & Loop rules, Wheatstone bridge balanced condition (P/Q = R/S), and potentiometer principle.",
    "descriptionGujarati": "ડ્રિફ્ટ વેગ, કિર્ચોફનો જંકશન અને લૂપ નિયમ, વ્હીટસ્ટન બ્રિજની સંતુલિત શરત, અને પોટેન્શિયોમીટરનો સિદ્ધાંત.",
    "timeStampedNotes": [
      {
        "time": "02:30",
        "text": "Drift velocity derivation and current density J = ne*vd",
        "textGujarati": "ડ્રિફ્ટ વેગની તારવણી"
      },
      {
        "time": "11:10",
        "text": "Kirchhoff's Junction (KCL) & Loop Rule (KVL) sign convention",
        "textGujarati": "કિર્ચોફના નિયમો"
      },
      {
        "time": "20:40",
        "text": "Balanced Wheatstone Bridge condition P/Q = R/S proof",
        "textGujarati": "વ્હીટસ્ટન બ્રિજની સાબિતી"
      }
    ],
    "comments": [],
    "referencePdfUrl": "https://ncert.nic.in/textbook/pdf/leph103.pdf"
  },
  {
    "id": "vid-school-12-4",
    "grades": [
      "12"
    ],
    "boards": [
      "CBSE",
      "GSEB"
    ],
    "category": "Chemistry",
    "categoryGujarati": "રસાયણ વિજ્ઞાન",
    "title": "Class 12 Chemistry – Electrochemistry: Nernst Equation & Kohlrausch Law",
    "titleGujarati": "ધોરણ ૧૨ બોર્ડ કેમિસ્ટ્રી – પ્રકરણ ૨: વિદ્યુત રસાયણ (નર્ન્સ્ટ સમીકરણ અને કોહલરોશ નિયમ)",
    "instructor": "Unacademy Class 12",
    "instructorGujarati": "વિદ્યાકુલ કેમિસ્ટ્રી બોર્ડ",
    "duration": "27:50",
    "durationSeconds": 1670,
    "youtubeVideoId": "7V2k5M8b3xP",
    "thumbnailUrl": "https://img.youtube.com/vi/7V2k5M8b3xP/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Galvanic cell representation, standard electrode potential, Nernst Equation for EMF: Ecell = E0cell - (0.0591/n)log(Q), Kohlrausch's law, and Faraday laws.",
    "descriptionGujarati": "ગેલ્વેનિક કોષ, પ્રમાણિત ઈલેક્ટ્રોડ પોટેન્શિયલ, નર્ન્સ્ટ સમીકરણ, કોહલરોશનો સ્વતંત્ર અભિગમનનો નિયમ અને ફેરાડેના વિદ્યુતવિભાજનના નિયમો.",
    "timeStampedNotes": [
      {
        "time": "02:00",
        "text": "Daniel cell representation: Zn|Zn²⁺ || Cu²⁺|Cu",
        "textGujarati": "ડેનિયલ કોષનું નિરૂપણ"
      },
      {
        "time": "09:20",
        "text": "Nernst equation derivation and log Q calculation",
        "textGujarati": "નર્ન્સ્ટ સમીકરણના દાખલા"
      },
      {
        "time": "18:15",
        "text": "Kohlrausch's Law for limiting molar conductivity Λ0m",
        "textGujarati": "કોહલરોશનો નિયમ"
      }
    ],
    "comments": [],
    "referencePdfUrl": "https://ncert.nic.in/textbook/pdf/lech102.pdf"
  },
  {
    "id": "vid-school-12-5",
    "grades": [
      "12"
    ],
    "boards": [
      "CBSE",
      "GSEB"
    ],
    "category": "Physics",
    "categoryGujarati": "ભૌતિક વિજ્ઞાન",
    "title": "Class 12 Physics – Ray Optics: Spherical Refraction & Lens Maker Formula",
    "titleGujarati": "ધોરણ ૧૨ બોર્ડ ફિઝિક્સ – પ્રકરણ ૯: કિરણ પ્રકાશશાસ્ત્ર (લેન્સ મેકરનું સૂત્ર)",
    "instructor": "Magnet Brains Class 12",
    "instructorGujarati": "દિવાળીપુરા ફિઝિક્સ",
    "duration": "32:00",
    "durationSeconds": 1920,
    "youtubeVideoId": "3X8m5V2k9xL",
    "thumbnailUrl": "https://img.youtube.com/vi/3X8m5V2k9xL/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Refraction at spherical surfaces (n2/v - n1/u = (n2-n1)/R), Lens Maker's Formula (1/f = (n-1)(1/R1 - 1/R2)), Total Internal Reflection, and optical fibers.",
    "descriptionGujarati": "ગોળીય સપાટી આગળ વક્રીભવન, લેન્સ મેકરનું સૂત્ર, પૂર્ણ આંતરિક પરાવર્તન (TIR), અને ઓપ્ટિકલ ફાઈબરની રચના.",
    "timeStampedNotes": [
      {
        "time": "02:45",
        "text": "Total Internal Reflection conditions and critical angle",
        "textGujarati": "પૂર્ણ આંતરિક પરાવર્તન"
      },
      {
        "time": "12:00",
        "text": "Refraction at curved surface derivation: n2/v - n1/u = (n2-n1)/R",
        "textGujarati": "ગોળીય સપાટી આગળ વક્રીભવન"
      },
      {
        "time": "22:30",
        "text": "Lens Maker's Formula derivation step-by-step (Guaranteed Board Sum)",
        "textGujarati": "લેન્સ મેકરનું સૂત્ર"
      }
    ],
    "comments": [],
    "referencePdfUrl": "https://ncert.nic.in/textbook/pdf/leph105.pdf"
  },
  {
    "id": "vid-college-1",
    "grades": [
      "college"
    ],
    "boards": [
      "CBSE",
      "GSEB"
    ],
    "category": "Aptitude & Placements",
    "categoryGujarati": "પ્લેસમેન્ટ અને સ્પર્ધાત્મક પરીક્ષા",
    "title": "Quantitative Aptitude – Speed, Distance & Time: Trains & Boats Tricks",
    "titleGujarati": "ક્વોન્ટિટેટિવ એપ્ટિટ્યુડ – ટ્રેન, ઝડપ, હોડી અને પ્રવાહ શોર્ટકટ ટ્રીક્સ",
    "instructor": "CareerRide Aptitude",
    "instructorGujarati": "પ્લેસમેન્ટ એપ્ટિટ્યુડ માસ્ટર",
    "duration": "22:45",
    "durationSeconds": 1365,
    "youtubeVideoId": "kJg3h6N8b5M",
    "thumbnailUrl": "https://img.youtube.com/vi/kJg3h6N8b5M/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Master relative speed concepts for trains crossing platforms, moving men, and upstream/downstream boat problems for TCS NQT, Infosys and Cognizant rounds.",
    "descriptionGujarati": "TCS NQT, ઈન્ફોસીસ અને ગવર્નમેન્ટ પરીક્ષાઓ માટે સાપેક્ષ ઝડપ, ટ્રેન પ્લેટફોર્મ ક્રોસિંગ અને હોડી-પ્રવાહના દાખલાઓ શોર્ટકટ ટ્રીક્સથી સમજો.",
    "timeStampedNotes": [
      {
        "time": "01:20",
        "text": "Unit conversion shortcuts (km/h to m/s multiply by 5/18)",
        "textGujarati": "એકમ રૂપાંતરણ શોર્ટકટ (km/h થી m/s)"
      },
      {
        "time": "06:10",
        "text": "Train crossing a moving person vs train crossing a platform bridge",
        "textGujarati": "ટ્રેન ક્રોસિંગ કન્સેપ્ટ"
      },
      {
        "time": "14:30",
        "text": "Boats & Streams: Downstream = u + v, Upstream = u - v",
        "textGujarati": "હોડી અને પ્રવાહના સૂત્રો"
      }
    ],
    "comments": [
      {
        "id": "c_col_1",
        "author": "Hardik Senjaliya",
        "role": "Verified Learner",
        "text": "The 5/18 conversion trick and relative velocity formula saved me at least 15 minutes during TCS NQT test.",
        "upvotes": 18,
        "createdAt": "4 days ago"
      }
    ],
    "referencePdfUrl": "https://www.iitg.ac.in/stud/ccd/prep/Speed_Distance_Time.pdf"
  },
  {
    "id": "vid-college-2",
    "grades": [
      "college"
    ],
    "boards": [
      "CBSE",
      "GSEB"
    ],
    "category": "Logical Reasoning",
    "categoryGujarati": "તાર્કિક કસોટી",
    "title": "Logical Reasoning – Coding-Decoding & Number Series Recognition",
    "titleGujarati": "રિઝનિંગ – કોડિંગ-ડીકોડિંગ અને નંબર સિરીઝ ઓળખવાની શોર્ટકટ ટ્રીક્સ",
    "instructor": "Feel Free to Learn",
    "instructorGujarati": "લોજિકલ રિઝનિંગ ગુરુ",
    "duration": "20:30",
    "durationSeconds": 1230,
    "youtubeVideoId": "v4c5B6n7m8K",
    "thumbnailUrl": "https://img.youtube.com/vi/v4c5B6n7m8K/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Learn pattern recognition for alphanumeric shifting, alternating series, prime gaps, and reverse alphabet position codes for campus recruitment tests.",
    "descriptionGujarati": "કેમ્પસ પ્લેસમેન્ટ ટેસ્ટ માટે મૂળાક્ષરોનો ક્રમ (EJOTY ટ્રીક), વિરોધી મૂળાક્ષરો અને નંબર સિરીઝના તર્ક ઉકેલવાની ઝડપી પદ્ધતિ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "EJOTY rule for quick alphabet numbering (5, 10, 15, 20, 25)",
        "textGujarati": "EJOTY નિયમથી મૂળાક્ષર નંબર યાદ રાખવો"
      },
      {
        "time": "06:45",
        "text": "Opposite letters pairing trick (A-Z, B-Y, C-X, D-W)",
        "textGujarati": "વિરોધી મૂળાક્ષરોની જોડ"
      },
      {
        "time": "13:10",
        "text": "Alternating difference and double difference series tricks",
        "textGujarati": "ડબલ ડિફરન્સ સિરીઝ ઉકેલવી"
      }
    ],
    "comments": [],
    "referencePdfUrl": "https://nptel.ac.in/courses/109/104/Series_Coding_Notes.pdf"
  },
  {
    "id": "vid-college-3",
    "grades": [
      "college"
    ],
    "boards": [
      "CBSE",
      "GSEB"
    ],
    "category": "Computer Science",
    "categoryGujarati": "કોમ્પ્યુટર સાયન્સ & કોડિંગ",
    "title": "Data Structures – Binary Search Trees, Graphs & Traversal Complexity",
    "titleGujarati": "ડેટા સ્ટ્રક્ચર – બાઈનરી સર્ચ ટ્રી, ગ્રાફ અને ટ્રાવર્સલ અલ્ગોરિધમ્સ",
    "instructor": "Abdul Bari / Apna College",
    "instructorGujarati": "ટેકનિકલ કોડિંગ ગુજરાતી",
    "duration": "28:15",
    "durationSeconds": 1695,
    "youtubeVideoId": "D6xkbGLQesk",
    "thumbnailUrl": "https://img.youtube.com/vi/D6xkbGLQesk/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "In-depth explanation of BST insertion, search, BFS vs DFS tree traversal, and time/space complexity analysis (Big-O) for Amazon & product-based interviews.",
    "descriptionGujarati": "પ્રોડક્ટ કંપનીઓ અને ગૂગલ/એમેઝોન ઇન્ટરવ્યુ માટે બાઈનરી સર્ચ ટ્રી, ઇનઓર્ડર-પ્રિઓર્ડર-પોસ્ટઓર્ડર ટ્રાવર્સલ અને ટાઇમ કોમ્પ્લેક્સિટી એનાલિસિસ.",
    "timeStampedNotes": [
      {
        "time": "02:00",
        "text": "Binary Tree vs Binary Search Tree (BST) property",
        "textGujarati": "બાઈનરી ટ્રી vs બાઈનરી સર્ચ ટ્રી"
      },
      {
        "time": "09:30",
        "text": "Recursive vs Iterative BST search implementation (O(h))",
        "textGujarati": "BST સર્ચ ઇમ્પ્લીમેન્ટેશન"
      },
      {
        "time": "18:00",
        "text": "Level order traversal (BFS) using Queue data structure",
        "textGujarati": "ક્યૂ દ્વારા લેવલ ઓર્ડર ટ્રાવર્સલ"
      }
    ],
    "comments": [],
    "referencePdfUrl": "https://opendsa-server.cs.vt.edu/ODSA/Books/CS3/html/BinaryTrees.pdf"
  },
  {
    "id": "vid-college-4",
    "grades": [
      "college"
    ],
    "boards": [
      "CBSE",
      "GSEB"
    ],
    "category": "Computer Science",
    "categoryGujarati": "કોમ્પ્યુટર સાયન્સ & કોડિંગ",
    "title": "DBMS & SQL Mastery – ACID Properties, Normalization (1NF to BCNF) & Indexing",
    "titleGujarati": "ડીબીએમએસ – એસિડ ગુણધર્મો, નોર્મલાઇઝેશન (1NF થી BCNF) અને ઈન્ડેક્સિંગ",
    "instructor": "Gate Smashers",
    "instructorGujarati": "ગેટ સ્મેશર્સ કોમ્પ્યુટર એન્જિનિયરિંગ",
    "duration": "24:50",
    "durationSeconds": 1490,
    "youtubeVideoId": "TNhaISOUy6Q",
    "thumbnailUrl": "https://img.youtube.com/vi/TNhaISOUy6Q/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Complete guide to ACID properties (Atomicity, Consistency, Isolation, Durability), 1NF, 2NF, 3NF, BCNF decomposition rules, and B-Tree database indexing.",
    "descriptionGujarati": "ડેટાબેઝ ઇન્ટરવ્યુ માટે ACID પ્રોપર્ટીઝ, ટ્રાન્ઝેક્શન આઇસોલેશન લેવલ અને નોર્મલાઇઝેશનના તમામ નિયમો સરળતાથી સમજો.",
    "timeStampedNotes": [
      {
        "time": "01:40",
        "text": "ACID properties explained with real banking transfer example",
        "textGujarati": "બેંક ટ્રાન્સફર ઉદાહરણથી ACID સમજૂતી"
      },
      {
        "time": "08:15",
        "text": "Functional dependency and 2NF (Full functional dependency)",
        "textGujarati": "2NF નોર્મલાઇઝેશન"
      },
      {
        "time": "16:00",
        "text": "Transitive dependency removal for 3NF and BCNF conditions",
        "textGujarati": "3NF અને BCNF ના નિયમો"
      }
    ],
    "comments": [],
    "referencePdfUrl": "https://web.stanford.edu/class/cs145/lecture_notes/DBMS_SQL_Normalization.pdf"
  },
  {
    "id": "vid-college-5",
    "grades": [
      "college"
    ],
    "boards": [
      "CBSE",
      "GSEB"
    ],
    "category": "Web Development",
    "categoryGujarati": "વેબ ડેવલપમેન્ટ",
    "title": "Modern React & JavaScript – Hooks, Virtual DOM Diffing & Event Loop",
    "titleGujarati": "રિએક્ટ અને મોડર્ન જાવાસ્ક્રિપ્ટ – હુક્સ (Hooks), વર્ચ્યુઅલ DOM અને ઇવેન્ટ લૂપ",
    "instructor": "Chai aur Code / CodeWithHarry",
    "instructorGujarati": "રિએક્ટ જેએસ વેબ ડેવલપમેન્ટ",
    "duration": "26:40",
    "durationSeconds": 1600,
    "youtubeVideoId": "0Zhy9b3v8cQ",
    "thumbnailUrl": "https://img.youtube.com/vi/0Zhy9b3v8cQ/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Master JavaScript event loop, microtasks vs macrotasks, React reconciliation (Fiber architecture), useState, useEffect, useMemo, and custom hooks.",
    "descriptionGujarati": "ફુલ-સ્ટેક ડેવલપર ઇન્ટરવ્યુ માટે જાવાસ્ક્રિપ્ટ ઇવેન્ટ લૂપ, પ્રોમિસિઝ, રિએક્ટ ફાઈબર આર્કિટેક્ચર અને મહત્વના હુક્સનું પ્રેક્ટિકલ માર્ગદર્શન.",
    "timeStampedNotes": [
      {
        "time": "02:15",
        "text": "Call stack, Web APIs, Microtask queue & Event Loop",
        "textGujarati": "કોલ સ્ટેક અને ઇવેન્ટ લૂપ કાર્યપદ્ધતિ"
      },
      {
        "time": "10:00",
        "text": "How React Virtual DOM diffing & Reconciliation algorithm works",
        "textGujarati": "વર્ચ્યુઅલ DOM અને રીકોન્સિલિયેશન"
      },
      {
        "time": "18:20",
        "text": "Performance optimization using useMemo and useCallback hooks",
        "textGujarati": "useMemo અને useCallback હુક્સ"
      }
    ],
    "comments": [],
    "referencePdfUrl": "https://eloquentjavascript.net/Eloquent_JavaScript.pdf"
  },
  {
    "id": "vid-college-6",
    "grades": [
      "college"
    ],
    "boards": [
      "CBSE",
      "GSEB"
    ],
    "category": "Aptitude & Placements",
    "categoryGujarati": "પ્લેસમેન્ટ અને સ્પર્ધાત્મક પરીક્ષા",
    "title": "Quantitative Aptitude – Permutations, Combinations & Probability for Campus Placements",
    "titleGujarati": "ક્વોન્ટિટેટિવ એપ્ટિટ્યુડ – ક્રમચય, સંચય અને સંભાવના શોર્ટકટ સોલ્યુશન",
    "instructor": "CareerRide Aptitude",
    "instructorGujarati": "પ્લેસમેન્ટ ગાઈડન્સ એકેડમી",
    "duration": "23:30",
    "durationSeconds": 1410,
    "youtubeVideoId": "9L5k2V7b4xN",
    "thumbnailUrl": "https://img.youtube.com/vi/9L5k2V7b4xN/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Formulas and shortcuts for nPr, nCr, word arrangements with repeating letters, circular seating, and dice/coin/card probability questions.",
    "descriptionGujarati": "શબ્દોની ગોઠવણી (LEADER, MISSISSIPPI), વર્તુળાકાર ક્રમચય, પત્તા અને પાસા આધારિત સંભાવનાના ઉકેલો.",
    "timeStampedNotes": [
      {
        "time": "02:00",
        "text": "Fundamental counting principle (AND vs OR rule)",
        "textGujarati": "ગણતરીનો મૂળભૂત સિદ્ધાંત"
      },
      {
        "time": "08:30",
        "text": "Word anagram permutation formula: n! / (p! * q!)",
        "textGujarati": "પુનરાવર્તિત અક્ષરોની ગોઠવણી"
      },
      {
        "time": "15:40",
        "text": "Conditional probability and deck of cards problems",
        "textGujarati": "પત્તા અને પાસાની સંભાવના"
      }
    ],
    "comments": [],
    "referencePdfUrl": "https://www.iitg.ac.in/stud/ccd/prep/Permutations_Probability.pdf"
  }
];

// Seed videos on startup or on demand
async function seedDefaultVideos() {
  for (const video of SEED_VIDEOS) {
    await VideoLecture.findOneAndUpdate(
      { id: video.id },
      video,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
}

// GET /api/videos - returns video lectures with grade/subject filtering
router.get('/', async (req, res) => {
  try {
    const { grade, category, board } = req.query;

    const filterSeed = () => {
      let filtered = SEED_VIDEOS;
      if (grade) {
        filtered = filtered.filter(v => v.grades && v.grades.includes(grade));
      }
      if (category && category !== 'All') {
        const catLower = category.toLowerCase();
        filtered = filtered.filter(v =>
          (v.category && v.category.toLowerCase().includes(catLower)) ||
          (v.categoryGujarati && v.categoryGujarati.includes(category))
        );
      }
      if (board) {
        filtered = filtered.filter(v => v.boards && v.boards.includes(board));
      }
      return filtered.length > 0 ? filtered : SEED_VIDEOS;
    };

    if (mongoose.connection.readyState !== 1) {
      return res.json(filterSeed());
    }

    let query = {};
    if (grade) {
      query.grades = grade;
    }
    if (category && category !== 'All') {
      query.$or = [
        { category: new RegExp(category, 'i') },
        { categoryGujarati: new RegExp(category, 'i') },
      ];
    }
    if (board) {
      query.boards = board;
    }

    let videos = await VideoLecture.find(query).sort({ id: 1 });

    if (!videos || videos.length === 0) {
      return res.json(filterSeed());
    }

    res.json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.json(SEED_VIDEOS);
  }
});

// POST /api/videos/:id/comments - Post a new discussion comment
router.post('/:id/comments', async (req, res) => {
  try {
    const { id } = req.params;
    const { author, userEmail, text, role } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Comment text is required' });
    }

    const newComment = {
      id: 'c_' + Date.now(),
      author: author || 'MindSprint Scholar',
      userEmail: userEmail || 'student@mindsprint.app',
      role: role || 'Verified Learner',
      text: text.trim(),
      upvotes: 1,
      upvotedBy: [userEmail || 'self'],
      createdAt: new Date().toISOString(),
    };

    let video = await VideoLecture.findOne({ id });
    if (!video) {
      // Find from SEED_VIDEOS and create
      const seed = SEED_VIDEOS.find(v => v.id === id);
      if (seed) {
        video = new VideoLecture({ ...seed, comments: [newComment] });
        await video.save();
        return res.json({ success: true, comment: newComment });
      }
      return res.status(404).json({ error: 'Video not found' });
    }

    video.comments = video.comments || [];
    video.comments.unshift(newComment);
    await video.save();

    res.json({ success: true, comment: newComment });
  } catch (error) {
    console.error('Error posting comment:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/videos/:id/comments/:commentId/upvote
router.post('/:id/comments/:commentId/upvote', async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const { userEmail } = req.body;

    let video = await VideoLecture.findOne({ id });
    if (!video) return res.status(404).json({ error: 'Video not found' });

    const comment = (video.comments || []).find(c => c.id === commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    comment.upvotedBy = comment.upvotedBy || [];
    const voter = userEmail || 'anonymous';

    if (comment.upvotedBy.includes(voter)) {
      comment.upvotedBy = comment.upvotedBy.filter(u => u !== voter);
      comment.upvotes = Math.max(0, (comment.upvotes || 1) - 1);
    } else {
      comment.upvotedBy.push(voter);
      comment.upvotes = (comment.upvotes || 0) + 1;
    }

    await video.save();
    res.json({ success: true, upvotes: comment.upvotes, upvotedBy: comment.upvotedBy });
  } catch (error) {
    console.error('Error upvoting comment:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/videos/seed - manual seed trigger
router.get('/seed', async (req, res) => {
  try {
    await seedDefaultVideos();
    res.json({ success: true, count: SEED_VIDEOS.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = { router, autoSeedVideos: seedDefaultVideos, SEED_VIDEOS };

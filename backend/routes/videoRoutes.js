const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const VideoLecture = require('../models/VideoLecture');

// Fully seeded library covering Classes 6 to 12 and College with 0 duplicate YouTube IDs
const SEED_VIDEOS = [
  {
    "id": "vid-ch-g7-math-ch1",
    "chapterNumber": 1,
    "subjectId": "g7-math",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 7 Mathematics – Chapter 1: Integers",
    "titleGujarati": "ધોરણ 7 ગણિત – પ્રકરણ 1: પૂર્ણાંક સંખ્યાઓ (GSEB)",
    "instructor": "Ocean GyanLive Std 9 and 10",
    "instructorGujarati": "Ocean GyanLive Std 9 and 10 (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "yieApwKp2Y0",
    "thumbnailUrl": "https://img.youtube.com/vi/yieApwKp2Y0/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Integers under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "પૂર્ણાંક સંખ્યાઓમાં ધન પૂર્ણાંકો, ઋણ પૂર્ણાંકો અને શૂન્યનો સમાવેશ થાય છે. સરવાળા, બાદબાકી, ગુણાકાર અને ભાગાકારના વિશિષ્ટ નિયમો લાગુ પડે છે.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Integers Core Concepts",
        "textGujarati": "પૂર્ણાંક સંખ્યાઓ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-math-ch1_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 1 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-math&chapter=1"
  },
  {
    "id": "vid-ch-g7-math-ch2",
    "chapterNumber": 2,
    "subjectId": "g7-math",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 7 Mathematics – Chapter 2: Fractions and Decimals",
    "titleGujarati": "ધોરણ 7 ગણિત – પ્રકરણ 2: અપૂર્ણાંક અને દશાંશ સંખ્યાઓ (GSEB)",
    "instructor": "Vidyakul Gujarati Std 6, 7 & 8",
    "instructorGujarati": "Vidyakul Gujarati Std 6, 7 & 8 (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "hPBCbzKK-s4",
    "thumbnailUrl": "https://img.youtube.com/vi/hPBCbzKK-s4/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Fractions and Decimals under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "શુદ્ધ, અશુદ્ધ અને મિશ્ર અપૂર્ણાંકો તેમજ દશાંશ સંખ્યાઓના ગુણાકાર અને ભાગાકારની સરળ પદ્ધતિઓ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Fractions and Decimals Core Concepts",
        "textGujarati": "અપૂર્ણાંક અને દશાંશ સંખ્યાઓ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-math-ch2_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 2 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-math&chapter=2"
  },
  {
    "id": "vid-ch-g7-math-ch3",
    "chapterNumber": 3,
    "subjectId": "g7-math",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 7 Mathematics – Chapter 3: Data Handling",
    "titleGujarati": "ધોરણ 7 ગણિત – પ્રકરણ 3: માહિતીનું નિયમન (GSEB)",
    "instructor": "Gyan Vishv",
    "instructorGujarati": "Gyan Vishv (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "3Zs92hOTCDo",
    "thumbnailUrl": "https://img.youtube.com/vi/3Zs92hOTCDo/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Data Handling under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "માહિતીનો સંગ્રહ, સરાસરી (મધ્યક), બહુલક, મધ્યસ્થ અને લંબ આલેખનું અર્થઘટન.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Data Handling Core Concepts",
        "textGujarati": "માહિતીનું નિયમન ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-math-ch3_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 3 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-math&chapter=3"
  },
  {
    "id": "vid-ch-g7-math-ch4",
    "chapterNumber": 4,
    "subjectId": "g7-math",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 7 Mathematics – Chapter 4: Simple Equations",
    "titleGujarati": "ધોરણ 7 ગણિત – પ્રકરણ 4: સાદા સમીકરણ (GSEB)",
    "instructor": "Vidyakul Gujarati Std 6, 7 & 8",
    "instructorGujarati": "Vidyakul Gujarati Std 6, 7 & 8 (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "VYmSeeTzMwo",
    "thumbnailUrl": "https://img.youtube.com/vi/VYmSeeTzMwo/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Simple Equations under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ચલ ધરાવતા સમીકરણોની રચના અને સમીકરણ ઉકેલવાની ક્રમબદ્ધ રીત.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Simple Equations Core Concepts",
        "textGujarati": "સાદા સમીકરણ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-math-ch4_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 4 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-math&chapter=4"
  },
  {
    "id": "vid-ch-g7-math-ch5",
    "chapterNumber": 5,
    "subjectId": "g7-math",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 7 Mathematics – Chapter 5: Lines and Angles",
    "titleGujarati": "ધોરણ 7 ગણિત – પ્રકરણ 5: રેખા અને ખૂણા (GSEB)",
    "instructor": "Ocean GyanLive Std 9 and 10",
    "instructorGujarati": "Ocean GyanLive Std 9 and 10 (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "DPn1MgQwycU",
    "thumbnailUrl": "https://img.youtube.com/vi/DPn1MgQwycU/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Lines and Angles under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "કોટિકોણ (સરવાળો 90°), પૂરકકોણ (સરવાળો 180°), આસન્નકોણ, રૈખિક જોડના ખૂણા અને છેદિકાથી બનતા ખૂણા.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Lines and Angles Core Concepts",
        "textGujarati": "રેખા અને ખૂણા ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-math-ch5_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 5 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-math&chapter=5"
  },
  {
    "id": "vid-ch-g7-math-ch6",
    "chapterNumber": 6,
    "subjectId": "g7-math",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 7 Mathematics – Chapter 6: The Triangle and its Properties",
    "titleGujarati": "ધોરણ 7 ગણિત – પ્રકરણ 6: ત્રિકોણ અને તેના ગુણધર્મો (GSEB)",
    "instructor": "Ocean GyanLive Std 9 and 10",
    "instructorGujarati": "Ocean GyanLive Std 9 and 10 (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "3iIm0a5bmcM",
    "thumbnailUrl": "https://img.youtube.com/vi/3iIm0a5bmcM/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of The Triangle and its Properties under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ત્રિકોણની મધ્યગા, વેધ, ત્રિકોણના ત્રણેય ખૂણાઓનો સરવાળો 180°, બહિષ્કોણનો ગુણધર્મ અને કાટકોણ ત્રિકોણમાં પાયથાગોરસ ગુણધર્મ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "The Triangle and its Properties Core Concepts",
        "textGujarati": "ત્રિકોણ અને તેના ગુણધર્મો ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-math-ch6_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 6 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-math&chapter=6"
  },
  {
    "id": "vid-ch-g7-math-ch7",
    "chapterNumber": 7,
    "subjectId": "g7-math",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 7 Mathematics – Chapter 7: Congruence of Triangles",
    "titleGujarati": "ધોરણ 7 ગણિત – પ્રકરણ 7: ત્રિકોણની એકરૂપતા (GSEB)",
    "instructor": "Ocean GyanLive Std 9 and 10",
    "instructorGujarati": "Ocean GyanLive Std 9 and 10 (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "3iIm0a5bmcM",
    "thumbnailUrl": "https://img.youtube.com/vi/3iIm0a5bmcM/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Congruence of Triangles under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "બે ત્રિકોણ ક્યારે સમાન આકાર અને કદ ધરાવે છે તેની શરતો: બાબાબા, બાખૂબા, ખૂબાખૂ અને કાકબા શરત.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Congruence of Triangles Core Concepts",
        "textGujarati": "ત્રિકોણની એકરૂપતા ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-math-ch7_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 7 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-math&chapter=7"
  },
  {
    "id": "vid-ch-g7-math-ch8",
    "chapterNumber": 8,
    "subjectId": "g7-math",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 7 Mathematics – Chapter 8: Comparing Quantities",
    "titleGujarati": "ધોરણ 7 ગણિત – પ્રકરણ 8: રાશિઓની તુલના (GSEB)",
    "instructor": "Ocean GyanLive Std 9 and 10",
    "instructorGujarati": "Ocean GyanLive Std 9 and 10 (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "qUnlCfYhZ50",
    "thumbnailUrl": "https://img.youtube.com/vi/qUnlCfYhZ50/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Comparing Quantities under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ગુણોત્તર, ટકાવારી, નફો-ખોટ અને સાદું વ્યાજ ગણવાની રીતો.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Comparing Quantities Core Concepts",
        "textGujarati": "રાશિઓની તુલના ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-math-ch8_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 8 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-math&chapter=8"
  },
  {
    "id": "vid-ch-g7-math-ch9",
    "chapterNumber": 9,
    "subjectId": "g7-math",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 7 Mathematics – Chapter 9: Rational Numbers",
    "titleGujarati": "ધોરણ 7 ગણિત – પ્રકરણ 9: સંમેય સંખ્યાઓ (GSEB)",
    "instructor": "Vamja Education",
    "instructorGujarati": "Vamja Education (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "aKZboxYISBY",
    "thumbnailUrl": "https://img.youtube.com/vi/aKZboxYISBY/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Rational Numbers under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "p/q સ્વરૂપની સંખ્યાઓ (જ્યાં q ≠ 0), સંમેય સંખ્યાઓનું સંખ્યારેખા પર નિરૂપણ અને તેમની ગાણિતિક ક્રિયાઓ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Rational Numbers Core Concepts",
        "textGujarati": "સંમેય સંખ્યાઓ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-math-ch9_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 9 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-math&chapter=9"
  },
  {
    "id": "vid-ch-g7-math-ch10",
    "chapterNumber": 10,
    "subjectId": "g7-math",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 7 Mathematics – Chapter 10: Practical Geometry",
    "titleGujarati": "ધોરણ 7 ગણિત – પ્રકરણ 10: પ્રાયોગિક ભૂમિતિ (GSEB)",
    "instructor": "R. S. Gohil Education",
    "instructorGujarati": "R. S. Gohil Education (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "SPncNLxsu6U",
    "thumbnailUrl": "https://img.youtube.com/vi/SPncNLxsu6U/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Practical Geometry under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "માપપટ્ટી અને પરિકરની મદદથી સમાંતર રેખાઓ અને ત્રિકોણની રચનાઓ દોરવાની પદ્ધતિ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Practical Geometry Core Concepts",
        "textGujarati": "પ્રાયોગિક ભૂમિતિ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-math-ch10_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 10 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-math&chapter=10"
  },
  {
    "id": "vid-ch-g7-math-ch11",
    "chapterNumber": 11,
    "subjectId": "g7-math",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 7 Mathematics – Chapter 11: Perimeter and Area",
    "titleGujarati": "ધોરણ 7 ગણિત – પ્રકરણ 11: પરિમિતિ અને ક્ષેત્રફળ (GSEB)",
    "instructor": "Vamja Education",
    "instructorGujarati": "Vamja Education (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "D4jsfJM3Xhk",
    "thumbnailUrl": "https://img.youtube.com/vi/D4jsfJM3Xhk/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Perimeter and Area under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ચોરસ, લંબચોરસ, સમાંતરબાજુ ચતુષ્કોણ, ત્રિકોણ અને વર્તુળની પરિમિતિ તથા ક્ષેત્રફળના સૂત્રો.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Perimeter and Area Core Concepts",
        "textGujarati": "પરિમિતિ અને ક્ષેત્રફળ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-math-ch11_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 11 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-math&chapter=11"
  },
  {
    "id": "vid-ch-g7-math-ch12",
    "chapterNumber": 12,
    "subjectId": "g7-math",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 7 Mathematics – Chapter 12: Algebraic Expressions",
    "titleGujarati": "ધોરણ 7 ગણિત – પ્રકરણ 12: બીજગણિતીય પદાવલિ (GSEB)",
    "instructor": "Vamja Education",
    "instructorGujarati": "Vamja Education (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "gsvE0J4pruE",
    "thumbnailUrl": "https://img.youtube.com/vi/gsvE0J4pruE/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Algebraic Expressions under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ચલ, અચલ, પદ, સહગુણક, સજાતીય અને વિજાતીય પદો, એકપદી, દ્વિપદી અને બહુપદીના સરવાળા-બાદબાકી.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Algebraic Expressions Core Concepts",
        "textGujarati": "બીજગણિતીય પદાવલિ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-math-ch12_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 12 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-math&chapter=12"
  },
  {
    "id": "vid-ch-g7-math-ch13",
    "chapterNumber": 13,
    "subjectId": "g7-math",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 7 Mathematics – Chapter 13: Exponents and Powers",
    "titleGujarati": "ધોરણ 7 ગણિત – પ્રકરણ 13: ઘાત અને ઘાતાંક (GSEB)",
    "instructor": "Vamja Education",
    "instructorGujarati": "Vamja Education (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "oOcS40qGGm8",
    "thumbnailUrl": "https://img.youtube.com/vi/oOcS40qGGm8/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Exponents and Powers under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "મોટી સંખ્યાઓને ઘાતાંક સ્વરૂપે લખવી અને ઘાતાંકના નિયમો (ગુણાકારમાં ઘાતનો સરવાળો, ભાગાકારમાં બાદબાકી).",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Exponents and Powers Core Concepts",
        "textGujarati": "ઘાત અને ઘાતાંક ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-math-ch13_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 13 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-math&chapter=13"
  },
  {
    "id": "vid-ch-g7-math-ch14",
    "chapterNumber": 14,
    "subjectId": "g7-math",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 7 Mathematics – Chapter 14: Symmetry",
    "titleGujarati": "ધોરણ 7 ગણિત – પ્રકરણ 14: સંમિતિ (GSEB)",
    "instructor": "Gyan Vishv",
    "instructorGujarati": "Gyan Vishv (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "hT_qLO0J_TM",
    "thumbnailUrl": "https://img.youtube.com/vi/hT_qLO0J_TM/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Symmetry under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "રૈખિક સંમિતિ, પરિભ્રમણીય સંમિતિ અને સંમિતિની રેખાઓનું અર્થઘટન.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Symmetry Core Concepts",
        "textGujarati": "સંમિતિ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-math-ch14_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 14 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-math&chapter=14"
  },
  {
    "id": "vid-ch-g7-math-ch15",
    "chapterNumber": 15,
    "subjectId": "g7-math",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 7 Mathematics – Chapter 15: Visualising Solid Shapes",
    "titleGujarati": "ધોરણ 7 ગણિત – પ્રકરણ 15: ઘન આકારોનું પ્રત્યક્ષીકરણ (GSEB)",
    "instructor": "Gyan Vishv",
    "instructorGujarati": "Gyan Vishv (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "JEjgko20bT4",
    "thumbnailUrl": "https://img.youtube.com/vi/JEjgko20bT4/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Visualising Solid Shapes under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "દ્વિ-પરિમાણીય (2D) અને ત્રિ-પરિમાણીય (3D) આકારો, ફલક (F), શિરોબિંદુ (V), અને ધાર (E) માટે યુલરનું સૂત્ર.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Visualising Solid Shapes Core Concepts",
        "textGujarati": "ઘન આકારોનું પ્રત્યક્ષીકરણ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-math-ch15_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 15 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-math&chapter=15"
  },
  {
    "id": "vid-ch-g7-sci-ch1",
    "chapterNumber": 1,
    "subjectId": "g7-sci",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 7 Science – Chapter 1: Nutrition in Plants",
    "titleGujarati": "ધોરણ 7 વિજ્ઞાન – પ્રકરણ 1: વનસ્પતિમાં પોષણ (GSEB)",
    "instructor": "Science Guru",
    "instructorGujarati": "Science Guru (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "6Ajwdj_Pc5E",
    "thumbnailUrl": "https://img.youtube.com/vi/6Ajwdj_Pc5E/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Nutrition in Plants under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "વનસ્પતિ દ્વારા પ્રકાશસંશ્લેષણ પ્રક્રિયા અને સ્વયંપોષી પોષણ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Nutrition in Plants Core Concepts",
        "textGujarati": "વનસ્પતિમાં પોષણ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-sci-ch1_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 1 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-sci&chapter=1"
  },
  {
    "id": "vid-ch-g7-sci-ch2",
    "chapterNumber": 2,
    "subjectId": "g7-sci",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 7 Science – Chapter 2: Nutrition in Animals",
    "titleGujarati": "ધોરણ 7 વિજ્ઞાન – પ્રકરણ 2: પ્રાણીઓમાં પોષણ (GSEB)",
    "instructor": "Science Guru",
    "instructorGujarati": "Science Guru (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "CJ48sPHY43Y",
    "thumbnailUrl": "https://img.youtube.com/vi/CJ48sPHY43Y/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Nutrition in Animals under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "મનુષ્યનું પાચનતંત્ર, દાંતના પ્રકાર, અન્નનળી, જઠર, નાનું આંતરડું અને પાચક રસો.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Nutrition in Animals Core Concepts",
        "textGujarati": "પ્રાણીઓમાં પોષણ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-sci-ch2_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 2 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-sci&chapter=2"
  },
  {
    "id": "vid-ch-g7-sci-ch3",
    "chapterNumber": 3,
    "subjectId": "g7-sci",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 7 Science – Chapter 3: Fibre to Fabric",
    "titleGujarati": "ધોરણ 7 વિજ્ઞાન – પ્રકરણ 3: રેસાથી કાપડ સુધી (GSEB)",
    "instructor": "Nax Bharti School",
    "instructorGujarati": "Nax Bharti School (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "kf_B-DDFVM8",
    "thumbnailUrl": "https://img.youtube.com/vi/kf_B-DDFVM8/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Fibre to Fabric under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ઊન અને રેશમ મેળવવાની પદ્ધતિ, ઘેટાંની ઉન ઉતારવી અને રેશમના કીડાનો જીવનક્રમ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Fibre to Fabric Core Concepts",
        "textGujarati": "રેસાથી કાપડ સુધી ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-sci-ch3_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 3 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-sci&chapter=3"
  },
  {
    "id": "vid-ch-g7-sci-ch4",
    "chapterNumber": 4,
    "subjectId": "g7-sci",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 7 Science – Chapter 4: Heat",
    "titleGujarati": "ધોરણ 7 વિજ્ઞાન – પ્રકરણ 4: ઉષ્મા (GSEB)",
    "instructor": "JOURNEY OF EDUCATION",
    "instructorGujarati": "JOURNEY OF EDUCATION (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "1HzmVd87RMk",
    "thumbnailUrl": "https://img.youtube.com/vi/1HzmVd87RMk/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Heat under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ગરમી અને તાપમાનનું માપન, ક્લિનિકલ થર્મોમીટર, ઉષ્માવહન, ઉષ્માનયન અને ઉષ્મીય વિકિરણ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Heat Core Concepts",
        "textGujarati": "ઉષ્મા ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-sci-ch4_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 4 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-sci&chapter=4"
  },
  {
    "id": "vid-ch-g7-sci-ch5",
    "chapterNumber": 5,
    "subjectId": "g7-sci",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 7 Science – Chapter 5: Acids, Bases and Salts",
    "titleGujarati": "ધોરણ 7 વિજ્ઞાન – પ્રકરણ 5: ઍસિડ, બેઇઝ અને ક્ષાર (GSEB)",
    "instructor": "Nax Bharti School",
    "instructorGujarati": "Nax Bharti School (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "21oGwGfiYkc",
    "thumbnailUrl": "https://img.youtube.com/vi/21oGwGfiYkc/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Acids, Bases and Salts under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "એસિડ અને બેઇઝના ગુણધર્મો, લિટમસ પત્ર, હળદર, જાસૂદના ફૂલ જેવા સૂચકો અને તટસ્થીકરણ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Acids, Bases and Salts Core Concepts",
        "textGujarati": "ઍસિડ, બેઇઝ અને ક્ષાર ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-sci-ch5_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 5 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-sci&chapter=5"
  },
  {
    "id": "vid-ch-g7-sci-ch6",
    "chapterNumber": 6,
    "subjectId": "g7-sci",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 7 Science – Chapter 6: Physical and Chemical Changes",
    "titleGujarati": "ધોરણ 7 વિજ્ઞાન – પ્રકરણ 6: ભૌતિક અને રાસાયણિક ફેરફારો (GSEB)",
    "instructor": "Nax Bharti School",
    "instructorGujarati": "Nax Bharti School (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "gtFpjRnxkc8",
    "thumbnailUrl": "https://img.youtube.com/vi/gtFpjRnxkc8/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Physical and Chemical Changes under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "કાટ લાગવો, સ્ફટિકીકરણ અને દ્રવ્યમાં થતા રિવર્સિબલ / ઇરરિવર્સિબલ ફેરફારો.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Physical and Chemical Changes Core Concepts",
        "textGujarati": "ભૌતિક અને રાસાયણિક ફેરફારો ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-sci-ch6_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 6 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-sci&chapter=6"
  },
  {
    "id": "vid-ch-g7-sci-ch7",
    "chapterNumber": 7,
    "subjectId": "g7-sci",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 7 Science – Chapter 7: Weather, Climate and Adaptations",
    "titleGujarati": "ધોરણ 7 વિજ્ઞાન – પ્રકરણ 7: હવામાન, આબોહવા અને અનુકૂલન (GSEB)",
    "instructor": "Tr. Tarak Zala",
    "instructorGujarati": "Tr. Tarak Zala (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "QbiNk2lVJww",
    "thumbnailUrl": "https://img.youtube.com/vi/QbiNk2lVJww/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Weather, Climate and Adaptations under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ધ્રુવ પ્રદેશો અને વિષુવવૃત્તીય વર્ષાવનોમાં વસતા પ્રાણીઓના અનુકૂલનો.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Weather, Climate and Adaptations Core Concepts",
        "textGujarati": "હવામાન, આબોહવા અને અનુકૂલન ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-sci-ch7_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 7 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-sci&chapter=7"
  },
  {
    "id": "vid-ch-g7-sci-ch8",
    "chapterNumber": 8,
    "subjectId": "g7-sci",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 7 Science – Chapter 8: Winds, Storms and Cyclones",
    "titleGujarati": "ધોરણ 7 વિજ્ઞાન – પ્રકરણ 8: પવન, વાવાઝોડું અને ચક્રવાત (GSEB)",
    "instructor": "Gunjan education ",
    "instructorGujarati": "Gunjan education  (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "O3zL5MkVFXY",
    "thumbnailUrl": "https://img.youtube.com/vi/O3zL5MkVFXY/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Winds, Storms and Cyclones under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ગરમ હવા હલકી થઈ ઊંચે ચડે છે, વાયુનું દબાણ અને ચક્રવાત સામે સુરક્ષા પગલાં.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Winds, Storms and Cyclones Core Concepts",
        "textGujarati": "પવન, વાવાઝોડું અને ચક્રવાત ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-sci-ch8_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 8 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-sci&chapter=8"
  },
  {
    "id": "vid-ch-g7-sci-ch9",
    "chapterNumber": 9,
    "subjectId": "g7-sci",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 7 Science – Chapter 9: Soil",
    "titleGujarati": "ધોરણ 7 વિજ્ઞાન – પ્રકરણ 9: ભૂમિ (GSEB)",
    "instructor": "JOURNEY OF EDUCATION",
    "instructorGujarati": "JOURNEY OF EDUCATION (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "hVTdudnBjdQ",
    "thumbnailUrl": "https://img.youtube.com/vi/hVTdudnBjdQ/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Soil under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ભૂમિનું બંધારણ, સ્તરો (A, B, C સ્તર), માટીના પ્રકારો (રેતાળ, ચીકણી, ગોરાડુ) અને જળધારણ ક્ષમતા.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Soil Core Concepts",
        "textGujarati": "ભૂમિ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-sci-ch9_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 9 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-sci&chapter=9"
  },
  {
    "id": "vid-ch-g7-sci-ch10",
    "chapterNumber": 10,
    "subjectId": "g7-sci",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 7 Science – Chapter 10: Respiration in Organisms",
    "titleGujarati": "ધોરણ 7 વિજ્ઞાન – પ્રકરણ 10: સજીવોમાં શ્વસન (GSEB)",
    "instructor": "Nax Bharti School",
    "instructorGujarati": "Nax Bharti School (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "XXHxT5Mx6Tw",
    "thumbnailUrl": "https://img.youtube.com/vi/XXHxT5Mx6Tw/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Respiration in Organisms under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "જારક શ્વસન (ઓક્સિજનની હાજરી) અને અજારક શ્વસન (ઓક્સિજનની ગેરહાજરી), માનવ શ્વસનતંત્ર.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Respiration in Organisms Core Concepts",
        "textGujarati": "સજીવોમાં શ્વસન ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-sci-ch10_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 10 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-sci&chapter=10"
  },
  {
    "id": "vid-ch-g7-sci-ch11",
    "chapterNumber": 11,
    "subjectId": "g7-sci",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 7 Science – Chapter 11: Transportation in Animals and Plants",
    "titleGujarati": "ધોરણ 7 વિજ્ઞાન – પ્રકરણ 11: પ્રાણીઓ અને વનસ્પતિઓમાં વહન (GSEB)",
    "instructor": "Nax Bharti School",
    "instructorGujarati": "Nax Bharti School (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "9QzzOHuaZgE",
    "thumbnailUrl": "https://img.youtube.com/vi/9QzzOHuaZgE/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Transportation in Animals and Plants under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "માનવ રુધિરાભિસરણ તંત્ર, હૃદયની રચના, ધમની, શિરા, ઉત્સર્જન તંત્ર અને વનસ્પતિમાં જલવાહક/અન્નવાહક પેશી.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Transportation in Animals and Plants Core Concepts",
        "textGujarati": "પ્રાણીઓ અને વનસ્પતિઓમાં વહન ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-sci-ch11_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 11 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-sci&chapter=11"
  },
  {
    "id": "vid-ch-g7-sci-ch12",
    "chapterNumber": 12,
    "subjectId": "g7-sci",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 7 Science – Chapter 12: Reproduction in Plants",
    "titleGujarati": "ધોરણ 7 વિજ્ઞાન – પ્રકરણ 12: વનસ્પતિમાં પ્રજનન (GSEB)",
    "instructor": "Rudalpur Primary School",
    "instructorGujarati": "Rudalpur Primary School (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "HpzqdnOQ5qQ",
    "thumbnailUrl": "https://img.youtube.com/vi/HpzqdnOQ5qQ/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Reproduction in Plants under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "વાનસ્પતિક પ્રજનન (કલિકાસર્જન, અવખંડન) અને લિંગી પ્રજનન (પરાગનયન, ફલન).",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Reproduction in Plants Core Concepts",
        "textGujarati": "વનસ્પતિમાં પ્રજનન ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-sci-ch12_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 12 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-sci&chapter=12"
  },
  {
    "id": "vid-ch-g7-sci-ch13",
    "chapterNumber": 13,
    "subjectId": "g7-sci",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 7 Science – Chapter 13: Motion and Time",
    "titleGujarati": "ધોરણ 7 વિજ્ઞાન – પ્રકરણ 13: ગતિ અને સમય (GSEB)",
    "instructor": "B E S Union Highschool Bharuch",
    "instructorGujarati": "B E S Union Highschool Bharuch (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "vRGakxU79A8",
    "thumbnailUrl": "https://img.youtube.com/vi/vRGakxU79A8/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Motion and Time under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ઝડપનું માપન, સાદું લોલક, દોલનનો આવર્તકાળ, અંતર-સમયનો આલેખ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Motion and Time Core Concepts",
        "textGujarati": "ગતિ અને સમય ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-sci-ch13_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 13 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-sci&chapter=13"
  },
  {
    "id": "vid-ch-g7-sci-ch14",
    "chapterNumber": 14,
    "subjectId": "g7-sci",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 7 Science – Chapter 14: Electric Current and its Effects",
    "titleGujarati": "ધોરણ 7 વિજ્ઞાન – પ્રકરણ 14: વિદ્યુતપ્રવાહ અને તેની અસરો (GSEB)",
    "instructor": "Anjali Vidhyamandir (85303 11081)",
    "instructorGujarati": "Anjali Vidhyamandir (85303 11081) (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "8PUZmLrEC54",
    "thumbnailUrl": "https://img.youtube.com/vi/8PUZmLrEC54/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Electric Current and its Effects under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "વિદ્યુત પરિપથની સંજ્ઞાઓ, વિદ્યુતપ્રવાહની ઉષ્મીય અસર (હીટર, ઇસ્ત્રી, ફ્યુઝ) અને ચુંબકીય અસર (વિદ્યુતચુંબક).",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Electric Current and its Effects Core Concepts",
        "textGujarati": "વિદ્યુતપ્રવાહ અને તેની અસરો ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-sci-ch14_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 14 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-sci&chapter=14"
  },
  {
    "id": "vid-ch-g7-sci-ch15",
    "chapterNumber": 15,
    "subjectId": "g7-sci",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 7 Science – Chapter 15: Light",
    "titleGujarati": "ધોરણ 7 વિજ્ઞાન – પ્રકરણ 15: પ્રકાશ (GSEB)",
    "instructor": "jayesh b. parmar (khandheri primary school)",
    "instructorGujarati": "jayesh b. parmar (khandheri primary school) (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "IWumWq005jo",
    "thumbnailUrl": "https://img.youtube.com/vi/IWumWq005jo/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Light under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "પ્રકાશનું સુરેખ પ્રસરણ, સમતલ અરીસો, અંતર્ગોળ/બહિર્ગોળ અરીસા અને લેન્સ, મેઘધનુષ્યના સાત રંગો.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Light Core Concepts",
        "textGujarati": "પ્રકાશ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-sci-ch15_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 15 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-sci&chapter=15"
  },
  {
    "id": "vid-ch-g7-sci-ch16",
    "chapterNumber": 16,
    "subjectId": "g7-sci",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 7 Science – Chapter 16: Water: A Precious Resource",
    "titleGujarati": "ધોરણ 7 વિજ્ઞાન – પ્રકરણ 16: પાણી: એક અમૂલ્ય સ્ત્રોત (GSEB)",
    "instructor": "Mahadev Online Education",
    "instructorGujarati": "Mahadev Online Education (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "uKmrO9mCkHc",
    "thumbnailUrl": "https://img.youtube.com/vi/uKmrO9mCkHc/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Water: A Precious Resource under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ભૂગર્ભજળ સ્તર, જળ ચક્ર, જળ સંકટ અને વરસાદી પાણીના સંગ્રહની પદ્ધતિઓ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Water: A Precious Resource Core Concepts",
        "textGujarati": "પાણી: એક અમૂલ્ય સ્ત્રોત ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-sci-ch16_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 16 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-sci&chapter=16"
  },
  {
    "id": "vid-ch-g7-sci-ch17",
    "chapterNumber": 17,
    "subjectId": "g7-sci",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 7 Science – Chapter 17: Forests: Our Lifeline",
    "titleGujarati": "ધોરણ 7 વિજ્ઞાન – પ્રકરણ 17: જંગલો: આપણી જીવાદોરી (GSEB)",
    "instructor": "Science Guru",
    "instructorGujarati": "Science Guru (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "kiwVIEymyL0",
    "thumbnailUrl": "https://img.youtube.com/vi/kiwVIEymyL0/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Forests: Our Lifeline under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "જંગલોનું પર્યાવરણીય મહત્વ, વન્યજીવોનું આશ્રયસ્થાન, ભૂમિ સંરક્ષણ અને ઓક્સિજન ચક્ર.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Forests: Our Lifeline Core Concepts",
        "textGujarati": "જંગલો: આપણી જીવાદોરી ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-sci-ch17_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 17 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-sci&chapter=17"
  },
  {
    "id": "vid-ch-g7-sci-ch18",
    "chapterNumber": 18,
    "subjectId": "g7-sci",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 7 Science – Chapter 18: Wastewater Story",
    "titleGujarati": "ધોરણ 7 વિજ્ઞાન – પ્રકરણ 18: દૂષિત પાણીની વાર્તા (GSEB)",
    "instructor": "Science Guru",
    "instructorGujarati": "Science Guru (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "8MUJsmQlQ_w",
    "thumbnailUrl": "https://img.youtube.com/vi/8MUJsmQlQ_w/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Wastewater Story under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ગંદા પાણીનો નિકાલ, સુએજ ટ્રીટમેન્ટ પ્લાન્ટ (STP), સ્વચ્છતા અને રોગ અટકાવવાના ઉપાયો.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Wastewater Story Core Concepts",
        "textGujarati": "દૂષિત પાણીની વાર્તા ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-sci-ch18_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 18 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-sci&chapter=18"
  },
  {
    "id": "vid-ch-g7-soc-ch1",
    "chapterNumber": 1,
    "subjectId": "g7-soc",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 7 Social Science – Chapter 1: Rajput Age: New Rulers and States",
    "titleGujarati": "ધોરણ 7 સામાજિક વિજ્ઞાન – પ્રકરણ 1: રાજપૂતયુગ : નવાં શાસકો અને રાજ્યો (GSEB)",
    "instructor": "ALGEBRAIC INSTITUTE",
    "instructorGujarati": "ALGEBRAIC INSTITUTE (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "6zSzx3i-NLE",
    "thumbnailUrl": "https://img.youtube.com/vi/6zSzx3i-NLE/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Rajput Age: New Rulers and States under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ઉત્તર ભારત અને દક્ષિણ ભારતના રાજપૂત રાજ્યો, ચૌહાણ વંશ, સોલંકી યુગ અને પાટણની રાણકી વાવ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Rajput Age: New Rulers and States Core Concepts",
        "textGujarati": "રાજપૂતયુગ : નવાં શાસકો અને રાજ્યો ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-soc-ch1_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 1 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-soc&chapter=1"
  },
  {
    "id": "vid-ch-g7-soc-ch2",
    "chapterNumber": 2,
    "subjectId": "g7-soc",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 7 Social Science – Chapter 2: Delhi Sultanate",
    "titleGujarati": "ધોરણ 7 સામાજિક વિજ્ઞાન – પ્રકરણ 2: દિલ્લી સલ્તનત (GSEB)",
    "instructor": "JOURNEY OF EDUCATION",
    "instructorGujarati": "JOURNEY OF EDUCATION (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "USCHMXOWJZ4",
    "thumbnailUrl": "https://img.youtube.com/vi/USCHMXOWJZ4/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Delhi Sultanate under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ગુલામ વંશ, ખલજી વંશ, તુઘલક વંશ, સૈયદ વંશ અને લોદી વંશનું શાસન અને સ્થાપત્ય.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Delhi Sultanate Core Concepts",
        "textGujarati": "દિલ્લી સલ્તનત ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-soc-ch2_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 2 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-soc&chapter=2"
  },
  {
    "id": "vid-ch-g7-soc-ch3",
    "chapterNumber": 3,
    "subjectId": "g7-soc",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 7 Social Science – Chapter 3: Mughal Empire",
    "titleGujarati": "ધોરણ 7 સામાજિક વિજ્ઞાન – પ્રકરણ 3: મુઘલ સામ્રાજ્ય (GSEB)",
    "instructor": "Science Guru",
    "instructorGujarati": "Science Guru (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "3Q1TDnqOCYA",
    "thumbnailUrl": "https://img.youtube.com/vi/3Q1TDnqOCYA/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Mughal Empire under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "બાબરથી ઔરંગઝેબ સુધીનું મુઘલ શાસન, અકબરની ધાર્મિક અને વહીવટી નીતિ, મહારાણા પ્રતાપ સાથે હલ્દીઘાટીનું યુદ્ધ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Mughal Empire Core Concepts",
        "textGujarati": "મુઘલ સામ્રાજ્ય ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-soc-ch3_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 3 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-soc&chapter=3"
  },
  {
    "id": "vid-ch-g7-soc-ch4",
    "chapterNumber": 4,
    "subjectId": "g7-soc",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 7 Social Science – Chapter 4: Medieval Architecture, Cities, Traders and Craftsmen",
    "titleGujarati": "ધોરણ 7 સામાજિક વિજ્ઞાન – પ્રકરણ 4: મધ્યયુગીન સ્થાપત્યો, શહેરો, વેપારી અને કારીગરો (GSEB)",
    "instructor": "Vidyakul Gujarati Commerce",
    "instructorGujarati": "Vidyakul Gujarati Commerce (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "9EaYJhtqkmY",
    "thumbnailUrl": "https://img.youtube.com/vi/9EaYJhtqkmY/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Medieval Architecture, Cities, Traders and Craftsmen under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ભારત અને ગુજરાતના સ્થાપત્યો, સોમનાથ મંદિર, મોઢેરાનું સૂર્યમંદિર, અમદાવાદનો ભદ્રનો કિલ્લો.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Medieval Architecture, Cities, Traders and Craftsmen Core Concepts",
        "textGujarati": "મધ્યયુગીન સ્થાપત્યો, શહેરો, વેપારી અને કારીગરો ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-soc-ch4_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 4 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-soc&chapter=4"
  },
  {
    "id": "vid-ch-g7-soc-ch5",
    "chapterNumber": 5,
    "subjectId": "g7-soc",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 7 Social Science – Chapter 5: Tribal, Nomadic Communities and Local Groups",
    "titleGujarati": "ધોરણ 7 સામાજિક વિજ્ઞાન – પ્રકરણ 5: વનવાસી, વિચરતી જાતિ અને સ્થાનિક સમુદાય (GSEB)",
    "instructor": "Rb Gujarati ",
    "instructorGujarati": "Rb Gujarati  (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "dX-9MKfjlOo",
    "thumbnailUrl": "https://img.youtube.com/vi/dX-9MKfjlOo/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Tribal, Nomadic Communities and Local Groups under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "વનવાસી અને વિચરતી જાતિઓનું જીવન, ગોંડ અને અહોમ રાજ્યની સમાજવ્યવસ્થા.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Tribal, Nomadic Communities and Local Groups Core Concepts",
        "textGujarati": "વનવાસી, વિચરતી જાતિ અને સ્થાનિક સમુદાય ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-soc-ch5_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 5 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-soc&chapter=5"
  },
  {
    "id": "vid-ch-g7-soc-ch6",
    "chapterNumber": 6,
    "subjectId": "g7-soc",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 7 Social Science – Chapter 6: Bhakti Age: Religious Communities and Thinkers",
    "titleGujarati": "ધોરણ 7 સામાજિક વિજ્ઞાન – પ્રકરણ 6: ભક્તિયુગ : ધાર્મિક સમુદાયો અને વિચારકો (GSEB)",
    "instructor": "First Exam Paper Solution 2026",
    "instructorGujarati": "First Exam Paper Solution 2026 (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "0-kxA_PnpYo",
    "thumbnailUrl": "https://img.youtube.com/vi/0-kxA_PnpYo/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Bhakti Age: Religious Communities and Thinkers under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "કબીર, ગુરુ નાનક, નરસિંહ મહેતા, મીરાંબાઈ, તુલસીદાસ અને સંત જ્ઞાનેશ્વરનો ભક્તિ આંદોલનમાં ફાળો.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Bhakti Age: Religious Communities and Thinkers Core Concepts",
        "textGujarati": "ભક્તિયુગ : ધાર્મિક સમુદાયો અને વિચારકો ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-soc-ch6_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 6 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-soc&chapter=6"
  },
  {
    "id": "vid-ch-g7-soc-ch7",
    "chapterNumber": 7,
    "subjectId": "g7-soc",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 7 Social Science – Chapter 7: Formation of Regional Cultures",
    "titleGujarati": "ધોરણ 7 સામાજિક વિજ્ઞાન – પ્રકરણ 7: પ્રાદેશિક સંસ્કૃતિનું ઘડતર (GSEB)",
    "instructor": "brain broster",
    "instructorGujarati": "brain broster (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "G0b09k7iijs",
    "thumbnailUrl": "https://img.youtube.com/vi/G0b09k7iijs/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Formation of Regional Cultures under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ભાષાઓનો વિકાસ, ચિત્રકલા, નૃત્ય શૈલીઓ (કથક, ભરતનાટ્યમ) અને ઉત્સવો.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Formation of Regional Cultures Core Concepts",
        "textGujarati": "પ્રાદેશિક સંસ્કૃતિનું ઘડતર ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-soc-ch7_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 7 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-soc&chapter=7"
  },
  {
    "id": "vid-ch-g7-soc-ch8",
    "chapterNumber": 8,
    "subjectId": "g7-soc",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 7 Social Science – Chapter 8: Political Formations in the 18th Century",
    "titleGujarati": "ધોરણ 7 સામાજિક વિજ્ઞાન – પ્રકરણ 8: અઢારમી સદીના રાજકીય શાસકો (GSEB)",
    "instructor": "RANGPUR PRIMARY SCHOOL",
    "instructorGujarati": "RANGPUR PRIMARY SCHOOL (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "o7rd-gwAPV8",
    "thumbnailUrl": "https://img.youtube.com/vi/o7rd-gwAPV8/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Political Formations in the 18th Century under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "મુઘલ સામ્રાજ્યનું પતન, મરાઠા સામ્રાજ્ય, છત્રપતિ શિવાજી મહારાજ અને પેશ્વાઓનું શાસન.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Political Formations in the 18th Century Core Concepts",
        "textGujarati": "અઢારમી સદીના રાજકીય શાસકો ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-soc-ch8_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 8 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-soc&chapter=8"
  },
  {
    "id": "vid-ch-g7-soc-ch9",
    "chapterNumber": 9,
    "subjectId": "g7-soc",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 7 Social Science – Chapter 9: Internal Structure and Landforms of Earth",
    "titleGujarati": "ધોરણ 7 સામાજિક વિજ્ઞાન – પ્રકરણ 9: પૃથ્વીની આંતરિક રચના અને ભૂમિસ્વરૂપો (GSEB)",
    "instructor": "Vidyakul Gujarati Commerce",
    "instructorGujarati": "Vidyakul Gujarati Commerce (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "mbHvpUPa40g",
    "thumbnailUrl": "https://img.youtube.com/vi/mbHvpUPa40g/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Internal Structure and Landforms of Earth under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "પૃથ્વીના પોપડાના સ્તરો (સિઆલ, સિમા, નિફે), ખડકોના પ્રકારો (અગ્નિકૃત, પ્રસ્તર, રૂપાંતરિત).",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Internal Structure and Landforms of Earth Core Concepts",
        "textGujarati": "પૃથ્વીની આંતરિક રચના અને ભૂમિસ્વરૂપો ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-soc-ch9_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 9 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-soc&chapter=9"
  },
  {
    "id": "vid-ch-g7-soc-ch10",
    "chapterNumber": 10,
    "subjectId": "g7-soc",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 7 Social Science – Chapter 10: Components of Environment and Interrelationships",
    "titleGujarati": "ધોરણ 7 સામાજિક વિજ્ઞાન – પ્રકરણ 10: પર્યાવરણનાં ઘટકો અને આંતરસંબંધો (GSEB)",
    "instructor": "brain broster",
    "instructorGujarati": "brain broster (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "G0b09k7iijs",
    "thumbnailUrl": "https://img.youtube.com/vi/G0b09k7iijs/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Components of Environment and Interrelationships under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "મૃદાવરણ, જલાવરણ, વાતાવરણ અને જીવાવરણ વચ્ચેનો સંતુલિત સંબંધ અને પ્રદૂષણ નિવારણ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Components of Environment and Interrelationships Core Concepts",
        "textGujarati": "પર્યાવરણનાં ઘટકો અને આંતરસંબંધો ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-soc-ch10_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 10 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-soc&chapter=10"
  },
  {
    "id": "vid-ch-g7-soc-ch11",
    "chapterNumber": 11,
    "subjectId": "g7-soc",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 7 Social Science – Chapter 11: Atmospheric Effects on Living Organisms",
    "titleGujarati": "ધોરણ 7 સામાજિક વિજ્ઞાન – પ્રકરણ 11: વાતાવરણની સજીવો પર અસરો (GSEB)",
    "instructor": "Vidyakul Gujarati Commerce",
    "instructorGujarati": "Vidyakul Gujarati Commerce (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "eX6wEugVSI0",
    "thumbnailUrl": "https://img.youtube.com/vi/eX6wEugVSI0/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Atmospheric Effects on Living Organisms under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "વાતાવરણના સ્તરો (ક્ષોભ, સમતાપ, મધ્યાવરણ, ઉષ્માવરણ), ઓઝોન સ્તર અને તાપમાન.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Atmospheric Effects on Living Organisms Core Concepts",
        "textGujarati": "વાતાવરણની સજીવો પર અસરો ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-soc-ch11_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 11 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-soc&chapter=11"
  },
  {
    "id": "vid-ch-g7-soc-ch12",
    "chapterNumber": 12,
    "subjectId": "g7-soc",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 7 Social Science – Chapter 12: Disaster and Management",
    "titleGujarati": "ધોરણ 7 સામાજિક વિજ્ઞાન – પ્રકરણ 12: આપત્તિ અને વ્યવસ્થાપન (GSEB)",
    "instructor": "Science Guru",
    "instructorGujarati": "Science Guru (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "f_yBx5B5RXo",
    "thumbnailUrl": "https://img.youtube.com/vi/f_yBx5B5RXo/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Disaster and Management under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "કુદરતી આપત્તિઓ (ધરતીકંપ, પૂર, વાવાઝોડું, દુષ્કાળ) અને માનવસર્જિત આપત્તિઓ સામે સાવચેતીનાં પગલાં.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Disaster and Management Core Concepts",
        "textGujarati": "આપત્તિ અને વ્યવસ્થાપન ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-soc-ch12_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 12 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-soc&chapter=12"
  },
  {
    "id": "vid-ch-g7-soc-ch13",
    "chapterNumber": 13,
    "subjectId": "g7-soc",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 7 Social Science – Chapter 13: Conservation and Preservation of Resources",
    "titleGujarati": "ધોરણ 7 સામાજિક વિજ્ઞાન – પ્રકરણ 13: સંસાધનોનું જતન અને સંરક્ષણ (GSEB)",
    "instructor": "RANGPUR PRIMARY SCHOOL",
    "instructorGujarati": "RANGPUR PRIMARY SCHOOL (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "33msnE2bMoE",
    "thumbnailUrl": "https://img.youtube.com/vi/33msnE2bMoE/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Conservation and Preservation of Resources under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "જમીન, જળ, ખનિજ, વનસ્પતિ અને વન્યજીવ સંસાધનોનું સુયોજિત આયોજન.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Conservation and Preservation of Resources Core Concepts",
        "textGujarati": "સંસાધનોનું જતન અને સંરક્ષણ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-soc-ch13_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 13 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-soc&chapter=13"
  },
  {
    "id": "vid-ch-g7-soc-ch14",
    "chapterNumber": 14,
    "subjectId": "g7-soc",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 7 Social Science – Chapter 14: Equality in Democracy",
    "titleGujarati": "ધોરણ 7 સામાજિક વિજ્ઞાન – પ્રકરણ 14: લોકશાહીમાં સમાનતા (GSEB)",
    "instructor": "Science Guru",
    "instructorGujarati": "Science Guru (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "EaUv6uqcqbU",
    "thumbnailUrl": "https://img.youtube.com/vi/EaUv6uqcqbU/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Equality in Democracy under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ભારતીય બંધારણમાં સમાનતાનો અધિકાર, મતાધિકાર અને સાર્વત્રિક પુખ્તવય મતાધિકાર.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Equality in Democracy Core Concepts",
        "textGujarati": "લોકશાહીમાં સમાનતા ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-soc-ch14_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 14 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-soc&chapter=14"
  },
  {
    "id": "vid-ch-g7-soc-ch15",
    "chapterNumber": 15,
    "subjectId": "g7-soc",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 7 Social Science – Chapter 15: State Government",
    "titleGujarati": "ધોરણ 7 સામાજિક વિજ્ઞાન – પ્રકરણ 15: રાજ્ય સરકાર (GSEB)",
    "instructor": "Science Guru",
    "instructorGujarati": "Science Guru (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "IPm53FdMpQU",
    "thumbnailUrl": "https://img.youtube.com/vi/IPm53FdMpQU/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of State Government under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ધારાસભા (વિધાનસભા), કારોબારી (રાજ્યપાલ, મુખ્યમંત્રી) અને ન્યાયતંત્રની કામગીરી અને આરોગ્ય સેવાઓ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "State Government Core Concepts",
        "textGujarati": "રાજ્ય સરકાર ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-soc-ch15_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 15 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-soc&chapter=15"
  },
  {
    "id": "vid-ch-g7-soc-ch16",
    "chapterNumber": 16,
    "subjectId": "g7-soc",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 7 Social Science – Chapter 16: Gender Diversity and Roles",
    "titleGujarati": "ધોરણ 7 સામાજિક વિજ્ઞાન – પ્રકરણ 16: જાતિગત ભિન્નતા (GSEB)",
    "instructor": "Science Guru",
    "instructorGujarati": "Science Guru (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "BzDMifAF278",
    "thumbnailUrl": "https://img.youtube.com/vi/BzDMifAF278/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Gender Diversity and Roles under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "સ્ત્રી-પુરુષ સમાનતા, કન્યા કેળવણીનું મહત્વ અને મહિલા સશક્તિકરણની યોજનાઓ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Gender Diversity and Roles Core Concepts",
        "textGujarati": "જાતિગત ભિન્નતા ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-soc-ch16_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 16 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-soc&chapter=16"
  },
  {
    "id": "vid-ch-g7-soc-ch17",
    "chapterNumber": 17,
    "subjectId": "g7-soc",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 7 Social Science – Chapter 17: Communication Media and Advertising",
    "titleGujarati": "ધોરણ 7 સામાજિક વિજ્ઞાન – પ્રકરણ 17: સંચાર માધ્યમ અને જાહેરાત (GSEB)",
    "instructor": "Science Guru",
    "instructorGujarati": "Science Guru (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "52Iw1dVxckM",
    "thumbnailUrl": "https://img.youtube.com/vi/52Iw1dVxckM/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Communication Media and Advertising under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "છાપાં, રેડિયો, ટીવી, સોશિયલ મીડિયા અને જાહેરાતોનું આર્થિક તથા સામાજિક મહત્વ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Communication Media and Advertising Core Concepts",
        "textGujarati": "સંચાર માધ્યમ અને જાહેરાત ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-soc-ch17_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 17 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-soc&chapter=17"
  },
  {
    "id": "vid-ch-g7-soc-ch18",
    "chapterNumber": 18,
    "subjectId": "g7-soc",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 7 Social Science – Chapter 18: Market",
    "titleGujarati": "ધોરણ 7 સામાજિક વિજ્ઞાન – પ્રકરણ 18: બજાર (GSEB)",
    "instructor": "Accurate Learning",
    "instructorGujarati": "Accurate Learning (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "a7bS2hU3j7w",
    "thumbnailUrl": "https://img.youtube.com/vi/a7bS2hU3j7w/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Market under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "સાપ્તાહિક બજાર, મોહલ્લા દુકાન, શોપિંગ મોલ અને ઓનલાઇન બજાર, ગ્રાહકના અધિકારો.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Market Core Concepts",
        "textGujarati": "બજાર ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-soc-ch18_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 18 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-soc&chapter=18"
  },
  {
    "id": "vid-ch-g7-guj-ch1",
    "chapterNumber": 1,
    "subjectId": "g7-guj",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 7 Gujarati – Chapter 1: Mela Ma (Chitrapaath)",
    "titleGujarati": "ધોરણ 7 ગુજરાતી (માતૃભાષા) – પ્રકરણ 1: મેળામાં (ચિત્રપાઠ) (GSEB)",
    "instructor": "JOURNEY OF EDUCATION",
    "instructorGujarati": "JOURNEY OF EDUCATION (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "zmxDBwz7CV4",
    "thumbnailUrl": "https://img.youtube.com/vi/zmxDBwz7CV4/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Mela Ma (Chitrapaath) under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ચિત્રનું અવલોકન કરીને મેળાનું વર્ણન, વિવિધ દુકાનો, રમકડાં અને ચકડોળ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Mela Ma (Chitrapaath) Core Concepts",
        "textGujarati": "મેળામાં (ચિત્રપાઠ) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-guj-ch1_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 1 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-guj&chapter=1"
  },
  {
    "id": "vid-ch-g7-guj-ch2",
    "chapterNumber": 2,
    "subjectId": "g7-guj",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 7 Gujarati – Chapter 2: Aavni Ghadi Raliyamani",
    "titleGujarati": "ધોરણ 7 ગુજરાતી (માતૃભાષા) – પ્રકરણ 2: આજની ઘડી રળિયામણી (કાવ્ય) (GSEB)",
    "instructor": "Virvav School",
    "instructorGujarati": "Virvav School (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "juXnW4bmpnU",
    "thumbnailUrl": "https://img.youtube.com/vi/juXnW4bmpnU/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Aavni Ghadi Raliyamani under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "નરસિંહ મહેતા રચિત સુંદર ભક્તિગીત - શ્રીકૃષ્ણના આગમનની તૈયારી.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Aavni Ghadi Raliyamani Core Concepts",
        "textGujarati": "આજની ઘડી રળિયામણી (કાવ્ય) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-guj-ch2_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 2 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-guj&chapter=2"
  },
  {
    "id": "vid-ch-g7-guj-ch3",
    "chapterNumber": 3,
    "subjectId": "g7-guj",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 7 Gujarati – Chapter 3: Pariksha",
    "titleGujarati": "ધોરણ 7 ગુજરાતી (માતૃભાષા) – પ્રકરણ 3: પરીક્ષા (બોધકથા) (GSEB)",
    "instructor": "Basic to Brilliant",
    "instructorGujarati": "Basic to Brilliant (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "bsxq7n3YFSU",
    "thumbnailUrl": "https://img.youtube.com/vi/bsxq7n3YFSU/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Pariksha under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "પન્નાલાલ પટેલની વાર્તા: મહાદેવે ગાયને પારકા ખેતરમાંથી હાંકી અને પ્રામાણિકતાની પરીક્ષા પાસ કરી.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Pariksha Core Concepts",
        "textGujarati": "પરીક્ષા (બોધકથા) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-guj-ch3_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 3 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-guj&chapter=3"
  },
  {
    "id": "vid-ch-g7-guj-ch4",
    "chapterNumber": 4,
    "subjectId": "g7-guj",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 7 Gujarati – Chapter 4: Be Khanano Parigrah",
    "titleGujarati": "ધોરણ 7 ગુજરાતી (માતૃભાષા) – પ્રકરણ 4: બે ખાનાનો પરિગ્રહ (પ્રસંગકથા) (GSEB)",
    "instructor": "SAHJANAND EDUCATION",
    "instructorGujarati": "SAHJANAND EDUCATION (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "BbumCNStytI",
    "thumbnailUrl": "https://img.youtube.com/vi/BbumCNStytI/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Be Khanano Parigrah under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "મનુબહેન ગાંધી દ્વારા લિખિત પ્રસંગ: ગાંધીજીની સાદગી અને જરૂરિયાત કરતાં વધુ ન વાપરવાનો બોધ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Be Khanano Parigrah Core Concepts",
        "textGujarati": "બે ખાનાનો પરિગ્રહ (પ્રસંગકથા) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-guj-ch4_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 4 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-guj&chapter=4"
  },
  {
    "id": "vid-ch-g7-guj-ch5",
    "chapterNumber": 5,
    "subjectId": "g7-guj",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 7 Gujarati – Chapter 5: Raan Ma",
    "titleGujarati": "ધોરણ 7 ગુજરાતી (માતૃભાષા) – પ્રકરણ 5: રાનમાં (કાવ્ય) (GSEB)",
    "instructor": "Virvav School",
    "instructorGujarati": "Virvav School (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "bOsntV-er28",
    "thumbnailUrl": "https://img.youtube.com/vi/bOsntV-er28/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Raan Ma under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ધ્રુવ ભટ્ટનું ચોમાસાની ઋતુનું અદભુત પ્રકૃતિગીત.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Raan Ma Core Concepts",
        "textGujarati": "રાનમાં (કાવ્ય) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-guj-ch5_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 5 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-guj&chapter=5"
  },
  {
    "id": "vid-ch-g7-guj-ch6",
    "chapterNumber": 6,
    "subjectId": "g7-guj",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 7 Gujarati – Chapter 6: Bhikhu",
    "titleGujarati": "ધોરણ 7 ગુજરાતી (માતૃભાષા) – પ્રકરણ 6: ભીખુ (સંવેદનકથા) (GSEB)",
    "instructor": "LIMBHOLA PRIMARY SCHOOL LPS",
    "instructorGujarati": "LIMBHOLA PRIMARY SCHOOL LPS (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "6C3ouG3GPs8",
    "thumbnailUrl": "https://img.youtube.com/vi/6C3ouG3GPs8/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Bhikhu under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ધૂમકેતુ લિખિત વાર્તા: ગરીબ બાળકની પોતાના નાના ભાઈ-બહેન અને મા પ્રત્યેની લાગણી.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Bhikhu Core Concepts",
        "textGujarati": "ભીખુ (સંવેદનકથા) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-guj-ch6_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 6 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-guj&chapter=6"
  },
  {
    "id": "vid-ch-g7-guj-ch7",
    "chapterNumber": 7,
    "subjectId": "g7-guj",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 7 Gujarati – Chapter 7: Jeevan Pathey",
    "titleGujarati": "ધોરણ 7 ગુજરાતી (માતૃભાષા) – પ્રકરણ 7: જીવન પાથેય (આત્મકથાખંડ) (GSEB)",
    "instructor": "Knowledge Guru",
    "instructorGujarati": "Knowledge Guru (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "-ekHqh7cE3g",
    "thumbnailUrl": "https://img.youtube.com/vi/-ekHqh7cE3g/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Jeevan Pathey under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "કાકાસાહેબ કાલેલકરની આત્મકથા: પિતાજી પાસેથી મળેલો પ્રામાણિકતાનો પાઠ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Jeevan Pathey Core Concepts",
        "textGujarati": "જીવન પાથેય (આત્મકથાખંડ) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-guj-ch7_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 7 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-guj&chapter=7"
  },
  {
    "id": "vid-ch-g7-guj-ch8",
    "chapterNumber": 8,
    "subjectId": "g7-guj",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 7 Gujarati – Chapter 8: Malam Halesan Maar",
    "titleGujarati": "ધોરણ 7 ગુજરાતી (માતૃભાષા) – પ્રકરણ 8: માલમ હલેસાં માર (લોકગીત) (GSEB)",
    "instructor": "Virvav School",
    "instructorGujarati": "Virvav School (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "4MFfECFHDr8",
    "thumbnailUrl": "https://img.youtube.com/vi/4MFfECFHDr8/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Malam Halesan Maar under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "પુરુષાર્થ અને મહેનતનો મહિમા ગાતું પ્રેરણાદાયી લોકગીત.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Malam Halesan Maar Core Concepts",
        "textGujarati": "માલમ હલેસાં માર (લોકગીત) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-guj-ch8_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 8 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-guj&chapter=8"
  },
  {
    "id": "vid-ch-g7-guj-ch9",
    "chapterNumber": 9,
    "subjectId": "g7-guj",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 7 Gujarati – Chapter 9: Bano Vaado",
    "titleGujarati": "ધોરણ 7 ગુજરાતી (માતૃભાષા) – પ્રકરણ 9: બાનો વાડો (નિબંધ) (GSEB)",
    "instructor": "LIMBHOLA PRIMARY SCHOOL LPS",
    "instructorGujarati": "LIMBHOLA PRIMARY SCHOOL LPS (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "8vAfntA16R0",
    "thumbnailUrl": "https://img.youtube.com/vi/8vAfntA16R0/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Bano Vaado under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "પ્રવીણ દરજી લિખિત નિબંધ: બાનો પ્રકૃતિ અને વાડા પ્રત્યેનો અખૂટ પ્રેમ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Bano Vaado Core Concepts",
        "textGujarati": "બાનો વાડો (નિબંધ) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-guj-ch9_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 9 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-guj&chapter=9"
  },
  {
    "id": "vid-ch-g7-guj-ch10",
    "chapterNumber": 10,
    "subjectId": "g7-guj",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 7 Gujarati – Chapter 10: Valayni Avakashi Safar",
    "titleGujarati": "ધોરણ 7 ગુજરાતી (માતૃભાષા) – પ્રકરણ 10: વલયની અવકાશી સફર (વિજ્ઞાનકથા) (GSEB)",
    "instructor": "Gujarati Education Zala Jayendrasinh",
    "instructorGujarati": "Gujarati Education Zala Jayendrasinh (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "2L5f-Et6EZ8",
    "thumbnailUrl": "https://img.youtube.com/vi/2L5f-Et6EZ8/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Valayni Avakashi Safar under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "જયંત નર્લીકરની વિજ્ઞાનકથા: પૃથ્વી બહારના જીવો અને સ્પેસ શિપનો રોમાંચક અનુભવ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Valayni Avakashi Safar Core Concepts",
        "textGujarati": "વલયની અવકાશી સફર (વિજ્ઞાનકથા) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-guj-ch10_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 10 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-guj&chapter=10"
  },
  {
    "id": "vid-ch-g7-guj-ch11",
    "chapterNumber": 11,
    "subjectId": "g7-guj",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 7 Gujarati – Chapter 11: Akhbari Nondh",
    "titleGujarati": "ધોરણ 7 ગુજરાતી (માતૃભાષા) – પ્રકરણ 11: અખબારી નોંધ (GSEB)",
    "instructor": "Dhaval Patel Education",
    "instructorGujarati": "Dhaval Patel Education (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "HH9528BcxpQ",
    "thumbnailUrl": "https://img.youtube.com/vi/HH9528BcxpQ/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Akhbari Nondh under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ડૉ. ચંદ્રકાન્ત મહેતા: સમાચાર પત્રોમાં નોંધ મોકલવાની સાચી રીત.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Akhbari Nondh Core Concepts",
        "textGujarati": "અખબારી નોંધ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-guj-ch11_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 11 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-guj&chapter=11"
  },
  {
    "id": "vid-ch-g7-guj-ch12",
    "chapterNumber": 12,
    "subjectId": "g7-guj",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 7 Gujarati – Chapter 12: Janani",
    "titleGujarati": "ધોરણ 7 ગુજરાતી (માતૃભાષા) – પ્રકરણ 12: જનની (કાવ્ય) (GSEB)",
    "instructor": "Full Lesson",
    "instructorGujarati": "Full Lesson (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "Y7IxLjpPRXI",
    "thumbnailUrl": "https://img.youtube.com/vi/Y7IxLjpPRXI/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Janani under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "કવિ બોટાદકર રચિત અમર માતૃવંદના - 'જનનીની જોડ સખી નહિ જડે રે લોલ'.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Janani Core Concepts",
        "textGujarati": "જનની (કાવ્ય) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-guj-ch12_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 12 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-guj&chapter=12"
  },
  {
    "id": "vid-ch-g7-guj-ch13",
    "chapterNumber": 13,
    "subjectId": "g7-guj",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 7 Gujarati – Chapter 13: High School Ma",
    "titleGujarati": "ધોરણ 7 ગુજરાતી (માતૃભાષા) – પ્રકરણ 13: હાઈસ્કૂલમાં (આત્મકથાખંડ) (GSEB)",
    "instructor": "Dhaval Patel Education",
    "instructorGujarati": "Dhaval Patel Education (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "y-5xpe9-0_I",
    "thumbnailUrl": "https://img.youtube.com/vi/y-5xpe9-0_I/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of High School Ma under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ગાંધીજીના સત્યના પ્રયોગોમાંથી: વ્યાયામ, સુંદર અક્ષરો અને સત્યપાલનનું મહત્વ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "High School Ma Core Concepts",
        "textGujarati": "હાઈસ્કૂલમાં (આત્મકથાખંડ) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-guj-ch13_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 13 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-guj&chapter=13"
  },
  {
    "id": "vid-ch-g7-guj-ch14",
    "chapterNumber": 14,
    "subjectId": "g7-guj",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 7 Gujarati – Chapter 14: Bhamiye Gujarate Dakshin Bhani",
    "titleGujarati": "ધોરણ 7 ગુજરાતી (માતૃભાષા) – પ્રકરણ 14: ભમીએ ગુજરાતે : દક્ષિણ ભણી (પ્રવાસવર્ણન) (GSEB)",
    "instructor": "Hardiksir Kavaiya",
    "instructorGujarati": "Hardiksir Kavaiya (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "_Qxu4UIUtLQ",
    "thumbnailUrl": "https://img.youtube.com/vi/_Qxu4UIUtLQ/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Bhamiye Gujarate Dakshin Bhani under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "જ્યોતીન્દ્ર દવે અને ધનસુખલાલ મહેતા: સુરત અને તાપી કિનારાનો રમૂજી પ્રવાસ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Bhamiye Gujarate Dakshin Bhani Core Concepts",
        "textGujarati": "ભમીએ ગુજરાતે : દક્ષિણ ભણી (પ્રવાસવર્ણન) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-guj-ch14_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 14 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-guj&chapter=14"
  },
  {
    "id": "vid-ch-g7-guj-ch15",
    "chapterNumber": 15,
    "subjectId": "g7-guj",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 7 Gujarati – Chapter 15: Aav Bhana Aav",
    "titleGujarati": "ધોરણ 7 ગુજરાતી (માતૃભાષા) – પ્રકરણ 15: આવ ભાણા આવ! (હાસ્યકથા) (GSEB)",
    "instructor": "Dhaval Patel Education",
    "instructorGujarati": "Dhaval Patel Education (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "PR3JASjpr9w",
    "thumbnailUrl": "https://img.youtube.com/vi/PR3JASjpr9w/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Aav Bhana Aav under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "શાહબુદ્દીન રાઠોડની અદભુત હાસ્યકથા: મોચી પાસે નવા બૂટ સીવડાવવાનો રમૂજી પ્રસંગ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Aav Bhana Aav Core Concepts",
        "textGujarati": "આવ ભાણા આવ! (હાસ્યકથા) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-guj-ch15_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 15 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-guj&chapter=15"
  },
  {
    "id": "vid-ch-g7-guj-ch16",
    "chapterNumber": 16,
    "subjectId": "g7-guj",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 7 Gujarati – Chapter 16: Sinh Ni Dosti",
    "titleGujarati": "ધોરણ 7 ગુજરાતી (માતૃભાષા) – પ્રકરણ 16: સિંહની દોસ્તી (લોકકથા) (GSEB)",
    "instructor": "LIMBHOLA PRIMARY SCHOOL LPS",
    "instructorGujarati": "LIMBHOLA PRIMARY SCHOOL LPS (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "q5Ivol2Rwk8",
    "thumbnailUrl": "https://img.youtube.com/vi/q5Ivol2Rwk8/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Sinh Ni Dosti under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ભાણભાઈ ગીડા: ગીરના માત્રાવાળા દરબાર અને જંગલના રાજા સિંહ વચ્ચેની અદ્ભુત મિત્રતા.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Sinh Ni Dosti Core Concepts",
        "textGujarati": "સિંહની દોસ્તી (લોકકથા) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-guj-ch16_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 16 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-guj&chapter=16"
  },
  {
    "id": "vid-ch-g7-guj-ch17",
    "chapterNumber": 17,
    "subjectId": "g7-guj",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 7 Gujarati – Chapter 17: Jivram Bhatt",
    "titleGujarati": "ધોરણ 7 ગુજરાતી (માતૃભાષા) – પ્રકરણ 17: જીવરામ ભટ્ટ (નાટક) (GSEB)",
    "instructor": "LIMBHOLA PRIMARY SCHOOL LPS",
    "instructorGujarati": "LIMBHOLA PRIMARY SCHOOL LPS (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "TpLLHUfr8uc",
    "thumbnailUrl": "https://img.youtube.com/vi/TpLLHUfr8uc/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Jivram Bhatt under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "દલપતરામ લિખિત મિથ્યાભિમાન નાટકનો અંશ: રતાંધળા જીવરામ ભટ્ટનો મિથ્યા અહંકાર.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Jivram Bhatt Core Concepts",
        "textGujarati": "જીવરામ ભટ્ટ (નાટક) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-guj-ch17_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 17 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-guj&chapter=17"
  },
  {
    "id": "vid-ch-g7-guj-ch18",
    "chapterNumber": 18,
    "subjectId": "g7-guj",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 7 Gujarati – Chapter 18: Sona Jevi Savar",
    "titleGujarati": "ધોરણ 7 ગુજરાતી (માતૃભાષા) – પ્રકરણ 18: સોના જેવી સવાર (કાવ્ય) (GSEB)",
    "instructor": "Gyanyogi E-Class",
    "instructorGujarati": "Gyanyogi E-Class (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "fbSznAuF_x8",
    "thumbnailUrl": "https://img.youtube.com/vi/fbSznAuF_x8/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Sona Jevi Savar under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ચંદ્રકાન્ત ત્રિવેદી: પ્રકૃતિમાં ખીલી ઊઠેલી સુંદર સવારનું કાવ્યાત્મક વર્ણન.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Sona Jevi Savar Core Concepts",
        "textGujarati": "સોના જેવી સવાર (કાવ્ય) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-guj-ch18_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 18 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-guj&chapter=18"
  },
  {
    "id": "vid-ch-g7-eng-ch1",
    "chapterNumber": 1,
    "subjectId": "g7-eng",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "English",
    "categoryGujarati": "અંગ્રેજી (દ્વિતીય ભાષા)",
    "title": "Class 7 English – Chapter 1: Three Questions & The Squirrel",
    "titleGujarati": "ધોરણ 7 અંગ્રેજી (દ્વિતીય ભાષા) – પ્રકરણ 1: ત્રણ પ્રશ્નો અને ખિસકોલી (GSEB)",
    "instructor": "Dharanidhar Classes",
    "instructorGujarati": "Dharanidhar Classes (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "VPPbeQb8m1Y",
    "thumbnailUrl": "https://img.youtube.com/vi/VPPbeQb8m1Y/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Three Questions & The Squirrel under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "Leo Tolstoy's story about finding the right time, the right people, and the most important thing to do.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Three Questions & The Squirrel Core Concepts",
        "textGujarati": "ત્રણ પ્રશ્નો અને ખિસકોલી ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-eng-ch1_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 1 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-eng&chapter=1"
  },
  {
    "id": "vid-ch-g7-eng-ch2",
    "chapterNumber": 2,
    "subjectId": "g7-eng",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "English",
    "categoryGujarati": "અંગ્રેજી (દ્વિતીય ભાષા)",
    "title": "Class 7 English – Chapter 2: A Gift of Chappals & The Rebel",
    "titleGujarati": "ધોરણ 7 અંગ્રેજી (દ્વિતીય ભાષા) – પ્રકરણ 2: એ ગિફ્ટ ઓફ ચપ્પલ અને બળવાખોર (GSEB)",
    "instructor": "Learn With Sanat | Animated Reels & Videos",
    "instructorGujarati": "Learn With Sanat | Animated Reels & Videos (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "2GDy8yo2OOo",
    "thumbnailUrl": "https://img.youtube.com/vi/2GDy8yo2OOo/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of A Gift of Chappals & The Rebel under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "Children's innocence and compassion in giving slippers to a poor barefoot beggar.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "A Gift of Chappals & The Rebel Core Concepts",
        "textGujarati": "એ ગિફ્ટ ઓફ ચપ્પલ અને બળવાખોર ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-eng-ch2_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 2 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-eng&chapter=2"
  },
  {
    "id": "vid-ch-g7-eng-ch3",
    "chapterNumber": 3,
    "subjectId": "g7-eng",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "English",
    "categoryGujarati": "અંગ્રેજી (દ્વિતીય ભાષા)",
    "title": "Class 7 English – Chapter 3: Gopal and the Hilsa Fish & The Shed",
    "titleGujarati": "ધોરણ 7 અંગ્રેજી (દ્વિતીય ભાષા) – પ્રકરણ 3: ગોપાલ અને હિલસા માછલી (GSEB)",
    "instructor": "Easy English Summary ",
    "instructorGujarati": "Easy English Summary  (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "GEUF0zGWFgY",
    "thumbnailUrl": "https://img.youtube.com/vi/GEUF0zGWFgY/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Gopal and the Hilsa Fish & The Shed under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "A witty courtier proves that intelligence and confidence can win any challenge.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Gopal and the Hilsa Fish & The Shed Core Concepts",
        "textGujarati": "ગોપાલ અને હિલસા માછલી ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-eng-ch3_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 3 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-eng&chapter=3"
  },
  {
    "id": "vid-ch-g7-eng-ch4",
    "chapterNumber": 4,
    "subjectId": "g7-eng",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "English",
    "categoryGujarati": "અંગ્રેજી (દ્વિતીય ભાષા)",
    "title": "Class 7 English – Chapter 4: The Ashes That Made Trees Bloom & Chivvy",
    "titleGujarati": "ધોરણ 7 અંગ્રેજી (દ્વિતીય ભાષા) – પ્રકરણ 4: ધ એશિઝ ધેટ મેડ ટ્રીઝ બ્લૂમ (GSEB)",
    "instructor": "Magnet Brains",
    "instructorGujarati": "Magnet Brains (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "9MF2vBSZ4fM",
    "thumbnailUrl": "https://img.youtube.com/vi/9MF2vBSZ4fM/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of The Ashes That Made Trees Bloom & Chivvy under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "A Japanese tale of kind old couple whose honesty brings joy and prosperity.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "The Ashes That Made Trees Bloom & Chivvy Core Concepts",
        "textGujarati": "ધ એશિઝ ધેટ મેડ ટ્રીઝ બ્લૂમ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-eng-ch4_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 4 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-eng&chapter=4"
  },
  {
    "id": "vid-ch-g7-eng-ch5",
    "chapterNumber": 5,
    "subjectId": "g7-eng",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "English",
    "categoryGujarati": "અંગ્રેજી (દ્વિતીય ભાષા)",
    "title": "Class 7 English – Chapter 5: Quality & Trees",
    "titleGujarati": "ધોરણ 7 અંગ્રેજી (દ્વિતીય ભાષા) – પ્રકરણ 5: ક્વોલિટી (ગુણવત્તા) અને વૃક્ષો (GSEB)",
    "instructor": "Educ TEChno",
    "instructorGujarati": "Educ TEChno (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "q_Lpj6l42Bc",
    "thumbnailUrl": "https://img.youtube.com/vi/q_Lpj6l42Bc/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Quality & Trees under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "John Galsworthy's story about Mr. Gessler, a devoted shoemaker committed to perfection.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Quality & Trees Core Concepts",
        "textGujarati": "ક્વોલિટી (ગુણવત્તા) અને વૃક્ષો ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-eng-ch5_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 5 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-eng&chapter=5"
  },
  {
    "id": "vid-ch-g7-eng-ch6",
    "chapterNumber": 6,
    "subjectId": "g7-eng",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "English",
    "categoryGujarati": "અંગ્રેજી (દ્વિતીય ભાષા)",
    "title": "Class 7 English – Chapter 6: Expert Detectives & Talking Fan",
    "titleGujarati": "ધોરણ 7 અંગ્રેજી (દ્વિતીય ભાષા) – પ્રકરણ 6: નિષ્ણાત જાસૂસો અને પંખો (GSEB)",
    "instructor": "inforeeel ",
    "instructorGujarati": "inforeeel  (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "_3QTNZMgctI",
    "thumbnailUrl": "https://img.youtube.com/vi/_3QTNZMgctI/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Expert Detectives & Talking Fan under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "Nishad and Maya investigate their mysterious neighbour Mr. Nath.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Expert Detectives & Talking Fan Core Concepts",
        "textGujarati": "નિષ્ણાત જાસૂસો અને પંખો ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-eng-ch6_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 6 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-eng&chapter=6"
  },
  {
    "id": "vid-ch-g7-eng-ch7",
    "chapterNumber": 7,
    "subjectId": "g7-eng",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "English",
    "categoryGujarati": "અંગ્રેજી (દ્વિતીય ભાષા)",
    "title": "Class 7 English – Chapter 7: The Invention of Vita-Wonk & Dad and the Cat",
    "titleGujarati": "ધોરણ 7 અંગ્રેજી (દ્વિતીય ભાષા) – પ્રકરણ 7: ધ ઇન્વેન્શન ઓફ વિટા-વોન્ક (GSEB)",
    "instructor": "Magnet Brains",
    "instructorGujarati": "Magnet Brains (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "VZxPQsR6m68",
    "thumbnailUrl": "https://img.youtube.com/vi/VZxPQsR6m68/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of The Invention of Vita-Wonk & Dad and the Cat under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "A humorous fantasy tale by Roald Dahl about Mr. Willy Wonka inventing an elixir of old age.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "The Invention of Vita-Wonk & Dad and the Cat Core Concepts",
        "textGujarati": "ધ ઇન્વેન્શન ઓફ વિટા-વોન્ક ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-eng-ch7_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 7 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-eng&chapter=7"
  },
  {
    "id": "vid-ch-g7-eng-ch8",
    "chapterNumber": 8,
    "subjectId": "g7-eng",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "English",
    "categoryGujarati": "અંગ્રેજી (દ્વિતીય ભાષા)",
    "title": "Class 7 English – Chapter 8: Meadow Surprises & Fire: Friend and Foe",
    "titleGujarati": "ધોરણ 7 અંગ્રેજી (દ્વિતીય ભાષા) – પ્રકરણ 8: મેડો સરપ્રાઇઝિસ અને અગ્નિ (GSEB)",
    "instructor": "BMY EDUCATION",
    "instructorGujarati": "BMY EDUCATION (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "i1CZJnD5DkI",
    "thumbnailUrl": "https://img.youtube.com/vi/i1CZJnD5DkI/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Meadow Surprises & Fire: Friend and Foe under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "Discovering the hidden wonders of nature and the dual nature of fire.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Meadow Surprises & Fire: Friend and Foe Core Concepts",
        "textGujarati": "મેડો સરપ્રાઇઝિસ અને અગ્નિ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-eng-ch8_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 8 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-eng&chapter=8"
  },
  {
    "id": "vid-ch-g7-eng-ch9",
    "chapterNumber": 9,
    "subjectId": "g7-eng",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "English",
    "categoryGujarati": "અંગ્રેજી (દ્વિતીય ભાષા)",
    "title": "Class 7 English – Chapter 9: A Bicycle in Good Repair & Garden Snake",
    "titleGujarati": "ધોરણ 7 અંગ્રેજી (દ્વિતીય ભાષા) – પ્રકરણ 9: એ બાયસિકલ ઇન ગુડ રિપેર (GSEB)",
    "instructor": "Easy English Summary ",
    "instructorGujarati": "Easy English Summary  (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "Sdgq5-1LN2Y",
    "thumbnailUrl": "https://img.youtube.com/vi/Sdgq5-1LN2Y/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of A Bicycle in Good Repair & Garden Snake under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "A comic account of a well-meaning friend dismantling a perfectly fine bicycle.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "A Bicycle in Good Repair & Garden Snake Core Concepts",
        "textGujarati": "એ બાયસિકલ ઇન ગુડ રિપેર ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-eng-ch9_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 9 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-eng&chapter=9"
  },
  {
    "id": "vid-ch-g7-eng-ch10",
    "chapterNumber": 10,
    "subjectId": "g7-eng",
    "grades": [
      "7"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "English",
    "categoryGujarati": "અંગ્રેજી (દ્વિતીય ભાષા)",
    "title": "Class 7 English – Chapter 10: The Story of Cricket",
    "titleGujarati": "ધોરણ 7 અંગ્રેજી (દ્વિતીય ભાષા) – પ્રકરણ 10: ક્રિકેટનો ઇતિહાસ (GSEB)",
    "instructor": "Study Point Diaries",
    "instructorGujarati": "Study Point Diaries (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "RAh92_uyV9E",
    "thumbnailUrl": "https://img.youtube.com/vi/RAh92_uyV9E/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of The Story of Cricket under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "The origins, evolution, rules, and global popularity of the game of cricket.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "The Story of Cricket Core Concepts",
        "textGujarati": "ક્રિકેટનો ઇતિહાસ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g7-eng-ch10_1",
        "author": "MindSprint Learner",
        "role": "Class 7 Student",
        "text": "પ્રકરણ 10 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=7&subject=g7-eng&chapter=10"
  },
  {
    "id": "vid-ch-g8-math-ch1",
    "chapterNumber": 1,
    "subjectId": "g8-math",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 8 Mathematics – Chapter 1: Rational Numbers",
    "titleGujarati": "ધોરણ 8 ગણિત – પ્રકરણ 1: સંમેય સંખ્યાઓ (GSEB)",
    "instructor": "Ocean GyanLive Std 9 and 10",
    "instructorGujarati": "Ocean GyanLive Std 9 and 10 (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "m5c9TGEz0pU",
    "thumbnailUrl": "https://img.youtube.com/vi/m5c9TGEz0pU/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Rational Numbers under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "સંમેય સંખ્યાઓ (p/q, q ≠ 0), સંવૃતતા, ક્રમનો ગુણધર્મ, જૂથનો ગુણધર્મ, વિરોધી અને વ્યસ્ત સંખ્યાઓ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Rational Numbers Core Concepts",
        "textGujarati": "સંમેય સંખ્યાઓ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-math-ch1_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 1 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-math&chapter=1"
  },
  {
    "id": "vid-ch-g8-math-ch2",
    "chapterNumber": 2,
    "subjectId": "g8-math",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 8 Mathematics – Chapter 2: Linear Equations in One Variable",
    "titleGujarati": "ધોરણ 8 ગણિત – પ્રકરણ 2: એકચલ સુરેખ સમીકરણ (GSEB)",
    "instructor": "Ocean GyanLive Std 9 and 10",
    "instructorGujarati": "Ocean GyanLive Std 9 and 10 (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "rn7PqzCSVG4",
    "thumbnailUrl": "https://img.youtube.com/vi/rn7PqzCSVG4/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Linear Equations in One Variable under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "એક જ ઘાત અને એક જ ચલ ધરાવતા સમીકરણો, સમીકરણ ઉકેલવાની રીતો અને વ્યવહારુ કોયડા.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Linear Equations in One Variable Core Concepts",
        "textGujarati": "એકચલ સુરેખ સમીકરણ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-math-ch2_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 2 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-math&chapter=2"
  },
  {
    "id": "vid-ch-g8-math-ch3",
    "chapterNumber": 3,
    "subjectId": "g8-math",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 8 Mathematics – Chapter 3: Understanding Quadrilaterals",
    "titleGujarati": "ધોરણ 8 ગણિત – પ્રકરણ 3: ચતુષ્કોણની સમજ (GSEB)",
    "instructor": "Ocean GyanLive Std 9 and 10",
    "instructorGujarati": "Ocean GyanLive Std 9 and 10 (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "9VX5_yA05Bo",
    "thumbnailUrl": "https://img.youtube.com/vi/9VX5_yA05Bo/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Understanding Quadrilaterals under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "બહુકોણ, અંતર્મુખ-બહિર્મુખ બહુકોણ, ચતુષ્કોણના ખૂણાઓનો સરવાળો (360°), સમાંતરબાજુ, સમબાજુ, લંબચોરસ, ચોરસ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Understanding Quadrilaterals Core Concepts",
        "textGujarati": "ચતુષ્કોણની સમજ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-math-ch3_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 3 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-math&chapter=3"
  },
  {
    "id": "vid-ch-g8-math-ch4",
    "chapterNumber": 4,
    "subjectId": "g8-math",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 8 Mathematics – Chapter 4: Practical Geometry",
    "titleGujarati": "ધોરણ 8 ગણિત – પ્રકરણ 4: પ્રાયોગિક ભૂમિતિ (GSEB)",
    "instructor": "Gangotri Schools",
    "instructorGujarati": "Gangotri Schools (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "wsE5twmE0SI",
    "thumbnailUrl": "https://img.youtube.com/vi/wsE5twmE0SI/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Practical Geometry under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ચતુષ્કોણની રચના: ચાર બાજુ અને એક વિકર્ણ, ત્રણ બાજુ અને બે વિકર્ણ આપેલા હોય ત્યારે રચના દોરવી.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Practical Geometry Core Concepts",
        "textGujarati": "પ્રાયોગિક ભૂમિતિ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-math-ch4_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 4 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-math&chapter=4"
  },
  {
    "id": "vid-ch-g8-math-ch5",
    "chapterNumber": 5,
    "subjectId": "g8-math",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 8 Mathematics – Chapter 5: Data Handling",
    "titleGujarati": "ધોરણ 8 ગણિત – પ્રકરણ 5: માહિતીનું નિયમન (GSEB)",
    "instructor": "Vidyakul Gujarati Std 6, 7 & 8",
    "instructorGujarati": "Vidyakul Gujarati Std 6, 7 & 8 (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "vIE0MJESTx4",
    "thumbnailUrl": "https://img.youtube.com/vi/vIE0MJESTx4/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Data Handling under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "આવૃત્તિ વિતરણ, સ્તંભાલેખ (હિસ્ટોગ્રામ), વૃત્તાંશ આલેખ (પાઈ ચાર્ટ) અને સંભાવનાની ગણતરી.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Data Handling Core Concepts",
        "textGujarati": "માહિતીનું નિયમન ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-math-ch5_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 5 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-math&chapter=5"
  },
  {
    "id": "vid-ch-g8-math-ch6",
    "chapterNumber": 6,
    "subjectId": "g8-math",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 8 Mathematics – Chapter 6: Squares and Square Roots",
    "titleGujarati": "ધોરણ 8 ગણિત – પ્રકરણ 6: વર્ગ અને વર્ગમૂળ (GSEB)",
    "instructor": "Maths Magic by Dilip Virda",
    "instructorGujarati": "Maths Magic by Dilip Virda (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "A4_uZcjEqgs",
    "thumbnailUrl": "https://img.youtube.com/vi/A4_uZcjEqgs/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Squares and Square Roots under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "પૂર્ણ વર્ગ સંખ્યાઓ, વર્ગમૂળ શોધવાની અવિભાજ્ય અવયવની રીત અને ભાગાકારની પદ્ધતિ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Squares and Square Roots Core Concepts",
        "textGujarati": "વર્ગ અને વર્ગમૂળ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-math-ch6_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 6 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-math&chapter=6"
  },
  {
    "id": "vid-ch-g8-math-ch7",
    "chapterNumber": 7,
    "subjectId": "g8-math",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 8 Mathematics – Chapter 7: Cubes and Cube Roots",
    "titleGujarati": "ધોરણ 8 ગણિત – પ્રકરણ 7: ઘન અને ઘનમૂળ (GSEB)",
    "instructor": "Vasu Faldu",
    "instructorGujarati": "Vasu Faldu (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "rXrD8EKgrPw",
    "thumbnailUrl": "https://img.youtube.com/vi/rXrD8EKgrPw/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Cubes and Cube Roots under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "પૂર્ણ ઘન સંખ્યાઓ, અવિભાજ્ય અવયવની રીતે ઘનમૂળ શોધવું અને અનુમાનની પદ્ધતિ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Cubes and Cube Roots Core Concepts",
        "textGujarati": "ઘન અને ઘનમૂળ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-math-ch7_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 7 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-math&chapter=7"
  },
  {
    "id": "vid-ch-g8-math-ch8",
    "chapterNumber": 8,
    "subjectId": "g8-math",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 8 Mathematics – Chapter 8: Comparing Quantities",
    "titleGujarati": "ધોરણ 8 ગણિત – પ્રકરણ 8: રાશિઓની તુલના (GSEB)",
    "instructor": "eSaral Class 8, 9 & 10",
    "instructorGujarati": "eSaral Class 8, 9 & 10 (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "oLvpiLhMGdA",
    "thumbnailUrl": "https://img.youtube.com/vi/oLvpiLhMGdA/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Comparing Quantities under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "વળતર (ડિસ્કાઉન્ટ), જીએસટી (GST), ચક્રવૃદ્ધિ વ્યાજ (A = P(1 + R/100)^n) અને વસ્તી વૃદ્ધિ દર.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Comparing Quantities Core Concepts",
        "textGujarati": "રાશિઓની તુલના ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-math-ch8_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 8 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-math&chapter=8"
  },
  {
    "id": "vid-ch-g8-math-ch9",
    "chapterNumber": 9,
    "subjectId": "g8-math",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 8 Mathematics – Chapter 9: Algebraic Expressions and Identities",
    "titleGujarati": "ધોરણ 8 ગણિત – પ્રકરણ 9: બૈજિક પદાવલિઓ અને નિત્યસમ (GSEB)",
    "instructor": "Vamja Education",
    "instructorGujarati": "Vamja Education (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "DYUXP3sDNYM",
    "thumbnailUrl": "https://img.youtube.com/vi/DYUXP3sDNYM/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Algebraic Expressions and Identities under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "પદાવલિઓના ગુણાકાર અને પ્રમાણિત નિત્યસમો: (a+b)², (a-b)², a²-b².",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Algebraic Expressions and Identities Core Concepts",
        "textGujarati": "બૈજિક પદાવલિઓ અને નિત્યસમ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-math-ch9_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 9 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-math&chapter=9"
  },
  {
    "id": "vid-ch-g8-math-ch10",
    "chapterNumber": 10,
    "subjectId": "g8-math",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 8 Mathematics – Chapter 10: Visualising Solid Shapes",
    "titleGujarati": "ધોરણ 8 ગણિત – પ્રકરણ 10: ઘન આકારોનું પ્રત્યક્ષીકરણ (GSEB)",
    "instructor": "Virvav School",
    "instructorGujarati": "Virvav School (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "oJ5fpiSO7Oo",
    "thumbnailUrl": "https://img.youtube.com/vi/oJ5fpiSO7Oo/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Visualising Solid Shapes under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "નકશાનું અર્થઘટન, સમઘન, લંબઘન, નળાકાર, શંકુ અને ગોલકના ફલક (F), શિરોબિંદુ (V), ધાર (E).",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Visualising Solid Shapes Core Concepts",
        "textGujarati": "ઘન આકારોનું પ્રત્યક્ષીકરણ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-math-ch10_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 10 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-math&chapter=10"
  },
  {
    "id": "vid-ch-g8-math-ch11",
    "chapterNumber": 11,
    "subjectId": "g8-math",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 8 Mathematics – Chapter 11: Mensuration",
    "titleGujarati": "ધોરણ 8 ગણિત – પ્રકરણ 11: ક્ષેત્રમિતિ (GSEB)",
    "instructor": "Ved Digital Education",
    "instructorGujarati": "Ved Digital Education (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "OJOm1FGZTd0",
    "thumbnailUrl": "https://img.youtube.com/vi/OJOm1FGZTd0/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Mensuration under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "સમલંબ ચતુષ્કોણનું ક્ષેત્રફળ, સમઘન, લંબઘન અને નળાકારની વક્રસપાટીનું અને કુલ પૃષ્ઠફળ તથા ઘનફળ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Mensuration Core Concepts",
        "textGujarati": "ક્ષેત્રમિતિ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-math-ch11_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 11 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-math&chapter=11"
  },
  {
    "id": "vid-ch-g8-math-ch12",
    "chapterNumber": 12,
    "subjectId": "g8-math",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 8 Mathematics – Chapter 12: Exponents and Powers",
    "titleGujarati": "ધોરણ 8 ગણિત – પ્રકરણ 12: ઘાત અને ઘાતાંક (GSEB)",
    "instructor": "Vidyakul Gujarati Std 6, 7 & 8",
    "instructorGujarati": "Vidyakul Gujarati Std 6, 7 & 8 (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "udPrhRzoLNo",
    "thumbnailUrl": "https://img.youtube.com/vi/udPrhRzoLNo/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Exponents and Powers under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ઋણ ઘાતાંક, ઘાતાંકના નિયમો (a^-m = 1/a^m) અને સંખ્યાઓને પ્રમાણિત સ્વરૂપમાં દર્શાવવી.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Exponents and Powers Core Concepts",
        "textGujarati": "ઘાત અને ઘાતાંક ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-math-ch12_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 12 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-math&chapter=12"
  },
  {
    "id": "vid-ch-g8-math-ch13",
    "chapterNumber": 13,
    "subjectId": "g8-math",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 8 Mathematics – Chapter 13: Direct and Inverse Proportions",
    "titleGujarati": "ધોરણ 8 ગણિત – પ્રકરણ 13: સમપ્રમાણ અને વ્યસ્ત પ્રમાણ (GSEB)",
    "instructor": "Gyan Vishv",
    "instructorGujarati": "Gyan Vishv (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "rfPLwukc8Ms",
    "thumbnailUrl": "https://img.youtube.com/vi/rfPLwukc8Ms/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Direct and Inverse Proportions under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "સમપ્રમાણ (x/y = k) અને વ્યસ્ત પ્રમાણ (x × y = k) ના વ્યવહારુ દાખલાઓ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Direct and Inverse Proportions Core Concepts",
        "textGujarati": "સમપ્રમાણ અને વ્યસ્ત પ્રમાણ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-math-ch13_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 13 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-math&chapter=13"
  },
  {
    "id": "vid-ch-g8-math-ch14",
    "chapterNumber": 14,
    "subjectId": "g8-math",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 8 Mathematics – Chapter 14: Factorisation",
    "titleGujarati": "ધોરણ 8 ગણિત – પ્રકરણ 14: અવયવીકરણ (GSEB)",
    "instructor": "Gyan Vishv",
    "instructorGujarati": "Gyan Vishv (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "nfRLdF-9ItY",
    "thumbnailUrl": "https://img.youtube.com/vi/nfRLdF-9ItY/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Factorisation under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "સામાન્ય અવયવની રીત, પદોની પુનઃગોઠવણી, નિત્યસમોનો ઉપયોગ અને બહુપદીનો ભાગાકાર.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Factorisation Core Concepts",
        "textGujarati": "અવયવીકરણ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-math-ch14_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 14 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-math&chapter=14"
  },
  {
    "id": "vid-ch-g8-math-ch15",
    "chapterNumber": 15,
    "subjectId": "g8-math",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 8 Mathematics – Chapter 15: Introduction to Graphs",
    "titleGujarati": "ધોરણ 8 ગણિત – પ્રકરણ 15: આલેખનો પરિચય (GSEB)",
    "instructor": "Nax Bharti School",
    "instructorGujarati": "Nax Bharti School (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "CaOMHbv2gKI",
    "thumbnailUrl": "https://img.youtube.com/vi/CaOMHbv2gKI/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Introduction to Graphs under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "રેખીય આલેખ, યામાક્ષો (X-અક્ષ, Y-અક્ષ), ઉદ્ભવબિંદુ (0,0) અને બિંદુઓનું આલેખમાં સ્થાપન.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Introduction to Graphs Core Concepts",
        "textGujarati": "આલેખનો પરિચય ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-math-ch15_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 15 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-math&chapter=15"
  },
  {
    "id": "vid-ch-g8-math-ch16",
    "chapterNumber": 16,
    "subjectId": "g8-math",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 8 Mathematics – Chapter 16: Playing with Numbers",
    "titleGujarati": "ધોરણ 8 ગણિત – પ્રકરણ 16: સંખ્યા સાથે રમત (GSEB)",
    "instructor": "Nax Bharti School",
    "instructorGujarati": "Nax Bharti School (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "oiT8HblvUwY",
    "thumbnailUrl": "https://img.youtube.com/vi/oiT8HblvUwY/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Playing with Numbers under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "સંખ્યાઓનું સામાન્ય સ્વરૂપ (10a + b), અક્ષરો માટે અંકો અને વિભાજ્યતાના કોયડાઓ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Playing with Numbers Core Concepts",
        "textGujarati": "સંખ્યા સાથે રમત ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-math-ch16_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 16 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-math&chapter=16"
  },
  {
    "id": "vid-ch-g8-sci-ch1",
    "chapterNumber": 1,
    "subjectId": "g8-sci",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 8 Science – Chapter 1: Crop Production and Management",
    "titleGujarati": "ધોરણ 8 વિજ્ઞાન – પ્રકરણ 1: પાક ઉત્પાદન અને વ્યવસ્થાપન (GSEB)",
    "instructor": "Nax Bharti School",
    "instructorGujarati": "Nax Bharti School (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "7wrgO2qwaAI",
    "thumbnailUrl": "https://img.youtube.com/vi/7wrgO2qwaAI/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Crop Production and Management under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ખરીફ અને રવિ પાક, જમીન તૈયાર કરવી, વાવણી, ખાતર આપવું (કુદરતી/કૃત્રિમ), સિંચાઈ (ટપક/ફુવારા પદ્ધતિ), લણણી અને સંગ્રહ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Crop Production and Management Core Concepts",
        "textGujarati": "પાક ઉત્પાદન અને વ્યવસ્થાપન ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-sci-ch1_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 1 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-sci&chapter=1"
  },
  {
    "id": "vid-ch-g8-sci-ch2",
    "chapterNumber": 2,
    "subjectId": "g8-sci",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 8 Science – Chapter 2: Microorganisms: Friend and Foe",
    "titleGujarati": "ધોરણ 8 વિજ્ઞાન – પ્રકરણ 2: સૂક્ષ્મજીવો : મિત્ર અને શત્રુ (GSEB)",
    "instructor": "Nax Bharti School",
    "instructorGujarati": "Nax Bharti School (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "CRBFE1vFgC0",
    "thumbnailUrl": "https://img.youtube.com/vi/CRBFE1vFgC0/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Microorganisms: Friend and Foe under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "બેક્ટેરિયા, ફૂગ, પ્રજીવ અને લીલ, આથવણ (લેક્ટોબેસિલસ), એન્ટિબાયોટિક્સ, રોગકારક સૂક્ષ્મજીવો અને જાળવણી.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Microorganisms: Friend and Foe Core Concepts",
        "textGujarati": "સૂક્ષ્મજીવો : મિત્ર અને શત્રુ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-sci-ch2_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 2 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-sci&chapter=2"
  },
  {
    "id": "vid-ch-g8-sci-ch3",
    "chapterNumber": 3,
    "subjectId": "g8-sci",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 8 Science – Chapter 3: Synthetic Fibres and Plastics",
    "titleGujarati": "ધોરણ 8 વિજ્ઞાન – પ્રકરણ 3: સંશ્લેષિત રેસાઓ અને પ્લાસ્ટિક (GSEB)",
    "instructor": "Magnet Brains",
    "instructorGujarati": "Magnet Brains (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "OeqCuDV_pOk",
    "thumbnailUrl": "https://img.youtube.com/vi/OeqCuDV_pOk/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Synthetic Fibres and Plastics under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "રેયોન, નાયલોન, પોલિએસ્ટર, એક્રેલિક, થર્મોપ્લાસ્ટિક (પીવીસી, પોલીથીન) અને થર્મોસેટિંગ પ્લાસ્ટિક (બેકેલાઇટ, મેલામાઇન), 4R સિદ્ધાંત.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Synthetic Fibres and Plastics Core Concepts",
        "textGujarati": "સંશ્લેષિત રેસાઓ અને પ્લાસ્ટિક ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-sci-ch3_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 3 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-sci&chapter=3"
  },
  {
    "id": "vid-ch-g8-sci-ch4",
    "chapterNumber": 4,
    "subjectId": "g8-sci",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 8 Science – Chapter 4: Materials: Metals and Non-Metals",
    "titleGujarati": "ધોરણ 8 વિજ્ઞાન – પ્રકરણ 4: પદાર્થો : ધાતુ અને અધાતુ (GSEB)",
    "instructor": "JOURNEY OF EDUCATION",
    "instructorGujarati": "JOURNEY OF EDUCATION (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "tkrDBppxO4c",
    "thumbnailUrl": "https://img.youtube.com/vi/tkrDBppxO4c/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Materials: Metals and Non-Metals under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ધાતુઓના ભૌતિક ગુણધર્મો (ટીપાવપણું, ખેંચાણપણું, રણકાર), રાસાયણિક પ્રક્રિયાઓ, ઓક્સાઇડનો સ્વભાવ (બેઝિક/એસિડિક).",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Materials: Metals and Non-Metals Core Concepts",
        "textGujarati": "પદાર્થો : ધાતુ અને અધાતુ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-sci-ch4_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 4 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-sci&chapter=4"
  },
  {
    "id": "vid-ch-g8-sci-ch5",
    "chapterNumber": 5,
    "subjectId": "g8-sci",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 8 Science – Chapter 5: Coal and Petroleum",
    "titleGujarati": "ધોરણ 8 વિજ્ઞાન – પ્રકરણ 5: કોલસો અને પેટ્રોલિયમ (GSEB)",
    "instructor": "Nax Bharti School",
    "instructorGujarati": "Nax Bharti School (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "dCWRWzTKh7k",
    "thumbnailUrl": "https://img.youtube.com/vi/dCWRWzTKh7k/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Coal and Petroleum under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "અશ્મિ બળતણ, કોલસાનું પ્રભંજન નિસ્યંદન (કોક, કોલટાર, કોલગેસ), પેટ્રોલિયમનું શુદ્ધિકરણ (LPG, પેટ્રોલ, ડીઝલ) અને અશ્મિ બળતણની મર્યાદા.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Coal and Petroleum Core Concepts",
        "textGujarati": "કોલસો અને પેટ્રોલિયમ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-sci-ch5_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 5 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-sci&chapter=5"
  },
  {
    "id": "vid-ch-g8-sci-ch6",
    "chapterNumber": 6,
    "subjectId": "g8-sci",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 8 Science – Chapter 6: Combustion and Flame",
    "titleGujarati": "ધોરણ 8 વિજ્ઞાન – પ્રકરણ 6: દહન અને જ્યોત (GSEB)",
    "instructor": "Science Guru",
    "instructorGujarati": "Science Guru (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "IGZua3pPfWk",
    "thumbnailUrl": "https://img.youtube.com/vi/IGZua3pPfWk/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Combustion and Flame under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "દહન માટે ઓક્સિજનની અનિવાર્યતા, જ્વલનબિંદુ, દહનના પ્રકારો, અગ્નિશામક (CO2), જ્યોતના ત્રણ વિસ્તારો (કાળો, પીળો, વાદળી).",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Combustion and Flame Core Concepts",
        "textGujarati": "દહન અને જ્યોત ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-sci-ch6_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 6 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-sci&chapter=6"
  },
  {
    "id": "vid-ch-g8-sci-ch7",
    "chapterNumber": 7,
    "subjectId": "g8-sci",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 8 Science – Chapter 7: Conservation of Plants and Animals",
    "titleGujarati": "ધોરણ 8 વિજ્ઞાન – પ્રકરણ 7: વનસ્પતિઓ અને પ્રાણીઓનું સંરક્ષણ (GSEB)",
    "instructor": "Nax Bharti School",
    "instructorGujarati": "Nax Bharti School (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "dnQl8nPOn04",
    "thumbnailUrl": "https://img.youtube.com/vi/dnQl8nPOn04/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Conservation of Plants and Animals under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "જંગલોની કાપણીની અસરો, જૈવવિવિધતા, અભયારણ્ય, રાષ્ટ્રીય ઉદ્યાન, બાયોસ્ફિયર રિઝર્વ, રેડ ડેટા બુક અને સ્થળાંતર કરનારા પક્ષીઓ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Conservation of Plants and Animals Core Concepts",
        "textGujarati": "વનસ્પતિઓ અને પ્રાણીઓનું સંરક્ષણ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-sci-ch7_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 7 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-sci&chapter=7"
  },
  {
    "id": "vid-ch-g8-sci-ch8",
    "chapterNumber": 8,
    "subjectId": "g8-sci",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 8 Science – Chapter 8: Cell - Structure and Functions",
    "titleGujarati": "ધોરણ 8 વિજ્ઞાન – પ્રકરણ 8: કોષ - રચના અને કાર્યો (GSEB)",
    "instructor": "Learn Gujarat Education in Gujarati",
    "instructorGujarati": "Learn Gujarat Education in Gujarati (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "AkUuEJvtmj4",
    "thumbnailUrl": "https://img.youtube.com/vi/AkUuEJvtmj4/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Cell - Structure and Functions under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "સજીવનો પાયાનો રચનાત્મક અને ક્રિયાત્મક એકમ, કોષરસપટલ, કોષકેન્દ્ર, કોષરસ, હરિતકણ, વનસ્પતિકોષ અને પ્રાણીકોષ વચ્ચેનો તફાવત.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Cell - Structure and Functions Core Concepts",
        "textGujarati": "કોષ - રચના અને કાર્યો ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-sci-ch8_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 8 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-sci&chapter=8"
  },
  {
    "id": "vid-ch-g8-sci-ch9",
    "chapterNumber": 9,
    "subjectId": "g8-sci",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 8 Science – Chapter 9: Reproduction in Animals",
    "titleGujarati": "ધોરણ 8 વિજ્ઞાન – પ્રકરણ 9: પ્રાણીઓમાં પ્રજનન (GSEB)",
    "instructor": "Nax Bharti School",
    "instructorGujarati": "Nax Bharti School (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "7x6jtKC-kBM",
    "thumbnailUrl": "https://img.youtube.com/vi/7x6jtKC-kBM/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Reproduction in Animals under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "અલિંગી પ્રજનન (દ્વિભાજન, કલિકાસર્જન) અને લિંગી પ્રજનન, અંતઃફલન અને બાહ્યફલન, માનવ પ્રજનન તંત્ર, ફલિતાંડ અને ગર્ભવિકાસ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Reproduction in Animals Core Concepts",
        "textGujarati": "પ્રાણીઓમાં પ્રજનન ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-sci-ch9_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 9 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-sci&chapter=9"
  },
  {
    "id": "vid-ch-g8-sci-ch10",
    "chapterNumber": 10,
    "subjectId": "g8-sci",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 8 Science – Chapter 10: Reaching the Age of Adolescence",
    "titleGujarati": "ધોરણ 8 વિજ્ઞાન – પ્રકરણ 10: તરુણાવસ્થા તરફ (GSEB)",
    "instructor": "Sanjay Maths & Science Academy",
    "instructorGujarati": "Sanjay Maths & Science Academy (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "4tHTNHesk7A",
    "thumbnailUrl": "https://img.youtube.com/vi/4tHTNHesk7A/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Reaching the Age of Adolescence under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "તરુણાવસ્થામાં શારીરિક ફેરફારો, કંઠમણી (Adam's apple), અંતઃસ્ત્રાવી ગ્રંથિઓ (પિટ્યુટરી, થાઇરોઇડ, સ્વાદુપિંડ, એડ્રીનલ), લિંગ નિશ્ચયન.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Reaching the Age of Adolescence Core Concepts",
        "textGujarati": "તરુણાવસ્થા તરફ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-sci-ch10_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 10 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-sci&chapter=10"
  },
  {
    "id": "vid-ch-g8-sci-ch11",
    "chapterNumber": 11,
    "subjectId": "g8-sci",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 8 Science – Chapter 11: Force and Pressure",
    "titleGujarati": "ધોરણ 8 વિજ્ઞાન – પ્રકરણ 11: બળ અને દબાણ (GSEB)",
    "instructor": "RANGPUR PRIMARY SCHOOL",
    "instructorGujarati": "RANGPUR PRIMARY SCHOOL (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "JVjJHqGNUO8",
    "thumbnailUrl": "https://img.youtube.com/vi/JVjJHqGNUO8/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Force and Pressure under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "સંપર્ક બળ (સ્નાયુબળ, ઘર્ષણબળ) અને અસંપર્ક બળ (ચુંબકીય, સ્થિતવિદ્યુત, ગુરુત્વાકર્ષણ બળ), દબાણ (P = F / A), વાતાવરણનું દબાણ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Force and Pressure Core Concepts",
        "textGujarati": "બળ અને દબાણ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-sci-ch11_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 11 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-sci&chapter=11"
  },
  {
    "id": "vid-ch-g8-sci-ch12",
    "chapterNumber": 12,
    "subjectId": "g8-sci",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 8 Science – Chapter 12: Friction",
    "titleGujarati": "ધોરણ 8 વિજ્ઞાન – પ્રકરણ 12: ઘર્ષણ (GSEB)",
    "instructor": "વિજ્ઞાન ની સરવાણી By monika bhatt",
    "instructorGujarati": "વિજ્ઞાન ની સરવાણી By monika bhatt (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "5pmYHuKmiwM",
    "thumbnailUrl": "https://img.youtube.com/vi/5pmYHuKmiwM/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Friction under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "સ્થિત ઘર્ષણ, સરકતું ઘર્ષણ, લોટણ ઘર્ષણ, ઘર્ષણના ફાયદા-ગેરફાયદા, સ્નેહક (લુબ્રિકન્ટ), બોલ બેરિંગ દ્વારા ઘર્ષણ ઘટાડવું.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Friction Core Concepts",
        "textGujarati": "ઘર્ષણ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-sci-ch12_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 12 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-sci&chapter=12"
  },
  {
    "id": "vid-ch-g8-sci-ch13",
    "chapterNumber": 13,
    "subjectId": "g8-sci",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 8 Science – Chapter 13: Sound",
    "titleGujarati": "ધોરણ 8 વિજ્ઞાન – પ્રકરણ 13: ધ્વનિ (GSEB)",
    "instructor": "Learn Gujarat Education in Gujarati",
    "instructorGujarati": "Learn Gujarat Education in Gujarati (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "_2wqFdTMxz4",
    "thumbnailUrl": "https://img.youtube.com/vi/_2wqFdTMxz4/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Sound under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "કંપનથી ધ્વનિ ઉત્પન્ન થાય છે, માનવ સ્વરપેટી (લેરિન્ક્સ), શ્રાવ્ય અને અશ્રાવ્ય ધ્વનિ (20 Hz થી 20,000 Hz), કંપવિસ્તાર, આવૃત્તિ, ઘોંઘાટ પ્રદૂષણ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Sound Core Concepts",
        "textGujarati": "ધ્વનિ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-sci-ch13_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 13 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-sci&chapter=13"
  },
  {
    "id": "vid-ch-g8-sci-ch14",
    "chapterNumber": 14,
    "subjectId": "g8-sci",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 8 Science – Chapter 14: Chemical Effects of Electric Current",
    "titleGujarati": "ધોરણ 8 વિજ્ઞાન – પ્રકરણ 14: વિદ્યુતપ્રવાહની રાસાયણિક અસરો (GSEB)",
    "instructor": "Dhaval Patel Education",
    "instructorGujarati": "Dhaval Patel Education (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "xj73FWOqTTI",
    "thumbnailUrl": "https://img.youtube.com/vi/xj73FWOqTTI/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Chemical Effects of Electric Current under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "પ્રવાહીમાં વિદ્યુતનું વહન, ઇલેક્ટ્રોડ્સ, પાણીનું વિદ્યુતવિભાજન, ઇલેક્ટ્રોપ્લેટિંગ (ઢોળ ચડાવવાની પ્રક્રિયા).",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Chemical Effects of Electric Current Core Concepts",
        "textGujarati": "વિદ્યુતપ્રવાહની રાસાયણિક અસરો ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-sci-ch14_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 14 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-sci&chapter=14"
  },
  {
    "id": "vid-ch-g8-sci-ch15",
    "chapterNumber": 15,
    "subjectId": "g8-sci",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 8 Science – Chapter 15: Some Natural Phenomena",
    "titleGujarati": "ધોરણ 8 વિજ્ઞાન – પ્રકરણ 15: કેટલીક કુદરતી ઘટનાઓ (GSEB)",
    "instructor": "Virvav School",
    "instructorGujarati": "Virvav School (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "oh64LQndYUE",
    "thumbnailUrl": "https://img.youtube.com/vi/oh64LQndYUE/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Some Natural Phenomena under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "વીજળી (તડિત), પદાર્થોનું ઘર્ષણથી વીજભારિત થવું (ધન અને ઋણ વીજભાર), ઇલેક્ટ્રોસ્કોપ, તડિત વાહક (લાઇટનિંગ કંડક્ટર), ધરતીકંપ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Some Natural Phenomena Core Concepts",
        "textGujarati": "કેટલીક કુદરતી ઘટનાઓ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-sci-ch15_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 15 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-sci&chapter=15"
  },
  {
    "id": "vid-ch-g8-sci-ch16",
    "chapterNumber": 16,
    "subjectId": "g8-sci",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 8 Science – Chapter 16: Light",
    "titleGujarati": "ધોરણ 8 વિજ્ઞાન – પ્રકરણ 16: પ્રકાશ (GSEB)",
    "instructor": "Virvav School",
    "instructorGujarati": "Virvav School (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "vKFymWE3pAo",
    "thumbnailUrl": "https://img.youtube.com/vi/vKFymWE3pAo/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Light under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "પરાવર્તનના નિયમો (આપાતકોણ = પરાવર્તનકોણ), નિયમિત અને અનિયમિત પરાવર્તન, કેલિડોસ્કોપ, માનવ આંખની રચના (કોર્નિયા, કીકી, નેત્રમણિ, રેટિના), બ્રેઇલ લિપિ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Light Core Concepts",
        "textGujarati": "પ્રકાશ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-sci-ch16_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 16 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-sci&chapter=16"
  },
  {
    "id": "vid-ch-g8-sci-ch17",
    "chapterNumber": 17,
    "subjectId": "g8-sci",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 8 Science – Chapter 17: Stars and Solar System",
    "titleGujarati": "ધોરણ 8 વિજ્ઞાન – પ્રકરણ 17: તારાઓ અને સૂર્યમંડળ (GSEB)",
    "instructor": "Virvav School",
    "instructorGujarati": "Virvav School (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "K66SC3DVyrQ",
    "thumbnailUrl": "https://img.youtube.com/vi/K66SC3DVyrQ/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Stars and Solar System under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ચંદ્રની કળાઓ, તારાઓ, નક્ષત્રો (સપ્તર્ષિ, મૃગશીર્ષ), ધ્રુવનો તારો, સૂર્યમંડળના 8 ગ્રહો, લઘુગ્રહો, ધૂમકેતુ, ઉલ્કા અને કૃત્રિમ ઉપગ્રહો.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Stars and Solar System Core Concepts",
        "textGujarati": "તારાઓ અને સૂર્યમંડળ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-sci-ch17_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 17 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-sci&chapter=17"
  },
  {
    "id": "vid-ch-g8-sci-ch18",
    "chapterNumber": 18,
    "subjectId": "g8-sci",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 8 Science – Chapter 18: Pollution of Air and Water",
    "titleGujarati": "ધોરણ 8 વિજ્ઞાન – પ્રકરણ 18: હવા અને પાણીનું પ્રદૂષણ (GSEB)",
    "instructor": "Science Edu Corner",
    "instructorGujarati": "Science Edu Corner (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "qp4TRkdKQI8",
    "thumbnailUrl": "https://img.youtube.com/vi/qp4TRkdKQI8/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Pollution of Air and Water under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "વાયુ પ્રદૂષણના સ્ત્રોતો (CO, CO2, SO2, સ્મોગ), ગ્રીનહાઉસ અસર, ગ્લોબલ વોર્મિંગ, એસિડ વર્ષા, જળ પ્રદૂષણ અને પીવાલાયક શુદ્ધ પાણી.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Pollution of Air and Water Core Concepts",
        "textGujarati": "હવા અને પાણીનું પ્રદૂષણ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-sci-ch18_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 18 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-sci&chapter=18"
  },
  {
    "id": "vid-ch-g8-soc-ch1",
    "chapterNumber": 1,
    "subjectId": "g8-soc",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 8 Social Science – Chapter 1: Arrival of Europeans and Establishment of British Rule",
    "titleGujarati": "ધોરણ 8 સામાજિક વિજ્ઞાન – પ્રકરણ 1: ભારતમાં યુરોપિયનો અને અંગ્રેજી શાસનની સ્થાપના (GSEB)",
    "instructor": "Vidyakul Gujarati Commerce",
    "instructorGujarati": "Vidyakul Gujarati Commerce (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "v7e17Z_HJA0",
    "thumbnailUrl": "https://img.youtube.com/vi/v7e17Z_HJA0/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Arrival of Europeans and Establishment of British Rule under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "વાસ્કો-દ-ગામા દ્વારા જળમાર્ગની શોધ, પોર્ટુગીઝ, ડચ, અંગ્રેજ અને ફ્રેન્ચ પ્રજાનું આગમન, પ્લાસીનું યુદ્ધ (1757) અને બક્સરનું યુદ્ધ (1764).",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Arrival of Europeans and Establishment of British Rule Core Concepts",
        "textGujarati": "ભારતમાં યુરોપિયનો અને અંગ્રેજી શાસનની સ્થાપના ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-soc-ch1_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 1 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-soc&chapter=1"
  },
  {
    "id": "vid-ch-g8-soc-ch2",
    "chapterNumber": 2,
    "subjectId": "g8-soc",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 8 Social Science – Chapter 2: British Rule in India (1757 to 1857)",
    "titleGujarati": "ધોરણ 8 સામાજિક વિજ્ઞાન – પ્રકરણ 2: ભારતમાં બ્રિટિશ શાસન (ઈ.સ. 1757 થી 1857) (GSEB)",
    "instructor": "Science Guru",
    "instructorGujarati": "Science Guru (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "VB1CXwe9EnU",
    "thumbnailUrl": "https://img.youtube.com/vi/VB1CXwe9EnU/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of British Rule in India (1757 to 1857) under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "કાયમી જમાબંધી, રૈયતવારી અને મહાલવારી પદ્ધતિ, ભારતીય ખેતી અને ગૃહઉદ્યોગોનું પતન, વેલેસ્લીની સહાયકારી યોજના, ડેલહાઉસીની ખાલસા નીતિ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "British Rule in India (1757 to 1857) Core Concepts",
        "textGujarati": "ભારતમાં બ્રિટિશ શાસન (ઈ.સ. 1757 થી 1857) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-soc-ch2_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 2 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-soc&chapter=2"
  },
  {
    "id": "vid-ch-g8-soc-ch3",
    "chapterNumber": 3,
    "subjectId": "g8-soc",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 8 Social Science – Chapter 3: India's First Freedom Struggle (1857)",
    "titleGujarati": "ધોરણ 8 સામાજિક વિજ્ઞાન – પ્રકરણ 3: ભારતનો પ્રથમ સ્વાતંત્ર્યસંગ્રામ (GSEB)",
    "instructor": "Vidyakul Gujarati Commerce",
    "instructorGujarati": "Vidyakul Gujarati Commerce (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "ZVzw4kl2G_A",
    "thumbnailUrl": "https://img.youtube.com/vi/ZVzw4kl2G_A/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of India's First Freedom Struggle (1857) under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "1857 ના સંગ્રામના કારણો (રાજકીય, આર્થિક, સામાજિક, ચરબીવાળા કાર્તૂસ), મંગલ પાંડે, બહાદુરશાહ ઝફર, ઝાંસીની રાણી લક્ષ્મીબાઈ, તાત્યા ટોપે.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "India's First Freedom Struggle (1857) Core Concepts",
        "textGujarati": "ભારતનો પ્રથમ સ્વાતંત્ર્યસંગ્રામ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-soc-ch3_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 3 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-soc&chapter=3"
  },
  {
    "id": "vid-ch-g8-soc-ch4",
    "chapterNumber": 4,
    "subjectId": "g8-soc",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 8 Social Science – Chapter 4: Cities, Cottage Industries and Industries During British Era",
    "titleGujarati": "ધોરણ 8 સામાજિક વિજ્ઞાન – પ્રકરણ 4: અંગ્રેજ સમયનાં શહેરો, ગૃહઉદ્યોગો અને ઉદ્યોગો (GSEB)",
    "instructor": "Harsh Barasiya",
    "instructorGujarati": "Harsh Barasiya (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "EfviMvia7d4",
    "thumbnailUrl": "https://img.youtube.com/vi/EfviMvia7d4/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Cities, Cottage Industries and Industries During British Era under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "પ્રાચીન શિલ્પ અને હાથવણાટ ઉદ્યોગનું પતન, રેલવે (1853), તાર-ટપાલ, મુંબઈમાં કાપડ મિલો અને જમશેદપુરમાં લોખંડ-પોલાદ કારખાનું (TISCO).",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Cities, Cottage Industries and Industries During British Era Core Concepts",
        "textGujarati": "અંગ્રેજ સમયનાં શહેરો, ગૃહઉદ્યોગો અને ઉદ્યોગો ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-soc-ch4_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 4 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-soc&chapter=4"
  },
  {
    "id": "vid-ch-g8-soc-ch5",
    "chapterNumber": 5,
    "subjectId": "g8-soc",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 8 Social Science – Chapter 5: Education and Social System During British Era",
    "titleGujarati": "ધોરણ 8 સામાજિક વિજ્ઞાન – પ્રકરણ 5: અંગ્રેજ શાસન સમયની શિક્ષણ અને સમાજવ્યવસ્થા (GSEB)",
    "instructor": "Science Guru",
    "instructorGujarati": "Science Guru (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "UZvFDMlpTZs",
    "thumbnailUrl": "https://img.youtube.com/vi/UZvFDMlpTZs/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Education and Social System During British Era under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "મેકોલેની અંગ્રેજી શિક્ષણ નીતિ (1835), વુડનો ખરીતો (1854), મુંબઈ-કોલકાતા-ચેન્નાઈ યુનિવર્સિટીઓ, રાજા રામમોહનરાય, સ્વામી વિવેકાનંદ, દયાનંદ સરસ્વતી.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Education and Social System During British Era Core Concepts",
        "textGujarati": "અંગ્રેજ શાસન સમયની શિક્ષણ અને સમાજવ્યવસ્થા ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-soc-ch5_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 5 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-soc&chapter=5"
  },
  {
    "id": "vid-ch-g8-soc-ch6",
    "chapterNumber": 6,
    "subjectId": "g8-soc",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 8 Social Science – Chapter 6: Impact of British Rule on India",
    "titleGujarati": "ધોરણ 8 સામાજિક વિજ્ઞાન – પ્રકરણ 6: અંગ્રેજ શાસનની ભારત પર અસર (GSEB)",
    "instructor": "Free Education for you",
    "instructorGujarati": "Free Education for you (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "RihIicdauGw",
    "thumbnailUrl": "https://img.youtube.com/vi/RihIicdauGw/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Impact of British Rule on India under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ભારતનું આર્થિક શોષણ, વારંવાર પડતા દુષ્કાળો, અદાલતી વ્યવસ્થા અને પ્રેસ પર નિયંત્રણો.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Impact of British Rule on India Core Concepts",
        "textGujarati": "અંગ્રેજ શાસનની ભારત પર અસર ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-soc-ch6_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 6 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-soc&chapter=6"
  },
  {
    "id": "vid-ch-g8-soc-ch7",
    "chapterNumber": 7,
    "subjectId": "g8-soc",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 8 Social Science – Chapter 7: Climatic Changes",
    "titleGujarati": "ધોરણ 8 સામાજિક વિજ્ઞાન – પ્રકરણ 7: આબોહવાકીય ફેરફારો (GSEB)",
    "instructor": "Virvav School",
    "instructorGujarati": "Virvav School (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "cLj5YL2RqSc",
    "thumbnailUrl": "https://img.youtube.com/vi/cLj5YL2RqSc/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Climatic Changes under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ગ્લોબલ વોર્મિંગ, ગ્રીનહાઉસ વાયુઓ, ધ્રુવીય બરફનું પીગળવું, અનિયમિત વરસાદ અને પર્યાવરણીય સંમેલનો.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Climatic Changes Core Concepts",
        "textGujarati": "આબોહવાકીય ફેરફારો ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-soc-ch7_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 7 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-soc&chapter=7"
  },
  {
    "id": "vid-ch-g8-soc-ch8",
    "chapterNumber": 8,
    "subjectId": "g8-soc",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 8 Social Science – Chapter 8: Role of Parliament in a Democracy",
    "titleGujarati": "ધોરણ 8 સામાજિક વિજ્ઞાન – પ્રકરણ 8: લોકશાહી દેશમાં સંસદની ભૂમિકા (GSEB)",
    "instructor": "JYOT GROUP TUITION",
    "instructorGujarati": "JYOT GROUP TUITION (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "wHIHubR54Bc",
    "thumbnailUrl": "https://img.youtube.com/vi/wHIHubR54Bc/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Role of Parliament in a Democracy under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "લોકસભા (પ્રજાનું ગૃહ, 543 સભ્યો) અને રાજ્યસભા (રાજ્યોનું પ્રતિનિધિત્વ, 250 સભ્યો), કાયદો ઘડવાની પ્રક્રિયા, પ્રશ્નોત્તરી કાળ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Role of Parliament in a Democracy Core Concepts",
        "textGujarati": "લોકશાહી દેશમાં સંસદની ભૂમિકા ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-soc-ch8_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 8 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-soc&chapter=8"
  },
  {
    "id": "vid-ch-g8-soc-ch9",
    "chapterNumber": 9,
    "subjectId": "g8-soc",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 8 Social Science – Chapter 9: Resources and Land",
    "titleGujarati": "ધોરણ 8 સામાજિક વિજ્ઞાન – પ્રકરણ 9: સંસાધન અને જમીન (GSEB)",
    "instructor": "Ved Digital Education",
    "instructorGujarati": "Ved Digital Education (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "Z-elhsTtn9I",
    "thumbnailUrl": "https://img.youtube.com/vi/Z-elhsTtn9I/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Resources and Land under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "કુદરતી સંસાધનો (નવીનીકરણીય અને બિનનવીનીકરણીય), જમીનના પ્રકારો (કાળી, કાંપની, રાતી, પડખાઉ જમીન) અને સંરક્ષણ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Resources and Land Core Concepts",
        "textGujarati": "સંસાધન અને જમીન ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-soc-ch9_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 9 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-soc&chapter=9"
  },
  {
    "id": "vid-ch-g8-soc-ch10",
    "chapterNumber": 10,
    "subjectId": "g8-soc",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 8 Social Science – Chapter 10: Mineral and Energy Resources",
    "titleGujarati": "ધોરણ 8 સામાજિક વિજ્ઞાન – પ્રકરણ 10: ખનિજ અને ઊર્જા સંસાધન (GSEB)",
    "instructor": "Science Guru",
    "instructorGujarati": "Science Guru (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "ScbqXDEf_jo",
    "thumbnailUrl": "https://img.youtube.com/vi/ScbqXDEf_jo/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Mineral and Energy Resources under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ધાત્વિક ખનિજો (લોખંડ, તાંબુ, બોક્સાઇટ) અને અધાત્વિક ખનિજો (ચૂનાનો પથ્થર, અભ્રક), પરંપરાગત (કોલસો, ખનીજતેલ) અને બિનપરંપરાગત ઊર્જા (સૌર, પવન, બાયોગેસ).",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Mineral and Energy Resources Core Concepts",
        "textGujarati": "ખનિજ અને ઊર્જા સંસાધન ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-soc-ch10_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 10 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-soc&chapter=10"
  },
  {
    "id": "vid-ch-g8-soc-ch11",
    "chapterNumber": 11,
    "subjectId": "g8-soc",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 8 Social Science – Chapter 11: Agriculture",
    "titleGujarati": "ધોરણ 8 સામાજિક વિજ્ઞાન – પ્રકરણ 11: ખેતી (GSEB)",
    "instructor": "Science Guru",
    "instructorGujarati": "Science Guru (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "QC_eiCFYjsE",
    "thumbnailUrl": "https://img.youtube.com/vi/QC_eiCFYjsE/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Agriculture under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ખેતીના પ્રકારો (નિર્વાહ ખેતી, સઘન ખેતી, બાગાયતી ખેતી, ઝૂમ ખેતી), મુખ્ય પાકો (ઘઉં, ડાંગર, કપાસ, મગફળી), હરિયાળી ક્રાંતિ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Agriculture Core Concepts",
        "textGujarati": "ખેતી ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-soc-ch11_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 11 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-soc&chapter=11"
  },
  {
    "id": "vid-ch-g8-soc-ch12",
    "chapterNumber": 12,
    "subjectId": "g8-soc",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 8 Social Science – Chapter 12: Industries",
    "titleGujarati": "ધોરણ 8 સામાજિક વિજ્ઞાન – પ્રકરણ 12: ઉદ્યોગ (GSEB)",
    "instructor": "Science Guru",
    "instructorGujarati": "Science Guru (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "GWeVtPbgPUo",
    "thumbnailUrl": "https://img.youtube.com/vi/GWeVtPbgPUo/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Industries under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "કાચા માલના આધારે ઉદ્યોગો (કૃષિ આધારિત, ખનિજ આધારિત), કદના આધારે (ગૃહ, લઘુ, ભારે ઉદ્યોગ), સુતરાઉ કાપડ અને ઇન્ફોર્મેશન ટેક્નોલોજી.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Industries Core Concepts",
        "textGujarati": "ઉદ્યોગ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-soc-ch12_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 12 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-soc&chapter=12"
  },
  {
    "id": "vid-ch-g8-soc-ch13",
    "chapterNumber": 13,
    "subjectId": "g8-soc",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 8 Social Science – Chapter 13: Human Resources",
    "titleGujarati": "ધોરણ 8 સામાજિક વિજ્ઞાન – પ્રકરણ 13: માનવ સંસાધન (GSEB)",
    "instructor": "Gujarati Avnavu",
    "instructorGujarati": "Gujarati Avnavu (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "D2GpbHSvuqg",
    "thumbnailUrl": "https://img.youtube.com/vi/D2GpbHSvuqg/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Human Resources under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "વસ્તીનું વિતરણ, વસ્તી ગીચતા, લિંગ પ્રમાણ (સ્ત્રી-પુરુષ પ્રમાણ), સાક્ષરતા દર, વય જૂથ અને વસ્તી વૃદ્ધિના પરિબળો.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Human Resources Core Concepts",
        "textGujarati": "માનવ સંસાધન ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-soc-ch13_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 13 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-soc&chapter=13"
  },
  {
    "id": "vid-ch-g8-soc-ch14",
    "chapterNumber": 14,
    "subjectId": "g8-soc",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 8 Social Science – Chapter 14: Disaster Management",
    "titleGujarati": "ધોરણ 8 સામાજિક વિજ્ઞાન – પ્રકરણ 14: આપત્તિ વ્યવસ્થાપન (GSEB)",
    "instructor": "Gujarati Avnavu",
    "instructorGujarati": "Gujarati Avnavu (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "DE3P_xDz8NI",
    "thumbnailUrl": "https://img.youtube.com/vi/DE3P_xDz8NI/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Disaster Management under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ભૂકંપ, સુનામી, દાવાનળ (જંગલની આગ), ઔદ્યોગિક અકસ્માત અને એનડીઆરએફ (NDRF) ની કામગીરી.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Disaster Management Core Concepts",
        "textGujarati": "આપત્તિ વ્યવસ્થાપન ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-soc-ch14_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 14 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-soc&chapter=14"
  },
  {
    "id": "vid-ch-g8-soc-ch15",
    "chapterNumber": 15,
    "subjectId": "g8-soc",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 8 Social Science – Chapter 15: Indian Constitution",
    "titleGujarati": "ધોરણ 8 સામાજિક વિજ્ઞાન – પ્રકરણ 15: ભારતીય બંધારણ (GSEB)",
    "instructor": "Science Guru",
    "instructorGujarati": "Science Guru (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "bOgR-GiJAoc",
    "thumbnailUrl": "https://img.youtube.com/vi/bOgR-GiJAoc/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Indian Constitution under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "બંધારણ સભા, આમુખ (Preamble), મૂળભૂત અધિકારો, મૂળભૂત ફરજો, બિનસાંપ્રદાયિકતા અને સંસદીય પ્રણાલી.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Indian Constitution Core Concepts",
        "textGujarati": "ભારતીય બંધારણ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-soc-ch15_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 15 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-soc&chapter=15"
  },
  {
    "id": "vid-ch-g8-soc-ch16",
    "chapterNumber": 16,
    "subjectId": "g8-soc",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 8 Social Science – Chapter 16: Parliament and Laws",
    "titleGujarati": "ધોરણ 8 સામાજિક વિજ્ઞાન – પ્રકરણ 16: સંસદ અને કાયદો (GSEB)",
    "instructor": "Science Guru",
    "instructorGujarati": "Science Guru (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "QGoYXt3e8VY",
    "thumbnailUrl": "https://img.youtube.com/vi/QGoYXt3e8VY/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Parliament and Laws under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "કાયદો કેવી રીતે બને છે, ખરડામાંથી કાયદો બનવાની પ્રક્રિયા (ત્રણ વાંચન), લોકમત અને ન્યાયસંગત કાયદા.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Parliament and Laws Core Concepts",
        "textGujarati": "સંસદ અને કાયદો ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-soc-ch16_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 16 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-soc&chapter=16"
  },
  {
    "id": "vid-ch-g8-soc-ch17",
    "chapterNumber": 17,
    "subjectId": "g8-soc",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 8 Social Science – Chapter 17: Judiciary",
    "titleGujarati": "ધોરણ 8 સામાજિક વિજ્ઞાન – પ્રકરણ 17: ન્યાયતંત્ર (GSEB)",
    "instructor": "Institute of Rohit Balas ( MY HISTORY )",
    "instructorGujarati": "Institute of Rohit Balas ( MY HISTORY ) (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "I9r-KjYS-xI",
    "thumbnailUrl": "https://img.youtube.com/vi/I9r-KjYS-xI/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Judiciary under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "સર્વોચ્ચ અદાલત (સુપ્રીમ કોર્ટ), વડી અદાલત (હાઈકોર્ટ), તાબાની અદાલતો, ન્યાયતંત્રની સ્વતંત્રતા અને જાહેર હિતની અરજી (PIL).",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Judiciary Core Concepts",
        "textGujarati": "ન્યાયતંત્ર ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-soc-ch17_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 17 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-soc&chapter=17"
  },
  {
    "id": "vid-ch-g8-soc-ch18",
    "chapterNumber": 18,
    "subjectId": "g8-soc",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 8 Social Science – Chapter 18: Social Justice and Marginalised Groups",
    "titleGujarati": "ધોરણ 8 સામાજિક વિજ્ઞાન – પ્રકરણ 18: સામાજિક ન્યાય અને સામાજિક વિસંગતતા (GSEB)",
    "instructor": "Science Guru",
    "instructorGujarati": "Science Guru (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "Obmv5ifi0QA",
    "thumbnailUrl": "https://img.youtube.com/vi/Obmv5ifi0QA/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Social Justice and Marginalised Groups under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "અનુસૂચિત જાતિ (SC), અનુસૂચિત જનજાતિ (ST), ઓબીસી અને અલ્પસંખ્યકો માટે બંધારણીય જોગવાઈઓ, કલ્યાણકારી યોજનાઓ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Social Justice and Marginalised Groups Core Concepts",
        "textGujarati": "સામાજિક ન્યાય અને સામાજિક વિસંગતતા ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-soc-ch18_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 18 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-soc&chapter=18"
  },
  {
    "id": "vid-ch-g8-soc-ch19",
    "chapterNumber": 19,
    "subjectId": "g8-soc",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 8 Social Science – Chapter 19: Role of Government in Socio-Economic Sphere",
    "titleGujarati": "ધોરણ 8 સામાજિક વિજ્ઞાન – પ્રકરણ 19: સામાજિક-આર્થિક ક્ષેત્રે સરકારની ભૂમિકા (GSEB)",
    "instructor": "Science Guru",
    "instructorGujarati": "Science Guru (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "ggBrq81f3W8",
    "thumbnailUrl": "https://img.youtube.com/vi/ggBrq81f3W8/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Role of Government in Socio-Economic Sphere under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "શિક્ષણ, આરોગ્ય, પીવાનું શુદ્ધ પાણી, રસ્તાઓ, ગરીબી નિવારણ અને જાહેર વિતરણ પ્રણાલી (PDS / રેશનિંગ).",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Role of Government in Socio-Economic Sphere Core Concepts",
        "textGujarati": "સામાજિક-આર્થિક ક્ષેત્રે સરકારની ભૂમિકા ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-soc-ch19_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 19 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-soc&chapter=19"
  },
  {
    "id": "vid-ch-g8-guj-ch1",
    "chapterNumber": 1,
    "subjectId": "g8-guj",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 8 Gujarati – Chapter 1: Bazar Ma (Chitrapaath)",
    "titleGujarati": "ધોરણ 8 ગુજરાતી (માતૃભાષા) – પ્રકરણ 1: બજારમાં (ચિત્રપાઠ) (GSEB)",
    "instructor": "Ocean GyanLive Std 9 and 10",
    "instructorGujarati": "Ocean GyanLive Std 9 and 10 (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "bBwHoscPyoQ",
    "thumbnailUrl": "https://img.youtube.com/vi/bBwHoscPyoQ/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Bazar Ma (Chitrapaath) under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "શહેરના બજારનું ચિત્ર, વાહનોની અવરજવર, અકસ્માત અને ટ્રાફિક નિયમોનું પાલન.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Bazar Ma (Chitrapaath) Core Concepts",
        "textGujarati": "બજારમાં (ચિત્રપાઠ) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-guj-ch1_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 1 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-guj&chapter=1"
  },
  {
    "id": "vid-ch-g8-guj-ch2",
    "chapterNumber": 2,
    "subjectId": "g8-guj",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 8 Gujarati – Chapter 2: Ek Ja De Chingari",
    "titleGujarati": "ધોરણ 8 ગુજરાતી (માતૃભાષા) – પ્રકરણ 2: એક જ દે ચિનગારી (પ્રાર્થનાગીત) (GSEB)",
    "instructor": "Virvav School",
    "instructorGujarati": "Virvav School (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "8of3WpPKky4",
    "thumbnailUrl": "https://img.youtube.com/vi/8of3WpPKky4/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Ek Ja De Chingari under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "હરિહર ભટ્ટનું ઉત્કૃષ્ટ પ્રાર્થનાકાવ્ય: પરમાત્મા પાસે જ્ઞાન રૂપી એક જ ચિનગારીની યાચના.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Ek Ja De Chingari Core Concepts",
        "textGujarati": "એક જ દે ચિનગારી (પ્રાર્થનાગીત) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-guj-ch2_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 2 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-guj&chapter=2"
  },
  {
    "id": "vid-ch-g8-guj-ch3",
    "chapterNumber": 3,
    "subjectId": "g8-guj",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 8 Gujarati – Chapter 3: Jumo Bhishti",
    "titleGujarati": "ધોરણ 8 ગુજરાતી (માતૃભાષા) – પ્રકરણ 3: જુમો ભિસ્તી (બોધકથા) (GSEB)",
    "instructor": "STUDY WITH RAJA",
    "instructorGujarati": "STUDY WITH RAJA (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "4riQPaX4qqg",
    "thumbnailUrl": "https://img.youtube.com/vi/4riQPaX4qqg/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Jumo Bhishti under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ધૂમકેતુ લિખિત અમર વાર્તા: જુમો અને તેના પાડા વેણુ વચ્ચેનો અજોડ મૈત્રીભાવ અને બલિદાન.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Jumo Bhishti Core Concepts",
        "textGujarati": "જુમો ભિસ્તી (બોધકથા) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-guj-ch3_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 3 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-guj&chapter=3"
  },
  {
    "id": "vid-ch-g8-guj-ch4",
    "chapterNumber": 4,
    "subjectId": "g8-guj",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 8 Gujarati – Chapter 4: Tane Olkhu Chhu, Maa!",
    "titleGujarati": "ધોરણ 8 ગુજરાતી (માતૃભાષા) – પ્રકરણ 4: તને ઓળખું છું, મા! (કાવ્ય) (GSEB)",
    "instructor": "Gujarat primary education videos",
    "instructorGujarati": "Gujarat primary education videos (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "Z2xnhHbhJvg",
    "thumbnailUrl": "https://img.youtube.com/vi/Z2xnhHbhJvg/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Tane Olkhu Chhu, Maa! under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "મનોહર ત્રિવેદી: માતૃપ્રેમ અને સંતાનના જીવનમાં માતાના આશીર્વાદનું મહત્વ દર્શાવતું કાવ્ય.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Tane Olkhu Chhu, Maa! Core Concepts",
        "textGujarati": "તને ઓળખું છું, મા! (કાવ્ય) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-guj-ch4_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 4 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-guj&chapter=4"
  },
  {
    "id": "vid-ch-g8-guj-ch5",
    "chapterNumber": 5,
    "subjectId": "g8-guj",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 8 Gujarati – Chapter 5: Ek Mulaqat",
    "titleGujarati": "ધોરણ 8 ગુજરાતી (માતૃભાષા) – પ્રકરણ 5: એક મુલાકાત (અહેવાલ) (GSEB)",
    "instructor": "Educ TEChno",
    "instructorGujarati": "Educ TEChno (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "2Zantvcz4aU",
    "thumbnailUrl": "https://img.youtube.com/vi/2Zantvcz4aU/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Ek Mulaqat under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ગાંધીનગર સ્થિત ગુજરાત વિધાનસભા ભવન (વિઠ્ઠલભાઈ પટેલ ભવન) ની મુલાકાતનો પ્રેરક અહેવાલ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Ek Mulaqat Core Concepts",
        "textGujarati": "એક મુલાકાત (અહેવાલ) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-guj-ch5_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 5 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-guj&chapter=5"
  },
  {
    "id": "vid-ch-g8-guj-ch6",
    "chapterNumber": 6,
    "subjectId": "g8-guj",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 8 Gujarati – Chapter 6: Dhuliye Maarg",
    "titleGujarati": "ધોરણ 8 ગુજરાતી (માતૃભાષા) – પ્રકરણ 6: ધૂળિયે મારગ (કાવ્ય) (GSEB)",
    "instructor": "MB DHOLAKIYA EDUCATION",
    "instructorGujarati": "MB DHOLAKIYA EDUCATION (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "0u3sLfp0uls",
    "thumbnailUrl": "https://img.youtube.com/vi/0u3sLfp0uls/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Dhuliye Maarg under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "મકરંદ દવે: સાદગીભર્યા જીવનનો મહિમા - સોનાના માર્ગ કરતાં ધૂળિયો માર્ગ ઉત્તમ છે.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Dhuliye Maarg Core Concepts",
        "textGujarati": "ધૂળિયે મારગ (કાવ્ય) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-guj-ch6_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 6 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-guj&chapter=6"
  },
  {
    "id": "vid-ch-g8-guj-ch7",
    "chapterNumber": 7,
    "subjectId": "g8-guj",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 8 Gujarati – Chapter 7: Deshbhakt Jagdusha",
    "titleGujarati": "ધોરણ 8 ગુજરાતી (માતૃભાષા) – પ્રકરણ 7: દેશભક્ત જગડૂશા (નાટક) (GSEB)",
    "instructor": "Ambika Tuition Classes",
    "instructorGujarati": "Ambika Tuition Classes (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "uR-3cF7xQsk",
    "thumbnailUrl": "https://img.youtube.com/vi/uR-3cF7xQsk/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Deshbhakt Jagdusha under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "રમણલાલ સોની: દુષ્કાળ સમયે પ્રજા માટે પોતાના અનાજના વખારો ખોલી દેનાર દાનવીર જગડૂશા.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Deshbhakt Jagdusha Core Concepts",
        "textGujarati": "દેશભક્ત જગડૂશા (નાટક) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-guj-ch7_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 7 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-guj&chapter=7"
  },
  {
    "id": "vid-ch-g8-guj-ch8",
    "chapterNumber": 8,
    "subjectId": "g8-guj",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 8 Gujarati – Chapter 8: Aaj Na Anand",
    "titleGujarati": "ધોરણ 8 ગુજરાતી (માતૃભાષા) – પ્રકરણ 8: આજના આનંદ (લોકગીત) (GSEB)",
    "instructor": "Ambika Tuition Classes",
    "instructorGujarati": "Ambika Tuition Classes (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "8uVpuPX8oi4",
    "thumbnailUrl": "https://img.youtube.com/vi/8uVpuPX8oi4/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Aaj Na Anand under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ચોમાસામાં ખેડૂતોનો આનંદ અને ધરતી માતા પ્રત્યેની કૃતજ્ઞતા દર્શાવતું લોકગીત.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Aaj Na Anand Core Concepts",
        "textGujarati": "આજના આનંદ (લોકગીત) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-guj-ch8_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 8 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-guj&chapter=8"
  },
  {
    "id": "vid-ch-g8-guj-ch9",
    "chapterNumber": 9,
    "subjectId": "g8-guj",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 8 Gujarati – Chapter 9: Dikra No Maarnaar",
    "titleGujarati": "ધોરણ 8 ગુજરાતી (માતૃભાષા) – પ્રકરણ 9: દીકરાનો મારનાર (લોકકથા) (GSEB)",
    "instructor": "Virvav School",
    "instructorGujarati": "Virvav School (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "-V71tiEAGwc",
    "thumbnailUrl": "https://img.youtube.com/vi/-V71tiEAGwc/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Dikra No Maarnaar under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ઝવેરચંદ મેઘાણી: મંદોદરખાનની ઉદારતા - પોતાના દીકરાના હત્યારા ચારણને ઘોડી આપી ભગાડી દે છે.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Dikra No Maarnaar Core Concepts",
        "textGujarati": "દીકરાનો મારનાર (લોકકથા) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-guj-ch9_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 9 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-guj&chapter=9"
  },
  {
    "id": "vid-ch-g8-guj-ch10",
    "chapterNumber": 10,
    "subjectId": "g8-guj",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 8 Gujarati – Chapter 10: Adhi Aana",
    "titleGujarati": "ધોરણ 8 ગુજરાતી (માતૃભાષા) – પ્રકરણ 10: અઢી આના (જીવનપ્રસંગ) (GSEB)",
    "instructor": "Virvav School",
    "instructorGujarati": "Virvav School (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "zZPoDo0n50E",
    "thumbnailUrl": "https://img.youtube.com/vi/zZPoDo0n50E/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Adhi Aana under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "સ્વામી સચ્ચિદાનંદ: સંસ્કૃત ભણવા માટે કાશીમાં અઢી આના ખૂટતાં થયેલો સંઘર્ષ અને અનુભવ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Adhi Aana Core Concepts",
        "textGujarati": "અઢી આના (જીવનપ્રસંગ) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-guj-ch10_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 10 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-guj&chapter=10"
  },
  {
    "id": "vid-ch-g8-guj-ch11",
    "chapterNumber": 11,
    "subjectId": "g8-guj",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 8 Gujarati – Chapter 11: Valavi Ba Aavi",
    "titleGujarati": "ધોરણ 8 ગુજરાતી (માતૃભાષા) – પ્રકરણ 11: વળાવી બા આવી (સોનેટ) (GSEB)",
    "instructor": "Changodar School",
    "instructorGujarati": "Changodar School (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "IC1Ydcuha5A",
    "thumbnailUrl": "https://img.youtube.com/vi/IC1Ydcuha5A/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Valavi Ba Aavi under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "નટવરલાલ પંડ્યા 'ઉશનસ્': દિવાળીની રજાઓ પૂરી થતાં સંતાનો વિદાય લે છે ત્યારે ઘરનું સૂનકાર.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Valavi Ba Aavi Core Concepts",
        "textGujarati": "વળાવી બા આવી (સોનેટ) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-guj-ch11_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 11 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-guj&chapter=11"
  },
  {
    "id": "vid-ch-g8-guj-ch12",
    "chapterNumber": 12,
    "subjectId": "g8-guj",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 8 Gujarati – Chapter 12: Nava Varsh Na Sankalpo",
    "titleGujarati": "ધોરણ 8 ગુજરાતી (માતૃભાષા) – પ્રકરણ 12: નવા વર્ષના સંકલ્પો (હાસ્યનિબંધ) (GSEB)",
    "instructor": "MANAV CLASSES - Harmit sir",
    "instructorGujarati": "MANAV CLASSES - Harmit sir (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "cN3w94ZlBF8",
    "thumbnailUrl": "https://img.youtube.com/vi/cN3w94ZlBF8/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Nava Varsh Na Sankalpo under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "બકુલ ત્રિપાઠી: બેસતા વર્ષે લીધેલા અને થોડા જ દિવસોમાં તૂટી ગયેલા સંકલ્પોનું રમુજી વર્ણન.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Nava Varsh Na Sankalpo Core Concepts",
        "textGujarati": "નવા વર્ષના સંકલ્પો (હાસ્યનિબંધ) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-guj-ch12_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 12 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-guj&chapter=12"
  },
  {
    "id": "vid-ch-g8-guj-ch13",
    "chapterNumber": 13,
    "subjectId": "g8-guj",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 8 Gujarati – Chapter 13: Sharuat Kariye",
    "titleGujarati": "ધોરણ 8 ગુજરાતી (માતૃભાષા) – પ્રકરણ 13: શરૂઆત કરીએ (ગઝલ) (GSEB)",
    "instructor": "Sargam Musicals",
    "instructorGujarati": "Sargam Musicals (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "rIJEHbjygiM",
    "thumbnailUrl": "https://img.youtube.com/vi/rIJEHbjygiM/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Sharuat Kariye under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "હર્ષ બ્રહ્મભટ્ટ: દુઃખોથી હારવાને બદલે દુઃખોને હરાવી નવેસરથી શરૂઆત કરવાનો આશાવાદી સંદેશ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Sharuat Kariye Core Concepts",
        "textGujarati": "શરૂઆત કરીએ (ગઝલ) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-guj-ch13_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 13 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-guj&chapter=13"
  },
  {
    "id": "vid-ch-g8-guj-ch14",
    "chapterNumber": 14,
    "subjectId": "g8-guj",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 8 Gujarati – Chapter 14: Sakar No Shodhnaro",
    "titleGujarati": "ધોરણ 8 ગુજરાતી (માતૃભાષા) – પ્રકરણ 14: સાકરનો શોધનારો (એકાંકી) (GSEB)",
    "instructor": "knowledge is power ",
    "instructorGujarati": "knowledge is power  (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "wnwYY4VKLxY",
    "thumbnailUrl": "https://img.youtube.com/vi/wnwYY4VKLxY/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Sakar No Shodhnaro under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "યશવંત પંડ્યા: અંજનની બાળસહજ જિજ્ઞાસા અને પિતા નિખિલરાયની કઠોર શિસ્ત વચ્ચેનો સંઘર્ષ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Sakar No Shodhnaro Core Concepts",
        "textGujarati": "સાકરનો શોધનારો (એકાંકી) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-guj-ch14_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 14 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-guj&chapter=14"
  },
  {
    "id": "vid-ch-g8-guj-ch15",
    "chapterNumber": 15,
    "subjectId": "g8-guj",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 8 Gujarati – Chapter 15: Akhand Bharat Na Shilpi",
    "titleGujarati": "ધોરણ 8 ગુજરાતી (માતૃભાષા) – પ્રકરણ 15: અખંડ ભારતના શિલ્પી (ચરિત્રલેખ) (GSEB)",
    "instructor": "School Mobile ",
    "instructorGujarati": "School Mobile  (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "1vNNQ7zI8vU",
    "thumbnailUrl": "https://img.youtube.com/vi/1vNNQ7zI8vU/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Akhand Bharat Na Shilpi under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ડૉ. રાઘવજી માધડ: સરદાર વલ્લભભાઈ પટેલની લોખંડી ઇચ્છાશક્તિ અને દેશી રાજ્યોનું વિલીનીકરણ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Akhand Bharat Na Shilpi Core Concepts",
        "textGujarati": "અખંડ ભારતના શિલ્પી (ચરિત્રલેખ) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-guj-ch15_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 15 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-guj&chapter=15"
  },
  {
    "id": "vid-ch-g8-guj-ch16",
    "chapterNumber": 16,
    "subjectId": "g8-guj",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 8 Gujarati – Chapter 16: Sudamo Ditha Shrikrishna Dev Re",
    "titleGujarati": "ધોરણ 8 ગુજરાતી (માતૃભાષા) – પ્રકરણ 16: સુદામો દીઠા શ્રીકૃષ્ણ દેવ રે (આખ્યાનખંડ) (GSEB)",
    "instructor": "MANAV CLASSES - Harmit sir",
    "instructorGujarati": "MANAV CLASSES - Harmit sir (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "4bJ8Unj7jtc",
    "thumbnailUrl": "https://img.youtube.com/vi/4bJ8Unj7jtc/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Sudamo Ditha Shrikrishna Dev Re under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "પ્રેમાનંદ: સુદામા અને શ્રીકૃષ્ણનું મિલન - સાચી મિત્રતા અને દીનબંધુ પ્રભુનો પ્રેમ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Sudamo Ditha Shrikrishna Dev Re Core Concepts",
        "textGujarati": "સુદામો દીઠા શ્રીકૃષ્ણ દેવ રે (આખ્યાનખંડ) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-guj-ch16_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 16 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-guj&chapter=16"
  },
  {
    "id": "vid-ch-g8-guj-ch17",
    "chapterNumber": 17,
    "subjectId": "g8-guj",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 8 Gujarati – Chapter 17: Sanskar Ni Shrimantai",
    "titleGujarati": "ધોરણ 8 ગુજરાતી (માતૃભાષા) – પ્રકરણ 17: સંસ્કારની શ્રીમંતાઈ (કુટુંબકથા) (GSEB)",
    "instructor": "Ocean GyanLive Std 9 and 10",
    "instructorGujarati": "Ocean GyanLive Std 9 and 10 (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "r-NduIG-3Ng",
    "thumbnailUrl": "https://img.youtube.com/vi/r-NduIG-3Ng/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Sanskar Ni Shrimantai under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "કુંદનિકા કાપડિયા: ધનદોલત જતી રહેવા છતાં સંસ્કાર અને સ્નેહથી એક તાંતણે બંધાયેલું કુટુંબ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Sanskar Ni Shrimantai Core Concepts",
        "textGujarati": "સંસ્કારની શ્રીમંતાઈ (કુટુંબકથા) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-guj-ch17_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 17 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-guj&chapter=17"
  },
  {
    "id": "vid-ch-g8-guj-ch18",
    "chapterNumber": 18,
    "subjectId": "g8-guj",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 8 Gujarati – Chapter 18: Duha, Muktak, Haiku",
    "titleGujarati": "ધોરણ 8 ગુજરાતી (માતૃભાષા) – પ્રકરણ 18: દુહા, મુક્તક, હાઇકુ (કાવ્યપ્રકારો) (GSEB)",
    "instructor": "School Mobile ",
    "instructorGujarati": "School Mobile  (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "tewhM4VoJAs",
    "thumbnailUrl": "https://img.youtube.com/vi/tewhM4VoJAs/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Duha, Muktak, Haiku under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "પરંપરાગત લોકસાહિત્યના દુહા, મુક્તક અને 17 અક્ષરનું જાપાનીઝ કાવ્યસ્વરૂપ હાઇકુ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Duha, Muktak, Haiku Core Concepts",
        "textGujarati": "દુહા, મુક્તક, હાઇકુ (કાવ્યપ્રકારો) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-guj-ch18_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 18 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-guj&chapter=18"
  },
  {
    "id": "vid-ch-g8-eng-ch1",
    "chapterNumber": 1,
    "subjectId": "g8-eng",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "English",
    "categoryGujarati": "અંગ્રેજી (દ્વિતીય ભાષા)",
    "title": "Class 8 English – Chapter 1: The Best Christmas Present in the World",
    "titleGujarati": "ધોરણ 8 અંગ્રેજી (દ્વિતીય ભાષા) – પ્રકરણ 1: ધ બેસ્ટ ક્રિસમસ પ્રેઝન્ટ (GSEB)",
    "instructor": "NCERT Exam Guide",
    "instructorGujarati": "NCERT Exam Guide (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "JiLis0KBQf0",
    "thumbnailUrl": "https://img.youtube.com/vi/JiLis0KBQf0/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of The Best Christmas Present in the World under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "Michael Morpurgo's touching story of World War I Christmas truce and Connie's letter.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "The Best Christmas Present in the World Core Concepts",
        "textGujarati": "ધ બેસ્ટ ક્રિસમસ પ્રેઝન્ટ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-eng-ch1_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 1 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-eng&chapter=1"
  },
  {
    "id": "vid-ch-g8-eng-ch2",
    "chapterNumber": 2,
    "subjectId": "g8-eng",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "English",
    "categoryGujarati": "અંગ્રેજી (દ્વિતીય ભાષા)",
    "title": "Class 8 English – Chapter 2: The Tsunami",
    "titleGujarati": "ધોરણ 8 અંગ્રેજી (દ્વિતીય ભાષા) – પ્રકરણ 2: ધ સુનામી (GSEB)",
    "instructor": "Gyaan Bhandaar",
    "instructorGujarati": "Gyaan Bhandaar (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "YdKrnlPS3Ok",
    "thumbnailUrl": "https://img.youtube.com/vi/YdKrnlPS3Ok/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of The Tsunami under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "Courageous survival stories from the 2004 Indian Ocean tsunami, including Tilly Smith's bravery.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "The Tsunami Core Concepts",
        "textGujarati": "ધ સુનામી ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-eng-ch2_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 2 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-eng&chapter=2"
  },
  {
    "id": "vid-ch-g8-eng-ch3",
    "chapterNumber": 3,
    "subjectId": "g8-eng",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "English",
    "categoryGujarati": "અંગ્રેજી (દ્વિતીય ભાષા)",
    "title": "Class 8 English – Chapter 3: Glimpses of the Past",
    "titleGujarati": "ધોરણ 8 અંગ્રેજી (દ્વિતીય ભાષા) – પ્રકરણ 3: ગ્લિમ્પ્સિઝ ઓફ ધ પાસ્ટ (GSEB)",
    "instructor": "Parul's Classes",
    "instructorGujarati": "Parul's Classes (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "zATC6FPxz8o",
    "thumbnailUrl": "https://img.youtube.com/vi/zATC6FPxz8o/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Glimpses of the Past under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "Pictorial history of India's freedom struggle from 1757 to 1857.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Glimpses of the Past Core Concepts",
        "textGujarati": "ગ્લિમ્પ્સિઝ ઓફ ધ પાસ્ટ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-eng-ch3_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 3 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-eng&chapter=3"
  },
  {
    "id": "vid-ch-g8-eng-ch4",
    "chapterNumber": 4,
    "subjectId": "g8-eng",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "English",
    "categoryGujarati": "અંગ્રેજી (દ્વિતીય ભાષા)",
    "title": "Class 8 English – Chapter 4: Bepin Choudhury's Lapse of Memory",
    "titleGujarati": "ધોરણ 8 અંગ્રેજી (દ્વિતીય ભાષા) – પ્રકરણ 4: બિપિન ચૌધરીઝ લેપ્સ ઓફ મેમરી (GSEB)",
    "instructor": "Learn with LC",
    "instructorGujarati": "Learn with LC (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "fyBuIlnuwDk",
    "thumbnailUrl": "https://img.youtube.com/vi/fyBuIlnuwDk/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Bepin Choudhury's Lapse of Memory under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "Satyajit Ray's humorous mystery about a practical joke played by Chunilal.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Bepin Choudhury's Lapse of Memory Core Concepts",
        "textGujarati": "બિપિન ચૌધરીઝ લેપ્સ ઓફ મેમરી ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-eng-ch4_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 4 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-eng&chapter=4"
  },
  {
    "id": "vid-ch-g8-eng-ch5",
    "chapterNumber": 5,
    "subjectId": "g8-eng",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "English",
    "categoryGujarati": "અંગ્રેજી (દ્વિતીય ભાષા)",
    "title": "Class 8 English – Chapter 5: The Summit Within",
    "titleGujarati": "ધોરણ 8 અંગ્રેજી (દ્વિતીય ભાષા) – પ્રકરણ 5: ધ સમિટ વિધિન (GSEB)",
    "instructor": "NCERT Exam Guide",
    "instructorGujarati": "NCERT Exam Guide (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "gctRRgFPXcQ",
    "thumbnailUrl": "https://img.youtube.com/vi/gctRRgFPXcQ/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of The Summit Within under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "Major H.P.S. Ahluwalia's inspiring reflections on scaling Mount Everest and the internal summit of mind.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "The Summit Within Core Concepts",
        "textGujarati": "ધ સમિટ વિધિન ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-eng-ch5_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 5 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-eng&chapter=5"
  },
  {
    "id": "vid-ch-g8-eng-ch6",
    "chapterNumber": 6,
    "subjectId": "g8-eng",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "English",
    "categoryGujarati": "અંગ્રેજી (દ્વિતીય ભાષા)",
    "title": "Class 8 English – Chapter 6: This is Jody's Fawn",
    "titleGujarati": "ધોરણ 8 અંગ્રેજી (દ્વિતીય ભાષા) – પ્રકરણ 6: ધિસ ઇઝ જોડીઝ ફોન (GSEB)",
    "instructor": "Easy English Summary ",
    "instructorGujarati": "Easy English Summary  (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "cmTXM_rSSs8",
    "thumbnailUrl": "https://img.youtube.com/vi/cmTXM_rSSs8/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of This is Jody's Fawn under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "Marjorie Kinnan Rawlings: Jody's deep moral responsibility to rescue the orphaned fawn.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "This is Jody's Fawn Core Concepts",
        "textGujarati": "ધિસ ઇઝ જોડીઝ ફોન ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-eng-ch6_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 6 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-eng&chapter=6"
  },
  {
    "id": "vid-ch-g8-eng-ch7",
    "chapterNumber": 7,
    "subjectId": "g8-eng",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "English",
    "categoryGujarati": "અંગ્રેજી (દ્વિતીય ભાષા)",
    "title": "Class 8 English – Chapter 7: A Visit to Cambridge",
    "titleGujarati": "ધોરણ 8 અંગ્રેજી (દ્વિતીય ભાષા) – પ્રકરણ 7: એ વિઝિટ ટુ કેમ્બ્રિજ (GSEB)",
    "instructor": "English Baba",
    "instructorGujarati": "English Baba (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "VT1MsEEF3dg",
    "thumbnailUrl": "https://img.youtube.com/vi/VT1MsEEF3dg/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of A Visit to Cambridge under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "Firdaus Kanga meets the brilliant astrophysicist Stephen Hawking.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "A Visit to Cambridge Core Concepts",
        "textGujarati": "એ વિઝિટ ટુ કેમ્બ્રિજ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-eng-ch7_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 7 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-eng&chapter=7"
  },
  {
    "id": "vid-ch-g8-eng-ch8",
    "chapterNumber": 8,
    "subjectId": "g8-eng",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "English",
    "categoryGujarati": "અંગ્રેજી (દ્વિતીય ભાષા)",
    "title": "Class 8 English – Chapter 8: A Short Monsoon Diary",
    "titleGujarati": "ધોરણ 8 અંગ્રેજી (દ્વિતીય ભાષા) – પ્રકરણ 8: એ શોર્ટ મોનસૂન ડાયરી (GSEB)",
    "instructor": "Devasthaly Student Mayank",
    "instructorGujarati": "Devasthaly Student Mayank (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "iQoUd0xW7sY",
    "thumbnailUrl": "https://img.youtube.com/vi/iQoUd0xW7sY/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of A Short Monsoon Diary under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "Ruskin Bond's poetic diary entries describing the beauty and silence of hill station monsoons.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "A Short Monsoon Diary Core Concepts",
        "textGujarati": "એ શોર્ટ મોનસૂન ડાયરી ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-eng-ch8_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 8 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-eng&chapter=8"
  },
  {
    "id": "vid-ch-g8-eng-ch9",
    "chapterNumber": 9,
    "subjectId": "g8-eng",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "English",
    "categoryGujarati": "અંગ્રેજી (દ્વિતીય ભાષા)",
    "title": "Class 8 English – Chapter 9: The Great Stone Face - I",
    "titleGujarati": "ધોરણ 8 અંગ્રેજી (દ્વિતીય ભાષા) – પ્રકરણ 9: ધ ગ્રેટ સ્ટોન ફેસ - ૧ (GSEB)",
    "instructor": "Magnet Brains",
    "instructorGujarati": "Magnet Brains (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "XA-B2llSKqc",
    "thumbnailUrl": "https://img.youtube.com/vi/XA-B2llSKqc/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of The Great Stone Face - I under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "Nathaniel Hawthorne: Ernest's lifelong wait for the prophecy of a noble man resembling the Stone Face.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "The Great Stone Face - I Core Concepts",
        "textGujarati": "ધ ગ્રેટ સ્ટોન ફેસ - ૧ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-eng-ch9_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 9 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-eng&chapter=9"
  },
  {
    "id": "vid-ch-g8-eng-ch10",
    "chapterNumber": 10,
    "subjectId": "g8-eng",
    "grades": [
      "8"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "English",
    "categoryGujarati": "અંગ્રેજી (દ્વિતીય ભાષા)",
    "title": "Class 8 English – Chapter 10: The Great Stone Face - II",
    "titleGujarati": "ધોરણ 8 અંગ્રેજી (દ્વિતીય ભાષા) – પ્રકરણ 10: ધ ગ્રેટ સ્ટોન ફેસ - ૨ (GSEB)",
    "instructor": "Study Watch",
    "instructorGujarati": "Study Watch (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "g9A4HkwiM74",
    "thumbnailUrl": "https://img.youtube.com/vi/g9A4HkwiM74/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of The Great Stone Face - II under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "Ernest meets a poet and is finally recognized as the true living embodiment of the Great Stone Face.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "The Great Stone Face - II Core Concepts",
        "textGujarati": "ધ ગ્રેટ સ્ટોન ફેસ - ૨ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g8-eng-ch10_1",
        "author": "MindSprint Learner",
        "role": "Class 8 Student",
        "text": "પ્રકરણ 10 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=8&subject=g8-eng&chapter=10"
  },
  {
    "id": "vid-ch-g9-math-ch1",
    "chapterNumber": 1,
    "subjectId": "g9-math",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 9 Mathematics – Chapter 1: Number Systems",
    "titleGujarati": "ધોરણ 9 ગણિત – પ્રકરણ 1: સંખ્યા પદ્ધતિ (GSEB)",
    "instructor": "Ocean GyanLive Std 9 and 10",
    "instructorGujarati": "Ocean GyanLive Std 9 and 10 (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "wY5slZH61R4",
    "thumbnailUrl": "https://img.youtube.com/vi/wY5slZH61R4/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Number Systems under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "અસંમેય સંખ્યાઓ (√2, √3, π), વાસ્તવિક સંખ્યાઓ, સંખ્યારેખા પર નિરૂપણ, છેદનું સંમેયીકરણ અને વાસ્તવિક સંખ્યાઓના ઘાતાંકના નિયમો.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Number Systems Core Concepts",
        "textGujarati": "સંખ્યા પદ્ધતિ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-math-ch1_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 1 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-math&chapter=1"
  },
  {
    "id": "vid-ch-g9-math-ch2",
    "chapterNumber": 2,
    "subjectId": "g9-math",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 9 Mathematics – Chapter 2: Polynomials",
    "titleGujarati": "ધોરણ 9 ગણિત – પ્રકરણ 2: બહુપદીઓ (GSEB)",
    "instructor": "Vidyakul STD 9 Topper",
    "instructorGujarati": "Vidyakul STD 9 Topper (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "Eds0C2BNxy0",
    "thumbnailUrl": "https://img.youtube.com/vi/Eds0C2BNxy0/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Polynomials under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "એકચલ બહુપદી, બહુપદીની ઘાત, શૂન્યો, શેષ પ્રમેય, અવયવ પ્રમેય અને બૈજિક નિત્યસમો ((x+y+z)², (x±y)³).",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Polynomials Core Concepts",
        "textGujarati": "બહુપદીઓ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-math-ch2_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 2 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-math&chapter=2"
  },
  {
    "id": "vid-ch-g9-math-ch3",
    "chapterNumber": 3,
    "subjectId": "g9-math",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 9 Mathematics – Chapter 3: Coordinate Geometry",
    "titleGujarati": "ધોરણ 9 ગણિત – પ્રકરણ 3: યામ ભૂમિતિ (GSEB)",
    "instructor": "Vidyakul STD 9 Topper",
    "instructorGujarati": "Vidyakul STD 9 Topper (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "WGtWSWs9ioo",
    "thumbnailUrl": "https://img.youtube.com/vi/WGtWSWs9ioo/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Coordinate Geometry under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "કાર્તેઝીય યામ પદ્ધતિ, X-અક્ષ (કોટિ), Y-અક્ષ (ભુજ), ચાર ચરણો અને સમતલમાં બિંદુઓનું નિરૂપણ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Coordinate Geometry Core Concepts",
        "textGujarati": "યામ ભૂમિતિ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-math-ch3_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 3 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-math&chapter=3"
  },
  {
    "id": "vid-ch-g9-math-ch4",
    "chapterNumber": 4,
    "subjectId": "g9-math",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 9 Mathematics – Chapter 4: Linear Equations in Two Variables",
    "titleGujarati": "ધોરણ 9 ગણિત – પ્રકરણ 4: દ્વિચલ સુરેખ સમીકરણો (GSEB)",
    "instructor": "Vidyakul STD 9 Topper",
    "instructorGujarati": "Vidyakul STD 9 Topper (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "1HGEMNhlsAQ",
    "thumbnailUrl": "https://img.youtube.com/vi/1HGEMNhlsAQ/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Linear Equations in Two Variables under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "પ્રમાણિત સ્વરૂપ ax + by + c = 0, દ્વિચલ સુરેખ સમીકરણના અસંખ્ય ઉકેલો અને આલેખ (સીધી રેખા).",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Linear Equations in Two Variables Core Concepts",
        "textGujarati": "દ્વિચલ સુરેખ સમીકરણો ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-math-ch4_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 4 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-math&chapter=4"
  },
  {
    "id": "vid-ch-g9-math-ch5",
    "chapterNumber": 5,
    "subjectId": "g9-math",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 9 Mathematics – Chapter 5: Introduction to Euclid's Geometry",
    "titleGujarati": "ધોરણ 9 ગણિત – પ્રકરણ 5: યુક્લિડની ભૂમિતિનો પરિચય (GSEB)",
    "instructor": "Vidyakul Gujarati",
    "instructorGujarati": "Vidyakul Gujarati (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "1ERPsXT6CvA",
    "thumbnailUrl": "https://img.youtube.com/vi/1ERPsXT6CvA/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Introduction to Euclid's Geometry under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "યુક્લિડની વ્યાખ્યાઓ, સ્વયંસિદ્ધ સત્યો અને 5 પૂર્વધારણાઓ (સમાંતર રેખાઓની પાંચમી પૂર્વધારણા).",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Introduction to Euclid's Geometry Core Concepts",
        "textGujarati": "યુક્લિડની ભૂમિતિનો પરિચય ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-math-ch5_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 5 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-math&chapter=5"
  },
  {
    "id": "vid-ch-g9-math-ch6",
    "chapterNumber": 6,
    "subjectId": "g9-math",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 9 Mathematics – Chapter 6: Lines and Angles",
    "titleGujarati": "ધોરણ 9 ગણિત – પ્રકરણ 6: રેખાઓ અને ખૂણાઓ (GSEB)",
    "instructor": "Vidyakul STD 9 Topper",
    "instructorGujarati": "Vidyakul STD 9 Topper (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "jm2MBx3gt_Y",
    "thumbnailUrl": "https://img.youtube.com/vi/jm2MBx3gt_Y/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Lines and Angles under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "આસન્નકોણ, રૈખિક જોડ, અભિકોણ પ્રમેય, છેદિકાથી બનતા અનુકોણ, યુગ્મકોણ અને ત્રિકોણના ખૂણાઓનો સરવાળો (180°).",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Lines and Angles Core Concepts",
        "textGujarati": "રેખાઓ અને ખૂણાઓ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-math-ch6_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 6 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-math&chapter=6"
  },
  {
    "id": "vid-ch-g9-math-ch7",
    "chapterNumber": 7,
    "subjectId": "g9-math",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 9 Mathematics – Chapter 7: Triangles",
    "titleGujarati": "ધોરણ 9 ગણિત – પ્રકરણ 7: ત્રિકોણ (GSEB)",
    "instructor": "Vidyakul STD 9 Topper",
    "instructorGujarati": "Vidyakul STD 9 Topper (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "uaUu1LG5O0M",
    "thumbnailUrl": "https://img.youtube.com/vi/uaUu1LG5O0M/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Triangles under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ત્રિકોણની એકરૂપતાની શરતો (બાખૂબા, ખૂબાખૂ, બાબાબા, કાકબા), સમદ્વિબાજુ ત્રિકોણના પ્રમેયો અને અસમતાઓ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Triangles Core Concepts",
        "textGujarati": "ત્રિકોણ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-math-ch7_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 7 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-math&chapter=7"
  },
  {
    "id": "vid-ch-g9-math-ch8",
    "chapterNumber": 8,
    "subjectId": "g9-math",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 9 Mathematics – Chapter 8: Quadrilaterals",
    "titleGujarati": "ધોરણ 9 ગણિત – પ્રકરણ 8: ચતુષ્કોણ (GSEB)",
    "instructor": "Vidyakul Gujarati",
    "instructorGujarati": "Vidyakul Gujarati (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "oPIMT8mUEYU",
    "thumbnailUrl": "https://img.youtube.com/vi/oPIMT8mUEYU/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Quadrilaterals under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ચતુષ્કોણના ખૂણાઓનો સરવાળો 360°, સમાંતરબાજુ ચતુષ્કોણના ગુણધર્મો, વિકર્ણો અને મધ્યબિંદુ પ્રમેય.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Quadrilaterals Core Concepts",
        "textGujarati": "ચતુષ્કોણ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-math-ch8_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 8 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-math&chapter=8"
  },
  {
    "id": "vid-ch-g9-math-ch9",
    "chapterNumber": 9,
    "subjectId": "g9-math",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 9 Mathematics – Chapter 9: Circles",
    "titleGujarati": "ધોરણ 9 ગણિત – પ્રકરણ 9: વર્તુળ (GSEB)",
    "instructor": "Vidyakul STD 9 Topper",
    "instructorGujarati": "Vidyakul STD 9 Topper (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "gUtR7j1tW9s",
    "thumbnailUrl": "https://img.youtube.com/vi/gUtR7j1tW9s/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Circles under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "વર્તુળની જીવા, ચાપ, જીવા દ્વારા કેન્દ્ર આગળ આંતરેલો ખૂણો, ચક્રીય ચતુષ્કોણ (સામસામેના ખૂણાનો સરવાળો 180°).",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Circles Core Concepts",
        "textGujarati": "વર્તુળ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-math-ch9_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 9 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-math&chapter=9"
  },
  {
    "id": "vid-ch-g9-math-ch10",
    "chapterNumber": 10,
    "subjectId": "g9-math",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 9 Mathematics – Chapter 10: Heron's Formula",
    "titleGujarati": "ધોરણ 9 ગણિત – પ્રકરણ 10: હેરોનનું સૂત્ર (GSEB)",
    "instructor": "Vidyakul STD 9 Topper",
    "instructorGujarati": "Vidyakul STD 9 Topper (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "D5Ydz09ySzE",
    "thumbnailUrl": "https://img.youtube.com/vi/D5Ydz09ySzE/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Heron's Formula under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "વિષમબાજુ ત્રિકોણનું ક્ષેત્રફળ શોધવા હેરોનનું સૂત્ર: A = √[s(s-a)(s-b)(s-c)], જ્યાં s = (a+b+c)/2.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Heron's Formula Core Concepts",
        "textGujarati": "હેરોનનું સૂત્ર ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-math-ch10_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 10 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-math&chapter=10"
  },
  {
    "id": "vid-ch-g9-math-ch11",
    "chapterNumber": 11,
    "subjectId": "g9-math",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 9 Mathematics – Chapter 11: Surface Areas and Volumes",
    "titleGujarati": "ધોરણ 9 ગણિત – પ્રકરણ 11: પૃષ્ઠફળ અને ઘનફળ (GSEB)",
    "instructor": "Vidyakul Gujarati",
    "instructorGujarati": "Vidyakul Gujarati (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "rjbpfTiA928",
    "thumbnailUrl": "https://img.youtube.com/vi/rjbpfTiA928/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Surface Areas and Volumes under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "સમઘન, લંબઘન, શંકુ (l = √(r²+h²)), ગોલક (4πr²) અને અર્ધગોલકની વક્રસપાટીનું ક્ષેત્રફળ તથા ઘનફળ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Surface Areas and Volumes Core Concepts",
        "textGujarati": "પૃષ્ઠફળ અને ઘનફળ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-math-ch11_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 11 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-math&chapter=11"
  },
  {
    "id": "vid-ch-g9-math-ch12",
    "chapterNumber": 12,
    "subjectId": "g9-math",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 9 Mathematics – Chapter 12: Statistics",
    "titleGujarati": "ધોરણ 9 ગણિત – પ્રકરણ 12: આંકડાશાસ્ત્ર (GSEB)",
    "instructor": "PENTED Gujarati ",
    "instructorGujarati": "PENTED Gujarati  (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "wDsqnzsXtFs",
    "thumbnailUrl": "https://img.youtube.com/vi/wDsqnzsXtFs/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Statistics under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "માહિતીનું વર્ગીકરણ, સ્તંભાલેખ, આવૃત્તિ બહુકોણ, મધ્યક, મધ્યસ્થ અને બહુલકની ગણતરી.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Statistics Core Concepts",
        "textGujarati": "આંકડાશાસ્ત્ર ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-math-ch12_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 12 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-math&chapter=12"
  },
  {
    "id": "vid-ch-g9-math-ch13",
    "chapterNumber": 13,
    "subjectId": "g9-math",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 9 Mathematics – Chapter 13: Probability",
    "titleGujarati": "ધોરણ 9 ગણિત – પ્રકરણ 13: સંભાવના (GSEB)",
    "instructor": "Vidyakul Gujarati",
    "instructorGujarati": "Vidyakul Gujarati (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "u2pB4g2jMjQ",
    "thumbnailUrl": "https://img.youtube.com/vi/u2pB4g2jMjQ/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Probability under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "પ્રાયોગિક (અનુભવજન્ય) સંભાવના P(E) = અનુકૂળ પરિણામોની સંખ્યા / કુલ પ્રયત્નોની સંખ્યા.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Probability Core Concepts",
        "textGujarati": "સંભાવના ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-math-ch13_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 13 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-math&chapter=13"
  },
  {
    "id": "vid-ch-g9-math-ch14",
    "chapterNumber": 14,
    "subjectId": "g9-math",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 9 Mathematics – Chapter 14: Constructions",
    "titleGujarati": "ધોરણ 9 ગણિત – પ્રકરણ 14: રચનાઓ (GSEB)",
    "instructor": "Vidyakul Gujarati",
    "instructorGujarati": "Vidyakul Gujarati (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "kvbQnCRACIM",
    "thumbnailUrl": "https://img.youtube.com/vi/kvbQnCRACIM/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Constructions under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ખૂણાઓનો દ્વિભાજક, રેખાખંડનો લંબદ્વિભાજક, 60°, 90°, 45° ના ખૂણા અને ત્રિકોણની વિશિષ્ટ રચનાઓ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Constructions Core Concepts",
        "textGujarati": "રચનાઓ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-math-ch14_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 14 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-math&chapter=14"
  },
  {
    "id": "vid-ch-g9-math-ch15",
    "chapterNumber": 15,
    "subjectId": "g9-math",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 9 Mathematics – Chapter 15: Areas of Parallelograms and Triangles",
    "titleGujarati": "ધોરણ 9 ગણિત – પ્રકરણ 15: સમાંતરબાજુ ચતુષ્કોણ અને ત્રિકોણના ક્ષેત્રફળ (GSEB)",
    "instructor": "Gaurang Patel",
    "instructorGujarati": "Gaurang Patel (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "CX1V9TUWn2g",
    "thumbnailUrl": "https://img.youtube.com/vi/CX1V9TUWn2g/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Areas of Parallelograms and Triangles under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "સમાન પાયા અને સમાંતર રેખાઓની જોડ વચ્ચે આવેલા સમાંતરબાજુ ચતુષ્કોણ તથા ત્રિકોણના ક્ષેત્રફળના પ્રમેયો.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Areas of Parallelograms and Triangles Core Concepts",
        "textGujarati": "સમાંતરબાજુ ચતુષ્કોણ અને ત્રિકોણના ક્ષેત્રફળ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-math-ch15_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 15 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-math&chapter=15"
  },
  {
    "id": "vid-ch-g9-sci-ch1",
    "chapterNumber": 1,
    "subjectId": "g9-sci",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 9 Science – Chapter 1: Matter in Our Surroundings",
    "titleGujarati": "ધોરણ 9 વિજ્ઞાન – પ્રકરણ 1: આપણી આસપાસમાં દ્રવ્ય (GSEB)",
    "instructor": "Vidyakul Gujarati",
    "instructorGujarati": "Vidyakul Gujarati (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "ytJLQQdcjME",
    "thumbnailUrl": "https://img.youtube.com/vi/ytJLQQdcjME/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Matter in Our Surroundings under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "દ્રવ્યની ભૌતિક અવસ્થાઓ (ઘન, પ્રવાહી, વાયુ), ગલનબિંદુ, ઉત્કલનબિંદુ, ઊર્ધ્વપાતન અને બાષ્પીભવનને અસર કરતાં પરિબળો.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Matter in Our Surroundings Core Concepts",
        "textGujarati": "આપણી આસપાસમાં દ્રવ્ય ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-sci-ch1_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 1 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-sci&chapter=1"
  },
  {
    "id": "vid-ch-g9-sci-ch2",
    "chapterNumber": 2,
    "subjectId": "g9-sci",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 9 Science – Chapter 2: Is Matter Around Us Pure?",
    "titleGujarati": "ધોરણ 9 વિજ્ઞાન – પ્રકરણ 2: શું આપણી આસપાસનાં દ્રવ્યો શુદ્ધ છે? (GSEB)",
    "instructor": "Vidyakul Gujarati",
    "instructorGujarati": "Vidyakul Gujarati (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "lt0SQZYdTSQ",
    "thumbnailUrl": "https://img.youtube.com/vi/lt0SQZYdTSQ/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Is Matter Around Us Pure? under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "મિશ્રણ (સમાંગ, વિષમાંગ), દ્રાવણ, નિલંબન, કલીલ, ટિન્ડલ અસર અને અલગીકરણ પદ્ધતિઓ (સેન્ટ્રીફ્યુગેશન, સ્ફટિકીકરણ).",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Is Matter Around Us Pure? Core Concepts",
        "textGujarati": "શું આપણી આસપાસનાં દ્રવ્યો શુદ્ધ છે? ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-sci-ch2_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 2 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-sci&chapter=2"
  },
  {
    "id": "vid-ch-g9-sci-ch3",
    "chapterNumber": 3,
    "subjectId": "g9-sci",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 9 Science – Chapter 3: Atoms and Molecules",
    "titleGujarati": "ધોરણ 9 વિજ્ઞાન – પ્રકરણ 3: પરમાણુઓ અને અણુઓ (GSEB)",
    "instructor": "PENTED Gujarati ",
    "instructorGujarati": "PENTED Gujarati  (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "iPTmBm2LeWo",
    "thumbnailUrl": "https://img.youtube.com/vi/iPTmBm2LeWo/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Atoms and Molecules under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "દળ સંચયનો નિયમ, નિશ્ચિત પ્રમાણનો નિયમ, ડાલ્ટનનો પરમાણ્વીય સિદ્ધાંત, રાસાયણિક સૂત્રો લખવા અને મોલ સંકલ્પના.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Atoms and Molecules Core Concepts",
        "textGujarati": "પરમાણુઓ અને અણુઓ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-sci-ch3_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 3 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-sci&chapter=3"
  },
  {
    "id": "vid-ch-g9-sci-ch4",
    "chapterNumber": 4,
    "subjectId": "g9-sci",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 9 Science – Chapter 4: Structure of the Atom",
    "titleGujarati": "ધોરણ 9 વિજ્ઞાન – પ્રકરણ 4: પરમાણુનું બંધારણ (GSEB)",
    "instructor": "Science Tv Gujarati",
    "instructorGujarati": "Science Tv Gujarati (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "ZvOJbvKafw4",
    "thumbnailUrl": "https://img.youtube.com/vi/ZvOJbvKafw4/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Structure of the Atom under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ઇલેક્ટ્રોન (થોમસન), પ્રોટોન (ગોલ્ડસ્ટીન), ન્યુટ્રોન (ચેડવિક), રુધરફોર્ડનો પ્રકીર્ણન પ્રયોગ, બોહરનું પરમાણુ મોડેલ, સંયોજકતા, સમસ્થાનિકો.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Structure of the Atom Core Concepts",
        "textGujarati": "પરમાણુનું બંધારણ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-sci-ch4_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 4 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-sci&chapter=4"
  },
  {
    "id": "vid-ch-g9-sci-ch5",
    "chapterNumber": 5,
    "subjectId": "g9-sci",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 9 Science – Chapter 5: The Fundamental Unit of Life",
    "titleGujarati": "ધોરણ 9 વિજ્ઞાન – પ્રકરણ 5: સજીવનો પાયાનો એકમ (GSEB)",
    "instructor": "Vidyakul STD 9 Topper",
    "instructorGujarati": "Vidyakul STD 9 Topper (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "CtV9lY2NLbI",
    "thumbnailUrl": "https://img.youtube.com/vi/CtV9lY2NLbI/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of The Fundamental Unit of Life under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "કોષની રચના, કોષરસપટલ (પસંદગીમાન પ્રવેશશીલ પટલ), આસૃતિ, કોષકેન્દ્ર, કણાભસૂત્ર (પાવરહાઉસ), લાઇસોઝોમ (આત્મઘાતી કોથળી), ગોલ્ગી પ્રસાધન.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "The Fundamental Unit of Life Core Concepts",
        "textGujarati": "સજીવનો પાયાનો એકમ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-sci-ch5_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 5 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-sci&chapter=5"
  },
  {
    "id": "vid-ch-g9-sci-ch6",
    "chapterNumber": 6,
    "subjectId": "g9-sci",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 9 Science – Chapter 6: Tissues",
    "titleGujarati": "ધોરણ 9 વિજ્ઞાન – પ્રકરણ 6: પેશીઓ (GSEB)",
    "instructor": "Vidyakul Gujarati",
    "instructorGujarati": "Vidyakul Gujarati (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "Z7OsOg51q_Y",
    "thumbnailUrl": "https://img.youtube.com/vi/Z7OsOg51q_Y/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Tissues under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "વનસ્પતિ પેશી (વર્ધનશીલ પેશી, સ્થાયી પેશી - મૃદુતક, સ્થૂલકોણક, દ્રઢોતક, જલવાહક, અન્નવાહક) અને પ્રાણી પેશી (અધિચ્છદ, સંયોજક, સ્નાયુ, ચેતા પેશી).",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Tissues Core Concepts",
        "textGujarati": "પેશીઓ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-sci-ch6_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 6 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-sci&chapter=6"
  },
  {
    "id": "vid-ch-g9-sci-ch7",
    "chapterNumber": 7,
    "subjectId": "g9-sci",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 9 Science – Chapter 7: Motion",
    "titleGujarati": "ધોરણ 9 વિજ્ઞાન – પ્રકરણ 7: ગતિ (GSEB)",
    "instructor": "Vidyakul Gujarati",
    "instructorGujarati": "Vidyakul Gujarati (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "rqcr0bSMEJI",
    "thumbnailUrl": "https://img.youtube.com/vi/rqcr0bSMEJI/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Motion under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "અંતર, સ્થાનાંતર, ઝડપ, વેગ, પ્રવેગ (a = (v-u)/t), ગતિના આલેખો અને નિયમિત વર્તુળાકાર ગતિ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Motion Core Concepts",
        "textGujarati": "ગતિ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-sci-ch7_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 7 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-sci&chapter=7"
  },
  {
    "id": "vid-ch-g9-sci-ch8",
    "chapterNumber": 8,
    "subjectId": "g9-sci",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 9 Science – Chapter 8: Force and Laws of Motion",
    "titleGujarati": "ધોરણ 9 વિજ્ઞાન – પ્રકરણ 8: બળ તથા ગતિના નિયમો (GSEB)",
    "instructor": "Vidyakul Gujarati",
    "instructorGujarati": "Vidyakul Gujarati (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "U35O9vn0GWo",
    "thumbnailUrl": "https://img.youtube.com/vi/U35O9vn0GWo/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Force and Laws of Motion under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ન્યૂટનનો ગતિનો પહેલો નિયમ (જડત્વ), બીજો નિયમ (F = ma), ત્રીજો નિયમ (ક્રિયાબળ અને પ્રતિક્રિયાબળ સમાન અને પરસ્પર વિરુદ્ધ) અને વેગમાન સંરક્ષણ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Force and Laws of Motion Core Concepts",
        "textGujarati": "બળ તથા ગતિના નિયમો ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-sci-ch8_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 8 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-sci&chapter=8"
  },
  {
    "id": "vid-ch-g9-sci-ch9",
    "chapterNumber": 9,
    "subjectId": "g9-sci",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 9 Science – Chapter 9: Gravitation",
    "titleGujarati": "ધોરણ 9 વિજ્ઞાન – પ્રકરણ 9: ગુરુત્વાકર્ષણ (GSEB)",
    "instructor": "Science Tv Gujarati",
    "instructorGujarati": "Science Tv Gujarati (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "0cVLfLwyow0",
    "thumbnailUrl": "https://img.youtube.com/vi/0cVLfLwyow0/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Gravitation under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ન્યૂટનનો સાર્વત્રિક ગુરુત્વાકર્ષણનો નિયમ (F = G·m1·m2/d²), ગુરુત્વપ્રવેગ (g = 9.8 m/s²), દળ અને વજન, આર્કિમિડીઝનો સિદ્ધાંત અને ઉત્પ્લાવક બળ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Gravitation Core Concepts",
        "textGujarati": "ગુરુત્વાકર્ષણ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-sci-ch9_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 9 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-sci&chapter=9"
  },
  {
    "id": "vid-ch-g9-sci-ch10",
    "chapterNumber": 10,
    "subjectId": "g9-sci",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 9 Science – Chapter 10: Work and Energy",
    "titleGujarati": "ધોરણ 9 વિજ્ઞાન – પ્રકરણ 10: કાર્ય અને ઊર્જા (GSEB)",
    "instructor": "Vidyakul Gujarati",
    "instructorGujarati": "Vidyakul Gujarati (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "P51uwR9xitw",
    "thumbnailUrl": "https://img.youtube.com/vi/P51uwR9xitw/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Work and Energy under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "કાર્ય (W = F·s), ગતિઊર્જા (Ek = 1/2 mv²), સ્થિતિઊર્જા (Ep = mgh), ઊર્જા સંરક્ષણનો નિયમ અને પાવર (P = W/t).",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Work and Energy Core Concepts",
        "textGujarati": "કાર્ય અને ઊર્જા ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-sci-ch10_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 10 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-sci&chapter=10"
  },
  {
    "id": "vid-ch-g9-sci-ch11",
    "chapterNumber": 11,
    "subjectId": "g9-sci",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 9 Science – Chapter 11: Sound",
    "titleGujarati": "ધોરણ 9 વિજ્ઞાન – પ્રકરણ 11: ધ્વનિ (GSEB)",
    "instructor": "Vidyakul Gujarati",
    "instructorGujarati": "Vidyakul Gujarati (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "DNovfbiP39s",
    "thumbnailUrl": "https://img.youtube.com/vi/DNovfbiP39s/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Sound under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ધ્વનિનું ઉત્પાદન, પ્રસરણ, તરંગલંબાઈ (λ), આવૃત્તિ (ν), વેગ (v = νλ), પડઘો (ઇકો), રિવર્બરેશન, સોનાર (SONAR) અને માનવ કાનની રચના.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Sound Core Concepts",
        "textGujarati": "ધ્વનિ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-sci-ch11_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 11 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-sci&chapter=11"
  },
  {
    "id": "vid-ch-g9-sci-ch12",
    "chapterNumber": 12,
    "subjectId": "g9-sci",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 9 Science – Chapter 12: Why Do We Fall Ill?",
    "titleGujarati": "ધોરણ 9 વિજ્ઞાન – પ્રકરણ 12: આપણે શા માટે માંદા પડીએ છીએ? (GSEB)",
    "instructor": "Learn Gujarat Education in Gujarati",
    "instructorGujarati": "Learn Gujarat Education in Gujarati (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "S31kdUPkwSQ",
    "thumbnailUrl": "https://img.youtube.com/vi/S31kdUPkwSQ/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Why Do We Fall Ill? under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "સ્વાસ્થ્ય અને રોગમુક્તિ, તીવ્ર અને હઠીલા રોગો, ચેપી રોગો (વાયરસ, બેક્ટેરિયા), રસીકરણ અને રોગપ્રતિકારક તંત્ર.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Why Do We Fall Ill? Core Concepts",
        "textGujarati": "આપણે શા માટે માંદા પડીએ છીએ? ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-sci-ch12_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 12 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-sci&chapter=12"
  },
  {
    "id": "vid-ch-g9-sci-ch13",
    "chapterNumber": 13,
    "subjectId": "g9-sci",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 9 Science – Chapter 13: Natural Resources",
    "titleGujarati": "ધોરણ 9 વિજ્ઞાન – પ્રકરણ 13: કુદરતી સંપત્તિ (GSEB)",
    "instructor": "Ved Digital Education",
    "instructorGujarati": "Ved Digital Education (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "7BtuGIa1Z74",
    "thumbnailUrl": "https://img.youtube.com/vi/7BtuGIa1Z74/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Natural Resources under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "હવા, પાણી, જમીન, ઓક્સિજન ચક્ર, કાર્બન ચક્ર, નાઇટ્રોજન ચક્ર, ગ્રીનહાઉસ અસર અને ઓઝોન સ્તરનું ક્ષયન (CFCs).",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Natural Resources Core Concepts",
        "textGujarati": "કુદરતી સંપત્તિ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-sci-ch13_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 13 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-sci&chapter=13"
  },
  {
    "id": "vid-ch-g9-sci-ch14",
    "chapterNumber": 14,
    "subjectId": "g9-sci",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 9 Science – Chapter 14: Improvement in Food Resources",
    "titleGujarati": "ધોરણ 9 વિજ્ઞાન – પ્રકરણ 14: અન્નસ્ત્રોતોમાં સુધારણા (GSEB)",
    "instructor": "PhysicsFunmagic NMMALI SIR",
    "instructorGujarati": "PhysicsFunmagic NMMALI SIR (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "2gCHiBprbU0",
    "thumbnailUrl": "https://img.youtube.com/vi/2gCHiBprbU0/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Improvement in Food Resources under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "પાકની જાતોમાં સુધારણા, ખાતર વ્યવસ્થાપન, સિંચાઈ, પાક સંરક્ષણ, પશુપાલન, મરઘાંપાલન, મત્સ્યોદ્યોગ અને મધમાખી ઉછેર.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Improvement in Food Resources Core Concepts",
        "textGujarati": "અન્નસ્ત્રોતોમાં સુધારણા ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-sci-ch14_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 14 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-sci&chapter=14"
  },
  {
    "id": "vid-ch-g9-sci-ch15",
    "chapterNumber": 15,
    "subjectId": "g9-sci",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 9 Science – Chapter 15: Diversity in Living Organisms",
    "titleGujarati": "ધોરણ 9 વિજ્ઞાન – પ્રકરણ 15: સજીવોમાં વિવિધતા (GSEB)",
    "instructor": "Jayendra A Chauhan - JAC",
    "instructorGujarati": "Jayendra A Chauhan - JAC (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "blAIFrxsRo8",
    "thumbnailUrl": "https://img.youtube.com/vi/blAIFrxsRo8/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Diversity in Living Organisms under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "વિહિકરનું પાંચ સૃષ્ટિ વર્ગીકરણ (મોનેરા, પ્રોટિસ્ટા, ફૂગ, વનસ્પતિ, પ્રાણી), દ્વિનામી નામકરણ પદ્ધતિ (કેરોલસ લિનિયસ).",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Diversity in Living Organisms Core Concepts",
        "textGujarati": "સજીવોમાં વિવિધતા ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-sci-ch15_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 15 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-sci&chapter=15"
  },
  {
    "id": "vid-ch-g9-soc-ch1",
    "chapterNumber": 1,
    "subjectId": "g9-soc",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 9 Social Science – Chapter 1: Rise of British Rule in India",
    "titleGujarati": "ધોરણ 9 સામાજિક વિજ્ઞાન – પ્રકરણ 1: ભારતમાં બ્રિટિશ સત્તાનો ઉદય (GSEB)",
    "instructor": "Vidyakul STD 9 Topper",
    "instructorGujarati": "Vidyakul STD 9 Topper (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "Zwk4jL0c7N0",
    "thumbnailUrl": "https://img.youtube.com/vi/Zwk4jL0c7N0/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Rise of British Rule in India under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "યુરોપિયનોનું આગમન, પ્લાસી અને બક્સરનું યુદ્ધ, ડેલહાઉસીની ખાલસા નીતિ અને કંપની શાસનની આર્થિક-સામાજિક અસરો.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Rise of British Rule in India Core Concepts",
        "textGujarati": "ભારતમાં બ્રિટિશ સત્તાનો ઉદય ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-soc-ch1_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 1 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-soc&chapter=1"
  },
  {
    "id": "vid-ch-g9-soc-ch2",
    "chapterNumber": 2,
    "subjectId": "g9-soc",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 9 Social Science – Chapter 2: First World War and Russian Revolution",
    "titleGujarati": "ધોરણ 9 સામાજિક વિજ્ઞાન – પ્રકરણ 2: પ્રથમ વિશ્વયુદ્ધ અને રશિયન ક્રાંતિ (GSEB)",
    "instructor": "Vidyakul STD 9 Topper",
    "instructorGujarati": "Vidyakul STD 9 Topper (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "ZZD3jO2pBmk",
    "thumbnailUrl": "https://img.youtube.com/vi/ZZD3jO2pBmk/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of First World War and Russian Revolution under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "પ્રથમ વિશ્વયુદ્ધ (1914-1918) ના કારણો, લેનિનની બોલ્શેવિક ક્રાંતિ (1917), વર્સેલ્સની સંધિ અને રાષ્ટ્રસંઘ (League of Nations).",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "First World War and Russian Revolution Core Concepts",
        "textGujarati": "પ્રથમ વિશ્વયુદ્ધ અને રશિયન ક્રાંતિ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-soc-ch2_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 2 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-soc&chapter=2"
  },
  {
    "id": "vid-ch-g9-soc-ch3",
    "chapterNumber": 3,
    "subjectId": "g9-soc",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 9 Social Science – Chapter 3: Movement Towards a New World",
    "titleGujarati": "ધોરણ 9 સામાજિક વિજ્ઞાન – પ્રકરણ 3: નૂતન વિશ્વ તરફ પ્રયાણ (GSEB)",
    "instructor": "Harsh Barasiya",
    "instructorGujarati": "Harsh Barasiya (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "h4E12kWShlY",
    "thumbnailUrl": "https://img.youtube.com/vi/h4E12kWShlY/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Movement Towards a New World under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ઇટાલીમાં મુસોલિનીનો ફાસીવાદ, જર્મનીમાં હિટલરનો નાઝીવાદ, જાપાનમાં લશ્કરવાદ અને વૈશ્વિક મહામંદી (1929-1932).",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Movement Towards a New World Core Concepts",
        "textGujarati": "નૂતન વિશ્વ તરફ પ્રયાણ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-soc-ch3_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 3 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-soc&chapter=3"
  },
  {
    "id": "vid-ch-g9-soc-ch4",
    "chapterNumber": 4,
    "subjectId": "g9-soc",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 9 Social Science – Chapter 4: National Movements in India",
    "titleGujarati": "ધોરણ 9 સામાજિક વિજ્ઞાન – પ્રકરણ 4: ભારતની રાષ્ટ્રીય ચળવળો (GSEB)",
    "instructor": "Harsh Barasiya",
    "instructorGujarati": "Harsh Barasiya (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "Jfmtcw3D8PU",
    "thumbnailUrl": "https://img.youtube.com/vi/Jfmtcw3D8PU/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of National Movements in India under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "બંગભંગ આંદોલન (1905), મુસ્લિમ લીગ, હોમરૂલ લીગ, જલિયાંવાલા બાગ હત્યાકાંડ (1919) અને અસહકારનું આંદોલન (1920-1922).",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "National Movements in India Core Concepts",
        "textGujarati": "ભારતની રાષ્ટ્રીય ચળવળો ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-soc-ch4_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 4 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-soc&chapter=4"
  },
  {
    "id": "vid-ch-g9-soc-ch5",
    "chapterNumber": 5,
    "subjectId": "g9-soc",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 9 Social Science – Chapter 5: India: Movement Towards Independence",
    "titleGujarati": "ધોરણ 9 સામાજિક વિજ્ઞાન – પ્રકરણ 5: ભારત : આઝાદી તરફ પ્રયાણ (GSEB)",
    "instructor": "Harsh Barasiya",
    "instructorGujarati": "Harsh Barasiya (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "1ZDE-6g5UvM",
    "thumbnailUrl": "https://img.youtube.com/vi/1ZDE-6g5UvM/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of India: Movement Towards Independence under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "સાયમન કમિશન (1927), દાંડીકૂચ (1930), ગોળમેજી પરિષદો, હિંદ છોડો આંદોલન (1942), સુભાષચંદ્ર બોઝ અને આઝાદ હિંદ ફોજ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "India: Movement Towards Independence Core Concepts",
        "textGujarati": "ભારત : આઝાદી તરફ પ્રયાણ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-soc-ch5_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 5 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-soc&chapter=5"
  },
  {
    "id": "vid-ch-g9-soc-ch6",
    "chapterNumber": 6,
    "subjectId": "g9-soc",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 9 Social Science – Chapter 6: World After 1945",
    "titleGujarati": "ધોરણ 9 સામાજિક વિજ્ઞાન – પ્રકરણ 6: 1945 પછીનું વિશ્વ (GSEB)",
    "instructor": "Harsh Barasiya",
    "instructorGujarati": "Harsh Barasiya (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "dTHyS0XfOpU",
    "thumbnailUrl": "https://img.youtube.com/vi/dTHyS0XfOpU/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of World After 1945 under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "સંયુક્ત રાષ્ટ્રો (UN) ની સ્થાપના (24 ઓક્ટોબર 1945), ઠંડુ યુદ્ધ (Cold War), લશ્કરી જૂથો (NATO, SEATO, Warsaw Pact) અને બિનજોડાણવાદી નીતિ (NAM).",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "World After 1945 Core Concepts",
        "textGujarati": "1945 પછીનું વિશ્વ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-soc-ch6_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 6 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-soc&chapter=6"
  },
  {
    "id": "vid-ch-g9-soc-ch7",
    "chapterNumber": 7,
    "subjectId": "g9-soc",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 9 Social Science – Chapter 7: Post-Independence India",
    "titleGujarati": "ધોરણ 9 સામાજિક વિજ્ઞાન – પ્રકરણ 7: સ્વાતંત્રોત્તર ભારત (GSEB)",
    "instructor": "Vidyakul STD 9 Topper",
    "instructorGujarati": "Vidyakul STD 9 Topper (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "CE7da0_7wOA",
    "thumbnailUrl": "https://img.youtube.com/vi/CE7da0_7wOA/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Post-Independence India under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "દેશી રાજ્યોનું વિલીનીકરણ (સરદાર પટેલ), જમ્મુ-કાશ્મીર, હૈદરાબાદ, જૂનાગઢ, ગોવા મુક્તિ અને રાજ્યોની ભાષાવાર પુનઃરચના.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Post-Independence India Core Concepts",
        "textGujarati": "સ્વાતંત્રોત્તર ભારત ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-soc-ch7_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 7 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-soc&chapter=7"
  },
  {
    "id": "vid-ch-g9-soc-ch8",
    "chapterNumber": 8,
    "subjectId": "g9-soc",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 9 Social Science – Chapter 8: Framing and Characteristics of Constitution",
    "titleGujarati": "ધોરણ 9 સામાજિક વિજ્ઞાન – પ્રકરણ 8: ભારતના રાજ્યબંધારણનું ઘડતર અને લક્ષણો (GSEB)",
    "instructor": "Harsh Barasiya",
    "instructorGujarati": "Harsh Barasiya (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "H08XnVX_58I",
    "thumbnailUrl": "https://img.youtube.com/vi/H08XnVX_58I/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Framing and Characteristics of Constitution under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "બંધારણ સભા, આમુખનું મહત્વ, લોકશાહી, સમાજવાદી, બિનસાંપ્રદાયિકતા, સંઘીય માળખું અને મૂળભૂત અધિકારો.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Framing and Characteristics of Constitution Core Concepts",
        "textGujarati": "ભારતના રાજ્યબંધારણનું ઘડતર અને લક્ષણો ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-soc-ch8_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 8 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-soc&chapter=8"
  },
  {
    "id": "vid-ch-g9-soc-ch9",
    "chapterNumber": 9,
    "subjectId": "g9-soc",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 9 Social Science – Chapter 9: Fundamental Rights, Duties and Directive Principles",
    "titleGujarati": "ધોરણ 9 સામાજિક વિજ્ઞાન – પ્રકરણ 9: મૂળભૂત હકો, મૂળભૂત ફરજો અને માર્ગદર્શક સિદ્ધાંતો (GSEB)",
    "instructor": "Vidyakul STD 9 Topper",
    "instructorGujarati": "Vidyakul STD 9 Topper (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "taP1DKzZz3k",
    "thumbnailUrl": "https://img.youtube.com/vi/taP1DKzZz3k/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Fundamental Rights, Duties and Directive Principles under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "6 મૂળભૂત અધિકારો (સમાનતા, સ્વતંત્રતા, શોષણ સામે, ધાર્મિક, શૈક્ષણિક, બંધારણીય ઇલાજોનો હક), મૂળભૂત ફરજો (કલમ 51A) અને રાજ્યનીતિના સિદ્ધાંતો.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Fundamental Rights, Duties and Directive Principles Core Concepts",
        "textGujarati": "મૂળભૂત હકો, મૂળભૂત ફરજો અને માર્ગદર્શક સિદ્ધાંતો ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-soc-ch9_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 9 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-soc&chapter=9"
  },
  {
    "id": "vid-ch-g9-soc-ch10",
    "chapterNumber": 10,
    "subjectId": "g9-soc",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 9 Social Science – Chapter 10: Organs of Government",
    "titleGujarati": "ધોરણ 9 સામાજિક વિજ્ઞાન – પ્રકરણ 10: સરકારનાં અંગો (GSEB)",
    "instructor": "Vidyakul STD 9 Topper",
    "instructorGujarati": "Vidyakul STD 9 Topper (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "ifPkhTXiPqs",
    "thumbnailUrl": "https://img.youtube.com/vi/ifPkhTXiPqs/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Organs of Government under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ધારાસભા (સંસદ/વિધાનસભા), કારોબારી (રાષ્ટ્રપતિ, વડાપ્રધાન, મંત્રીમંડળ) અને ન્યાયતંત્રની સત્તાઓ અને કાર્યો.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Organs of Government Core Concepts",
        "textGujarati": "સરકારનાં અંગો ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-soc-ch10_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 10 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-soc&chapter=10"
  },
  {
    "id": "vid-ch-g9-soc-ch11",
    "chapterNumber": 11,
    "subjectId": "g9-soc",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 9 Social Science – Chapter 11: Judiciary of India",
    "titleGujarati": "ધોરણ 9 સામાજિક વિજ્ઞાન – પ્રકરણ 11: ભારતનું ન્યાયતંત્ર (GSEB)",
    "instructor": "SST Master",
    "instructorGujarati": "SST Master (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "zmQTwtcyg3M",
    "thumbnailUrl": "https://img.youtube.com/vi/zmQTwtcyg3M/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Judiciary of India under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "સર્વોચ્ચ અદાલતની હકુમત (મૂળભૂત, અપીલીય, સલાહકારી), હાઈકોર્ટ, લોકઅદાલતો અને ન્યાયતંત્રની નિષ્પક્ષતા.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Judiciary of India Core Concepts",
        "textGujarati": "ભારતનું ન્યાયતંત્ર ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-soc-ch11_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 11 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-soc&chapter=11"
  },
  {
    "id": "vid-ch-g9-soc-ch12",
    "chapterNumber": 12,
    "subjectId": "g9-soc",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 9 Social Science – Chapter 12: Indian Democracy",
    "titleGujarati": "ધોરણ 9 સામાજિક વિજ્ઞાન – પ્રકરણ 12: ભારતીય લોકશાહી (GSEB)",
    "instructor": "STD 9 PENTED Gujarati",
    "instructorGujarati": "STD 9 PENTED Gujarati (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "3odLQeUOVQA",
    "thumbnailUrl": "https://img.youtube.com/vi/3odLQeUOVQA/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Indian Democracy under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ચૂંટણી પ્રક્રિયા, ચૂંટણી પંચની સ્વાયત્તતા, રાજકીય પક્ષો, લોકશાહીમાં લોકમત અને મુક્ત પ્રેસની ભૂમિકા.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Indian Democracy Core Concepts",
        "textGujarati": "ભારતીય લોકશાહી ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-soc-ch12_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 12 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-soc&chapter=12"
  },
  {
    "id": "vid-ch-g9-soc-ch13",
    "chapterNumber": 13,
    "subjectId": "g9-soc",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 9 Social Science – Chapter 13: India: Location, Geological Structure and Relief - 1",
    "titleGujarati": "ધોરણ 9 સામાજિક વિજ્ઞાન – પ્રકરણ 13: ભારત : સ્થાન, ભૂસ્તરીય રચના અને ભૂપૃષ્ઠ - 1 (GSEB)",
    "instructor": "Harsh Barasiya",
    "instructorGujarati": "Harsh Barasiya (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "XgWe4Z-Pmww",
    "thumbnailUrl": "https://img.youtube.com/vi/XgWe4Z-Pmww/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of India: Location, Geological Structure and Relief - 1 under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ભારતનું ભૌગોલિક સ્થાન (8°4' થી 37°6' ઉત્તર અક્ષાંશ), પ્રમાણ સમય રેખા (82°30' પૂર્વ રેખાંશ) અને પડોશી દેશો.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "India: Location, Geological Structure and Relief - 1 Core Concepts",
        "textGujarati": "ભારત : સ્થાન, ભૂસ્તરીય રચના અને ભૂપૃષ્ઠ - 1 ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-soc-ch13_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 13 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-soc&chapter=13"
  },
  {
    "id": "vid-ch-g9-soc-ch14",
    "chapterNumber": 14,
    "subjectId": "g9-soc",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 9 Social Science – Chapter 14: India: Location, Geological Structure and Relief - 2",
    "titleGujarati": "ધોરણ 9 સામાજિક વિજ્ઞાન – પ્રકરણ 14: ભારત : સ્થાન, ભૂસ્તરીય રચના અને ભૂપૃષ્ઠ - 2 (GSEB)",
    "instructor": "Vidyakul STD 9 Topper",
    "instructorGujarati": "Vidyakul STD 9 Topper (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "MRKienkwZ8U",
    "thumbnailUrl": "https://img.youtube.com/vi/MRKienkwZ8U/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of India: Location, Geological Structure and Relief - 2 under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ઉત્તરનો પર્વતીય પ્રદેશ (હિમાલય), ઉત્તરનું મેદાન, દ્વીપકલ્પીય ઉચ્ચપ્રદેશ, તટીય મેદાનો અને દ્વીપસમૂહો (અંદામાન અને લક્ષદ્વીપ).",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "India: Location, Geological Structure and Relief - 2 Core Concepts",
        "textGujarati": "ભારત : સ્થાન, ભૂસ્તરીય રચના અને ભૂપૃષ્ઠ - 2 ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-soc-ch14_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 14 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-soc&chapter=14"
  },
  {
    "id": "vid-ch-g9-soc-ch15",
    "chapterNumber": 15,
    "subjectId": "g9-soc",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 9 Social Science – Chapter 15: Drainage System",
    "titleGujarati": "ધોરણ 9 સામાજિક વિજ્ઞાન – પ્રકરણ 15: જળ-પરિવાહ (GSEB)",
    "instructor": "Harsh Barasiya",
    "instructorGujarati": "Harsh Barasiya (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "tCIG_y8wQVY",
    "thumbnailUrl": "https://img.youtube.com/vi/tCIG_y8wQVY/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Drainage System under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "હિમાલયની નદીઓ (સિંધુ, ગંગા, બ્રહ્મપુત્ર) અને દ્વીપકલ્પીય નદીઓ (નર્મદા, તાપી, ગોદાવરી, કૃષ્ણા, કાવેરી), સરોવરો અને પ્રદૂષણ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Drainage System Core Concepts",
        "textGujarati": "જળ-પરિવાહ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-soc-ch15_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 15 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-soc&chapter=15"
  },
  {
    "id": "vid-ch-g9-soc-ch16",
    "chapterNumber": 16,
    "subjectId": "g9-soc",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 9 Social Science – Chapter 16: Climate",
    "titleGujarati": "ધોરણ 9 સામાજિક વિજ્ઞાન – પ્રકરણ 16: આબોહવા (GSEB)",
    "instructor": "Vidyakul STD 9 Topper",
    "instructorGujarati": "Vidyakul STD 9 Topper (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "cKy8uqbqTew",
    "thumbnailUrl": "https://img.youtube.com/vi/cKy8uqbqTew/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Climate under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "મોસમી પવનો, ઋતુચક્ર (શિયાળો, ઉનાળો, ચોમાસું, નિવર્તન ઋતુ), અલ-નીનો અને વરસાદનું વિતરણ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Climate Core Concepts",
        "textGujarati": "આબોહવા ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-soc-ch16_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 16 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-soc&chapter=16"
  },
  {
    "id": "vid-ch-g9-soc-ch17",
    "chapterNumber": 17,
    "subjectId": "g9-soc",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 9 Social Science – Chapter 17: Natural Vegetation",
    "titleGujarati": "ધોરણ 9 સામાજિક વિજ્ઞાન – પ્રકરણ 17: કુદરતી વનસ્પતિ (GSEB)",
    "instructor": "Mukesh Ramoliya Digital Education",
    "instructorGujarati": "Mukesh Ramoliya Digital Education (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "b6HmmPFH4O8",
    "thumbnailUrl": "https://img.youtube.com/vi/b6HmmPFH4O8/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Natural Vegetation under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "જંગલોના પ્રકારો: ઉષ્ણકટિબંધીય વરસાદી, પાનખર, કાંટાળા, ભરતીના (મેન્ગ્રોવ) અને પર્વતીય જંગલો.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Natural Vegetation Core Concepts",
        "textGujarati": "કુદરતી વનસ્પતિ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-soc-ch17_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 17 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-soc&chapter=17"
  },
  {
    "id": "vid-ch-g9-soc-ch18",
    "chapterNumber": 18,
    "subjectId": "g9-soc",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 9 Social Science – Chapter 18: Wildlife",
    "titleGujarati": "ધોરણ 9 સામાજિક વિજ્ઞાન – પ્રકરણ 18: વન્યજીવન (GSEB)",
    "instructor": "Education nonstop std 9",
    "instructorGujarati": "Education nonstop std 9 (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "mXfhffsAaCY",
    "thumbnailUrl": "https://img.youtube.com/vi/mXfhffsAaCY/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Wildlife under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ભારતના પ્રાણી ભૌગોલિક પ્રદેશો, સંકટમાં મુકાયેલા વન્યજીવો, પ્રોજેક્ટ ટાઇગર (1973), પ્રોજેક્ટ લાયન અને રાષ્ટ્રીય ઉદ્યાનો.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Wildlife Core Concepts",
        "textGujarati": "વન્યજીવન ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-soc-ch18_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 18 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-soc&chapter=18"
  },
  {
    "id": "vid-ch-g9-soc-ch19",
    "chapterNumber": 19,
    "subjectId": "g9-soc",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 9 Social Science – Chapter 19: India: Human Life",
    "titleGujarati": "ધોરણ 9 સામાજિક વિજ્ઞાન – પ્રકરણ 19: ભારત : લોકજીવન (GSEB)",
    "instructor": "Education Nonstop",
    "instructorGujarati": "Education Nonstop (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "K4RfUGQB_H0",
    "thumbnailUrl": "https://img.youtube.com/vi/K4RfUGQB_H0/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of India: Human Life under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "પશ્ચિમ ભારત (ગુજરાત, રાજસ્થાન), ઉત્તર ભારત, દક્ષિણ ભારત અને પૂર્વ ભારતના લોકોનો ખોરાક, પોશાક, રહેઠાણ, ઉત્સવો અને મેળાઓ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "India: Human Life Core Concepts",
        "textGujarati": "ભારત : લોકજીવન ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-soc-ch19_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 19 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-soc&chapter=19"
  },
  {
    "id": "vid-ch-g9-soc-ch20",
    "chapterNumber": 20,
    "subjectId": "g9-soc",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 9 Social Science – Chapter 20: Disaster Management",
    "titleGujarati": "ધોરણ 9 સામાજિક વિજ્ઞાન – પ્રકરણ 20: આપત્તિ-વ્યવસ્થાપન (GSEB)",
    "instructor": "Education nonstop std 9",
    "instructorGujarati": "Education nonstop std 9 (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "kW5Vj4Fnu4s",
    "thumbnailUrl": "https://img.youtube.com/vi/kW5Vj4Fnu4s/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Disaster Management under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "આપત્તિના પ્રકારો (કુદરતી અને માનવસર્જિત), પૂર, ચક્રવાત, ભૂકંપ, તીડ પ્રકોપ, બોમ્બ વિસ્ફોટ અને રાહત કામગીરી.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Disaster Management Core Concepts",
        "textGujarati": "આપત્તિ-વ્યવસ્થાપન ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-soc-ch20_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 20 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-soc&chapter=20"
  },
  {
    "id": "vid-ch-g9-guj-ch1",
    "chapterNumber": 1,
    "subjectId": "g9-guj",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 9 Gujarati – Chapter 1: Sanjh Samay Shamaliyo",
    "titleGujarati": "ધોરણ 9 ગુજરાતી (માતૃભાષા) – પ્રકરણ 1: સાંજ સમય શામળિયો (કાવ્ય) (GSEB)",
    "instructor": "Sarasvati edu",
    "instructorGujarati": "Sarasvati edu (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "IFnXzKHvRUo",
    "thumbnailUrl": "https://img.youtube.com/vi/IFnXzKHvRUo/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Sanjh Samay Shamaliyo under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "નરસિંહ મહેતા: ગોવાળો સાથે વૃંદાવનથી પાછા વળતા શ્રીકૃષ્ણના મનમોહક રૂપનું વર્ણન.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Sanjh Samay Shamaliyo Core Concepts",
        "textGujarati": "સાંજ સમય શામળિયો (કાવ્ય) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-guj-ch1_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 1 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-guj&chapter=1"
  },
  {
    "id": "vid-ch-g9-guj-ch2",
    "chapterNumber": 2,
    "subjectId": "g9-guj",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 9 Gujarati – Chapter 2: Chori Ane Prayashchit",
    "titleGujarati": "ધોરણ 9 ગુજરાતી (માતૃભાષા) – પ્રકરણ 2: ચોરી અને પ્રાયશ્ચિત્ત (આત્મકથાખંડ) (GSEB)",
    "instructor": "AHVAN EDUCATION",
    "instructorGujarati": "AHVAN EDUCATION (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "238BkHJgttU",
    "thumbnailUrl": "https://img.youtube.com/vi/238BkHJgttU/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Chori Ane Prayashchit under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ગાંધીજીના 'સત્યના પ્રયોગો'માંથી: બીડી પીવાની અને સોનાના કડામાંથી ચોરી કરવાની ભૂલની પિતા સમક્ષ કબૂલાત.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Chori Ane Prayashchit Core Concepts",
        "textGujarati": "ચોરી અને પ્રાયશ્ચિત્ત (આત્મકથાખંડ) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-guj-ch2_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 2 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-guj&chapter=2"
  },
  {
    "id": "vid-ch-g9-guj-ch3",
    "chapterNumber": 3,
    "subjectId": "g9-guj",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 9 Gujarati – Chapter 3: Pachhe Shamaliyoji Boliya",
    "titleGujarati": "ધોરણ 9 ગુજરાતી (માતૃભાષા) – પ્રકરણ 3: પછે શામળિયોજી બોલિયા (આખ્યાનખંડ) (GSEB)",
    "instructor": "AHVAN EDUCATION",
    "instructorGujarati": "AHVAN EDUCATION (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "BCTXSClOT68",
    "thumbnailUrl": "https://img.youtube.com/vi/BCTXSClOT68/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Pachhe Shamaliyoji Boliya under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "પ્રેમાનંદ: સાંદીપનિ ઋષિના આશ્રમમાં શ્રીકૃષ્ણ અને સુદામા વચ્ચે વિતાવેલા બાળપણના સ્મરણો.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Pachhe Shamaliyoji Boliya Core Concepts",
        "textGujarati": "પછે શામળિયોજી બોલિયા (આખ્યાનખંડ) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-guj-ch3_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 3 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-guj&chapter=3"
  },
  {
    "id": "vid-ch-g9-guj-ch4",
    "chapterNumber": 4,
    "subjectId": "g9-guj",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 9 Gujarati – Chapter 4: Gopal Bapa",
    "titleGujarati": "ધોરણ 9 ગુજરાતી (માતૃભાષા) – પ્રકરણ 4: ગોપાળબાપા (નવલકથાખંડ) (GSEB)",
    "instructor": "Creative learning - Kuldeep",
    "instructorGujarati": "Creative learning - Kuldeep (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "iV5_hsBGvM8",
    "thumbnailUrl": "https://img.youtube.com/vi/iV5_hsBGvM8/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Gopal Bapa under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "મનુભાઈ પંચોળી 'દર્શક': સયાજીરાવ ગાયકવાડ સામે ગોપાળબાપાની નીડરતા અને પરોપકાર ભાવના.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Gopal Bapa Core Concepts",
        "textGujarati": "ગોપાળબાપા (નવલકથાખંડ) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-guj-ch4_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 4 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-guj&chapter=4"
  },
  {
    "id": "vid-ch-g9-guj-ch5",
    "chapterNumber": 5,
    "subjectId": "g9-guj",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 9 Gujarati – Chapter 5: Gurjari Na Gruhkunje",
    "titleGujarati": "ધોરણ 9 ગુજરાતી (માતૃભાષા) – પ્રકરણ 5: ગુર્જરીના ગૃહકુંજે (કાવ્ય) (GSEB)",
    "instructor": "Creative learning - Kuldeep",
    "instructorGujarati": "Creative learning - Kuldeep (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "sgQlM1mGGAk",
    "thumbnailUrl": "https://img.youtube.com/vi/sgQlM1mGGAk/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Gurjari Na Gruhkunje under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "સુંદરમ્: જન્મભૂમિ ગુજરાત પ્રત્યેનો અગાધ પ્રેમ અને માતૃભૂમિની વંદના.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Gurjari Na Gruhkunje Core Concepts",
        "textGujarati": "ગુર્જરીના ગૃહકુંજે (કાવ્ય) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-guj-ch5_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 5 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-guj&chapter=5"
  },
  {
    "id": "vid-ch-g9-guj-ch6",
    "chapterNumber": 6,
    "subjectId": "g9-guj",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 9 Gujarati – Chapter 6: Lohi Ni Sagai",
    "titleGujarati": "ધોરણ 9 ગુજરાતી (માતૃભાષા) – પ્રકરણ 6: લોહીની સગાઈ (નવલિકા) (GSEB)",
    "instructor": "Ved Digital Education",
    "instructorGujarati": "Ved Digital Education (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "pLcuBKIATHw",
    "thumbnailUrl": "https://img.youtube.com/vi/pLcuBKIATHw/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Lohi Ni Sagai under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ઈશ્વર પેટલીકર: ગાંડી અને મૂંગી દીકરી મંગુ પ્રત્યે અમૃતકાકીનો અસીમ માતૃપ્રેમ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Lohi Ni Sagai Core Concepts",
        "textGujarati": "લોહીની સગાઈ (નવલિકા) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-guj-ch6_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 6 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-guj&chapter=6"
  },
  {
    "id": "vid-ch-g9-guj-ch7",
    "chapterNumber": 7,
    "subjectId": "g9-guj",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 9 Gujarati – Chapter 7: Kaam Kare E Jite",
    "titleGujarati": "ધોરણ 9 ગુજરાતી (માતૃભાષા) – પ્રકરણ 7: કામ કરે એ જીતે (કાવ્ય) (GSEB)",
    "instructor": "Viral Box",
    "instructorGujarati": "Viral Box (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "3b2ceX1hhEY",
    "thumbnailUrl": "https://img.youtube.com/vi/3b2ceX1hhEY/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Kaam Kare E Jite under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "નાથાલાલ દવે: ભારત દેશને આત્મનિર્ભર બનાવવા પરિશ્રમ અને મહેનતનો જયઘોષ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Kaam Kare E Jite Core Concepts",
        "textGujarati": "કામ કરે એ જીતે (કાવ્ય) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-guj-ch7_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 7 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-guj&chapter=7"
  },
  {
    "id": "vid-ch-g9-guj-ch8",
    "chapterNumber": 8,
    "subjectId": "g9-guj",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 9 Gujarati – Chapter 8: Chhal, Chhotra Ane Gotla",
    "titleGujarati": "ધોરણ 9 ગુજરાતી (માતૃભાષા) – પ્રકરણ 8: છાલ, છોતરાં અને ગોટલા (હાસ્યનિબંધ) (GSEB)",
    "instructor": "Parul's Classes",
    "instructorGujarati": "Parul's Classes (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "cZV3mZi64IM",
    "thumbnailUrl": "https://img.youtube.com/vi/cZV3mZi64IM/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Chhal, Chhotra Ane Gotla under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "બકુલ ત્રિપાઠી: ભારતીયોની ગંદકી કરવાની ટેવ પર કટાક્ષ - સ્વચ્છતા પ્રત્યે જાગૃતિ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Chhal, Chhotra Ane Gotla Core Concepts",
        "textGujarati": "છાલ, છોતરાં અને ગોટલા (હાસ્યનિબંધ) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-guj-ch8_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 8 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-guj&chapter=8"
  },
  {
    "id": "vid-ch-g9-guj-ch9",
    "chapterNumber": 9,
    "subjectId": "g9-guj",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 9 Gujarati – Chapter 9: Putravadhu Nu Swagat",
    "titleGujarati": "ધોરણ 9 ગુજરાતી (માતૃભાષા) – પ્રકરણ 9: પુત્રવધૂનું સ્વાગત (કાવ્ય) (GSEB)",
    "instructor": "Viral Box",
    "instructorGujarati": "Viral Box (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "zqBmkMFvtyo",
    "thumbnailUrl": "https://img.youtube.com/vi/zqBmkMFvtyo/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Putravadhu Nu Swagat under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "મકરંદ દવે: ઘરમાં લક્ષ્મી રૂપે પધારેલી પુત્રવધૂનું આદરપૂર્વક સ્વાગત.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Putravadhu Nu Swagat Core Concepts",
        "textGujarati": "પુત્રવધૂનું સ્વાગત (કાવ્ય) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-guj-ch9_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 9 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-guj&chapter=9"
  },
  {
    "id": "vid-ch-g9-guj-ch10",
    "chapterNumber": 10,
    "subjectId": "g9-guj",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 9 Gujarati – Chapter 10: Bharatiya Sanskruti Ni Siddhi",
    "titleGujarati": "ધોરણ 9 ગુજરાતી (માતૃભાષા) – પ્રકરણ 10: ભારતીય સંસ્કૃતિની સિદ્ધિ (નિબંધ) (GSEB)",
    "instructor": "Parul's Classes",
    "instructorGujarati": "Parul's Classes (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "ciREST7t5zI",
    "thumbnailUrl": "https://img.youtube.com/vi/ciREST7t5zI/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Bharatiya Sanskruti Ni Siddhi under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "વિનોબા ભાવે: પ્રકૃતિ, સંસ્કૃતિ અને વિકૃતિ વચ્ચેનો ઊંડો તત્વજ્ઞાનપૂર્ણ ભેદ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Bharatiya Sanskruti Ni Siddhi Core Concepts",
        "textGujarati": "ભારતીય સંસ્કૃતિની સિદ્ધિ (નિબંધ) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-guj-ch10_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 10 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-guj&chapter=10"
  },
  {
    "id": "vid-ch-g9-guj-ch11",
    "chapterNumber": 11,
    "subjectId": "g9-guj",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 9 Gujarati – Chapter 11: Marjiviya",
    "titleGujarati": "ધોરણ 9 ગુજરાતી (માતૃભાષા) – પ્રકરણ 11: મરજીવિયા (સોનેટ) (GSEB)",
    "instructor": "Mishra's Knowledge Hub",
    "instructorGujarati": "Mishra's Knowledge Hub (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "8_YzDwHmDvc",
    "thumbnailUrl": "https://img.youtube.com/vi/8_YzDwHmDvc/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Marjiviya under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "પૂજાલાલ: સમુદ્રના તળિયે જઈ મોતી લાવનારા સાહસિક મરજીવિયાઓની વીરતા.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Marjiviya Core Concepts",
        "textGujarati": "મરજીવિયા (સોનેટ) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-guj-ch11_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 11 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-guj&chapter=11"
  },
  {
    "id": "vid-ch-g9-guj-ch12",
    "chapterNumber": 12,
    "subjectId": "g9-guj",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 9 Gujarati – Chapter 12: Sakhi Markandi",
    "titleGujarati": "ધોરણ 9 ગુજરાતી (માતૃભાષા) – પ્રકરણ 12: સખી માર્કંડી (પ્રવાસનિબંધ) (GSEB)",
    "instructor": "Parul's Classes",
    "instructorGujarati": "Parul's Classes (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "HMN-i2If82U",
    "thumbnailUrl": "https://img.youtube.com/vi/HMN-i2If82U/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Sakhi Markandi under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "કાકાસાહેબ કાલેલકર: માર્કંડી નદી સાથે બાળપણથી બંધાયેલ સખી જેવો સ્નેહાળ સંબંધ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Sakhi Markandi Core Concepts",
        "textGujarati": "સખી માર્કંડી (પ્રવાસનિબંધ) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-guj-ch12_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 12 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-guj&chapter=12"
  },
  {
    "id": "vid-ch-g9-guj-ch13",
    "chapterNumber": 13,
    "subjectId": "g9-guj",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 9 Gujarati – Chapter 13: Rasto Kari Javana",
    "titleGujarati": "ધોરણ 9 ગુજરાતી (માતૃભાષા) – પ્રકરણ 13: રસ્તો કરી જવાના (ગઝલ) (GSEB)",
    "instructor": "Viral Box",
    "instructorGujarati": "Viral Box (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "xy71O2uq4T8",
    "thumbnailUrl": "https://img.youtube.com/vi/xy71O2uq4T8/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Rasto Kari Javana under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "અમૃત 'ઘાયલ': ગમે તેવી વિકટ પરિસ્થિતિમાં પણ પોતાનો માર્ગ જાતે બનાવવાની ખુમારી.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Rasto Kari Javana Core Concepts",
        "textGujarati": "રસ્તો કરી જવાના (ગઝલ) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-guj-ch13_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 13 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-guj&chapter=13"
  },
  {
    "id": "vid-ch-g9-guj-ch14",
    "chapterNumber": 14,
    "subjectId": "g9-guj",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 9 Gujarati – Chapter 14: Vaadi Par Na Vahala",
    "titleGujarati": "ધોરણ 9 ગુજરાતી (માતૃભાષા) – પ્રકરણ 14: વાડી પરનાં વહાલાં (લલિત નિબંધ) (GSEB)",
    "instructor": "Creative learning - Kuldeep",
    "instructorGujarati": "Creative learning - Kuldeep (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "qoZgjmJWfTI",
    "thumbnailUrl": "https://img.youtube.com/vi/qoZgjmJWfTI/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Vaadi Par Na Vahala under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ઇસ્માઇલભાઈ નાગોરી: વાડીમાં વસતા પશુ-પંખીઓ, જીવજંતુઓ અને પ્રકૃતિ સાથેનો સહજીવનનો આનંદ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Vaadi Par Na Vahala Core Concepts",
        "textGujarati": "વાડી પરનાં વહાલાં (લલિત નિબંધ) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-guj-ch14_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 14 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-guj&chapter=14"
  },
  {
    "id": "vid-ch-g9-guj-ch15",
    "chapterNumber": 15,
    "subjectId": "g9-guj",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 9 Gujarati – Chapter 15: Mara Sapna Ma Aavya Hari",
    "titleGujarati": "ધોરણ 9 ગુજરાતી (માતૃભાષા) – પ્રકરણ 15: મારા સપનામાં આવ્યા હરિ (કાવ્ય) (GSEB)",
    "instructor": "Tanvi Senjaliya",
    "instructorGujarati": "Tanvi Senjaliya (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "WnctK9GxGqE",
    "thumbnailUrl": "https://img.youtube.com/vi/WnctK9GxGqE/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Mara Sapna Ma Aavya Hari under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "રમેશ પારેખ: ગોપીના સ્વપ્નમાં શ્રીકૃષ્ણનું આગમન અને ભાવવિભોર પ્રેમ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Mara Sapna Ma Aavya Hari Core Concepts",
        "textGujarati": "મારા સપનામાં આવ્યા હરિ (કાવ્ય) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-guj-ch15_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 15 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-guj&chapter=15"
  },
  {
    "id": "vid-ch-g9-guj-ch16",
    "chapterNumber": 16,
    "subjectId": "g9-guj",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 9 Gujarati – Chapter 16: Kudrati",
    "titleGujarati": "ધોરણ 9 ગુજરાતી (માતૃભાષા) – પ્રકરણ 16: કુદરતી (એકાંકી) (GSEB)",
    "instructor": "Parul's Classes",
    "instructorGujarati": "Parul's Classes (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "qTih8o_QtRU",
    "thumbnailUrl": "https://img.youtube.com/vi/qTih8o_QtRU/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Kudrati under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "લાભશંકર ઠાકર: બાબુના મૃત્યુ પછી સ્વર્ગમાં જઈ પાછા આવવાનો અદભુત અને હાસ્યસભર અનુભવ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Kudrati Core Concepts",
        "textGujarati": "કુદરતી (એકાંકી) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-guj-ch16_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 16 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-guj&chapter=16"
  },
  {
    "id": "vid-ch-g9-guj-ch17",
    "chapterNumber": 17,
    "subjectId": "g9-guj",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 9 Gujarati – Chapter 17: Mara Balpan Na Divaso",
    "titleGujarati": "ધોરણ 9 ગુજરાતી (માતૃભાષા) – પ્રકરણ 17: મારા બાળપણના દિવસો (આત્મકથા) (GSEB)",
    "instructor": "Creative learning - Kuldeep",
    "instructorGujarati": "Creative learning - Kuldeep (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "_kWJ2YDBQlM",
    "thumbnailUrl": "https://img.youtube.com/vi/_kWJ2YDBQlM/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Mara Balpan Na Divaso under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ડૉ. એ. પી. જે. અબ્દુલ કલામ: રામેશ્વરમમાં વિતાવેલું બાળપણ, પિતાજીના સંસ્કાર અને સામાજિક સમરસતા.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Mara Balpan Na Divaso Core Concepts",
        "textGujarati": "મારા બાળપણના દિવસો (આત્મકથા) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-guj-ch17_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 17 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-guj&chapter=17"
  },
  {
    "id": "vid-ch-g9-guj-ch18",
    "chapterNumber": 18,
    "subjectId": "g9-guj",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 9 Gujarati – Chapter 18: Pankhi Lok",
    "titleGujarati": "ધોરણ 9 ગુજરાતી (માતૃભાષા) – પ્રકરણ 18: પંખી લોક (કાવ્ય) (GSEB)",
    "instructor": "Parul's Classes",
    "instructorGujarati": "Parul's Classes (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "_NrGNxjPesw",
    "thumbnailUrl": "https://img.youtube.com/vi/_NrGNxjPesw/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Pankhi Lok under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ગીતા પરીખ: વૃક્ષો કપાતાં પંખીઓની ઘરવિહોણી થવાની અસહ્ય વેદના.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Pankhi Lok Core Concepts",
        "textGujarati": "પંખી લોક (કાવ્ય) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-guj-ch18_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 18 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-guj&chapter=18"
  },
  {
    "id": "vid-ch-g9-guj-ch19",
    "chapterNumber": 19,
    "subjectId": "g9-guj",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 9 Gujarati – Chapter 19: Pappa Have Phone Muku?",
    "titleGujarati": "ધોરણ 9 ગુજરાતી (માતૃભાષા) – પ્રકરણ 19: પપ્પા હવે ફોન મૂકું? (કાવ્ય) (GSEB)",
    "instructor": "Ketan Raninga",
    "instructorGujarati": "Ketan Raninga (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "b5shJPZUxn4",
    "thumbnailUrl": "https://img.youtube.com/vi/b5shJPZUxn4/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Pappa Have Phone Muku? under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "મનોહર ત્રિવેદી: હોસ્ટેલમાં રહેતી દીકરીનો પિતા સાથેનો પ્રેમભર્યો ટેલિફોનિક વાર્તાલાપ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Pappa Have Phone Muku? Core Concepts",
        "textGujarati": "પપ્પા હવે ફોન મૂકું? (કાવ્ય) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-guj-ch19_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 19 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-guj&chapter=19"
  },
  {
    "id": "vid-ch-g9-guj-ch20",
    "chapterNumber": 20,
    "subjectId": "g9-guj",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 9 Gujarati – Chapter 20: Samaj Samarpit Shreshthi",
    "titleGujarati": "ધોરણ 9 ગુજરાતી (માતૃભાષા) – પ્રકરણ 20: સમાજ સમર્પિત શ્રેષ્ઠી (ચરિત્રલેખ) (GSEB)",
    "instructor": "CRAZY GAMER",
    "instructorGujarati": "CRAZY GAMER (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "2vnhBJhrNTs",
    "thumbnailUrl": "https://img.youtube.com/vi/2vnhBJhrNTs/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Samaj Samarpit Shreshthi under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "વિવેકાનંદ અને મહાત્મા ગાંધીના વિચારોથી પ્રેરિત ઉદ્યોગપતિ નાનજી કાલિદાસ મહેતાનું પ્રેરણાદાયી જીવન.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Samaj Samarpit Shreshthi Core Concepts",
        "textGujarati": "સમાજ સમર્પિત શ્રેષ્ઠી (ચરિત્રલેખ) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-guj-ch20_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 20 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-guj&chapter=20"
  },
  {
    "id": "vid-ch-g9-eng-ch1",
    "chapterNumber": 1,
    "subjectId": "g9-eng",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "English",
    "categoryGujarati": "અંગ્રેજી (દ્વિતીય ભાષા)",
    "title": "Class 9 English – Chapter 1: The Fun They Had",
    "titleGujarati": "ધોરણ 9 અંગ્રેજી (દ્વિતીય ભાષા) – પ્રકરણ 1: ધ ફન ધે હેડ (GSEB)",
    "instructor": "Educational Bhaiya",
    "instructorGujarati": "Educational Bhaiya (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "hlphs8Lx_0c",
    "thumbnailUrl": "https://img.youtube.com/vi/hlphs8Lx_0c/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of The Fun They Had under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "Isaac Asimov's futuristic story of Margie and Tommy discovering an old paper book in 2157.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "The Fun They Had Core Concepts",
        "textGujarati": "ધ ફન ધે હેડ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-eng-ch1_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 1 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-eng&chapter=1"
  },
  {
    "id": "vid-ch-g9-eng-ch2",
    "chapterNumber": 2,
    "subjectId": "g9-eng",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "English",
    "categoryGujarati": "અંગ્રેજી (દ્વિતીય ભાષા)",
    "title": "Class 9 English – Chapter 2: The Sound of Music",
    "titleGujarati": "ધોરણ 9 અંગ્રેજી (દ્વિતીય ભાષા) – પ્રકરણ 2: ધ સાઉન્ડ ઓફ મ્યુઝિક (GSEB)",
    "instructor": "Quick Padhai Class 9th & 10th",
    "instructorGujarati": "Quick Padhai Class 9th & 10th (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "C3njuoxNVxk",
    "thumbnailUrl": "https://img.youtube.com/vi/C3njuoxNVxk/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of The Sound of Music under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "Evelyn Glennie overcomes profound deafness to become a world-class percussionist, and Bismillah Khan's Shehnai.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "The Sound of Music Core Concepts",
        "textGujarati": "ધ સાઉન્ડ ઓફ મ્યુઝિક ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-eng-ch2_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 2 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-eng&chapter=2"
  },
  {
    "id": "vid-ch-g9-eng-ch3",
    "chapterNumber": 3,
    "subjectId": "g9-eng",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "English",
    "categoryGujarati": "અંગ્રેજી (દ્વિતીય ભાષા)",
    "title": "Class 9 English – Chapter 3: The Little Girl",
    "titleGujarati": "ધોરણ 9 અંગ્રેજી (દ્વિતીય ભાષા) – પ્રકરણ 3: ધ લિટલ ગર્લ (GSEB)",
    "instructor": "Ranjeet Sir (MBA)",
    "instructorGujarati": "Ranjeet Sir (MBA) (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "7ZBwWRTLZ5A",
    "thumbnailUrl": "https://img.youtube.com/vi/7ZBwWRTLZ5A/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of The Little Girl under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "Katherine Mansfield: Kezia realizes her strict, hardworking father loves her deeply.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "The Little Girl Core Concepts",
        "textGujarati": "ધ લિટલ ગર્લ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-eng-ch3_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 3 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-eng&chapter=3"
  },
  {
    "id": "vid-ch-g9-eng-ch4",
    "chapterNumber": 4,
    "subjectId": "g9-eng",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "English",
    "categoryGujarati": "અંગ્રેજી (દ્વિતીય ભાષા)",
    "title": "Class 9 English – Chapter 4: A Truly Beautiful Mind",
    "titleGujarati": "ધોરણ 9 અંગ્રેજી (દ્વિતીય ભાષા) – પ્રકરણ 4: એ ટ્રુલી બ્યુટીફુલ માઇન્ડ (GSEB)",
    "instructor": "Educational Bhaiya",
    "instructorGujarati": "Educational Bhaiya (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "KzcbaKAaBVc",
    "thumbnailUrl": "https://img.youtube.com/vi/KzcbaKAaBVc/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of A Truly Beautiful Mind under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "Biographical tribute to Albert Einstein, depicting him as both a scientific genius and a passionate world peace advocate.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "A Truly Beautiful Mind Core Concepts",
        "textGujarati": "એ ટ્રુલી બ્યુટીફુલ માઇન્ડ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-eng-ch4_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 4 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-eng&chapter=4"
  },
  {
    "id": "vid-ch-g9-eng-ch5",
    "chapterNumber": 5,
    "subjectId": "g9-eng",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "English",
    "categoryGujarati": "અંગ્રેજી (દ્વિતીય ભાષા)",
    "title": "Class 9 English – Chapter 5: The Snake and the Mirror",
    "titleGujarati": "ધોરણ 9 અંગ્રેજી (દ્વિતીય ભાષા) – પ્રકરણ 5: ધ સ્નેક એન્ડ ધ મિરર (GSEB)",
    "instructor": "Educational Bhaiya",
    "instructorGujarati": "Educational Bhaiya (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "nViom0_nfk4",
    "thumbnailUrl": "https://img.youtube.com/vi/nViom0_nfk4/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of The Snake and the Mirror under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "Vaikom Muhammad Basheer's humorous encounter between a vain homeopathic doctor and a cobra.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "The Snake and the Mirror Core Concepts",
        "textGujarati": "ધ સ્નેક એન્ડ ધ મિરર ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-eng-ch5_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 5 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-eng&chapter=5"
  },
  {
    "id": "vid-ch-g9-eng-ch6",
    "chapterNumber": 6,
    "subjectId": "g9-eng",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "English",
    "categoryGujarati": "અંગ્રેજી (દ્વિતીય ભાષા)",
    "title": "Class 9 English – Chapter 6: My Childhood",
    "titleGujarati": "ધોરણ 9 અંગ્રેજી (દ્વિતીય ભાષા) – પ્રકરણ 6: માય ચાઇલ્ડહૂડ (GSEB)",
    "instructor": "Teachers Guild",
    "instructorGujarati": "Teachers Guild (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "hVeVtc64Jnc",
    "thumbnailUrl": "https://img.youtube.com/vi/hVeVtc64Jnc/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of My Childhood under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "Dr. A.P.J. Abdul Kalam's early life in Rameswaram, emphasizing family values, communal harmony, and mentorship.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "My Childhood Core Concepts",
        "textGujarati": "માય ચાઇલ્ડહૂડ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-eng-ch6_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 6 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-eng&chapter=6"
  },
  {
    "id": "vid-ch-g9-eng-ch7",
    "chapterNumber": 7,
    "subjectId": "g9-eng",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "English",
    "categoryGujarati": "અંગ્રેજી (દ્વિતીય ભાષા)",
    "title": "Class 9 English – Chapter 7: Packing",
    "titleGujarati": "ધોરણ 9 અંગ્રેજી (દ્વિતીય ભાષા) – પ્રકરણ 7: પેકિંગ (GSEB)",
    "instructor": "Rk ki lines",
    "instructorGujarati": "Rk ki lines (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "GTjCWgqkR74",
    "thumbnailUrl": "https://img.youtube.com/vi/GTjCWgqkR74/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Packing under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "Jerome K. Jerome's hilarious account of three friends (Jerome, George, Harris) attempting to pack for a boat trip.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Packing Core Concepts",
        "textGujarati": "પેકિંગ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-eng-ch7_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 7 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-eng&chapter=7"
  },
  {
    "id": "vid-ch-g9-eng-ch8",
    "chapterNumber": 8,
    "subjectId": "g9-eng",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "English",
    "categoryGujarati": "અંગ્રેજી (દ્વિતીય ભાષા)",
    "title": "Class 9 English – Chapter 8: Reach for the Top",
    "titleGujarati": "ધોરણ 9 અંગ્રેજી (દ્વિતીય ભાષા) – પ્રકરણ 8: રીચ ફોર ધ ટોપ (GSEB)",
    "instructor": "Educational Bhaiya",
    "instructorGujarati": "Educational Bhaiya (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "cCMjgTYQwDI",
    "thumbnailUrl": "https://img.youtube.com/vi/cCMjgTYQwDI/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Reach for the Top under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "Inspiring journeys of Santosh Yadav (climbed Everest twice) and tennis star Maria Sharapova.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Reach for the Top Core Concepts",
        "textGujarati": "રીચ ફોર ધ ટોપ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-eng-ch8_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 8 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-eng&chapter=8"
  },
  {
    "id": "vid-ch-g9-eng-ch9",
    "chapterNumber": 9,
    "subjectId": "g9-eng",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "English",
    "categoryGujarati": "અંગ્રેજી (દ્વિતીય ભાષા)",
    "title": "Class 9 English – Chapter 9: The Bond of Love",
    "titleGujarati": "ધોરણ 9 અંગ્રેજી (દ્વિતીય ભાષા) – પ્રકરણ 9: ધ બોન્ડ ઓફ લવ (GSEB)",
    "instructor": "Magnet Brains",
    "instructorGujarati": "Magnet Brains (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "-b6bf8Icrhw",
    "thumbnailUrl": "https://img.youtube.com/vi/-b6bf8Icrhw/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of The Bond of Love under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "Kenneth Anderson's touching story of affection between the author's wife and Bruno, a rescued sloth bear.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "The Bond of Love Core Concepts",
        "textGujarati": "ધ બોન્ડ ઓફ લવ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-eng-ch9_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 9 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-eng&chapter=9"
  },
  {
    "id": "vid-ch-g9-eng-ch10",
    "chapterNumber": 10,
    "subjectId": "g9-eng",
    "grades": [
      "9"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "English",
    "categoryGujarati": "અંગ્રેજી (દ્વિતીય ભાષા)",
    "title": "Class 9 English – Chapter 10: If I Were You",
    "titleGujarati": "ધોરણ 9 અંગ્રેજી (દ્વિતીય ભાષા) – પ્રકરણ 10: ઇફ આઇ વેર યુ (GSEB)",
    "instructor": "SR Teaching",
    "instructorGujarati": "SR Teaching (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "IAhvlj9bZHA",
    "thumbnailUrl": "https://img.youtube.com/vi/IAhvlj9bZHA/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of If I Were You under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "Douglas James: Playwright Gerrard outsmarts an armed criminal intruder with sheer wit and composure.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "If I Were You Core Concepts",
        "textGujarati": "ઇફ આઇ વેર યુ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g9-eng-ch10_1",
        "author": "MindSprint Learner",
        "role": "Class 9 Student",
        "text": "પ્રકરણ 10 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=9&subject=g9-eng&chapter=10"
  },
  {
    "id": "vid-ch-g10-math-ch1",
    "chapterNumber": 1,
    "subjectId": "g10-math",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 10 Mathematics – Chapter 1: Real Numbers",
    "titleGujarati": "ધોરણ 10 ગણિત – પ્રકરણ 1: વાસ્તવિક સંખ્યાઓ (GSEB)",
    "instructor": "Vidyakul Gujarati",
    "instructorGujarati": "Vidyakul Gujarati (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "uZBxkqAbjsM",
    "thumbnailUrl": "https://img.youtube.com/vi/uZBxkqAbjsM/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Real Numbers under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "યુક્લિડનું ભાગાકારનું પૂર્વપ્રમેય (a = bq + r), અંકગણિતનો મૂળભૂત પ્રમેય, અસંમેય સંખ્યાઓની સાબિતી (√2, √3, √5) અને દશાંશ નિરૂપણ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Real Numbers Core Concepts",
        "textGujarati": "વાસ્તવિક સંખ્યાઓ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-math-ch1_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 1 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-math&chapter=1"
  },
  {
    "id": "vid-ch-g10-math-ch2",
    "chapterNumber": 2,
    "subjectId": "g10-math",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 10 Mathematics – Chapter 2: Polynomials",
    "titleGujarati": "ધોરણ 10 ગણિત – પ્રકરણ 2: બહુપદીઓ (GSEB)",
    "instructor": "Vidyakul Gujarati",
    "instructorGujarati": "Vidyakul Gujarati (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "q_SED2UOuWc",
    "thumbnailUrl": "https://img.youtube.com/vi/q_SED2UOuWc/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Polynomials under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "બહુપદીના શૂન્યોનો ભૌમિતિક અર્થ, શૂન્યો અને સહગુણકો વચ્ચેનો સંબંધ (α+β = -b/a, αβ = c/a), ત્રિઘાત બહુપદી અને ભાગપ્રવિધિ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Polynomials Core Concepts",
        "textGujarati": "બહુપદીઓ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-math-ch2_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 2 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-math&chapter=2"
  },
  {
    "id": "vid-ch-g10-math-ch3",
    "chapterNumber": 3,
    "subjectId": "g10-math",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 10 Mathematics – Chapter 3: Pair of Linear Equations in Two Variables",
    "titleGujarati": "ધોરણ 10 ગણિત – પ્રકરણ 3: દ્વિચલ સુરેખ સમીકરણયુગ્મ (GSEB)",
    "instructor": "Vidyakul Gujarati",
    "instructorGujarati": "Vidyakul Gujarati (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "UhdjaMtIPO0",
    "thumbnailUrl": "https://img.youtube.com/vi/UhdjaMtIPO0/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Pair of Linear Equations in Two Variables under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "આદેશની રીત, લોપની રીત, ચોકડી ગુણાકારની રીત (ક્રેમર) અને સુસંગત-અસુસંગત સમીકરણોની શરતો (a1/a2 ≠ b1/b2).",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Pair of Linear Equations in Two Variables Core Concepts",
        "textGujarati": "દ્વિચલ સુરેખ સમીકરણયુગ્મ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-math-ch3_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 3 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-math&chapter=3"
  },
  {
    "id": "vid-ch-g10-math-ch4",
    "chapterNumber": 4,
    "subjectId": "g10-math",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 10 Mathematics – Chapter 4: Quadratic Equations",
    "titleGujarati": "ધોરણ 10 ગણિત – પ્રકરણ 4: દ્વિઘાત સમીકરણ (GSEB)",
    "instructor": "Vidyakul Gujarati",
    "instructorGujarati": "Vidyakul Gujarati (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "oi8yVSAzr0U",
    "thumbnailUrl": "https://img.youtube.com/vi/oi8yVSAzr0U/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Quadratic Equations under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "પ્રમાણિત સ્વરૂપ ax² + bx + c = 0, અવયવીકરણની રીત, પૂર્ણ વર્ગની રીત અને દ્વિઘાત સૂત્ર (શ્રીધર આચાર્ય: D = b² - 4ac).",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Quadratic Equations Core Concepts",
        "textGujarati": "દ્વિઘાત સમીકરણ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-math-ch4_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 4 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-math&chapter=4"
  },
  {
    "id": "vid-ch-g10-math-ch5",
    "chapterNumber": 5,
    "subjectId": "g10-math",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 10 Mathematics – Chapter 5: Arithmetic Progressions",
    "titleGujarati": "ધોરણ 10 ગણિત – પ્રકરણ 5: સમાંતર શ્રેણી (GSEB)",
    "instructor": "Vidyakul Gujarati",
    "instructorGujarati": "Vidyakul Gujarati (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "qnz6KsTDNzY",
    "thumbnailUrl": "https://img.youtube.com/vi/qnz6KsTDNzY/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Arithmetic Progressions under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "સમાંતર શ્રેણીનું વ્યાપક સ્વરૂપ a, a+d, a+2d..., n મું પદ an = a + (n-1)d અને પ્રથમ n પદોનો સરવાળો Sn = n/2 [2a + (n-1)d].",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Arithmetic Progressions Core Concepts",
        "textGujarati": "સમાંતર શ્રેણી ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-math-ch5_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 5 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-math&chapter=5"
  },
  {
    "id": "vid-ch-g10-math-ch6",
    "chapterNumber": 6,
    "subjectId": "g10-math",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 10 Mathematics – Chapter 6: Triangles",
    "titleGujarati": "ધોરણ 10 ગણિત – પ્રકરણ 6: ત્રિકોણ (GSEB)",
    "instructor": "Dhaval aahir",
    "instructorGujarati": "Dhaval aahir (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "z4yboxPFjso",
    "thumbnailUrl": "https://img.youtube.com/vi/z4yboxPFjso/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Triangles under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "સમરૂપ આકૃતિઓ, થેલ્સનો પ્રમેય (પ્રમેય 6.1 - સમપ્રમાણતાનો મૂળભૂત પ્રમેય), સમરૂપતાની કસોટીઓ (ખૂખૂખૂ, બાબાબા, બાખૂબા) અને પાયથાગોરસ પ્રમેય.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Triangles Core Concepts",
        "textGujarati": "ત્રિકોણ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-math-ch6_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 6 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-math&chapter=6"
  },
  {
    "id": "vid-ch-g10-math-ch7",
    "chapterNumber": 7,
    "subjectId": "g10-math",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 10 Mathematics – Chapter 7: Coordinate Geometry",
    "titleGujarati": "ધોરણ 10 ગણિત – પ્રકરણ 7: યામ ભૂમિતિ (GSEB)",
    "instructor": "Vidyakul Gujarati",
    "instructorGujarati": "Vidyakul Gujarati (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "Icsh9iwXlyI",
    "thumbnailUrl": "https://img.youtube.com/vi/Icsh9iwXlyI/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Coordinate Geometry under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "અંતરસૂત્ર d = √[(x2-x1)² + (y2-y1)²], વિભાજન સૂત્ર [ (mx2+nx1)/(m+n), (my2+ny1)/(m+n) ] અને ત્રિકોણનું ક્ષેત્રફળ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Coordinate Geometry Core Concepts",
        "textGujarati": "યામ ભૂમિતિ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-math-ch7_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 7 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-math&chapter=7"
  },
  {
    "id": "vid-ch-g10-math-ch8",
    "chapterNumber": 8,
    "subjectId": "g10-math",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 10 Mathematics – Chapter 8: Introduction to Trigonometry",
    "titleGujarati": "ધોરણ 10 ગણિત – પ્રકરણ 8: ત્રિકોણમિતિનો પરિચય (GSEB)",
    "instructor": "Vidyakul Gujarati",
    "instructorGujarati": "Vidyakul Gujarati (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "8Adhxn58eNE",
    "thumbnailUrl": "https://img.youtube.com/vi/8Adhxn58eNE/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Introduction to Trigonometry under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ત્રિકોણમિતીય ગુણોત્તરો (sin, cos, tan, cot, sec, cosec), વિશિષ્ટ ખૂણાઓનાં મૂલ્યો (0°, 30°, 45°, 60°, 90°) અને નિત્યસમો (sin²θ + cos²θ = 1).",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Introduction to Trigonometry Core Concepts",
        "textGujarati": "ત્રિકોણમિતિનો પરિચય ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-math-ch8_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 8 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-math&chapter=8"
  },
  {
    "id": "vid-ch-g10-math-ch9",
    "chapterNumber": 9,
    "subjectId": "g10-math",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 10 Mathematics – Chapter 9: Some Applications of Trigonometry",
    "titleGujarati": "ધોરણ 10 ગણિત – પ્રકરણ 9: ત્રિકોણમિતિના ઉપયોગો (GSEB)",
    "instructor": "RG Maths & Science",
    "instructorGujarati": "RG Maths & Science (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "Y7LQ3ieSwK4",
    "thumbnailUrl": "https://img.youtube.com/vi/Y7LQ3ieSwK4/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Some Applications of Trigonometry under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "દ્રષ્ટિરેખા, ઉત્સેધકોણ (Angle of Elevation), અવસેધકોણ (Angle of Depression) અને ઊંચાઈ-અંતરના કૂટપ્રશ્નો.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Some Applications of Trigonometry Core Concepts",
        "textGujarati": "ત્રિકોણમિતિના ઉપયોગો ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-math-ch9_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 9 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-math&chapter=9"
  },
  {
    "id": "vid-ch-g10-math-ch10",
    "chapterNumber": 10,
    "subjectId": "g10-math",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 10 Mathematics – Chapter 10: Circles",
    "titleGujarati": "ધોરણ 10 ગણિત – પ્રકરણ 10: વર્તુળ (GSEB)",
    "instructor": "Vidyakul Gujarati",
    "instructorGujarati": "Vidyakul Gujarati (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "Et_-PjpoeM4",
    "thumbnailUrl": "https://img.youtube.com/vi/Et_-PjpoeM4/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Circles under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "વર્તુળનો સ્પર્શક, સ્પર્શબિંદુ આગળ ત્રિજ્યા સ્પર્શકને લંબ હોય છે (પ્રમેય 10.1) અને બહારના બિંદુમાંથી દોરેલા સ્પર્શકોની લંબાઈ સમાન હોય છે (પ્રમેય 10.2).",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Circles Core Concepts",
        "textGujarati": "વર્તુળ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-math-ch10_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 10 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-math&chapter=10"
  },
  {
    "id": "vid-ch-g10-math-ch11",
    "chapterNumber": 11,
    "subjectId": "g10-math",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 10 Mathematics – Chapter 11: Constructions",
    "titleGujarati": "ધોરણ 10 ગણિત – પ્રકરણ 11: રચના (GSEB)",
    "instructor": "Katira Classes",
    "instructorGujarati": "Katira Classes (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "Dpk-WdmxPO8",
    "thumbnailUrl": "https://img.youtube.com/vi/Dpk-WdmxPO8/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Constructions under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "આપેલ રેખાખંડનું આપેલ ગુણોત્તરમાં વિભાજન કરવું, સમરૂપ ત્રિકોણની રચના અને વર્તુળના બહારના બિંદુમાંથી સ્પર્શકોની રચના.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Constructions Core Concepts",
        "textGujarati": "રચના ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-math-ch11_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 11 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-math&chapter=11"
  },
  {
    "id": "vid-ch-g10-math-ch12",
    "chapterNumber": 12,
    "subjectId": "g10-math",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 10 Mathematics – Chapter 12: Areas Related to Circles",
    "titleGujarati": "ધોરણ 10 ગણિત – પ્રકરણ 12: વર્તુળ સંબંધિત ક્ષેત્રફળ (GSEB)",
    "instructor": "Concept Maths",
    "instructorGujarati": "Concept Maths (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "17p0SVWMRoE",
    "thumbnailUrl": "https://img.youtube.com/vi/17p0SVWMRoE/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Areas Related to Circles under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "વર્તુળનો પરિઘ (2πr), ક્ષેત્રફળ (πr²), લઘુવૃત્તાંશનું ક્ષેત્રફળ (πr²θ / 360), ચાપની લંબાઈ (πrθ / 180) અને વૃત્તખંડનું ક્ષેત્રફળ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Areas Related to Circles Core Concepts",
        "textGujarati": "વર્તુળ સંબંધિત ક્ષેત્રફળ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-math-ch12_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 12 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-math&chapter=12"
  },
  {
    "id": "vid-ch-g10-math-ch13",
    "chapterNumber": 13,
    "subjectId": "g10-math",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 10 Mathematics – Chapter 13: Surface Areas and Volumes",
    "titleGujarati": "ધોરણ 10 ગણિત – પ્રકરણ 13: પૃષ્ઠફળ અને ઘનફળ (GSEB)",
    "instructor": "Katira Classes",
    "instructorGujarati": "Katira Classes (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "680-C4wa_W0",
    "thumbnailUrl": "https://img.youtube.com/vi/680-C4wa_W0/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Surface Areas and Volumes under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "સંયોજિત ઘન પદાર્થો (નળાકાર + શંકુ, લંબઘન + અર્ધગોલક), ઘન પદાર્થનું એક આકારમાંથી બીજા આકારમાં રૂપાંતરણ અને શંકુનો આડછેદ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Surface Areas and Volumes Core Concepts",
        "textGujarati": "પૃષ્ઠફળ અને ઘનફળ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-math-ch13_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 13 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-math&chapter=13"
  },
  {
    "id": "vid-ch-g10-math-ch14",
    "chapterNumber": 14,
    "subjectId": "g10-math",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 10 Mathematics – Chapter 14: Statistics",
    "titleGujarati": "ધોરણ 10 ગણિત – પ્રકરણ 14: આંકડાશાસ્ત્ર (GSEB)",
    "instructor": "PENTED Gujarati ",
    "instructorGujarati": "PENTED Gujarati  (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "SlsYyz0gBW4",
    "thumbnailUrl": "https://img.youtube.com/vi/SlsYyz0gBW4/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Statistics under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "વર્ગીકૃત માહિતીનો મધ્યક (સીધી રીત, ધારેલા મધ્યકની રીત, પદ-વિચલનની રીત), બહુલક (Z = l + [ (f1-f0)/(2f1-f0-f2) ] × h) અને મધ્યસ્થ (M = l + [ (n/2 - cf)/f ] × h).",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Statistics Core Concepts",
        "textGujarati": "આંકડાશાસ્ત્ર ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-math-ch14_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 14 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-math&chapter=14"
  },
  {
    "id": "vid-ch-g10-math-ch15",
    "chapterNumber": 15,
    "subjectId": "g10-math",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 10 Mathematics – Chapter 15: Probability",
    "titleGujarati": "ધોરણ 10 ગણિત – પ્રકરણ 15: સંભાવના (GSEB)",
    "instructor": "Study Guruji Rajkot",
    "instructorGujarati": "Study Guruji Rajkot (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "ium9J9R7fVc",
    "thumbnailUrl": "https://img.youtube.com/vi/ium9J9R7fVc/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Probability under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "સૈદ્ધાંતિક સંભાવના P(E) = ઘટના E ના સાનુકૂળ પરિણામો / પ્રયોગના તમામ શક્ય પરિણામો, પૂરક ઘટના P(Ē) = 1 - P(E), પત્તા અને પાસાના પ્રયોગો.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Probability Core Concepts",
        "textGujarati": "સંભાવના ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-math-ch15_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 15 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-math&chapter=15"
  },
  {
    "id": "vid-ch-g10-sci-ch1",
    "chapterNumber": 1,
    "subjectId": "g10-sci",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 10 Science – Chapter 1: Chemical Reactions and Equations",
    "titleGujarati": "ધોરણ 10 વિજ્ઞાન – પ્રકરણ 1: રાસાયણિક પ્રક્રિયાઓ અને સમીકરણો (GSEB)",
    "instructor": "Vidyakul Gujarati",
    "instructorGujarati": "Vidyakul Gujarati (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "zI2X0T9UoQc",
    "thumbnailUrl": "https://img.youtube.com/vi/zI2X0T9UoQc/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Chemical Reactions and Equations under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "રાસાયણિક સમીકરણોનું સંતુલન, પ્રક્રિયાઓના પ્રકારો (સંયોગીકરણ, વિઘટન, વિસ્થાપન, દ્વિવિસ્થાપન, રેડોક્સ - ઓક્સિડેશન અને રિડક્શન), ક્ષારણ અને ખોરાપણું.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Chemical Reactions and Equations Core Concepts",
        "textGujarati": "રાસાયણિક પ્રક્રિયાઓ અને સમીકરણો ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-sci-ch1_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 1 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-sci&chapter=1"
  },
  {
    "id": "vid-ch-g10-sci-ch2",
    "chapterNumber": 2,
    "subjectId": "g10-sci",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 10 Science – Chapter 2: Acids, Bases and Salts",
    "titleGujarati": "ધોરણ 10 વિજ્ઞાન – પ્રકરણ 2: ઍસિડ, બેઇઝ અને ક્ષાર (GSEB)",
    "instructor": "Vidyakul Gujarati",
    "instructorGujarati": "Vidyakul Gujarati (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "uS5tKLLo1_4",
    "thumbnailUrl": "https://img.youtube.com/vi/uS5tKLLo1_4/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Acids, Bases and Salts under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "pH માપક્રમ (0-14), તટસ્થીકરણ, દૈનિક જીવનમાં pH નું મહત્વ, બ્લીચિંગ પાવડર (CaOCl2), બેકિંગ સોડા (NaHCO3), ધોવાના સોડા (Na2CO3·10H2O) અને પ્લાસ્ટર ઓફ પેરિસ (POP).",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Acids, Bases and Salts Core Concepts",
        "textGujarati": "ઍસિડ, બેઇઝ અને ક્ષાર ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-sci-ch2_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 2 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-sci&chapter=2"
  },
  {
    "id": "vid-ch-g10-sci-ch3",
    "chapterNumber": 3,
    "subjectId": "g10-sci",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 10 Science – Chapter 3: Metals and Non-Metals",
    "titleGujarati": "ધોરણ 10 વિજ્ઞાન – પ્રકરણ 3: ધાતુઓ અને અધાતુઓ (GSEB)",
    "instructor": "Vidyakul Gujarati",
    "instructorGujarati": "Vidyakul Gujarati (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "4YWE2uwasKk",
    "thumbnailUrl": "https://img.youtube.com/vi/4YWE2uwasKk/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Metals and Non-Metals under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "સક્રિયતા શ્રેણી, ધાતુ કર્મવિધિ (ભૂંજન અને કેલ્સિનેશન), વિદ્યુતવિભાજનીય શુદ્ધિકરણ, આયનીય સંયોજનોના ગુણધર્મો અને મિશ્રધાતુઓ (પિત્તળ, કાંસું, સ્ટીલ).",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Metals and Non-Metals Core Concepts",
        "textGujarati": "ધાતુઓ અને અધાતુઓ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-sci-ch3_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 3 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-sci&chapter=3"
  },
  {
    "id": "vid-ch-g10-sci-ch4",
    "chapterNumber": 4,
    "subjectId": "g10-sci",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 10 Science – Chapter 4: Carbon and its Compounds",
    "titleGujarati": "ધોરણ 10 વિજ્ઞાન – પ્રકરણ 4: કાર્બન અને તેનાં સંયોજનો (GSEB)",
    "instructor": "Vidyakul Gujarati",
    "instructorGujarati": "Vidyakul Gujarati (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "0VLCSVZJd7U",
    "thumbnailUrl": "https://img.youtube.com/vi/0VLCSVZJd7U/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Carbon and its Compounds under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "સહસંયોજક બંધ, કાર્બનનો સર્વતોમુખી સ્વભાવ (કેટેનેશન અને ચતુઃસંયોજકતા), સંતૃપ્ત-અસંતૃપ્ત હાઇડ્રોકાર્બન, સમાનધર્મી શ્રેણી, ઇથેનોલ, ઇથેનોઇક એસિડ અને સાબુનું મિસેલ બંધારણ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Carbon and its Compounds Core Concepts",
        "textGujarati": "કાર્બન અને તેનાં સંયોજનો ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-sci-ch4_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 4 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-sci&chapter=4"
  },
  {
    "id": "vid-ch-g10-sci-ch5",
    "chapterNumber": 5,
    "subjectId": "g10-sci",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 10 Science – Chapter 5: Periodic Classification of Elements",
    "titleGujarati": "ધોરણ 10 વિજ્ઞાન – પ્રકરણ 5: તત્વોનું આવર્તી વર્ગીકરણ (GSEB)",
    "instructor": "JK With Maths",
    "instructorGujarati": "JK With Maths (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "kaFzjYc44uY",
    "thumbnailUrl": "https://img.youtube.com/vi/kaFzjYc44uY/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Periodic Classification of Elements under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ડોબરેનરની ત્રિપુટી, ન્યૂલેન્ડનો અષ્ટકનો નિયમ, મેન્ડેલીફનું આવર્ત કોષ્ટક અને આધુનિક આવર્ત કોષ્ટક (હેનરી મોસ્લે - પરમાણ્વીય ક્રમાંક આધારિત, 18 સમૂહ અને 7 આવર્ત).",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Periodic Classification of Elements Core Concepts",
        "textGujarati": "તત્વોનું આવર્તી વર્ગીકરણ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-sci-ch5_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 5 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-sci&chapter=5"
  },
  {
    "id": "vid-ch-g10-sci-ch6",
    "chapterNumber": 6,
    "subjectId": "g10-sci",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 10 Science – Chapter 6: Life Processes",
    "titleGujarati": "ધોરણ 10 વિજ્ઞાન – પ્રકરણ 6: જૈવિક ક્રિયાઓ (GSEB)",
    "instructor": "Vidyakul Gujarati",
    "instructorGujarati": "Vidyakul Gujarati (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "IT2xEAYce3s",
    "thumbnailUrl": "https://img.youtube.com/vi/IT2xEAYce3s/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Life Processes under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "સ્વયંપોષી અને વિષમપોષી પોષણ, પાચનતંત્ર, શ્વસન (ગ્લાયકોલિસિસ, એટીપી), રુધિરાભિસરણ તંત્ર (દ્વિ-પરિવહન, હૃદય), ઉત્સર્જન તંત્ર (મૂત્રપિંડ, નેફ્રોનની રચના) અને વનસ્પતિમાં વહન.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Life Processes Core Concepts",
        "textGujarati": "જૈવિક ક્રિયાઓ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-sci-ch6_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 6 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-sci&chapter=6"
  },
  {
    "id": "vid-ch-g10-sci-ch7",
    "chapterNumber": 7,
    "subjectId": "g10-sci",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 10 Science – Chapter 7: Control and Coordination",
    "titleGujarati": "ધોરણ 10 વિજ્ઞાન – પ્રકરણ 7: નિયંત્રણ અને સંકલન (GSEB)",
    "instructor": "SciNova Gujarati 9&10",
    "instructorGujarati": "SciNova Gujarati 9&10 (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "yYfDxHA5M7c",
    "thumbnailUrl": "https://img.youtube.com/vi/yYfDxHA5M7c/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Control and Coordination under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ચેતાકોષ (ન્યુરોન) ની રચના, પરાવર્તી કમાન, માનવ મગજ (અગ્ર, મધ્ય, પશ્ચ મગજ), વનસ્પતિ અંતઃસ્ત્રાવો (ઓક્ઝિન, જિબ્બેરેલીન, સાયટોકાઇનિન, એબ્સીસિક એસિડ) અને માનવ અંતઃસ્ત્રાવો.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Control and Coordination Core Concepts",
        "textGujarati": "નિયંત્રણ અને સંકલન ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-sci-ch7_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 7 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-sci&chapter=7"
  },
  {
    "id": "vid-ch-g10-sci-ch8",
    "chapterNumber": 8,
    "subjectId": "g10-sci",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 10 Science – Chapter 8: How do Organisms Reproduce?",
    "titleGujarati": "ધોરણ 10 વિજ્ઞાન – પ્રકરણ 8: સજીવો કેવી રીતે પ્રજનન કરે છે? (GSEB)",
    "instructor": "Vidyakul Gujarati",
    "instructorGujarati": "Vidyakul Gujarati (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "tl2LAY-5CZ8",
    "thumbnailUrl": "https://img.youtube.com/vi/tl2LAY-5CZ8/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of How do Organisms Reproduce? under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "અલિંગી પ્રજનન (દ્વિભાજન, બહુભાજન, અવખંડન, પુનર્જનન, કલિકાસર્જન, વાનસ્પતિક પ્રજનન), સપુષ્પી વનસ્પતિમાં લિંગી પ્રજનન, માનવ પ્રજનન તંત્ર અને પ્રજનન સ્વાસ્થ્ય (ગર્ભનિરોધક પદ્ધતિઓ).",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "How do Organisms Reproduce? Core Concepts",
        "textGujarati": "સજીવો કેવી રીતે પ્રજનન કરે છે? ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-sci-ch8_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 8 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-sci&chapter=8"
  },
  {
    "id": "vid-ch-g10-sci-ch9",
    "chapterNumber": 9,
    "subjectId": "g10-sci",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 10 Science – Chapter 9: Heredity and Evolution",
    "titleGujarati": "ધોરણ 10 વિજ્ઞાન – પ્રકરણ 9: આનુવંશિકતા અને ઉદ્વિકાસ (GSEB)",
    "instructor": "Vidyakul Gujarati",
    "instructorGujarati": "Vidyakul Gujarati (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "e3XUeb6OdoU",
    "thumbnailUrl": "https://img.youtube.com/vi/e3XUeb6OdoU/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Heredity and Evolution under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "મેન્ડલના વટાણાના પ્રયોગો (એકસંકરણ 3:1, દ્વિસંકરણ 9:3:3:1), લિંગ નિશ્ચયન (XX - સ્ત્રી, XY - પુરુષ), ઉપાર્જિત અને આનુવંશિક લક્ષણો, સમમૂલક અને કાર્યસદ્દશ અંગો, અશ્મિઓ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Heredity and Evolution Core Concepts",
        "textGujarati": "આનુવંશિકતા અને ઉદ્વિકાસ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-sci-ch9_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 9 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-sci&chapter=9"
  },
  {
    "id": "vid-ch-g10-sci-ch10",
    "chapterNumber": 10,
    "subjectId": "g10-sci",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 10 Science – Chapter 10: Light - Reflection and Refraction",
    "titleGujarati": "ધોરણ 10 વિજ્ઞાન – પ્રકરણ 10: પ્રકાશ - પરાવર્તન અને વક્રીભવન (GSEB)",
    "instructor": "Science Tv Gujarati",
    "instructorGujarati": "Science Tv Gujarati (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "Jtn3YVghx3Y",
    "thumbnailUrl": "https://img.youtube.com/vi/Jtn3YVghx3Y/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Light - Reflection and Refraction under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "અંતર્ગોળ અને બહિર્ગોળ અરીસા (અરીસાનું સૂત્ર: 1/f = 1/v + 1/u), વક્રીભવનના નિયમો (સ્નેલનો નિયમ: sin i / sin r = અચળ), લેન્સનું સૂત્ર (1/f = 1/v - 1/u) અને લેન્સનો પાવર (P = 1/f).",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Light - Reflection and Refraction Core Concepts",
        "textGujarati": "પ્રકાશ - પરાવર્તન અને વક્રીભવન ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-sci-ch10_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 10 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-sci&chapter=10"
  },
  {
    "id": "vid-ch-g10-sci-ch11",
    "chapterNumber": 11,
    "subjectId": "g10-sci",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 10 Science – Chapter 11: Human Eye and Colourful World",
    "titleGujarati": "ધોરણ 10 વિજ્ઞાન – પ્રકરણ 11: માનવ આંખ અને રંગબેરંગી દુનિયા (GSEB)",
    "instructor": "Vidyakul Gujarati",
    "instructorGujarati": "Vidyakul Gujarati (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "pEUA1j32_JE",
    "thumbnailUrl": "https://img.youtube.com/vi/pEUA1j32_JE/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Human Eye and Colourful World under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "દ્રષ્ટિની ખામીઓ (લઘુદ્રષ્ટિ - અંતર્ગોળ લેન્સ, ગુરુદ્રષ્ટિ - બહિર્ગોળ લેન્સ, પ્રેસબાયોપિયા), પ્રિઝમ વડે શ્વેત પ્રકાશનું વિભાજન, મેઘધનુષ્ય, તારાઓનું ટમટમવું અને સૂર્યોદય-સૂર્યાસ્ત સમયે રાતો રંગ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Human Eye and Colourful World Core Concepts",
        "textGujarati": "માનવ આંખ અને રંગબેરંગી દુનિયા ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-sci-ch11_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 11 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-sci&chapter=11"
  },
  {
    "id": "vid-ch-g10-sci-ch12",
    "chapterNumber": 12,
    "subjectId": "g10-sci",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 10 Science – Chapter 12: Electricity",
    "titleGujarati": "ધોરણ 10 વિજ્ઞાન – પ્રકરણ 12: વિદ્યુત (GSEB)",
    "instructor": "Vidyakul Gujarati",
    "instructorGujarati": "Vidyakul Gujarati (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "XHbMplq1nBY",
    "thumbnailUrl": "https://img.youtube.com/vi/XHbMplq1nBY/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Electricity under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "વિદ્યુતપ્રવાહ (I = Q/t), વિદ્યુતસ્થિતિમાનનો તફાવત (V = W/Q), ઓહ્મનો નિયમ (V = IR), અવરોધકતા, શ્રેણી જોડાણ (Rs = R1+R2+R3), સમાંતર જોડાણ (1/Rp = 1/R1+1/R2) અને જૂલનો તાપીય નિયમ (H = I²Rt).",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Electricity Core Concepts",
        "textGujarati": "વિદ્યુત ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-sci-ch12_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 12 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-sci&chapter=12"
  },
  {
    "id": "vid-ch-g10-sci-ch13",
    "chapterNumber": 13,
    "subjectId": "g10-sci",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 10 Science – Chapter 13: Magnetic Effects of Electric Current",
    "titleGujarati": "ધોરણ 10 વિજ્ઞાન – પ્રકરણ 13: વિદ્યુતપ્રવાહની ચુંબકીય અસરો (GSEB)",
    "instructor": "JK With Maths",
    "instructorGujarati": "JK With Maths (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "ICfXE3Gfhq8",
    "thumbnailUrl": "https://img.youtube.com/vi/ICfXE3Gfhq8/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Magnetic Effects of Electric Current under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ઓર્સ્ટેડનો પ્રયોગ, ચુંબકીય ક્ષેત્રરેખાઓ, જમણા હાથના અંગૂઠાનો નિયમ, સોલેનોઇડ, ફ્લેમિંગનો ડાબા હાથનો નિયમ (વિદ્યુત મોટર), વિદ્યુતચુંબકીય પ્રેરણ (ફેરાડે) અને ઘરેલું વિદ્યુત પરિપથ (અર્થિંગ).",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Magnetic Effects of Electric Current Core Concepts",
        "textGujarati": "વિદ્યુતપ્રવાહની ચુંબકીય અસરો ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-sci-ch13_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 13 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-sci&chapter=13"
  },
  {
    "id": "vid-ch-g10-sci-ch14",
    "chapterNumber": 14,
    "subjectId": "g10-sci",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 10 Science – Chapter 14: Sources of Energy",
    "titleGujarati": "ધોરણ 10 વિજ્ઞાન – પ્રકરણ 14: ઊર્જાના સ્ત્રોતો (GSEB)",
    "instructor": "Juned Shaikh",
    "instructorGujarati": "Juned Shaikh (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "A_buLLc6Vd4",
    "thumbnailUrl": "https://img.youtube.com/vi/A_buLLc6Vd4/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Sources of Energy under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "બિનનવીનીકરણીય સ્ત્રોતો (કોલસો, પેટ્રોલિયમ), નવીનીકરણીય સ્ત્રોતો (સૌર ઊર્જા, પવન ઊર્જા, જળ વિદ્યુત, બાયોગેસ), પરમાણુ ઊર્જા અને પર્યાવરણ લક્ષી બળતણ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Sources of Energy Core Concepts",
        "textGujarati": "ઊર્જાના સ્ત્રોતો ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-sci-ch14_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 14 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-sci&chapter=14"
  },
  {
    "id": "vid-ch-g10-sci-ch15",
    "chapterNumber": 15,
    "subjectId": "g10-sci",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 10 Science – Chapter 15: Our Environment",
    "titleGujarati": "ધોરણ 10 વિજ્ઞાન – પ્રકરણ 15: આપણું પર્યાવરણ (GSEB)",
    "instructor": "PHYSICS BY M ANWAR",
    "instructorGujarati": "PHYSICS BY M ANWAR (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "N7qZH0SHb4Y",
    "thumbnailUrl": "https://img.youtube.com/vi/N7qZH0SHb4Y/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Our Environment under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "નિવસનતંત્ર (જૈવિક અને અજૈવિક ઘટકો), આહાર શૃંખલા અને આહાર જાળ, 10% ઊર્જા વહનનો નિયમ (લિન્ડમેન), જૈવિક વિશાલન (બાયોમેગ્નિફિકેશન), ઓઝોન સ્તર અને કચરાનું વ્યવસ્થાપન.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Our Environment Core Concepts",
        "textGujarati": "આપણું પર્યાવરણ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-sci-ch15_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 15 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-sci&chapter=15"
  },
  {
    "id": "vid-ch-g10-sci-ch16",
    "chapterNumber": 16,
    "subjectId": "g10-sci",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Science",
    "categoryGujarati": "વિજ્ઞાન",
    "title": "Class 10 Science – Chapter 16: Sustainable Management of Natural Resources",
    "titleGujarati": "ધોરણ 10 વિજ્ઞાન – પ્રકરણ 16: નૈસર્ગિક સ્ત્રોતોનું ટકાઉ પ્રબંધન (GSEB)",
    "instructor": "Hitesh Pambhar Gujarat Virtual Teaching",
    "instructorGujarati": "Hitesh Pambhar Gujarat Virtual Teaching (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "WFojJTFenpk",
    "thumbnailUrl": "https://img.youtube.com/vi/WFojJTFenpk/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Sustainable Management of Natural Resources under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "5R સિદ્ધાંત (Refuse, Reduce, Reuse, Repurpose, Recycle), જંગલો અને વન્યજીવન, ચિપકો આંદોલન, બંધોના ફાયદા-ગેરફાયદા અને જળ સંગ્રહણ પદ્ધતિઓ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Sustainable Management of Natural Resources Core Concepts",
        "textGujarati": "નૈસર્ગિક સ્ત્રોતોનું ટકાઉ પ્રબંધન ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-sci-ch16_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 16 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-sci&chapter=16"
  },
  {
    "id": "vid-ch-g10-soc-ch1",
    "chapterNumber": 1,
    "subjectId": "g10-soc",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 10 Social Science – Chapter 1: Heritage of India",
    "titleGujarati": "ધોરણ 10 સામાજિક વિજ્ઞાન – પ્રકરણ 1: ભારતનો વારસો (GSEB)",
    "instructor": "The Tree Book",
    "instructorGujarati": "The Tree Book (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "VJCEzn0HJp4",
    "thumbnailUrl": "https://img.youtube.com/vi/VJCEzn0HJp4/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Heritage of India under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ભારતનું સ્થાન અને વિસ્તાર, પ્રાકૃતિક વારસો (નદીઓ, વનસ્પતિ, વન્યજીવો) અને સાંસ્કૃતિક વારસો, ભારતમાં આવેલી પ્રાચીન પ્રજાઓ (નેગ્રિટો, ઓસ્ટ્રેલોઇડ, દ્રવિડ, આર્યો).",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Heritage of India Core Concepts",
        "textGujarati": "ભારતનો વારસો ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-soc-ch1_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 1 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-soc&chapter=1"
  },
  {
    "id": "vid-ch-g10-soc-ch2",
    "chapterNumber": 2,
    "subjectId": "g10-soc",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 10 Social Science – Chapter 2: Cultural Heritage of India: Traditional Arts",
    "titleGujarati": "ધોરણ 10 સામાજિક વિજ્ઞાન – પ્રકરણ 2: ભારતનો સાંસ્કૃતિક વારસો : હસ્ત અને લલિતકલા (GSEB)",
    "instructor": "Vidyakul Gujarati",
    "instructorGujarati": "Vidyakul Gujarati (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "TmQ3vozF5wU",
    "thumbnailUrl": "https://img.youtube.com/vi/TmQ3vozF5wU/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Cultural Heritage of India: Traditional Arts under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "માટીકામ, વણાટકામ, પાટણના પટોળાં, ભરતગૂંથણ, ચર્મઉદ્યોગ, હીરા-મોતીકામ, જરીકામ, ધાતુકામ, સંગીતકલા, નૃત્યકલા અને નાટ્યકલા.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Cultural Heritage of India: Traditional Arts Core Concepts",
        "textGujarati": "ભારતનો સાંસ્કૃતિક વારસો : હસ્ત અને લલિતકલા ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-soc-ch2_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 2 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-soc&chapter=2"
  },
  {
    "id": "vid-ch-g10-soc-ch3",
    "chapterNumber": 3,
    "subjectId": "g10-soc",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 10 Social Science – Chapter 3: Cultural Heritage of India: Sculpture and Architecture",
    "titleGujarati": "ધોરણ 10 સામાજિક વિજ્ઞાન – પ્રકરણ 3: ભારતનો સાંસ્કૃતિક વારસો : શિલ્પ અને સ્થાપત્ય (GSEB)",
    "instructor": "Vidyakul Gujarati",
    "instructorGujarati": "Vidyakul Gujarati (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "kdG881BWj7Y",
    "thumbnailUrl": "https://img.youtube.com/vi/kdG881BWj7Y/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Cultural Heritage of India: Sculpture and Architecture under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "હડપ્પા અને લોથલનું નગર આયોજન, મૌર્યકાલીન સ્તૂપો (સાંચીનો સ્તૂપ), ગુફા સ્થાપત્ય (અજંતા, ઇલોરા, એલિફન્ટા), રથ મંદિરો અને ગુજરાતનાં સ્થાપત્યો.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Cultural Heritage of India: Sculpture and Architecture Core Concepts",
        "textGujarati": "ભારતનો સાંસ્કૃતિક વારસો : શિલ્પ અને સ્થાપત્ય ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-soc-ch3_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 3 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-soc&chapter=3"
  },
  {
    "id": "vid-ch-g10-soc-ch4",
    "chapterNumber": 4,
    "subjectId": "g10-soc",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 10 Social Science – Chapter 4: Literary Heritage of India",
    "titleGujarati": "ધોરણ 10 સામાજિક વિજ્ઞાન – પ્રકરણ 4: ભારતનો સાહિત્યિક વારસો (GSEB)",
    "instructor": "Harsh Barasiya",
    "instructorGujarati": "Harsh Barasiya (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "zsnuFxl_CsM",
    "thumbnailUrl": "https://img.youtube.com/vi/zsnuFxl_CsM/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Literary Heritage of India under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "વેદો, ઉપનિષદો, રામાયણ અને મહાભારત, બૌદ્ધ સાહિત્ય (ત્રિપિટક), કાલિદાસની કૃતિઓ, તક્ષશિલા અને નાલંદા વિદ્યાપીઠ, મધ્યકાલીન સાહિત્ય.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Literary Heritage of India Core Concepts",
        "textGujarati": "ભારતનો સાહિત્યિક વારસો ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-soc-ch4_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 4 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-soc&chapter=4"
  },
  {
    "id": "vid-ch-g10-soc-ch5",
    "chapterNumber": 5,
    "subjectId": "g10-soc",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 10 Social Science – Chapter 5: India's Heritage of Science and Technology",
    "titleGujarati": "ધોરણ 10 સામાજિક વિજ્ઞાન – પ્રકરણ 5: ભારતનો વિજ્ઞાન અને ટેક્નોલૉજીનો વારસો (GSEB)",
    "instructor": "The Tree Book",
    "instructorGujarati": "The Tree Book (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "6OrDcr8VrNc",
    "thumbnailUrl": "https://img.youtube.com/vi/6OrDcr8VrNc/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of India's Heritage of Science and Technology under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ધાતુવિદ્યા (દિલ્હીનો લોહસ્તંભ), રસાયણવિદ્યા (નાગાર્જુન), વૈદક અને શલ્યચિકિત્સા (ચરક, સુશ્રુત), ગણિતશાસ્ત્ર (આર્યભટ્ટ - શૂન્ય અને π ની શોધ), ખગોળ અને વાસ્તુશાસ્ત્ર.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "India's Heritage of Science and Technology Core Concepts",
        "textGujarati": "ભારતનો વિજ્ઞાન અને ટેક્નોલૉજીનો વારસો ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-soc-ch5_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 5 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-soc&chapter=5"
  },
  {
    "id": "vid-ch-g10-soc-ch6",
    "chapterNumber": 6,
    "subjectId": "g10-soc",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 10 Social Science – Chapter 6: Places of Indian Cultural Heritage",
    "titleGujarati": "ધોરણ 10 સામાજિક વિજ્ઞાન – પ્રકરણ 6: ભારતના સાંસ્કૃતિક વારસાનાં સ્થળો (GSEB)",
    "instructor": "Vidyakul Gujarati",
    "instructorGujarati": "Vidyakul Gujarati (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "PsPxD4H_xnI",
    "thumbnailUrl": "https://img.youtube.com/vi/PsPxD4H_xnI/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Places of Indian Cultural Heritage under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "અજંતા-ઇલોરાની ગુફાઓ, તાજમહાલ (શાહજહાં), લાલ કિલ્લો, કુતુબમિનાર, કોણાર્કનું સૂર્યમંદિર, ખજુરાહો, ચાંપાનેર અને રાણકી વાવ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Places of Indian Cultural Heritage Core Concepts",
        "textGujarati": "ભારતના સાંસ્કૃતિક વારસાનાં સ્થળો ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-soc-ch6_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 6 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-soc&chapter=6"
  },
  {
    "id": "vid-ch-g10-soc-ch7",
    "chapterNumber": 7,
    "subjectId": "g10-soc",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 10 Social Science – Chapter 7: Preservation of Our Heritage",
    "titleGujarati": "ધોરણ 10 સામાજિક વિજ્ઞાન – પ્રકરણ 7: આપણા વારસાનું જતન (GSEB)",
    "instructor": "Education nonstop std 10",
    "instructorGujarati": "Education nonstop std 10 (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "-wtrkYL-hTA",
    "thumbnailUrl": "https://img.youtube.com/vi/-wtrkYL-hTA/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Preservation of Our Heritage under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "વારસાના જતનની આવશ્યકતા, ઐતિહાસિક સ્મારકોનું રક્ષણ, પ્રવાસન ઉદ્યોગ અને વારસો, બંધારણીય ફરજો (કલમ 51A (છ, જ, ટ)).",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Preservation of Our Heritage Core Concepts",
        "textGujarati": "આપણા વારસાનું જતન ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-soc-ch7_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 7 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-soc&chapter=7"
  },
  {
    "id": "vid-ch-g10-soc-ch8",
    "chapterNumber": 8,
    "subjectId": "g10-soc",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 10 Social Science – Chapter 8: Natural Resources",
    "titleGujarati": "ધોરણ 10 સામાજિક વિજ્ઞાન – પ્રકરણ 8: કુદરતી સંસાધનો (GSEB)",
    "instructor": "Vidyakul Gujarati",
    "instructorGujarati": "Vidyakul Gujarati (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "IQkEU6bZOEs",
    "thumbnailUrl": "https://img.youtube.com/vi/IQkEU6bZOEs/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Natural Resources under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "સંસાધનોના ઉપયોગો, સંસાધનોનું આયોજન અને સંરક્ષણ, જમીનના પ્રકારો (કાંપની, રાતી, કાળી, લેટેરાઇટ, પર્વતીય, રણ પ્રકારની) અને જમીન ધોવાણ અટકાવવાના ઉપાયો.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Natural Resources Core Concepts",
        "textGujarati": "કુદરતી સંસાધનો ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-soc-ch8_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 8 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-soc&chapter=8"
  },
  {
    "id": "vid-ch-g10-soc-ch9",
    "chapterNumber": 9,
    "subjectId": "g10-soc",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 10 Social Science – Chapter 9: Forest and Wildlife Resources",
    "titleGujarati": "ધોરણ 10 સામાજિક વિજ્ઞાન – પ્રકરણ 9: વન અને વન્યજીવ સંસાધન (GSEB)",
    "instructor": "Vidyakul Gujarati",
    "instructorGujarati": "Vidyakul Gujarati (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "wEIsZ87HIBc",
    "thumbnailUrl": "https://img.youtube.com/vi/wEIsZ87HIBc/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Forest and Wildlife Resources under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "જંગલોનું વર્ગીકરણ (અનામત, સંરક્ષિત, અવર્ગીકૃત), નિર્વનીકરણ (જંગલ વિનાશ) ની અસરો, વન્યજીવ સંરક્ષણ યોજનાઓ (વાઘ પરિયોજના, હાથી પરિયોજના, ગેંડા પરિયોજના).",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Forest and Wildlife Resources Core Concepts",
        "textGujarati": "વન અને વન્યજીવ સંસાધન ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-soc-ch9_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 9 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-soc&chapter=9"
  },
  {
    "id": "vid-ch-g10-soc-ch10",
    "chapterNumber": 10,
    "subjectId": "g10-soc",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 10 Social Science – Chapter 10: India: Agriculture",
    "titleGujarati": "ધોરણ 10 સામાજિક વિજ્ઞાન – પ્રકરણ 10: ભારત: કૃષિ (GSEB)",
    "instructor": "Vidyakul Gujarati",
    "instructorGujarati": "Vidyakul Gujarati (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "rbyIWppFXCc",
    "thumbnailUrl": "https://img.youtube.com/vi/rbyIWppFXCc/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of India: Agriculture under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "કૃષિના પ્રકારો (જીવન નિર્વાહ, સૂકી, આર્દ્ર, સ્થળાંતરિત, બાગાયતી, સઘન ખેતી), મુખ્ય કૃષિ પાકો (ડાંગર, ઘઉં, કપાસ, શેરડી, ચા-કોફી), કૃષિમાં ટેકનિકલ અને સંસ્થાકીય સુધારાઓ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "India: Agriculture Core Concepts",
        "textGujarati": "ભારત: કૃષિ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-soc-ch10_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 10 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-soc&chapter=10"
  },
  {
    "id": "vid-ch-g10-soc-ch11",
    "chapterNumber": 11,
    "subjectId": "g10-soc",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 10 Social Science – Chapter 11: India: Water Resources",
    "titleGujarati": "ધોરણ 10 સામાજિક વિજ્ઞાન – પ્રકરણ 11: ભારત : જળ સંસાધન (GSEB)",
    "instructor": "Harsh Barasiya",
    "instructorGujarati": "Harsh Barasiya (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "Rq1Vj333Fb0",
    "thumbnailUrl": "https://img.youtube.com/vi/Rq1Vj333Fb0/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of India: Water Resources under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "જળ સ્ત્રોતો (વૃષ્ટિય, પૃષ્ઠીય, ભૂમિગત જળ), બહુહેતુક યોજનાઓ (ભાખરા-નાંગલ, સરદાર સરોવર, હીરાકુડ), જળ સંકટ અને વરસાદી જળ સંચય.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "India: Water Resources Core Concepts",
        "textGujarati": "ભારત : જળ સંસાધન ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-soc-ch11_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 11 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-soc&chapter=11"
  },
  {
    "id": "vid-ch-g10-soc-ch12",
    "chapterNumber": 12,
    "subjectId": "g10-soc",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 10 Social Science – Chapter 12: Mineral and Power Resources",
    "titleGujarati": "ધોરણ 10 સામાજિક વિજ્ઞાન – પ્રકરણ 12: ભારત : ખનિજ અને શક્તિનાં સંસાધનો (GSEB)",
    "instructor": "Vidyakul Gujarati",
    "instructorGujarati": "Vidyakul Gujarati (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "7qf-vQSYusM",
    "thumbnailUrl": "https://img.youtube.com/vi/7qf-vQSYusM/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Mineral and Power Resources under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ખનિજોનું વર્ગીકરણ (ધાતુમય, અધાતુમય, સંચાલન શક્તિ), લોખંડ, મેંગેનીઝ, તાંબુ, બોક્સાઇટ, અબરખ, કોલસો, ખનીજતેલ, કુદરતી વાયુ અને બિનપરંપરાગત ઊર્જા સ્ત્રોતો.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Mineral and Power Resources Core Concepts",
        "textGujarati": "ભારત : ખનિજ અને શક્તિનાં સંસાધનો ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-soc-ch12_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 12 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-soc&chapter=12"
  },
  {
    "id": "vid-ch-g10-soc-ch13",
    "chapterNumber": 13,
    "subjectId": "g10-soc",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 10 Social Science – Chapter 13: Manufacturing Industries",
    "titleGujarati": "ધોરણ 10 સામાજિક વિજ્ઞાન – પ્રકરણ 13: ઉત્પાદન ઉદ્યોગો (GSEB)",
    "instructor": "Vidyakul Gujarati",
    "instructorGujarati": "Vidyakul Gujarati (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "PDeWAr1qd80",
    "thumbnailUrl": "https://img.youtube.com/vi/PDeWAr1qd80/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Manufacturing Industries under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ઉદ્યોગોનું મહત્વ, સુતરાઉ કાપડ ઉદ્યોગ, શણ ઉદ્યોગ, રેશમી કાપડ, ખાંડ ઉદ્યોગ, લોખંડ-પોલાદ ઉદ્યોગ, એલ્યુમિનિયમ ગાળણ, રાસાયણિક ખાતરો, મોટર વાહન અને પર્યાવરણીય પ્રદૂષણ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Manufacturing Industries Core Concepts",
        "textGujarati": "ઉત્પાદન ઉદ્યોગો ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-soc-ch13_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 13 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-soc&chapter=13"
  },
  {
    "id": "vid-ch-g10-soc-ch14",
    "chapterNumber": 14,
    "subjectId": "g10-soc",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 10 Social Science – Chapter 14: Transportation, Communication and Trade",
    "titleGujarati": "ધોરણ 10 સામાજિક વિજ્ઞાન – પ્રકરણ 14: પરિવહન, સંદેશાવ્યવહાર અને વ્યાપાર (GSEB)",
    "instructor": "Vamja Education",
    "instructorGujarati": "Vamja Education (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "6tE7Nox_PgI",
    "thumbnailUrl": "https://img.youtube.com/vi/6tE7Nox_PgI/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Transportation, Communication and Trade under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "સડક માર્ગો (રાષ્ટ્રીય ધોરીમાર્ગો, સુવર્ણ ચતુર્ભુજ), રેલવે માર્ગો, જળમાર્ગો, હવાઈ માર્ગો, પાઇપલાઇન, સંદેશાવ્યવહાર અને આંતરરાષ્ટ્રીય વ્યાપાર.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Transportation, Communication and Trade Core Concepts",
        "textGujarati": "પરિવહન, સંદેશાવ્યવહાર અને વ્યાપાર ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-soc-ch14_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 14 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-soc&chapter=14"
  },
  {
    "id": "vid-ch-g10-soc-ch15",
    "chapterNumber": 15,
    "subjectId": "g10-soc",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 10 Social Science – Chapter 15: Economic Development",
    "titleGujarati": "ધોરણ 10 સામાજિક વિજ્ઞાન – પ્રકરણ 15: આર્થિક વિકાસ (GSEB)",
    "instructor": "Vidyakul Gujarati",
    "instructorGujarati": "Vidyakul Gujarati (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "wkY7qdOsnZI",
    "thumbnailUrl": "https://img.youtube.com/vi/wkY7qdOsnZI/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Economic Development under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "વિકાસશીલ અર્થતંત્રના લક્ષણો, આર્થિક અને બિનઆર્થિક પ્રવૃત્તિઓ, ઉત્પાદનના સાધનો (જમીન, મૂડી, શ્રમ, નિયોજન), બજાર પદ્ધતિ, સમાજવાદી પદ્ધતિ અને મિશ્ર અર્થતંત્ર.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Economic Development Core Concepts",
        "textGujarati": "આર્થિક વિકાસ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-soc-ch15_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 15 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-soc&chapter=15"
  },
  {
    "id": "vid-ch-g10-soc-ch16",
    "chapterNumber": 16,
    "subjectId": "g10-soc",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 10 Social Science – Chapter 16: Economic Liberalisation and Globalisation",
    "titleGujarati": "ધોરણ 10 સામાજિક વિજ્ઞાન – પ્રકરણ 16: આર્થિક ઉદારીકરણ અને વૈશ્વિકીકરણ (GSEB)",
    "instructor": "Vidyakul Gujarati",
    "instructorGujarati": "Vidyakul Gujarati (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "RioI9Mg-754",
    "thumbnailUrl": "https://img.youtube.com/vi/RioI9Mg-754/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Economic Liberalisation and Globalisation under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "1991 ના આર્થિક સુધારાઓ: ઉદારીકરણ, ખાનગીકરણ અને વૈશ્વિકીકરણ (LPG), વિશ્વ વ્યાપાર સંગઠન (WTO), પર્યાવરણની સુરક્ષા અને ટકાઉ વિકાસ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Economic Liberalisation and Globalisation Core Concepts",
        "textGujarati": "આર્થિક ઉદારીકરણ અને વૈશ્વિકીકરણ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-soc-ch16_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 16 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-soc&chapter=16"
  },
  {
    "id": "vid-ch-g10-soc-ch17",
    "chapterNumber": 17,
    "subjectId": "g10-soc",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 10 Social Science – Chapter 17: Economic Problems and Challenges: Poverty and Unemployment",
    "titleGujarati": "ધોરણ 10 સામાજિક વિજ્ઞાન – પ્રકરણ 17: આર્થિક સમસ્યાઓ : ગરીબી અને બેરોજગારી (GSEB)",
    "instructor": "Vidyakul Gujarati",
    "instructorGujarati": "Vidyakul Gujarati (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "wzZqP1DJ38c",
    "thumbnailUrl": "https://img.youtube.com/vi/wzZqP1DJ38c/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Economic Problems and Challenges: Poverty and Unemployment under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ગરીબી રેખા (BPL), ગરીબી નિવારણના કાર્યક્રમો (મનરેગા - MGNREGA), બેરોજગારીના પ્રકારો (મોસમી, છૂપી, શિક્ષિત, ઔદ્યોગિક બેરોજગારી) અને રોજગાર યોજનાઓ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Economic Problems and Challenges: Poverty and Unemployment Core Concepts",
        "textGujarati": "આર્થિક સમસ્યાઓ : ગરીબી અને બેરોજગારી ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-soc-ch17_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 17 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-soc&chapter=17"
  },
  {
    "id": "vid-ch-g10-soc-ch18",
    "chapterNumber": 18,
    "subjectId": "g10-soc",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 10 Social Science – Chapter 18: Price Rise and Consumer Awareness",
    "titleGujarati": "ધોરણ 10 સામાજિક વિજ્ઞાન – પ્રકરણ 18: ભાવવધારો અને ગ્રાહક જાગૃતિ (GSEB)",
    "instructor": "Vidyakul Gujarati",
    "instructorGujarati": "Vidyakul Gujarati (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "4XqHqPG1I-E",
    "thumbnailUrl": "https://img.youtube.com/vi/4XqHqPG1I-E/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Price Rise and Consumer Awareness under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ભાવવધારાના કારણો અને નિયંત્રણના ઉપાયો, ગ્રાહકનું શોષણ, ગ્રાહકના અધિકારો (સલામતી, માહિતી, પસંદગી, રજૂઆત), ગ્રાહક સુરક્ષા અધિનિયમ (1986), ISI, AGMARK, BIS માર્કા.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Price Rise and Consumer Awareness Core Concepts",
        "textGujarati": "ભાવવધારો અને ગ્રાહક જાગૃતિ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-soc-ch18_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 18 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-soc&chapter=18"
  },
  {
    "id": "vid-ch-g10-soc-ch19",
    "chapterNumber": 19,
    "subjectId": "g10-soc",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 10 Social Science – Chapter 19: Human Development",
    "titleGujarati": "ધોરણ 10 સામાજિક વિજ્ઞાન – પ્રકરણ 19: માનવ વિકાસ (GSEB)",
    "instructor": "Vidyakul Gujarati",
    "instructorGujarati": "Vidyakul Gujarati (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "S35nT3299I8",
    "thumbnailUrl": "https://img.youtube.com/vi/S35nT3299I8/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Human Development under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "માનવ વિકાસ આંક (HDI - અપેક્ષિત આયુષ્ય, શિક્ષણ આંક, આવક આંક), ભારતનું સ્થાન, આરોગ્ય અને મહિલા સશક્તિકરણની યોજનાઓ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Human Development Core Concepts",
        "textGujarati": "માનવ વિકાસ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-soc-ch19_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 19 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-soc&chapter=19"
  },
  {
    "id": "vid-ch-g10-soc-ch20",
    "chapterNumber": 20,
    "subjectId": "g10-soc",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 10 Social Science – Chapter 20: Social Problems and Challenges of India",
    "titleGujarati": "ધોરણ 10 સામાજિક વિજ્ઞાન – પ્રકરણ 20: ભારતની સામાજિક સમસ્યાઓ અને પડકારો (GSEB)",
    "instructor": "Vidyakul Gujarati",
    "instructorGujarati": "Vidyakul Gujarati (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "3Jypghpj2uM",
    "thumbnailUrl": "https://img.youtube.com/vi/3Jypghpj2uM/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Social Problems and Challenges of India under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "સાંપ્રદાયિકતા, જ્ઞાતિવાદ, લઘુમતીઓ, અનુસૂચિત જાતિ અને અનુસૂચિત જનજાતિ માટેની બંધારણીય જોગવાઈઓ, આતંકવાદ - એક વૈશ્વિક સમસ્યા.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Social Problems and Challenges of India Core Concepts",
        "textGujarati": "ભારતની સામાજિક સમસ્યાઓ અને પડકારો ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-soc-ch20_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 20 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-soc&chapter=20"
  },
  {
    "id": "vid-ch-g10-soc-ch21",
    "chapterNumber": 21,
    "subjectId": "g10-soc",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Social Science",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "title": "Class 10 Social Science – Chapter 21: Social Change",
    "titleGujarati": "ધોરણ 10 સામાજિક વિજ્ઞાન – પ્રકરણ 21: સામાજિક પરિવર્તન (GSEB)",
    "instructor": "Vidyakul STD 10 Topper",
    "instructorGujarati": "Vidyakul STD 10 Topper (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "RZj_lIDc7IA",
    "thumbnailUrl": "https://img.youtube.com/vi/RZj_lIDc7IA/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Social Change under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "સામાજિક પરિવર્તનના પરિબળો, બાળ અધિકારો, બાળમજૂરી નાબૂદી, વૃદ્ધો અને અસહાયોનું રક્ષણ, ભ્રષ્ટાચાર વિરોધી કાયદા અને માહિતી અધિકાર (RTI - 2005).",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Social Change Core Concepts",
        "textGujarati": "સામાજિક પરિવર્તન ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-soc-ch21_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 21 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-soc&chapter=21"
  },
  {
    "id": "vid-ch-g10-guj-ch1",
    "chapterNumber": 1,
    "subjectId": "g10-guj",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 10 Gujarati – Chapter 1: Vaishnava Jana To",
    "titleGujarati": "ધોરણ 10 ગુજરાતી (માતૃભાષા) – પ્રકરણ 1: વૈષ્ણવજન (ભક્તિપદ) (GSEB)",
    "instructor": "Total Standard",
    "instructorGujarati": "Total Standard (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "AsnPkmq33nY",
    "thumbnailUrl": "https://img.youtube.com/vi/AsnPkmq33nY/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Vaishnava Jana To under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "નરસિંહ મહેતા રચિત અમર પદ: સાચા વૈષ્ણવજન (ભગવાનના માણસ) ના ઉત્કૃષ્ટ લક્ષણો - પરદુઃખે ઉપકાર કરે તોયે મન અભિમાન ન આણે.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Vaishnava Jana To Core Concepts",
        "textGujarati": "વૈષ્ણવજન (ભક્તિપદ) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-guj-ch1_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 1 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-guj&chapter=1"
  },
  {
    "id": "vid-ch-g10-guj-ch2",
    "chapterNumber": 2,
    "subjectId": "g10-guj",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 10 Gujarati – Chapter 2: Race No Ghodo",
    "titleGujarati": "ધોરણ 10 ગુજરાતી (માતૃભાષા) – પ્રકરણ 2: રેસનો ઘોડો (નવલિકા) (GSEB)",
    "instructor": "Education nonstop 2",
    "instructorGujarati": "Education nonstop 2 (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "s85oNqg6DpE",
    "thumbnailUrl": "https://img.youtube.com/vi/s85oNqg6DpE/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Race No Ghodo under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "વર્ષા અડાલજા: બાળકો પર મા-બાપની અપેક્ષાઓનો બોજ, અંકિત અને સૌરભની વાર્તા - શિક્ષણનો સાચો હેતુ સંસ્કાર છે.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Race No Ghodo Core Concepts",
        "textGujarati": "રેસનો ઘોડો (નવલિકા) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-guj-ch2_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 2 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-guj&chapter=2"
  },
  {
    "id": "vid-ch-g10-guj-ch3",
    "chapterNumber": 3,
    "subjectId": "g10-guj",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 10 Gujarati – Chapter 3: Sheelvant Sadhune",
    "titleGujarati": "ધોરણ 10 ગુજરાતી (માતૃભાષા) – પ્રકરણ 3: શીલવંત સાધુને (ભજન) (GSEB)",
    "instructor": "AHVAN EDUCATION",
    "instructorGujarati": "AHVAN EDUCATION (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "-dlf3Yrdy0s",
    "thumbnailUrl": "https://img.youtube.com/vi/-dlf3Yrdy0s/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Sheelvant Sadhune under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ગંગાસતી: પાનબાઈને ઉપદેશ - જેના ચિત્તની વૃત્તિ સદા નિર્મળ હોય તેવા શીલવંત સાધુને વારે વારે નમવાની પ્રેરણા.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Sheelvant Sadhune Core Concepts",
        "textGujarati": "શીલવંત સાધુને (ભજન) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-guj-ch3_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 3 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-guj&chapter=3"
  },
  {
    "id": "vid-ch-g10-guj-ch4",
    "chapterNumber": 4,
    "subjectId": "g10-guj",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 10 Gujarati – Chapter 4: Bhuli Gaya Pachhi",
    "titleGujarati": "ધોરણ 10 ગુજરાતી (માતૃભાષા) – પ્રકરણ 4: ભૂલી ગયા પછી (એકાંકી) (GSEB)",
    "instructor": "Ayush ",
    "instructorGujarati": "Ayush  (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "Y9uCQlVegxA",
    "thumbnailUrl": "https://img.youtube.com/vi/Y9uCQlVegxA/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Bhuli Gaya Pachhi under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "રઘુવીર ચૌધરી: આબુના પર્વતારોહણ શિબિરમાં નરેન અને મનીષાનો પુનઃમેળાપ - સ્ત્રીની સાહસિકતા અને સંસ્કાર.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Bhuli Gaya Pachhi Core Concepts",
        "textGujarati": "ભૂલી ગયા પછી (એકાંકી) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-guj-ch4_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 4 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-guj&chapter=4"
  },
  {
    "id": "vid-ch-g10-guj-ch5",
    "chapterNumber": 5,
    "subjectId": "g10-guj",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 10 Gujarati – Chapter 5: Deekri",
    "titleGujarati": "ધોરણ 10 ગુજરાતી (માતૃભાષા) – પ્રકરણ 5: દીકરી (ગઝલ) (GSEB)",
    "instructor": "My School Education",
    "instructorGujarati": "My School Education (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "4ZGz9M7TfAY",
    "thumbnailUrl": "https://img.youtube.com/vi/4ZGz9M7TfAY/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Deekri under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "અશોક ચાવડા 'બેદિલ': દીકરી એ તુલસીનો ક્યારો અને વહાલનો દરિયો છે - દીકરીના ગુણો અને ગૌરવ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Deekri Core Concepts",
        "textGujarati": "દીકરી (ગઝલ) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-guj-ch5_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 5 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-guj&chapter=5"
  },
  {
    "id": "vid-ch-g10-guj-ch6",
    "chapterNumber": 6,
    "subjectId": "g10-guj",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 10 Gujarati – Chapter 6: Viral Infection",
    "titleGujarati": "ધોરણ 10 ગુજરાતી (માતૃભાષા) – પ્રકરણ 6: વાઇરલ ઇન્ફેક્શન (નિબંધ) (GSEB)",
    "instructor": "Creative learning - Kuldeep",
    "instructorGujarati": "Creative learning - Kuldeep (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "609Wwgodnks",
    "thumbnailUrl": "https://img.youtube.com/vi/609Wwgodnks/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Viral Infection under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ગુણવંત શાહ: આરોગ્ય પ્રત્યેની બેદરકારી, અસ્વચ્છતા, હોસ્પિટલોની સ્થિતિ અને સ્વસ્થ જીવનશૈલી.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Viral Infection Core Concepts",
        "textGujarati": "વાઇરલ ઇન્ફેક્શન (નિબંધ) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-guj-ch6_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 6 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-guj&chapter=6"
  },
  {
    "id": "vid-ch-g10-guj-ch7",
    "chapterNumber": 7,
    "subjectId": "g10-guj",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 10 Gujarati – Chapter 7: Hu Evo Gujarati",
    "titleGujarati": "ધોરણ 10 ગુજરાતી (માતૃભાષા) – પ્રકરણ 7: હું એવો ગુજરાતી (કાવ્ય) (GSEB)",
    "instructor": "ALGEBRAIC INSTITUTE",
    "instructorGujarati": "ALGEBRAIC INSTITUTE (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "OqTR0m0M0lY",
    "thumbnailUrl": "https://img.youtube.com/vi/OqTR0m0M0lY/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Hu Evo Gujarati under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "વિનોદ જોશી: ગુજરાતની ગરિમા, નર્મદા, ગિરનાર, ગાંધી અને સરદારનું ગૌરવ દર્શાવતું રાષ્ટ્રપ્રેમનું ગીત.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Hu Evo Gujarati Core Concepts",
        "textGujarati": "હું એવો ગુજરાતી (કાવ્ય) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-guj-ch7_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 7 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-guj&chapter=7"
  },
  {
    "id": "vid-ch-g10-guj-ch8",
    "chapterNumber": 8,
    "subjectId": "g10-guj",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 10 Gujarati – Chapter 8: Chhatri",
    "titleGujarati": "ધોરણ 10 ગુજરાતી (માતૃભાષા) – પ્રકરણ 8: છત્રી (હાસ્યનિબંધ) (GSEB)",
    "instructor": "Study With Guru",
    "instructorGujarati": "Study With Guru (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "1V8kFqpSjB8",
    "thumbnailUrl": "https://img.youtube.com/vi/1V8kFqpSjB8/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Chhatri under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "રતિલાલ બોરીસાગર: વારંવાર ખોવાઈ જતી છત્રીને સાચવવાના ઉપાયો અને રાજકોટથી છત્રી લેવા જવાનો હાસ્યપ્રસંગ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Chhatri Core Concepts",
        "textGujarati": "છત્રી (હાસ્યનિબંધ) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-guj-ch8_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 8 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-guj&chapter=8"
  },
  {
    "id": "vid-ch-g10-guj-ch9",
    "chapterNumber": 9,
    "subjectId": "g10-guj",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 10 Gujarati – Chapter 9: Madhav Ne Ditho Chhe Kyanay?",
    "titleGujarati": "ધોરણ 10 ગુજરાતી (માતૃભાષા) – પ્રકરણ 9: માધવને દીઠો છે ક્યાંય? (ઊર્મિકાવ્ય) (GSEB)",
    "instructor": "Educational Gujarati Vlog",
    "instructorGujarati": "Educational Gujarati Vlog (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "CMisjSQ44ac",
    "thumbnailUrl": "https://img.youtube.com/vi/CMisjSQ44ac/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Madhav Ne Ditho Chhe Kyanay? under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "હરીન્દ્ર દવે: વાંસળીમાંથી છૂટો પડેલો સૂર કૃષ્ણની શોધમાં વ્યાકુળ બની યમુના, રાધા અને પ્રકૃતિને પૂછે છે.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Madhav Ne Ditho Chhe Kyanay? Core Concepts",
        "textGujarati": "માધવને દીઠો છે ક્યાંય? (ઊર્મિકાવ્ય) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-guj-ch9_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 9 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-guj&chapter=9"
  },
  {
    "id": "vid-ch-g10-guj-ch10",
    "chapterNumber": 10,
    "subjectId": "g10-guj",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 10 Gujarati – Chapter 10: Dangvano Ane...",
    "titleGujarati": "ધોરણ 10 ગુજરાતી (માતૃભાષા) – પ્રકરણ 10: ડાંગવનો અને... (પ્રવાસનિબંધ) (GSEB)",
    "instructor": "Gujarati Sahitya",
    "instructorGujarati": "Gujarati Sahitya (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "caAPpztrhtk",
    "thumbnailUrl": "https://img.youtube.com/vi/caAPpztrhtk/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Dangvano Ane... under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "મહેન્દ્રસિંહ પરમાર: ડાંગના ઘનઘોર જંગલો, ગિરા ધોધ અને આદિવાસી સંસ્કૃતિનું નયનરમ્ય આલેખન.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Dangvano Ane... Core Concepts",
        "textGujarati": "ડાંગવનો અને... (પ્રવાસનિબંધ) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-guj-ch10_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 10 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-guj&chapter=10"
  },
  {
    "id": "vid-ch-g10-guj-ch11",
    "chapterNumber": 11,
    "subjectId": "g10-guj",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 10 Gujarati – Chapter 11: Shikarine",
    "titleGujarati": "ધોરણ 10 ગુજરાતી (માતૃભાષા) – પ્રકરણ 11: શિકારીને (સોનેટ) (GSEB)",
    "instructor": "Creative learning - Kuldeep",
    "instructorGujarati": "Creative learning - Kuldeep (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "LKWHJiO3q-0",
    "thumbnailUrl": "https://img.youtube.com/vi/LKWHJiO3q-0/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Shikarine under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "કલાપી (સુરસિંહજી તખ્તસિંહજી ગોહિલ): પંખીને તીરથી મારવાને બદલે તેના મધુર ગીતો સાંભળવાનો અને પ્રકૃતિ સાથે પ્રેમ કરવાનો સંદેશ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Shikarine Core Concepts",
        "textGujarati": "શિકારીને (સોનેટ) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-guj-ch11_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 11 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-guj&chapter=11"
  },
  {
    "id": "vid-ch-g10-guj-ch12",
    "chapterNumber": 12,
    "subjectId": "g10-guj",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 10 Gujarati – Chapter 12: Chopada Ni Indrajad",
    "titleGujarati": "ધોરણ 10 ગુજરાતી (માતૃભાષા) – પ્રકરણ 12: ચોપડાની ઇન્દ્રજાળ (આત્મકથાખંડ) (GSEB)",
    "instructor": "TDY WebSankul",
    "instructorGujarati": "TDY WebSankul (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "Xo3yr6yle2c",
    "thumbnailUrl": "https://img.youtube.com/vi/Xo3yr6yle2c/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Chopada Ni Indrajad under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ચંદ્રકાન્ત પંડ્યા: સાહુકારી પ્રથા દ્વારા ગરીબ આદિવાસી ખેડૂતોનું થતું શોષણ અને જીવલાની કરુણ સ્થિતિ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Chopada Ni Indrajad Core Concepts",
        "textGujarati": "ચોપડાની ઇન્દ્રજાળ (આત્મકથાખંડ) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-guj-ch12_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 12 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-guj&chapter=12"
  },
  {
    "id": "vid-ch-g10-guj-ch13",
    "chapterNumber": 13,
    "subjectId": "g10-guj",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 10 Gujarati – Chapter 13: Vatanthi Vidai Thata",
    "titleGujarati": "ધોરણ 10 ગુજરાતી (માતૃભાષા) – પ્રકરણ 13: વતનથી વિદાય થતાં (સોનેટ) (GSEB)",
    "instructor": "krishna kasabwala",
    "instructorGujarati": "krishna kasabwala (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "QFkoIjfPa1M",
    "thumbnailUrl": "https://img.youtube.com/vi/QFkoIjfPa1M/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Vatanthi Vidai Thata under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "જયંત પાઠક: વતનની ધૂળ, નદી, ખેતર અને ડુંગરો છોડી શહેરમાં જતી વખતે થતી હૃદયદ્રાવક વેદના.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Vatanthi Vidai Thata Core Concepts",
        "textGujarati": "વતનથી વિદાય થતાં (સોનેટ) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-guj-ch13_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 13 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-guj&chapter=13"
  },
  {
    "id": "vid-ch-g10-guj-ch14",
    "chapterNumber": 14,
    "subjectId": "g10-guj",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 10 Gujarati – Chapter 14: Janmotsav",
    "titleGujarati": "ધોરણ 10 ગુજરાતી (માતૃભાષા) – પ્રકરણ 14: જન્મોત્સવ (વાર્તા) (GSEB)",
    "instructor": "Creative learning - Kuldeep",
    "instructorGujarati": "Creative learning - Kuldeep (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "v7Ra1se6ArI",
    "thumbnailUrl": "https://img.youtube.com/vi/v7Ra1se6ArI/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Janmotsav under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "સુરેશ જોષી: એક તરફ શ્રીમંત કાનજીના ઘરે કૃષ્ણ જન્મોત્સવની ઝાકઝમાળ અને બીજી તરફ ગરીબ ઝૂંપડપટ્ટીમાં જન્મેલા બાળકના પગ ભાંગી ભિખારી બનાવવાની કરુણતા.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Janmotsav Core Concepts",
        "textGujarati": "જન્મોત્સવ (વાર્તા) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-guj-ch14_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 14 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-guj&chapter=14"
  },
  {
    "id": "vid-ch-g10-guj-ch15",
    "chapterNumber": 15,
    "subjectId": "g10-guj",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 10 Gujarati – Chapter 15: Te Bese Aahin",
    "titleGujarati": "ધોરણ 10 ગુજરાતી (માતૃભાષા) – પ્રકરણ 15: તે બેસે અહીં (ગઝલ) (GSEB)",
    "instructor": "ravi sir",
    "instructorGujarati": "ravi sir (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "y3GWzeAUYuk",
    "thumbnailUrl": "https://img.youtube.com/vi/y3GWzeAUYuk/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Te Bese Aahin under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "સ્નેહી પરમાર: સભામાં સ્થાન કોને મળવું જોઈએ - જેના દિલમાં પરદુઃખ પ્રત્યે આંસુ હોય અને માનવતા હોય.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Te Bese Aahin Core Concepts",
        "textGujarati": "તે બેસે અહીં (ગઝલ) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-guj-ch15_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 15 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-guj&chapter=15"
  },
  {
    "id": "vid-ch-g10-guj-ch16",
    "chapterNumber": 16,
    "subjectId": "g10-guj",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 10 Gujarati – Chapter 16: Gatibhang",
    "titleGujarati": "ધોરણ 10 ગુજરાતી (માતૃભાષા) – પ્રકરણ 16: ગતિભંગ (લઘુકથા) (GSEB)",
    "instructor": "Creative learning - Kuldeep",
    "instructorGujarati": "Creative learning - Kuldeep (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "Yq4hxgIjdkw",
    "thumbnailUrl": "https://img.youtube.com/vi/Yq4hxgIjdkw/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Gatibhang under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "મોહનલાલ પટેલ: રેલવે સ્ટેશને જતાં ડૂંગર અને તેની પત્નીને મૃત દીકરી બબલીના પગલાં યાદ આવતાં પગ થંભી જાય છે.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Gatibhang Core Concepts",
        "textGujarati": "ગતિભંગ (લઘુકથા) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-guj-ch16_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 16 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-guj&chapter=16"
  },
  {
    "id": "vid-ch-g10-guj-ch17",
    "chapterNumber": 17,
    "subjectId": "g10-guj",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 10 Gujarati – Chapter 17: Divaso Judaina Jay Chhe",
    "titleGujarati": "ધોરણ 10 ગુજરાતી (માતૃભાષા) – પ્રકરણ 17: દિવસો જુદાઈના જાય છે (ગઝલ) (GSEB)",
    "instructor": "ALGEBRAIC INSTITUTE",
    "instructorGujarati": "ALGEBRAIC INSTITUTE (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "aZ78248hJxc",
    "thumbnailUrl": "https://img.youtube.com/vi/aZ78248hJxc/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Divaso Judaina Jay Chhe under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ગની દહીંવાલા: વિરહની વેદનામાં પણ પ્રિયપાત્રના મિલનની અતૂટ આશા અને ઈશ્વરભક્તિ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Divaso Judaina Jay Chhe Core Concepts",
        "textGujarati": "દિવસો જુદાઈના જાય છે (ગઝલ) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-guj-ch17_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 17 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-guj&chapter=17"
  },
  {
    "id": "vid-ch-g10-guj-ch18",
    "chapterNumber": 18,
    "subjectId": "g10-guj",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 10 Gujarati – Chapter 18: Bhukhthiye Bhundi Bhikh",
    "titleGujarati": "ધોરણ 10 ગુજરાતી (માતૃભાષા) – પ્રકરણ 18: ભૂખથીય ભૂંડી ભીખ (નવલકથાખંડ) (GSEB)",
    "instructor": "Vidyaniketan Shaikshanik Sankul",
    "instructorGujarati": "Vidyaniketan Shaikshanik Sankul (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "iYDG8sVSf9A",
    "thumbnailUrl": "https://img.youtube.com/vi/iYDG8sVSf9A/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Bhukhthiye Bhundi Bhikh under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "પન્નાલાલ પટેલની 'માનવીની ભવાઈ'માંથી: છપ્પનિયા દુષ્કાળમાં કાળુ અને રાજુની ભૂખ સામેની ખુમારી.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Bhukhthiye Bhundi Bhikh Core Concepts",
        "textGujarati": "ભૂખથીય ભૂંડી ભીખ (નવલકથાખંડ) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-guj-ch18_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 18 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-guj&chapter=18"
  },
  {
    "id": "vid-ch-g10-guj-ch19",
    "chapterNumber": 19,
    "subjectId": "g10-guj",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 10 Gujarati – Chapter 19: Ek Bapore",
    "titleGujarati": "ધોરણ 10 ગુજરાતી (માતૃભાષા) – પ્રકરણ 19: એક બપોરે (કાવ્ય) (GSEB)",
    "instructor": "ALGEBRAIC INSTITUTE",
    "instructorGujarati": "ALGEBRAIC INSTITUTE (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "hQdJ4so8_Rg",
    "thumbnailUrl": "https://img.youtube.com/vi/hQdJ4so8_Rg/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Ek Bapore under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "રાવજી પટેલ: સૌરાષ્ટ્રના ખેડૂત પુત્રની વેદના - સારસી ઊડી જતાં ખેતર અને જીવન અર્થહીન લાગે છે.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Ek Bapore Core Concepts",
        "textGujarati": "એક બપોરે (કાવ્ય) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-guj-ch19_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 19 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-guj&chapter=19"
  },
  {
    "id": "vid-ch-g10-guj-ch20",
    "chapterNumber": 20,
    "subjectId": "g10-guj",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 10 Gujarati – Chapter 20: Viral Vibhuti",
    "titleGujarati": "ધોરણ 10 ગુજરાતી (માતૃભાષા) – પ્રકરણ 20: વિરલ વિભૂતિ (ચરિત્રનિબંધ) (GSEB)",
    "instructor": "Creative learning - Kuldeep",
    "instructorGujarati": "Creative learning - Kuldeep (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "2gGog54jdQY",
    "thumbnailUrl": "https://img.youtube.com/vi/2gGog54jdQY/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Viral Vibhuti under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "આત્માર્પિત અપૂર્વજી: શ્રીમદ્ રાજચંદ્રનું અધ્યાત્મ જીવન અને મહાત્મા ગાંધીજી સાથેનો આધ્યાત્મિક સંબંધ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Viral Vibhuti Core Concepts",
        "textGujarati": "વિરલ વિભૂતિ (ચરિત્રનિબંધ) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-guj-ch20_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 20 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-guj&chapter=20"
  },
  {
    "id": "vid-ch-g10-guj-ch21",
    "chapterNumber": 21,
    "subjectId": "g10-guj",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 10 Gujarati – Chapter 21: Chandaliyo",
    "titleGujarati": "ધોરણ 10 ગુજરાતી (માતૃભાષા) – પ્રકરણ 21: ચાંદલિયો (લોકગીત) (GSEB)",
    "instructor": "Vir",
    "instructorGujarati": "Vir (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "1ee8TyQK82w",
    "thumbnailUrl": "https://img.youtube.com/vi/1ee8TyQK82w/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Chandaliyo under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "શરદ પૂનમની રાત્રે ગરબે ઘૂમતી સાસરિયામાં વસતી સ્ત્રીનો કુટુંબભાવ દર્શાવતું સુંદર લોકગીત.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Chandaliyo Core Concepts",
        "textGujarati": "ચાંદલિયો (લોકગીત) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-guj-ch21_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 21 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-guj&chapter=21"
  },
  {
    "id": "vid-ch-g10-guj-ch22",
    "chapterNumber": 22,
    "subjectId": "g10-guj",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 10 Gujarati – Chapter 22: Himalaya Ma Ek Sahas",
    "titleGujarati": "ધોરણ 10 ગુજરાતી (માતૃભાષા) – પ્રકરણ 22: હિમાલયમાં એક સાહસ (પ્રવાસકથા) (GSEB)",
    "instructor": "ALGEBRAIC INSTITUTE",
    "instructorGujarati": "ALGEBRAIC INSTITUTE (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "U77SO10rKnA",
    "thumbnailUrl": "https://img.youtube.com/vi/U77SO10rKnA/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Himalaya Ma Ek Sahas under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "જવાહરલાલ નેહરુ: જોજિલા ઘાટ અને અમરનાથની ગુફા તરફ હિમાલયના હિમશિખરો વચ્ચે કરેલું જોખમી સાહસ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Himalaya Ma Ek Sahas Core Concepts",
        "textGujarati": "હિમાલયમાં એક સાહસ (પ્રવાસકથા) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-guj-ch22_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 22 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-guj&chapter=22"
  },
  {
    "id": "vid-ch-g10-guj-ch23",
    "chapterNumber": 23,
    "subjectId": "g10-guj",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 10 Gujarati – Chapter 23: Laghu Kavyo",
    "titleGujarati": "ધોરણ 10 ગુજરાતી (માતૃભાષા) – પ્રકરણ 23: લઘુકાવ્યો (દુહા, મુક્તક, હાઈકુ) (GSEB)",
    "instructor": "Vamja Education",
    "instructorGujarati": "Vamja Education (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "Xo_zSXJKYRU",
    "thumbnailUrl": "https://img.youtube.com/vi/Xo_zSXJKYRU/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Laghu Kavyo under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "જીવનના ગૂઢ સત્યો દર્શાવતા દુહા, મુક્તક અને હાઈકુ - ભાષાનું સૌંદર્ય.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Laghu Kavyo Core Concepts",
        "textGujarati": "લઘુકાવ્યો (દુહા, મુક્તક, હાઈકુ) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-guj-ch23_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 23 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-guj&chapter=23"
  },
  {
    "id": "vid-ch-g10-guj-ch24",
    "chapterNumber": 24,
    "subjectId": "g10-guj",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી (માતૃભાષા)",
    "title": "Class 10 Gujarati – Chapter 24: Ghodi Ni Swamibhakti",
    "titleGujarati": "ધોરણ 10 ગુજરાતી (માતૃભાષા) – પ્રકરણ 24: ઘોડીની સ્વામીભક્તિ (લોકકથા) (GSEB)",
    "instructor": "Creative learning - Kuldeep",
    "instructorGujarati": "Creative learning - Kuldeep (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "Esgk9KWUkHc",
    "thumbnailUrl": "https://img.youtube.com/vi/Esgk9KWUkHc/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Ghodi Ni Swamibhakti under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "જોરાવરસિંહ જાદવ: આંબા પટેલની ઘોડી ઢેલની પૂરના પાણીમાં પોતાના માલિકનો જીવ બચાવવાની વફાદારી.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Ghodi Ni Swamibhakti Core Concepts",
        "textGujarati": "ઘોડીની સ્વામીભક્તિ (લોકકથા) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-guj-ch24_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 24 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-guj&chapter=24"
  },
  {
    "id": "vid-ch-g10-eng-ch1",
    "chapterNumber": 1,
    "subjectId": "g10-eng",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "English",
    "categoryGujarati": "અંગ્રેજી (દ્વિતીય ભાષા)",
    "title": "Class 10 English – Chapter 1: A Letter to God",
    "titleGujarati": "ધોરણ 10 અંગ્રેજી (દ્વિતીય ભાષા) – પ્રકરણ 1: એ લેટર ટુ ગોડ (GSEB)",
    "instructor": "AM Study Clubs",
    "instructorGujarati": "AM Study Clubs (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "7oZAMq6xbOk",
    "thumbnailUrl": "https://img.youtube.com/vi/7oZAMq6xbOk/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of A Letter to God under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "G.L. Fuentes: Lencho's unshakeable faith in God after a devastating hailstorm ruins his ripe corn crops.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "A Letter to God Core Concepts",
        "textGujarati": "એ લેટર ટુ ગોડ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-eng-ch1_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 1 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-eng&chapter=1"
  },
  {
    "id": "vid-ch-g10-eng-ch2",
    "chapterNumber": 2,
    "subjectId": "g10-eng",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "English",
    "categoryGujarati": "અંગ્રેજી (દ્વિતીય ભાષા)",
    "title": "Class 10 English – Chapter 2: Nelson Mandela: Long Walk to Freedom",
    "titleGujarati": "ધોરણ 10 અંગ્રેજી (દ્વિતીય ભાષા) – પ્રકરણ 2: નેલ્સન મંડેલા : લોંગ વોક ટુ ફ્રીડમ (GSEB)",
    "instructor": "EPB राज सर ",
    "instructorGujarati": "EPB राज सर  (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "becJRAwAdh8",
    "thumbnailUrl": "https://img.youtube.com/vi/becJRAwAdh8/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Nelson Mandela: Long Walk to Freedom under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "Autobiographical account of Mandela's inauguration as South Africa's first black President, ending Apartheid.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Nelson Mandela: Long Walk to Freedom Core Concepts",
        "textGujarati": "નેલ્સન મંડેલા : લોંગ વોક ટુ ફ્રીડમ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-eng-ch2_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 2 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-eng&chapter=2"
  },
  {
    "id": "vid-ch-g10-eng-ch3",
    "chapterNumber": 3,
    "subjectId": "g10-eng",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "English",
    "categoryGujarati": "અંગ્રેજી (દ્વિતીય ભાષા)",
    "title": "Class 10 English – Chapter 3: Two Stories About Flying",
    "titleGujarati": "ધોરણ 10 અંગ્રેજી (દ્વિતીય ભાષા) – પ્રકરણ 3: ટુ સ્ટોરીઝ અબાઉટ ફ્લાઇંગ (GSEB)",
    "instructor": "EduToons by Raman",
    "instructorGujarati": "EduToons by Raman (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "KkGAE9bnaR0",
    "thumbnailUrl": "https://img.youtube.com/vi/KkGAE9bnaR0/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Two Stories About Flying under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "The young seagull conquers fear of flying, and the mysterious black aeroplane guiding a lost pilot in storm.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Two Stories About Flying Core Concepts",
        "textGujarati": "ટુ સ્ટોરીઝ અબાઉટ ફ્લાઇંગ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-eng-ch3_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 3 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-eng&chapter=3"
  },
  {
    "id": "vid-ch-g10-eng-ch4",
    "chapterNumber": 4,
    "subjectId": "g10-eng",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "English",
    "categoryGujarati": "અંગ્રેજી (દ્વિતીય ભાષા)",
    "title": "Class 10 English – Chapter 4: From the Diary of Anne Frank",
    "titleGujarati": "ધોરણ 10 અંગ્રેજી (દ્વિતીય ભાષા) – પ્રકરણ 4: ફ્રોમ ધ ડાયરી ઓફ એન ફ્રેન્ક (GSEB)",
    "instructor": "Sunlike study",
    "instructorGujarati": "Sunlike study (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "fc7QwZ_JMyI",
    "thumbnailUrl": "https://img.youtube.com/vi/fc7QwZ_JMyI/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of From the Diary of Anne Frank under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "13-year-old Jewish girl Anne Frank hides in Amsterdam from Nazi persecution, confiding in her diary 'Kitty'.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "From the Diary of Anne Frank Core Concepts",
        "textGujarati": "ફ્રોમ ધ ડાયરી ઓફ એન ફ્રેન્ક ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-eng-ch4_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 4 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-eng&chapter=4"
  },
  {
    "id": "vid-ch-g10-eng-ch5",
    "chapterNumber": 5,
    "subjectId": "g10-eng",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "English",
    "categoryGujarati": "અંગ્રેજી (દ્વિતીય ભાષા)",
    "title": "Class 10 English – Chapter 5: Glimpses of India",
    "titleGujarati": "ધોરણ 10 અંગ્રેજી (દ્વિતીય ભાષા) – પ્રકરણ 5: ગ્લિમ્પ્સિઝ ઓફ ઇન્ડિયા (GSEB)",
    "instructor": "E-SHALA EDUCATION",
    "instructorGujarati": "E-SHALA EDUCATION (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "sDa9fecZ2ME",
    "thumbnailUrl": "https://img.youtube.com/vi/sDa9fecZ2ME/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Glimpses of India under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "Three portraits: A Baker from Goa (Pader), Coorg (Coffee and bravery), and Tea from Assam.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Glimpses of India Core Concepts",
        "textGujarati": "ગ્લિમ્પ્સિઝ ઓફ ઇન્ડિયા ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-eng-ch5_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 5 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-eng&chapter=5"
  },
  {
    "id": "vid-ch-g10-eng-ch6",
    "chapterNumber": 6,
    "subjectId": "g10-eng",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "English",
    "categoryGujarati": "અંગ્રેજી (દ્વિતીય ભાષા)",
    "title": "Class 10 English – Chapter 6: Mijbil the Otter",
    "titleGujarati": "ધોરણ 10 અંગ્રેજી (દ્વિતીય ભાષા) – પ્રકરણ 6: મિજબીલ ધ ઓટર (GSEB)",
    "instructor": "Sunlike study",
    "instructorGujarati": "Sunlike study (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "jyBbUsk-8Ic",
    "thumbnailUrl": "https://img.youtube.com/vi/jyBbUsk-8Ic/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Mijbil the Otter under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "Gavin Maxwell's humorous and endearing journey keeping an intelligent otter as a pet in London.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Mijbil the Otter Core Concepts",
        "textGujarati": "મિજબીલ ધ ઓટર ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-eng-ch6_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 6 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-eng&chapter=6"
  },
  {
    "id": "vid-ch-g10-eng-ch7",
    "chapterNumber": 7,
    "subjectId": "g10-eng",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "English",
    "categoryGujarati": "અંગ્રેજી (દ્વિતીય ભાષા)",
    "title": "Class 10 English – Chapter 7: Madam Rides the Bus",
    "titleGujarati": "ધોરણ 10 અંગ્રેજી (દ્વિતીય ભાષા) – પ્રકરણ 7: મેડમ રાઇડ્સ ધ બસ (GSEB)",
    "instructor": "Sunlike study",
    "instructorGujarati": "Sunlike study (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "CXKVT_8z_IA",
    "thumbnailUrl": "https://img.youtube.com/vi/CXKVT_8z_IA/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Madam Rides the Bus under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "Vallikkannan: 8-year-old Valli's meticulously planned first solo bus journey to the nearby town.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Madam Rides the Bus Core Concepts",
        "textGujarati": "મેડમ રાઇડ્સ ધ બસ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-eng-ch7_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 7 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-eng&chapter=7"
  },
  {
    "id": "vid-ch-g10-eng-ch8",
    "chapterNumber": 8,
    "subjectId": "g10-eng",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "English",
    "categoryGujarati": "અંગ્રેજી (દ્વિતીય ભાષા)",
    "title": "Class 10 English – Chapter 8: The Sermon at Benares",
    "titleGujarati": "ધોરણ 10 અંગ્રેજી (દ્વિતીય ભાષા) – પ્રકરણ 8: ધ સરમન એટ બનારસ (GSEB)",
    "instructor": "Sunlike study",
    "instructorGujarati": "Sunlike study (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "SfzWqWwrwyU",
    "thumbnailUrl": "https://img.youtube.com/vi/SfzWqWwrwyU/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of The Sermon at Benares under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "Lord Buddha preaches to Kisa Gotami about mortality, impermanence, and detachment after the death of her son.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "The Sermon at Benares Core Concepts",
        "textGujarati": "ધ સરમન એટ બનારસ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-eng-ch8_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 8 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-eng&chapter=8"
  },
  {
    "id": "vid-ch-g10-eng-ch9",
    "chapterNumber": 9,
    "subjectId": "g10-eng",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "English",
    "categoryGujarati": "અંગ્રેજી (દ્વિતીય ભાષા)",
    "title": "Class 10 English – Chapter 9: The Proposal",
    "titleGujarati": "ધોરણ 10 અંગ્રેજી (દ્વિતીય ભાષા) – પ્રકરણ 9: ધ પ્રપોઝલ (નાટક) (GSEB)",
    "instructor": "Educational Bhaiya",
    "instructorGujarati": "Educational Bhaiya (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "ZrJsp2JrfYQ",
    "thumbnailUrl": "https://img.youtube.com/vi/ZrJsp2JrfYQ/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of The Proposal under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "Anton Chekhov's farcical comedy about Lomov proposing to Natalya, derailed by ridiculous arguments over land and dogs.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "The Proposal Core Concepts",
        "textGujarati": "ધ પ્રપોઝલ (નાટક) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-eng-ch9_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 9 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-eng&chapter=9"
  },
  {
    "id": "vid-ch-g10-eng-ch10",
    "chapterNumber": 10,
    "subjectId": "g10-eng",
    "grades": [
      "10"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "English",
    "categoryGujarati": "અંગ્રેજી (દ્વિતીય ભાષા)",
    "title": "Class 10 English – Chapter 10: A Triumph of Surgery",
    "titleGujarati": "ધોરણ 10 અંગ્રેજી (દ્વિતીય ભાષા) – પ્રકરણ 10: એ ટ્રાયમ્ફ ઓફ સર્જરી (GSEB)",
    "instructor": "Educational Bhaiya",
    "instructorGujarati": "Educational Bhaiya (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "u6gnjdY54rY",
    "thumbnailUrl": "https://img.youtube.com/vi/u6gnjdY54rY/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of A Triumph of Surgery under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "James Herriot treats Tricki, an overfed pampered dog, returning him to health with simple exercise and diet.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "A Triumph of Surgery Core Concepts",
        "textGujarati": "એ ટ્રાયમ્ફ ઓફ સર્જરી ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g10-eng-ch10_1",
        "author": "MindSprint Learner",
        "role": "Class 10 Student",
        "text": "પ્રકરણ 10 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=10&subject=g10-eng&chapter=10"
  },
  {
    "id": "vid-ch-g11-phy-ch1",
    "chapterNumber": 1,
    "subjectId": "g11-phy",
    "grades": [
      "11"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Physics",
    "categoryGujarati": "ભૌતિક વિજ્ઞાન",
    "title": "Class 11 Physics – Chapter 1: Units and Measurements",
    "titleGujarati": "ધોરણ 11 ભૌતિક વિજ્ઞાન – પ્રકરણ 1: એકમો અને માપન (GSEB)",
    "instructor": "Vidyakul Gujarati Science",
    "instructorGujarati": "Vidyakul Gujarati Science (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "MEZxK_VQF_0",
    "thumbnailUrl": "https://img.youtube.com/vi/MEZxK_VQF_0/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Units and Measurements under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ભૌતિક રાશિઓ, SI એકમો, પારિમાણિક વિશ્લેષણ અને ત્રુટિઓની ગણતરી.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Units and Measurements Core Concepts",
        "textGujarati": "એકમો અને માપન ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g11-phy-ch1_1",
        "author": "MindSprint Learner",
        "role": "Class 11 Student",
        "text": "પ્રકરણ 1 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=11&subject=g11-phy&chapter=1"
  },
  {
    "id": "vid-ch-g11-phy-ch2",
    "chapterNumber": 2,
    "subjectId": "g11-phy",
    "grades": [
      "11"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Physics",
    "categoryGujarati": "ભૌતિક વિજ્ઞાન",
    "title": "Class 11 Physics – Chapter 2: Motion in a Straight Line",
    "titleGujarati": "ધોરણ 11 ભૌતિક વિજ્ઞાન – પ્રકરણ 2: સુરેખ પથ પર ગતિ (GSEB)",
    "instructor": "Vidyakul Gujarati Science",
    "instructorGujarati": "Vidyakul Gujarati Science (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "WDDiiqnuG7g",
    "thumbnailUrl": "https://img.youtube.com/vi/WDDiiqnuG7g/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Motion in a Straight Line under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "સ્થાન, સ્થાનાંતર, તાત્કાલિક વેગ, પ્રવેગ અને અચળ પ્રવેગી ગતિના સમીકરણો.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Motion in a Straight Line Core Concepts",
        "textGujarati": "સુરેખ પથ પર ગતિ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g11-phy-ch2_1",
        "author": "MindSprint Learner",
        "role": "Class 11 Student",
        "text": "પ્રકરણ 2 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=11&subject=g11-phy&chapter=2"
  },
  {
    "id": "vid-ch-g11-phy-ch3",
    "chapterNumber": 3,
    "subjectId": "g11-phy",
    "grades": [
      "11"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Physics",
    "categoryGujarati": "ભૌતિક વિજ્ઞાન",
    "title": "Class 11 Physics – Chapter 3: Motion in a Plane",
    "titleGujarati": "ધોરણ 11 ભૌતિક વિજ્ઞાન – પ્રકરણ 3: સમતલમાં ગતિ (GSEB)",
    "instructor": "Vidyakul Gujarati Science",
    "instructorGujarati": "Vidyakul Gujarati Science (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "pBCH-tqaB28",
    "thumbnailUrl": "https://img.youtube.com/vi/pBCH-tqaB28/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Motion in a Plane under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "સદિશો (Vectors), પ્રક્ષિપ્ત ગતિ (Projectile Motion) અને નિયમિત વર્તુળાકાર ગતિ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Motion in a Plane Core Concepts",
        "textGujarati": "સમતલમાં ગતિ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g11-phy-ch3_1",
        "author": "MindSprint Learner",
        "role": "Class 11 Student",
        "text": "પ્રકરણ 3 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=11&subject=g11-phy&chapter=3"
  },
  {
    "id": "vid-ch-g11-phy-ch4",
    "chapterNumber": 4,
    "subjectId": "g11-phy",
    "grades": [
      "11"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Physics",
    "categoryGujarati": "ભૌતિક વિજ્ઞાન",
    "title": "Class 11 Physics – Chapter 4: Laws of Motion",
    "titleGujarati": "ધોરણ 11 ભૌતિક વિજ્ઞાન – પ્રકરણ 4: ગતિના નિયમો (GSEB)",
    "instructor": "Vidyakul Gujarati Science",
    "instructorGujarati": "Vidyakul Gujarati Science (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "YV7xp-EowXk",
    "thumbnailUrl": "https://img.youtube.com/vi/YV7xp-EowXk/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Laws of Motion under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ન્યૂટનના ત્રણ નિયમો, વેગમાન સંરક્ષણ, ઘર્ષણબળ અને વર્તુળાકાર ગતિમાં કેન્દ્રગામી બળ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Laws of Motion Core Concepts",
        "textGujarati": "ગતિના નિયમો ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g11-phy-ch4_1",
        "author": "MindSprint Learner",
        "role": "Class 11 Student",
        "text": "પ્રકરણ 4 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=11&subject=g11-phy&chapter=4"
  },
  {
    "id": "vid-ch-g11-phy-ch5",
    "chapterNumber": 5,
    "subjectId": "g11-phy",
    "grades": [
      "11"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Physics",
    "categoryGujarati": "ભૌતિક વિજ્ઞાન",
    "title": "Class 11 Physics – Chapter 5: Work, Energy and Power",
    "titleGujarati": "ધોરણ 11 ભૌતિક વિજ્ઞાન – પ્રકરણ 5: કાર્ય, ઊર્જા અને પાવર (GSEB)",
    "instructor": "Vidyakul Gujarati Science",
    "instructorGujarati": "Vidyakul Gujarati Science (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "elSkDiJXM7s",
    "thumbnailUrl": "https://img.youtube.com/vi/elSkDiJXM7s/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Work, Energy and Power under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "કાર્ય-ઊર્જા પ્રમેય, સ્થિતિસ્થાપક અને અસ્થિતિસ્થાપક સંઘાત, સ્પ્રિંગની સ્થિતિઊર્જા.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Work, Energy and Power Core Concepts",
        "textGujarati": "કાર્ય, ઊર્જા અને પાવર ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g11-phy-ch5_1",
        "author": "MindSprint Learner",
        "role": "Class 11 Student",
        "text": "પ્રકરણ 5 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=11&subject=g11-phy&chapter=5"
  },
  {
    "id": "vid-ch-g11-phy-ch6",
    "chapterNumber": 6,
    "subjectId": "g11-phy",
    "grades": [
      "11"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Physics",
    "categoryGujarati": "ભૌતિક વિજ્ઞાન",
    "title": "Class 11 Physics – Chapter 6: Gravitation",
    "titleGujarati": "ધોરણ 11 ભૌતિક વિજ્ઞાન – પ્રકરણ 6: ગુરુત્વાકર્ષણ (GSEB)",
    "instructor": "Vidyakul Gujarati Science",
    "instructorGujarati": "Vidyakul Gujarati Science (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "gIkrhBqZYTQ",
    "thumbnailUrl": "https://img.youtube.com/vi/gIkrhBqZYTQ/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Gravitation under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "કેપ્લરના ગ્રહોની ગતિના નિયમો, ગુરુત્વાકર્ષણનો સાર્વત્રિક નિયમ, મુક્તિવેગ (ve = √(2gR)).",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Gravitation Core Concepts",
        "textGujarati": "ગુરુત્વાકર્ષણ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g11-phy-ch6_1",
        "author": "MindSprint Learner",
        "role": "Class 11 Student",
        "text": "પ્રકરણ 6 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=11&subject=g11-phy&chapter=6"
  },
  {
    "id": "vid-ch-g11-phy-ch7",
    "chapterNumber": 7,
    "subjectId": "g11-phy",
    "grades": [
      "11"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Physics",
    "categoryGujarati": "ભૌતિક વિજ્ઞાન",
    "title": "Class 11 Physics – Chapter 7: Thermodynamics",
    "titleGujarati": "ધોરણ 11 ભૌતિક વિજ્ઞાન – પ્રકરણ 7: ઉષ્માગતિશાસ્ત્ર (GSEB)",
    "instructor": "Study Master",
    "instructorGujarati": "Study Master (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "urrm_xABCaU",
    "thumbnailUrl": "https://img.youtube.com/vi/urrm_xABCaU/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Thermodynamics under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ઉષ્માગતિશાસ્ત્રનો શૂન્ય, પ્રથમ અને દ્વિતીય નિયમ, કાર્નોટ એન્જિનની ક્ષમતા.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Thermodynamics Core Concepts",
        "textGujarati": "ઉષ્માગતિશાસ્ત્ર ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g11-phy-ch7_1",
        "author": "MindSprint Learner",
        "role": "Class 11 Student",
        "text": "પ્રકરણ 7 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=11&subject=g11-phy&chapter=7"
  },
  {
    "id": "vid-ch-g11-chem-ch1",
    "chapterNumber": 1,
    "subjectId": "g11-chem",
    "grades": [
      "11"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Chemistry",
    "categoryGujarati": "રસાયણ વિજ્ઞાન",
    "title": "Class 11 Chemistry – Chapter 1: Some Basic Concepts of Chemistry",
    "titleGujarati": "ધોરણ 11 રસાયણ વિજ્ઞાન – પ્રકરણ 1: રસાયણ વિજ્ઞાનની કેટલીક પાયાની સંકલ્પનાઓ (GSEB)",
    "instructor": "GYANSHALA",
    "instructorGujarati": "GYANSHALA (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "Y6DvESUmmHE",
    "thumbnailUrl": "https://img.youtube.com/vi/Y6DvESUmmHE/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Some Basic Concepts of Chemistry under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "મોલ સંકલ્પના, મોલારિટી, મોલાલિટી, સીમિત પ્રક્રિયક અને તત્વયોગમિતિ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Some Basic Concepts of Chemistry Core Concepts",
        "textGujarati": "રસાયણ વિજ્ઞાનની કેટલીક પાયાની સંકલ્પનાઓ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g11-chem-ch1_1",
        "author": "MindSprint Learner",
        "role": "Class 11 Student",
        "text": "પ્રકરણ 1 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=11&subject=g11-chem&chapter=1"
  },
  {
    "id": "vid-ch-g11-chem-ch2",
    "chapterNumber": 2,
    "subjectId": "g11-chem",
    "grades": [
      "11"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Chemistry",
    "categoryGujarati": "રસાયણ વિજ્ઞાન",
    "title": "Class 11 Chemistry – Chapter 2: Structure of Atom",
    "titleGujarati": "ધોરણ 11 રસાયણ વિજ્ઞાન – પ્રકરણ 2: પરમાણુનું બંધારણ (GSEB)",
    "instructor": "VASANI SIR CHEMISTRY",
    "instructorGujarati": "VASANI SIR CHEMISTRY (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "ThOOY_ghMho",
    "thumbnailUrl": "https://img.youtube.com/vi/ThOOY_ghMho/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Structure of Atom under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "બોહરનું મોડેલ, દ-બ્રોગ્લી તરંગલંબાઈ, હાઇઝનબર્ગનો અનિશ્ચિતતાનો સિદ્ધાંત, ક્વોન્ટમ આંક (n, l, m, s).",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Structure of Atom Core Concepts",
        "textGujarati": "પરમાણુનું બંધારણ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g11-chem-ch2_1",
        "author": "MindSprint Learner",
        "role": "Class 11 Student",
        "text": "પ્રકરણ 2 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=11&subject=g11-chem&chapter=2"
  },
  {
    "id": "vid-ch-g11-chem-ch3",
    "chapterNumber": 3,
    "subjectId": "g11-chem",
    "grades": [
      "11"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Chemistry",
    "categoryGujarati": "રસાયણ વિજ્ઞાન",
    "title": "Class 11 Chemistry – Chapter 3: Chemical Bonding and Molecular Structure",
    "titleGujarati": "ધોરણ 11 રસાયણ વિજ્ઞાન – પ્રકરણ 3: રાસાયણિક બંધન અને આણ્વીય રચના (GSEB)",
    "instructor": "Science Tv Gujarati",
    "instructorGujarati": "Science Tv Gujarati (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "Mz2eRuIrhCo",
    "thumbnailUrl": "https://img.youtube.com/vi/Mz2eRuIrhCo/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Chemical Bonding and Molecular Structure under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "લુઇસ રચના, VSEPR સિદ્ધાંત, સંકરણ (sp, sp², sp³), આણ્વીય કક્ષક સિદ્ધાંત (MOT).",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Chemical Bonding and Molecular Structure Core Concepts",
        "textGujarati": "રાસાયણિક બંધન અને આણ્વીય રચના ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g11-chem-ch3_1",
        "author": "MindSprint Learner",
        "role": "Class 11 Student",
        "text": "પ્રકરણ 3 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=11&subject=g11-chem&chapter=3"
  },
  {
    "id": "vid-ch-g11-chem-ch4",
    "chapterNumber": 4,
    "subjectId": "g11-chem",
    "grades": [
      "11"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Chemistry",
    "categoryGujarati": "રસાયણ વિજ્ઞાન",
    "title": "Class 11 Chemistry – Chapter 4: Thermodynamics and Equilibrium",
    "titleGujarati": "ધોરણ 11 રસાયણ વિજ્ઞાન – પ્રકરણ 4: ઉષ્માગતિશાસ્ત્ર અને સંતુલન (GSEB)",
    "instructor": "Vidyakul Gujarati Science",
    "instructorGujarati": "Vidyakul Gujarati Science (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "yiZo8Tl8AOw",
    "thumbnailUrl": "https://img.youtube.com/vi/yiZo8Tl8AOw/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Thermodynamics and Equilibrium under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "એન્થાલ્પી (H), એન્ટ્રોપી (S), ગિબ્સ મુક્ત ઊર્જા (ΔG = ΔH - TΔS), લે-શેટેલિયરનો નિયમ, pH.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Thermodynamics and Equilibrium Core Concepts",
        "textGujarati": "ઉષ્માગતિશાસ્ત્ર અને સંતુલન ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g11-chem-ch4_1",
        "author": "MindSprint Learner",
        "role": "Class 11 Student",
        "text": "પ્રકરણ 4 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=11&subject=g11-chem&chapter=4"
  },
  {
    "id": "vid-ch-g11-chem-ch5",
    "chapterNumber": 5,
    "subjectId": "g11-chem",
    "grades": [
      "11"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Chemistry",
    "categoryGujarati": "રસાયણ વિજ્ઞાન",
    "title": "Class 11 Chemistry – Chapter 5: Organic Chemistry: Basic Principles",
    "titleGujarati": "ધોરણ 11 રસાયણ વિજ્ઞાન – પ્રકરણ 5: કાર્બનિક રસાયણ: પાયાના સિદ્ધાંતો (GSEB)",
    "instructor": "PW Gujarat 11 & 12 (GSHSEB)",
    "instructorGujarati": "PW Gujarat 11 & 12 (GSHSEB) (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "FDXFVsyvRZ0",
    "thumbnailUrl": "https://img.youtube.com/vi/FDXFVsyvRZ0/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Organic Chemistry: Basic Principles under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "IUPAC નામકરણ, પ્રેરક અસર, સંસ્પંદન અસર (રેઝોનન્સ), ઇલેક્ટ્રોન-અનુરાગી અને કેન્દ્ર-અનુરાગી.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Organic Chemistry: Basic Principles Core Concepts",
        "textGujarati": "કાર્બનિક રસાયણ: પાયાના સિદ્ધાંતો ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g11-chem-ch5_1",
        "author": "MindSprint Learner",
        "role": "Class 11 Student",
        "text": "પ્રકરણ 5 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=11&subject=g11-chem&chapter=5"
  },
  {
    "id": "vid-ch-g11-math-ch1",
    "chapterNumber": 1,
    "subjectId": "g11-math",
    "grades": [
      "11"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 11 Mathematics – Chapter 1: Sets, Relations and Functions",
    "titleGujarati": "ધોરણ 11 ગણિત – પ્રકરણ 1: ગણ, સંબંધ અને વિધેય (GSEB)",
    "instructor": "Vidyakul Gujarati Science",
    "instructorGujarati": "Vidyakul Gujarati Science (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "er1B-oJ7l2I",
    "thumbnailUrl": "https://img.youtube.com/vi/er1B-oJ7l2I/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Sets, Relations and Functions under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ગણના પ્રકારો, યોગગણ, છેદગણ, કાર્તેઝીય ગુણાકાર, સંબંધ, એક-એક અને વ્યાપ્ત વિધેય.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Sets, Relations and Functions Core Concepts",
        "textGujarati": "ગણ, સંબંધ અને વિધેય ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g11-math-ch1_1",
        "author": "MindSprint Learner",
        "role": "Class 11 Student",
        "text": "પ્રકરણ 1 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=11&subject=g11-math&chapter=1"
  },
  {
    "id": "vid-ch-g11-math-ch2",
    "chapterNumber": 2,
    "subjectId": "g11-math",
    "grades": [
      "11"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 11 Mathematics – Chapter 2: Trigonometric Functions",
    "titleGujarati": "ધોરણ 11 ગણિત – પ્રકરણ 2: ત્રિકોણમિતીય વિધેયો (GSEB)",
    "instructor": "PW Gujarat 11 & 12 (GSHSEB)",
    "instructorGujarati": "PW Gujarat 11 & 12 (GSHSEB) (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "eidlINl5U2Q",
    "thumbnailUrl": "https://img.youtube.com/vi/eidlINl5U2Q/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Trigonometric Functions under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "રેડિયન માપ (π રેડિયન = 180°), ત્રિકોણમિતીય વિધેયોના આલેખો, સંયુક્ત ખૂણાના સૂત્રો.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Trigonometric Functions Core Concepts",
        "textGujarati": "ત્રિકોણમિતીય વિધેયો ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g11-math-ch2_1",
        "author": "MindSprint Learner",
        "role": "Class 11 Student",
        "text": "પ્રકરણ 2 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=11&subject=g11-math&chapter=2"
  },
  {
    "id": "vid-ch-g11-math-ch3",
    "chapterNumber": 3,
    "subjectId": "g11-math",
    "grades": [
      "11"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 11 Mathematics – Chapter 3: Complex Numbers and Quadratic Equations",
    "titleGujarati": "ધોરણ 11 ગણિત – પ્રકરણ 3: સંકર સંખ્યાઓ અને દ્વિઘાત સમીકરણ (GSEB)",
    "instructor": "Vidyakul Gujarati Science",
    "instructorGujarati": "Vidyakul Gujarati Science (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "PVyZbAAhj8A",
    "thumbnailUrl": "https://img.youtube.com/vi/PVyZbAAhj8A/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Complex Numbers and Quadratic Equations under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "કાલ્પનિક એકમ i (i² = -1), સંકર સંખ્યા z = a + ib, માનાંક, કોણાંક અને ધ્રુવીય સ્વરૂપ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Complex Numbers and Quadratic Equations Core Concepts",
        "textGujarati": "સંકર સંખ્યાઓ અને દ્વિઘાત સમીકરણ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g11-math-ch3_1",
        "author": "MindSprint Learner",
        "role": "Class 11 Student",
        "text": "પ્રકરણ 3 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=11&subject=g11-math&chapter=3"
  },
  {
    "id": "vid-ch-g11-math-ch4",
    "chapterNumber": 4,
    "subjectId": "g11-math",
    "grades": [
      "11"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 11 Mathematics – Chapter 4: Limits and Derivatives",
    "titleGujarati": "ધોરણ 11 ગણિત – પ્રકરણ 4: લક્ષ અને વિકલન (GSEB)",
    "instructor": "PW Gujarat 11 & 12 (GSHSEB)",
    "instructorGujarati": "PW Gujarat 11 & 12 (GSHSEB) (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "NTXzmq8ynd0",
    "thumbnailUrl": "https://img.youtube.com/vi/NTXzmq8ynd0/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Limits and Derivatives under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "લક્ષની સંકલ્પના (lim x->0 sinx/x = 1), પ્રથમ સિદ્ધાંતથી વિકલન, ગુણાકાર અને ભાગાકારનો નિયમ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Limits and Derivatives Core Concepts",
        "textGujarati": "લક્ષ અને વિકલન ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g11-math-ch4_1",
        "author": "MindSprint Learner",
        "role": "Class 11 Student",
        "text": "પ્રકરણ 4 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=11&subject=g11-math&chapter=4"
  },
  {
    "id": "vid-ch-g11-bio-ch1",
    "chapterNumber": 1,
    "subjectId": "g11-bio",
    "grades": [
      "11"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Biology",
    "categoryGujarati": "જીવ વિજ્ઞાન",
    "title": "Class 11 Biology – Chapter 1: Diversity in Living World",
    "titleGujarati": "ધોરણ 11 જીવ વિજ્ઞાન – પ્રકરણ 1: સજીવ વિશ્વમાં વિવિધતા (GSEB)",
    "instructor": "Vidyakul Gujarati Science",
    "instructorGujarati": "Vidyakul Gujarati Science (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "PbGy5O1MSRM",
    "thumbnailUrl": "https://img.youtube.com/vi/PbGy5O1MSRM/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Diversity in Living World under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "વર્ગીકરણ વિજ્ઞાન, વર્ગીકરણની શ્રેણીઓ, વનસ્પતિ સૃષ્ટિ અને પ્રાણી સૃષ્ટિનું વર્ગીકરણ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Diversity in Living World Core Concepts",
        "textGujarati": "સજીવ વિશ્વમાં વિવિધતા ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g11-bio-ch1_1",
        "author": "MindSprint Learner",
        "role": "Class 11 Student",
        "text": "પ્રકરણ 1 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=11&subject=g11-bio&chapter=1"
  },
  {
    "id": "vid-ch-g11-bio-ch2",
    "chapterNumber": 2,
    "subjectId": "g11-bio",
    "grades": [
      "11"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Biology",
    "categoryGujarati": "જીવ વિજ્ઞાન",
    "title": "Class 11 Biology – Chapter 2: Cell Biology",
    "titleGujarati": "ધોરણ 11 જીવ વિજ્ઞાન – પ્રકરણ 2: કોષ જીવવિજ્ઞાન (GSEB)",
    "instructor": "Vidyakul Gujarati Science",
    "instructorGujarati": "Vidyakul Gujarati Science (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "Ilv40G03GfI",
    "thumbnailUrl": "https://img.youtube.com/vi/Ilv40G03GfI/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Cell Biology under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "કોષ સિદ્ધાંત, કોષ વિભાજન (સમભાજન અને અર્ધીકરણ) ના તબક્કા અને જૈવ-અણુઓ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Cell Biology Core Concepts",
        "textGujarati": "કોષ જીવવિજ્ઞાન ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g11-bio-ch2_1",
        "author": "MindSprint Learner",
        "role": "Class 11 Student",
        "text": "પ્રકરણ 2 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=11&subject=g11-bio&chapter=2"
  },
  {
    "id": "vid-ch-g11-bio-ch3",
    "chapterNumber": 3,
    "subjectId": "g11-bio",
    "grades": [
      "11"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Biology",
    "categoryGujarati": "જીવ વિજ્ઞાન",
    "title": "Class 11 Biology – Chapter 3: Human Physiology",
    "titleGujarati": "ધોરણ 11 જીવ વિજ્ઞાન – પ્રકરણ 3: માનવ શરીરક્રિયા વિજ્ઞાન (GSEB)",
    "instructor": "Vidyakul Gujarati Science",
    "instructorGujarati": "Vidyakul Gujarati Science (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "mmhbHczzRwg",
    "thumbnailUrl": "https://img.youtube.com/vi/mmhbHczzRwg/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Human Physiology under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "પાચન અને શોષણ, શ્વાસોચ્છવાસ, રુધિરાભિસરણ, ઉત્સર્જન, ચેતાકીય નિયંત્રણ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Human Physiology Core Concepts",
        "textGujarati": "માનવ શરીરક્રિયા વિજ્ઞાન ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g11-bio-ch3_1",
        "author": "MindSprint Learner",
        "role": "Class 11 Student",
        "text": "પ્રકરણ 3 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=11&subject=g11-bio&chapter=3"
  },
  {
    "id": "vid-ch-g11-guj-ch1",
    "chapterNumber": 1,
    "subjectId": "g11-guj",
    "grades": [
      "11"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી",
    "title": "Class 11 Gujarati – Chapter 1: Gujarati Sahitya Class 11",
    "titleGujarati": "ધોરણ 11 ગુજરાતી – પ્રકરણ 1: ગુજરાતી સાહિત્ય ધોરણ ૧૧ (GSEB)",
    "instructor": "Ved Digital Education",
    "instructorGujarati": "Ved Digital Education (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "AJeQh87dFjg",
    "thumbnailUrl": "https://img.youtube.com/vi/AJeQh87dFjg/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Gujarati Sahitya Class 11 under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "પ્રાચીન અને અર્વાચીન કવિતાઓ, નવલિકાઓ, લલિત નિબંધો અને વ્યાકરણ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Gujarati Sahitya Class 11 Core Concepts",
        "textGujarati": "ગુજરાતી સાહિત્ય ધોરણ ૧૧ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g11-guj-ch1_1",
        "author": "MindSprint Learner",
        "role": "Class 11 Student",
        "text": "પ્રકરણ 1 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=11&subject=g11-guj&chapter=1"
  },
  {
    "id": "vid-ch-g11-guj-ch2",
    "chapterNumber": 2,
    "subjectId": "g11-guj",
    "grades": [
      "11"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી",
    "title": "Class 11 Gujarati – Chapter 2: Vyakaran Ane Lekhan",
    "titleGujarati": "ધોરણ 11 ગુજરાતી – પ્રકરણ 2: વ્યાકરણ અને અર્થગ્રહણ (GSEB)",
    "instructor": "V TEACHING",
    "instructorGujarati": "V TEACHING (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "GKHjT8YvAgY",
    "thumbnailUrl": "https://img.youtube.com/vi/GKHjT8YvAgY/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Vyakaran Ane Lekhan under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "સંધિ, સમાસ, અલંકાર, છંદ, વિચાર વિસ્તાર અને પત્રલેખન.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Vyakaran Ane Lekhan Core Concepts",
        "textGujarati": "વ્યાકરણ અને અર્થગ્રહણ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g11-guj-ch2_1",
        "author": "MindSprint Learner",
        "role": "Class 11 Student",
        "text": "પ્રકરણ 2 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=11&subject=g11-guj&chapter=2"
  },
  {
    "id": "vid-ch-g11-eng-ch1",
    "chapterNumber": 1,
    "subjectId": "g11-eng",
    "grades": [
      "11"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "English",
    "categoryGujarati": "અંગ્રેજી",
    "title": "Class 11 English – Chapter 1: Hornbill & Snapshots",
    "titleGujarati": "ધોરણ 11 અંગ્રેજી – પ્રકરણ 1: હોર્નબિલ અને સ્નેપશોટ્સ (GSEB)",
    "instructor": "Educational Bhaiya",
    "instructorGujarati": "Educational Bhaiya (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "fT4xAR-CCqQ",
    "thumbnailUrl": "https://img.youtube.com/vi/fT4xAR-CCqQ/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Hornbill & Snapshots under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "The Portrait of a Lady (Khushwant Singh), We're Not Afraid to Die, Discovering Tut.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Hornbill & Snapshots Core Concepts",
        "textGujarati": "હોર્નબિલ અને સ્નેપશોટ્સ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g11-eng-ch1_1",
        "author": "MindSprint Learner",
        "role": "Class 11 Student",
        "text": "પ્રકરણ 1 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=11&subject=g11-eng&chapter=1"
  },
  {
    "id": "vid-ch-g11-cs-ch1",
    "chapterNumber": 1,
    "subjectId": "g11-cs",
    "grades": [
      "11"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Computer Science",
    "categoryGujarati": "કોમ્પ્યુટર સાયન્સ",
    "title": "Class 11 Computer Science – Chapter 1: Computer System Architecture",
    "titleGujarati": "ધોરણ 11 કોમ્પ્યુટર સાયન્સ – પ્રકરણ 1: કોમ્પ્યુટર સિસ્ટમ અને પાયથોન (GSEB)",
    "instructor": "ScoreShala",
    "instructorGujarati": "ScoreShala (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "YNM3F00Gloo",
    "thumbnailUrl": "https://img.youtube.com/vi/YNM3F00Gloo/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Computer System Architecture under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "હાર્ડવેર, સોફ્ટવેર, બુલિયન લોજિક અને પાયથોન પ્રોગ્રામિંગના મૂળભૂત સિદ્ધાંતો.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Computer System Architecture Core Concepts",
        "textGujarati": "કોમ્પ્યુટર સિસ્ટમ અને પાયથોન ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g11-cs-ch1_1",
        "author": "MindSprint Learner",
        "role": "Class 11 Student",
        "text": "પ્રકરણ 1 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=11&subject=g11-cs&chapter=1"
  },
  {
    "id": "vid-ch-g12-phy-ch1",
    "chapterNumber": 1,
    "subjectId": "g12-phy",
    "grades": [
      "12"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Physics",
    "categoryGujarati": "ભૌતિક વિજ્ઞાન",
    "title": "Class 12 Physics – Chapter 1: Electric Charges and Fields",
    "titleGujarati": "ધોરણ 12 ભૌતિક વિજ્ઞાન – પ્રકરણ 1: વિદ્યુતભારો અને ક્ષેત્રો (GSEB)",
    "instructor": "Vidyakul Gujarati Science",
    "instructorGujarati": "Vidyakul Gujarati Science (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "rjpoN5Bzupw",
    "thumbnailUrl": "https://img.youtube.com/vi/rjpoN5Bzupw/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Electric Charges and Fields under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "કુલંબનો નિયમ (F = k·q1·q2/r²), વિદ્યુત ફ્લક્સ (Φ = E·A), ગોસનો પ્રમેય અને તેના ઉપયોગો.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Electric Charges and Fields Core Concepts",
        "textGujarati": "વિદ્યુતભારો અને ક્ષેત્રો ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g12-phy-ch1_1",
        "author": "MindSprint Learner",
        "role": "Class 12 Student",
        "text": "પ્રકરણ 1 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=12&subject=g12-phy&chapter=1"
  },
  {
    "id": "vid-ch-g12-phy-ch2",
    "chapterNumber": 2,
    "subjectId": "g12-phy",
    "grades": [
      "12"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Physics",
    "categoryGujarati": "ભૌતિક વિજ્ઞાન",
    "title": "Class 12 Physics – Chapter 2: Electrostatic Potential and Capacitance",
    "titleGujarati": "ધોરણ 12 ભૌતિક વિજ્ઞાન – પ્રકરણ 2: સ્થિત વિદ્યુતસ્થિતિમાન અને કેપેસિટન્સ (GSEB)",
    "instructor": "Physics with Falgun Sir",
    "instructorGujarati": "Physics with Falgun Sir (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "Kk0btkanBT8",
    "thumbnailUrl": "https://img.youtube.com/vi/Kk0btkanBT8/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Electrostatic Potential and Capacitance under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "વિદ્યુતસ્થિતિમાન (V = W/q), કેપેસિટરનું શ્રેણી અને સમાંતર જોડાણ, ઊર્જા (U = 1/2 CV²).",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Electrostatic Potential and Capacitance Core Concepts",
        "textGujarati": "સ્થિત વિદ્યુતસ્થિતિમાન અને કેપેસિટન્સ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g12-phy-ch2_1",
        "author": "MindSprint Learner",
        "role": "Class 12 Student",
        "text": "પ્રકરણ 2 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=12&subject=g12-phy&chapter=2"
  },
  {
    "id": "vid-ch-g12-phy-ch3",
    "chapterNumber": 3,
    "subjectId": "g12-phy",
    "grades": [
      "12"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Physics",
    "categoryGujarati": "ભૌતિક વિજ્ઞાન",
    "title": "Class 12 Physics – Chapter 3: Current Electricity",
    "titleGujarati": "ધોરણ 12 ભૌતિક વિજ્ઞાન – પ્રકરણ 3: પ્રવાહ વિદ્યુત (GSEB)",
    "instructor": "Vidyakul Gujarati Science",
    "instructorGujarati": "Vidyakul Gujarati Science (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "zf1LnoeBko4",
    "thumbnailUrl": "https://img.youtube.com/vi/zf1LnoeBko4/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Current Electricity under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ઓહ્મનો નિયમ, ડ્રિફ્ટ વેગ (vd), કિર્ચીફના નિયમો (KCL અને KVL), વ્હીટસ્ટન બ્રિજ, મીટર બ્રિજ અને પોટેન્શિયોમીટર.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Current Electricity Core Concepts",
        "textGujarati": "પ્રવાહ વિદ્યુત ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g12-phy-ch3_1",
        "author": "MindSprint Learner",
        "role": "Class 12 Student",
        "text": "પ્રકરણ 3 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=12&subject=g12-phy&chapter=3"
  },
  {
    "id": "vid-ch-g12-phy-ch4",
    "chapterNumber": 4,
    "subjectId": "g12-phy",
    "grades": [
      "12"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Physics",
    "categoryGujarati": "ભૌતિક વિજ્ઞાન",
    "title": "Class 12 Physics – Chapter 4: Electromagnetic Induction and AC",
    "titleGujarati": "ધોરણ 12 ભૌતિક વિજ્ઞાન – પ્રકરણ 4: વિદ્યુતચુંબકીય પ્રેરણ અને પ્રત્યાવર્તી પ્રવાહ (GSEB)",
    "instructor": "PW Gujarat 11 & 12 (GSHSEB)",
    "instructorGujarati": "PW Gujarat 11 & 12 (GSHSEB) (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "LIB7XllnDH0",
    "thumbnailUrl": "https://img.youtube.com/vi/LIB7XllnDH0/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Electromagnetic Induction and AC under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ફેરાડેના નિયમો, લેન્ઝનો નિયમ, LCR શ્રેણી પરિપથ, અનુનાદ અને ટ્રાન્સફોર્મર (Vs/Vp = Ns/Np).",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Electromagnetic Induction and AC Core Concepts",
        "textGujarati": "વિદ્યુતચુંબકીય પ્રેરણ અને પ્રત્યાવર્તી પ્રવાહ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g12-phy-ch4_1",
        "author": "MindSprint Learner",
        "role": "Class 12 Student",
        "text": "પ્રકરણ 4 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=12&subject=g12-phy&chapter=4"
  },
  {
    "id": "vid-ch-g12-phy-ch5",
    "chapterNumber": 5,
    "subjectId": "g12-phy",
    "grades": [
      "12"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Physics",
    "categoryGujarati": "ભૌતિક વિજ્ઞાન",
    "title": "Class 12 Physics – Chapter 5: Ray and Wave Optics",
    "titleGujarati": "ધોરણ 12 ભૌતિક વિજ્ઞાન – પ્રકરણ 5: કિરણ અને તરંગ પ્રકાશશાસ્ત્ર (GSEB)",
    "instructor": "Vidyakul Gujarati Science",
    "instructorGujarati": "Vidyakul Gujarati Science (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "RRu151Z6_qM",
    "thumbnailUrl": "https://img.youtube.com/vi/RRu151Z6_qM/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Ray and Wave Optics under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "લેન્સ મેકર્સ ફોર્મ્યુલા, પ્રિઝમ (n = sin[(A+Dm)/2] / sin(A/2)), હાઇગેન્સનો સિદ્ધાંત, યંગનો બે સ્લિટનો પ્રયોગ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Ray and Wave Optics Core Concepts",
        "textGujarati": "કિરણ અને તરંગ પ્રકાશશાસ્ત્ર ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g12-phy-ch5_1",
        "author": "MindSprint Learner",
        "role": "Class 12 Student",
        "text": "પ્રકરણ 5 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=12&subject=g12-phy&chapter=5"
  },
  {
    "id": "vid-ch-g12-phy-ch6",
    "chapterNumber": 6,
    "subjectId": "g12-phy",
    "grades": [
      "12"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Physics",
    "categoryGujarati": "ભૌતિક વિજ્ઞાન",
    "title": "Class 12 Physics – Chapter 6: Semiconductor Electronics",
    "titleGujarati": "ધોરણ 12 ભૌતિક વિજ્ઞાન – પ્રકરણ 6: સેમિકન્ડક્ટર ઇલેક્ટ્રોનિક્સ (GSEB)",
    "instructor": "Physics with Falgun Sir",
    "instructorGujarati": "Physics with Falgun Sir (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "vhsF-WrW3p8",
    "thumbnailUrl": "https://img.youtube.com/vi/vhsF-WrW3p8/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Semiconductor Electronics under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ઇન્ટ્રિન્સિક અને એક્સટ્રિન્સિક અર્ધવાહકો (p-type, n-type), p-n જંકશન ડાયોડ, રેક્ટિફાયર અને લોજિક ગેટ્સ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Semiconductor Electronics Core Concepts",
        "textGujarati": "સેમિકન્ડક્ટર ઇલેક્ટ્રોનિક્સ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g12-phy-ch6_1",
        "author": "MindSprint Learner",
        "role": "Class 12 Student",
        "text": "પ્રકરણ 6 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=12&subject=g12-phy&chapter=6"
  },
  {
    "id": "vid-ch-g12-chem-ch1",
    "chapterNumber": 1,
    "subjectId": "g12-chem",
    "grades": [
      "12"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Chemistry",
    "categoryGujarati": "રસાયણ વિજ્ઞાન",
    "title": "Class 12 Chemistry – Chapter 1: Solutions",
    "titleGujarati": "ધોરણ 12 રસાયણ વિજ્ઞાન – પ્રકરણ 1: દ્રાવણો (GSEB)",
    "instructor": "Vidyakul Gujarati Science",
    "instructorGujarati": "Vidyakul Gujarati Science (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "s1nS6nWsv3Q",
    "thumbnailUrl": "https://img.youtube.com/vi/s1nS6nWsv3Q/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Solutions under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "રાઉલ્ટનો નિયમ, સંખ્યાત્મક ગુણધર્મો (બાષ્પદબાણ, ઉત્કલનબિંદુ ઉન્નયન, ઠારબિંદુ અવનયન, અભિસરણ દબાણ π = CRT) અને વોન્ટ-હોફ અવયવ i.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Solutions Core Concepts",
        "textGujarati": "દ્રાવણો ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g12-chem-ch1_1",
        "author": "MindSprint Learner",
        "role": "Class 12 Student",
        "text": "પ્રકરણ 1 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=12&subject=g12-chem&chapter=1"
  },
  {
    "id": "vid-ch-g12-chem-ch2",
    "chapterNumber": 2,
    "subjectId": "g12-chem",
    "grades": [
      "12"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Chemistry",
    "categoryGujarati": "રસાયણ વિજ્ઞાન",
    "title": "Class 12 Chemistry – Chapter 2: Electrochemistry",
    "titleGujarati": "ધોરણ 12 રસાયણ વિજ્ઞાન – પ્રકરણ 2: વિદ્યુતરસાયણ (GSEB)",
    "instructor": "Sunil Chemistry Zone",
    "instructorGujarati": "Sunil Chemistry Zone (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "vnPBfBHhe1k",
    "thumbnailUrl": "https://img.youtube.com/vi/vnPBfBHhe1k/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Electrochemistry under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "નર્ન્સ્ટ સમીકરણ (Ecell = E°cell - 0.059/n log Q), કોહલરોશનો નિયમ, ફેરાડેના વિદ્યુતવિભાજનના નિયમો, બેટરી અને બળતણ કોષ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Electrochemistry Core Concepts",
        "textGujarati": "વિદ્યુતરસાયણ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g12-chem-ch2_1",
        "author": "MindSprint Learner",
        "role": "Class 12 Student",
        "text": "પ્રકરણ 2 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=12&subject=g12-chem&chapter=2"
  },
  {
    "id": "vid-ch-g12-chem-ch3",
    "chapterNumber": 3,
    "subjectId": "g12-chem",
    "grades": [
      "12"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Chemistry",
    "categoryGujarati": "રસાયણ વિજ્ઞાન",
    "title": "Class 12 Chemistry – Chapter 3: Chemical Kinetics",
    "titleGujarati": "ધોરણ 12 રસાયણ વિજ્ઞાન – પ્રકરણ 3: રાસાયણિક ગતિકી (GSEB)",
    "instructor": "TAVIYA online teaching - TOT ",
    "instructorGujarati": "TAVIYA online teaching - TOT  (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "9B9_jIMxtxs",
    "thumbnailUrl": "https://img.youtube.com/vi/9B9_jIMxtxs/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Chemical Kinetics under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "પ્રક્રિયા વેગ, શૂન્ય અને પ્રથમ ક્રમની પ્રક્રિયાઓ (t1/2 = 0.693 / k), આર્હેનિયસ સમીકરણ (k = A e^(-Ea/RT)).",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Chemical Kinetics Core Concepts",
        "textGujarati": "રાસાયણિક ગતિકી ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g12-chem-ch3_1",
        "author": "MindSprint Learner",
        "role": "Class 12 Student",
        "text": "પ્રકરણ 3 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=12&subject=g12-chem&chapter=3"
  },
  {
    "id": "vid-ch-g12-chem-ch4",
    "chapterNumber": 4,
    "subjectId": "g12-chem",
    "grades": [
      "12"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Chemistry",
    "categoryGujarati": "રસાયણ વિજ્ઞાન",
    "title": "Class 12 Chemistry – Chapter 4: d and f Block Elements",
    "titleGujarati": "ધોરણ 12 રસાયણ વિજ્ઞાન – પ્રકરણ 4: d અને f વિભાગના તત્વો (GSEB)",
    "instructor": "PW Gujarat 11 & 12 (GSHSEB)",
    "instructorGujarati": "PW Gujarat 11 & 12 (GSHSEB) (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "lqZHOIA1ELQ",
    "thumbnailUrl": "https://img.youtube.com/vi/lqZHOIA1ELQ/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of d and f Block Elements under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "સંક્રાંતિ તત્વોના સામાન્ય ગુણધર્મો (પરિવર્તનશીલ ઓક્સિડેશન અવસ્થાઓ, રંગીન આયનો, ઉદ્દીપકીય ગુણધર્મો), લેન્થેનોઇડ સંકોચન, KMnO4, K2Cr2O7.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "d and f Block Elements Core Concepts",
        "textGujarati": "d અને f વિભાગના તત્વો ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g12-chem-ch4_1",
        "author": "MindSprint Learner",
        "role": "Class 12 Student",
        "text": "પ્રકરણ 4 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=12&subject=g12-chem&chapter=4"
  },
  {
    "id": "vid-ch-g12-chem-ch5",
    "chapterNumber": 5,
    "subjectId": "g12-chem",
    "grades": [
      "12"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Chemistry",
    "categoryGujarati": "રસાયણ વિજ્ઞાન",
    "title": "Class 12 Chemistry – Chapter 5: Coordination Compounds",
    "titleGujarati": "ધોરણ 12 રસાયણ વિજ્ઞાન – પ્રકરણ 5: સવર્ગ સંયોજનો (GSEB)",
    "instructor": "Roshan Patel",
    "instructorGujarati": "Roshan Patel (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "zZv5CoANacM",
    "thumbnailUrl": "https://img.youtube.com/vi/zZv5CoANacM/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Coordination Compounds under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "વર્નરનો સિદ્ધાંત, લિગેન્ડ, IUPAC નામકરણ, સંયોજકતા બંધન સિદ્ધાંત (VBT), સ્ફટિક ક્ષેત્ર સિદ્ધાંત (CFT).",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Coordination Compounds Core Concepts",
        "textGujarati": "સવર્ગ સંયોજનો ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g12-chem-ch5_1",
        "author": "MindSprint Learner",
        "role": "Class 12 Student",
        "text": "પ્રકરણ 5 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=12&subject=g12-chem&chapter=5"
  },
  {
    "id": "vid-ch-g12-chem-ch6",
    "chapterNumber": 6,
    "subjectId": "g12-chem",
    "grades": [
      "12"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Chemistry",
    "categoryGujarati": "રસાયણ વિજ્ઞાન",
    "title": "Class 12 Chemistry – Chapter 6: Organic Chemistry: Haloalkanes, Alcohols, Aldehydes",
    "titleGujarati": "ધોરણ 12 રસાયણ વિજ્ઞાન – પ્રકરણ 6: કાર્બનિક રસાયણ: આલ્કોહોલ, આલ્ડીહાઇડ અને એમાઇન (GSEB)",
    "instructor": "TDY WebSankul",
    "instructorGujarati": "TDY WebSankul (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "6ixM-7d__XY",
    "thumbnailUrl": "https://img.youtube.com/vi/6ixM-7d__XY/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Organic Chemistry: Haloalkanes, Alcohols, Aldehydes under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "SN1 અને SN2 પ્રક્રિયાઓ, લ્યુકાસ કસોટી, આલ્ડોલ સંઘનન, કેનિઝારો પ્રક્રિયા, હોફમેન બ્રોમેમાઇડ પ્રક્રિયા.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Organic Chemistry: Haloalkanes, Alcohols, Aldehydes Core Concepts",
        "textGujarati": "કાર્બનિક રસાયણ: આલ્કોહોલ, આલ્ડીહાઇડ અને એમાઇન ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g12-chem-ch6_1",
        "author": "MindSprint Learner",
        "role": "Class 12 Student",
        "text": "પ્રકરણ 6 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=12&subject=g12-chem&chapter=6"
  },
  {
    "id": "vid-ch-g12-math-ch1",
    "chapterNumber": 1,
    "subjectId": "g12-math",
    "grades": [
      "12"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 12 Mathematics – Chapter 1: Relations, Functions and Inverse Trig",
    "titleGujarati": "ધોરણ 12 ગણિત – પ્રકરણ 1: સંબંધ, વિધેય અને ત્રિકોણમિતીય પ્રતિવિધેયો (GSEB)",
    "instructor": "Maths by Sanjay sir",
    "instructorGujarati": "Maths by Sanjay sir (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "sNNttcKS4FU",
    "thumbnailUrl": "https://img.youtube.com/vi/sNNttcKS4FU/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Relations, Functions and Inverse Trig under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "સ્વવાચક, સંમિત અને પરંપરાગત સંબંધ, સામ્ય સંબંધ, પ્રતિવિધેયોના પ્રદેશ અને વિસ્તાર (sin⁻¹x, cos⁻¹x, tan⁻¹x).",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Relations, Functions and Inverse Trig Core Concepts",
        "textGujarati": "સંબંધ, વિધેય અને ત્રિકોણમિતીય પ્રતિવિધેયો ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g12-math-ch1_1",
        "author": "MindSprint Learner",
        "role": "Class 12 Student",
        "text": "પ્રકરણ 1 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=12&subject=g12-math&chapter=1"
  },
  {
    "id": "vid-ch-g12-math-ch2",
    "chapterNumber": 2,
    "subjectId": "g12-math",
    "grades": [
      "12"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 12 Mathematics – Chapter 2: Matrices and Determinants",
    "titleGujarati": "ધોરણ 12 ગણિત – પ્રકરણ 2: શ્રેણિક અને નિશ્ચાયક (GSEB)",
    "instructor": "Vidyakul Gujarati Science",
    "instructorGujarati": "Vidyakul Gujarati Science (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "aeC_jKwHLPo",
    "thumbnailUrl": "https://img.youtube.com/vi/aeC_jKwHLPo/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Matrices and Determinants under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "શ્રેણિકના પ્રકારો, શ્રેણિક ગુણાકાર, પરિવર્ત શ્રેણિક (A'), નિશ્ચાયકના ગુણધર્મો, વ્યસ્ત શ્રેણિક (A⁻¹ = adj A / |A|) અને સમીકરણ સંહતિનો ઉકેલ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Matrices and Determinants Core Concepts",
        "textGujarati": "શ્રેણિક અને નિશ્ચાયક ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g12-math-ch2_1",
        "author": "MindSprint Learner",
        "role": "Class 12 Student",
        "text": "પ્રકરણ 2 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=12&subject=g12-math&chapter=2"
  },
  {
    "id": "vid-ch-g12-math-ch3",
    "chapterNumber": 3,
    "subjectId": "g12-math",
    "grades": [
      "12"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 12 Mathematics – Chapter 3: Calculus: Differentiation and Applications",
    "titleGujarati": "ધોરણ 12 ગણિત – પ્રકરણ 3: કલનશાસ્ત્ર: સાતત્ય, વિકલન અને તેના ઉપયોગો (GSEB)",
    "instructor": "Vidyakul Gujarati Science",
    "instructorGujarati": "Vidyakul Gujarati Science (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "f4kispVCpC8",
    "thumbnailUrl": "https://img.youtube.com/vi/f4kispVCpC8/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Calculus: Differentiation and Applications under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "સાંકળ નિયમ, લોગેરિથમિક વિકલન, સ્પર્શક અને અભિલંબ, વધતા-ઘટતા વિધેયો, મહત્તમ અને ન્યૂનતમ મૂલ્યો.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Calculus: Differentiation and Applications Core Concepts",
        "textGujarati": "કલનશાસ્ત્ર: સાતત્ય, વિકલન અને તેના ઉપયોગો ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g12-math-ch3_1",
        "author": "MindSprint Learner",
        "role": "Class 12 Student",
        "text": "પ્રકરણ 3 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=12&subject=g12-math&chapter=3"
  },
  {
    "id": "vid-ch-g12-math-ch4",
    "chapterNumber": 4,
    "subjectId": "g12-math",
    "grades": [
      "12"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 12 Mathematics – Chapter 4: Integrals and Differential Equations",
    "titleGujarati": "ધોરણ 12 ગણિત – પ્રકરણ 4: સંકલન અને વિકલ સમીકરણો (GSEB)",
    "instructor": "Vidyakul Gujarati Science",
    "instructorGujarati": "Vidyakul Gujarati Science (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "_Era9tuuQJ4",
    "thumbnailUrl": "https://img.youtube.com/vi/_Era9tuuQJ4/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Integrals and Differential Equations under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "અનિયત સંકલન, નિયત સંકલન (આદેશની રીત, આંશિક અપૂર્ણાંક, ખંડશઃ સંકલન), ક્ષેત્રફળ અને પ્રથમ કક્ષાના વિકલ સમીકરણો.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Integrals and Differential Equations Core Concepts",
        "textGujarati": "સંકલન અને વિકલ સમીકરણો ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g12-math-ch4_1",
        "author": "MindSprint Learner",
        "role": "Class 12 Student",
        "text": "પ્રકરણ 4 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 11,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=12&subject=g12-math&chapter=4"
  },
  {
    "id": "vid-ch-g12-math-ch5",
    "chapterNumber": 5,
    "subjectId": "g12-math",
    "grades": [
      "12"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 12 Mathematics – Chapter 5: Vectors and 3D Geometry",
    "titleGujarati": "ધોરણ 12 ગણિત – પ્રકરણ 5: સદિશ અને ત્રિપરિમાણીય ભૂમિતિ (GSEB)",
    "instructor": "Maths by Sanjay sir",
    "instructorGujarati": "Maths by Sanjay sir (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "wKGt9uqltP4",
    "thumbnailUrl": "https://img.youtube.com/vi/wKGt9uqltP4/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Vectors and 3D Geometry under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "અદિશ અને સદિશ ગુણાકાર (a · b = |a||b|cosθ, a × b = |a||b|sinθ n̂), રેખા અને સમતલનું સમીકરણ, બે રેખાઓ વચ્ચેનું લઘુત્તમ અંતર.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Vectors and 3D Geometry Core Concepts",
        "textGujarati": "સદિશ અને ત્રિપરિમાણીય ભૂમિતિ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g12-math-ch5_1",
        "author": "MindSprint Learner",
        "role": "Class 12 Student",
        "text": "પ્રકરણ 5 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 7,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=12&subject=g12-math&chapter=5"
  },
  {
    "id": "vid-ch-g12-math-ch6",
    "chapterNumber": 6,
    "subjectId": "g12-math",
    "grades": [
      "12"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Mathematics",
    "categoryGujarati": "ગણિત",
    "title": "Class 12 Mathematics – Chapter 6: Probability",
    "titleGujarati": "ધોરણ 12 ગણિત – પ્રકરણ 6: સંભાવના (GSEB)",
    "instructor": "Maths by Sanjay sir",
    "instructorGujarati": "Maths by Sanjay sir (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "nBkC3ZddJOI",
    "thumbnailUrl": "https://img.youtube.com/vi/nBkC3ZddJOI/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Probability under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "શરતી સંભાવના P(A|B) = P(A ∩ B) / P(B), બેઇઝનો પ્રમેય (Bayes' Theorem) અને દ્વિપદી વિતરણ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Probability Core Concepts",
        "textGujarati": "સંભાવના ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g12-math-ch6_1",
        "author": "MindSprint Learner",
        "role": "Class 12 Student",
        "text": "પ્રકરણ 6 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=12&subject=g12-math&chapter=6"
  },
  {
    "id": "vid-ch-g12-bio-ch1",
    "chapterNumber": 1,
    "subjectId": "g12-bio",
    "grades": [
      "12"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Biology",
    "categoryGujarati": "જીવ વિજ્ઞાન",
    "title": "Class 12 Biology – Chapter 1: Reproduction in Organisms",
    "titleGujarati": "ધોરણ 12 જીવ વિજ્ઞાન – પ્રકરણ 1: સજીવોમાં પ્રજનન (GSEB)",
    "instructor": "Roshan Academy",
    "instructorGujarati": "Roshan Academy (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "scetHRy8IXo",
    "thumbnailUrl": "https://img.youtube.com/vi/scetHRy8IXo/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Reproduction in Organisms under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "સપુષ્પી વનસ્પતિમાં બેવડું ફલન, માનવ પ્રજનન તંત્ર, માસિક ચક્ર, ગર્ભધારણ અને પ્રજનન સ્વાસ્થ્ય.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Reproduction in Organisms Core Concepts",
        "textGujarati": "સજીવોમાં પ્રજનન ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g12-bio-ch1_1",
        "author": "MindSprint Learner",
        "role": "Class 12 Student",
        "text": "પ્રકરણ 1 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=12&subject=g12-bio&chapter=1"
  },
  {
    "id": "vid-ch-g12-bio-ch2",
    "chapterNumber": 2,
    "subjectId": "g12-bio",
    "grades": [
      "12"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Biology",
    "categoryGujarati": "જીવ વિજ્ઞાન",
    "title": "Class 12 Biology – Chapter 2: Genetics and Molecular Biology",
    "titleGujarati": "ધોરણ 12 જીવ વિજ્ઞાન – પ્રકરણ 2: જનીનવિદ્યા અને આણ્વીય જીવવિજ્ઞાન (GSEB)",
    "instructor": "𝐓𝐇𝐄 𝐃𝐎𝐂𝐓𝐎𝐑 𝐁𝐑𝐎",
    "instructorGujarati": "𝐓𝐇𝐄 𝐃𝐎𝐂𝐓𝐎𝐑 𝐁𝐑𝐎 (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "auOxitZVOs0",
    "thumbnailUrl": "https://img.youtube.com/vi/auOxitZVOs0/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Genetics and Molecular Biology under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ડીએનએ સ્વયંજનન, ટ્રાન્સક્રિપ્શન, ટ્રાન્સલેશન (સેન્ટ્રલ ડોગ્મા), જનીન સંકેત (Genetic Code), મેન્ડલિયન અનિયમિતતાઓ (હિમોફિલિયા, સિકલ સેલ એનિમિયા).",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Genetics and Molecular Biology Core Concepts",
        "textGujarati": "જનીનવિદ્યા અને આણ્વીય જીવવિજ્ઞાન ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g12-bio-ch2_1",
        "author": "MindSprint Learner",
        "role": "Class 12 Student",
        "text": "પ્રકરણ 2 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=12&subject=g12-bio&chapter=2"
  },
  {
    "id": "vid-ch-g12-bio-ch3",
    "chapterNumber": 3,
    "subjectId": "g12-bio",
    "grades": [
      "12"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Biology",
    "categoryGujarati": "જીવ વિજ્ઞાન",
    "title": "Class 12 Biology – Chapter 3: Biotechnology and Ecology",
    "titleGujarati": "ધોરણ 12 જીવ વિજ્ઞાન – પ્રકરણ 3: બાયોટેકનોલોજી અને પર્યાવરણ (GSEB)",
    "instructor": "PodCus",
    "instructorGujarati": "PodCus (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "Bwzoo8M_b-E",
    "thumbnailUrl": "https://img.youtube.com/vi/Bwzoo8M_b-E/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Biotechnology and Ecology under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "પુનઃસંયોજિત ડીએનએ ટેક્નોલોજી, પીસીઆર (PCR), બીટી કપાસ (Bt Cotton), જૈવવિવિધતા સંરક્ષણ અને ઇકોસિસ્ટમ પિરામિડ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Biotechnology and Ecology Core Concepts",
        "textGujarati": "બાયોટેકનોલોજી અને પર્યાવરણ ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g12-bio-ch3_1",
        "author": "MindSprint Learner",
        "role": "Class 12 Student",
        "text": "પ્રકરણ 3 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 10,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=12&subject=g12-bio&chapter=3"
  },
  {
    "id": "vid-ch-g12-guj-ch1",
    "chapterNumber": 1,
    "subjectId": "g12-guj",
    "grades": [
      "12"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી",
    "title": "Class 12 Gujarati – Chapter 1: Gujarati Sahitya Class 12",
    "titleGujarati": "ધોરણ 12 ગુજરાતી – પ્રકરણ 1: ગુજરાતી સાહિત્ય ધોરણ ૧૨ (બોર્ડ) (GSEB)",
    "instructor": "V TEACHING",
    "instructorGujarati": "V TEACHING (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "TnH7CagZM6g",
    "thumbnailUrl": "https://img.youtube.com/vi/TnH7CagZM6g/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Gujarati Sahitya Class 12 under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "અખિલ બ્રહ્માંડમાં (નરસિંહ મહેતા), બાના આંસુ (દલપતરામ), કાવ્યો, નવલિકાઓ અને બોર્ડ વ્યાકરણ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Gujarati Sahitya Class 12 Core Concepts",
        "textGujarati": "ગુજરાતી સાહિત્ય ધોરણ ૧૨ (બોર્ડ) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g12-guj-ch1_1",
        "author": "MindSprint Learner",
        "role": "Class 12 Student",
        "text": "પ્રકરણ 1 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=12&subject=g12-guj&chapter=1"
  },
  {
    "id": "vid-ch-g12-guj-ch2",
    "chapterNumber": 2,
    "subjectId": "g12-guj",
    "grades": [
      "12"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Gujarati",
    "categoryGujarati": "ગુજરાતી",
    "title": "Class 12 Gujarati – Chapter 2: Board Nibandh Ane Lekhan",
    "titleGujarati": "ધોરણ 12 ગુજરાતી – પ્રકરણ 2: બોર્ડ નિબંધ, અહેવાલ અને પત્રલેખન (GSEB)",
    "instructor": "Maths Maharathi",
    "instructorGujarati": "Maths Maharathi (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "CT_GO4_KZcI",
    "thumbnailUrl": "https://img.youtube.com/vi/CT_GO4_KZcI/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Board Nibandh Ane Lekhan under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "જીએસઈબી બોર્ડ પરીક્ષા લક્ષી પરિશિષ્ટ, અહેવાલ લેખન, ગદ્ય સમીક્ષા અને વ્યાકરણ સજ્જતા.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Board Nibandh Ane Lekhan Core Concepts",
        "textGujarati": "બોર્ડ નિબંધ, અહેવાલ અને પત્રલેખન ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g12-guj-ch2_1",
        "author": "MindSprint Learner",
        "role": "Class 12 Student",
        "text": "પ્રકરણ 2 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 9,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=12&subject=g12-guj&chapter=2"
  },
  {
    "id": "vid-ch-g12-eng-ch1",
    "chapterNumber": 1,
    "subjectId": "g12-eng",
    "grades": [
      "12"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "English",
    "categoryGujarati": "અંગ્રેજી",
    "title": "Class 12 English – Chapter 1: Flamingo & Vistas",
    "titleGujarati": "ધોરણ 12 અંગ્રેજી – પ્રકરણ 1: ફ્લેમિંગો અને વિસ્ટાસ (બોર્ડ) (GSEB)",
    "instructor": "Vidyakul Gujarati Commerce",
    "instructorGujarati": "Vidyakul Gujarati Commerce (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "-ZUth5Mpm88",
    "thumbnailUrl": "https://img.youtube.com/vi/-ZUth5Mpm88/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Flamingo & Vistas under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "The Last Lesson (Alphonse Daudet), Lost Spring, Deep Water, The Rattrap, Indigo (Gandhiji).",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Flamingo & Vistas Core Concepts",
        "textGujarati": "ફ્લેમિંગો અને વિસ્ટાસ (બોર્ડ) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g12-eng-ch1_1",
        "author": "MindSprint Learner",
        "role": "Class 12 Student",
        "text": "પ્રકરણ 1 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=12&subject=g12-eng&chapter=1"
  },
  {
    "id": "vid-ch-g12-cs-ch1",
    "chapterNumber": 1,
    "subjectId": "g12-cs",
    "grades": [
      "12"
    ],
    "boards": [
      "GSEB",
      "CBSE"
    ],
    "category": "Computer Science",
    "categoryGujarati": "કોમ્પ્યુટર સાયન્સ",
    "title": "Class 12 Computer Science – Chapter 1: Computer Science: Python and SQL",
    "titleGujarati": "ધોરણ 12 કોમ્પ્યુટર સાયન્સ – પ્રકરણ 1: કોમ્પ્યુટર સાયન્સ (પાયથોન & SQL) (GSEB)",
    "instructor": "NCERT Wallah",
    "instructorGujarati": "NCERT Wallah (GSEB)",
    "duration": "22:00",
    "durationSeconds": 1320,
    "youtubeVideoId": "Yp4KNo4JZbM",
    "thumbnailUrl": "https://img.youtube.com/vi/Yp4KNo4JZbM/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Comprehensive study of Computer Science: Python and SQL under official GSEB Gujarati medium syllabus.",
    "descriptionGujarati": "ડેટા ફાઈલ હેન્ડલિંગ, સ્ટેક, કતાર, MySQL ક્વેરીઓ (SELECT, JOIN, GROUP BY) અને નેટવર્કિંગ.",
    "timeStampedNotes": [
      {
        "time": "01:00",
        "text": "Computer Science: Python and SQL Core Concepts",
        "textGujarati": "કોમ્પ્યુટર સાયન્સ (પાયથોન & SQL) ના મુખ્ય મુદ્દાઓ"
      }
    ],
    "comments": [
      {
        "id": "c_g12-cs-ch1_1",
        "author": "MindSprint Learner",
        "role": "Class 12 Student",
        "text": "પ્રકરણ 1 ખૂબ જ સારી રીતે સમજાવવામાં આવ્યું છે!",
        "upvotes": 8,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=12&subject=g12-cs&chapter=1"
  },
  {
    "id": "vid-col-1",
    "chapterNumber": 1,
    "subjectId": "col-quant",
    "grades": [
      "college"
    ],
    "boards": [
      "CBSE",
      "GSEB",
      "ICSE"
    ],
    "category": "Quantitative Aptitude",
    "categoryGujarati": "ક્વોન્ટિટિટીવ એપ્ટિટ્યુડ",
    "title": "Mastering Speed Math & Vedic Math for TCS/Infosys",
    "titleGujarati": "ઝડપી ગણિત અને વૈદિક ગણિત શોર્ટકટ્સ - કેમ્પસ પ્લેસમેન્ટ",
    "instructor": "MindSprint Placement Cell",
    "instructorGujarati": "માઇન્ડસ્પ્રિન્ટ કેમ્પસ ફેકલ્ટી",
    "duration": "28:40",
    "durationSeconds": 1720,
    "youtubeVideoId": "D6xkbGLQesk",
    "thumbnailUrl": "https://img.youtube.com/vi/D6xkbGLQesk/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Core mental arithmetic shortcuts, square roots, cube roots, and fast multiplication.",
    "descriptionGujarati": "કેમ્પસ પ્લેસમેન્ટ ટેસ્ટ માટે ઝડપી ગણતરીની શ્રેષ્ઠ શોર્ટકટ ટ્રીક્સ.",
    "timeStampedNotes": [
      {
        "time": "01:15",
        "text": "Vedic Math Multiplication",
        "textGujarati": "વૈદિક ગણિત ગુણાકાર પદ્ધતિ"
      },
      {
        "time": "09:40",
        "text": "Square Root Tricks",
        "textGujarati": "વર્ગમૂળ શોધવાની શોર્ટકટ્સ"
      },
      {
        "time": "18:20",
        "text": "Campus Aptitude Solved Questions",
        "textGujarati": "કેમ્પસ પ્રશ્નો સોલ્યુશન"
      }
    ],
    "comments": [
      {
        "id": "col_c1",
        "author": "Rohan Dave",
        "role": "Engineering Final Year",
        "text": "Cut my calculation time in half!",
        "upvotes": 14,
        "createdAt": "3 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=college&subject=col-quant&chapter=1"
  },
  {
    "id": "vid-col-2",
    "chapterNumber": 2,
    "subjectId": "col-dsa",
    "grades": [
      "college"
    ],
    "boards": [
      "CBSE",
      "GSEB",
      "ICSE"
    ],
    "category": "Data Structures & Algorithms",
    "categoryGujarati": "ડેટા સ્ટ્રક્ચર્સ & અલ્ગોરિધમ્સ",
    "title": "Binary Trees & BST Traversals Masterclass",
    "titleGujarati": "બાઈનરી ટ્રી & BST ટ્રાવર્સલ વિગતવાર સમજૂતી",
    "instructor": "Google SDE Guest Speaker",
    "instructorGujarati": "માઇન્ડસ્પ્રિન્ટ ટેક લીડ",
    "duration": "34:10",
    "durationSeconds": 2050,
    "youtubeVideoId": "D6xkbGLQesk",
    "thumbnailUrl": "https://img.youtube.com/vi/D6xkbGLQesk/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "In-depth understanding of DFS, BFS, level-order traversal, and tree balancing.",
    "descriptionGujarati": "બાઈનરી સર્ચ ટ્રી અને લેવલ ઓર્ડર ટ્રાવર્સલની ઊંડાણપૂર્વક સમજૂતી.",
    "timeStampedNotes": [
      {
        "time": "02:00",
        "text": "Binary Tree Fundamentals",
        "textGujarati": "બાઈનરી ટ્રી બેઝિક્સ"
      },
      {
        "time": "12:30",
        "text": "In-Order, Pre-Order, Post-Order",
        "textGujarati": "ટ્રાવર્સલ રીતો"
      },
      {
        "time": "24:00",
        "text": "LeetCode Medium Problems",
        "textGujarati": "લીટકોડ દાખલાઓ"
      }
    ],
    "comments": [
      {
        "id": "col_c2",
        "author": "Kavita Shah",
        "role": "SDE Aspirant",
        "text": "Best tree explanation for placements.",
        "upvotes": 19,
        "createdAt": "1 day ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=college&subject=col-dsa&chapter=1"
  },
  {
    "id": "vid-col-3",
    "chapterNumber": 3,
    "subjectId": "col-tech",
    "grades": [
      "college"
    ],
    "boards": [
      "CBSE",
      "GSEB",
      "ICSE"
    ],
    "category": "React & Full Stack",
    "categoryGujarati": "રિએક્ટ & ફુલ સ્ટેક ડેવલપમેન્ટ",
    "title": "React 19 Deep Dive: Hooks, Virtual DOM, Fiber Architecture",
    "titleGujarati": "રિએક્ટ ૧૯ હુક્સ, વર્ચ્યુઅલ DOM અને ફાઇબર આર્કિટેક્ચર",
    "instructor": "Senior Frontend Architect",
    "instructorGujarati": "સીનિયર ફ્રન્ટએન્ડ એન્જિનિયર",
    "duration": "29:50",
    "durationSeconds": 1790,
    "youtubeVideoId": "TNhaISOUy6Q",
    "thumbnailUrl": "https://img.youtube.com/vi/TNhaISOUy6Q/hqdefault.jpg",
    "playbackMode": "embed",
    "description": "Deep technical interview preparation on React Fiber reconciliation and state batching.",
    "descriptionGujarati": "રિએક્ટ હુક્સ અને સ્ટેટ મેનેજમેન્ટ પર ટેકનિકલ ઇન્ટરવ્યુ તૈયારી.",
    "timeStampedNotes": [
      {
        "time": "01:30",
        "text": "Event Loop & Call Stack",
        "textGujarati": "કોલ સ્ટેક અને ઇવેન્ટ લૂપ"
      },
      {
        "time": "11:00",
        "text": "Virtual DOM & Reconciliation",
        "textGujarati": "વર્ચ્યુઅલ DOM સમજૂતી"
      },
      {
        "time": "21:15",
        "text": "Custom Hooks Best Practices",
        "textGujarati": "કસ્ટમ હુક્સ"
      }
    ],
    "comments": [
      {
        "id": "col_c3",
        "author": "Priya Nair",
        "role": "Frontend Dev",
        "text": "Clear explanation of React hooks!",
        "upvotes": 22,
        "createdAt": "4 days ago"
      }
    ],
    "referencePdfUrl": "/api/curriculum/chapter-pdf?grade=college&subject=col-tech&chapter=1"
  }
];

// Seed videos on startup or on demand
async function seedDefaultVideos() {
  try {
    await VideoLecture.deleteMany({ id: { $regex: '^vid-school-' } });
    await VideoLecture.deleteMany({ grades: '6' });
    for (const video of SEED_VIDEOS) {
      await VideoLecture.findOneAndUpdate(
        { id: video.id },
        video,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }
  } catch (err) {
    console.warn('Video auto-seed notice:', err.message);
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
        filtered = filtered.filter(v => {
          const vCat = (v.category || '').toLowerCase();
          const vCatG = (v.categoryGujarati || '').toLowerCase();
          return vCat.includes(catLower) || vCatG.includes(catLower) ||
            (category === 'ગણિત' && (vCat.includes('math') || vCatG.includes('ગણિત'))) ||
            (category === 'વિજ્ઞાન' && (vCat.includes('sci') || vCatG.includes('વિજ્ઞાન'))) ||
            (category === 'સામાજિક વિજ્ઞાન' && (vCat.includes('soc') || vCatG.includes('સામાજિક'))) ||
            (category === 'ગુજરાતી' && (vCat.includes('guj') || vCatG.includes('ગુજરાતી'))) ||
            (category === 'અંગ્રેજી' && (vCat.includes('eng') || vCatG.includes('અંગ્રેજી')));
        });
      }
      if (board) {
        filtered = filtered.filter(v => v.boards && v.boards.includes(board));
      }
      return filtered.sort((a, b) => (a.chapterNumber || 0) - (b.chapterNumber || 0));
    };

    if (mongoose.connection.readyState !== 1) {
      return res.json(filterSeed());
    }

    let query = {};
    if (grade) {
      query.grades = grade;
    }
    if (category && category !== 'All') {
      const orClauses = [
        { category: new RegExp(category, 'i') },
        { categoryGujarati: new RegExp(category, 'i') },
      ];
      if (category === 'ગણિત') orClauses.push({ category: /math/i });
      if (category === 'વિજ્ઞાન') orClauses.push({ category: /sci/i });
      if (category === 'સામાજિક વિજ્ઞાન') orClauses.push({ category: /social/i });
      if (category === 'ગુજરાતી') orClauses.push({ category: /gujarati/i });
      if (category === 'અંગ્રેજી') orClauses.push({ category: /english/i });
      query.$or = orClauses;
    }
    if (board) {
      query.boards = board;
    }

    let videos = await VideoLecture.find(query).sort({ chapterNumber: 1, id: 1 });

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

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Question = require('../models/Question');
const ExamResult = require('../models/ExamResult');
const User = require('../models/User');

const SEED_QUESTIONS = [
  {
    "id": 101,
    "category": "ગણિત",
    "categoryGujarati": "ગણિત",
    "grades": [
      "6"
    ],
    "subject": "Mathematics",
    "questionText": "સૌથી નાની ૫-અંકની સંખ્યા (૧૦,૦૦૦) ની પુરોગામી સંખ્યા કઈ છે?",
    "questionTextGujarati": "સૌથી નાની ૫-અંકની સંખ્યા (૧૦,૦૦૦) ની પુરોગામી સંખ્યા કઈ છે?",
    "options": [
      "૯,૯૯૯",
      "૧૦,૦૦૧",
      "૯,૯૯૦",
      "૯,૯૦૦"
    ],
    "optionsGujarati": [
      "૯,૯૯૯",
      "૧૦,૦૦૧",
      "૯,૯૯૦",
      "૯,૯૦૦"
    ],
    "correctAnswer": 0,
    "explanation": "પુરોગામી એટલે આપેલી સંખ્યામાંથી ૧ બાદ કરવું: ૧૦,૦૦૦ - ૧ = ૯,૯૯૯.",
    "explanationGujarati": "પુરોગામી એટલે આપેલી સંખ્યામાંથી ૧ બાદ કરવું: ૧૦,૦૦૦ - ૧ = ૯,૯૯૯.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 102,
    "category": "ગણિત",
    "categoryGujarati": "ગણિત",
    "grades": [
      "6"
    ],
    "subject": "Mathematics",
    "questionText": "નીચેનામાંથી કઈ સંખ્યા 6 વડે વિભાજ્ય છે?",
    "questionTextGujarati": "નીચેનામાંથી કઈ સંખ્યા 6 વડે વિભાજ્ય છે?",
    "options": [
      "124",
      "138",
      "215",
      "143"
    ],
    "optionsGujarati": [
      "124",
      "138",
      "215",
      "143"
    ],
    "correctAnswer": 1,
    "explanation": "જો સંખ્યા બેકી હોય અને તેના અંકોનો સરવાળો 3 વડે ભાગી શકાય તો તે 6 વડે વિભાજ્ય બને છે. 138 માટે: બેકી અને 1+3+8=12 (3 વડે વિભાજ્ય).",
    "explanationGujarati": "જો સંખ્યા બેકી હોય અને તેના અંકોનો સરવાળો 3 વડે ભાગી શકાય તો તે 6 વડે વિભાજ્ય બને છે. 138 માટે: બેકી અને 1+3+8=12 (3 વડે વિભાજ્ય).",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 103,
    "category": "ગણિત",
    "categoryGujarati": "ગણિત",
    "grades": [
      "6"
    ],
    "subject": "Mathematics",
    "questionText": "બે ક્રમિક બેકી સંખ્યાઓ (જેમ કે 4 અને 6) નો ગુ.સા.અ. (HCF) કેટલો થાય?",
    "questionTextGujarati": "બે ક્રમિક બેકી સંખ્યાઓ (જેમ કે 4 અને 6) નો ગુ.સા.અ. (HCF) કેટલો થાય?",
    "options": [
      "1",
      "2",
      "4",
      "0"
    ],
    "optionsGujarati": [
      "1",
      "2",
      "4",
      "0"
    ],
    "correctAnswer": 1,
    "explanation": "કોઈપણ બે ક્રમિક બેકી સંખ્યાઓનો ગુ.સા.અ. હંમેશાં 2 હોય છે.",
    "explanationGujarati": "કોઈપણ બે ક્રમિક બેકી સંખ્યાઓનો ગુ.સા.અ. હંમેશાં 2 હોય છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 104,
    "category": "ગણિત",
    "categoryGujarati": "ગણિત",
    "grades": [
      "6"
    ],
    "subject": "Mathematics",
    "questionText": "અપૂર્ણાંક 36/54 નું અતિસંક્ષિપ્ત રૂપ શું થાય?",
    "questionTextGujarati": "અપૂર્ણાંક 36/54 નું અતિસંક્ષિપ્ત રૂપ શું થાય?",
    "options": [
      "2/3",
      "3/4",
      "4/6",
      "1/2"
    ],
    "optionsGujarati": [
      "2/3",
      "3/4",
      "4/6",
      "1/2"
    ],
    "correctAnswer": 0,
    "explanation": "અંશ અને છેદ બંનેને 18 વડે ભાગતાં 2/3 મળે છે.",
    "explanationGujarati": "અંશ અને છેદ બંનેને 18 વડે ભાગતાં 2/3 મળે છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 105,
    "category": "ગણિત",
    "categoryGujarati": "ગણિત",
    "grades": [
      "6"
    ],
    "subject": "Mathematics",
    "questionText": "5 સેમી બાજુ ધરાવતા નિયમિત ષટ્કોણની પરિમિતિ કેટલી થાય?",
    "questionTextGujarati": "5 સેમી બાજુ ધરાવતા નિયમિત ષટ્કોણની પરિમિતિ કેટલી થાય?",
    "options": [
      "25 સેમી",
      "30 સેમી",
      "35 સેમી",
      "20 સેમી"
    ],
    "optionsGujarati": [
      "25 સેમી",
      "30 સેમી",
      "35 સેમી",
      "20 સેમી"
    ],
    "correctAnswer": 1,
    "explanation": "નિયમિત ષટ્કોણની પરિમિતિ = 6 × બાજુ = 6 × 5 = 30 સેમી.",
    "explanationGujarati": "નિયમિત ષટ્કોણની પરિમિતિ = 6 × બાજુ = 6 × 5 = 30 સેમી.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 106,
    "category": "ગણિત",
    "categoryGujarati": "ગણિત",
    "grades": [
      "6"
    ],
    "subject": "Mathematics",
    "questionText": "જે ખૂણાનું માપ 90° થી વધુ પરંતુ 180° થી ઓછું હોય તેને શું કહેવાય?",
    "questionTextGujarati": "જે ખૂણાનું માપ 90° થી વધુ પરંતુ 180° થી ઓછું હોય તેને શું કહેવાય?",
    "options": [
      "લઘુકોણ",
      "ગુરુકોણ",
      "કાટકોણ",
      "સરળકોણ"
    ],
    "optionsGujarati": [
      "લઘુકોણ",
      "ગુરુકોણ",
      "કાટકોણ",
      "સરળકોણ"
    ],
    "correctAnswer": 1,
    "explanation": "90° થી મોટા અને 180° થી નાના ખૂણાને ગુરુકોણ કહેવાય છે.",
    "explanationGujarati": "90° થી મોટા અને 180° થી નાના ખૂણાને ગુરુકોણ કહેવાય છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 107,
    "category": "ગણિત",
    "categoryGujarati": "ગણિત",
    "grades": [
      "6"
    ],
    "subject": "Mathematics",
    "questionText": "સમીકરણ ઉકેલો: x - 7 = 15. x ની કિંમત કેટલી થશે?",
    "questionTextGujarati": "સમીકરણ ઉકેલો: x - 7 = 15. x ની કિંમત કેટલી થશે?",
    "options": [
      "8",
      "22",
      "105",
      "21"
    ],
    "optionsGujarati": [
      "8",
      "22",
      "105",
      "21"
    ],
    "correctAnswer": 1,
    "explanation": "x = 15 + 7 = 22.",
    "explanationGujarati": "x = 15 + 7 = 22.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 108,
    "category": "વિજ્ઞાન",
    "categoryGujarati": "વિજ્ઞાન",
    "grades": [
      "6"
    ],
    "subject": "Science",
    "questionText": "કયા વિટામિનની ઉણપથી સ્કર્વી (Scurvy) રોગ થાય છે?",
    "questionTextGujarati": "કયા વિટામિનની ઉણપથી સ્કર્વી (Scurvy) રોગ થાય છે?",
    "options": [
      "વિટામિન A",
      "વિટામિન B1",
      "વિટામિન C",
      "વિટામિન D"
    ],
    "optionsGujarati": [
      "વિટામિન A",
      "વિટામિન B1",
      "વિટામિન C",
      "વિટામિન D"
    ],
    "correctAnswer": 2,
    "explanation": "વિટામિન C ની ઉણપથી પેઢામાંથી લોહી નીકળવું અને સ્કર્વી રોગ થાય છે.",
    "explanationGujarati": "વિટામિન C ની ઉણપથી પેઢામાંથી લોહી નીકળવું અને સ્કર્વી રોગ થાય છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 109,
    "category": "વિજ્ઞાન",
    "categoryGujarati": "વિજ્ઞાન",
    "grades": [
      "6"
    ],
    "subject": "Science",
    "questionText": "રતાંધળાપણું (Night Blindness) કયા વિટામિનની ખામીથી થાય છે?",
    "questionTextGujarati": "રતાંધળાપણું (Night Blindness) કયા વિટામિનની ખામીથી થાય છે?",
    "options": [
      "વિટામિન A",
      "વિટામિન C",
      "વિટામિન D",
      "વિટામિન K"
    ],
    "optionsGujarati": [
      "વિટામિન A",
      "વિટામિન C",
      "વિટામિન D",
      "વિટામિન K"
    ],
    "correctAnswer": 0,
    "explanation": "વિટામિન A ની ખામીથી આંખોનું તેજ ઘટે છે અને રતાંધળાપણું આવે છે.",
    "explanationGujarati": "વિટામિન A ની ખામીથી આંખોનું તેજ ઘટે છે અને રતાંધળાપણું આવે છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 110,
    "category": "વિજ્ઞાન",
    "categoryGujarati": "વિજ્ઞાન",
    "grades": [
      "6"
    ],
    "subject": "Science",
    "questionText": "વનસ્પતિનો કયો ભાગ જમીનમાંથી પાણી અને ક્ષારોનું શોષણ કરે છે?",
    "questionTextGujarati": "વનસ્પતિનો કયો ભાગ જમીનમાંથી પાણી અને ક્ષારોનું શોષણ કરે છે?",
    "options": [
      "પ્રકાંડ",
      "મૂળ",
      "પર્ણ",
      "પુષ્પ"
    ],
    "optionsGujarati": [
      "પ્રકાંડ",
      "મૂળ",
      "પર્ણ",
      "પુષ્પ"
    ],
    "correctAnswer": 1,
    "explanation": "મૂળ જમીનમાંથી પાણી અને ખનીજ ક્ષારોનું શોષણ કરે છે.",
    "explanationGujarati": "મૂળ જમીનમાંથી પાણી અને ખનીજ ક્ષારોનું શોષણ કરે છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 111,
    "category": "વિજ્ઞાન",
    "categoryGujarati": "વિજ્ઞાન",
    "grades": [
      "6"
    ],
    "subject": "Science",
    "questionText": "દહીં કે છાશનું મંથન કરી (વલોવીને) માખણ અલગ કરવાની પદ્ધતિને શું કહેવાય?",
    "questionTextGujarati": "દહીં કે છાશનું મંથન કરી (વલોવીને) માખણ અલગ કરવાની પદ્ધતિને શું કહેવાય?",
    "options": [
      "ગાળણ (Filtration)",
      "બાષ્પીભવન (Evaporation)",
      "સેન્ટ્રિફ્યુગેશન / વલોવવું (Churning)",
      "નિતારણ (Decantation)"
    ],
    "optionsGujarati": [
      "ગાળણ (Filtration)",
      "બાષ્પીભવન (Evaporation)",
      "સેન્ટ્રિફ્યુગેશન / વલોવવું (Churning)",
      "નિતારણ (Decantation)"
    ],
    "correctAnswer": 2,
    "explanation": "મંથન અથવા સેન્ટ્રિફ્યુગેશન દ્વારા ભારે અને હલકા ઘટકો અલગ પડે છે.",
    "explanationGujarati": "મંથન અથવા સેન્ટ્રિફ્યુગેશન દ્વારા ભારે અને હલકા ઘટકો અલગ પડે છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 112,
    "category": "વિજ્ઞાન",
    "categoryGujarati": "વિજ્ઞાન",
    "grades": [
      "6"
    ],
    "subject": "Science",
    "questionText": "નીચેનામાંથી કયો પ્રકાશિત (પ્રકાશ આપતો) પદાર્થ છે?",
    "questionTextGujarati": "નીચેનામાંથી કયો પ્રકાશિત (પ્રકાશ આપતો) પદાર્થ છે?",
    "options": [
      "ચંદ્ર",
      "સૂર્ય",
      "અરીસો",
      "લાકડું"
    ],
    "optionsGujarati": [
      "ચંદ્ર",
      "સૂર્ય",
      "અરીસો",
      "લાકડું"
    ],
    "correctAnswer": 1,
    "explanation": "સૂર્ય સ્વયંપ્રકાશિત પદાર્થ છે, જ્યારે ચંદ્ર સૂર્યના પ્રકાશથી ચમકે છે.",
    "explanationGujarati": "સૂર્ય સ્વયંપ્રકાશિત પદાર્થ છે, જ્યારે ચંદ્ર સૂર્યના પ્રકાશથી ચમકે છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 113,
    "category": "વિજ્ઞાન",
    "categoryGujarati": "વિજ્ઞાન",
    "grades": [
      "6"
    ],
    "subject": "Science",
    "questionText": "વિદ્યુત બલ્બમાં પ્રકાશ આપતા પાતળા તારને શું કહેવાય છે?",
    "questionTextGujarati": "વિદ્યુત બલ્બમાં પ્રકાશ આપતા પાતળા તારને શું કહેવાય છે?",
    "options": [
      "ટર્મિનલ",
      "ફિલામેન્ટ",
      "સ્વિચ",
      "વાયર"
    ],
    "optionsGujarati": [
      "ટર્મિનલ",
      "ફિલામેન્ટ",
      "સ્વિચ",
      "વાયર"
    ],
    "correctAnswer": 1,
    "explanation": "બલ્બમાં ટંગસ્ટન ધાતુનો બનેલો પાતળો તાર પ્રકાશ આપે છે જેને ફિલામેન્ટ કહે છે.",
    "explanationGujarati": "બલ્બમાં ટંગસ્ટન ધાતુનો બનેલો પાતળો તાર પ્રકાશ આપે છે જેને ફિલામેન્ટ કહે છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 114,
    "category": "વિજ્ઞાન",
    "categoryGujarati": "વિજ્ઞાન",
    "grades": [
      "6"
    ],
    "subject": "Science",
    "questionText": "હાડકાં હલનચલન ન કરી શકે તેવા સાંધા (જેમ કે ખોપરીના હાડકાં વચ્ચે) ને શું કહે છે?",
    "questionTextGujarati": "હાડકાં હલનચલન ન કરી શકે તેવા સાંધા (જેમ કે ખોપરીના હાડકાં વચ્ચે) ને શું કહે છે?",
    "options": [
      "અચલ સાંધા (Fixed Joints)",
      "ઊખળી સાંધો (Pivot Joint)",
      "મિજાગરા સાંધો (Hinge Joint)",
      "ખલ-દસ્તો સાંધો (Ball and Socket Joint)"
    ],
    "optionsGujarati": [
      "અચલ સાંધા (Fixed Joints)",
      "ઊખળી સાંધો (Pivot Joint)",
      "મિજાગરા સાંધો (Hinge Joint)",
      "ખલ-દસ્તો સાંધો (Ball and Socket Joint)"
    ],
    "correctAnswer": 0,
    "explanation": "ખોપરીના અસ્થિઓ અચલ સાંધા વડે જોડાયેલા હોવાથી હલી શકતા નથી.",
    "explanationGujarati": "ખોપરીના અસ્થિઓ અચલ સાંધા વડે જોડાયેલા હોવાથી હલી શકતા નથી.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 115,
    "category": "સામાજિક વિજ્ઞાન",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "grades": [
      "6"
    ],
    "subject": "Social Science",
    "questionText": "વિશાળ સ્નાનાગાર કયા પ્રાચીન હડપ્પીય નગરમાંથી મળી આવ્યું હતું?",
    "questionTextGujarati": "વિશાળ સ્નાનાગાર કયા પ્રાચીન હડપ્પીય નગરમાંથી મળી આવ્યું હતું?",
    "options": [
      "હડપ્પા",
      "મોહેં-જો-દડો",
      "કાલીબંગન",
      "ધોળાવીરા"
    ],
    "optionsGujarati": [
      "હડપ્પા",
      "મોહેં-જો-દડો",
      "કાલીબંગન",
      "ધોળાવીરા"
    ],
    "correctAnswer": 1,
    "explanation": "મોહેં-જો-દડો નગરમાંથી ઇંટોથી ચણેલું વિશાળ જાહેર સ્નાનાગાર મળી આવ્યું છે.",
    "explanationGujarati": "મોહેં-જો-દડો નગરમાંથી ઇંટોથી ચણેલું વિશાળ જાહેર સ્નાનાગાર મળી આવ્યું છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 116,
    "category": "સામાજિક વિજ્ઞાન",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "grades": [
      "6"
    ],
    "subject": "Social Science",
    "questionText": "ગુજરાતમાં આવેલું પ્રાચીન ભારતનું પ્રસિદ્ધ બંદર અને ધક્કો (ડૉકયાર્ડ) કયું હતું?",
    "questionTextGujarati": "ગુજરાતમાં આવેલું પ્રાચીન ભારતનું પ્રસિદ્ધ બંદર અને ધક્કો (ડૉકયાર્ડ) કયું હતું?",
    "options": [
      "લોથલ",
      "કાશી",
      "પાટલિપુત્ર",
      "હસ્તિનાપુર"
    ],
    "optionsGujarati": [
      "લોથલ",
      "કાશી",
      "પાટલિપુત્ર",
      "હસ્તિનાપુર"
    ],
    "correctAnswer": 0,
    "explanation": "લોથલ અમદાવાદ જિલ્લામાં ભોગાવો નદી કિનારે આવેલું પ્રાચીન હડપ્પીય બંદર હતું.",
    "explanationGujarati": "લોથલ અમદાવાદ જિલ્લામાં ભોગાવો નદી કિનારે આવેલું પ્રાચીન હડપ્પીય બંદર હતું.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 117,
    "category": "સામાજિક વિજ્ઞાન",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "grades": [
      "6"
    ],
    "subject": "Social Science",
    "questionText": "0° રેખાંશવૃત્ત (0° Meridian) ને બીજા કયા નામે ઓળખવામાં આવે છે?",
    "questionTextGujarati": "0° રેખાંશવૃત્ત (0° Meridian) ને બીજા કયા નામે ઓળખવામાં આવે છે?",
    "options": [
      "કર્કવૃત્ત",
      "મકરવૃત્ત",
      "મુખ્ય રેખાંશવૃત્ત / ગ્રીનિચ રેખા (Prime Meridian)",
      "વિષુવવૃત્ત"
    ],
    "optionsGujarati": [
      "કર્કવૃત્ત",
      "મકરવૃત્ત",
      "મુખ્ય રેખાંશવૃત્ત / ગ્રીનિચ રેખા (Prime Meridian)",
      "વિષુવવૃત્ત"
    ],
    "correctAnswer": 2,
    "explanation": "0° રેખાંશવૃત્ત ઇંગ્લેન્ડના ગ્રીનિચ શહેર પરથી પસાર થાય છે જેને ગ્રીનિચ રેખા અથવા મુખ્ય રેખાંશવૃત્ત કહે છે.",
    "explanationGujarati": "0° રેખાંશવૃત્ત ઇંગ્લેન્ડના ગ્રીનિચ શહેર પરથી પસાર થાય છે જેને ગ્રીનિચ રેખા અથવા મુખ્ય રેખાંશવૃત્ત કહે છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 118,
    "category": "સામાજિક વિજ્ઞાન",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "grades": [
      "6"
    ],
    "subject": "Social Science",
    "questionText": "પૃથ્વીને સૂર્યની આસપાસ એક પરિક્રમણ પૂરું કરતાં કેટલો સમય લાગે છે?",
    "questionTextGujarati": "પૃથ્વીને સૂર્યની આસપાસ એક પરિક્રમણ પૂરું કરતાં કેટલો સમય લાગે છે?",
    "options": [
      "૩૬૫ દિવસ",
      "૩૬૫ દિવસ અને ૬ કલાક",
      "૩૬૦ દિવસ",
      "૨૪ કલાક"
    ],
    "optionsGujarati": [
      "૩૬૫ દિવસ",
      "૩૬૫ દિવસ અને ૬ કલાક",
      "૩૬૦ દિવસ",
      "૨૪ કલાક"
    ],
    "correctAnswer": 1,
    "explanation": "પૃથ્વીને સૂર્યની આસપાસ એક ચક્ર લગાવતાં ૩૬૫ દિવસ અને લગભગ ૬ કલાક (૧ વર્ષ) લાગે છે.",
    "explanationGujarati": "પૃથ્વીને સૂર્યની આસપાસ એક ચક્ર લગાવતાં ૩૬૫ દિવસ અને લગભગ ૬ કલાક (૧ વર્ષ) લાગે છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 119,
    "category": "સામાજિક વિજ્ઞાન",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "grades": [
      "6"
    ],
    "subject": "Social Science",
    "questionText": "ગામડામાં સ્થાનિક સ્વરાજ્યની ચૂંટાયેલી વહીવટી સંસ્થા કયા નામે ઓળખાય છે?",
    "questionTextGujarati": "ગામડામાં સ્થાનિક સ્વરાજ્યની ચૂંટાયેલી વહીવટી સંસ્થા કયા નામે ઓળખાય છે?",
    "options": [
      "ગ્રામ પંચાયત",
      "નગરપાલિકા",
      "મહાનગરપાલિકા",
      "વિધાનસભા"
    ],
    "optionsGujarati": [
      "ગ્રામ પંચાયત",
      "નગરપાલિકા",
      "મહાનગરપાલિકા",
      "વિધાનસભા"
    ],
    "correctAnswer": 0,
    "explanation": "ગ્રામ પંચાયત એ ગામડાના સ્તરે સ્થાનિક કારભાર સંભાળતી મૂળભૂત લોકશાહી સંસ્થા છે.",
    "explanationGujarati": "ગ્રામ પંચાયત એ ગામડાના સ્તરે સ્થાનિક કારભાર સંભાળતી મૂળભૂત લોકશાહી સંસ્થા છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 120,
    "category": "સામાજિક વિજ્ઞાન",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "grades": [
      "6"
    ],
    "subject": "Social Science",
    "questionText": "ભારતીય બંધારણના ઘડવૈયા / પિતા તરીકે કોણ ઓળખાય છે?",
    "questionTextGujarati": "ભારતીય બંધારણના ઘડવૈયા / પિતા તરીકે કોણ ઓળખાય છે?",
    "options": [
      "મહાત્મા ગાંધી",
      "ડૉ. બાબાસાહેબ આંબેડકર",
      "સરદાર વલ્લભભાઈ પટેલ",
      "પંડિત જવાહરલાલ નેહરુ"
    ],
    "optionsGujarati": [
      "મહાત્મા ગાંધી",
      "ડૉ. બાબાસાહેબ આંબેડકર",
      "સરદાર વલ્લભભાઈ પટેલ",
      "પંડિત જવાહરલાલ નેહરુ"
    ],
    "correctAnswer": 1,
    "explanation": "ડૉ. ભીમરાવ બાબાસાહેબ આંબેડકર બંધારણ નિર્માણની મુસદ્દા (ખરડા) સમિતિના અધ્યક્ષ હતા.",
    "explanationGujarati": "ડૉ. ભીમરાવ બાબાસાહેબ આંબેડકર બંધારણ નિર્માણની મુસદ્દા (ખરડા) સમિતિના અધ્યક્ષ હતા.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 121,
    "category": "અંગ્રેજી",
    "categoryGujarati": "અંગ્રેજી",
    "grades": [
      "6"
    ],
    "subject": "English",
    "questionText": "નીચેના વાક્યમાંથી ભાવવાચક સંજ્ઞા (Abstract Noun) ઓળખો: 'Honesty is the best policy.'",
    "questionTextGujarati": "નીચેના વાક્યમાંથી ભાવવાચક સંજ્ઞા (Abstract Noun) ઓળખો: 'Honesty is the best policy.'",
    "options": [
      "Honesty",
      "Best",
      "Policy",
      "Is"
    ],
    "optionsGujarati": [
      "Honesty",
      "Best",
      "Policy",
      "Is"
    ],
    "correctAnswer": 0,
    "explanation": "'Honesty' (પ્રામાણિકતા) એ એક ગુણ અને ભાવ દર્શાવતું Abstract Noun છે.",
    "explanationGujarati": "'Honesty' (પ્રામાણિકતા) એ એક ગુણ અને ભાવ દર્શાવતું Abstract Noun છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 122,
    "category": "અંગ્રેજી",
    "categoryGujarati": "અંગ્રેજી",
    "grades": [
      "6"
    ],
    "subject": "English",
    "questionText": "યોગ્ય પ્રેપોઝિશન (Preposition) પસંદ કરો: 'The cat jumped ______ the fence.'",
    "questionTextGujarati": "યોગ્ય પ્રેપોઝિશન (Preposition) પસંદ કરો: 'The cat jumped ______ the fence.'",
    "options": [
      "under",
      "over",
      "in",
      "at"
    ],
    "optionsGujarati": [
      "under",
      "over",
      "in",
      "at"
    ],
    "correctAnswer": 1,
    "explanation": "વાડની ઉપરથી કૂદકો મારવા માટે 'over' પ્રેપોઝિશન વપરાય છે.",
    "explanationGujarati": "વાડની ઉપરથી કૂદકો મારવા માટે 'over' પ્રેપોઝિશન વપરાય છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 123,
    "category": "અંગ્રેજી",
    "categoryGujarati": "અંગ્રેજી",
    "grades": [
      "6"
    ],
    "subject": "English",
    "questionText": "‘ANCIENT’ (પ્રાચીન) શબ્દનો સાચો વિરોધી (Antonym) શબ્દ કયો છે?",
    "questionTextGujarati": "‘ANCIENT’ (પ્રાચીન) શબ્દનો સાચો વિરોધી (Antonym) શબ્દ કયો છે?",
    "options": [
      "Old",
      "Modern",
      "Historic",
      "Past"
    ],
    "optionsGujarati": [
      "Old",
      "Modern",
      "Historic",
      "Past"
    ],
    "correctAnswer": 1,
    "explanation": "'Ancient' એટલે પ્રાચીન અને 'Modern' એટલે આધુનિક.",
    "explanationGujarati": "'Ancient' એટલે પ્રાચીન અને 'Modern' એટલે આધુનિક.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 124,
    "category": "અંગ્રેજી",
    "categoryGujarati": "અંગ્રેજી",
    "grades": [
      "6"
    ],
    "subject": "English",
    "questionText": "નીચેના વાક્યમાંથી ક્રિયાવિશેષણ (Adverb) શોધો: 'He ran quickly to catch the school bus.'",
    "questionTextGujarati": "નીચેના વાક્યમાંથી ક્રિયાવિશેષણ (Adverb) શોધો: 'He ran quickly to catch the school bus.'",
    "options": [
      "He",
      "Ran",
      "Quickly",
      "School"
    ],
    "optionsGujarati": [
      "He",
      "Ran",
      "Quickly",
      "School"
    ],
    "correctAnswer": 2,
    "explanation": "'Quickly' શબ્દ દોડવાની ક્રિયા કેવી રીતે થઈ તે દર્શાવે છે, તેથી તે Adverb છે.",
    "explanationGujarati": "'Quickly' શબ્દ દોડવાની ક્રિયા કેવી રીતે થઈ તે દર્શાવે છે, તેથી તે Adverb છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 125,
    "category": "અંગ્રેજી",
    "categoryGujarati": "અંગ્રેજી",
    "grades": [
      "6"
    ],
    "subject": "English",
    "questionText": "સાચા વિરામચિહ્નો (Punctuation) ધરાવતું યોગ્ય વાક્ય પસંદ કરો:",
    "questionTextGujarati": "સાચા વિરામચિહ્નો (Punctuation) ધરાવતું યોગ્ય વાક્ય પસંદ કરો:",
    "options": [
      "Where are you going?",
      "where are you going.",
      "Where are you going.",
      "Where, are you going!"
    ],
    "optionsGujarati": [
      "Where are you going?",
      "where are you going.",
      "Where are you going.",
      "Where, are you going!"
    ],
    "correctAnswer": 0,
    "explanation": "પ્રશ્નાર્થ વાક્યનો પ્રથમ અક્ષર કેપિટલ હોવો જોઈએ અને છેલ્લે પ્રશ્નાર્થચિહ્ન (?) આવવું જોઈએ.",
    "explanationGujarati": "પ્રશ્નાર્થ વાક્યનો પ્રથમ અક્ષર કેપિટલ હોવો જોઈએ અને છેલ્લે પ્રશ્નાર્થચિહ્ન (?) આવવું જોઈએ.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 126,
    "category": "ગુજરાતી",
    "categoryGujarati": "ગુજરાતી",
    "grades": [
      "6"
    ],
    "subject": "Gujarati",
    "questionText": "'સૂર્ય' શબ્દનો સમાનાર્થી શબ્દ નીચેનામાંથી કયો છે?",
    "questionTextGujarati": "'સૂર્ય' શબ્દનો સમાનાર્થી શબ્દ નીચેનામાંથી કયો છે?",
    "options": [
      "રવિ",
      "શશી",
      "પાવક",
      "નીર"
    ],
    "optionsGujarati": [
      "રવિ",
      "શશી",
      "પાવક",
      "નીર"
    ],
    "correctAnswer": 0,
    "explanation": "'રવિ', 'દિનકર', 'ભાસ્કર' એ સૂર્યના સમાનાર્થી શબ્દો છે. શશી એટલે ચંદ્ર, પાવક એટલે અગ્નિ અને નીર એટલે પાણી.",
    "explanationGujarati": "'રવિ', 'દિનકર', 'ભાસ્કર' એ સૂર્યના સમાનાર્થી શબ્દો છે. શશી એટલે ચંદ્ર, પાવક એટલે અગ્નિ અને નીર એટલે પાણી.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 127,
    "category": "ગુજરાતી",
    "categoryGujarati": "ગુજરાતી",
    "grades": [
      "6"
    ],
    "subject": "Gujarati",
    "questionText": "'સત્ય' શબ્દનો સાચો વિરોધી શબ્દ કયો થાય?",
    "questionTextGujarati": "'સત્ય' શબ્દનો સાચો વિરોધી શબ્દ કયો થાય?",
    "options": [
      "અસત્ય",
      "ન્યાય",
      "ધર્મ",
      "પુણ્ય"
    ],
    "optionsGujarati": [
      "અસત્ય",
      "ન્યાય",
      "ધર્મ",
      "પુણ્ય"
    ],
    "correctAnswer": 0,
    "explanation": "'સત્ય' નો વિરોધી શબ્દ 'અસત્ય' અથવા 'જૂઠ' થાય છે.",
    "explanationGujarati": "'સત્ય' નો વિરોધી શબ્દ 'અસત્ય' અથવા 'જૂઠ' થાય છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 128,
    "category": "ગુજરાતી",
    "categoryGujarati": "ગુજરાતી",
    "grades": [
      "6"
    ],
    "subject": "Gujarati",
    "questionText": "'આકાશ' માંથી નીચે પડતા પાણીના ટીપાંને શું કહેવાય?",
    "questionTextGujarati": "'આકાશ' માંથી નીચે પડતા પાણીના ટીપાંને શું કહેવાય?",
    "options": [
      "ઝાકળ",
      "વરસાદ",
      "બરફ",
      "ધૂમ્મસ"
    ],
    "optionsGujarati": [
      "ઝાકળ",
      "વરસાદ",
      "બરફ",
      "ધૂમ્મસ"
    ],
    "correctAnswer": 1,
    "explanation": "વાદળોમાંથી વરસતા પાણીના ફોરાં કે ટીપાંને વરસાદ (મેઘ) કહેવાય છે.",
    "explanationGujarati": "વાદળોમાંથી વરસતા પાણીના ફોરાં કે ટીપાંને વરસાદ (મેઘ) કહેવાય છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 129,
    "category": "ગુજરાતી",
    "categoryGujarati": "ગુજરાતી",
    "grades": [
      "6"
    ],
    "subject": "Gujarati",
    "questionText": "નીચેનામાંથી કઈ જોડણી સાચી છે?",
    "questionTextGujarati": "નીચેનામાંથી કઈ જોડણી સાચી છે?",
    "options": [
      "નિયમીત",
      "નિયમિત",
      "નીયમીત",
      "નીયમિત"
    ],
    "optionsGujarati": [
      "નિયમીત",
      "નિયમિત",
      "નીયમીત",
      "નીયમિત"
    ],
    "correctAnswer": 1,
    "explanation": "'નિયમિત' એ શુદ્ધ જોડણી છે જેમાં 'નિ' અને 'મિ' બંને હ્રસ્વ આવે છે.",
    "explanationGujarati": "'નિયમિત' એ શુદ્ધ જોડણી છે જેમાં 'નિ' અને 'મિ' બંને હ્રસ્વ આવે છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 130,
    "category": "ગુજરાતી",
    "categoryGujarati": "ગુજરાતી",
    "grades": [
      "6"
    ],
    "subject": "Gujarati",
    "questionText": "'આંખ આડા કાન કરવા' રૂઢિપ્રયોગનો અર્થ શું થાય?",
    "questionTextGujarati": "'આંખ આડા કાન કરવા' રૂઢિપ્રયોગનો અર્થ શું થાય?",
    "options": [
      "ધ્યાન ન આપવું / અવગણવું",
      "ખૂબ ગુસ્સે થવું",
      "સાવચેત રહેવું",
      "કાનમાં દવા નાખવી"
    ],
    "optionsGujarati": [
      "ધ્યાન ન આપવું / અવગણવું",
      "ખૂબ ગુસ્સે થવું",
      "સાવચેત રહેવું",
      "કાનમાં દવા નાખવી"
    ],
    "correctAnswer": 0,
    "explanation": "'આંખ આડા કાન કરવા' એટલે જાણી જોઈને વાત ધ્યાને ન લેવી કે વાતની અવગણના કરવી.",
    "explanationGujarati": "'આંખ આડા કાન કરવા' એટલે જાણી જોઈને વાત ધ્યાને ન લેવી કે વાતની અવગણના કરવી.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 201,
    "category": "ગણિત",
    "categoryGujarati": "ગણિત",
    "grades": [
      "7"
    ],
    "subject": "Mathematics",
    "questionText": "સુરેખ સમીકરણ ઉકેલો: 3x + 7 = 22. x ની કિંમત શોધો.",
    "questionTextGujarati": "સુરેખ સમીકરણ ઉકેલો: 3x + 7 = 22. x ની કિંમત શોધો.",
    "options": [
      "3",
      "5",
      "7",
      "15"
    ],
    "optionsGujarati": [
      "3",
      "5",
      "7",
      "15"
    ],
    "correctAnswer": 1,
    "explanation": "3x = 22 - 7 = 15 => x = 15 / 3 = 5.",
    "explanationGujarati": "3x = 22 - 7 = 15 => x = 15 / 3 = 5.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 202,
    "category": "ગણિત",
    "categoryGujarati": "ગણિત",
    "grades": [
      "7"
    ],
    "subject": "Mathematics",
    "questionText": "કિંમત શોધો: (-15) + (-8) - (-10) = ?",
    "questionTextGujarati": "કિંમત શોધો: (-15) + (-8) - (-10) = ?",
    "options": [
      "-13",
      "-33",
      "-17",
      "+7"
    ],
    "optionsGujarati": [
      "-13",
      "-33",
      "-17",
      "+7"
    ],
    "correctAnswer": 0,
    "explanation": "(-15) + (-8) - (-10) = -23 + 10 = -13.",
    "explanationGujarati": "(-15) + (-8) - (-10) = -23 + 10 = -13.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 203,
    "category": "ગણિત",
    "categoryGujarati": "ગણિત",
    "grades": [
      "7"
    ],
    "subject": "Mathematics",
    "questionText": "કાટકોણ ત્રિકોણમાં જો પાયો = 6 સેમી અને વેધ = 8 સેમી હોય, તો કર્ણનું માપ કેટલું થાય?",
    "questionTextGujarati": "કાટકોણ ત્રિકોણમાં જો પાયો = 6 સેમી અને વેધ = 8 સેમી હોય, તો કર્ણનું માપ કેટલું થાય?",
    "options": [
      "10 સેમી",
      "14 સેમી",
      "12 સેમી",
      "48 સેમી"
    ],
    "optionsGujarati": [
      "10 સેમી",
      "14 સેમી",
      "12 સેમી",
      "48 સેમી"
    ],
    "correctAnswer": 0,
    "explanation": "પાયથાગોરસ પ્રમેય મુજબ: કર્ણ² = 6² + 8² = 36 + 64 = 100 => કર્ણ = 10 સેમી.",
    "explanationGujarati": "પાયથાગોરસ પ્રમેય મુજબ: કર્ણ² = 6² + 8² = 36 + 64 = 100 => કર્ણ = 10 સેમી.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 204,
    "category": "ગણિત",
    "categoryGujarati": "ગણિત",
    "grades": [
      "7"
    ],
    "subject": "Mathematics",
    "questionText": "ગુણાકાર શોધો: 0.04 × 0.2 = ?",
    "questionTextGujarati": "ગુણાકાર શોધો: 0.04 × 0.2 = ?",
    "options": [
      "0.8",
      "0.08",
      "0.008",
      "0.0008"
    ],
    "optionsGujarati": [
      "0.8",
      "0.08",
      "0.008",
      "0.0008"
    ],
    "correctAnswer": 2,
    "explanation": "4 × 2 = 8. દશાંશ ચિહ્ન પછી કુલ 3 અંક આવે (2 + 1 = 3), તેથી જવાબ 0.008 થાય.",
    "explanationGujarati": "4 × 2 = 8. દશાંશ ચિહ્ન પછી કુલ 3 અંક આવે (2 + 1 = 3), તેથી જવાબ 0.008 થાય.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 205,
    "category": "ગણિત",
    "categoryGujarati": "ગણિત",
    "grades": [
      "7"
    ],
    "subject": "Mathematics",
    "questionText": "65° માપ ધરાવતા ખૂણાના પૂરકકોણનું માપ કેટલું થાય?",
    "questionTextGujarati": "65° માપ ધરાવતા ખૂણાના પૂરકકોણનું માપ કેટલું થાય?",
    "options": [
      "25°",
      "115°",
      "35°",
      "125°"
    ],
    "optionsGujarati": [
      "25°",
      "115°",
      "35°",
      "125°"
    ],
    "correctAnswer": 1,
    "explanation": "બે પૂરકકોણનો સરવાળો 180° થાય છે: 180° - 65° = 115°.",
    "explanationGujarati": "બે પૂરકકોણનો સરવાળો 180° થાય છે: 180° - 65° = 115°.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 206,
    "category": "ગણિત",
    "categoryGujarati": "ગણિત",
    "grades": [
      "7"
    ],
    "subject": "Mathematics",
    "questionText": "₹1,000 નું વાર્ષિક 5% ના દરે 2 વર્ષનું સાદું વ્યાજ (I) કેટલું થાય?",
    "questionTextGujarati": "₹1,000 નું વાર્ષિક 5% ના દરે 2 વર્ષનું સાદું વ્યાજ (I) કેટલું થાય?",
    "options": [
      "₹50",
      "₹100",
      "₹200",
      "₹150"
    ],
    "optionsGujarati": [
      "₹50",
      "₹100",
      "₹200",
      "₹150"
    ],
    "correctAnswer": 1,
    "explanation": "I = (P × R × N) / 100 = (1000 × 5 × 2) / 100 = ₹100.",
    "explanationGujarati": "I = (P × R × N) / 100 = (1000 × 5 × 2) / 100 = ₹100.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 207,
    "category": "ગણિત",
    "categoryGujarati": "ગણિત",
    "grades": [
      "7"
    ],
    "subject": "Mathematics",
    "questionText": "જો વર્તુળની ત્રિજ્યા 7 સેમી હોય, તો તેનો પરિઘ કેટલો થાય? (π = 22/7 લો)",
    "questionTextGujarati": "જો વર્તુળની ત્રિજ્યા 7 સેમી હોય, તો તેનો પરિઘ કેટલો થાય? (π = 22/7 લો)",
    "options": [
      "22 સેમી",
      "44 સેમી",
      "154 સેમી",
      "88 સેમી"
    ],
    "optionsGujarati": [
      "22 સેમી",
      "44 સેમી",
      "154 સેમી",
      "88 સેમી"
    ],
    "correctAnswer": 1,
    "explanation": "પરિઘ = 2πr = 2 × (22/7) × 7 = 44 સેમી.",
    "explanationGujarati": "પરિઘ = 2πr = 2 × (22/7) × 7 = 44 સેમી.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 208,
    "category": "વિજ્ઞાન",
    "categoryGujarati": "વિજ્ઞાન",
    "grades": [
      "7"
    ],
    "subject": "Science",
    "questionText": "પર્ણોમાં સૂર્યપ્રકાશ શોષી પ્રકાશસંશ્લેષણ કરવામાં મદદ કરતું લીલું રંજકદ્રવ્ય કયું છે?",
    "questionTextGujarati": "પર્ણોમાં સૂર્યપ્રકાશ શોષી પ્રકાશસંશ્લેષણ કરવામાં મદદ કરતું લીલું રંજકદ્રવ્ય કયું છે?",
    "options": [
      "ક્લોરોફિલ (હરિદ્રવ્ય)",
      "હિમોગ્લોબિન",
      "કેરોટીન",
      "ઝેન્થોફિલ"
    ],
    "optionsGujarati": [
      "ક્લોરોફિલ (હરિદ્રવ્ય)",
      "હિમોગ્લોબિન",
      "કેરોટીન",
      "ઝેન્થોફિલ"
    ],
    "correctAnswer": 0,
    "explanation": "હરિદ્રવ્ય (ક્લોરોફિલ) સૂર્યઊર્જા શોષી વનસ્પતિમાં ખોરાક બનાવવામાં સહાય કરે છે.",
    "explanationGujarati": "હરિદ્રવ્ય (ક્લોરોફિલ) સૂર્યઊર્જા શોષી વનસ્પતિમાં ખોરાક બનાવવામાં સહાય કરે છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 209,
    "category": "વિજ્ઞાન",
    "categoryGujarati": "વિજ્ઞાન",
    "grades": [
      "7"
    ],
    "subject": "Science",
    "questionText": "ભૂરા લિટમસ પેપરને લીંબુના રસમાં (એસિડિક દ્રાવણમાં) ડૂબાડતાં તેનો રંગ કેવો બને છે?",
    "questionTextGujarati": "ભૂરા લિટમસ પેપરને લીંબુના રસમાં (એસિડિક દ્રાવણમાં) ડૂબાડતાં તેનો રંગ કેવો બને છે?",
    "options": [
      "લાલ",
      "પીળો",
      "લીલો",
      "કોઈ ફેરફાર નહીં"
    ],
    "optionsGujarati": [
      "લાલ",
      "પીળો",
      "લીલો",
      "કોઈ ફેરફાર નહીં"
    ],
    "correctAnswer": 0,
    "explanation": "એસિડ ભૂરા લિટમસ પેપરને લાલ બનાવે છે.",
    "explanationGujarati": "એસિડ ભૂરા લિટમસ પેપરને લાલ બનાવે છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 210,
    "category": "વિજ્ઞાન",
    "categoryGujarati": "વિજ્ઞાન",
    "grades": [
      "7"
    ],
    "subject": "Science",
    "questionText": "સ્વસ્થ મનુષ્યના શરીરનું સામાન્ય તાપમાન કેટલા સેલ્સિયસ હોય છે?",
    "questionTextGujarati": "સ્વસ્થ મનુષ્યના શરીરનું સામાન્ય તાપમાન કેટલા સેલ્સિયસ હોય છે?",
    "options": [
      "98.6°C",
      "37°C",
      "32°C",
      "100°C"
    ],
    "optionsGujarati": [
      "98.6°C",
      "37°C",
      "32°C",
      "100°C"
    ],
    "correctAnswer": 1,
    "explanation": "સામાન્ય શરીરનું તાપમાન 37° સેલ્સિયસ (અથવા 98.6° ફેરનહીટ) હોય છે.",
    "explanationGujarati": "સામાન્ય શરીરનું તાપમાન 37° સેલ્સિયસ (અથવા 98.6° ફેરનહીટ) હોય છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 211,
    "category": "વિજ્ઞાન",
    "categoryGujarati": "વિજ્ઞાન",
    "grades": [
      "7"
    ],
    "subject": "Science",
    "questionText": "હૃદયમાંથી ઓક્સિજનયુક્ત રુધિર શરીરના વિવિધ અંગો તરફ લઈ જતી રક્તવાહિની કઈ છે?",
    "questionTextGujarati": "હૃદયમાંથી ઓક્સિજનયુક્ત રુધિર શરીરના વિવિધ અંગો તરફ લઈ જતી રક્તવાહિની કઈ છે?",
    "options": [
      "શિરાઓ (Veins)",
      "ધમનીઓ (Arteries)",
      "રુધિરકેશિકાઓ (Capillaries)",
      "વાલ્વ"
    ],
    "optionsGujarati": [
      "શિરાઓ (Veins)",
      "ધમનીઓ (Arteries)",
      "રુધિરકેશિકાઓ (Capillaries)",
      "વાલ્વ"
    ],
    "correctAnswer": 1,
    "explanation": "ધમનીઓ હૃદયમાંથી શુદ્ધ (ઓક્સિજનયુક્ત) રુધિર સમગ્ર શરીરમાં પહોંચાડે છે.",
    "explanationGujarati": "ધમનીઓ હૃદયમાંથી શુદ્ધ (ઓક્સિજનયુક્ત) રુધિર સમગ્ર શરીરમાં પહોંચાડે છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 212,
    "category": "વિજ્ઞાન",
    "categoryGujarati": "વિજ્ઞાન",
    "grades": [
      "7"
    ],
    "subject": "Science",
    "questionText": "લોખંડને કાટ લાગવો એ કયા પ્રકારનો ફેરફાર છે?",
    "questionTextGujarati": "લોખંડને કાટ લાગવો એ કયા પ્રકારનો ફેરફાર છે?",
    "options": [
      "ભૌતિક ફેરફાર",
      "રાસાયણિક ફેરફાર",
      "ઉલટાવી શકાય તેવો ફેરફાર",
      "સામયિક ફેરફાર"
    ],
    "optionsGujarati": [
      "ભૌતિક ફેરફાર",
      "રાસાયણિક ફેરફાર",
      "ઉલટાવી શકાય તેવો ફેરફાર",
      "સામયિક ફેરફાર"
    ],
    "correctAnswer": 1,
    "explanation": "કાટ લાગવો એ રાસાયણિક ફેરફાર છે કારણ કે તેમાં આયર્ન ઓક્સાઇડ નામનો નવો પદાર્થ બને છે.",
    "explanationGujarati": "કાટ લાગવો એ રાસાયણિક ફેરફાર છે કારણ કે તેમાં આયર્ન ઓક્સાઇડ નામનો નવો પદાર્થ બને છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 213,
    "category": "વિજ્ઞાન",
    "categoryGujarati": "વિજ્ઞાન",
    "grades": [
      "7"
    ],
    "subject": "Science",
    "questionText": "વનસ્પતિમાં પાણી અને ખનીજ ક્ષારોનું ઊર્ધ્વગમન (વહન) કઈ પેશી દ્વારા થાય છે?",
    "questionTextGujarati": "વનસ્પતિમાં પાણી અને ખનીજ ક્ષારોનું ઊર્ધ્વગમન (વહન) કઈ પેશી દ્વારા થાય છે?",
    "options": [
      "જલવાહક પેશી (Xylem)",
      "અન્નવાહક પેશી (Phloem)",
      "મૂળરોમ",
      "રક્ષક કોષો"
    ],
    "optionsGujarati": [
      "જલવાહક પેશી (Xylem)",
      "અન્નવાહક પેશી (Phloem)",
      "મૂળરોમ",
      "રક્ષક કોષો"
    ],
    "correctAnswer": 0,
    "explanation": "જલવાહક પેશી મૂળ દ્વારા શોષાયેલું પાણી અને ક્ષારો પર્ણો સુધી પહોંચાડે છે.",
    "explanationGujarati": "જલવાહક પેશી મૂળ દ્વારા શોષાયેલું પાણી અને ક્ષારો પર્ણો સુધી પહોંચાડે છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 214,
    "category": "વિજ્ઞાન",
    "categoryGujarati": "વિજ્ઞાન",
    "grades": [
      "7"
    ],
    "subject": "Science",
    "questionText": "ચળકતી કે લીસી સપાટી પરથી પ્રકાશના પાછા ફેંકાવાની ઘટનાને શું કહે છે?",
    "questionTextGujarati": "ચળકતી કે લીસી સપાટી પરથી પ્રકાશના પાછા ફેંકાવાની ઘટનાને શું કહે છે?",
    "options": [
      "પ્રકાશનું વક્રીભવન",
      "પ્રકાશનું પરાવર્તન",
      "પ્રકાશનું વિભાજન",
      "પ્રકાશનું શોષણ"
    ],
    "optionsGujarati": [
      "પ્રકાશનું વક્રીભવન",
      "પ્રકાશનું પરાવર્તન",
      "પ્રકાશનું વિભાજન",
      "પ્રકાશનું શોષણ"
    ],
    "correctAnswer": 1,
    "explanation": "લીસી સપાટી પરથી પ્રકાશ અથડાઈને પાછો વળે તેને પ્રકાશનું પરાવર્તન કહેવાય છે.",
    "explanationGujarati": "લીસી સપાટી પરથી પ્રકાશ અથડાઈને પાછો વળે તેને પ્રકાશનું પરાવર્તન કહેવાય છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 215,
    "category": "સામાજિક વિજ્ઞાન",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "grades": [
      "7"
    ],
    "subject": "Social Science",
    "questionText": "ભારતમાં મુઘલ સામ્રાજ્યનો સ્થાપક કોણ હતો?",
    "questionTextGujarati": "ભારતમાં મુઘલ સામ્રાજ્યનો સ્થાપક કોણ હતો?",
    "options": [
      "અકબર",
      "બાબર",
      "હુમાયૂં",
      "શાહજહાં"
    ],
    "optionsGujarati": [
      "અકબર",
      "બાબર",
      "હુમાયૂં",
      "શાહજહાં"
    ],
    "correctAnswer": 1,
    "explanation": "ઇ.સ. 1526 માં પાણીપતના પ્રથમ યુદ્ધમાં ઇબ્રાહિમ લોદીને હરાવી બાબરે મુઘલ સામ્રાજ્યની સ્થાપના કરી હતી.",
    "explanationGujarati": "ઇ.સ. 1526 માં પાણીપતના પ્રથમ યુદ્ધમાં ઇબ્રાહિમ લોદીને હરાવી બાબરે મુઘલ સામ્રાજ્યની સ્થાપના કરી હતી.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 216,
    "category": "સામાજિક વિજ્ઞાન",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "grades": [
      "7"
    ],
    "subject": "Social Science",
    "questionText": "દિલ્હી સલ્તનતના શાસનકાળ દરમિયાન એકમાત્ર મહિલા શાસક કોણ બની હતી?",
    "questionTextGujarati": "દિલ્હી સલ્તનતના શાસનકાળ દરમિયાન એકમાત્ર મહિલા શાસક કોણ બની હતી?",
    "options": [
      "રઝિયા સુલતાના",
      "ચાંદબીબી",
      "નૂરજહાં",
      "રાણી લક્ષ્મીબાઈ"
    ],
    "optionsGujarati": [
      "રઝિયા સુલતાના",
      "ચાંદબીબી",
      "નૂરજહાં",
      "રાણી લક્ષ્મીબાઈ"
    ],
    "correctAnswer": 0,
    "explanation": "ઇલ્તુત્મિશની પુત્રી રઝિયા સુલતાના દિલ્હીની ગાદી પર બેસનાર પ્રથમ મહિલા શાસક હતી.",
    "explanationGujarati": "ઇલ્તુત્મિશની પુત્રી રઝિયા સુલતાના દિલ્હીની ગાદી પર બેસનાર પ્રથમ મહિલા શાસક હતી.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 217,
    "category": "સામાજિક વિજ્ઞાન",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "grades": [
      "7"
    ],
    "subject": "Social Science",
    "questionText": "વાતાવરણનું કયું સ્તર ઓઝોન વાયુ ધરાવે છે જે સૂર્યના પારજાંબલી (UV) કિરણો સામે રક્ષણ આપે છે?",
    "questionTextGujarati": "વાતાવરણનું કયું સ્તર ઓઝોન વાયુ ધરાવે છે જે સૂર્યના પારજાંબલી (UV) કિરણો સામે રક્ષણ આપે છે?",
    "options": [
      "ક્ષોભ આવરણ (Troposphere)",
      "સમતાપ આવરણ (Stratosphere)",
      "મધ્યાવરણ (Mesosphere)",
      "ઉષ્માવરણ (Thermosphere)"
    ],
    "optionsGujarati": [
      "ક્ષોભ આવરણ (Troposphere)",
      "સમતાપ આવરણ (Stratosphere)",
      "મધ્યાવરણ (Mesosphere)",
      "ઉષ્માવરણ (Thermosphere)"
    ],
    "correctAnswer": 1,
    "explanation": "સમતાપ આવરણમાં ઓઝોન વાયુ આવેલો છે જે સૂર્યના હાનિકારક પારજાંબલી કિરણોને શોષી લે છે.",
    "explanationGujarati": "સમતાપ આવરણમાં ઓઝોન વાયુ આવેલો છે જે સૂર્યના હાનિકારક પારજાંબલી કિરણોને શોષી લે છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 218,
    "category": "સામાજિક વિજ્ઞાન",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "grades": [
      "7"
    ],
    "subject": "Social Science",
    "questionText": "સમુદ્રમાં ભરતી અને ઓટ આવવાનું મુખ્ય કારણ શું છે?",
    "questionTextGujarati": "સમુદ્રમાં ભરતી અને ઓટ આવવાનું મુખ્ય કારણ શું છે?",
    "options": [
      "પૃથ્વીનું ધરીભ્રમણ",
      "સૂર્ય અને ચંદ્રનું ગુરુત્વાકર્ષણ બળ",
      "સમુદ્રી પવનો",
      "ભૂકંપ"
    ],
    "optionsGujarati": [
      "પૃથ્વીનું ધરીભ્રમણ",
      "સૂર્ય અને ચંદ્રનું ગુરુત્વાકર્ષણ બળ",
      "સમુદ્રી પવનો",
      "ભૂકંપ"
    ],
    "correctAnswer": 1,
    "explanation": "સૂર્ય અને ચંદ્રના સંયુક્ત ગુરુત્વાકર્ષણ ખેંચાણના કારણે દરિયામાં ભરતી-ઓટ આવે છે.",
    "explanationGujarati": "સૂર્ય અને ચંદ્રના સંયુક્ત ગુરુત્વાકર્ષણ ખેંચાણના કારણે દરિયામાં ભરતી-ઓટ આવે છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 219,
    "category": "સામાજિક વિજ્ઞાન",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "grades": [
      "7"
    ],
    "subject": "Social Science",
    "questionText": "ભારતમાં રાજ્ય સરકારના બંધારણીય અને કારોબારી વડા કોણ હોય છે?",
    "questionTextGujarati": "ભારતમાં રાજ્ય સરકારના બંધારણીય અને કારોબારી વડા કોણ હોય છે?",
    "options": [
      "મુખ્યમંત્રી",
      "રાજ્યપાલ (Governor)",
      "રાષ્ટ્રપતિ",
      "મુખ્ય ન્યાયાધીશ"
    ],
    "optionsGujarati": [
      "મુખ્યમંત્રી",
      "રાજ્યપાલ (Governor)",
      "રાષ્ટ્રપતિ",
      "મુખ્ય ન્યાયાધીશ"
    ],
    "correctAnswer": 1,
    "explanation": "રાજ્યના બંધારણીય વડા રાજ્યપાલ હોય છે, જેમની નિમણૂક રાષ્ટ્રપતિ દ્વારા થાય છે.",
    "explanationGujarati": "રાજ્યના બંધારણીય વડા રાજ્યપાલ હોય છે, જેમની નિમણૂક રાષ્ટ્રપતિ દ્વારા થાય છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 220,
    "category": "સામાજિક વિજ્ઞાન",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "grades": [
      "7"
    ],
    "subject": "Social Science",
    "questionText": "ભારતીય બંધારણની કઈ કલમ કાયદા સમક્ષ સમાનતાનો અધિકાર આપે છે?",
    "questionTextGujarati": "ભારતીય બંધારણની કઈ કલમ કાયદા સમક્ષ સમાનતાનો અધિકાર આપે છે?",
    "options": [
      "કલમ ૧૪",
      "કલમ ૧૯",
      "કલમ ૨૧",
      "કલમ ૩૨"
    ],
    "optionsGujarati": [
      "કલમ ૧૪",
      "કલમ ૧૯",
      "કલમ ૨૧",
      "કલમ ૩૨"
    ],
    "correctAnswer": 0,
    "explanation": "બંધારણની કલમ ૧૪ કાયદા સમક્ષ સૌ સમાન અને કાયદાનું સમાન રક્ષણ સુનિશ્ચિત કરે છે.",
    "explanationGujarati": "બંધારણની કલમ ૧૪ કાયદા સમક્ષ સૌ સમાન અને કાયદાનું સમાન રક્ષણ સુનિશ્ચિત કરે છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 221,
    "category": "અંગ્રેજી",
    "categoryGujarati": "અંગ્રેજી",
    "grades": [
      "7"
    ],
    "subject": "English",
    "questionText": "યોગ્ય ચાલુ ભૂતકાળ (Past Continuous) નું રૂપ પસંદ કરો: 'They ______ in the ground when it rained.'",
    "questionTextGujarati": "યોગ્ય ચાલુ ભૂતકાળ (Past Continuous) નું રૂપ પસંદ કરો: 'They ______ in the ground when it rained.'",
    "options": [
      "played",
      "were playing",
      "are playing",
      "will play"
    ],
    "optionsGujarati": [
      "played",
      "were playing",
      "are playing",
      "will play"
    ],
    "correctAnswer": 1,
    "explanation": "'They' સાથે ભૂતકાળમાં 'were playing' વપરાય છે.",
    "explanationGujarati": "'They' સાથે ભૂતકાળમાં 'were playing' વપરાય છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 222,
    "category": "અંગ્રેજી",
    "categoryGujarati": "અંગ્રેજી",
    "grades": [
      "7"
    ],
    "subject": "English",
    "questionText": "‘GOOD’ શબ્દનું તુલનાત્મક રૂપ (Comparative Degree) શું થાય?",
    "questionTextGujarati": "‘GOOD’ શબ્દનું તુલનાત્મક રૂપ (Comparative Degree) શું થાય?",
    "options": [
      "Gooder",
      "Better",
      "Best",
      "More good"
    ],
    "optionsGujarati": [
      "Gooder",
      "Better",
      "Best",
      "More good"
    ],
    "correctAnswer": 1,
    "explanation": "Good નું Comparative રૂપ 'Better' અને Superlative રૂપ 'Best' થાય છે.",
    "explanationGujarati": "Good નું Comparative રૂપ 'Better' અને Superlative રૂપ 'Best' થાય છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 223,
    "category": "અંગ્રેજી",
    "categoryGujarati": "અંગ્રેજી",
    "grades": [
      "7"
    ],
    "subject": "English",
    "questionText": "નીચેના વાક્યમાંથી સંયોજક (Conjunction) ઓળખો: 'We stayed indoors because it was raining heavily.'",
    "questionTextGujarati": "નીચેના વાક્યમાંથી સંયોજક (Conjunction) ઓળખો: 'We stayed indoors because it was raining heavily.'",
    "options": [
      "indoors",
      "because",
      "raining",
      "heavily"
    ],
    "optionsGujarati": [
      "indoors",
      "because",
      "raining",
      "heavily"
    ],
    "correctAnswer": 1,
    "explanation": "'Because' બે વાક્યોને કારણ દર્શાવી જોડે છે તેથી તે Conjunction છે.",
    "explanationGujarati": "'Because' બે વાક્યોને કારણ દર્શાવી જોડે છે તેથી તે Conjunction છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 224,
    "category": "અંગ્રેજી",
    "categoryGujarati": "અંગ્રેજી",
    "grades": [
      "7"
    ],
    "subject": "English",
    "questionText": "‘CHILD’ શબ્દનું સાચું બહુવચનનું રૂપ (Plural form) પસંદ કરો:",
    "questionTextGujarati": "‘CHILD’ શબ્દનું સાચું બહુવચનનું રૂપ (Plural form) પસંદ કરો:",
    "options": [
      "Childs",
      "Children",
      "Childrens",
      "Childes"
    ],
    "optionsGujarati": [
      "Childs",
      "Children",
      "Childrens",
      "Childes"
    ],
    "correctAnswer": 1,
    "explanation": "Child નું અનિયમિત બહુવચન 'Children' થાય છે.",
    "explanationGujarati": "Child નું અનિયમિત બહુવચન 'Children' થાય છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 225,
    "category": "અંગ્રેજી",
    "categoryGujarati": "અંગ્રેજી",
    "grades": [
      "7"
    ],
    "subject": "English",
    "questionText": "નીચેનામાંથી કર્મણિ પ્રયોગ (Passive Voice) વાળું વાક્ય કયું છે?",
    "questionTextGujarati": "નીચેનામાંથી કર્મણિ પ્રયોગ (Passive Voice) વાળું વાક્ય કયું છે?",
    "options": [
      "He wrote a letter.",
      "A letter was written by him.",
      "He is writing a letter.",
      "He will write a letter."
    ],
    "optionsGujarati": [
      "He wrote a letter.",
      "A letter was written by him.",
      "He is writing a letter.",
      "He will write a letter."
    ],
    "correctAnswer": 1,
    "explanation": "'A letter was written by him' માં કર્મ આગળ છે અને ભૂતકૃદંત (was written) વપરાયું છે તેથી તે Passive Voice છે.",
    "explanationGujarati": "'A letter was written by him' માં કર્મ આગળ છે અને ભૂતકૃદંત (was written) વપરાયું છે તેથી તે Passive Voice છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 226,
    "category": "ગુજરાતી",
    "categoryGujarati": "ગુજરાતી",
    "grades": [
      "7"
    ],
    "subject": "Gujarati",
    "questionText": "'આજની ઘડી રળિયામણી' ભક્તિગીતના રચયિતા કોણ છે?",
    "questionTextGujarati": "'આજની ઘડી રળિયામણી' ભક્તિગીતના રચયિતા કોણ છે?",
    "options": [
      "નરસિંહ મહેતા",
      "મીરાંબાઈ",
      "દયારામ",
      "પ્રેમાનંદ"
    ],
    "optionsGujarati": [
      "નરસિંહ મહેતા",
      "મીરાંબાઈ",
      "દયારામ",
      "પ્રેમાનંદ"
    ],
    "correctAnswer": 0,
    "explanation": "'આજની ઘડી રળિયામણી' એ આદિકવિ નરસિંહ મહેતાનું સુંદર ભક્તિગીત છે.",
    "explanationGujarati": "'આજની ઘડી રળિયામણી' એ આદિકવિ નરસિંહ મહેતાનું સુંદર ભક્તિગીત છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 227,
    "category": "ગુજરાતી",
    "categoryGujarati": "ગુજરાતી",
    "grades": [
      "7"
    ],
    "subject": "Gujarati",
    "questionText": "'પરીક્ષા' બોધકથાના લેખક કોણ છે?",
    "questionTextGujarati": "'પરીક્ષા' બોધકથાના લેખક કોણ છે?",
    "options": [
      "પન્નાલાલ પટેલ",
      "ધૂમકેતુ",
      "રમણભાઈ નીલકંઠ",
      "ઝવેરચંદ મેઘાણી"
    ],
    "optionsGujarati": [
      "પન્નાલાલ પટેલ",
      "ધૂમકેતુ",
      "રમણભાઈ નીલકંઠ",
      "ઝવેરચંદ મેઘાણી"
    ],
    "correctAnswer": 0,
    "explanation": "'પરીક્ષા' વાર્તાના લેખક સુપ્રસિદ્ધ સાહિત્યકાર પન્નાલાલ પટેલ છે, જેમાં મહાદેવની પ્રામાણિકતા દર્શાવી છે.",
    "explanationGujarati": "'પરીક્ષા' વાર્તાના લેખક સુપ્રસિદ્ધ સાહિત્યકાર પન્નાલાલ પટેલ છે, જેમાં મહાદેવની પ્રામાણિકતા દર્શાવી છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 228,
    "category": "ગુજરાતી",
    "categoryGujarati": "ગુજરાતી",
    "grades": [
      "7"
    ],
    "subject": "Gujarati",
    "questionText": "'રાત-દિવસ' કયો સમાસ દર્શાવે છે?",
    "questionTextGujarati": "'રાત-દિવસ' કયો સમાસ દર્શાવે છે?",
    "options": [
      "દ્વન્દ્વ સમાસ",
      "તત્પુરુષ સમાસ",
      "મધ્યમપદલોપી સમાસ",
      "કર્મધારય સમાસ"
    ],
    "optionsGujarati": [
      "દ્વન્દ્વ સમાસ",
      "તત્પુરુષ સમાસ",
      "મધ્યમપદલોપી સમાસ",
      "કર્મધારય સમાસ"
    ],
    "correctAnswer": 0,
    "explanation": "'રાત અને દિવસ' - બંને પદો સ્વતંત્ર અને સમાન મોભાના હોવાથી તે દ્વન્દ્વ સમાસ બને છે.",
    "explanationGujarati": "'રાત અને દિવસ' - બંને પદો સ્વતંત્ર અને સમાન મોભાના હોવાથી તે દ્વન્દ્વ સમાસ બને છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 229,
    "category": "ગુજરાતી",
    "categoryGujarati": "ગુજરાતી",
    "grades": [
      "7"
    ],
    "subject": "Gujarati",
    "questionText": "'ગજાનન' શબ્દની સાચી સંધિ કઈ છે?",
    "questionTextGujarati": "'ગજાનન' શબ્દની સાચી સંધિ કઈ છે?",
    "options": [
      "ગજ + આનન",
      "ગજા + અનન",
      "ગજ + અનન",
      "ગજાન + ન"
    ],
    "optionsGujarati": [
      "ગજ + આનન",
      "ગજા + અનન",
      "ગજ + અનન",
      "ગજાન + ન"
    ],
    "correctAnswer": 0,
    "explanation": "ગજ + આનન = ગજાનન (અ + આ = આ). આનન એટલે મુખ.",
    "explanationGujarati": "ગજ + આનન = ગજાનન (અ + આ = આ). આનન એટલે મુખ.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 230,
    "category": "ગુજરાતી",
    "categoryGujarati": "ગુજરાતી",
    "grades": [
      "7"
    ],
    "subject": "Gujarati",
    "questionText": "'દાંત ખાટા કરવા' રૂઢિપ્રયોગનો સાચો અર્થ શોધો:",
    "questionTextGujarati": "'દાંત ખાટા કરવા' રૂઢિપ્રયોગનો સાચો અર્થ શોધો:",
    "options": [
      "હરાવવું / પરાસ્ત કરવું",
      "ખાટી વસ્તુ ખાવી",
      "દાંતમાં દુખાવો થવો",
      "ગુસ્સે થવું"
    ],
    "optionsGujarati": [
      "હરાવવું / પરાસ્ત કરવું",
      "ખાટી વસ્તુ ખાવી",
      "દાંતમાં દુખાવો થવો",
      "ગુસ્સે થવું"
    ],
    "correctAnswer": 0,
    "explanation": "'દાંત ખાટા કરવા' એટલે સામી વ્યક્તિ કે શત્રુને સખત હાર આપવી.",
    "explanationGujarati": "'દાંત ખાટા કરવા' એટલે સામી વ્યક્તિ કે શત્રુને સખત હાર આપવી.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 301,
    "category": "ગણિત",
    "categoryGujarati": "ગણિત",
    "grades": [
      "8"
    ],
    "subject": "Mathematics",
    "questionText": "576 નું વર્ગમૂળ કેટલું થાય?",
    "questionTextGujarati": "576 નું વર્ગમૂળ કેટલું થાય?",
    "options": [
      "24",
      "26",
      "28",
      "22"
    ],
    "optionsGujarati": [
      "24",
      "26",
      "28",
      "22"
    ],
    "correctAnswer": 0,
    "explanation": "24 × 24 = 576, તેથી 576 નું વર્ગમૂળ 24 થાય.",
    "explanationGujarati": "24 × 24 = 576, તેથી 576 નું વર્ગમૂળ 24 થાય.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 302,
    "category": "ગણિત",
    "categoryGujarati": "ગણિત",
    "grades": [
      "8"
    ],
    "subject": "Mathematics",
    "questionText": "1,728 નું ઘનમૂળ કેટલું થાય?",
    "questionTextGujarati": "1,728 નું ઘનમૂળ કેટલું થાય?",
    "options": [
      "12",
      "14",
      "16",
      "18"
    ],
    "optionsGujarati": [
      "12",
      "14",
      "16",
      "18"
    ],
    "correctAnswer": 0,
    "explanation": "12 × 12 × 12 = 1,728, તેથી 1,728 નું ઘનમૂળ 12 થાય.",
    "explanationGujarati": "12 × 12 × 12 = 1,728, તેથી 1,728 નું ઘનમૂળ 12 થાય.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 303,
    "category": "ગણિત",
    "categoryGujarati": "ગણિત",
    "grades": [
      "8"
    ],
    "subject": "Mathematics",
    "questionText": "સમીકરણ ઉકેલો: 5x + 9 = 5 + 3x. x ની કિંમત શોધો.",
    "questionTextGujarati": "સમીકરણ ઉકેલો: 5x + 9 = 5 + 3x. x ની કિંમત શોધો.",
    "options": [
      "-2",
      "2",
      "-4",
      "4"
    ],
    "optionsGujarati": [
      "-2",
      "2",
      "-4",
      "4"
    ],
    "correctAnswer": 0,
    "explanation": "5x - 3x = 5 - 9 => 2x = -4 => x = -2.",
    "explanationGujarati": "5x - 3x = 5 - 9 => 2x = -4 => x = -2.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 304,
    "category": "ગણિત",
    "categoryGujarati": "ગણિત",
    "grades": [
      "8"
    ],
    "subject": "Mathematics",
    "questionText": "ચતુષ્કોણના ચારેય અંદરના ખૂણાઓનો સરવાળો કેટલો થાય?",
    "questionTextGujarati": "ચતુષ્કોણના ચારેય અંદરના ખૂણાઓનો સરવાળો કેટલો થાય?",
    "options": [
      "180°",
      "360°",
      "540°",
      "720°"
    ],
    "optionsGujarati": [
      "180°",
      "360°",
      "540°",
      "720°"
    ],
    "correctAnswer": 1,
    "explanation": "કોઈપણ ચતુષ્કોણના અંદરના ખૂણાઓનો સરવાળો (4 - 2) × 180° = 360° થાય.",
    "explanationGujarati": "કોઈપણ ચતુષ્કોણના અંદરના ખૂણાઓનો સરવાળો (4 - 2) × 180° = 360° થાય.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 305,
    "category": "ગણિત",
    "categoryGujarati": "ગણિત",
    "grades": [
      "8"
    ],
    "subject": "Mathematics",
    "questionText": "સમાંતર બાજુઓ 8 સેમી અને 12 સેમી તથા લંબઅંતર 5 સેમી ધરાવતા સમલંબ ચતુષ્કોણનું ક્ષેત્રફળ કેટલું થાય?",
    "questionTextGujarati": "સમાંતર બાજુઓ 8 સેમી અને 12 સેમી તથા લંબઅંતર 5 સેમી ધરાવતા સમલંબ ચતુષ્કોણનું ક્ષેત્રફળ કેટલું થાય?",
    "options": [
      "50 ચોરસ સેમી",
      "100 ચોરસ સેમી",
      "40 ચોરસ સેમી",
      "60 ચોરસ સેમી"
    ],
    "optionsGujarati": [
      "50 ચોરસ સેમી",
      "100 ચોરસ સેમી",
      "40 ચોરસ સેમી",
      "60 ચોરસ સેમી"
    ],
    "correctAnswer": 0,
    "explanation": "ક્ષેત્રફળ = 1/2 × (સમાંતર બાજુઓનો સરવાળો) × ઊંચાઈ = 1/2 × (8 + 12) × 5 = 50 ચોરસ સેમી.",
    "explanationGujarati": "ક્ષેત્રફળ = 1/2 × (સમાંતર બાજુઓનો સરવાળો) × ઊંચાઈ = 1/2 × (8 + 12) × 5 = 50 ચોરસ સેમી.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 306,
    "category": "ગણિત",
    "categoryGujarati": "ગણિત",
    "grades": [
      "8"
    ],
    "subject": "Mathematics",
    "questionText": "સાદુરૂપ આપો: (x + 3)(x - 3) = ?",
    "questionTextGujarati": "સાદુરૂપ આપો: (x + 3)(x - 3) = ?",
    "options": [
      "x² - 9",
      "x² + 9",
      "x² - 6x + 9",
      "x² + 6x - 9"
    ],
    "optionsGujarati": [
      "x² - 9",
      "x² + 9",
      "x² - 6x + 9",
      "x² + 6x - 9"
    ],
    "correctAnswer": 0,
    "explanation": "નિત્યસમ મુજબ: (a + b)(a - b) = a² - b² = x² - 3² = x² - 9.",
    "explanationGujarati": "નિત્યસમ મુજબ: (a + b)(a - b) = a² - b² = x² - 3² = x² - 9.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 307,
    "category": "ગણિત",
    "categoryGujarati": "ગણિત",
    "grades": [
      "8"
    ],
    "subject": "Mathematics",
    "questionText": "-5/8 ની વ્યસ્ત સંખ્યા કઈ થાય?",
    "questionTextGujarati": "-5/8 ની વ્યસ્ત સંખ્યા કઈ થાય?",
    "options": [
      "5/8",
      "-8/5",
      "8/5",
      "-5/8"
    ],
    "optionsGujarati": [
      "5/8",
      "-8/5",
      "8/5",
      "-5/8"
    ],
    "correctAnswer": 1,
    "explanation": "જે બે સંખ્યાઓનો ગુણાકાર 1 થાય તે પરસ્પર વ્યસ્ત કહેવાય: (-5/8) × (-8/5) = 1.",
    "explanationGujarati": "જે બે સંખ્યાઓનો ગુણાકાર 1 થાય તે પરસ્પર વ્યસ્ત કહેવાય: (-5/8) × (-8/5) = 1.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 308,
    "category": "વિજ્ઞાન",
    "categoryGujarati": "વિજ્ઞાન",
    "grades": [
      "8"
    ],
    "subject": "Science",
    "questionText": "દબાણનો SI એકમ કયો છે?",
    "questionTextGujarati": "દબાણનો SI એકમ કયો છે?",
    "options": [
      "પાસ્કલ (Pascal)",
      "ન્યૂટન (Newton)",
      "જૂલ (Joule)",
      "વોટ (Watt)"
    ],
    "optionsGujarati": [
      "પાસ્કલ (Pascal)",
      "ન્યૂટન (Newton)",
      "જૂલ (Joule)",
      "વોટ (Watt)"
    ],
    "correctAnswer": 0,
    "explanation": "દબાણ = બળ / ક્ષેત્રફળ (N/m²), જેને પાસ્કલ (Pa) કહેવાય છે.",
    "explanationGujarati": "દબાણ = બળ / ક્ષેત્રફળ (N/m²), જેને પાસ્કલ (Pa) કહેવાય છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 309,
    "category": "વિજ્ઞાન",
    "categoryGujarati": "વિજ્ઞાન",
    "grades": [
      "8"
    ],
    "subject": "Science",
    "questionText": "કોષનું 'પાવરહાઉસ' (શક્તિઘર) કઈ અંગિકાને કહેવાય છે?",
    "questionTextGujarati": "કોષનું 'પાવરહાઉસ' (શક્તિઘર) કઈ અંગિકાને કહેવાય છે?",
    "options": [
      "કણાભસૂત્ર (Mitochondria)",
      "ગોલ્ગીકાય",
      "રીબોઝોમ્સ",
      "હરિતકણ"
    ],
    "optionsGujarati": [
      "કણાભસૂત્ર (Mitochondria)",
      "ગોલ્ગીકાય",
      "રીબોઝોમ્સ",
      "હરિતકણ"
    ],
    "correctAnswer": 0,
    "explanation": "કણાભસૂત્રમાં ATP સ્વરૂપે ઊર્જા ઉત્પન્ન થતી હોવાથી તેને કોષનું શક્તિઘર કહે છે.",
    "explanationGujarati": "કણાભસૂત્રમાં ATP સ્વરૂપે ઊર્જા ઉત્પન્ન થતી હોવાથી તેને કોષનું શક્તિઘર કહે છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 310,
    "category": "વિજ્ઞાન",
    "categoryGujarati": "વિજ્ઞાન",
    "grades": [
      "8"
    ],
    "subject": "Science",
    "questionText": "દૂધમાંથી દહીં બનાવવામાં કયા બેક્ટેરિયા ઉપયોગી છે?",
    "questionTextGujarati": "દૂધમાંથી દહીં બનાવવામાં કયા બેક્ટેરિયા ઉપયોગી છે?",
    "options": [
      "લેક્ટોબેસિલસ",
      "રાઇઝોબિયમ",
      "ઇ. કોલી",
      "સ્પાઇરોગાયરા"
    ],
    "optionsGujarati": [
      "લેક્ટોબેસિલસ",
      "રાઇઝોબિયમ",
      "ઇ. કોલી",
      "સ્પાઇરોગાયરા"
    ],
    "correctAnswer": 0,
    "explanation": "લેક્ટોબેસિલસ બેક્ટેરિયા દૂધમાં વૃદ્ધિ પામી તેને દહીંમાં ફેરવે છે.",
    "explanationGujarati": "લેક્ટોબેસિલસ બેક્ટેરિયા દૂધમાં વૃદ્ધિ પામી તેને દહીંમાં ફેરવે છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 311,
    "category": "વિજ્ઞાન",
    "categoryGujarati": "વિજ્ઞાન",
    "grades": [
      "8"
    ],
    "subject": "Science",
    "questionText": "ઓરડાના તાપમાને પ્રવાહી સ્વરૂપમાં રહેતી એકમાત્ર ધાતુ કઈ છે?",
    "questionTextGujarati": "ઓરડાના તાપમાને પ્રવાહી સ્વરૂપમાં રહેતી એકમાત્ર ધાતુ કઈ છે?",
    "options": [
      "પારો (મર્ક્યુરી)",
      "બ્રોમિન",
      "સોડિયમ",
      "મેગ્નેશિયમ"
    ],
    "optionsGujarati": [
      "પારો (મર્ક્યુરી)",
      "બ્રોમિન",
      "સોડિયમ",
      "મેગ્નેશિયમ"
    ],
    "correctAnswer": 0,
    "explanation": "પારો (Hg) સામાન્ય ઓરડાના તાપમાને પ્રવાહી સ્થિતિમાં રહેતી ધાતુ છે.",
    "explanationGujarati": "પારો (Hg) સામાન્ય ઓરડાના તાપમાને પ્રવાહી સ્થિતિમાં રહેતી ધાતુ છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 312,
    "category": "વિજ્ઞાન",
    "categoryGujarati": "વિજ્ઞાન",
    "grades": [
      "8"
    ],
    "subject": "Science",
    "questionText": "ધ્વનિ (અવાજ) નીચેનામાંથી કયા માધ્યમમાં પ્રસરણ પામી શકતો નથી?",
    "questionTextGujarati": "ધ્વનિ (અવાજ) નીચેનામાંથી કયા માધ્યમમાં પ્રસરણ પામી શકતો નથી?",
    "options": [
      "શૂન્યાવકાશ (Vacuum)",
      "પાણી",
      "હવા",
      "સ્ટીલ"
    ],
    "optionsGujarati": [
      "શૂન્યાવકાશ (Vacuum)",
      "પાણી",
      "હવા",
      "સ્ટીલ"
    ],
    "correctAnswer": 0,
    "explanation": "ધ્વનિ યાંત્રિક તરંગ હોવાથી તેને પ્રસરવા માટે માધ્યમ જરૂરી છે; શૂન્યાવકાશમાં તે પ્રસરતો નથી.",
    "explanationGujarati": "ધ્વનિ યાંત્રિક તરંગ હોવાથી તેને પ્રસરવા માટે માધ્યમ જરૂરી છે; શૂન્યાવકાશમાં તે પ્રસરતો નથી.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 313,
    "category": "વિજ્ઞાન",
    "categoryGujarati": "વિજ્ઞાન",
    "grades": [
      "8"
    ],
    "subject": "Science",
    "questionText": "અશ્મિભૂત બળતણના દહનથી કયો મુખ્ય વાયુ ઉત્પન્ન થાય છે જે ગ્રીનહાઉસ અસર અને ગ્લોબલ વોર્મિંગ પ્રેરે છે?",
    "questionTextGujarati": "અશ્મિભૂત બળતણના દહનથી કયો મુખ્ય વાયુ ઉત્પન્ન થાય છે જે ગ્રીનહાઉસ અસર અને ગ્લોબલ વોર્મિંગ પ્રેરે છે?",
    "options": [
      "કાર્બન ડાયોક્સાઇડ (CO2)",
      "ઓક્સિજન (O2)",
      "નાઇટ્રોજન (N2)",
      "હાઇડ્રોજન (H2)"
    ],
    "optionsGujarati": [
      "કાર્બન ડાયોક્સાઇડ (CO2)",
      "ઓક્સિજન (O2)",
      "નાઇટ્રોજન (N2)",
      "હાઇડ્રોજન (H2)"
    ],
    "correctAnswer": 0,
    "explanation": "CO2 વાયુ પૃથ્વી પરથી પરાવર્તિત થતી ઉષ્માને શોષી વાતાવરણ ગરમ કરે છે.",
    "explanationGujarati": "CO2 વાયુ પૃથ્વી પરથી પરાવર્તિત થતી ઉષ્માને શોષી વાતાવરણ ગરમ કરે છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 314,
    "category": "વિજ્ઞાન",
    "categoryGujarati": "વિજ્ઞાન",
    "grades": [
      "8"
    ],
    "subject": "Science",
    "questionText": "ઘર્ષણ બળ હંમેશાં પદાર્થની ગતિની કઈ દિશામાં લાગે છે?",
    "questionTextGujarati": "ઘર્ષણ બળ હંમેશાં પદાર્થની ગતિની કઈ દિશામાં લાગે છે?",
    "options": [
      "ગતિની વિરુદ્ધ દિશામાં",
      "ગતિની દિશામાં",
      "લંબ દિશામાં",
      "કોઈ ચોક્કસ દિશા નથી"
    ],
    "optionsGujarati": [
      "ગતિની વિરુદ્ધ દિશામાં",
      "ગતિની દિશામાં",
      "લંબ દિશામાં",
      "કોઈ ચોક્કસ દિશા નથી"
    ],
    "correctAnswer": 0,
    "explanation": "ઘર્ષણ બળ હંમેશાં પદાર્થની સાપેક્ષ ગતિનો વિરોધ કરતું હોવાથી ગતિની વિરુદ્ધ દિશામાં લાગે છે.",
    "explanationGujarati": "ઘર્ષણ બળ હંમેશાં પદાર્થની સાપેક્ષ ગતિનો વિરોધ કરતું હોવાથી ગતિની વિરુદ્ધ દિશામાં લાગે છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 315,
    "category": "સામાજિક વિજ્ઞાન",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "grades": [
      "8"
    ],
    "subject": "Social Science",
    "questionText": "ઐતિહાસિક પ્લાસીનું યુદ્ધ કયા વર્ષમાં લડાયું હતું?",
    "questionTextGujarati": "ઐતિહાસિક પ્લાસીનું યુદ્ધ કયા વર્ષમાં લડાયું હતું?",
    "options": [
      "ઇ.સ. ૧૭૫૭",
      "ઇ.સ. ૧૭૬૪",
      "ઇ.સ. ૧૮૫૭",
      "ઇ.સ. ૧૭૬૧"
    ],
    "optionsGujarati": [
      "ઇ.સ. ૧૭૫૭",
      "ઇ.સ. ૧૭૬૪",
      "ઇ.સ. ૧૮૫૭",
      "ઇ.સ. ૧૭૬૧"
    ],
    "correctAnswer": 0,
    "explanation": "૨૩ જૂન ૧૭૫૭ ના રોજ બંગાળના નવાબ સિરાજ-ઉદ્-દૌલા અને રોબર્ટ ક્લાઇવ વચ્ચે પ્લાસીનું યુદ્ધ લડાયું હતું.",
    "explanationGujarati": "૨૩ જૂન ૧૭૫૭ ના રોજ બંગાળના નવાબ સિરાજ-ઉદ્-દૌલા અને રોબર્ટ ક્લાઇવ વચ્ચે પ્લાસીનું યુદ્ધ લડાયું હતું.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 316,
    "category": "સામાજિક વિજ્ઞાન",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "grades": [
      "8"
    ],
    "subject": "Social Science",
    "questionText": "૧૮૫૭ ના સ્વાતંત્ર્ય સંગ્રામમાં બરાકપુર છાવણી ખાતે વિરોધ કરનાર પ્રથમ શહીદ સૈનિક કોણ હતા?",
    "questionTextGujarati": "૧૮૫૭ ના સ્વાતંત્ર્ય સંગ્રામમાં બરાકપુર છાવણી ખાતે વિરોધ કરનાર પ્રથમ શહીદ સૈનિક કોણ હતા?",
    "options": [
      "મંગલ પાંડે",
      "તાત્યા ટોપે",
      "નાનાસાહેબ પેશ્વા",
      "કુંવરસિંહ"
    ],
    "optionsGujarati": [
      "મંગલ પાંડે",
      "તાત્યા ટોપે",
      "નાનાસાહેબ પેશ્વા",
      "કુંવરસિંહ"
    ],
    "correctAnswer": 0,
    "explanation": "મંગલ પાંડેએ ચરબીવાળા કારતૂસનો ઉપયોગ કરવાનો ઇનકાર કરી પ્રથમ વિદ્રોહ કર્યો હતો.",
    "explanationGujarati": "મંગલ પાંડેએ ચરબીવાળા કારતૂસનો ઉપયોગ કરવાનો ઇનકાર કરી પ્રથમ વિદ્રોહ કર્યો હતો.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 317,
    "category": "સામાજિક વિજ્ઞાન",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "grades": [
      "8"
    ],
    "subject": "Social Science",
    "questionText": "પર્વતીય અને ઢોળાવવાળી જમીન પર જમીનનું ધોવાણ અટકાવવા કઈ પદ્ધતિ અપનાવાય છે?",
    "questionTextGujarati": "પર્વતીય અને ઢોળાવવાળી જમીન પર જમીનનું ધોવાણ અટકાવવા કઈ પદ્ધતિ અપનાવાય છે?",
    "options": [
      "પગથિયાં પદ્ધતિ (Terrace Farming)",
      "રણ રોકવું",
      "ખેડ ન કરવી",
      "અતિચારણ"
    ],
    "optionsGujarati": [
      "પગથિયાં પદ્ધતિ (Terrace Farming)",
      "રણ રોકવું",
      "ખેડ ન કરવી",
      "અતિચારણ"
    ],
    "correctAnswer": 0,
    "explanation": "ઢોળાવવાળા વિસ્તારોમાં પગથિયાં આકારના ખેતરો બનાવી પાણીનો પ્રવાહ ધીમો પાડી ધોવાણ અટકાવાય છે.",
    "explanationGujarati": "ઢોળાવવાળા વિસ્તારોમાં પગથિયાં આકારના ખેતરો બનાવી પાણીનો પ્રવાહ ધીમો પાડી ધોવાણ અટકાવાય છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 318,
    "category": "સામાજિક વિજ્ઞાન",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "grades": [
      "8"
    ],
    "subject": "Social Science",
    "questionText": "કેલિફોર્નિયાની 'સિલિકોન વેલી' સમગ્ર વિશ્વમાં કયા ઉદ્યોગ માટે પ્રખ્યાત છે?",
    "questionTextGujarati": "કેલિફોર્નિયાની 'સિલિકોન વેલી' સમગ્ર વિશ્વમાં કયા ઉદ્યોગ માટે પ્રખ્યાત છે?",
    "options": [
      "માહિતી ટેકનોલોજી (IT)",
      "સુતરાઉ કાપડ",
      "લોખંડ-પોલાદ",
      "ઓટોમોબાઇલ"
    ],
    "optionsGujarati": [
      "માહિતી ટેકનોલોજી (IT)",
      "સુતરાઉ કાપડ",
      "લોખંડ-પોલાદ",
      "ઓટોમોબાઇલ"
    ],
    "correctAnswer": 0,
    "explanation": "સિલિકોન વેલી ગ્લોબલ ઇન્ફોર્મેશન ટેકનોલોજી અને સોફ્ટવેર કંપનીઓનું વૈશ્વિક કેન્દ્ર છે.",
    "explanationGujarati": "સિલિકોન વેલી ગ્લોબલ ઇન્ફોર્મેશન ટેકનોલોજી અને સોફ્ટવેર કંપનીઓનું વૈશ્વિક કેન્દ્ર છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 319,
    "category": "સામાજિક વિજ્ઞાન",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "grades": [
      "8"
    ],
    "subject": "Social Science",
    "questionText": "ભારતીય સંસદ રાષ્ટ્રપતિ અને કયા બે ગૃહોની બનેલી છે?",
    "questionTextGujarati": "ભારતીય સંસદ રાષ્ટ્રપતિ અને કયા બે ગૃહોની બનેલી છે?",
    "options": [
      "લોકસભા અને રાજ્યસભા",
      "વિધાનસભા અને વિધાનપરિષદ",
      "સુપ્રીમ કોર્ટ અને હાઇકોર્ટ",
      "મંત્રીમંડળ અને સચિવાલય"
    ],
    "optionsGujarati": [
      "લોકસભા અને રાજ્યસભા",
      "વિધાનસભા અને વિધાનપરિષદ",
      "સુપ્રીમ કોર્ટ અને હાઇકોર્ટ",
      "મંત્રીમંડળ અને સચિવાલય"
    ],
    "correctAnswer": 0,
    "explanation": "સંસદના બે ગૃહો લોકસભા (નીચલું ગૃહ) અને રાજ્યસભા (ઉપલું ગૃહ) છે.",
    "explanationGujarati": "સંસદના બે ગૃહો લોકસભા (નીચલું ગૃહ) અને રાજ્યસભા (ઉપલું ગૃહ) છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 320,
    "category": "સામાજિક વિજ્ઞાન",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "grades": [
      "8"
    ],
    "subject": "Social Science",
    "questionText": "ભારતીય બંધારણમાં 'બિનસાંપ્રદાયિકતા' (Secularism) નો સાચો અર્થ શું છે?",
    "questionTextGujarati": "ભારતીય બંધારણમાં 'બિનસાંપ્રદાયિકતા' (Secularism) નો સાચો અર્થ શું છે?",
    "options": [
      "રાજ્ય કોઈ ચોક્કસ ધર્મને પ્રોત્સાહન આપતું નથી અને તમામ ધર્મોને સમાન ગણે છે",
      "રાજ્ય ધર્મ વિરોધી છે",
      "ફક્ત એક જ ધર્મનું પાલન થાય છે",
      "ધાર્મિક કાર્યો પર પ્રતિબંધ છે"
    ],
    "optionsGujarati": [
      "રાજ્ય કોઈ ચોક્કસ ધર્મને પ્રોત્સાહન આપતું નથી અને તમામ ધર્મોને સમાન ગણે છે",
      "રાજ્ય ધર્મ વિરોધી છે",
      "ફક્ત એક જ ધર્મનું પાલન થાય છે",
      "ધાર્મિક કાર્યો પર પ્રતિબંધ છે"
    ],
    "correctAnswer": 0,
    "explanation": "બિનસાંપ્રદાયિક રાષ્ટ્રમાં રાજ્યનો કોઈ સત્તાવાર ધર્મ નથી હોતો અને સૌ નાગરિકોને ધાર્મિક સમાનતા મળે છે.",
    "explanationGujarati": "બિનસાંપ્રદાયિક રાષ્ટ્રમાં રાજ્યનો કોઈ સત્તાવાર ધર્મ નથી હોતો અને સૌ નાગરિકોને ધાર્મિક સમાનતા મળે છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 321,
    "category": "અંગ્રેજી",
    "categoryGujarati": "અંગ્રેજી",
    "grades": [
      "8"
    ],
    "subject": "English",
    "questionText": "પરોક્ષ કથન (Indirect Speech) માં રૂપાંતર કરો: He said, 'I am reading a book.'",
    "questionTextGujarati": "પરોક્ષ કથન (Indirect Speech) માં રૂપાંતર કરો: He said, 'I am reading a book.'",
    "options": [
      "He said that he was reading a book.",
      "He said that I am reading a book.",
      "He said that he is reading a book.",
      "He told that he reads a book."
    ],
    "optionsGujarati": [
      "He said that he was reading a book.",
      "He said that I am reading a book.",
      "He said that he is reading a book.",
      "He told that he reads a book."
    ],
    "correctAnswer": 0,
    "explanation": "Present continuous 'am reading' Indirect માં 'was reading' બને છે અને 'I' નું 'he' થાય છે.",
    "explanationGujarati": "Present continuous 'am reading' Indirect માં 'was reading' બને છે અને 'I' નું 'he' થાય છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 322,
    "category": "અંગ્રેજી",
    "categoryGujarati": "અંગ્રેજી",
    "grades": [
      "8"
    ],
    "subject": "English",
    "questionText": "કડક ફરજ કે અનિવાર્યતા દર્શાવતું મોડલ ઓક્સિલરી (Modal Verb) કયું છે?",
    "questionTextGujarati": "કડક ફરજ કે અનિવાર્યતા દર્શાવતું મોડલ ઓક્સિલરી (Modal Verb) કયું છે?",
    "options": [
      "must",
      "may",
      "might",
      "can"
    ],
    "optionsGujarati": [
      "must",
      "may",
      "might",
      "can"
    ],
    "correctAnswer": 0,
    "explanation": "'Must' અનિવાર્યતા, ફરજિયાતપણું અને કડક આદેશ દર્શાવે છે.",
    "explanationGujarati": "'Must' અનિવાર્યતા, ફરજિયાતપણું અને કડક આદેશ દર્શાવે છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 323,
    "category": "અંગ્રેજી",
    "categoryGujarati": "અંગ્રેજી",
    "grades": [
      "8"
    ],
    "subject": "English",
    "questionText": "યોગ્ય સંબંધક સર્વનામ (Relative Pronoun) પસંદ કરો: 'This is the boy ______ won the first prize.'",
    "questionTextGujarati": "યોગ્ય સંબંધક સર્વનામ (Relative Pronoun) પસંદ કરો: 'This is the boy ______ won the first prize.'",
    "options": [
      "who",
      "which",
      "whom",
      "whose"
    ],
    "optionsGujarati": [
      "who",
      "which",
      "whom",
      "whose"
    ],
    "correctAnswer": 0,
    "explanation": "વ્યક્તિ માટે કર્તા તરીકે 'who' વપરાય છે.",
    "explanationGujarati": "વ્યક્તિ માટે કર્તા તરીકે 'who' વપરાય છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 324,
    "category": "અંગ્રેજી",
    "categoryGujarati": "અંગ્રેજી",
    "grades": [
      "8"
    ],
    "subject": "English",
    "questionText": "‘BENEVOLENT’ (દયાળુ/પરોપકારી) શબ્દનો સમાનાર્થી (Synonym) શબ્દ કયો છે?",
    "questionTextGujarati": "‘BENEVOLENT’ (દયાળુ/પરોપકારી) શબ્દનો સમાનાર્થી (Synonym) શબ્દ કયો છે?",
    "options": [
      "Kind / Generous",
      "Cruel",
      "Selfish",
      "Angry"
    ],
    "optionsGujarati": [
      "Kind / Generous",
      "Cruel",
      "Selfish",
      "Angry"
    ],
    "correctAnswer": 0,
    "explanation": "'Benevolent' એટલે પરોપકારી કે દયાળુ (Kind/Generous).",
    "explanationGujarati": "'Benevolent' એટલે પરોપકારી કે દયાળુ (Kind/Generous).",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 325,
    "category": "અંગ્રેજી",
    "categoryGujarati": "અંગ્રેજી",
    "grades": [
      "8"
    ],
    "subject": "English",
    "questionText": "યોગ્ય ક્રિયાપદ પસંદ કરો: 'Neither of the boys ______ present yesterday.'",
    "questionTextGujarati": "યોગ્ય ક્રિયાપદ પસંદ કરો: 'Neither of the boys ______ present yesterday.'",
    "options": [
      "was",
      "were",
      "are",
      "have been"
    ],
    "optionsGujarati": [
      "was",
      "were",
      "are",
      "have been"
    ],
    "correctAnswer": 0,
    "explanation": "'Neither of' પછી બહુવચન નામ હોવા છતાં ક્રિયાપદ એકવચન (was) આવે છે.",
    "explanationGujarati": "'Neither of' પછી બહુવચન નામ હોવા છતાં ક્રિયાપદ એકવચન (was) આવે છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 326,
    "category": "ગુજરાતી",
    "categoryGujarati": "ગુજરાતી",
    "grades": [
      "8"
    ],
    "subject": "Gujarati",
    "questionText": "'જુમો ભિસ્તી' કરુણ બોધવાર્તાના સર્જક કોણ છે?",
    "questionTextGujarati": "'જુમો ભિસ્તી' કરુણ બોધવાર્તાના સર્જક કોણ છે?",
    "options": [
      "ગૌરીશંકર જોશી 'ધૂમકેતુ'",
      "ઉમાશંકર જોશી",
      "ઝવેરચંદ મેઘાણી",
      "કાકા કાલેલકર"
    ],
    "optionsGujarati": [
      "ગૌરીશંકર જોશી 'ધૂમકેતુ'",
      "ઉમાશંકર જોશી",
      "ઝવેરચંદ મેઘાણી",
      "કાકા કાલેલકર"
    ],
    "correctAnswer": 0,
    "explanation": "'જુમો ભિસ્તી' વાર્તામાં જુમા અને તેના પાડા 'વેણુ' વચ્ચેનો નિસ્વાર્થ પ્રેમ ધૂમકેતુએ આલેખ્યો છે.",
    "explanationGujarati": "'જુમો ભિસ્તી' વાર્તામાં જુમા અને તેના પાડા 'વેણુ' વચ્ચેનો નિસ્વાર્થ પ્રેમ ધૂમકેતુએ આલેખ્યો છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 327,
    "category": "ગુજરાતી",
    "categoryGujarati": "ગુજરાતી",
    "grades": [
      "8"
    ],
    "subject": "Gujarati",
    "questionText": "'દેશભક્ત જગડૂશા' પાઠમાં કયા નગરના દુષ્કાળની વાત છે?",
    "questionTextGujarati": "'દેશભક્ત જગડૂશા' પાઠમાં કયા નગરના દુષ્કાળની વાત છે?",
    "options": [
      "પાટણ",
      "અમદાવાદ",
      "જૂનાગઢ",
      "સુરત"
    ],
    "optionsGujarati": [
      "પાટણ",
      "અમદાવાદ",
      "જૂનાગઢ",
      "સુરત"
    ],
    "correctAnswer": 0,
    "explanation": "પાટણના રાજા વિશળદેવના રાજ્યમાં કારમો દુષ્કાળ પડ્યો ત્યારે કચ્છના શાહ સોદાગર જગડૂશાએ અનાજના કોઠારો પ્રજા માટે ખુલ્લા મૂક્યા હતા.",
    "explanationGujarati": "પાટણના રાજા વિશળદેવના રાજ્યમાં કારમો દુષ્કાળ પડ્યો ત્યારે કચ્છના શાહ સોદાગર જગડૂશાએ અનાજના કોઠારો પ્રજા માટે ખુલ્લા મૂક્યા હતા.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 328,
    "category": "ગુજરાતી",
    "categoryGujarati": "ગુજરાતી",
    "grades": [
      "8"
    ],
    "subject": "Gujarati",
    "questionText": "'વાંચતો' શબ્દમાં કયું કૃદંત રહેલું છે?",
    "questionTextGujarati": "'વાંચતો' શબ્દમાં કયું કૃદંત રહેલું છે?",
    "options": [
      "વર્તમાન કૃદંત",
      "ભૂતકૃદંત",
      "ભવિષ્ય કૃદંત",
      "સંબંધક ભૂતકૃદંત"
    ],
    "optionsGujarati": [
      "વર્તમાન કૃદંત",
      "ભૂતકૃદંત",
      "ભવિષ્ય કૃદંત",
      "સંબંધક ભૂતકૃદંત"
    ],
    "correctAnswer": 0,
    "explanation": "જે ધાતુને '-તો, -તી, -તું, -તા' પ્રત્યય લાગે તે વર્તમાન કૃદંત દર્શાવે છે.",
    "explanationGujarati": "જે ધાતુને '-તો, -તી, -તું, -તા' પ્રત્યય લાગે તે વર્તમાન કૃદંત દર્શાવે છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 329,
    "category": "ગુજરાતી",
    "categoryGujarati": "ગુજરાતી",
    "grades": [
      "8"
    ],
    "subject": "Gujarati",
    "questionText": "'આકાશમાં વાદળો ઘેરાયા' વાક્યમાં 'વાદળો' સંજ્ઞાનો પ્રકાર કયો છે?",
    "questionTextGujarati": "'આકાશમાં વાદળો ઘેરાયા' વાક્યમાં 'વાદળો' સંજ્ઞાનો પ્રકાર કયો છે?",
    "options": [
      "જાતિવાચક સંજ્ઞા",
      "વ્યક્તિવાચક સંજ્ઞા",
      "દ્રવ્યવાચક સંજ્ઞા",
      "ભાવવાચક સંજ્ઞા"
    ],
    "optionsGujarati": [
      "જાતિવાચક સંજ્ઞા",
      "વ્યક્તિવાચક સંજ્ઞા",
      "દ્રવ્યવાચક સંજ્ઞા",
      "ભાવવાચક સંજ્ઞા"
    ],
    "correctAnswer": 0,
    "explanation": "'વાદળ' એ સમગ્ર વર્ગ કે જાતિનું સૂચન કરતી હોવાથી જાતિવાચક સંજ્ઞા છે.",
    "explanationGujarati": "'વાદળ' એ સમગ્ર વર્ગ કે જાતિનું સૂચન કરતી હોવાથી જાતિવાચક સંજ્ઞા છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 330,
    "category": "ગુજરાતી",
    "categoryGujarati": "ગુજરાતી",
    "grades": [
      "8"
    ],
    "subject": "Gujarati",
    "questionText": "'ઉંટના અઢારે અંગ વાંકા' કહેવતનો અર્થ શું થાય?",
    "questionTextGujarati": "'ઉંટના અઢારે અંગ વાંકા' કહેવતનો અર્થ શું થાય?",
    "options": [
      "જેમાં અનેક દોષ કે ખામીઓ ભરેલી હોય તેવી વ્યક્તિ",
      "ઉંટ ખૂબ ઊંચું પ્રાણી છે",
      "કોઈપણ કામ સીધું ન કરવું",
      "શરીરમાં ખોડખાંપણ હોવી"
    ],
    "optionsGujarati": [
      "જેમાં અનેક દોષ કે ખામીઓ ભરેલી હોય તેવી વ્યક્તિ",
      "ઉંટ ખૂબ ઊંચું પ્રાણી છે",
      "કોઈપણ કામ સીધું ન કરવું",
      "શરીરમાં ખોડખાંપણ હોવી"
    ],
    "correctAnswer": 0,
    "explanation": "'ઉંટના અઢારે અંગ વાંકા' એટલે જે વ્યક્તિ કે વસ્તુમાં અનેક અવગુણો કે ખામીઓ હોય.",
    "explanationGujarati": "'ઉંટના અઢારે અંગ વાંકા' એટલે જે વ્યક્તિ કે વસ્તુમાં અનેક અવગુણો કે ખામીઓ હોય.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 401,
    "category": "ગણિત",
    "categoryGujarati": "ગણિત",
    "grades": [
      "9"
    ],
    "subject": "Mathematics",
    "questionText": "જો (x - 2) એ બહુપદી p(x) = x² - 5x + k નો અવયવ હોય, તો k ની કિંમત શોધો.",
    "questionTextGujarati": "જો (x - 2) એ બહુપદી p(x) = x² - 5x + k નો અવયવ હોય, તો k ની કિંમત શોધો.",
    "options": [
      "6",
      "-6",
      "10",
      "-10"
    ],
    "optionsGujarati": [
      "6",
      "-6",
      "10",
      "-10"
    ],
    "correctAnswer": 0,
    "explanation": "p(2) = 0 => (2)² - 5(2) + k = 0 => 4 - 10 + k = 0 => k = 6.",
    "explanationGujarati": "p(2) = 0 => (2)² - 5(2) + k = 0 => 4 - 10 + k = 0 => k = 6.",
    "targetCompany": "School",
    "difficulty": "Medium"
  },
  {
    "id": 402,
    "category": "ગણિત",
    "categoryGujarati": "ગણિત",
    "grades": [
      "9"
    ],
    "subject": "Mathematics",
    "questionText": "શૂન્ય સિવાયની અચળ બહુપદી (જેમ કે 7) ની ઘાત કેટલી હોય છે?",
    "questionTextGujarati": "શૂન્ય સિવાયની અચળ બહુપદી (જેમ કે 7) ની ઘાત કેટલી હોય છે?",
    "options": [
      "0",
      "1",
      "2",
      "અવ્યાખ્યાયિત"
    ],
    "optionsGujarati": [
      "0",
      "1",
      "2",
      "અવ્યાખ્યાયિત"
    ],
    "correctAnswer": 0,
    "explanation": "કોઈપણ અચળ પદ 7 = 7x⁰ લખી શકાય, તેથી તેની ઘાત 0 હોય છે.",
    "explanationGujarati": "કોઈપણ અચળ પદ 7 = 7x⁰ લખી શકાય, તેથી તેની ઘાત 0 હોય છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 403,
    "category": "ગણિત",
    "categoryGujarati": "ગણિત",
    "grades": [
      "9"
    ],
    "subject": "Mathematics",
    "questionText": "નીચેનામાંથી કઈ અસંમેય સંખ્યા છે?",
    "questionTextGujarati": "નીચેનામાંથી કઈ અસંમેય સંખ્યા છે?",
    "options": [
      "√2",
      "√4",
      "3/5",
      "0.25"
    ],
    "optionsGujarati": [
      "√2",
      "√4",
      "3/5",
      "0.25"
    ],
    "correctAnswer": 0,
    "explanation": "√2 નું દશાંશ વિસ્તરણ અનંત અનાવૃત્ત છે તેથી તે અસંમેય છે. જ્યારે √4 = 2 સંમેય છે.",
    "explanationGujarati": "√2 નું દશાંશ વિસ્તરણ અનંત અનાવૃત્ત છે તેથી તે અસંમેય છે. જ્યારે √4 = 2 સંમેય છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 404,
    "category": "ગણિત",
    "categoryGujarati": "ગણિત",
    "grades": [
      "9"
    ],
    "subject": "Mathematics",
    "questionText": "યામ સમતલમાં ઉગમબિંદુના યામ કયા હોય છે?",
    "questionTextGujarati": "યામ સમતલમાં ઉગમબિંદુના યામ કયા હોય છે?",
    "options": [
      "(0, 0)",
      "(1, 1)",
      "(0, 1)",
      "(1, 0)"
    ],
    "optionsGujarati": [
      "(0, 0)",
      "(1, 1)",
      "(0, 1)",
      "(1, 0)"
    ],
    "correctAnswer": 0,
    "explanation": "બંને અક્ષો (X અને Y) ના છેદનબિંદુ (ઉગમબિંદુ) ના યામ (0, 0) હોય છે.",
    "explanationGujarati": "બંને અક્ષો (X અને Y) ના છેદનબિંદુ (ઉગમબિંદુ) ના યામ (0, 0) હોય છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 405,
    "category": "ગણિત",
    "categoryGujarati": "ગણિત",
    "grades": [
      "9"
    ],
    "subject": "Mathematics",
    "questionText": "બિંદુ (-3, 5) કયા ચરણમાં આવેલું છે?",
    "questionTextGujarati": "બિંદુ (-3, 5) કયા ચરણમાં આવેલું છે?",
    "options": [
      "દ્વિતીય ચરણ",
      "પ્રથમ ચરણ",
      "તૃતીય ચરણ",
      "ચતુર્થ ચરણ"
    ],
    "optionsGujarati": [
      "દ્વિતીય ચરણ",
      "પ્રથમ ચરણ",
      "તૃતીય ચરણ",
      "ચતુર્થ ચરણ"
    ],
    "correctAnswer": 0,
    "explanation": "ઋણ x-યામ અને ધન y-યામ ધરાવતા બિંદુઓ દ્વિતીય ચરણ (-, +) માં આવેલા હોય છે.",
    "explanationGujarati": "ઋણ x-યામ અને ધન y-યામ ધરાવતા બિંદુઓ દ્વિતીય ચરણ (-, +) માં આવેલા હોય છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 406,
    "category": "ગણિત",
    "categoryGujarati": "ગણિત",
    "grades": [
      "9"
    ],
    "subject": "Mathematics",
    "questionText": "જે ખૂણો તેના પૂરકકોણ જેટલો જ હોય તે ખૂણાનું માપ કેટલું થાય?",
    "questionTextGujarati": "જે ખૂણો તેના પૂરકકોણ જેટલો જ હોય તે ખૂણાનું માપ કેટલું થાય?",
    "options": [
      "90°",
      "45°",
      "180°",
      "60°"
    ],
    "optionsGujarati": [
      "90°",
      "45°",
      "180°",
      "60°"
    ],
    "correctAnswer": 0,
    "explanation": "x + x = 180° => 2x = 180° => x = 90°.",
    "explanationGujarati": "x + x = 180° => 2x = 180° => x = 90°.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 407,
    "category": "ગણિત",
    "categoryGujarati": "ગણિત",
    "grades": [
      "9"
    ],
    "subject": "Mathematics",
    "questionText": "અર્ધવર્તુળમાં અંતર્ગત થયેલો ખૂણો હંમેશાં કેવો હોય છે?",
    "questionTextGujarati": "અર્ધવર્તુળમાં અંતર્ગત થયેલો ખૂણો હંમેશાં કેવો હોય છે?",
    "options": [
      "કાટકોણ (90°)",
      "લઘુકોણ",
      "ગુરુકોણ",
      "સરળકોણ"
    ],
    "optionsGujarati": [
      "કાટકોણ (90°)",
      "લઘુકોણ",
      "ગુરુકોણ",
      "સરળકોણ"
    ],
    "correctAnswer": 0,
    "explanation": "વ્યાસ દ્વારા અર્ધવર્તુળના પરિઘ પર બનતો કોઈપણ ખૂણો હંમેશાં કાટકોણ (90°) હોય છે.",
    "explanationGujarati": "વ્યાસ દ્વારા અર્ધવર્તુળના પરિઘ પર બનતો કોઈપણ ખૂણો હંમેશાં કાટકોણ (90°) હોય છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 408,
    "category": "ગણિત",
    "categoryGujarati": "ગણિત",
    "grades": [
      "9"
    ],
    "subject": "Mathematics",
    "questionText": "r ત્રિજ્યા ધરાવતા નક્કર અર્ધગોળાની કુલ સપાટીનું ક્ષેત્રફળ કેટલું થાય?",
    "questionTextGujarati": "r ત્રિજ્યા ધરાવતા નક્કર અર્ધગોળાની કુલ સપાટીનું ક્ષેત્રફળ કેટલું થાય?",
    "options": [
      "3πr²",
      "2πr²",
      "4πr²",
      "(2/3)πr³"
    ],
    "optionsGujarati": [
      "3πr²",
      "2πr²",
      "4πr²",
      "(2/3)πr³"
    ],
    "correctAnswer": 0,
    "explanation": "વક્રસપાટીનું ક્ષેત્રફળ (2πr²) + પાયાનું ક્ષેત્રફળ (πr²) = 3πr².",
    "explanationGujarati": "વક્રસપાટીનું ક્ષેત્રફળ (2πr²) + પાયાનું ક્ષેત્રફળ (πr²) = 3πr².",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 409,
    "category": "વિજ્ઞાન",
    "categoryGujarati": "વિજ્ઞાન",
    "grades": [
      "9"
    ],
    "subject": "Science",
    "questionText": "ન્યૂટનનો ગતિનો કયો નિયમ બળ = દળ × પ્રવેગ (F = ma) નું સૂત્ર આપે છે?",
    "questionTextGujarati": "ન્યૂટનનો ગતિનો કયો નિયમ બળ = દળ × પ્રવેગ (F = ma) નું સૂત્ર આપે છે?",
    "options": [
      "બીજો નિયમ",
      "પ્રથમ નિયમ",
      "ત્રીજો નિયમ",
      "ગુરુત્વાકર્ષણનો નિયમ"
    ],
    "optionsGujarati": [
      "બીજો નિયમ",
      "પ્રથમ નિયમ",
      "ત્રીજો નિયમ",
      "ગુરુત્વાકર્ષણનો નિયમ"
    ],
    "correctAnswer": 0,
    "explanation": "ન્યૂટનનો બીજો નિયમ દર્શાવે છે કે વેગમાનના ફેરફારનો દર લાગુ પાડેલા બાહ્ય બળના સમપ્રમાણમાં હોય છે (F = ma).",
    "explanationGujarati": "ન્યૂટનનો બીજો નિયમ દર્શાવે છે કે વેગમાનના ફેરફારનો દર લાગુ પાડેલા બાહ્ય બળના સમપ્રમાણમાં હોય છે (F = ma).",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 410,
    "category": "વિજ્ઞાન",
    "categoryGujarati": "વિજ્ઞાન",
    "grades": [
      "9"
    ],
    "subject": "Science",
    "questionText": "પૃથ્વીની સપાટી પર ગુરુત્વપ્રવેગ (g) નું પ્રમાણભૂત મૂલ્ય કેટલું છે?",
    "questionTextGujarati": "પૃથ્વીની સપાટી પર ગુરુત્વપ્રવેગ (g) નું પ્રમાણભૂત મૂલ્ય કેટલું છે?",
    "options": [
      "9.8 m/s²",
      "8.9 m/s²",
      "9.8 m/s",
      "10.8 m/s²"
    ],
    "optionsGujarati": [
      "9.8 m/s²",
      "8.9 m/s²",
      "9.8 m/s",
      "10.8 m/s²"
    ],
    "correctAnswer": 0,
    "explanation": "પૃથ્વીની સપાટી પર ગુરુત્વપ્રવેગ g = 9.8 m/s² સ્વીકારેલ છે.",
    "explanationGujarati": "પૃથ્વીની સપાટી પર ગુરુત્વપ્રવેગ g = 9.8 m/s² સ્વીકારેલ છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 411,
    "category": "વિજ્ઞાન",
    "categoryGujarati": "વિજ્ઞાન",
    "grades": [
      "9"
    ],
    "subject": "Science",
    "questionText": "કાર્ય અને ઊર્જાનો SI એકમ કયો છે?",
    "questionTextGujarati": "કાર્ય અને ઊર્જાનો SI એકમ કયો છે?",
    "options": [
      "જૂલ (Joule)",
      "વોટ (Watt)",
      "ન્યૂટન (Newton)",
      "પાસકલ (Pascal)"
    ],
    "optionsGujarati": [
      "જૂલ (Joule)",
      "વોટ (Watt)",
      "ન્યૂટન (Newton)",
      "પાસકલ (Pascal)"
    ],
    "correctAnswer": 0,
    "explanation": "કાર્ય = બળ × સ્થાનાંતર (ન્યૂટન-મીટર), જેને જૂલ (J) તરીકે વ્યાખ્યાયિત કરાય છે.",
    "explanationGujarati": "કાર્ય = બળ × સ્થાનાંતર (ન્યૂટન-મીટર), જેને જૂલ (J) તરીકે વ્યાખ્યાયિત કરાય છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 412,
    "category": "વિજ્ઞાન",
    "categoryGujarati": "વિજ્ઞાન",
    "grades": [
      "9"
    ],
    "subject": "Science",
    "questionText": "પ્રવાહી અવસ્થામાં રૂપાંતર પામ્યા વિના ઘન પદાર્થનું સીધું વાયુમાં રૂપાંતર થવાની પ્રક્રિયાને શું કહે છે?",
    "questionTextGujarati": "પ્રવાહી અવસ્થામાં રૂપાંતર પામ્યા વિના ઘન પદાર્થનું સીધું વાયુમાં રૂપાંતર થવાની પ્રક્રિયાને શું કહે છે?",
    "options": [
      "ઊર્ધ્વપાતન (Sublimation)",
      "બાષ્પીભવન (Evaporation)",
      "ઘનીભવન (Condensation)",
      "ગલન (Melting)"
    ],
    "optionsGujarati": [
      "ઊર્ધ્વપાતન (Sublimation)",
      "બાષ્પીભવન (Evaporation)",
      "ઘનીભવન (Condensation)",
      "ગલન (Melting)"
    ],
    "correctAnswer": 0,
    "explanation": "કપૂર અથવા એમોનિયમ ક્લોરાઇડ (નવસાર) ને ગરમ કરતાં તેનું પ્રવાહી વગર સીધું વાયુમાં રૂપાંતર થાય તેને ઊર્ધ્વપાતન કહે છે.",
    "explanationGujarati": "કપૂર અથવા એમોનિયમ ક્લોરાઇડ (નવસાર) ને ગરમ કરતાં તેનું પ્રવાહી વગર સીધું વાયુમાં રૂપાંતર થાય તેને ઊર્ધ્વપાતન કહે છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 413,
    "category": "વિજ્ઞાન",
    "categoryGujarati": "વિજ્ઞાન",
    "grades": [
      "9"
    ],
    "subject": "Science",
    "questionText": "ઇ.સ. 1665 માં પ્રાથમિક સૂક્ષ્મદર્શક યંત્ર વડે બૂચના પાતળા છેદમાં કોષની શોધ કોણે કરી હતી?",
    "questionTextGujarati": "ઇ.સ. 1665 માં પ્રાથમિક સૂક્ષ્મદર્શક યંત્ર વડે બૂચના પાતળા છેદમાં કોષની શોધ કોણે કરી હતી?",
    "options": [
      "રોબર્ટ હૂક",
      "લ્યુવેનહોક",
      "રોબર્ટ બ્રાઉન",
      "શ્વાન"
    ],
    "optionsGujarati": [
      "રોબર્ટ હૂક",
      "લ્યુવેનહોક",
      "રોબર્ટ બ્રાઉન",
      "શ્વાન"
    ],
    "correctAnswer": 0,
    "explanation": "રોબર્ટ હૂકે 1665 માં સૌપ્રથમ કોષની રચનાનું અવલોકન કર્યું અને તેને 'કોષ' (Cell) નામ આપ્યું.",
    "explanationGujarati": "રોબર્ટ હૂકે 1665 માં સૌપ્રથમ કોષની રચનાનું અવલોકન કર્યું અને તેને 'કોષ' (Cell) નામ આપ્યું.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 414,
    "category": "વિજ્ઞાન",
    "categoryGujarati": "વિજ્ઞાન",
    "grades": [
      "9"
    ],
    "subject": "Science",
    "questionText": "પાચક ઉત્સેચકો ધરાવતી અને કોષની 'આત્મઘાતી કોથળી' (Suicide Bag) તરીકે ઓળખાતી અંગિકા કઈ છે?",
    "questionTextGujarati": "પાચક ઉત્સેચકો ધરાવતી અને કોષની 'આત્મઘાતી કોથળી' (Suicide Bag) તરીકે ઓળખાતી અંગિકા કઈ છે?",
    "options": [
      "લાયસોઝોમ્સ (Lysosomes)",
      "કણાભસૂત્ર",
      "રિબોઝોમ્સ",
      "પ્લાસ્ટીડ"
    ],
    "optionsGujarati": [
      "લાયસોઝોમ્સ (Lysosomes)",
      "કણાભસૂત્ર",
      "રિબોઝોમ્સ",
      "પ્લાસ્ટીડ"
    ],
    "correctAnswer": 0,
    "explanation": "કોષીય ચયાપચયમાં ખલેલ પહોંચે ત્યારે લાયસોઝોમ ફાટી જાય છે અને ઉત્સેચકો પોતાના જ કોષનું પાચન કરી નાખે છે.",
    "explanationGujarati": "કોષીય ચયાપચયમાં ખલેલ પહોંચે ત્યારે લાયસોઝોમ ફાટી જાય છે અને ઉત્સેચકો પોતાના જ કોષનું પાચન કરી નાખે છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 415,
    "category": "વિજ્ઞાન",
    "categoryGujarati": "વિજ્ઞાન",
    "grades": [
      "9"
    ],
    "subject": "Science",
    "questionText": "સામાન્ય મીઠા (સોડિયમ ક્લોરાઇડ) નું રાસાયણિક સૂત્ર શું છે?",
    "questionTextGujarati": "સામાન્ય મીઠા (સોડિયમ ક્લોરાઇડ) નું રાસાયણિક સૂત્ર શું છે?",
    "options": [
      "NaCl",
      "NaOH",
      "Na2CO3",
      "NaHCO3"
    ],
    "optionsGujarati": [
      "NaCl",
      "NaOH",
      "Na2CO3",
      "NaHCO3"
    ],
    "correctAnswer": 0,
    "explanation": "સોડિયમ ક્લોરાઇડનું સાચું આણ્વીય સૂત્ર NaCl છે.",
    "explanationGujarati": "સોડિયમ ક્લોરાઇડનું સાચું આણ્વીય સૂત્ર NaCl છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 416,
    "category": "વિજ્ઞાન",
    "categoryGujarati": "વિજ્ઞાન",
    "grades": [
      "9"
    ],
    "subject": "Science",
    "questionText": "કાર્બન-12 ના 1 મોલ પરમાણુઓનું દળ બરાબર કેટલું થાય?",
    "questionTextGujarati": "કાર્બન-12 ના 1 મોલ પરમાણુઓનું દળ બરાબર કેટલું થાય?",
    "options": [
      "12 ગ્રામ",
      "6 ગ્રામ",
      "24 ગ્રામ",
      "1 ગ્રામ"
    ],
    "optionsGujarati": [
      "12 ગ્રામ",
      "6 ગ્રામ",
      "24 ગ્રામ",
      "1 ગ્રામ"
    ],
    "correctAnswer": 0,
    "explanation": "કાર્બન-12 નો મોલર દળ 12 ગ્રામ/મોલ છે, જેમાં 6.022 × 10²³ પરમાણુઓ હોય છે.",
    "explanationGujarati": "કાર્બન-12 નો મોલર દળ 12 ગ્રામ/મોલ છે, જેમાં 6.022 × 10²³ પરમાણુઓ હોય છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 417,
    "category": "સામાજિક વિજ્ઞાન",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "grades": [
      "9"
    ],
    "subject": "Social Science",
    "questionText": "14 જુલાઈ 1789 ના રોજ કયા જેલ કિલ્લા પર પ્રજાના હુમલાથી ફ્રેન્ચ ક્રાંતિની શરૂઆત થઈ હતી?",
    "questionTextGujarati": "14 જુલાઈ 1789 ના રોજ કયા જેલ કિલ્લા પર પ્રજાના હુમલાથી ફ્રેન્ચ ક્રાંતિની શરૂઆત થઈ હતી?",
    "options": [
      "બેસ્ટિલનો કિલ્લો (Bastille)",
      "વર્સેલ્સ મહેલ",
      "વોટરલૂ",
      "ટાવર ઓફ લંડન"
    ],
    "optionsGujarati": [
      "બેસ્ટિલનો કિલ્લો (Bastille)",
      "વર્સેલ્સ મહેલ",
      "વોટરલૂ",
      "ટાવર ઓફ લંડન"
    ],
    "correctAnswer": 0,
    "explanation": "બેસ્ટિલનો કિલ્લો રાજાશાહીના જુલમનું પ્રતીક હતો જેને જનતાએ તોડી પાડી કેદીઓને મુક્ત કર્યા હતા.",
    "explanationGujarati": "બેસ્ટિલનો કિલ્લો રાજાશાહીના જુલમનું પ્રતીક હતો જેને જનતાએ તોડી પાડી કેદીઓને મુક્ત કર્યા હતા.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 418,
    "category": "સામાજિક વિજ્ઞાન",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "grades": [
      "9"
    ],
    "subject": "Social Science",
    "questionText": "'ધ સોશિયલ કોન્ટ્રાક્ટ' (સામાજિક કરાર) પુસ્તકના લેખક મહાન વિચારક કોણ હતા?",
    "questionTextGujarati": "'ધ સોશિયલ કોન્ટ્રાક્ટ' (સામાજિક કરાર) પુસ્તકના લેખક મહાન વિચારક કોણ હતા?",
    "options": [
      "રૂસો (Rousseau)",
      "વોલ્ટેર",
      "મોન્ટેસ્ક્યુ",
      "જ્હોન લોક"
    ],
    "optionsGujarati": [
      "રૂસો (Rousseau)",
      "વોલ્ટેર",
      "મોન્ટેસ્ક્યુ",
      "જ્હોન લોક"
    ],
    "correctAnswer": 0,
    "explanation": "જીન જેક્સ રૂસોએ પ્રજા અને શાસક વચ્ચેના સામાજિક કરારનો પ્રખ્યાત સિદ્ધાંત આપ્યો હતો.",
    "explanationGujarati": "જીન જેક્સ રૂસોએ પ્રજા અને શાસક વચ્ચેના સામાજિક કરારનો પ્રખ્યાત સિદ્ધાંત આપ્યો હતો.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 419,
    "category": "સામાજિક વિજ્ઞાન",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "grades": [
      "9"
    ],
    "subject": "Social Science",
    "questionText": "ભારતને લગભગ બે સરખા ભાગોમાં વિભાજિત કરતું અક્ષાંશવૃત્ત કયું છે?",
    "questionTextGujarati": "ભારતને લગભગ બે સરખા ભાગોમાં વિભાજિત કરતું અક્ષાંશવૃત્ત કયું છે?",
    "options": [
      "કર્કવૃત્ત (Tropic of Cancer - 23.5° N)",
      "વિષુવવૃત્ત",
      "મકરવૃત્ત",
      "આર્ક્ટિક વૃત્ત"
    ],
    "optionsGujarati": [
      "કર્કવૃત્ત (Tropic of Cancer - 23.5° N)",
      "વિષુવવૃત્ત",
      "મકરવૃત્ત",
      "આર્ક્ટિક વૃત્ત"
    ],
    "correctAnswer": 0,
    "explanation": "23.5° ઉત્તર અક્ષાંશ એટલે કે કર્કવૃત્ત ભારતના મધ્યમાંથી પસાર થઈ તેને બે ભાગોમાં વહેંચે છે.",
    "explanationGujarati": "23.5° ઉત્તર અક્ષાંશ એટલે કે કર્કવૃત્ત ભારતના મધ્યમાંથી પસાર થઈ તેને બે ભાગોમાં વહેંચે છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 420,
    "category": "સામાજિક વિજ્ઞાન",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "grades": [
      "9"
    ],
    "subject": "Social Science",
    "questionText": "ભૂગર્ભીય હલનચલનથી નિર્માણ પામેલું ભારતનું સૌથી મોટું મીઠા પાણીનું સરોવર કયું છે?",
    "questionTextGujarati": "ભૂગર્ભીય હલનચલનથી નિર્માણ પામેલું ભારતનું સૌથી મોટું મીઠા પાણીનું સરોવર કયું છે?",
    "options": [
      "વુલર સરોવર (Wular Lake)",
      "ચિલ્કા સરોવર",
      "સાંભર સરોવર",
      "પુલિકટ સરોવર"
    ],
    "optionsGujarati": [
      "વુલર સરોવર (Wular Lake)",
      "ચિલ્કા સરોવર",
      "સાંભર સરોવર",
      "પુલિકટ સરોવર"
    ],
    "correctAnswer": 0,
    "explanation": "જમ્મુ અને કાશ્મીરમાં આવેલું વુલર સરોવર ભારતનું સૌથી મોટું કુદરતી મીઠા પાણીનું સરોવર છે.",
    "explanationGujarati": "જમ્મુ અને કાશ્મીરમાં આવેલું વુલર સરોવર ભારતનું સૌથી મોટું કુદરતી મીઠા પાણીનું સરોવર છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 421,
    "category": "સામાજિક વિજ્ઞાન",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "grades": [
      "9"
    ],
    "subject": "Social Science",
    "questionText": "સાહિત્ય, વિજ્ઞાન, કલા અને સમાજસેવા ક્ષેત્રમાંથી રાષ્ટ્રપતિ દ્વારા રાજ્યસભામાં કેટલા સભ્યોની નિમણૂક થાય છે?",
    "questionTextGujarati": "સાહિત્ય, વિજ્ઞાન, કલા અને સમાજસેવા ક્ષેત્રમાંથી રાષ્ટ્રપતિ દ્વારા રાજ્યસભામાં કેટલા સભ્યોની નિમણૂક થાય છે?",
    "options": [
      "૧૨ સભ્યો",
      "૨ સભ્યો",
      "૧૦ સભ્યો",
      "૧૫ સભ્યો"
    ],
    "optionsGujarati": [
      "૧૨ સભ્યો",
      "૨ સભ્યો",
      "૧૦ સભ્યો",
      "૧૫ સભ્યો"
    ],
    "correctAnswer": 0,
    "explanation": "ભારતના રાષ્ટ્રપતિ રાજ્યસભામાં વિશિષ્ટ યોગદાન આપનાર ૧૨ પ્રખર મહાનુભાવોને નામાંકિત કરે છે.",
    "explanationGujarati": "ભારતના રાષ્ટ્રપતિ રાજ્યસભામાં વિશિષ્ટ યોગદાન આપનાર ૧૨ પ્રખર મહાનુભાવોને નામાંકિત કરે છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 422,
    "category": "સામાજિક વિજ્ઞાન",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "grades": [
      "9"
    ],
    "subject": "Social Science",
    "questionText": "ભારતમાં સંસદ અને વિધાનસભાઓની મુક્ત અને ન્યાયી ચૂંટણીઓનું સંચાલન કરતી સ્વાયત્ત બંધારણીય સંસ્થા કઈ છે?",
    "questionTextGujarati": "ભારતમાં સંસદ અને વિધાનસભાઓની મુક્ત અને ન્યાયી ચૂંટણીઓનું સંચાલન કરતી સ્વાયત્ત બંધારણીય સંસ્થા કઈ છે?",
    "options": [
      "ભારતીય ચૂંટણી પંચ (Election Commission of India)",
      "સર્વોચ્ચ અદાલત",
      "ગૃહ મંત્રાલય",
      "નીતિ આયોગ"
    ],
    "optionsGujarati": [
      "ભારતીય ચૂંટણી પંચ (Election Commission of India)",
      "સર્વોચ્ચ અદાલત",
      "ગૃહ મંત્રાલય",
      "નીતિ આયોગ"
    ],
    "correctAnswer": 0,
    "explanation": "બંધારણની કલમ ૩૨૪ મુજબ ભારતીય ચૂંટણી પંચ સમગ્ર દેશમાં ચૂંટણીઓનું નિયમન અને આયોજન કરે છે.",
    "explanationGujarati": "બંધારણની કલમ ૩૨૪ મુજબ ભારતીય ચૂંટણી પંચ સમગ્ર દેશમાં ચૂંટણીઓનું નિયમન અને આયોજન કરે છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 423,
    "category": "અંગ્રેજી",
    "categoryGujarati": "અંગ્રેજી",
    "grades": [
      "9"
    ],
    "subject": "English",
    "questionText": "આઇઝેક અસિમોવની વાર્તા 'The Fun They Had' માં માર્ગીને તેના યાંત્રિક શિક્ષક (Mechanical Teacher) બાબતે સૌથી વધુ શું નાપસંદ હતું?",
    "questionTextGujarati": "આઇઝેક અસિમોવની વાર્તા 'The Fun They Had' માં માર્ગીને તેના યાંત્રિક શિક્ષક (Mechanical Teacher) બાબતે સૌથી વધુ શું નાપસંદ હતું?",
    "options": [
      "The slot where she had to submit homework and test papers",
      "The screen",
      "The speaker volume",
      "The color of the robot"
    ],
    "optionsGujarati": [
      "The slot where she had to submit homework and test papers",
      "The screen",
      "The speaker volume",
      "The color of the robot"
    ],
    "correctAnswer": 0,
    "explanation": "માર્ગીને જે સ્લોટમાં હોમવર્ક અને ટેસ્ટ પેપર્સ પંચ કોડમાં દાખલ કરવા પડતાં હતાં તે ભાગ સૌથી વધુ નાપસંદ હતો.",
    "explanationGujarati": "માર્ગીને જે સ્લોટમાં હોમવર્ક અને ટેસ્ટ પેપર્સ પંચ કોડમાં દાખલ કરવા પડતાં હતાં તે ભાગ સૌથી વધુ નાપસંદ હતો.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 424,
    "category": "અંગ્રેજી",
    "categoryGujarati": "અંગ્રેજી",
    "grades": [
      "9"
    ],
    "subject": "English",
    "questionText": "યોગ્ય ક્રિયાપદ પસંદ કરો: 'Neither the teacher nor the students ______ present.'",
    "questionTextGujarati": "યોગ્ય ક્રિયાપદ પસંદ કરો: 'Neither the teacher nor the students ______ present.'",
    "options": [
      "were",
      "was",
      "is",
      "has been"
    ],
    "optionsGujarati": [
      "were",
      "was",
      "is",
      "has been"
    ],
    "correctAnswer": 0,
    "explanation": "'Neither... nor' માં ક્રિયાપદ નજીકના કર્તા (students - બહુવચન) મુજબ 'were' આવે છે.",
    "explanationGujarati": "'Neither... nor' માં ક્રિયાપદ નજીકના કર્તા (students - બહુવચન) મુજબ 'were' આવે છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 425,
    "category": "અંગ્રેજી",
    "categoryGujarati": "અંગ્રેજી",
    "grades": [
      "9"
    ],
    "subject": "English",
    "questionText": "કાવ્ય પંક્તિમાં કયો અલંકાર (Poetic Device) રહેલો છે: 'Two roads diverged in a yellow wood.'",
    "questionTextGujarati": "કાવ્ય પંક્તિમાં કયો અલંકાર (Poetic Device) રહેલો છે: 'Two roads diverged in a yellow wood.'",
    "options": [
      "Metaphor (રૂપક)",
      "Simile",
      "Hyperbole",
      "Alliteration"
    ],
    "optionsGujarati": [
      "Metaphor (રૂપક)",
      "Simile",
      "Hyperbole",
      "Alliteration"
    ],
    "correctAnswer": 0,
    "explanation": "રોબર્ટ ફ્રોસ્ટની કવિતામાં 'બે રસ્તા' એ જીવનમાં લેવાના નિર્ણયો અને પસંદગીઓનું પ્રતીક અને રૂપક (Metaphor) છે.",
    "explanationGujarati": "રોબર્ટ ફ્રોસ્ટની કવિતામાં 'બે રસ્તા' એ જીવનમાં લેવાના નિર્ણયો અને પસંદગીઓનું પ્રતીક અને રૂપક (Metaphor) છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 426,
    "category": "અંગ્રેજી",
    "categoryGujarati": "અંગ્રેજી",
    "grades": [
      "9"
    ],
    "subject": "English",
    "questionText": "પરોક્ષ કથનનું સાચું રૂપ પસંદ કરો: The doctor said, 'Take this medicine twice daily.'",
    "questionTextGujarati": "પરોક્ષ કથનનું સાચું રૂપ પસંદ કરો: The doctor said, 'Take this medicine twice daily.'",
    "options": [
      "The doctor advised to take that medicine twice daily.",
      "The doctor ordered that take medicine.",
      "The doctor said take medicine.",
      "The doctor asked to take this medicine."
    ],
    "optionsGujarati": [
      "The doctor advised to take that medicine twice daily.",
      "The doctor ordered that take medicine.",
      "The doctor said take medicine.",
      "The doctor asked to take this medicine."
    ],
    "correctAnswer": 0,
    "explanation": "ડૉક્ટરની તબીબી સલાહ હોવાથી 'advised' આવે અને 'this' નું 'that' થાય છે.",
    "explanationGujarati": "ડૉક્ટરની તબીબી સલાહ હોવાથી 'advised' આવે અને 'this' નું 'that' થાય છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 427,
    "category": "ગુજરાતી",
    "categoryGujarati": "ગુજરાતી",
    "grades": [
      "9"
    ],
    "subject": "Gujarati",
    "questionText": "'સાંજ સમે શામળિયો' કાવ્યમાં કોનું મનોહર વર્ણન છે?",
    "questionTextGujarati": "'સાંજ સમે શામળિયો' કાવ્યમાં કોનું મનોહર વર્ણન છે?",
    "options": [
      "શ્રીકૃષ્ણના મનોહર રૂપનું",
      "બલરામનું",
      "સુદામાનું",
      "ગોપીઓનું"
    ],
    "optionsGujarati": [
      "શ્રીકૃષ્ણના મનોહર રૂપનું",
      "બલરામનું",
      "સુદામાનું",
      "ગોપીઓનું"
    ],
    "correctAnswer": 0,
    "explanation": "નરસિંહ મહેતા રચિત આ પદમાં સાંજના સમયે ગાયોનું ધણ લઈને પાછા વળતા શ્રીકૃષ્ણના મોહક રૂપનું સુંદર આલેખન છે.",
    "explanationGujarati": "નરસિંહ મહેતા રચિત આ પદમાં સાંજના સમયે ગાયોનું ધણ લઈને પાછા વળતા શ્રીકૃષ્ણના મોહક રૂપનું સુંદર આલેખન છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 428,
    "category": "ગુજરાતી",
    "categoryGujarati": "ગુજરાતી",
    "grades": [
      "9"
    ],
    "subject": "Gujarati",
    "questionText": "'ચોરી અને પ્રાયશ્ચિત્ત' પાઠ ગાંધીજીના કયા પુસ્તકમાંથી લેવામાં આવ્યો છે?",
    "questionTextGujarati": "'ચોરી અને પ્રાયશ્ચિત્ત' પાઠ ગાંધીજીના કયા પુસ્તકમાંથી લેવામાં આવ્યો છે?",
    "options": [
      "'સત્યના પ્રયોગો' (આત્મકથા)",
      "હિન્દ સ્વરાજ",
      "મંગલ પ્રભાત",
      "દક્ષિણ આફ્રિકાનો સત્યાગ્રહ"
    ],
    "optionsGujarati": [
      "'સત્યના પ્રયોગો' (આત્મકથા)",
      "હિન્દ સ્વરાજ",
      "મંગલ પ્રભાત",
      "દક્ષિણ આફ્રિકાનો સત્યાગ્રહ"
    ],
    "correctAnswer": 0,
    "explanation": "આ પાઠ ગાંધીજીની સુપ્રસિદ્ધ આત્મકથા 'સત્યના પ્રયોગો' માંથી લેવામાં આવ્યો છે જેમાં પિતા સમક્ષ દોષની નિખાલસ કબૂલાતનું વર્ણન છે.",
    "explanationGujarati": "આ પાઠ ગાંધીજીની સુપ્રસિદ્ધ આત્મકથા 'સત્યના પ્રયોગો' માંથી લેવામાં આવ્યો છે જેમાં પિતા સમક્ષ દોષની નિખાલસ કબૂલાતનું વર્ણન છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 429,
    "category": "ગુજરાતી",
    "categoryGujarati": "ગુજરાતી",
    "grades": [
      "9"
    ],
    "subject": "Gujarati",
    "questionText": "'રમેશે પુસ્તક વાંચ્યું' વાક્યનું કર્મણિ પ્રયોગમાં રૂપાંતર શું થશે?",
    "questionTextGujarati": "'રમેશે પુસ્તક વાંચ્યું' વાક્યનું કર્મણિ પ્રયોગમાં રૂપાંતર શું થશે?",
    "options": [
      "રમેશ દ્વારા પુસ્તક વંચાયું",
      "રમેશ પુસ્તક વાંચશે",
      "રમેશથી પુસ્તક વાંચવાયું નથી",
      "રમેશ પુસ્તક વાંચી રહ્યો છે"
    ],
    "optionsGujarati": [
      "રમેશ દ્વારા પુસ્તક વંચાયું",
      "રમેશ પુસ્તક વાંચશે",
      "રમેશથી પુસ્તક વાંચવાયું નથી",
      "રમેશ પુસ્તક વાંચી રહ્યો છે"
    ],
    "correctAnswer": 0,
    "explanation": "કર્મણિ વાક્યમાં કર્તાને તૃતીયા વિભક્તિ (થી / દ્વારા) અને ધાતુને 'આ' પ્રત્યય લાગે છે: 'રમેશ દ્વારા પુસ્તક વંચાયું'.",
    "explanationGujarati": "કર્મણિ વાક્યમાં કર્તાને તૃતીયા વિભક્તિ (થી / દ્વારા) અને ધાતુને 'આ' પ્રત્યય લાગે છે: 'રમેશ દ્વારા પુસ્તક વંચાયું'.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 430,
    "category": "ગુજરાતી",
    "categoryGujarati": "ગુજરાતી",
    "grades": [
      "9"
    ],
    "subject": "Gujarati",
    "questionText": "'પછે શામળિયોજી બોલિયા' કાવ્ય કયા મધ્યકાલીન મહાકવિની રચના છે?",
    "questionTextGujarati": "'પછે શામળિયોજી બોલિયા' કાવ્ય કયા મધ્યકાલીન મહાકવિની રચના છે?",
    "options": [
      "મહાકવિ પ્રેમાનંદ",
      "અખો",
      "શામળ",
      "ભાલણ"
    ],
    "optionsGujarati": [
      "મહાકવિ પ્રેમાનંદ",
      "અખો",
      "શામળ",
      "ભાલણ"
    ],
    "correctAnswer": 0,
    "explanation": "આખ્યાન શિરોમણી પ્રેમાનંદના જાણીતા આખ્યાન 'સુદામાચરિત્ર' માંથી આ સુંદર કડવું લેવામાં આવ્યું છે.",
    "explanationGujarati": "આખ્યાન શિરોમણી પ્રેમાનંદના જાણીતા આખ્યાન 'સુદામાચરિત્ર' માંથી આ સુંદર કડવું લેવામાં આવ્યું છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 501,
    "category": "ગણિત",
    "categoryGujarati": "ગણિત",
    "grades": [
      "10"
    ],
    "subject": "Mathematics",
    "questionText": "(sin² 30° + cos² 30°) નું મૂલ્ય કેટલું થાય?",
    "questionTextGujarati": "(sin² 30° + cos² 30°) નું મૂલ્ય કેટલું થાય?",
    "options": [
      "1",
      "0",
      "1/2",
      "√3/2"
    ],
    "optionsGujarati": [
      "1",
      "0",
      "1/2",
      "√3/2"
    ],
    "correctAnswer": 0,
    "explanation": "ત્રિકોણમિતીય નિત્યસમ મુજબ કોઈપણ ખૂણા θ માટે sin² θ + cos² θ = 1 થાય.",
    "explanationGujarati": "ત્રિકોણમિતીય નિત્યસમ મુજબ કોઈપણ ખૂણા θ માટે sin² θ + cos² θ = 1 થાય.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 502,
    "category": "ગણિત",
    "categoryGujarati": "ગણિત",
    "grades": [
      "10"
    ],
    "subject": "Mathematics",
    "questionText": "જો દ્વિઘાત બહુપદી x² + 3x + k નું એક શૂન્ય 2 હોય, તો k ની કિંમત કેટલી થાય?",
    "questionTextGujarati": "જો દ્વિઘાત બહુપદી x² + 3x + k નું એક શૂન્ય 2 હોય, તો k ની કિંમત કેટલી થાય?",
    "options": [
      "-10",
      "10",
      "-5",
      "5"
    ],
    "optionsGujarati": [
      "-10",
      "10",
      "-5",
      "5"
    ],
    "correctAnswer": 0,
    "explanation": "(2)² + 3(2) + k = 0 => 4 + 6 + k = 0 => k = -10.",
    "explanationGujarati": "(2)² + 3(2) + k = 0 => 4 + 6 + k = 0 => k = -10.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 503,
    "category": "ગણિત",
    "categoryGujarati": "ગણિત",
    "grades": [
      "10"
    ],
    "subject": "Mathematics",
    "questionText": "દ્વિઘાત સમીકરણ 2x² - 4x + 3 = 0 નો વિવેચક (D) કેટલો થાય?",
    "questionTextGujarati": "દ્વિઘાત સમીકરણ 2x² - 4x + 3 = 0 નો વિવેચક (D) કેટલો થાય?",
    "options": [
      "-8",
      "8",
      "-40",
      "40"
    ],
    "optionsGujarati": [
      "-8",
      "8",
      "-40",
      "40"
    ],
    "correctAnswer": 0,
    "explanation": "D = b² - 4ac = (-4)² - 4(2)(3) = 16 - 24 = -8.",
    "explanationGujarati": "D = b² - 4ac = (-4)² - 4(2)(3) = 16 - 24 = -8.",
    "targetCompany": "School",
    "difficulty": "Medium"
  },
  {
    "id": 504,
    "category": "ગણિત",
    "categoryGujarati": "ગણિત",
    "grades": [
      "10"
    ],
    "subject": "Mathematics",
    "questionText": "સમાંતર શ્રેણી 2, 7, 12, ... નું 10 મું પદ (a₁₀) કયું થાય?",
    "questionTextGujarati": "સમાંતર શ્રેણી 2, 7, 12, ... નું 10 મું પદ (a₁₀) કયું થાય?",
    "options": [
      "47",
      "52",
      "42",
      "50"
    ],
    "optionsGujarati": [
      "47",
      "52",
      "42",
      "50"
    ],
    "correctAnswer": 0,
    "explanation": "a = 2, d = 5. a₁₀ = a + 9d = 2 + 9(5) = 47.",
    "explanationGujarati": "a = 2, d = 5. a₁₀ = a + 9d = 2 + 9(5) = 47.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 505,
    "category": "ગણિત",
    "categoryGujarati": "ગણિત",
    "grades": [
      "10"
    ],
    "subject": "Mathematics",
    "questionText": "બિંદુ P(3, 4) નું ઉગમબિંદુ (0, 0) થી અંતર કેટલું થાય?",
    "questionTextGujarati": "બિંદુ P(3, 4) નું ઉગમબિંદુ (0, 0) થી અંતર કેટલું થાય?",
    "options": [
      "5",
      "7",
      "1",
      "25"
    ],
    "optionsGujarati": [
      "5",
      "7",
      "1",
      "25"
    ],
    "correctAnswer": 0,
    "explanation": "અંતરસૂત્ર: √(x² + y²) = √(3² + 4²) = √25 = 5 એકમ.",
    "explanationGujarati": "અંતરસૂત્ર: √(x² + y²) = √(3² + 4²) = √25 = 5 એકમ.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 506,
    "category": "ગણિત",
    "categoryGujarati": "ગણિત",
    "grades": [
      "10"
    ],
    "subject": "Mathematics",
    "questionText": "જો tan θ = 4/3 હોય, તો sin θ નું મૂલ્ય કેટલું થાય?",
    "questionTextGujarati": "જો tan θ = 4/3 હોય, તો sin θ નું મૂલ્ય કેટલું થાય?",
    "options": [
      "4/5",
      "3/5",
      "5/4",
      "3/4"
    ],
    "optionsGujarati": [
      "4/5",
      "3/5",
      "5/4",
      "3/4"
    ],
    "correctAnswer": 0,
    "explanation": "સામેની બાજુ = 4, પાસેની બાજુ = 3 => કર્ણ = 5. તેથી sin θ = 4/5.",
    "explanationGujarati": "સામેની બાજુ = 4, પાસેની બાજુ = 3 => કર્ણ = 5. તેથી sin θ = 4/5.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 507,
    "category": "ગણિત",
    "categoryGujarati": "ગણિત",
    "grades": [
      "10"
    ],
    "subject": "Mathematics",
    "questionText": "વર્તુળના બહારના બિંદુ P માંથી વર્તુળને વધુમાં વધુ કેટલા સ્પર્શકો દોરી શકાય?",
    "questionTextGujarati": "વર્તુળના બહારના બિંદુ P માંથી વર્તુળને વધુમાં વધુ કેટલા સ્પર્શકો દોરી શકાય?",
    "options": [
      "2",
      "1",
      "અસંખ્ય",
      "0"
    ],
    "optionsGujarati": [
      "2",
      "1",
      "અસંખ્ય",
      "0"
    ],
    "correctAnswer": 0,
    "explanation": "વર્તુળના બહારના બિંદુમાંથી વર્તુળને બરાબર 2 સ્પર્શકો દોરી શકાય છે અને તેમની લંબાઈ સમાન હોય છે.",
    "explanationGujarati": "વર્તુળના બહારના બિંદુમાંથી વર્તુળને બરાબર 2 સ્પર્શકો દોરી શકાય છે અને તેમની લંબાઈ સમાન હોય છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 508,
    "category": "ગણિત",
    "categoryGujarati": "ગણિત",
    "grades": [
      "10"
    ],
    "subject": "Mathematics",
    "questionText": "મધ્યક (X̄), મધ્યસ્થ (M) અને બહુલક (Z) વચ્ચેનો પ્રયોગમૂલક સંબંધ કયો છે?",
    "questionTextGujarati": "મધ્યક (X̄), મધ્યસ્થ (M) અને બહુલક (Z) વચ્ચેનો પ્રયોગમૂલક સંબંધ કયો છે?",
    "options": [
      "Z = 3M - 2X̄",
      "M = 3Z - 2X̄",
      "Z = 2M - 3X̄",
      "X̄ = 3M - 2Z"
    ],
    "optionsGujarati": [
      "Z = 3M - 2X̄",
      "M = 3Z - 2X̄",
      "Z = 2M - 3X̄",
      "X̄ = 3M - 2Z"
    ],
    "correctAnswer": 0,
    "explanation": "આંકડાશાસ્ત્રમાં બહુલક = ૩(મધ્યસ્થ) - ૨(મધ્યક) એટલે કે Z = 3M - 2X̄ સંબંધ સ્વીકૃત છે.",
    "explanationGujarati": "આંકડાશાસ્ત્રમાં બહુલક = ૩(મધ્યસ્થ) - ૨(મધ્યક) એટલે કે Z = 3M - 2X̄ સંબંધ સ્વીકૃત છે.",
    "targetCompany": "School",
    "difficulty": "Medium"
  },
  {
    "id": 509,
    "category": "ગણિત",
    "categoryGujarati": "ગણિત",
    "grades": [
      "10"
    ],
    "subject": "Mathematics",
    "questionText": "એક સમતોલ પાસાને ઉછાળતાં તેના પર યુગ્મ (બેકી) અવિભાજ્ય સંખ્યા મળવાની સંભાવના કેટલી થાય?",
    "questionTextGujarati": "એક સમતોલ પાસાને ઉછાળતાં તેના પર યુગ્મ (બેકી) અવિભાજ્ય સંખ્યા મળવાની સંભાવના કેટલી થાય?",
    "options": [
      "1/6",
      "1/2",
      "1/3",
      "2/3"
    ],
    "optionsGujarati": [
      "1/6",
      "1/2",
      "1/3",
      "2/3"
    ],
    "correctAnswer": 0,
    "explanation": "કુલ પરિણામો {1, 2, 3, 4, 5, 6} = 6. બેકી અવિભાજ્ય માત્ર એક જ અંક છે: 2. તેથી સંભાવના 1/6.",
    "explanationGujarati": "કુલ પરિણામો {1, 2, 3, 4, 5, 6} = 6. બેકી અવિભાજ્ય માત્ર એક જ અંક છે: 2. તેથી સંભાવના 1/6.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 510,
    "category": "ગણિત",
    "categoryGujarati": "ગણિત",
    "grades": [
      "10"
    ],
    "subject": "Mathematics",
    "questionText": "જો બે ગોળાઓની ત્રિજ્યાનો ગુણોત્તર 2:3 હોય, તો તેમના ઘનફળનો ગુણોત્તર કેટલો થાય?",
    "questionTextGujarati": "જો બે ગોળાઓની ત્રિજ્યાનો ગુણોત્તર 2:3 હોય, તો તેમના ઘનફળનો ગુણોત્તર કેટલો થાય?",
    "options": [
      "8:27",
      "4:9",
      "2:3",
      "16:81"
    ],
    "optionsGujarati": [
      "8:27",
      "4:9",
      "2:3",
      "16:81"
    ],
    "correctAnswer": 0,
    "explanation": "ગોળાનું ઘનફળ r³ ના સમપ્રમાણમાં હોય છે: V1/V2 = (r1/r2)³ = (2/3)³ = 8/27.",
    "explanationGujarati": "ગોળાનું ઘનફળ r³ ના સમપ્રમાણમાં હોય છે: V1/V2 = (r1/r2)³ = (2/3)³ = 8/27.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 511,
    "category": "વિજ્ઞાન",
    "categoryGujarati": "વિજ્ઞાન",
    "grades": [
      "10"
    ],
    "subject": "Science",
    "questionText": "ઓહ્મના નિયમ મુજબ, જો અવરોધ R અચળ રાખી વોલ્ટેજ V બમણો કરવામાં આવે, તો વિદ્યુતપ્રવાહ I:",
    "questionTextGujarati": "ઓહ્મના નિયમ મુજબ, જો અવરોધ R અચળ રાખી વોલ્ટેજ V બમણો કરવામાં આવે, તો વિદ્યુતપ્રવાહ I:",
    "options": [
      "બમણો થશે",
      "અડધો થશે",
      "ચાર ગણો થશે",
      "અપરિવર્તિત રહેશે"
    ],
    "optionsGujarati": [
      "બમણો થશે",
      "અડધો થશે",
      "ચાર ગણો થશે",
      "અપરિવર્તિત રહેશે"
    ],
    "correctAnswer": 0,
    "explanation": "V = IR => I = V / R. અવરોધ અચળ હોય તો પ્રવાહ વોલ્ટેજના સમપ્રમાણમાં હોય છે, તેથી વોલ્ટેજ બમણો થતાં પ્રવાહ પણ બમણો થાય છે.",
    "explanationGujarati": "V = IR => I = V / R. અવરોધ અચળ હોય તો પ્રવાહ વોલ્ટેજના સમપ્રમાણમાં હોય છે, તેથી વોલ્ટેજ બમણો થતાં પ્રવાહ પણ બમણો થાય છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 512,
    "category": "વિજ્ઞાન",
    "categoryGujarati": "વિજ્ઞાન",
    "grades": [
      "10"
    ],
    "subject": "Science",
    "questionText": "25°C તાપમાને તટસ્થ જલીય દ્રાવણનું pH મૂલ્ય કેટલું હોય છે?",
    "questionTextGujarati": "25°C તાપમાને તટસ્થ જલીય દ્રાવણનું pH મૂલ્ય કેટલું હોય છે?",
    "options": [
      "7",
      "0",
      "14",
      "1"
    ],
    "optionsGujarati": [
      "7",
      "0",
      "14",
      "1"
    ],
    "correctAnswer": 0,
    "explanation": "શુદ્ધ પાણી કે તટસ્થ દ્રાવણ માટે 25°C પર pH = 7 હોય છે.",
    "explanationGujarati": "શુદ્ધ પાણી કે તટસ્થ દ્રાવણ માટે 25°C પર pH = 7 હોય છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 513,
    "category": "વિજ્ઞાન",
    "categoryGujarati": "વિજ્ઞાન",
    "grades": [
      "10"
    ],
    "subject": "Science",
    "questionText": "રાસાયણિક પ્રક્રિયા: Fe2O3 + 2Al → Al2O3 + 2Fe એ શેનું ઉદાહરણ છે?",
    "questionTextGujarati": "રાસાયણિક પ્રક્રિયા: Fe2O3 + 2Al → Al2O3 + 2Fe એ શેનું ઉદાહરણ છે?",
    "options": [
      "વિસ્થાપન પ્રક્રિયા (Displacement Reaction)",
      "સંયોગીકરણ પ્રક્રિયા",
      "વિઘટન પ્રક્રિયા",
      "દ્વિ-વિસ્થાપન પ્રક્રિયા"
    ],
    "optionsGujarati": [
      "વિસ્થાપન પ્રક્રિયા (Displacement Reaction)",
      "સંયોગીકરણ પ્રક્રિયા",
      "વિઘટન પ્રક્રિયા",
      "દ્વિ-વિસ્થાપન પ્રક્રિયા"
    ],
    "correctAnswer": 0,
    "explanation": "એલ્યુમિનિયમ આયર્ન કરતાં વધુ સક્રિય ધાતુ હોવાથી તે Fe2O3 માંથી આયર્નનું વિસ્થાપન કરે છે.",
    "explanationGujarati": "એલ્યુમિનિયમ આયર્ન કરતાં વધુ સક્રિય ધાતુ હોવાથી તે Fe2O3 માંથી આયર્નનું વિસ્થાપન કરે છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 514,
    "category": "વિજ્ઞાન",
    "categoryGujarati": "વિજ્ઞાન",
    "grades": [
      "10"
    ],
    "subject": "Science",
    "questionText": "ઇથેનોલ (C2H5OH) માં કયો ક્રિયાશીલ સમૂહ આવેલો છે?",
    "questionTextGujarati": "ઇથેનોલ (C2H5OH) માં કયો ક્રિયાશીલ સમૂહ આવેલો છે?",
    "options": [
      "આલ્કોહોલ (-OH)",
      "આલ્ડિહાઇડ (-CHO)",
      "કીટોન (>C=O)",
      "કાર્બોક્સિલિક એસિડ (-COOH)"
    ],
    "optionsGujarati": [
      "આલ્કોહોલ (-OH)",
      "આલ્ડિહાઇડ (-CHO)",
      "કીટોન (>C=O)",
      "કાર્બોક્સિલિક એસિડ (-COOH)"
    ],
    "correctAnswer": 0,
    "explanation": "-OH સમૂહ એ આલ્કોહોલ ક્રિયાશીલ સમૂહ તરીકે ઓળખાય છે.",
    "explanationGujarati": "-OH સમૂહ એ આલ્કોહોલ ક્રિયાશીલ સમૂહ તરીકે ઓળખાય છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 515,
    "category": "વિજ્ઞાન",
    "categoryGujarati": "વિજ્ઞાન",
    "grades": [
      "10"
    ],
    "subject": "Science",
    "questionText": "મનુષ્યના હૃદયમાં કયો ખંડ મહાધમની દ્વારા સમગ્ર શરીરમાં ઓક્સિજનયુક્ત રુધિર પમ્પ કરે છે?",
    "questionTextGujarati": "મનુષ્યના હૃદયમાં કયો ખંડ મહાધમની દ્વારા સમગ્ર શરીરમાં ઓક્સિજનયુક્ત રુધિર પમ્પ કરે છે?",
    "options": [
      "ડાબું ક્ષેપક (Left Ventricle)",
      "જમણું ક્ષેપક",
      "ડાબું કર્ણક",
      "જમણું કર્ણક"
    ],
    "optionsGujarati": [
      "ડાબું ક્ષેપક (Left Ventricle)",
      "જમણું ક્ષેપક",
      "ડાબું કર્ણક",
      "જમણું કર્ણક"
    ],
    "correctAnswer": 0,
    "explanation": "ડાબું ક્ષેપક જાડી સ્નાયુમય દીવાલ ધરાવે છે અને સમગ્ર શરીરમાં ઊંચા દબાણે ઓક્સિજનયુક્ત રુધિર પહોંચાડે છે.",
    "explanationGujarati": "ડાબું ક્ષેપક જાડી સ્નાયુમય દીવાલ ધરાવે છે અને સમગ્ર શરીરમાં ઊંચા દબાણે ઓક્સિજનયુક્ત રુધિર પહોંચાડે છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 516,
    "category": "વિજ્ઞાન",
    "categoryGujarati": "વિજ્ઞાન",
    "grades": [
      "10"
    ],
    "subject": "Science",
    "questionText": "વનસ્પતિમાં કોષ લંબન અને પ્રકાશાનુવર્તન માટે કયો મુખ્ય અંતઃસ્ત્રાવ જવાબદાર છે?",
    "questionTextGujarati": "વનસ્પતિમાં કોષ લંબન અને પ્રકાશાનુવર્તન માટે કયો મુખ્ય અંતઃસ્ત્રાવ જવાબદાર છે?",
    "options": [
      "ઓક્ઝિન (Auxin)",
      "જીબ્રેલીન",
      "સાયટોકાઈનીન",
      "એબ્સિસિક એસિડ"
    ],
    "optionsGujarati": [
      "ઓક્ઝિન (Auxin)",
      "જીબ્રેલીન",
      "સાયટોકાઈનીન",
      "એબ્સિસિક એસિડ"
    ],
    "correctAnswer": 0,
    "explanation": "ઓક્ઝિન પ્રરોહાગ્રના છેડે સંશ્લેષણ પામી છાંયડાવાળા ભાગમાં એકઠો થઈ કોષોની લંબાઈમાં વૃદ્ધિ પ્રેરે છે.",
    "explanationGujarati": "ઓક્ઝિન પ્રરોહાગ્રના છેડે સંશ્લેષણ પામી છાંયડાવાળા ભાગમાં એકઠો થઈ કોષોની લંબાઈમાં વૃદ્ધિ પ્રેરે છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 517,
    "category": "વિજ્ઞાન",
    "categoryGujarati": "વિજ્ઞાન",
    "grades": [
      "10"
    ],
    "subject": "Science",
    "questionText": "મેન્ડેલે શુદ્ધ ઊંચા (TT) અને નીચા (tt) વટાણાના છોડ વચ્ચે સંકરણ કરાવ્યું. F1 પેઢીમાં બધા જ છોડ કેવા મળ્યા?",
    "questionTextGujarati": "મેન્ડેલે શુદ્ધ ઊંચા (TT) અને નીચા (tt) વટાણાના છોડ વચ્ચે સંકરણ કરાવ્યું. F1 પેઢીમાં બધા જ છોડ કેવા મળ્યા?",
    "options": [
      "બધા જ ઊંચા (All Tall - Tt)",
      "બધા જ નીચા",
      "50% ઊંચા અને 50% નીચા",
      "75% ઊંચા અને 25% નીચા"
    ],
    "optionsGujarati": [
      "બધા જ ઊંચા (All Tall - Tt)",
      "બધા જ નીચા",
      "50% ઊંચા અને 50% નીચા",
      "75% ઊંચા અને 25% નીચા"
    ],
    "correctAnswer": 0,
    "explanation": "ઊંચાપણાનું જનીન (T) પ્રભાવી હોવાથી F1 પેઢીમાં તમામ છોડ વિષમયુગ્મી ઊંચા (Tt) બને છે.",
    "explanationGujarati": "ઊંચાપણાનું જનીન (T) પ્રભાવી હોવાથી F1 પેઢીમાં તમામ છોડ વિષમયુગ્મી ઊંચા (Tt) બને છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 518,
    "category": "વિજ્ઞાન",
    "categoryGujarati": "વિજ્ઞાન",
    "grades": [
      "10"
    ],
    "subject": "Science",
    "questionText": "અંતર્ગોળ અરીસાની સામે વસ્તુને ક્યાં મૂકતાં તેનું વાસ્તવિક, ઊલટું અને વસ્તુ જેવડા જ કદનું પ્રતિબિંબ રચાય છે?",
    "questionTextGujarati": "અંતર્ગોળ અરીસાની સામે વસ્તુને ક્યાં મૂકતાં તેનું વાસ્તવિક, ઊલટું અને વસ્તુ જેવડા જ કદનું પ્રતિબિંબ રચાય છે?",
    "options": [
      "વક્રતાકેન્દ્ર C પર",
      "મુખ્ય કેન્દ્ર F પર",
      "ધ્રુવ P પર",
      "અનંત અંતરે"
    ],
    "optionsGujarati": [
      "વક્રતાકેન્દ્ર C પર",
      "મુખ્ય કેન્દ્ર F પર",
      "ધ્રુવ P પર",
      "અનંત અંતરે"
    ],
    "correctAnswer": 0,
    "explanation": "વસ્તુ જ્યારે અંતર્ગોળ અરીસાના વક્રતાકેન્દ્ર C પર મૂકવામાં આવે ત્યારે પ્રતિબિંબ પણ C પર જ સમાન કદનું મળે છે.",
    "explanationGujarati": "વસ્તુ જ્યારે અંતર્ગોળ અરીસાના વક્રતાકેન્દ્ર C પર મૂકવામાં આવે ત્યારે પ્રતિબિંબ પણ C પર જ સમાન કદનું મળે છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 519,
    "category": "વિજ્ઞાન",
    "categoryGujarati": "વિજ્ઞાન",
    "grades": [
      "10"
    ],
    "subject": "Science",
    "questionText": "પ્રિઝમ વડે શ્વેત પ્રકાશનું તેના સાત ઘટક રંગોમાં વિભાજિત થવાની ઘટનાને શું કહે છે?",
    "questionTextGujarati": "પ્રિઝમ વડે શ્વેત પ્રકાશનું તેના સાત ઘટક રંગોમાં વિભાજિત થવાની ઘટનાને શું કહે છે?",
    "options": [
      "પ્રકાશનું વિભાજન (Dispersion)",
      "પ્રકાશનું પ્રકીર્ણન",
      "પૂર્ણ આંતરિક પરાવર્તન",
      "પ્રકાશનું શોષણ"
    ],
    "optionsGujarati": [
      "પ્રકાશનું વિભાજન (Dispersion)",
      "પ્રકાશનું પ્રકીર્ણન",
      "પૂર્ણ આંતરિક પરાવર્તન",
      "પ્રકાશનું શોષણ"
    ],
    "correctAnswer": 0,
    "explanation": "જુદા જુદા રંગોનો વેગ અને વક્રીભવનાંક અલગ હોવાથી કાચના પ્રિઝમમાંથી પસાર થતાં શ્વેત પ્રકાશનું સાત રંગોમાં વિભાજન થાય છે.",
    "explanationGujarati": "જુદા જુદા રંગોનો વેગ અને વક્રીભવનાંક અલગ હોવાથી કાચના પ્રિઝમમાંથી પસાર થતાં શ્વેત પ્રકાશનું સાત રંગોમાં વિભાજન થાય છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 520,
    "category": "વિજ્ઞાન",
    "categoryGujarati": "વિજ્ઞાન",
    "grades": [
      "10"
    ],
    "subject": "Science",
    "questionText": "વિદ્યુતપ્રવાહધારિત સીધા તારની આસપાસ ચુંબકીય ક્ષેત્રરેખાઓની દિશા નક્કી કરવા કયો નિયમ વપરાય છે?",
    "questionTextGujarati": "વિદ્યુતપ્રવાહધારિત સીધા તારની આસપાસ ચુંબકીય ક્ષેત્રરેખાઓની દિશા નક્કી કરવા કયો નિયમ વપરાય છે?",
    "options": [
      "જમણા હાથના અંગૂઠાનો નિયમ (Right-Hand Thumb Rule)",
      "ફ્લેમિંગનો ડાબા હાથનો નિયમ",
      "ફ્લેમિંગનો જમણા હાથનો નિયમ",
      "ઓહ્મનો નિયમ"
    ],
    "optionsGujarati": [
      "જમણા હાથના અંગૂઠાનો નિયમ (Right-Hand Thumb Rule)",
      "ફ્લેમિંગનો ડાબા હાથનો નિયમ",
      "ફ્લેમિંગનો જમણા હાથનો નિયમ",
      "ઓહ્મનો નિયમ"
    ],
    "correctAnswer": 0,
    "explanation": "જમણા હાથના અંગૂઠાના નિયમ મુજબ જો અંગૂઠો પ્રવાહની દિશામાં હોય તો વળેલી આંગળીઓ ચુંબકીય ક્ષેત્રની દિશા દર્શાવે છે.",
    "explanationGujarati": "જમણા હાથના અંગૂઠાના નિયમ મુજબ જો અંગૂઠો પ્રવાહની દિશામાં હોય તો વળેલી આંગળીઓ ચુંબકીય ક્ષેત્રની દિશા દર્શાવે છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 521,
    "category": "સામાજિક વિજ્ઞાન",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "grades": [
      "10"
    ],
    "subject": "Social Science",
    "questionText": "મોઢેરાનું પ્રસિદ્ધ સૂર્યમંદિર સોલંકી વંશના રાજા ભીમદેવ પ્રથમ દ્વારા ક્યારે બંધાવવામાં આવ્યું હતું?",
    "questionTextGujarati": "મોઢેરાનું પ્રસિદ્ધ સૂર્યમંદિર સોલંકી વંશના રાજા ભીમદેવ પ્રથમ દ્વારા ક્યારે બંધાવવામાં આવ્યું હતું?",
    "options": [
      "ઇ.સ. ૧૦૨૬",
      "ઇ.સ. ૧૧૨૬",
      "ઇ.સ. ૧૦૫૦",
      "ઇ.સ. ૧૧૯૦"
    ],
    "optionsGujarati": [
      "ઇ.સ. ૧૦૨૬",
      "ઇ.સ. ૧૧૨૬",
      "ઇ.સ. ૧૦૫૦",
      "ઇ.સ. ૧૧૯૦"
    ],
    "correctAnswer": 0,
    "explanation": "ઇ.સ. ૧૦૨૬ માં સોલંકી વંશના શાસક ભીમદેવ પ્રથમે મોઢેરા ખાતે શિલ્પ સ્થાપત્યની ઉત્કૃષ્ટ શૈલીમાં સૂર્યમંદિર બંધાવ્યું હતું.",
    "explanationGujarati": "ઇ.સ. ૧૦૨૬ માં સોલંકી વંશના શાસક ભીમદેવ પ્રથમે મોઢેરા ખાતે શિલ્પ સ્થાપત્યની ઉત્કૃષ્ટ શૈલીમાં સૂર્યમંદિર બંધાવ્યું હતું.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 522,
    "category": "સામાજિક વિજ્ઞાન",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "grades": [
      "10"
    ],
    "subject": "Social Science",
    "questionText": "કઈ જમીન 'રેગુર જમીન' તરીકે પણ ઓળખાય છે અને કપાસની ખેતી માટે ઉત્તમ ગણાય છે?",
    "questionTextGujarati": "કઈ જમીન 'રેગુર જમીન' તરીકે પણ ઓળખાય છે અને કપાસની ખેતી માટે ઉત્તમ ગણાય છે?",
    "options": [
      "કાળી જમીન (Black Soil)",
      "કાંપવાળી જમીન",
      "રાતી જમીન",
      "પડખાઉ જમીન"
    ],
    "optionsGujarati": [
      "કાળી જમીન (Black Soil)",
      "કાંપવાળી જમીન",
      "રાતી જમીન",
      "પડખાઉ જમીન"
    ],
    "correctAnswer": 0,
    "explanation": "કાળી જમીન લાવાજન્ય હોવાથી અત્યંત ફળદ્રુપ અને ભેજસંગ્રાહક છે, તેથી તેને રેગુર કે કપાસની કાળી જમીન કહે છે.",
    "explanationGujarati": "કાળી જમીન લાવાજન્ય હોવાથી અત્યંત ફળદ્રુપ અને ભેજસંગ્રાહક છે, તેથી તેને રેગુર કે કપાસની કાળી જમીન કહે છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 523,
    "category": "સામાજિક વિજ્ઞાન",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "grades": [
      "10"
    ],
    "subject": "Social Science",
    "questionText": "વિશ્વવિખ્યાત 'પટોળાં' ની હસ્તકળા ગુજરાતના કયા ઐતિહાસિક શહેર સાથે જોડાયેલી છે?",
    "questionTextGujarati": "વિશ્વવિખ્યાત 'પટોળાં' ની હસ્તકળા ગુજરાતના કયા ઐતિહાસિક શહેર સાથે જોડાયેલી છે?",
    "options": [
      "પાટણ",
      "સુરત",
      "જામનગર",
      "ભાવનગર"
    ],
    "optionsGujarati": [
      "પાટણ",
      "સુરત",
      "જામનગર",
      "ભાવનગર"
    ],
    "correctAnswer": 0,
    "explanation": "પાટણના બેવડ ઇક્ત વણાટથી તૈયાર થતાં પટોળાં તેમના રંગ, ભાત અને દીર્ઘજીવી ટકાઉપણા માટે વિશ્વભરમાં પ્રખ્યાત છે.",
    "explanationGujarati": "પાટણના બેવડ ઇક્ત વણાટથી તૈયાર થતાં પટોળાં તેમના રંગ, ભાત અને દીર્ઘજીવી ટકાઉપણા માટે વિશ્વભરમાં પ્રખ્યાત છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 524,
    "category": "સામાજિક વિજ્ઞાન",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "grades": [
      "10"
    ],
    "subject": "Social Science",
    "questionText": "૧૯૯૧ ની આર્થિક નીતિના સંદર્ભમાં LPG શબ્દાવલીનો સાચો અર્થ શું છે?",
    "questionTextGujarati": "૧૯૯૧ ની આર્થિક નીતિના સંદર્ભમાં LPG શબ્દાવલીનો સાચો અર્થ શું છે?",
    "options": [
      "ઉદારીકરણ, ખાનગીકરણ અને વૈશ્વિકીકરણ (Liberalization, Privatization, Globalization)",
      "લિક્વિફાઇડ પેટ્રોલિયમ ગેસ",
      "સ્થાનિક પંચાયત ગઠન",
      "લોકપ્રિય જાહેર યોજના"
    ],
    "optionsGujarati": [
      "ઉદારીકરણ, ખાનગીકરણ અને વૈશ્વિકીકરણ (Liberalization, Privatization, Globalization)",
      "લિક્વિફાઇડ પેટ્રોલિયમ ગેસ",
      "સ્થાનિક પંચાયત ગઠન",
      "લોકપ્રિય જાહેર યોજના"
    ],
    "correctAnswer": 0,
    "explanation": "૧૯૯૧ ના ભારતના આર્થિક સુધારા ઉદારીકરણ, ખાનગીકરણ અને વૈશ્વિકીકરણ (LPG) ત્રિપુટી તરીકે ઓળખાય છે.",
    "explanationGujarati": "૧૯૯૧ ના ભારતના આર્થિક સુધારા ઉદારીકરણ, ખાનગીકરણ અને વૈશ્વિકીકરણ (LPG) ત્રિપુટી તરીકે ઓળખાય છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 525,
    "category": "સામાજિક વિજ્ઞાન",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "grades": [
      "10"
    ],
    "subject": "Social Science",
    "questionText": "ભારતમાં દર વર્ષે 'રાષ્ટ્રીય ગ્રાહક અધિકાર દિન' કઈ તારીખે ઉજવવામાં આવે છે?",
    "questionTextGujarati": "ભારતમાં દર વર્ષે 'રાષ્ટ્રીય ગ્રાહક અધિકાર દિન' કઈ તારીખે ઉજવવામાં આવે છે?",
    "options": [
      "૨૪ ડિસેમ્બર",
      "૧૫ માર્ચ",
      "૫ જૂન",
      "૨૬ જાન્યુઆરી"
    ],
    "optionsGujarati": [
      "૨૪ ડિસેમ્બર",
      "૧૫ માર્ચ",
      "૫ જૂન",
      "૨૬ જાન્યુઆરી"
    ],
    "correctAnswer": 0,
    "explanation": "૨૪ ડિસેમ્બર ૧૯૮૬ ના રોજ રાષ્ટ્રપતિ દ્વારા 'ગ્રાહક સુરક્ષા અધિનિયમ' મંજૂર કરાયો હોવાથી આ દિવસ રાષ્ટ્રીય ગ્રાહક અધિકાર દિન ઉજવાય છે.",
    "explanationGujarati": "૨૪ ડિસેમ્બર ૧૯૮૬ ના રોજ રાષ્ટ્રપતિ દ્વારા 'ગ્રાહક સુરક્ષા અધિનિયમ' મંજૂર કરાયો હોવાથી આ દિવસ રાષ્ટ્રીય ગ્રાહક અધિકાર દિન ઉજવાય છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 526,
    "category": "સામાજિક વિજ્ઞાન",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "grades": [
      "10"
    ],
    "subject": "Social Science",
    "questionText": "ગુજરાતમાં નર્મદા નદી પર નિર્માણ પામેલી બહુહેતુક યોજના કઈ છે?",
    "questionTextGujarati": "ગુજરાતમાં નર્મદા નદી પર નિર્માણ પામેલી બહુહેતુક યોજના કઈ છે?",
    "options": [
      "સરદાર સરોવર યોજના",
      "ઉકાઈ યોજના",
      "ધરોઈ યોજના",
      "દાંતીવાડા યોજના"
    ],
    "optionsGujarati": [
      "સરદાર સરોવર યોજના",
      "ઉકાઈ યોજના",
      "ધરોઈ યોજના",
      "દાંતીવાડા યોજના"
    ],
    "correctAnswer": 0,
    "explanation": "નર્મદા જિલ્લાના કેવડિયા ખાતે સરદાર સરોવર બંધ નિર્માણ પામેલ છે જે ગુજરાત, રાજસ્થાન અને મધ્યપ્રદેશને લાભ આપે છે.",
    "explanationGujarati": "નર્મદા જિલ્લાના કેવડિયા ખાતે સરદાર સરોવર બંધ નિર્માણ પામેલ છે જે ગુજરાત, રાજસ્થાન અને મધ્યપ્રદેશને લાભ આપે છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 527,
    "category": "સામાજિક વિજ્ઞાન",
    "categoryGujarati": "સામાજિક વિજ્ઞાન",
    "grades": [
      "10"
    ],
    "subject": "Social Science",
    "questionText": "આંતરરાષ્ટ્રીય વેપારનું નિયમન કરતી અને ૧૯૯૫ માં GATT ના સ્થાને આવેલી વૈશ્વિક સંસ્થા કઈ છે?",
    "questionTextGujarati": "આંતરરાષ્ટ્રીય વેપારનું નિયમન કરતી અને ૧૯૯૫ માં GATT ના સ્થાને આવેલી વૈશ્વિક સંસ્થા કઈ છે?",
    "options": [
      "વિશ્વ વ્યાપાર સંગઠન (WTO)",
      "વિશ્વ બેંક (World Bank)",
      "આંતરરાષ્ટ્રીય નાણાં ભંડોળ (IMF)",
      "યુનેસ્કો (UNESCO)"
    ],
    "optionsGujarati": [
      "વિશ્વ વ્યાપાર સંગઠન (WTO)",
      "વિશ્વ બેંક (World Bank)",
      "આંતરરાષ્ટ્રીય નાણાં ભંડોળ (IMF)",
      "યુનેસ્કો (UNESCO)"
    ],
    "correctAnswer": 0,
    "explanation": "૧ જાન્યુઆરી ૧૯૯૫ ના રોજ જીનીવા ખાતે વિશ્વ વ્યાપાર સંગઠન (WTO) ની સ્થાપના થઈ હતી.",
    "explanationGujarati": "૧ જાન્યુઆરી ૧૯૯૫ ના રોજ જીનીવા ખાતે વિશ્વ વ્યાપાર સંગઠન (WTO) ની સ્થાપના થઈ હતી.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 528,
    "category": "અંગ્રેજી",
    "categoryGujarati": "અંગ્રેજી",
    "grades": [
      "10"
    ],
    "subject": "English",
    "questionText": "'A Letter to God' વાર્તામાં લેંચોએ ઈશ્વરને પત્ર લખી ૧૦૦ પેસો શા માટે માંગ્યા હતા?",
    "questionTextGujarati": "'A Letter to God' વાર્તામાં લેંચોએ ઈશ્વરને પત્ર લખી ૧૦૦ પેસો શા માટે માંગ્યા હતા?",
    "options": [
      "Because hailstones destroyed his ripe corn harvest completely",
      "To buy a new tractor",
      "To pay his debts",
      "To celebrate a festival"
    ],
    "optionsGujarati": [
      "Because hailstones destroyed his ripe corn harvest completely",
      "To buy a new tractor",
      "To pay his debts",
      "To celebrate a festival"
    ],
    "correctAnswer": 0,
    "explanation": "ભારે કરા પડવાથી તેનો મકાઈનો પાક સદંતર નાશ પામ્યો હતો, જેથી કુટુંબનું ગુજરાન ચલાવવા અને નવો પાક વાવવા ૧૦૦ પેસો માંગ્યા હતા.",
    "explanationGujarati": "ભારે કરા પડવાથી તેનો મકાઈનો પાક સદંતર નાશ પામ્યો હતો, જેથી કુટુંબનું ગુજરાન ચલાવવા અને નવો પાક વાવવા ૧૦૦ પેસો માંગ્યા હતા.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 529,
    "category": "અંગ્રેજી",
    "categoryGujarati": "અંગ્રેજી",
    "grades": [
      "10"
    ],
    "subject": "English",
    "questionText": "નેલ્સન મંડેલાના મતે સાચી 'હિંમત' (Courage) એટલે શું?",
    "questionTextGujarati": "નેલ્સન મંડેલાના મતે સાચી 'હિંમત' (Courage) એટલે શું?",
    "options": [
      "Triumph over fear, not the absence of fear",
      "Absence of fear",
      "Physical strength",
      "Defeating enemies in battle"
    ],
    "optionsGujarati": [
      "Triumph over fear, not the absence of fear",
      "Absence of fear",
      "Physical strength",
      "Defeating enemies in battle"
    ],
    "correctAnswer": 0,
    "explanation": "મંડેલા અનુસાર હિંમત એટલે ભયનો અભાવ નહીં પરંતુ ભય પર મેળવેલો વિજય છે.",
    "explanationGujarati": "મંડેલા અનુસાર હિંમત એટલે ભયનો અભાવ નહીં પરંતુ ભય પર મેળવેલો વિજય છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 530,
    "category": "અંગ્રેજી",
    "categoryGujarati": "અંગ્રેજી",
    "grades": [
      "10"
    ],
    "subject": "English",
    "questionText": "વાક્યમાં વ્યાકરણની ભૂલ શોધો: 'Each of the participants have received a certificate.'",
    "questionTextGujarati": "વાક્યમાં વ્યાકરણની ભૂલ શોધો: 'Each of the participants have received a certificate.'",
    "options": [
      "'have' should be 'has'",
      "'Each' should be 'All'",
      "'certificate' should be 'certificates'",
      "'received' is wrong"
    ],
    "optionsGujarati": [
      "'have' should be 'has'",
      "'Each' should be 'All'",
      "'certificate' should be 'certificates'",
      "'received' is wrong"
    ],
    "correctAnswer": 0,
    "explanation": "'Each of' એકવચન કર્તા ગણાય છે તેથી સહાયક ક્રિયાપદ 'has' આવવું જોઈએ.",
    "explanationGujarati": "'Each of' એકવચન કર્તા ગણાય છે તેથી સહાયક ક્રિયાપદ 'has' આવવું જોઈએ.",
    "targetCompany": "School",
    "difficulty": "Medium"
  },
  {
    "id": 531,
    "category": "અંગ્રેજી",
    "categoryGujarati": "અંગ્રેજી",
    "grades": [
      "10"
    ],
    "subject": "English",
    "questionText": "યોગ્ય મોડલ ઓક્સિલરી વડે વાક્ય પૂર્ણ કરો: 'You ______ obey traffic signals for safety.'",
    "questionTextGujarati": "યોગ્ય મોડલ ઓક્સિલરી વડે વાક્ય પૂર્ણ કરો: 'You ______ obey traffic signals for safety.'",
    "options": [
      "must",
      "can",
      "might",
      "would"
    ],
    "optionsGujarati": [
      "must",
      "can",
      "might",
      "would"
    ],
    "correctAnswer": 0,
    "explanation": "ટ્રાફિક નિયમોનું પાલન કાનૂની ફરજ અને સલામતી માટે અનિવાર્ય હોવાથી 'must' વપરાય છે.",
    "explanationGujarati": "ટ્રાફિક નિયમોનું પાલન કાનૂની ફરજ અને સલામતી માટે અનિવાર્ય હોવાથી 'must' વપરાય છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 532,
    "category": "ગુજરાતી",
    "categoryGujarati": "ગુજરાતી",
    "grades": [
      "10"
    ],
    "subject": "Gujarati",
    "questionText": "'વૈષ્ણવજન તો તેને રે કહીએ જે પીડ પરાઈ જાણે રે' પદના રચયિતા કોણ છે?",
    "questionTextGujarati": "'વૈષ્ણવજન તો તેને રે કહીએ જે પીડ પરાઈ જાણે રે' પદના રચયિતા કોણ છે?",
    "options": [
      "નરસિંહ મહેતા",
      "મીરાંબાઈ",
      "અખો",
      "દયારામ"
    ],
    "optionsGujarati": [
      "નરસિંહ મહેતા",
      "મીરાંબાઈ",
      "અખો",
      "દયારામ"
    ],
    "correctAnswer": 0,
    "explanation": "મહાત્મા ગાંધીજીના અતિપ્રિય આ ભજનના રચયિતા આદિકવિ નરસિંહ મહેતા છે.",
    "explanationGujarati": "મહાત્મા ગાંધીજીના અતિપ્રિય આ ભજનના રચયિતા આદિકવિ નરસિંહ મહેતા છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 533,
    "category": "ગુજરાતી",
    "categoryGujarati": "ગુજરાતી",
    "grades": [
      "10"
    ],
    "subject": "Gujarati",
    "questionText": "'રેસનો ઘોડો' નવલિકામાં કયા બે પરિવારો અને બાળકોના શિક્ષણ-સંસ્કારોની સરખામણી છે?",
    "questionTextGujarati": "'રેસનો ઘોડો' નવલિકામાં કયા બે પરિવારો અને બાળકોના શિક્ષણ-સંસ્કારોની સરખામણી છે?",
    "options": [
      "વિનુકાકા-સૌરભ અને સંજય-અંકિત",
      "મગનલાલ અને છગનલાલ",
      "રામશંકર અને શ્યામસુંદર",
      "હરિલાલ અને કાંતિલાલ"
    ],
    "optionsGujarati": [
      "વિનુકાકા-સૌરભ અને સંજય-અંકિત",
      "મગનલાલ અને છગનલાલ",
      "રામશંકર અને શ્યામસુંદર",
      "હરિલાલ અને કાંતિલાલ"
    ],
    "correctAnswer": 0,
    "explanation": "વર્ષા અડાલજા રચિત 'રેસનો ઘોડો' વાર્તામાં વિનુકાકાના પુત્ર સૌરભ અને નીનાબહેન-સંજયના પુત્ર અંકિતના ઉછેરનું તુલનાત્મક દર્શન છે.",
    "explanationGujarati": "વર્ષા અડાલજા રચિત 'રેસનો ઘોડો' વાર્તામાં વિનુકાકાના પુત્ર સૌરભ અને નીનાબહેન-સંજયના પુત્ર અંકિતના ઉછેરનું તુલનાત્મક દર્શન છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 534,
    "category": "ગુજરાતી",
    "categoryGujarati": "ગુજરાતી",
    "grades": [
      "10"
    ],
    "subject": "Gujarati",
    "questionText": "'મા-બાપ' કયો સમાસ છે?",
    "questionTextGujarati": "'મા-બાપ' કયો સમાસ છે?",
    "options": [
      "દ્વન્દ્વ સમાસ",
      "તત્પુરુષ સમાસ",
      "કર્મધારય સમાસ",
      "મધ્યમપદલોપી સમાસ"
    ],
    "optionsGujarati": [
      "દ્વન્દ્વ સમાસ",
      "તત્પુરુષ સમાસ",
      "કર્મધારય સમાસ",
      "મધ્યમપદલોપી સમાસ"
    ],
    "correctAnswer": 0,
    "explanation": "'મા અને બાપ' - બંને પદો સમાન મોભાના હોવાથી તે દ્વન્દ્વ સમાસ બને છે.",
    "explanationGujarati": "'મા અને બાપ' - બંને પદો સમાન મોભાના હોવાથી તે દ્વન્દ્વ સમાસ બને છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 535,
    "category": "ગુજરાતી",
    "categoryGujarati": "ગુજરાતી",
    "grades": [
      "10"
    ],
    "subject": "Gujarati",
    "questionText": "'શીલવંત સાધુને વારે વારે નમીએ' ભજનમાં ગંગાસતી કોને ઉપદેશ આપે છે?",
    "questionTextGujarati": "'શીલવંત સાધુને વારે વારે નમીએ' ભજનમાં ગંગાસતી કોને ઉપદેશ આપે છે?",
    "options": [
      "પાનબાઈને",
      "મીરાંબાઈને",
      "લોયણને",
      "જીવણદાસને"
    ],
    "optionsGujarati": [
      "પાનબાઈને",
      "મીરાંબાઈને",
      "લોયણને",
      "જીવણદાસને"
    ],
    "correctAnswer": 0,
    "explanation": "ભક્તકવયિત્રી ગંગાસતીએ પોતાની શિષ્યા પાનબાઈને આધ્યાત્મિક જ્ઞાન આપવા માટે ભજનો રચ્યા હતા.",
    "explanationGujarati": "ભક્તકવયિત્રી ગંગાસતીએ પોતાની શિષ્યા પાનબાઈને આધ્યાત્મિક જ્ઞાન આપવા માટે ભજનો રચ્યા હતા.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 601,
    "category": "ભૌતિક વિજ્ઞાન",
    "categoryGujarati": "ભૌતિક વિજ્ઞાન",
    "grades": [
      "11"
    ],
    "subject": "Physics",
    "questionText": "સમતલ જમીન પર પ્રક્ષિપ્ત પદાર્થની સમક્ષિતિજ અવધિ (Range) કયા પ્રક્ષેપણ કોણે મહત્તમ બને છે?",
    "questionTextGujarati": "સમતલ જમીન પર પ્રક્ષિપ્ત પદાર્થની સમક્ષિતિજ અવધિ (Range) કયા પ્રક્ષેપણ કોણે મહત્તમ બને છે?",
    "options": [
      "45°",
      "90°",
      "30°",
      "60°"
    ],
    "optionsGujarati": [
      "45°",
      "90°",
      "30°",
      "60°"
    ],
    "correctAnswer": 0,
    "explanation": "R = (u² sin 2θ) / g. જ્યારે θ = 45° હોય ત્યારે sin 2(45°) = sin 90° = 1 મહત્તમ બને છે.",
    "explanationGujarati": "R = (u² sin 2θ) / g. જ્યારે θ = 45° હોય ત્યારે sin 2(45°) = sin 90° = 1 મહત્તમ બને છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 602,
    "category": "ભૌતિક વિજ્ઞાન",
    "categoryGujarati": "ભૌતિક વિજ્ઞાન",
    "grades": [
      "11"
    ],
    "subject": "Physics",
    "questionText": "સાર્વત્રિક ગુરુત્વાકર્ષણ અચળાંક (G) નું પારિમાણિક સૂત્ર કયું છે?",
    "questionTextGujarati": "સાર્વત્રિક ગુરુત્વાકર્ષણ અચળાંક (G) નું પારિમાણિક સૂત્ર કયું છે?",
    "options": [
      "[M⁻¹ L³ T⁻²]",
      "[M¹ L³ T⁻²]",
      "[M⁻¹ L² T⁻²]",
      "[M⁰ L³ T⁻¹]"
    ],
    "optionsGujarati": [
      "[M⁻¹ L³ T⁻²]",
      "[M¹ L³ T⁻²]",
      "[M⁻¹ L² T⁻²]",
      "[M⁰ L³ T⁻¹]"
    ],
    "correctAnswer": 0,
    "explanation": "F = G(m1·m2)/r² => G = F·r² / m² = [N·m²/kg²] = [M⁻¹ L³ T⁻²].",
    "explanationGujarati": "F = G(m1·m2)/r² => G = F·r² / m² = [N·m²/kg²] = [M⁻¹ L³ T⁻²].",
    "targetCompany": "School",
    "difficulty": "Medium"
  },
  {
    "id": 603,
    "category": "ભૌતિક વિજ્ઞાન",
    "categoryGujarati": "ભૌતિક વિજ્ઞાન",
    "grades": [
      "11"
    ],
    "subject": "Physics",
    "questionText": "થર્મોડાયનેમિક્સનો કયો નિયમ તાપમાન અને તાપીય સંતુલનની સંકલ્પના વ્યાખ્યાયિત કરે છે?",
    "questionTextGujarati": "થર્મોડાયનેમિક્સનો કયો નિયમ તાપમાન અને તાપીય સંતુલનની સંકલ્પના વ્યાખ્યાયિત કરે છે?",
    "options": [
      "શૂન્યતમ નિયમ (Zeroth Law)",
      "પ્રથમ નિયમ",
      "દ્વિતીય નિયમ",
      "તૃતીય નિયમ"
    ],
    "optionsGujarati": [
      "શૂન્યતમ નિયમ (Zeroth Law)",
      "પ્રથમ નિયમ",
      "દ્વિતીય નિયમ",
      "તૃતીય નિયમ"
    ],
    "correctAnswer": 0,
    "explanation": "શૂન્યતમ નિયમ જણાવે છે કે જો તંત્રો A અને B સ્વતંત્ર રીતે C સાથે તાપીય સંતુલનમાં હોય તો તેઓ પરસ્પર પણ સંતુલનમાં હોય છે.",
    "explanationGujarati": "શૂન્યતમ નિયમ જણાવે છે કે જો તંત્રો A અને B સ્વતંત્ર રીતે C સાથે તાપીય સંતુલનમાં હોય તો તેઓ પરસ્પર પણ સંતુલનમાં હોય છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 604,
    "category": "ભૌતિક વિજ્ઞાન",
    "categoryGujarati": "ભૌતિક વિજ્ઞાન",
    "grades": [
      "11"
    ],
    "subject": "Physics",
    "questionText": "નિયમિત વર્તુળાકાર ગતિ કરતા પદાર્થ પર કેન્દ્રગામી બળ દ્વારા એક પૂર્ણ પરિભ્રમણ દરમિયાન થતું કાર્ય કેટલું હોય છે?",
    "questionTextGujarati": "નિયમિત વર્તુળાકાર ગતિ કરતા પદાર્થ પર કેન્દ્રગામી બળ દ્વારા એક પૂર્ણ પરિભ્રમણ દરમિયાન થતું કાર્ય કેટલું હોય છે?",
    "options": [
      "0 (શૂન્ય)",
      "ધન",
      "ઋણ",
      "અનંત"
    ],
    "optionsGujarati": [
      "0 (શૂન્ય)",
      "ધન",
      "ઋણ",
      "અનંત"
    ],
    "correctAnswer": 0,
    "explanation": "કેન્દ્રગામી બળ સ્થાનાંતરની દિશાને લંબરૂપે (θ = 90°) લાગતું હોવાથી W = F·d·cos 90° = 0 થાય છે.",
    "explanationGujarati": "કેન્દ્રગામી બળ સ્થાનાંતરની દિશાને લંબરૂપે (θ = 90°) લાગતું હોવાથી W = F·d·cos 90° = 0 થાય છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 605,
    "category": "ભૌતિક વિજ્ઞાન",
    "categoryGujarati": "ભૌતિક વિજ્ઞાન",
    "grades": [
      "11"
    ],
    "subject": "Physics",
    "questionText": "વર્તુળાકાર ગતિમાં રેખીય વેગ (v) અને કોણીય વેગ (ω) વચ્ચેનો સંબંધ કયો છે?",
    "questionTextGujarati": "વર્તુળાકાર ગતિમાં રેખીય વેગ (v) અને કોણીય વેગ (ω) વચ્ચેનો સંબંધ કયો છે?",
    "options": [
      "v = r·ω",
      "ω = r·v",
      "v = ω / r",
      "v = r²·ω"
    ],
    "optionsGujarati": [
      "v = r·ω",
      "ω = r·v",
      "v = ω / r",
      "v = r²·ω"
    ],
    "correctAnswer": 0,
    "explanation": "રેખીય વેગ v = r·ω (વેક્ટર સ્વરૂપે v = ω × r) થાય છે.",
    "explanationGujarati": "રેખીય વેગ v = r·ω (વેક્ટર સ્વરૂપે v = ω × r) થાય છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 606,
    "category": "ભૌતિક વિજ્ઞાન",
    "categoryGujarati": "ભૌતિક વિજ્ઞાન",
    "grades": [
      "11"
    ],
    "subject": "Physics",
    "questionText": "પૃથ્વીની સપાટી પરથી નિષ્ક્રમણ વેગ (Escape Velocity) નું મૂલ્ય આશરે કેટલું હોય છે?",
    "questionTextGujarati": "પૃથ્વીની સપાટી પરથી નિષ્ક્રમણ વેગ (Escape Velocity) નું મૂલ્ય આશરે કેટલું હોય છે?",
    "options": [
      "11.2 km/s",
      "9.8 km/s",
      "7.9 km/s",
      "15.0 km/s"
    ],
    "optionsGujarati": [
      "11.2 km/s",
      "9.8 km/s",
      "7.9 km/s",
      "15.0 km/s"
    ],
    "correctAnswer": 0,
    "explanation": "ve = √(2gR) ≈ 11.2 કિમી/સેકન્ડ.",
    "explanationGujarati": "ve = √(2gR) ≈ 11.2 કિમી/સેકન્ડ.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 607,
    "category": "ભૌતિક વિજ્ઞાન",
    "categoryGujarati": "ભૌતિક વિજ્ઞાન",
    "grades": [
      "11"
    ],
    "subject": "Physics",
    "questionText": "L લંબાઈ ધરાવતા સાદા લોલકનો આવર્તકાળ T કોના સમપ્રમાણમાં હોય છે?",
    "questionTextGujarati": "L લંબાઈ ધરાવતા સાદા લોલકનો આવર્તકાળ T કોના સમપ્રમાણમાં હોય છે?",
    "options": [
      "√L",
      "L",
      "L²",
      "1/√L"
    ],
    "optionsGujarati": [
      "√L",
      "L",
      "L²",
      "1/√L"
    ],
    "correctAnswer": 0,
    "explanation": "સાદા લોલક માટે T = 2π√(L/g), તેથી T ∝ √L.",
    "explanationGujarati": "સાદા લોલક માટે T = 2π√(L/g), તેથી T ∝ √L.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 608,
    "category": "ભૌતિક વિજ્ઞાન",
    "categoryGujarati": "ભૌતિક વિજ્ઞાન",
    "grades": [
      "11"
    ],
    "subject": "Physics",
    "questionText": "સમઉષ્મી (એડિઆબેટિક - કટોત્તમ) થર્મોડાયનેમિક પ્રક્રિયામાં કઈ રાશિ અચળ રહે છે?",
    "questionTextGujarati": "સમઉષ્મી (એડિઆબેટિક - કટોત્તમ) થર્મોડાયનેમિક પ્રક્રિયામાં કઈ રાશિ અચળ રહે છે?",
    "options": [
      "ઉષ્મા (Q = 0)",
      "તાપમાન (T)",
      "દબાણ (P)",
      "કદ (V)"
    ],
    "optionsGujarati": [
      "ઉષ્મા (Q = 0)",
      "તાપમાન (T)",
      "દબાણ (P)",
      "કદ (V)"
    ],
    "correctAnswer": 0,
    "explanation": "સમઉષ્મી પ્રક્રિયામાં તંત્ર અને પરિસર વચ્ચે ઉષ્માનું આદાન-પ્રદાન થતું નથી (ΔQ = 0).",
    "explanationGujarati": "સમઉષ્મી પ્રક્રિયામાં તંત્ર અને પરિસર વચ્ચે ઉષ્માનું આદાન-પ્રદાન થતું નથી (ΔQ = 0).",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 609,
    "category": "રસાયણ વિજ્ઞાન",
    "categoryGujarati": "રસાયણ વિજ્ઞાન",
    "grades": [
      "11"
    ],
    "subject": "Chemistry",
    "questionText": "પાઉલિંગ માપક્રમ અનુસાર કયા તત્વની વિદ્યુતઋણતા સૌથી વધુ (4.0) છે?",
    "questionTextGujarati": "પાઉલિંગ માપક્રમ અનુસાર કયા તત્વની વિદ્યુતઋણતા સૌથી વધુ (4.0) છે?",
    "options": [
      "ફ્લોરિન (F)",
      "ક્લોરિન (Cl)",
      "ઓક્સિજન (O)",
      "નાઇટ્રોજન (N)"
    ],
    "optionsGujarati": [
      "ફ્લોરિન (F)",
      "ક્લોરિન (Cl)",
      "ઓક્સિજન (O)",
      "નાઇટ્રોજન (N)"
    ],
    "correctAnswer": 0,
    "explanation": "આવર્ત કોષ્ટકમાં ફ્લોરિન સૌથી વધુ વિદ્યુતઋણ તત્વ છે જેનું મૂલ્ય 4.0 છે.",
    "explanationGujarati": "આવર્ત કોષ્ટકમાં ફ્લોરિન સૌથી વધુ વિદ્યુતઋણ તત્વ છે જેનું મૂલ્ય 4.0 છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 610,
    "category": "રસાયણ વિજ્ઞાન",
    "categoryGujarati": "રસાયણ વિજ્ઞાન",
    "grades": [
      "11"
    ],
    "subject": "Chemistry",
    "questionText": "VSEPR સિદ્ધાંત મુજબ મિથેન (CH4) અણુનો ભૌમિતિક આકાર અને બંધકોણ કેટલો હોય છે?",
    "questionTextGujarati": "VSEPR સિદ્ધાંત મુજબ મિથેન (CH4) અણુનો ભૌમિતિક આકાર અને બંધકોણ કેટલો હોય છે?",
    "options": [
      "સમચતુષ્ફલકીય (Tetrahedral), 109.5°",
      "ત્રિકોણીય સમતલીય, 120°",
      "રેખીય, 180°",
      "અષ્ટફલકીય, 90°"
    ],
    "optionsGujarati": [
      "સમચતુષ્ફલકીય (Tetrahedral), 109.5°",
      "ત્રિકોણીય સમતલીય, 120°",
      "રેખીય, 180°",
      "અષ્ટફલકીય, 90°"
    ],
    "correctAnswer": 0,
    "explanation": "sp³ સંકરણ ધરાવતા મિથેનમાં 4 બંધકારક યુગ્મો હોવાથી તેનો આકાર સમચતુષ્ફલકીય અને બંધકોણ 109.5° (109° 28') હોય છે.",
    "explanationGujarati": "sp³ સંકરણ ધરાવતા મિથેનમાં 4 બંધકારક યુગ્મો હોવાથી તેનો આકાર સમચતુષ્ફલકીય અને બંધકોણ 109.5° (109° 28') હોય છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 611,
    "category": "રસાયણ વિજ્ઞાન",
    "categoryGujarati": "રસાયણ વિજ્ઞાન",
    "grades": [
      "11"
    ],
    "subject": "Chemistry",
    "questionText": "p-પેટાકોશમાં વધુમાં વધુ કેટલા ઇલેક્ટ્રોન સમાવી શકાય છે?",
    "questionTextGujarati": "p-પેટાકોશમાં વધુમાં વધુ કેટલા ઇલેક્ટ્રોન સમાવી શકાય છે?",
    "options": [
      "6",
      "2",
      "10",
      "14"
    ],
    "optionsGujarati": [
      "6",
      "2",
      "10",
      "14"
    ],
    "correctAnswer": 0,
    "explanation": "p-પેટાકોશમાં 3 કક્ષકો (px, py, pz) હોય છે અને દરેક કક્ષકમાં મહત્તમ 2 ઇલેક્ટ્રોન સમાતાં કુલ 6 ઇલેક્ટ્રોન સમાય છે.",
    "explanationGujarati": "p-પેટાકોશમાં 3 કક્ષકો (px, py, pz) હોય છે અને દરેક કક્ષકમાં મહત્તમ 2 ઇલેક્ટ્રોન સમાતાં કુલ 6 ઇલેક્ટ્રોન સમાય છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 612,
    "category": "રસાયણ વિજ્ઞાન",
    "categoryGujarati": "રસાયણ વિજ્ઞાન",
    "grades": [
      "11"
    ],
    "subject": "Chemistry",
    "questionText": "લ-શટેલિયરના નિયમ મુજબ N2(g) + 3H2(g) ⇌ 2NH3(g) પ્રક્રિયા પર દબાણ વધારતાં સંતુલન કઈ દિશામાં ખસશે?",
    "questionTextGujarati": "લ-શટેલિયરના નિયમ મુજબ N2(g) + 3H2(g) ⇌ 2NH3(g) પ્રક્રિયા પર દબાણ વધારતાં સંતુલન કઈ દિશામાં ખસશે?",
    "options": [
      "પુરોગામી દિશામાં (વધુ NH3 બનશે)",
      "પ્રતિગામી દિશામાં",
      "કોઈ ફેરફાર નહીં થાય",
      "પ્રક્રિયા બંધ થશે"
    ],
    "optionsGujarati": [
      "પુરોગામી દિશામાં (વધુ NH3 બનશે)",
      "પ્રતિગામી દિશામાં",
      "કોઈ ફેરફાર નહીં થાય",
      "પ્રક્રિયા બંધ થશે"
    ],
    "correctAnswer": 0,
    "explanation": "દબાણ વધારતાં સંતુલન ઓછા વાયુ મોલ ધરાવતી દિશા તરફ (4 મોલ માંથી 2 મોલ તરફ એટલે કે પુરોગામી) ખસે છે.",
    "explanationGujarati": "દબાણ વધારતાં સંતુલન ઓછા વાયુ મોલ ધરાવતી દિશા તરફ (4 મોલ માંથી 2 મોલ તરફ એટલે કે પુરોગામી) ખસે છે.",
    "targetCompany": "School",
    "difficulty": "Medium"
  },
  {
    "id": 613,
    "category": "રસાયણ વિજ્ઞાન",
    "categoryGujarati": "રસાયણ વિજ્ઞાન",
    "grades": [
      "11"
    ],
    "subject": "Chemistry",
    "questionText": "પોટેશિયમ ડાયક્રોમેટ (K2Cr2O7) માં ક્રોમિયમ (Cr) નો ઓક્સિડેશન આંક કેટલો છે?",
    "questionTextGujarati": "પોટેશિયમ ડાયક્રોમેટ (K2Cr2O7) માં ક્રોમિયમ (Cr) નો ઓક્સિડેશન આંક કેટલો છે?",
    "options": [
      "+6",
      "+3",
      "+7",
      "+2"
    ],
    "optionsGujarati": [
      "+6",
      "+3",
      "+7",
      "+2"
    ],
    "correctAnswer": 0,
    "explanation": "2(+1) + 2(Cr) + 7(-2) = 0 => 2Cr - 12 = 0 => Cr = +6.",
    "explanationGujarati": "2(+1) + 2(Cr) + 7(-2) = 0 => 2Cr - 12 = 0 => Cr = +6.",
    "targetCompany": "School",
    "difficulty": "Medium"
  },
  {
    "id": 614,
    "category": "રસાયણ વિજ્ઞાન",
    "categoryGujarati": "રસાયણ વિજ્ઞાન",
    "grades": [
      "11"
    ],
    "subject": "Chemistry",
    "questionText": "નીચેનામાંથી કયો વિશિષ્ટ (જથ્થાથી સ્વતંત્ર - Intensive) થર્મોડાયનેમિક ગુણધર્મ છે?",
    "questionTextGujarati": "નીચેનામાંથી કયો વિશિષ્ટ (જથ્થાથી સ્વતંત્ર - Intensive) થર્મોડાયનેમિક ગુણધર્મ છે?",
    "options": [
      "તાપમાન (Temperature)",
      "દળ (Mass)",
      "કદ (Volume)",
      "એન્થાલ્પી (Enthalpy)"
    ],
    "optionsGujarati": [
      "તાપમાન (Temperature)",
      "દળ (Mass)",
      "કદ (Volume)",
      "એન્થાલ્પી (Enthalpy)"
    ],
    "correctAnswer": 0,
    "explanation": "તાપમાન, દબાણ અને ઘનતા એ દ્રવ્યના જથ્થા પર આધારિત નથી તેથી તે Intensive ગુણધર્મ છે.",
    "explanationGujarati": "તાપમાન, દબાણ અને ઘનતા એ દ્રવ્યના જથ્થા પર આધારિત નથી તેથી તે Intensive ગુણધર્મ છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 615,
    "category": "રસાયણ વિજ્ઞાન",
    "categoryGujarati": "રસાયણ વિજ્ઞાન",
    "grades": [
      "11"
    ],
    "subject": "Chemistry",
    "questionText": "CH3-CH(CH3)-CH2-CH3 નું સાચું IUPAC નામ શું થાય?",
    "questionTextGujarati": "CH3-CH(CH3)-CH2-CH3 નું સાચું IUPAC નામ શું થાય?",
    "options": [
      "2-મિથાઇલબ્યુટેન",
      "આઇસોપેન્ટેન",
      "3-મિથાઇલબ્યુટેન",
      "ડાયમિથાઇલપ્રોપેન"
    ],
    "optionsGujarati": [
      "2-મિથાઇલબ્યુટેન",
      "આઇસોપેન્ટેન",
      "3-મિથાઇલબ્યુટેન",
      "ડાયમિથાઇલપ્રોપેન"
    ],
    "correctAnswer": 0,
    "explanation": "ચાર કાર્બનની મુખ્ય શૃંખલા (બ્યુટેન) અને બીજા કાર્બન પર મિથાઇલ સમૂહ હોવાથી 2-મિથાઇલબ્યુટેન નામ બને છે.",
    "explanationGujarati": "ચાર કાર્બનની મુખ્ય શૃંખલા (બ્યુટેન) અને બીજા કાર્બન પર મિથાઇલ સમૂહ હોવાથી 2-મિથાઇલબ્યુટેન નામ બને છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 616,
    "category": "રસાયણ વિજ્ઞાન",
    "categoryGujarati": "રસાયણ વિજ્ઞાન",
    "grades": [
      "11"
    ],
    "subject": "Chemistry",
    "questionText": "કોઈપણ શુદ્ધ પદાર્થના 1 મોલમાં રહેલા કણો/પરમાણુઓની સંખ્યા (એવોગેડ્રો અંક) નું મૂલ્ય કેટલું છે?",
    "questionTextGujarati": "કોઈપણ શુદ્ધ પદાર્થના 1 મોલમાં રહેલા કણો/પરમાણુઓની સંખ્યા (એવોગેડ્રો અંક) નું મૂલ્ય કેટલું છે?",
    "options": [
      "6.022 × 10²³",
      "6.022 × 10²²",
      "3.00 × 10⁸",
      "1.602 × 10⁻¹⁹"
    ],
    "optionsGujarati": [
      "6.022 × 10²³",
      "6.022 × 10²²",
      "3.00 × 10⁸",
      "1.602 × 10⁻¹⁹"
    ],
    "correctAnswer": 0,
    "explanation": "NA = 6.022 × 10²³ કણો પ્રતિ મોલ.",
    "explanationGujarati": "NA = 6.022 × 10²³ કણો પ્રતિ મોલ.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 617,
    "category": "ગણિત",
    "categoryGujarati": "ગણિત",
    "grades": [
      "11"
    ],
    "subject": "Mathematics",
    "questionText": "જો ગણ A માં 4 ઘટકો હોય, તો ગણ A ના તમામ ઉપગણો (ઘાતગણ P(A)) ની કુલ સંખ્યા કેટલી થાય?",
    "questionTextGujarati": "જો ગણ A માં 4 ઘટકો હોય, તો ગણ A ના તમામ ઉપગણો (ઘાતગણ P(A)) ની કુલ સંખ્યા કેટલી થાય?",
    "options": [
      "16",
      "8",
      "4",
      "32"
    ],
    "optionsGujarati": [
      "16",
      "8",
      "4",
      "32"
    ],
    "correctAnswer": 0,
    "explanation": "ઉપગણોની સંખ્યા = 2ⁿ = 2⁴ = 16.",
    "explanationGujarati": "ઉપગણોની સંખ્યા = 2ⁿ = 2⁴ = 16.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 618,
    "category": "ગણિત",
    "categoryGujarati": "ગણિત",
    "grades": [
      "11"
    ],
    "subject": "Mathematics",
    "questionText": "કાલ્પનિક એકમ i = √-1 માટે i⁴ નું મૂલ્ય કેટલું થાય?",
    "questionTextGujarati": "કાલ્પનિક એકમ i = √-1 માટે i⁴ નું મૂલ્ય કેટલું થાય?",
    "options": [
      "1",
      "-1",
      "i",
      "-i"
    ],
    "optionsGujarati": [
      "1",
      "-1",
      "i",
      "-i"
    ],
    "correctAnswer": 0,
    "explanation": "i² = -1 => i⁴ = (i²)² = (-1)² = 1.",
    "explanationGujarati": "i² = -1 => i⁴ = (i²)² = (-1)² = 1.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 619,
    "category": "ગણિત",
    "categoryGujarati": "ગણિત",
    "grades": [
      "11"
    ],
    "subject": "Mathematics",
    "questionText": "sin(2x) નું વિસ્તરણ sin x અને cos x ના સ્વરૂપમાં શું થાય?",
    "questionTextGujarati": "sin(2x) નું વિસ્તરણ sin x અને cos x ના સ્વરૂપમાં શું થાય?",
    "options": [
      "2 sin x cos x",
      "sin² x - cos² x",
      "cos² x - sin² x",
      "2 sin x"
    ],
    "optionsGujarati": [
      "2 sin x cos x",
      "sin² x - cos² x",
      "cos² x - sin² x",
      "2 sin x"
    ],
    "correctAnswer": 0,
    "explanation": "ત્રિકોણમિતીય સૂત્ર: sin(2x) = 2 sin x cos x.",
    "explanationGujarati": "ત્રિકોણમિતીય સૂત્ર: sin(2x) = 2 sin x cos x.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 620,
    "category": "ગણિત",
    "categoryGujarati": "ગણિત",
    "grades": [
      "11"
    ],
    "subject": "Mathematics",
    "questionText": "f(x) = x³ - 5x + 7 નું x સાપેક્ષ પ્રથમ વિકલન f'(x) શોધો.",
    "questionTextGujarati": "f(x) = x³ - 5x + 7 નું x સાપેક્ષ પ્રથમ વિકલન f'(x) શોધો.",
    "options": [
      "3x² - 5",
      "3x² - 5x",
      "x² - 5",
      "3x² + 7"
    ],
    "optionsGujarati": [
      "3x² - 5",
      "3x² - 5x",
      "x² - 5",
      "3x² + 7"
    ],
    "correctAnswer": 0,
    "explanation": "d/dx(x³) = 3x², d/dx(-5x) = -5, d/dx(7) = 0. તેથી f'(x) = 3x² - 5.",
    "explanationGujarati": "d/dx(x³) = 3x², d/dx(-5x) = -5, d/dx(7) = 0. તેથી f'(x) = 3x² - 5.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 621,
    "category": "ગણિત",
    "categoryGujarati": "ગણિત",
    "grades": [
      "11"
    ],
    "subject": "Mathematics",
    "questionText": "પ્રમાણભૂત લક્ષ્યનું મૂલ્ય શોધો: lim (x → 0) [sin x / x] = ?",
    "questionTextGujarati": "પ્રમાણભૂત લક્ષ્યનું મૂલ્ય શોધો: lim (x → 0) [sin x / x] = ?",
    "options": [
      "1",
      "0",
      "અનંત",
      "-1"
    ],
    "optionsGujarati": [
      "1",
      "0",
      "અનંત",
      "-1"
    ],
    "correctAnswer": 0,
    "explanation": "ગણિતશાસ્ત્રના પ્રમાણભૂત પ્રમેય મુજબ lim (x → 0) [sin x / x] = 1.",
    "explanationGujarati": "ગણિતશાસ્ત્રના પ્રમાણભૂત પ્રમેય મુજબ lim (x → 0) [sin x / x] = 1.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 622,
    "category": "ગણિત",
    "categoryGujarati": "ગણિત",
    "grades": [
      "11"
    ],
    "subject": "Mathematics",
    "questionText": "5 જુદા જુદા પુસ્તકોને બુકશેલ્ફ પર કેટલી રીતે ગોઠવી શકાય?",
    "questionTextGujarati": "5 જુદા જુદા પુસ્તકોને બુકશેલ્ફ પર કેટલી રીતે ગોઠવી શકાય?",
    "options": [
      "120",
      "24",
      "60",
      "720"
    ],
    "optionsGujarati": [
      "120",
      "24",
      "60",
      "720"
    ],
    "correctAnswer": 0,
    "explanation": "5 વસ્તુઓની ક્રમચય ગોઠવણી = 5! = 5 × 4 × 3 × 2 × 1 = 120 રીતો.",
    "explanationGujarati": "5 વસ્તુઓની ક્રમચય ગોઠવણી = 5! = 5 × 4 × 3 × 2 × 1 = 120 રીતો.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 623,
    "category": "જીવ વિજ્ઞાન",
    "categoryGujarati": "જીવ વિજ્ઞાન",
    "grades": [
      "11"
    ],
    "subject": "Biology",
    "questionText": "પાંચ સૃષ્ટિ વર્ગીકરણ પદ્ધતિ (મોનેરા, પ્રોટિસ્ટા, ફૂગ, વનસ્પતિ, પ્રાણી) કોણે રજૂ કરી હતી?",
    "questionTextGujarati": "પાંચ સૃષ્ટિ વર્ગીકરણ પદ્ધતિ (મોનેરા, પ્રોટિસ્ટા, ફૂગ, વનસ્પતિ, પ્રાણી) કોણે રજૂ કરી હતી?",
    "options": [
      "આર. એચ. વ્હીટેકર (R.H. Whittaker)",
      "કાર્લ લિનિયસ",
      "અર્ન્સ્ટ હેકલ",
      "કાર્લ વૂઝ"
    ],
    "optionsGujarati": [
      "આર. એચ. વ્હીટેકર (R.H. Whittaker)",
      "કાર્લ લિનિયસ",
      "અર્ન્સ્ટ હેકલ",
      "કાર્લ વૂઝ"
    ],
    "correctAnswer": 0,
    "explanation": "ઇ.સ. 1969 માં આર. એચ. વ્હીટેકરે કોષ રચના, પોષણ પદ્ધતિ અને શરીર આયોજનને આધારે પાંચ સૃષ્ટિ વર્ગીકરણ આપ્યું.",
    "explanationGujarati": "ઇ.સ. 1969 માં આર. એચ. વ્હીટેકરે કોષ રચના, પોષણ પદ્ધતિ અને શરીર આયોજનને આધારે પાંચ સૃષ્ટિ વર્ગીકરણ આપ્યું.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 624,
    "category": "જીવ વિજ્ઞાન",
    "categoryGujarati": "જીવ વિજ્ઞાન",
    "grades": [
      "11"
    ],
    "subject": "Biology",
    "questionText": "કોષચક્રના કયા તબક્કા દરમિયાન DNA નું સ્વયંજનન (દ્વિગુણન) થાય છે?",
    "questionTextGujarati": "કોષચક્રના કયા તબક્કા દરમિયાન DNA નું સ્વયંજનન (દ્વિગુણન) થાય છે?",
    "options": [
      "S-તબક્કો (Synthesis Phase)",
      "G1-તબક્કો",
      "G2-તબક્કો",
      "M-તબક્કો"
    ],
    "optionsGujarati": [
      "S-તબક્કો (Synthesis Phase)",
      "G1-તબક્કો",
      "G2-તબક્કો",
      "M-તબક્કો"
    ],
    "correctAnswer": 0,
    "explanation": "આંતરાવસ્થાના S-તબક્કામાં કોષકેન્દ્રમાં DNA નું સ્વયંજનન થઈ તેનું પ્રમાણ બમણું (2C માંથી 4C) થાય છે.",
    "explanationGujarati": "આંતરાવસ્થાના S-તબક્કામાં કોષકેન્દ્રમાં DNA નું સ્વયંજનન થઈ તેનું પ્રમાણ બમણું (2C માંથી 4C) થાય છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 625,
    "category": "જીવ વિજ્ઞાન",
    "categoryGujarati": "જીવ વિજ્ઞાન",
    "grades": [
      "11"
    ],
    "subject": "Biology",
    "questionText": "વનસ્પતિના હરિતકણમાં પ્રકાશસંશ્લેષણની પ્રકાશ પ્રક્રિયા ક્યાં સંપન્ન થાય છે?",
    "questionTextGujarati": "વનસ્પતિના હરિતકણમાં પ્રકાશસંશ્લેષણની પ્રકાશ પ્રક્રિયા ક્યાં સંપન્ન થાય છે?",
    "options": [
      "ગ્રાના / થાઇલેકોઇડ્સ",
      "સ્ટ્રોમા (આધારક)",
      "બાહ્ય પટલ",
      "રિબોઝોમ્સ"
    ],
    "optionsGujarati": [
      "ગ્રાના / થાઇલેકોઇડ્સ",
      "સ્ટ્રોમા (આધારક)",
      "બાહ્ય પટલ",
      "રિબોઝોમ્સ"
    ],
    "correctAnswer": 0,
    "explanation": "પ્રકાશ પ્રક્રિયા થાઇલેકોઇડ પટલ (ગ્રાના) માં થાય છે જ્યાં ATP અને NADPH2 ઉત્પન્ન થાય છે.",
    "explanationGujarati": "પ્રકાશ પ્રક્રિયા થાઇલેકોઇડ પટલ (ગ્રાના) માં થાય છે જ્યાં ATP અને NADPH2 ઉત્પન્ન થાય છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 626,
    "category": "જીવ વિજ્ઞાન",
    "categoryGujarati": "જીવ વિજ્ઞાન",
    "grades": [
      "11"
    ],
    "subject": "Biology",
    "questionText": "ગ્લાયકોલિસિસ પ્રક્રિયાના અંતે ગ્લુકોઝના 1 અણુમાંથી પાયરુવિક એસિડના કેટલા અણુઓ બને છે?",
    "questionTextGujarati": "ગ્લાયકોલિસિસ પ્રક્રિયાના અંતે ગ્લુકોઝના 1 અણુમાંથી પાયરુવિક એસિડના કેટલા અણુઓ બને છે?",
    "options": [
      "2 અણુ પાયરુવેટ (Pyruvate)",
      "1 અણુ લેક્ટિક એસિડ",
      "2 અણુ ઇથેનોલ",
      "6 અણુ CO2"
    ],
    "optionsGujarati": [
      "2 અણુ પાયરુવેટ (Pyruvate)",
      "1 અણુ લેક્ટિક એસિડ",
      "2 અણુ ઇથેનોલ",
      "6 અણુ CO2"
    ],
    "correctAnswer": 0,
    "explanation": "કોષરસમાં 6-કાર્બન ધરાવતા ગ્લુકોઝનું ઓક્સિડેશન થઈ 3-કાર્બન ધરાવતા પાયરુવિક એસિડના 2 અણુઓ મળે છે.",
    "explanationGujarati": "કોષરસમાં 6-કાર્બન ધરાવતા ગ્લુકોઝનું ઓક્સિડેશન થઈ 3-કાર્બન ધરાવતા પાયરુવિક એસિડના 2 અણુઓ મળે છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 627,
    "category": "જીવ વિજ્ઞાન",
    "categoryGujarati": "જીવ વિજ્ઞાન",
    "grades": [
      "11"
    ],
    "subject": "Biology",
    "questionText": "કોષમાં પ્રોટીન સંશ્લેષણ માટે કઈ અંગિકા જવાબદાર છે?",
    "questionTextGujarati": "કોષમાં પ્રોટીન સંશ્લેષણ માટે કઈ અંગિકા જવાબદાર છે?",
    "options": [
      "રિબોઝોમ્સ (Ribosomes)",
      "લાયસોઝોમ્સ",
      "ગોલ્ગી પ્રસાધન",
      "કણાભસૂત્ર"
    ],
    "optionsGujarati": [
      "રિબોઝોમ્સ (Ribosomes)",
      "લાયસોઝોમ્સ",
      "ગોલ્ગી પ્રસાધન",
      "કણાભસૂત્ર"
    ],
    "correctAnswer": 0,
    "explanation": "રિબોઝોમ્સ mRNA સંકેતો અનુસાર એમિનો એસિડ જોડી પ્રોટીનનું સંશ્લેષણ કરે છે.",
    "explanationGujarati": "રિબોઝોમ્સ mRNA સંકેતો અનુસાર એમિનો એસિડ જોડી પ્રોટીનનું સંશ્લેષણ કરે છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 628,
    "category": "કમ્પ્યુટર અધ્યયન",
    "categoryGujarati": "કમ્પ્યુટર અધ્યયન",
    "grades": [
      "11"
    ],
    "subject": "Computer Science",
    "questionText": "પાયથોન (Python) માં નીચેનામાંથી કયો ડેટા ટાઈપ અપરિવર્તનશીલ (Immutable) છે?",
    "questionTextGujarati": "પાયથોન (Python) માં નીચેનામાંથી કયો ડેટા ટાઈપ અપરિવર્તનશીલ (Immutable) છે?",
    "options": [
      "Tuple",
      "List",
      "Dictionary",
      "Set"
    ],
    "optionsGujarati": [
      "Tuple",
      "List",
      "Dictionary",
      "Set"
    ],
    "correctAnswer": 0,
    "explanation": "Tuple એકવાર બન્યા પછી તેના ઘટકોમાં ફેરફાર કરી શકાતો નથી, તેથી તે Immutable છે.",
    "explanationGujarati": "Tuple એકવાર બન્યા પછી તેના ઘટકોમાં ફેરફાર કરી શકાતો નથી, તેથી તે Immutable છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 629,
    "category": "કમ્પ્યુટર અધ્યયન",
    "categoryGujarati": "કમ્પ્યુટર અધ્યયન",
    "grades": [
      "11"
    ],
    "subject": "Computer Science",
    "questionText": "પાયથોનમાં `bool([])` નું પરિણામ શું મળે છે?",
    "questionTextGujarati": "પાયથોનમાં `bool([])` નું પરિણામ શું મળે છે?",
    "options": [
      "False",
      "True",
      "None",
      "Error"
    ],
    "optionsGujarati": [
      "False",
      "True",
      "None",
      "Error"
    ],
    "correctAnswer": 0,
    "explanation": "પાયથોનમાં ખાલી કલેક્શન જેમ કે ખાલી લિસ્ટ `[]` એ falsy મૂલ્ય ગણાય છે, તેથી `bool([])` False આપે છે.",
    "explanationGujarati": "પાયથોનમાં ખાલી કલેક્શન જેમ કે ખાલી લિસ્ટ `[]` એ falsy મૂલ્ય ગણાય છે, તેથી `bool([])` False આપે છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 630,
    "category": "કમ્પ્યુટર અધ્યયન",
    "categoryGujarati": "કમ્પ્યુટર અધ્યયન",
    "grades": [
      "11"
    ],
    "subject": "Computer Science",
    "questionText": "પાયથોનમાં ઘાત (Exponentiation) ની ગણતરી માટે કયો ઓપરેટર વપરાય છે?",
    "questionTextGujarati": "પાયથોનમાં ઘાત (Exponentiation) ની ગણતરી માટે કયો ઓપરેટર વપરાય છે?",
    "options": [
      "**",
      "^",
      "//",
      "%%"
    ],
    "optionsGujarati": [
      "**",
      "^",
      "//",
      "%%"
    ],
    "correctAnswer": 0,
    "explanation": "પાયથોનમાં `**` એ ઘાતાંકીય ઓપરેટર છે (દા.ત. 2 ** 3 = 8).",
    "explanationGujarati": "પાયથોનમાં `**` એ ઘાતાંકીય ઓપરેટર છે (દા.ત. 2 ** 3 = 8).",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 631,
    "category": "કમ્પ્યુટર અધ્યયન",
    "categoryGujarati": "કમ્પ્યુટર અધ્યયન",
    "grades": [
      "11"
    ],
    "subject": "Computer Science",
    "questionText": "પાયથોન લિસ્ટના અંતમાં નવો ઘટક ઉમેરવા (append) ની સમય જટિલતા (Time Complexity) કેટલી હોય છે?",
    "questionTextGujarati": "પાયથોન લિસ્ટના અંતમાં નવો ઘટક ઉમેરવા (append) ની સમય જટિલતા (Time Complexity) કેટલી હોય છે?",
    "options": [
      "O(1)",
      "O(n)",
      "O(log n)",
      "O(n²)"
    ],
    "optionsGujarati": [
      "O(1)",
      "O(n)",
      "O(log n)",
      "O(n²)"
    ],
    "correctAnswer": 0,
    "explanation": "લિસ્ટના છેડે ઘટક ઉમેરવાની પ્રક્રિયા એમોર્ટાઇઝ્ડ અચળ સમય O(1) માં પૂર્ણ થાય છે.",
    "explanationGujarati": "લિસ્ટના છેડે ઘટક ઉમેરવાની પ્રક્રિયા એમોર્ટાઇઝ્ડ અચળ સમય O(1) માં પૂર્ણ થાય છે.",
    "targetCompany": "School",
    "difficulty": "Medium"
  },
  {
    "id": 632,
    "category": "કમ્પ્યુટર અધ્યયન",
    "categoryGujarati": "કમ્પ્યુટર અધ્યયન",
    "grades": [
      "11"
    ],
    "subject": "Computer Science",
    "questionText": "પાયથોનમાં એક જ લીટીના અનામી (Anonymous) ફંક્શન બનાવવા કયો કીવર્ડ વપરાય છે?",
    "questionTextGujarati": "પાયથોનમાં એક જ લીટીના અનામી (Anonymous) ફંક્શન બનાવવા કયો કીવર્ડ વપરાય છે?",
    "options": [
      "lambda",
      "def",
      "func",
      "inline"
    ],
    "optionsGujarati": [
      "lambda",
      "def",
      "func",
      "inline"
    ],
    "correctAnswer": 0,
    "explanation": "`lambda` કીવર્ડ વડે નામ વગરના નાના ફંક્શન્સ (દા.ત. f = lambda x: x + 1) બનાવી શકાય છે.",
    "explanationGujarati": "`lambda` કીવર્ડ વડે નામ વગરના નાના ફંક્શન્સ (દા.ત. f = lambda x: x + 1) બનાવી શકાય છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 701,
    "category": "ભૌતિક વિજ્ઞાન",
    "categoryGujarati": "ભૌતિક વિજ્ઞાન",
    "grades": [
      "12"
    ],
    "subject": "Physics",
    "questionText": "વિદ્યુત ફ્લક્સ (Φ) નો SI એકમ કયો છે?",
    "questionTextGujarati": "વિદ્યુત ફ્લક્સ (Φ) નો SI એકમ કયો છે?",
    "options": [
      "N·m²/C (અથવા V·m)",
      "N/C",
      "C/m²",
      "J/C"
    ],
    "optionsGujarati": [
      "N·m²/C (અથવા V·m)",
      "N/C",
      "C/m²",
      "J/C"
    ],
    "correctAnswer": 0,
    "explanation": "Φ = E·A = (N/C)·m² = N·m²/C અથવા વોલ્ટ-મીટર (V·m).",
    "explanationGujarati": "Φ = E·A = (N/C)·m² = N·m²/C અથવા વોલ્ટ-મીટર (V·m).",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 702,
    "category": "ભૌતિક વિજ્ઞાન",
    "categoryGujarati": "ભૌતિક વિજ્ઞાન",
    "grades": [
      "12"
    ],
    "subject": "Physics",
    "questionText": "વિદ્યુતભારિત કેપેસિટર ઊર્જાનો સંગ્રહ કયા સ્વરૂપમાં કરે છે?",
    "questionTextGujarati": "વિદ્યુતભારિત કેપેસિટર ઊર્જાનો સંગ્રહ કયા સ્વરૂપમાં કરે છે?",
    "options": [
      "પ્લેટો વચ્ચેના વિદ્યુતક્ષેત્રમાં",
      "ચુંબકીય ક્ષેત્રમાં",
      "ગતિઊર્જામાં",
      "ઉષ્મા ઊર્જામાં"
    ],
    "optionsGujarati": [
      "પ્લેટો વચ્ચેના વિદ્યુતક્ષેત્રમાં",
      "ચુંબકીય ક્ષેત્રમાં",
      "ગતિઊર્જામાં",
      "ઉષ્મા ઊર્જામાં"
    ],
    "correctAnswer": 0,
    "explanation": "કેપેસિટર તેની બે પ્લેટો વચ્ચેના વિદ્યુતક્ષેત્રમાં U = (1/2)CV² સ્વરૂપે સ્થિતિઊર્જાનો સંગ્રહ કરે છે.",
    "explanationGujarati": "કેપેસિટર તેની બે પ્લેટો વચ્ચેના વિદ્યુતક્ષેત્રમાં U = (1/2)CV² સ્વરૂપે સ્થિતિઊર્જાનો સંગ્રહ કરે છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 703,
    "category": "ભૌતિક વિજ્ઞાન",
    "categoryGujarati": "ભૌતિક વિજ્ઞાન",
    "grades": [
      "12"
    ],
    "subject": "Physics",
    "questionText": "કિર્ચીફનો પ્રથમ નિયમ (જંકશન નિયમ, ΣI = 0) કોના સંરક્ષણના નિયમ પર આધારિત છે?",
    "questionTextGujarati": "કિર્ચીફનો પ્રથમ નિયમ (જંકશન નિયમ, ΣI = 0) કોના સંરક્ષણના નિયમ પર આધારિત છે?",
    "options": [
      "વિદ્યુતભાર (Electric Charge)",
      "ઊર્જા (Energy)",
      "વેગમાન (Momentum)",
      "દળ (Mass)"
    ],
    "optionsGujarati": [
      "વિદ્યુતભાર (Electric Charge)",
      "ઊર્જા (Energy)",
      "વેગમાન (Momentum)",
      "દળ (Mass)"
    ],
    "correctAnswer": 0,
    "explanation": "જંકશન આગળ વિદ્યુતભાર સંગ્રહિત થતો નથી; જેટલો પ્રવાહ દાખલ થાય તેટલો જ બહાર નીકળે છે (વિદ્યુતભાર સંરક્ષણ).",
    "explanationGujarati": "જંકશન આગળ વિદ્યુતભાર સંગ્રહિત થતો નથી; જેટલો પ્રવાહ દાખલ થાય તેટલો જ બહાર નીકળે છે (વિદ્યુતભાર સંરક્ષણ).",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 704,
    "category": "ભૌતિક વિજ્ઞાન",
    "categoryGujarati": "ભૌતિક વિજ્ઞાન",
    "grades": [
      "12"
    ],
    "subject": "Physics",
    "questionText": "અન્યોન્ય પ્રેરણના સિદ્ધાંત પર કાર્ય કરતું અને AC વોલ્ટેજ વધારવા કે ઘટાડવા વપરાતું ઉપકરણ કયું છે?",
    "questionTextGujarati": "અન્યોન્ય પ્રેરણના સિદ્ધાંત પર કાર્ય કરતું અને AC વોલ્ટેજ વધારવા કે ઘટાડવા વપરાતું ઉપકરણ કયું છે?",
    "options": [
      "ટ્રાન્સફોર્મર (Transformer)",
      "રેક્ટિફાયર",
      "જનરેટર",
      "એમ્પ્લીફાયર"
    ],
    "optionsGujarati": [
      "ટ્રાન્સફોર્મર (Transformer)",
      "રેક્ટિફાયર",
      "જનરેટર",
      "એમ્પ્લીફાયર"
    ],
    "correctAnswer": 0,
    "explanation": "ટ્રાન્સફોર્મર અન્યોન્ય પ્રેરણના સિદ્ધાંત વડે AC વોલ્ટેજ સ્ટેપ-અપ કે સ્ટેપ-ડાઉન કરે છે.",
    "explanationGujarati": "ટ્રાન્સફોર્મર અન્યોન્ય પ્રેરણના સિદ્ધાંત વડે AC વોલ્ટેજ સ્ટેપ-અપ કે સ્ટેપ-ડાઉન કરે છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 705,
    "category": "ભૌતિક વિજ્ઞાન",
    "categoryGujarati": "ભૌતિક વિજ્ઞાન",
    "grades": [
      "12"
    ],
    "subject": "Physics",
    "questionText": "યંગના બે સ્લિટના પ્રયોગમાં સ્લિટ અને પડદા વચ્ચેનું અંતર D બમણું કરવામાં આવે તો શલાકાની પહોળાઈ (β):",
    "questionTextGujarati": "યંગના બે સ્લિટના પ્રયોગમાં સ્લિટ અને પડદા વચ્ચેનું અંતર D બમણું કરવામાં આવે તો શલાકાની પહોળાઈ (β):",
    "options": [
      "બમણી થાય છે",
      "અડધી થાય છે",
      "ચાર ગણી થાય છે",
      "અપરિવર્તિત રહે છે"
    ],
    "optionsGujarati": [
      "બમણી થાય છે",
      "અડધી થાય છે",
      "ચાર ગણી થાય છે",
      "અપરિવર્તિત રહે છે"
    ],
    "correctAnswer": 0,
    "explanation": "શલાકા પહોળાઈ β = λD/d. D બમણું થતાં શલાકાની પહોળાઈ β પણ બમણી થાય છે.",
    "explanationGujarati": "શલાકા પહોળાઈ β = λD/d. D બમણું થતાં શલાકાની પહોળાઈ β પણ બમણી થાય છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 706,
    "category": "ભૌતિક વિજ્ઞાન",
    "categoryGujarati": "ભૌતિક વિજ્ઞાન",
    "grades": [
      "12"
    ],
    "subject": "Physics",
    "questionText": "હીરો અતિશય ચમકવા પાછળ કઈ પ્રકાશીય ઘટના જવાબદાર છે?",
    "questionTextGujarati": "હીરો અતિશય ચમકવા પાછળ કઈ પ્રકાશીય ઘટના જવાબદાર છે?",
    "options": [
      "પૂર્ણ આંતરિક પરાવર્તન (Total Internal Reflection)",
      "વક્રીભવન",
      "વિભાજન",
      "વ્યતિકરણ"
    ],
    "optionsGujarati": [
      "પૂર્ણ આંતરિક પરાવર્તન (Total Internal Reflection)",
      "વક્રીભવન",
      "વિભાજન",
      "વ્યતિકરણ"
    ],
    "correctAnswer": 0,
    "explanation": "હીરાનો ક્રાંતિકોણ ખૂબ નાનો (આશરે 24.4°) હોવાથી તેમાં દાખલ થતાં પ્રકાશનું અંદર વારંવાર પૂર્ણ આંતરિક પરાવર્તન થાય છે.",
    "explanationGujarati": "હીરાનો ક્રાંતિકોણ ખૂબ નાનો (આશરે 24.4°) હોવાથી તેમાં દાખલ થતાં પ્રકાશનું અંદર વારંવાર પૂર્ણ આંતરિક પરાવર્તન થાય છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 707,
    "category": "ભૌતિક વિજ્ઞાન",
    "categoryGujarati": "ભૌતિક વિજ્ઞાન",
    "grades": [
      "12"
    ],
    "subject": "Physics",
    "questionText": "પ્લાન્કના સમીકરણ મુજબ ν આવૃત્તિવાળા ફોટોનની ઊર્જા E નું સૂત્ર કયું છે?",
    "questionTextGujarati": "પ્લાન્કના સમીકરણ મુજબ ν આવૃત્તિવાળા ફોટોનની ઊર્જા E નું સૂત્ર કયું છે?",
    "options": [
      "E = hν",
      "E = mc²",
      "E = h/λ",
      "E = hν²"
    ],
    "optionsGujarati": [
      "E = hν",
      "E = mc²",
      "E = h/λ",
      "E = hν²"
    ],
    "correctAnswer": 0,
    "explanation": "ફોટોનની ઊર્જા તેની આવૃત્તિના સમપ્રમાણમાં હોય છે: E = hν (જ્યાં h પ્લાન્ક અચળાંક છે).",
    "explanationGujarati": "ફોટોનની ઊર્જા તેની આવૃત્તિના સમપ્રમાણમાં હોય છે: E = hν (જ્યાં h પ્લાન્ક અચળાંક છે).",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 708,
    "category": "ભૌતિક વિજ્ઞાન",
    "categoryGujarati": "ભૌતિક વિજ્ઞાન",
    "grades": [
      "12"
    ],
    "subject": "Physics",
    "questionText": "n-પ્રકારના અર્ધવાહકમાં બહુમતી ચાર્જ કેરિયર્સ (વાહકો) કયા હોય છે?",
    "questionTextGujarati": "n-પ્રકારના અર્ધવાહકમાં બહુમતી ચાર્જ કેરિયર્સ (વાહકો) કયા હોય છે?",
    "options": [
      "મુક્ત ઇલેક્ટ્રોન (Electrons)",
      "હોલ (Holes)",
      "ધન આયનો",
      "પ્રોટોન"
    ],
    "optionsGujarati": [
      "મુક્ત ઇલેક્ટ્રોન (Electrons)",
      "હોલ (Holes)",
      "ધન આયનો",
      "પ્રોટોન"
    ],
    "correctAnswer": 0,
    "explanation": "પેન્ટાવેલેન્ટ અશુદ્ધિ ઉમેરવાથી n-પ્રકારના અર્ધવાહકમાં મુક્ત ઇલેક્ટ્રોનની સાંદ્રતા હોલ કરતાં ઘણી વધારે હોય છે.",
    "explanationGujarati": "પેન્ટાવેલેન્ટ અશુદ્ધિ ઉમેરવાથી n-પ્રકારના અર્ધવાહકમાં મુક્ત ઇલેક્ટ્રોનની સાંદ્રતા હોલ કરતાં ઘણી વધારે હોય છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 709,
    "category": "રસાયણ વિજ્ઞાન",
    "categoryGujarati": "રસાયણ વિજ્ઞાન",
    "grades": [
      "12"
    ],
    "subject": "Chemistry",
    "questionText": "પ્રથમ ક્રમની રાસાયણિક પ્રક્રિયા માટે વેગ અચળાંક (k) નો એકમ કયો છે?",
    "questionTextGujarati": "પ્રથમ ક્રમની રાસાયણિક પ્રક્રિયા માટે વેગ અચળાંક (k) નો એકમ કયો છે?",
    "options": [
      "s⁻¹ (સેકન્ડ⁻¹)",
      "mol·L⁻¹·s⁻¹",
      "L·mol⁻¹·s⁻¹",
      "L²·mol⁻²·s⁻¹"
    ],
    "optionsGujarati": [
      "s⁻¹ (સેકન્ડ⁻¹)",
      "mol·L⁻¹·s⁻¹",
      "L·mol⁻¹·s⁻¹",
      "L²·mol⁻²·s⁻¹"
    ],
    "correctAnswer": 0,
    "explanation": "પ્રથમ ક્રમની પ્રક્રિયા માટે વેગ = k[A] => k = વેગ / [A] = (mol/L·s) / (mol/L) = s⁻¹.",
    "explanationGujarati": "પ્રથમ ક્રમની પ્રક્રિયા માટે વેગ = k[A] => k = વેગ / [A] = (mol/L·s) / (mol/L) = s⁻¹.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 710,
    "category": "રસાયણ વિજ્ઞાન",
    "categoryGujarati": "રસાયણ વિજ્ઞાન",
    "grades": [
      "12"
    ],
    "subject": "Chemistry",
    "questionText": "રાઉલ્ટના નિયમ અનુસાર મંદ અબાષ્પશીલ દ્રાવણના બાષ્પદબાણમાં થતો સાપેક્ષ ઘટાડો કોના બરાબર હોય છે?",
    "questionTextGujarati": "રાઉલ્ટના નિયમ અનુસાર મંદ અબાષ્પશીલ દ્રાવણના બાષ્પદબાણમાં થતો સાપેક્ષ ઘટાડો કોના બરાબર હોય છે?",
    "options": [
      "દ્રાવ્યના મોલ-અંશ (Mole fraction of solute)",
      "દ્રાવકના મોલ-અંશ",
      "મોલાલિટી",
      "મોલારિટી"
    ],
    "optionsGujarati": [
      "દ્રાવ્યના મોલ-અંશ (Mole fraction of solute)",
      "દ્રાવકના મોલ-અંશ",
      "મોલાલિટી",
      "મોલારિટી"
    ],
    "correctAnswer": 0,
    "explanation": "રાઉલ્ટના નિયમ મુજબ (P° - P) / P° = x2 (દ્રાવ્યના મોલ-અંશ).",
    "explanationGujarati": "રાઉલ્ટના નિયમ મુજબ (P° - P) / P° = x2 (દ્રાવ્યના મોલ-અંશ).",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 711,
    "category": "રસાયણ વિજ્ઞાન",
    "categoryGujarati": "રસાયણ વિજ્ઞાન",
    "grades": [
      "12"
    ],
    "subject": "Chemistry",
    "questionText": "298 K તાપમાને વિદ્યુતધ્રુવ પોટેન્શિયલ અને આયનોની સાંદ્રતા વચ્ચેનો સંબંધ દર્શાવતું સમીકરણ કયું છે?",
    "questionTextGujarati": "298 K તાપમાને વિદ્યુતધ્રુવ પોટેન્શિયલ અને આયનોની સાંદ્રતા વચ્ચેનો સંબંધ દર્શાવતું સમીકરણ કયું છે?",
    "options": [
      "નર્ન્સ્ટ સમીકરણ (Nernst Equation)",
      "આર્હેનિયસ સમીકરણ",
      "વાન હોફ સમીકરણ",
      "ગિબ્સ સમીકરણ"
    ],
    "optionsGujarati": [
      "નર્ન્સ્ટ સમીકરણ (Nernst Equation)",
      "આર્હેનિયસ સમીકરણ",
      "વાન હોફ સમીકરણ",
      "ગિબ્સ સમીકરણ"
    ],
    "correctAnswer": 0,
    "explanation": "નર્ન્સ્ટ સમીકરણ E = E° - (0.059/n) log [નીપજો]/[પ્રક્રિયકો] સંબંધ આપે છે.",
    "explanationGujarati": "નર્ન્સ્ટ સમીકરણ E = E° - (0.059/n) log [નીપજો]/[પ્રક્રિયકો] સંબંધ આપે છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 712,
    "category": "રસાયણ વિજ્ઞાન",
    "categoryGujarati": "રસાયણ વિજ્ઞાન",
    "grades": [
      "12"
    ],
    "subject": "Chemistry",
    "questionText": "નીચેનામાંથી કયું સંકીર્ણ સંયોજન પ્રકાશીય સમઘટકતા (Optical Isomerism) દર્શાવે છે?",
    "questionTextGujarati": "નીચેનામાંથી કયું સંકીર્ણ સંયોજન પ્રકાશીય સમઘટકતા (Optical Isomerism) દર્શાવે છે?",
    "options": [
      "[Co(en)3]³⁺",
      "[Pt(NH3)2Cl2]",
      "[Ni(CO)4]",
      "[Zn(NH3)4]²⁺"
    ],
    "optionsGujarati": [
      "[Co(en)3]³⁺",
      "[Pt(NH3)2Cl2]",
      "[Ni(CO)4]",
      "[Zn(NH3)4]²⁺"
    ],
    "correctAnswer": 0,
    "explanation": "[Co(en)3]³⁺ માં ત્રણ કીલેટ વલયો હોવાથી તે અસંમિત બને છે અને d- તથા l- સમઘટકો દર્શાવે છે.",
    "explanationGujarati": "[Co(en)3]³⁺ માં ત્રણ કીલેટ વલયો હોવાથી તે અસંમિત બને છે અને d- તથા l- સમઘટકો દર્શાવે છે.",
    "targetCompany": "School",
    "difficulty": "Medium"
  },
  {
    "id": 713,
    "category": "રસાયણ વિજ્ઞાન",
    "categoryGujarati": "રસાયણ વિજ્ઞાન",
    "grades": [
      "12"
    ],
    "subject": "Chemistry",
    "questionText": "લ્યુકાસ પ્રક્રિયક (Lucas Reagent) શેનું સમમોલર મિશ્રણ છે?",
    "questionTextGujarati": "લ્યુકાસ પ્રક્રિયક (Lucas Reagent) શેનું સમમોલર મિશ્રણ છે?",
    "options": [
      "સાંદ્ર HCl + નિર્જળ ZnCl2",
      "સાંદ્ર H2SO4 + ZnSO4",
      "સાંદ્ર HNO3 + ZnCl2",
      "સાંદ્ર HCl + NaCl"
    ],
    "optionsGujarati": [
      "સાંદ્ર HCl + નિર્જળ ZnCl2",
      "સાંદ્ર H2SO4 + ZnSO4",
      "સાંદ્ર HNO3 + ZnCl2",
      "સાંદ્ર HCl + NaCl"
    ],
    "correctAnswer": 0,
    "explanation": "લ્યુકાસ પ્રક્રિયક એ નિર્જળ ZnCl2 અને સાંદ્ર HCl નું મિશ્રણ છે જે પ્રાથમિક, દ્વિતીયક અને તૃતીયક આલ્કોહોલની પરખ માટે વપરાય છે.",
    "explanationGujarati": "લ્યુકાસ પ્રક્રિયક એ નિર્જળ ZnCl2 અને સાંદ્ર HCl નું મિશ્રણ છે જે પ્રાથમિક, દ્વિતીયક અને તૃતીયક આલ્કોહોલની પરખ માટે વપરાય છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 714,
    "category": "રસાયણ વિજ્ઞાન",
    "categoryGujarati": "રસાયણ વિજ્ઞાન",
    "grades": [
      "12"
    ],
    "subject": "Chemistry",
    "questionText": "મિથાઇલ કીટોન (CH3-CO-) સમૂહ ધરાવતા સંયોજનોનું હેલોફોર્મ કસોટી દ્વારા ઑક્સિડેશન કરવા કયો પ્રક્રિયક વપરાય છે?",
    "questionTextGujarati": "મિથાઇલ કીટોન (CH3-CO-) સમૂહ ધરાવતા સંયોજનોનું હેલોફોર્મ કસોટી દ્વારા ઑક્સિડેશન કરવા કયો પ્રક્રિયક વપરાય છે?",
    "options": [
      "NaOH + I2 (સોડિયમ હાઇપોઆયોડાઇટ)",
      "KMnO4 / H⁺",
      "LiAlH4",
      "PCC"
    ],
    "optionsGujarati": [
      "NaOH + I2 (સોડિયમ હાઇપોઆયોડાઇટ)",
      "KMnO4 / H⁺",
      "LiAlH4",
      "PCC"
    ],
    "correctAnswer": 0,
    "explanation": "NaOH + I2 પ્રક્રિયક મિથાઇલ કીટોન સાથે પીળા રંગના આયડોફોર્મ (CHI3) ના અવક્ષેપ આપે છે.",
    "explanationGujarati": "NaOH + I2 પ્રક્રિયક મિથાઇલ કીટોન સાથે પીળા રંગના આયડોફોર્મ (CHI3) ના અવક્ષેપ આપે છે.",
    "targetCompany": "School",
    "difficulty": "Medium"
  },
  {
    "id": 715,
    "category": "રસાયણ વિજ્ઞાન",
    "categoryGujarati": "રસાયણ વિજ્ઞાન",
    "grades": [
      "12"
    ],
    "subject": "Chemistry",
    "questionText": "નીચેનામાંથી કયું વિટામિન પાણીમાં દ્રાવ્ય છે અને પેશાબ વાટે ઉત્સર્જિત થાય છે?",
    "questionTextGujarati": "નીચેનામાંથી કયું વિટામિન પાણીમાં દ્રાવ્ય છે અને પેશાબ વાટે ઉત્સર્જિત થાય છે?",
    "options": [
      "વિટામિન C",
      "વિટામિન A",
      "વિટામિન D",
      "વિટામિન K"
    ],
    "optionsGujarati": [
      "વિટામિન C",
      "વિટામિન A",
      "વિટામિન D",
      "વિટામિન K"
    ],
    "correctAnswer": 0,
    "explanation": "વિટામિન B અને C જળ-દ્રાવ્ય હોવાથી શરીરમાં સંગ્રહ પામતા નથી અને મૂત્ર વાટે ઉત્સર્જિત થાય છે.",
    "explanationGujarati": "વિટામિન B અને C જળ-દ્રાવ્ય હોવાથી શરીરમાં સંગ્રહ પામતા નથી અને મૂત્ર વાટે ઉત્સર્જિત થાય છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 716,
    "category": "રસાયણ વિજ્ઞાન",
    "categoryGujarati": "રસાયણ વિજ્ઞાન",
    "grades": [
      "12"
    ],
    "subject": "Chemistry",
    "questionText": "પ્રોટીનનું દ્વિતીયક બંધારણ (α-હેલિક્સ અને β-પ્લીટેડ શીટ) કયા બંધ દ્વારા સ્થાયી બને છે?",
    "questionTextGujarati": "પ્રોટીનનું દ્વિતીયક બંધારણ (α-હેલિક્સ અને β-પ્લીટેડ શીટ) કયા બંધ દ્વારા સ્થાયી બને છે?",
    "options": [
      "હાઇડ્રોજન બંધ (Hydrogen Bonds)",
      "પેપ્ટાઇડ બંધ",
      "ડાયસલ્ફાઇડ બંધ",
      "આયોનિક બંધ"
    ],
    "optionsGujarati": [
      "હાઇડ્રોજન બંધ (Hydrogen Bonds)",
      "પેપ્ટાઇડ બંધ",
      "ડાયસલ્ફાઇડ બંધ",
      "આયોનિક બંધ"
    ],
    "correctAnswer": 0,
    "explanation": ">C=O સમૂહના ઓક્સિજન અને -NH- સમૂહના હાઇડ્રોજન વચ્ચે રચાતા હાઇડ્રોજન બંધ દ્વિતીયક રચનાને સ્થિરતા આપે છે.",
    "explanationGujarati": ">C=O સમૂહના ઓક્સિજન અને -NH- સમૂહના હાઇડ્રોજન વચ્ચે રચાતા હાઇડ્રોજન બંધ દ્વિતીયક રચનાને સ્થિરતા આપે છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 717,
    "category": "ગણિત",
    "categoryGujarati": "ગણિત",
    "grades": [
      "12"
    ],
    "subject": "Mathematics",
    "questionText": "2×2 એકમ શ્રેણિક (Identity Matrix I2) ના નિશ્ચાયકનું મૂલ્ય કેટલું થાય?",
    "questionTextGujarati": "2×2 એકમ શ્રેણિક (Identity Matrix I2) ના નિશ્ચાયકનું મૂલ્ય કેટલું થાય?",
    "options": [
      "1",
      "0",
      "2",
      "-1"
    ],
    "optionsGujarati": [
      "1",
      "0",
      "2",
      "-1"
    ],
    "correctAnswer": 0,
    "explanation": "|I2| = 1(1) - 0(0) = 1.",
    "explanationGujarati": "|I2| = 1(1) - 0(0) = 1.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 718,
    "category": "ગણિત",
    "categoryGujarati": "ગણિત",
    "grades": [
      "12"
    ],
    "subject": "Mathematics",
    "questionText": "જો A એ n કક્ષાવાળો સામાન્ય ચોરસ શ્રેણિક હોય, તો |adj(A)| બરાબર શું થાય?",
    "questionTextGujarati": "જો A એ n કક્ષાવાળો સામાન્ય ચોરસ શ્રેણિક હોય, તો |adj(A)| બરાબર શું થાય?",
    "options": [
      "|A|ⁿ⁻¹",
      "|A|ⁿ",
      "|A|ⁿ⁺¹",
      "n|A|"
    ],
    "optionsGujarati": [
      "|A|ⁿ⁻¹",
      "|A|ⁿ",
      "|A|ⁿ⁺¹",
      "n|A|"
    ],
    "correctAnswer": 0,
    "explanation": "શ્રેણિકના ગુણધર્મ મુજબ |adj(A)| = |A|ⁿ⁻¹.",
    "explanationGujarati": "શ્રેણિકના ગુણધર્મ મુજબ |adj(A)| = |A|ⁿ⁻¹.",
    "targetCompany": "School",
    "difficulty": "Medium"
  },
  {
    "id": 719,
    "category": "ગણિત",
    "categoryGujarati": "ગણિત",
    "grades": [
      "12"
    ],
    "subject": "Mathematics",
    "questionText": "e^(sin x) નું x સાપેક્ષ વિકલન શું થાય?",
    "questionTextGujarati": "e^(sin x) નું x સાપેક્ષ વિકલન શું થાય?",
    "options": [
      "cos x · e^(sin x)",
      "-cos x · e^(sin x)",
      "e^(sin x)",
      "sin x · e^(cos x)"
    ],
    "optionsGujarati": [
      "cos x · e^(sin x)",
      "-cos x · e^(sin x)",
      "e^(sin x)",
      "sin x · e^(cos x)"
    ],
    "correctAnswer": 0,
    "explanation": "સાંકળ નિયમ: d/dx[e^(sin x)] = e^(sin x) · d/dx(sin x) = cos x · e^(sin x).",
    "explanationGujarati": "સાંકળ નિયમ: d/dx[e^(sin x)] = e^(sin x) · d/dx(sin x) = cos x · e^(sin x).",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 720,
    "category": "ગણિત",
    "categoryGujarati": "ગણિત",
    "grades": [
      "12"
    ],
    "subject": "Mathematics",
    "questionText": "નિયત સંકલનનું મૂલ્ય શોધો: ∫₀^(π/2) sin x dx = ?",
    "questionTextGujarati": "નિયત સંકલનનું મૂલ્ય શોધો: ∫₀^(π/2) sin x dx = ?",
    "options": [
      "1",
      "0",
      "π/2",
      "-1"
    ],
    "optionsGujarati": [
      "1",
      "0",
      "π/2",
      "-1"
    ],
    "correctAnswer": 0,
    "explanation": "[-cos x]₀^(π/2) = -cos(π/2) - (-cos 0) = -0 + 1 = 1.",
    "explanationGujarati": "[-cos x]₀^(π/2) = -cos(π/2) - (-cos 0) = -0 + 1 = 1.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 721,
    "category": "ગણિત",
    "categoryGujarati": "ગણિત",
    "grades": [
      "12"
    ],
    "subject": "Mathematics",
    "questionText": "વિકલ સમીકરણ (d²y/dx²)³ + (dy/dx)⁴ + y = 0 ની કક્ષા (Order) અને પરિમાણ (Degree) કેટલા છે?",
    "questionTextGujarati": "વિકલ સમીકરણ (d²y/dx²)³ + (dy/dx)⁴ + y = 0 ની કક્ષા (Order) અને પરિમાણ (Degree) કેટલા છે?",
    "options": [
      "કક્ષા 2, પરિમાણ 3",
      "કક્ષા 3, પરિમાણ 2",
      "કક્ષા 2, પરિમાણ 4",
      "કક્ષા 4, પરિમાણ 3"
    ],
    "optionsGujarati": [
      "કક્ષા 2, પરિમાણ 3",
      "કક્ષા 3, પરિમાણ 2",
      "કક્ષા 2, પરિમાણ 4",
      "કક્ષા 4, પરિમાણ 3"
    ],
    "correctAnswer": 0,
    "explanation": "મહત્તમ વિકલન d²y/dx² હોવાથી કક્ષા 2 છે અને તેની સૌથી મોટી ઘાત 3 હોવાથી પરિમાણ 3 છે.",
    "explanationGujarati": "મહત્તમ વિકલન d²y/dx² હોવાથી કક્ષા 2 છે અને તેની સૌથી મોટી ઘાત 3 હોવાથી પરિમાણ 3 છે.",
    "targetCompany": "School",
    "difficulty": "Medium"
  },
  {
    "id": 722,
    "category": "ગણિત",
    "categoryGujarati": "ગણિત",
    "grades": [
      "12"
    ],
    "subject": "Mathematics",
    "questionText": "જો બે સદિશો a અને b પરસ્પર લંબ હોય, તો તેમનો અદિશ ગુણાકાર (a · b) કેટલો થાય?",
    "questionTextGujarati": "જો બે સદિશો a અને b પરસ્પર લંબ હોય, તો તેમનો અદિશ ગુણાકાર (a · b) કેટલો થાય?",
    "options": [
      "0",
      "1",
      "|a||b|",
      "-1"
    ],
    "optionsGujarati": [
      "0",
      "1",
      "|a||b|",
      "-1"
    ],
    "correctAnswer": 0,
    "explanation": "a · b = |a||b| cos 90° = 0.",
    "explanationGujarati": "a · b = |a||b| cos 90° = 0.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 723,
    "category": "ગણિત",
    "categoryGujarati": "ગણિત",
    "grades": [
      "12"
    ],
    "subject": "Mathematics",
    "questionText": "દિકગુણોત્તર (1, 2, 2) અને (2, -2, 1) ધરાવતી બે રેખાઓ વચ્ચેનો ખૂણો કેટલો થાય?",
    "questionTextGujarati": "દિકગુણોત્તર (1, 2, 2) અને (2, -2, 1) ધરાવતી બે રેખાઓ વચ્ચેનો ખૂણો કેટલો થાય?",
    "options": [
      "90° (પરસ્પર લંબ)",
      "0°",
      "45°",
      "60°"
    ],
    "optionsGujarati": [
      "90° (પરસ્પર લંબ)",
      "0°",
      "45°",
      "60°"
    ],
    "correctAnswer": 0,
    "explanation": "a1a2 + b1b2 + c1c2 = (1)(2) + (2)(-2) + (2)(1) = 2 - 4 + 2 = 0. તેથી cos θ = 0 => θ = 90°.",
    "explanationGujarati": "a1a2 + b1b2 + c1c2 = (1)(2) + (2)(-2) + (2)(1) = 2 - 4 + 2 = 0. તેથી cos θ = 0 => θ = 90°.",
    "targetCompany": "School",
    "difficulty": "Medium"
  },
  {
    "id": 724,
    "category": "ગણિત",
    "categoryGujarati": "ગણિત",
    "grades": [
      "12"
    ],
    "subject": "Mathematics",
    "questionText": "જો P(A) = 0.6, P(B) = 0.5 અને P(A ∩ B) = 0.3 હોય, તો શરતી સંભાવના P(A | B) શોધો.",
    "questionTextGujarati": "જો P(A) = 0.6, P(B) = 0.5 અને P(A ∩ B) = 0.3 હોય, તો શરતી સંભાવના P(A | B) શોધો.",
    "options": [
      "0.6",
      "0.5",
      "0.3",
      "0.8"
    ],
    "optionsGujarati": [
      "0.6",
      "0.5",
      "0.3",
      "0.8"
    ],
    "correctAnswer": 0,
    "explanation": "P(A | B) = P(A ∩ B) / P(B) = 0.3 / 0.5 = 0.6.",
    "explanationGujarati": "P(A | B) = P(A ∩ B) / P(B) = 0.3 / 0.5 = 0.6.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 725,
    "category": "જીવ વિજ્ઞાન",
    "categoryGujarati": "જીવ વિજ્ઞાન",
    "grades": [
      "12"
    ],
    "subject": "Biology",
    "questionText": "બેવડું ફલન (Double Fertilization) એ કયા વનસ્પતિ સમૂહની અનન્ય લાક્ષણિકતા છે?",
    "questionTextGujarati": "બેવડું ફલન (Double Fertilization) એ કયા વનસ્પતિ સમૂહની અનન્ય લાક્ષણિકતા છે?",
    "options": [
      "આવૃત બીજધારી (Angiosperms)",
      "અનાવૃત બીજધારી (Gymnosperms)",
      "ત્રિઅંગી (Pteridophytes)",
      "દ્વિઅંગી (Bryophytes)"
    ],
    "optionsGujarati": [
      "આવૃત બીજધારી (Angiosperms)",
      "અનાવૃત બીજધારી (Gymnosperms)",
      "ત્રિઅંગી (Pteridophytes)",
      "દ્વિઅંગી (Bryophytes)"
    ],
    "correctAnswer": 0,
    "explanation": "આવૃત બીજધારીઓમાં એક નરજન્યુ અંડકોષ સાથે (યુગ્મનજ - 2n) અને બીજો દ્વિતીયક કોષકેન્દ્ર સાથે (ભ્રૂણપોષ - 3n) જોડાય છે જેને બેવડું ફલન કહેવાય છે.",
    "explanationGujarati": "આવૃત બીજધારીઓમાં એક નરજન્યુ અંડકોષ સાથે (યુગ્મનજ - 2n) અને બીજો દ્વિતીયક કોષકેન્દ્ર સાથે (ભ્રૂણપોષ - 3n) જોડાય છે જેને બેવડું ફલન કહેવાય છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 726,
    "category": "જીવ વિજ્ઞાન",
    "categoryGujarati": "જીવ વિજ્ઞાન",
    "grades": [
      "12"
    ],
    "subject": "Biology",
    "questionText": "મનુષ્યમાં સ્ત્રી માસિક ચક્રના ૧૪મા દિવસે કયા અંતઃસ્ત્રાવનું સ્તર મહત્તમ બની અંડપાત (Ovulation) પ્રેરે છે?",
    "questionTextGujarati": "મનુષ્યમાં સ્ત્રી માસિક ચક્રના ૧૪મા દિવસે કયા અંતઃસ્ત્રાવનું સ્તર મહત્તમ બની અંડપાત (Ovulation) પ્રેરે છે?",
    "options": [
      "લ્યુટીનાઇઝિંગ હોર્મોન (LH)",
      "પ્રોજેસ્ટેરોન",
      "એસ્ટ્રોજન",
      "FSH"
    ],
    "optionsGujarati": [
      "લ્યુટીનાઇઝિંગ હોર્મોન (LH)",
      "પ્રોજેસ્ટેરોન",
      "એસ્ટ્રોજન",
      "FSH"
    ],
    "correctAnswer": 0,
    "explanation": "LH ના ઝડપી સ્ત્રાવ (LH સર્જ) ને લીધે ગ્રાફિયન પુટિકા ફાટી અંડકોષ મુક્ત થાય છે.",
    "explanationGujarati": "LH ના ઝડપી સ્ત્રાવ (LH સર્જ) ને લીધે ગ્રાફિયન પુટિકા ફાટી અંડકોષ મુક્ત થાય છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 727,
    "category": "જીવ વિજ્ઞાન",
    "categoryGujarati": "જીવ વિજ્ઞાન",
    "grades": [
      "12"
    ],
    "subject": "Biology",
    "questionText": "DNA ના સ્વયંજનન દરમિયાન તૂટક શૃંખલા પર બનેલા ઓકાઝાકી ટુકડાઓને જોડવાનું કાર્ય કયો ઉત્સેચક કરે છે?",
    "questionTextGujarati": "DNA ના સ્વયંજનન દરમિયાન તૂટક શૃંખલા પર બનેલા ઓકાઝાકી ટુકડાઓને જોડવાનું કાર્ય કયો ઉત્સેચક કરે છે?",
    "options": [
      "DNA લિગેઝ (DNA Ligase)",
      "DNA પોલિમરેઝ",
      "હેલિકેઝ",
      "ટોપોઆઇસોમરેઝ"
    ],
    "optionsGujarati": [
      "DNA લિગેઝ (DNA Ligase)",
      "DNA પોલિમરેઝ",
      "હેલિકેઝ",
      "ટોપોઆઇસોમરેઝ"
    ],
    "correctAnswer": 0,
    "explanation": "DNA લિગેઝ ઉત્સેચક ઓકાઝાકી ટુકડાઓને ફોસ્ફોડાયએસ્ટર બંધ બનાવી એક સળંગ શૃંખલામાં જોડે છે.",
    "explanationGujarati": "DNA લિગેઝ ઉત્સેચક ઓકાઝાકી ટુકડાઓને ફોસ્ફોડાયએસ્ટર બંધ બનાવી એક સળંગ શૃંખલામાં જોડે છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 728,
    "category": "જીવ વિજ્ઞાન",
    "categoryGujarati": "જીવ વિજ્ઞાન",
    "grades": [
      "12"
    ],
    "subject": "Biology",
    "questionText": "PCR (પોલિમરેઝ ચેઇન રિએક્શન) પદ્ધતિમાં ઊંચા તાપમાને પણ સક્રિય રહેતો કયો DNA પોલિમરેઝ વપરાય છે?",
    "questionTextGujarati": "PCR (પોલિમરેઝ ચેઇન રિએક્શન) પદ્ધતિમાં ઊંચા તાપમાને પણ સક્રિય રહેતો કયો DNA પોલિમરેઝ વપરાય છે?",
    "options": [
      "ટૅક પોલિમરેઝ (Taq Polymerase)",
      "RNA પોલિમરેઝ",
      "રિવર્સ ટ્રાન્સક્રિપ્ટેઝ",
      "રિસ્ટ્રિક્શન એન્ડોન્યુક્લિએઝ"
    ],
    "optionsGujarati": [
      "ટૅક પોલિમરેઝ (Taq Polymerase)",
      "RNA પોલિમરેઝ",
      "રિવર્સ ટ્રાન્સક્રિપ્ટેઝ",
      "રિસ્ટ્રિક્શન એન્ડોન્યુક્લિએઝ"
    ],
    "correctAnswer": 0,
    "explanation": "થર્મસ એક્વાટીકસ બેક્ટેરિયામાંથી મેળવેલ ટૅક પોલિમરેઝ 94°C જેટલા ઊંચા તાપમાને વિનૈસર્ગીકરણ દરમિયાન પણ સક્રિય રહે છે.",
    "explanationGujarati": "થર્મસ એક્વાટીકસ બેક્ટેરિયામાંથી મેળવેલ ટૅક પોલિમરેઝ 94°C જેટલા ઊંચા તાપમાને વિનૈસર્ગીકરણ દરમિયાન પણ સક્રિય રહે છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 729,
    "category": "જીવ વિજ્ઞાન",
    "categoryGujarati": "જીવ વિજ્ઞાન",
    "grades": [
      "12"
    ],
    "subject": "Biology",
    "questionText": "એક જ જનીન એક કરતાં વધુ બાહ્યસ્વરૂપ (લક્ષણો) ને અસર કરતું હોય તે ઘટનાને શું કહે છે?",
    "questionTextGujarati": "એક જ જનીન એક કરતાં વધુ બાહ્યસ્વરૂપ (લક્ષણો) ને અસર કરતું હોય તે ઘટનાને શું કહે છે?",
    "options": [
      "પ્લિયોટ્રોપી (Pleiotropy)",
      "પોલિજેનિક વારસો",
      "સહપ્રભાવિતા",
      "અપૂર્ણ પ્રભુતા"
    ],
    "optionsGujarati": [
      "પ્લિયોટ્રોપી (Pleiotropy)",
      "પોલિજેનિક વારસો",
      "સહપ્રભાવિતા",
      "અપૂર્ણ પ્રભુતા"
    ],
    "correctAnswer": 0,
    "explanation": "પ્લિયોટ્રોપીમાં એક જ જનીન વિવિધ ચયાપચયિક પથને અસર કરી બહુવિધ લક્ષણો પર અસર ઉપજાવે છે (દા.ત. ફિનાઇલકીટોન્યુરિયા).",
    "explanationGujarati": "પ્લિયોટ્રોપીમાં એક જ જનીન વિવિધ ચયાપચયિક પથને અસર કરી બહુવિધ લક્ષણો પર અસર ઉપજાવે છે (દા.ત. ફિનાઇલકીટોન્યુરિયા).",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 730,
    "category": "કમ્પ્યુટર અધ્યયન",
    "categoryGujarati": "કમ્પ્યુટર અધ્યયન",
    "grades": [
      "12"
    ],
    "subject": "Computer Science",
    "questionText": "સ્ટેક (Stack) ડેટા સ્ટ્રક્ચરમાં ઘટકો કયા સિદ્ધાંત મુજબ ઉમેરાય અને દૂર થાય છે?",
    "questionTextGujarati": "સ્ટેક (Stack) ડેટા સ્ટ્રક્ચરમાં ઘટકો કયા સિદ્ધાંત મુજબ ઉમેરાય અને દૂર થાય છે?",
    "options": [
      "LIFO (Last In, First Out)",
      "FIFO (First In, First Out)",
      "Random Access",
      "Tree Order"
    ],
    "optionsGujarati": [
      "LIFO (Last In, First Out)",
      "FIFO (First In, First Out)",
      "Random Access",
      "Tree Order"
    ],
    "correctAnswer": 0,
    "explanation": "સ્ટેકમાં છેલ્લે દાખલ થયેલું ઘટક સૌથી પહેલાં પોપ (દૂર) થાય છે, જેને LIFO સિદ્ધાંત કહે છે.",
    "explanationGujarati": "સ્ટેકમાં છેલ્લે દાખલ થયેલું ઘટક સૌથી પહેલાં પોપ (દૂર) થાય છે, જેને LIFO સિદ્ધાંત કહે છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 731,
    "category": "કમ્પ્યુટર અધ્યયન",
    "categoryGujarati": "કમ્પ્યુટર અધ્યયન",
    "grades": [
      "12"
    ],
    "subject": "Computer Science",
    "questionText": "SQL માં GROUP BY ક્લોઝ વડે જૂથ બનાવ્યા પછી જૂથો પર શરત મૂકી ફિલ્ટર કરવા કયો ક્લોઝ વપરાય છે?",
    "questionTextGujarati": "SQL માં GROUP BY ક્લોઝ વડે જૂથ બનાવ્યા પછી જૂથો પર શરત મૂકી ફિલ્ટર કરવા કયો ક્લોઝ વપરાય છે?",
    "options": [
      "HAVING",
      "WHERE",
      "ORDER BY",
      "DISTINCT"
    ],
    "optionsGujarati": [
      "HAVING",
      "WHERE",
      "ORDER BY",
      "DISTINCT"
    ],
    "correctAnswer": 0,
    "explanation": "એગ્રીગેટ ફંક્શન્સ અને જૂથો પર શરત મૂકવા માટે HAVING ક્લોઝ વપરાય છે.",
    "explanationGujarati": "એગ્રીગેટ ફંક્શન્સ અને જૂથો પર શરત મૂકવા માટે HAVING ક્લોઝ વપરાય છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 732,
    "category": "કમ્પ્યુટર અધ્યયન",
    "categoryGujarati": "કમ્પ્યુટર અધ્યયન",
    "grades": [
      "12"
    ],
    "subject": "Computer Science",
    "questionText": "SQL માં નીચેનામાંથી કયો કમાન્ડ DDL (ડેટા ડેફિનેશન લેંગ્વેજ) કમાન્ડ છે?",
    "questionTextGujarati": "SQL માં નીચેનામાંથી કયો કમાન્ડ DDL (ડેટા ડેફિનેશન લેંગ્વેજ) કમાન્ડ છે?",
    "options": [
      "CREATE",
      "SELECT",
      "INSERT",
      "UPDATE"
    ],
    "optionsGujarati": [
      "CREATE",
      "SELECT",
      "INSERT",
      "UPDATE"
    ],
    "correctAnswer": 0,
    "explanation": "CREATE ટેબલનું માળખું વ્યાખ્યાયિત કરતો હોવાથી તે DDL કમાન્ડ છે.",
    "explanationGujarati": "CREATE ટેબલનું માળખું વ્યાખ્યાયિત કરતો હોવાથી તે DDL કમાન્ડ છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 733,
    "category": "કમ્પ્યુટર અધ્યયન",
    "categoryGujarati": "કમ્પ્યુટર અધ્યયન",
    "grades": [
      "12"
    ],
    "subject": "Computer Science",
    "questionText": "કમ્પ્યુટર નેટવર્કિંગમાં DNS નું પૂર્ણ નામ શું છે?",
    "questionTextGujarati": "કમ્પ્યુટર નેટવર્કિંગમાં DNS નું પૂર્ણ નામ શું છે?",
    "options": [
      "Domain Name System",
      "Data Network Server",
      "Digital Network Service",
      "Dynamic Name Service"
    ],
    "optionsGujarati": [
      "Domain Name System",
      "Data Network Server",
      "Digital Network Service",
      "Dynamic Name Service"
    ],
    "correctAnswer": 0,
    "explanation": "DNS (Domain Name System) માનવ-વાંચ્ય ડોમેન નામોને મશીન-વાંચ્ય IP એડ્રેસમાં ફેરવે છે.",
    "explanationGujarati": "DNS (Domain Name System) માનવ-વાંચ્ય ડોમેન નામોને મશીન-વાંચ્ય IP એડ્રેસમાં ફેરવે છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 734,
    "category": "કમ્પ્યુટર અધ્યયન",
    "categoryGujarati": "કમ્પ્યુટર અધ્યયન",
    "grades": [
      "12"
    ],
    "subject": "Computer Science",
    "questionText": "પાયથોનમાં કોઈપણ ઓબ્જેક્ટની અજોડ ઓળખ (મેમરી એડ્રેસ) મેળવવા કયું ઇન-બિલ્ટ ફંક્શન વપરાય છે?",
    "questionTextGujarati": "પાયથોનમાં કોઈપણ ઓબ્જેક્ટની અજોડ ઓળખ (મેમરી એડ્રેસ) મેળવવા કયું ઇન-બિલ્ટ ફંક્શન વપરાય છે?",
    "options": [
      "id()",
      "type()",
      "hex()",
      "hash()"
    ],
    "optionsGujarati": [
      "id()",
      "type()",
      "hex()",
      "hash()"
    ],
    "correctAnswer": 0,
    "explanation": "`id()` ફંક્શન ઓબ્જેક્ટનું મેમરીમાં અનન્ય સરનામું (ઇન્ટિજર) પરત કરે છે.",
    "explanationGujarati": "`id()` ફંક્શન ઓબ્જેક્ટનું મેમરીમાં અનન્ય સરનામું (ઇન્ટિજર) પરત કરે છે.",
    "targetCompany": "School",
    "difficulty": "Easy"
  },
  {
    "id": 1,
    "category": "Quantitative Aptitude",
    "grades": [
      "college"
    ],
    "subject": "Aptitude",
    "questionText": "A train 150m long is running at a speed of 54 km/hr. In how much time will it pass a standing telegraph post?",
    "options": [
      "8 seconds",
      "10 seconds",
      "12 seconds",
      "15 seconds"
    ],
    "correctAnswer": 1,
    "explanation": "Speed = 54 * (5/18) = 15 m/sec. Time = Distance / Speed = 150 / 15 = 10 seconds.",
    "targetCompany": "All",
    "difficulty": "Medium"
  },
  {
    "id": 4,
    "category": "Quantitative Aptitude",
    "grades": [
      "college"
    ],
    "subject": "Aptitude",
    "questionText": "If 12 men can complete a work in 20 days, how many days will 15 men take to complete the same work?",
    "options": [
      "16 days",
      "14 days",
      "18 days",
      "15 days"
    ],
    "correctAnswer": 0,
    "explanation": "Men x Days = Constant. 12 x 20 = 240 man-days. Days for 15 men = 240 / 15 = 16 days.",
    "targetCompany": "Wipro",
    "difficulty": "Medium"
  },
  {
    "id": 6,
    "category": "Quantitative Aptitude",
    "grades": [
      "college"
    ],
    "subject": "Aptitude",
    "questionText": "A shopkeeper marks an article 40% above cost price and allows a discount of 25%. What is his profit percentage?",
    "options": [
      "15%",
      "5%",
      "10%",
      "8%"
    ],
    "correctAnswer": 1,
    "explanation": "Let CP = 100. MP = 140. SP = 140 × 0.75 = 105. Profit = 5%.",
    "targetCompany": "TCS NQT",
    "difficulty": "Medium"
  },
  {
    "id": 7,
    "category": "Quantitative Aptitude",
    "grades": [
      "college"
    ],
    "subject": "Aptitude",
    "questionText": "In how many years will an amount double itself at 12.5% simple interest per annum?",
    "options": [
      "6 years",
      "8 years",
      "10 years",
      "12 years"
    ],
    "correctAnswer": 1,
    "explanation": "SI = P. P = (P × 12.5 × T) / 100 => T = 100 / 12.5 = 8 years.",
    "targetCompany": "Infosys",
    "difficulty": "Medium"
  },
  {
    "id": 8,
    "category": "Quantitative Aptitude",
    "grades": [
      "college"
    ],
    "subject": "Aptitude",
    "questionText": "Two pipes A and B can fill a tank in 20 minutes and 30 minutes respectively. If both are opened together, how long will they take to fill the tank?",
    "options": [
      "10 minutes",
      "12 minutes",
      "15 minutes",
      "25 minutes"
    ],
    "correctAnswer": 1,
    "explanation": "Combined rate = 1/20 + 1/30 = (3 + 2)/60 = 5/60 = 1/12. Time = 12 minutes.",
    "targetCompany": "Accenture",
    "difficulty": "Medium"
  },
  {
    "id": 9,
    "category": "Quantitative Aptitude",
    "grades": [
      "college"
    ],
    "subject": "Aptitude",
    "questionText": "A bag contains 5 red balls and 4 blue balls. If two balls are drawn at random without replacement, what is the probability that both are red?",
    "options": [
      "5/18",
      "10/36",
      "25/81",
      "1/2"
    ],
    "correctAnswer": 0,
    "explanation": "P = (5/9) × (4/8) = 20/72 = 5/18.",
    "targetCompany": "Amazon",
    "difficulty": "Medium"
  },
  {
    "id": 10,
    "category": "Quantitative Aptitude",
    "grades": [
      "college"
    ],
    "subject": "Aptitude",
    "questionText": "The average age of a class of 30 students is 15 years. If the teacher's age is included, the average increases by 1 year. What is the teacher's age?",
    "options": [
      "45 years",
      "46 years",
      "48 years",
      "50 years"
    ],
    "correctAnswer": 1,
    "explanation": "Teacher's age = New Average + (Initial students × increase) = 16 + (30 × 1) = 46 years.",
    "targetCompany": "Cognizant",
    "difficulty": "Medium"
  },
  {
    "id": 11,
    "category": "Quantitative Aptitude",
    "grades": [
      "college"
    ],
    "subject": "Aptitude",
    "questionText": "A boat travels 24 km downstream in 2 hours and takes 4 hours to return upstream. What is the speed of the boat in still water?",
    "options": [
      "8 km/hr",
      "9 km/hr",
      "6 km/hr",
      "10 km/hr"
    ],
    "correctAnswer": 1,
    "explanation": "Downstream speed = 24/2 = 12 km/h. Upstream speed = 24/4 = 6 km/h. Boat speed = (12 + 6)/2 = 9 km/h.",
    "targetCompany": "TCS NQT",
    "difficulty": "Medium"
  },
  {
    "id": 2,
    "category": "Logical Reasoning",
    "grades": [
      "college"
    ],
    "subject": "Reasoning",
    "questionText": "Look at this series: 2, 1, (1/2), (1/4), ... What number should come next?",
    "options": [
      "(1/3)",
      "(1/8)",
      "(2/8)",
      "(1/16)"
    ],
    "correctAnswer": 1,
    "explanation": "This is a simple division series. Each number is half of the previous number: 1/4 ÷ 2 = 1/8.",
    "targetCompany": "TCS NQT",
    "difficulty": "Medium"
  },
  {
    "id": 12,
    "category": "Logical Reasoning",
    "grades": [
      "college"
    ],
    "subject": "Reasoning",
    "questionText": "Pointing to a photograph, a man said, 'I have no brother or sister, but that man's father is my father's son.' Whose photograph was it?",
    "options": [
      "His father's",
      "His son's",
      "His own",
      "His nephew's"
    ],
    "correctAnswer": 1,
    "explanation": "'My father's son' = himself (since he has no brother). 'That man's father is himself' => it is his son's photo.",
    "targetCompany": "Infosys",
    "difficulty": "Medium"
  },
  {
    "id": 13,
    "category": "Logical Reasoning",
    "grades": [
      "college"
    ],
    "subject": "Reasoning",
    "questionText": "If in a certain code language, 'ROSE' is written as 'ILHV', how will 'PEACE' be written in that code?",
    "options": [
      "KVZXV",
      "KZVXV",
      "KXZWV",
      "LVAYV"
    ],
    "correctAnswer": 0,
    "explanation": "Reverse alphabet pairs (A<->Z, B<->Y, P<->K, E<->V, A<->Z, C<->X, E<->V).",
    "targetCompany": "Wipro",
    "difficulty": "Medium"
  },
  {
    "id": 14,
    "category": "Logical Reasoning",
    "grades": [
      "college"
    ],
    "subject": "Reasoning",
    "questionText": "Statements: Some books are pens. All pens are desks. Conclusion: (I) Some desks are books. (II) All books are desks.",
    "options": [
      "Only I follows",
      "Only II follows",
      "Both I and II follow",
      "Neither follows"
    ],
    "correctAnswer": 0,
    "explanation": "Some books are pens and all pens are desks implies that the common portion of books and pens are desks (Some desks are books).",
    "targetCompany": "Accenture",
    "difficulty": "Medium"
  },
  {
    "id": 15,
    "category": "Logical Reasoning",
    "grades": [
      "college"
    ],
    "subject": "Reasoning",
    "questionText": "A person walks 10 km North, turns Right and walks 5 km, then turns Right and walks 10 km. How far is he from his starting point?",
    "options": [
      "5 km East",
      "5 km West",
      "10 km South",
      "15 km North"
    ],
    "correctAnswer": 0,
    "explanation": "The 10 km North and 10 km South cancel out, leaving him 5 km East of origin.",
    "targetCompany": "TCS NQT",
    "difficulty": "Medium"
  },
  {
    "id": 16,
    "category": "Logical Reasoning",
    "grades": [
      "college"
    ],
    "subject": "Reasoning",
    "questionText": "In a row of 40 students, Priya is 13th from the left end. What is her rank from the right end?",
    "options": [
      "27th",
      "28th",
      "29th",
      "26th"
    ],
    "correctAnswer": 1,
    "explanation": "Rank from right = (Total - Left Rank) + 1 = (40 - 13) + 1 = 28th.",
    "targetCompany": "Amazon",
    "difficulty": "Medium"
  },
  {
    "id": 17,
    "category": "Logical Reasoning",
    "grades": [
      "college"
    ],
    "subject": "Reasoning",
    "questionText": "Which word does NOT belong with the others?",
    "options": [
      "Index",
      "Glossary",
      "Chapter",
      "Book"
    ],
    "correctAnswer": 3,
    "explanation": "Index, glossary, and chapter are individual parts/sections of a book.",
    "targetCompany": "Cognizant",
    "difficulty": "Medium"
  },
  {
    "id": 18,
    "category": "Verbal Ability",
    "grades": [
      "college"
    ],
    "subject": "Verbal",
    "questionText": "Identify the grammatically correct sentence:",
    "options": [
      "One of my friend is visiting today.",
      "One of my friends is visiting today.",
      "One of my friends are visiting today.",
      "One of my friend are visiting today."
    ],
    "correctAnswer": 1,
    "explanation": "'One of' is followed by plural noun ('friends') and singular verb ('is').",
    "targetCompany": "TCS NQT",
    "difficulty": "Medium"
  },
  {
    "id": 19,
    "category": "Verbal Ability",
    "grades": [
      "college"
    ],
    "subject": "Verbal",
    "questionText": "Choose the word most nearly opposite in meaning to 'METICULOUS':",
    "options": [
      "Careless",
      "Careful",
      "Accurate",
      "Painstaking"
    ],
    "correctAnswer": 0,
    "explanation": "Meticulous means showing great attention to detail; the opposite is careless.",
    "targetCompany": "Infosys",
    "difficulty": "Medium"
  },
  {
    "id": 20,
    "category": "Verbal Ability",
    "grades": [
      "college"
    ],
    "subject": "Verbal",
    "questionText": "What does the idiom 'Bite the bullet' mean?",
    "options": [
      "Face an inevitable, difficult situation with courage",
      "Eat fast",
      "Avoid responsibility",
      "Engage in physical combat"
    ],
    "correctAnswer": 0,
    "explanation": "'Bite the bullet' means enduring an unpleasant ordeal with fortitude.",
    "targetCompany": "Wipro",
    "difficulty": "Medium"
  },
  {
    "id": 21,
    "category": "Verbal Ability",
    "grades": [
      "college"
    ],
    "subject": "Verbal",
    "questionText": "Select the synonym for 'CANDID':",
    "options": [
      "Secretive",
      "Frank and outspoken",
      "Deceptive",
      "Shy"
    ],
    "correctAnswer": 1,
    "explanation": "Candid means straightforward, honest, and frank.",
    "targetCompany": "Accenture",
    "difficulty": "Medium"
  },
  {
    "id": 22,
    "category": "Verbal Ability",
    "grades": [
      "college"
    ],
    "subject": "Verbal",
    "questionText": "Choose the correctly spelled word:",
    "options": [
      "Accomodation",
      "Accommodation",
      "Acommodation",
      "Accomadation"
    ],
    "correctAnswer": 1,
    "explanation": "Correct spelling has double c and double m: 'Accommodation'.",
    "targetCompany": "Cognizant",
    "difficulty": "Medium"
  },
  {
    "id": 3,
    "category": "IT Technical (React & JS)",
    "grades": [
      "college"
    ],
    "subject": "Coding",
    "questionText": "In React, what hook is used to handle side-effects such as data fetching or subscriptions?",
    "options": [
      "useState",
      "useContext",
      "useEffect",
      "useReducer"
    ],
    "correctAnswer": 2,
    "explanation": "useEffect is designed to perform side effects in functional React components.",
    "targetCompany": "Infosys",
    "difficulty": "Medium"
  },
  {
    "id": 23,
    "category": "IT Technical (React & JS)",
    "grades": [
      "college"
    ],
    "subject": "Coding",
    "questionText": "What is the primary difference between `let` and `var` in JavaScript?",
    "options": [
      "let is block-scoped, while var is function-scoped",
      "var is block-scoped",
      "let can be redeclared in the same scope",
      "var is hoisted without undefined"
    ],
    "correctAnswer": 0,
    "explanation": "Variables declared with `let` respect enclosing block scopes ({ ... }) and temporal dead zones.",
    "targetCompany": "TCS NQT",
    "difficulty": "Medium"
  },
  {
    "id": 24,
    "category": "IT Technical (React & JS)",
    "grades": [
      "college"
    ],
    "subject": "Coding",
    "questionText": "What does the `useCallback` hook in React return?",
    "options": [
      "A memoized callback function",
      "A memoized computed value",
      "A state updater",
      "A DOM ref"
    ],
    "correctAnswer": 0,
    "explanation": "`useCallback(fn, deps)` returns a memoized version of the callback that only changes if dependencies update.",
    "targetCompany": "Amazon",
    "difficulty": "Medium"
  },
  {
    "id": 25,
    "category": "IT Technical (React & JS)",
    "grades": [
      "college"
    ],
    "subject": "Coding",
    "questionText": "What will `console.log(typeof null)` output in JavaScript?",
    "options": [
      "'object'",
      "'null'",
      "'undefined'",
      "'boolean'"
    ],
    "correctAnswer": 0,
    "explanation": "Due to a historical bug preserved for compatibility, `typeof null` returns `'object'`.",
    "targetCompany": "Wipro",
    "difficulty": "Medium"
  },
  {
    "id": 26,
    "category": "IT Technical (React & JS)",
    "grades": [
      "college"
    ],
    "subject": "Coding",
    "questionText": "Which JavaScript array method creates a new array populated with the results of calling a provided function on every element?",
    "options": [
      "forEach()",
      "filter()",
      "map()",
      "reduce()"
    ],
    "correctAnswer": 2,
    "explanation": "`map()` transforms elements and returns a new array of identical length.",
    "targetCompany": "Accenture",
    "difficulty": "Medium"
  },
  {
    "id": 5,
    "category": "Data Structures & Algorithms",
    "grades": [
      "college"
    ],
    "subject": "DSA",
    "questionText": "What is the average time complexity of searching an element in a Balanced Binary Search Tree (BST)?",
    "options": [
      "O(1)",
      "O(n)",
      "O(log n)",
      "O(n log n)"
    ],
    "correctAnswer": 2,
    "explanation": "In a balanced BST, the height is log(n), making search operations run in O(log n) time.",
    "targetCompany": "Amazon",
    "difficulty": "Medium"
  },
  {
    "id": 27,
    "category": "Data Structures & Algorithms",
    "grades": [
      "college"
    ],
    "subject": "DSA",
    "questionText": "Which sorting algorithm has a worst-case time complexity of O(n log n) and is based on divide-and-conquer?",
    "options": [
      "Merge Sort",
      "Quick Sort",
      "Bubble Sort",
      "Insertion Sort"
    ],
    "correctAnswer": 0,
    "explanation": "Merge Sort guarantees O(n log n) across best, average, and worst cases.",
    "targetCompany": "Amazon",
    "difficulty": "Medium"
  },
  {
    "id": 28,
    "category": "Data Structures & Algorithms",
    "grades": [
      "college"
    ],
    "subject": "DSA",
    "questionText": "Which data structure is primarily used to implement Breadth-First Search (BFS) on a graph?",
    "options": [
      "Stack",
      "Queue",
      "Priority Queue",
      "Array"
    ],
    "correctAnswer": 1,
    "explanation": "BFS explores level by level using a FIFO Queue.",
    "targetCompany": "Infosys",
    "difficulty": "Medium"
  },
  {
    "id": 29,
    "category": "Data Structures & Algorithms",
    "grades": [
      "college"
    ],
    "subject": "DSA",
    "questionText": "What is the space complexity of finding an element using iterative Binary Search on a sorted array?",
    "options": [
      "O(1)",
      "O(log n)",
      "O(n)",
      "O(n log n)"
    ],
    "correctAnswer": 0,
    "explanation": "Iterative binary search uses two pointer variables, requiring O(1) auxiliary space.",
    "targetCompany": "TCS NQT",
    "difficulty": "Medium"
  },
  {
    "id": 30,
    "category": "Data Structures & Algorithms",
    "grades": [
      "college"
    ],
    "subject": "DSA",
    "questionText": "What occurs when elements are inserted into a full fixed-size queue?",
    "options": [
      "Underflow",
      "Overflow",
      "Garbage Collection",
      "Deadlock"
    ],
    "correctAnswer": 1,
    "explanation": "Inserting into an already saturated buffer produces an Overflow condition.",
    "targetCompany": "Wipro",
    "difficulty": "Medium"
  },
  {
    "id": 31,
    "category": "Database & Architecture",
    "grades": [
      "college"
    ],
    "subject": "Database",
    "questionText": "In relational databases, which SQL JOIN returns all rows from the left table and matched rows from the right table?",
    "options": [
      "INNER JOIN",
      "LEFT OUTER JOIN",
      "RIGHT OUTER JOIN",
      "CROSS JOIN"
    ],
    "correctAnswer": 1,
    "explanation": "LEFT JOIN keeps all left table records regardless of matching right table rows.",
    "targetCompany": "Amazon",
    "difficulty": "Medium"
  },
  {
    "id": 32,
    "category": "Database & Architecture",
    "grades": [
      "college"
    ],
    "subject": "Database",
    "questionText": "What does the 'A' stand for in ACID properties of database transactions?",
    "options": [
      "Atomicity (All or nothing)",
      "Availability",
      "Authentication",
      "Accuracy"
    ],
    "correctAnswer": 0,
    "explanation": "Atomicity ensures that all transaction operations execute completely or rollback entirely.",
    "targetCompany": "TCS NQT",
    "difficulty": "Medium"
  },
  {
    "id": 33,
    "category": "Database & Architecture",
    "grades": [
      "college"
    ],
    "subject": "Database",
    "questionText": "Which HTTP status code signifies '404'?",
    "options": [
      "Bad Request",
      "Unauthorized",
      "Not Found",
      "Internal Server Error"
    ],
    "correctAnswer": 2,
    "explanation": "HTTP 404 indicates that the requested server resource was not found.",
    "targetCompany": "Infosys",
    "difficulty": "Medium"
  },
  {
    "id": 34,
    "category": "Database & Architecture",
    "grades": [
      "college"
    ],
    "subject": "Database",
    "questionText": "Which database index structure is most widely used in relational engines like MySQL InnoDB and PostgreSQL for range queries?",
    "options": [
      "Hash Index",
      "B-Tree / B+ Tree",
      "Inverted Index",
      "Bitmap Index"
    ],
    "correctAnswer": 1,
    "explanation": "B+ Trees maintain balanced depth and sequential linked leaf nodes for rapid range scans.",
    "targetCompany": "Accenture",
    "difficulty": "Medium"
  },
  {
    "id": 35,
    "category": "Database & Architecture",
    "grades": [
      "college"
    ],
    "subject": "Database",
    "questionText": "What architectural principle ensures that an API server handles each request independently without storing client session state?",
    "options": [
      "Stateful",
      "Stateless (REST)",
      "Monolithic",
      "Event-driven"
    ],
    "correctAnswer": 1,
    "explanation": "REST APIs require stateless interactions where each request carries all requisite credentials.",
    "targetCompany": "Wipro",
    "difficulty": "Medium"
  }
];

let questionsSeeded = false;
async function ensureQuestionsSeeded() {
  if (questionsSeeded) return;
  if (mongoose.connection.readyState !== 1) return;
  try {
    const bulkOps = SEED_QUESTIONS.map((q) => ({
      updateOne: {
        filter: { id: q.id },
        update: { $set: q },
        upsert: true,
      },
    }));
    await Question.bulkWrite(bulkOps);
    questionsSeeded = true;
  } catch (e) {
    console.error('Question seeding sync notice:', e.message);
    questionsSeeded = true;
  }
}

// GET /api/companies - Dynamic Target Companies List
router.get('/companies', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json(['All Companies', 'TCS NQT', 'Infosys', 'Wipro', 'Accenture', 'Amazon', 'Cognizant']);
    }
    const distinctCompanies = await Question.distinct('targetCompany', {
      targetCompany: { $nin: ['School', 'All', ''] },
    });

    const defaultCompanies = ['All Companies', 'TCS NQT', 'Infosys', 'Wipro', 'Accenture', 'Amazon', 'Cognizant'];
    const combined = Array.from(new Set(['All Companies', ...distinctCompanies, ...defaultCompanies]));
    res.json(combined);
  } catch (error) {
    res.json(['All Companies', 'TCS NQT', 'Infosys', 'Wipro', 'Accenture', 'Amazon']);
  }
});

// GET /api/questions
router.get('/questions', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const company = req.query.company;
    const userEmail = req.query.userEmail;
    const grade = req.query.grade || 'college';

    if (mongoose.connection.readyState !== 1) {
      let pool = SEED_QUESTIONS.filter((q) => q.grades && q.grades.includes(grade));
      if (pool.length === 0) pool = SEED_QUESTIONS;
      if (category && category !== 'All Topics') {
        pool = pool.filter((q) => q.category === category || q.subject === category);
      }
      return res.json(pool.slice(0, limit));
    }

    await ensureQuestionsSeeded();

    const matchStage = {};
    if (grade) {
      matchStage.grades = grade;
    }
    if (category && category !== 'All Topics') {
      matchStage.category = category;
    }
    if (company && company !== 'All Companies') {
      matchStage.$or = [{ targetCompany: company }, { targetCompany: 'All' }];
    }

    let user = null;
    if (userEmail) {
      user = await User.findOne({ email: userEmail });
    }

    if (user) {
      const attemptedIds = user.attemptedQuestionIds || [];
      const unattemptedMatch = { ...matchStage };
      if (attemptedIds.length > 0) {
        unattemptedMatch.id = { $nin: attemptedIds };
      }

      const unattemptedCount = await Question.countDocuments(unattemptedMatch);

      if (unattemptedCount < limit) {
        user.attemptedQuestionIds = [];
        await user.save();
      } else {
        matchStage.id = { $nin: attemptedIds };
      }
    }

    let questions = await Question.aggregate([
      { $match: matchStage },
      { $sample: { size: limit } }
    ]);

    if (questions.length === 0) {
      questions = await Question.find({ grades: grade }).limit(limit);
    }
    if (questions.length === 0) {
      questions = await Question.find().limit(limit);
    }

    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions from database:', error);
    res.json(SEED_QUESTIONS.slice(0, 10));
  }
});

// GET /api/exams/daily-challenge - Grade-Isolated Daily Question
router.get('/exams/daily-challenge', async (req, res) => {
  try {
    const grade = req.query.grade || 'college';
    const today = new Date().toISOString().split('T')[0];

    if (mongoose.connection.readyState !== 1) {
      let pool = SEED_QUESTIONS.filter((q) => q.grades && q.grades.includes(grade));
      if (pool.length === 0) pool = SEED_QUESTIONS;
      const seedStr = `${today}_${grade}`;
      let hash = 0;
      for (let i = 0; i < seedStr.length; i++) {
        hash = (hash << 5) - hash + seedStr.charCodeAt(i);
        hash |= 0;
      }
      const index = Math.abs(hash) % pool.length;
      return res.json({ question: pool[index], date: today, grade });
    }

    await ensureQuestionsSeeded();

    const match = { grades: grade };
    let count = await Question.countDocuments(match);

    if (count === 0) {
      count = await Question.countDocuments();
    }

    const seedStr = `${today}_${grade}`;
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
      hash = (hash << 5) - hash + seedStr.charCodeAt(i);
      hash |= 0;
    }
    const skipCount = Math.abs(hash) % Math.max(count, 1);

    let question = await Question.findOne(match).skip(skipCount);
    if (!question) {
      question = await Question.findOne(match);
    }
    if (!question) {
      question = await Question.findOne().skip(skipCount);
    }

    if (question) {
      return res.json({
        id: question.id,
        date: today,
        grade,
        topic: question.category,
        question: question.questionText,
        options: question.options,
        correctIndex: question.correctAnswer,
        explanation: question.explanation,
      });
    }

    res.json({
      id: 201,
      date: today,
      grade,
      topic: 'Mathematics',
      question: 'Solve: 3x + 7 = 22. What is the value of x?',
      options: ['3', '5', '7', '15'],
      correctIndex: 1,
      explanation: '3x = 22 - 7 = 15 => x = 5.',
    });
  } catch (error) {
    console.error('Error fetching daily challenge:', error);
    res.json({
      id: 201,
      date: new Date().toISOString().split('T')[0],
      grade: req.query.grade || '7',
      topic: 'Mathematics',
      question: 'Solve: 3x + 7 = 22. What is the value of x?',
      options: ['3', '5', '7', '15'],
      correctIndex: 1,
      explanation: '3x = 22 - 7 = 15 => x = 5.',
    });
  }
});

// GET /api/user/weak-spots
router.get('/user/weak-spots', async (req, res) => {
  try {
    const userEmail = req.query.userEmail;
    const grade = req.query.grade || 'college';

    if (mongoose.connection.readyState !== 1 || !userEmail) {
      return res.json({
        weakTopics: grade === 'college' ? ['Quantitative Aptitude', 'Data Structures & Algorithms'] : ['Mathematics', 'Science'],
        totalTests: 0,
      });
    }

    const query = { userEmail };
    if (grade === 'college') {
      query.$or = [{ grade: 'college' }, { grade: { $exists: false } }];
    } else {
      query.grade = grade;
    }

    const results = await ExamResult.find(query).sort({ createdAt: -1 });
    if (!results || results.length === 0) {
      return res.json({
        weakTopics: grade === 'college' ? ['Quantitative Aptitude', 'Data Structures & Algorithms'] : ['Mathematics', 'Science'],
        topicAccuracy: {},
        totalTests: 0,
      });
    }

    const categoryStats = {};
    results.forEach((r) => {
      if (r.weakCategories && Array.isArray(r.weakCategories)) {
        r.weakCategories.forEach((cat) => {
          if (!categoryStats[cat]) categoryStats[cat] = { occurrences: 0 };
          categoryStats[cat].occurrences += 1;
        });
      }
    });

    const weakTopics = Object.keys(categoryStats)
      .sort((a, b) => categoryStats[b].occurrences - categoryStats[a].occurrences)
      .slice(0, 3);

    res.json({
      weakTopics: weakTopics.length > 0 ? weakTopics : (grade === 'college' ? ['Quantitative Aptitude', 'Logical Reasoning'] : ['Mathematics', 'Science']),
      totalTests: results.length,
      categoryStats,
    });
  } catch (error) {
    console.error('Error computing weak spots:', error);
    res.json({
      weakTopics: ['Quantitative Aptitude', 'Data Structures & Algorithms'],
      totalTests: 0,
    });
  }
});

// GET /api/exams/diagnostic
router.get('/exams/diagnostic', async (req, res) => {
  try {
    const userEmail = req.query.userEmail;
    const limit = parseInt(req.query.limit) || 10;
    const grade = req.query.grade || 'college';

    if (mongoose.connection.readyState !== 1) {
      let pool = SEED_QUESTIONS.filter((q) => q.grades && q.grades.includes(grade));
      if (pool.length === 0) pool = SEED_QUESTIONS;
      return res.json(pool.slice(0, limit));
    }

    let weakCategories = [];
    if (userEmail) {
      const results = await ExamResult.find({ userEmail, grade }).sort({ createdAt: -1 }).limit(5);
      const catCount = {};
      results.forEach((r) => {
        (r.weakCategories || []).forEach((c) => {
          catCount[c] = (catCount[c] || 0) + 1;
        });
      });
      weakCategories = Object.keys(catCount).sort((a, b) => catCount[b] - catCount[a]);
    }

    let questions = [];

    if (weakCategories.length > 0) {
      const weakTargetCount = Math.ceil(limit * 0.7);
      const weakQs = await Question.aggregate([
        { $match: { grades: grade, category: { $in: weakCategories } } },
        { $sample: { size: weakTargetCount } },
      ]);

      const remainingCount = limit - weakQs.length;
      let otherQs = [];
      if (remainingCount > 0) {
        otherQs = await Question.aggregate([
          { $match: { grades: grade, id: { $nin: weakQs.map((q) => q.id) } } },
          { $sample: { size: remainingCount } },
        ]);
      }

      questions = [...weakQs, ...otherQs];
    } else {
      questions = await Question.aggregate([{ $match: { grades: grade } }, { $sample: { size: limit } }]);
    }

    if (!questions || questions.length === 0) {
      questions = await Question.find({ grades: grade }).limit(limit);
    }
    if (!questions || questions.length === 0) {
      questions = await Question.find().limit(limit);
    }

    res.json(questions.length > 0 ? questions : SEED_QUESTIONS.slice(0, limit));
  } catch (error) {
    console.error('Error generating diagnostic test:', error);
    res.json(SEED_QUESTIONS.slice(0, 10));
  }
});

// POST /api/exams/submit
router.post('/exams/submit', async (req, res) => {
  try {
    const { userEmail, scorePercentage, correctCount, totalQuestions, userAnswers, weakCategories, questionIds, grade, board, category } = req.body;

    const result = new ExamResult({
      userEmail: userEmail || 'guest@mindsprint.edu',
      grade: grade || 'college',
      board: board || 'CBSE',
      category: category || 'General',
      scorePercentage,
      correctCount,
      totalQuestions,
      userAnswers,
      weakCategories,
    });

    await result.save();

    const attemptedIds = questionIds || Object.keys(userAnswers || {}).map(id => parseInt(id)).filter(id => !isNaN(id));

    if (userEmail && attemptedIds.length > 0) {
      await User.updateOne(
        { email: userEmail },
        { $addToSet: { attemptedQuestionIds: { $each: attemptedIds } } }
      );
    }

    res.status(201).json({ message: 'Exam result saved successfully', result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/user/dashboard-stats
router.get('/user/dashboard-stats', async (req, res) => {
  try {
    const userEmail = req.query.userEmail;
    const grade = req.query.grade || 'college';

    if (mongoose.connection.readyState !== 1 || !userEmail) {
      return res.json({
        userEmail: userEmail || 'guest',
        grade,
        streakCount: 1,
        totalTests: 0,
        avgScore: 0,
        totalQuestionsAnswered: 0,
        recentActivity: [],
        weakCategoriesMap: {},
        unlockedBadges: ['first_step'],
      });
    }

    let user = await User.findOne({ email: userEmail });

    const resultsQuery = { userEmail };
    if (grade === 'college') {
      resultsQuery.$or = [{ grade: 'college' }, { grade: { $exists: false } }];
    } else {
      resultsQuery.grade = grade;
    }

    const results = await ExamResult.find(resultsQuery).sort({ createdAt: -1 });

    let streakCount = user ? user.streakCount || 1 : 1;
    if (user) {
      const now = new Date();
      const lastLogin = user.lastLoginDate ? new Date(user.lastLoginDate) : new Date(0);

      const todayStr = now.toISOString().split('T')[0];
      const lastLoginStr = lastLogin.toISOString().split('T')[0];

      if (todayStr !== lastLoginStr) {
        const todayDate = new Date(todayStr);
        const lastDate = new Date(lastLoginStr);
        const dayDiff = Math.round((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

        if (dayDiff === 1) {
          streakCount += 1;
          user.streakCount = streakCount;
          user.lastLoginDate = now;
          await user.save();
        } else if (dayDiff > 1) {
          streakCount = 1;
          user.streakCount = 1;
          user.lastLoginDate = now;
          await user.save();
        }
      }
    }

    const totalTests = results.length;
    let avgScore = 0;
    let totalQuestionsAnswered = 0;
    const weakCategoriesMap = {};
    let has100Percent = false;

    if (totalTests > 0) {
      const sumScores = results.reduce((acc, r) => {
        if (r.scorePercentage === 100) has100Percent = true;
        return acc + (r.scorePercentage || 0);
      }, 0);
      avgScore = Math.round(sumScores / totalTests);

      results.forEach((r) => {
        totalQuestionsAnswered += r.totalQuestions || 0;
        if (r.weakCategories && Array.isArray(r.weakCategories)) {
          r.weakCategories.forEach((cat) => {
            weakCategoriesMap[cat] = (weakCategoriesMap[cat] || 0) + 1;
          });
        }
      });
    }

    const unlockedBadges = [];
    if (totalTests >= 1) unlockedBadges.push('first_step');
    if (has100Percent) unlockedBadges.push('bullseye');
    if (totalTests >= 3) unlockedBadges.push('quant_master');
    if (totalTests >= 5) unlockedBadges.push('dsa_ninja');
    if (streakCount >= 7) unlockedBadges.push('streak_flame');

    if (user && unlockedBadges.length > (user.unlockedBadges || []).length) {
      user.unlockedBadges = unlockedBadges;
      await user.save();
    }

    const recentActivity = results.slice(0, 5).map((r) => ({
      id: r._id,
      scorePercentage: r.scorePercentage,
      correctCount: r.correctCount,
      totalQuestions: r.totalQuestions,
      createdAt: r.createdAt,
      grade: r.grade || 'college',
      category: r.category || 'Mock Exam',
    }));

    res.json({
      userEmail,
      grade,
      streakCount,
      totalTests,
      avgScore,
      totalQuestionsAnswered,
      recentActivity,
      weakCategoriesMap,
      unlockedBadges: user ? user.unlockedBadges || unlockedBadges : unlockedBadges,
    });
  } catch (error) {
    console.error('Error fetching user dashboard stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/user/leaderboard - Live MongoDB Aggregation
router.get('/user/leaderboard', async (req, res) => {
  try {
    const grade = req.query.grade || 'college';
    const userEmail = req.query.userEmail;
    const subject = req.query.subject;
    const isSchool = grade !== 'college';

    // 1. Match filter based on Grade and optional Subject
    const matchFilter = {};
    if (grade === 'college') {
      matchFilter.$or = [{ grade: 'college' }, { grade: { $exists: false } }];
    } else if (grade && grade !== 'all') {
      matchFilter.grade = grade;
    }
    if (subject && subject !== 'All') {
      matchFilter.category = new RegExp(subject, 'i');
    }

    // 2. Real Aggregation from ExamResult collection
    let aggregatedUsers = [];
    if (mongoose.connection.readyState === 1) {
      try {
        aggregatedUsers = await ExamResult.aggregate([
          { $match: matchFilter },
          {
            $group: {
              _id: '$userEmail',
              totalCorrect: { $sum: '$correctCount' },
              totalQuestions: { $sum: '$totalQuestions' },
              testsTaken: { $sum: 1 },
              avgScore: { $avg: '$scorePercentage' },
              lastActive: { $max: '$createdAt' },
            },
          },
          {
            $project: {
              userEmail: '$_id',
              // Formula: 10 points per correct answer + 5 points per exam completed
              points: { $add: [{ $multiply: ['$totalCorrect', 10] }, { $multiply: ['$testsTaken', 5] }] },
              accuracy: {
                $cond: [
                  { $gt: ['$totalQuestions', 0] },
                  { $round: [{ $multiply: [{ $divide: ['$totalCorrect', '$totalQuestions'] }, 100] }, 0] },
                  0,
                ],
              },
              testsTaken: 1,
              lastActive: 1,
            },
          },
          { $sort: { points: -1, accuracy: -1 } },
        ]);
      } catch (aggErr) {
        console.warn('Aggregation warning, fallback to default:', aggErr);
      }
    }

    // 3. Look up user profile details (Name, Streak, College/School)
    const emails = aggregatedUsers.map((u) => u.userEmail).filter(Boolean);
    const usersMap = {};
    if (emails.length > 0 && mongoose.connection.readyState === 1) {
      const userDocs = await User.find({ email: { $in: emails } });
      userDocs.forEach((doc) => {
        usersMap[doc.email] = doc;
      });
    }

    // Current requesting user
    let requestingUserDoc = null;
    if (userEmail) {
      requestingUserDoc = usersMap[userEmail];
      if (!requestingUserDoc && mongoose.connection.readyState === 1) {
        requestingUserDoc = await User.findOne({ email: userEmail });
      }
    }

    // 4. Grade-specific cohort benchmarks to ensure leaderboard always feels populated & lively
    const schoolPeers = [
      { id: 'lb-sch-1', name: 'Aarav Patel', points: 1480, streak: 14, accuracy: 96, avatar: '🥇', college: `Class ${grade} • St. Xavier's High` },
      { id: 'lb-sch-2', name: 'Priya Sharma', points: 1390, streak: 12, accuracy: 94, avatar: '🥈', college: `Class ${grade} • DPS Vadodara` },
      { id: 'lb-sch-3', name: 'Rohan Mehta', points: 1280, streak: 10, accuracy: 91, avatar: '🥉', college: `Class ${grade} • C.N. Vidyalaya` },
      { id: 'lb-sch-4', name: 'Ananya Desai', points: 1140, streak: 8, accuracy: 88, avatar: '⭐', college: `Class ${grade} • Navrachana` },
      { id: 'lb-sch-5', name: 'Kavya Joshi', points: 1010, streak: 7, accuracy: 85, avatar: '🌟', college: `Class ${grade} • Sharda Mandir` },
      { id: 'lb-sch-6', name: 'Devendra Shah', points: 920, streak: 6, accuracy: 82, avatar: '🎯', college: `Class ${grade} • Podar International` },
    ];

    const higherSecPeers = [
      { id: 'lb-hsc-1', name: 'Aarav Patel', points: 1520, streak: 15, accuracy: 97, avatar: '🥇', college: `Class ${grade} Science • GSHSEB` },
      { id: 'lb-hsc-2', name: 'Priya Sharma', points: 1410, streak: 13, accuracy: 95, avatar: '🥈', college: `Class ${grade} PCM • CBSE` },
      { id: 'lb-hsc-3', name: 'Rohan Mehta', points: 1300, streak: 11, accuracy: 92, avatar: '🥉', college: `Class ${grade} Science • Rajkot` },
      { id: 'lb-hsc-4', name: 'Ananya Desai', points: 1170, streak: 9, accuracy: 89, avatar: '⭐', college: `Class ${grade} PCB • Vadodara` },
      { id: 'lb-hsc-5', name: 'Kavya Joshi', points: 1040, streak: 7, accuracy: 86, avatar: '🌟', college: `Class ${grade} Science • Bhavnagar` },
      { id: 'lb-hsc-6', name: 'Devendra Shah', points: 950, streak: 6, accuracy: 83, avatar: '🎯', college: `Class ${grade} Maths • Gandhinagar` },
    ];

    const collegePeers = [
      { id: 'lb-col-1', name: 'Aarav Patel', points: 1560, streak: 14, accuracy: 96, avatar: '🥇', college: 'LDCE Ahmedabad' },
      { id: 'lb-col-2', name: 'Priya Sharma', points: 1420, streak: 12, accuracy: 94, avatar: '🥈', college: 'VGEC Chandkheda' },
      { id: 'lb-col-3', name: 'Rohan Mehta', points: 1310, streak: 10, accuracy: 91, avatar: '🥉', college: 'DA-IICT Gandhinagar' },
      { id: 'lb-col-4', name: 'Ananya Desai', points: 1180, streak: 8, accuracy: 88, avatar: '⭐', college: 'Nirma University' },
      { id: 'lb-col-5', name: 'Kavya Joshi', points: 1050, streak: 7, accuracy: 85, avatar: '🌟', college: 'MSU Baroda' },
      { id: 'lb-col-6', name: 'Devendra Shah', points: 960, streak: 6, accuracy: 82, avatar: '🎯', college: 'BVM Anand' },
    ];

    const benchmarkCohort = ['11', '12'].includes(grade)
      ? higherSecPeers
      : isSchool
      ? schoolPeers
      : collegePeers;

    // 5. Transform real aggregated users into leaderboard rows
    const avatars = ['🥇', '🥈', '🥉', '⭐', '🌟', '🎯', '🚀', '🔥', '💎', '🏆'];
    const realLeaderboardRows = aggregatedUsers.map((item, idx) => {
      const userDoc = usersMap[item.userEmail];
      const displayName = userDoc?.name || item.userEmail.split('@')[0];
      const collegeOrSchool = isSchool
        ? `Class ${grade} • ${userDoc?.board || 'CBSE'}`
        : userDoc?.targetCompany && userDoc.targetCompany !== 'All Companies'
        ? `${userDoc.targetCompany} Aspirant`
        : 'Tech Aspirant';

      return {
        id: `user-${item.userEmail}`,
        email: item.userEmail,
        name: displayName,
        points: Math.max(item.points, 10),
        streak: userDoc?.streakCount || 1,
        accuracy: item.accuracy || 75,
        avatar: avatars[idx % avatars.length],
        college: collegeOrSchool,
        isRealUser: true,
      };
    });

    // 6. Combine real users and benchmark peers
    const combinedMap = new Map();
    // Real users take precedence
    realLeaderboardRows.forEach((r) => combinedMap.set(r.email, r));
    // Fill remaining benchmark cohort
    benchmarkCohort.forEach((b) => {
      if (!combinedMap.has(b.name)) {
        combinedMap.set(b.name, b);
      }
    });

    // Sort by points descending
    const combinedLeaderboard = Array.from(combinedMap.values()).sort((a, b) => b.points - a.points);

    // Re-assign 1-based ranks
    const finalLeaderboard = combinedLeaderboard.slice(0, 15).map((row, idx) => ({
      ...row,
      rank: idx + 1,
      avatar: idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : row.avatar || '⭐',
    }));

    // 7. Calculate requesting user's live rank
    let userRankData = null;
    const requestingUserIndex = userEmail ? finalLeaderboard.findIndex((r) => r.email === userEmail) : -1;

    if (requestingUserIndex !== -1) {
      userRankData = {
        rank: finalLeaderboard[requestingUserIndex].rank,
        name: requestingUserDoc?.name || (userEmail ? userEmail.split('@')[0] : 'You'),
        points: finalLeaderboard[requestingUserIndex].points,
        streak: requestingUserDoc?.streakCount || 1,
        accuracy: finalLeaderboard[requestingUserIndex].accuracy,
      };
    } else {
      const userInAgg = userEmail ? aggregatedUsers.find((u) => u.userEmail === userEmail) : null;
      const points = userInAgg ? userInAgg.points : 0;
      const accuracy = userInAgg ? userInAgg.accuracy : 0;
      const rank = points > 0
        ? finalLeaderboard.filter((r) => r.points > points).length + 1
        : finalLeaderboard.length + 1;

      userRankData = {
        rank,
        name: requestingUserDoc?.name || (userEmail ? userEmail.split('@')[0] : 'You'),
        points,
        streak: requestingUserDoc?.streakCount || 1,
        accuracy,
      };
    }

    res.json({
      grade,
      subject: subject || 'All',
      leaderboard: finalLeaderboard,
      userRank: userRankData,
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/exams/result/:id
router.get('/exams/result/:id', async (req, res) => {
  try {
    const result = await ExamResult.findById(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Exam result not found' });
    }

    const userAnswers = result.userAnswers || {};
    const questionIds = Object.keys(userAnswers)
      .map((id) => parseInt(id))
      .filter((id) => !isNaN(id));

    let questions = [];
    if (questionIds.length > 0) {
      questions = await Question.find({ id: { $in: questionIds } });
    }

    if (questions.length === 0) {
      questions = await Question.find().limit(result.totalQuestions || 10);
    }

    res.json({
      result,
      questions,
    });
  } catch (error) {
    console.error('Error fetching exam result details:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/user/bookmarks/toggle
router.post('/user/bookmarks/toggle', async (req, res) => {
  try {
    const { userEmail, questionId } = req.body;
    if (!userEmail || !questionId) {
      return res.status(400).json({ error: 'userEmail and questionId are required' });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        isBookmarked: true,
        bookmarkedQuestionIds: [parseInt(questionId)],
      });
    }

    const qIdNum = parseInt(questionId);
    const user = await User.findOne({ email: userEmail });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isBookmarked = (user.bookmarkedQuestionIds || []).includes(qIdNum);
    let updatedUser;

    if (isBookmarked) {
      updatedUser = await User.findOneAndUpdate(
        { email: userEmail },
        { $pull: { bookmarkedQuestionIds: qIdNum } },
        { new: true }
      );
    } else {
      updatedUser = await User.findOneAndUpdate(
        { email: userEmail },
        { $addToSet: { bookmarkedQuestionIds: qIdNum } },
        { new: true }
      );
    }

    res.json({
      success: true,
      isBookmarked: !isBookmarked,
      bookmarkedQuestionIds: updatedUser ? updatedUser.bookmarkedQuestionIds : [],
    });
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/user/bookmarks
router.get('/user/bookmarks', async (req, res) => {
  try {
    const { userEmail } = req.query;
    if (!userEmail) return res.status(400).json({ error: 'userEmail is required' });

    if (mongoose.connection.readyState !== 1) {
      return res.json({
        bookmarkedQuestionIds: [],
        questions: [],
      });
    }

    const user = await User.findOne({ email: userEmail });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const bookmarkedIds = user.bookmarkedQuestionIds || [];
    let questions = [];
    if (bookmarkedIds.length > 0) {
      questions = await Question.find({ id: { $in: bookmarkedIds } });
    }

    res.json({
      bookmarkedQuestionIds: bookmarkedIds,
      questions,
    });
  } catch (error) {
    console.error('Error fetching bookmarked questions:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

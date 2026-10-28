const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ImportantQuestion = require('../models/ImportantQuestion');

const SEED_IMPORTANT_QUESTIONS = [
  {
    "id": "imp-g6-m-1m-1",
    "grade": "6",
    "board": "All",
    "subject": "Mathematics",
    "chapterNumber": 1,
    "chapterTitle": "Knowing Our Numbers",
    "chapterTitleGujarati": "સંખ્યા પરિચય",
    "marks": 1,
    "marksCategory": "1-Mark Objective / VSA",
    "questionText": "Write the Roman numeral representation for the number 90.",
    "questionTextGujarati": "સંખ્યા 90 ને રોમન અંકમાં કઈ રીતે લખાય?",
    "frequentlyAskedYears": [
      "GSEB 2024",
      "CBSE 2023"
    ],
    "modelAnswer": "In Roman numerals, 90 is written as XC (10 before 100).",
    "modelAnswerGujarati": "રોમન અંક પદ્ધતિમાં 90 ને XC તરીકે દર્શાવાય છે (100 માંથી 10 બાદ).",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "Correct symbol XC.",
        "textGujarati": "સાચો રોમન સંકેત XC."
      }
    ],
    "examinerTips": "Remember: L=50, C=100. 10 before C is XC.",
    "examinerTipsGujarati": "ધ્યાન રાખો: C=100, ડાબી બાજુ X એટલે XC = 90."
  },
  {
    "id": "imp-g6-s-1m-1",
    "grade": "6",
    "board": "All",
    "subject": "Science",
    "chapterNumber": 1,
    "chapterTitle": "Components of Food",
    "chapterTitleGujarati": "ખોરાકના ઘટકો",
    "marks": 1,
    "marksCategory": "1-Mark Objective / VSA",
    "questionText": "Name the test reagent used to detect the presence of starch in food.",
    "questionTextGujarati": "ખોરાકમાં સ્ટાર્ચની હાજરી ચકાસવા માટે કયું દ્રાવણ વપરાય છે?",
    "frequentlyAskedYears": [
      "NCERT Annual",
      "GSEB 2023"
    ],
    "modelAnswer": "Dilute Iodine solution. A blue-black color confirms starch presence.",
    "modelAnswerGujarati": "આયોડિનનું મંદ દ્રાવણ. ભૂરો-કાળો રંગ સ્ટાર્ચની હાજરી દર્શાવે છે.",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "Mentioning Dilute Iodine solution.",
        "textGujarati": "મંદ આયોડિન દ્રાવણનો ઉલ્લેખ."
      }
    ],
    "examinerTips": "Specify both Iodine and the blue-black color.",
    "examinerTipsGujarati": "આયોડિન અને ભૂરો-કાળો રંગ બંને દર્શાવો."
  },
  {
    "id": "imp-g6-m-2m-1",
    "grade": "6",
    "board": "All",
    "subject": "Mathematics",
    "chapterNumber": 10,
    "chapterTitle": "Mensuration",
    "chapterTitleGujarati": "ક્ષેત્રમિતિ (પરિમિતિ)",
    "marks": 2,
    "marksCategory": "2-Mark Short Answer",
    "questionText": "Find the perimeter of a rectangle whose length is 15 cm and breadth is 8 cm.",
    "questionTextGujarati": "15 સેમી લંબાઈ અને 8 સેમી પહોળાઈ ધરાવતા લંબચોરસની પરિમિતિ શોધો.",
    "frequentlyAskedYears": [
      "GSEB 2024",
      "CBSE 2022"
    ],
    "modelAnswer": "Perimeter of rectangle = 2 × (Length + Breadth) = 2 × (15 + 8) = 2 × 23 = 46 cm.",
    "modelAnswerGujarati": "લંબચોરસની પરિમિતિ = ૨ × (લંબાઈ + પહોળાઈ) = ૨ × (૧૫ + ૮) = ૨ × ૨૩ = ૪૬ સેમી.",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "Formula: 2 × (l + b) and substitution.",
        "textGujarati": "સૂત્ર: ૨ × (લંબાઈ + પહોળાઈ) અને કિંમત મૂકવી."
      },
      {
        "stepNumber": 2,
        "marksAllocated": "1 Mark",
        "text": "Final answer 46 cm with unit.",
        "textGujarati": "અંતિમ જવાબ ૪૬ સેમી એકમ સાથે."
      }
    ],
    "examinerTips": "Never omit the unit (cm) in the final answer.",
    "examinerTipsGujarati": "જવાબ પાછળ એકમ 'સેમી' લખવો ભૂલવો નહીં."
  },
  {
    "id": "imp-g6-s-2m-1",
    "grade": "6",
    "board": "All",
    "subject": "Science",
    "chapterNumber": 4,
    "chapterTitle": "Getting to Know Plants",
    "chapterTitleGujarati": "વનસ્પતિની ઓળખ (પર્ણ રંધ્ર)",
    "marks": 2,
    "marksCategory": "2-Mark Short Answer",
    "questionText": "What is Transpiration in plants? Name the microscopic structures involved.",
    "questionTextGujarati": "બાષ્પોત્સર્જન એટલે શું? તેમાં ભાગ લેતા સૂક્ષ્મ અંગોનું નામ આપો.",
    "frequentlyAskedYears": [
      "GSEB 2023",
      "CBSE 2024"
    ],
    "modelAnswer": "Transpiration is the process of loss of excess water as water vapor from the aerial parts of plants, primarily through tiny leaf pores called Stomata.",
    "modelAnswerGujarati": "વનસ્પતિના પર્ણોમાં આવેલા પર્ણરંધ્રો (સ્ટોમેટા) દ્વારા વધારાનું પાણી બાષ્પરૂપે વાતાવરણમાં ગુમાવવાની ક્રિયાને બાષ્પોત્સર્જન કહેવાય છે.",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "Definition of water loss as vapor.",
        "textGujarati": "પાણી બાષ્પરૂપે ગુમાવવાની વ્યાખ્યા."
      },
      {
        "stepNumber": 2,
        "marksAllocated": "1 Mark",
        "text": "Naming Stomata.",
        "textGujarati": "પર્ણરંધ્ર (સ્ટોમેટા) નું નામ દર્શાવવું."
      }
    ],
    "examinerTips": "Keywords: Water vapor, Stomata.",
    "examinerTipsGujarati": "કીવર્ડ્સ: બાષ્પરૂપ, પર્ણરંધ્ર."
  },
  {
    "id": "imp-g6-m-3m-1",
    "grade": "6",
    "board": "All",
    "subject": "Mathematics",
    "chapterNumber": 6,
    "chapterTitle": "Integers",
    "chapterTitleGujarati": "પૂર્ણાંક સંખ્યાઓ",
    "marks": 3,
    "marksCategory": "3-Mark Medium Sum",
    "questionText": "Evaluate using properties: (-18) + (+12) - (-25) + (-7).",
    "questionTextGujarati": "કિંમત શોધો: (-18) + (+12) - (-25) + (-7).",
    "frequentlyAskedYears": [
      "GSEB 2023",
      "NCERT 2024"
    ],
    "modelAnswer": "1. Convert subtraction of negative to addition: -18 + 12 + 25 - 7.\n2. Group positive and negative integers: (12 + 25) + (-18 - 7) = 37 + (-25).\n3. Subtract: 37 - 25 = 12.",
    "modelAnswerGujarati": "૧. ઋણની બાદબાકીને સરવાળામાં ફેરવતા: -૧૮ + ૧૨ + ૨૫ - ૭.\n૨. ધન અને ઋણ પૂર્ણાંકોનું જૂથ: (૧૨ + ૨૫) + (-૧૮ - ૭) = ૩૭ + (-૨૫).\n૩. સાદુરૂપ: ૩૭ - ૨૫ = ૧૨.",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "Correct sign conversion: -(-25) = +25.",
        "textGujarati": "ચિહ્ન પરિવર્તન: -(-૨૫) = +૨૫."
      },
      {
        "stepNumber": 2,
        "marksAllocated": "1 Mark",
        "text": "Grouping positives (37) and negatives (-25).",
        "textGujarati": "ધન (૩૭) અને ઋણ (-૨૫) નું જૂથ બનાવવું."
      },
      {
        "stepNumber": 3,
        "marksAllocated": "1 Mark",
        "text": "Final answer: 12.",
        "textGujarati": "અંતિમ જવાબ: ૧૨."
      }
    ],
    "examinerTips": "Double negatives become positive: -(-a) = +a.",
    "examinerTipsGujarati": "બે ઋણ ચિહ્નો ભેગા થાય ત્યારે ધન બને છે."
  },
  {
    "id": "imp-g6-s-3m-1",
    "grade": "6",
    "board": "All",
    "subject": "Science",
    "chapterNumber": 9,
    "chapterTitle": "Light, Shadows and Reflections",
    "chapterTitleGujarati": "પ્રકાશ, પડછાયા અને પરાવર્તન",
    "marks": 3,
    "marksCategory": "3-Mark Medium Answer",
    "questionText": "Differentiate between Transparent, Translucent, and Opaque objects with one example of each.",
    "questionTextGujarati": "પારદર્શક, પારભાસક અને અપારદર્શક પદાર્થો વચ્ચે તફાવત આપો (દરેકનું એક ઉદાહરણ આપો).",
    "frequentlyAskedYears": [
      "GSEB 2024",
      "CBSE 2023"
    ],
    "modelAnswer": "1. Transparent: Objects allowing light to pass through completely; we can see clearly (e.g., Clear Glass, Clean Water).\n2. Translucent: Objects allowing light to pass partially; we cannot see clearly (e.g., Butter paper, Frosted glass).\n3. Opaque: Objects not allowing light to pass at all; cast dark shadows (e.g., Wooden board, Metal sheet).",
    "modelAnswerGujarati": "૧. પારદર્શક: જેમાંથી પ્રકાશ સંપૂર્ણ આરપાર નીકળે અને સાફ દેખાય (ઉદા. સ્વચ્છ કાચ, પાણી).\n૨. પારભાસક: જેમાંથી પ્રકાશ આંશિક રીતે પસાર થાય અને ઝાંખું દેખાય (ઉદા. બટર પેપર, દૂધિયો કાચ).\n૩. અપારદર્શક: જેમાંથી પ્રકાશ બિલકુલ પસાર ન થાય અને પડછાયો પાડે (ઉદા. લાકડું, દીવાલ).",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "Transparent definition and example.",
        "textGujarati": "પારદર્શકની વ્યાખ્યા અને ઉદાહરણ."
      },
      {
        "stepNumber": 2,
        "marksAllocated": "1 Mark",
        "text": "Translucent definition and example.",
        "textGujarati": "પારભાસકની વ્યાખ્યા અને ઉદાહરણ."
      },
      {
        "stepNumber": 3,
        "marksAllocated": "1 Mark",
        "text": "Opaque definition and example.",
        "textGujarati": "અપારદર્શકની વ્યાખ્યા અને ઉદાહરણ."
      }
    ],
    "examinerTips": "Give an authentic everyday example for each category.",
    "examinerTipsGujarati": "દરેક પ્રકારમાં સાચું ઉદાહરણ લખવું."
  },
  {
    "id": "imp-g6-m-4m-1",
    "grade": "6",
    "board": "All",
    "subject": "Mathematics",
    "chapterNumber": 10,
    "chapterTitle": "Mensuration",
    "chapterTitleGujarati": "ક્ષેત્રમિતિ (ક્ષેત્રફળ અને ખર્ચ)",
    "marks": 4,
    "marksCategory": "4-Mark Long Answer",
    "questionText": "A rectangular room floor is 12 m long and 8 m wide. Find the area of the floor and the total cost of tiling it at ₹50 per square meter.",
    "questionTextGujarati": "એક લંબચોરસ ઓરડાની લંબાઈ 12 મીટર અને પહોળાઈ 8 મીટર છે. ઓરડાનું ક્ષેત્રફળ શોધો અને ₹50 પ્રતિ ચોરસ મીટરના દરે લાદી બેસાડવાનો કુલ ખર્ચ ગણો.",
    "frequentlyAskedYears": [
      "GSEB 2024",
      "CBSE 2023"
    ],
    "modelAnswer": "1. Area of floor = Length × Breadth = 12 m × 8 m = 96 sq. meters (m²).\n2. Rate of tiling = ₹50 per sq. meter.\n3. Total cost = Area × Rate = 96 × 50 = ₹4,800.",
    "modelAnswerGujarati": "૧. ભોંયતળિયાનું ક્ષેત્રફળ = લંબાઈ × પહોળાઈ = ૧૨ મીટર × ૮ મીટર = ૯૬ ચોરસ મીટર (મી²).\n૨. લાદી બેસાડવાનો દર = ₹૫૦ પ્રતિ ચો.મી.\n૩. કુલ ખર્ચ = ક્ષેત્રફળ × દર = ૯૬ × ૫૦ = ₹૪,૮૦૦.",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "Formula: Area = Length × Breadth.",
        "textGujarati": "સૂત્ર: ક્ષેત્રફળ = લંબાઈ × પહોળાઈ."
      },
      {
        "stepNumber": 2,
        "marksAllocated": "1 Mark",
        "text": "Calculation: 12 × 8 = 96 m².",
        "textGujarati": "ગણતરી: ૧૨ × ૮ = ૯૬ ચો.મી."
      },
      {
        "stepNumber": 3,
        "marksAllocated": "1 Mark",
        "text": "Cost formula: Total Cost = Area × Rate.",
        "textGujarati": "ખર્ચનું સૂત્ર: કુલ ખર્ચ = ક્ષેત્રફળ × દર."
      },
      {
        "stepNumber": 4,
        "marksAllocated": "1 Mark",
        "text": "Final answer: ₹4,800.",
        "textGujarati": "અંતિમ જવાબ: ₹૪,૮૦૦."
      }
    ],
    "examinerTips": "Ensure the currency symbol (₹) is clearly written.",
    "examinerTipsGujarati": "રૂપિયાનું ચિહ્ન (₹) અવશ્ય દર્શાવવું."
  },
  {
    "id": "imp-g6-ss-4m-1",
    "grade": "6",
    "board": "All",
    "subject": "Social Science",
    "chapterNumber": 3,
    "chapterTitle": "From Gathering to Growing Food (Harappan Civilization)",
    "chapterTitleGujarati": "હડપ્પીય સભ્યતા (નગર આયોજન)",
    "marks": 4,
    "marksCategory": "4-Mark Long Answer",
    "questionText": "Describe the main architectural and drainage features of the ancient Indus Valley cities.",
    "questionTextGujarati": "પ્રાચીન સિંધુ ખીણ (હડપ્પીય) સભ્યતાના નગર આયોજન અને ગટર વ્યવસ્થાના મુખ્ય લક્ષણો વર્ણવો.",
    "frequentlyAskedYears": [
      "GSEB 2024",
      "CBSE 2022"
    ],
    "modelAnswer": "1. Town Planning: Cities were divided into Citadel (western upper part) and Lower Town. Streets intersected at right angles in a grid system.\n2. Baked Bricks: Standardized burnt bricks laid in interlocking patterns for strength.\n3. Drainage System: Every house connected to covered street drains equipped with inspection manholes.\n4. Great Bath: Mohenjo-daro had a watertight public bath lined with natural bitumen.",
    "modelAnswerGujarati": "૧. નગર આયોજન: નગર બે ભાગમાં વહેંચાયેલું (પશ્ચિમે કિલ્લો અને પૂર્વે સામાન્ય પ્રજાની વસાહત). રસ્તાઓ કાટખૂણે કાપતા ગ્રીડ પદ્ધતિમાં હતા.\n૨. પાકી ઈંટો: મકાનો પાકી ઈંટોના બનેલા હતા.\n૩. ભૂગર્ભ ગટર વ્યવસ્થા: દરેક ઘરનું ગંદુ પાણી ઢાંકેલી શેરી ગટરમાં જતું અને સફાઈ માટે કૂંડીઓ હતી.\n૪. વિશાળ સ્નાનાગાર: મોહેં-જો-દડોમાં ડામરના અસ્તરવાળું વિશાળ સ્નાનાગાર આવેલું હતું.",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "Grid system and town division.",
        "textGujarati": "ગ્રીડ પદ્ધતિ અને નગર વિભાજન."
      },
      {
        "stepNumber": 2,
        "marksAllocated": "1 Mark",
        "text": "Burnt brick construction.",
        "textGujarati": "પાકી ઈંટોની રચના."
      },
      {
        "stepNumber": 3,
        "marksAllocated": "1 Mark",
        "text": "Covered drainage system.",
        "textGujarati": "ઢાંકેલી ગટર વ્યવસ્થા."
      },
      {
        "stepNumber": 4,
        "marksAllocated": "1 Mark",
        "text": "Great Bath features.",
        "textGujarati": "વિશાળ સ્નાનાગારના લક્ષણો."
      }
    ],
    "examinerTips": "Highlight the covered drainage system - unmatched in ancient world.",
    "examinerTipsGujarati": "ઢાંકેલી ગટર વ્યવસ્થા ખાસ દર્શાવો."
  },
  {
    "id": "imp-g7-m-1m-1",
    "grade": "7",
    "board": "All",
    "subject": "Mathematics",
    "chapterNumber": 1,
    "chapterTitle": "Integers",
    "chapterTitleGujarati": "પૂર્ણાંક સંખ્યાઓ",
    "marks": 1,
    "marksCategory": "1-Mark Objective / VSA",
    "questionText": "What is the additive identity for integers?",
    "questionTextGujarati": "પૂર્ણાંક સંખ્યાઓ માટે સરવાળાની તટસ્થ સંખ્યા કઈ છે?",
    "frequentlyAskedYears": [
      "GSEB 2024",
      "CBSE 2023"
    ],
    "modelAnswer": "Zero (0) is the additive identity because a + 0 = a for any integer a.",
    "modelAnswerGujarati": "શૂન્ય (0) સરવાળા માટેની તટસ્થ સંખ્યા છે કારણ કે a + 0 = a.",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "Zero (0).",
        "textGujarati": "શૂન્ય (૦)."
      }
    ],
    "examinerTips": "Multiplicative identity is 1, additive identity is 0.",
    "examinerTipsGujarati": "ગુણાકાર માટે ૧ અને સરવાળા માટે ૦."
  },
  {
    "id": "imp-g7-s-1m-1",
    "grade": "7",
    "board": "All",
    "subject": "Science",
    "chapterNumber": 5,
    "chapterTitle": "Acids, Bases and Salts",
    "chapterTitleGujarati": "એસિડ, બેઇઝ અને ક્ષાર",
    "marks": 1,
    "marksCategory": "1-Mark Objective / VSA",
    "questionText": "Which acid is injected into the skin when an ant bites, causing burning pain?",
    "questionTextGujarati": "કીડી કરડે ત્યારે ચામડીમાં કયો એસિડ દાખલ થાય છે?",
    "frequentlyAskedYears": [
      "GSEB 2024",
      "CBSE 2022"
    ],
    "modelAnswer": "Formic acid (Methanoic acid). It is neutralized by applying calamine or baking soda.",
    "modelAnswerGujarati": "ફોર્મિક એસિડ (મિથેનોઈક એસિડ). રાહત માટે કેલેમાઈન અથવા ખાવાનો સોડા લગાવાય છે.",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "Formic acid.",
        "textGujarati": "ફોર્મિક એસિડ."
      }
    ],
    "examinerTips": "Both Formic acid or Methanoic acid are accepted.",
    "examinerTipsGujarati": "ફોર્મિક એસિડ નામ લખવું."
  },
  {
    "id": "imp-g7-m-2m-1",
    "grade": "7",
    "board": "All",
    "subject": "Mathematics",
    "chapterNumber": 4,
    "chapterTitle": "Simple Equations",
    "chapterTitleGujarati": "સાદા સમીકરણ",
    "marks": 2,
    "marksCategory": "2-Mark Short Answer",
    "questionText": "Solve the linear equation: 4(m + 3) = 28. Find m.",
    "questionTextGujarati": "સમીકરણ ઉકેલો: 4(m + 3) = 28. m ની કિંમત શોધો.",
    "frequentlyAskedYears": [
      "GSEB 2024",
      "CBSE 2023"
    ],
    "modelAnswer": "1. Divide both sides by 4: m + 3 = 28 / 4 = 7.\n2. Subtract 3: m = 7 - 3 = 4.",
    "modelAnswerGujarati": "૧. બંને બાજુ ૪ વડે ભાગતા: m + ૩ = ૨૮ / ૪ = ૭.\n૨. ૩ ની બાદબાકી કરતાં: m = ૭ - ૩ = ૪.",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "m + 3 = 7.",
        "textGujarati": "m + ૩ = ૭ મેળવવું."
      },
      {
        "stepNumber": 2,
        "marksAllocated": "1 Mark",
        "text": "m = 4.",
        "textGujarati": "m = ૪ અંતિમ જવાબ."
      }
    ],
    "examinerTips": "You can also expand 4m + 12 = 28 => 4m = 16 => m = 4.",
    "examinerTipsGujarati": "કૌંસ છોડીને પણ ગણી શકાય."
  },
  {
    "id": "imp-g7-s-2m-1",
    "grade": "7",
    "board": "All",
    "subject": "Science",
    "chapterNumber": 2,
    "chapterTitle": "Nutrition in Animals",
    "chapterTitleGujarati": "પ્રાણીઓમાં પોષણ (અમીબા)",
    "marks": 2,
    "marksCategory": "2-Mark Short Answer",
    "questionText": "How does Amoeba capture its food? Name the cellular projections.",
    "questionTextGujarati": "અમીબા ખોરાક કેવી રીતે ગ્રહણ કરે છે? તે અંગિકાઓનું નામ આપો.",
    "frequentlyAskedYears": [
      "GSEB 2023",
      "CBSE 2024"
    ],
    "modelAnswer": "Amoeba extends finger-like false feet called Pseudopodia around the food particle and engulfs it into a Food Vacuole.",
    "modelAnswerGujarati": "અમીબા ખોરાકના કણની આસપાસ ખોટા પગ (સ્યુડોપોડિયા) લંબાવીને ખોરાકને ઘેરી લે છે અને અન્નધાની (ફૂડ વેક્યુઓલ) બનાવે છે.",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "Naming Pseudopodia (false feet).",
        "textGujarati": "ખોટા પગ (સ્યુડોપોડિયા) નું નામ."
      },
      {
        "stepNumber": 2,
        "marksAllocated": "1 Mark",
        "text": "Formation of Food Vacuole.",
        "textGujarati": "અન્નધાનીનું નિર્માણ."
      }
    ],
    "examinerTips": "Keyword: Pseudopodia.",
    "examinerTipsGujarati": "કીવર્ડ: ખોટા પગ (Pseudopodia)."
  },
  {
    "id": "imp-g7-m-3m-1",
    "grade": "7",
    "board": "All",
    "subject": "Mathematics",
    "chapterNumber": 6,
    "chapterTitle": "The Triangle and its Properties",
    "chapterTitleGujarati": "ત્રિકોણ અને તેના ગુણધર્મો (પાયથાગોરસ)",
    "marks": 3,
    "marksCategory": "3-Mark Medium Sum",
    "questionText": "A 15 m long ladder reaches a window 12 m high from the ground on placing it against a wall. Find the distance of the foot of the ladder from the wall.",
    "questionTextGujarati": "૧૫ મીટર લાંબી નિસરણી દીવાલને અડકાવતાં જમીનથી ૧૨ મીટર ઊંચી બારી સુધી પહોંચે છે. નિસરણીના પાયાનું દીવાલથી અંતર શોધો.",
    "frequentlyAskedYears": [
      "GSEB 2024",
      "CBSE 2023"
    ],
    "modelAnswer": "1. In right-angled triangle ABC, Hypotenuse = 15 m, Height = 12 m, Base = a.\n2. By Pythagoras Theorem: (Hypotenuse)² = (Base)² + (Height)² => 15² = a² + 12².\n3. 225 = a² + 144 => a² = 225 - 144 = 81 => a = √81 = 9 m.",
    "modelAnswerGujarati": "૧. કાટકોણ ત્રિકોણમાં: કર્ણ = ૧૫ મી, ઊંચાઈ = ૧૨ મી, પાયો = a.\n૨. પાયથાગોરસ પ્રમેય: કર્ણ² = પાયો² + ઊંચાઈ² => ૧૫² = a² + ૧૨².\n૩. ૨૨૫ = a² + ૧૪૪ => a² = ૮૧ => a = ૯ મીટર.",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "Pythagoras theorem statement: H² = B² + P².",
        "textGujarati": "પાયથાગોરસ પ્રમેયનું સૂત્ર."
      },
      {
        "stepNumber": 2,
        "marksAllocated": "1 Mark",
        "text": "Calculation: 225 - 144 = 81.",
        "textGujarati": "ગણતરી: ૨૨૫ - ૧૪૪ = ૮૧."
      },
      {
        "stepNumber": 3,
        "marksAllocated": "1 Mark",
        "text": "Final answer: 9 meters.",
        "textGujarati": "અંતિમ જવાબ: ૯ મીટર."
      }
    ],
    "examinerTips": "Mention unit 'm' in the final line.",
    "examinerTipsGujarati": "જવાબ ૯ મીટર સ્પષ્ટ લખવો."
  },
  {
    "id": "imp-g7-s-3m-1",
    "grade": "7",
    "board": "All",
    "subject": "Science",
    "chapterNumber": 6,
    "chapterTitle": "Respiration in Organisms",
    "chapterTitleGujarati": "સજીવોમાં શ્વસન (જારક vs અજારક)",
    "marks": 3,
    "marksCategory": "3-Mark Medium Answer",
    "questionText": "Differentiate between Aerobic and Anaerobic respiration on 3 key points.",
    "questionTextGujarati": "જારક શ્વસન અને અજારક શ્વસન વચ્ચે ૩ મુખ્ય તફાવતો આપો.",
    "frequentlyAskedYears": [
      "GSEB 2024",
      "CBSE 2023"
    ],
    "modelAnswer": "1. Oxygen Requirement: Aerobic occurs in the presence of O2; Anaerobic occurs in absence of O2.\n2. End Products: Aerobic produces CO2 and H2O; Anaerobic produces Alcohol (in yeast) or Lactic acid (in human muscles) and CO2.\n3. Energy Released: Aerobic releases a large amount of energy (36-38 ATP); Anaerobic releases very little energy (2 ATP).",
    "modelAnswerGujarati": "૧. ઓક્સિજનની હાજરી: જારક O2 ની હાજરીમાં થાય; અજારક O2 ની ગેરહાજરીમાં થાય.\n૨. અંતિમ નીપજો: જારકમાં CO2 અને પાણી બને; અજારકમાં આલ્કોહોલ અથવા લેક્ટિક એસિડ બને.\n૩. શક્તિનું પ્રમાણ: જારકમાં વિપુલ શક્તિ મુક્ત થાય; અજારકમાં ઘણી ઓછી શક્તિ મુક્ત થાય.",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "Oxygen presence/absence difference.",
        "textGujarati": "ઓક્સિજન હાજરી/ગેરહાજરી તફાવત."
      },
      {
        "stepNumber": 2,
        "marksAllocated": "1 Mark",
        "text": "End products difference.",
        "textGujarati": "અંતિમ નીપજોનો તફાવત."
      },
      {
        "stepNumber": 3,
        "marksAllocated": "1 Mark",
        "text": "Energy yield difference.",
        "textGujarati": "ઊર્જા પ્રમાણનો તફાવત."
      }
    ],
    "examinerTips": "Mention muscle cramps caused by lactic acid during anaerobic respiration.",
    "examinerTipsGujarati": "સ્નાયુઓમાં લેક્ટિક એસિડનો ઉલ્લેખ કરો."
  },
  {
    "id": "imp-g7-m-4m-1",
    "grade": "7",
    "board": "All",
    "subject": "Mathematics",
    "chapterNumber": 8,
    "chapterTitle": "Comparing Quantities",
    "chapterTitleGujarati": "રાશિઓની તુલના (નફો-ખોટ અને સાદું વ્યાજ)",
    "marks": 4,
    "marksCategory": "4-Mark Long Answer",
    "questionText": "A shopkeeper bought an almirah for ₹5,000 and spent ₹400 on transport. He sold it at a profit of 15%. Find his total cost, profit amount, and the selling price.",
    "questionTextGujarati": "એક વેપારીએ ₹૫,૦૦૦ માં કબાટ ખરીદ્યો અને ₹૪૦૦ વાહન ખર્ચ થયો. તેણે આ કબાટ ૧૫% નફા સાથે વેચ્યો. તેની પડતર કિંમત, નફાની રકમ અને વેચાણ કિંમત શોધો.",
    "frequentlyAskedYears": [
      "GSEB 2024",
      "CBSE 2022"
    ],
    "modelAnswer": "1. Total Cost Price (CP) = Purchase Price + Transport = ₹5,000 + ₹400 = ₹5,400.\n2. Profit Percentage = 15%.\n3. Profit Amount = (15 / 100) × 5,400 = 15 × 54 = ₹810.\n4. Selling Price (SP) = CP + Profit = ₹5,400 + ₹810 = ₹6,210.",
    "modelAnswerGujarati": "૧. કુલ પડતર કિંમત (ખરાજાત સાથે) = ₹૫,૦૦૦ + ₹૪૦૦ = ₹૫,૪૦૦.\n૨. નફાની ટકાવારી = ૧૫%.\n૩. નફાની રકમ = (૧૫ / ૧૦૦) × ૫,૪૦૦ = ₹૮૧૦.\n૪. વેચાણ કિંમત = પડતર કિંમત + નફો = ₹૫,૪૦૦ + ₹૮૧૦ = ₹૬,૨૧૦.",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "Total CP calculation: ₹5,400.",
        "textGujarati": "પડતર કિંમત: ₹૫,૪૦૦."
      },
      {
        "stepNumber": 2,
        "marksAllocated": "1 Mark",
        "text": "Profit formula application.",
        "textGujarati": "નફાનું સૂત્ર વાપરવું."
      },
      {
        "stepNumber": 3,
        "marksAllocated": "1 Mark",
        "text": "Profit amount: ₹810.",
        "textGujarati": "નફાની રકમ: ₹૮૧૦."
      },
      {
        "stepNumber": 4,
        "marksAllocated": "1 Mark",
        "text": "Selling Price: ₹6,210.",
        "textGujarati": "વેચાણ કિંમત: ₹૬,૨૧૦."
      }
    ],
    "examinerTips": "Remember to add overhead expenses to purchase price before calculating profit.",
    "examinerTipsGujarati": "ખરાજાત હંમેશા મૂળ કિંમતમાં ઉમેરવી."
  },
  {
    "id": "imp-g7-ss-4m-1",
    "grade": "7",
    "board": "All",
    "subject": "Social Science",
    "chapterNumber": 4,
    "chapterTitle": "The Mughal Empire",
    "chapterTitleGujarati": "મુઘલ સામ્રાજ્ય (અકબરની વહીવટી નીતિ)",
    "marks": 4,
    "marksCategory": "4-Mark Long Answer",
    "questionText": "Explain the administrative and religious policies of Mughal Emperor Akbar (Mansabdari & Sulh-i Kul).",
    "questionTextGujarati": "મુઘલ બાદશાહ અકબરની વહીવટી વ્યવસ્થા (મનસબદારી પ્રથા) અને ધાર્મિક નીતિ (સુલહ-એ-કુલ) સમજાવો.",
    "frequentlyAskedYears": [
      "GSEB 2024",
      "CBSE 2023"
    ],
    "modelAnswer": "1. Mansabdari System: Grading system used to fix rank, salary, and military responsibilities (Zat and Sawar).\n2. Revenue System (Zabt): Todar Mal carried out careful survey of crop yields and prices; fixed tax at 1/3 of average produce.\n3. Religious Policy (Sulh-i Kul): Universal peace and tolerance towards all religions. Akbar abolished Jizya and pilgrim tax.\n4. Ibadat Khana: Hall built at Fatehpur Sikri where scholars of all faiths debated philosophy.",
    "modelAnswerGujarati": "૧. મનસબદારી પદ્ધતિ: સેના અને વહીવટ માટે હોદ્દો અને પગાર નક્કી કરતી વ્યવસ્થા (જાત અને સવાર).\n૨. મહેસૂલ વ્યવસ્થા: ટોડરમલે જમીન માપણી કરાવી ૧/૩ ભાગ મહેસૂલ નક્કી કર્યું.\n૩. ધાર્મિક નીતિ (સુલહ-એ-કુલ): સર્વધર્મ સમભાવની નીતિ. અકબરે જઝિયા વેરો અને યાત્રાવેરો રદ કર્યા.\n૪. ઇબાદતખાનું: ફતેહપુર સીકરીમાં બધા ધર્મોના વિદ્વાનો સાથે ધર્મચર્ચા કરવા ભવન બનાવ્યું.",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "Mansabdari system explanation.",
        "textGujarati": "મનસબદારી પદ્ધતિની સમજૂતી."
      },
      {
        "stepNumber": 2,
        "marksAllocated": "1 Mark",
        "text": "Todar Mal revenue reform (Zabt).",
        "textGujarati": "ટોડરમલની મહેસૂલ પદ્ધતિ."
      },
      {
        "stepNumber": 3,
        "marksAllocated": "1 Mark",
        "text": "Sulh-i Kul and tax abolition.",
        "textGujarati": "સુલહ-એ-કુલ અને વેરા નાબૂદી."
      },
      {
        "stepNumber": 4,
        "marksAllocated": "1 Mark",
        "text": "Ibadat Khana debates.",
        "textGujarati": "ઇબાદતખાનાની ચર્ચાઓ."
      }
    ],
    "examinerTips": "Mention Todar Mal and Sulh-i Kul explicitly.",
    "examinerTipsGujarati": "ટોડરમલ અને સુલહ-એ-કુલ શબ્દ ખાસ લખવા."
  },
  {
    "id": "imp-g8-m-1m-1",
    "grade": "8",
    "board": "All",
    "subject": "Mathematics",
    "chapterNumber": 1,
    "chapterTitle": "Rational Numbers",
    "chapterTitleGujarati": "સંમેય સંખ્યાઓ",
    "marks": 1,
    "marksCategory": "1-Mark Objective / VSA",
    "questionText": "What is the multiplicative inverse (reciprocal) of -13/19?",
    "questionTextGujarati": "-13/19 ની વ્યસ્ત સંમેય સંખ્યા કઈ છે?",
    "frequentlyAskedYears": [
      "GSEB 2024",
      "CBSE 2023"
    ],
    "modelAnswer": "The multiplicative inverse of -13/19 is -19/13 (because product equals 1).",
    "modelAnswerGujarati": "-13/19 ની વ્યસ્ત સંખ્યા -19/13 થાય છે.",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "-19/13.",
        "textGujarati": "-૧૯/૧૩."
      }
    ],
    "examinerTips": "Do not change the negative sign when finding reciprocal.",
    "examinerTipsGujarati": "વ્યસ્તમાં ઋણ ચિહ્ન બદલાતું નથી."
  },
  {
    "id": "imp-g8-s-1m-1",
    "grade": "8",
    "board": "All",
    "subject": "Science",
    "chapterNumber": 4,
    "chapterTitle": "Metals and Non-metals",
    "chapterTitleGujarati": "ધાતુઓ અને અધાતુઓ",
    "marks": 1,
    "marksCategory": "1-Mark Objective / VSA",
    "questionText": "Which non-metal is stored in water because it catches fire when exposed to air?",
    "questionTextGujarati": "હવામાં ખુલ્લો રાખતાં સળગી ઊઠતી કઈ અધાતુને પાણીમાં રાખવામાં આવે છે?",
    "frequentlyAskedYears": [
      "GSEB 2024",
      "CBSE 2022"
    ],
    "modelAnswer": "Phosphorus (White phosphorus) is stored in water.",
    "modelAnswerGujarati": "ફોસ્ફરસ અતિ સક્રિય અધાતુ હોવાથી તેને પાણીમાં સંગ્રહવામાં આવે છે.",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "Phosphorus.",
        "textGujarati": "ફોસ્ફરસ."
      }
    ],
    "examinerTips": "Sodium and Potassium are stored in kerosene; Phosphorus in water.",
    "examinerTipsGujarati": "સોડિયમ કેરોસીનમાં અને ફોસ્ફરસ પાણીમાં રખાય છે."
  },
  {
    "id": "imp-g8-m-2m-1",
    "grade": "8",
    "board": "All",
    "subject": "Mathematics",
    "chapterNumber": 2,
    "chapterTitle": "Linear Equations in One Variable",
    "chapterTitleGujarati": "એકચલ સુરેખ સમીકરણ",
    "marks": 2,
    "marksCategory": "2-Mark Short Answer",
    "questionText": "Solve the equation: 5x + 9 = 5 + 3x.",
    "questionTextGujarati": "સમીકરણ ઉકેલો: 5x + 9 = 5 + 3x.",
    "frequentlyAskedYears": [
      "NCERT Annual",
      "GSEB 2023"
    ],
    "modelAnswer": "Transpose 3x to LHS and 9 to RHS:\n5x - 3x = 5 - 9\n2x = -4\nx = -4 / 2 = -2.",
    "modelAnswerGujarati": "પક્ષાંતર કરતાં:\n૫x - ૩x = ૫ - ૯\n૨x = -૪\nx = -૪ / ૨ = -૨.",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "Transposing terms: 2x = -4.",
        "textGujarati": "પક્ષાંતર કરીને ૨x = -૪."
      },
      {
        "stepNumber": 2,
        "marksAllocated": "1 Mark",
        "text": "Final value x = -2.",
        "textGujarati": "અંતિમ જવાબ x = -૨."
      }
    ],
    "examinerTips": "Take care of the negative sign when computing 5 - 9 = -4.",
    "examinerTipsGujarati": "૫ - ૯ = -૪ માં ઋણ ચિહ્ન ભૂલવું નહીં."
  },
  {
    "id": "imp-g8-s-2m-1",
    "grade": "8",
    "board": "All",
    "subject": "Science",
    "chapterNumber": 8,
    "chapterTitle": "Cell - Structure and Functions",
    "chapterTitleGujarati": "કોષ - રચના અને કાર્યો",
    "marks": 2,
    "marksCategory": "2-Mark Short Answer",
    "questionText": "State two major differences between a Plant Cell and an Animal Cell.",
    "questionTextGujarati": "વનસ્પતિકોષ અને પ્રાણીકોષ વચ્ચેના બે મુખ્ય તફાવતો આપો.",
    "frequentlyAskedYears": [
      "GSEB 2024",
      "CBSE 2023"
    ],
    "modelAnswer": "1. Cell Wall: Plant cells possess an outer rigid cellulose cell wall; animal cells lack a cell wall.\n2. Plastids/Chloroplasts: Present in plant cells for photosynthesis; absent in animal cells.",
    "modelAnswerGujarati": "૧. કોષદીવાલ: વનસ્પતિકોષમાં સેલ્યુલોઝની બનેલી કોષદીવાલ હોય છે; પ્રાણીકોષમાં ગેરહાજર હોય છે.\n૨. હરિતકણ (ક્લોરોપ્લાસ્ટ): વનસ્પતિકોષમાં પ્રકાશસંશ્લેષણ માટે હાજર હોય છે; પ્રાણીકોષમાં હોતા નથી.",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "Cell wall presence/absence.",
        "textGujarati": "કોષદીવાલની હાજરી/ગેરહાજરી."
      },
      {
        "stepNumber": 2,
        "marksAllocated": "1 Mark",
        "text": "Chloroplasts/Plastids presence/absence.",
        "textGujarati": "હરિતકણની હાજરી/ગેરહાજરી."
      }
    ],
    "examinerTips": "Also mention large central vacuole in plant cells if asked for a 3rd point.",
    "examinerTipsGujarati": "રસધાનીનું કદ પણ દર્શાવી શકાય."
  },
  {
    "id": "imp-g8-m-3m-1",
    "grade": "8",
    "board": "All",
    "subject": "Mathematics",
    "chapterNumber": 6,
    "chapterTitle": "Squares and Square Roots",
    "chapterTitleGujarati": "વર્ગ અને વર્ગમૂળ",
    "marks": 3,
    "marksCategory": "3-Mark Medium Sum",
    "questionText": "Find the smallest whole number by which 252 must be multiplied to make it a perfect square. Also find the square root of the new number.",
    "questionTextGujarati": "252 ને કઈ નાનામાં નાની સંખ્યા વડે ગુણવાથી તે પૂર્ણવર્ગ બને? નવી પૂર્ણવર્ગ સંખ્યાનું વર્ગમૂળ પણ શોધો.",
    "frequentlyAskedYears": [
      "GSEB 2023",
      "CBSE 2024"
    ],
    "modelAnswer": "1. Prime factorization of 252: 252 = 2 × 2 × 3 × 3 × 7 = (2² × 3² × 7).\n2. The prime factor 7 does not have a pair. Therefore, 252 must be multiplied by 7.\n3. New number = 252 × 7 = 1,764.\n4. Square root: √(1,764) = 2 × 3 × 7 = 42.",
    "modelAnswerGujarati": "૧. ૨૫૨ ના અવિભાજ્ય અવયવો: ૨૫૨ = ૨ × ૨ × ૩ × ૩ × ૭ = ૨² × ૩² × ૭.\n૨. અહીં ૭ ની જોડ બનતી નથી, માટે ૨૫૨ ને ૭ વડે ગુણવા પડે.\n૩. નવી પૂર્ણવર્ગ સંખ્યા = ૨૫૨ × ૭ = ૧,૭૬૪.\n૪. વર્ગમૂળ: √(૧૭૬૪) = ૨ × ૩ × ૭ = ૪૨.",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "Prime factorization: 2² × 3² × 7.",
        "textGujarati": "અવિભાજ્ય અવયવીકરણ: ૨² × ૩² × ૭."
      },
      {
        "stepNumber": 2,
        "marksAllocated": "1 Mark",
        "text": "Identifying multiplier: 7.",
        "textGujarati": "ગુણક ૭ ઓળખવો."
      },
      {
        "stepNumber": 3,
        "marksAllocated": "1 Mark",
        "text": "Square root = 42.",
        "textGujarati": "વર્ગમૂળ = ૪૨."
      }
    ],
    "examinerTips": "Remember to write both answers: multiplier 7 and square root 42.",
    "examinerTipsGujarati": "૭ અને ૪૨ બંને ઉત્તર સ્પષ્ટ લખો."
  },
  {
    "id": "imp-g8-s-3m-1",
    "grade": "8",
    "board": "All",
    "subject": "Science",
    "chapterNumber": 11,
    "chapterTitle": "Force and Pressure",
    "chapterTitleGujarati": "બળ અને દબાણ",
    "marks": 3,
    "marksCategory": "3-Mark Medium Answer",
    "questionText": "Why are school bags provided with wide straps? Explain using the formula for pressure.",
    "questionTextGujarati": "સ્કૂલ બેગના પટ્ટા પહોળા કેમ રાખવામાં આવે છે? દબાણના સૂત્ર દ્વારા સમજાવો.",
    "frequentlyAskedYears": [
      "GSEB 2024",
      "CBSE 2023"
    ],
    "modelAnswer": "1. Pressure is defined as force per unit area: Pressure = Force / Area (P = F / A).\n2. Pressure is inversely proportional to the surface area of contact for a given force (weight of books).\n3. Wide straps increase the surface area in contact with the shoulder.\n4. Therefore, the downward pressure exerted on the child's shoulder decreases significantly, making it comfortable to carry.",
    "modelAnswerGujarati": "૧. દબાણનું સૂત્ર: દબાણ = બળ / ક્ષેત્રફળ (P = F / A).\n૨. સમાન વજન માટે દબાણ એ ક્ષેત્રફળના વ્યસ્ત પ્રમાણમાં હોય છે.\n૩. પહોળા પટ્ટા ખભા પર સંપર્ક ક્ષેત્રફળમાં વધારો કરે છે.\n૪. ક્ષેત્રફળ વધતાં ખભા પર લાગતું દબાણ ઘટી જાય છે અને બાળકને ખભા પર દુખાવો થતો નથી.",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "Formula: P = F / A.",
        "textGujarati": "સૂત્ર P = F / A."
      },
      {
        "stepNumber": 2,
        "marksAllocated": "1 Mark",
        "text": "Inverse relation: Area increases => Pressure decreases.",
        "textGujarati": "વ્યસ્ત સંબંધ: ક્ષેત્રફળ વધે તો દબાણ ઘટે."
      },
      {
        "stepNumber": 3,
        "marksAllocated": "1 Mark",
        "text": "Conclusion on reduced shoulder discomfort.",
        "textGujarati": "ખભા પર ઓછું દબાણ તારણ."
      }
    ],
    "examinerTips": "The formula P = F/A is compulsory for full marks.",
    "examinerTipsGujarati": "P = F/A સૂત્ર અવશ્ય લખવું."
  },
  {
    "id": "imp-g8-m-4m-1",
    "grade": "8",
    "board": "All",
    "subject": "Mathematics",
    "chapterNumber": 11,
    "chapterTitle": "Mensuration",
    "chapterTitleGujarati": "ક્ષેત્રમિતિ (નળાકારની સપાટીનું ક્ષેત્રફળ)",
    "marks": 4,
    "marksCategory": "4-Mark Long Answer",
    "questionText": "A cylindrical water tank has radius 1.4 m and height 3 m. Find its total surface area and capacity in liters (1 m³ = 1000 Liters). (Use π = 22/7)",
    "questionTextGujarati": "૧.૪ મીટર ત્રિજ્યા અને ૩ મીટર ઊંચાઈ ધરાવતી નળાકાર પાણીની ટાંકીનું કુલ પૃષ્ઠફળ અને લિટરમાં ક્ષમતા શોધો (૧ મી³ = ૧૦૦૦ લિટર).",
    "frequentlyAskedYears": [
      "GSEB 2024",
      "CBSE 2023"
    ],
    "modelAnswer": "Given: r = 1.4 m, h = 3 m.\n1. Total Surface Area (TSA) = 2πr(r + h) = 2 × (22/7) × 1.4 × (1.4 + 3) = 2 × 22 × 0.2 × 4.4 = 8.8 × 4.4 = 38.72 m².\n2. Volume = πr²h = (22/7) × (1.4)² × 3 = (22/7) × 1.96 × 3 = 22 × 0.28 × 3 = 18.48 m³.\n3. Capacity in liters = Volume × 1000 = 18.48 × 1000 = 18,480 Liters.",
    "modelAnswerGujarati": "વિગતો: r = ૧.૪ મી, h = ૩ મી.\n૧. કુલ પૃષ્ઠફળ = ૨πr(r + h) = ૨ × (૨૨/૭) × ૧.૪ × (૧.૪ + ૩) = ૮.૮ × ૪.૪ = ૩૮.૭૨ મી².\n૨. ઘનફળ = πr²h = (૨૨/૭) × ૧.૪ × ૧.૪ × ૩ = ૨૨ × ૦.૨૮ × ૩ = ૧૮.૪૮ મી³.\n૩. લિટરમાં ક્ષમતા = ૧૮.૪૮ × ૧૦૦૦ = ૧૮,૪૮૦ લિટર.",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "TSA formula and substitution.",
        "textGujarati": "કુલ પૃષ્ઠફળનું સૂત્ર અને કિંમત."
      },
      {
        "stepNumber": 2,
        "marksAllocated": "1 Mark",
        "text": "TSA = 38.72 m².",
        "textGujarati": "પૃષ્ઠફળ = ૩૮.૭૨ મી²."
      },
      {
        "stepNumber": 3,
        "marksAllocated": "1 Mark",
        "text": "Volume calculation = 18.48 m³.",
        "textGujarati": "ઘનફળ = ૧૮.૪૮ મી³."
      },
      {
        "stepNumber": 4,
        "marksAllocated": "1 Mark",
        "text": "Capacity = 18,480 Liters.",
        "textGujarati": "ક્ષમતા = ૧૮,૪૮૦ લિટર."
      }
    ],
    "examinerTips": "Multiply volume by 1000 to convert m³ to liters.",
    "examinerTipsGujarati": "મી³ માંથી લિટરમાં ફેરવવા ૧૦૦૦ વડે ગુણો."
  },
  {
    "id": "imp-g8-ss-4m-1",
    "grade": "8",
    "board": "All",
    "subject": "Social Science",
    "chapterNumber": 5,
    "chapterTitle": "When People Rebel: 1857 and After",
    "chapterTitleGujarati": "૧૮૫૭નો પ્રથમ સ્વાતંત્ર્ય સંગ્રામ",
    "marks": 4,
    "marksCategory": "4-Mark Long Answer",
    "questionText": "What were the main political, economic, and military causes of the Indian Revolt of 1857?",
    "questionTextGujarati": "૧૮૫૭ના પ્રથમ સ્વાતંત્ર્ય સંગ્રામના મુખ્ય રાજકીય, આર્થિક અને લશ્કરી કારણો જણાવો.",
    "frequentlyAskedYears": [
      "GSEB 2024",
      "CBSE 2022"
    ],
    "modelAnswer": "1. Political Causes: Dalhousie's Doctrine of Lapse annexed states like Jhansi, Satara, and Nagpur. Disrespect to Mughal Emperor.\n2. Economic Causes: Heavy land revenue, ruin of traditional Indian handicrafts and weavers due to British factory imports.\n3. Military Causes: Indian sepoys were paid much less than European soldiers, denied batta (foreign allowance), and faced racial discrimination.\n4. Immediate Cause: Introduction of Enfield rifle cartridges greased with cow and pig fat, offending Hindu and Muslim religious sentiments.",
    "modelAnswerGujarati": "૧. રાજકીય કારણો: ડેલહાઉસીની ખાલસાનીતિ (ઝાંસી, સતારા, નાગપુરનું જોડાણ). મુઘલ બાદશાહનું અપમાન.\n૨. આર્થિક કારણો: ઊંચું જમીન મહેસૂલ, બ્રિટિશ કાપડથી ભારતના ગૃહઉદ્યોગો અને વણકરોની બરબાદી.\n૩. લશ્કરી કારણો: ભારતીય સૈનિકોને અંગ્રેજ સૈનિકો કરતાં ઓછો પગાર અને વિદેશ ભથ્થું ન આપવું.\n૪. તાત્કાલિક કારણ: ગાય અને ડુક્કરની ચરબીવાળા એનફિલ્ડ રાઇફલના કારતૂસોનો વિરોધ.",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "Doctrine of Lapse & political annexation.",
        "textGujarati": "ખાલસાનીતિ અને રાજકીય કારણ."
      },
      {
        "stepNumber": 2,
        "marksAllocated": "1 Mark",
        "text": "Economic exploitation of artisans.",
        "textGujarati": "કારીગરોનું આર્થિક શોષણ."
      },
      {
        "stepNumber": 3,
        "marksAllocated": "1 Mark",
        "text": "Military discrimination of sepoys.",
        "textGujarati": "સૈનિકો સાથે ભેદભાવ."
      },
      {
        "stepNumber": 4,
        "marksAllocated": "1 Mark",
        "text": "Enfield rifle greased cartridges (immediate cause).",
        "textGujarati": "ચરબીવાળા કારતૂસો (તાત્કાલિક કારણ)."
      }
    ],
    "examinerTips": "Categorize answers under clear subheadings: Political, Economic, Military, Immediate.",
    "examinerTipsGujarati": "મુદ્દાસર પેટા-શીર્ષકો સાથે લખો."
  },
  {
    "id": "imp-g9-m-1m-1",
    "grade": "9",
    "board": "All",
    "subject": "Mathematics",
    "chapterNumber": 1,
    "chapterTitle": "Number Systems",
    "chapterTitleGujarati": "સંખ્યા પદ્ધતિ",
    "marks": 1,
    "marksCategory": "1-Mark Objective / VSA",
    "questionText": "What is the rationalising factor of (3 + √5)?",
    "questionTextGujarati": "(3 + √5) નો સંમેયકારક અવયવ કયો છે?",
    "frequentlyAskedYears": [
      "GSEB 2024",
      "CBSE 2023"
    ],
    "modelAnswer": "The rationalising factor (conjugate) of (3 + √5) is (3 - √5).",
    "modelAnswerGujarati": "(3 + √5) નો સંમેયકારક અવયવ (3 - √5) છે.",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "(3 - √5).",
        "textGujarati": "(૩ - √૫)."
      }
    ],
    "examinerTips": "Change the middle sign between terms to find the conjugate.",
    "examinerTipsGujarati": "વચ્ચેનું ચિહ્ન બદલવાથી સંમેયકારક અવયવ મળે."
  },
  {
    "id": "imp-g9-s-1m-1",
    "grade": "9",
    "board": "All",
    "subject": "Science",
    "chapterNumber": 5,
    "chapterTitle": "The Fundamental Unit of Life",
    "chapterTitleGujarati": "જીવનનો મૂળભૂત એકમ",
    "marks": 1,
    "marksCategory": "1-Mark Objective / VSA",
    "questionText": "Which cellular organelle possesses its own DNA and ribosomes to make some of its own proteins?",
    "questionTextGujarati": "કઈ અંગિકા પોતાનું આગવું DNA અને રિબોઝોમ્સ ધરાવે છે?",
    "frequentlyAskedYears": [
      "GSEB 2024",
      "CBSE 2022"
    ],
    "modelAnswer": "Mitochondria (and Chloroplasts/Plastids in plants).",
    "modelAnswerGujarati": "કણાભસૂત્ર (માઇટોકોન્ડ્રિયા) અને હરિતકણ પોતાનું આગવું DNA ધરાવે છે.",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "Mitochondria.",
        "textGujarati": "કણાભસૂત્ર."
      }
    ],
    "examinerTips": "Mitochondria is also semi-autonomous organelle.",
    "examinerTipsGujarati": "કણાભસૂત્ર અર્ધ-સ્વયંસંચાલિત અંગિકા છે."
  },
  {
    "id": "imp-g9-m-2m-1",
    "grade": "9",
    "board": "All",
    "subject": "Mathematics",
    "chapterNumber": 2,
    "chapterTitle": "Polynomials",
    "chapterTitleGujarati": "બહુપદીઓ",
    "marks": 2,
    "marksCategory": "2-Mark Short Answer",
    "questionText": "Factorize the quadratic polynomial: 12x² - 7x + 1 by splitting the middle term.",
    "questionTextGujarati": "મધ્યમ પદના ભાગ પાડીને અવયવ પાડો: 12x² - 7x + 1.",
    "frequentlyAskedYears": [
      "GSEB 2024",
      "CBSE 2023"
    ],
    "modelAnswer": "Product = 12 × 1 = 12. Sum = -7. Factors are -3 and -4.\n12x² - 4x - 3x + 1 = 4x(3x - 1) - 1(3x - 1) = (3x - 1)(4x - 1).",
    "modelAnswerGujarati": "ગુણાકાર = ૧૨ × ૧ = ૧૨. સરવાળો = -૭. અવયવો: -૩ અને -૪.\n૧૨x² - ૪x - ૩x + ૧ = ૪x(૩x - ૧) - ૧(૩x - ૧) = (૩x - ૧)(૪x - ૧).",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "Splitting middle term: -4x - 3x.",
        "textGujarati": "મધ્યમ પદના ભાગ: -૪x - ૩x."
      },
      {
        "stepNumber": 2,
        "marksAllocated": "1 Mark",
        "text": "Common factors: (3x - 1)(4x - 1).",
        "textGujarati": "અંતિમ અવયવો: (૩x - ૧)(૪x - ૧)."
      }
    ],
    "examinerTips": "Double check negative signs when taking -1 common.",
    "examinerTipsGujarati": "-૧ સામાન્ય લેતાં ચિહ્ન બદલાય તે ધ્યાન રાખવું."
  },
  {
    "id": "imp-g9-m-3m-1",
    "grade": "9",
    "board": "All",
    "subject": "Mathematics",
    "chapterNumber": 10,
    "chapterTitle": "Circles",
    "chapterTitleGujarati": "વર્તુળ (પ્રમેય)",
    "marks": 3,
    "marksCategory": "3-Mark Medium Theorem",
    "questionText": "Prove that equal chords of a circle subtend equal angles at the centre.",
    "questionTextGujarati": "સાબિત કરો કે વર્તુળની સમાન જીવાઓ કેન્દ્ર આગળ સમાન ખૂણા આંતરે છે.",
    "frequentlyAskedYears": [
      "GSEB 2024",
      "CBSE 2023"
    ],
    "modelAnswer": "Given: A circle with centre O and equal chords AB = CD.\nTo Prove: ∠AOB = ∠COD.\nProof: In △AOB and △COD:\nOA = OC (Radii of the same circle)\nOB = OD (Radii of the same circle)\nAB = CD (Given)\nBy SSS Congruence Criterion, △AOB ≅ △COD.\nHence, ∠AOB = ∠COD (by CPCT).",
    "modelAnswerGujarati": "પક્ષ: O કેન્દ્રવાળા વર્તુળમાં સમાન જીવાઓ AB = CD.\nસાધ્ય: ∠AOB = ∠COD.\nસાબિતી: △AOB અને △COD માં:\nOA = OC (સમાન વર્તુળની ત્રિજ્યાઓ)\nOB = OD (સમાન વર્તુળની ત્રિજ્યાઓ)\nAB = CD (પક્ષ)\nબાબાબા (SSS) શરત મુજબ: △AOB ≅ △COD.\nઆથી, અનુરૂપ અંગો CPCT મુજબ ∠AOB = ∠COD સાબિત થાય છે.",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "Given, to prove, and circle diagram.",
        "textGujarati": "પક્ષ, સાધ્ય અને આકૃતિ."
      },
      {
        "stepNumber": 2,
        "marksAllocated": "1 Mark",
        "text": "Radii equality and SSS congruence step.",
        "textGujarati": "ત્રિજ્યાઓની સમાનતા અને બાબાબા શરત."
      },
      {
        "stepNumber": 3,
        "marksAllocated": "1 Mark",
        "text": "CPCT conclusion ∠AOB = ∠COD.",
        "textGujarati": "CPCT મુજબ ખૂણા સમાન."
      }
    ],
    "examinerTips": "Always draw a neat circle with chords AB and CD using a compass.",
    "examinerTipsGujarati": "પરિકર વડે વર્તુળની આકૃતિ દોરવી."
  },
  {
    "id": "imp-g9-s-3m-1",
    "grade": "9",
    "board": "All",
    "subject": "Science",
    "chapterNumber": 9,
    "chapterTitle": "Force and Laws of Motion",
    "chapterTitleGujarati": "બળ અને ગતિના નિયમો (વેગમાન સંરક્ષણ)",
    "marks": 3,
    "marksCategory": "3-Mark Medium Answer",
    "questionText": "State Newton’s Third Law of Motion. Give two real-world examples illustrating it.",
    "questionTextGujarati": "ન્યૂટનનો ગતિનો ત્રીજો નિયમ લખો અને તેના બે વાસ્તવિક ઉદાહરણો સમજાવો.",
    "frequentlyAskedYears": [
      "GSEB 2024",
      "CBSE 2023"
    ],
    "modelAnswer": "Statement: To every action, there is always an equal and opposite reaction; they act on two different bodies.\nExamples:\n1. Recoil of Gun: When a bullet is fired forward (action), the gun recoils backward with an equal opposite force (reaction).\n2. Rocket Propulsion: Burning gases rushed downward with high force (action), thrusting the rocket upward into space (reaction).",
    "modelAnswerGujarati": "વિધાન: પરસ્પર પ્રક્રિયા કરતાં બે પદાર્થો વચ્ચે ક્રિયાબળ અને પ્રતિક્રિયાબળ હંમેશા સમાન મૂલ્યના અને પરસ્પર વિરુદ્ધ દિશામાં હોય છે.\nઉદાહરણો:\n૧. બંદૂકનો રિકોઇલ (પાછળ ધકેલાવું): ગોળી આગળ છૂટે (ક્રિયાબળ) ત્યારે બંદૂક પાછળ ધકેલાય છે (પ્રતિક્રિયાબળ).\n૨. રોકેટની ગતિ: વાયુઓ જોરથી નીચે બહાર નીકળે (ક્રિયાબળ) જેથી રોકેટ આકાશમાં ઉપર ધકેલાય છે (પ્રતિક્રિયાબળ).",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "Accurate statement of 3rd Law.",
        "textGujarati": "ત્રીજા નિયમનું સાચું વિધાન."
      },
      {
        "stepNumber": 2,
        "marksAllocated": "1 Mark",
        "text": "Gun recoil example.",
        "textGujarati": "બંદૂક રિકોઇલ ઉદાહરણ."
      },
      {
        "stepNumber": 3,
        "marksAllocated": "1 Mark",
        "text": "Rocket propulsion example.",
        "textGujarati": "રોકેટ પ્રોપલ્શન ઉદાહરણ."
      }
    ],
    "examinerTips": "Crucial note: Action and reaction act on TWO DIFFERENT bodies.",
    "examinerTipsGujarati": "ક્રિયાબળ અને પ્રતિક્રિયાબળ જુદા જુદા પદાર્થો પર લાગે છે."
  },
  {
    "id": "imp-g9-m-4m-1",
    "grade": "9",
    "board": "All",
    "subject": "Mathematics",
    "chapterNumber": 13,
    "chapterTitle": "Surface Areas and Volumes",
    "chapterTitleGujarati": "પૃષ્ઠફળ અને ઘનફળ (શંકુ અને અર્ધગોળો)",
    "marks": 4,
    "marksCategory": "4-Mark Long Answer",
    "questionText": "A solid toy is in the form of a hemisphere surmounted by a right circular cone. The radius of both is 3.5 cm and total height of the toy is 15.5 cm. Find the total surface area of the toy. (Use π = 22/7)",
    "questionTextGujarati": "એક રમકડું ૩.૫ સેમી ત્રિજ્યાવાળા અર્ધગોળા પર તેટલી જ ત્રિજ્યાવાળો શંકુ બેસાડીને બનાવેલું છે. રમકડાની કુલ ઊંચાઈ ૧૫.૫ સેમી હોય, તો તેનું કુલ પૃષ્ઠફળ શોધો.",
    "frequentlyAskedYears": [
      "GSEB 2024",
      "CBSE 2023"
    ],
    "modelAnswer": "Given: r = 3.5 cm. Total height = 15.5 cm.\n1. Height of cone h = Total height - radius of hemisphere = 15.5 - 3.5 = 12 cm.\n2. Slant height of cone l = √(r² + h²) = √(3.5² + 12²) = √(12.25 + 144) = √156.25 = 12.5 cm.\n3. Total Surface Area = CSA of cone + CSA of hemisphere = πrl + 2πr² = πr(l + 2r)\n= (22/7) × 3.5 × (12.5 + 2 × 3.5) = 22 × 0.5 × (12.5 + 7) = 11 × 19.5 = 214.5 cm².",
    "modelAnswerGujarati": "વિગતો: r = ૩.૫ સેમી, કુલ ઊંચાઈ = ૧૫.૫ સેમી.\n૧. શંકુની ઊંચાઈ h = ૧૫.૫ - ૩.૫ = ૧૨ સેમી.\n૨. શંકુની ત્રાસી ઊંચાઈ l = √(r² + h²) = √(૩.૫² + ૧૨²) = √૧૫૬.૨૫ = ૧૨.૫ સેમી.\n૩. રમકડાનું કુલ પૃષ્ઠફળ = શંકુની વક્રસપાટી + અર્ધગોળાની વક્રસપાટી = πrl + ૨πr² = πr(l + ૨r)\n= (૨૨/૭) × ૩.૫ × (૧૨.૫ + ૭) = ૧૧ × ૧૯.૫ = ૨૧૪.૫ સેમી².",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "Cone height h = 12 cm.",
        "textGujarati": "શંકુની ઊંચાઈ h = ૧૨ સેમી."
      },
      {
        "stepNumber": 2,
        "marksAllocated": "1 Mark",
        "text": "Slant height l = 12.5 cm.",
        "textGujarati": "ત્રાસી ઊંચાઈ l = ૧૨.૫ સેમી."
      },
      {
        "stepNumber": 3,
        "marksAllocated": "1 Mark",
        "text": "TSA formula: πr(l + 2r).",
        "textGujarati": "પૃષ્ઠફળનું સૂત્ર: πr(l + ૨r)."
      },
      {
        "stepNumber": 4,
        "marksAllocated": "1 Mark",
        "text": "Final answer = 214.5 cm².",
        "textGujarati": "અંતિમ જવાબ = ૨૧૪.૫ સેમી²."
      }
    ],
    "examinerTips": "Do NOT include the flat base of the cone or hemisphere; they are glued together.",
    "examinerTipsGujarati": "વચ્ચેનો સપાટ ભાગ અંદર ઢંકાઈ જતો હોવાથી માત્ર વક્રસપાટી ગણવી."
  },
  {
    "id": "imp-g9-s-4m-1",
    "grade": "9",
    "board": "All",
    "subject": "Science",
    "chapterNumber": 10,
    "chapterTitle": "Gravitation",
    "chapterTitleGujarati": "ગુરુત્વાકર્ષણ (ન્યૂટનનો સાર્વત્રિક નિયમ)",
    "marks": 4,
    "marksCategory": "4-Mark Long Answer",
    "questionText": "State Universal Law of Gravitation. Derive its mathematical formula and deduce the formula for acceleration due to gravity (g) in terms of Earth's mass M and radius R.",
    "questionTextGujarati": "ગુરુત્વાકર્ષણનો સાર્વત્રિક નિયમ લખો. તેનું ગાણિતિક સૂત્ર તારવો અને પૃથ્વીના દળ M તથા ત્રિજ્યા R ના સંદર્ભમાં ગુરુત્વપ્રવેગ (g) નું સૂત્ર મેળવો.",
    "frequentlyAskedYears": [
      "GSEB 2024",
      "CBSE 2022"
    ],
    "modelAnswer": "1. Statement: Every particle in the universe attracts every other particle with a force directly proportional to the product of their masses and inversely proportional to the square of distance between their centres.\n2. Formula: F ∝ (m1 m2) / r² => F = G (m1 m2) / r².\n3. For an object of mass m on Earth: Weight F = m · g.\n4. Equating: m · g = G (M · m) / R² => g = G M / R².\nValue of g ≈ 9.8 m/s².",
    "modelAnswerGujarati": "૧. વિધાન: વિશ્વનો પ્રત્યેક પદાર્થ બીજા પદાર્થ પર આકર્ષણ બળ લગાડે છે, જે બંને પદાર્થોના દળના ગુણાકારના સમપ્રમાણમાં અને તેમની વચ્ચેના અંતરના વર્ગના વ્યસ્ત પ્રમાણમાં હોય છે.\n૨. ગાણિતિક સૂત્ર: F = G (m1 m2) / r².\n૩. પૃથ્વી પર m દળવાળા પદાર્થનું વજન: F = m · g.\n૪. સરખાવતા: m · g = G (M · m) / R² => g = G M / R².\ng નું સરેરાશ મૂલ્ય ≈ ૯.૮ મી/સે².",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "Accurate statement of Universal Law.",
        "textGujarati": "સાર્વત્રિક નિયમનું વિધાન."
      },
      {
        "stepNumber": 2,
        "marksAllocated": "1 Mark",
        "text": "Formula F = G m1 m2 / r².",
        "textGujarati": "સૂત્ર F = G m1 m2 / r²."
      },
      {
        "stepNumber": 3,
        "marksAllocated": "1 Mark",
        "text": "Equating with weight mg.",
        "textGujarati": "વજન mg સાથે સરખામણી."
      },
      {
        "stepNumber": 4,
        "marksAllocated": "1 Mark",
        "text": "Final formula: g = GM / R².",
        "textGujarati": "અંતિમ સૂત્ર g = GM / R²."
      }
    ],
    "examinerTips": "Note that g is independent of the mass of the falling object m.",
    "examinerTipsGujarati": "ધ્યાન રાખો: ગુરુત્વપ્રવેગ પદાર્થના દળ m પર આધાર રાખતો નથી."
  },
  {
    "id": "imp-g11-p-1m-1",
    "grade": "11",
    "board": "All",
    "subject": "Physics",
    "chapterNumber": 2,
    "chapterTitle": "Units and Measurements",
    "chapterTitleGujarati": "એકમો અને માપન",
    "marks": 1,
    "marksCategory": "1-Mark Objective / VSA",
    "questionText": "What is the dimensional formula of Coefficient of Viscosity (η)?",
    "questionTextGujarati": "શ્યાનતા ગુણાંક (η) નું પારિમાણિક સૂત્ર લખો.",
    "frequentlyAskedYears": [
      "GSEB 2024",
      "CBSE 2023"
    ],
    "modelAnswer": "From Stokes' Law F = 6πηrv => η = F / (6πrv) => [M L T^-2] / [L][L T^-1] = [M^1 L^-1 T^-1].",
    "modelAnswerGujarati": "સ્ટોક્સના નિયમ પરથી: [M^1 L^-1 T^-1].",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "[M^1 L^-1 T^-1].",
        "textGujarati": "[M^1 L^-1 T^-1]."
      }
    ],
    "examinerTips": "Frequently tested in NEET and GUJCET.",
    "examinerTipsGujarati": "GUJCET અને NEET માં વારંવાર પૂછાતો પ્રશ્ન."
  },
  {
    "id": "imp-g11-c-1m-1",
    "grade": "11",
    "board": "All",
    "subject": "Chemistry",
    "chapterNumber": 3,
    "chapterTitle": "Periodic Classification",
    "chapterTitleGujarati": "તત્વોનું આવર્તી વર્ગીકરણ",
    "marks": 1,
    "marksCategory": "1-Mark Objective / VSA",
    "questionText": "Which element has the highest negative electron gain enthalpy in the periodic table?",
    "questionTextGujarati": "આવર્ત કોષ્ટકમાં કયું તત્વ સૌથી વધુ ઋણ ઇલેક્ટ્રોન પ્રાપ્તિ એન્થાલ્પી ધરાવે છે?",
    "frequentlyAskedYears": [
      "GSEB 2024",
      "CBSE 2023"
    ],
    "modelAnswer": "Chlorine (Cl) has higher electron gain enthalpy than Fluorine due to less inter-electronic repulsion in its 3p subshell.",
    "modelAnswerGujarati": "ક્લોરીન (Cl) ની ઇલેક્ટ્રોન પ્રાપ્તિ એન્થાલ્પી ફ્લોરિન કરતાં વધુ ઋણ છે કારણ કે ૩p કક્ષકમાં અપાકર્ષણ ઓછું હોય છે.",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "Chlorine (Cl).",
        "textGujarati": "ક્લોરીન (Cl)."
      }
    ],
    "examinerTips": "Do not confuse electronegativity (highest: F) with electron gain enthalpy (highest: Cl).",
    "examinerTipsGujarati": "વિદ્યુતઋણતા F ની વધુ છે, પણ ઇલેક્ટ્રોન પ્રાપ્તિ Cl ની વધુ છે."
  },
  {
    "id": "imp-g11-m-2m-1",
    "grade": "11",
    "board": "All",
    "subject": "Mathematics",
    "chapterNumber": 3,
    "chapterTitle": "Trigonometric Functions",
    "chapterTitleGujarati": "ત્રિકોણમિતીય વિધેયો",
    "marks": 2,
    "marksCategory": "2-Mark Short Answer",
    "questionText": "Find the value of sin(75°) using compound angle formulas.",
    "questionTextGujarati": "સંયુક્ત ખૂણાના સૂત્રથી sin(75°) ની કિંમત શોધો.",
    "frequentlyAskedYears": [
      "GSEB 2024",
      "CBSE 2023"
    ],
    "modelAnswer": "sin(75°) = sin(45° + 30°) = sin 45° cos 30° + cos 45° sin 30°\n= (1/√2)(√3/2) + (1/√2)(1/2) = (√3 + 1) / (2√2).",
    "modelAnswerGujarati": "sin(75°) = sin(45° + 30°) = sin 45° cos 30° + cos 45° sin 30°\n= (1/√2)(√3/2) + (1/√2)(1/2) = (√3 + 1) / (2√2).",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "Compound formula: sin(A+B) = sinA cosB + cosA sinB.",
        "textGujarati": "સંયુક્ત સૂત્ર: sin(A+B)."
      },
      {
        "stepNumber": 2,
        "marksAllocated": "1 Mark",
        "text": "Final value: (√3 + 1) / (2√2).",
        "textGujarati": "અંતિમ કિંમત: (√૩ + ૧) / (૨√૨)."
      }
    ],
    "examinerTips": "Can also be rationalized to (√6 + √2)/4.",
    "examinerTipsGujarati": "(√૬ + √૨)/૪ પણ માન્ય છે."
  },
  {
    "id": "imp-g11-p-2m-1",
    "grade": "11",
    "board": "All",
    "subject": "Physics",
    "chapterNumber": 6,
    "chapterTitle": "Work, Energy and Power",
    "chapterTitleGujarati": "કાર્ય, ઊર્જા અને પાવર",
    "marks": 2,
    "marksCategory": "2-Mark Short Answer",
    "questionText": "State Work-Energy Theorem for a variable force.",
    "questionTextGujarati": "ચલ બળ માટે કાર્ય-ઊર્જા પ્રમેય લખો.",
    "frequentlyAskedYears": [
      "GSEB 2024",
      "CBSE 2022"
    ],
    "modelAnswer": "The work done by all forces acting on a body is equal to the change in its kinetic energy: W = ΔK = Kf - Ki = 1/2 m vf² - 1/2 m vi².",
    "modelAnswerGujarati": "પદાર્થ પર લાગતા પરિણામી બળ વડે થતું કાર્ય તેની ગતિઊર્જાના ફેરફાર જેટલું હોય છે: W = ΔK = Kf - Ki = ૧/૨ m v² - ૧/૨ m u².",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "Statement of theorem.",
        "textGujarati": "પ્રમેયનું સાચું વિધાન."
      },
      {
        "stepNumber": 2,
        "marksAllocated": "1 Mark",
        "text": "Equation W = ΔK = Kf - Ki.",
        "textGujarati": "ગાણિતિક સૂત્ર W = ΔK."
      }
    ],
    "examinerTips": "Specify both final and initial kinetic energy.",
    "examinerTipsGujarati": "Kf અને Ki સ્પષ્ટ દર્શાવો."
  },
  {
    "id": "imp-g11-p-3m-1",
    "grade": "11",
    "board": "All",
    "subject": "Physics",
    "chapterNumber": 4,
    "chapterTitle": "Motion in a Plane (Projectiles)",
    "chapterTitleGujarati": "સમતલમાં ગતિ (પ્રક્ષિપ્ત ગતિ)",
    "marks": 3,
    "marksCategory": "3-Mark Medium Derivation",
    "questionText": "Derive the equation of trajectory for a projectile fired at angle θ with initial velocity u, and prove that its path is a parabola.",
    "questionTextGujarati": "પ્રક્ષિપ્ત પદાર્થની ગતિપથનું સમીકરણ તારવો અને સાબિત કરો કે તેનો ગતિપથ પરવલય આકારનો છે.",
    "frequentlyAskedYears": [
      "GSEB 2024",
      "CBSE 2023"
    ],
    "modelAnswer": "1. Horizontal motion: x = (u cos θ) t => t = x / (u cos θ).\n2. Vertical motion: y = (u sin θ) t - 1/2 g t².\n3. Substituting t: y = (u sin θ) [x / (u cos θ)] - 1/2 g [x / (u cos θ)]².\n4. Trajectory equation: y = (tan θ) x - [g / (2 u² cos² θ)] x².\nThis equation is of the form y = ax - bx², which represents a Parabola.",
    "modelAnswerGujarati": "૧. સમક્ષિતિજ ગતિ: x = (u cos θ) t => t = x / (u cos θ).\n૨. શિરોલંબ ગતિ: y = (u sin θ) t - ૧/૨ g t².\n૩. t ની કિંમત મૂકતાં: y = (tan θ) x - [g / (૨ u² cos² θ)] x².\n૪. આ સમીકરણ y = ax - bx² સ્વરૂપનું હોવાથી પ્રક્ષિપ્ત ગતિપથ પરવલય આકારનો છે.",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "Time expression t = x / (u cos θ).",
        "textGujarati": "સમયનું પદ t = x / (u cos θ)."
      },
      {
        "stepNumber": 2,
        "marksAllocated": "1 Mark",
        "text": "Substitution into vertical displacement.",
        "textGujarati": "શિરોલંબ ગતિમાં કિંમત મૂકવી."
      },
      {
        "stepNumber": 3,
        "marksAllocated": "1 Mark",
        "text": "Final equation and parabola conclusion.",
        "textGujarati": "અંતિમ સમીકરણ અને પરવલય તારણ."
      }
    ],
    "examinerTips": "Remember: y = ax - bx² form confirms a parabola.",
    "examinerTipsGujarati": "y = ax - bx² સ્વરૂપ દર્શાવવું અનિવાર્ય છે."
  },
  {
    "id": "imp-g11-c-3m-1",
    "grade": "11",
    "board": "All",
    "subject": "Chemistry",
    "chapterNumber": 4,
    "chapterTitle": "Chemical Bonding and Molecular Structure",
    "chapterTitleGujarati": "રાસાયણિક બંધન અને આણ્વીય રચના",
    "marks": 3,
    "marksCategory": "3-Mark Medium Answer",
    "questionText": "Explain the concept of sp³ hybridization with the example of Methane (CH4).",
    "questionTextGujarati": "મિથેન (CH4) ના ઉદાહરણ દ્વારા sp³ સંકરણ સમજાવો.",
    "frequentlyAskedYears": [
      "GSEB 2024",
      "CBSE 2023"
    ],
    "modelAnswer": "1. Definition: Intermixing of one 2s and three 2p atomic orbitals of carbon to produce four equivalent hybrid orbitals directed towards the corners of a regular tetrahedron.\n2. In Carbon (ground state 1s² 2s² 2p² => excited 1s² 2s¹ 2px¹ 2py¹ 2pz¹), these 4 orbitals undergo sp³ hybridization.\n3. Each sp³ orbital overlaps axially with 1s orbital of Hydrogen forming 4 C-H σ bonds.\n4. Geometry: Tetrahedral, H-C-H bond angle = 109°28' (109.5°).",
    "modelAnswerGujarati": "૧. વ્યાખ્યા: કાર્બનની એક ૨s અને ત્રણ ૨p કક્ષકો સંમિશ્રિત થઈ સમાન ઊર્જા ધરાવતી ચાર નવી sp³ સંકર કક્ષકો બનાવે છે.\n૨. ઉત્તેજિત અવસ્થામાં કાર્બન (૨s¹ ૨px¹ ૨py¹ ૨pz¹) sp³ સંકરણ પામે છે.\n૩. ચાર sp³ કક્ષકો હાઇડ્રોજનની ૧s કક્ષક સાથે અક્ષીય સંમિશ્રણ કરી ૪ C-H સિગ્મા (σ) બંધ રચે છે.\n૪. આકાર: સમચતુષ્ફલકીય (ટેટ્રાહેડ્રલ), બંધકોણ = ૧૦૯.૫°.",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "sp³ definition and 1s + 3p mixing.",
        "textGujarati": "sp³ સંકરણની વ્યાખ્યા."
      },
      {
        "stepNumber": 2,
        "marksAllocated": "1 Mark",
        "text": "Excited state electronic configuration.",
        "textGujarati": "ઉત્તેજિત અવસ્થાની ઇલેક્ટ્રોન રચના."
      },
      {
        "stepNumber": 3,
        "marksAllocated": "1 Mark",
        "text": "Tetrahedral shape and 109.5° bond angle.",
        "textGujarati": "સમચતુષ્ફલકીય આકાર અને ૧૦૯.૫° બંધકોણ."
      }
    ],
    "examinerTips": "Always mention bond angle 109.5°.",
    "examinerTipsGujarati": "બંધકોણ ૧૦૯.૫° અવશ્ય લખવો."
  },
  {
    "id": "imp-g11-m-4m-1",
    "grade": "11",
    "board": "All",
    "subject": "Mathematics",
    "chapterNumber": 13,
    "chapterTitle": "Limits and Derivatives",
    "chapterTitleGujarati": "લક્ષ અને વિકલન (પ્રથમ સિદ્ધાંત)",
    "marks": 4,
    "marksCategory": "4-Mark Long Derivation",
    "questionText": "Find the derivative of f(x) = sin x from first principles (definition of derivative).",
    "questionTextGujarati": "પ્રથમ સિદ્ધાંતની મદદથી f(x) = sin x નું વિકલિત શોધો.",
    "frequentlyAskedYears": [
      "GSEB 2024",
      "CBSE 2022"
    ],
    "modelAnswer": "By definition: f'(x) = lim (h → 0) [f(x + h) - f(x)] / h\n= lim (h → 0) [sin(x + h) - sin x] / h\nApplying sin C - sin D = 2 cos((C+D)/2) sin((C-D)/2):\n= lim (h → 0) [2 cos(x + h/2) sin(h/2)] / h\n= lim (h → 0) cos(x + h/2) × lim (h → 0) [sin(h/2) / (h/2)]\n= cos(x + 0) × 1 = cos x.\nHence, d/dx(sin x) = cos x.",
    "modelAnswerGujarati": "પ્રથમ સિદ્ધાંત: f'(x) = lim (h → 0) [f(x + h) - f(x)] / h\n= lim (h → 0) [sin(x + h) - sin x] / h\nsin C - sin D = ૨ cos((C+D)/૨) sin((C-D)/૨) વાપરતાં:\n= lim (h → 0) [૨ cos(x + h/૨) sin(h/૨)] / h\n= lim (h → 0) cos(x + h/૨) × lim (h/૨ → 0) [sin(h/૨) / (h/૨)]\n= cos x × ૧ = cos x.\nઆમ, d/dx(sin x) = cos x.",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "First principles definition formula.",
        "textGujarati": "પ્રથમ સિદ્ધાંતનું સૂત્ર."
      },
      {
        "stepNumber": 2,
        "marksAllocated": "1 Mark",
        "text": "sin C - sin D expansion step.",
        "textGujarati": "sin C - sin D વિસ્તરણ પગલું."
      },
      {
        "stepNumber": 3,
        "marksAllocated": "1 Mark",
        "text": "Standard limit: lim sin(h/2)/(h/2) = 1.",
        "textGujarati": "પ્રમાણિત લક્ષ sin θ / θ = ૧."
      },
      {
        "stepNumber": 4,
        "marksAllocated": "1 Mark",
        "text": "Final derivative: cos x.",
        "textGujarati": "અંતિમ વિકલિત: cos x."
      }
    ],
    "examinerTips": "Split the 2 in numerator to form h/2 in the denominator.",
    "examinerTipsGujarati": "અંશના ૨ ને છેદમાં h/૨ બનાવવો."
  },
  {
    "id": "imp-g11-b-4m-1",
    "grade": "11",
    "board": "All",
    "subject": "Biology",
    "chapterNumber": 13,
    "chapterTitle": "Photosynthesis in Higher Plants",
    "chapterTitleGujarati": "પ્રકાશસંશ્લેષણ (કેલ્વિન ચક્ર)",
    "marks": 4,
    "marksCategory": "4-Mark Long Answer",
    "questionText": "Describe the three stages of the Calvin Cycle (C3 Pathway) in photosynthesis: Carboxylation, Reduction, and Regeneration.",
    "questionTextGujarati": "પ્રકાશસંશ્લેષણમાં કેલ્વિન ચક્રના ત્રણ મુખ્ય તબક્કા વર્ણવો: કાર્બોક્સિલેશન, રિડક્શન અને પુનઃસર્જન.",
    "frequentlyAskedYears": [
      "GSEB 2024",
      "CBSE 2023"
    ],
    "modelAnswer": "1. Carboxylation: CO2 is fixed with RuBP (Ribulose-1,5-bisphosphate) by the enzyme RuBisCO to form 2 molecules of 3-PGA (3-Phosphoglyceric acid). This is the crucial CO2-fixing step.\n2. Reduction: Series of reactions using 2 ATP and 2 NADPH per CO2 molecule fixed to convert 3-PGA to Triose phosphate (glyceraldehyde-3-phosphate). 6 turns produce 1 glucose.\n3. Regeneration: RuBP is regenerated for cycle continuation using 1 ATP.\nTotal requirement for 1 glucose (6 CO2): 18 ATP and 12 NADPH.",
    "modelAnswerGujarati": "૧. કાર્બોક્સિલેશન: RuBisCO ઉત્સેચકની હાજરીમાં CO2 અને RuBP જોડાઈ ૩-PGA ના ૨ અણુ બનાવે છે.\n૨. રિડક્શન: પ્રત્યેક CO2 દીઠ ૨ ATP અને ૨ NADPH વાપરી ૩-PGA નું ટ્રાયોઝ ફોસ્ફેટમાં રિડક્શન થાય છે. ૬ ચક્ર બાદ ૧ ગ્લુકોઝ બને છે.\n૩. પુનઃસર્જન (રીજનરેશન): ચક્ર ચાલુ રાખવા ૧ ATP વાપરી RuBP નું પુનઃનિર્માણ થાય છે.\nકુલ જરૂરિયાત (૧ ગ્લુકોઝ માટે): ૧૮ ATP અને ૧૨ NADPH.",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "Carboxylation with RuBisCO forming 3-PGA.",
        "textGujarati": "RuBisCO વડે કાર્બોક્સિલેશન."
      },
      {
        "stepNumber": 2,
        "marksAllocated": "1 Mark",
        "text": "Reduction using ATP and NADPH.",
        "textGujarati": "ATP અને NADPH વડે રિડક્શન."
      },
      {
        "stepNumber": 3,
        "marksAllocated": "1 Mark",
        "text": "Regeneration of RuBP.",
        "textGujarati": "RuBP નું પુનઃસર્જન."
      },
      {
        "stepNumber": 4,
        "marksAllocated": "1 Mark",
        "text": "Total energy balance: 18 ATP + 12 NADPH.",
        "textGujarati": "કુલ ઊર્જા હિસાબ: ૧૮ ATP + ૧૨ NADPH."
      }
    ],
    "examinerTips": "Mention the primary enzyme: RuBisCO (most abundant protein on Earth).",
    "examinerTipsGujarati": "RuBisCO ઉત્સેચકનો ઉલ્લેખ અનિવાર્ય છે."
  },
  {
    "id": "imp-g12-c-1m-1",
    "grade": "12",
    "board": "All",
    "subject": "Chemistry",
    "chapterNumber": 2,
    "chapterTitle": "Solutions",
    "chapterTitleGujarati": "દ્રાવણો (હેન્રીનો નિયમ)",
    "marks": 1,
    "marksCategory": "1-Mark Objective / VSA",
    "questionText": "State Henry’s Law for solubility of a gas in a liquid.",
    "questionTextGujarati": "પ્રવાહીમાં વાયુની દ્રાવ્યતા માટે હેન્રીનો નિયમ લખો.",
    "frequentlyAskedYears": [
      "GSEB 2024",
      "CBSE 2023"
    ],
    "modelAnswer": "The solubility (mole fraction x) of a gas in a liquid is directly proportional to the partial pressure (p) of the gas over the solution: p = K_H · x.",
    "modelAnswerGujarati": "નિયત તાપમાને પ્રવાહીમાં વાયુની દ્રાવ્યતા (મોલ અંશ x) દ્રાવણની સપાટી પરના વાયુના આંશિક દબાણ p ના સમપ્રમાણમાં હોય છે: p = K_H · x.",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "Statement and equation p = K_H · x.",
        "textGujarati": "વિધાન અને સૂત્ર p = K_H · x."
      }
    ],
    "examinerTips": "K_H increases with temperature, so solubility decreases.",
    "examinerTipsGujarati": "તાપમાન વધતાં K_H વધે અને દ્રાવ્યતા ઘટે."
  },
  {
    "id": "imp-g12-m-1m-1",
    "grade": "12",
    "board": "All",
    "subject": "Mathematics",
    "chapterNumber": 1,
    "chapterTitle": "Relations and Functions",
    "chapterTitleGujarati": "સંબંધ અને વિધેય",
    "marks": 1,
    "marksCategory": "1-Mark Objective / VSA",
    "questionText": "When is a relation R on set A called an Equivalence Relation?",
    "questionTextGujarati": "ગણ A પરનો સંબંધ R ક્યારે સામ્ય સંબંધ (Equivalence Relation) કહેવાય?",
    "frequentlyAskedYears": [
      "GSEB 2024",
      "CBSE 2022"
    ],
    "modelAnswer": "A relation R is an Equivalence Relation if it is Reflexive, Symmetric, and Transitive.",
    "modelAnswerGujarati": "સંબંધ R એ સ્વવાચક, સંમિત અને પરંપરિત ત્રણેય હોય તો તેને સામ્ય સંબંધ કહેવાય છે.",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "Reflexive, Symmetric, and Transitive.",
        "textGujarati": "સ્વવાચક, સંમિત અને પરંપરિત."
      }
    ],
    "examinerTips": "Must list all three properties explicitly.",
    "examinerTipsGujarati": "ત્રણેય શરતો લખવી."
  },
  {
    "id": "imp-g12-p-2m-1",
    "grade": "12",
    "board": "All",
    "subject": "Physics",
    "chapterNumber": 3,
    "chapterTitle": "Current Electricity",
    "chapterTitleGujarati": "પ્રવાહ વિદ્યુત (કિર્ચોફના નિયમો)",
    "marks": 2,
    "marksCategory": "2-Mark Short Answer",
    "questionText": "State Kirchhoff’s Voltage Law (Loop Rule, ΣΔV = 0) and name its underlying conservation principle.",
    "questionTextGujarati": "કિર્ચોફનો બીજો નિયમ (લૂપનો નિયમ) લખો અને તે કયા સંરક્ષણ સિદ્ધાંત પર આધારિત છે?",
    "frequentlyAskedYears": [
      "GSEB 2024",
      "CBSE 2023"
    ],
    "modelAnswer": "Loop Rule: The algebraic sum of changes in electric potential around any closed loop in an electrical network is zero: ΣΔV = 0.\nUnderlying principle: Law of Conservation of Energy.",
    "modelAnswerGujarati": "લૂપનો નિયમ: કોઈપણ બંધ પરિપથ (લૂપ) માં વિદ્યુતસ્થિતિમાનના ફેરફારોનો બૈજિક સરવાળો શૂન્ય થાય છે: ΣΔV = 0.\nતે ઊર્જા સંરક્ષણના નિયમ પર આધારિત છે.",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "Loop rule statement: ΣΔV = 0.",
        "textGujarati": "લૂપ નિયમનું વિધાન: ΣΔV = 0."
      },
      {
        "stepNumber": 2,
        "marksAllocated": "1 Mark",
        "text": "Conservation of Energy.",
        "textGujarati": "ઊર્જા સંરક્ષણ સિદ્ધાંત."
      }
    ],
    "examinerTips": "1st rule = Charge conservation; 2nd rule = Energy conservation.",
    "examinerTipsGujarati": "પ્રથમ નિયમ: વિદ્યુતભાર સંરક્ષણ; બીજો નિયમ: ઊર્જા સંરક્ષણ."
  },
  {
    "id": "imp-g12-c-2m-1",
    "grade": "12",
    "board": "All",
    "subject": "Chemistry",
    "chapterNumber": 4,
    "chapterTitle": "Chemical Kinetics",
    "chapterTitleGujarati": "રાસાયણિક ગતિકી (અર્ધઆયુષ્ય)",
    "marks": 2,
    "marksCategory": "2-Mark Short Answer",
    "questionText": "A first order reaction has a rate constant k = 1.15 × 10^-3 s^-1. Find its half-life (t1/2).",
    "questionTextGujarati": "પ્રથમ ક્રમની પ્રક્રિયા માટે વેગ અચળાંક k = 1.15 × 10^-3 s^-1 હોય, તો તેનો અર્ધઆયુષ્ય સમય (t1/2) શોધો.",
    "frequentlyAskedYears": [
      "GSEB 2024",
      "CBSE 2023"
    ],
    "modelAnswer": "For a first order reaction: t1/2 = 0.693 / k\n= 0.693 / (1.15 × 10^-3) = 602.6 seconds.",
    "modelAnswerGujarati": "પ્રથમ ક્રમની પ્રક્રિયા માટે: t1/2 = 0.693 / k\n= 0.693 / (1.15 × 10^-3) = 602.6 સેકન્ડ.",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "Formula: t1/2 = 0.693 / k.",
        "textGujarati": "સૂત્ર: t1/2 = 0.693 / k."
      },
      {
        "stepNumber": 2,
        "marksAllocated": "1 Mark",
        "text": "Answer: 602.6 s.",
        "textGujarati": "જવાબ: ૬૦૨.૬ સેકન્ડ."
      }
    ],
    "examinerTips": "Unit is seconds (s) since k is in s^-1.",
    "examinerTipsGujarati": "એકમ સેકન્ડ અવશ્ય લખવો."
  },
  {
    "id": "imp-g12-m-3m-1",
    "grade": "12",
    "board": "All",
    "subject": "Mathematics",
    "chapterNumber": 7,
    "chapterTitle": "Integrals",
    "chapterTitleGujarati": "સંકલન",
    "marks": 3,
    "marksCategory": "3-Mark Medium Sum",
    "questionText": "Evaluate the integral: ∫ [ (2x + 1) / (x² + x + 5) ] dx.",
    "questionTextGujarati": "સંકલન કરો: ∫ [ (2x + 1) / (x² + x + 5) ] dx.",
    "frequentlyAskedYears": [
      "GSEB 2024",
      "CBSE 2023"
    ],
    "modelAnswer": "Let t = x² + x + 5.\nThen dt = (2x + 1) dx.\nThe integral becomes: ∫ dt / t = ln |t| + C\n= ln |x² + x + 5| + C.",
    "modelAnswerGujarati": "ધારો કે t = x² + x + ૫.\nઆથી dt = (૨x + ૧) dx.\nસંકલન: ∫ dt / t = ln |t| + C\n= ln |x² + x + ૫| + C.",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "Substitution: t = x² + x + 5.",
        "textGujarati": "આદેશ: t = x² + x + ૫."
      },
      {
        "stepNumber": 2,
        "marksAllocated": "1 Mark",
        "text": "dt substitution step.",
        "textGujarati": "dt નું રૂપાંતર."
      },
      {
        "stepNumber": 3,
        "marksAllocated": "1 Mark",
        "text": "Final answer: ln |x² + x + 5| + C.",
        "textGujarati": "અંતિમ જવાબ: ln |x² + x + ૫| + C."
      }
    ],
    "examinerTips": "Always append constant of integration + C for indefinite integrals.",
    "examinerTipsGujarati": "અનિશ્ચિત સંકલનમાં + C લખવો ફરજિયાત છે."
  },
  {
    "id": "imp-g12-m-4m-1",
    "grade": "12",
    "board": "All",
    "subject": "Mathematics",
    "chapterNumber": 3,
    "chapterTitle": "Matrices and Determinants",
    "chapterTitleGujarati": "શ્રેણિક અને નિશ્ચાયક (સમીકરણ સંહતિ)",
    "marks": 4,
    "marksCategory": "4-Mark Long Answer",
    "questionText": "Solve the system of linear equations using Matrix Inversion method: 2x + 5y = 1, 3x + 2y = 7.",
    "questionTextGujarati": "શ્રેણિકના વ્યસ્તની રીતે સુરેખ સમીકરણ સંહતિ ઉકેલો: 2x + 5y = 1, 3x + 2y = 7.",
    "frequentlyAskedYears": [
      "GSEB 2024",
      "CBSE 2023"
    ],
    "modelAnswer": "1. Matrix form: AX = B, where A = [[2, 5], [3, 2]], X = [[x], [y]], B = [[1], [7]].\n2. Determinant |A| = (2)(2) - (5)(3) = 4 - 15 = -11 ≠ 0 (Inverse exists).\n3. Adjoint: adj(A) = [[2, -5], [-3, 2]].\n4. A^-1 = (1 / |A|) adj(A) = (-1/11) [[2, -5], [-3, 2]].\n5. X = A^-1 B = (-1/11) [[(2)(1) + (-5)(7)], [(-3)(1) + (2)(7)]] = (-1/11) [[2 - 35], [-3 + 14]] = (-1/11) [[-33], [11]] = [[3], [-1]].\nSo x = 3, y = -1.",
    "modelAnswerGujarati": "૧. શ્રેણિક સ્વરૂપ: AX = B, જ્યાં A = [[૨, ૫], [૩, ૨]], X = [[x], [y]], B = [[૧], [૭]].\n૨. નિશ્ચાયક |A| = ૪ - ૧૫ = -૧૧ ≠ ૦ (વ્યસ્ત શક્ય છે).\n૩. સહઅવયવજ શ્રેણિક: adj(A) = [[૨, -૫], [-૩, ૨]].\n૪. A^-1 = (-૧/૧૧) [[૨, -૫], [-૩, ૨]].\n૫. X = A^-1 B = (-૧/૧૧) [[૨ - ૩૫], [-૩ + ૧૪]] = (-૧/૧૧) [[-૩૩], [૧૧]] = [[૩], [-૧]].\nઆથી x = ૩ અને y = -૧.",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "Writing AX = B matrix form.",
        "textGujarati": "AX = B શ્રેણિક સ્વરૂપ."
      },
      {
        "stepNumber": 2,
        "marksAllocated": "1 Mark",
        "text": "Computing |A| = -11 and adj(A).",
        "textGujarati": "|A| = -૧૧ અને સહઅવયવજ શ્રેણિક."
      },
      {
        "stepNumber": 3,
        "marksAllocated": "1 Mark",
        "text": "Matrix multiplication A^-1 × B.",
        "textGujarati": "શ્રેણિક ગુણાકાર A^-1 × B."
      },
      {
        "stepNumber": 4,
        "marksAllocated": "1 Mark",
        "text": "Final solution: x = 3, y = -1.",
        "textGujarati": "અંતિમ ઉકેલ: x = ૩, y = -૧."
      }
    ],
    "examinerTips": "Verify: 2(3) + 5(-1) = 6 - 5 = 1 (matches!).",
    "examinerTipsGujarati": "સમીકરણમાં કિંમતો મૂકી તાળો મેળવી લેવો."
  },
  {
    "id": "imp-g10-m-1m-1",
    "grade": "10",
    "board": "All",
    "subject": "Mathematics",
    "chapterNumber": 1,
    "chapterTitle": "Real Numbers",
    "chapterTitleGujarati": "વાસ્તવિક સંખ્યાઓ",
    "marks": 1,
    "marksCategory": "1-Mark Objective / VSA",
    "questionText": "State the Fundamental Theorem of Arithmetic.",
    "questionTextGujarati": "અંકગણિતનું મૂળભૂત પ્રમેય લખો.",
    "frequentlyAskedYears": [
      "GSEB 2024",
      "GSEB 2022",
      "CBSE 2023"
    ],
    "modelAnswer": "Every composite number can be expressed (factorized) as a product of primes, and this factorization is unique, apart from the order in which the prime factors occur.",
    "modelAnswerGujarati": "દરેક વિભાજ્ય સંખ્યાને તેના અવિભાજ્ય અવયવોના ગુણાકાર તરીકે અનન્ય રીતે દર્શાવી શકાય છે (અવયવોના ક્રમને બાદ કરતાં).",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "Accurate statement mentioning unique prime factorization apart from order.",
        "textGujarati": "અનન્ય અવિભાજ્ય ગુણાકારનું સચોટ વિધાન."
      }
    ],
    "examinerTips": "Do not forget the phrase 'apart from the order of factors'.",
    "examinerTipsGujarati": "અવયવોના ક્રમને ધ્યાનમાં લીધા વિના - આ શબ્દ લખવો અનિવાર્ય છે."
  },
  {
    "id": "imp-g10-m-2m-1",
    "grade": "10",
    "board": "All",
    "subject": "Mathematics",
    "chapterNumber": 1,
    "chapterTitle": "Real Numbers",
    "chapterTitleGujarati": "વાસ્તવિક સંખ્યાઓ",
    "marks": 2,
    "marksCategory": "2-Mark Short Answer",
    "questionText": "Given that HCF(306, 657) = 9, find LCM(306, 657).",
    "questionTextGujarati": "જો ગુ.સા.અ. (306, 657) = 9 આપેલ હોય, તો લ.સા.અ. (306, 657) શોધો.",
    "frequentlyAskedYears": [
      "GSEB March 2023",
      "CBSE 2022",
      "CBSE 2024"
    ],
    "modelAnswer": "We know that LCM(a, b) × HCF(a, b) = a × b. Therefore, LCM(306, 657) = (306 × 657) / 9 = 34 × 657 = 22,338.",
    "modelAnswerGujarati": "આપણે જાણીએ છીએ કે: લ.સા.અ. × ગુ.સા.અ. = બે સંખ્યાઓનો ગુણાકાર. લ.સા.અ. = (306 × 657) / 9 = 34 × 657 = 22,338.",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "Stating formula: LCM × HCF = a × b and substituting values.",
        "textGujarati": "સૂત્ર: લ.સા.અ. × ગુ.સા.અ. = a × b માં કિંમતો મૂકવી."
      },
      {
        "stepNumber": 2,
        "marksAllocated": "1 Mark",
        "text": "Correct calculation and final answer: 22,338.",
        "textGujarati": "સાચી ગણતરી અને અંતિમ જવાબ: 22,338."
      }
    ],
    "examinerTips": "Avoid multiplying 306 × 657 first. Cancel 306 by 9 to get 34 for faster computation.",
    "examinerTipsGujarati": "પહેલા 306 ને 9 વડે ભાગીને 34 લાવો, જેથી ગણતરી ઝડપી બને."
  },
  {
    "id": "imp-g10-m-3m-1",
    "grade": "10",
    "board": "All",
    "subject": "Mathematics",
    "chapterNumber": 1,
    "chapterTitle": "Real Numbers",
    "chapterTitleGujarati": "વાસ્તવિક સંખ્યાઓ",
    "marks": 3,
    "marksCategory": "3-Mark Medium Proof / Sum",
    "questionText": "Prove that √5 is an irrational number.",
    "questionTextGujarati": "સાબિત કરો કે √5 એ અસંમેય સંખ્યા છે.",
    "frequentlyAskedYears": [
      "GSEB March 2024",
      "GSEB July 2023",
      "CBSE 2023",
      "CBSE 2020"
    ],
    "modelAnswer": "1. Assume √5 is rational: √5 = a/b (where a, b are co-prime integers, b ≠ 0).\n2. Squaring both sides: 5b² = a². Therefore 5 divides a² => 5 divides a. Let a = 5c.\n3. Substituting: 5b² = (5c)² = 25c² => b² = 5c². Thus 5 divides b² => 5 divides b.\n4. So 5 is a common factor of both a and b, contradicting that a and b are co-prime. Hence √5 is irrational.",
    "modelAnswerGujarati": "૧. ધારો કે √5 સંમેય સંખ્યા છે: √5 = a/b (જ્યાં a અને b પરસ્પર અવિભાજ્ય પૂર્ણાંકો છે).\n૨. બંને બાજુ વર્ગ કરતાં: 5b² = a². આથી 5 એ a² નો અવયવ છે => 5 એ a નો અવયવ છે. a = 5c લો.\n૩. 5b² = 25c² => b² = 5c². આથી 5 એ b નો પણ અવયવ છે.\n૪. આમ 5 એ a અને b બંનેનો સામાન્ય અવયવ છે, જે આપણી ધારણાથી વિરુદ્ધ છે. તેથી √5 અસંમેય છે.",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "Assumption of co-primes and showing 5 divides a.",
        "textGujarati": "પરસ્પર અવિભાજ્યની ધારણા અને 5 એ a નો અવયવ છે તે દર્શાવવું."
      },
      {
        "stepNumber": 2,
        "marksAllocated": "1 Mark",
        "text": "Substituting a = 5c and showing 5 divides b.",
        "textGujarati": "a = 5c મૂકીને 5 એ b નો પણ અવયવ છે તે સાબિત કરવું."
      },
      {
        "stepNumber": 3,
        "marksAllocated": "1 Mark",
        "text": "Arriving at contradiction and writing final conclusion.",
        "textGujarati": "વિરોધાભાસ દર્શાવીને અંતિમ તારણ લખવું."
      }
    ],
    "examinerTips": "The definition that a and b are co-prime (HCF=1) must be explicitly stated in the first step.",
    "examinerTipsGujarati": "પ્રથમ પગલામાં a અને b પરસ્પર અવિભાજ્ય છે તે લખવું ફરજિયાત છે."
  },
  {
    "id": "imp-g10-m-4m-1",
    "grade": "10",
    "board": "All",
    "subject": "Mathematics",
    "chapterNumber": 6,
    "chapterTitle": "Triangles",
    "chapterTitleGujarati": "ત્રિકોણ (થેલ્સનું પ્રમેય)",
    "marks": 4,
    "marksCategory": "4-Mark Long Answer / Theorem",
    "questionText": "State and prove Basic Proportionality Theorem (Thales Theorem).",
    "questionTextGujarati": "થેલ્સનું પ્રમેય (સમપ્રમાણતાનું મૂળભૂત પ્રમેય) લખો અને સાબિત કરો.",
    "frequentlyAskedYears": [
      "GSEB March 2024",
      "GSEB 2020",
      "CBSE 2024",
      "CBSE 2022"
    ],
    "modelAnswer": "Statement: If a line is drawn parallel to one side of a triangle intersecting the other two sides in distinct points, then the other two sides are divided in the same ratio.\nProof: In △ABC, DE ∥ BC. Draw DM ⊥ AC and EN ⊥ AB. Join BE and CD.\nar(△ADE) = 1/2 × AD × EN, ar(△BDE) = 1/2 × DB × EN => ar(△ADE)/ar(△BDE) = AD/DB.\nSimilarly ar(△ADE)/ar(△CDE) = AE/EC.\nSince △BDE and △CDE lie on the same base DE between parallel lines DE and BC: ar(△BDE) = ar(△CDE).\nHence, AD/DB = AE/EC.",
    "modelAnswerGujarati": "પ્રમેય: જો ત્રિકોણની કોઈ એક બાજુને સમાંતર દોરેલી રેખા બાકીની બે બાજુઓને ભિન્ન બિંદુઓમાં છેદે, તો તે બાજુઓ પર કપાતા રેખાખંડો તે બાજુઓનું સમપ્રમાણમાં વિભાજન કરે છે.\nસાબિતી: △ABC માં DE ∥ BC. વેધ DM ⊥ AC અને EN ⊥ AB દોરો. BE અને CD જોડો.\nar(△ADE) / ar(△BDE) = AD / DB અને ar(△ADE) / ar(△CDE) = AE / EC.\n△BDE અને △CDE સમાન પાયા DE પર અને સમાંતર રેખાઓ વચ્ચે આવેલા હોવાથી ક્ષેત્રફળ સમાન છે.\nતેથી: AD/DB = AE/EC.",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "Accurate statement and labeled geometric diagram.",
        "textGujarati": "પ્રમેયનું વિધાન અને નામનિર્દેશિત આકૃતિ."
      },
      {
        "stepNumber": 2,
        "marksAllocated": "1 Mark",
        "text": "Given, to prove, and geometric construction steps.",
        "textGujarati": "પક્ષ, સાધ્ય અને રચનાના મુદ્દા."
      },
      {
        "stepNumber": 3,
        "marksAllocated": "1 Mark",
        "text": "Ratio of areas of triangles with common heights.",
        "textGujarati": "સામાન્ય વેધ વાળા ત્રિકોણોના ક્ષેત્રફળનો ગુણોત્તર."
      },
      {
        "stepNumber": 4,
        "marksAllocated": "1 Mark",
        "text": "Equating areas on same base and final proportion AD/DB = AE/EC.",
        "textGujarati": "સમાન પાયા પરના ત્રિકોણોનું ક્ષેત્રફળ સરખાવીને AD/DB = AE/EC સાબિતી."
      }
    ],
    "examinerTips": "Always draw the triangle diagram using a ruler and pencil. Without the diagram, zero marks are awarded for the theorem proof.",
    "examinerTipsGujarati": "પેન્સિલ અને ફૂટપટ્ટીથી આકૃતિ દોરવી અનિવાર્ય છે. આકૃતિ વગર પ્રમેયમાં ગુણ મળતા નથી."
  },
  {
    "id": "imp-g10-s-1m-1",
    "grade": "10",
    "board": "All",
    "subject": "Science",
    "chapterNumber": 10,
    "chapterTitle": "Electricity",
    "chapterTitleGujarati": "વિદ્યુત (ઓહ્મનો નિયમ)",
    "marks": 1,
    "marksCategory": "1-Mark Objective / VSA",
    "questionText": "Define 1 Ohm resistance according to Ohm’s Law.",
    "questionTextGujarati": "ઓહ્મના નિયમ અનુસાર ૧ ઓહ્મ (1 Ω) અવરોધની વ્યાખ્યા આપો.",
    "frequentlyAskedYears": [
      "GSEB 2024",
      "CBSE 2023",
      "GSEB 2021"
    ],
    "modelAnswer": "1 Ohm is the resistance of a conductor such that when a potential difference of 1 Volt is applied across its ends, a current of 1 Ampere flows through it (1 Ω = 1 V / 1 A).",
    "modelAnswerGujarati": "જો વાહકના બે છેડા વચ્ચે ૧ વોલ્ટ વિદ્યુતસ્થિતિમાનનો તફાવત આપતાં તેમાંથી ૧ એમ્પીયર વિદ્યુતપ્રવાહ વહેતો હોય, તો તે વાહકનો અવરોધ ૧ ઓહ્મ કહેવાય (૧ Ω = ૧ V / ૧ A).",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "Definition stating 1 Volt producing 1 Ampere current.",
        "textGujarati": "૧ વોલ્ટ અને ૧ એમ્પીયર પ્રવાહનું સ્પષ્ટ વિધાન."
      }
    ],
    "examinerTips": "Write the formula 1 Ω = 1 V / 1 A alongside the definition for full marks.",
    "examinerTipsGujarati": "વ્યાખ્યા સાથે ૧ Ω = ૧ V / ૧ A સૂત્ર અવશ્ય લખવું."
  },
  {
    "id": "imp-g10-s-2m-1",
    "grade": "10",
    "board": "All",
    "subject": "Science",
    "chapterNumber": 2,
    "chapterTitle": "Acids, Bases and Salts",
    "chapterTitleGujarati": "એસિડ, બેઇઝ અને ક્ષાર (પ્લાસ્ટર ઓફ પેરિસ)",
    "marks": 2,
    "marksCategory": "2-Mark Short Answer",
    "questionText": "Write the chemical formula and preparation equation of Plaster of Paris (POP) from Gypsum.",
    "questionTextGujarati": "પ્લાસ્ટર ઓફ પેરિસ (POP) નું રાસાયણિક સૂત્ર અને જીપ્સમમાંથી બનાવટનું સમીકરણ લખો.",
    "frequentlyAskedYears": [
      "GSEB March 2024",
      "CBSE 2024",
      "GSEB 2022"
    ],
    "modelAnswer": "Chemical Formula: CaSO4 · 1/2 H2O (Calcium Sulphate Hemihydrate).\nPreparation: On heating Gypsum (CaSO4 · 2H2O) at 373 K (100 °C), it loses water molecules to form Plaster of Paris:\nCaSO4 · 2H2O + Heat (373 K) → CaSO4 · 1/2 H2O + 1½ H2O.",
    "modelAnswerGujarati": "રાસાયણિક સૂત્ર: CaSO4 · 1/2 H2O (કેલ્શિયમ સલ્ફેટ હેમીહાઇડ્રેટ).\nબનાવટ: જીપ્સમને (CaSO4 · 2H2O) ૩૭૩ K (૧૦૦ °C) તાપમાને ગરમ કરતાં તે પાણીના અણુઓ ગુમાવી પ્લાસ્ટર ઓફ પેરિસ બને છે:\nCaSO4 · 2H2O → CaSO4 · 1/2 H2O + 1½ H2O.",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "Correct chemical formula: CaSO4 · 1/2 H2O.",
        "textGujarati": "સાચું સૂત્ર: CaSO4 · 1/2 H2O."
      },
      {
        "stepNumber": 2,
        "marksAllocated": "1 Mark",
        "text": "Balanced chemical reaction mentioning 373 K temperature.",
        "textGujarati": "૩૭૩ K તાપમાન દર્શાવતું સંતુલિત રાસાયણિક સમીકરણ."
      }
    ],
    "examinerTips": "Always mention temperature 373 K. Above 373 K, dead burnt plaster forms.",
    "examinerTipsGujarati": "૩૭૩ K તાપમાન ખાસ દર્શાવવું, વધુ તાપમાને મૃત પ્લાસ્ટર બને છે."
  },
  {
    "id": "imp-g10-s-3m-1",
    "grade": "10",
    "board": "All",
    "subject": "Science",
    "chapterNumber": 5,
    "chapterTitle": "Life Processes",
    "chapterTitleGujarati": "જૈવિક ક્રિયાઓ (માનવ ઉત્સર્જન એકમ - નેફ્રોન)",
    "marks": 3,
    "marksCategory": "3-Mark Medium Answer / Diagram",
    "questionText": "Describe the structure and functioning of a Nephron in human kidneys.",
    "questionTextGujarati": "માનવ મૂત્રપિંડમાં નેફ્રોનની રચના અને કાર્યપદ્ધતિ વર્ણવો.",
    "frequentlyAskedYears": [
      "GSEB 2023",
      "CBSE 2023",
      "CBSE 2020"
    ],
    "modelAnswer": "1. Bowman’s Capsule & Glomerulus: Blood filtered under high pressure, collecting nitrogenous wastes (urea, uric acid), glucose, amino acids, and water.\n2. Tubular Reabsorption: As filtrate passes through the coiled tubule, useful substances like glucose, amino acids, salts, and excess water are selectively reabsorbed back into blood capillaries.\n3. Secretion & Urine Collection: The remaining liquid containing urea and excess salts forms urine, collected in the collecting duct.",
    "modelAnswerGujarati": "૧. બાઉમેનની કોથળી અને રુધિરકેશિકાગુચ્છ: ઊંચા દબાણે રુધિર ગળાય છે, જેમાં યુરિયા, ગ્લુકોઝ અને ક્ષારો ગાળણમાં આવે છે.\n૨. પસંદગીશીલ પુનઃશોષણ: નલિકામાંથી પસાર થતાં ગ્લુકોઝ, એમિનો એસિડ, ક્ષારો અને જરૂરી પાણીનું રુધિરમાં પુનઃશોષણ થાય છે.\n૩. મૂત્ર નિર્માણ: અંતે વધેલ પ્રવાહી (યુરિયા અને ક્ષારો) મૂત્રરૂપે સંગ્રહણ નલિકામાં એકત્ર થાય છે.",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "Ultrafiltration at Glomerulus and Bowman capsule.",
        "textGujarati": "બાઉમેનની કોથળીમાં રુધિરનું સૂક્ષ્મ ગાળણ."
      },
      {
        "stepNumber": 2,
        "marksAllocated": "1 Mark",
        "text": "Selective reabsorption of glucose, amino acids, water in tubule.",
        "textGujarati": "નલિકામાં ઉપયોગી ઘટકોનું પસંદગીશીલ પુનઃશોષણ."
      },
      {
        "stepNumber": 3,
        "marksAllocated": "1 Mark",
        "text": "Formation and collection of urine in collecting duct.",
        "textGujarati": "મૂત્ર નિર્માણ અને સંગ્રહણ નલિકામાં વહન."
      }
    ],
    "examinerTips": "Keywords: Ultrafiltration, Selective Reabsorption, Collecting Duct.",
    "examinerTipsGujarati": "કીવર્ડ્સ: અલ્ટ્રાફિલ્ટરેશન, પસંદગીશીલ પુનઃશોષણ, સંગ્રહણ નલિકા."
  },
  {
    "id": "imp-g10-s-4m-1",
    "grade": "10",
    "board": "All",
    "subject": "Science",
    "chapterNumber": 8,
    "chapterTitle": "Light - Reflection and Refraction",
    "chapterTitleGujarati": "પ્રકાશ (બહિર્ગોળ લેન્સ વડે પ્રતિબિંબ અને મોટવણી)",
    "marks": 4,
    "marksCategory": "4-Mark Long Answer / Numericals",
    "questionText": "An object 4 cm in height is placed 20 cm in front of a convex lens of focal length 10 cm. Find the position, nature, and size of the image formed.",
    "questionTextGujarati": "૧૦ સેમી કેન્દ્રલંબાઈવાળા બહિર્ગોળ લેન્સની સામે ૨૦ સેમી અંતરે ૪ સેમી ઊંચાઈની વસ્તુ મૂકેલી છે. પ્રતિબિંબનું સ્થાન, પ્રકાર અને ઊંચાઈ શોધો.",
    "frequentlyAskedYears": [
      "GSEB March 2024",
      "CBSE 2024",
      "GSEB 2022"
    ],
    "modelAnswer": "Given: Object height h = +4 cm, Object distance u = -20 cm, Focal length f = +10 cm.\n1. Lens Formula: 1/f = 1/v - 1/u => 1/v = 1/f + 1/u = 1/10 + 1/(-20) = 1/10 - 1/20 = 1/20.\nSo image distance v = +20 cm (Image formed 20 cm behind the lens at 2F₂).\n2. Magnification: m = v / u = (+20) / (-20) = -1.\n3. Image height: h' = m × h = -1 × 4 = -4 cm.\nNature: Real, Inverted, and Same size as object.",
    "modelAnswerGujarati": "આપેલ વિગતો: વસ્તુ ઊંચાઈ h = +4 cm, વસ્તુ અંતર u = -20 cm, કેન્દ્રલંબાઈ f = +10 cm.\n૧. લેન્સનું સૂત્ર: 1/f = 1/v - 1/u => 1/v = 1/10 - 1/20 = 1/20 => v = +20 cm (લેન્સની પાછળ 2F₂ પર).\n૨. મોટવણી: m = v / u = (+20) / (-20) = -1.\n૩. પ્રતિબિંબ ઊંચાઈ: h' = m × h = -1 × 4 = -4 cm.\nપ્રકાર: વાસ્તવિક, ઊલટું અને વસ્તુના કદ જેટલું જ.",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "Writing correct sign conventions: u = -20, f = +10.",
        "textGujarati": "સંજ્ઞા પ્રણાલી અનુસાર કિંમતો: u = -20 cm, f = +10 cm."
      },
      {
        "stepNumber": 2,
        "marksAllocated": "1 Mark",
        "text": "Applying lens formula and calculating v = +20 cm.",
        "textGujarati": "લેન્સના સૂત્રથી v = +20 cm મેળવવું."
      },
      {
        "stepNumber": 3,
        "marksAllocated": "1 Mark",
        "text": "Magnification formula m = v/u = -1 and image size h' = -4 cm.",
        "textGujarati": "મોટવણી m = -1 અને પ્રતિબિંબ ઊંચાઈ -4 cm."
      },
      {
        "stepNumber": 4,
        "marksAllocated": "1 Mark",
        "text": "Concluding nature: Real, Inverted, Same size.",
        "textGujarati": "પ્રતિબિંબનો પ્રકાર: વાસ્તવિક, ઊલટું અને સમાન કદ."
      }
    ],
    "examinerTips": "Always remember: in lens formula, it is 1/v MINUS 1/u, unlike mirror formula which has a plus.",
    "examinerTipsGujarati": "ધ્યાન રાખો: લેન્સના સૂત્રમાં 1/v - 1/u આવે છે (અરીસામાં + આવે છે)."
  },
  {
    "id": "imp-g12-p-1m-1",
    "grade": "12",
    "board": "All",
    "subject": "Physics",
    "chapterNumber": 1,
    "chapterTitle": "Electric Charges and Fields",
    "chapterTitleGujarati": "વિધુતભારો અને ક્ષેત્રો (ગાઉસનો નિયમ)",
    "marks": 1,
    "marksCategory": "1-Mark Objective / VSA",
    "questionText": "State Gauss’s Law in electrostatics.",
    "questionTextGujarati": "સ્થિત વિદ્યુતશાસ્ત્ર માટે ગાઉસનો નિયમ લખો.",
    "frequentlyAskedYears": [
      "GSEB 2024",
      "CBSE 2023",
      "GUJCET 2023"
    ],
    "modelAnswer": "The total electric flux passing through any closed surface in vacuum is equal to 1/ε₀ times the total charge enclosed by that surface: Φ = ∮ E · dA = q_enclosed / ε₀.",
    "modelAnswerGujarati": "કોઈપણ બંધ પૃષ્ઠ સાથે સંકળાયેલું કુલ વિદ્યુત ફ્લક્સ તે પૃષ્ઠ વડે ઘેરાયેલા કુલ વિદ્યુતભારના 1/ε₀ ગણું હોય છે: Φ = q / ε₀.",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "Statement and equation Φ = q_enclosed / ε₀.",
        "textGujarati": "વિધાન અને ગાણિતિક સૂત્ર Φ = q / ε₀."
      }
    ],
    "examinerTips": "Mention the term 'closed surface' (Gaussian surface).",
    "examinerTipsGujarati": "'બંધ પૃષ્ઠ' શબ્દ લખવો ફરજિયાત છે."
  },
  {
    "id": "imp-g12-p-3m-1",
    "grade": "12",
    "board": "All",
    "subject": "Physics",
    "chapterNumber": 2,
    "chapterTitle": "Electrostatic Potential and Capacitance",
    "chapterTitleGujarati": "સ્થિત વિદ્યુત સ્થિતિમાન અને કેપેસિટન્સ",
    "marks": 3,
    "marksCategory": "3-Mark Medium Derivation",
    "questionText": "Derive the expression for capacitance of a parallel plate capacitor with dielectric medium K.",
    "questionTextGujarati": "ડાઇઇલેક્ટ્રિક અચળાંક K ધરાવતા સમાંતર પ્લેટ કેપેસિટરના કેપેસિટન્સનું સૂત્ર તારવો.",
    "frequentlyAskedYears": [
      "GSEB March 2023",
      "CBSE 2024",
      "GSEB 2021"
    ],
    "modelAnswer": "1. Electric field in vacuum between plates: E₀ = σ / ε₀ = Q / (A ε₀).\n2. With dielectric K, electric field is reduced: E = E₀ / K = Q / (K A ε₀).\n3. Potential difference V = E × d = (Q d) / (K A ε₀).\n4. Capacitance C = Q / V = Q / [ (Q d) / (K A ε₀) ] = (K ε₀ A) / d = K × C₀.",
    "modelAnswerGujarati": "૧. શૂન્યાવકાશમાં વિદ્યુતક્ષેત્ર: E₀ = σ / ε₀ = Q / (A ε₀).\n૨. ડાઇઇલેક્ટ્રિક K ની હાજરીમાં ઘટેલું ક્ષેત્ર: E = E₀ / K = Q / (K A ε₀).\n૩. વિદ્યુતસ્થિતિમાન તફાવત: V = E × d = (Q d) / (K A ε₀).\n૪. કેપેસિટન્સ C = Q / V = (K ε₀ A) / d = K × C₀.",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "Electric field reduction formula E = E0 / K.",
        "textGujarati": "ડાઇઇલેક્ટ્રિકમાં વિદ્યુતક્ષેત્ર E = E0/K."
      },
      {
        "stepNumber": 2,
        "marksAllocated": "1 Mark",
        "text": "Potential difference V = E · d expression.",
        "textGujarati": "સ્થિતિમાન તફાવત V = E · d નું પદ."
      },
      {
        "stepNumber": 3,
        "marksAllocated": "1 Mark",
        "text": "Final capacitance formula C = (K ε₀ A) / d.",
        "textGujarati": "અંતિમ કેપેસિટન્સ C = (K ε₀ A) / d."
      }
    ],
    "examinerTips": "State clearly that capacitance increases by a factor of K.",
    "examinerTipsGujarati": "કેપેસિટન્સ K ગણું વધે છે તે સ્પષ્ટ દર્શાવો."
  },
  {
    "id": "imp-g9-s-2m-1",
    "grade": "9",
    "board": "All",
    "subject": "Science",
    "chapterNumber": 9,
    "chapterTitle": "Force and Laws of Motion",
    "chapterTitleGujarati": "બળ અને ગતિના નિયમો",
    "marks": 2,
    "marksCategory": "2-Mark Short Answer / Reason",
    "questionText": "Why do passengers fall backward when a stationary bus accelerates forward suddenly?",
    "questionTextGujarati": "સ્થિર બસ એકાએક ઉપડે ત્યારે મુસાફરો પાછળની તરફ કેમ નમી પડે છે?",
    "frequentlyAskedYears": [
      "CBSE 2023",
      "GSEB 2024"
    ],
    "modelAnswer": "This is due to the Inertia of Rest (Newton’s First Law). When the bus starts moving, the lower part of the passenger’s body in contact with the bus moves forward, but the upper body tends to remain at rest due to inertia, causing the passenger to jerk backwards.",
    "modelAnswerGujarati": "આ સ્થિરતાના જડત્વ (ન્યૂટનનો ગતિનો પ્રથમ નિયમ) ના કારણે થાય છે. જ્યારે બસ ઉપડે છે ત્યારે શરીરનો નીચેનો ભાગ બસ સાથે ગતિમાં આવે છે, પરંતુ શરીરનો ઉપરનો ભાગ જડત્વના નિયમ અનુસાર સ્થિર રહેવાનો પ્રયત્ન કરે છે, જેથી પાછળ ધકેલાય છે.",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "Naming Inertia of Rest / Newton 1st Law.",
        "textGujarati": "સ્થિરતાનું જડત્વ / ન્યૂટનનો ૧લો નિયમ દર્શાવવો."
      },
      {
        "stepNumber": 2,
        "marksAllocated": "1 Mark",
        "text": "Explaining difference between lower and upper body motion.",
        "textGujarati": "શરીરના નીચેના અને ઉપરના ભાગની ગતિ સમજાવવી."
      }
    ],
    "examinerTips": "Mention the term 'Inertia of Rest'.",
    "examinerTipsGujarati": "'જડત્વનો નિયમ' શબ્દ અવશ્ય વાપરવો."
  },
  {
    "id": "imp-col-1m-1",
    "grade": "college",
    "board": "All",
    "subject": "Coding",
    "chapterNumber": 1,
    "chapterTitle": "Data Structures & Algorithms",
    "chapterTitleGujarati": "ડેટા સ્ટ્રક્ચર (ટાઇમ કોમ્પ્લેક્સિટી)",
    "marks": 1,
    "marksCategory": "1-Mark Technical VSA",
    "questionText": "What is the worst-case time complexity of QuickSort and how can it be avoided?",
    "questionTextGujarati": "ક્વિકસોર્ટની સૌથી ખરાબ પરિસ્થિતિ (વર્સ્ટ કેસ) ટાઇમ કોમ્પ્લેક્સિટી શું છે અને તે કેવી રીતે ટાળી શકાય?",
    "frequentlyAskedYears": [
      "TCS NQT 2024",
      "Amazon Interview 2023"
    ],
    "modelAnswer": "Worst case is O(n²) when the pivot chosen is always the smallest or largest element in sorted/reverse-sorted data. It is avoided using Randomized Pivot selection or Median-of-Three pivot.",
    "modelAnswerGujarati": "વર્સ્ટ કેસ O(n²) છે (જ્યારે પિવોટ હંમેશા સૌથી નાનો કે મોટો પસંદ થાય). રેન્ડમાઈઝ્ડ પિવોટ પસંદગીથી તે O(n log n) માં ટાળી શકાય છે.",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "O(n²) and randomized pivot.",
        "textGujarati": "O(n²) અને રેન્ડમ પિવોટ."
      }
    ],
    "examinerTips": "Mention randomized pivot technique.",
    "examinerTipsGujarati": "રેન્ડમાઇઝ્ડ પિવોટ ખાસ લખવો."
  },
  {
    "id": "imp-col-1m-2",
    "grade": "college",
    "board": "All",
    "subject": "Database",
    "chapterNumber": 1,
    "chapterTitle": "Relational Databases",
    "chapterTitleGujarati": "ડેટાબેઝ (પ્રાઇમરી vs યુનિક કી)",
    "marks": 1,
    "marksCategory": "1-Mark Technical VSA",
    "questionText": "What is the key difference between PRIMARY KEY and UNIQUE KEY constraint in SQL?",
    "questionTextGujarati": "SQL માં પ્રાઇમરી કી અને યુનિક કી વચ્ચેનો મુખ્ય તફાવત શું છે?",
    "frequentlyAskedYears": [
      "Infosys 2024",
      "Wipro 2023"
    ],
    "modelAnswer": "A table can have only ONE Primary Key and it CANNOT accept NULL values. A table can have MULTIPLE Unique Keys and they CAN accept one or more NULL values.",
    "modelAnswerGujarati": "ટેબલમાં ફક્ત એક જ પ્રાઇમરી કી હોઈ શકે અને તે ક્યારેય NULL ન હોઈ શકે. યુનિક કી એક કરતાં વધુ હોઈ શકે અને NULL મૂલ્ય સ્વીકારે છે.",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "NULL tolerance and count difference.",
        "textGujarati": "NULL અને સંખ્યાનો તફાવત."
      }
    ],
    "examinerTips": "Remember: PK cannot be NULL; UK permits NULL.",
    "examinerTipsGujarati": "PK માં NULL ક્યારેય ન આવે."
  },
  {
    "id": "imp-col-2m-1",
    "grade": "college",
    "board": "All",
    "subject": "WebDev",
    "chapterNumber": 2,
    "chapterTitle": "React Architecture",
    "chapterTitleGujarati": "રિએક્ટ આર્કિટેક્ચર (વર્ચ્યુઅલ DOM)",
    "marks": 2,
    "marksCategory": "2-Mark Short Answer",
    "questionText": "Explain the Virtual DOM and Reconciliation algorithm (Diffing) in React.",
    "questionTextGujarati": "રિએક્ટમાં વર્ચ્યુઅલ DOM અને રિકોન્સિલિએશન (ડિફિંગ અલ્ગોરિધમ) સમજાવો.",
    "frequentlyAskedYears": [
      "Amazon 2024",
      "Accenture 2023"
    ],
    "modelAnswer": "1. Virtual DOM is a lightweight in-memory JavaScript representation of the real DOM.\n2. When component state changes, React creates a new Virtual DOM tree, diffs it with the previous snapshot (Reconciliation), and computes minimum batch changes to update the real DOM efficiently.",
    "modelAnswerGujarati": "૧. વર્ચ્યુઅલ DOM એ વાસ્તવિક DOM નું મેમરીમાં રહેલું હળવું જાવાસ્ક્રિપ્ટ સ્વરૂપ છે.\n૨. સ્ટેટ બદલાતાં નવું વર્ચ્યુઅલ DOM બને છે, જૂના સાથે સરખામણી (Diffing) થાય છે અને ફક્ત જરૂરી ફેરફારો જ રિયલ DOM માં અપડેટ થાય છે.",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "Virtual DOM in-memory concept.",
        "textGujarati": "ઇન-મેમરી વર્ચ્યુઅલ DOM સંકલ્પના."
      },
      {
        "stepNumber": 2,
        "marksAllocated": "1 Mark",
        "text": "Diffing and batch DOM updates.",
        "textGujarati": "ડિફિંગ અને લઘુત્તમ DOM અપડેટ્સ."
      }
    ],
    "examinerTips": "Keyword: Batching and Diffing Algorithm.",
    "examinerTipsGujarati": "કીવર્ડ્સ: ડિફિંગ, બેચિંગ."
  },
  {
    "id": "imp-col-2m-2",
    "grade": "college",
    "board": "All",
    "subject": "Coding",
    "chapterNumber": 2,
    "chapterTitle": "Object-Oriented Programming",
    "chapterTitleGujarati": "ઓબ્જેક્ટ ઓરિએન્ટેડ પ્રોગ્રામિંગ",
    "marks": 2,
    "marksCategory": "2-Mark Short Answer",
    "questionText": "Explain Method Overloading vs Method Overriding with respect to polymorphism.",
    "questionTextGujarati": "પોલીમોર્ફિઝમના સંદર્ભમાં મેથડ ઓવરલોડિંગ અને મેથડ ઓવરરાઈડિંગ વચ્ચે તફાવત આપો.",
    "frequentlyAskedYears": [
      "TCS NQT 2024",
      "Cognizant 2023"
    ],
    "modelAnswer": "1. Method Overloading: Same method name with different parameters within the same class (Compile-time / Static polymorphism).\n2. Method Overriding: Subclass provides a specific implementation of a method already defined in its superclass with identical signature (Runtime / Dynamic polymorphism).",
    "modelAnswerGujarati": "૧. મેથડ ઓવરલોડિંગ: એક જ ક્લાસમાં સમાન નામ પરંતુ જુદા પેરામીટર (કમ્પાઈલ-ટાઈમ પોલીમોર્ફિઝમ).\n૨. મેથડ ઓવરરાઈડિંગ: પિતૃ ક્લાસની મેથડને ચાઈલ્ડ ક્લાસમાં ફરીથી સમાન સહી સાથે વ્યાખ્યાયિત કરવી (રન-ટાઈમ પોલીમોર્ફિઝમ).",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "Overloading = Compile-time.",
        "textGujarati": "ઓવરલોડિંગ = કમ્પાઈલ-ટાઈમ."
      },
      {
        "stepNumber": 2,
        "marksAllocated": "1 Mark",
        "text": "Overriding = Runtime polymorphism.",
        "textGujarati": "ઓવરરાઈડિંગ = રન-ટાઈમ."
      }
    ],
    "examinerTips": "Compile-time vs Runtime is the distinguishing core.",
    "examinerTipsGujarati": "કમ્પાઈલ-ટાઈમ vs રન-ટાઈમ ખાસ લખો."
  },
  {
    "id": "imp-col-3m-1",
    "grade": "college",
    "board": "All",
    "subject": "Database",
    "chapterNumber": 3,
    "chapterTitle": "SQL Queries and Indexing",
    "chapterTitleGujarati": "SQL ક્વેરી (બીજી સૌથી વધુ સેલરી)",
    "marks": 3,
    "marksCategory": "3-Mark Technical Sum",
    "questionText": "Write a SQL query to find the 2nd highest salary from an Employee table using two different approaches.",
    "questionTextGujarati": "Employee ટેબલમાંથી બીજી સૌથી વધુ સેલરી (2nd Highest Salary) શોધવા માટેની બે જુદી રીતોની SQL ક્વેરી લખો.",
    "frequentlyAskedYears": [
      "Amazon 2024",
      "TCS Digital 2023",
      "Infosys 2023"
    ],
    "modelAnswer": "Approach 1 (Subquery with MAX):\nSELECT MAX(salary) AS SecondHighestSalary FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);\n\nApproach 2 (LIMIT and OFFSET in MySQL / Postgres):\nSELECT DISTINCT salary FROM Employee ORDER BY salary DESC LIMIT 1 OFFSET 1;\n\nApproach 3 (Window Function DENSE_RANK):\nWITH RankedSalaries AS (SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) as rank_no FROM Employee) SELECT salary FROM RankedSalaries WHERE rank_no = 2;",
    "modelAnswerGujarati": "રીત ૧ (સબક્વેરી):\nSELECT MAX(salary) FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);\n\nરીત ૨ (LIMIT અને OFFSET):\nSELECT DISTINCT salary FROM Employee ORDER BY salary DESC LIMIT 1 OFFSET 1;\n\nરીત ૩ (DENSE_RANK વિન્ડો ફંક્શન):\nSELECT salary FROM (SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) as r FROM Employee) WHERE r = 2;",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1.5 Marks",
        "text": "Subquery approach with MAX.",
        "textGujarati": "MAX સબક્વેરી વાળી રીત."
      },
      {
        "stepNumber": 2,
        "marksAllocated": "1.5 Marks",
        "text": "LIMIT OFFSET or DENSE_RANK approach.",
        "textGujarati": "LIMIT OFFSET અથવા DENSE_RANK રીત."
      }
    ],
    "examinerTips": "Use DENSE_RANK instead of RANK to handle duplicate tied salaries properly.",
    "examinerTipsGujarati": "ટાઈ માટે DENSE_RANK વાપરવું શ્રેષ્ઠ છે."
  },
  {
    "id": "imp-col-3m-2",
    "grade": "college",
    "board": "All",
    "subject": "Coding",
    "chapterNumber": 3,
    "chapterTitle": "Data Structures - Trees & Graphs",
    "chapterTitleGujarati": "ડેટા સ્ટ્રક્ચર (BFS vs DFS)",
    "marks": 3,
    "marksCategory": "3-Mark Technical Answer",
    "questionText": "Compare Breadth-First Search (BFS) and Depth-First Search (DFS) in graph algorithms on Data structure, Space complexity, and Shortest path finding.",
    "questionTextGujarati": "ગ્રાફ અલ્ગોરિધમમાં BFS અને DFS વચ્ચે ડેટા સ્ટ્રક્ચર, સ્પેસ કોમ્પ્લેક્સિટી અને ટૂંકા રસ્તાની શોધ બાબતે સરખામણી કરો.",
    "frequentlyAskedYears": [
      "Amazon 2024",
      "Infosys 2023"
    ],
    "modelAnswer": "1. Data Structure Used: BFS uses a FIFO Queue; DFS uses a LIFO Stack (or recursion stack).\n2. Space Complexity: BFS space is O(V) or O(W) where W is max width of graph; DFS space is O(H) where H is maximum depth of graph tree.\n3. Shortest Path: In an unweighted graph, BFS is guaranteed to find the shortest path between start and target node. DFS does not guarantee shortest path.",
    "modelAnswerGujarati": "૧. ડેટા સ્ટ્રક્ચર: BFS કતાર (Queue - FIFO) વાપરે છે; DFS સ્ટેક (Stack - LIFO) અથવા રિકર્ઝન વાપરે છે.\n૨. સ્પેસ કોમ્પ્લેક્સિટી: BFS મહત્તમ પહોળાઈ O(Width) મેમરી રોકે છે; DFS ઊંડાઈ O(Height) મેમરી રોકે છે.\n૩. ટૂંકો રસ્તો (શોર્ટેસ્ટ પાથ): અનવેઈટેડ ગ્રાફમાં BFS હંમેશા ટૂંકો રસ્તો શોધે છે; DFS ટૂંકા રસ્તાની ખાતરી આપતું નથી.",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "Queue vs Stack comparison.",
        "textGujarati": "કતાર vs સ્ટેક સરખામણી."
      },
      {
        "stepNumber": 2,
        "marksAllocated": "1 Mark",
        "text": "Space complexity O(W) vs O(H).",
        "textGujarati": "સ્પેસ કોમ્પ્લેક્સિટી તફાવત."
      },
      {
        "stepNumber": 3,
        "marksAllocated": "1 Mark",
        "text": "Shortest path guarantee in unweighted graphs.",
        "textGujarati": "ટૂંકા રસ્તાની શોધ બાબત."
      }
    ],
    "examinerTips": "BFS = Level order, shortest path in unweighted graphs.",
    "examinerTipsGujarati": "BFS લેવલ ઓર્ડરમાં આગળ વધે છે."
  },
  {
    "id": "imp-col-4m-1",
    "grade": "college",
    "board": "All",
    "subject": "Architecture",
    "chapterNumber": 4,
    "chapterTitle": "System Design & Architecture",
    "chapterTitleGujarati": "સિસ્ટમ ડિઝાઇન (માઇક્રોસર્વિસિસ vs મોનોલિથ)",
    "marks": 4,
    "marksCategory": "4-Mark Technical Case Study",
    "questionText": "Differentiate between Monolithic Architecture and Microservices Architecture across Scalability, Fault Tolerance, Deployment, and Complexity.",
    "questionTextGujarati": "સ્કેલેબિલિટી, ફોલ્ટ ટોલરન્સ, ડિપ્લોયમેન્ટ અને જટિલતાના આધારે મોનોલિથિક અને માઇક્રોસર્વિસિસ આર્કિટેક્ચર વચ્ચે તુલના કરો.",
    "frequentlyAskedYears": [
      "Amazon 2024",
      "TCS Digital 2023"
    ],
    "modelAnswer": "1. Scalability: Monoliths scale vertically or by replicating the entire application. Microservices scale horizontally on a per-service bottleneck basis (e.g., scaling only payment service during flash sales).\n2. Fault Tolerance: In a monolith, a memory leak or crash in one module brings down the entire application. In microservices, services are isolated via circuit breakers (resilient architecture).\n3. Deployment: Monolith requires redeploying the entire multi-gigabyte code base for small bug fixes. Microservices support independent CI/CD pipelines and zero-downtime rolling deploys.\n4. Complexity: Monoliths have simpler initial development and debugging with local ACID transactions. Microservices introduce distributed complexity: network latency, eventual consistency, distributed tracing, and service discovery.",
    "modelAnswerGujarati": "૧. સ્કેલેબિલિટી: મોનોલિથમાં આખી સિસ્ટમનું સ્કેલિંગ કરવું પડે છે; માઇક્રોસર્વિસિસમાં જરૂરિયાત મુજબ ચોક્કસ સર્વિસ (દા.ત. પેમેન્ટ સર્વિસ) નું જ સ્કેલિંગ થઈ શકે છે.\n૨. ફોલ્ટ ટોલરન્સ: મોનોલિથમાં એક મોડ્યુલ ક્રેશ થાય તો આખી એપ બંધ પડી જાય; માઇક્રોસર્વિસિસમાં સર્વિસ અલગ રહેતી હોવાથી અન્ય સિસ્ટમ ચાલુ રહે છે.\n૩. ડિપ્લોયમેન્ટ: મોનોલિથમાં નાના ફેરફાર માટે આખું સોફ્ટવેર ફરી ડિપ્લોય કરવું પડે; માઇક્રોસર્વિસિસમાં સ્વતંત્ર CI/CD થી વિના અવરોધે ડિપ્લોયમેન્ટ થાય છે.\n૪. જટિલતા: મોનોલિથ શરૂઆતમાં સરળ હોય છે; માઇક્રોસર્વિસિસમાં નેટવર્ક લેટન્સી, ડિસ્ટ્રિબ્યુટેડ ટ્રાન્ઝેક્શન્સ અને મોનિટરિંગની જટિલતા વધે છે.",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "Horizontal granular scalability vs monolithic scale.",
        "textGujarati": "સ્કેલેબિલિટી સરખામણી."
      },
      {
        "stepNumber": 2,
        "marksAllocated": "1 Mark",
        "text": "Blast radius and fault tolerance isolation.",
        "textGujarati": "ફોલ્ટ આઇસોલેશન તફાવત."
      },
      {
        "stepNumber": 3,
        "marksAllocated": "1 Mark",
        "text": "Independent CI/CD deployment pipelines.",
        "textGujarati": "સ્વતંત્ર ડિપ્લોયમેન્ટ."
      },
      {
        "stepNumber": 4,
        "marksAllocated": "1 Mark",
        "text": "Distributed systems trade-offs and complexity.",
        "textGujarati": "ડિસ્ટ્રિબ્યુટેડ જટિલતા."
      }
    ],
    "examinerTips": "Address CAP theorem and distributed transactions (Saga pattern) as pro points.",
    "examinerTipsGujarati": "સાગા પેટર્ન અને CAP પ્રમેયનો ઉલ્લેખ કરો."
  },
  {
    "id": "imp-col-4m-2",
    "grade": "college",
    "board": "All",
    "subject": "Coding",
    "chapterNumber": 4,
    "chapterTitle": "Dynamic Programming",
    "chapterTitleGujarati": "ડાયનેમિક પ્રોગ્રામિંગ (0/1 નેપસેક)",
    "marks": 4,
    "marksCategory": "4-Mark Technical Algorithm",
    "questionText": "Formulate the 0/1 Knapsack Problem using Dynamic Programming (Bottom-Up Tabulation). State the recurrence relation and space-time complexity.",
    "questionTextGujarati": "ડાયનેમિક પ્રોગ્રામિંગ (ટેબ્યુલેશન પદ્ધતિ) દ્વારા 0/1 નેપસેક સમસ્યા સમજાવો. તેનું રિકરન્સ સૂત્ર અને ટાઇમ-સ્પેસ કોમ્પ્લેક્સિટી જણાવો.",
    "frequentlyAskedYears": [
      "Amazon 2024",
      "Infosys 2023"
    ],
    "modelAnswer": "Problem: Given weights wt[] and values val[] of n items and capacity W, maximize value without fractional division.\n1. State: dp[i][w] represents maximum value achievable using a subset of first i items with capacity limit w.\n2. Recurrence Relation:\nIf wt[i-1] <= w:\ndp[i][w] = max(val[i-1] + dp[i-1][w - wt[i-1]], dp[i-1][w])\nElse:\ndp[i][w] = dp[i-1][w]\n3. Base Case: dp[0][w] = 0 for all w, and dp[i][0] = 0 for all i.\n4. Time Complexity: O(n × W) (Pseudo-polynomial time).\n5. Space Complexity: O(n × W), optimizable to O(W) using a single 1D array.",
    "modelAnswerGujarati": "સમસ્યા: n વસ્તુઓનું વજન wt[], મૂલ્ય val[] અને નેપસેકની ક્ષમતા W માટે મહત્તમ મૂલ્ય મેળવવું.\n૧. સ્ટેટ: dp[i][w] એ પ્રથમ i વસ્તુઓ અને ક્ષમતા w માટેનું મહત્તમ મૂલ્ય દર્શાવે છે.\n૨. રિકરન્સ સૂત્ર:\nજો wt[i-૧] <= w હોય:\ndp[i][w] = max(val[i-૧] + dp[i-૧][w - wt[i-૧]], dp[i-૧][w])\nનહીં તો:\ndp[i][w] = dp[i-૧][w]\n૩. બેઝ કેસ: dp[૦][w] = ૦ અને dp[i][૦] = ૦.\n૪. ટાઇમ કોમ્પ્લેક્સિટી: O(n × W).\n૫. સ્પેસ કોમ્પ્લેક્સિટી: O(n × W) જેને O(W) સુધી ઘટાડી શકાય છે.",
    "stepWiseMarking": [
      {
        "stepNumber": 1,
        "marksAllocated": "1 Mark",
        "text": "DP state definition dp[i][w].",
        "textGujarati": "DP સ્ટેટ વ્યાખ્યા."
      },
      {
        "stepNumber": 2,
        "marksAllocated": "1.5 Marks",
        "text": "Recurrence relation with pick/no-pick conditions.",
        "textGujarati": "રિકરન્સ સૂત્ર."
      },
      {
        "stepNumber": 3,
        "marksAllocated": "0.5 Marks",
        "text": "Base cases.",
        "textGujarati": "બેઝ કેસ."
      },
      {
        "stepNumber": 4,
        "marksAllocated": "1 Mark",
        "text": "O(n × W) time and space complexity.",
        "textGujarati": "ટાઇમ અને સ્પેસ કોમ્પ્લેક્સિટી."
      }
    ],
    "examinerTips": "Mention that 0/1 knapsack CANNOT be solved with a greedy approach, unlike fractional knapsack.",
    "examinerTipsGujarati": "0/1 નેપસેક ગ્રીડી પદ્ધતિથી ન ઉકેલાય તે દર્શાવો."
  }
];

async function autoSeedImportantQuestions() {
  try {
    for (const q of SEED_IMPORTANT_QUESTIONS) {
      await ImportantQuestion.findOneAndUpdate({ id: q.id }, q, { upsert: true });
    }
  } catch (e) {
    // MongoDB optional in local fallback
  }
}

// GET /api/important-questions
router.get('/', async (req, res) => {
  try {
    const { grade, subject, marks } = req.query;

    const filterSeed = () => {
      let list = SEED_IMPORTANT_QUESTIONS.filter((q) => {
        if (grade && q.grade !== grade) return false;
        if (subject && subject !== 'All') {
          const sLower = subject.toLowerCase();
          const matchSub = q.subject && q.subject.toLowerCase() === sLower;
          const matchGuj = q.chapterTitleGujarati && q.chapterTitleGujarati.includes(subject);
          if (!matchSub && !matchGuj) return false;
        }
        if (marks && q.marks !== parseInt(marks)) return false;
        return true;
      });
      if (list.length === 0 && grade) {
        list = SEED_IMPORTANT_QUESTIONS.filter((q) => q.grade === grade);
      }
      return list.length > 0 ? list : SEED_IMPORTANT_QUESTIONS;
    };

    if (mongoose.connection.readyState !== 1) {
      return res.json(filterSeed());
    }

    const query = {};
    if (grade) query.grade = grade;
    if (subject && subject !== 'All') query.subject = subject;
    if (marks) query.marks = parseInt(marks);

    let list = await ImportantQuestion.find(query).sort({ marks: 1, chapterNumber: 1 });

    if (!list || list.length === 0) {
      list = filterSeed();
    }

    res.json(list);
  } catch (error) {
    console.warn('Error fetching important questions, using memory list:', error.message);
    res.json(SEED_IMPORTANT_QUESTIONS);
  }
});

module.exports = { router, autoSeedImportantQuestions, SEED_IMPORTANT_QUESTIONS };

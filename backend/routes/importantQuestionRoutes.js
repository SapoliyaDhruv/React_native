const express = require('express');
const router = express.Router();
const ImportantQuestion = require('../models/ImportantQuestion');

const SEED_IMPORTANT_QUESTIONS = [
  // =========================================================================
  // CLASS 10 MATHEMATICS (1M, 2M, 3M, 4M) - GSEB & CBSE BOARD SPECIAL
  // =========================================================================
  {
    id: 'imp-g10-m-1m-1',
    grade: '10',
    board: 'All',
    subject: 'Mathematics',
    chapterNumber: 1,
    chapterTitle: 'Real Numbers',
    chapterTitleGujarati: 'વાસ્તવિક સંખ્યાઓ',
    marks: 1,
    marksCategory: '1-Mark Objective / VSA',
    questionText: 'State the Fundamental Theorem of Arithmetic.',
    questionTextGujarati: 'અંકગણિતનું મૂળભૂત પ્રમેય લખો.',
    frequentlyAskedYears: ['GSEB 2024', 'GSEB 2022', 'CBSE 2023'],
    modelAnswer: 'Every composite number can be expressed (factorized) as a product of primes, and this factorization is unique, apart from the order in which the prime factors occur.',
    modelAnswerGujarati: 'દરેક વિભાજ્ય સંખ્યાને તેના અવિભાજ્ય અવયવોના ગુણાકાર તરીકે અનન્ય રીતે દર્શાવી શકાય છે (અવયવોના ક્રમને બાદ કરતાં).',
    stepWiseMarking: [
      { stepNumber: 1, marksAllocated: '1 Mark', text: 'Accurate statement mentioning unique prime factorization apart from order.', textGujarati: 'અનન્ય અવિભાજ્ય ગુણાકારનું સચોટ વિધાન.' },
    ],
    examinerTips: 'Do not forget the phrase "apart from the order of factors".',
    examinerTipsGujarati: 'અવયવોના ક્રમને ધ્યાનમાં લીધા વિના - આ શબ્દ લખવો અનિવાર્ય છે.',
  },
  {
    id: 'imp-g10-m-2m-1',
    grade: '10',
    board: 'All',
    subject: 'Mathematics',
    chapterNumber: 1,
    chapterTitle: 'Real Numbers',
    chapterTitleGujarati: 'વાસ્તવિક સંખ્યાઓ',
    marks: 2,
    marksCategory: '2-Mark Short Answer',
    questionText: 'Given that HCF(306, 657) = 9, find LCM(306, 657).',
    questionTextGujarati: 'જો ગુ.સા.અ. (306, 657) = 9 આપેલ હોય, તો લ.સા.અ. (306, 657) શોધો.',
    frequentlyAskedYears: ['GSEB March 2023', 'CBSE 2022', 'CBSE 2024'],
    modelAnswer: 'We know that LCM(a, b) × HCF(a, b) = a × b. Therefore, LCM(306, 657) = (306 × 657) / 9 = 34 × 657 = 22,338.',
    modelAnswerGujarati: 'આપણે જાણીએ છીએ કે: લ.સા.અ. × ગુ.સા.અ. = બે સંખ્યાઓનો ગુણાકાર. લ.સા.અ. = (306 × 657) / 9 = 34 × 657 = 22,338.',
    stepWiseMarking: [
      { stepNumber: 1, marksAllocated: '1 Mark', text: 'Stating formula: LCM × HCF = a × b and substituting values.', textGujarati: 'સૂત્ર: લ.સા.અ. × ગુ.સા.અ. = a × b માં કિંમતો મૂકવી.' },
      { stepNumber: 2, marksAllocated: '1 Mark', text: 'Correct calculation and final answer: 22,338.', textGujarati: 'સાચી ગણતરી અને અંતિમ જવાબ: 22,338.' },
    ],
    examinerTips: 'Avoid multiplying 306 × 657 first. Cancel 306 by 9 to get 34 for faster computation.',
    examinerTipsGujarati: 'પહેલા 306 ને 9 વડે ભાગીને 34 લાવો, જેથી ગણતરી ઝડપી બને.',
  },
  {
    id: 'imp-g10-m-3m-1',
    grade: '10',
    board: 'All',
    subject: 'Mathematics',
    chapterNumber: 1,
    chapterTitle: 'Real Numbers',
    chapterTitleGujarati: 'વાસ્તવિક સંખ્યાઓ',
    marks: 3,
    marksCategory: '3-Mark Medium Proof / Sum',
    questionText: 'Prove that √5 is an irrational number.',
    questionTextGujarati: 'સાબિત કરો કે √5 એ અસંમેય સંખ્યા છે.',
    frequentlyAskedYears: ['GSEB March 2024', 'GSEB July 2023', 'CBSE 2023', 'CBSE 2020'],
    modelAnswer: '1. Assume √5 is rational: √5 = a/b (where a, b are co-prime integers, b ≠ 0).\n2. Squaring both sides: 5b² = a². Therefore 5 divides a² => 5 divides a. Let a = 5c.\n3. Substituting: 5b² = (5c)² = 25c² => b² = 5c². Thus 5 divides b² => 5 divides b.\n4. So 5 is a common factor of both a and b, contradicting that a and b are co-prime. Hence √5 is irrational.',
    modelAnswerGujarati: '૧. ધારો કે √5 સંમેય સંખ્યા છે: √5 = a/b (જ્યાં a અને b પરસ્પર અવિભાજ્ય પૂર્ણાંકો છે).\n૨. બંને બાજુ વર્ગ કરતાં: 5b² = a². આથી 5 એ a² નો અવયવ છે => 5 એ a નો અવયવ છે. a = 5c લો.\n૩. 5b² = 25c² => b² = 5c². આથી 5 એ b નો પણ અવયવ છે.\n૪. આમ 5 એ a અને b બંનેનો સામાન્ય અવયવ છે, જે આપણી ધારણાથી વિરુદ્ધ છે. તેથી √5 અસંમેય છે.',
    stepWiseMarking: [
      { stepNumber: 1, marksAllocated: '1 Mark', text: 'Assumption of co-primes and showing 5 divides a.', textGujarati: 'પરસ્પર અવિભાજ્યની ધારણા અને 5 એ a નો અવયવ છે તે દર્શાવવું.' },
      { stepNumber: 2, marksAllocated: '1 Mark', text: 'Substituting a = 5c and showing 5 divides b.', textGujarati: 'a = 5c મૂકીને 5 એ b નો પણ અવયવ છે તે સાબિત કરવું.' },
      { stepNumber: 3, marksAllocated: '1 Mark', text: 'Arriving at contradiction and writing final conclusion.', textGujarati: 'વિરોધાભાસ દર્શાવીને અંતિમ તારણ લખવું.' },
    ],
    examinerTips: 'The definition that a and b are co-prime (HCF=1) must be explicitly stated in the first step.',
    examinerTipsGujarati: 'પ્રથમ પગલામાં a અને b પરસ્પર અવિભાજ્ય છે તે લખવું ફરજિયાત છે.',
  },
  {
    id: 'imp-g10-m-4m-1',
    grade: '10',
    board: 'All',
    subject: 'Mathematics',
    chapterNumber: 6,
    chapterTitle: 'Triangles',
    chapterTitleGujarati: 'ત્રિકોણ (થેલ્સનું પ્રમેય)',
    marks: 4,
    marksCategory: '4-Mark Long Answer / Theorem',
    questionText: 'State and prove Basic Proportionality Theorem (Thales Theorem).',
    questionTextGujarati: 'થેલ્સનું પ્રમેય (સમપ્રમાણતાનું મૂળભૂત પ્રમેય) લખો અને સાબિત કરો.',
    frequentlyAskedYears: ['GSEB March 2024', 'GSEB 2020', 'CBSE 2024', 'CBSE 2022'],
    modelAnswer: 'Statement: If a line is drawn parallel to one side of a triangle intersecting the other two sides in distinct points, then the other two sides are divided in the same ratio.\nProof: In △ABC, DE ∥ BC. Draw DM ⊥ AC and EN ⊥ AB. Join BE and CD.\nar(△ADE) = 1/2 × AD × EN, ar(△BDE) = 1/2 × DB × EN => ar(△ADE)/ar(△BDE) = AD/DB.\nSimilarly ar(△ADE)/ar(△CDE) = AE/EC.\nSince △BDE and △CDE lie on the same base DE between parallel lines DE and BC: ar(△BDE) = ar(△CDE).\nHence, AD/DB = AE/EC.',
    modelAnswerGujarati: 'પ્રમેય: જો ત્રિકોણની કોઈ એક બાજુને સમાંતર દોરેલી રેખા બાકીની બે બાજુઓને ભિન્ન બિંદુઓમાં છેદે, તો તે બાજુઓ પર કપાતા રેખાખંડો તે બાજુઓનું સમપ્રમાણમાં વિભાજન કરે છે.\nસાબિતી: △ABC માં DE ∥ BC. વેધ DM ⊥ AC અને EN ⊥ AB દોરો. BE અને CD જોડો.\nar(△ADE) / ar(△BDE) = AD / DB અને ar(△ADE) / ar(△CDE) = AE / EC.\n△BDE અને △CDE સમાન પાયા DE પર અને સમાંતર રેખાઓ વચ્ચે આવેલા હોવાથી ક્ષેત્રફળ સમાન છે.\nતેથી: AD/DB = AE/EC.',
    stepWiseMarking: [
      { stepNumber: 1, marksAllocated: '1 Mark', text: 'Accurate statement and labeled geometric diagram.', textGujarati: 'પ્રમેયનું વિધાન અને નામનિર્દેશિત આકૃતિ.' },
      { stepNumber: 2, marksAllocated: '1 Mark', text: 'Given, to prove, and geometric construction steps.', textGujarati: 'પક્ષ, સાધ્ય અને રચનાના મુદ્દા.' },
      { stepNumber: 3, marksAllocated: '1 Mark', text: 'Ratio of areas of triangles with common heights.', textGujarati: 'સામાન્ય વેધ વાળા ત્રિકોણોના ક્ષેત્રફળનો ગુણોત્તર.' },
      { stepNumber: 4, marksAllocated: '1 Mark', text: 'Equating areas on same base and final proportion AD/DB = AE/EC.', textGujarati: 'સમાન પાયા પરના ત્રિકોણોનું ક્ષેત્રફળ સરખાવીને AD/DB = AE/EC સાબિતી.' },
    ],
    examinerTips: 'Always draw the triangle diagram using a ruler and pencil. Without the diagram, zero marks are awarded for the theorem proof.',
    examinerTipsGujarati: 'પેન્સિલ અને ફૂટપટ્ટીથી આકૃતિ દોરવી અનિવાર્ય છે. આકૃતિ વગર પ્રમેયમાં ગુણ મળતા નથી.',
  },

  // =========================================================================
  // CLASS 10 SCIENCE (1M, 2M, 3M, 4M) - GSEB & CBSE BOARD SPECIAL
  // =========================================================================
  {
    id: 'imp-g10-s-1m-1',
    grade: '10',
    board: 'All',
    subject: 'Science',
    chapterNumber: 10,
    chapterTitle: 'Electricity',
    chapterTitleGujarati: 'વિદ્યુત (ઓહ્મનો નિયમ)',
    marks: 1,
    marksCategory: '1-Mark Objective / VSA',
    questionText: 'Define 1 Ohm resistance according to Ohm’s Law.',
    questionTextGujarati: 'ઓહ્મના નિયમ અનુસાર ૧ ઓહ્મ (1 Ω) અવરોધની વ્યાખ્યા આપો.',
    frequentlyAskedYears: ['GSEB 2024', 'CBSE 2023', 'GSEB 2021'],
    modelAnswer: '1 Ohm is the resistance of a conductor such that when a potential difference of 1 Volt is applied across its ends, a current of 1 Ampere flows through it (1 Ω = 1 V / 1 A).',
    modelAnswerGujarati: 'જો વાહકના બે છેડા વચ્ચે ૧ વોલ્ટ વિદ્યુતસ્થિતિમાનનો તફાવત આપતાં તેમાંથી ૧ એમ્પીયર વિદ્યુતપ્રવાહ વહેતો હોય, તો તે વાહકનો અવરોધ ૧ ઓહ્મ કહેવાય (૧ Ω = ૧ V / ૧ A).',
    stepWiseMarking: [
      { stepNumber: 1, marksAllocated: '1 Mark', text: 'Definition stating 1 Volt producing 1 Ampere current.', textGujarati: '૧ વોલ્ટ અને ૧ એમ્પીયર પ્રવાહનું સ્પષ્ટ વિધાન.' },
    ],
    examinerTips: 'Write the formula 1 Ω = 1 V / 1 A alongside the definition for full marks.',
    examinerTipsGujarati: 'વ્યાખ્યા સાથે ૧ Ω = ૧ V / ૧ A સૂત્ર અવશ્ય લખવું.',
  },
  {
    id: 'imp-g10-s-2m-1',
    grade: '10',
    board: 'All',
    subject: 'Science',
    chapterNumber: 2,
    chapterTitle: 'Acids, Bases and Salts',
    chapterTitleGujarati: 'એસિડ, બેઇઝ અને ક્ષાર (પ્લાસ્ટર ઓફ પેરિસ)',
    marks: 2,
    marksCategory: '2-Mark Short Answer',
    questionText: 'Write the chemical formula and preparation equation of Plaster of Paris (POP) from Gypsum.',
    questionTextGujarati: 'પ્લાસ્ટર ઓફ પેરિસ (POP) નું રાસાયણિક સૂત્ર અને જીપ્સમમાંથી બનાવટનું સમીકરણ લખો.',
    frequentlyAskedYears: ['GSEB March 2024', 'CBSE 2024', 'GSEB 2022'],
    modelAnswer: 'Chemical Formula: CaSO4 · 1/2 H2O (Calcium Sulphate Hemihydrate).\nPreparation: On heating Gypsum (CaSO4 · 2H2O) at 373 K (100 °C), it loses water molecules to form Plaster of Paris:\nCaSO4 · 2H2O + Heat (373 K) → CaSO4 · 1/2 H2O + 1½ H2O.',
    modelAnswerGujarati: 'રાસાયણિક સૂત્ર: CaSO4 · 1/2 H2O (કેલ્શિયમ સલ્ફેટ હેમીહાઇડ્રેટ).\nબનાવટ: જીપ્સમને (CaSO4 · 2H2O) ૩૭૩ K (૧૦૦ °C) તાપમાને ગરમ કરતાં તે પાણીના અણુઓ ગુમાવી પ્લાસ્ટર ઓફ પેરિસ બને છે:\nCaSO4 · 2H2O → CaSO4 · 1/2 H2O + 1½ H2O.',
    stepWiseMarking: [
      { stepNumber: 1, marksAllocated: '1 Mark', text: 'Correct chemical formula: CaSO4 · 1/2 H2O.', textGujarati: 'સાચું સૂત્ર: CaSO4 · 1/2 H2O.' },
      { stepNumber: 2, marksAllocated: '1 Mark', text: 'Balanced chemical reaction mentioning 373 K temperature.', textGujarati: '૩૭૩ K તાપમાન દર્શાવતું સંતુલિત રાસાયણિક સમીકરણ.' },
    ],
    examinerTips: 'Always mention temperature 373 K. Above 373 K, dead burnt plaster forms.',
    examinerTipsGujarati: '૩૭૩ K તાપમાન ખાસ દર્શાવવું, વધુ તાપમાને મૃત પ્લાસ્ટર બને છે.',
  },
  {
    id: 'imp-g10-s-3m-1',
    grade: '10',
    board: 'All',
    subject: 'Science',
    chapterNumber: 5,
    chapterTitle: 'Life Processes',
    chapterTitleGujarati: 'જૈવિક ક્રિયાઓ (માનવ ઉત્સર્જન એકમ - નેફ્રોન)',
    marks: 3,
    marksCategory: '3-Mark Medium Answer / Diagram',
    questionText: 'Describe the structure and functioning of a Nephron in human kidneys.',
    questionTextGujarati: 'માનવ મૂત્રપિંડમાં નેફ્રોનની રચના અને કાર્યપદ્ધતિ વર્ણવો.',
    frequentlyAskedYears: ['GSEB 2023', 'CBSE 2023', 'CBSE 2020'],
    modelAnswer: '1. Bowman’s Capsule & Glomerulus: Blood filtered under high pressure, collecting nitrogenous wastes (urea, uric acid), glucose, amino acids, and water.\n2. Tubular Reabsorption: As filtrate passes through the coiled tubule, useful substances like glucose, amino acids, salts, and excess water are selectively reabsorbed back into blood capillaries.\n3. Secretion & Urine Collection: The remaining liquid containing urea and excess salts forms urine, collected in the collecting duct.',
    modelAnswerGujarati: '૧. બાઉમેનની કોથળી અને રુધિરકેશિકાગુચ્છ: ઊંચા દબાણે રુધિર ગળાય છે, જેમાં યુરિયા, ગ્લુકોઝ અને ક્ષારો ગાળણમાં આવે છે.\n૨. પસંદગીશીલ પુનઃશોષણ: નલિકામાંથી પસાર થતાં ગ્લુકોઝ, એમિનો એસિડ, ક્ષારો અને જરૂરી પાણીનું રુધિરમાં પુનઃશોષણ થાય છે.\n૩. મૂત્ર નિર્માણ: અંતે વધેલ પ્રવાહી (યુરિયા અને ક્ષારો) મૂત્રરૂપે સંગ્રહણ નલિકામાં એકત્ર થાય છે.',
    stepWiseMarking: [
      { stepNumber: 1, marksAllocated: '1 Mark', text: 'Ultrafiltration at Glomerulus and Bowman capsule.', textGujarati: 'બાઉમેનની કોથળીમાં રુધિરનું સૂક્ષ્મ ગાળણ.' },
      { stepNumber: 2, marksAllocated: '1 Mark', text: 'Selective reabsorption of glucose, amino acids, water in tubule.', textGujarati: 'નલિકામાં ઉપયોગી ઘટકોનું પસંદગીશીલ પુનઃશોષણ.' },
      { stepNumber: 3, marksAllocated: '1 Mark', text: 'Formation and collection of urine in collecting duct.', textGujarati: 'મૂત્ર નિર્માણ અને સંગ્રહણ નલિકામાં વહન.' },
    ],
    examinerTips: 'Keywords: Ultrafiltration, Selective Reabsorption, Collecting Duct.',
    examinerTipsGujarati: 'કીવર્ડ્સ: અલ્ટ્રાફિલ્ટરેશન, પસંદગીશીલ પુનઃશોષણ, સંગ્રહણ નલિકા.',
  },
  {
    id: 'imp-g10-s-4m-1',
    grade: '10',
    board: 'All',
    subject: 'Science',
    chapterNumber: 8,
    chapterTitle: 'Light - Reflection and Refraction',
    chapterTitleGujarati: 'પ્રકાશ (બહિર્ગોળ લેન્સ વડે પ્રતિબિંબ અને મોટવણી)',
    marks: 4,
    marksCategory: '4-Mark Long Answer / Numericals',
    questionText: 'An object 4 cm in height is placed 20 cm in front of a convex lens of focal length 10 cm. Find the position, nature, and size of the image formed.',
    questionTextGujarati: '૧૦ સેમી કેન્દ્રલંબાઈવાળા બહિર્ગોળ લેન્સની સામે ૨૦ સેમી અંતરે ૪ સેમી ઊંચાઈની વસ્તુ મૂકેલી છે. પ્રતિબિંબનું સ્થાન, પ્રકાર અને ઊંચાઈ શોધો.',
    frequentlyAskedYears: ['GSEB March 2024', 'CBSE 2024', 'GSEB 2022'],
    modelAnswer: 'Given: Object height h = +4 cm, Object distance u = -20 cm, Focal length f = +10 cm.\n1. Lens Formula: 1/f = 1/v - 1/u => 1/v = 1/f + 1/u = 1/10 + 1/(-20) = 1/10 - 1/20 = 1/20.\nSo image distance v = +20 cm (Image formed 20 cm behind the lens at 2F₂).\n2. Magnification: m = v / u = (+20) / (-20) = -1.\n3. Image height: h\' = m × h = -1 × 4 = -4 cm.\nNature: Real, Inverted, and Same size as object.',
    modelAnswerGujarati: 'આપેલ વિગતો: વસ્તુ ઊંચાઈ h = +4 cm, વસ્તુ અંતર u = -20 cm, કેન્દ્રલંબાઈ f = +10 cm.\n૧. લેન્સનું સૂત્ર: 1/f = 1/v - 1/u => 1/v = 1/10 - 1/20 = 1/20 => v = +20 cm (લેન્સની પાછળ 2F₂ પર).\n૨. મોટવણી: m = v / u = (+20) / (-20) = -1.\n૩. પ્રતિબિંબ ઊંચાઈ: h\' = m × h = -1 × 4 = -4 cm.\nપ્રકાર: વાસ્તવિક, ઊલટું અને વસ્તુના કદ જેટલું જ.',
    stepWiseMarking: [
      { stepNumber: 1, marksAllocated: '1 Mark', text: 'Writing correct sign conventions: u = -20, f = +10.', textGujarati: 'સંજ્ઞા પ્રણાલી અનુસાર કિંમતો: u = -20 cm, f = +10 cm.' },
      { stepNumber: 2, marksAllocated: '1 Mark', text: 'Applying lens formula and calculating v = +20 cm.', textGujarati: 'લેન્સના સૂત્રથી v = +20 cm મેળવવું.' },
      { stepNumber: 3, marksAllocated: '1 Mark', text: 'Magnification formula m = v/u = -1 and image size h\' = -4 cm.', textGujarati: 'મોટવણી m = -1 અને પ્રતિબિંબ ઊંચાઈ -4 cm.' },
      { stepNumber: 4, marksAllocated: '1 Mark', text: 'Concluding nature: Real, Inverted, Same size.', textGujarati: 'પ્રતિબિંબનો પ્રકાર: વાસ્તવિક, ઊલટું અને સમાન કદ.' },
    ],
    examinerTips: 'Always remember: in lens formula, it is 1/v MINUS 1/u, unlike mirror formula which has a plus.',
    examinerTipsGujarati: 'ધ્યાન રાખો: લેન્સના સૂત્રમાં 1/v - 1/u આવે છે (અરીસામાં + આવે છે).',
  },

  // =========================================================================
  // CLASS 12 PHYSICS (1M, 2M, 3M, 4M) - BOARDS & GUJCET
  // =========================================================================
  {
    id: 'imp-g12-p-1m-1',
    grade: '12',
    board: 'All',
    subject: 'Physics',
    chapterNumber: 1,
    chapterTitle: 'Electric Charges and Fields',
    chapterTitleGujarati: 'વિધુતભારો અને ક્ષેત્રો (ગાઉસનો નિયમ)',
    marks: 1,
    marksCategory: '1-Mark Objective / VSA',
    questionText: 'State Gauss’s Law in electrostatics.',
    questionTextGujarati: 'સ્થિત વિદ્યુતશાસ્ત્ર માટે ગાઉસનો નિયમ લખો.',
    frequentlyAskedYears: ['GSEB 2024', 'CBSE 2023', 'GUJCET 2023'],
    modelAnswer: 'The total electric flux passing through any closed surface in vacuum is equal to 1/ε₀ times the total charge enclosed by that surface: Φ = ∮ E · dA = q_enclosed / ε₀.',
    modelAnswerGujarati: 'કોઈપણ બંધ પૃષ્ઠ સાથે સંકળાયેલું કુલ વિદ્યુત ફ્લક્સ તે પૃષ્ઠ વડે ઘેરાયેલા કુલ વિદ્યુતભારના 1/ε₀ ગણું હોય છે: Φ = q / ε₀.',
    stepWiseMarking: [
      { stepNumber: 1, marksAllocated: '1 Mark', text: 'Statement and equation Φ = q_enclosed / ε₀.', textGujarati: 'વિધાન અને ગાણિતિક સૂત્ર Φ = q / ε₀.' },
    ],
    examinerTips: 'Mention the term "closed surface" (Gaussian surface).',
    examinerTipsGujarati: '"બંધ પૃષ્ઠ" શબ્દ લખવો ફરજિયાત છે.',
  },
  {
    id: 'imp-g12-p-3m-1',
    grade: '12',
    board: 'All',
    subject: 'Physics',
    chapterNumber: 2,
    chapterTitle: 'Electrostatic Potential and Capacitance',
    chapterTitleGujarati: 'સ્થિત વિદ્યુત સ્થિતિમાન અને કેપેસિટન્સ',
    marks: 3,
    marksCategory: '3-Mark Medium Derivation',
    questionText: 'Derive the expression for capacitance of a parallel plate capacitor with dielectric medium K.',
    questionTextGujarati: 'ડાઇઇલેક્ટ્રિક અચળાંક K ધરાવતા સમાંતર પ્લેટ કેપેસિટરના કેપેસિટન્સનું સૂત્ર તારવો.',
    frequentlyAskedYears: ['GSEB March 2023', 'CBSE 2024', 'GSEB 2021'],
    modelAnswer: '1. Electric field in vacuum between plates: E₀ = σ / ε₀ = Q / (A ε₀).\n2. With dielectric K, electric field is reduced: E = E₀ / K = Q / (K A ε₀).\n3. Potential difference V = E × d = (Q d) / (K A ε₀).\n4. Capacitance C = Q / V = Q / [ (Q d) / (K A ε₀) ] = (K ε₀ A) / d = K × C₀.',
    modelAnswerGujarati: '૧. શૂન્યાવકાશમાં વિદ્યુતક્ષેત્ર: E₀ = σ / ε₀ = Q / (A ε₀).\n૨. ડાઇઇલેક્ટ્રિક K ની હાજરીમાં ઘટેલું ક્ષેત્ર: E = E₀ / K = Q / (K A ε₀).\n૩. વિદ્યુતસ્થિતિમાન તફાવત: V = E × d = (Q d) / (K A ε₀).\n૪. કેપેસિટન્સ C = Q / V = (K ε₀ A) / d = K × C₀.',
    stepWiseMarking: [
      { stepNumber: 1, marksAllocated: '1 Mark', text: 'Electric field reduction formula E = E0 / K.', textGujarati: 'ડાઇઇલેક્ટ્રિકમાં વિદ્યુતક્ષેત્ર E = E0/K.' },
      { stepNumber: 2, marksAllocated: '1 Mark', text: 'Potential difference V = E · d expression.', textGujarati: 'સ્થિતિમાન તફાવત V = E · d નું પદ.' },
      { stepNumber: 3, marksAllocated: '1 Mark', text: 'Final capacitance formula C = (K ε₀ A) / d.', textGujarati: 'અંતિમ કેપેસિટન્સ C = (K ε₀ A) / d.' },
    ],
    examinerTips: 'State clearly that capacitance increases by a factor of K.',
    examinerTipsGujarati: 'કેપેસિટન્સ K ગણું વધે છે તે સ્પષ્ટ દર્શાવો.',
  },

  // =========================================================================
  // CLASS 7, 8 & 9 FOUNDATION (1M, 2M, 3M)
  // =========================================================================
  {
    id: 'imp-g9-s-2m-1',
    grade: '9',
    board: 'All',
    subject: 'Science',
    chapterNumber: 9,
    chapterTitle: 'Force and Laws of Motion',
    chapterTitleGujarati: 'બળ અને ગતિના નિયમો',
    marks: 2,
    marksCategory: '2-Mark Short Answer / Reason',
    questionText: 'Why do passengers fall backward when a stationary bus accelerates forward suddenly?',
    questionTextGujarati: 'સ્થિર બસ એકાએક ઉપડે ત્યારે મુસાફરો પાછળની તરફ કેમ નમી પડે છે?',
    frequentlyAskedYears: ['CBSE 2023', 'GSEB 2024'],
    modelAnswer: 'This is due to the Inertia of Rest (Newton’s First Law). When the bus starts moving, the lower part of the passenger’s body in contact with the bus moves forward, but the upper body tends to remain at rest due to inertia, causing the passenger to jerk backwards.',
    modelAnswerGujarati: 'આ સ્થિરતાના જડત્વ (ન્યૂટનનો ગતિનો પ્રથમ નિયમ) ના કારણે થાય છે. જ્યારે બસ ઉપડે છે ત્યારે શરીરનો નીચેનો ભાગ બસ સાથે ગતિમાં આવે છે, પરંતુ શરીરનો ઉપરનો ભાગ જડત્વના નિયમ અનુસાર સ્થિર રહેવાનો પ્રયત્ન કરે છે, જેથી પાછળ ધકેલાય છે.',
    stepWiseMarking: [
      { stepNumber: 1, marksAllocated: '1 Mark', text: 'Naming Inertia of Rest / Newton 1st Law.', textGujarati: 'સ્થિરતાનું જડત્વ / ન્યૂટનનો ૧લો નિયમ દર્શાવવો.' },
      { stepNumber: 2, marksAllocated: '1 Mark', text: 'Explaining difference between lower and upper body motion.', textGujarati: 'શરીરના નીચેના અને ઉપરના ભાગની ગતિ સમજાવવી.' },
    ],
    examinerTips: 'Mention the term "Inertia of Rest".',
    examinerTipsGujarati: '"જડત્વનો નિયમ" શબ્દ અવશ્ય વાપરવો.',
  },
  {
    id: 'imp-g8-m-2m-1',
    grade: '8',
    board: 'All',
    subject: 'Mathematics',
    chapterNumber: 2,
    chapterTitle: 'Linear Equations in One Variable',
    chapterTitleGujarati: 'એકચલ સુરેખ સમીકરણ',
    marks: 2,
    marksCategory: '2-Mark Short Answer',
    questionText: 'Solve the equation: 5x + 9 = 5 + 3x.',
    questionTextGujarati: 'સમીકરણ ઉકેલો: 5x + 9 = 5 + 3x.',
    frequentlyAskedYears: ['NCERT Annual Exam', 'GSEB 2023'],
    modelAnswer: 'Transpose 3x to LHS and 9 to RHS:\n5x - 3x = 5 - 9\n2x = -4\nx = -4 / 2 = -2.',
    modelAnswerGujarati: 'ચલવાળા પદો ડાબી બાજુ અને અચળ પદો જમણી બાજુ પક્ષાંતર કરતાં:\n5x - 3x = 5 - 9\n2x = -4\nx = -4 / 2 = -2.',
    stepWiseMarking: [
      { stepNumber: 1, marksAllocated: '1 Mark', text: 'Transposing terms: 2x = -4.', textGujarati: 'પક્ષાંતર કરીને 2x = -4 મેળવવું.' },
      { stepNumber: 2, marksAllocated: '1 Mark', text: 'Final value x = -2.', textGujarati: 'અંતિમ જવાબ x = -2.' },
    ],
    examinerTips: 'Take care of the negative sign when computing 5 - 9 = -4.',
    examinerTipsGujarati: '૫ - ૯ = -૪ માં ઋણ ચિહ્ન ભૂલવું નહીં.',
  },
];

// Seed to MongoDB on server launch
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
    const query = {};
    if (grade) query.grade = grade;
    if (subject && subject !== 'All') query.subject = subject;
    if (marks) query.marks = parseInt(marks);

    let list = await ImportantQuestion.find(query).sort({ marks: 1, chapterNumber: 1 });

    if (!list || list.length === 0) {
      list = SEED_IMPORTANT_QUESTIONS.filter((q) => {
        if (grade && q.grade !== grade) return false;
        if (subject && subject !== 'All' && q.subject !== subject) return false;
        if (marks && q.marks !== parseInt(marks)) return false;
        return true;
      });
      if (list.length === 0 && grade) {
        list = SEED_IMPORTANT_QUESTIONS.filter((q) => q.grade === grade);
      }
      if (list.length === 0) list = SEED_IMPORTANT_QUESTIONS;
    }

    res.json(list);
  } catch (error) {
    console.warn('Error fetching important questions, using memory list:', error.message);
    res.json(SEED_IMPORTANT_QUESTIONS);
  }
});

module.exports = { router, autoSeedImportantQuestions, SEED_IMPORTANT_QUESTIONS };

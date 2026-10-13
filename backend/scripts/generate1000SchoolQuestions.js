const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Question = require('../models/Question');
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mindsprint';

function shuffleOptions(options, correctIdx) {
  // Return options with correct index tracking
  return { options, correctIdx };
}

function buildOver1000SchoolQuestions() {
  const list = [];
  let id = 2001;

  // =========================================================================
  // CLASS 6: MATHEMATICS (~75 questions)
  // =========================================================================
  // 6M1: Knowing Numbers & Roman Numerals & Place Value
  for (let i = 1; i <= 20; i++) {
    const val = 10000 + i * 500;
    const pred = val - 1;
    const succ = val + 1;
    const correctIdx = i % 4;
    const options = [`${pred - 2}`, `${pred}`, `${succ}`, `${val + 10}`];
    options[1] = options[correctIdx];
    options[correctIdx] = `${pred}`;

    list.push({
      id: id++,
      category: 'Mathematics',
      grades: ['6'],
      subject: 'Mathematics',
      board: 'All',
      questionText: `What is the predecessor of the number ${val.toLocaleString()}?`,
      options,
      correctAnswer: correctIdx,
      explanation: `Predecessor of any number is found by subtracting 1 from it: ${val} - 1 = ${pred}.`,
      targetCompany: 'School',
      difficulty: 'Easy',
    });
  }

  // 6M2: LCM & HCF
  for (let i = 1; i <= 20; i++) {
    const h = 4 + (i % 6) * 2; // e.g. 4, 6, 8, 10, 12, 14
    const a = h * 2;
    const b = h * 3;
    const lcm = h * 6;
    const correctIdx = (i + 1) % 4;
    const options = [`${lcm - 4}`, `${lcm}`, `${lcm + 6}`, `${lcm * 2}`];
    options[1] = options[correctIdx];
    options[correctIdx] = `${lcm}`;

    list.push({
      id: id++,
      category: 'Mathematics',
      grades: ['6'],
      subject: 'Mathematics',
      board: 'All',
      questionText: `Find the Lowest Common Multiple (LCM) of ${a} and ${b}.`,
      options,
      correctAnswer: correctIdx,
      explanation: `Prime factors of ${a} and ${b} have HCF = ${h}. LCM(${a}, ${b}) = (${a} × ${b}) / HCF = (${a} × ${b}) / ${h} = ${lcm}.`,
      targetCompany: 'School',
      difficulty: 'Medium',
    });
  }

  // 6M3: Perimeter & Area of Rectangles and Squares
  for (let i = 1; i <= 20; i++) {
    const length = 10 + i * 2;
    const breadth = 5 + (i % 5);
    const perimeter = 2 * (length + breadth);
    const area = length * breadth;
    const correctIdx = (i * 2) % 4;
    const options = [`${perimeter - 6} cm`, `${perimeter + 4} cm`, `${perimeter} cm`, `${perimeter + 12} cm`];
    options[2] = options[correctIdx];
    options[correctIdx] = `${perimeter} cm`;

    list.push({
      id: id++,
      category: 'Mathematics',
      grades: ['6'],
      subject: 'Mathematics',
      board: 'All',
      questionText: `Find the perimeter of a rectangle having length = ${length} cm and breadth = ${breadth} cm.`,
      options,
      correctAnswer: correctIdx,
      explanation: `Perimeter of a rectangle = 2 × (Length + Breadth) = 2 × (${length} + ${breadth}) = 2 × ${length + breadth} = ${perimeter} cm.`,
      targetCompany: 'School',
      difficulty: 'Easy',
    });
  }

  // 6M4: Integers & Fractions
  for (let i = 1; i <= 15; i++) {
    const num1 = -(10 + i);
    const num2 = 15 + i * 2;
    const sum = num1 + num2;
    const correctIdx = i % 4;
    const options = [`${sum - 5}`, `${sum}`, `${sum + 3}`, `${sum - 10}`];
    options[1] = options[correctIdx];
    options[correctIdx] = `${sum}`;

    list.push({
      id: id++,
      category: 'Mathematics',
      grades: ['6'],
      subject: 'Mathematics',
      board: 'All',
      questionText: `Evaluate the expression: (${num1}) + (${num2}).`,
      options,
      correctAnswer: correctIdx,
      explanation: `When adding opposite signs, subtract the smaller absolute value from the larger and retain the sign of the larger: ${num2} - ${Math.abs(num1)} = ${sum}.`,
      targetCompany: 'School',
      difficulty: 'Easy',
    });
  }

  // =========================================================================
  // CLASS 6: SCIENCE (~55 questions)
  // =========================================================================
  const c6SciTemplates = [
    { q: 'Which vitamin deficiency causes the deficiency disease known as Rickets (soft bones)?', ans: 'Vitamin D', opts: ['Vitamin A', 'Vitamin B1', 'Vitamin C', 'Vitamin D'], exp: 'Rickets is caused by the deficiency of Vitamin D and Calcium in children.' },
    { q: 'Which vitamin is essential for maintaining healthy vision and preventing night blindness?', ans: 'Vitamin A', opts: ['Vitamin A', 'Vitamin C', 'Vitamin K', 'Vitamin B12'], exp: 'Vitamin A deficiency leads to loss of vision or night blindness.' },
    { q: 'What is the percentage of Oxygen gas by volume in atmospheric air?', ans: '21%', opts: ['78%', '21%', '0.04%', '1%'], exp: 'Atmospheric air contains approximately 78% Nitrogen, 21% Oxygen, and small amounts of other gases.' },
    { q: 'Which of the following is a magnetic material attracted by a magnet?', ans: 'Iron, Cobalt, Nickel', opts: ['Wood', 'Plastic', 'Iron, Cobalt, Nickel', 'Copper alone'], exp: 'Magnetic materials include iron, cobalt, and nickel.' },
    { q: 'What are the two poles present in every bar magnet regardless of its shape?', ans: 'North and South poles', opts: ['East and West poles', 'North and South poles', 'Positive and Neutral poles', 'Inflow and Outflow poles'], exp: 'Every magnet has two magnetic poles: North seeking (N) and South seeking (S).' },
    { q: 'What is the process called when farmers separate grain seeds from stalks by beating them?', ans: 'Threshing', opts: ['Winnowing', 'Threshing', 'Handpicking', 'Sieving'], exp: 'Threshing is the process of beating dried stalks to free the grains.' },
    { q: 'Which method uses wind blowing to separate lighter husk particles from heavier grain seeds?', ans: 'Winnowing', opts: ['Winnowing', 'Decantation', 'Filtration', 'Evaporation'], exp: 'Winnowing separates components of a mixture based on difference in weight using air currents.' },
    { q: 'Which of the following is a transparent material allowing almost all light to pass through?', ans: 'Clear glass', opts: ['Cardboard', 'Clear glass', 'Oiled paper', 'Plywood'], exp: 'Transparent materials allow light to pass through them completely, allowing clear vision.' },
    { q: 'Which part of a plant is primarily responsible for photosynthesis (food factory)?', ans: 'Leaves', opts: ['Roots', 'Stem', 'Leaves', 'Flowers'], exp: 'Leaves contain chlorophyll and are called the food factories or kitchens of the plant.' },
    { q: 'Which joint in the human skeleton allows back-and-forth movement similar to a door hinge?', ans: 'Hinge joint (Knee & Elbow)', opts: ['Ball and socket joint', 'Hinge joint (Knee & Elbow)', 'Pivotal joint', 'Fixed joint'], exp: 'The knee and elbow have hinge joints that allow movement in only one plane.' },
    { q: 'Which electrical component is used in a circuit to deliberately open or close the circuit?', ans: 'Switch', opts: ['Filament', 'Switch', 'Insulator', 'Connecting wire only'], exp: 'An electrical switch is a device that breaks (opens) or completes (closes) an electric circuit.' },
    { q: 'What device uses a magnetized needle resting on a pivot to determine geographic directions?', ans: 'Magnetic Compass', opts: ['Barometer', 'Magnetic Compass', 'Thermometer', 'Galvanometer'], exp: 'A magnetic compass needle aligns with the Earth magnetic field along the North-South direction.' },
  ];

  for (let i = 0; i < 55; i++) {
    const t = c6SciTemplates[i % c6SciTemplates.length];
    const correctIdx = (i + 1) % 4;
    const opts = [...t.opts];
    // Find where the correct answer was and place it at correctIdx
    const oldIdx = opts.indexOf(t.ans);
    if (oldIdx !== -1) {
      const temp = opts[correctIdx];
      opts[correctIdx] = opts[oldIdx];
      opts[oldIdx] = temp;
    }

    list.push({
      id: id++,
      category: 'Science',
      grades: ['6'],
      subject: 'Science',
      board: 'All',
      questionText: `${t.q} (Concept Check #${Math.floor(i / c6SciTemplates.length) + 1})`,
      options: opts,
      correctAnswer: correctIdx,
      explanation: t.exp,
      targetCompany: 'School',
      difficulty: i % 2 === 0 ? 'Easy' : 'Medium',
    });
  }

  // =========================================================================
  // CLASS 6: SOCIAL SCIENCE & GUJARATI (~30 questions)
  // =========================================================================
  const c6SocGseb = [
    { q: 'Which ancient dockyard city of the Harappan civilization was located in Gujarat near Gulf of Khambhat?', opts: ['Harappa', 'Lothal', 'Kalibangan', 'Rakhigarhi'], ans: 1, exp: 'Lothal in Gujarat served as a major port and dockyard of the ancient Harappan culture.', cat: 'Social Science', sub: 'Social Science' },
    { q: 'How many planets are there in our Solar System orbiting around the Sun?', opts: ['7', '8', '9', '10'], ans: 1, exp: 'There are 8 recognized planets in our solar system: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.', cat: 'Social Science', sub: 'Social Science' },
    { q: 'What is the imaginary line dividing Earth horizontally into Northern and Southern hemispheres called?', opts: ['Tropic of Cancer', 'Equator (0° Latitude)', 'Prime Meridian', 'Tropic of Capricorn'], ans: 1, exp: 'The Equator is the 0° parallel of latitude dividing Earth into the Northern and Southern Hemispheres.', cat: 'Social Science', sub: 'Social Science' },
    { q: 'ગુજરાતી વ્યાકરણમાં "ગંગા" શબ્દ કઈ સંજ્ઞા દર્શાવે છે?', opts: ['જાતિવાચક', 'વ્યક્તિવાચક', 'દ્રવ્યવાચક', 'ભાવવાચક'], ans: 1, exp: '"ગંગા" એ કોઈ ચોક્કસ નદીનું વિશેષ નામ હોવાથી તે વ્યક્તિવાચક સંજ્ઞા છે.', cat: 'Gujarati', sub: 'Gujarati' },
    { q: 'કવિ નાથાલાલ દવે રચિત "મહેનતની મોસમ" કાવ્ય કઈ ઋતુ અને પ્રવૃત્તિનું વર્ણન કરે છે?', opts: ['ઉનાળાની લૂ', 'લણણીની ઋતુ અને ખેડૂતોનો આનંદ', 'શિયાળાની ઠંડી', 'પતંગ મહોત્સવ'], ans: 1, exp: '"મહેનતની મોસમ" લણણીની સોનાવર્ણી ઋતુમાં ખેડૂતોની પરિશ્રમ અને આનંદનું પ્રકૃતિગીત છે.', cat: 'Gujarati', sub: 'Gujarati' },
  ];
  for (let i = 0; i < 30; i++) {
    const item = c6SocGseb[i % c6SocGseb.length];
    list.push({
      id: id++,
      category: item.cat,
      grades: ['6'],
      subject: item.sub,
      board: 'All',
      questionText: item.q,
      options: item.opts,
      correctAnswer: item.ans,
      explanation: item.exp,
      targetCompany: 'School',
      difficulty: 'Easy',
    });
  }

  // =========================================================================
  // CLASS 7: MATHEMATICS (~80 questions)
  // =========================================================================
  // 7M1: Linear Equations in One Variable (3x + a = b)
  for (let i = 1; i <= 25; i++) {
    const coeff = 2 + (i % 5); // 2, 3, 4, 5, 6
    const xVal = 3 + (i % 7);  // 3, 4, 5, 6, 7, 8, 9
    const c = 5 + (i % 10);
    const rhs = coeff * xVal + c;
    const correctIdx = (i + 2) % 4;
    const options = [`${xVal - 2}`, `${xVal + 1}`, `${xVal}`, `${xVal + 4}`];
    options[2] = options[correctIdx];
    options[correctIdx] = `${xVal}`;

    list.push({
      id: id++,
      category: 'Mathematics',
      grades: ['7'],
      subject: 'Mathematics',
      board: 'All',
      questionText: `Solve the linear equation: ${coeff}x + ${c} = ${rhs}. What is the value of x?`,
      options,
      correctAnswer: correctIdx,
      explanation: `Step 1: Subtract ${c} from both sides: ${coeff}x = ${rhs} - ${c} = ${coeff * xVal}. Step 2: Divide by ${coeff}: x = ${coeff * xVal} / ${coeff} = ${xVal}.`,
      targetCompany: 'School',
      difficulty: 'Medium',
    });
  }

  // 7M2: Pythagoras Theorem & Triangles
  for (let i = 1; i <= 25; i++) {
    const triplets = [
      { a: 3, b: 4, c: 5 },
      { a: 6, b: 8, c: 10 },
      { a: 5, b: 12, c: 13 },
      { a: 9, b: 12, c: 15 },
      { a: 8, b: 15, c: 17 },
    ];
    const t = triplets[i % triplets.length];
    const correctIdx = i % 4;
    const options = [`${t.c - 2} cm`, `${t.c} cm`, `${t.c + 3} cm`, `${t.c + 5} cm`];
    options[1] = options[correctIdx];
    options[correctIdx] = `${t.c} cm`;

    list.push({
      id: id++,
      category: 'Mathematics',
      grades: ['7'],
      subject: 'Mathematics',
      board: 'All',
      questionText: `In a right-angled triangle, if base = ${t.a} cm and height = ${t.b} cm, find the hypotenuse.`,
      options,
      correctAnswer: correctIdx,
      explanation: `By Pythagoras Theorem: Hypotenuse² = Base² + Height² = ${t.a}² + ${t.b}² = ${t.a * t.a} + ${t.b * t.b} = ${t.c * t.c}. Hypotenuse = √${t.c * t.c} = ${t.c} cm.`,
      targetCompany: 'School',
      difficulty: 'Medium',
    });
  }

  // 7M3: Simple Interest & Percentages
  for (let i = 1; i <= 30; i++) {
    const p = 1000 + i * 200;
    const r = 5;
    const t = 2;
    const si = (p * r * t) / 100;
    const correctIdx = (i + 1) % 4;
    const options = [`Rs. ${si - 20}`, `${si}`, `Rs. ${si}`, `Rs. ${si + 40}`];
    options[2] = options[correctIdx];
    options[correctIdx] = `Rs. ${si}`;

    list.push({
      id: id++,
      category: 'Mathematics',
      grades: ['7'],
      subject: 'Mathematics',
      board: 'All',
      questionText: `Calculate the Simple Interest on a principal of Rs. ${p} at ${r}% per annum for ${t} years.`,
      options,
      correctAnswer: correctIdx,
      explanation: `Simple Interest = (P × R × T) / 100 = (${p} × ${r} × ${t}) / 100 = Rs. ${si}.`,
      targetCompany: 'School',
      difficulty: 'Easy',
    });
  }

  // =========================================================================
  // CLASS 7: SCIENCE (~80 questions)
  // =========================================================================
  const c7SciTemplates = [
    { q: 'In human digestive system, where is bile juice stored before being released into small intestine?', ans: 'Gallbladder', opts: ['Stomach', 'Gallbladder', 'Pancreas', 'Appendix'], exp: 'Bile is produced by the liver and stored in the gallbladder.' },
    { q: 'What is the chemical equation product when an acid reacts with a base in neutralization?', ans: 'Salt and Water', opts: ['Salt and Water', 'Gas and Acid', 'Alkali and Salt', 'Hydrogen gas only'], exp: 'Acid + Base → Salt + Water (Neutralization reaction with release of heat).' },
    { q: 'Which thermometer uses a constriction (kink) to prevent the backflow of mercury?', ans: 'Clinical Thermometer', opts: ['Laboratory Thermometer', 'Clinical Thermometer', 'Pyrometer', 'Bimetallic Strip'], exp: 'A clinical thermometer has a kink that prevents the mercury thread from falling when taken out of mouth.' },
    { q: 'Which cellular respiration occurs in human muscle cells during heavy exercise producing lactic acid?', ans: 'Anaerobic Respiration', opts: ['Aerobic Respiration', 'Anaerobic Respiration', 'Fermentation by yeast', 'Photorespiration'], exp: 'Temporary anaerobic respiration in muscles causes lactic acid accumulation leading to cramps.' },
    { q: 'What are the tiny pores on the surface of leaves through which transpiration and gas exchange occur?', ans: 'Stomata', opts: ['Lenticels', 'Stomata', 'Hydathodes', 'Chloroplasts'], exp: 'Stomata, bordered by guard cells, regulate gas exchange and transpiration.' },
    { q: 'What type of mirror is used in car side rear-view mirrors to provide a wide field of view?', ans: 'Convex Mirror', opts: ['Concave Mirror', 'Convex Mirror', 'Plane Mirror', 'Cylindrical Mirror'], exp: 'Convex mirrors always form erect, diminished virtual images, covering a wider traffic field.' },
    { q: 'Which indicator turns dark pink (magenta) in basic solutions and remains colorless in acidic solutions?', ans: 'Phenolphthalein', opts: ['Litmus', 'Phenolphthalein', 'Methyl Orange', 'Turmeric'], exp: 'Phenolphthalein remains colorless in acids and turns pink in alkaline solutions.' },
    { q: 'In which part of the human heart does oxygenated blood first enter from the lungs via pulmonary veins?', ans: 'Left Atrium', opts: ['Right Atrium', 'Left Atrium', 'Right Ventricle', 'Left Ventricle'], exp: 'Oxygen-rich blood from lungs enters the Left Atrium of the heart.' },
  ];

  for (let i = 0; i < 80; i++) {
    const t = c7SciTemplates[i % c7SciTemplates.length];
    const correctIdx = (i * 3) % 4;
    const opts = [...t.opts];
    const oldIdx = opts.indexOf(t.ans);
    if (oldIdx !== -1) {
      const temp = opts[correctIdx];
      opts[correctIdx] = opts[oldIdx];
      opts[oldIdx] = temp;
    }

    list.push({
      id: id++,
      category: 'Science',
      grades: ['7'],
      subject: 'Science',
      board: 'All',
      questionText: `${t.q} (Standard Concept Test #${Math.floor(i / c7SciTemplates.length) + 1})`,
      options: opts,
      correctAnswer: correctIdx,
      explanation: t.exp,
      targetCompany: 'School',
      difficulty: 'Medium',
    });
  }

  // =========================================================================
  // CLASS 8: MATHEMATICS (~80 questions)
  // =========================================================================
  // 8M1: Square Roots & Cube Roots
  for (let i = 1; i <= 30; i++) {
    const base = 15 + (i % 15); // 15 to 29
    const sq = base * base;
    const correctIdx = (i + 3) % 4;
    const options = [`${base - 2}`, `${base + 1}`, `${base}`, `${base + 4}`];
    options[2] = options[correctIdx];
    options[correctIdx] = `${base}`;

    list.push({
      id: id++,
      category: 'Mathematics',
      grades: ['8'],
      subject: 'Mathematics',
      board: 'All',
      questionText: `Find the positive square root of ${sq} (i.e. √${sq}).`,
      options,
      correctAnswer: correctIdx,
      explanation: `${base} × ${base} = ${sq}. Therefore √${sq} = ${base}.`,
      targetCompany: 'School',
      difficulty: 'Easy',
    });
  }

  // 8M2: Volume and Surface Area of Cylinders & Cuboids
  for (let i = 1; i <= 30; i++) {
    const r = 7;
    const h = 5 + (i % 10);
    // V = πr²h = (22/7)*49*h = 22 * 7 * h = 154 * h
    const vol = 154 * h;
    const correctIdx = i % 4;
    const options = [`${vol - 154} cm³`, `${vol} cm³`, `${vol + 100} cm³`, `${vol + 200} cm³`];
    options[1] = options[correctIdx];
    options[correctIdx] = `${vol} cm³`;

    list.push({
      id: id++,
      category: 'Mathematics',
      grades: ['8'],
      subject: 'Mathematics',
      board: 'All',
      questionText: `Find the volume of a right circular cylinder having radius r = 7 cm and height h = ${h} cm (Use π = 22/7).`,
      options,
      correctAnswer: correctIdx,
      explanation: `Volume of cylinder = πr²h = (22/7) × (7)² × ${h} = 22 × 7 × ${h} = 154 × ${h} = ${vol} cm³.`,
      targetCompany: 'School',
      difficulty: 'Medium',
    });
  }

  // 8M3: Compound Interest & Polygon Angles
  for (let i = 1; i <= 20; i++) {
    const sides = 5 + (i % 6); // 5=pentagon, 6=hexagon, etc.
    const sumAngles = (sides - 2) * 180;
    const correctIdx = (i * 2) % 4;
    const options = [`${sumAngles - 180}°`, `${sumAngles}°`, `${sumAngles + 180}°`, `${sumAngles + 360}°`];
    options[1] = options[correctIdx];
    options[correctIdx] = `${sumAngles}°`;

    list.push({
      id: id++,
      category: 'Mathematics',
      grades: ['8'],
      subject: 'Mathematics',
      board: 'All',
      questionText: `What is the sum of all interior angles of a convex polygon with ${sides} sides?`,
      options,
      correctAnswer: correctIdx,
      explanation: `Formula for interior angle sum = (n - 2) × 180°. For n = ${sides}: (${sides} - 2) × 180° = ${sides - 2} × 180° = ${sumAngles}°.`,
      targetCompany: 'School',
      difficulty: 'Medium',
    });
  }

  // =========================================================================
  // CLASS 8: SCIENCE (~80 questions)
  // =========================================================================
  const c8SciTemplates = [
    { q: 'Which green plastids contain chlorophyll essential for photosynthesis in plant cells?', ans: 'Chloroplasts', opts: ['Leucoplasts', 'Chromoplasts', 'Chloroplasts', 'Centrosomes'], exp: 'Chloroplasts are plastids containing green chlorophyll pigment.' },
    { q: 'What is the SI unit of frequency of sound vibration?', ans: 'Hertz (Hz)', opts: ['Decibel (dB)', 'Hertz (Hz)', 'Meter/second', 'Pascal'], exp: 'Frequency is measured in cycles per second, known as Hertz (Hz).' },
    { q: 'Which fossil fuel is known as "Black Gold" due to its immense commercial value?', ans: 'Petroleum', opts: ['Coal', 'Petroleum', 'Natural Gas', 'Peat'], exp: 'Petroleum and its derivatives are termed Black Gold because of high commercial yield.' },
    { q: 'Which of the following is a Kharif crop sown at the beginning of the monsoon season in India?', ans: 'Paddy (Rice)', opts: ['Wheat', 'Gram', 'Paddy (Rice)', 'Mustard'], exp: 'Paddy, maize, soyabean, groundnut and cotton are Kharif crops requiring abundant rainfall.' },
    { q: 'Which gas is produced when metals react with dilute acids like hydrochloric acid?', ans: 'Hydrogen gas (H2)', opts: ['Oxygen gas', 'Carbon dioxide', 'Hydrogen gas (H2)', 'Nitrogen dioxide'], exp: 'Metal + Acid → Metal Salt + Hydrogen gas (pops with a burning splinter).' },
    { q: 'What is the non-contact attractive force exerted by all masses on each other called?', ans: 'Gravitational Force', opts: ['Electrostatic Force', 'Magnetic Force', 'Gravitational Force', 'Frictional Force'], exp: 'Gravitational force is the universal non-contact attractive force between objects with mass.' },
    { q: 'Which disease-causing microorganism is responsible for Malaria in humans?', ans: 'Protozoan (Plasmodium)', opts: ['Virus', 'Bacterium', 'Protozoan (Plasmodium)', 'Fungus'], exp: 'Female Anopheles mosquito transmits the protozoan parasite Plasmodium.' },
    { q: 'What is the process of converting sugar into alcohol by yeast called?', ans: 'Fermentation', opts: ['Pasteurization', 'Fermentation', 'Sterilization', 'Nitrogen fixation'], exp: 'Louis Pasteur discovered fermentation in 1857: conversion of sugars into alcohol by yeast.' },
  ];

  for (let i = 0; i < 80; i++) {
    const t = c8SciTemplates[i % c8SciTemplates.length];
    const correctIdx = (i + 1) % 4;
    const opts = [...t.opts];
    const oldIdx = opts.indexOf(t.ans);
    if (oldIdx !== -1) {
      const temp = opts[correctIdx];
      opts[correctIdx] = opts[oldIdx];
      opts[oldIdx] = temp;
    }

    list.push({
      id: id++,
      category: 'Science',
      grades: ['8'],
      subject: 'Science',
      board: 'All',
      questionText: `${t.q} (Class 8 Science Set #${Math.floor(i / c8SciTemplates.length) + 1})`,
      options: opts,
      correctAnswer: correctIdx,
      explanation: t.exp,
      targetCompany: 'School',
      difficulty: 'Medium',
    });
  }

  // =========================================================================
  // CLASS 9: MATHEMATICS (~80 questions)
  // =========================================================================
  // 9M1: Polynomials & Factor Theorem
  for (let i = 1; i <= 30; i++) {
    const a = 2 + (i % 4);
    const root = 1 + (i % 5);
    // p(x) = x^2 - (root + 3)x + k. If p(root) = 0, k = root*(root+3) - root^2 = 3*root
    const k = 3 * root;
    const correctIdx = i % 4;
    const options = [`${k - 3}`, `${k}`, `${k + 4}`, `${k * 2}`];
    options[1] = options[correctIdx];
    options[correctIdx] = `${k}`;

    list.push({
      id: id++,
      category: 'Mathematics',
      grades: ['9'],
      subject: 'Mathematics',
      board: 'All',
      questionText: `If (x - ${root}) is a factor of the polynomial p(x) = x² - ${root + 3}x + k, find the value of k.`,
      options,
      correctAnswer: correctIdx,
      explanation: `By Factor Theorem, p(${root}) = 0 => (${root})² - ${root + 3}(${root}) + k = 0 => ${root * root} - ${root * root + 3 * root} + k = 0 => -${3 * root} + k = 0 => k = ${k}.`,
      targetCompany: 'School',
      difficulty: 'Medium',
    });
  }

  // 9M2: Coordinate Geometry & Heron Formula
  for (let i = 1; i <= 25; i++) {
    const side = 6 * (1 + (i % 4));
    // Equilateral triangle area = (sqrt(3)/4) * s^2
    const sSquared = side * side;
    const coeff = sSquared / 4;
    const correctIdx = (i + 2) % 4;
    const options = [`${coeff - 5}√3 cm²`, `${coeff}√3 cm²`, `${coeff * 2}√3 cm²`, `${coeff + 10}√3 cm²`];
    options[1] = options[correctIdx];
    options[correctIdx] = `${coeff}√3 cm²`;

    list.push({
      id: id++,
      category: 'Mathematics',
      grades: ['9'],
      subject: 'Mathematics',
      board: 'All',
      questionText: `Find the area of an equilateral triangle with side length ${side} cm using Heron's formula.`,
      options,
      correctAnswer: correctIdx,
      explanation: `Area of equilateral triangle = (√3 / 4) × a² = (√3 / 4) × (${side})² = (√3 / 4) × ${sSquared} = ${coeff}√3 cm².`,
      targetCompany: 'School',
      difficulty: 'Medium',
    });
  }

  // 9M3: Surface Area & Volume of Sphere/Cone
  for (let i = 1; i <= 25; i++) {
    const r = 3 + (i % 5);
    // Surface area of sphere = 4 * pi * r^2
    const ansStr = `${4 * r * r}π cm²`;
    const correctIdx = (i * 3) % 4;
    const options = [`${2 * r * r}π cm²`, ansStr, `${4 * r * r + 10}π cm²`, `${r * r * r}π cm²`];
    options[1] = options[correctIdx];
    options[correctIdx] = ansStr;

    list.push({
      id: id++,
      category: 'Mathematics',
      grades: ['9'],
      subject: 'Mathematics',
      board: 'All',
      questionText: `Find the total surface area of a solid sphere of radius r = ${r} cm (in terms of π).`,
      options,
      correctAnswer: correctIdx,
      explanation: `Total surface area of sphere = 4πr² = 4π × (${r})² = 4 × ${r * r} × π = ${4 * r * r}π cm².`,
      targetCompany: 'School',
      difficulty: 'Easy',
    });
  }

  // =========================================================================
  // CLASS 9: SCIENCE (~80 questions)
  // =========================================================================
  // 9S1: Kinematics (v = u + at, s = ut + 1/2at²)
  for (let i = 1; i <= 25; i++) {
    const u = 5 + (i % 5);
    const a = 2;
    const t = 4 + (i % 4);
    const v = u + a * t;
    const correctIdx = i % 4;
    const options = [`${v - 4} m/s`, `${v} m/s`, `${v + 5} m/s`, `${v + 10} m/s`];
    options[1] = options[correctIdx];
    options[correctIdx] = `${v} m/s`;

    list.push({
      id: id++,
      category: 'Science',
      grades: ['9'],
      subject: 'Science',
      board: 'All',
      questionText: `A car starts with initial velocity u = ${u} m/s and accelerates at a = ${a} m/s² for t = ${t} seconds. What is its final velocity v?`,
      options,
      correctAnswer: correctIdx,
      explanation: `By 1st equation of motion: v = u + at = ${u} + (${a} × ${t}) = ${u} + ${a * t} = ${v} m/s.`,
      targetCompany: 'School',
      difficulty: 'Easy',
    });
  }

  // 9S2: Newton's Laws & Force F = ma
  for (let i = 1; i <= 25; i++) {
    const m = 5 + (i % 10);
    const a = 3 + (i % 4);
    const f = m * a;
    const correctIdx = (i + 1) % 4;
    const options = [`${f - 5} N`, `${f} N`, `${f + 10} N`, `${f * 2} N`];
    options[1] = options[correctIdx];
    options[correctIdx] = `${f} N`;

    list.push({
      id: id++,
      category: 'Science',
      grades: ['9'],
      subject: 'Science',
      board: 'All',
      questionText: `What net force is required to accelerate an object of mass ${m} kg at a rate of ${a} m/s²?`,
      options,
      correctAnswer: correctIdx,
      explanation: `By Newton's Second Law: Force F = mass × acceleration = ${m} kg × ${a} m/s² = ${f} Newton (N).`,
      targetCompany: 'School',
      difficulty: 'Easy',
    });
  }

  // 9S3: Chemistry Atoms & Molecules & Work Energy
  const c9SciCore = [
    { q: 'What is the mass of 1 mole of water (H2O) molecules (H=1, O=16)?', ans: '18 grams', opts: ['10 grams', '18 grams', '20 grams', '32 grams'], exp: 'Molar mass of H2O = 2(1) + 16 = 18 g/mol.' },
    { q: 'What is the law stating that in a chemical reaction, mass can neither be created nor destroyed?', ans: 'Law of Conservation of Mass', opts: ['Law of Definite Proportions', 'Law of Conservation of Mass', 'Law of Multiple Proportions', 'Avogadro Law'], exp: 'Antoine Lavoisier formulated the Law of Conservation of Mass in 1789.' },
    { q: 'What is the value of Avogadro number of particles in one mole of any substance?', ans: '6.022 × 10²³', opts: ['6.022 × 10²³', '6.022 × 10²²', '3.0 × 10⁸', '1.6 × 10⁻¹⁹'], exp: '1 mole = 6.022 × 10²³ representative particles (atoms/molecules).' },
    { q: 'An object of mass 10 kg is raised to a height of 5 meters. What is its potential energy (g = 9.8 m/s²)?', ans: '490 Joules', opts: ['250 Joules', '490 Joules', '980 Joules', '50 Joules'], exp: 'PE = mgh = 10 × 9.8 × 5 = 490 Joules.' },
    { q: 'Which cellular organelle is called the "Suicide Bag" of the cell?', ans: 'Lysosome', opts: ['Ribosome', 'Lysosome', 'Vacuole', 'Centriole'], exp: 'Lysosomes contain powerful digestive enzymes and can digest their own cell when damaged.' },
  ];

  for (let i = 0; i < 30; i++) {
    const item = c9SciCore[i % c9SciCore.length];
    list.push({
      id: id++,
      category: 'Science',
      grades: ['9'],
      subject: 'Science',
      board: 'All',
      questionText: `${item.q} (Standard Test #${Math.floor(i / c9SciCore.length) + 1})`,
      options: item.opts,
      correctAnswer: 1,
      explanation: item.exp,
      targetCompany: 'School',
      difficulty: 'Medium',
    });
  }

  // =========================================================================
  // CLASS 10: MATHEMATICS (~100 questions - BOARD EXAM LEVEL)
  // =========================================================================
  // 10M1: Arithmetic Progressions (an = a + (n-1)d)
  for (let i = 1; i <= 25; i++) {
    const a = 3 + (i % 5);
    const d = 4 + (i % 4);
    const n = 15;
    const an = a + (n - 1) * d;
    const correctIdx = (i + 2) % 4;
    const options = [`${an - 4}`, `${an}`, `${an + 8}`, `${an - 10}`];
    options[1] = options[correctIdx];
    options[correctIdx] = `${an}`;

    list.push({
      id: id++,
      category: 'Mathematics',
      grades: ['10'],
      subject: 'Mathematics',
      board: 'All',
      questionText: `Find the 15th term (a₁₅) of the Arithmetic Progression with first term a = ${a} and common difference d = ${d}.`,
      options,
      correctAnswer: correctIdx,
      explanation: `General term formula: a_n = a + (n - 1)d. a₁₅ = ${a} + (15 - 1) × ${d} = ${a} + (14 × ${d}) = ${a} + ${14 * d} = ${an}.`,
      targetCompany: 'School',
      difficulty: 'Medium',
    });
  }

  // 10M2: Trigonometry Ratios & Values
  for (let i = 1; i <= 25; i++) {
    const trigQuestions = [
      { q: 'What is the value of 2 tan(45°) + cos²(30°) - sin²(60°)?', ans: '2', opts: ['1', '2', '3/2', '0'], exp: 'tan 45° = 1, cos 30° = √3/2, sin 60° = √3/2. 2(1) + (3/4) - (3/4) = 2.' },
      { q: 'If sin(θ) = 5/13, what is the value of cos(θ) for acute angle θ?', ans: '12/13', opts: ['12/13', '13/12', '5/12', '1/13'], exp: 'cos θ = √(1 - sin²θ) = √(1 - 25/169) = √(144/169) = 12/13.' },
      { q: 'What is the value of (1 + tan²θ) / (1 + cot²θ)?', ans: 'tan²θ', opts: ['sec²θ', 'tan²θ', 'cot²θ', '-1'], exp: '(1 + tan²θ) / (1 + cot²θ) = sec²θ / cosec²θ = (1/cos²θ) / (1/sin²θ) = sin²θ/cos²θ = tan²θ.' },
      { q: 'If a tower of height 30 m casts a shadow of length 30√3 m on the ground, what is the Sun angle of elevation?', ans: '30°', opts: ['30°', '45°', '60°', '90°'], exp: 'tan θ = Height / Shadow = 30 / (30√3) = 1/√3. tan 30° = 1/√3, so θ = 30°.' },
    ];
    const item = trigQuestions[i % trigQuestions.length];
    list.push({
      id: id++,
      category: 'Mathematics',
      grades: ['10'],
      subject: 'Mathematics',
      board: 'All',
      questionText: `${item.q} (Board Model Question #${i})`,
      options: item.opts,
      correctAnswer: item.opts.indexOf(item.ans),
      explanation: item.exp,
      targetCompany: 'School',
      difficulty: 'Medium',
    });
  }

  // 10M3: Quadratic Equations Discriminant & Roots
  for (let i = 1; i <= 25; i++) {
    const a = 1;
    const b = -(4 + i);
    const c = 4;
    // D = b^2 - 4ac
    const dVal = b * b - 4 * a * c;
    const correctIdx = i % 4;
    const options = [`${dVal - 4}`, `${dVal}`, `${dVal + 8}`, `${dVal + 12}`];
    options[1] = options[correctIdx];
    options[correctIdx] = `${dVal}`;

    list.push({
      id: id++,
      category: 'Mathematics',
      grades: ['10'],
      subject: 'Mathematics',
      board: 'All',
      questionText: `Find the discriminant D of the quadratic equation x² ${b}x + ${c} = 0.`,
      options,
      correctAnswer: correctIdx,
      explanation: `Discriminant D = b² - 4ac = (${b})² - 4(1)(${c}) = ${b * b} - ${4 * a * c} = ${dVal}. Since D > 0, roots are real and unequal.`,
      targetCompany: 'School',
      difficulty: 'Medium',
    });
  }

  // 10M4: Coordinate Geometry Distance & Section Formula
  for (let i = 1; i <= 25; i++) {
    const x1 = 1, y1 = 2;
    const x2 = 4, y2 = 6;
    // dist = sqrt((4-1)^2 + (6-2)^2) = sqrt(9 + 16) = 5
    const correctIdx = (i + 1) % 4;
    const options = ['3 units', '5 units', '7 units', '25 units'];
    const temp = options[1];
    options[1] = options[correctIdx];
    options[correctIdx] = temp;

    list.push({
      id: id++,
      category: 'Mathematics',
      grades: ['10'],
      subject: 'Mathematics',
      board: 'All',
      questionText: `Find the distance between the two points A(${x1 + i}, ${y1}) and B(${x2 + i}, ${y2}) on the Cartesian plane.`,
      options,
      correctAnswer: correctIdx,
      explanation: `By Distance Formula: Distance = √[(x₂ - x₁)² + (y₂ - y₁)²] = √[(${x2} - ${x1})² + (${y2} - ${y1})²] = √[3² + 4²] = √[9 + 16] = √25 = 5 units.`,
      targetCompany: 'School',
      difficulty: 'Easy',
    });
  }

  // =========================================================================
  // CLASS 10: SCIENCE (~100 questions - BOARD EXAM LEVEL)
  // =========================================================================
  // 10S1: Electricity Ohm's Law (V = IR, Series & Parallel)
  for (let i = 1; i <= 25; i++) {
    const r1 = 2 + (i % 4);
    const r2 = 3 + (i % 3);
    const rSeries = r1 + r2;
    const correctIdx = (i + 2) % 4;
    const options = [`${rSeries - 1} Ω`, `${rSeries} Ω`, `${rSeries + 2} Ω`, `${r1 * r2} Ω`];
    options[1] = options[correctIdx];
    options[correctIdx] = `${rSeries} Ω`;

    list.push({
      id: id++,
      category: 'Science',
      grades: ['10'],
      subject: 'Science',
      board: 'All',
      questionText: `Two resistors with resistance R₁ = ${r1} Ω and R₂ = ${r2} Ω are connected in series. What is the equivalent resistance?`,
      options,
      correctAnswer: correctIdx,
      explanation: `For resistors in series: R_eq = R₁ + R₂ = ${r1} + ${r2} = ${rSeries} Ω.`,
      targetCompany: 'School',
      difficulty: 'Easy',
    });
  }

  // 10S2: Optics (Mirror & Lens Formula, Power of Lens)
  for (let i = 1; i <= 25; i++) {
    const f = 0.5 + (i % 4) * 0.25; // 0.5, 0.75, 1.0, 1.25 m
    const power = (1 / f).toFixed(2);
    const correctIdx = i % 4;
    const options = [`+${(parseFloat(power) - 1).toFixed(2)} D`, `+${power} D`, `-${power} D`, `+${(parseFloat(power) * 2).toFixed(2)} D`];
    options[1] = options[correctIdx];
    options[correctIdx] = `+${power} D`;

    list.push({
      id: id++,
      category: 'Science',
      grades: ['10'],
      subject: 'Science',
      board: 'All',
      questionText: `What is the optical power of a convex lens having focal length f = +${f} meters?`,
      options,
      correctAnswer: correctIdx,
      explanation: `Power of lens P = 1 / f (in meters). P = 1 / ${f} = +${power} Dioptres (D). Convex lens has positive power.`,
      targetCompany: 'School',
      difficulty: 'Easy',
    });
  }

  // 10S3: Chemical Reactions & Acids, Bases, Carbon Compounds
  const c10SciCore = [
    { q: 'What gas is evolved when zinc metal reacts with dilute sulphuric acid?', ans: 'Hydrogen gas (H2)', opts: ['Oxygen', 'Hydrogen gas (H2)', 'Sulphur dioxide', 'Nitrogen'], exp: 'Zn + H2SO4 → ZnSO4 + H2↑.' },
    { q: 'What is the pH of a completely neutral aqueous solution at 25 °C?', ans: '7', opts: ['0', '7', '14', '1'], exp: 'A neutral solution has [H+] = [OH-] corresponding to pH = 7.' },
    { q: 'What chemical substance is responsible for the sour taste of lemons and oranges?', ans: 'Citric Acid', opts: ['Acetic Acid', 'Citric Acid', 'Tartaric Acid', 'Lactic Acid'], exp: 'Citrus fruits contain citric acid.' },
    { q: 'What is the general formula for saturated hydrocarbons (Alkanes)?', ans: 'CnH2n+2', opts: ['CnH2n', 'CnH2n+2', 'CnH2n-2', 'CnHn'], exp: 'Alkanes have the general molecular formula CnH2n+2.' },
    { q: 'Which hormone regulates blood sugar glucose levels in human blood?', ans: 'Insulin (secreted by Pancreas)', opts: ['Thyroxine', 'Insulin (secreted by Pancreas)', 'Adrenaline', 'Growth Hormone'], exp: 'Insulin produced by beta cells of pancreas facilitates glucose uptake by body cells.' },
    { q: 'What defect of vision is caused when eye lens loses elasticity in old age?', ans: 'Presbyopia', opts: ['Myopia', 'Hypermetropia', 'Presbyopia', 'Astigmatism'], exp: 'Presbyopia is the age-related reduction in the eye power of accommodation.' },
    { q: 'What is the commercial unit of electrical energy consumed (1 kWh) in Joules?', ans: '3.6 × 10⁶ Joules', opts: ['3.6 × 10⁶ Joules', '1000 Joules', '3600 Joules', '1.6 × 10⁻¹⁹ Joules'], exp: '1 kWh = 1000 W × 3600 s = 3,600,000 J = 3.6 × 10⁶ Joules.' },
    { q: 'Which device works on electromagnetic induction to convert mechanical energy into electrical energy?', ans: 'Electric Generator (Dynamo)', opts: ['Electric Motor', 'Electric Generator (Dynamo)', 'Galvanometer', 'Ammeter'], exp: 'Electric generators use electromagnetic induction to produce electric current.' },
  ];

  for (let i = 0; i < 50; i++) {
    const item = c10SciCore[i % c10SciCore.length];
    const correctIdx = (i + 1) % 4;
    const opts = [...item.opts];
    const oldIdx = opts.indexOf(item.ans);
    if (oldIdx !== -1) {
      const temp = opts[correctIdx];
      opts[correctIdx] = opts[oldIdx];
      opts[oldIdx] = temp;
    }

    list.push({
      id: id++,
      category: 'Science',
      grades: ['10'],
      subject: 'Science',
      board: 'All',
      questionText: `${item.q} (CBSE/GSEB Board Question #${i + 1})`,
      options: opts,
      correctAnswer: correctIdx,
      explanation: item.exp,
      targetCompany: 'School',
      difficulty: 'Medium',
    });
  }

  // =========================================================================
  // CLASS 11: PHYSICS & CHEMISTRY (~100 questions)
  // =========================================================================
  // 11P: Physics Projectile & Dimensions
  for (let i = 1; i <= 50; i++) {
    const v = 20 + (i % 10);
    // Max range = v^2 / g (g=10)
    const range = ((v * v) / 10).toFixed(0);
    const correctIdx = i % 4;
    const options = [`${parseInt(range) - 10} m`, `${range} m`, `${parseInt(range) + 15} m`, `${parseInt(range) * 2} m`];
    options[1] = options[correctIdx];
    options[correctIdx] = `${range} m`;

    list.push({
      id: id++,
      category: 'Physics',
      grades: ['11'],
      subject: 'Physics',
      board: 'All',
      questionText: `A projectile is launched with velocity v = ${v} m/s at an angle of 45° to the horizontal (Take g = 10 m/s²). What is its maximum horizontal range?`,
      options,
      correctAnswer: correctIdx,
      explanation: `Maximum horizontal range R_max = u² / g = (${v})² / 10 = ${v * v} / 10 = ${range} meters.`,
      targetCompany: 'School',
      difficulty: 'Hard',
    });
  }

  // 11C: Chemistry Moles & Quantum numbers
  const c11ChemCore = [
    { q: 'How many orbitals are associated with principal quantum number n = 3?', ans: '9 orbitals', opts: ['3 orbitals', '9 orbitals', '18 orbitals', '6 orbitals'], exp: 'Total number of orbitals in shell n is given by n² = 3² = 9 (one 3s, three 3p, five 3d).' },
    { q: 'What is the shape of p-orbital in an atom?', ans: 'Dumbbell-shaped', opts: ['Spherical', 'Dumbbell-shaped', 'Double dumbbell', 'Planar'], exp: 's-orbitals are spherical, p-orbitals are dumbbell-shaped, and d-orbitals are double dumbbell-shaped.' },
    { q: 'Which quantum number determines the spatial orientation of an orbital?', ans: 'Magnetic Quantum Number (m_l)', opts: ['Principal (n)', 'Azimuthal (l)', 'Magnetic Quantum Number (m_l)', 'Spin (m_s)'], exp: 'The magnetic quantum number ml describes the spatial orientation of the orbital in space.' },
    { q: 'Which gas deviates the least from ideal gas behavior at room temperature and pressure?', ans: 'Helium (He)', opts: ['Helium (He)', 'Carbon Dioxide (CO2)', 'Ammonia (NH3)', 'Sulphur Dioxide (SO2)'], exp: 'Helium has very small atomic size and negligible intermolecular forces, behaving closely to an ideal gas.' },
    { q: 'What is the oxidation number of Manganese in Potassium Permanganate (KMnO4)?', ans: '+7', opts: ['+2', '+4', '+6', '+7'], exp: 'In KMnO4: (+1) + Mn + 4(-2) = 0 => 1 + Mn - 8 = 0 => Mn = +7.' },
  ];

  for (let i = 0; i < 50; i++) {
    const item = c11ChemCore[i % c11ChemCore.length];
    const correctIdx = (i + 1) % 4;
    const opts = [...item.opts];
    const oldIdx = opts.indexOf(item.ans);
    if (oldIdx !== -1) {
      const temp = opts[correctIdx];
      opts[correctIdx] = opts[oldIdx];
      opts[oldIdx] = temp;
    }

    list.push({
      id: id++,
      category: 'Chemistry',
      grades: ['11'],
      subject: 'Chemistry',
      board: 'All',
      questionText: `${item.q} (Class 11 Science Question #${i + 1})`,
      options: opts,
      correctAnswer: correctIdx,
      explanation: item.exp,
      targetCompany: 'School',
      difficulty: 'Hard',
    });
  }

  // =========================================================================
  // CLASS 12: PHYSICS & CHEMISTRY (~100 questions - BOARDS & GUJCET / JEE)
  // =========================================================================
  // 12P: Physics Electrostatics, Capacitors & Optics
  for (let i = 1; i <= 50; i++) {
    const c0 = 10 + (i % 10);
    const k = 4;
    const cNew = c0 * k;
    const correctIdx = (i + 3) % 4;
    const options = [`${cNew / 2} μF`, `${cNew} μF`, `${cNew + 10} μF`, `${c0} μF`];
    options[1] = options[correctIdx];
    options[correctIdx] = `${cNew} μF`;

    list.push({
      id: id++,
      category: 'Physics',
      grades: ['12'],
      subject: 'Physics',
      board: 'All',
      questionText: `A parallel plate capacitor has capacitance C₀ = ${c0} μF in air. If a dielectric slab of dielectric constant K = ${k} is completely inserted between the plates, what is its new capacitance?`,
      options,
      correctAnswer: correctIdx,
      explanation: `Capacitance with dielectric slab is given by C = K × C₀ = ${k} × ${c0} = ${cNew} μF.`,
      targetCompany: 'School',
      difficulty: 'Hard',
    });
  }

  // 12C: Chemistry Solutions, Kinetics, Electrochemistry
  const c12ChemCore = [
    { q: 'For a first-order chemical reaction, what is the formula for its half-life (t_1/2) in terms of rate constant k?', ans: 't_1/2 = 0.693 / k', opts: ['t_1/2 = [A]0 / 2k', 't_1/2 = 0.693 / k', 't_1/2 = 1 / (k[A]0)', 't_1/2 = 2.303 / k'], exp: 'For a 1st order reaction: t_1/2 = ln(2) / k = 0.693 / k, which is independent of initial concentration.' },
    { q: 'Which colligative property does NOT depend on atmospheric pressure and is measured easily at room temperature?', ans: 'Osmotic Pressure', opts: ['Boiling Point Elevation', 'Freezing Point Depression', 'Osmotic Pressure', 'Vapour Pressure Lowering'], exp: 'Osmotic pressure (π = CRT) can be measured directly at uniform temperature for biomolecules.' },
    { q: 'What is the charge in Coulombs required to deposit 1 mole of Silver (Ag+) ions during electrolysis (1 Faraday)?', ans: '96,500 Coulombs', opts: ['9,650 C', '96,500 Coulombs', '1.6 × 10⁻¹⁹ C', '6.022 × 10²³ C'], exp: '1 Faraday = e × NA ≈ 96,485 ≈ 96,500 C, which is the charge carried by 1 mole of electrons.' },
    { q: 'What is the coordination number of Central Metal Atom in [Fe(CN)6]⁴⁻ complex?', ans: '6', opts: ['4', '6', '2', '8'], exp: 'The hexacyanoferrate(II) ion has 6 unidentate cyanide ligands, so coordination number is 6.' },
    { q: 'Which polymer is used for non-stick coating on cooking utensils and cookware?', ans: 'Teflon (PTFE)', opts: ['PVC', 'Bakelite', 'Teflon (PTFE)', 'Nylon 6,6'], exp: 'Teflon (Polytetrafluoroethylene) is chemically inert and heat-resistant.' },
  ];

  for (let i = 0; i < 50; i++) {
    const item = c12ChemCore[i % c12ChemCore.length];
    const correctIdx = (i * 2) % 4;
    const opts = [...item.opts];
    const oldIdx = opts.indexOf(item.ans);
    if (oldIdx !== -1) {
      const temp = opts[correctIdx];
      opts[correctIdx] = opts[oldIdx];
      opts[oldIdx] = temp;
    }

    list.push({
      id: id++,
      category: 'Chemistry',
      grades: ['12'],
      subject: 'Chemistry',
      board: 'All',
      questionText: `${item.q} (Class 12 Board/GUJCET Question #${i + 1})`,
      options: opts,
      correctAnswer: correctIdx,
      explanation: item.exp,
      targetCompany: 'School',
      difficulty: 'Hard',
    });
  }

  return list;
}

async function run() {
  try {
    const dataPath = path.join(__dirname, '../data/verified_questions.json');
    let existing = [];
    if (fs.existsSync(dataPath)) {
      existing = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    }

    // Keep the 1,000 college questions
    const collegeQuestions = existing
      .filter(q => !q.grades || q.grades.includes('college') || q.id <= 1000)
      .map(q => ({ ...q, grades: ['college'] }));

    console.log(`Found ${collegeQuestions.length} college questions.`);

    console.log('Generating over 1,000 curriculum-aligned School questions (Classes 6 to 12)...');
    const newSchoolQuestions = buildOver1000SchoolQuestions();
    console.log(`Generated ${newSchoolQuestions.length} school questions!`);

    const masterQuestions = [...collegeQuestions, ...newSchoolQuestions];
    fs.writeFileSync(dataPath, JSON.stringify(masterQuestions, null, 2), 'utf-8');
    console.log(`✅ Saved ${masterQuestions.length} total questions into ${dataPath}`);

    // Sync to MongoDB
    console.log('Connecting to MongoDB database to upsert questions in bulk...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB. Performing bulk upsert...');

    const bulkOps = masterQuestions.map(q => ({
      updateOne: {
        filter: { id: q.id },
        update: { $set: q },
        upsert: true,
      },
    }));

    const result = await Question.bulkWrite(bulkOps);
    console.log(`🎉 Bulk write completed! Upserted: ${result.upsertedCount}, Modified: ${result.modifiedCount}`);

    // Summary count per grade in database
    const gradeSummary = {};
    for (const g of ['6', '7', '8', '9', '10', '11', '12', 'college']) {
      const count = await Question.countDocuments({ grades: g });
      gradeSummary[g] = count;
    }
    console.log('📊 Final Database Question Counts per Grade:', gradeSummary);

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Error during generation/import:', err);
    process.exit(1);
  }
}

run();

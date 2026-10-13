const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Question = require('../models/Question');
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mindsprint';

function buildSchoolAndBoardQuestionBank() {
  const schoolQuestions = [];
  let id = 2000; // start school IDs from 2000 to avoid clash with college IDs 1-1000

  // ==========================================
  // CLASS 6 (Math, Science, Social Science, Gujarati, English)
  // ==========================================
  const g6Data = [
    // Math
    { q: 'What is the predecessor of the smallest 5-digit number (10,000)?', opts: ['9,999', '10,001', '9,990', '9,900'], ans: 0, exp: 'Predecessor means 1 less: 10,000 - 1 = 9,999.', sub: 'Mathematics', cat: 'Mathematics', diff: 'Easy' },
    { q: 'What is the Roman numeral for 500?', opts: ['C', 'D', 'M', 'L'], ans: 1, exp: 'In Roman numerals, L = 50, C = 100, D = 500, and M = 1000.', sub: 'Mathematics', cat: 'Mathematics', diff: 'Easy' },
    { q: 'Which of the following numbers is prime?', opts: ['27', '39', '47', '51'], ans: 2, exp: '47 has only two factors, 1 and 47 itself, making it a prime number.', sub: 'Mathematics', cat: 'Mathematics', diff: 'Medium' },
    { q: 'Find the HCF of 24 and 36.', opts: ['6', '12', '18', '24'], ans: 1, exp: 'Factors of 24: 1, 2, 3, 4, 6, 8, 12, 24. Factors of 36: 1, 2, 3, 4, 6, 9, 12, 18, 36. The highest common factor is 12.', sub: 'Mathematics', cat: 'Mathematics', diff: 'Medium' },
    { q: 'What is the perimeter of a rectangle with length 12 cm and breadth 8 cm?', opts: ['40 cm', '96 cm', '20 cm', '48 cm'], ans: 0, exp: 'Perimeter of rectangle = 2 * (length + breadth) = 2 * (12 + 8) = 40 cm.', sub: 'Mathematics', cat: 'Mathematics', diff: 'Easy' },
    { q: 'In an improper fraction, how does the numerator compare to the denominator?', opts: ['Numerator is smaller', 'Numerator is greater than or equal to denominator', 'Numerator is always 0', 'Numerator is always 1'], ans: 1, exp: 'An improper fraction has a numerator that is greater than or equal to the denominator (e.g. 7/4).', sub: 'Mathematics', cat: 'Mathematics', diff: 'Medium' },
    { q: 'What is the value of (-8) + (-5) + 12?', opts: ['-1', '1', '-25', '25'], ans: 0, exp: '(-8) + (-5) = -13. Then (-13) + 12 = -1.', sub: 'Mathematics', cat: 'Mathematics', diff: 'Easy' },
    { q: 'Solve the equation: x - 7 = 15. What is the value of x?', opts: ['8', '22', '21', '105'], ans: 1, exp: 'Add 7 to both sides: x = 15 + 7 = 22.', sub: 'Mathematics', cat: 'Mathematics', diff: 'Easy' },
    // Science
    { q: 'Which vitamin deficiency causes the disease known as Scurvy (bleeding gums)?', opts: ['Vitamin A', 'Vitamin B1', 'Vitamin C', 'Vitamin D'], ans: 2, exp: 'Vitamin C deficiency causes Scurvy, characterized by bleeding gums and slow healing.', sub: 'Science', cat: 'Science', diff: 'Easy' },
    { q: 'Which of the following is a plant source of dietary fibre (roughage)?', opts: ['Milk', 'Fish', 'Fresh fruits and whole grains', 'Eggs'], ans: 2, exp: 'Dietary fibres are primarily provided by plant products such as whole grains, pulses, and fresh fruits.', sub: 'Science', cat: 'Science', diff: 'Easy' },
    { q: 'What is the process of conversion of water vapour into its liquid state called?', opts: ['Evaporation', 'Condensation', 'Transpiration', 'Precipitation'], ans: 1, exp: 'Condensation is the process where water vapour cools down and turns back into liquid droplets.', sub: 'Science', cat: 'Science', diff: 'Easy' },
    { q: 'Which type of joint is present in human shoulder and hip allowing multi-directional rotation?', opts: ['Hinge joint', 'Ball and socket joint', 'Pivotal joint', 'Fixed joint'], ans: 1, exp: 'Ball and socket joint allows movement in all directions.', sub: 'Science', cat: 'Science', diff: 'Medium' },
    { q: 'What is the main gas present in air by volume (~78%)?', opts: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Argon'], ans: 2, exp: 'Nitrogen constitutes approximately 78% of the Earth atmospheric volume.', sub: 'Science', cat: 'Science', diff: 'Easy' },
    { q: 'Which earthworm method uses redworms for composting kitchen organic waste?', opts: ['Incineration', 'Vermicomposting', 'Landfill', 'Bio-gasification'], ans: 1, exp: 'Vermicomposting is the method of preparing compost with the help of redworms.', sub: 'Science', cat: 'Science', diff: 'Easy' },
    // Social Science & Gujarati
    { q: 'Which ancient Harappan port dockyard was discovered in Gujarat?', opts: ['Kalibangan', 'Lothal', 'Harappa', 'Mohenjodaro'], ans: 1, exp: 'Lothal, located in the Bhal region of Gujarat near the Gulf of Khambhat, had a massive tidal dockyard.', sub: 'Social Science', cat: 'Social Science', diff: 'Easy' },
    { q: 'Who is revered as the "Mook Sevak" (Silent Servant) of Gujarat?', opts: ['Sardar Patel', 'Ravishankar Maharaj', 'K. M. Munshi', 'Indulal Yagnik'], ans: 1, exp: 'Pujya Ravishankar Maharaj is affectionately called "Mook Sevak" for his selfless service to people.', sub: 'Gujarati', cat: 'Gujarati', diff: 'Easy' },
    { q: 'In English grammar, which article is used before words starting with a vowel sound like "honest"?', opts: ['A', 'An', 'The', 'None'], ans: 1, exp: '"Honest" starts with a silent "h" and a vowel sound "o", so "An" is used: An honest man.', sub: 'English', cat: 'English', diff: 'Easy' },
  ];

  g6Data.forEach((item) => {
    schoolQuestions.push({
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
      difficulty: item.diff,
    });
  });

  // ==========================================
  // CLASS 7 (Math, Science, Social Science)
  // ==========================================
  const g7Data = [
    { q: 'Solve the linear equation: 3x + 7 = 22. What is the value of x?', opts: ['3', '5', '7', '15'], ans: 1, exp: '3x = 22 - 7 = 15. x = 15 / 3 = 5.', sub: 'Mathematics', cat: 'Mathematics', diff: 'Easy' },
    { q: 'What is the product of (-12) × (-5) × (-2)?', opts: ['120', '-120', '60', '-60'], ans: 1, exp: '(-12) * (-5) = +60. (+60) * (-2) = -120.', sub: 'Mathematics', cat: 'Mathematics', diff: 'Easy' },
    { q: 'In a right triangle, base is 6 cm and height is 8 cm. What is the hypotenuse length?', opts: ['9 cm', '10 cm', '12 cm', '14 cm'], ans: 1, exp: 'By Pythagoras theorem: Hypotenuse = √(6² + 8²) = √(36 + 64) = √100 = 10 cm.', sub: 'Mathematics', cat: 'Mathematics', diff: 'Medium' },
    { q: 'Find the simple interest on Rs. 4,000 at 5% per annum for 3 years.', opts: ['Rs. 500', 'Rs. 600', 'Rs. 700', 'Rs. 800'], ans: 1, exp: 'SI = (P * R * T) / 100 = (4000 * 5 * 3) / 100 = Rs. 600.', sub: 'Mathematics', cat: 'Mathematics', diff: 'Medium' },
    { q: 'What is the green pigment in leaves that traps sunlight for photosynthesis?', opts: ['Hemoglobin', 'Chlorophyll', 'Carotene', 'Stomata'], ans: 1, exp: 'Chlorophyll in chloroplasts absorbs solar energy for photosynthesis.', sub: 'Science', cat: 'Science', diff: 'Easy' },
    { q: 'When blue litmus paper is dipped into an acidic solution, what color does it change to?', opts: ['Red', 'Green', 'Yellow', 'Remains Blue'], ans: 0, exp: 'Acids turn blue litmus red. Bases turn red litmus blue.', sub: 'Science', cat: 'Science', diff: 'Easy' },
    { q: 'What is the normal human body temperature on the Celsius scale?', opts: ['35.5 °C', '37 °C', '38.5 °C', '98.6 °C'], ans: 1, exp: 'The average normal body temperature of a healthy human is 37 °C (98.6 °F).', sub: 'Science', cat: 'Science', diff: 'Easy' },
    { q: 'Which mode of heat transfer does NOT require any physical medium?', opts: ['Conduction', 'Convection', 'Radiation', 'Advection'], ans: 2, exp: 'Radiation transfers heat through electromagnetic waves through vacuum (e.g. sunlight reaching Earth).', sub: 'Science', cat: 'Science', diff: 'Medium' },
    { q: 'Which blood vessels carry oxygen-rich blood from the heart to all parts of the body?', opts: ['Veins', 'Arteries', 'Capillaries', 'Valves'], ans: 1, exp: 'Arteries carry oxygenated blood away from the heart at high pressure (except pulmonary artery).', sub: 'Science', cat: 'Science', diff: 'Medium' },
  ];

  g7Data.forEach((item) => {
    schoolQuestions.push({
      id: id++,
      category: item.cat,
      grades: ['7'],
      subject: item.sub,
      board: 'All',
      questionText: item.q,
      options: item.opts,
      correctAnswer: item.ans,
      explanation: item.exp,
      targetCompany: 'School',
      difficulty: item.diff,
    });
  });

  // ==========================================
  // CLASS 8 (Math, Science)
  // ==========================================
  const g8Data = [
    { q: 'What is the sum of all interior angles of a convex quadrilateral?', opts: ['180°', '270°', '360°', '540°'], ans: 2, exp: 'Sum of interior angles of an n-sided polygon = (n - 2) * 180°. For quadrilateral (4 - 2) * 180° = 360°.', sub: 'Mathematics', cat: 'Mathematics', diff: 'Easy' },
    { q: 'Find the square root of 576.', opts: ['22', '24', '26', '28'], ans: 1, exp: '24 * 24 = 576. Thus √576 = 24.', sub: 'Mathematics', cat: 'Mathematics', diff: 'Easy' },
    { q: 'What is the value of (2^-3)?', opts: ['-8', '1/8', '-6', '1/6'], ans: 1, exp: 'By laws of exponents, a^-n = 1 / (a^n). 2^-3 = 1 / (2^3) = 1/8.', sub: 'Mathematics', cat: 'Mathematics', diff: 'Easy' },
    { q: 'Expand the identity: (x + 4)(x + 5).', opts: ['x² + 9x + 20', 'x² + 20x + 9', 'x² + x + 20', 'x² + 9x + 9'], ans: 0, exp: '(x + a)(x + b) = x² + (a + b)x + ab = x² + (4 + 5)x + (4 * 5) = x² + 9x + 20.', sub: 'Mathematics', cat: 'Mathematics', diff: 'Medium' },
    { q: 'What is the formula for the volume of a right circular cylinder?', opts: ['πr²h', '2πrh', '1/3 πr²h', '4/3 πr³'], ans: 0, exp: 'Volume of cylinder = Base Area * Height = πr²h.', sub: 'Mathematics', cat: 'Mathematics', diff: 'Medium' },
    { q: 'Which scientist discovered the biological cell in 1665 using a cork slice?', opts: ['Robert Brown', 'Robert Hooke', 'Anton van Leeuwenhoek', 'Louis Pasteur'], ans: 1, exp: 'Robert Hooke observed honeycomb-like compartments in a cork slice under his microscope in 1665.', sub: 'Science', cat: 'Science', diff: 'Easy' },
    { q: 'What is the SI unit of pressure?', opts: ['Joule', 'Pascal (N/m²)', 'Newton', 'Watt'], ans: 1, exp: 'Pressure = Force / Area. Its SI unit is Pascal (Pa) or N/m².', sub: 'Science', cat: 'Science', diff: 'Easy' },
    { q: 'Which organelle is universally known as the "Powerhouse of the Cell"?', opts: ['Golgi apparatus', 'Ribosome', 'Mitochondria', 'Chloroplast'], ans: 2, exp: 'Mitochondria generate ATP (cellular energy currency) and are called the powerhouse of the cell.', sub: 'Science', cat: 'Science', diff: 'Easy' },
    { q: 'Why is rolling friction smaller than sliding friction?', opts: ['Contact area is larger', 'Rolling motion reduces contact surface area and interlocking', 'Friction is independent of movement', 'Rollers create electrostatic attraction'], ans: 1, exp: 'In rolling, the effective contact area at any instant is minimal, reducing surface roughness interlocking.', sub: 'Science', cat: 'Science', diff: 'Medium' },
  ];

  g8Data.forEach((item) => {
    schoolQuestions.push({
      id: id++,
      category: item.cat,
      grades: ['8'],
      subject: item.sub,
      board: 'All',
      questionText: item.q,
      options: item.opts,
      correctAnswer: item.ans,
      explanation: item.exp,
      targetCompany: 'School',
      difficulty: item.diff,
    });
  });

  // ==========================================
  // CLASS 9 (Math, Science)
  // ==========================================
  const g9Data = [
    { q: 'Which of the following is an irrational number?', opts: ['√4', '√9', '√7', '0.25'], ans: 2, exp: '√7 is a non-terminating, non-recurring decimal, making it an irrational number. √4=2 and √9=3 are rational.', sub: 'Mathematics', cat: 'Mathematics', diff: 'Easy' },
    { q: 'What is the degree of the zero polynomial?', opts: ['0', '1', 'Not defined', '-1'], ans: 2, exp: 'The degree of the zero polynomial (0) is undefined.', sub: 'Mathematics', cat: 'Mathematics', diff: 'Medium' },
    { q: 'In which quadrant does the point (-4, 5) lie on the Cartesian plane?', opts: ['Quadrant I', 'Quadrant II', 'Quadrant III', 'Quadrant IV'], ans: 1, exp: 'Point (-4, 5) has x < 0 and y > 0, which corresponds to the Second Quadrant (Quadrant II).', sub: 'Mathematics', cat: 'Mathematics', diff: 'Easy' },
    { q: "According to Heron's formula, the area of a triangle with sides a, b, c and semi-perimeter s is:", opts: ['s(s-a)(s-b)', '√[s(s-a)(s-b)(s-c)]', '1/2 s(a+b+c)', '√[(s-a)(s-b)(s-c)]'], ans: 1, exp: 'Heron formula: Area = √[s(s-a)(s-b)(s-c)] where s = (a+b+c)/2.', sub: 'Mathematics', cat: 'Mathematics', diff: 'Medium' },
    { q: 'What is the curved surface area of a cone with radius r and slant height l?', opts: ['πr²', '2πrh', 'πrl', 'πr(r + l)'], ans: 2, exp: 'Curved Surface Area of a cone is πrl. Total surface area is πr(r + l).', sub: 'Mathematics', cat: 'Mathematics', diff: 'Medium' },
    { q: "Which of Newton's Laws provides the quantitative formula for Force: F = ma?", opts: ['First Law of Motion', 'Second Law of Motion', 'Third Law of Motion', 'Law of Gravitation'], ans: 1, exp: 'Newton Second Law states that the rate of change of momentum is proportional to applied force, yielding F = ma.', sub: 'Science', cat: 'Science', diff: 'Easy' },
    { q: 'What is the value of acceleration due to gravity (g) near the Earth surface?', opts: ['9.8 m/s²', '9.8 m/s', '6.67 × 10^-11 m/s²', '3.0 × 10^8 m/s²'], ans: 0, exp: 'Standard acceleration due to Earth gravity g is 9.8 m/s².', sub: 'Science', cat: 'Science', diff: 'Easy' },
    { q: 'An object of mass 2 kg moves with velocity 4 m/s. What is its Kinetic Energy?', opts: ['8 Joules', '16 Joules', '32 Joules', '4 Joules'], ans: 1, exp: 'Kinetic Energy = 1/2 * m * v² = 1/2 * 2 * 4² = 16 Joules.', sub: 'Science', cat: 'Science', diff: 'Medium' },
    { q: 'What is the phenomenon of scattering of light by colloidal particles called?', opts: ['Refraction', 'Tyndall Effect', 'Dispersion', 'Diffraction'], ans: 1, exp: 'The Tyndall effect is the scattering of a light beam by colloidal particles in a suspension/colloid.', sub: 'Science', cat: 'Science', diff: 'Medium' },
  ];

  g9Data.forEach((item) => {
    schoolQuestions.push({
      id: id++,
      category: item.cat,
      grades: ['9'],
      subject: item.sub,
      board: 'All',
      questionText: item.q,
      options: item.opts,
      correctAnswer: item.ans,
      explanation: item.exp,
      targetCompany: 'School',
      difficulty: item.diff,
    });
  });

  // ==========================================
  // CLASS 10 (Board Exam Level - Math & Science)
  // ==========================================
  const g10Data = [
    { q: 'If LCM(a, b) = 360 and HCF(a, b) = 12, what is the product of the two numbers (a × b)?', opts: ['3,000', '4,320', '2,400', '360'], ans: 1, exp: 'By Fundamental Theorem of Arithmetic: a * b = LCM(a,b) * HCF(a,b) = 360 * 12 = 4,320.', sub: 'Mathematics', cat: 'Mathematics', diff: 'Medium' },
    { q: 'For what condition does a quadratic equation ax² + bx + c = 0 have two distinct real roots?', opts: ['b² - 4ac < 0', 'b² - 4ac = 0', 'b² - 4ac > 0', 'b² - 4ac = 1'], ans: 2, exp: 'When Discriminant D = b² - 4ac > 0, the quadratic equation possesses two distinct real roots.', sub: 'Mathematics', cat: 'Mathematics', diff: 'Medium' },
    { q: 'Find the 10th term of the Arithmetic Progression: 2, 7, 12, 17, ...', opts: ['42', '47', '52', '57'], ans: 1, exp: 'Here a = 2, d = 5. a_10 = a + (10 - 1)d = 2 + 9 * 5 = 2 + 45 = 47.', sub: 'Mathematics', cat: 'Mathematics', diff: 'Easy' },
    { q: 'What is the trigonometric value of sin²(30°) + cos²(30°)?', opts: ['0', '1/2', '1', '2'], ans: 2, exp: 'By standard identity, sin²θ + cos²θ = 1 for any angle θ.', sub: 'Mathematics', cat: 'Mathematics', diff: 'Easy' },
    { q: 'If tan(θ) = 4/3, what is the value of sin(θ)?', opts: ['3/5', '4/5', '5/4', '3/4'], ans: 1, exp: 'tan θ = Opposite/Adjacent = 4/3. Hypotenuse = √(4² + 3²) = 5. sin θ = Opposite/Hypotenuse = 4/5.', sub: 'Mathematics', cat: 'Mathematics', diff: 'Medium' },
    { q: 'How many tangents can be drawn to a circle from a point outside it?', opts: ['1', '2', 'Infinite', '0'], ans: 1, exp: 'Exactly two tangents of equal length can be drawn to a circle from any point lying outside it.', sub: 'Mathematics', cat: 'Mathematics', diff: 'Easy' },
    { q: 'What is the probability of getting a sum of 7 when two dice are rolled simultaneously?', opts: ['1/6', '7/36', '5/36', '1/12'], ans: 0, exp: 'Favourable pairs: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) = 6 pairs. Total outcomes = 36. Probability = 6/36 = 1/6.', sub: 'Mathematics', cat: 'Mathematics', diff: 'Medium' },
    { q: 'Which chemical reaction involves both reduction and oxidation taking place simultaneously?', opts: ['Precipitation reaction', 'Redox reaction', 'Neutralization reaction', 'Decomposition reaction'], ans: 1, exp: 'A reaction where oxidation (loss of electrons) and reduction (gain of electrons) co-occur is a Redox reaction.', sub: 'Science', cat: 'Science', diff: 'Easy' },
    { q: 'What is the chemical formula of Plaster of Paris (POP)?', opts: ['CaSO4 · 2H2O', 'CaSO4 · 1/2 H2O', 'CaCO3', 'CaOCl2'], ans: 1, exp: 'Plaster of Paris is Calcium Sulphate Hemihydrate: CaSO4 · 1/2 H2O.', sub: 'Science', cat: 'Science', diff: 'Medium' },
    { q: 'What is the functional structural filtration unit of human kidneys?', opts: ['Neuron', 'Nephron', 'Alveoli', 'Glomerulus only'], ans: 1, exp: 'Nephrons are the microscopic filtration units in kidneys that clean blood and generate urine.', sub: 'Science', cat: 'Science', diff: 'Medium' },
    { q: 'What lens is prescribed to correct Myopia (near-sightedness)?', opts: ['Convex lens', 'Concave lens', 'Bifocal lens', 'Cylindrical lens'], ans: 1, exp: 'Myopic eyes focus distant light in front of the retina. A diverging Concave lens diverges rays to focus onto retina.', sub: 'Science', cat: 'Science', diff: 'Medium' },
    { q: 'Three resistors of 6 Ω each are connected in parallel. What is their equivalent resistance?', opts: ['18 Ω', '2 Ω', '3 Ω', '12 Ω'], ans: 1, exp: '1/R = 1/6 + 1/6 + 1/6 = 3/6 = 1/2. Therefore R = 2 Ω.', sub: 'Science', cat: 'Science', diff: 'Medium' },
    { q: 'Which electrical rule predicts the direction of force on a current-carrying conductor in a magnetic field (Electric Motor)?', opts: ["Fleming's Left-Hand Rule", "Fleming's Right-Hand Rule", "Maxwell's Corkscrew Rule", "Ampere's Swimming Rule"], ans: 0, exp: 'Fleming Left-Hand Rule determines the direction of mechanical force/motion in motors.', sub: 'Science', cat: 'Science', diff: 'Medium' },
  ];

  g10Data.forEach((item) => {
    schoolQuestions.push({
      id: id++,
      category: item.cat,
      grades: ['10'],
      subject: item.sub,
      board: 'All',
      questionText: item.q,
      options: item.opts,
      correctAnswer: item.ans,
      explanation: item.exp,
      targetCompany: 'School',
      difficulty: item.diff,
    });
  });

  // ==========================================
  // CLASS 11 (Physics & Chemistry)
  // ==========================================
  const g11Data = [
    { q: 'What are the dimensions of Universal Gravitational Constant (G)?', opts: ['[M^-1 L^3 T^-2]', '[M^1 L^3 T^-2]', '[M^-1 L^2 T^-2]', '[M^1 L^2 T^-1]'], ans: 0, exp: 'F = G m1 m2 / r² => G = F r² / m² = [M L T^-2][L²]/[M²] = [M^-1 L^3 T^-2].', sub: 'Physics', cat: 'Physics', diff: 'Hard' },
    { q: 'At what launch angle does a projectile achieve its maximum horizontal range on flat ground?', opts: ['30°', '45°', '60°', '90°'], ans: 1, exp: 'Range R = (u² sin 2θ) / g. Range is maximized when sin(2θ) = 1 => 2θ = 90° => θ = 45°.', sub: 'Physics', cat: 'Physics', diff: 'Medium' },
    { q: 'What is the maximum number of electrons that can be accommodated in a principal quantum shell n = 3?', opts: ['8', '18', '32', '14'], ans: 1, exp: 'Maximum electrons in shell n = 2n² = 2 * (3²) = 2 * 9 = 18.', sub: 'Chemistry', cat: 'Chemistry', diff: 'Medium' },
    { q: 'Which element has the highest electronegativity on the Pauling scale?', opts: ['Chlorine', 'Oxygen', 'Fluorine', 'Nitrogen'], ans: 2, exp: 'Fluorine (F) has the highest electronegativity with a value of 4.0 on Pauling scale.', sub: 'Chemistry', cat: 'Chemistry', diff: 'Easy' },
  ];

  g11Data.forEach((item) => {
    schoolQuestions.push({
      id: id++,
      category: item.cat,
      grades: ['11'],
      subject: item.sub,
      board: 'All',
      questionText: item.q,
      options: item.opts,
      correctAnswer: item.ans,
      explanation: item.exp,
      targetCompany: 'School',
      difficulty: item.diff,
    });
  });

  // ==========================================
  // CLASS 12 (Physics & Chemistry - Board & GUJCET / JEE)
  // ==========================================
  const g12Data = [
    { q: 'What is the SI unit of Electric Flux (Φ)?', opts: ['Newton / Coulomb', 'Volt · meter (N · m² / C)', 'Tesla', 'Farad'], ans: 1, exp: 'Electric Flux Φ = E · A = (N/C) * m² = Volt · meter.', sub: 'Physics', cat: 'Physics', diff: 'Medium' },
    { q: 'What happens to the capacitance of a parallel plate capacitor when a dielectric slab of constant K is inserted?', opts: ['Decreases by factor K', 'Increases by factor K (C = K · C0)', 'Remains unchanged', 'Becomes zero'], ans: 1, exp: 'Dielectric polarization reduces internal E field, increasing charge storage capacity: C = K · C0.', sub: 'Physics', cat: 'Physics', diff: 'Medium' },
    { q: 'What is the unit of rate constant (k) for a First-Order chemical reaction?', opts: ['mol L^-1 s^-1', 's^-1 (time^-1)', 'L mol^-1 s^-1', 'L² mol^-2 s^-1'], ans: 1, exp: 'For 1st order reaction: Rate = k[A]^1. k = Rate / [A] = (mol L^-1 s^-1) / (mol L^-1) = s^-1.', sub: 'Chemistry', cat: 'Chemistry', diff: 'Medium' },
    { q: 'Which colligative property is most suitable for determining the molar mass of polymers and biomolecules?', opts: ['Elevation in boiling point', 'Depression in freezing point', 'Osmotic pressure (π = CRT)', 'Relative lowering of vapour pressure'], ans: 2, exp: 'Osmotic pressure measurements can be accurately taken at room temperature and produce measurable magnitudes for large molecules.', sub: 'Chemistry', cat: 'Chemistry', diff: 'Medium' },
  ];

  g12Data.forEach((item) => {
    schoolQuestions.push({
      id: id++,
      category: item.cat,
      grades: ['12'],
      subject: item.sub,
      board: 'All',
      questionText: item.q,
      options: item.opts,
      correctAnswer: item.ans,
      explanation: item.exp,
      targetCompany: 'School',
      difficulty: item.diff,
    });
  });

  return schoolQuestions;
}

async function run() {
  try {
    const dataPath = path.join(__dirname, '../data/verified_questions.json');
    let existing = [];
    if (fs.existsSync(dataPath)) {
      existing = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    }

    // Ensure existing college questions have grades: ['college']
    existing = existing.map(q => ({
      ...q,
      grades: q.grades && q.grades.length > 0 ? q.grades : ['college']
    }));

    // Filter out previous generated school questions if any
    existing = existing.filter(q => q.id < 2000);

    const schoolBank = buildSchoolAndBoardQuestionBank();
    const combined = [...existing, ...schoolBank];

    fs.writeFileSync(dataPath, JSON.stringify(combined, null, 2), 'utf-8');
    console.log(`✅ Updated ${dataPath} with ${combined.length} total questions (${existing.length} college, ${schoolBank.length} school & board questions)!`);

    // Sync to MongoDB if URI available
    console.log('Connecting to MongoDB to update questions collection...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB. Upserting school questions...');

    for (const q of schoolBank) {
      await Question.findOneAndUpdate({ id: q.id }, q, { upsert: true });
    }
    console.log('🎉 Successfully upserted all school questions into MongoDB!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.warn('MongoDB sync note (file updated successfully):', err.message);
    process.exit(0);
  }
}

run();

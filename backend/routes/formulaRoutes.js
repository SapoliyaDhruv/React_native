const express = require('express');
const router = express.Router();
const Formula = require('../models/Formula');

const SEED_FORMULAS = [
  // School Math
  {
    id: 'sch-math-1',
    category: 'School Math',
    title: 'Algebraic Identities & Formulas',
    titleGujarati: 'બીજગણિતીય નિત્યસમો',
    grades: ['6', '7', '8', '9', '10'],
    formulas: [
      '(a + b)² = a² + 2ab + b²',
      '(a - b)² = a² - 2ab + b²',
      '(a + b)(a - b) = a² - b²',
      '(x + a)(x + b) = x² + (a + b)x + ab',
      '(a + b + c)² = a² + b² + c² + 2ab + 2bc + 2ca',
    ],
    notes: 'Fundamental identities for polynomial expansion and algebraic factorizations.',
  },
  {
    id: 'sch-math-2',
    category: 'School Math',
    title: 'Mensuration & Geometry (Area & Volume)',
    titleGujarati: 'ક્ષેત્રફળ અને ઘનફળના સૂત્રો',
    grades: ['6', '7', '8', '9', '10'],
    formulas: [
      'Area of Triangle = 1/2 × Base × Height',
      'Area of Circle = πr² | Perimeter (Circumference) = 2πr',
      'Area of Trapezium = 1/2 × (a + b) × h',
      'Cylinder Volume = πr²h | Total Surface Area = 2πr(r + h)',
      'Sphere Volume = (4/3)πr³ | Surface Area = 4πr²',
    ],
    notes: 'For GSEB/NCERT problems, always use π = 22/7 unless specified as 3.14.',
  },
  {
    id: 'sch-math-3',
    category: 'School Math',
    title: 'Class 10 Trigonometry & Quadratic Formulas',
    titleGujarati: 'ત્રિકોણમિતિ અને દ્વિઘાત સમીકરણ',
    grades: ['9', '10', '11', '12'],
    formulas: [
      'Quadratic Formula: x = [-b ± √(b² - 4ac)] / (2a)',
      'Discriminant: D = b² - 4ac (D > 0: two real roots, D = 0: equal roots)',
      'sin²θ + cos²θ = 1',
      '1 + tan²θ = sec²θ',
      '1 + cot²θ = cosec²θ',
    ],
    notes: 'Essential for CBSE and GSEB Class 10 Board examinations.',
  },
  // School Science
  {
    id: 'sch-sci-1',
    category: 'School Science',
    title: 'Laws of Motion & Force (Class 8 & 9)',
    titleGujarati: 'ગતિના નિયમો અને બળના સૂત્રો',
    grades: ['7', '8', '9', '10', '11'],
    formulas: [
      'v = u + at (1st Equation of Motion)',
      's = ut + (1/2)at² (2nd Equation of Motion)',
      'v² - u² = 2as (3rd Equation of Motion)',
      'Force = Mass × Acceleration (F = ma)',
      'Pressure = Force / Area (P = F/A) [Unit: Pascal]',
    ],
    notes: 'u = initial velocity, v = final velocity, a = acceleration, s = distance travelled.',
  },
  {
    id: 'sch-sci-2',
    category: 'School Science',
    title: 'Electricity & Light Formulas (Class 10)',
    titleGujarati: 'વિદ્યુત અને પ્રકાશના સૂત્રો',
    grades: ['9', '10', '11', '12'],
    formulas: [
      "Ohm's Law: V = I × R (Voltage = Current × Resistance)",
      'Resistors in Series: R_eq = R₁ + R₂ + R₃',
      'Resistors in Parallel: 1/R_eq = 1/R₁ + 1/R₂',
      'Mirror Formula: 1/f = 1/v + 1/u',
      'Lens Formula: 1/f = 1/v - 1/u',
      'Power of Lens: P = 1 / f (in meters) [Unit: Dioptre]',
    ],
    notes: 'Crucial for numerical problems in 10th CBSE and GSEB board science papers.',
  },
  // College
  {
    id: 'quant-1',
    category: 'Quant Formulas',
    title: 'Speed, Distance & Time',
    grades: ['college', '11', '12'],
    formulas: [
      'Speed = Distance / Time',
      'km/hr to m/s = x * (5 / 18)',
      'm/s to km/hr = x * (18 / 5)',
      'Relative Speed (Opposite Direction) = Speed A + Speed B',
      'Relative Speed (Same Direction) = Speed A - Speed B',
    ],
    notes: 'When a train passes a stationary pole/tree, total distance = length of the train.',
  },
  {
    id: 'quant-2',
    category: 'Quant Formulas',
    title: 'Time & Work / Men-Days',
    grades: ['college', '11', '12'],
    formulas: [
      'Total Work = Men * Days * Hours',
      'If A completes work in X days, 1 day work = 1 / X',
      'Combined Work (A + B) = (X * Y) / (X + Y) days',
    ],
    notes: 'Total Work can be easily solved using LCM of individual working days.',
  },
  {
    id: 'quant-3',
    category: 'Quant Formulas',
    title: 'Profit, Loss & Discount',
    grades: ['college', '11', '12'],
    formulas: [
      'Profit = Selling Price (SP) - Cost Price (CP)',
      'Profit % = (Profit / CP) * 100',
      'Loss % = (Loss / CP) * 100',
      'Selling Price = CP * (100 + Profit %) / 100',
      'Discount % = (Discount / Marked Price) * 100',
    ],
    notes: 'Discount is always calculated on Marked Price (MP), while Profit % is calculated on Cost Price (CP).',
  },
  {
    id: 'dsa-1',
    category: 'DSA Time Complexities',
    title: 'Sorting Algorithm Complexities',
    grades: ['college'],
    formulas: [
      'Merge Sort: Best/Avg/Worst = O(n log n) | Space = O(n)',
      'Quick Sort: Avg = O(n log n) | Worst = O(n²) | Space = O(log n)',
      'Heap Sort: Best/Avg/Worst = O(n log n) | Space = O(1)',
      'Binary Search: Time = O(log n) | Space = O(1)',
    ],
    notes: 'Merge Sort is stable and guaranteed O(n log n), while Quick Sort is in-place and fast in practice.',
  },
  {
    id: 'dsa-2',
    category: 'DSA Time Complexities',
    title: 'Data Structure Operations',
    grades: ['college'],
    formulas: [
      'Hash Table: Lookup O(1) avg | Insert O(1) avg | Worst O(n)',
      'Balanced BST (AVL/Red-Black): Lookup O(log n) | Insert O(log n)',
      'Array: Random Access O(1) | Insertion/Deletion O(n)',
      'Singly Linked List: Access O(n) | Insertion at Head O(1)',
    ],
    notes: 'Hash Table worst-case O(n) occurs during severe hash collisions.',
  },
  {
    id: 'js-1',
    category: 'React & JS',
    title: 'React Hooks Quick Reference',
    grades: ['college'],
    formulas: [
      'useEffect(() => {}, []) // Mount lifecycle hook',
      'useCallback(fn, deps) // Memoize callback function instance',
      'useMemo(() => value, deps) // Memoize heavy computed result',
      'useRef(initialValue) // Persistent mutable value (no re-render)',
    ],
    notes: 'Always specify exact dependencies in useEffect array to prevent infinite rendering loops.',
  },
];

// Auto-seed helper
async function ensureFormulasSeeded() {
  const count = await Formula.countDocuments();
  if (count === 0) {
    console.log('🌱 Auto-seeding Formula dataset in MongoDB...');
    await Formula.insertMany(SEED_FORMULAS);
  }
}

// GET /api/formulas
router.get('/', async (req, res) => {
  try {
    await ensureFormulasSeeded();
    const { grade, category } = req.query;

    const filter = {};
    if (grade && grade !== 'all') {
      filter.grades = grade;
    }
    if (category && category !== 'All') {
      filter.category = category;
    }

    const formulas = await Formula.find(filter).sort({ id: 1 });
    res.json(formulas);
  } catch (error) {
    console.error('Error fetching formulas:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

export type AcademicGrade = '6' | '7' | '8' | '9' | '10' | '11' | '12' | 'college';
export type EducationBoard = 'CBSE' | 'GSEB' | 'ICSE';
export type InstructionMedium = 'English' | 'Gujarati';

export interface ChapterVideo {
  id: string;
  title: string;
  titleGujarati?: string;
  teacher: string;
  duration: string;
  youtubeVideoId: string;
  tag: string; // 'Concept In-Depth' | 'Fast Revision' | 'GSEB Gujarati' | 'Solved Examples'
}

export interface ChapterConcept {
  heading: string;
  headingGujarati?: string;
  explanation: string;
  explanationGujarati?: string;
}

export interface TextbookExerciseSolution {
  question: string;
  answer: string;
  questionGujarati?: string;
  answerGujarati?: string;
}

export interface SubjectChapter {
  id: string;
  chapterNumber: number;
  title: string;
  titleGujarati?: string;
  duration: string;
  summary: string;
  summaryGujarati?: string;
  questionCount: number;
  iconName: string;
  textbookPdfUrl?: string;
  videos?: ChapterVideo[];
  concepts?: ChapterConcept[];
  keyFormulas?: string[];
  keyFormulasGujarati?: string[];
  exerciseSolutions?: TextbookExerciseSolution[];
}

export interface AcademicSubject {
  id: string;
  name: string;
  nameGujarati?: string;
  code: string;
  color: string;
  textbookTitle?: string;
  textbookTitleGujarati?: string;
  officialTextbookPdf?: string;
  chapters: SubjectChapter[];
}

export interface GradeCurriculum {
  grade: AcademicGrade;
  title: string;
  description: string;
  badge: string;
  subjects: AcademicSubject[];
}

export interface SamplePaper {
  id: string;
  title: string;
  titleGujarati?: string;
  grade: string;
  board: string;
  subject: string;
  year: string;
  durationMinutes: number;
  totalMarks: number;
  questionCount: number;
  difficulty: string;
  badge?: string;
  officialPdfUrl?: string;
  solutionPdfUrl?: string;
  instructions?: string[];
  instructionsGujarati?: string[];
}

export interface StepMarking {
  stepNumber: number;
  marksAllocated: string;
  text: string;
  textGujarati?: string;
}

export interface ImportantQuestion {
  id: string;
  grade: string;
  board: string;
  subject: string;
  chapterNumber: number;
  chapterTitle: string;
  chapterTitleGujarati?: string;
  marks: number; // 1, 2, 3, 4, 5
  marksCategory: string; // '1-Mark Objective / VSA' | '2-Mark Short Answer' | '3-Mark Medium Proof / Sum' | '4-Mark Long Answer / Case Study'
  questionText: string;
  questionTextGujarati: string;
  frequentlyAskedYears?: string[];
  modelAnswer: string;
  modelAnswerGujarati: string;
  stepWiseMarking?: StepMarking[];
  examinerTips?: string;
  examinerTipsGujarati?: string;
}

export const GRADE_OPTIONS: { grade: AcademicGrade; label: string; subLabel: string; icon: string }[] = [
  { grade: '6', label: 'Class 6', subLabel: 'Junior School Foundations', icon: 'looks-6' },
  { grade: '7', label: 'Class 7', subLabel: 'Middle School Concepts', icon: 'looks-one' },
  { grade: '8', label: 'Class 8', subLabel: 'Pre-Secondary Preparation', icon: 'looks-two' },
  { grade: '9', label: 'Class 9', subLabel: 'Secondary Foundation', icon: 'looks-3' },
  { grade: '10', label: 'Class 10', subLabel: 'Board Exam Mastery (CBSE/GSEB)', icon: 'school' },
  { grade: '11', label: 'Class 11', subLabel: 'Higher Secondary & Entrance', icon: 'biotech' },
  { grade: '12', label: 'Class 12', subLabel: 'Board & JEE/GUJCET/NEET', icon: 'workspace-premium' },
  { grade: 'college', label: 'College & Placements', subLabel: 'TCS, Amazon, DSA & Coding', icon: 'business-center' },
];

export const ACADEMIC_CURRICULUM: Record<AcademicGrade, GradeCurriculum> = {
  '6': {
    grade: '6',
    title: 'Class 6 Curriculum',
    description: 'NCERT & GSEB Comprehensive Subjects for Class 6',
    badge: 'CLASS 6 • FOUNDATIONS',
    subjects: [
      {
        id: 'g6-math',
        name: 'Mathematics',
        nameGujarati: 'ગણિત',
        code: 'MATH6',
        color: '#3b82f6',
        textbookTitle: 'NCERT / GSEB Mathematics Class 6',
        textbookTitleGujarati: 'ધોરણ ૬ ગણિત પાઠ્યપુસ્તક (GSEB)',
        officialTextbookPdf: 'https://ncert.nic.in/textbook.php?femh1=0-14',
        chapters: [
          {
            id: 'g6-m-1',
            chapterNumber: 1,
            title: 'Knowing Our Numbers',
            titleGujarati: 'સંખ્યા પરિચય અને સ્થાનકિંમત',
            duration: '15m',
            summary: 'Place values (Indian vs International system), comparing large numbers, estimation rules, and Roman Numerals.',
            summaryGujarati: 'સંખ્યાઓની તુલના, સ્થાનકિંમત (ભારતીય અને આંતરરાષ્ટ્રીય પદ્ધતિ), અંદાજીકરણ અને રોમન અંક પદ્ધતિ.',
            questionCount: 20,
            iconName: 'calculate',
            textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/femh101.pdf',
            videos: [
              {
                id: 'v-6-m-1-a',
                title: 'Knowing Our Numbers - Complete Chapter Explanation in Gujarati',
                titleGujarati: 'ધોરણ ૬ ગણિત – પ્રકરણ ૧: સંખ્યા પરિચય સંપૂર્ણ સમજૂતી',
                teacher: 'GSEB Digital Shiksha',
                duration: '18m',
                youtubeVideoId: 'L_LUpnjgPso',
                tag: 'GSEB Gujarati Medium',
              },
              {
                id: 'v-6-m-1-b',
                title: 'Indian vs International Number System Shortcut Tricks',
                titleGujarati: 'સ્થાનકિંમત પદ્ધતિ યાદ રાખવાની શોર્ટકટ ટ્રીક',
                teacher: 'Magnet Brains Foundation',
                duration: '12m',
                youtubeVideoId: '0c_0KjG2_4s',
                tag: 'Fast Revision & Shortcuts',
              },
              {
                id: 'v-6-m-1-c',
                title: 'NCERT Exercise 1.1, 1.2 & 1.3 Solved Problems',
                titleGujarati: 'સ્વાધ્યાય ૧.૧ અને ૧.૨ ના તમામ દાખલાઓનું સોલ્યુશન',
                teacher: 'Edudev Classes',
                duration: '22m',
                youtubeVideoId: 'f02mOEt11OQ',
                tag: 'Textbook Solved Examples',
              },
            ],
            keyFormulas: [
              '1 Lakh = 100 Thousand = 10^5',
              '1 Million = 10 Lakhs = 10^6',
              '1 Crore = 10 Millions = 100 Lakhs = 10^7',
              'Roman Numerals: I=1, V=5, X=10, L=50, C=100, D=500, M=1000',
            ],
            keyFormulasGujarati: [
              '૧ લાખ = ૧૦૦ હજાર',
              '૧ મિલિયન = ૧૦ લાખ',
              '૧ કરોડ = ૧૦ મિલિયન = ૧૦૦ લાખ',
              'રોમન અંકો: I=૧, V=૫, X=૧૦, L=૫૦, C=૧૦૦, D=૫૦૦, M=૧૦૦૦',
            ],
            exerciseSolutions: [
              {
                question: 'Fill in the blanks: (a) 1 lakh = _____ ten thousand. (b) 1 million = _____ hundred thousand.',
                answer: '(a) 10  (b) 10',
                questionGujarati: 'ખાલી જગ્યા પૂરો: (a) ૧ લાખ = _____ દસ હજાર. (b) ૧ મિલિયન = _____ સો હજાર.',
                answerGujarati: '(a) ૧૦  (b) ૧૦',
              },
              {
                question: 'Place commas correctly and write the numerals: Seventy-three lakh seventy-five thousand three hundred seven.',
                answer: '73,75,307',
                questionGujarati: 'અલ્પવિરામ મૂકી સંખ્યા લખો: બોંતેર લાખ પંચોતેર હજાર ત્રણસો સાત.',
                answerGujarati: '૭૩,૭૫,૩૦૭',
              },
            ],
          },
          {
            id: 'g6-m-2',
            chapterNumber: 2,
            title: 'Whole Numbers',
            titleGujarati: 'પૂર્ણ સંખ્યાઓ',
            duration: '14m',
            summary: 'Number line operations, predecessor, successor, closure, commutative and distributive properties.',
            summaryGujarati: 'સંખ્યા રેખા, પુરોગામી અને અનુગામી સંખ્યાઓ, સંવૃતતા, ક્રમ અને વિભાજનનો નિયમ.',
            questionCount: 15,
            iconName: 'format-list-numbered',
            textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/femh102.pdf',
            videos: [
              {
                id: 'v-6-m-2-a',
                title: 'Whole Numbers and Number Line Operations in Gujarati',
                titleGujarati: 'ધોરણ ૬ ગણિત – પ્રકરણ ૨: પૂર્ણ સંખ્યાઓ અને સંખ્યારેખા',
                teacher: 'GSEB Gyan Kunj',
                duration: '15m',
                youtubeVideoId: 'kUMe1FH4CHE',
                tag: 'GSEB Gujarati Medium',
              },
            ],
            keyFormulas: [
              'Natural Numbers (N) = {1, 2, 3, 4, ...}',
              'Whole Numbers (W) = {0, 1, 2, 3, ...}',
              'Commutative: a + b = b + a, a × b = b × a',
              'Distributive: a × (b + c) = (a × b) + (a × c)',
            ],
            keyFormulasGujarati: [
              'પ્રાકૃતિક સંખ્યાઓ (N) = {૧, ૨, ૩, ૪, ...}',
              'પૂર્ણ સંખ્યાઓ (W) = {૦, ૧, ૨, ૩, ...}',
              'ક્રમનો ગુણધર્મ: a + b = b + a, a × b = b × a',
              'વિભાજનનો ગુણધર્મ: a × (b + c) = (a × b) + (a × c)',
            ],
          },
          {
            id: 'g6-m-3',
            chapterNumber: 3,
            title: 'Playing with Numbers (LCM & HCF)',
            titleGujarati: 'સંખ્યા સાથે રમત (લસાઅ અને ગુસાઅ)',
            duration: '18m',
            summary: 'Factors, multiples, prime & composite numbers, divisibility rules (2 to 11), prime factorization, HCF and LCM.',
            summaryGujarati: 'અવયવ અને અવયવી, અવિભાજ્ય અને વિભાજ્ય સંખ્યાઓ, વિભાજ્યતાની ચાવીઓ, ગુ.સા.અ. અને લ.સા.અ.',
            questionCount: 20,
            iconName: 'all-inclusive',
            textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/femh103.pdf',
            videos: [
              {
                id: 'v-6-m-3-a',
                title: 'Divisibility Rules & Prime Numbers in Gujarati',
                titleGujarati: 'વિભાજ્યતાની ચાવીઓ અને અવિભાજ્ય સંખ્યાઓ શોર્ટકટ',
                teacher: 'GSEB Shiksha',
                duration: '16m',
                youtubeVideoId: 'L_LUpnjgPso',
                tag: 'GSEB Gujarati Medium',
              },
            ],
            keyFormulas: [
              'HCF × LCM = Product of Two Numbers (a × b)',
              '2 is the smallest and only even prime number.',
            ],
            keyFormulasGujarati: [
              'ગુ.સા.અ. × લ.સા.અ. = બંને સંખ્યાઓનો ગુણાકાર (a × b)',
              '૨ એ સૌથી નાની અને એકમાત્ર બેકી અવિભાજ્ય સંખ્યા છે.',
            ],
          },
          {
            id: 'g6-m-4',
            chapterNumber: 4,
            title: 'Basic Geometrical Ideas',
            titleGujarati: 'ભૂમિતિના પાયાના ખ્યાલો',
            duration: '15m',
            summary: 'Points, line segments, rays, intersecting and parallel lines, curves, polygons, angles, triangles, quadrilaterals, circles.',
            summaryGujarati: 'બિંદુ, રેખાખંડ, કિરણ, છેદતી-સમાંતર રેખાઓ, વક્ર, બહુકોણ, ખૂણા, ત્રિકોણ, ચતુષ્કોણ અને વર્તુળના ભાગો.',
            questionCount: 15,
            iconName: 'architecture',
            textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/femh104.pdf',
          },
          {
            id: 'g6-m-5',
            chapterNumber: 5,
            title: 'Understanding Elementary Shapes',
            titleGujarati: 'પાયાના આકારોની સમજૂતી',
            duration: '16m',
            summary: 'Angles (acute, right, obtuse, reflex), measuring line segments, directions & clock angles, 2D and 3D shapes.',
            summaryGujarati: 'ખૂણાઓના પ્રકાર (લઘુકોણ, કાટકોણ, ગુરુકોણ, સરળકોણ), દિશાઓ અને ઘડિયાળના ખૂણા, દ્વિપરિમાણીય અને ત્રિપરિમાણીય આકારો.',
            questionCount: 16,
            iconName: 'category',
            textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/femh105.pdf',
          },
          {
            id: 'g6-m-6',
            chapterNumber: 6,
            title: 'Integers',
            titleGujarati: 'પૂર્ણાંક સંખ્યાઓ',
            duration: '16m',
            summary: 'Negative numbers, representation on number line, ordering integers, addition and subtraction of integers.',
            summaryGujarati: 'ધન અને ઋણ પૂર્ણાંકો, સંખ્યારેખા પર નિરૂપણ, પૂર્ણાંકોની સરખામણી, સરવાળા-બાદબાકી.',
            questionCount: 18,
            iconName: 'plus-one',
            textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/femh106.pdf',
          },
          {
            id: 'g6-m-7',
            chapterNumber: 7,
            title: 'Fractions',
            titleGujarati: 'અપૂર્ણાંક સંખ્યાઓ',
            duration: '18m',
            summary: 'Proper, improper, mixed fractions, equivalent fractions, simplest form, like and unlike fractions addition.',
            summaryGujarati: 'શુદ્ધ, અશુદ્ધ અને મિશ્ર અપૂર્ણાંક, સમચ્છેદી-વિષમચ્છેદી અપૂર્ણાંકોના સરવાળા-બાદબાકી.',
            questionCount: 20,
            iconName: 'pie-chart',
            textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/femh107.pdf',
          },
          {
            id: 'g6-m-8',
            chapterNumber: 8,
            title: 'Decimals',
            titleGujarati: 'દશાંશ સંખ્યાઓ',
            duration: '16m',
            summary: 'Tenths, hundredths, place value chart, money and length conversion in decimals, addition/subtraction of decimals.',
            summaryGujarati: 'દશાંશ, શતાંશ, સ્થાનકિંમત કોષ્ટક, રૂપિયા-મીટર-કિલોગ્રામમાં દશાંશનો ઉપયોગ, દશાંશના સરવાળા-બાદબાકી.',
            questionCount: 18,
            iconName: 'linear-scale',
            textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/femh108.pdf',
          },
          {
            id: 'g6-m-9',
            chapterNumber: 9,
            title: 'Data Handling',
            titleGujarati: 'માહિતીનું નિયમન (આલેખ અને આવૃત્તિ કોષ્ટક)',
            duration: '14m',
            summary: 'Recording data, tally marks table, pictographs, interpreting and drawing bar graphs.',
            summaryGujarati: 'માહિતીની નોંધ, આવૃત્તિ ચિહ્ન કોષ્ટક, ચિત્ર આલેખ અને લંબ આલેખનું અર્થઘટન અને રચના.',
            questionCount: 15,
            iconName: 'bar-chart',
            textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/femh109.pdf',
          },
          {
            id: 'g6-m-10',
            chapterNumber: 10,
            title: 'Mensuration (Perimeter & Area)',
            titleGujarati: 'માપન (પરિમિતિ અને ક્ષેત્રફળ)',
            duration: '18m',
            summary: 'Perimeter of rectangle, square, regular polygons. Area of rectangle and square with formula shortcuts.',
            summaryGujarati: 'લંબચોરસ અને ચોરસની પરિમિતિ, નિયમિત બહુકોણની પરિમિતિ, લંબચોરસ અને ચોરસનું ક્ષેત્રફળ.',
            questionCount: 22,
            iconName: 'crop-free',
            textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/femh110.pdf',
            keyFormulas: [
              'Perimeter of Rectangle = 2 × (Length + Breadth)',
              'Perimeter of Square = 4 × Side',
              'Area of Rectangle = Length × Breadth',
              'Area of Square = Side × Side',
            ],
            keyFormulasGujarati: [
              'લંબચોરસની પરિમિતિ = ૨ × (લંબાઈ + પહોળાઈ)',
              'ચોરસની પરિમિતિ = ૪ × બાજુની લંબાઈ',
              'લંબચોરસનું ક્ષેત્રફળ = લંબાઈ × પહોળાઈ',
              'ચોરસનું ક્ષેત્રફળ = બાજુ × બાજુ',
            ],
          },
          {
            id: 'g6-m-11',
            chapterNumber: 11,
            title: 'Algebra',
            titleGujarati: 'બીજગણિત (ચલ અને પદાવલિ)',
            duration: '15m',
            summary: 'Matchstick patterns, variables, expressions with variables, using expressions practically, solving simple linear equations.',
            summaryGujarati: 'દિવાસળીની પેટર્ન, ચલનો ખ્યાલ, ચલ સાથેની પદાવલિઓ અને સમીકરણનો ઉકેલ.',
            questionCount: 18,
            iconName: 'functions',
            textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/femh111.pdf',
          },
          {
            id: 'g6-m-12',
            chapterNumber: 12,
            title: 'Ratio and Proportion',
            titleGujarati: 'ગુણોત્તર અને પ્રમાણ',
            duration: '16m',
            summary: 'Ratio concept, simplest form of ratio, proportions (a:b :: c:d), Unitary Method.',
            summaryGujarati: 'ગુણોત્તરનો ખ્યાલ, અતિસંક્ષિપ્ત રૂપ, પ્રમાણ (a:b :: c:d) અને એકાત્મક પદ્ધતિ.',
            questionCount: 20,
            iconName: 'percent',
            textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/femh112.pdf',
          },
          {
            id: 'g6-m-13',
            chapterNumber: 13,
            title: 'Symmetry',
            titleGujarati: 'સંમિતિ',
            duration: '12m',
            summary: 'Lines of symmetry, symmetrical figures in nature and geometry, kaleidoscope patterns.',
            summaryGujarati: 'સંમિતિની રેખા (અક્ષ), ભૂમિતિક આકારોમાં સંમિતિ, પ્રતિબિંબિત સંમિતિ.',
            questionCount: 12,
            iconName: 'flip',
            textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/femh113.pdf',
          },
          {
            id: 'g6-m-14',
            chapterNumber: 14,
            title: 'Practical Geometry',
            titleGujarati: 'પ્રાયોગિક ભૂમિતિ (રચનાઓ)',
            duration: '15m',
            summary: 'Construction of circle, line segment of given length, perpendicular bisector, angles (30, 45, 60, 90, 120) with compass.',
            summaryGujarati: 'વર્તુળની રચના, રેખાખંડ અને લંબદ્વિભાજક દોરવો, પરિકર અને માપપટ્ટીથી ખૂણાઓની રચના.',
            questionCount: 15,
            iconName: 'mode-edit',
            textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/femh114.pdf',
          },
        ],
      },
      {
        id: 'g6-sci',
        name: 'Science',
        nameGujarati: 'વિજ્ઞાન',
        code: 'SCI6',
        color: '#10b981',
        textbookTitle: 'NCERT / GSEB Science Class 6',
        textbookTitleGujarati: 'ધોરણ ૬ વિજ્ઞાન પાઠ્યપુસ્તક (GSEB)',
        officialTextbookPdf: 'https://ncert.nic.in/textbook.php?fesc1=0-16',
        chapters: [
          {
            id: 'g6-s-1',
            chapterNumber: 1,
            title: 'Food: Where Does It Come From?',
            titleGujarati: 'ખોરાક: ક્યાંથી મળે છે?',
            duration: '12m',
            summary: 'Food ingredients, plant parts & animal products as food, herbivores, carnivores, omnivores.',
            summaryGujarati: 'ખોરાકની સામગ્રી, વનસ્પતિના ખાદ્ય ભાગો, દૂધ-ઈંડા-મધ સ્ત્રોતો, તૃણાહારી, માંસાહારી અને મિશ્રાહારી પ્રાણીઓ.',
            questionCount: 15,
            iconName: 'eco',
            textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/fesc101.pdf',
          },
          {
            id: 'g6-s-2',
            chapterNumber: 2,
            title: 'Components of Food',
            titleGujarati: 'આહારના ઘટકો અને સમતોલ આહાર',
            duration: '16m',
            summary: 'Carbohydrates, fats, proteins, vitamins, minerals, dietary fibers, water, iodine test, deficiency diseases.',
            summaryGujarati: 'કાર્બોહાઇડ્રેટ, ચરબી, પ્રોટીન, વિટામિન, આયોડિન કસોટી, સમતોલ આહાર અને ત્રુટિજન્ય રોગો.',
            questionCount: 20,
            iconName: 'restaurant',
            textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/fesc102.pdf',
            videos: [
              {
                id: 'v-6-s-2-a',
                title: 'Class 6 Science Chapter 2: Components of Food in Gujarati',
                titleGujarati: 'ધોરણ ૬ વિજ્ઞાન – પ્રકરણ ૨: આહારના ઘટકો (GSEB)',
                teacher: 'Vidyakul Gujarati',
                duration: '18m',
                youtubeVideoId: '3G8A8wXyF1w',
                tag: 'GSEB Gujarati Medium',
              },
            ],
          },
          {
            id: 'g6-s-3',
            chapterNumber: 3,
            title: 'Fibre to Fabric',
            titleGujarati: 'રેસાથી કાપડ સુધી',
            duration: '14m',
            summary: 'Natural vs synthetic fibres, cotton ginning and spinning, jute harvesting, weaving and knitting on looms.',
            summaryGujarati: 'કુદરતી અને કૃત્રિમ રેસા, કપાસનું પીંજણ અને કાંતણ, શણના રેસા, વણાટ અને ગૂંથણ.',
            questionCount: 15,
            iconName: 'style',
            textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/fesc103.pdf',
          },
          {
            id: 'g6-s-4',
            chapterNumber: 4,
            title: 'Sorting Materials into Groups',
            titleGujarati: 'પદાર્થોનું જૂથ બનાવવું',
            duration: '12m',
            summary: 'Properties of materials: Lustre, hardness, solubility in water, transparency, flotation.',
            summaryGujarati: 'પદાર્થોના ગુણધર્મો: દેખાવ, સખતપણું, પાણીમાં દ્રાવ્યતા, પારદર્શકતા (પારદર્શક, અપારદર્શક, પારભાસક).',
            questionCount: 15,
            iconName: 'category',
            textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/fesc104.pdf',
          },
          {
            id: 'g6-s-5',
            chapterNumber: 5,
            title: 'Separation of Substances',
            titleGujarati: 'પદાર્થોનું અલગીકરણ',
            duration: '16m',
            summary: 'Handpicking, threshing, winnowing, sieving, sedimentation, decantation, filtration, evaporation, condensation.',
            summaryGujarati: 'વીણવું, અનાજનું છડવું, ઉપણવું, ચાળવું, નિક્ષેપન, નિતારણ, ગાળણ, બાષ્પીભવન અને ઘનીભવન.',
            questionCount: 18,
            iconName: 'filter-alt',
            textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/fesc105.pdf',
          },
          {
            id: 'g6-s-6',
            chapterNumber: 6,
            title: 'Changes Around Us',
            titleGujarati: 'આપણી આસપાસ થતા ફેરફારો',
            duration: '12m',
            summary: 'Reversible vs irreversible changes, physical changes, expansion on heating.',
            summaryGujarati: 'ઉલટાવી શકાય તેવા અને ઉલટાવી ન શકાય તેવા ફેરફારો, ગરમ કરવાથી થતું પ્રસરણ.',
            questionCount: 14,
            iconName: 'sync-alt',
            textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/fesc106.pdf',
          },
          {
            id: 'g6-s-7',
            chapterNumber: 7,
            title: 'Getting to Know Plants',
            titleGujarati: 'વનસ્પતિની જાણકારી મેળવીએ',
            duration: '18m',
            summary: 'Herbs, shrubs, trees, tap root vs fibrous root, reticulate vs parallel venation, parts of flower.',
            summaryGujarati: 'છોડ, ક્ષુપ, વૃક્ષ, સોટીમય-તંતુમય મૂળ, જાલાકાર-સમાંતર શિરાવિન્યાસ, પુષ્પના અંગો.',
            questionCount: 20,
            iconName: 'park',
            textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/fesc107.pdf',
          },
          {
            id: 'g6-s-8',
            chapterNumber: 8,
            title: 'Body Movements',
            titleGujarati: 'શરીરનું હલનચલન (સાંધાઓ અને કંકાલ)',
            duration: '16m',
            summary: 'Ball & socket joint, hinge joint, pivotal joint, human skeleton, movement in earthworm, snail, birds, fish.',
            summaryGujarati: 'ખલ-દસ્તો સાંધો, મિજાગરા સાંધો, ઉખળી સાંધો, અળસિયું, ગોકળગાય, પક્ષીઓ અને માછલીનું હલનચલન.',
            questionCount: 18,
            iconName: 'accessibility-new',
            textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/fesc108.pdf',
          },
          {
            id: 'g6-s-9',
            chapterNumber: 9,
            title: 'Living Organisms & Surroundings',
            titleGujarati: 'સજીવો અને તેમની આસપાસ (અનુકૂલન)',
            duration: '16m',
            summary: 'Habitat types (terrestrial, aquatic), adaptations of camel, fish, cactus, characteristics of living things.',
            summaryGujarati: 'નિવાસસ્થાન, રણપ્રદેશ-પર્વતીય-જલીય અનુકૂલન, સજીવોના સામાન્ય લક્ષણો.',
            questionCount: 18,
            iconName: 'nature-people',
            textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/fesc109.pdf',
          },
          {
            id: 'g6-s-10',
            chapterNumber: 10,
            title: 'Motion & Measurement of Distances',
            titleGujarati: 'ગતિ અને અંતરનું માપન',
            duration: '14m',
            summary: 'Story of transport, SI standard units (metre), rectilinear, circular and periodic motion.',
            summaryGujarati: 'વાહનવ્યવહારની વાર્તા, SI એકમ (મીટર), સુરેખ ગતિ, વર્તુળાકાર ગતિ અને આવર્ત ગતિ.',
            questionCount: 16,
            iconName: 'straighten',
            textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/fesc110.pdf',
          },
          {
            id: 'g6-s-11',
            chapterNumber: 11,
            title: 'Light, Shadows & Reflections',
            titleGujarati: 'પ્રકાશ, પડછાયો અને પરાવર્તન',
            duration: '15m',
            summary: 'Luminous objects, transparent/translucent/opaque, shadow formation, pinhole camera, reflection from mirror.',
            summaryGujarati: 'પ્રકાશિત પદાર્થો, પડછાયો કેવી રીતે બને, પિનહોલ કેમેરા અને સમતલ અરીસા વડે પરાવર્તન.',
            questionCount: 18,
            iconName: 'lightbulb',
            textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/fesc111.pdf',
          },
          {
            id: 'g6-s-12',
            chapterNumber: 12,
            title: 'Electricity & Circuits',
            titleGujarati: 'વિદ્યુત તથા પરિપથ',
            duration: '16m',
            summary: 'Electric cell, bulb filament, closed circuit, electric switch, conductors and insulators.',
            summaryGujarati: 'વિદ્યુતકોષ, બલ્બનો ફિલામેન્ટ, બંધ પરિપથ, વિદ્યુત સ્વિચ, સુવાહકો અને અવાહકો.',
            questionCount: 18,
            iconName: 'bolt',
            textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/fesc112.pdf',
          },
          {
            id: 'g6-s-13',
            chapterNumber: 13,
            title: 'Fun with Magnets',
            titleGujarati: 'ચુંબક સાથે ગમ્મત',
            duration: '14m',
            summary: 'Magnetic vs non-magnetic materials, North and South poles, magnetic compass, attraction and repulsion rules.',
            summaryGujarati: 'ચુંબકીય પદાર્થો, ઉત્તર અને દક્ષિણ ધ્રુવ, હોકાયંત્ર, આકર્ષણ અને અપાકર્ષણના નિયમો.',
            questionCount: 16,
            iconName: 'explore',
            textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/fesc113.pdf',
          },
          {
            id: 'g6-s-14',
            chapterNumber: 14,
            title: 'Water',
            titleGujarati: 'પાણી અને જળચક્ર',
            duration: '12m',
            summary: 'Water cycle, evaporation and transpiration, cloud formation, floods, drought, rainwater harvesting.',
            summaryGujarati: 'જળચક્ર, બાષ્પીભવન અને બાષ્પોત્સર્જન, વાદળો બનવા, પૂર અને દુષ્કાળ, વરસાદી પાણીનો સંગ્રહ.',
            questionCount: 15,
            iconName: 'water-drop',
            textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/fesc114.pdf',
          },
          {
            id: 'g6-s-15',
            chapterNumber: 15,
            title: 'Air Around Us',
            titleGujarati: 'આપણી આસપાસની હવા',
            duration: '12m',
            summary: 'Atmosphere, composition of air (Nitrogen 78%, Oxygen 21%, Carbon dioxide, water vapor), respiration in aquatic animals.',
            summaryGujarati: 'વાતાવરણ, હવાનું બંધારણ (નાઇટ્રોજન, ઓક્સિજન, કાર્બન ડાયોક્સાઇડ), શ્વસન અને પવનચક્કી.',
            questionCount: 15,
            iconName: 'air',
            textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/fesc115.pdf',
          },
          {
            id: 'g6-s-16',
            chapterNumber: 16,
            title: 'Garbage In, Garbage Out',
            titleGujarati: 'કચરાનો સંગ્રહ અને નિકાલ (Vermicomposting)',
            duration: '12m',
            summary: 'Biodegradable vs non-biodegradable waste, Vermicomposting using Redworms, recycling paper, plastics hazards.',
            summaryGujarati: 'કચરાનું વર્ગીકરણ, લાલ અળસિયાં વડે વર્મીકમ્પોસ્ટિંગ ખાતર, કાગળનું રિસાયક્લિંગ, પ્લાસ્ટિકનો મર્યાદિત ઉપયોગ.',
            questionCount: 14,
            iconName: 'delete-sweep',
            textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/fesc116.pdf',
          },
        ],
      },
      {
        id: 'g6-soc',
        name: 'Social Science',
        nameGujarati: 'સામાજિક વિજ્ઞાન',
        code: 'SOC6',
        color: '#f59e0b',
        textbookTitle: 'GSEB Social Science Class 6 (સમાજ વિદ્યા)',
        textbookTitleGujarati: 'ધોરણ ૬ સામાજિક વિજ્ઞાન પાઠ્યપુસ્તક (GSEB)',
        officialTextbookPdf: 'https://gujarat-education.gov.in/textbook/std6_ss.pdf',
        chapters: [
          {
            id: 'g6-ss-1',
            chapterNumber: 1,
            title: 'What, Where, How and When? (History)',
            titleGujarati: 'ચાલો, ઇતિહાસ જાણીએ',
            duration: '14m',
            summary: 'Inscriptions, Bhojpatra, copper plates (Tamrapatra), punch-marked coins, archaeology sources.',
            summaryGujarati: 'ઇતિહાસ જાણવાના સ્ત્રોતો: તાળપત્ર, ભોજપત્ર, અભિલેખો, તામ્રપત્ર, સિક્કા અને પુરાતત્વીય ઉત્ખનન.',
            questionCount: 15,
            iconName: 'history-edu',
            textbookPdfUrl: 'https://gujarat-education.gov.in/textbook/std6_ss_ch1.pdf',
          },
          {
            id: 'g6-ss-2',
            chapterNumber: 2,
            title: 'From Primitive Man to Settled Life',
            titleGujarati: 'આદિમાનવથી સ્થાયી જીવનની સફર',
            duration: '15m',
            summary: 'Nomadic life, hunting and food gathering, discovery of fire and wheel, early farming settlements (Mehrgarh, Burzahom).',
            summaryGujarati: 'ભટકતું જીવન, અગ્નિ અને ચક્રની શોધ, કૃષિ અને પશુપાલનની શરૂઆત, મેહરગઢ અને બુર્ઝહોમના પુરાવા.',
            questionCount: 16,
            iconName: 'fireplace',
          },
          {
            id: 'g6-ss-3',
            chapterNumber: 3,
            title: 'Ancient Cities and Texts (Harappan Culture)',
            titleGujarati: 'પ્રાચીન નગરો અને ગ્રંથો (હડપ્પા અને લોથલ)',
            duration: '18m',
            summary: 'Indus Valley Civilization, Town planning of Harappa, Mohenjodaro Great Bath, Lothal port dockyard, Dholavira, Vedas.',
            summaryGujarati: 'હડપ્પીય સંસ્કૃતિનું નગર આયોજન, મોહેં-જો-દડોનું સ્નાનાગાર, લોથલ બંદરનો ધક્કો (ડોકયાર્ડ), ધોળાવીરા, ઋગ્વેદ.',
            questionCount: 20,
            iconName: 'location-city',
          },
          {
            id: 'g6-ss-4',
            chapterNumber: 4,
            title: 'Early State Systems in India (Mahajanapadas)',
            titleGujarati: 'ભારતની પ્રારંભિક રાજ્યવ્યવસ્થા (ગણરાજ્યો)',
            duration: '15m',
            summary: 'Janapada and Mahajanapadas (16), Republics of Vaishali, Magadha Rise under Bimbisara and Ajatashatru.',
            summaryGujarati: '૧૬ મહાજનપદો, વૈશાલીનું ગણરાજ્ય, મગધ સામ્રાજ્યનો ઉદય, બિમ્બિસાર અને અજાતશત્રુ.',
            questionCount: 16,
            iconName: 'account-balance',
          },
          {
            id: 'g6-ss-5',
            chapterNumber: 5,
            title: 'In Search of Peace: Buddha and Mahavira',
            titleGujarati: 'શાંતિની શોધમાં: બુદ્ધ અને મહાવીર',
            duration: '16m',
            summary: 'Gautama Buddha life, enlightenment, teachings (Four Noble Truths, Eightfold Path), Vardhamana Mahavira and Jainism.',
            summaryGujarati: 'ગૌતમ બુદ્ધનું જીવન, ઉપદેશ (આર્યસત્ય), વર્ધમાન મહાવીર અને જૈન ધર્મના પંચમહાવ્રતો.',
            questionCount: 18,
            iconName: 'spa',
          },
          {
            id: 'g6-ss-6',
            chapterNumber: 6,
            title: 'Mauryan Empire: Chandragupta & Emperor Ashoka',
            titleGujarati: 'મૌર્યયુગ: ચંદ્રગુપ્ત અને સમ્રાટ અશોક',
            duration: '18m',
            summary: 'Chanakya (Kautilya) Arthashastra, Megasthenes Indica, Kalinga War and Ashoka Dhamma, Ashoka Edicts at Junagadh.',
            summaryGujarati: 'ચાણક્યનું અર્થશાસ્ત્ર, કલિંગનું યુદ્ધ અને અશોકનું હૃદયપરિવર્તન, જૂનાગઢનો શિલાલેખ અને બૌદ્ધ ધર્મ પ્રચાર.',
            questionCount: 20,
            iconName: 'military-tech',
          },
          {
            id: 'g6-ss-7',
            chapterNumber: 7,
            title: 'Gupta Age and Other Rulers',
            titleGujarati: 'ગુપ્તયુગ અને અન્ય શાસકો (સુવર્ણયુગ)',
            duration: '16m',
            summary: 'Golden Age of India, Chandragupta II (Vikramaditya), Kalidasa, Aryabhata, Harshavardhana and Pulakeshin II.',
            summaryGujarati: 'ભારતનો સુવર્ણયુગ, ચંદ્રગુપ્ત વિક્રમાદિત્ય, નવરત્નો, આર્યભટ્ટની ખગોળ સિદ્ધિ, સમ્રાટ હર્ષવર્ધન.',
            questionCount: 18,
            iconName: 'workspace-premium',
          },
          {
            id: 'g6-ss-8',
            chapterNumber: 8,
            title: 'Glory of Bharatvarsha',
            titleGujarati: 'ભારતવર્ષની ભવ્યતા (પ્રાચીન સાહિત્ય અને કલા)',
            duration: '15m',
            summary: 'Ancient Indian literature (Vedas, Upanishads, Sangam literature), architecture, coins, trade routes.',
            summaryGujarati: 'પ્રાચીન ભારતીય સાહિત્ય, સ્તૂપ અને મંદિરો, સિક્કાઓ, નાલંદા અને વલ્લભી વિદ્યાપીઠ.',
            questionCount: 16,
            iconName: 'temple-hindu',
          },
          {
            id: 'g6-ss-9',
            chapterNumber: 9,
            title: 'The Earth in Solar System (Geography)',
            titleGujarati: 'આપણું ઘર પૃથ્વી અને સૌર પરિવાર',
            duration: '16m',
            summary: 'Solar system, planets, Earth atmosphere, Moon phases, latitudes, longitudes, Prime Meridian, rotation, revolution.',
            summaryGujarati: 'સૂર્યમંડળ, ગ્રહો, અક્ષાંશ અને રેખાંશ વૃત્તો, ગ્રીનિચ રેખા, પૃથ્વીની પરિભ્રમણ અને પરિક્રમણ ગતિ, ઋતુઓ.',
            questionCount: 20,
            iconName: 'public',
          },
          {
            id: 'g6-ss-10',
            chapterNumber: 10,
            title: 'Spheres of the Earth',
            titleGujarati: 'પૃથ્વીના આવરણો (મૃદાવરણ, જલાવરણ, વાતાવરણ, જીવાવરણ)',
            duration: '15m',
            summary: 'Lithosphere, Hydrosphere, Atmosphere gases, Biosphere balance and environmental conservation.',
            summaryGujarati: 'મૃદાવરણ (જમીન), જલાવરણ (મહાસાગરો), વાતાવરણના વાયુઓ, જીવાવરણ અને પ્રદૂષણ નિવારણ.',
            questionCount: 18,
            iconName: 'layers',
          },
        ],
      },
      {
        id: 'g6-eng',
        name: 'English',
        nameGujarati: 'અંગ્રેજી',
        code: 'ENG6',
        color: '#6366f1',
        textbookTitle: 'NCERT Honeysuckle / A Pact with the Sun Class 6',
        textbookTitleGujarati: 'ધોરણ ૬ અંગ્રેજી પાઠ્યપુસ્તક (Honeysuckle)',
        officialTextbookPdf: 'https://ncert.nic.in/textbook.php?fehl1=0-10',
        chapters: [
          {
            id: 'g6-e-1',
            chapterNumber: 1,
            title: "Who Did Patrick's Homework? & A House, A Home",
            titleGujarati: "પેત્રિકનું ગૃહકાર્ય (A House, A Home કાવ્ય)",
            duration: '15m',
            summary: "Patrick hated homework, gets help from an elf, learns self-reliance. Poem difference between a house and a loving home.",
            summaryGujarati: 'પેત્રિકને હોમવર્ક કરવું ગમતું નહોતું, નાનકડા માણસની મદદથી પોતે મહેનત કરીને પ્રથમ નંબરે પાસ થયો.',
            questionCount: 16,
            iconName: 'menu-book',
            textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/fehl101.pdf',
          },
          {
            id: 'g6-e-2',
            chapterNumber: 2,
            title: 'How the Dog Found Himself a New Master! & The Kite',
            titleGujarati: 'કૂતરાને નવો માલિક કેવી રીતે મળ્યો (The Kite કાવ્ય)',
            duration: '14m',
            summary: 'The dog searches for the strongest master on earth (Wolf, Bear, Lion, and finally Man).',
            summaryGujarati: 'કૂતરો સૌથી શક્તિશાળી સાથીની શોધમાં વરુ, રીંછ, સિંહ અને અંતે માનવીનો વિશ્વાસુ મિત્ર બન્યો.',
            questionCount: 15,
            iconName: 'pets',
            textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/fehl102.pdf',
          },
          {
            id: 'g6-e-3',
            chapterNumber: 3,
            title: "Taro's Reward & The Quarrel",
            titleGujarati: "તારોનો પુરસ્કાર (Taro's Reward)",
            duration: '15m',
            summary: 'Taro, a thoughtful Japanese woodcutter, rewards his old parents with sake from a waterfall magic spring.',
            summaryGujarati: 'માતા-પિતાની સેવા કરનાર આજ્ઞાંકિત પુત્ર તારોને રાજા દ્વારા આપવામાં આવેલ પુરસ્કારની વાર્તા.',
            questionCount: 16,
            iconName: 'emoji-events',
            textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/fehl103.pdf',
          },
          {
            id: 'g6-e-4',
            chapterNumber: 4,
            title: 'Kalpana Chawla - An Indian Woman in Space',
            titleGujarati: 'કલ્પના ચાવલા – અવકાશમાં ભારતની દીકરી',
            duration: '16m',
            summary: 'Biography of Kalpana Chawla, space mission Columbia STS-107, hard work and chasing big dreams.',
            summaryGujarati: 'ભારતની પ્રથમ મહિલા અવકાશયાત્રી કલ્પના ચાવલાનું જીવનચરિત્ર અને પ્રેરણાદાયી સંદેશ.',
            questionCount: 18,
            iconName: 'rocket-launch',
            textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/fehl104.pdf',
          },
          {
            id: 'g6-e-5',
            chapterNumber: 5,
            title: 'English Grammar (Tenses, Articles & Prepositions)',
            titleGujarati: 'અંગ્રેજી વ્યાકરણ (Tenses, Articles & Prepositions)',
            duration: '18m',
            summary: 'Simple Present, Past, Continuous Tenses, A/An/The usage, Prepositions of place and time.',
            summaryGujarati: 'કાળના નિયમો (Present, Past, Future), આર્ટિકલ (A, An, The), Prepositions અને વિરામચિહ્નો.',
            questionCount: 25,
            iconName: 'spellcheck',
          },
        ],
      },
      {
        id: 'g6-guj',
        name: 'Gujarati',
        nameGujarati: 'ગુજરાતી (માતૃભાષા)',
        code: 'GUJ6',
        color: '#ec4899',
        textbookTitle: 'GSEB Gujarati Textbook Class 6 (પલાશ / કલ્લોલ)',
        textbookTitleGujarati: 'ધોરણ ૬ ગુજરાતી પાઠ્યપુસ્તક (GSEB)',
        officialTextbookPdf: 'https://gujarat-education.gov.in/textbook/std6_guj.pdf',
        chapters: [
          {
            id: 'g6-g-1',
            chapterNumber: 1,
            title: 'રેલવે સ્ટેશન (ચિત્રપાઠ)',
            titleGujarati: 'પ્રકરણ ૧: રેલવે સ્ટેશન (ચિત્રપાઠ)',
            duration: '10m',
            summary: 'રેલવે સ્ટેશન પરની પ્રવૃત્તિઓ, સ્ટોલ, ફેરિયાઓ, કુલી, મુસાફરો અને ચિત્ર અવલોકન પ્રશ્નોત્તરી.',
            summaryGujarati: 'રેલવે સ્ટેશન પરના બુકસ્ટોલ, ટી-સ્ટોલ, ટિકિટબારી અને ચિત્ર આધારિત સ્વાધ્યાય.',
            questionCount: 15,
            iconName: 'directions-transit',
            textbookPdfUrl: 'https://gujarat-education.gov.in/textbook/std6_guj_ch1.pdf',
          },
          {
            id: 'g6-g-2',
            chapterNumber: 2,
            title: 'એક જ દે ચિનગારી (પ્રાર્થના કાવ્ય - હરિહર ભટ્ટ)',
            titleGujarati: 'પ્રકરણ ૨: એક જ દે ચિનગારી (પ્રાર્થના ગીત)',
            duration: '12m',
            summary: 'હરિહર ભટ્ટ રચિત મહાનલ પરમાત્મા પાસે જ્ઞાનની ચિનગારી માગતી ભવ્ય પ્રાર્થના, શબ્દાર્થ અને સ્વાધ્યાય.',
            summaryGujarati: 'પરમાત્મા પાસે ધન-દોલત નહીં પણ જ્ઞાનરૂપી પ્રકાશની ચિનગારીની યાચના.',
            questionCount: 15,
            iconName: 'music-note',
            textbookPdfUrl: 'https://gujarat-education.gov.in/textbook/std6_guj_ch2.pdf',
          },
          {
            id: 'g6-g-3',
            chapterNumber: 3,
            title: 'દ્વિદલ (બોધવાર્તા - ડૉ. આઇ. કે. વીજળીવાળા)',
            titleGujarati: 'પ્રકરણ ૩: દ્વિદલ (મૂર્તિ અને સ્વમૂલ્યાંકન)',
            duration: '14m',
            summary: 'બે પ્રેરણાદાયી બોધવાર્તાઓ: શિલ્પીની ઈશ્વર પ્રત્યેની નિષ્ઠા અને યુવકનું ફોન દ્વારા સ્વમૂલ્યાંકન.',
            summaryGujarati: 'પ્રામાણિકતા, આત્મનિષ્ઠા અને પોતાના કામનું સંતોષકારક સ્વમૂલ્યાંકન.',
            questionCount: 16,
            iconName: 'menu-book',
          },
          {
            id: 'g6-g-4',
            chapterNumber: 4,
            title: 'રવિશંકર મહારાજ (જીવનચરિત્ર - ધીરુભાઈ પરીખ)',
            titleGujarati: 'પ્રકરણ ૪: રવિશંકર મહારાજ (મુખસેવક)',
            duration: '16m',
            summary: 'મૂકસેવક રવિશંકર મહારાજનું સેવામય જીવન, બહારવટિયાઓને સુધારવાનું કાર્ય, ગુજરાત રાજ્ય સ્થાપના.',
            summaryGujarati: 'ગુજરાતના મુખસેવક રવિશંકર વ્યાસનું નિઃસ્વાર્થ લોકસેવાનું જીવનચરિત્ર.',
            questionCount: 18,
            iconName: 'volunteer-activism',
          },
          {
            id: 'g6-g-5',
            chapterNumber: 5,
            title: 'મહેનતની મોસમ (પ્રકૃતિગીત - નાથાલાલ દવે)',
            titleGujarati: 'પ્રકરણ ૫: મહેનતની મોસમ (લણણી ગીત)',
            duration: '12m',
            summary: 'સોનાવર્ણી સીમ બની, લણણીની ઋતુમાં ખેડૂતોનો આનંદ અને પ્રકૃતિનું સૌંદર્ય.',
            summaryGujarati: 'વરસાદ પછી સોનેરી બનેલી સીમમાં ખેડૂતોની મહેનત અને ઉલ્લાસનું ગીત.',
            questionCount: 15,
            iconName: 'agriculture',
          },
          {
            id: 'g6-g-6',
            chapterNumber: 6,
            title: 'ગુજરાતી વ્યાકરણ (નામ, સર્વનામ, રૂઢિપ્રયોગો & જોડણી)',
            titleGujarati: 'વ્યાકરણ (સંજ્ઞા, સર્વનામ, વિશેષણ & કહેવતો)',
            duration: '18m',
            summary: 'સંજ્ઞાના પ્રકારો (વ્યક્તિવાચક, જાતિવાચક, દ્રવ્યવાચક, સમૂહવાચક), રૂઢિપ્રયોગો અને વિરામચિહ્નો.',
            summaryGujarati: 'નામ, સર્વનામ, વિશેષણ, ક્રિયાપદ, રૂઢિપ્રયોગો, સમાનાર્થી-વિરોધી અને શબ્દકોશનો ક્રમ.',
            questionCount: 25,
            iconName: 'edit-note',
          },
        ],
      },
    ],
  },
  '7': {
    grade: '7',
    title: 'Class 7 Curriculum',
    description: 'NCERT & GSEB Complete Middle School Subjects for Class 7',
    badge: 'CLASS 7 • MIDDLE SCHOOL',
    subjects: [
      {
        id: 'g7-math',
        name: 'Mathematics',
        nameGujarati: 'ગણિત',
        code: 'MATH7',
        color: '#3b82f6',
        textbookTitle: 'NCERT / GSEB Mathematics Class 7',
        textbookTitleGujarati: 'ધોરણ ૭ ગણિત પાઠ્યપુસ્તક (GSEB)',
        officialTextbookPdf: 'https://ncert.nic.in/textbook.php?gemh1=0-15',
        chapters: [
          { id: 'g7-m-1', chapterNumber: 1, title: 'Integers', titleGujarati: 'પૂર્ણાંક સંખ્યાઓ', duration: '15m', summary: 'Multiplication & division of integers, properties (closure, commutative, associative, distributive).', summaryGujarati: 'પૂર્ણાંકોનો ગુણાકાર અને ભાગાકાર, સંવૃતતા અને વિભાજનનો નિયમ.', questionCount: 20, iconName: 'calculate', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/gemh101.pdf' },
          { id: 'g7-m-2', chapterNumber: 2, title: 'Fractions and Decimals', titleGujarati: 'અપૂર્ણાંક અને દશાંશ સંખ્યાઓ', duration: '16m', summary: 'Multiplication and division of fractions, decimal operations with power of 10.', summaryGujarati: 'અપૂર્ણાંકોનો ગુણાકાર-ભાગાકાર અને દશાંશની ગણતરી.', questionCount: 18, iconName: 'pie-chart', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/gemh102.pdf' },
          { id: 'g7-m-3', chapterNumber: 3, title: 'Data Handling', titleGujarati: 'માહિતીનું નિયમન', duration: '14m', summary: 'Arithmetic Mean, Mode, Median of ungrouped data, probability basics and bar graphs.', summaryGujarati: 'સરાસરી (મધ્યક), બહુલક, મધ્યસ્થ અને સંભાવના.', questionCount: 16, iconName: 'bar-chart', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/gemh103.pdf' },
          { id: 'g7-m-4', chapterNumber: 4, title: 'Simple Equations', titleGujarati: 'સાદા સમીકરણ', duration: '16m', summary: 'Setting up linear equations in one variable, solving via transposition method.', summaryGujarati: 'એકચલ સુરેખ સમીકરણની રચના અને પક્ષાંતર રીતથી ઉકેલ.', questionCount: 20, iconName: 'functions', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/gemh104.pdf' },
          { id: 'g7-m-5', chapterNumber: 5, title: 'Lines and Angles', titleGujarati: 'રેખાઓ અને ખૂણા', duration: '15m', summary: 'Complementary, supplementary, vertically opposite angles, transversal lines & parallel lines.', summaryGujarati: 'કોટિકોણ, પૂરકકોણ, અભિકોણ, છેદિકા અને સમાંતર રેખાઓ.', questionCount: 18, iconName: 'architecture', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/gemh105.pdf' },
          { id: 'g7-m-6', chapterNumber: 6, title: 'The Triangle and Its Properties', titleGujarati: 'ત્રિકોણ અને તેના ગુણધર્મો', duration: '18m', summary: 'Medians, altitudes, exterior angle theorem, angle sum property, Pythagoras theorem.', summaryGujarati: 'મધ્યગા, વેધ, બહિષ્કોણ પ્રમેય, ત્રિકોણના ખૂણાઓનો સરવાળો, પાયથાગોરસ પ્રમેય.', questionCount: 22, iconName: 'change-history', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/gemh106.pdf' },
          { id: 'g7-m-7', chapterNumber: 7, title: 'Comparing Quantities', titleGujarati: 'રાશિઓની તુલના (ટકાવારી અને સાદું વ્યાજ)', duration: '18m', summary: 'Percentages, profit and loss percentages, Simple Interest formula (I = PRT/100).', summaryGujarati: 'ટકાવારી, નફો-ખોટ ટકાવારી અને સાદું વ્યાજ (I = PRN/100).', questionCount: 24, iconName: 'percent', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/gemh107.pdf' },
          { id: 'g7-m-8', chapterNumber: 8, title: 'Perimeter and Area', titleGujarati: 'પરિમિતિ અને ક્ષેત્રફળ (સમાંતરબાજુ અને વર્તુળ)', duration: '18m', summary: 'Area of Parallelogram = b × h, Area of Triangle = 1/2 × b × h, Circle Circumference = 2πr, Area = πr².', summaryGujarati: 'સમાંતરબાજુ ચતુષ્કોણ અને ત્રિકોણનું ક્ષેત્રફળ, વર્તુળનો પરિઘ અને ક્ષેત્રફળ.', questionCount: 20, iconName: 'crop-free', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/gemh108.pdf' },
        ],
      },
      {
        id: 'g7-sci',
        name: 'Science',
        nameGujarati: 'વિજ્ઞાન',
        code: 'SCI7',
        color: '#10b981',
        textbookTitle: 'NCERT / GSEB Science Class 7',
        textbookTitleGujarati: 'ધોરણ ૭ વિજ્ઞાન પાઠ્યપુસ્તક (GSEB)',
        officialTextbookPdf: 'https://ncert.nic.in/textbook.php?gesc1=0-18',
        chapters: [
          { id: 'g7-s-1', chapterNumber: 1, title: 'Nutrition in Plants', titleGujarati: 'વનસ્પતિમાં પોષણ', duration: '14m', summary: 'Autotrophic and heterotrophic nutrition, photosynthesis equation, stomata, parasitic plants (Cuscuta).', questionCount: 16, iconName: 'eco', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/gesc101.pdf' },
          { id: 'g7-s-2', chapterNumber: 2, title: 'Nutrition in Animals', titleGujarati: 'પ્રાણીઓમાં પોષણ', duration: '16m', summary: 'Human digestive canal (mouth, stomach, small intestine, liver, pancreas), digestion in grass-eating animals.', questionCount: 18, iconName: 'restaurant', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/gesc102.pdf' },
          { id: 'g7-s-3', chapterNumber: 3, title: 'Heat & Temperature', titleGujarati: 'ઉષ્મા અને તાપમાન', duration: '14m', summary: 'Clinical vs laboratory thermometers, modes of heat transfer: Conduction, Convection, Radiation, sea breeze.', questionCount: 18, iconName: 'thermostat', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/gesc103.pdf' },
          { id: 'g7-s-4', chapterNumber: 4, title: 'Acids, Bases and Salts', titleGujarati: 'એસિડ, બેઇઝ અને ક્ષાર', duration: '18m', summary: 'Litmus indicators, phenolphthalein, China rose indicator, neutralization reactions in everyday life.', questionCount: 20, iconName: 'science', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/gesc104.pdf' },
          { id: 'g7-s-5', chapterNumber: 5, title: 'Physical and Chemical Changes', titleGujarati: 'ભૌતિક અને રાસાયણિક ફેરફારો', duration: '15m', summary: 'Rusting of iron, galvanization, crystallization, burning of magnesium ribbon.', questionCount: 16, iconName: 'autorenew', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/gesc105.pdf' },
          { id: 'g7-s-6', chapterNumber: 6, title: 'Respiration in Organisms', titleGujarati: 'સજીવોમાં શ્વસન', duration: '15m', summary: 'Aerobic vs anaerobic respiration, breathing mechanism, human respiratory system, breathing in fish and earthworm.', questionCount: 16, iconName: 'air', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/gesc106.pdf' },
          { id: 'g7-s-7', chapterNumber: 7, title: 'Transportation in Animals and Plants', titleGujarati: 'પ્રાણીઓ અને વનસ્પતિઓમાં વહન', duration: '16m', summary: 'Human circulatory system, heart structure, arteries and veins, xylem and phloem in plants, transpiration.', questionCount: 18, iconName: 'favorite', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/gesc107.pdf' },
          { id: 'g7-s-8', chapterNumber: 8, title: 'Reproduction in Plants', titleGujarati: 'વનસ્પતિમાં પ્રજનન', duration: '15m', summary: 'Asexual reproduction (vegetative propagation, budding, fragmentation, spores), sexual reproduction, pollination.', questionCount: 18, iconName: 'local-florist', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/gesc108.pdf' },
        ],
      },
    ],
  },
  '8': {
    grade: '8',
    title: 'Class 8 Curriculum',
    description: 'NCERT & GSEB Core Secondary Preparation Across All Subjects',
    badge: 'CLASS 8 • SECONDARY PREP',
    subjects: [
      {
        id: 'g8-math',
        name: 'Mathematics',
        nameGujarati: 'ગણિત',
        code: 'MATH8',
        color: '#3b82f6',
        textbookTitle: 'NCERT / GSEB Mathematics Class 8',
        textbookTitleGujarati: 'ધોરણ ૮ ગણિત પાઠ્યપુસ્તક (GSEB)',
        officialTextbookPdf: 'https://ncert.nic.in/textbook.php?hemh1=0-16',
        chapters: [
          { id: 'g8-m-1', chapterNumber: 1, title: 'Rational Numbers', titleGujarati: 'સંમેય સંખ્યાઓ', duration: '18m', summary: 'Closure, commutativity, associativity, distributive law, additive & multiplicative identities.', questionCount: 20, iconName: 'calculate', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/hemh101.pdf' },
          { id: 'g8-m-2', chapterNumber: 2, title: 'Linear Equations in One Variable', titleGujarati: 'એકચલ સુરેખ સમીકરણ', duration: '18m', summary: 'Solving equations having linear expressions on one side and variables on both sides.', questionCount: 20, iconName: 'functions', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/hemh102.pdf' },
          { id: 'g8-m-3', chapterNumber: 3, title: 'Understanding Quadrilaterals', titleGujarati: 'ચતુષ્કોણની સમજ', duration: '16m', summary: 'Polygons, angle sum property of convex polygon, parallelogram, rhombus, rectangle, square properties.', questionCount: 18, iconName: 'crop-square', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/hemh103.pdf' },
          { id: 'g8-m-4', chapterNumber: 4, title: 'Squares and Square Roots', titleGujarati: 'વર્ગ અને વર્ગમૂળ', duration: '16m', summary: 'Square numbers, Pythagorean triplets, prime factorization and long division method for square roots.', questionCount: 22, iconName: 'exposure', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/hemh104.pdf' },
          { id: 'g8-m-5', chapterNumber: 5, title: 'Cubes and Cube Roots', titleGujarati: 'ઘન અને ઘનમૂળ', duration: '14m', summary: 'Hardy-Ramanujan numbers, prime factorization method for finding cube roots.', questionCount: 16, iconName: 'view-in-ar', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/hemh105.pdf' },
          { id: 'g8-m-6', chapterNumber: 6, title: 'Comparing Quantities (Compound Interest)', titleGujarati: 'રાશિઓની તુલના (ચક્રવૃદ્ધિ વ્યાજ)', duration: '20m', summary: 'Discount, Sales tax/GST, Compound Interest formula: A = P(1 + R/100)^n.', questionCount: 25, iconName: 'percent', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/hemh106.pdf' },
          { id: 'g8-m-7', chapterNumber: 7, title: 'Algebraic Expressions and Identities', titleGujarati: 'બેઝિક પદાવલિઓ અને નિત્યસમો', duration: '18m', summary: 'Polynomial multiplication, Standard identities: (a+b)², (a-b)², (a+b)(a-b).', questionCount: 22, iconName: 'functions', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/hemh107.pdf' },
          { id: 'g8-m-8', chapterNumber: 8, title: 'Mensuration (Area & Volume)', titleGujarati: 'ક્ષેત્રફળ અને ઘનફળ', duration: '20m', summary: 'Trapezium area, Surface area and volume of cuboid, cube, and right circular cylinder.', questionCount: 25, iconName: 'crop-free', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/hemh108.pdf' },
        ],
      },
      {
        id: 'g8-sci',
        name: 'Science',
        nameGujarati: 'વિજ્ઞાન',
        code: 'SCI8',
        color: '#10b981',
        textbookTitle: 'NCERT / GSEB Science Class 8',
        textbookTitleGujarati: 'ધોરણ ૮ વિજ્ઞાન પાઠ્યપુસ્તક (GSEB)',
        officialTextbookPdf: 'https://ncert.nic.in/textbook.php?hesc1=0-18',
        chapters: [
          { id: 'g8-s-1', chapterNumber: 1, title: 'Crop Production and Management', titleGujarati: 'પાક ઉત્પાદન અને વ્યવસ્થાપન', duration: '15m', summary: 'Kharif vs Rabi crops, agricultural practices: tilling, sowing, manure & fertilizers, drip & sprinkler irrigation.', questionCount: 18, iconName: 'agriculture', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/hesc101.pdf' },
          { id: 'g8-s-2', chapterNumber: 2, title: 'Microorganisms: Friend and Foe', titleGujarati: 'સૂક્ષ્મજીવો: મિત્ર અને શત્રુ', duration: '16m', summary: 'Bacteria, fungi, protozoa, algae, viruses, fermentation, antibiotics, vaccines, food preservation techniques.', questionCount: 20, iconName: 'biotech', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/hesc102.pdf' },
          { id: 'g8-s-3', chapterNumber: 3, title: 'Coal and Petroleum', titleGujarati: 'કોલસો અને પેટ્રોલિયમ', duration: '14m', summary: 'Fossil fuels, destructive distillation of coal, petroleum refining, conservation of natural resources.', questionCount: 16, iconName: 'local-gas-station', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/hesc103.pdf' },
          { id: 'g8-s-4', chapterNumber: 4, title: 'Combustion and Flame', titleGujarati: 'દહન અને જ્યોત', duration: '15m', summary: 'Ignition temperature, inflammable substances, fire extinguishers, zones of candle flame, calorific value.', questionCount: 18, iconName: 'whatshot', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/hesc104.pdf' },
          { id: 'g8-s-5', chapterNumber: 5, title: 'Cell — Structure and Functions', titleGujarati: 'કોષ — રચના અને કાર્યો', duration: '18m', summary: 'Robert Hooke cell discovery, plant vs animal cell comparison, cell membrane, cytoplasm, nucleus, vacuoles, plastids.', questionCount: 22, iconName: 'bubble-chart', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/hesc105.pdf' },
          { id: 'g8-s-6', chapterNumber: 6, title: 'Force and Pressure', titleGujarati: 'બળ અને દબાણ', duration: '16m', summary: 'Contact vs non-contact forces (magnetic, electrostatic, gravity), Pressure = Force/Area, atmospheric pressure.', questionCount: 20, iconName: 'speed', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/hesc106.pdf' },
          { id: 'g8-s-7', chapterNumber: 7, title: 'Friction', titleGujarati: 'ઘર્ષણ', duration: '14m', summary: 'Static, sliding, rolling friction, factors affecting friction, advantages and methods to reduce friction (lubricants, ball bearings).', questionCount: 16, iconName: 'sync-alt', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/hesc107.pdf' },
          { id: 'g8-s-8', chapterNumber: 8, title: 'Sound & Vibration', titleGujarati: 'ધ્વનિ અને કંપન', duration: '16m', summary: 'Production of sound, propagation medium, human voice box (larynx), amplitude, frequency, loudness, pitch, noise pollution.', questionCount: 18, iconName: 'volume-up', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/hesc108.pdf' },
        ],
      },
    ],
  },
  '9': {
    grade: '9',
    title: 'Class 9 Curriculum',
    description: 'NCERT & GSEB Secondary Foundation for Board Exams',
    badge: 'CLASS 9 • BOARD FOUNDATION',
    subjects: [
      {
        id: 'g9-math',
        name: 'Mathematics',
        nameGujarati: 'ગણિત',
        code: 'MATH9',
        color: '#3b82f6',
        textbookTitle: 'NCERT / GSEB Mathematics Class 9',
        textbookTitleGujarati: 'ધોરણ ૯ ગણિત પાઠ્યપુસ્તક (GSEB)',
        officialTextbookPdf: 'https://ncert.nic.in/textbook.php?iemh1=0-15',
        chapters: [
          { id: 'g9-m-1', chapterNumber: 1, title: 'Number Systems', titleGujarati: 'સંખ્યા પદ્ધતિ', duration: '20m', summary: 'Irrational numbers (√2, √3 proof), real numbers and decimal expansions, rationalizing denominator, laws of exponents.', questionCount: 22, iconName: 'calculate', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/iemh101.pdf' },
          { id: 'g9-m-2', chapterNumber: 2, title: 'Polynomials', titleGujarati: 'બહુપદીઓ', duration: '22m', summary: 'Zeroes of polynomial, Remainder Theorem, Factor Theorem, algebraic identities (cubic expansions).', questionCount: 25, iconName: 'functions', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/iemh102.pdf' },
          { id: 'g9-m-3', chapterNumber: 3, title: 'Coordinate Geometry', titleGujarati: 'યામ ભૂમિતિ', duration: '16m', summary: 'Cartesian plane, x-axis (abscissa), y-axis (ordinate), plotting coordinates in 4 quadrants.', questionCount: 18, iconName: 'grid-on', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/iemh103.pdf' },
          { id: 'g9-m-4', chapterNumber: 4, title: 'Linear Equations in Two Variables', titleGujarati: 'દ્વિચલ સુરેખ સમીકરણો', duration: '18m', summary: 'Form ax + by + c = 0, solutions of linear equations, graph of linear equation in two variables.', questionCount: 20, iconName: 'show-chart', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/iemh104.pdf' },
          { id: 'g9-m-5', chapterNumber: 5, title: 'Lines and Angles', titleGujarati: 'રેખાઓ અને ખૂણાઓ', duration: '18m', summary: 'Linear pair axiom, vertically opposite angles, parallel lines with transversal, angle sum of triangle.', questionCount: 20, iconName: 'architecture', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/iemh105.pdf' },
          { id: 'g9-m-6', chapterNumber: 6, title: 'Triangles (Congruence Criteria)', titleGujarati: 'ત્રિકોણ (એકરૂપતાના નિયમો)', duration: '22m', summary: 'SAS, ASA, AAS, SSS, RHS congruence criteria, properties of isosceles triangles.', questionCount: 25, iconName: 'change-history', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/iemh106.pdf' },
          { id: 'g9-m-7', chapterNumber: 7, title: "Heron's Formula", titleGujarati: "હેરોનનું સૂત્ર", duration: '16m', summary: 'Area of triangle using s = (a+b+c)/2, Area = √[s(s-a)(s-b)(s-c)], application to quadrilaterals.', questionCount: 18, iconName: 'square-foot', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/iemh107.pdf' },
          { id: 'g9-m-8', chapterNumber: 8, title: 'Surface Areas and Volumes', titleGujarati: 'પૃષ્ઠફળ અને ઘનફળ', duration: '24m', summary: 'Surface area and volume of cone, sphere, hemisphere, cylinder, and cuboid.', questionCount: 28, iconName: 'view-in-ar', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/iemh108.pdf' },
        ],
      },
      {
        id: 'g9-sci',
        name: 'Science',
        nameGujarati: 'વિજ્ઞાન',
        code: 'SCI9',
        color: '#10b981',
        textbookTitle: 'NCERT / GSEB Science Class 9',
        textbookTitleGujarati: 'ધોરણ ૯ વિજ્ઞાન પાઠ્યપુસ્તક (GSEB)',
        officialTextbookPdf: 'https://ncert.nic.in/textbook.php?iesc1=0-15',
        chapters: [
          { id: 'g9-s-1', chapterNumber: 1, title: 'Matter in Our Surroundings', titleGujarati: 'આપણી આસપાસમાં દ્રવ્ય', duration: '16m', summary: 'Solid, liquid, gas characteristics, latent heat of fusion & vaporization, sublimation, evaporation factors.', questionCount: 20, iconName: 'grain', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/iesc101.pdf' },
          { id: 'g9-s-2', chapterNumber: 2, title: 'Is Matter Around Us Pure?', titleGujarati: 'શું આપણી આસપાસના દ્રવ્યો શુદ્ધ છે?', duration: '18m', summary: 'Solutions, suspensions, colloids, Tyndall effect, separation techniques, physical vs chemical changes, elements vs compounds.', questionCount: 22, iconName: 'science', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/iesc102.pdf' },
          { id: 'g9-s-3', chapterNumber: 3, title: 'Atoms and Molecules', titleGujarati: 'પરમાણુઓ અને અણુઓ', duration: '20m', summary: 'Law of conservation of mass, definite proportions, Dalton atomic theory, atomic mass, writing chemical formulas, mole concept.', questionCount: 25, iconName: 'bubble-chart', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/iesc103.pdf' },
          { id: 'g9-s-4', chapterNumber: 4, title: 'Motion & Equations of Motion', titleGujarati: 'ગતિ અને ગતિના સમીકરણો', duration: '22m', summary: 'Distance vs displacement, speed vs velocity, acceleration, distance-time graphs, derivation of v=u+at, s=ut+1/2at², v²-u²=2as.', questionCount: 25, iconName: 'speed', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/iesc104.pdf' },
          { id: 'g9-s-5', chapterNumber: 5, title: 'Force and Laws of Motion', titleGujarati: 'બળ અને ગતિના નિયમો', duration: '20m', summary: "Newton's 1st Law (Inertia), 2nd Law (F=ma), 3rd Law (Action-Reaction), Conservation of linear momentum.", questionCount: 24, iconName: 'fitness-center', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/iesc105.pdf' },
          { id: 'g9-s-6', chapterNumber: 6, title: 'Gravitation', titleGujarati: 'ગુરુત્વાકર્ષણ', duration: '18m', summary: 'Universal Law of Gravitation (F=G*m1*m2/r²), acceleration due to gravity (g), free fall, mass vs weight, Archimedes principle.', questionCount: 22, iconName: 'public', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/iesc106.pdf' },
          { id: 'g9-s-7', chapterNumber: 7, title: 'Work and Energy', titleGujarati: 'કાર્ય અને ઊર્જા', duration: '18m', summary: 'Work definition (W=F*s), Kinetic Energy (1/2mv²), Potential Energy (mgh), Law of conservation of energy, Power (P=W/t).', questionCount: 22, iconName: 'bolt', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/iesc107.pdf' },
          { id: 'g9-s-8', chapterNumber: 8, title: 'Sound', titleGujarati: 'ધ્વનિ', duration: '18m', summary: 'Longitudinal waves, compression & rarefaction, speed of sound, echo, reverberation, ultrasound applications, human ear structure.', questionCount: 20, iconName: 'volume-up', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/iesc108.pdf' },
        ],
      },
    ],
  },
  '10': {
    grade: '10',
    title: 'Class 10 Board Mastery',
    description: 'CBSE & GSEB 10th Board Exam Question Banks Across All Subjects',
    badge: 'CLASS 10 • BOARD EXAM SPECIAL',
    subjects: [
      {
        id: 'g10-math',
        name: 'Mathematics',
        nameGujarati: 'ગણિત',
        code: 'MATH10',
        color: '#3b82f6',
        textbookTitle: 'NCERT / GSEB Mathematics Class 10',
        textbookTitleGujarati: 'ધોરણ ૧૦ ગણિત પાઠ્યપુસ્તક (GSEB)',
        officialTextbookPdf: 'https://ncert.nic.in/textbook.php?jemh1=0-15',
        chapters: [
          { id: 'g10-m-1', chapterNumber: 1, title: 'Real Numbers', titleGujarati: 'વાસ્તવિક સંખ્યાઓ', duration: '18m', summary: 'Fundamental Theorem of Arithmetic, proving irrationality of √2, √3, √5, decimal expansions of rational numbers.', questionCount: 25, iconName: 'calculate', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/jemh101.pdf' },
          { id: 'g10-m-2', chapterNumber: 2, title: 'Polynomials', titleGujarati: 'બહુપદીઓ', duration: '20m', summary: 'Geometrical meaning of zeroes of a polynomial, relationship between zeroes and coefficients of quadratic polynomials.', questionCount: 25, iconName: 'functions', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/jemh102.pdf' },
          { id: 'g10-m-3', chapterNumber: 3, title: 'Pair of Linear Equations in Two Variables', titleGujarati: 'દ્વિચલ સુરેખ સમીકરણ યુગ્મ', duration: '24m', summary: 'Graphical method, Substitution method, Elimination method, consistency conditions (a1/a2, b1/b2, c1/c2).', questionCount: 30, iconName: 'show-chart', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/jemh103.pdf' },
          { id: 'g10-m-4', chapterNumber: 4, title: 'Quadratic Equations', titleGujarati: 'દ્વિઘાત સમીકરણ', duration: '22m', summary: 'Standard form ax²+bx+c=0, factorization method, Quadratic formula: [-b ± √(b²-4ac)]/(2a), nature of roots via Discriminant.', questionCount: 28, iconName: 'functions', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/jemh104.pdf' },
          { id: 'g10-m-5', chapterNumber: 5, title: 'Arithmetic Progressions (AP)', titleGujarati: 'સમાંતર શ્રેણી', duration: '22m', summary: 'General term an = a + (n-1)d, sum of first n terms: Sn = n/2 [2a + (n-1)d], practical word problems.', questionCount: 28, iconName: 'format-list-numbered', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/jemh105.pdf' },
          { id: 'g10-m-6', chapterNumber: 6, title: 'Triangles (Similarity & BPT Theorem)', titleGujarati: 'ત્રિકોણ (સમરૂપતા અને થેલ્સ પ્રમેય)', duration: '26m', summary: 'Basic Proportionality Theorem (Thales Theorem), AAA, SSS, SAS similarity criteria, areas of similar triangles.', questionCount: 30, iconName: 'change-history', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/jemh106.pdf' },
          { id: 'g10-m-7', chapterNumber: 7, title: 'Coordinate Geometry', titleGujarati: 'યામ ભૂમિતિ (અંતરસૂત્ર અને વિભાજનસૂત્ર)', duration: '20m', summary: 'Distance formula: √[(x2-x1)² + (y2-y1)²], Section formula: [(m1x2+m2x1)/(m1+m2), (m1y2+m2y1)/(m1+m2)], midpoint formula.', questionCount: 25, iconName: 'grid-on', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/jemh107.pdf' },
          { id: 'g10-m-8', chapterNumber: 8, title: 'Introduction to Trigonometry', titleGujarati: 'ત્રિકોણમિતિનો પરિચય', duration: '28m', summary: 'Trigonometric ratios (sin, cos, tan, cot, sec, cosec), values for 0°, 30°, 45°, 60°, 90°, identities: sin²θ+cos²θ=1, 1+tan²θ=sec²θ.', questionCount: 32, iconName: 'architecture', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/jemh108.pdf' },
          { id: 'g10-m-9', chapterNumber: 9, title: 'Some Applications of Trigonometry', titleGujarati: 'ત્રિકોણમિતિના ઉપયોગો (ઊંચાઈ અને અંતર)', duration: '22m', summary: 'Angle of elevation, angle of depression, line of sight, solving real-world height and distance problems.', questionCount: 25, iconName: 'visibility', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/jemh109.pdf' },
          { id: 'g10-m-10', chapterNumber: 10, title: 'Circles', titleGujarati: 'વર્તુળ (સ્પર્શકના પ્રમેયો)', duration: '20m', summary: 'Tangent to circle perpendicular to radius, lengths of tangents drawn from external point are equal.', questionCount: 24, iconName: 'radio-button-unchecked', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/jemh110.pdf' },
          { id: 'g10-m-11', chapterNumber: 11, title: 'Statistics & Probability', titleGujarati: 'આંકડાશાસ્ત્ર અને સંભાવના', duration: '22m', summary: 'Mean (Direct, Assumed Mean methods), Mode, Median of grouped data, Empirical probability formula P(E).', questionCount: 28, iconName: 'bar-chart', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/jemh111.pdf' },
        ],
      },
      {
        id: 'g10-sci',
        name: 'Science',
        nameGujarati: 'વિજ્ઞાન',
        code: 'SCI10',
        color: '#10b981',
        textbookTitle: 'NCERT / GSEB Science Class 10',
        textbookTitleGujarati: 'ધોરણ ૧૦ વિજ્ઞાન પાઠ્યપુસ્તક (GSEB)',
        officialTextbookPdf: 'https://ncert.nic.in/textbook.php?jesc1=0-16',
        chapters: [
          { id: 'g10-s-1', chapterNumber: 1, title: 'Chemical Reactions and Equations', titleGujarati: 'રાસાયણિક પ્રક્રિયાઓ અને સમીકરણો', duration: '22m', summary: 'Balancing chemical equations, combination, decomposition, displacement, double displacement, oxidation and reduction, corrosion & rancidity.', questionCount: 28, iconName: 'science', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/jesc101.pdf' },
          { id: 'g10-s-2', chapterNumber: 2, title: 'Acids, Bases and Salts', titleGujarati: 'એસિડ, બેઇઝ અને ક્ષાર', duration: '24m', summary: 'Chemical properties of acids and bases, pH scale importance, Bleaching powder, Baking soda, Washing soda, Plaster of Paris preparation.', questionCount: 30, iconName: 'biotech', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/jesc102.pdf' },
          { id: 'g10-s-3', chapterNumber: 3, title: 'Metals and Non-metals', titleGujarati: 'ધાતુઓ અને અધાતુઓ', duration: '22m', summary: 'Physical & chemical properties, reactivity series, formation of ionic compounds, metallurgy (roasting, calcination, refining), corrosion prevention.', questionCount: 28, iconName: 'hardware', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/jesc103.pdf' },
          { id: 'g10-s-4', chapterNumber: 4, title: 'Carbon and its Compounds', titleGujarati: 'કાર્બન અને તેના સંયોજનો', duration: '26m', summary: 'Covalent bonding in carbon, versatile nature, homologous series, IUPAC nomenclature, combustion, addition, substitution, ethanol and ethanoic acid.', questionCount: 32, iconName: 'bubble-chart', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/jesc104.pdf' },
          { id: 'g10-s-5', chapterNumber: 5, title: 'Life Processes', titleGujarati: 'જૈવિક ક્રિયાઓ (પોષણ, શ્વસન, વહન, ઉત્સર્જન)', duration: '28m', summary: 'Autotrophic & heterotrophic nutrition, aerobic vs anaerobic respiration, human circulatory system & heart, human nephron excretory unit.', questionCount: 35, iconName: 'favorite', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/jesc105.pdf' },
          { id: 'g10-s-6', chapterNumber: 6, title: 'Control and Coordination', titleGujarati: 'નિયંત્રણ અને સંકલન', duration: '22m', summary: 'Human nervous system, neuron structure, reflex arc, human brain (forebrain, midbrain, hindbrain), plant hormones (Auxin, Gibberellin), animal hormones.', questionCount: 26, iconName: 'psychology', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/jesc106.pdf' },
          { id: 'g10-s-7', chapterNumber: 7, title: 'How do Organisms Reproduce?', titleGujarati: 'સજીવો કેવી રીતે પ્રજનન કરે છે?', duration: '24m', summary: 'Asexual reproduction methods, sexual reproduction in flowering plants (pollination & fertilization), human male and female reproductive systems, contraception.', questionCount: 30, iconName: 'child-care', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/jesc107.pdf' },
          { id: 'g10-s-8', chapterNumber: 8, title: 'Light — Reflection and Refraction', titleGujarati: 'પ્રકાશ — પરાવર્તન અને વક્રીભવન', duration: '28m', summary: 'Spherical mirrors (concave/convex), mirror formula: 1/f = 1/v + 1/u, Snell’s Law, lens formula: 1/f = 1/v - 1/u, Power of lens: P = 1/f (m).', questionCount: 35, iconName: 'wb-sunny', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/jesc108.pdf' },
          { id: 'g10-s-9', chapterNumber: 9, title: 'The Human Eye and Colourful World', titleGujarati: 'માનવ આંખ અને રંગબેરંગી દુનિયા', duration: '22m', summary: 'Defects of vision (Myopia, Hypermetropia, Presbyopia) and corrections, refraction through prism, dispersion, atmospheric refraction (twinkling of stars), Tyndall effect.', questionCount: 26, iconName: 'remove-red-eye', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/jesc109.pdf' },
          { id: 'g10-s-10', chapterNumber: 10, title: 'Electricity', titleGujarati: 'વિદ્યુત (ઓહ્મનો નિયમ અને અવરોધો)', duration: '28m', summary: "Electric current & potential difference, Ohm's law (V=IR), factors affecting resistance, resistors in series and parallel, Joule's heating law (H=I²Rt), electric power (P=VI).", questionCount: 35, iconName: 'bolt', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/jesc110.pdf' },
          { id: 'g10-s-11', chapterNumber: 11, title: 'Magnetic Effects of Electric Current', titleGujarati: 'વિદ્યુત પ્રવાહની ચુંબકીય અસરો', duration: '24m', summary: 'Magnetic field around current-carrying conductor, Right-Hand Thumb rule, Fleming’s Left-Hand rule (Electric Motor), electromagnetic induction, Fleming’s Right-Hand rule, domestic electric circuits.', questionCount: 30, iconName: 'explore', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/jesc111.pdf' },
        ],
      },
    ],
  },
  '11': {
    grade: '11',
    title: 'Class 11 Higher Secondary',
    description: 'Science Stream (Physics, Chemistry, Math, Biology) & Entrance Foundations',
    badge: 'CLASS 11 • SCIENCE STREAM',
    subjects: [
      {
        id: 'g11-phy',
        name: 'Physics',
        nameGujarati: 'ભૌતિક વિજ્ઞાન',
        code: 'PHY11',
        color: '#8b5cf6',
        textbookTitle: 'NCERT / GSEB Physics Class 11',
        textbookTitleGujarati: 'ધોરણ ૧૧ ભૌતિક વિજ્ઞાન (GSEB)',
        officialTextbookPdf: 'https://ncert.nic.in/textbook.php?keph1=0-15',
        chapters: [
          { id: 'g11-p-1', chapterNumber: 1, title: 'Units & Measurements', titleGujarati: 'એકમો અને માપન', duration: '20m', summary: 'SI system, dimensional analysis, error analysis and significant figures.', questionCount: 25, iconName: 'straighten', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/keph101.pdf' },
          { id: 'g11-p-2', chapterNumber: 2, title: 'Motion in a Straight Line', titleGujarati: 'સુરેખ પથ પર ગતિ', duration: '22m', summary: 'Instantaneous velocity and acceleration, kinematic calculus, relative velocity.', questionCount: 25, iconName: 'trending-flat', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/keph102.pdf' },
          { id: 'g11-p-3', chapterNumber: 3, title: 'Motion in a Plane (Vectors & Projectile)', titleGujarati: 'સમતલમાં ગતિ (સદિશો અને પ્રક્ષિપ્ત ગતિ)', duration: '26m', summary: 'Scalar & vector products, projectile motion trajectory & range, uniform circular motion.', questionCount: 30, iconName: 'call-made', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/keph103.pdf' },
          { id: 'g11-p-4', chapterNumber: 4, title: 'Laws of Motion & Friction', titleGujarati: 'ગતિના નિયમો અને ઘર્ષણ', duration: '25m', summary: 'Momentum conservation, impulse, friction on banked roads, free body diagrams.', questionCount: 28, iconName: 'speed', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/keph104.pdf' },
          { id: 'g11-p-5', chapterNumber: 5, title: 'Work, Energy and Power', titleGujarati: 'કાર્ય, ઊર્જા અને પાવર', duration: '24m', summary: 'Work-energy theorem, potential energy of spring, elastic & inelastic collisions.', questionCount: 28, iconName: 'bolt', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/keph105.pdf' },
        ],
      },
      {
        id: 'g11-chem',
        name: 'Chemistry',
        nameGujarati: 'રસાયણ વિજ્ઞાન',
        code: 'CHEM11',
        color: '#06b6d4',
        textbookTitle: 'NCERT / GSEB Chemistry Class 11',
        textbookTitleGujarati: 'ધોરણ ૧૧ રસાયણ વિજ્ઞાન (GSEB)',
        officialTextbookPdf: 'https://ncert.nic.in/textbook.php?kech1=0-14',
        chapters: [
          { id: 'g11-c-1', chapterNumber: 1, title: 'Some Basic Concepts of Chemistry', titleGujarati: 'રસાયણ વિજ્ઞાનના પાયાના ખ્યાલો', duration: '22m', summary: 'Mole concept, molar mass, stoichiometry, empirical formula, molarity and molality.', questionCount: 25, iconName: 'science', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/kech101.pdf' },
          { id: 'g11-c-2', chapterNumber: 2, title: 'Structure of Atom', titleGujarati: 'પરમાણુનું બંધારણ', duration: '26m', summary: "Bohr's atomic model, de Broglie relation, Heisenberg uncertainty principle, quantum numbers, Aufbau principle.", questionCount: 30, iconName: 'bubble-chart', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/kech102.pdf' },
          { id: 'g11-c-3', chapterNumber: 3, title: 'Classification of Elements & Periodicity', titleGujarati: 'તત્વોનું વર્ગીકરણ અને આવર્તિતા', duration: '20m', summary: 'Modern periodic table, periodic trends: atomic radii, ionization enthalpy, electron gain enthalpy, electronegativity.', questionCount: 24, iconName: 'table-chart', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/kech103.pdf' },
        ],
      },
    ],
  },
  '12': {
    grade: '12',
    title: 'Class 12 Board & GUJCET / JEE',
    description: '12th Board Exam & State Entrance All-Subject Preparation',
    badge: 'CLASS 12 • BOARDS & GUJCET',
    subjects: [
      {
        id: 'g12-phy',
        name: 'Physics',
        nameGujarati: 'ભૌતિક વિજ્ઞાન',
        code: 'PHY12',
        color: '#8b5cf6',
        textbookTitle: 'NCERT / GSEB Physics Class 12',
        textbookTitleGujarati: 'ધોરણ ૧૨ ભૌતિક વિજ્ઞાન (GSEB)',
        officialTextbookPdf: 'https://ncert.nic.in/textbook.php?leph1=0-15',
        chapters: [
          { id: 'g12-p-1', chapterNumber: 1, title: 'Electric Charges and Fields', titleGujarati: 'વિધુતભારો અને ક્ષેત્રો', duration: '28m', summary: "Coulomb's Law, Electric field lines, Electric flux, Gauss's Law and its applications.", questionCount: 32, iconName: 'bolt', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/leph101.pdf' },
          { id: 'g12-p-2', chapterNumber: 2, title: 'Electrostatic Potential & Capacitance', titleGujarati: 'સ્થિત વિદ્યુત સ્થિતિમાન અને કેપેસિટન્સ', duration: '26m', summary: 'Electric potential due to dipole, equipotential surfaces, parallel plate capacitor, dielectric effect.', questionCount: 30, iconName: 'battery-charging-full', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/leph102.pdf' },
          { id: 'g12-p-3', chapterNumber: 3, title: 'Current Electricity', titleGujarati: 'પ્રવાહ વિદ્યુત', duration: '28m', summary: "Drift velocity, Ohm's law, temperature dependence of resistivity, Kirchhoff's rules, Wheatstone bridge.", questionCount: 35, iconName: 'power', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/leph103.pdf' },
          { id: 'g12-p-4', chapterNumber: 4, title: 'Moving Charges and Magnetism', titleGujarati: 'ગતિમાન વિધુતભારો અને ચુંબકત્વ', duration: '26m', summary: 'Biot-Savart Law, Ampere Circuital Law, force on current loop, moving coil galvanometer.', questionCount: 30, iconName: 'explore', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/leph104.pdf' },
          { id: 'g12-p-5', chapterNumber: 5, title: 'Optics (Ray & Wave Optics)', titleGujarati: 'પ્રકાશશાસ્ત્ર (કિરણ અને તરંગ પ્રકાશશાસ્ત્ર)', duration: '30m', summary: 'Refraction at spherical surfaces, Lens maker formula, Huygens principle, Young double slit experiment (YDSE).', questionCount: 35, iconName: 'wb-sunny', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/leph105.pdf' },
        ],
      },
      {
        id: 'g12-chem',
        name: 'Chemistry',
        nameGujarati: 'રસાયણ વિજ્ઞાન',
        code: 'CHEM12',
        color: '#06b6d4',
        textbookTitle: 'NCERT / GSEB Chemistry Class 12',
        textbookTitleGujarati: 'ધોરણ ૧૨ રસાયણ વિજ્ઞાન (GSEB)',
        officialTextbookPdf: 'https://ncert.nic.in/textbook.php?lech1=0-16',
        chapters: [
          { id: 'g12-c-1', chapterNumber: 1, title: 'Solutions', titleGujarati: 'દ્રાવણો', duration: '25m', summary: "Raoult's law, colligative properties (relative lowering of VP, elevation of BP, depression of FP, osmotic pressure), van 't Hoff factor.", questionCount: 30, iconName: 'science', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/lech101.pdf' },
          { id: 'g12-c-2', chapterNumber: 2, title: 'Electrochemistry', titleGujarati: 'વિદ્યુત રસાયણ', duration: '26m', summary: "Nernst equation, standard electrode potential, Kohlrausch's law, Faraday laws of electrolysis, batteries and fuel cells.", questionCount: 32, iconName: 'bolt', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/lech102.pdf' },
          { id: 'g12-c-3', chapterNumber: 3, title: 'Chemical Kinetics', titleGujarati: 'રાસાયણિક ગતિકી', duration: '24m', summary: 'Rate of reaction, rate constant, order and molecularity, integrated rate equations for zero and first order, Arrhenius equation.', questionCount: 28, iconName: 'speed', textbookPdfUrl: 'https://ncert.nic.in/textbook/pdf/lech103.pdf' },
        ],
      },
    ],
  },
  'college': {
    grade: 'college',
    title: 'Campus Placements & Tech Mastery',
    description: 'TCS NQT, Infosys, Amazon, DSA, Full-Stack Coding & HR Viva Preparation',
    badge: 'COLLEGE • CAMPUS RECRUITMENT',
    subjects: [
      {
        id: 'col-apt',
        name: 'Quantitative Aptitude',
        code: 'APTITUDE',
        color: '#3b82f6',
        chapters: [
          { id: 'col-a-1', chapterNumber: 1, title: 'Speed, Distance & Time (Trains & Boats)', duration: '25m', summary: 'Relative speed, train crossing platforms, upstream and downstream shortcuts.', questionCount: 35, iconName: 'speed' },
          { id: 'col-a-2', chapterNumber: 2, title: 'Time and Work (Pipes & Cisterns)', duration: '22m', summary: 'Man-days unit method, efficiency ratios, alternate working days, leak emptying problems.', questionCount: 30, iconName: 'hourglass-empty' },
          { id: 'col-a-3', chapterNumber: 3, title: 'Profit, Loss & Simple/Compound Interest', duration: '24m', summary: 'Successive percentage changes, marked price & discount, effective annual rate of interest.', questionCount: 35, iconName: 'trending-up' },
          { id: 'col-a-4', chapterNumber: 4, title: 'Permutations, Combinations & Probability', duration: '25m', summary: 'Arrangements with repetitions, circular permutations, conditional probability, Bayes theorem.', questionCount: 30, iconName: 'casino' },
        ],
      },
      {
        id: 'col-lr',
        name: 'Logical Reasoning',
        code: 'REASONING',
        color: '#f59e0b',
        chapters: [
          { id: 'col-lr-1', chapterNumber: 1, title: 'Coding-Decoding & Number Series', duration: '20m', summary: 'Alphanumeric shifting, alternating differences, Fibonacci & prime sequence recognition.', questionCount: 30, iconName: 'password' },
          { id: 'col-lr-2', chapterNumber: 2, title: 'Blood Relations & Direction Sense', duration: '22m', summary: 'Family tree diagrams, coded relationships (A+B, A-B), Pythagoras distance shortcuts.', questionCount: 28, iconName: 'people' },
          { id: 'col-lr-3', chapterNumber: 3, title: 'Syllogisms & Seating Arrangements', duration: '25m', summary: 'Venn diagram method for Venn premises, linear & circular seating layouts with facing conditions.', questionCount: 32, iconName: 'event-seat' },
        ],
      },
      {
        id: 'col-tech',
        name: 'Technical & CS Core',
        code: 'CS_TECH',
        color: '#10b981',
        chapters: [
          { id: 'col-t-1', chapterNumber: 1, title: 'Data Structures & Algorithms', duration: '30m', summary: 'Arrays, Linked Lists, Stacks, Queues, Binary Trees, BST, Graphs, Big-O Time & Space complexities.', questionCount: 40, iconName: 'account-tree' },
          { id: 'col-t-2', chapterNumber: 2, title: 'DBMS & SQL Mastery', duration: '25m', summary: 'ACID properties, Normalization (1NF to BCNF), Joins, Indexing (B-Trees), Transactions & Isolation levels.', questionCount: 35, iconName: 'storage' },
          { id: 'col-t-3', chapterNumber: 3, title: 'Operating Systems & Computer Networks', duration: '25m', summary: 'Processes vs Threads, CPU Scheduling, Deadlocks, Virtual Memory & Paging, OSI & TCP/IP stack.', questionCount: 35, iconName: 'memory' },
          { id: 'col-t-4', chapterNumber: 4, title: 'React & Modern JavaScript', duration: '28m', summary: 'Virtual DOM diffing, Hooks (useState, useEffect, useMemo, useCallback), Event loop, Closures, Promises.', questionCount: 40, iconName: 'web' },
        ],
      },
    ],
  },
};


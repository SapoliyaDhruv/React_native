export interface VideoComment {
  id: string;
  author: string;
  role?: string;
  userEmail?: string;
  text: string;
  upvotes: number;
  upvotedBy?: string[];
  createdAt?: string | Date;
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
  playbackMode: 'embed' | 'in_app_browser';
  description: string;
  descriptionGujarati?: string;
  timeStampedNotes: { time: string; text: string; textGujarati?: string }[];
  discussionCount?: number;
  comments?: VideoComment[];
}

export const VIDEO_LECTURES_DATA: VideoLecture[] = [
  // ==========================================
  // CLASS 6 SCHOOL MASTERCLASSES (GSEB & CBSE)
  // ==========================================
  {
    id: 'vid-school-6-1',
    grades: ['6'],
    boards: ['CBSE', 'GSEB'],
    category: 'Mathematics',
    categoryGujarati: 'ગણિત',
    title: 'Class 6 Math – Knowing Our Numbers & Place Value System (GSEB & NCERT)',
    titleGujarati: 'ધોરણ ૬ ગણિત – પ્રકરણ ૧: સંખ્યા પરિચય અને સ્થાનકિંમત પદ્ધતિ (GSEB)',
    instructor: 'Magnet Brains',
    instructorGujarati: 'ગુજરાત પાઠ્યપુસ્તક મંડળ શિક્ષણ',
    duration: '15:20',
    durationSeconds: 920,
    youtubeVideoId: 'jzNxXm5twx4',
    thumbnailUrl: 'https://img.youtube.com/vi/jzNxXm5twx4/hqdefault.jpg',
    playbackMode: 'embed',
    description:
      'Learn Indian and International place value systems, comparing large numbers, and estimation techniques for Class 6 NCERT & GSEB syllabus.',
    descriptionGujarati:
      'ગુજરાત રાજ્ય પાઠ્યપુસ્તક મંડળ ધોરણ ૬ ગણિત પ્રકરણ ૧: સંખ્યા પરિચય, સ્થાનકિંમત, અને મોટી સંખ્યાઓની સરખામણી સરળ ભાષામાં સમજો.',
    timeStampedNotes: [
      { time: '01:00', text: 'Indian vs International Number System', textGujarati: 'ભારતીય અને આંતરરાષ્ટ્રીય સંખ્યા લેખન પદ્ધતિ' },
      { time: '04:30', text: 'Comparing large 6-digit & 7-digit numbers', textGujarati: 'મોટી સંખ્યાઓની સરખામણી અને ક્રમ' },
      { time: '08:45', text: 'Estimation and Rounding off to nearest 100 & 1000', textGujarati: 'આસન્ન મૂલ્ય (આશરે અંદાજ કાઢવો)' },
      { time: '12:10', text: 'Roman Numerals basic rules (I, V, X, L, C, D, M)', textGujarati: 'રોમન અંક પદ્ધતિના નિયમો' },
    ],
    comments: [],
  },
  {
    id: 'vid-school-6-2',
    grades: ['6'],
    boards: ['CBSE', 'GSEB'],
    category: 'Mathematics',
    categoryGujarati: 'ગણિત',
    title: 'Class 6 Math – Fractions & Decimals on Number Line (GSEB & NCERT)',
    titleGujarati: 'ધોરણ ૬ ગણિત – પ્રકરણ ૨: અપૂર્ણાંક અને દશાંશ સંખ્યાઓ (GSEB)',
    instructor: 'Vedantu Junior',
    instructorGujarati: 'GSEB ગણિત ગુરુ',
    duration: '14:15',
    durationSeconds: 855,
    youtubeVideoId: 'xrMppTpoqdw',
    thumbnailUrl: 'https://img.youtube.com/vi/xrMppTpoqdw/hqdefault.jpg',
    playbackMode: 'embed',
    description:
      'Understand proper, improper, mixed fractions, equivalent fractions, and how to plot decimals on a number line.',
    descriptionGujarati:
      'શુદ્ધ, અશુદ્ધ, અને મિશ્ર અપૂર્ણાંકો, સમઅપૂર્ણાંકો અને સંખ્યા રેખા પર નિરૂપણ સરળ ઉદાહરણો સાથે શીખો.',
    timeStampedNotes: [
      { time: '00:50', text: 'Proper vs Improper Fractions definition', textGujarati: 'શુદ્ધ અને અશુદ્ધ અપૂર્ણાંકની વ્યાખ્યા' },
      { time: '04:20', text: 'Converting improper fractions to mixed numbers', textGujarati: 'અશુદ્ધ અપૂર્ણાંકને મિશ્ર સંખ્યામાં ફેરવવું' },
      { time: '08:15', text: 'Equivalent fractions by multiplication/division', textGujarati: 'સમઅપૂર્ણાંક શોધવાની રીત' },
      { time: '11:00', text: 'Plotting fractions on a number line', textGujarati: 'સંખ્યા રેખા પર અપૂર્ણાંક દર્શાવવા' },
    ],
    comments: [],
  },
  {
    id: 'vid-school-6-3',
    grades: ['6'],
    boards: ['CBSE', 'GSEB'],
    category: 'Science',
    categoryGujarati: 'વિજ્ઞાન',
    title: 'Class 6 Science – Components of Food & Balanced Diet (GSEB & NCERT)',
    titleGujarati: 'ધોરણ ૬ વિજ્ઞાન – પ્રકરણ ૨: આહારના ઘટકો અને સમતોલ આહાર (GSEB)',
    instructor: 'Dear Sir Science',
    instructorGujarati: 'વિજ્ઞાન પ્રયોગશાળા GSEB',
    duration: '13:40',
    durationSeconds: 820,
    youtubeVideoId: '1mHjMNZZvFo',
    thumbnailUrl: 'https://img.youtube.com/vi/1mHjMNZZvFo/hqdefault.jpg',
    playbackMode: 'embed',
    description:
      'Explore carbohydrates, fats, proteins, vitamins, minerals, and deficiency diseases for Class 6 CBSE and Gujarat Board science.',
    descriptionGujarati:
      'કાર્બોહાઇડ્રેટ, ચરબી, પ્રોટીન, વિટામિન, ખનીજ ક્ષારો અને ત્રુટિજન્ય રોગો વિશે GSEB પાઠ્યપુસ્તક આધારિત સંપૂર્ણ સમજૂતી.',
    timeStampedNotes: [
      { time: '01:10', text: 'Test for Starch (Iodine solution test)', textGujarati: 'સ્ટાર્ચનું પરીક્ષણ (આયોડિન કસોટી)' },
      { time: '04:30', text: 'Test for Proteins (Copper sulphate & caustic soda)', textGujarati: 'પ્રોટીનનું પરીક્ષણ (કોપર સલ્ફેટ કસોટી)' },
      { time: '07:50', text: 'Vitamins & Minerals deficiency table (Scurvy, Rickets)', textGujarati: 'વિટામિનોની ઊણપથી થતા રોગો (રતાંધળાપણું, સ્કર્વી)' },
      { time: '11:20', text: 'What is a balanced diet and dietary roughage', textGujarati: 'સમતોલ આહાર અને પાચક રેસાનું મહત્વ' },
    ],
    comments: [],
  },

  {
    id: 'vid-school-6-4',
    grades: ['6'],
    boards: ['CBSE', 'GSEB'],
    category: 'Social Science',
    categoryGujarati: 'સામાજિક વિજ્ઞાન',
    title: 'Class 6 History – What, Where, How and When? (Early Humans & Sources)',
    titleGujarati: 'ધોરણ ૬ સામાજિક વિજ્ઞાન – પ્રકરણ ૧: ઇતિહાસ શું, ક્યાં, કેવી રીતે અને ક્યારે? (GSEB)',
    instructor: 'Magnet Brains History',
    instructorGujarati: 'GSEB સામાજિક વિજ્ઞાન',
    duration: '12:30',
    durationSeconds: 750,
    youtubeVideoId: 'AT14lCXuMKI',
    thumbnailUrl: 'https://img.youtube.com/vi/AT14lCXuMKI/hqdefault.jpg',
    playbackMode: 'embed',
    description:
      'Explore the earliest humans, how historians learn about the past using manuscripts, inscriptions and archaeological sources for Class 6 Social Science.',
    descriptionGujarati:
      'ઇતિહાસ વિષે જ્ઞાન મેળવવાના સ્ત્રોતો: હસ્ત-લિખિત ગ્રંથ, શિલાલેખ, ખોદકામ અને ચિત્રો. GSEB ધોરણ ૬ સામાજિક વિજ્ઞાન.',
    timeStampedNotes: [
      { time: '01:00', text: 'What is History and why we study it', textGujarati: 'ઇતિહાસ શું છે અને આપણે કેમ ભણીએ?' },
      { time: '04:20', text: 'Sources of History: Manuscripts and Inscriptions', textGujarati: 'ઇતિહાસના સ્ત્રોત: હસ્ત-લિખિત ગ્રંથ અને શિલાલેખ' },
      { time: '07:50', text: 'Archaeological sources: tools, pots, coins', textGujarati: 'પ્રત્યયુ સ્ત્રોત: ઓજારો, ઘડા, સિક્કા' },
      { time: '10:30', text: 'Time measurement: BCE and CE', textGujarati: 'ઈ.સ. પૂર્વે અને ઈ.સ. (BCE / CE) નો અર્થ' },
    ],
    comments: [],
  },
  {
    id: 'vid-school-6-5',
    grades: ['6'],
    boards: ['CBSE', 'GSEB'],
    category: 'Social Science',
    categoryGujarati: 'સામાજિક વિજ્ઞાન',
    title: 'Class 6 Geography – The Earth in the Solar System (Planets & Moon)',
    titleGujarati: 'ધોરણ ૬ ભૂગોળ – સૌર પરિવારમાં પૃથ્વી: ગ્રહો, ઉપગ્રહ, ચંદ્ર (GSEB)',
    instructor: 'Vedantu Geography',
    instructorGujarati: 'GSEB ભૂગોળ ગુરુ',
    duration: '13:50',
    durationSeconds: 830,
    youtubeVideoId: 'jzNxXm5twx4',
    thumbnailUrl: 'https://img.youtube.com/vi/jzNxXm5twx4/hqdefault.jpg',
    playbackMode: 'embed',
    description:
      'Learn about the Solar System, the 8 planets, asteroids, comets and the position of Earth and Moon for Class 6 Geography.',
    descriptionGujarati:
      'સૌર પરિવારના ૮ ગ્રહો, ઉલ્કા, ધૂમકેતુ અને ચંદ્ર: GSEB ધોરણ ૬ ભૂગોળ પ્રકરણ ૧ – સ્પષ્ટ સ્ત્રોત-આધારિત સમજૂતી.',
    timeStampedNotes: [
      { time: '00:50', text: 'The Sun, 8 Planets and their order from the Sun', textGujarati: 'સૂર્ય, ૮ ગ્રહ, ક્ષુદ્ર ગ્રહ' },
      { time: '04:10', text: 'Earth – the Blue Planet and its unique features', textGujarati: 'પૃથ્વી – વાદળી ગ્રહ (Blue Planet)' },
      { time: '07:30', text: 'Moon: Earth\'s natural satellite', textGujarati: 'ચંદ્ર: પૃથ્વીનો ઉપગ્રહ' },
      { time: '10:40', text: 'Comets, Meteors and Asteroids', textGujarati: 'ધૂમકેતુ, ઉલ્કા, ક્ષુદ્ર ગ્રહ' },
    ],
    comments: [],
  },
  {
    id: 'vid-school-6-6',
    grades: ['6'],
    boards: ['CBSE', 'GSEB'],
    category: 'Gujarati',
    categoryGujarati: 'ગુજરાતી',
    title: 'Class 6 Gujarati – Railway Station (રેલવે સ્ટેશન) Full Explanation',
    titleGujarati: 'ધોરણ ૬ ગુજરાતી – પ્રકરણ ૧: રેલવે સ્ટેશન – વ્યાખ્યા, અર્થ, ભાવ (GSEB)',
    instructor: 'GSEB Gujarati Adhyayan',
    instructorGujarati: 'ગુજરાતી ભાષા ગુરુ (GSEB)',
    duration: '11:15',
    durationSeconds: 675,
    youtubeVideoId: 'xrMppTpoqdw',
    thumbnailUrl: 'https://img.youtube.com/vi/xrMppTpoqdw/hqdefault.jpg',
    playbackMode: 'embed',
    description:
      'Complete explanation of the poem "Railway Station" for Class 6 Gujarati, covering literary meaning, important questions, and GSEB exam preparation.',
    descriptionGujarati:
      'ધોરણ ૬ ગુજરાતી "રેલવે સ્ટેશન" – સારાંશ, ભાવ, મહત્ત્વના પ્રશ્નો અને ઉત્તર, GSEB ૨૦૨૫ ઢબ.',
    timeStampedNotes: [
      { time: '01:00', text: 'Introduction to the poem and its author', textGujarati: 'પ્રકરણ અને કવિ/લેખક પ્રસ્તાવ' },
      { time: '03:40', text: 'Word meanings (અઘરા શબ્દોના અર્થ)', textGujarati: 'અઘરા શબ્દો, રૂઢિ-ઉક્તિઓ' },
      { time: '06:20', text: 'Summary in Gujarati (ગુજરાતીમાં સારાંશ)', textGujarati: 'ગુજરાતી ભાષામાં સારાંશ' },
      { time: '09:00', text: 'Important exam questions & answers', textGujarati: 'પ્રશ્ન-ઉત્તર (GSEB Board pattern)' },
    ],
    comments: [],
  },
  {
    id: 'vid-school-6-7',
    grades: ['6'],
    boards: ['CBSE', 'GSEB'],
    category: 'English',
    categoryGujarati: 'અંગ્રેજી',
    title: "Class 6 English – Who Did Patrick's Homework? (Full Explanation)",
    titleGujarati: "ધોરણ ૬ અંગ્રેજી – Who Did Patrick's Homework? (GSEB & CBSE)",
    instructor: 'Smart School English',
    instructorGujarati: 'GSEB English Adhyayan',
    duration: '10:45',
    durationSeconds: 645,
    youtubeVideoId: '1mHjMNZZvFo',
    thumbnailUrl: 'https://img.youtube.com/vi/1mHjMNZZvFo/hqdefault.jpg',
    playbackMode: 'embed',
    description:
      "Full explanation of Class 6 English Chapter 1 – Who Did Patrick's Homework, covering character analysis, moral, and important exam questions.",
    descriptionGujarati:
      "ધોરણ ૬ અંગ્રેજી Honeysuckle: Patrick's Homework – summary, word meanings, character analysis & exam Q&A.",
    timeStampedNotes: [
      { time: '00:45', text: 'Introduction to the story and main characters', textGujarati: 'વાર્તાનો પ્રારંભ અને પાત્રો' },
      { time: '03:30', text: 'Plot summary and lesson/moral', textGujarati: 'વાર્તાનો સારાંશ અને નૈતિક' },
      { time: '06:10', text: 'Difficult word meanings explained', textGujarati: 'અઘરા શબ્દોના અર્થ' },
      { time: '08:40', text: 'Important Q&A for exams', textGujarati: 'GSEB/CBSE ઢબના પ્રશ્ન-ઉત્તર' },
    ],
    comments: [],
  },

  // ==========================================
  // CLASS 7 SCHOOL MASTERCLASSES (GSEB & CBSE)
  // ==========================================
  {
    id: 'vid-school-7-1',
    grades: ['7'],
    boards: ['CBSE', 'GSEB'],
    category: 'Mathematics',
    categoryGujarati: 'ગણિત',
    title: 'Class 7 Math – Integers & Number Line (Complete Concept & Rules)',
    titleGujarati: 'ધોરણ ૭ ગણિત – પ્રકરણ ૧: પૂર્ણાંક સંખ્યાઓ અને સરવાળા-બાદબાકી નિયમો (GSEB)',
    instructor: 'Magnet Brains',
    instructorGujarati: 'ગુજરાત શિક્ષણ બોર્ડ',
    duration: '18:45',
    durationSeconds: 1125,
    youtubeVideoId: 'jzNxXm5twx4',
    thumbnailUrl: 'https://img.youtube.com/vi/jzNxXm5twx4/hqdefault.jpg',
    playbackMode: 'embed',
    description:
      'Learn addition, subtraction, and multiplication rules of positive and negative integers for Class 7 NCERT & GSEB syllabus.',
    descriptionGujarati:
      'ધન અને ઋણ પૂર્ણાંક સંખ્યાઓના સરવાળા, બાદબાકી અને ગુણાકારના નિયમો GSEB પાઠ્યપુસ્તક આધારિત શીખો.',
    timeStampedNotes: [
      { time: '01:00', text: 'Introduction to Integers on Number Line', textGujarati: 'સંખ્યા રેખા પર પૂર્ણાંક સંખ્યાઓ' },
      { time: '05:30', text: 'Negative minus negative rule: (-a) - (-b)', textGujarati: 'ઋણ પૂર્ણાંક બાદબાકી નિયમ' },
      { time: '11:15', text: 'Properties of addition & associative law', textGujarati: 'સરવાળાના જૂથ અને ક્રમનો ગુણધર્મ' },
      { time: '15:20', text: 'NCERT textbook exercise walkthrough', textGujarati: 'સ્વાધ્યાય ૧.૧ અને ૧.૨ ના દાખલા' },
    ],
    comments: [],
  },
  {
    id: 'vid-school-7-2',
    grades: ['7'],
    boards: ['CBSE', 'GSEB'],
    category: 'Science',
    categoryGujarati: 'વિજ્ઞાન',
    title: 'Class 7 Science – Nutrition in Plants & Photosynthesis',
    titleGujarati: 'ધોરણ ૭ વિજ્ઞાન – પ્રકરણ ૧: વનસ્પતિમાં પોષણ અને પ્રકાશસંશ્લેષણ (GSEB)',
    instructor: 'Vedantu Class 7',
    instructorGujarati: 'GSEB વિજ્ઞાન પાઠશાળા',
    duration: '15:10',
    durationSeconds: 910,
    youtubeVideoId: 'xrMppTpoqdw',
    thumbnailUrl: 'https://img.youtube.com/vi/xrMppTpoqdw/hqdefault.jpg',
    playbackMode: 'embed',
    description:
      'Understand how chlorophyll, stomata, and solar energy combine during photosynthesis to produce glucose and oxygen in autotrophic plants.',
    descriptionGujarati:
      'હરિદ્રવ્ય (ક્લોરોફિલ), પર્ણરંધ્ર અને સૂર્યપ્રકાશ દ્વારા પ્રકાશસંશ્લેષણ પ્રક્રિયા સમજો.',
    timeStampedNotes: [
      { time: '00:45', text: 'Autotrophs vs Heterotrophs definition', textGujarati: 'સ્વાવલંબી અને પરાવલંબી પોષણ' },
      { time: '04:20', text: 'Role of Chlorophyll & Stomatal pores', textGujarati: 'હરિદ્રવ્ય અને પર્ણરંધ્રોનું કાર્ય' },
      { time: '08:50', text: 'Chemical equation of Photosynthesis', textGujarati: 'પ્રકાશસંશ્લેષણનું રાસાયણિક સમીકરણ' },
      { time: '12:00', text: 'Insectivorous & Parasitic plants (Cuscuta)', textGujarati: 'અમરવેલ (પરોપજીવી) અને કીટાહારી વનસ્પતિ' },
    ],
    comments: [],
  },
  {
    id: 'vid-school-7-3',
    grades: ['7'],
    boards: ['CBSE', 'GSEB'],
    category: 'Science',
    categoryGujarati: 'વિજ્ઞાન',
    title: 'Acids, Bases and Salts – Litmus Indicators & Neutralization',
    titleGujarati: 'ધોરણ ૭ વિજ્ઞાન – પ્રકરણ ૫: એસિડ, બેઇઝ અને ક્ષાર (GSEB)',
    instructor: 'Unacademy Class 7',
    instructorGujarati: 'વિજ્ઞાન વિહાર GSEB',
    duration: '14:20',
    durationSeconds: 860,
    youtubeVideoId: '1mHjMNZZvFo',
    thumbnailUrl: 'https://img.youtube.com/vi/1mHjMNZZvFo/hqdefault.jpg',
    playbackMode: 'embed',
    description:
      'Explore natural indicators like turmeric, litmus paper color changes in acids and bases, and the heat released during neutralization reactions.',
    descriptionGujarati:
      'હળદર, લિટમસ પત્ર અને જાસૂદના સૂચકો વડે એસિડ-બેઇઝ કસોટી અને તટસ્થીકરણ પ્રક્રિયા.',
    timeStampedNotes: [
      { time: '01:10', text: 'Sour taste of acids vs bitter taste of bases', textGujarati: 'એસિડ અને બેઇઝના ભૌતિક ગુણધર્મો' },
      { time: '04:40', text: 'Litmus paper and Phenolphthalein test', textGujarati: 'લિટમસ પત્ર પર રંગ પરિવર્તન' },
      { time: '09:15', text: 'Neutralization: Acid + Base → Salt + Water', textGujarati: 'તટસ્થીકરણ: એસિડ + બેઇઝ → ક્ષાર + પાણી' },
    ],
    comments: [],
  },

  // ==========================================
  // CLASS 8, 9, 10 MASTERCLASSES (GSEB & CBSE)
  // ==========================================
  {
    id: 'vid-school-8-1',
    grades: ['8'],
    boards: ['CBSE', 'GSEB'],
    category: 'Mathematics',
    categoryGujarati: 'ગણિત',
    title: 'Class 8 Math – Squares and Square Roots (Prime Factorization & Division)',
    titleGujarati: 'ધોરણ ૮ ગણિત – વર્ગ અને વર્ગમૂળ (અવિભાજ્ય અવયવ અને ભાગાકારની રીત) (GSEB)',
    instructor: 'Magnet Brains',
    instructorGujarati: 'ગુજરાત માધ્યમિક બોર્ડ',
    duration: '16:30',
    durationSeconds: 990,
    youtubeVideoId: 'AT14lCXuMKI',
    thumbnailUrl: 'https://img.youtube.com/vi/AT14lCXuMKI/hqdefault.jpg',
    playbackMode: 'embed',
    description:
      'Master finding square roots using prime factorization and long division methods for Class 8 exams.',
    descriptionGujarati:
      'ધોરણ ૮ ગણિત: પૂર્ણ વર્ગ સંખ્યાઓ, અવિભાજ્ય અવયવીકરણ અને ભાગાકારની રીતે વર્ગમૂળ શોધવાની પદ્ધતિ.',
    timeStampedNotes: [
      { time: '01:00', text: 'Properties of square numbers', textGujarati: 'વર્ગ સંખ્યાઓના ગુણધર્મો' },
      { time: '06:20', text: 'Finding square root using Prime Factorization', textGujarati: 'અવિભાજ્ય અવયવોની રીતે વર્ગમૂળ' },
      { time: '11:40', text: 'Long division method for large numbers', textGujarati: 'ભાગાકારની રીતે વર્ગમૂળ શોધવું' },
    ],
    comments: [],
  },
  {
    id: 'vid-school-10-1',
    grades: ['10'],
    boards: ['CBSE', 'GSEB'],
    category: 'Mathematics',
    categoryGujarati: 'ગણિત',
    title: 'Class 10 Math – Trigonometry Formulas & Table Trick in 10 Minutes',
    titleGujarati: 'ધોરણ ૧૦ ગણિત – ત્રિકોણમિતિનો પરિચય અને કોષ્ટક યાદ રાખવાની શોર્ટકટ ટ્રીક (GSEB બોર્ડ)',
    instructor: 'Dear Sir',
    instructorGujarati: 'GSEB ૧૦મું બોર્ડ ટોપર ગાઈડ',
    duration: '12:50',
    durationSeconds: 770,
    youtubeVideoId: 'jzNxXm5twx4',
    thumbnailUrl: 'https://img.youtube.com/vi/jzNxXm5twx4/hqdefault.jpg',
    playbackMode: 'embed',
    description:
      'Learn the palm trick to memorize all trigonometric ratios (0°, 30°, 45°, 60°, 90°) effortlessly for Class 10 Board exams.',
    descriptionGujarati:
      'GSEB ધોરણ ૧૦ બોર્ડ પરીક્ષા: sin, cos, tan, cosec, sec, cot ના મૂલ્યો અને નિત્યસમો સરળ ટ્રીક સાથે.',
    timeStampedNotes: [
      { time: '00:50', text: 'sin, cos, tan, cot, sec, cosec definitions', textGujarati: 'ત્રિકોણમિતીય ગુણોત્તરોની વ્યાખ્યા' },
      { time: '04:15', text: 'Hand table shortcut trick for values', textGujarati: 'કોષ્ટક યાદ રાખવાની હાથની ટ્રીક' },
      { time: '08:30', text: 'Trigonometric identities proof', textGujarati: 'ત્રિકોણમિતીય નિત્યસમોની સાબિતી' },
    ],
    comments: [],
  },

  // ==========================================
  // COLLEGE & PLACEMENT MASTERCLASSES
  // ==========================================
  {
    id: 'vid-1',
    grades: ['college'],
    boards: ['CBSE', 'GSEB', 'University'],
    category: 'Quantitative Aptitude',
    title: 'Speed, Distance & Time – Shortcuts & Tricks for Placement',
    instructor: 'CareerRide',
    duration: '14:22',
    durationSeconds: 862,
    youtubeVideoId: 'jzNxXm5twx4',
    thumbnailUrl: 'https://img.youtube.com/vi/jzNxXm5twx4/hqdefault.jpg',
    playbackMode: 'embed',
    description:
      'Master the essential shortcuts and tricks for Speed, Distance & Time problems frequently tested in campus placements, job interviews, and competitive exams.',
    timeStampedNotes: [
      { time: '00:45', text: 'Core Speed = Distance / Time formula' },
      { time: '03:10', text: 'Unit conversion: km/hr ↔ m/s (multiply by 5/18)' },
      { time: '06:30', text: 'Average speed shortcut: 2ab / (a+b)' },
      { time: '10:15', text: 'Practice problem walkthrough for placements' },
    ],
    comments: [],
  },
  {
    id: 'vid-2',
    grades: ['college'],
    boards: ['CBSE', 'GSEB', 'University'],
    category: 'Data Structures & Algorithms',
    title: 'Learn Binary Search in 10 Minutes 🪓',
    instructor: 'Bro Code',
    duration: '10:27',
    durationSeconds: 627,
    youtubeVideoId: 'xrMppTpoqdw',
    thumbnailUrl: 'https://img.youtube.com/vi/xrMppTpoqdw/hqdefault.jpg',
    playbackMode: 'embed',
    description:
      'Learn the divide-and-conquer strategy behind Binary Search, why it achieves O(log n) efficiency on sorted arrays, and step-by-step trace execution.',
    timeStampedNotes: [
      { time: '00:30', text: 'What is Binary Search & why O(log n)' },
      { time: '02:45', text: 'How mid-point calculation works' },
      { time: '05:20', text: 'Step-by-step walkthrough on sorted array' },
      { time: '08:00', text: 'Recursive vs Iterative implementation' },
    ],
    comments: [],
  },
  {
    id: 'vid-3',
    grades: ['college'],
    boards: ['CBSE', 'GSEB', 'University'],
    category: 'React & JavaScript',
    title: 'React JS Crash Course',
    instructor: 'Traversy Media',
    duration: '1:48:47',
    durationSeconds: 6527,
    youtubeVideoId: 'w7ejDZ8SWv8',
    thumbnailUrl: 'https://img.youtube.com/vi/w7ejDZ8SWv8/hqdefault.jpg',
    playbackMode: 'embed',
    description:
      'Comprehensive crash course covering modern React functional components, useState, useEffect lifecycle methods, and props passing for technical frontend rounds.',
    timeStampedNotes: [
      { time: '02:30', text: 'What is React & why use it?' },
      { time: '15:00', text: 'Components, JSX & Props' },
      { time: '35:00', text: 'State management with useState Hook' },
      { time: '55:00', text: 'useEffect & fetching data from API' },
    ],
    comments: [],
  },
  {
    id: 'vid-4',
    grades: ['college'],
    boards: ['CBSE', 'GSEB', 'University'],
    category: 'HR & Placement Interview',
    title: '08 Common Interview Questions & Answers',
    instructor: "Let's Talk – English Lessons",
    duration: '11:42',
    durationSeconds: 702,
    youtubeVideoId: '1mHjMNZZvFo',
    thumbnailUrl: 'https://img.youtube.com/vi/1mHjMNZZvFo/hqdefault.jpg',
    playbackMode: 'embed',
    description:
      'Master the most common HR interview questions including "Tell me about yourself", "Why should we hire you?", and how to demonstrate leadership skills.',
    timeStampedNotes: [
      { time: '00:55', text: 'Question 1: Tell Me About Yourself' },
      { time: '03:40', text: 'Question 2: Why Do You Want This Job?' },
      { time: '06:50', text: 'Question 3: What Are Your Greatest Strengths?' },
      { time: '09:30', text: 'Question 4: Where Do You See Yourself in 5 Years?' },
    ],
    comments: [],
  },
  {
    id: 'vid-5',
    grades: ['college'],
    boards: ['CBSE', 'GSEB', 'University'],
    category: 'Data Structures & Algorithms',
    title: 'Arrays in Data Structure – Declaration, Initialization & Memory',
    instructor: "Jenny's Lectures CS IT",
    duration: '17:38',
    durationSeconds: 1058,
    youtubeVideoId: 'AT14lCXuMKI',
    thumbnailUrl: 'https://img.youtube.com/vi/AT14lCXuMKI/hqdefault.jpg',
    playbackMode: 'embed',
    description:
      'Fundamental overview of Arrays – declaration, initialization, memory representation, and Time Complexity for university and placement exams.',
    timeStampedNotes: [
      { time: '01:20', text: 'What is an Array & why use it?' },
      { time: '05:15', text: 'Declaration & Initialization in C/C++' },
      { time: '10:30', text: 'Memory layout: contiguous allocation' },
      { time: '14:00', text: 'Accessing elements: indexing & traversal' },
    ],
    comments: [],
  },
];

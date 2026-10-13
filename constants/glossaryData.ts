export interface GlossaryTerm {
  id: string;
  gujaratiTerm: string;
  englishTerm: string;
  phoneticPronunciation?: string;
  subject: 'Science' | 'Mathematics' | 'Social Science' | 'General';
  definitionEnglish: string;
  definitionGujarati: string;
  exampleEnglish?: string;
  exampleGujarati?: string;
}

export const GLOSSARY_DICTIONARY: Record<string, GlossaryTerm> = {
  photosynthesis: {
    id: 'photosynthesis',
    gujaratiTerm: 'પ્રકાશસંશ્લેષણ',
    englishTerm: 'Photosynthesis',
    phoneticPronunciation: 'foh-toh-sin-thuh-sis',
    subject: 'Science',
    definitionEnglish: 'The biological process by which green plants use sunlight, carbon dioxide, and water to synthesize glucose and release oxygen.',
    definitionGujarati: 'લીલી વનસ્પતિ સૂર્યપ્રકાશ, હરિતદ્રવ્ય, કાર્બન ડાયોક્સાઈડ અને પાણીનો ઉપયોગ કરી ખોરાક બનાવે અને ઓક્સિજન મુક્ત કરે તે જૈવિક ક્રિયા.',
    exampleEnglish: '6CO₂ + 6H₂O + Sunlight → C₆H₁₂O₆ + 6O₂',
    exampleGujarati: '૬CO₂ + ૬H₂O + સૂર્યપ્રકાશ → C₆H₁₂O₆ + ૬O₂',
  },
  chlorophyll: {
    id: 'chlorophyll',
    gujaratiTerm: 'હરિતદ્રવ્ય (ક્લોરોફિલ)',
    englishTerm: 'Chlorophyll',
    phoneticPronunciation: 'klor-uh-fil',
    subject: 'Science',
    definitionEnglish: 'A green pigment present in all green plants and in cyanobacteria, responsible for the absorption of light to provide energy for photosynthesis.',
    definitionGujarati: 'વનસ્પતિના પર્ણોમાં રહેલું લીલું રંજકદ્રવ્ય જે સૂર્યપ્રકાશનું શોષણ કરી પ્રકાશસંશ્લેષણમાં મદદ કરે છે.',
  },
  circuit: {
    id: 'circuit',
    gujaratiTerm: 'વિદ્યુત પરિપથ',
    englishTerm: 'Electric Circuit',
    phoneticPronunciation: 'ee-lek-trik sur-kit',
    subject: 'Science',
    definitionEnglish: 'A continuous, closed loop conducting path through which electric current flows from the positive terminal to negative terminal.',
    definitionGujarati: 'વીજપ્રવાહના વહન માટેનો સળંગ અને બંધ વાહક માર્ગ (જેમાં બેટરી, સ્વિચ અને બલ્બ જોડાયેલા હોય છે).',
  },
  resistance: {
    id: 'resistance',
    gujaratiTerm: 'વિદ્યુત અવરોધ',
    englishTerm: 'Resistance (R)',
    phoneticPronunciation: 'ri-zis-tuns',
    subject: 'Science',
    definitionEnglish: 'A measure of the opposition to current flow in an electrical circuit. Measured in Ohms (Ω).',
    definitionGujarati: 'વાહકમાંથી વહેતા વિદ્યુતપ્રવાહના માર્ગમાં નડતા અવરોધક ગુણધર્મને અવરોધ કહે છે. તેનો એકમ ઓહ્મ (Ω) છે.',
  },
  primenumber: {
    id: 'primenumber',
    gujaratiTerm: 'અવિભાજ્ય સંખ્યા',
    englishTerm: 'Prime Number',
    phoneticPronunciation: 'prahym nuhm-ber',
    subject: 'Mathematics',
    definitionEnglish: 'A whole number greater than 1 that cannot be formed by multiplying two smaller natural numbers (only divisible by 1 and itself).',
    definitionGujarati: '૧ કરતાં મોટી એવી પૂર્ણ સંખ્યા જેને માત્ર બે જ અવયવ હોય: ૧ અને સંખ્યા પોતે (દા.ત. ૨, ૩, ૫, ૭, ૧૧).',
    exampleEnglish: '2, 3, 5, 7, 11, 13, 17...',
    exampleGujarati: '૨, ૩, ૫, ૭, ૧૧, ૧૩, ૧૭... (૨ સૌથી નાની બેકી અવિભાજ્ય સંખ્યા છે).',
  },
  composite: {
    id: 'composite',
    gujaratiTerm: 'વિભાજ્ય સંખ્યા',
    englishTerm: 'Composite Number',
    phoneticPronunciation: 'kuhm-poz-it nuhm-ber',
    subject: 'Mathematics',
    definitionEnglish: 'A positive integer that can be formed by multiplying two smaller positive integers (has more than two factors).',
    definitionGujarati: 'એવી પ્રાકૃતિક સંખ્યા જેને બે કરતાં વધારે અવયવો હોય (દા.ત. ૪, ૬, ૮, ૯, ૧૦).',
  },
  integer: {
    id: 'integer',
    gujaratiTerm: 'પૂર્ણાંક સંખ્યા',
    englishTerm: 'Integer',
    phoneticPronunciation: 'in-ti-jer',
    subject: 'Mathematics',
    definitionEnglish: 'A whole number that can be positive, negative, or zero, but does not include fractional or decimal parts.',
    definitionGujarati: 'ઋણ સંખ્યાઓ, શૂન્ય અને ધન પ્રાકૃતિક સંખ્યાઓનો સમૂહ (... -૩, -૨, -૧, ૦, ૧, ૨, ૩ ...).',
  },
  inscription: {
    id: 'inscription',
    gujaratiTerm: 'શિલાલેખ (અભિલેખ)',
    englishTerm: 'Inscription',
    phoneticPronunciation: 'in-skrip-shuhn',
    subject: 'Social Science',
    definitionEnglish: 'Words, orders or edicts carved into stone, metal pillars, or rock surfaces that survive for centuries.',
    definitionGujarati: 'ધાતુ કે પથ્થર જેવી કઠણ સપાટી પર કોતરેલા લેખ કે રાજાઓની આજ્ઞાઓ (દા.ત. જૂનાગઢમાં આવેલો સમ્રાટ અશોકનો શિલાલેખ).',
  },
  manuscript: {
    id: 'manuscript',
    gujaratiTerm: 'તાડપત્ર / ભોજપત્ર',
    englishTerm: 'Manuscript',
    phoneticPronunciation: 'man-yuh-skript',
    subject: 'Social Science',
    definitionEnglish: 'A book, document, or piece of music written by hand rather than typed or printed (written on palm leaves or birch bark).',
    definitionGujarati: 'પ્રાચીન સમયમાં તાડના વૃક્ષના પર્ણ કે હિમાલયના ભૂર્જ નામના વૃક્ષની છાલ પર હાથેથી લખાયેલી હસ્તપ્રતો.',
  },
  gravity: {
    id: 'gravity',
    gujaratiTerm: 'ગુરુત્વાકર્ષણ બળ',
    englishTerm: 'Gravitational Force',
    phoneticPronunciation: 'grav-i-tay-shuh-nl fors',
    subject: 'Science',
    definitionEnglish: 'A fundamental force of attraction that exists between all physical objects with mass in the universe.',
    definitionGujarati: 'વિશ્વના કોઈપણ બે દળ ધરાવતા પદાર્થો વચ્ચે લાગતું પરસ્પર આકર્ષણ બળ. પૃથ્વી પર g = 9.8 m/s².',
  },
  evaporation: {
    id: 'evaporation',
    gujaratiTerm: 'બાષ્પીભવન',
    englishTerm: 'Evaporation',
    phoneticPronunciation: 'i-vap-uh-ray-shuhn',
    subject: 'Science',
    definitionEnglish: 'The process of a substance turning from a liquid state into vapor below its boiling point.',
    definitionGujarati: 'ઉત્કલનબિંદુથી નીચા તાપમાને પ્રવાહીનું બાષ્પ (વાયુ) સ્વરૂપમાં રૂપાંતર થવાની સપાટી પર થતી ઘટના.',
  },
  quadratic: {
    id: 'quadratic',
    gujaratiTerm: 'દ્વિઘાત સમીકરણ',
    englishTerm: 'Quadratic Equation',
    phoneticPronunciation: 'kwo-drat-ik i-kway-zhuhn',
    subject: 'Mathematics',
    definitionEnglish: 'An equation of the second degree, meaning it contains at least one term that is squared: ax² + bx + c = 0.',
    definitionGujarati: 'ચલની મહત્તમ ૨ ઘાત ધરાવતું બહુપદી સમીકરણ: ax² + bx + c = 0 (જ્યાં a ≠ 0).',
  },
};

export const findGlossaryTerm = (text: string): GlossaryTerm | null => {
  const clean = text.toLowerCase().trim();
  for (const [key, term] of Object.entries(GLOSSARY_DICTIONARY)) {
    if (
      key === clean ||
      term.englishTerm.toLowerCase().includes(clean) ||
      term.gujaratiTerm.includes(text)
    ) {
      return term;
    }
  }
  return null;
};

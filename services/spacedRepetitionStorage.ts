import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SpacedItem {
  id: string;
  front: string;
  frontGujarati?: string;
  back: string;
  backGujarati?: string;
  subject: string;
  box: number; // 1 to 5
  nextReviewDate: number; // timestamp
  lastReviewedDate?: number;
  consecutiveCorrect: number;
}

const STORAGE_KEY_ITEMS = '@mindsprint_spaced_items_';
const STORAGE_KEY_SPRINT_DONE = '@mindsprint_sprint_done_date_';

export const SpacedRepetitionStorage = {
  getStorageKey(email: string = 'guest', grade: string = '10'): string {
    return `${STORAGE_KEY_ITEMS}${grade}_${email}`;
  },

  async isSprintCompletedToday(email: string = 'guest'): Promise<boolean> {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const savedDate = await AsyncStorage.getItem(`${STORAGE_KEY_SPRINT_DONE}${email}`);
      return savedDate === today;
    } catch {
      return false;
    }
  },

  async markSprintCompletedToday(email: string = 'guest'): Promise<void> {
    try {
      const today = new Date().toISOString().slice(0, 10);
      await AsyncStorage.setItem(`${STORAGE_KEY_SPRINT_DONE}${email}`, today);
    } catch (e) {
      console.warn('Error saving sprint completion:', e);
    }
  },

  async getItemsForReview(email: string = 'guest', grade: string = '10'): Promise<SpacedItem[]> {
    try {
      const raw = await AsyncStorage.getItem(this.getStorageKey(email, grade));
      let items: SpacedItem[] = raw ? JSON.parse(raw) : [];

      if (!items || items.length === 0) {
        items = this.getDefaultCurriculumCards(grade);
        await AsyncStorage.setItem(this.getStorageKey(email, grade), JSON.stringify(items));
      }

      const now = Date.now();
      // Items due for review, or box 1 items, capped at 5
      const dueItems = items.filter((item) => item.nextReviewDate <= now);
      if (dueItems.length >= 5) {
        return dueItems.slice(0, 5);
      }

      // If fewer than 5 due, pad with items from box 1 or 2
      const rest = items.filter((item) => !dueItems.some((d) => d.id === item.id));
      return [...dueItems, ...rest].slice(0, 5);
    } catch (e) {
      console.warn('Error reading spaced items:', e);
      return [];
    }
  },

  async recordResult(
    itemId: string,
    remembered: boolean,
    email: string = 'guest',
    grade: string = '10'
  ): Promise<void> {
    try {
      const raw = await AsyncStorage.getItem(this.getStorageKey(email, grade));
      if (!raw) return;
      const items: SpacedItem[] = JSON.parse(raw);
      const idx = items.findIndex((i) => i.id === itemId);
      if (idx === -1) return;

      const item = items[idx];
      const now = Date.now();
      let nextBox = item.box;
      let nextIntervalDays = 1;

      if (remembered) {
        nextBox = Math.min(5, item.box + 1);
        item.consecutiveCorrect += 1;
        // Interval schedule: Box 1: 1d, Box 2: 3d, Box 3: 7d, Box 4: 14d, Box 5: 30d
        const intervals = [1, 1, 3, 7, 14, 30];
        nextIntervalDays = intervals[nextBox] || 1;
      } else {
        nextBox = 1;
        item.consecutiveCorrect = 0;
        nextIntervalDays = 1;
      }

      items[idx] = {
        ...item,
        box: nextBox,
        lastReviewedDate: now,
        nextReviewDate: now + nextIntervalDays * 24 * 60 * 60 * 1000,
      };

      await AsyncStorage.setItem(this.getStorageKey(email, grade), JSON.stringify(items));
    } catch (e) {
      console.warn('Error recording spaced review:', e);
    }
  },

  getDefaultCurriculumCards(grade: string): SpacedItem[] {
    const now = Date.now();
    const gradeKey = grade ? grade.toLowerCase() : '10';
    const cardsByGrade: Record<string, Array<{ id: string; front: string; frontGujarati?: string; back: string; backGujarati?: string; subject: string }>> = {
  "6": [
    {
      "id": "sr_6_1",
      "front": "What is the relation between HCF, LCM and two numbers a and b?",
      "frontGujarati": "બે સંખ્યાઓ a અને b માટે ગુ.સા.અ. (HCF) અને લ.સા.અ. (LCM) વચ્ચેનો સંબંધ શું છે?",
      "back": "LCM(a, b) × HCF(a, b) = a × b",
      "backGujarati": "લ.સા.અ. × ગુ.સા.અ. = બંને સંખ્યાઓનો ગુણાકાર (a × b)",
      "subject": "Mathematics"
    },
    {
      "id": "sr_6_2",
      "front": "What are the three main energy-providing nutrients in food?",
      "frontGujarati": "ખોરાકમાં ઊર્જા આપતા મુખ્ય ત્રણ પોષક તત્વો કયા છે?",
      "back": "Carbohydrates, Fats, and Proteins (Carbohydrates & Fats are primary energy sources).",
      "backGujarati": "કાર્બોહાઇડ્રેટ, ચરબી (મેદ) અને પ્રોટીન.",
      "subject": "Science"
    },
    {
      "id": "sr_6_3",
      "front": "What is the sum of angles in any triangle?",
      "frontGujarati": "કોઈપણ ત્રિકોણના ત્રણેય ખૂણાઓનો સરવાળો કેટલો થાય છે?",
      "back": "The sum of all three interior angles of a triangle is always 180°.",
      "backGujarati": "ત્રિકોણના ત્રણેય ખૂણાઓનો સરવાળો હંમેશા ૧૮૦° થાય છે.",
      "subject": "Mathematics"
    },
    {
      "id": "sr_6_4",
      "front": "Which organelle contains chlorophyll for photosynthesis in plants?",
      "frontGujarati": "વનસ્પતિમાં પ્રકાશસંશ્લેષણ માટેનું હરિતદ્રવ્ય કઈ અંગિકામાં હોય છે?",
      "back": "Chloroplast (હરિતકણ) contains the green pigment chlorophyll.",
      "backGujarati": "હરિતકણ (Chloroplast) માં લીલું રંજકદ્રવ્ય ક્લોરોફિલ આવેલું હોય છે.",
      "subject": "Science"
    },
    {
      "id": "sr_6_5",
      "front": "What is the perimeter of a rectangle with length l and breadth b?",
      "frontGujarati": "લંબાઈ l અને પહોળાઈ b ધરાવતા લંબચોરસની પરિમિતિનું સૂત્ર શું છે?",
      "back": "Perimeter = 2 × (Length + Breadth) = 2(l + b)",
      "backGujarati": "પરિમિતિ = ૨ × (લંબાઈ + પહોળાઈ) = 2(l + b)",
      "subject": "Mathematics"
    },
    {
      "id": "sr_6_6",
      "front": "What happens when like magnetic poles are brought together?",
      "frontGujarati": "ચુંબકના સમાન ધ્રુવોને એકબીજાની નજીક લાવતાં શું થાય છે?",
      "back": "Like poles repel each other (N-N and S-S repel; opposite poles attract).",
      "backGujarati": "સમાન ધ્રુવો વચ્ચે અપાકર્ષણ થાય છે (N-N અને S-S અપાકર્ષે; અસમાન આકર્ષે).",
      "subject": "Science"
    },
    {
      "id": "sr_6_7",
      "front": "What is the definition of a proper fraction?",
      "frontGujarati": "શુદ્ધ અપૂર્ણાંક (Proper Fraction) કોને કહેવાય?",
      "back": "A fraction where the numerator is strictly less than the denominator (e.g., 3/5).",
      "backGujarati": "જે અપૂર્ણાંકમાં અંશ એ છેદ કરતાં નાનો હોય તેને શુદ્ધ અપૂર્ણાંક કહેવાય (દા.ત. ૩/૫).",
      "subject": "Mathematics"
    }
  ],
  "7": [
    {
      "id": "sr_7_1",
      "front": "Rule for multiplication of two negative integers (-a) × (-b)?",
      "frontGujarati": "બે ઋણ પૂર્ણાંકો (-a) × (-b) ના ગુણાકારનો નિયમ શું છે?",
      "back": "The product of two negative integers is always positive: (-a) × (-b) = +(a × b).",
      "backGujarati": "બે ઋણ પૂર્ણાંકોનો ગુણાકાર હંમેશા ધન પૂર્ણાંક બને છે: (-a) × (-b) = +(a × b).",
      "subject": "Mathematics"
    },
    {
      "id": "sr_7_2",
      "front": "How does blue litmus paper react in an acidic solution?",
      "frontGujarati": "એસિડિક દ્રાવણમાં ભૂરું લિટમસ પત્ર કેવો રંગ ધારણ કરે છે?",
      "back": "Acids turn blue litmus red. (Bases turn red litmus blue).",
      "backGujarati": "એસિડ ભૂરા લિટમસને લાલ બનાવે છે. (બેઇઝ લાલ લિટમસને ભૂરું બનાવે છે).",
      "subject": "Science"
    },
    {
      "id": "sr_7_3",
      "front": "Formula for Simple Interest (I) on principal P at rate R% for time T?",
      "frontGujarati": "મુદ્દલ P, વાર્ષિક વ્યાજનો દર R% અને મુદત T વર્ષ માટે સાદા વ્યાજ (I) નું સૂત્ર?",
      "back": "I = (P × R × T) / 100",
      "backGujarati": "I = (P × R × T) / 100",
      "subject": "Mathematics"
    },
    {
      "id": "sr_7_4",
      "front": "What are the three modes of heat transfer?",
      "frontGujarati": "ઉષ્મા પ્રસરણની મુખ્ય ત્રણ રીતો કઈ કઈ છે?",
      "back": "1. Conduction (solids), 2. Convection (fluids), 3. Radiation (vacuum/electromagnetic).",
      "backGujarati": "૧. ઉષ્માવહન (ઘન), ૨. ઉષ્માનયન (પ્રવાહી/વાયુ), ૩. ઉષ્મીય વિકિરણ (શૂન્યાવકાશ).",
      "subject": "Science"
    },
    {
      "id": "sr_7_5",
      "front": "Formula for Area of a Triangle with base b and height h?",
      "frontGujarati": "પાયો b અને વેધ h ધરાવતા ત્રિકોણના ક્ષેત્રફળનું સૂત્ર?",
      "back": "Area = (1/2) × base × height = (1/2) × b × h",
      "backGujarati": "ક્ષેત્રફળ = (૧/૨) × પાયો × વેધ = (1/2) × b × h",
      "subject": "Mathematics"
    },
    {
      "id": "sr_7_6",
      "front": "What tiny pores on plant leaves regulate transpiration and gas exchange?",
      "frontGujarati": "વનસ્પતિના પર્ણોમાં વાયુ વિનિમય અને બાષ્પોત્સર્જન માટે કયા સૂક્ષ્મ છિદ્રો આવેલા છે?",
      "back": "Stomata (વાયુરંધ્રો), guarded by kidney-shaped guard cells.",
      "backGujarati": "વાયુરંધ્રો (Stomata), જે રક્ષક કોષો દ્વારા ઘેરાયેલા હોય છે.",
      "subject": "Science"
    },
    {
      "id": "sr_7_7",
      "front": "What is the formula for calculating Speed?",
      "frontGujarati": "ઝડપ (Speed) શોધવાનું ગાણિતિક સૂત્ર શું છે?",
      "back": "Speed = Distance / Time (SI unit: m/s).",
      "backGujarati": "ઝડપ = કાપેલું અંતર / તે માટે લીધેલો સમય (SI એકમ: મીટર/સેકન્ડ).",
      "subject": "Science"
    }
  ],
  "8": [
    {
      "id": "sr_8_1",
      "front": "What is the additive inverse of a rational number a/b?",
      "frontGujarati": "સંમેય સંખ્યા a/b ની વિરોધી સંખ્યા (Additive Inverse) શું થાય?",
      "back": "The additive inverse is -a/b, because (a/b) + (-a/b) = 0.",
      "backGujarati": "વિરોધી સંખ્યા -a/b થાય, કારણ કે (a/b) + (-a/b) = 0.",
      "subject": "Mathematics"
    },
    {
      "id": "sr_8_2",
      "front": "What are the three essential conditions required for Combustion?",
      "frontGujarati": "દહન (Combustion) થવા માટે કઈ ત્રણ અનિવાર્ય શરતો જરૂરી છે?",
      "back": "1. Fuel (combustible substance), 2. Oxygen (supporter of combustion), 3. Ignition temperature.",
      "backGujarati": "૧. દહનશીલ પદાર્થ (બળતણ), ૨. ઓક્સિજન વાયુ, ૩. જ્વલનબિંદુ સુધીનું તાપમાન.",
      "subject": "Science"
    },
    {
      "id": "sr_8_3",
      "front": "Law of Exponents: a^m × a^n = ?",
      "frontGujarati": "ઘાતાંકનો નિયમ: a^m × a^n = ?",
      "back": "a^(m + n) (Powers add when multiplying with same base).",
      "backGujarati": "a^(m + n) (આધાર સરખો હોય ત્યારે ઘાતાંકોનો સરવાળો થાય).",
      "subject": "Mathematics"
    },
    {
      "id": "sr_8_4",
      "front": "Which organelle is called the \"Powerhouse of the Cell\"?",
      "frontGujarati": "કોષનું \"ઊર્જાઘર\" (પાવરહાઉસ) કઈ અંગિકાને કહેવામાં આવે છે?",
      "back": "Mitochondria (કણાભસૂત્ર), because it synthesizes cellular energy in the form of ATP.",
      "backGujarati": "કણાભસૂત્ર (Mitochondria), કારણ કે તે ATP સ્વરૂપે ઊર્જા મુક્ત કરે છે.",
      "subject": "Science"
    },
    {
      "id": "sr_8_5",
      "front": "Formula for Area of a Trapezium with parallel sides a, b and height h?",
      "frontGujarati": "સમાંતર બાજુઓ a, b અને તેમની વચ્ચેનું લંબઅંતર h ધરાવતા સમલંબ ચતુષ્કોણનું ક્ષેત્રફળ?",
      "back": "Area = (1/2) × (a + b) × h",
      "backGujarati": "ક્ષેત્રફળ = (૧/૨) × (સમાંતર બાજુઓનો સરવાળો a + b) × વેધ h",
      "subject": "Mathematics"
    },
    {
      "id": "sr_8_6",
      "front": "What is the SI unit of Frequency of Sound?",
      "frontGujarati": "ધ્વનિની આવૃત્તિ (Frequency) નો SI એકમ શું છે?",
      "back": "Hertz (Hz). 1 Hz = 1 vibration or cycle per second.",
      "backGujarati": "હર્ટ્ઝ (Hz). ૧ Hz = પ્રતિ સેકન્ડે થતાં ૧ કંપન.",
      "subject": "Science"
    },
    {
      "id": "sr_8_7",
      "front": "Identity: (a + b)(a - b) = ?",
      "frontGujarati": "નિત્યસમ: (a + b)(a - b) = ?",
      "back": "a² - b²",
      "backGujarati": "a² - b²",
      "subject": "Mathematics"
    }
  ],
  "9": [
    {
      "id": "sr_9_1",
      "front": "State Newton's Second Law of Motion formula.",
      "frontGujarati": "ન્યૂટનનો ગતિનો બીજો નિયમ અને તેનું સૂત્ર જણાવો.",
      "back": "Force = Mass × Acceleration (F = m × a). SI unit is Newton (N = kg·m/s²).",
      "backGujarati": "બળ = દળ × પ્રવેગ (F = m × a). SI એકમ ન્યૂટન (N) છે.",
      "subject": "Science"
    },
    {
      "id": "sr_9_2",
      "front": "What is the subatomic composition of an atom (protons, neutrons, electrons)?",
      "frontGujarati": "પરમાણુના ત્રણ અપરમાણ્વીય કણો કયા કયા છે અને તેમનો વીજભાર શું છે?",
      "back": "Protons (+1 charge, nucleus), Neutrons (0 charge, nucleus), Electrons (-1 charge, outer orbits).",
      "backGujarati": "પ્રોટોન (ધન વીજભાર, કેન્દ્ર), ન્યુટ્રોન (તટસ્થ, કેન્દ્ર), ઇલેક્ટ્રોન (ઋણ વીજભાર, કક્ષામાં ભ્રમણ).",
      "subject": "Science"
    },
    {
      "id": "sr_9_3",
      "front": "Formula for Kinetic Energy (KE) of an object of mass m moving at velocity v?",
      "frontGujarati": "દળ m અને વેગ v ધરાવતા પદાર્થની ગતિઉર્જા (KE) શોધવાનું સૂત્ર?",
      "back": "KE = (1/2) × m × v²",
      "backGujarati": "KE = (૧/૨) × m × v²",
      "subject": "Science"
    },
    {
      "id": "sr_9_4",
      "front": "State the Factor Theorem for a polynomial p(x).",
      "frontGujarati": "બહુપદી p(x) માટે અવયવ પ્રમેયનું કથન જણાવો.",
      "back": "(x - a) is a factor of polynomial p(x) if and only if p(a) = 0.",
      "backGujarati": "જો p(a) = 0 હોય, તો અને તો જ (x - a) એ બહુપદી p(x) નો અવયવ છે.",
      "subject": "Mathematics"
    },
    {
      "id": "sr_9_5",
      "front": "State Archimedes' Principle of Buoyancy.",
      "frontGujarati": "આર્કીમિડીઝનો ઉત્પ્લાવકતાનો સિદ્ધાંત જણાવો.",
      "back": "An object immersed in fluid experiences an upward buoyant force equal to the weight of fluid displaced.",
      "backGujarati": "તરલ પદાર્થમાં ડૂબાડેલા પદાર્થ પર લાગતું ઉત્પ્લાવક બળ તેણે વિસ્થાપિત કરેલા પ્રવાહીના વજન જેટલું હોય છે.",
      "subject": "Science"
    },
    {
      "id": "sr_9_6",
      "front": "Formula for Volume of a Sphere of radius r?",
      "frontGujarati": "ત્રિજ્યા r ધરાવતા ગોલકનું ઘનફળ શોધવાનું સૂત્ર શું છે?",
      "back": "V = (4/3) × π × r³",
      "backGujarati": "ઘનફળ = (૪/૩) × π × r³",
      "subject": "Mathematics"
    },
    {
      "id": "sr_9_7",
      "front": "Which cell organelle is known as the \"Suicide Bag\" of the cell?",
      "frontGujarati": "કોષની \"આત્મઘાતી કોથળી\" તરીકે કઈ અંગિકા ઓળખાય છે?",
      "back": "Lysosome (લાયસોઝોમ), because its digestive enzymes can digest the damaged cell itself.",
      "backGujarati": "લાયસોઝોમ (Lysosome), કારણ કે તેમાં રહેલા પાચક ઉત્સેચકો ક્ષતિગ્રસ્ત કોષનું વિઘટન કરી નાખે છે.",
      "subject": "Science"
    }
  ],
  "10": [
    {
      "id": "sr_10_1",
      "front": "What is Ohm's Law and its formula?",
      "frontGujarati": "ઓહ્મનો નિયમ (Ohm's Law) અને તેનું ગાણિતિક સૂત્ર શું છે?",
      "back": "V = I × R (Potential Difference = Current × Resistance). At constant temperature, current is directly proportional to voltage.",
      "backGujarati": "V = I × R (વિદ્યુતસ્થિતિમાન = પ્રવાહ × અવરોધ). અચળ તાપમાને વાહકમાંથી વહેતો પ્રવાહ તેના બે છેડા વચ્ચેના વોલ્ટેજના સમપ્રમાણમાં હોય છે.",
      "subject": "Science"
    },
    {
      "id": "sr_10_2",
      "front": "State the Quadratic Formula to find roots of ax² + bx + c = 0.",
      "frontGujarati": "દ્વિઘાત સમીકરણ ax² + bx + c = 0 ના ઉકેલ (બીજ) શોધવાનું સૂત્ર જણાવો.",
      "back": "x = (-b ± √(b² - 4ac)) / (2a)",
      "backGujarati": "x = (-b ± √(b² - 4ac)) / (2a)",
      "subject": "Mathematics"
    },
    {
      "id": "sr_10_3",
      "front": "Distance formula between two points (x₁, y₁) and (x₂, y₂)?",
      "frontGujarati": "બે બિંદુઓ (x₁, y₁) અને (x₂, y₂) વચ્ચેનું અંતરસૂત્ર શું છે?",
      "back": "d = √[(x₂ - x₁)² + (y₂ - y₁)²]",
      "backGujarati": "d = √[(x₂ - x₁)² + (y₂ - y₁)²]",
      "subject": "Mathematics"
    },
    {
      "id": "sr_10_4",
      "front": "What are the 4 essential components for Photosynthesis?",
      "frontGujarati": "પ્રકાશસંશ્લેષણ માટે કયા ૪ ઘટકો અનિવાર્ય છે?",
      "back": "1. Sunlight, 2. Chlorophyll, 3. Carbon Dioxide (CO₂), 4. Water (H₂O). Product: Glucose & Oxygen.",
      "backGujarati": "૧. સૂર્યપ્રકાશ, ૨. હરિતદ્રવ્ય (ક્લોરોફિલ), ૩. કાર્બન ડાયોક્સાઈડ, ૪. પાણી. નીપજ: ગ્લુકોઝ અને ઓક્સિજન.",
      "subject": "Science"
    },
    {
      "id": "sr_10_5",
      "front": "What is the SI unit of Electric Current and Resistance?",
      "frontGujarati": "વિદ્યુતપ્રવાહ અને વિદ્યુત અવરોધનો SI એકમ શું છે?",
      "back": "Current: Ampere (A). Resistance: Ohm (Ω).",
      "backGujarati": "પ્રવાહ: એમ્પીયર (A). અવરોધ: ઓહ્મ (Ω).",
      "subject": "Science"
    },
    {
      "id": "sr_10_6",
      "front": "Formula for Total Surface Area of a Cylinder?",
      "frontGujarati": "નળાકારની કુલ સપાટીનું ક્ષેત્રફળ શોધવાનું સૂત્ર?",
      "back": "A = 2πr(r + h)",
      "backGujarati": "ક્ષેત્રફળ = 2πr(r + h)",
      "subject": "Mathematics"
    },
    {
      "id": "sr_10_7",
      "front": "Law of Conservation of Mass in Chemical Reactions?",
      "frontGujarati": "રાસાયણિક પ્રક્રિયામાં દ્રવ્ય સંરક્ષણનો નિયમ શું કહે છે?",
      "back": "Mass cannot be created or destroyed. Total mass of reactants equals total mass of products.",
      "backGujarati": "કોઈપણ રાસાયણિક પ્રક્રિયામાં દ્રવ્યનું સર્જન કે વિનાશ થતો નથી. પ્રક્રિયકોનું કુલ દળ = નીપજોનું કુલ દળ.",
      "subject": "Science"
    }
  ],
  "11": [
    {
      "id": "sr_11_1",
      "front": "State the Ideal Gas Equation for n moles of gas.",
      "frontGujarati": "n મોલ વાયુ માટે આદર્શ વાયુ સમીકરણ (Ideal Gas Equation) જણાવો.",
      "back": "P × V = n × R × T (where R = 8.314 J/(mol·K)).",
      "backGujarati": "P × V = n × R × T (જ્યાં R = સાર્વત્રિક વાયુ અચળાંક 8.314 J/(mol·K)).",
      "subject": "Chemistry"
    },
    {
      "id": "sr_11_2",
      "front": "State Hooke's Law of Elasticity and its formula.",
      "frontGujarati": "સ્થિતિસ્થાપકતા માટે હૂકનો નિયમ (Hooke's Law) અને સૂત્ર જણાવો.",
      "back": "Stress is directly proportional to Strain within elastic limit: Stress = E × Strain. Restoring force F = -kx.",
      "backGujarati": "સ્થિતિસ્થાપક સીમાની અંદર પ્રતિબળ એ વિકૃતિના સમપ્રમાણમાં હોય છે: પ્રતિબળ = E × વિકૃતિ. પુનઃસ્થાપક બળ F = -kx.",
      "subject": "Physics"
    },
    {
      "id": "sr_11_3",
      "front": "What is the First Law of Thermodynamics formula?",
      "frontGujarati": "ઉષ્માગતિશાસ્ત્રનો પ્રથમ નિયમ અને તેનું ગાણિતિક સૂત્ર જણાવો.",
      "back": "ΔU = Q - W (Change in Internal Energy = Heat added - Work done by system).",
      "backGujarati": "ΔU = Q - W (આંતરિક ઊર્જામાં ફેરફાર = તંત્રને આપેલ ઉષ્મા - તંત્ર દ્વારા થયેલ કાર્ય).",
      "subject": "Physics"
    },
    {
      "id": "sr_11_4",
      "front": "Newton's Universal Law of Gravitation formula between two masses m₁ and m₂?",
      "frontGujarati": "બે દળો m₁ અને m₂ વચ્ચે ન્યૂટનના ગુરુત્વાકર્ષણના સાર્વત્રિક નિયમનું સૂત્ર?",
      "back": "F = G × (m₁ × m₂) / r² (where G = 6.674 × 10⁻¹¹ N·m²/kg²).",
      "backGujarati": "F = G × (m₁ × m₂) / r² (જ્યાં G = 6.674 × 10⁻¹¹ N·m²/kg²).",
      "subject": "Physics"
    },
    {
      "id": "sr_11_5",
      "front": "Trigonometric Pythagorean identity: sin²θ + cos²θ = ?",
      "frontGujarati": "ત્રિકોણમિતીય મૂળભૂત નિત્યસમ: sin²θ + cos²θ = ?",
      "back": "1 (Valid for all real angles θ). Also 1 + tan²θ = sec²θ and 1 + cot²θ = cosec²θ.",
      "backGujarati": "૧ (બધા ખૂણાઓ માટે સત્ય). તેમજ 1 + tan²θ = sec²θ અને 1 + cot²θ = cosec²θ.",
      "subject": "Mathematics"
    },
    {
      "id": "sr_11_6",
      "front": "What is Heisenberg's Uncertainty Principle formula?",
      "frontGujarati": "હાઇઝનબર્ગનો અનિશ્ચિતતાનો સિદ્ધાંત અને તેનું ગાણિતિક સૂત્ર?",
      "back": "Δx × Δp ≥ h / (4π) (Position and momentum cannot both be precisely measured simultaneously).",
      "backGujarati": "Δx × Δp ≥ h / (4π) (સ્થાન અને વેગમાન બંને એકસાથે ચોકસાઈથી માપી શકાતા નથી).",
      "subject": "Chemistry"
    },
    {
      "id": "sr_11_7",
      "front": "What is the Work-Energy Theorem?",
      "frontGujarati": "કાર્ય-ઊર્જા પ્રમેય (Work-Energy Theorem) નું કથન જણાવો.",
      "back": "Net work done on an object equals the change in its kinetic energy: W_net = ΔK = (1/2)m(v² - u²).",
      "backGujarati": "પદાર્થ પર થયેલું પરિણામી કાર્ય તેની ગતિઉર્જાના ફેરફાર જેટલું હોય છે: W = ΔK = (૧/૨)m(v² - u²).",
      "subject": "Physics"
    }
  ],
  "12": [
    {
      "id": "sr_12_1",
      "front": "State Coulomb's Law of Electrostatics formula between charges q₁ and q₂.",
      "frontGujarati": "સ્થિત વિદ્યુતશાસ્ત્રમાં કુલંબનો નિયમ (Coulomb's Law) અને તેનું સૂત્ર જણાવો.",
      "back": "F = (1 / (4πε₀)) × (|q₁ × q₂| / r²) (where 1/(4πε₀) ≈ 9 × 10⁹ N·m²/C²).",
      "backGujarati": "F = (૧ / (૪πε₀)) × (|q₁ × q₂| / r²) (જ્યાં 1/(4πε₀) ≈ 9 × 10⁹ N·m²/C²).",
      "subject": "Physics"
    },
    {
      "id": "sr_12_2",
      "front": "State Faraday's Law of Electromagnetic Induction formula.",
      "frontGujarati": "ફેરાડેનો વિદ્યુતચુંબકીય પ્રેરણનો નિયમ અને પ્રેરિત emf નું સૂત્ર જણાવો.",
      "back": "ε = -dΦ_B / dt (Induced EMF equals negative time rate of change of magnetic flux; negative sign is Lenz's Law).",
      "backGujarati": "ε = -dΦ_B / dt (પ્રેરિત emf એ ચુંબકીય ફ્લક્સના ફેરફારના ઋણ દર જેટલું હોય છે; ઋણ ચિહ્ન લેન્ઝનો નિયમ દર્શાવે છે).",
      "subject": "Physics"
    },
    {
      "id": "sr_12_3",
      "front": "What is Einstein's Photoelectric Equation?",
      "frontGujarati": "આઈન્સ્ટાઈનનું ફોટોઇલેક્ટ્રિક સમીકરણ જણાવો.",
      "back": "K_max = h × ν - Φ (Maximum Kinetic Energy = Photon energy - Work Function Φ).",
      "backGujarati": "K_max = h × ν - Φ (મહત્તમ ગતિઉર્જા = ફોટોનની ઊર્જા - વર્ક ફંક્શન Φ).",
      "subject": "Physics"
    },
    {
      "id": "sr_12_4",
      "front": "Write the Nernst Equation for a galvanic cell electrode at 298 K.",
      "frontGujarati": "૨૯૮ K તાપમાને ગેલવેનિક કોષ માટે નર્ન્સ્ટ સમીકરણ (Nernst Equation) લખો.",
      "back": "E = E° - (0.0591 / n) × log₁₀(Q) (where Q is reaction quotient).",
      "backGujarati": "E = E° - (0.0591 / n) × log₁₀(Q) (જ્યાં Q પ્રક્રિયા ભાગફળ છે).",
      "subject": "Chemistry"
    },
    {
      "id": "sr_12_5",
      "front": "Formula for Integration by Parts: ∫ u·v dx = ?",
      "frontGujarati": "ખંડશઃ સંકલનનું સૂત્ર (Integration by Parts): ∫ u·v dx = ?",
      "back": "∫ u·v dx = u·∫ v dx - ∫ [u' · (∫ v dx)] dx (Select u using ILATE rule).",
      "backGujarati": "∫ u·v dx = u·∫ v dx - ∫ [u' · (∫ v dx)] dx (u ની પસંદગી ILATE ક્રમ મુજબ).",
      "subject": "Mathematics"
    },
    {
      "id": "sr_12_6",
      "front": "What is the relation between peak voltage V₀ and RMS voltage V_rms in AC circuits?",
      "frontGujarati": "પ્રત્યાવર્તી પ્રવાહ (AC) પરિપથમાં મહત્તમ વોલ્ટેજ V₀ અને RMS વોલ્ટેજ V_rms વચ્ચેનો સંબંધ?",
      "back": "V_rms = V₀ / √2 ≈ 0.707 × V₀",
      "backGujarati": "V_rms = V₀ / √2 ≈ 0.707 × V₀",
      "subject": "Physics"
    },
    {
      "id": "sr_12_7",
      "front": "What charge carrier dominates current in p-type semiconductors?",
      "frontGujarati": "p-પ્રકારના અર્ધવાહકમાં વિદ્યુતપ્રવાહનું વહન મુખ્યત્વે કયા વાહકો દ્વારા થાય છે?",
      "back": "Holes (ધન છિદ્રો) are majority carriers, formed by doping with trivalent impurities (e.g. Boron, Indium).",
      "backGujarati": "હોલ્સ (ધન વિદ્યુતભાર વાહકો) બહુમતી વાહકો હોય છે, જે ટ્રાઇવેલેન્ટ અશુદ્ધિઓ (દા.ત. બોરોન) ઉમેરવાથી બને છે.",
      "subject": "Physics"
    }
  ],
  "college": [
    {
      "id": "sr_col_1",
      "front": "What is the Time and Space Complexity of Binary Search on a sorted array of size n?",
      "back": "Time Complexity: O(log n) average and worst case. Space Complexity: O(1) iterative, O(log n) recursive.",
      "subject": "DSA"
    },
    {
      "id": "sr_col_2",
      "front": "What are the Average and Worst Case time complexities of QuickSort?",
      "back": "Average: O(n log n). Worst Case: O(n²) when the pivot chosen is always the smallest or largest element.",
      "subject": "DSA"
    },
    {
      "id": "sr_col_3",
      "front": "What are the ACID properties in Database Management Systems (DBMS)?",
      "back": "Atomicity (all or nothing), Consistency (preserves integrity rules), Isolation (concurrent execution guarantees), Durability (committed data survives crashes).",
      "subject": "DBMS"
    },
    {
      "id": "sr_col_4",
      "front": "What is the CAP Theorem in Distributed Computing?",
      "back": "A distributed system can guarantee at most 2 out of 3: Consistency, Availability, Partition Tolerance (CP, AP, or CA).",
      "subject": "System Design"
    },
    {
      "id": "sr_col_5",
      "front": "Key differences between TCP and UDP transport protocols?",
      "back": "TCP: Connection-oriented, reliable, ordered delivery, flow & congestion control. UDP: Connectionless, lightweight, unreliable, low latency (used in VoIP/gaming).",
      "subject": "Computer Networks"
    },
    {
      "id": "sr_col_6",
      "front": "What does the dependency array in React useEffect([dep]) do when empty vs omitted?",
      "back": "Empty array []: runs only once after initial mount. Omitted: runs after EVERY render. [a, b]: runs on mount and when a or b changes.",
      "subject": "React & JS"
    },
    {
      "id": "sr_col_7",
      "front": "Formula for Compound Interest with annual compounding: A = ?",
      "back": "A = P(1 + r/n)^(n·t) where P = principal, r = annual interest rate, n = times compounded per year, t = years.",
      "subject": "Quantitative Aptitude"
    }
  ]
};

    const templateList = cardsByGrade[gradeKey] || cardsByGrade['10'] || cardsByGrade['college'];

    return templateList.map((card, idx) => ({
      ...card,
      box: idx % 2 === 0 ? 1 : 2,
      nextReviewDate: idx % 2 === 0 ? now - 1000 : now + 86400000,
      consecutiveCorrect: idx % 2 === 0 ? 0 : 1,
    }));
  },
};

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
    return [
      {
        id: 'sr_1',
        front: 'What is Ohm\'s Law and its formula?',
        frontGujarati: 'ઓહ્મનો નિયમ (Ohm\'s Law) અને તેનું ગાણિતિક સૂત્ર શું છે?',
        back: 'V = I × R (Potential Difference = Current × Resistance). At constant temperature, current is directly proportional to voltage.',
        backGujarati: 'V = I × R (વિદ્યુતસ્થિતિમાન = પ્રવાહ × અવરોધ). અચળ તાપમાને વાહકમાંથી વહેતો પ્રવાહ તેના બે છેડા વચ્ચેના વોલ્ટેજના સમપ્રમાણમાં હોય છે.',
        subject: 'Science',
        box: 1,
        nextReviewDate: now - 1000,
        consecutiveCorrect: 0,
      },
      {
        id: 'sr_2',
        front: 'State the Quadratic Formula to find roots of ax² + bx + c = 0.',
        frontGujarati: 'દ્વિઘાત સમીકરણ ax² + bx + c = 0 ના ઉકેલ (બીજ) શોધવાનું સૂત્ર જણાવો.',
        back: 'x = (-b ± √(b² - 4ac)) / (2a)',
        backGujarati: 'x = (-b ± √(b² - 4ac)) / (2a)',
        subject: 'Mathematics',
        box: 1,
        nextReviewDate: now - 1000,
        consecutiveCorrect: 0,
      },
      {
        id: 'sr_3',
        front: 'What are the 4 essential components for Photosynthesis?',
        frontGujarati: 'પ્રકાશસંશ્લેષણ માટે કયા ૪ ઘટકો અનિવાર્ય છે?',
        back: '1. Sunlight, 2. Chlorophyll, 3. Carbon Dioxide (CO₂), 4. Water (H₂O). Product: Glucose & Oxygen.',
        backGujarati: '૧. સૂર્યપ્રકાશ, ૨. હરિતદ્રવ્ય (ક્લોરોફિલ), ૩. કાર્બન ડાયોક્સાઈડ, ૪. પાણી. નીપજ: ગ્લુકોઝ અને ઓક્સિજન.',
        subject: 'Science',
        box: 1,
        nextReviewDate: now - 1000,
        consecutiveCorrect: 0,
      },
      {
        id: 'sr_4',
        front: 'Distance formula between two points (x₁, y₁) and (x₂, y₂)?',
        frontGujarati: 'બે બિંદુઓ (x₁, y₁) અને (x₂, y₂) વચ્ચેનું અંતરસૂત્ર શું છે?',
        back: 'd = √[(x₂ - x₁)² + (y₂ - y₁)²]',
        backGujarati: 'd = √[(x₂ - x₁)² + (y₂ - y₁)²]',
        subject: 'Mathematics',
        box: 1,
        nextReviewDate: now - 1000,
        consecutiveCorrect: 0,
      },
      {
        id: 'sr_5',
        front: 'What is the SI unit of Electric Current and Resistance?',
        frontGujarati: 'વિદ્યુતપ્રવાહ અને વિદ્યુત અવરોધનો SI એકમ શું છે?',
        back: 'Current: Ampere (A). Resistance: Ohm (Ω).',
        backGujarati: 'પ્રવાહ: એમ્પીયર (A). અવરોધ: ઓહ્મ (Ω).',
        subject: 'Science',
        box: 1,
        nextReviewDate: now - 1000,
        consecutiveCorrect: 0,
      },
      {
        id: 'sr_6',
        front: 'Formula for Surface Area of a Cylinder (Total)?',
        frontGujarati: 'નળાકારની કુલ સપાટીનું ક્ષેત્રફળ શોધવાનું સૂત્ર?',
        back: 'A = 2πr(r + h)',
        backGujarati: 'ક્ષેત્રફળ = 2πr(r + h)',
        subject: 'Mathematics',
        box: 2,
        nextReviewDate: now + 86400000,
        consecutiveCorrect: 1,
      },
      {
        id: 'sr_7',
        front: 'Law of Conservation of Mass in Chemical Reactions?',
        frontGujarati: 'રાસાયણિક પ્રક્રિયામાં દ્રવ્ય સંરક્ષણનો નિયમ શું કહે છે?',
        back: 'Mass cannot be created or destroyed. Total mass of reactants equals total mass of products.',
        backGujarati: 'કોઈપણ રાસાયણિક પ્રક્રિયામાં દ્રવ્યનું સર્જન કે વિનાશ થતો નથી. પ્રક્રિયકોનું કુલ દળ = નીપજોનું કુલ દળ.',
        subject: 'Science',
        box: 1,
        nextReviewDate: now - 1000,
        consecutiveCorrect: 0,
      },
    ];
  },
};

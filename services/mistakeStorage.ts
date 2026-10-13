import AsyncStorage from '@react-native-async-storage/async-storage';

export interface MistakeItem {
  id: string;
  questionText: string;
  questionTextGujarati?: string;
  options?: string[];
  selectedAnswer?: number | string;
  correctAnswer: number | string;
  correctAnswerText?: string;
  explanation: string;
  explanationGujarati?: string;
  subject: string;
  chapter?: string;
  grade?: string;
  timestamp: number;
  status: 'needs_practice' | 'mastered';
  reviewAttempts: number;
}

const STORAGE_PREFIX = '@mindsprint_error_vault_';

export const MistakeStorage = {
  getStorageKey(email: string = 'guest', grade: string = '10'): string {
    return `${STORAGE_PREFIX}${grade}_${email}`;
  },

  async getMistakes(email: string = 'guest', grade: string = '10'): Promise<MistakeItem[]> {
    try {
      const raw = await AsyncStorage.getItem(this.getStorageKey(email, grade));
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.warn('Error reading mistake vault:', e);
      return [];
    }
  },

  async addMistake(
    item: Omit<MistakeItem, 'id' | 'timestamp' | 'status' | 'reviewAttempts'>,
    email: string = 'guest',
    grade: string = '10'
  ): Promise<MistakeItem[]> {
    try {
      const current = await this.getMistakes(email, grade);
      // Avoid duplicate mistake entries for same questionText
      const existsIndex = current.findIndex(
        (m) => m.questionText.trim().toLowerCase() === item.questionText.trim().toLowerCase()
      );

      const newItem: MistakeItem = {
        ...item,
        id: `mistake_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        timestamp: Date.now(),
        status: 'needs_practice',
        reviewAttempts: existsIndex >= 0 ? current[existsIndex].reviewAttempts : 0,
      };

      let updated: MistakeItem[];
      if (existsIndex >= 0) {
        // Update existing item status back to needs_practice
        updated = [...current];
        updated[existsIndex] = {
          ...updated[existsIndex],
          selectedAnswer: item.selectedAnswer,
          timestamp: Date.now(),
          status: 'needs_practice',
        };
      } else {
        updated = [newItem, ...current];
      }

      await AsyncStorage.setItem(this.getStorageKey(email, grade), JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.warn('Error adding mistake:', e);
      return [];
    }
  },

  async markResolved(
    id: string,
    email: string = 'guest',
    grade: string = '10'
  ): Promise<MistakeItem[]> {
    try {
      const current = await this.getMistakes(email, grade);
      const updated = current.map((m) =>
        m.id === id
          ? { ...m, status: 'mastered' as const, reviewAttempts: m.reviewAttempts + 1 }
          : m
      );
      await AsyncStorage.setItem(this.getStorageKey(email, grade), JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.warn('Error marking mistake resolved:', e);
      return [];
    }
  },

  async removeMistake(
    id: string,
    email: string = 'guest',
    grade: string = '10'
  ): Promise<MistakeItem[]> {
    try {
      const current = await this.getMistakes(email, grade);
      const updated = current.filter((m) => m.id !== id);
      await AsyncStorage.setItem(this.getStorageKey(email, grade), JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.warn('Error removing mistake:', e);
      return [];
    }
  },
};

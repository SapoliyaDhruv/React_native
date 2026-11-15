import { APTITUDE_QUESTIONS, Question, getOfflineQuestions, COLLEGE_FLASHCARDS_DATA } from '../constants/mindsprintData';
import { VIDEO_LECTURES_DATA, VideoLecture, VideoComment } from '../constants/videoData';
import { CHEATSHEETS_DATA, CheatSheetItem } from '../constants/cheatsheetsData';
import { ACADEMIC_CURRICULUM, GradeCurriculum, AcademicGrade, EducationBoard, InstructionMedium, SamplePaper, ImportantQuestion, SAMPLE_PAPERS_DATA, IMPORTANT_QUESTIONS_DATA } from '../constants/academicData';

import Constants from 'expo-constants';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { addLocalResult, computeLocalDashboardStats, computeLocalWeakSpots } from './localProgress';

/**
 * Offline password check for cached accounts. The password is never stored;
 * only a salted SHA-256 digest (or, where WebCrypto is unavailable such as
 * plain-http web, a non-cryptographic fallback digest).
 */
async function digestPassword(email: string, password: string): Promise<string> {
  const input = `mindsprint:${email.toLowerCase()}:${password}`;
  try {
    return 'sha256:' + (await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, input));
  } catch {
    let h = 0x811c9dc5;
    for (let i = 0; i < input.length; i++) {
      h ^= input.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    return 'fnv:' + h.toString(16);
  }
}

async function cacheLocalUser(email: string, password: string, user: any) {
  try {
    const raw = await AsyncStorage.getItem('@mindsprint_local_users');
    const users = raw ? JSON.parse(raw) : {};
    const { passwordHash: _legacy, ...rest } = user || {};
    users[email.toLowerCase()] = { ...rest, passwordDigest: await digestPassword(email, password) };
    await AsyncStorage.setItem('@mindsprint_local_users', JSON.stringify(users));
  } catch (_) {}
}

const isLocalUrl = (u: string) => /\/\/(localhost|127\.0\.0\.1|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(u);

// Dynamically resolve backend API base URL for Web, Emulator, and Expo Go on physical phones
const resolveApiBaseUrl = (): string => {
  // 0. A deployed backend (non-local EXPO_PUBLIC_API_URL) always wins.
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl && !isLocalUrl(envUrl)) {
    return envUrl.replace(/\/$/, '');
  }

  // 1. If running on Web in browser, use localhost or window hostname
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && window.location?.hostname) {
      return `http://${window.location.hostname}:5000/api`;
    }
    return 'http://localhost:5000/api';
  }

  // 2. If running on Mobile inside Expo Go, auto-extract the host IP from the bundler connection
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const devHostIp = hostUri.split(':')[0];
    if (devHostIp && devHostIp !== 'localhost' && devHostIp !== '127.0.0.1') {
      return `http://${devHostIp}:5000/api`;
    }
  }

  // 3. Environment variable configuration
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // 4. Default Wi-Fi LAN IP fallback
  return 'http://192.168.137.244:5000/api';
};

export const API_BASE_URL = resolveApiBaseUrl();

export const ApiService = {
  // Fetch Placement & Tech Questions
  async getQuestions(
    category?: string,
    userEmail?: string,
    limit?: number,
    company?: string,
    grade?: AcademicGrade,
    board?: EducationBoard
  ): Promise<Question[]> {
    try {
      const params = new URLSearchParams();
      if (category && category !== 'All Topics') params.append('category', category);
      if (userEmail) params.append('userEmail', userEmail);
      if (limit) params.append('limit', limit.toString());
      if (company && company !== 'All Companies') params.append('company', company);
      if (grade) params.append('grade', grade);
      if (board) params.append('board', board);

      const queryString = params.toString() ? `?${params.toString()}` : '';
      const response = await fetch(`${API_BASE_URL}/questions${queryString}`);
      if (!response.ok) throw new Error('API Error');
      const data = await response.json();
      return Array.isArray(data) && data.length > 0 ? data : getOfflineQuestions(grade, category, limit);
    } catch (error) {
      console.log('Using local questions dataset fallback');
      return getOfflineQuestions(grade, category, limit);
    }
  },

  // Dynamic Target Companies
  async getCompanies(): Promise<string[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/companies`);
      if (!response.ok) throw new Error('API Error');
      const data = await response.json();
      return Array.isArray(data) && data.length > 0 ? data : ['All Companies', 'TCS NQT', 'Infosys', 'Wipro', 'Accenture', 'Amazon'];
    } catch (error) {
      return ['All Companies', 'TCS NQT', 'Infosys', 'Wipro', 'Accenture', 'Amazon'];
    }
  },

  // Dynamic Daily Challenge (100% Gujarati for School Grades 6-12)
  async getDailyChallenge(grade?: string) {
    const activeGrade = (grade as AcademicGrade) || 'college';
    const isSchool = activeGrade !== 'college';
    try {
      const params = new URLSearchParams();
      if (grade) params.append('grade', grade);
      const queryString = params.toString() ? `?${params.toString()}` : '';

      const response = await fetch(`${API_BASE_URL}/exams/daily-challenge${queryString}`);
      if (!response.ok) throw new Error('API Error');
      const data = await response.json();
      if (data && (data.question || data.questionText)) {
        const qText = isSchool && (data.questionTextGujarati || data.questionGujarati)
          ? (data.questionTextGujarati || data.questionGujarati)
          : data.question;
        const qOpts = isSchool && data.optionsGujarati && data.optionsGujarati.length > 0
          ? data.optionsGujarati
          : data.options;
        const qTopic = isSchool && data.categoryGujarati
          ? data.categoryGujarati
          : (data.topic || (isSchool ? 'દૈનિક પડકાર' : 'Daily Challenge'));
        const qExpl = isSchool && data.explanationGujarati
          ? data.explanationGujarati
          : data.explanation;
        return {
          ...data,
          question: qText,
          options: qOpts,
          topic: qTopic,
          explanation: qExpl,
        };
      }
      return this.getFallbackDailyChallenge(grade);
    } catch (error) {
      return this.getFallbackDailyChallenge(grade);
    }
  },

  getFallbackDailyChallenge(grade?: string) {
    const activeGrade = (grade as AcademicGrade) || 'college';
    const questions = getOfflineQuestions(activeGrade);
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const selectedQ = questions[dayOfYear % questions.length] || questions[0];

    const isSchool = activeGrade !== 'college';
    const qText = isSchool && (selectedQ as any).questionTextGujarati ? (selectedQ as any).questionTextGujarati : selectedQ.questionText;
    const qOpts = isSchool && (selectedQ as any).optionsGujarati && (selectedQ as any).optionsGujarati.length > 0 ? (selectedQ as any).optionsGujarati : selectedQ.options;
    const qTopic = isSchool && (selectedQ as any).categoryGujarati ? (selectedQ as any).categoryGujarati : (selectedQ.category || 'Curriculum Challenge');
    const qExpl = isSchool && (selectedQ as any).explanationGujarati ? (selectedQ as any).explanationGujarati : (selectedQ.explanation || 'Detailed concept explanation available in curriculum notes.');

    return {
      id: `daily-${activeGrade}-${dayOfYear}`,
      date: new Date().toISOString().split('T')[0],
      grade: activeGrade,
      topic: qTopic,
      question: qText,
      options: qOpts,
      correctIndex: selectedQ.correctAnswer !== undefined ? selectedQ.correctAnswer : 0,
      explanation: qExpl,
    };
  },

  // Update User Profile (Name, Target Company, College)
  async updateProfile(profileData: {
    email?: string;
    name?: string;
    targetCompany?: string;
    college?: string;
    bio?: string;
    avatarUrl?: string;
  }) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });
      return await response.json();
    } catch (error) {
      return { success: true };
    }
  },

  // Delete User Account & Associated Records (Compliance)
  async deleteAccount(email: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/account`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      return await response.json();
    } catch (error) {
      return { success: true };
    }
  },

  // Dynamic Formulas & Notes
  async getFormulas(grade?: string, category?: string): Promise<CheatSheetItem[]> {
    try {
      const params = new URLSearchParams();
      if (grade) params.append('grade', grade);
      if (category && category !== 'All') params.append('category', category);
      const queryString = params.toString() ? `?${params.toString()}` : '';

      const response = await fetch(`${API_BASE_URL}/formulas${queryString}`);
      if (!response.ok) throw new Error('API Error');
      const data = await response.json();
      return Array.isArray(data) && data.length > 0 ? data : CHEATSHEETS_DATA;
    } catch (error) {
      console.log('Using local formulas fallback');
      return CHEATSHEETS_DATA;
    }
  },

  // Dynamic Flashcards
  async getFlashcards(topic?: string) {
    try {
      const params = new URLSearchParams();
      if (topic && topic !== 'All') params.append('topic', topic);
      const queryString = params.toString() ? `?${params.toString()}` : '';

      const response = await fetch(`${API_BASE_URL}/flashcards${queryString}`);
      if (!response.ok) throw new Error('API Error');
      const data = await response.json();
      return Array.isArray(data) && data.length > 0 ? data : (COLLEGE_FLASHCARDS_DATA as any);
    } catch (error) {
      console.log('Using local flashcards fallback');
      if (topic && topic !== 'All') {
        return (COLLEGE_FLASHCARDS_DATA as any).filter((c: any) => c.topic === topic);
      }
      return COLLEGE_FLASHCARDS_DATA as any;
    }
  },

  // Dynamic Curriculum
  async getCurriculum(grade?: AcademicGrade): Promise<GradeCurriculum> {
    try {
      const params = new URLSearchParams();
      if (grade) params.append('grade', grade);
      const queryString = params.toString() ? `?${params.toString()}` : '';

      const response = await fetch(`${API_BASE_URL}/curriculum${queryString}`);
      if (!response.ok) throw new Error('API Error');
      const data = await response.json();
      return data || ACADEMIC_CURRICULUM[grade || 'college'];
    } catch (error) {
      console.log('Using local curriculum fallback');
      return ACADEMIC_CURRICULUM[grade || 'college'];
    }
  },

  // Get AI Weak-Spot Topics
  // weakTopics is [] until the student has finished tests with wrong answers.
  async getWeakSpots(userEmail?: string, grade?: string): Promise<{ weakTopics: string[]; totalTests: number }> {
    try {
      if (!userEmail) return computeLocalWeakSpots(undefined, grade);
      const gradeParam = grade ? `&grade=${encodeURIComponent(grade)}` : '';
      const response = await fetch(`${API_BASE_URL}/user/weak-spots?userEmail=${encodeURIComponent(userEmail)}${gradeParam}`);
      if (!response.ok) throw new Error('API Error');
      const data = await response.json();
      // Server has no record (e.g. database offline): use this device's real results.
      if (!data?.totalTests) return computeLocalWeakSpots(userEmail, grade);
      return data;
    } catch (error) {
      return computeLocalWeakSpots(userEmail, grade);
    }
  },

  // Get AI Adaptive Diagnostic Exam Questions
  async getDiagnosticQuestions(userEmail?: string, limit?: number, grade?: AcademicGrade): Promise<Question[]> {
    try {
      const params = new URLSearchParams();
      if (userEmail) params.append('userEmail', userEmail);
      if (limit) params.append('limit', limit.toString());
      if (grade) params.append('grade', grade);

      const queryString = params.toString() ? `?${params.toString()}` : '';
      const response = await fetch(`${API_BASE_URL}/exams/diagnostic${queryString}`);
      if (!response.ok) throw new Error('API Error');
      const data = await response.json();
      return Array.isArray(data) && data.length > 0 ? data : getOfflineQuestions(grade, undefined, limit);
    } catch (error) {
      console.log('Using local diagnostic fallback');
      return getOfflineQuestions(grade, undefined, limit);
    }
  },

  // Get Campus & School Leaderboard
  async getLeaderboard(grade?: string, userEmail?: string, subject?: string) {
    try {
      const params = new URLSearchParams();
      if (grade) params.append('grade', grade);
      if (userEmail) params.append('userEmail', userEmail);
      if (subject) params.append('subject', subject);
      const queryString = params.toString() ? `?${params.toString()}` : '';

      const response = await fetch(`${API_BASE_URL}/user/leaderboard${queryString}`);
      if (!response.ok) throw new Error('API Error');
      return await response.json();
    } catch (error) {
      // No server: there is nobody to rank against. Return an empty board (never
      // invented students) plus the student's own on-device totals.
      const stats = await computeLocalDashboardStats(userEmail, grade || 'college');
      const correct = stats.recentActivity.reduce((a: number, r: any) => a + (r.correctCount || 0), 0);
      return {
        grade: grade || 'college',
        leaderboard: [],
        offline: true,
        userRank: {
          rank: null,
          name: userEmail ? userEmail.split('@')[0] : 'You',
          points: correct * 10 + stats.totalTests * 5,
          streak: stats.streakCount,
          accuracy: stats.avgScore,
        },
      };
    }
  },

  // Update Academic Profile (Grade, Board, Medium)
  async updateAcademicProfile(
    email: string,
    grade: AcademicGrade,
    board: EducationBoard = 'CBSE',
    medium: InstructionMedium = 'English',
    token?: string,
    stream?: string
  ) {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const response = await fetch(`${API_BASE_URL}/auth/academic-profile`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ email, grade, board, medium, stream }),
      });
      return await response.json();
    } catch (error) {
      // Saved on the device by AuthContext; the server copy updates next time it's reachable.
      return { success: true, offline: true };
    }
  },

  // Submit Exam Results with grade & board
  async submitExamResult(resultData: {
    userEmail?: string;
    scorePercentage: number;
    correctCount: number;
    totalQuestions: number;
    userAnswers: Record<number, number>;
    weakCategories: string[];
    questionIds?: number[];
    grade?: string;
    board?: string;
    category?: string;
  }) {
    // Always keep an on-device copy so progress is real even when the server is down.
    await addLocalResult(resultData.userEmail, {
      grade: resultData.grade || 'college',
      category: resultData.category || 'Mock Exam',
      scorePercentage: resultData.scorePercentage,
      correctCount: resultData.correctCount,
      totalQuestions: resultData.totalQuestions,
      weakCategories: resultData.weakCategories || [],
    });
    try {
      const response = await fetch(`${API_BASE_URL}/exams/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resultData),
      });
      const data = await response.json();
      return response.ok ? data : { success: true, savedOnDevice: true, serverError: data?.error };
    } catch (error) {
      console.log('Exam result saved on this device only');
      return { success: true, savedOnDevice: true };
    }
  },

  // Get User Dashboard Stats (Isolated by grade)
  // Real numbers only: server stats when it has them, otherwise this device's
  // recorded tests. A new student gets streakCount 0, totalTests 0, [] activity.
  async getDashboardStats(userEmail?: string, grade?: string) {
    const g = grade || 'college';
    try {
      if (!userEmail) return computeLocalDashboardStats(undefined, g);
      const gradeParam = grade ? `&grade=${encodeURIComponent(grade)}` : '';
      const response = await fetch(`${API_BASE_URL}/user/dashboard-stats?userEmail=${encodeURIComponent(userEmail)}${gradeParam}`);
      if (!response.ok) return computeLocalDashboardStats(userEmail, g);
      const data = await response.json();
      if (data?.source === 'none') return computeLocalDashboardStats(userEmail, g);
      return data;
    } catch (error) {
      console.log('Dashboard stats: using results saved on this device');
      return computeLocalDashboardStats(userEmail, g);
    }
  },

  // Get Exam Result Details & Explanations for Review
  async getExamResultDetails(resultId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/exams/result/${resultId}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.log('Failed to fetch exam result details');
      return null;
    }
  },

  // Bookmark Methods
  async toggleBookmark(userEmail: string, questionId: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/user/bookmarks/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail, questionId }),
      });
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.log('Failed to toggle bookmark');
      return null;
    }
  },

  async getBookmarkedQuestions(userEmail: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/user/bookmarks?userEmail=${encodeURIComponent(userEmail)}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.log('Failed to fetch bookmarked questions');
      return null;
    }
  },

  // Video Masterclass & Discussion APIs
  async getVideos(category?: string, grade?: string, board?: string): Promise<VideoLecture[]> {
    try {
      const params = new URLSearchParams();
      if (category && category !== 'All') params.append('category', category);
      if (grade) params.append('grade', grade);
      if (board) params.append('board', board);
      const queryString = params.toString() ? `?${params.toString()}` : '';

      const response = await fetch(`${API_BASE_URL}/videos${queryString}`);
      if (!response.ok) throw new Error('Failed to fetch videos from server');
      const data = await response.json();
      return Array.isArray(data) && data.length > 0 ? data : VIDEO_LECTURES_DATA;
    } catch (error) {
      console.log('Using local video masterclasses fallback');
      const activeGrade = grade || 'college';
      let filtered = VIDEO_LECTURES_DATA.filter((v) => v.grades && v.grades.includes(activeGrade));
      if (filtered.length === 0) filtered = VIDEO_LECTURES_DATA;

      if (category && category !== 'All') {
        return filtered.filter((v) => {
          if (category === 'Quant') return v.category === 'Quantitative Aptitude';
          if (category === 'DSA') return v.category === 'Data Structures & Algorithms';
          if (category === 'React') return v.category === 'React & JavaScript';
          if (category === 'HR') return v.category === 'HR & Placement Interview';
          // GSEB Gujarati category keys
          if (category === 'ગણિત') return v.category === 'Mathematics' || (v.categoryGujarati && v.categoryGujarati.includes('ગણિત'));
          if (category === 'વિજ્ઞાન') return v.category === 'Science' || (v.categoryGujarati && v.categoryGujarati.includes('વિજ્ઞાન'));
          if (category === 'સામાજિક વિજ્ઞાન') return v.category === 'Social Science' || (v.categoryGujarati && v.categoryGujarati.includes('સામાજિક'));
          if (category === 'ગુજરાતી') return v.category === 'Gujarati' || (v.categoryGujarati && v.categoryGujarati.includes('ગુજરાતી'));
          if (category === 'અંગ્રેજી') return v.category === 'English' || (v.categoryGujarati && v.categoryGujarati.includes('અંગ્રેજી'));
          if (category === 'ભૌતિક વિજ્ઞાન') return v.category === 'Physics' || (v.categoryGujarati && v.categoryGujarati.includes('ભૌતિક'));
          if (category === 'રસાયણ વિજ્ઞાન') return v.category === 'Chemistry' || (v.categoryGujarati && v.categoryGujarati.includes('રસાયણ'));
          if (category === 'જીવ વિજ્ઞાન') return v.category === 'Biology' || (v.categoryGujarati && v.categoryGujarati.includes('જીવ'));
          if (category === 'કોમ્પ્યુટર સાયન્સ') return v.category === 'Computer Science' || (v.categoryGujarati && v.categoryGujarati.includes('કોમ્પ્યુટર'));
          // CBSE English category keys (direct match)
          return v.category === category || v.categoryGujarati === category;
        }).sort((a, b) => (a.chapterNumber || 0) - (b.chapterNumber || 0));
      }
      return filtered.sort((a, b) => (a.chapterNumber || 0) - (b.chapterNumber || 0));
    }
  },

  // Is the MindSprint server reachable? Used to show an "offline" banner (never throws).
  async checkServer(timeoutMs = 4000): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      const response = await fetch(`${API_BASE_URL}/health`, { signal: controller.signal });
      clearTimeout(timer);
      return response.ok;
    } catch (_) {
      return false;
    }
  },

  // Students flag a wrong / broken video so it can be fixed in backend/data/videos.json
  async reportVideo(report: {
    youtubeVideoId: string;
    grade?: string;
    subjectId?: string;
    chapterNumber?: number;
    reason: 'wrong-topic' | 'wrong-chapter' | 'not-playing' | 'bad-quality' | 'other';
    email?: string;
  }): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/videos/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report),
      });
      return response.ok;
    } catch (_) {
      return false;
    }
  },

  async addVideoComment(
    videoId: string,
    commentData: { author: string; userEmail?: string; role?: string; text: string }
  ): Promise<{ success: boolean; comment?: VideoComment; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/videos/${videoId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentData),
      });
      return await response.json();
    } catch (error: any) {
      return { success: false, error: error.message || 'Network error saving comment' };
    }
  },

  async upvoteVideoComment(
    videoId: string,
    commentId: string,
    userEmail?: string
  ): Promise<{ success: boolean; upvotes?: number; hasUpvoted?: boolean }> {
    try {
      const response = await fetch(`${API_BASE_URL}/videos/${videoId}/comments/${commentId}/upvote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail }),
      });
      return await response.json();
    } catch (error) {
      return { success: false };
    }
  },

  // User Login
  async login(email: string, password: string) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      const data = await response.json();
      if (response.ok && data.user) {
        await cacheLocalUser(email, password, data.user);
      }
      return data;
    } catch (error) {
      // Server unreachable: only an account already used on this phone, with the
      // same password, can sign in. Unknown emails are never signed in.
      console.log('Backend server unreachable, checking accounts saved on this device...');
      try {
        const raw = await AsyncStorage.getItem('@mindsprint_local_users');
        const users = raw ? JSON.parse(raw) : {};
        const localUser = users[email.toLowerCase()];
        if (localUser) {
          const digest = await digestPassword(email, password);
          const legacyMatch = localUser.passwordHash !== undefined && localUser.passwordHash === password;
          if (localUser.passwordDigest === digest || legacyMatch) {
            if (legacyMatch) await cacheLocalUser(email, password, localUser); // upgrade plain-text entry
            const { passwordHash: _p, passwordDigest: _d, ...profile } = localUser;
            return { message: 'Signed in on this device (offline)', token: 'local_jwt_' + Date.now(), user: profile };
          }
          return { error: 'Wrong password for this account.' };
        }
      } catch (_) {}
      return {
        error: "Can't reach the MindSprint server. Check your internet connection, or continue as a guest.",
      };
    }
  },

  // User Registration
  async register(
    name: string,
    email: string,
    password: string,
    grade: AcademicGrade = 'college',
    board: EducationBoard = 'CBSE',
    medium: InstructionMedium = 'English',
    stream?: string
  ) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, grade, board, medium, stream }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      const data = await response.json();
      if (response.ok && data.user) {
        await cacheLocalUser(email, password, data.user);
      }
      return data;
    } catch (error) {
      console.log('Backend server unreachable, creating local offline account...');
      const localProfile = {
        id: 'usr_' + Date.now(),
        name,
        email,
        grade,
        board,
        medium,
        stream,
        academicStage: grade === 'college' ? 'college' : 'school',
        streakCount: 0,
        targetCompany: 'All Companies',
        avatarUrl: '🧑‍🎓',
      };
      await cacheLocalUser(email, password, localProfile);

      return {
        message: 'Account created locally (offline session)',
        token: 'offline_token_' + Date.now(),
        user: localProfile,
      };
    }
  },

  // Google OAuth Login
  async loginWithGoogle(idToken: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });
      return await response.json();
    } catch (error) {
      return { error: 'Network error connecting to backend server for Google Sign-In' };
    }
  },

  // Sample Exam & Board Practice Papers
  async getSamplePapers(grade?: string, board?: string, subject?: string): Promise<SamplePaper[]> {
    try {
      const params = new URLSearchParams();
      if (grade) params.append('grade', grade);
      if (board && board !== 'All') params.append('board', board);
      if (subject && subject !== 'All') params.append('subject', subject);
      const queryString = params.toString() ? `?${params.toString()}` : '';

      const response = await fetch(`${API_BASE_URL}/sample-papers${queryString}`);
      if (!response.ok) throw new Error('API Error fetching sample papers');
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.log('Using sample papers fallback');
      let fallback = SAMPLE_PAPERS_DATA;
      if (grade) fallback = fallback.filter((p) => p.grade === grade);
      if (board && board !== 'All') fallback = fallback.filter((p) => p.board === board);
      if (subject && subject !== 'All') fallback = fallback.filter((p) => p.subject.toLowerCase() === subject.toLowerCase());
      return fallback;
    }
  },

  async getSamplePaperById(id: string): Promise<SamplePaper | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/sample-papers/${encodeURIComponent(id)}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      return SAMPLE_PAPERS_DATA.find((p) => p.id === id) || null;
    }
  },

  // Frequently Asked Subjective Questions (1M, 2M, 3M, 4M)
  async getImportantQuestions(grade?: string, subject?: string, marks?: number): Promise<ImportantQuestion[]> {
    try {
      const params = new URLSearchParams();
      if (grade) params.append('grade', grade);
      if (subject && subject !== 'All') params.append('subject', subject);
      if (marks) params.append('marks', marks.toString());
      const queryString = params.toString() ? `?${params.toString()}` : '';

      const response = await fetch(`${API_BASE_URL}/important-questions${queryString}`);
      if (!response.ok) throw new Error('API Error');
      const data = await response.json();
      return Array.isArray(data) && data.length > 0 ? data : this.getFallbackImportantQuestions(grade, subject, marks);
    } catch (error) {
      console.log('Using local important questions fallback');
      return this.getFallbackImportantQuestions(grade, subject, marks);
    }
  },

  getFallbackImportantQuestions(grade?: string, subject?: string, marks?: number): ImportantQuestion[] {
    let list = IMPORTANT_QUESTIONS_DATA;
    if (grade) {
      list = list.filter((q) => q.grade === grade);
    }
    if (subject && subject !== 'All') {
      // A subject with no questions yet (e.g. Accountancy) gets none, not another subject's questions.
      list = list.filter((q) => q.subject.toLowerCase() === subject.toLowerCase());
      if (list.length === 0) return [];
    }
    if (marks) {
      const marksFiltered = list.filter((q) => q.marks === marks);
      if (marksFiltered.length > 0) list = marksFiltered;
    }
    if (list.length === 0 && grade) {
      list = IMPORTANT_QUESTIONS_DATA.filter((q) => q.grade === grade);
    }
    return list.length > 0 ? list : IMPORTANT_QUESTIONS_DATA;
  },

  // AI Doubt Solver (OCR + Gemini Vision + Curriculum Knowledge Graph)
  async solveDoubt(params: {
    query?: string;
    imageBase64?: string;
    grade?: string;
    medium?: string;
    subject?: string;
  }) {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/solve-doubt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!response.ok) throw new Error('AI Server Error');
      return await response.json();
    } catch (error) {
      console.log('AI Doubt server connection fallback');
      return { success: false };
    }
  },

  // 1v1 Duel Arena & Multiplayer Room Management
  async createDuelRoom(params: {
    host: { name: string; email?: string; avatar?: string; schoolOrCollege?: string };
    grade: string;
    subject: string;
  }) {
    try {
      const response = await fetch(`${API_BASE_URL}/duels/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!response.ok) throw new Error('Create room failed');
      return await response.json();
    } catch (error) {
      console.log('Using offline duel room creation fallback');
      return { success: false };
    }
  },

  async joinDuelRoom(params: {
    roomCode: string;
    guest: { name: string; email?: string; avatar?: string; schoolOrCollege?: string };
  }) {
    try {
      const response = await fetch(`${API_BASE_URL}/duels/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Could not connect to duel server.' };
    }
  },

  async getDuelRoom(roomCode: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/duels/room/${encodeURIComponent(roomCode)}`);
      if (!response.ok) throw new Error('Get room error');
      return await response.json();
    } catch (error) {
      return { success: false };
    }
  },

  async updateDuelScore(params: {
    roomCode: string;
    role: 'host' | 'guest';
    pointsEarned: number;
    roundIndex: number;
  }) {
    try {
      const response = await fetch(`${API_BASE_URL}/duels/room/${encodeURIComponent(params.roomCode)}/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!response.ok) throw new Error('Score sync error');
      return await response.json();
    } catch (error) {
      return { success: false };
    }
  },

  async getRandomDuelMatch(params: {
    grade: string;
    subject: string;
    email?: string;
    name?: string;
  }) {
    try {
      const searchParams = new URLSearchParams({
        grade: params.grade,
        subject: params.subject,
        email: params.email || '',
        name: params.name || 'You',
      });
      const response = await fetch(`${API_BASE_URL}/duels/random-match?${searchParams.toString()}`);
      if (!response.ok) throw new Error('Random match error');
      return await response.json();
    } catch (error) {
      console.log('Random duel match server fallback');
      return { success: false };
    }
  },

  // AI Viva & Oral Exam Answer Evaluator
  async evaluateVivaAnswer(params: {
    question: string;
    userAnswer: string;
    expectedKeywords: string[];
    winningAnswer: string;
    grade?: string;
    medium?: string;
  }) {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/evaluate-viva`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!response.ok) throw new Error('Evaluation error');
      return await response.json();
    } catch (error) {
      console.log('Viva evaluator fallback');
      return { success: false };
    }
  },
};

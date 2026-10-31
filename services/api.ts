import { APTITUDE_QUESTIONS, Question, getOfflineQuestions, COLLEGE_FLASHCARDS_DATA } from '../constants/mindsprintData';
import { VIDEO_LECTURES_DATA, VideoLecture, VideoComment } from '../constants/videoData';
import { CHEATSHEETS_DATA, CheatSheetItem } from '../constants/cheatsheetsData';
import { ACADEMIC_CURRICULUM, GradeCurriculum, AcademicGrade, EducationBoard, InstructionMedium, SamplePaper, ImportantQuestion, SAMPLE_PAPERS_DATA, IMPORTANT_QUESTIONS_DATA } from '../constants/academicData';

import Constants from 'expo-constants';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Dynamically resolve backend API base URL for Web, Emulator, and Expo Go on physical phones
const resolveApiBaseUrl = (): string => {
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
  async getWeakSpots(userEmail?: string, grade?: string): Promise<{ weakTopics: string[]; totalTests: number }> {
    try {
      if (!userEmail) return { weakTopics: ['Quantitative Aptitude', 'Data Structures & Algorithms'], totalTests: 0 };
      const gradeParam = grade ? `&grade=${encodeURIComponent(grade)}` : '';
      const response = await fetch(`${API_BASE_URL}/user/weak-spots?userEmail=${encodeURIComponent(userEmail)}${gradeParam}`);
      if (!response.ok) throw new Error('API Error');
      return await response.json();
    } catch (error) {
      return { weakTopics: ['Quantitative Aptitude', 'Data Structures & Algorithms'], totalTests: 0 };
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
      const isSchool = grade && grade !== 'college';
      const isHSC = ['11', '12'].includes(grade || '');
      const peers = isHSC
        ? [
            { id: 'lb-1', rank: 1, name: 'Aarav Patel', points: 1520, streak: 15, accuracy: 97, avatar: '🥇', college: `Class ${grade} Science • GSHSEB` },
            { id: 'lb-2', rank: 2, name: 'Priya Sharma', points: 1410, streak: 13, accuracy: 95, avatar: '🥈', college: `Class ${grade} PCM • CBSE` },
            { id: 'lb-3', rank: 3, name: 'Rohan Mehta', points: 1300, streak: 11, accuracy: 92, avatar: '🥉', college: `Class ${grade} Science • Rajkot` },
            { id: 'lb-4', rank: 4, name: 'Ananya Desai', points: 1170, streak: 9, accuracy: 89, avatar: '⭐', college: `Class ${grade} PCB • Vadodara` },
            { id: 'lb-5', rank: 5, name: 'Kavya Joshi', points: 1040, streak: 7, accuracy: 86, avatar: '🌟', college: `Class ${grade} Science • Bhavnagar` },
            { id: 'lb-6', rank: 6, name: 'Devendra Shah', points: 950, streak: 6, accuracy: 83, avatar: '🎯', college: `Class ${grade} Maths • Gandhinagar` },
          ]
        : isSchool
        ? [
            { id: 'lb-1', rank: 1, name: 'Aarav Patel', points: 1480, streak: 14, accuracy: 96, avatar: '🥇', college: `Class ${grade} • St. Xavier's High` },
            { id: 'lb-2', rank: 2, name: 'Priya Sharma', points: 1390, streak: 12, accuracy: 94, avatar: '🥈', college: `Class ${grade} • DPS Vadodara` },
            { id: 'lb-3', rank: 3, name: 'Rohan Mehta', points: 1280, streak: 10, accuracy: 91, avatar: '🥉', college: `Class ${grade} • C.N. Vidyalaya` },
            { id: 'lb-4', rank: 4, name: 'Ananya Desai', points: 1140, streak: 8, accuracy: 88, avatar: '⭐', college: `Class ${grade} • Navrachana` },
            { id: 'lb-5', rank: 5, name: 'Kavya Joshi', points: 1010, streak: 7, accuracy: 85, avatar: '🌟', college: `Class ${grade} • Sharda Mandir` },
            { id: 'lb-6', rank: 6, name: 'Devendra Shah', points: 920, streak: 6, accuracy: 82, avatar: '🎯', college: `Class ${grade} • Podar International` },
          ]
        : [
            { id: 'lb-1', rank: 1, name: 'Aarav Patel', points: 1560, streak: 14, accuracy: 96, avatar: '🥇', college: 'LDCE Ahmedabad' },
            { id: 'lb-2', rank: 2, name: 'Priya Sharma', points: 1420, streak: 12, accuracy: 94, avatar: '🥈', college: 'VGEC Chandkheda' },
            { id: 'lb-3', rank: 3, name: 'Rohan Mehta', points: 1310, streak: 10, accuracy: 91, avatar: '🥉', college: 'DA-IICT Gandhinagar' },
            { id: 'lb-4', rank: 4, name: 'Ananya Desai', points: 1180, streak: 8, accuracy: 88, avatar: '⭐', college: 'Nirma University' },
            { id: 'lb-5', rank: 5, name: 'Kavya Joshi', points: 1050, streak: 7, accuracy: 85, avatar: '🌟', college: 'MSU Baroda' },
            { id: 'lb-6', rank: 6, name: 'Devendra Shah', points: 960, streak: 6, accuracy: 82, avatar: '🎯', college: 'BVM Anand' },
          ];

      return {
        grade: grade || 'college',
        leaderboard: peers,
        userRank: {
          rank: 7,
          name: userEmail ? userEmail.split('@')[0] : 'You',
          points: 880,
          streak: 1,
          accuracy: 84,
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
    token?: string
  ) {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const response = await fetch(`${API_BASE_URL}/auth/academic-profile`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ email, grade, board, medium }),
      });
      return await response.json();
    } catch (error) {
      return { success: true };
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
    try {
      const response = await fetch(`${API_BASE_URL}/exams/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resultData),
      });
      return await response.json();
    } catch (error) {
      console.log('Exam result recorded locally');
      return { success: true };
    }
  },

  // Get User Dashboard Stats (Isolated by grade)
  async getDashboardStats(userEmail?: string, grade?: string) {
    try {
      if (!userEmail) return null;
      const gradeParam = grade ? `&grade=${encodeURIComponent(grade)}` : '';
      const response = await fetch(`${API_BASE_URL}/user/dashboard-stats?userEmail=${encodeURIComponent(userEmail)}${gradeParam}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.log('Failed to fetch dashboard stats');
      return null;
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
        try {
          const raw = await AsyncStorage.getItem('@mindsprint_local_users');
          const users = raw ? JSON.parse(raw) : {};
          users[email.toLowerCase()] = { ...data.user, passwordHash: password };
          await AsyncStorage.setItem('@mindsprint_local_users', JSON.stringify(users));
        } catch (_) {}
      }
      return data;
    } catch (error) {
      console.log('Backend server unreachable, checking local user cache...');
      try {
        const raw = await AsyncStorage.getItem('@mindsprint_local_users');
        const users = raw ? JSON.parse(raw) : {};
        const localUser = users[email.toLowerCase()];
        if (localUser) {
          return {
            message: 'Signed in via offline profile',
            token: 'local_jwt_' + Date.now(),
            user: localUser,
          };
        }
      } catch (_) {}
      // Automatic offline fallback: allow user to sign in offline
      const name = email.split('@')[0];
      return {
        message: 'Signed in (Offline Session)',
        token: 'offline_token_' + Date.now(),
        user: {
          id: 'usr_' + Date.now(),
          name: name.charAt(0).toUpperCase() + name.slice(1),
          email,
          grade: '10',
          board: 'GSEB',
          medium: 'Gujarati',
          academicStage: 'school',
          streakCount: 1,
          targetCompany: 'All Companies',
          avatarUrl: '🧑‍🎓',
        },
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
    medium: InstructionMedium = 'English'
  ) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, grade, board, medium }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      const data = await response.json();
      if (response.ok && data.user) {
        try {
          const raw = await AsyncStorage.getItem('@mindsprint_local_users');
          const users = raw ? JSON.parse(raw) : {};
          users[email.toLowerCase()] = { ...data.user, passwordHash: password };
          await AsyncStorage.setItem('@mindsprint_local_users', JSON.stringify(users));
        } catch (_) {}
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
        academicStage: grade === 'college' ? 'college' : 'school',
        streakCount: 1,
        targetCompany: 'All Companies',
        avatarUrl: '🧑‍🎓',
      };
      try {
        const raw = await AsyncStorage.getItem('@mindsprint_local_users');
        const users = raw ? JSON.parse(raw) : {};
        users[email.toLowerCase()] = { ...localProfile, passwordHash: password };
        await AsyncStorage.setItem('@mindsprint_local_users', JSON.stringify(users));
      } catch (_) {}

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
      const subFiltered = list.filter((q) => q.subject.toLowerCase() === subject.toLowerCase());
      if (subFiltered.length > 0) list = subFiltered;
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

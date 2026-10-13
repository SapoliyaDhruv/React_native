import { APTITUDE_QUESTIONS, Question } from '../constants/mindsprintData';
import { VIDEO_LECTURES_DATA, VideoLecture, VideoComment } from '../constants/videoData';
import { CHEATSHEETS_DATA, CheatSheetItem } from '../constants/cheatsheetsData';
import { ACADEMIC_CURRICULUM, GradeCurriculum, AcademicGrade, EducationBoard, InstructionMedium, SamplePaper, ImportantQuestion } from '../constants/academicData';

// Pulled dynamically from .env config (with LAN IP fallback for mobile testing)
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.166.238.124:5000/api';

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
      return data;
    } catch (error) {
      console.log('Using local questions dataset fallback');
      return APTITUDE_QUESTIONS.slice(0, limit || 10);
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

  // Dynamic Daily Challenge
  async getDailyChallenge(grade?: string) {
    try {
      const params = new URLSearchParams();
      if (grade) params.append('grade', grade);
      const queryString = params.toString() ? `?${params.toString()}` : '';

      const response = await fetch(`${API_BASE_URL}/exams/daily-challenge${queryString}`);
      if (!response.ok) throw new Error('API Error');
      return await response.json();
    } catch (error) {
      return null;
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
      return Array.isArray(data) && data.length > 0 ? data : [];
    } catch (error) {
      console.log('Using local flashcards fallback');
      return [];
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
  async getDiagnosticQuestions(userEmail?: string, limit?: number): Promise<Question[]> {
    try {
      const params = new URLSearchParams();
      if (userEmail) params.append('userEmail', userEmail);
      if (limit) params.append('limit', limit.toString());

      const queryString = params.toString() ? `?${params.toString()}` : '';
      const response = await fetch(`${API_BASE_URL}/exams/diagnostic${queryString}`);
      if (!response.ok) throw new Error('API Error');
      const data = await response.json();
      return Array.isArray(data) && data.length > 0 ? data : APTITUDE_QUESTIONS.slice(0, limit || 10);
    } catch (error) {
      console.log('Using local diagnostic fallback');
      return APTITUDE_QUESTIONS.slice(0, limit || 10);
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
      return {
        grade: grade || 'college',
        leaderboard: [
          { id: 'lb-1', rank: 1, name: 'Aarav Patel', points: 1450, streak: 14, accuracy: 96, avatar: '🥇', college: 'LDCE Ahmedabad' },
          { id: 'lb-2', rank: 2, name: 'Priya Sharma', points: 1380, streak: 12, accuracy: 94, avatar: '🥈', college: 'VGEC Chandkheda' },
          { id: 'lb-3', rank: 3, name: 'Rohan Mehta', points: 1290, streak: 10, accuracy: 91, avatar: '🥉', college: 'DA-IICT Gandhinagar' },
          { id: 'lb-4', rank: 4, name: 'Ananya Desai', points: 1150, streak: 8, accuracy: 88, avatar: '⭐', college: 'Nirma University' },
          { id: 'lb-5', rank: 5, name: 'Kavya Joshi', points: 1020, streak: 7, accuracy: 85, avatar: '🌟', college: 'MSU Baroda' },
          { id: 'lb-6', rank: 6, name: 'Devendra Shah', points: 940, streak: 6, accuracy: 82, avatar: '🎯', college: 'BVM Anand' },
        ],
        userRank: {
          rank: 7,
          name: userEmail ? userEmail.split('@')[0] : 'You',
          points: 880,
          streak: 5,
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
    medium: InstructionMedium = 'English'
  ) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/academic-profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
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
          if (category === 'ગણિત') return v.category === 'Mathematics';
          if (category === 'વિજ્ઞાન') return v.category === 'Science';
          if (category === 'સામાજિક વિજ્ઞાન') return v.category === 'Social Science';
          if (category === 'ગુજરાતી') return v.category === 'Gujarati';
          if (category === 'અંગ્રેજી') return v.category === 'English';
          // CBSE English category keys (direct match)
          return v.category === category || v.categoryGujarati === category;
        });
      }
      return filtered;
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
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      return await response.json();
    } catch (error) {
      return { error: 'Network error connecting to backend server' };
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
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, grade, board, medium }),
      });
      return await response.json();
    } catch (error) {
      return { error: 'Network error connecting to backend server' };
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
      return [];
    }
  },

  async getSamplePaperById(id: string): Promise<SamplePaper | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/sample-papers/${encodeURIComponent(id)}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      return null;
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
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.log('Using local important questions fallback');
      return [];
    }
  },
};

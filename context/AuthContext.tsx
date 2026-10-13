import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { ApiService } from '@/services/api';
import { AcademicGrade, EducationBoard, InstructionMedium } from '@/constants/academicData';

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  isGuest?: boolean;
  grade?: AcademicGrade;
  board?: EducationBoard;
  medium?: InstructionMedium;
  academicStage?: 'school' | 'college';
  targetCompany?: string;
}

interface AuthSessionData {
  user: UserProfile;
  token?: string;
  loginTimestamp: number;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ error?: string }>;
  register: (name: string, email: string, pass: string, grade?: AcademicGrade, board?: EducationBoard, medium?: InstructionMedium) => Promise<{ error?: string }>;
  updateAcademicProfile: (grade: AcademicGrade, board?: EducationBoard, medium?: InstructionMedium) => Promise<{ success: boolean; error?: string }>;
  loginAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
}

const STORAGE_KEY = '@mindsprint_user_session';
const FOURTEEN_DAYS_MS = 14 * 24 * 60 * 60 * 1000;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const storedSession = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedSession) {
        const session: AuthSessionData = JSON.parse(storedSession);
        const now = Date.now();
        const age = now - (session.loginTimestamp || 0);

        if (age > FOURTEEN_DAYS_MS) {
          await AsyncStorage.removeItem(STORAGE_KEY);
          setUser(null);
          setToken(null);
          Alert.alert(
            'Session Expired',
            'Your session expired after 14 days of inactivity. Please log in again to continue.'
          );
        } else {
          setUser(session.user);
          setToken(session.token || null);
        }
      } else {
        setUser(null);
        setToken(null);
      }
    } catch (error) {
      console.error('Failed to restore session:', error);
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await ApiService.login(email, pass);
      if (res.error) {
        setIsLoading(false);
        return { error: res.error };
      }

      const userProfile: UserProfile = {
        id: res.user?.id || 'usr_' + Date.now(),
        name: res.user?.name || email.split('@')[0],
        email: res.user?.email || email,
        grade: res.user?.grade || 'college',
        board: res.user?.board || 'CBSE',
        medium: res.user?.medium || 'English',
        academicStage: res.user?.academicStage || (res.user?.grade === 'college' ? 'college' : 'school'),
        targetCompany: res.user?.targetCompany || 'All Companies',
        isGuest: false,
      };

      const sessionData: AuthSessionData = {
        user: userProfile,
        token: res.token || 'jwt_' + Date.now(),
        loginTimestamp: Date.now(),
      };

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
      setUser(userProfile);
      setToken(sessionData.token || null);
      setIsLoading(false);
      return {};
    } catch (err: any) {
      setIsLoading(false);
      return { error: err.message || 'Login failed. Please check your credentials.' };
    }
  };

  const register = async (
    name: string,
    email: string,
    pass: string,
    grade: AcademicGrade = 'college',
    board: EducationBoard = 'CBSE',
    medium: InstructionMedium = 'English'
  ) => {
    setIsLoading(true);
    try {
      const res = await ApiService.register(name, email, pass, grade, board, medium);
      if (res.error) {
        setIsLoading(false);
        return { error: res.error };
      }

      const userProfile: UserProfile = {
        id: res.user?.id || 'usr_' + Date.now(),
        name: name,
        email: email,
        grade: grade,
        board: board,
        medium: medium,
        academicStage: grade === 'college' ? 'college' : 'school',
        targetCompany: 'All Companies',
        isGuest: false,
      };

      const sessionData: AuthSessionData = {
        user: userProfile,
        token: res.token || 'jwt_' + Date.now(),
        loginTimestamp: Date.now(),
      };

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
      setUser(userProfile);
      setToken(sessionData.token || null);
      setIsLoading(false);
      return {};
    } catch (err: any) {
      setIsLoading(false);
      return { error: err.message || 'Registration failed.' };
    }
  };

  const updateAcademicProfile = async (
    grade: AcademicGrade,
    board: EducationBoard = 'CBSE',
    medium: InstructionMedium = 'English'
  ) => {
    const isCollege = grade === 'college';
    const chosenStage = isCollege ? 'college' : 'school';
    const effectiveBoard = isCollege ? 'CBSE' : board;
    const effectiveMedium = isCollege ? 'English' : medium;

    const updatedUser: UserProfile = {
      ...(user || { name: 'Student', email: 'student@mindsprint.app' }),
      grade,
      board: effectiveBoard,
      medium: effectiveMedium,
      academicStage: chosenStage,
    };

    setUser(updatedUser);

    try {
      const storedSession = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedSession) {
        const session: AuthSessionData = JSON.parse(storedSession);
        session.user = updatedUser;
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      }
    } catch (e) {
      console.warn('AsyncStorage update note:', e);
    }

    if (user?.email && !user?.isGuest) {
      try {
        await ApiService.updateAcademicProfile(user.email, grade, board, medium);
      } catch (err) {
        console.warn('Backend academic profile update note:', err);
      }
    }

    return { success: true };
  };

  const loginAsGuest = async () => {
    setIsLoading(true);
    const guestUser: UserProfile = {
      id: 'guest_' + Date.now(),
      name: 'Guest Explorer',
      email: 'guest@mindsprint.app',
      grade: 'college',
      board: 'CBSE',
      medium: 'English',
      academicStage: 'college',
      targetCompany: 'All Companies',
      isGuest: true,
    };

    const sessionData: AuthSessionData = {
      user: guestUser,
      loginTimestamp: Date.now(),
    };

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
    setUser(guestUser);
    setToken(null);
    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Logout storage clear error:', e);
    }
    setUser(null);
    setToken(null);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        updateAcademicProfile,
        loginAsGuest,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

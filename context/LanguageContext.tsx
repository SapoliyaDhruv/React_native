import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

/**
 * App-wide interface language (Gujarati / English).
 *
 * Strings are translated inline with `tr(english, gujarati)` so each screen
 * owns its own copy and there is no shared dictionary to keep in sync.
 * Default: Gujarati for Gujarati-medium school students, English otherwise.
 * The choice is remembered per device.
 */
export type UiLanguage = 'gu' | 'en';

type LanguageContextType = {
  lang: UiLanguage;
  isGujarati: boolean;
  setLang: (lang: UiLanguage) => void;
  toggleLang: () => void;
  /** Returns the Gujarati text when the UI is in Gujarati and a translation exists. */
  tr: (english: string, gujarati?: string) => string;
};

const STORAGE_KEY = '@mindsprint_ui_language';
// Older Courses-only toggle; read once so existing users keep their choice.
const LEGACY_COURSES_KEY = '@mindsprint_courses_gujarati';

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  isGujarati: false,
  setLang: () => {},
  toggleLang: () => {},
  tr: (en) => en,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const defaultLang: UiLanguage =
    user && user.grade !== 'college' && user.medium !== 'English' ? 'gu' : 'en';
  const [saved, setSaved] = useState<UiLanguage | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const v = await AsyncStorage.getItem(STORAGE_KEY);
        if (v === 'gu' || v === 'en') {
          if (active) setSaved(v);
          return;
        }
        const legacy = await AsyncStorage.getItem(LEGACY_COURSES_KEY);
        if (legacy !== null && active) setSaved(legacy === 'true' ? 'gu' : 'en');
      } catch {
        // storage unavailable: fall back to the default
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const lang: UiLanguage = saved ?? defaultLang;

  const setLang = useCallback((next: UiLanguage) => {
    setSaved(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
    AsyncStorage.setItem(LEGACY_COURSES_KEY, String(next === 'gu')).catch(() => {});
  }, []);

  const value = useMemo<LanguageContextType>(
    () => ({
      lang,
      isGujarati: lang === 'gu',
      setLang,
      toggleLang: () => setLang(lang === 'gu' ? 'en' : 'gu'),
      tr: (english, gujarati) => (lang === 'gu' && gujarati ? gujarati : english),
    }),
    [lang, setLang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => useContext(LanguageContext);

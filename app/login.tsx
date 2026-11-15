import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { MindSprintColors, MindSprintFonts } from '@/constants/mindsprintTheme';
import { useTheme } from '@/context/ThemeContext';
import { AcademicGrade, AcademicStream, STREAM_OPTIONS, gradeHasStreams } from '@/constants/academicData';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  const { tr, lang, setLang } = useLanguage();

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<AcademicGrade>('college');
  const [selectedStream, setSelectedStream] = useState<AcademicStream | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const { login: authLogin, register: authRegister, loginWithGoogle: authGoogleLogin, loginAsGuest } = useAuth();

  const handleBackendGoogleLogin = async (idToken: string) => {
    setLoading(true);
    try {
      const res = await authGoogleLogin(idToken);
      setLoading(false);

      if (res.error) {
        Alert.alert(tr('Google sign-in did not work', 'Google સાઇન ઇન થયું નહીં'), res.error);
        return;
      }
      router.replace('/(tabs)');
    } catch {
      setLoading(false);
      Alert.alert(
        tr('Google sign-in did not work', 'Google સાઇન ઇન થયું નહીં'),
        tr('Try again, or sign in with your email and password.', 'ફરી પ્રયાસ કરો, અથવા ઇમેઇલ અને પાસવર્ડથી સાઇન ઇન કરો.')
      );
    }
  };

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert(tr('Enter email and password', 'ઇમેઇલ અને પાસવર્ડ લખો'), tr('Both are needed to sign in.', 'સાઇન ઇન માટે બંને જરૂરી છે.'));
      return;
    }

    if (!isLoginMode && !name) {
      Alert.alert(tr('Enter your name', 'તમારું નામ લખો'), tr('Your name appears on your profile and reports.', 'તમારું નામ પ્રોફાઇલ અને અહેવાલમાં દેખાશે.'));
      return;
    }

    if (!isLoginMode && gradeHasStreams(selectedGrade) && !selectedStream) {
      Alert.alert(tr('Choose your stream', 'તમારો પ્રવાહ પસંદ કરો'), tr('Pick Science, Commerce or Arts so we show your subjects.', 'તમારા વિષયો બતાવવા માટે વિજ્ઞાન, વાણિજ્ય કે આર્ટ્સ પસંદ કરો.'));
      return;
    }

    setLoading(true);

    try {
      if (isLoginMode) {
        const res = await authLogin(email, password);
        setLoading(false);
        if (res.error) {
          Alert.alert(tr('Could not sign in', 'સાઇન ઇન થઈ શક્યું નહીં'), res.error);
        } else {
          router.replace('/(tabs)');
        }
      } else {
        const targetBoard = selectedGrade === 'college' ? 'CBSE' : 'GSEB';
        const targetMedium = selectedGrade === 'college' ? 'English' : 'Gujarati';
        const res = await authRegister(name, email, password, selectedGrade, targetBoard, targetMedium, gradeHasStreams(selectedGrade) ? selectedStream : undefined);
        setLoading(false);
        if (res.error) {
          Alert.alert(tr('Could not create account', 'એકાઉન્ટ બની શક્યું નહીં'), res.error);
        } else {
          Alert.alert(tr('Account created', 'એકાઉન્ટ બની ગયું'), tr(`Welcome to MindSprint, ${name}.`, `MindSprint માં સ્વાગત છે, ${name}.`));
          router.replace('/(tabs)');
        }
      }
    } catch {
      setLoading(false);
      Alert.alert(
        tr('Something went wrong', 'કંઈક ખોટું થયું'),
        tr('Check your internet connection and try again.', 'ઇન્ટરનેટ કનેક્શન તપાસીને ફરી પ્રયાસ કરો.')
      );
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    await loginAsGuest();
    setLoading(false);
    router.replace('/(tabs)');
  };

  const launchGoogleOAuth = async () => {
    setLoading(true);
    try {
      const clientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB;
      const redirectTarget = makeRedirectUri({
        scheme: 'mindsprint',
        preferLocalhost: true,
      });
      const redirectUri = encodeURIComponent(redirectTarget);
      
      const nonce = Math.random().toString(36).substring(2);
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=id_token&client_id=${clientId}&redirect_uri=${redirectUri}&scope=openid%20profile%20email&nonce=${nonce}`;

      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectTarget);

      if (result.type === 'success' && result.url) {
        const matches = result.url.match(/id_token=([^&]+)/);
        if (matches && matches[1]) {
          const idToken = matches[1];
          await handleBackendGoogleLogin(idToken);
          return;
        }
      }
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      console.log('WebBrowser auth session ended:', error);
    }
  };

  const handleGoogleSignIn = async () => {
    if (Platform.OS !== 'web') {
      Alert.alert(
        tr('Google sign-in is not ready on phones yet', 'ફોન પર Google સાઇન ઇન હજુ તૈયાર નથી'),
        tr('Sign in with your email and password, or continue as a guest.', 'ઇમેઇલ અને પાસવર્ડથી સાઇન ઇન કરો, અથવા મહેમાન તરીકે આગળ વધો.'),
        [
          { text: tr('Continue as guest', 'મહેમાન તરીકે આગળ વધો'), onPress: () => handleGuestLogin() },
          { text: tr('Try anyway', 'છતાં પ્રયાસ કરો'), onPress: () => launchGoogleOAuth() },
          { text: tr('Cancel', 'રદ કરો'), style: 'cancel' },
        ]
      );
      return;
    }
    await launchGoogleOAuth();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Brand area */}
        <View style={styles.brandBox}>
          {/* Language choice before sign-in */}
          <View style={styles.langSwitch} accessibilityRole="radiogroup">
            {([['gu', 'ગુજરાતી'], ['en', 'English']] as const).map(([code, label]) => (
              <TouchableOpacity
                key={code}
                onPress={() => setLang(code)}
                style={[styles.langBtn, lang === code && styles.langBtnActive]}
                accessibilityRole="radio"
                accessibilityState={{ selected: lang === code }}
              >
                <Text style={[styles.langBtnText, lang === code && styles.langBtnTextActive]}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.brandMark}>
            <MaterialIcons name="auto-stories" size={30} color={colors.onAccent} />
          </View>
          <Text style={styles.appName}>MindSprint</Text>
          <Text style={styles.appTagline}>
            {isLoginMode
              ? tr('Videos, textbooks and tests for every chapter, in one place.', 'દરેક પ્રકરણના વિડિયો, પાઠ્યપુસ્તક અને ટેસ્ટ, એક જ જગ્યાએ.')
              : tr('Create an account to save your progress on any phone.', 'કોઈ પણ ફોન પર પ્રગતિ સાચવવા એકાઉન્ટ બનાવો.')}
          </Text>
        </View>

        <View style={styles.formArea}>
          {/* Sign in / Create account switch */}
          <View style={styles.tabRow} accessibilityRole="tablist">
            <TouchableOpacity
              onPress={() => setIsLoginMode(true)}
              style={[styles.tabBtn, isLoginMode && styles.tabBtnActive]}
              accessibilityRole="tab"
              accessibilityState={{ selected: isLoginMode }}
            >
              <Text style={[styles.tabText, isLoginMode && styles.tabTextActive]}>{tr('Sign in', 'સાઇન ઇન')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsLoginMode(false)}
              style={[styles.tabBtn, !isLoginMode && styles.tabBtnActive]}
              accessibilityRole="tab"
              accessibilityState={{ selected: !isLoginMode }}
            >
              <Text style={[styles.tabText, !isLoginMode && styles.tabTextActive]}>{tr('Create account', 'એકાઉન્ટ બનાવો')}</Text>
            </TouchableOpacity>
          </View>

          {!isLoginMode && (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{tr('Full name', 'પૂરું નામ')}</Text>
              <View style={styles.inputWrapper}>
                <MaterialIcons name="person-outline" size={20} color={colors.outline} />
                <TextInput
                  style={styles.input}
                  placeholder={tr('Your name', 'તમારું નામ')}
                  placeholderTextColor={colors.outline}
                  value={name}
                  onChangeText={setName}
                  accessibilityLabel={tr('Full name', 'પૂરું નામ')}
                  autoComplete="name"
                />
              </View>
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{tr('Email', 'ઇમેઇલ')}</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons name="mail-outline" size={20} color={colors.outline} />
              <TextInput
                style={styles.input}
                placeholder="name@example.com"
                placeholderTextColor={colors.outline}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                value={email}
                onChangeText={setEmail}
                accessibilityLabel={tr('Email', 'ઇમેઇલ')}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{tr('Password', 'પાસવર્ડ')}</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons name="lock-outline" size={20} color={colors.outline} />
              <TextInput
                style={styles.input}
                placeholder={tr('At least 6 characters', 'ઓછામાં ઓછા 6 અક્ષર')}
                placeholderTextColor={colors.outline}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                accessibilityLabel={tr('Password', 'પાસવર્ડ')}
              />
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setShowPassword((prev) => !prev)}
                style={styles.eyeBtn}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                accessibilityLabel={showPassword ? tr('Hide password', 'પાસવર્ડ છુપાવો') : tr('Show password', 'પાસવર્ડ બતાવો')}
              >
                <MaterialIcons name={showPassword ? 'visibility' : 'visibility-off'} size={20} color={colors.outline} />
              </TouchableOpacity>
            </View>
          </View>

          {!isLoginMode && (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{tr('I am studying in', 'હું અભ્યાસ કરું છું')}</Text>
              <View style={styles.stageToggleRow}>
                <TouchableOpacity
                  style={[styles.stageChip, selectedGrade !== 'college' && styles.stageChipActive]}
                  onPress={() => setSelectedGrade('10')}
                  accessibilityState={{ selected: selectedGrade !== 'college' }}
                >
                  <MaterialIcons name="school" size={20} color={selectedGrade !== 'college' ? colors.primary : colors.onSurfaceVariant} />
                  <Text style={[styles.stageChipText, selectedGrade !== 'college' && styles.stageChipTextActive]}>{tr('School', 'શાળા')}</Text>
                  <Text style={styles.stageChipSub}>{tr('Class 7 to 12', 'ધોરણ 7 થી 12')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.stageChip, selectedGrade === 'college' && styles.stageChipActive]}
                  onPress={() => setSelectedGrade('college')}
                  accessibilityState={{ selected: selectedGrade === 'college' }}
                >
                  <MaterialIcons name="work-outline" size={20} color={selectedGrade === 'college' ? colors.primary : colors.onSurfaceVariant} />
                  <Text style={[styles.stageChipText, selectedGrade === 'college' && styles.stageChipTextActive]}>{tr('College', 'કૉલેજ')}</Text>
                  <Text style={styles.stageChipSub}>{tr('Placement prep', 'પ્લેસમેન્ટ તૈયારી')}</Text>
                </TouchableOpacity>
              </View>

              {selectedGrade !== 'college' && (
                <View style={{ marginTop: 14 }}>
                  <Text style={styles.inputLabel}>{tr('Class (GSEB, Gujarati medium)', 'ધોરણ (GSEB, ગુજરાતી માધ્યમ)')}</Text>
                  <View style={styles.gradePillRow}>
                    {(['7', '8', '9', '10', '11', '12'] as AcademicGrade[]).map((g) => (
                      <TouchableOpacity
                        key={g}
                        style={[styles.gradePill, selectedGrade === g && styles.gradePillActive]}
                        onPress={() => setSelectedGrade(g)}
                        accessibilityLabel={tr(`Class ${g}`, `ધોરણ ${g}`)}
                        accessibilityState={{ selected: selectedGrade === g }}
                      >
                        <Text style={[styles.gradePillText, selectedGrade === g && styles.gradePillTextActive]}>ધોરણ {g}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  {gradeHasStreams(selectedGrade) && (
                    <Animated.View entering={FadeInDown.duration(220)} exiting={FadeOut.duration(120)} style={{ marginTop: 14 }}>
                      <Text style={styles.inputLabel}>{tr('Stream', 'પ્રવાહ')}</Text>
                      <View style={styles.gradePillRow} accessibilityRole="radiogroup">
                        {STREAM_OPTIONS.map((o) => (
                          <TouchableOpacity
                            key={o.stream}
                            style={[styles.gradePill, selectedStream === o.stream && styles.gradePillActive]}
                            onPress={() => setSelectedStream(o.stream)}
                            accessibilityRole="radio"
                            accessibilityLabel={`${o.label}. ${o.subjects}`}
                            accessibilityState={{ selected: selectedStream === o.stream }}
                          >
                            <Text style={[styles.gradePillText, selectedStream === o.stream && styles.gradePillTextActive]}>
                              {lang === 'gu' ? o.labelGujarati.replace(/\s*\(.*\)/, '') : o.label}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </Animated.View>
                  )}
                </View>
              )}
            </View>
          )}

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading} accessibilityRole="button">
            {loading ? (
              <ActivityIndicator color={colors.onAccent} />
            ) : (
              <Text style={styles.submitBtnText}>{isLoginMode ? tr('Sign in', 'સાઇન ઇન') : tr('Create account', 'એકાઉન્ટ બનાવો')}</Text>
            )}
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>{tr('or', 'અથવા')}</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={styles.googleBtn} onPress={handleGoogleSignIn} accessibilityRole="button">
            <View style={styles.googleIconCircle}>
              <Text style={styles.googleGText}>G</Text>
            </View>
            <Text style={styles.googleBtnText}>{tr('Continue with Google', 'Google થી આગળ વધો')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.guestBtn} onPress={handleGuestLogin} accessibilityRole="button">
            <Text style={styles.guestBtnText}>{tr('Continue as guest', 'મહેમાન તરીકે આગળ વધો')}</Text>
          </TouchableOpacity>
          <Text style={styles.guestNote}>{tr('Guests can try everything; progress stays on this phone only.', 'મહેમાન બધું વાપરી શકે; પ્રગતિ ફક્ત આ ફોનમાં રહેશે.')}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (c: typeof MindSprintColors) =>
  StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: c.heroSurface },
    scrollContent: { flexGrow: 1, backgroundColor: c.background },
    brandBox: {
      backgroundColor: c.heroSurface,
      paddingHorizontal: 24,
      paddingTop: 28,
      paddingBottom: 36,
      borderBottomLeftRadius: 28,
      borderBottomRightRadius: 28,
    },
    langSwitch: { flexDirection: 'row', alignSelf: 'flex-end', gap: 4, padding: 3, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.12)', marginBottom: 12 },
    langBtn: { minHeight: 34, paddingHorizontal: 14, borderRadius: 17, justifyContent: 'center' },
    langBtnActive: { backgroundColor: c.onHeroSurface },
    langBtnText: { fontFamily: MindSprintFonts.label, fontSize: 14, color: c.onHeroSurfaceVariant },
    langBtnTextActive: { color: c.heroSurface },
    brandMark: {
      width: 56,
      height: 56,
      borderRadius: 16,
      backgroundColor: c.accent,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    appName: { fontFamily: MindSprintFonts.display, fontSize: 34, lineHeight: 42, color: c.onHeroSurface },
    appTagline: { fontSize: 15, lineHeight: 22, color: c.onHeroSurfaceVariant, marginTop: 4, maxWidth: 320 },
    formArea: { padding: 20, paddingTop: 24, width: '100%', maxWidth: 480, alignSelf: 'center' },
    tabRow: { flexDirection: 'row', backgroundColor: c.surfaceContainerLow, borderRadius: 14, padding: 4, marginBottom: 22 },
    tabBtn: { flex: 1, minHeight: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 11 },
    tabBtnActive: { backgroundColor: c.surface, borderWidth: 1, borderColor: c.outlineVariant },
    tabText: { fontFamily: MindSprintFonts.label, fontSize: 15, color: c.onSurfaceVariant },
    tabTextActive: { color: c.primary },
    inputContainer: { marginBottom: 16 },
    inputLabel: { fontSize: 13.5, fontWeight: '600', color: c.onSurface, marginBottom: 6 },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: c.outlineVariant,
      paddingHorizontal: 12,
      minHeight: 50,
      gap: 10,
    },
    input: { flex: 1, fontSize: 15.5, color: c.onSurface, paddingVertical: 12 },
    eyeBtn: { padding: 4, justifyContent: 'center', alignItems: 'center' },
    submitBtn: {
      backgroundColor: c.accent,
      minHeight: 52,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 6,
    },
    submitBtnText: { fontFamily: MindSprintFonts.label, fontSize: 17, color: c.onAccent },
    dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 18 },
    dividerLine: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: c.outlineVariant },
    dividerText: { fontSize: 13, color: c.onSurfaceVariant, paddingHorizontal: 12 },
    googleBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.outlineVariant,
      minHeight: 50,
      borderRadius: 14,
      gap: 10,
    },
    googleIconCircle: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#ea4335', alignItems: 'center', justifyContent: 'center' },
    googleGText: { color: '#ffffff', fontSize: 14, fontWeight: '900' },
    googleBtnText: { fontFamily: MindSprintFonts.label, fontSize: 15.5, color: c.onSurface },
    guestBtn: { alignItems: 'center', justifyContent: 'center', minHeight: 48, marginTop: 8 },
    guestBtnText: { fontFamily: MindSprintFonts.label, fontSize: 15.5, color: c.primary },
    guestNote: { fontSize: 12.5, color: c.onSurfaceVariant, textAlign: 'center' },
    stageToggleRow: { flexDirection: 'row', gap: 10 },
    stageChip: {
      flex: 1,
      padding: 12,
      borderRadius: 14,
      backgroundColor: c.surface,
      borderWidth: 1.5,
      borderColor: c.outlineVariant,
      gap: 2,
    },
    stageChipActive: { backgroundColor: c.primaryFixed, borderColor: c.primary },
    stageChipText: { fontFamily: MindSprintFonts.label, fontSize: 15.5, color: c.onSurface, marginTop: 4 },
    stageChipTextActive: { color: c.primary },
    stageChipSub: { fontSize: 12.5, color: c.onSurfaceVariant },
    gradePillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    gradePill: {
      minWidth: 72,
      minHeight: 42,
      paddingHorizontal: 12,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.outlineVariant,
    },
    gradePillActive: { backgroundColor: c.primary, borderColor: c.primary },
    gradePillText: { fontSize: 14, fontWeight: '600', color: c.onSurface },
    gradePillTextActive: { color: c.onPrimary },
  });

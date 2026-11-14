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
import { MaterialIcons } from '@expo/vector-icons';
import { MindSprintColors, MindSprintFonts } from '@/constants/mindsprintTheme';
import { useTheme } from '@/context/ThemeContext';
import { AcademicGrade } from '@/constants/academicData';
import { ApiService } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<AcademicGrade>('college');
  const [loading, setLoading] = useState(false);
  const { login: authLogin, register: authRegister, loginWithGoogle: authGoogleLogin, loginAsGuest } = useAuth();

  const handleBackendGoogleLogin = async (idToken: string) => {
    setLoading(true);
    try {
      const res = await authGoogleLogin(idToken);
      setLoading(false);

      if (res.error) {
        Alert.alert('Google Sign-In Failed', res.error);
        return;
      }
      Alert.alert('Welcome to MindSprint! 🎓', 'Signed in successfully with your Google account.');
      router.replace('/(tabs)');
    } catch (err: any) {
      setLoading(false);
      Alert.alert('Sign-In Error', err?.message || 'Could not complete Google Sign-In.');
    }
  };

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Required Fields', 'Please enter your email and password.');
      return;
    }

    if (!isLoginMode && !name) {
      Alert.alert('Required Fields', 'Please enter your full name.');
      return;
    }

    setLoading(true);

    try {
      if (isLoginMode) {
        const res = await authLogin(email, password);
        setLoading(false);
        if (res.error) {
          Alert.alert('Login Failed', res.error);
        } else {
          router.replace('/(tabs)');
        }
      } else {
        const targetBoard = selectedGrade === 'college' ? 'CBSE' : 'GSEB';
        const targetMedium = selectedGrade === 'college' ? 'English' : 'Gujarati';
        const res = await authRegister(name, email, password, selectedGrade, targetBoard, targetMedium);
        setLoading(false);
        if (res.error) {
          Alert.alert('Registration Failed', res.error);
        } else {
          Alert.alert('Account Created!', `Welcome to MindSprint, ${name}!`);
          router.replace('/(tabs)');
        }
      }
    } catch (err: any) {
      setLoading(false);
      Alert.alert('Error', err.message || 'An unexpected error occurred.');
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
        'Google Sign-In on Phone 📱',
        'Google OAuth security policy blocks "localhost" redirects on mobile phones. To test Google Sign-In with your new credentials, press "w" in your terminal to open on Web.\n\nTo test on your phone right now, you can sign in with Email/Password or Continue as Guest.',
        [
          { text: 'Continue as Guest', onPress: () => handleGuestLogin() },
          { text: 'Try Anyway', onPress: () => launchGoogleOAuth() },
          { text: 'Cancel', style: 'cancel' },
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
          <View style={styles.brandMark}>
            <MaterialIcons name="auto-stories" size={30} color={colors.onAccent} />
          </View>
          <Text style={styles.appName}>MindSprint</Text>
          <Text style={styles.appTagline}>
            {isLoginMode
              ? 'Videos, textbooks and tests for every chapter, in one place.'
              : 'Create an account to save your progress on any phone.'}
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
              <Text style={[styles.tabText, isLoginMode && styles.tabTextActive]}>Sign in</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsLoginMode(false)}
              style={[styles.tabBtn, !isLoginMode && styles.tabBtnActive]}
              accessibilityRole="tab"
              accessibilityState={{ selected: !isLoginMode }}
            >
              <Text style={[styles.tabText, !isLoginMode && styles.tabTextActive]}>Create account</Text>
            </TouchableOpacity>
          </View>

          {!isLoginMode && (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Full name</Text>
              <View style={styles.inputWrapper}>
                <MaterialIcons name="person-outline" size={20} color={colors.outline} />
                <TextInput
                  style={styles.input}
                  placeholder="Your name"
                  placeholderTextColor={colors.outline}
                  value={name}
                  onChangeText={setName}
                  accessibilityLabel="Full name"
                  autoComplete="name"
                />
              </View>
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
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
                accessibilityLabel="Email"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons name="lock-outline" size={20} color={colors.outline} />
              <TextInput
                style={styles.input}
                placeholder="At least 6 characters"
                placeholderTextColor={colors.outline}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                accessibilityLabel="Password"
              />
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setShowPassword((prev) => !prev)}
                style={styles.eyeBtn}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
              >
                <MaterialIcons name={showPassword ? 'visibility' : 'visibility-off'} size={20} color={colors.outline} />
              </TouchableOpacity>
            </View>
          </View>

          {!isLoginMode && (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>I am studying in</Text>
              <View style={styles.stageToggleRow}>
                <TouchableOpacity
                  style={[styles.stageChip, selectedGrade !== 'college' && styles.stageChipActive]}
                  onPress={() => setSelectedGrade('10')}
                  accessibilityState={{ selected: selectedGrade !== 'college' }}
                >
                  <MaterialIcons name="school" size={20} color={selectedGrade !== 'college' ? colors.primary : colors.onSurfaceVariant} />
                  <Text style={[styles.stageChipText, selectedGrade !== 'college' && styles.stageChipTextActive]}>School</Text>
                  <Text style={styles.stageChipSub}>Class 7 to 12</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.stageChip, selectedGrade === 'college' && styles.stageChipActive]}
                  onPress={() => setSelectedGrade('college')}
                  accessibilityState={{ selected: selectedGrade === 'college' }}
                >
                  <MaterialIcons name="work-outline" size={20} color={selectedGrade === 'college' ? colors.primary : colors.onSurfaceVariant} />
                  <Text style={[styles.stageChipText, selectedGrade === 'college' && styles.stageChipTextActive]}>College</Text>
                  <Text style={styles.stageChipSub}>Placement prep</Text>
                </TouchableOpacity>
              </View>

              {selectedGrade !== 'college' && (
                <View style={{ marginTop: 14 }}>
                  <Text style={styles.inputLabel}>Class (GSEB, Gujarati medium)</Text>
                  <View style={styles.gradePillRow}>
                    {(['7', '8', '9', '10', '11', '12'] as AcademicGrade[]).map((g) => (
                      <TouchableOpacity
                        key={g}
                        style={[styles.gradePill, selectedGrade === g && styles.gradePillActive]}
                        onPress={() => setSelectedGrade(g)}
                        accessibilityLabel={`Class ${g}`}
                        accessibilityState={{ selected: selectedGrade === g }}
                      >
                        <Text style={[styles.gradePillText, selectedGrade === g && styles.gradePillTextActive]}>ધોરણ {g}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </View>
          )}

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading} accessibilityRole="button">
            {loading ? (
              <ActivityIndicator color={colors.onAccent} />
            ) : (
              <Text style={styles.submitBtnText}>{isLoginMode ? 'Sign in' : 'Create account'}</Text>
            )}
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={styles.googleBtn} onPress={handleGoogleSignIn} accessibilityRole="button">
            <View style={styles.googleIconCircle}>
              <Text style={styles.googleGText}>G</Text>
            </View>
            <Text style={styles.googleBtnText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.guestBtn} onPress={handleGuestLogin} accessibilityRole="button">
            <Text style={styles.guestBtnText}>Continue as guest</Text>
          </TouchableOpacity>
          <Text style={styles.guestNote}>Guests can try everything; progress stays on this phone only.</Text>
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

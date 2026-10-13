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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { MindSprintColors, MindSprintShadows } from '@/constants/mindsprintTheme';
import { ApiService } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login: authLogin, register: authRegister, loginAsGuest } = useAuth();

  const handleBackendGoogleLogin = async (idToken: string) => {
    setLoading(true);
    try {
      const res = await ApiService.loginWithGoogle(idToken);
      setLoading(false);

      if (res.error) {
        Alert.alert('Login Note', res.error + '\nLogged in as Guest user.');
      } else {
        Alert.alert('Welcome Back!', `Logged in successfully as ${res.user?.name || res.user?.email}`);
      }
      router.replace('/(tabs)');
    } catch (err) {
      setLoading(false);
      router.replace('/(tabs)');
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
        }
      } else {
        const res = await authRegister(name, email, password);
        setLoading(false);
        if (res.error) {
          Alert.alert('Registration Failed', res.error);
        } else {
          Alert.alert('Account Created!', `Welcome to MindSprint, ${name}!`);
        }
      }
    } catch (err: any) {
      setLoading(false);
      Alert.alert('Error', err.message || 'An unexpected error occurred.');
    }
  };

  const handleGuestLogin = async () => {
    await loginAsGuest();
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const clientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB;
      const redirectTarget = 'https://auth.expo.io/@anonymous/mindsprint';
      const redirectUri = encodeURIComponent(redirectTarget);
      
      const nonce = Math.random().toString(36).substring(2);
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=id_token&client_id=${clientId}&redirect_uri=${redirectUri}&scope=openid%20profile%20email&nonce=${nonce}`;

      const result = await WebBrowser.openAuthSessionAsync(authUrl);

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Branding */}
        <View style={styles.brandBox}>
          <View style={[styles.iconCircle, MindSprintShadows.glow]}>
            <MaterialIcons name="school" size={44} color="#ffffff" />
          </View>
          <Text style={styles.appName}>MindSprint</Text>
          <Text style={styles.appTagline}>
            {isLoginMode
              ? 'Sign in to access placement tests & skill tracks'
              : 'Create your account to start learning'}
          </Text>
          <View style={styles.quoteBadge}>
            <MaterialIcons name="auto-awesome" size={14} color={MindSprintColors.primary} />
            <Text style={styles.quoteText}>"Be the better version of yourself"</Text>
          </View>
        </View>

        {/* Form Box */}
        <View style={[styles.formCard, MindSprintShadows.card]}>
          {/* Mode Switcher Tabs */}
          <View style={styles.tabRow}>
            <TouchableOpacity
              onPress={() => setIsLoginMode(true)}
              style={[styles.tabBtn, isLoginMode && styles.tabBtnActive]}
            >
              <Text style={[styles.tabText, isLoginMode && styles.tabTextActive]}>
                Sign In
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setIsLoginMode(false)}
              style={[styles.tabBtn, !isLoginMode && styles.tabBtnActive]}
            >
              <Text style={[styles.tabText, !isLoginMode && styles.tabTextActive]}>
                Register
              </Text>
            </TouchableOpacity>
          </View>

          {/* Full Name Input (Register mode only) */}
          {!isLoginMode && (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <View style={styles.inputWrapper}>
                <MaterialIcons name="person" size={20} color={MindSprintColors.outline} />
                <TextInput
                  style={styles.input}
                  placeholder="Alex Johnson"
                  placeholderTextColor={MindSprintColors.outline}
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>
          )}

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons name="email" size={20} color={MindSprintColors.outline} />
              <TextInput
                style={styles.input}
                placeholder="alex.johnson@mindsprint.edu"
                placeholderTextColor={MindSprintColors.outline}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons name="lock" size={20} color={MindSprintColors.outline} />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={MindSprintColors.outline}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitBtn, MindSprintShadows.glow]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.submitBtnText}>
                {isLoginMode ? 'Sign In' : 'Create Account'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Divider Line */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Continue with Google Button */}
          <TouchableOpacity
            style={styles.googleBtn}
            onPress={handleGoogleSignIn}
          >
            <View style={styles.googleIconCircle}>
              <Text style={styles.googleGText}>G</Text>
            </View>
            <Text style={styles.googleBtnText}>Continue with Google</Text>
          </TouchableOpacity>

          {/* Guest Login Direct Access */}
          <TouchableOpacity
            style={styles.guestBtn}
            onPress={handleGuestLogin}
          >
            <Text style={styles.guestBtnText}>Continue as Guest Student →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: MindSprintColors.background,
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100%',
  },
  brandBox: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: MindSprintColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  appName: {
    fontSize: 32,
    fontWeight: '800',
    color: MindSprintColors.primary,
  },
  appTagline: {
    fontSize: 14,
    color: MindSprintColors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 4,
  },
  quoteBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(53, 37, 205, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 10,
  },
  quoteText: {
    fontSize: 12,
    fontWeight: '700',
    color: MindSprintColors.primary,
    fontStyle: 'italic',
  },
  formCard: {
    width: '100%',
    backgroundColor: MindSprintColors.surfaceContainerLowest,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: MindSprintColors.outlineVariant,
    padding: 20,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: MindSprintColors.surfaceContainerLow,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabBtnActive: {
    backgroundColor: MindSprintColors.surfaceContainerLowest,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: MindSprintColors.onSurfaceVariant,
  },
  tabTextActive: {
    color: MindSprintColors.primary,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: MindSprintColors.onSurface,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MindSprintColors.surfaceContainerLow,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: MindSprintColors.outlineVariant,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: MindSprintColors.onSurface,
    padding: 0,
  },
  submitBtn: {
    backgroundColor: MindSprintColors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: MindSprintColors.outlineVariant,
  },
  dividerText: {
    fontSize: 12,
    fontWeight: '600',
    color: MindSprintColors.outline,
    paddingHorizontal: 10,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: MindSprintColors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: MindSprintColors.outlineVariant,
    paddingVertical: 12,
    borderRadius: 14,
    gap: 10,
  },
  googleIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ea4335',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleGText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
  },
  googleBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: MindSprintColors.onSurface,
  },
  guestBtn: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  guestBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: MindSprintColors.primary,
  },
});

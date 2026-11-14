import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { MindSprintColors, MindSprintFonts } from '@/constants/mindsprintTheme';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { ApiService } from '@/services/api';

const AVATAR_PRESETS = ['🧑‍🎓', '👩‍🎓', '👩‍🔬', '🧑‍💻', '👨‍🚀', '🦁', '⚡', '🎯', '🦉', '🚀'];

export default function ProfileEditScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { tr } = useLanguage();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  const { user, logout, updateUserProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState<string>(user?.avatarUrl || '');
  const [targetCompany, setTargetCompany] = useState(user?.targetCompany && user.targetCompany !== 'All Companies' ? user.targetCompany : '');
  const [institute, setInstitute] = useState(user?.college || '');
  const [targetYear, setTargetYear] = useState(user?.graduationYear || '');
  const [saving, setSaving] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const handlePickFromGallery = async () => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert(
          tr('Allow photo access', 'ફોટો જોવાની પરવાનગી આપો'),
          tr('To choose a profile picture, allow MindSprint to open your photos in Settings.', 'પ્રોફાઇલ ફોટો પસંદ કરવા, Settings માં MindSprint ને ફોટો ખોલવાની પરવાનગી આપો.')
        );
        return;
      }
      const res = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true,
      });
      if (!res.canceled && res.assets && res.assets.length > 0) {
        const asset = res.assets[0];
        const dataUrl = asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : asset.uri;
        setAvatarUrl(dataUrl);
      }
    } catch (e) {
      console.warn('Gallery pick error:', e);
    }
  };

  const handleTakePhoto = async () => {
    try {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) {
        Alert.alert(
          tr('Allow camera access', 'કૅમેરાની પરવાનગી આપો'),
          tr('To take a profile photo, allow MindSprint to use the camera in Settings.', 'પ્રોફાઇલ ફોટો લેવા, Settings માં MindSprint ને કૅમેરા વાપરવાની પરવાનગી આપો.')
        );
        return;
      }
      const res = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true,
      });
      if (!res.canceled && res.assets && res.assets.length > 0) {
        const asset = res.assets[0];
        const dataUrl = asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : asset.uri;
        setAvatarUrl(dataUrl);
      }
    } catch (e) {
      console.warn('Camera take error:', e);
    }
  };

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      Alert.alert(tr('Enter your name', 'તમારું નામ લખો'), tr('Your name appears on your profile and reports.', 'તમારું નામ પ્રોફાઇલ અને અહેવાલમાં દેખાશે.'));
      return;
    }

    setSaving(true);
    try {
      await ApiService.updateProfile({
        email: user?.email,
        name,
        targetCompany,
        college: institute,
        avatarUrl,
      });

      await updateUserProfile({
        name,
        targetCompany,
        avatarUrl,
        college: institute,
        graduationYear: targetYear,
      });

      Alert.alert(tr('Profile saved', 'પ્રોફાઇલ સચવાઈ'), tr('Your changes are saved.', 'તમારા ફેરફારો સચવાઈ ગયા.'));
      router.back();
    } catch {
      Alert.alert(
        tr('Saved on this phone', 'આ ફોનમાં સચવાયું'),
        tr('Your changes are saved here and will sync when the server is reachable.', 'ફેરફારો અહીં સચવાયા છે અને સર્વર મળે ત્યારે સિંક થશે.')
      );
      router.back();
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      tr('Delete your account?', 'તમારું એકાઉન્ટ ડિલીટ કરવું છે?'),
      tr(
        'This permanently deletes your account, streaks and test results. It cannot be undone.',
        'આથી તમારું એકાઉન્ટ, સ્ટ્રીક અને ટેસ્ટનાં પરિણામો કાયમ માટે ડિલીટ થશે. આ પાછું લાવી શકાશે નહીં.'
      ),
      [
        { text: tr('Keep my account', 'એકાઉન્ટ રાખો'), style: 'cancel' },
        {
          text: tr('Delete account', 'એકાઉન્ટ ડિલીટ કરો'),
          style: 'destructive',
          onPress: async () => {
            try {
              if (user?.email) {
                await ApiService.deleteAccount(user.email);
              }
            } catch (e) {
              console.warn('Delete account error:', e);
            }
            await logout();
            Alert.alert(tr('Account deleted', 'એકાઉન્ટ ડિલીટ થયું'), tr('Your data has been removed.', 'તમારો ડેટા દૂર કરવામાં આવ્યો છે.'));
            router.replace('/(tabs)/profile' as any);
          },
        },
      ]
    );
  };

  const isEmoji = !!avatarUrl && !avatarUrl.startsWith('http') && !avatarUrl.startsWith('file:') && !avatarUrl.startsWith('data:');
  const isSchool = !!user?.grade && user.grade !== 'college';

  const field = (
    label: string,
    value: string,
    onChange: ((t: string) => void) | null,
    placeholder?: string,
    extra?: Partial<React.ComponentProps<typeof TextInput>>,
    hint?: string,
  ) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.textInput, !onChange && styles.textInputReadonly]}
        value={value}
        onChangeText={onChange || undefined}
        editable={!!onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.outline}
        accessibilityLabel={label}
        {...extra}
      />
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} accessibilityLabel={tr('Go back', 'પાછા જાઓ')}>
          <MaterialIcons name="arrow-back" size={24} color={colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{tr('Edit profile', 'પ્રોફાઇલ બદલો')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Photo */}
        <View style={styles.avatarSection}>
          <TouchableOpacity activeOpacity={0.85} style={styles.avatarWrapper} onPress={handlePickFromGallery} accessibilityLabel={tr('Choose a photo', 'ફોટો પસંદ કરો')}>
            {isEmoji ? (
              <View style={[styles.avatar, styles.emojiAvatarBox]}>
                <Text style={styles.emojiAvatarText}>{avatarUrl}</Text>
              </View>
            ) : (
              <Image
                source={{ uri: avatarUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpTpadB_GY_XTy7q4R83ni9Q0r3ovKCNCuNHvfTLdAAUsEDZQQ26lLxFQO_WijYLtiUQadQJ_c0VDSE0fHXcuipv31vufAkHZtjG1aj35AKp-BjX-2zVCFy4qBBlHxSdFhkGtwh5DKfM4qwVUmYdc-K3yrzrEPvVhlN2E9YXrZH1pl8ECG17oL9IkbPI8NtjpIidsOBmstyEVvCWiL4dNDK14kJBzDlDXzw8GOBDLwWHwzKNd5EGU3' }}
                style={styles.avatar}
              />
            )}
            <View style={styles.cameraBadge}>
              <MaterialIcons name="photo-camera" size={14} color={colors.onPrimary} />
            </View>
          </TouchableOpacity>

          <View style={styles.avatarActionBtnsRow}>
            <TouchableOpacity style={styles.smallActionBtn} onPress={handlePickFromGallery}>
              <MaterialIcons name="photo-library" size={18} color={colors.primary} />
              <Text style={styles.smallActionBtnText}>{tr('Choose photo', 'ફોટો પસંદ કરો')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.smallActionBtn} onPress={handleTakePhoto}>
              <MaterialIcons name="photo-camera" size={18} color={colors.primary} />
              <Text style={styles.smallActionBtnText}>{tr('Take photo', 'ફોટો લો')}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.emojiRow}>
            {AVATAR_PRESETS.map((emoji, idx) => {
              const selected = avatarUrl === emoji;
              return (
                <TouchableOpacity
                  key={idx}
                  style={[styles.smallEmojiBtn, selected && styles.smallEmojiSelected]}
                  onPress={() => setAvatarUrl(emoji)}
                  accessibilityState={{ selected }}
                >
                  <Text style={{ fontSize: 22 }}>{emoji}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* About you */}
        <Text style={styles.sectionHeading}>{tr('About you', 'તમારા વિશે')}</Text>
        <View style={styles.card}>
          {field(tr('Full name', 'પૂરું નામ'), name, setName, tr('Your name', 'તમારું નામ'), { autoComplete: 'name' })}
          {field(tr('Email', 'ઇમેઇલ'), user?.email || '', null, undefined, undefined, tr('Your sign-in email can’t be changed here.', 'સાઇન ઇન ઇમેઇલ અહીં બદલી શકાતો નથી.'))}
          {field(isSchool ? tr('School', 'શાળા') : tr('College or institute', 'કૉલેજ કે સંસ્થા'), institute, setInstitute, isSchool ? tr('Your school name', 'તમારી શાળાનું નામ') : tr('Your college name', 'તમારી કૉલેજનું નામ'))}
          {field(tr('Goal', 'લક્ષ્ય'), targetCompany, setTargetCompany, isSchool ? tr('e.g. 90% in board exam', 'દા.ત. બોર્ડમાં 90%') : tr('e.g. TCS Digital, Amazon SDE', 'દા.ત. TCS Digital, Amazon SDE'))}
          {field(isSchool ? 'Exam year' : 'Graduation year', targetYear, setTargetYear, '2027', { keyboardType: 'numeric' })}
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          style={[styles.saveBtn, saving && { opacity: 0.7 }]}
          onPress={handleSaveProfile}
          disabled={saving}
          accessibilityRole="button"
        >
          <Text style={styles.saveBtnText}>{saving ? tr('Saving…', 'સચવાય છે…') : tr('Save changes', 'ફેરફારો સાચવો')}</Text>
        </TouchableOpacity>

        {/* Account */}
        <Text style={styles.sectionHeading}>{tr('Account and privacy', 'એકાઉન્ટ અને ગોપનીયતા')}</Text>
        <View style={[styles.card, { paddingVertical: 0, gap: 0 }]}>
          <TouchableOpacity style={styles.legalRow} onPress={() => setShowPrivacyModal(true)}>
            <MaterialIcons name="privacy-tip" size={22} color={colors.primary} />
            <Text style={styles.legalRowText}>{tr('Privacy policy', 'ગોપનીયતા નીતિ')}</Text>
            <MaterialIcons name="chevron-right" size={22} color={colors.outline} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.legalRow, styles.rowDivider]}
            onPress={() => Alert.alert(tr('Terms of service', 'સેવાની શરતો'), tr('MindSprint is a study app. Videos and textbooks link to their original publishers.', 'MindSprint અભ્યાસ ઍપ છે. વિડિયો અને પાઠ્યપુસ્તકો તેમના મૂળ પ્રકાશકો સાથે જોડાયેલાં છે.'))}
          >
            <MaterialIcons name="description" size={22} color={colors.primary} />
            <Text style={styles.legalRowText}>{tr('Terms of service', 'સેવાની શરતો')}</Text>
            <MaterialIcons name="chevron-right" size={22} color={colors.outline} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.legalRow, styles.rowDivider]} onPress={handleDeleteAccount}>
            <MaterialIcons name="delete-outline" size={22} color={colors.error} />
            <Text style={[styles.legalRowText, { color: colors.error }]}>{tr('Delete account and data', 'એકાઉન્ટ અને ડેટા ડિલીટ કરો')}</Text>
            <MaterialIcons name="chevron-right" size={22} color={colors.error} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={showPrivacyModal} transparent animationType="slide" onRequestClose={() => setShowPrivacyModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{tr('Privacy policy', 'ગોપનીયતા નીતિ')}</Text>
              <TouchableOpacity onPress={() => setShowPrivacyModal(false)} style={styles.backBtn} accessibilityLabel={tr('Close', 'બંધ કરો')}>
                <MaterialIcons name="close" size={24} color={colors.onSurfaceVariant} />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 350, marginVertical: 10 }} showsVerticalScrollIndicator={false}>
              <Text style={styles.privacyText}>
                {tr(
                  'What we store: your name, email, study progress, test scores and bookmarks, so the app can show your progress and suggest what to study.\n\nWe do not sell your data.\n\nYou can delete your account and all your test results at any time with "Delete account and data".',
                  'અમે શું સાચવીએ છીએ: તમારું નામ, ઇમેઇલ, અભ્યાસની પ્રગતિ, ટેસ્ટના ગુણ અને સાચવેલું, જેથી ઍપ તમારી પ્રગતિ બતાવી શકે અને શું ભણવું તે સૂચવી શકે.\n\nઅમે તમારો ડેટા વેચતા નથી.\n\n"એકાઉન્ટ અને ડેટા ડિલીટ કરો" થી તમે ગમે ત્યારે એકાઉન્ટ અને બધાં પરિણામો ડિલીટ કરી શકો છો.'
                )}
              </Text>
            </ScrollView>
            <TouchableOpacity style={styles.closeModalBtn} onPress={() => setShowPrivacyModal(false)}>
              <Text style={styles.closeModalBtnText}>{tr('Close', 'બંધ કરો')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const makeStyles = (c: typeof MindSprintColors) =>
  StyleSheet.create({
    safeArea: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, minHeight: 56, gap: 4 },
    backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 22 },
    headerTitle: { fontFamily: MindSprintFonts.heading, fontSize: 22, lineHeight: 28, color: c.onSurface },
    scrollContainer: { padding: 16, paddingTop: 4, paddingBottom: 40 },
    sectionHeading: { fontFamily: MindSprintFonts.heading, fontSize: 18, lineHeight: 24, color: c.onSurface, marginTop: 24, marginBottom: 10 },
    card: { borderRadius: 16, borderWidth: 1, borderColor: c.outlineVariant, backgroundColor: c.surface, padding: 16, gap: 16 },
    inputGroup: { gap: 6 },
    label: { fontSize: 13.5, fontWeight: '600', color: c.onSurface },
    hint: { fontSize: 12.5, color: c.onSurfaceVariant },
    textInput: {
      borderWidth: 1,
      borderColor: c.outlineVariant,
      backgroundColor: c.background,
      color: c.onSurface,
      borderRadius: 12,
      paddingHorizontal: 14,
      minHeight: 48,
      fontSize: 15.5,
    },
    textInputReadonly: { backgroundColor: c.surfaceContainerLow, color: c.onSurfaceVariant },
    saveBtn: { minHeight: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: c.accent, marginTop: 16 },
    saveBtnText: { fontFamily: MindSprintFonts.label, fontSize: 17, color: c.onAccent },
    legalRow: { flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 56 },
    rowDivider: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: c.outlineVariant },
    legalRowText: { flex: 1, fontFamily: MindSprintFonts.title, fontSize: 15.5, color: c.onSurface },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
    modalCard: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '80%', backgroundColor: c.surface },
    modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    modalTitle: { fontFamily: MindSprintFonts.heading, fontSize: 20, lineHeight: 26, color: c.onSurface },
    privacyText: { fontSize: 14.5, lineHeight: 23, color: c.onSurface },
    closeModalBtn: { minHeight: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 10, backgroundColor: c.primary },
    closeModalBtnText: { fontFamily: MindSprintFonts.label, color: c.onPrimary, fontSize: 15.5 },
    avatarSection: { alignItems: 'center', gap: 14, marginTop: 4 },
    avatarWrapper: { position: 'relative' },
    avatar: { width: 92, height: 92, borderRadius: 46, backgroundColor: c.primaryFixed },
    cameraBadge: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 28,
      height: 28,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: c.background,
      backgroundColor: c.primary,
    },
    emojiAvatarBox: { alignItems: 'center', justifyContent: 'center' },
    emojiAvatarText: { fontSize: 44 },
    avatarActionBtnsRow: { flexDirection: 'row', gap: 10 },
    smallActionBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 14,
      minHeight: 42,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: c.outlineVariant,
      backgroundColor: c.surface,
    },
    smallActionBtnText: { fontFamily: MindSprintFonts.label, fontSize: 14.5, color: c.primary },
    emojiRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', maxWidth: 320 },
    smallEmojiBtn: {
      width: 44,
      height: 44,
      borderRadius: 22,
      borderWidth: 2,
      borderColor: 'transparent',
      backgroundColor: c.surfaceContainerLow,
      alignItems: 'center',
      justifyContent: 'center',
    },
    smallEmojiSelected: { borderColor: c.primary, backgroundColor: c.primaryFixed },
  });

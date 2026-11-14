import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { MindSprintFonts } from '@/constants/mindsprintTheme';

interface Props {
  checking?: boolean;
  onRetry: () => void;
}

/** Shown only when the MindSprint server cannot be reached. Videos still play; chapter PDFs need the server. */
export const ServerStatusBanner: React.FC<Props> = ({ checking, onRetry }) => {
  const { colors } = useTheme();
  const { tr } = useLanguage();
  return (
    <View accessibilityRole="alert" style={[styles.box, { backgroundColor: colors.accentContainer }]}>
      <MaterialIcons name="wifi-off" size={20} color={colors.onAccentContainer} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, { color: colors.onAccentContainer }]}>{tr('You are offline', 'તમે ઑફલાઇન છો')}</Text>
        <Text style={[styles.text, { color: colors.onAccentContainer }]}>
          {tr('Videos and downloaded chapters still work. Chapter PDFs need the server.', 'વિડિયો અને ડાઉનલોડ કરેલાં પ્રકરણ ચાલશે. PDF માટે સર્વર જોઈએ.')}
        </Text>
      </View>
      <TouchableOpacity
        onPress={onRetry}
        disabled={checking}
        accessibilityRole="button"
        accessibilityLabel={tr('Retry connecting to the server', 'સર્વર સાથે ફરી જોડાવ')}
        style={[styles.btn, { backgroundColor: colors.accent, opacity: checking ? 0.6 : 1 }]}
      >
        <Text style={[styles.btnText, { color: colors.onAccent }]}>{checking ? tr('Checking…', 'તપાસી રહ્યા છીએ…') : tr('Retry', 'ફરી પ્રયત્ન')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  box: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 14 },
  title: { fontFamily: MindSprintFonts.label, fontSize: 15 },
  text: { fontSize: 12.5, marginTop: 1 },
  btn: { paddingHorizontal: 14, borderRadius: 10, minHeight: 40, justifyContent: 'center' },
  btnText: { fontFamily: MindSprintFonts.label, fontSize: 14 },
});

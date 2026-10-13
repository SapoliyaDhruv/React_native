import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { ApiService } from '@/services/api';

interface CompanyFilterBarProps {
  selectedCompany: string;
  onSelectCompany: (company: string) => void;
}

export const CompanyFilterBar: React.FC<CompanyFilterBarProps> = ({
  selectedCompany,
  onSelectCompany,
}) => {
  const { colors } = useTheme();
  const [companies, setCompanies] = useState<string[]>([
    'All Companies',
    'TCS NQT',
    'Infosys',
    'Wipro',
    'Accenture',
    'Amazon',
  ]);

  useEffect(() => {
    async function loadCompanies() {
      try {
        const data = await ApiService.getCompanies();
        if (data && data.length > 0) {
          setCompanies(data);
        }
      } catch (e) {
        console.warn('Dynamic companies load error:', e);
      }
    }
    loadCompanies();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.onSurfaceVariant }]}>
        Target Company Filter:
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {companies.map((comp) => {
          const isSelected = selectedCompany === comp;
          return (
            <TouchableOpacity
              key={comp}
              onPress={() => onSelectCompany(comp)}
              style={[
                styles.chip,
                isSelected
                  ? {
                      backgroundColor: colors.secondaryContainer,
                      borderColor: colors.primary,
                      borderWidth: 1,
                    }
                  : {
                      backgroundColor: colors.surfaceContainerLowest,
                      borderColor: colors.outlineVariant,
                      borderWidth: 1,
                    },
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: isSelected ? colors.primary : colors.onSurface },
                ]}
              >
                {comp}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  scrollContent: {
    gap: 8,
    paddingRight: 16,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

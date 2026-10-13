import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search courses, aptitude tests, subjects...',
  onClear,
}) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceContainerLowest,
          borderColor: colors.outlineVariant,
        },
      ]}
    >
      <MaterialIcons name="search" size={20} color={colors.outline} />
      <TextInput
        style={[styles.input, { color: colors.onSurface }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.outline}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={onClear}>
          <MaterialIcons name="cancel" size={18} color={colors.outline} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginVertical: 8,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
});

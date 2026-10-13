import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MindSprintShadows } from '../../constants/mindsprintTheme';
import { useTheme } from '../../context/ThemeContext';

type ToolType = 'highlight' | 'underline' | 'note' | 'copy';
type ColorType = '#fde047' | '#86efac' | '#93c5fd' | '#fca5a5';

interface TextToolsSheetProps {
  onClose?: () => void;
  onSelectColor?: (color: ColorType) => void;
}

export const TextToolsSheet: React.FC<TextToolsSheetProps> = ({
  onClose,
  onSelectColor,
}) => {
  const { colors } = useTheme();
  const [activeTool, setActiveTool] = useState<ToolType>('highlight');
  const [selectedColor, setSelectedColor] = useState<ColorType>('#fde047');

  const paletteColors: ColorType[] = ['#fde047', '#86efac', '#93c5fd', '#fca5a5'];

  const handleColorChange = (color: ColorType) => {
    setSelectedColor(color);
    if (onSelectColor) onSelectColor(color);
  };

  return (
    <View
      style={[
        styles.sheetContainer,
        {
          backgroundColor: colors.surfaceContainerLowest,
          borderColor: colors.outlineVariant,
        },
        MindSprintShadows.bottomSheet,
      ]}
    >
      <View style={[styles.dragHandle, { backgroundColor: colors.outlineVariant }]} />

      {/* Sheet Header */}
      <View style={styles.headerRow}>
        <Text style={[styles.sheetTitle, { color: colors.onSurface }]}>Text Tools</Text>
        {onClose && (
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <MaterialIcons name="close" size={20} color={colors.onSurfaceVariant} />
          </TouchableOpacity>
        )}
      </View>

      {/* Tool Actions Row */}
      <View
        style={[
          styles.toolsRow,
          {
            backgroundColor: colors.surfaceContainerLow,
            borderColor: colors.outlineVariant,
          },
        ]}
      >
        {/* Highlight */}
        <TouchableOpacity
          onPress={() => setActiveTool('highlight')}
          style={[
            styles.toolBtn,
            activeTool === 'highlight' && { backgroundColor: colors.surfaceContainer },
          ]}
        >
          <View style={[styles.colorDot, { backgroundColor: selectedColor }]}>
            {activeTool === 'highlight' && (
              <MaterialIcons name="check" size={12} color="#000000" />
            )}
          </View>
          <Text style={[styles.toolLabel, { color: colors.onSurface }]}>Highlight</Text>
        </TouchableOpacity>

        <View style={[styles.divider, { backgroundColor: colors.outlineVariant }]} />

        {/* Underline */}
        <TouchableOpacity
          onPress={() => setActiveTool('underline')}
          style={[
            styles.toolBtn,
            activeTool === 'underline' && { backgroundColor: colors.surfaceContainer },
          ]}
        >
          <MaterialIcons
            name="format-underlined"
            size={20}
            color={
              activeTool === 'underline'
                ? colors.primary
                : colors.onSurfaceVariant
            }
          />
          <Text style={[styles.toolLabel, { color: colors.onSurface }]}>Underline</Text>
        </TouchableOpacity>

        <View style={[styles.divider, { backgroundColor: colors.outlineVariant }]} />

        {/* Add Note */}
        <TouchableOpacity
          onPress={() => setActiveTool('note')}
          style={[
            styles.toolBtn,
            activeTool === 'note' && { backgroundColor: colors.surfaceContainer },
          ]}
        >
          <MaterialIcons
            name="edit-note"
            size={20}
            color={
              activeTool === 'note'
                ? colors.primary
                : colors.onSurfaceVariant
            }
          />
          <Text style={[styles.toolLabel, { color: colors.onSurface }]}>Add Note</Text>
        </TouchableOpacity>

        <View style={[styles.divider, { backgroundColor: colors.outlineVariant }]} />

        {/* Copy */}
        <TouchableOpacity
          onPress={() => setActiveTool('copy')}
          style={[
            styles.toolBtn,
            activeTool === 'copy' && { backgroundColor: colors.surfaceContainer },
          ]}
        >
          <MaterialIcons
            name="content-copy"
            size={20}
            color={
              activeTool === 'copy'
                ? colors.primary
                : colors.onSurfaceVariant
            }
          />
          <Text style={[styles.toolLabel, { color: colors.onSurface }]}>Copy</Text>
        </TouchableOpacity>
      </View>

      {/* Color Selection Palette */}
      <View style={styles.colorPaletteRow}>
        {paletteColors.map((color) => {
          const isSelected = selectedColor === color;
          return (
            <TouchableOpacity
              key={color}
              onPress={() => handleColorChange(color)}
              style={[
                styles.colorCircle,
                { backgroundColor: color },
                isSelected && { borderWidth: 3, borderColor: colors.primary },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    padding: 16,
  },
  dragHandle: {
    width: 48,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
    opacity: 0.6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sheetTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  closeBtn: {
    padding: 4,
  },
  toolsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 6,
    borderWidth: 1,
  },
  toolBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  colorDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
  divider: {
    width: 1,
    height: 24,
    opacity: 0.3,
  },
  colorPaletteRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 14,
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
});

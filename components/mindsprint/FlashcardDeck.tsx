import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MindSprintShadows } from '../../constants/mindsprintTheme';
import { useTheme } from '../../context/ThemeContext';

type CardItem = {
  id: string;
  category: string;
  frontTitle: string;
  backFormula: string;
  tip: string;
};

const cardsData: CardItem[] = [
  {
    id: '1',
    category: 'Quantitative Aptitude',
    frontTitle: 'Speed, Distance & Time Conversion',
    backFormula: 'Speed = Distance / Time\n1 km/hr = 5/18 m/sec',
    tip: 'Multiply by 5/18 when converting km/h to m/s.',
  },
  {
    id: '2',
    category: 'React JS Technical',
    frontTitle: 'useEffect Dependency Rule',
    backFormula: 'useEffect(() => { ... }, [deps]);',
    tip: 'Always declare all reactive values in the dependency array to avoid stale closures.',
  },
  {
    id: '3',
    category: 'Calculus',
    frontTitle: 'Integration by Parts Formula',
    backFormula: '∫ u dv = u·v - ∫ v du',
    tip: 'Use the ILATE rule to choose u (Inverse, Log, Algebraic, Trig, Exponential).',
  },
  {
    id: '4',
    category: 'Data Structures',
    frontTitle: 'BST Time Complexities',
    backFormula: 'Search: O(log n) avg, O(n) worst\nInsert: O(log n) avg',
    tip: 'Balanced BST height is log(n).',
  },
];

export const FlashcardDeck = () => {
  const { colors } = useTheme();
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});

  const toggleFlip = (id: string) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
        ⚡ Quick Revision Flashcards
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {cardsData.map((card) => {
          const isFlipped = !!flipped[card.id];
          return (
            <TouchableOpacity
              key={card.id}
              activeOpacity={0.9}
              onPress={() => toggleFlip(card.id)}
              style={[
                styles.flashCard,
                MindSprintShadows.card,
                isFlipped
                  ? { backgroundColor: colors.primaryContainer }
                  : {
                      backgroundColor: colors.surfaceContainerLowest,
                      borderWidth: 1,
                      borderColor: colors.outlineVariant,
                    },
              ]}
            >
              <View style={styles.cardHeader}>
                <Text
                  style={[
                    styles.catText,
                    { color: isFlipped ? colors.onPrimaryContainer : colors.primary },
                  ]}
                >
                  {card.category}
                </Text>
                <MaterialIcons
                  name="sync"
                  size={16}
                  color={isFlipped ? colors.onPrimaryContainer : colors.outline}
                />
              </View>

              {!isFlipped ? (
                <View style={styles.cardBody}>
                  <Text style={[styles.frontTitle, { color: colors.onSurface }]}>
                    {card.frontTitle}
                  </Text>
                  <Text style={[styles.tapPrompt, { color: colors.outline }]}>
                    Tap to reveal formula 💡
                  </Text>
                </View>
              ) : (
                <View style={styles.cardBody}>
                  <Text style={styles.backFormula}>{card.backFormula}</Text>
                  <Text style={[styles.tipText, { color: colors.onPrimaryContainer }]}>
                    Tip: {card.tip}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  scrollContent: {
    gap: 14,
    paddingRight: 16,
  },
  flashCard: {
    width: 240,
    height: 140,
    borderRadius: 20,
    padding: 16,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  catText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  cardBody: {
    flex: 1,
    justifyContent: 'center',
  },
  frontTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  tapPrompt: {
    fontSize: 11,
    marginTop: 6,
  },
  backFormula: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  tipText: {
    fontSize: 11,
    marginTop: 6,
  },
});

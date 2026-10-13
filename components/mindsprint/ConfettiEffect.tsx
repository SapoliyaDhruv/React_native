import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CONFETTI_COUNT = 45;
const CONFETTI_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#f43f5e'];

interface ConfettiPieceProps {
  index: number;
}

const ConfettiPiece: React.FC<ConfettiPieceProps> = ({ index }) => {
  const startX = useRef(Math.random() * SCREEN_WIDTH).current;
  const endX = useRef(startX + (Math.random() - 0.5) * 160).current;
  const size = useRef(6 + Math.random() * 8).current;
  const isCircle = useRef(Math.random() > 0.5).current;
  const color = useRef(CONFETTI_COLORS[index % CONFETTI_COLORS.length]).current;
  const duration = useRef(2000 + Math.random() * 1500).current;
  const delay = useRef(Math.random() * 400).current;

  const translateY = useRef(new Animated.Value(-20)).current;
  const translateX = useRef(new Animated.Value(startX)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT * 0.85,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: endX,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(rotate, {
          toValue: 360 * 3,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: duration * 0.9,
          delay: duration * 0.1,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [delay, duration, endX, opacity, rotate, translateX, translateY]);

  const spin = rotate.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.piece,
        {
          width: size,
          height: isCircle ? size : size * 1.5,
          borderRadius: isCircle ? size / 2 : 2,
          backgroundColor: color,
          opacity,
          transform: [
            { translateY },
            { translateX },
            { rotate: spin },
          ],
        },
      ]}
    />
  );
};

export const ConfettiEffect: React.FC = () => {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {Array.from({ length: CONFETTI_COUNT }).map((_, i) => (
        <ConfettiPiece key={i} index={i} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  piece: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CONFETTI_COUNT = 45;
const CONFETTI_COLORS = ['#2F6FD6', '#12805C', '#F4A30B', '#ec4899', '#2F6FD6', '#06b6d4', '#f43f5e'];

interface ConfettiPieceProps {
  index: number;
}

const ConfettiPiece: React.FC<ConfettiPieceProps> = ({ index }) => {
  // Random layout is chosen once per piece (useState initializer runs a single time).
  const [piece] = useState(() => {
    const startX = Math.random() * SCREEN_WIDTH;
    return {
      startX,
      endX: startX + (Math.random() - 0.5) * 160,
      size: 6 + Math.random() * 8,
      isCircle: Math.random() > 0.5,
      color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
      duration: 2000 + Math.random() * 1500,
      delay: Math.random() * 400,
      translateY: new Animated.Value(-20),
      translateX: new Animated.Value(startX),
      rotate: new Animated.Value(0),
      opacity: new Animated.Value(1),
    };
  });
  const { endX, size, isCircle, color, duration, delay, translateY, translateX, rotate, opacity } = piece;

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

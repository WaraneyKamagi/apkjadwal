import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { ThemeMode } from '../../types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const PARTICLE_COUNT = 20;

interface SingleParticleProps {
  index: number;
  themeMode: ThemeMode;
}

const SingleParticle: React.FC<SingleParticleProps> = React.memo(({ index, themeMode }) => {
  const animProgress = useRef(new Animated.Value(0)).current;
  const animTwinkle = useRef(new Animated.Value(0.2)).current;
  const animSway = useRef(new Animated.Value(0)).current;

  // Randomized initial attributes per particle
  const randomX = useRef(Math.random() * SCREEN_WIDTH).current;
  const randomDelay = useRef((index * 150) % 2000).current;
  const randomSize = useRef(themeMode === 'rainy' ? 8 + Math.random() * 8 : 3 + Math.random() * 4).current;

  useEffect(() => {
    animProgress.setValue(0);

    let mainAnim: Animated.CompositeAnimation | null = null;
    let swayAnim: Animated.CompositeAnimation | null = null;
    let twinkleAnim: Animated.CompositeAnimation | null = null;

    if (themeMode === 'rainy') {
      // Rain: falls fast from top to bottom
      mainAnim = Animated.loop(
        Animated.sequence([
          Animated.delay(randomDelay),
          Animated.timing(animProgress, {
            toValue: 1,
            duration: 800 + Math.random() * 600,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      );
      mainAnim.start();
    } else if (themeMode === 'starry') {
      // Stars: slow twinkle and slight floating
      twinkleAnim = Animated.loop(
        Animated.sequence([
          Animated.delay(randomDelay),
          Animated.timing(animTwinkle, {
            toValue: 1,
            duration: 1000 + Math.random() * 1200,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(animTwinkle, {
            toValue: 0.15,
            duration: 1000 + Math.random() * 1200,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      );
      twinkleAnim.start();

      mainAnim = Animated.loop(
        Animated.sequence([
          Animated.timing(animProgress, {
            toValue: 1,
            duration: 4000 + Math.random() * 3000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(animProgress, {
            toValue: 0,
            duration: 4000 + Math.random() * 3000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      );
      mainAnim.start();
    } else if (themeMode === 'windy') {
      // Windy: leaves sweeping from left to right with wave
      mainAnim = Animated.loop(
        Animated.sequence([
          Animated.delay(randomDelay),
          Animated.timing(animProgress, {
            toValue: 1,
            duration: 2200 + Math.random() * 1800,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      );
      mainAnim.start();

      swayAnim = Animated.loop(
        Animated.sequence([
          Animated.timing(animSway, {
            toValue: 1,
            duration: 800 + Math.random() * 600,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(animSway, {
            toValue: -1,
            duration: 800 + Math.random() * 600,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      );
      swayAnim.start();
    } else if (themeMode === 'snow') {
      // Snow: gentle float downward with horizontal sway
      mainAnim = Animated.loop(
        Animated.sequence([
          Animated.delay(randomDelay),
          Animated.timing(animProgress, {
            toValue: 1,
            duration: 3500 + Math.random() * 2500,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      );
      mainAnim.start();

      swayAnim = Animated.loop(
        Animated.sequence([
          Animated.timing(animSway, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(animSway, {
            toValue: -1,
            duration: 1500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      );
      swayAnim.start();
    } else {
      // Default: floating mint spore particles
      mainAnim = Animated.loop(
        Animated.sequence([
          Animated.delay(randomDelay),
          Animated.timing(animProgress, {
            toValue: 1,
            duration: 4000 + Math.random() * 2000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      );
      mainAnim.start();
    }

    return () => {
      mainAnim?.stop();
      swayAnim?.stop();
      twinkleAnim?.stop();
    };
  }, [themeMode, randomDelay]);

  // Styling and transforms based on theme
  if (themeMode === 'rainy') {
    const translateY = animProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [-30, SCREEN_HEIGHT + 30],
    });
    const translateX = animProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [randomX, randomX - 60],
    });

    return (
      <Animated.View
        style={[
          styles.particleBase,
          styles.rainDrop,
          {
            left: 0,
            top: 0,
            height: randomSize,
            transform: [{ translateX }, { translateY }, { rotate: '18deg' }],
            opacity: 0.65,
          },
        ]}
      />
    );
  }

  if (themeMode === 'starry') {
    const randomY = (index * (SCREEN_HEIGHT / PARTICLE_COUNT)) % SCREEN_HEIGHT;
    const translateY = animProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [-4, 4],
    });

    return (
      <Animated.View
        style={[
          styles.particleBase,
          styles.starParticle,
          {
            left: randomX,
            top: randomY,
            width: randomSize,
            height: randomSize,
            opacity: animTwinkle,
            transform: [{ translateY }],
          },
        ]}
      >
        <View style={styles.starCenter} />
      </Animated.View>
    );
  }

  if (themeMode === 'windy') {
    const startY = (index * (SCREEN_HEIGHT / PARTICLE_COUNT)) % (SCREEN_HEIGHT - 60);
    const translateX = animProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [-30, SCREEN_WIDTH + 30],
    });
    const translateY = animSway.interpolate({
      inputRange: [-1, 1],
      outputRange: [startY - 18, startY + 18],
    });
    const rotate = animProgress.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '720deg'],
    });

    const isGoldLeaf = index % 2 === 0;

    return (
      <Animated.View
        style={[
          styles.particleBase,
          isGoldLeaf ? styles.leafGold : styles.leafGreen,
          {
            width: 7,
            height: 5,
            transform: [{ translateX }, { translateY }, { rotate }],
            opacity: 0.75,
          },
        ]}
      />
    );
  }

  if (themeMode === 'snow') {
    const translateY = animProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [-20, SCREEN_HEIGHT + 20],
    });
    const translateX = animSway.interpolate({
      inputRange: [-1, 1],
      outputRange: [randomX - 25, randomX + 25],
    });

    return (
      <Animated.View
        style={[
          styles.particleBase,
          styles.snowFlake,
          {
            width: randomSize,
            height: randomSize,
            transform: [{ translateX }, { translateY }],
            opacity: 0.8,
          },
        ]}
      />
    );
  }

  // Default: gentle rising mint pixels
  const translateY = animProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [SCREEN_HEIGHT + 20, -20],
  });

  return (
    <Animated.View
      style={[
        styles.particleBase,
        styles.defaultSpore,
        {
          left: randomX,
          width: 4,
          height: 4,
          transform: [{ translateY }],
          opacity: 0.5,
        },
      ]}
    />
  );
});

export const WeatherParticles: React.FC = () => {
  const { themeMode, particlesEnabled } = useTheme();

  if (!particlesEnabled) {
    return null;
  }

  return (
    <View style={styles.container} pointerEvents="none">
      {Array.from({ length: PARTICLE_COUNT }).map((_, idx) => (
        <SingleParticle key={`particle-${themeMode}-${idx}`} index={idx} themeMode={themeMode} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    overflow: 'hidden',
  },
  particleBase: {
    position: 'absolute',
  },
  rainDrop: {
    width: 2,
    backgroundColor: '#70C5E8',
    borderRadius: 0,
    shadowColor: '#245B7D',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 0,
  },
  starParticle: {
    backgroundColor: '#FFDE59',
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starCenter: {
    width: '50%',
    height: '50%',
    backgroundColor: '#FFFFFF',
  },
  leafGold: {
    backgroundColor: '#F3C969',
    borderWidth: 1,
    borderColor: '#9E741B',
    borderRadius: 0,
  },
  leafGreen: {
    backgroundColor: '#88D49E',
    borderWidth: 1,
    borderColor: '#1E8E6A',
    borderRadius: 0,
  },
  snowFlake: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#C6DDF1',
    borderRadius: 0,
  },
  defaultSpore: {
    backgroundColor: '#77DB8E',
    borderRadius: 0,
  },
});

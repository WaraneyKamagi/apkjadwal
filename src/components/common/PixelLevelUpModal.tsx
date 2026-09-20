import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Animated,
  Pressable,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { PixelButton } from './PixelButton';

interface PixelLevelUpModalProps {
  visible: boolean;
  newLevel: number;
  onClose: () => void;
}

export const PixelLevelUpModal: React.FC<PixelLevelUpModalProps> = ({
  visible,
  newLevel,
  onClose,
}) => {
  const { colors } = useTheme();

  // Animation values
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.5);
      opacityAnim.setValue(0);
      slideAnim.setValue(50);
    }
  }, [visible, scaleAnim, opacityAnim, slideAnim]);

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }, { translateY: slideAnim }],
            },
          ]}
        >
          {/* Header Banner */}
          <View style={[styles.headerBanner, { backgroundColor: colors.primary, borderBottomColor: colors.border }]}>
            <View style={styles.starsRow}>
              <MaterialIcons name="star" size={16} color="#FFE81F" />
              <MaterialIcons name="star" size={24} color="#FFE81F" />
              <MaterialIcons name="star" size={16} color="#FFE81F" />
            </View>
            <Text style={styles.headerText}>LEVEL UP!</Text>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={[styles.congratsText, { color: colors.onSurface }]}>
              LUAR BIASA!
            </Text>
            <Text style={[styles.subText, { color: colors.onSurfaceVariant }]}>
              Anda telah mencapai tingkat baru dalam produktivitas!
            </Text>

            {/* Level Indicator */}
            <View style={[styles.levelCircle, { borderColor: colors.primary, backgroundColor: colors.surfaceContainer }]}>
              <Text style={[styles.levelLabel, { color: colors.primary }]}>LVL</Text>
              <Text style={[styles.levelNumber, { color: colors.onSurface }]}>{newLevel}</Text>
            </View>

            <View style={styles.buttonContainer}>
              <PixelButton
                title="TERUS BERJUANG!"
                onPress={onClose}
                icon="keyboard-double-arrow-up"
              />
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 15, 25, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 340,
    borderWidth: 3,
    borderRightWidth: 6,
    borderBottomWidth: 6,
    overflow: 'hidden',
  },
  headerBanner: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
    gap: 8,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  headerText: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 2,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  congratsText: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 8,
    textAlign: 'center',
  },
  subText: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  levelCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    borderBottomWidth: 8,
  },
  levelLabel: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: -4,
  },
  levelNumber: {
    fontSize: 42,
    fontWeight: '900',
  },
  buttonContainer: {
    width: '100%',
  },
});

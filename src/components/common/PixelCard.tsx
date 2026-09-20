import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface PixelCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  shadowOffset?: number;
  backgroundColor?: string;
}

export const PixelCard: React.FC<PixelCardProps> = ({
  children,
  style,
  shadowOffset = 3,
  backgroundColor,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.outerContainer, { marginBottom: shadowOffset, marginRight: shadowOffset }]}>
      {/* Hard Pixel Drop Shadow layer */}
      <View
        style={[
          StyleSheet.absoluteFillObject,
          {
            backgroundColor: colors.border,
            top: shadowOffset,
            left: shadowOffset,
          },
        ]}
      />
      {/* Front Card Layer */}
      <View
        style={[
          styles.innerCard,
          {
            borderColor: colors.border,
            backgroundColor: backgroundColor || colors.cardBg,
          },
          style,
        ]}
      >
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    position: 'relative',
  },
  innerCard: {
    borderWidth: 2,
    borderRadius: 0,
    overflow: 'hidden',
  },
});

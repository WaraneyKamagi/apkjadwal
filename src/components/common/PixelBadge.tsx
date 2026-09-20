import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { TaskStatus } from '../../types/task';

interface PixelBadgeProps {
  label: string;
  status?: TaskStatus;
  color?: string;
  textColor?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  showDot?: boolean;
}

export const PixelBadge: React.FC<PixelBadgeProps> = ({
  label,
  status,
  color,
  textColor,
  style,
  textStyle,
  showDot = false,
}) => {
  const { colors } = useTheme();

  let bg = color || colors.surfaceContainer;
  let fg = textColor || colors.onSurfaceVariant;
  let dotColor = colors.primary;

  if (status === 'running') {
    bg = colors.tertiaryFixed;
    fg = colors.onTertiaryFixed;
    dotColor = colors.error;
  } else if (status === 'done') {
    bg = colors.secondaryContainer;
    fg = colors.onSecondaryContainer;
    dotColor = colors.primary;
  } else if (status === 'cancelled') {
    bg = colors.error;
    fg = colors.onError;
    dotColor = colors.onError;
  } else if (status === 'pending') {
    bg = colors.surfaceContainer;
    fg = colors.onSurfaceVariant;
    dotColor = colors.onSurfaceVariant;
  }

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: bg,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      {showDot && (
        <View
          style={[
            styles.dot,
            {
              backgroundColor: dotColor,
            },
          ]}
        />
      )}
      <Text
        style={[
          styles.text,
          {
            color: fg,
          },
          textStyle,
        ]}
      >
        {label.toUpperCase()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderRadius: 0,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    marginRight: 4,
    borderRadius: 0,
  },
  text: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

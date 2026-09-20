import React, { useState } from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

interface PixelButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'surface';
  icon?: keyof typeof MaterialIcons.glyphMap;
  style?: ViewStyle;
  textStyle?: TextStyle;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export const PixelButton: React.FC<PixelButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  icon,
  style,
  textStyle,
  size = 'md',
  disabled = false,
}) => {
  const { colors } = useTheme();
  const [isPressed, setIsPressed] = useState(false);

  let bg = colors.primary;
  let textCol = colors.onPrimary;
  if (variant === 'secondary') {
    bg = colors.secondaryContainer;
    textCol = colors.onSecondaryContainer;
  } else if (variant === 'danger') {
    bg = colors.error;
    textCol = colors.onError;
  } else if (variant === 'surface') {
    bg = colors.surfaceContainerLowest;
    textCol = colors.onSurface;
  }

  const padVertical = size === 'sm' ? 6 : size === 'lg' ? 14 : 10;
  const padHorizontal = size === 'sm' ? 10 : size === 'lg' ? 20 : 14;
  const fontSize = size === 'sm' ? 11 : size === 'lg' ? 15 : 13;

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={[
        styles.outer,
        style,
        { opacity: disabled ? 0.6 : 1 },
      ]}
    >
      {/* Retro 16-bit Hard Shadow */}
      {!isPressed && (
        <View
          style={[
            StyleSheet.absoluteFillObject,
            {
              backgroundColor: colors.border,
              top: 3,
              left: 3,
            },
          ]}
        />
      )}
      {/* Button Surface */}
      <View
        style={[
          styles.buttonBody,
          {
            backgroundColor: bg,
            borderColor: colors.border,
            paddingVertical: padVertical,
            paddingHorizontal: padHorizontal,
            transform: isPressed ? [{ translateX: 3 }, { translateY: 3 }] : [],
          },
        ]}
      >
        {icon && (
          <MaterialIcons
            name={icon}
            size={fontSize + 4}
            color={textCol}
            style={{ marginRight: 6 }}
          />
        )}
        <Text
          style={[
            styles.buttonText,
            {
              color: textCol,
              fontSize,
              fontWeight: '700',
            },
            textStyle,
          ]}
        >
          {title.toUpperCase()}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  outer: {
    position: 'relative',
  },
  buttonBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: 0,
  },
  buttonText: {
    letterSpacing: 0.5,
  },
});

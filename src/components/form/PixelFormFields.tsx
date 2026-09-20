import React from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, TextInputProps } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface PixelTextInputProps extends TextInputProps {
  label: string;
  isRequired?: boolean;
}

export const PixelTextInput: React.FC<PixelTextInputProps> = ({ label, isRequired, style, ...props }) => {
  const { colors } = useTheme();
  return (
    <View style={styles.fieldGroup}>
      <View style={styles.labelRow}>
        <Text style={[styles.pointer, { color: colors.primary }]}>▶</Text>
        <Text style={[styles.fieldLabel, { color: colors.onSurface }]}>{label}</Text>
        {isRequired && <Text style={{ color: colors.error }}>*</Text>}
      </View>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.surfaceContainerLow,
            borderColor: colors.border,
            color: colors.onSurface,
          },
          style,
        ]}
        placeholderTextColor={colors.onSurfaceVariant}
        {...props}
      />
    </View>
  );
};

interface PixelTextAreaProps extends TextInputProps {
  label: string;
  maxLength?: number;
  currentLength?: number;
}

export const PixelTextArea: React.FC<PixelTextAreaProps> = ({ label, maxLength, currentLength, style, ...props }) => {
  const { colors } = useTheme();
  return (
    <View style={styles.fieldGroup}>
      <View style={styles.labelRowBetween}>
        <View style={styles.labelRow}>
          <Text style={[styles.pointer, { color: colors.primary }]}>▶</Text>
          <Text style={[styles.fieldLabel, { color: colors.onSurface }]}>{label}</Text>
        </View>
        {maxLength !== undefined && currentLength !== undefined && (
          <Text style={[styles.charCounter, { color: colors.onSurfaceVariant }]}>
            {currentLength}/{maxLength}
          </Text>
        )}
      </View>
      <TextInput
        style={[
          styles.textArea,
          {
            backgroundColor: colors.surfaceContainerLow,
            borderColor: colors.border,
            color: colors.onSurface,
          },
          style,
        ]}
        placeholderTextColor={colors.onSurfaceVariant}
        multiline
        {...props}
      />
    </View>
  );
};

interface PixelToggleProps {
  label: string;
  subLabel: string;
  value: boolean;
  onToggle: () => void;
}

export const PixelToggle: React.FC<PixelToggleProps> = ({ label, subLabel, value, onToggle }) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.reminderCard, { backgroundColor: colors.surfaceContainerLow, borderColor: colors.border }]}>
      <View>
        <Text style={[styles.fieldLabel, { color: colors.onSurface }]}>{label}</Text>
        <Text style={[styles.reminderSub, { color: colors.onSurfaceVariant }]}>{subLabel}</Text>
      </View>
      <Pressable
        onPress={onToggle}
        style={[
          styles.toggleTrack,
          {
            backgroundColor: value ? colors.primary : colors.surfaceDim,
            borderColor: colors.border,
            alignItems: value ? 'flex-end' : 'flex-start',
          },
        ]}
      >
        <View style={[styles.toggleThumb, { backgroundColor: '#ffffff' }]} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  fieldGroup: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  labelRowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  pointer: {
    fontSize: 10,
    marginRight: 6,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 2,
    padding: 12,
    fontSize: 14,
    fontWeight: '600',
  },
  textArea: {
    borderWidth: 2,
    padding: 12,
    fontSize: 14,
    fontWeight: '500',
    textAlignVertical: 'top',
    minHeight: 80,
  },
  charCounter: {
    fontSize: 10,
    fontWeight: '600',
  },
  reminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 2,
    marginBottom: 24,
  },
  reminderSub: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: '500',
  },
  toggleTrack: {
    width: 44,
    height: 24,
    borderWidth: 2,
    padding: 2,
    justifyContent: 'center',
  },
  toggleThumb: {
    width: 16,
    height: 16,
    borderWidth: 2,
  },
});

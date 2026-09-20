import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface SettingToggleItemProps {
  label: string;
  subLabel: string;
  value: boolean;
  onToggle: () => void;
}

export const SettingToggleItem: React.FC<SettingToggleItemProps> = ({
  label,
  subLabel,
  value,
  onToggle,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.settingRow, { backgroundColor: colors.surfaceContainerLow, borderColor: colors.border }]}>
      <View style={styles.settingTexts}>
        <Text style={[styles.settingLabel, { color: colors.onSurface }]}>
          {label}
        </Text>
        <Text style={[styles.settingSub, { color: colors.onSurfaceVariant }]}>
          {subLabel}
        </Text>
      </View>
      <Pressable
        onPress={onToggle}
        style={[
          styles.switchTrack,
          {
            backgroundColor: value ? colors.primary : colors.surfaceDim,
            borderColor: colors.border,
            alignItems: value ? 'flex-end' : 'flex-start',
          },
        ]}
      >
        <View style={[styles.switchThumb, { backgroundColor: '#ffffff' }]} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderWidth: 1,
  },
  settingTexts: {
    flex: 1,
    marginRight: 8,
  },
  settingLabel: {
    fontSize: 12,
    fontWeight: '800',
  },
  settingSub: {
    fontSize: 10,
    marginTop: 2,
  },
  switchTrack: {
    width: 44,
    height: 24,
    borderWidth: 1.5,
    padding: 2,
    justifyContent: 'center',
  },
  switchThumb: {
    width: 16,
    height: 16,
  },
});

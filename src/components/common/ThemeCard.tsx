import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { ThemeCardData } from '../../constants/themes';
import { PixelCard } from './PixelCard';

interface ThemeCardProps {
  themeItem: ThemeCardData;
  isActive: boolean;
  onApply: (id: ThemeCardData['id']) => void;
}

export const ThemeCard: React.FC<ThemeCardProps> = ({ themeItem, isActive, onApply }) => {
  const { colors } = useTheme();

  return (
    <PixelCard style={styles.themeCard} shadowOffset={3}>
      <View style={styles.themeCardHeader}>
        <View style={styles.themeBadgeRow}>
          <View
            style={[
              styles.themeCodeBadge,
              {
                backgroundColor: themeItem.swatches[0],
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={styles.themeCodeText}>{themeItem.code}</Text>
          </View>
          <Text style={[styles.themeBadgeLabel, { color: colors.onSurfaceVariant }]}>
            {themeItem.badge}
          </Text>
        </View>
        <MaterialIcons name={themeItem.icon} size={22} color={colors.primary} />
      </View>

      {/* Preview Image Banner */}
      <View
        style={[
          styles.imageBannerContainer,
          {
            backgroundColor: themeItem.swatches[0],
            borderColor: colors.border,
          },
        ]}
      >
        <Image
          source={themeItem.image}
          style={styles.themeImage}
          resizeMode="cover"
        />
        <View style={styles.swatchHexBadge}>
          <Text style={styles.swatchHexText}>{themeItem.subtitle}</Text>
        </View>
      </View>

      {/* Details */}
      <Text style={[styles.themeTitle, { color: colors.onSurface }]}>
        {themeItem.title}
      </Text>
      <Text style={[styles.themeDesc, { color: colors.onSurfaceVariant }]}>
        {themeItem.desc}
      </Text>

      {/* Color Swatches Line */}
      <View style={styles.swatchRow}>
        {themeItem.swatches.map((colorHex, idx) => (
          <View
            key={idx}
            style={[
              styles.colorBox,
              {
                backgroundColor: colorHex,
                borderColor: colors.border,
              },
            ]}
          />
        ))}
      </View>

      {/* Select / Applied Button */}
      <Pressable
        onPress={() => onApply(themeItem.id)}
        style={[
          styles.applyBtn,
          {
            backgroundColor: isActive ? colors.primary : colors.secondaryContainer,
            borderColor: colors.border,
          },
        ]}
      >
        <MaterialIcons
          name={isActive ? 'check-circle' : 'palette'}
          size={16}
          color={isActive ? colors.onPrimary : colors.onSecondaryContainer}
        />
        <Text
          style={[
            styles.applyBtnText,
            {
              color: isActive ? colors.onPrimary : colors.onSecondaryContainer,
            },
          ]}
        >
          {isActive ? 'TEMA SEDANG AKTIF' : `PILIH TEMA ${themeItem.id.toUpperCase()}`}
        </Text>
      </Pressable>
    </PixelCard>
  );
};

const styles = StyleSheet.create({
  themeCard: {
    padding: 14,
    gap: 10,
  },
  themeCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  themeBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  themeCodeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
  },
  themeCodeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
  },
  themeBadgeLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  imageBannerContainer: {
    height: 140,
    borderWidth: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  themeImage: {
    width: '100%',
    height: '100%',
  },
  swatchHexBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(10, 15, 25, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  swatchHexText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '700',
  },
  themeTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  themeDesc: {
    fontSize: 12,
    lineHeight: 18,
  },
  swatchRow: {
    flexDirection: 'row',
    gap: 6,
  },
  colorBox: {
    width: 28,
    height: 18,
    borderWidth: 1,
  },
  applyBtn: {
    height: 40,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 4,
  },
  applyBtnText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});

import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { PixelCard } from './PixelCard';

interface PixelAlertModalProps {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const PixelAlertModal: React.FC<PixelAlertModalProps> = ({
  visible,
  title,
  message,
  onClose,
  onConfirm,
  confirmText = 'LANJUTKAN',
  cancelText = 'TUTUP',
}) => {
  const { colors } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <PixelCard style={[styles.card, { borderColor: colors.error }]}>
            {/* Window Header */}
            <View style={[styles.header, { backgroundColor: colors.error }]}>
              <Text style={styles.headerTitle}>{title.toUpperCase()}</Text>
            </View>

            {/* Content */}
            <View style={styles.content}>
              <Text style={[styles.message, { color: colors.onSurface }]}>
                {message}
              </Text>
              {onConfirm ? (
                <View style={styles.btnRow}>
                  <Pressable
                    style={[
                      styles.btn,
                      { backgroundColor: colors.surfaceContainer, borderColor: colors.border },
                    ]}
                    onPress={onClose}
                  >
                    <Text style={[styles.btnText, { color: colors.onSurface }]}>{cancelText}</Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.btn,
                      { backgroundColor: colors.primary, borderColor: colors.border },
                    ]}
                    onPress={() => {
                      onConfirm();
                      onClose();
                    }}
                  >
                    <Text style={[styles.btnText, { color: colors.onPrimary }]}>{confirmText}</Text>
                  </Pressable>
                </View>
              ) : (
                <Pressable
                  style={[
                    styles.btn,
                    { backgroundColor: colors.surfaceContainer, borderColor: colors.border },
                  ]}
                  onPress={onClose}
                >
                  <Text style={[styles.btnText, { color: colors.onSurface }]}>{cancelText}</Text>
                </Pressable>
              )}
            </View>
          </PixelCard>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 320,
  },
  card: {
    padding: 0,
    borderWidth: 2,
    overflow: 'hidden',
  },
  header: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  content: {
    padding: 16,
    alignItems: 'center',
    gap: 16,
  },
  message: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '600',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1.5,
  },
  btnText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});

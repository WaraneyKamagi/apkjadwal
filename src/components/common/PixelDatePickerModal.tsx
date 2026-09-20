import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { PixelCard } from './PixelCard';
import { MonthMatrix } from '../calendar/MonthMatrix';

interface PixelDatePickerModalProps {
  visible: boolean;
  initialDate: string; // YYYY-MM-DD
  onSelect: (date: string) => void;
  onClose: () => void;
}

export const PixelDatePickerModal: React.FC<PixelDatePickerModalProps> = ({
  visible,
  initialDate,
  onSelect,
  onClose,
}) => {
  const { colors } = useTheme();
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<number>(new Date().getMonth());

  useEffect(() => {
    if (visible && initialDate) {
      const [y, m] = initialDate.split('-');
      if (y && m) {
        setYear(parseInt(y, 10));
        setMonth(parseInt(m, 10) - 1);
      }
    }
  }, [visible, initialDate]);

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <PixelCard style={[styles.card, { borderColor: colors.primary }]}>
            {/* Header / Month Navigation */}
            <View style={[styles.header, { backgroundColor: colors.primary }]}>
              <Pressable onPress={handlePrevMonth} style={styles.navBtn}>
                <Text style={styles.navText}>◀</Text>
              </Pressable>
              
              <Text style={styles.headerTitle}>
                {monthNames[month].toUpperCase()} {year}
              </Text>
              
              <Pressable onPress={handleNextMonth} style={styles.navBtn}>
                <Text style={styles.navText}>▶</Text>
              </Pressable>
            </View>

            {/* Calendar Grid */}
            <View style={styles.content}>
              <MonthMatrix
                year={year}
                month={month}
                selectedDate={initialDate}
                onSelectDate={(date) => {
                  onSelect(date);
                  onClose();
                }}
                tasks={[]} // No tasks needed for the date picker
              />

              <Pressable
                style={[
                  styles.closeBtn,
                  { backgroundColor: colors.surfaceContainer, borderColor: colors.border },
                ]}
                onPress={onClose}
              >
                <Text style={[styles.closeBtnText, { color: colors.onSurface }]}>BATAL</Text>
              </Pressable>
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
    padding: 16,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 360,
  },
  card: {
    padding: 0,
    borderWidth: 2,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
  },
  navBtn: {
    padding: 4,
  },
  navText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
  content: {
    padding: 12,
    gap: 12,
  },
  closeBtn: {
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  closeBtnText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});

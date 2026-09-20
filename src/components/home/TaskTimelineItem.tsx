import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { Task, TaskStatus } from '../../types';
import { PixelBadge } from '../common/PixelBadge';
import { PixelCard } from '../common/PixelCard';

interface TaskTimelineItemProps {
  task: Task;
  onUpdateStatus: (id: string, status: TaskStatus) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string, title: string) => void;
}

export const TaskTimelineItem: React.FC<TaskTimelineItemProps> = React.memo(({
  task,
  onUpdateStatus,
  onEdit,
  onDelete,
}) => {
  const { colors } = useTheme();

  const isDone = task.status === 'done';
  const isCancelled = task.status === 'cancelled';
  const isRunning = task.status === 'running';

  let nodeBg = colors.primary;
  let nodeIcon: keyof typeof MaterialIcons.glyphMap = 'radio-button-unchecked';
  let statusLabel = 'MENUNGGU';

  if (isRunning) {
    nodeBg = colors.primary;
    nodeIcon = 'play-arrow';
    statusLabel = 'BERJALAN';
  } else if (isDone) {
    nodeBg = colors.secondary;
    nodeIcon = 'check';
    statusLabel = 'SELESAI';
  } else if (isCancelled) {
    nodeBg = colors.error;
    nodeIcon = 'close';
    statusLabel = 'BATAL';
  }

  return (
    <View style={[styles.wrapper, (isDone || isCancelled) && { opacity: 0.85 }]}>
      {/* Timeline Node Column */}
      <View style={styles.nodeColumn}>
        <View style={[styles.nodeSquare, { backgroundColor: nodeBg, borderColor: colors.border }]}>
          {isRunning ? (
            <View style={[styles.innerPulseSquare, { backgroundColor: colors.tertiaryFixed }]} />
          ) : (
            <MaterialIcons name={nodeIcon} size={14} color={colors.onPrimary} />
          )}
        </View>
        <View style={[styles.railLine, { backgroundColor: colors.secondaryContainer }]} />
      </View>

      {/* Task Content Card */}
      <View style={styles.cardContainer}>
        <PixelCard style={styles.card} shadowOffset={3}>
          {/* Header row: Badges + Time */}
          <View style={styles.topRow}>
            <View style={styles.badgeRow}>
              <PixelBadge
                label={statusLabel}
                status={task.status}
                showDot={isRunning}
              />
              <PixelBadge
                label={task.category}
                color={colors.secondaryContainer}
                textColor={colors.onSecondaryContainer}
              />
            </View>
            <Text style={[styles.timeText, { color: colors.primary }]}>
              {task.startTime} - {task.endTime}
            </Text>
          </View>

          {/* Title */}
          <Text
            style={[
              styles.title,
              { color: colors.onSurface },
              (isDone || isCancelled) && styles.strikeText,
            ]}
          >
            {task.title}
          </Text>

          {/* Description */}
          {task.description ? (
            <Text
              style={[
                styles.description,
                { color: colors.onSurfaceVariant },
                (isDone || isCancelled) && styles.strikeText,
              ]}
            >
              {task.description}
            </Text>
          ) : null}

          {/* Action Row */}
          <View style={[styles.actionRow, { borderTopColor: colors.surfaceContainer }]}>
            <View style={styles.statusButtons}>
              {!isDone && (
                <Pressable
                  onPress={() => onUpdateStatus(task.id, 'done')}
                  style={[styles.miniBtn, { backgroundColor: colors.surfaceContainerLow, borderColor: colors.border }]}
                >
                  <MaterialIcons name="check" size={14} color={colors.primary} />
                  <Text style={[styles.miniBtnText, { color: colors.primary }]}>SELESAI</Text>
                </Pressable>
              )}
              {!isRunning && (
                <Pressable
                  onPress={() => onUpdateStatus(task.id, 'running')}
                  style={[styles.miniBtn, { backgroundColor: colors.surfaceContainerLow, borderColor: colors.border }]}
                >
                  <MaterialIcons name="play-arrow" size={14} color={colors.tertiary} />
                  <Text style={[styles.miniBtnText, { color: colors.tertiary }]}>JALAN</Text>
                </Pressable>
              )}
              {!isCancelled && (
                <Pressable
                  onPress={() => onUpdateStatus(task.id, 'cancelled')}
                  style={[styles.miniBtn, { backgroundColor: colors.surfaceContainerLow, borderColor: colors.border }]}
                >
                  <MaterialIcons name="close" size={14} color={colors.error} />
                  <Text style={[styles.miniBtnText, { color: colors.error }]}>BATAL</Text>
                </Pressable>
              )}
            </View>

            <View style={styles.manageButtons}>
              <Pressable
                onPress={() => onEdit(task.id)}
                style={[styles.iconBtn, { backgroundColor: colors.surfaceContainerLow, borderColor: colors.border }]}
              >
                <MaterialIcons name="edit" size={15} color={colors.onSurface} />
              </Pressable>
              <Pressable
                onPress={() => onDelete(task.id, task.title)}
                style={[styles.iconBtn, { backgroundColor: colors.surfaceContainerLow, borderColor: colors.border }]}
              >
                <MaterialIcons name="delete-outline" size={15} color={colors.error} />
              </Pressable>
            </View>
          </View>
        </PixelCard>
      </View>
    </View>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.task.id === nextProps.task.id &&
    prevProps.task.status === nextProps.task.status &&
    prevProps.task.title === nextProps.task.title &&
    prevProps.task.description === nextProps.task.description &&
    prevProps.task.category === nextProps.task.category &&
    prevProps.task.startTime === nextProps.task.startTime &&
    prevProps.task.endTime === nextProps.task.endTime &&
    prevProps.onUpdateStatus === nextProps.onUpdateStatus &&
    prevProps.onEdit === nextProps.onEdit &&
    prevProps.onDelete === nextProps.onDelete
  );
});
const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  nodeColumn: {
    width: 32,
    alignItems: 'center',
  },
  nodeSquare: {
    width: 24,
    height: 24,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    marginTop: 6,
  },
  innerPulseSquare: {
    width: 10,
    height: 10,
  },
  railLine: {
    width: 3,
    flex: 1,
    marginTop: 2,
  },
  cardContainer: {
    flex: 1,
    marginLeft: 6,
  },
  card: {
    padding: 12,
    gap: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  timeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 20,
  },
  strikeText: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  description: {
    fontSize: 12,
    lineHeight: 17,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    marginTop: 4,
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  miniBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderWidth: 1,
    gap: 3,
  },
  miniBtnText: {
    fontSize: 9,
    fontWeight: '800',
  },
  manageButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  iconBtn: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ReadingStatus, OwnershipStatus } from '../types';
import { useTheme } from '../context/ThemeContext';
import { spacing } from '../styles/designSystem';

interface StatusBadgeProps {
  status: ReadingStatus | null;
  ownership: OwnershipStatus;
  onStatusPress: () => void;
  onOwnershipPress: () => void;
}

export default function StatusBadge({ 
  status, 
  ownership,
  onStatusPress,
  onOwnershipPress
}: StatusBadgeProps) {
  const { theme } = useTheme();

  const getStatusColor = () => {
    switch (status) {
      case 'reading':
        return '#007AFF'; // Blue
      case 'read':
        return '#34C759'; // Green
      case 'wantToRead':
        return '#FFD60A'; // Yellow
      default:
        return theme.textMuted;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'reading':
        return '🔵 Aktuell';
      case 'read':
        return '🟢 Gelesen';
      case 'wantToRead':
        return '🟡 Möchte lesen';
      default:
        return 'Status setzen';
    }
  };

  const getOwnershipIcon = () => {
    switch (ownership) {
      case 'owned':
        return '📥';
      case 'wishlist':
        return '✨';
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.statusBadge,
          { backgroundColor: getStatusColor() }
        ]}
        onPress={onStatusPress}
      >
        <Text style={[styles.statusText, { color: theme.card }]}>
          {getStatusText()}
        </Text>
      </TouchableOpacity>

      {getOwnershipIcon() && (
        <TouchableOpacity
          style={[styles.ownershipBadge, { backgroundColor: theme.card }]}
          onPress={onOwnershipPress}
        >
          <Text style={styles.ownershipText}>
            {getOwnershipIcon()}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  ownershipBadge: {
    padding: spacing.xs,
    borderRadius: 16,
  },
  ownershipText: {
    fontSize: 16,
  },
});

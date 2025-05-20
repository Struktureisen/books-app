import React, { useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { spacing } from '../styles/designSystem';
import { OwnershipStatus, ReadingStatus } from '../types';

interface StatusDropdownProps {
  status: ReadingStatus;
  ownership: OwnershipStatus;
  onStatusChange: (status: ReadingStatus) => void;
  onOwnershipChange: (ownership: OwnershipStatus) => void;
}

export default function StatusDropdown({
  status,
  ownership,
  onStatusChange,
  onOwnershipChange,
}: StatusDropdownProps) {
  const { theme } = useTheme();
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showOwnershipDropdown, setShowOwnershipDropdown] = useState(false);

  const statusOptions: { value: ReadingStatus; label: string; color: string }[] = [
    { value: 'reading', label: '🔵 Aktuell', color: '#007AFF' },
    { value: 'read', label: '🟢 Gelesen', color: '#34C759' },
    { value: 'wantToRead', label: '🟡 Möchte lesen', color: '#FFD60A' },
    { value: 'discovered', label: '⚪ Entdeckt', color: '#8E8E93' },
  ];

  const ownershipOptions: { value: OwnershipStatus; label: string }[] = [
    { value: 'owned', label: '📥 Besitze ich' },
    { value: 'wishlist', label: '✨ Wunschliste' },
  ];

  const getStatusColor = () => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.color : '#8E8E93';
  };

  const getStatusLabel = () => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.label : '⚪ Entdeckt';
  };

  const getOwnershipLabel = () => {
    const option = ownershipOptions.find(opt => opt.value === ownership);
    return option ? option.label : '📚 Besitz';
  };

  return (
    <View style={styles.container}>
      <View style={styles.dropdownRow}>
        <TouchableOpacity
          style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}
          onPress={() => {
            setShowStatusDropdown(!showStatusDropdown);
            setShowOwnershipDropdown(false);
          }}
        >
          <Text style={[styles.badgeText, { color: theme.card }]}>
            {getStatusLabel()}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.ownershipBadge, { backgroundColor: theme.card }]}
          onPress={() => {
            setShowOwnershipDropdown(!showOwnershipDropdown);
            setShowStatusDropdown(false);
          }}
        >
          <Text style={[styles.ownershipText, { color: theme.text }]}>
            {getOwnershipLabel()}
          </Text>
        </TouchableOpacity>
      </View>

      {showStatusDropdown && (
        <View style={[styles.dropdownOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View 
            style={[
              styles.dropdown, 
              { 
                backgroundColor: theme.card,
                borderColor: theme.border,
              }
            ]}
          >
            {statusOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[styles.option, { backgroundColor: option.color }]}
                onPress={() => {
                  onStatusChange(option.value);
                  setShowStatusDropdown(false);
                }}
              >
                <Text style={[styles.optionText, { color: theme.card }]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {showOwnershipDropdown && (
        <View style={[styles.dropdownOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View 
            style={[
              styles.dropdown, 
              { 
                backgroundColor: theme.card,
                borderColor: theme.border,
              }
            ]}
          >
            {ownershipOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[styles.option, { backgroundColor: theme.background }]}
                onPress={() => {
                  onOwnershipChange(option.value);
                  setShowOwnershipDropdown(false);
                }}
              >
                <Text style={[styles.optionText, { color: theme.text }]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1,
  },
  dropdownRow: {
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
  ownershipBadge: {
    padding: spacing.xs,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  ownershipText: {
    fontSize: 16,
  },
  dropdownOverlay: {
    position: 'absolute',
    top: -20,
    left: -20,
    right: -20,
    bottom: -20,
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdown: {
    width: '100%',
    maxWidth: 300,
    borderRadius: 8,
    padding: spacing.sm,
    zIndex: 10000,
    borderWidth: 1,
    ...Platform.select({
      android: {
        elevation: 24,
      },
      ios: {
        zIndex: 1,
      },
      web: {
        zIndex: 1,
      },
    }),
  },
  option: {
    padding: spacing.sm,
    borderRadius: 8,
    marginBottom: spacing.xs,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});

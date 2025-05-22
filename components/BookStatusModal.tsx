import React from 'react';
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { spacing, typography } from '../styles/designSystem';
import { ReadingStatus } from '../types';

interface BookStatusModalProps {
  visible: boolean;
  onClose: () => void;
  onStatusSelect: (status: ReadingStatus) => void;
  onRemove?: () => void;
  currentStatus?: ReadingStatus;
  title: string;
}

export default function BookStatusModal({
  visible,
  onClose,
  onStatusSelect,
  onRemove,
  currentStatus,
  title,
}: BookStatusModalProps) {
  const { theme } = useTheme();

  const renderStatusButton = (status: ReadingStatus, label: string) => (
    <TouchableOpacity
      style={[
        styles.button,
        currentStatus === status && {
          backgroundColor: theme.activeStatus,
          borderWidth: 1,
          borderColor: theme.activeStatus,
        },
      ]}
      onPress={() => onStatusSelect(status)}
      testID={`status-button-${status}`}
    >
      <Text
        style={[
          styles.buttonText,
          { color: theme.text },
          currentStatus === status && { color: theme.text },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      testID="book-status-modal"
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={() => {}}>
          <View
            style={[
              styles.content,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={[styles.title, { color: theme.text }]} testID="modal-title">
              {title}
            </Text>

            {renderStatusButton('reading', 'Aktuell am lesen')}
            {renderStatusButton('read', 'Als gelesen markieren')}
            {renderStatusButton('wantToRead', 'Möchte ich lesen')}

            {currentStatus && onRemove && (
              <TouchableOpacity
                style={[styles.button, styles.removeButton]}
                onPress={onRemove}
                testID="remove-button"
              >
                <Text style={[styles.buttonText, { color: theme.error }]}>Entfernen</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
              testID="cancel-button"
            >
              <Text style={[styles.buttonText, { color: theme.textMuted }]}>Abbrechen</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    width: '80%',
    padding: spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    zIndex: 2,
    ...Platform.select({
      android: { elevation: 5 },
      ios: { zIndex: 1 },
      web: { zIndex: 1 },
    }),
  },
  title: {
    ...typography.h2,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  button: {
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.sm,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  buttonText: {
    ...typography.body1,
    fontWeight: '500',
  },
  removeButton: {
    marginTop: spacing.md,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
  },
  cancelButton: {
    backgroundColor: 'rgba(142, 142, 147, 0.1)',
  },
});

// components/BookDetailModal.tsx
import React from 'react';
import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { BookData } from '../types';

type Props = {
  book: BookData | null;
  visible: boolean;
  onClose: () => void;
  onOpenStatusModal: () => void; // ✅ hinzufügen
};


export default function BookDetailModal({ book, visible, onClose, onOpenStatusModal }: Props) {
  const { theme } = useTheme(); // ✅ Hook direkt hier aufrufen
  if (!book) return null;

  return (
    <Modal
  visible={visible}
  transparent
  animationType="slide"
  onRequestClose={onClose} // für ESC / Android-Back
>
  <TouchableOpacity
    activeOpacity={1}
    onPress={onClose}
    style={styles.overlay}
  >
    <TouchableWithoutFeedback onPress={() => {}}>
      <View style={[styles.modal, { backgroundColor: theme.card }]}>
        <ScrollView>
          {book.imageLinks?.thumbnail ? (
            <Image source={{ uri: book.imageLinks.thumbnail }} style={styles.cover} />
          ) : (
            <View style={styles.coverPlaceholder}>
              <Text style={{ color: theme.textMuted, textAlign: 'center' }}>Kein Cover verfügbar</Text>
            </View>
          )}
          <Text style={[styles.title, { color: theme.text }]}>{book.title}</Text>
          <Text style={[styles.authors, { color: theme.textMuted }]}>{book.authors?.join(', ')}</Text>
          <Text style={[styles.publisher, { color: theme.textMuted }]}>
            {book.publisher}, {book.publishedDate}
          </Text>
          <Text style={[styles.description, { color: theme.text }]}>
            {book.description || 'Keine Beschreibung verfügbar.'}
          </Text>
        </ScrollView>

        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={[styles.closeText, { color: theme.primary }]}>Schließen</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onOpenStatusModal} style={styles.statusButton}>
          <Text style={[styles.statusButtonText, { color: theme.background }]}>Status ändern</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  </TouchableOpacity>
</Modal>


  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modal: {
  borderRadius: 10,
  padding: 20,
  maxHeight: '90%',
},
  cover: {
    width: 100,
    height: 150,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  authors: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 4,
  },
  publisher: {
  fontSize: 14,
  textAlign: 'center',
  marginBottom: 12,
  // color entfernt – kommt nun aus JSX
},

  description: {
    fontSize: 14,
  },
  closeButton: {
    marginTop: 20,
    alignSelf: 'center',
  },
  closeText: {
  fontSize: 16,
  // color entfernt – kommt aus JSX via theme.primary
},

  statusButton: {
  marginTop: 20,
  alignSelf: 'center',
  paddingVertical: 10,
  paddingHorizontal: 20,
  backgroundColor: '#007AFF',
  borderRadius: 8,
},
statusButtonText: {
  fontSize: 16,
  fontWeight: '500',
  // color kommt aus JSX (theme.background)
},
backdrop: {
  ...StyleSheet.absoluteFillObject,
},
coverPlaceholder: {
  width: 100,
  height: 150,
  alignSelf: 'center',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 16,
  backgroundColor: 'rgba(255,255,255,0.1)',
  borderRadius: 8,
}
});

import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BookStatusModal from '../../components/BookStatusModal';
import { useBooks } from '../../context';
import { useTheme } from '../../context/ThemeContext';
import { spacing, typography } from '../../styles/designSystem';
import { BookData, BookWithStatus } from '../../types';

export default function BookDetailsScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useTheme();
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const { currentlyReading, readBooks, wantToReadBooks, recommendations, getBookStatus, removeBook, updateBookStatus, isInWishlist, toggleWishlist } = useBooks();

  // Type guard for id
  const id = typeof params.id === 'string' ? params.id : null;
  if (!id) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.text }]}>Ungültige Buch-ID</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.link, { color: theme.primary }]}>Zurück</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Find the book in all possible locations
  const book = [...currentlyReading, ...readBooks, ...wantToReadBooks, ...recommendations].find(
    (book: BookData | BookWithStatus) => book.id === id
  );

  if (!book) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.text }]}>Buch nicht gefunden</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.link, { color: theme.primary }]}>Zurück</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentStatus = getBookStatus(id) ?? undefined;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Image
          source={{ uri: book.imageLinks?.thumbnail ?? '' }}
          style={styles.coverImage}
          resizeMode="contain"
        />
        <View style={styles.titleContainer}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: theme.text }]}>{book.title}</Text>
            <TouchableOpacity
              style={[
                styles.wishlistButton,
                isInWishlist(id) && { backgroundColor: theme.activeStatus }
              ]}
              onPress={() => toggleWishlist(id)}
            >
              <Text style={[
                styles.wishlistIcon,
                { color: isInWishlist(id) ? theme.text : theme.primary }
              ]}>
                ★
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.author, { color: theme.textMuted }]}>
            {book.authors?.join(', ') || 'Unbekannter Autor'}
          </Text>
          <Text style={[styles.publishInfo, { color: theme.textMuted }]}>
            {[book.publisher, book.publishedDate].filter(Boolean).join(', ') || 'Keine Verlagsinfo verfügbar'}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.primary }]}
          onPress={() => setStatusModalVisible(true)}
        >
          <Text style={[styles.actionButtonText, { color: '#FFFFFF' }]}>
            {currentStatus ? 'Status ändern' : 'Zu Büchern hinzufügen'}
          </Text>
        </TouchableOpacity>
      </View>

      {book.description && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Beschreibung</Text>
          <Text style={[styles.description, { color: theme.text }]}>{book.description}</Text>
        </View>
      )}

      <BookStatusModal
        visible={statusModalVisible}
        title={book.title}
        currentStatus={currentStatus}
        onClose={() => setStatusModalVisible(false)}
        onStatusSelect={(status) => {
          if (status) {
            updateBookStatus(id, status);
            // Remove from wishlist if it was there
            if (isInWishlist(id)) {
              toggleWishlist(id);
            }
          }
          setStatusModalVisible(false);
        }}
        onRemove={() => {
          removeBook(id);
          setStatusModalVisible(false);
          router.back();
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  coverImage: {
    width: 120,
    height: 180,
    borderRadius: 8,
  },
  titleContainer: {
    flex: 1,
    marginLeft: spacing.md,
  },
  title: {
    ...typography.h1,
    marginBottom: spacing.xs,
  },
  author: {
    ...typography.body1,
    marginBottom: spacing.xs,
  },
  publishInfo: {
    ...typography.body2,
  },
  actions: {
    padding: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  actionButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 20,
    minWidth: 200,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    padding: spacing.lg,
  },
  sectionTitle: {
    ...typography.h2,
    marginBottom: spacing.md,
  },
  description: {
    ...typography.body1,
    lineHeight: 24,
  },
  errorText: {
    ...typography.h2,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  link: {
    ...typography.body1,
    textAlign: 'center',
    marginTop: spacing.md,
    textDecorationLine: 'underline',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
    gap: 10,
  },
  wishlistButton: {
    padding: 4,
    borderRadius: 20,
    marginLeft: 8,
  },
  wishlistIcon: {
    fontSize: 20,
  },
});

import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import BookCard from '../../components/BookCard';
import { useBooks } from '../../context';
import { useTheme } from '../../context/ThemeContext';
import { spacing, typography } from '../../styles/designSystem';
import { BookWithStatus } from '../../types';

export default function MyBooksScreen() {
  const { currentlyReading, readBooks, wantToReadBooks } = useBooks();
  const { theme } = useTheme();

  const CategoryHeader = ({ title, color }: { title: string; color: string }) => (
    <View style={styles.categoryHeaderContainer}>
      <View style={[styles.categoryHeader, { backgroundColor: color }]}>
        <Text style={[styles.categoryTitle, { color: theme.card }]}>
          {title}
        </Text>
      </View>
    </View>
  );

  const BookList = ({ books, showOwnership = true }: { books: BookWithStatus[]; showOwnership?: boolean }) => {
    const ownedBooks = books.filter(book => book.ownership === 'owned');
    const wishlistBooks = books.filter(book => book.ownership === 'wishlist');

    return (
      <View style={styles.bookList}>
        {showOwnership && ownedBooks.length > 0 && (
          <View style={styles.ownershipSection}>
            <Text style={[styles.ownershipTitle, { color: theme.text }]}>
              📥 Im Besitz
            </Text>
            <View style={styles.booksGrid}>
              {ownedBooks.map((book) => (
                <View key={book.id} style={styles.bookItem}>
                  <BookCard book={book} horizontal={false} showRemoveButton />
                </View>
              ))}
            </View>
          </View>
        )}
        {showOwnership && wishlistBooks.length > 0 && (
          <View style={styles.ownershipSection}>
            <Text style={[styles.ownershipTitle, { color: theme.text }]}>
              ✨ Wunschliste
            </Text>
            <View style={styles.booksGrid}>
              {wishlistBooks.map((book) => (
                <View key={book.id} style={styles.bookItem}>
                  <BookCard book={book} horizontal={false} showRemoveButton />
                </View>
              ))}
            </View>
          </View>
        )}
        {!showOwnership && (
          <View style={styles.booksGrid}>
            {books.map((book) => (
              <View key={book.id} style={styles.bookItem}>
                <BookCard book={book} horizontal={false} showRemoveButton />
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.section}>
        <CategoryHeader title="Aktuell" color="#007AFF" />
        <BookList books={currentlyReading} showOwnership={false} />
      </View>

      <View style={styles.section}>
        <CategoryHeader title="Gelesen" color="#34C759" />
        <BookList books={readBooks} showOwnership={false} />
      </View>

      <View style={styles.section}>
        <CategoryHeader title="Möchte ich lesen" color="#FFD60A" />
        <BookList books={wantToReadBooks} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  categoryHeaderContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  categoryHeader: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  categoryTitle: {
    ...typography.h2,
    fontSize: 18,
    color: '#FFF',
  },
  bookList: {
    paddingHorizontal: spacing.sm,
  },
  ownershipSection: {
    marginBottom: spacing.lg,
  },
  ownershipTitle: {
    ...typography.h2,
    fontSize: 18,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  booksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
  },
  bookItem: {
    width: '48%',
    marginBottom: spacing.sm,
  },
});

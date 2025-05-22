import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BookDetailModal from '../../components/BookDetailModal';
import BookStatusModal from '../../components/BookStatusModal';
import { useBooks } from '../../context/BooksContext';
import { useTheme } from '../../context/ThemeContext';

export default function HomeScreen() {
  const { theme } = useTheme();
  const { currentlyReading, wantToReadBooks, recommendations, toggleWishlist, isInWishlist, addBook, getBookStatus, removeBook } = useBooks();
  const [selectedBook, setSelectedBook] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Username Section */}
      <View style={styles.header}>
        <Text style={[styles.welcomeText, { color: theme.text }]}>Willkommen zurück,</Text>
        <Text style={[styles.username, { color: theme.text }]}>Benutzer</Text>
      </View>

      {/* Currently Reading Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Aktuell gelesen</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {currentlyReading.map((book) => (
            <View key={book.id} style={styles.recommendationCard}>
              <View style={styles.bookCard}>
                <TouchableOpacity onPress={() => {
                  setSelectedBook(book);
                  setDetailModalVisible(true);
                }}>
                  {book.imageLinks?.thumbnail ? (
                    <Image source={{ uri: book.imageLinks.thumbnail.replace('http://', 'https://') }} style={styles.bookCover} />
                  ) : (
                    <View style={[styles.bookCover, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0' }]}>
                      <Text style={{ color: theme.textMuted }}>No Cover</Text>
                    </View>
                  )}
                </TouchableOpacity>
                <View style={styles.bookInfo}>
                  <Text style={[styles.bookTitle, { color: theme.text }]} numberOfLines={1} ellipsizeMode="tail">{book.title}</Text>
                  <View style={styles.bookFooter}>
                    {book.authors && (
                      <Text style={[styles.bookAuthor, { color: theme.textMuted }]} numberOfLines={1} ellipsizeMode="tail">{book.authors.join(', ')}</Text>
                    )}
                    <TouchableOpacity
                      style={[styles.wishlistButton, { backgroundColor: theme.card }]}
                      onPress={() => book.id && toggleWishlist(book.id)}
                    >
                      <Text style={[styles.wishlistIcon, { color: book.id && isInWishlist(book.id) ? theme.primary : theme.textMuted }]}>★</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Wishlist Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Wunschliste</Text>
          <Link href="/wishlist" asChild>
            <TouchableOpacity style={styles.wishlistButton}>
              <Text style={[styles.wishlistIcon, { color: theme.primary }]}>★</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      {/* Recommendations Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Empfehlungen</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {recommendations.map((book) => (
            <View key={book.id} style={styles.recommendationCard}>
              <View style={styles.bookCard}>
                <TouchableOpacity onPress={() => {
                  setSelectedBook(book);
                  setDetailModalVisible(true);
                }}>
                  {book.imageLinks?.thumbnail ? (
                    <Image source={{ uri: book.imageLinks.thumbnail.replace('http://', 'https://') }} style={styles.bookCover} />
                  ) : (
                    <View style={[styles.bookCover, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0' }]}>
                      <Text style={{ color: theme.textMuted }}>No Cover</Text>
                    </View>
                  )}
                </TouchableOpacity>
                <View style={styles.bookInfo}>
                  <Text style={[styles.bookTitle, { color: theme.text }]} numberOfLines={1} ellipsizeMode="tail">{book.title}</Text>
                  <View style={styles.bookFooter}>
                    {book.authors && (
                      <Text style={[styles.bookAuthor, { color: theme.textMuted }]} numberOfLines={1} ellipsizeMode="tail">{book.authors.join(', ')}</Text>
                    )}
                    <TouchableOpacity
                      style={[styles.wishlistButton, { backgroundColor: theme.card }]}
                      onPress={() => book.id && toggleWishlist(book.id)}
                    >
                      <Text style={[styles.wishlistIcon, { color: book.id && isInWishlist(book.id) ? theme.primary : theme.textMuted }]}>★</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {selectedBook && (
        <BookDetailModal
          book={selectedBook}
          visible={detailModalVisible}
          onClose={() => setDetailModalVisible(false)}
          onOpenStatusModal={() => {
            setDetailModalVisible(false);
            setTimeout(() => setStatusModalVisible(true), 300);
          }}
        />
      )}

      {selectedBook && (
        <BookStatusModal
          visible={statusModalVisible}
          onClose={() => setStatusModalVisible(false)}
          onStatusSelect={(status) => {
            if (!selectedBook?.id) return;
            const enrichedBook = {
              ...selectedBook,
              id: selectedBook.id,
              status,
              ownership: 'owned',
              addedAt: Date.now(),
            };
            addBook(enrichedBook, status);
            setStatusModalVisible(false);
          }}
          onRemove={() => {
            if (selectedBook?.id) removeBook(selectedBook.id);
            setStatusModalVisible(false);
          }}
          currentStatus={getBookStatus(selectedBook.id)}
          title={selectedBook.title}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    marginTop: 8,
  },
  welcomeText: {
    fontSize: 16,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  horizontalScroll: {
    marginLeft: -8,
    paddingBottom: 8,
  },
  bookCard: {
    width: 128,
    marginHorizontal: 8,
    position: 'relative',
  },
  bookCover: {
    width: 128,
    height: 192,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  bookInfo: {
    marginTop: 8,
    height: 64, // Fixed height for consistent layout
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 12,
    flex: 1,
    marginRight: 8,
  },
  bookFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  wishlistButton: {
    padding: 4,
    borderRadius: 12,
    marginLeft: 4,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  wishlistIcon: {
    fontSize: 20,
  },
  recommendationCard: {
    width: 128,
    marginHorizontal: 8,
    marginBottom: 16,
    position: 'relative',
  },
});

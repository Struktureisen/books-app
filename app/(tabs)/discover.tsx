import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import BookCard from '../../components/BookCard';
import BookDetailModal from '../../components/BookDetailModal';
import BookStatusModal from '../../components/BookStatusModal';
import { useBooks } from '../../context';
import { useTheme } from '../../context/ThemeContext';
import { spacing, typography } from '../../styles/designSystem';
import { BookData, ReadingStatus } from '../../types';

export default function DiscoverScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<BookData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();
  const { addBook, getBookStatus, removeBook, toggleWishlist, recommendations, updateBookStatus, isInWishlist } = useBooks();

  const [selectedBook, setSelectedBook] = useState<BookData | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  const searchBooks = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const query = encodeURIComponent(searchQuery.trim());
      const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=20&key=AIzaSyB7x5_v_JM9qEdQ2aNG5Z1rs_nymQnFtOI`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }

      const json = await response.json();

      if (json.items && json.items.length > 0) {
        const books = json.items.map((item: any) => ({
  id: item.id,
  title: item.volumeInfo.title,
  authors: item.volumeInfo.authors,
  description: item.volumeInfo.description,
  imageLinks: item.volumeInfo.imageLinks,
  publishedDate: item.volumeInfo.publishedDate,
  publisher: item.volumeInfo.publisher,
  pageCount: item.volumeInfo.pageCount,
  categories: item.volumeInfo.categories,
  averageRating: item.volumeInfo.averageRating,
  status: undefined,
  ownership: 'wishlist',
  addedAt: Date.now(),
}));


        setSearchResults(books);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookPress = (book: BookData) => {
  setSelectedBook(book);
  setDetailModalVisible(true); // zeigt Detailmodal!
};


  const handleStatusSelect = (status: ReadingStatus) => {
    if (selectedBook) {
      const bookId = selectedBook.id || Date.now().toString();
      const isWishlisted = selectedBook.id ? isInWishlist(selectedBook.id) : false;

      // Create or update the book with the selected status
      const bookWithStatus = {
        ...selectedBook,
        id: bookId,
        status: status,
        ownership: isWishlisted ? 'wishlist' : 'owned',
        addedAt: Date.now()
      };

      // Add or update the book
      addBook(bookWithStatus, status);

      // If the book was in wishlist, maintain its wishlist status
      if (isWishlisted) {
        toggleWishlist(bookId);
      }

      setModalVisible(false);
      setSelectedBook(null);
    }
  };

  const handleRemove = () => {
    if (selectedBook?.id) {
      removeBook(selectedBook.id);
      setModalVisible(false);
      setSelectedBook(null);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.searchInput, { 
            backgroundColor: theme.card,
            color: theme.text,
            borderColor: theme.border
          }]}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Suche nach Titel, Autor oder ISBN"
          placeholderTextColor={theme.textMuted}
          onSubmitEditing={searchBooks}
          returnKeyType="search"
        />
        <TouchableOpacity
          style={[styles.searchButton, { backgroundColor: theme.primary }]}
          onPress={searchBooks}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={theme.background} />
          ) : (
            <Text style={[styles.buttonText, { color: theme.background }]}>Suchen</Text>
          )}
        </TouchableOpacity>
      </View>

      {searchResults.length > 0 ? (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Suchergebnisse</Text>
          <View style={styles.resultsGrid}>
            {searchResults.map((book) => (
              <View key={book.id} style={styles.bookItem}>
                <BookCard
                  book={book}
                  onPress={() => handleBookPress(book)}
                  showWishlistButton={true}
                  horizontal={false}
                />
              </View>
            ))}
          </View>
        </View>
      ) : (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Empfehlungen für dich</Text>
          <View style={styles.resultsGrid}>
            {recommendations.map((book: BookData) => (
              <View key={book.id} style={styles.bookItem}>
                <BookCard
                  book={book}
                  onPress={() => handleBookPress(book)}
                  showWishlistButton={true}
                  horizontal={false}
                />
              </View>
            ))}
          </View>
        </View>
      )}

            {selectedBook && (
        <BookDetailModal
          book={selectedBook}
          visible={detailModalVisible}
          onClose={() => setDetailModalVisible(false)}
          onOpenStatusModal={() => {
            setDetailModalVisible(false);
            setTimeout(() => setModalVisible(true), 300);
          }}
        />
      )}

      {selectedBook && (
        <BookStatusModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onStatusSelect={handleStatusSelect}
          onRemove={selectedBook.id && getBookStatus(selectedBook.id) ? handleRemove : undefined}
          currentStatus={selectedBook.id ? getBookStatus(selectedBook.id) || undefined : undefined}
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
  searchContainer: {
    paddingVertical: spacing.md,
    paddingHorizontal: 10,
    gap: spacing.sm,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    fontSize: 16,
  },
  searchButton: {
    padding: spacing.sm,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  section: {
    paddingTop: spacing.sm,
  },
  sectionTitle: {
    ...typography.h2,
    marginBottom: spacing.md,
    paddingHorizontal: 10,
  },
  resultsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingHorizontal: 5,
    gap: 10,
  },
  bookItem: {
    width: 152,
    margin: 5,
  },
});

import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import BookCard from '../../components/BookCard';
import BookDetailModal from '../../components/BookDetailModal';
import BookStatusModal from '../../components/BookStatusModal';
import { useBooks } from '../../context/BooksContext';
import { useTheme } from '../../context/ThemeContext';
import { BookData, BookWithStatus, ReadingStatus } from '../../types';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<BookData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();
  const { addBook, getBookStatus, removeBook, toggleWishlist } = useBooks();

  const [selectedBook, setSelectedBook] = useState<BookWithStatus | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);

  const searchBooks = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Hinweis', 'Bitte geben Sie einen Suchbegriff ein.');
      return;
    }

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
        const books = json.items.map((item: any): BookData => ({
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
        }));
        setSearchResults(books);
      } else {
        setSearchResults([]);
        Alert.alert('Keine Ergebnisse', 'Es wurden keine Bücher gefunden.');
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      Alert.alert('Fehler', 'Fehler beim Abrufen der Bücher. Bitte versuchen Sie es später erneut.');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookPress = (book: BookData) => {
    const bookId = book.id || Date.now().toString();
    const enrichedBook: BookWithStatus = {
      ...book,
      id: bookId,
      status: 'wantToRead', // ← explizit setzen
  ownership: 'wishlist',
  addedAt: Date.now(),
    };
    setSelectedBook(enrichedBook);
    setDetailModalVisible(true);
    setStatusModalVisible(false); // Ensure status modal is closed
  };

  const handleStatusSelect = (status: ReadingStatus) => {
    if (!selectedBook?.id) return;
    const bookWithStatus: BookWithStatus = {
      ...selectedBook,
      status,
      ownership: 'owned',
      addedAt: Date.now(),
    };
    addBook(bookWithStatus, status);
    setStatusModalVisible(false);
    setDetailModalVisible(false); // Close both modals
  };

  const handleRemove = () => {
    if (selectedBook?.id) {
      removeBook(selectedBook.id);
      setStatusModalVisible(false);
      setDetailModalVisible(false); // Close both modals
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.searchContainer}>
        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: theme.card,
              color: theme.text,
              borderColor: theme.border,
            },
          ]}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Suche nach Titel, Autor oder ISBN"
          placeholderTextColor={theme.textMuted}
          onSubmitEditing={searchBooks}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={[styles.searchButton, { backgroundColor: theme.card }]}
          onPress={searchBooks}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={theme.text} />
          ) : (
            <Text style={[styles.buttonText, { color: theme.text }]}>Suchen</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.resultsContainer}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.resultsContent}
      >
        {searchResults.map((book, index) => (
          <BookCard
            key={book.id || index}
            book={book}
            onPress={() => handleBookPress(book)}
            showWishlistButton={true}
            showStatus={false}
            showActions={false}  // Disable direct status modal opening
          />
        ))}
      </ScrollView>

      <BookDetailModal
        book={selectedBook}
        visible={detailModalVisible}
        onClose={() => {
          setDetailModalVisible(false);
          setSelectedBook(null);
          setStatusModalVisible(false); // Ensure status modal is closed when detail modal is closed
        }}
        onOpenStatusModal={() => {
          setDetailModalVisible(false);
          setTimeout(() => setStatusModalVisible(true), 300);
        }}
      />

      {selectedBook && (
        <BookStatusModal
          visible={statusModalVisible}
          onClose={() => setStatusModalVisible(false)}
          onStatusSelect={handleStatusSelect}
          onRemove={selectedBook.id ? handleRemove : undefined}
          currentStatus={getBookStatus(selectedBook.id) || undefined}
          title={selectedBook.title}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
    fontSize: 16,
  },
  searchButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultsContainer: {
    flex: 1,
  },
  resultsContent: {
    paddingBottom: 16,
  },
});

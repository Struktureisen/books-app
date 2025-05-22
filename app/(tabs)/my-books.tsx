// Optimierte Version von my-books.tsx
import React, { useMemo, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import BookCard from '../../components/BookCard';
import BookDetailModal from '../../components/BookDetailModal';
import BookStatusModal from '../../components/BookStatusModal';
import { useBooks } from '../../context';
import { useTheme } from '../../context/ThemeContext';
import { spacing, typography } from '../../styles/designSystem';
import { BookWithStatus, ReadingStatus } from '../../types';

const FILTER_OPTIONS = ['Alle', 'Genre', 'Autor', 'Titel', 'Release Datum'] as const;
const SORT_OPTIONS = ['A-Z', 'Z-A'] as const;

export default function MyBooksScreen() {
  // 📁 HOOKS & CONTEXT
  const { currentlyReading, readBooks, wantToReadBooks, wishlistBooks, addBook, getBookStatus, removeBook } = useBooks();
  const { theme } = useTheme();
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = 160;
  const numColumns = Math.floor(screenWidth / cardWidth);

  // 📁 STATE
  const [filterType, setFilterType] = useState<typeof FILTER_OPTIONS[number]>('Alle');
  const [filterValue, setFilterValue] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<typeof SORT_OPTIONS[number]>('A-Z');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filterValueModalVisible, setFilterValueModalVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState<BookWithStatus | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);

  // 📁 HANDLER
  const handleStatusSelect = (status: ReadingStatus) => {
    if (!selectedBook) return;
    const bookWithStatus = {
      ...selectedBook,
      status,
      ownership: 'owned',
      addedAt: Date.now(),
    };
    addBook(bookWithStatus, status);
    setStatusModalVisible(false);
  };

  const handleRemove = () => {
    if (!selectedBook?.id) return;
    removeBook(selectedBook.id);
    setStatusModalVisible(false);
  };

  const getFilterValues = () => {
    switch (filterType) {
      case 'Genre': return Array.from(new Set(allBooks.flatMap(b => b.categories || []))).sort();
      case 'Autor': return Array.from(new Set(allBooks.flatMap(b => b.authors || []))).sort();
      case 'Titel': return Array.from(new Set(allBooks.map(b => b.title))).sort();
      case 'Release Datum': return Array.from(new Set(allBooks.map(b => b.publishedDate?.substring(0, 4)))).sort();
      default: return [];
    }
  };

  const filterBooks = (books: BookWithStatus[]) => {
    if (filterType === 'Alle' || !filterValue) return books;
    return books.filter(book => {
      switch (filterType) {
        case 'Genre': return book.categories?.includes(filterValue) ?? false;
        case 'Autor': return book.authors?.includes(filterValue) ?? false;
        case 'Titel': return book.title === filterValue;
        case 'Release Datum': return book.publishedDate?.startsWith(filterValue) ?? false;
        default: return true;
      }
    });
  };

  const sortBooks = (books: BookWithStatus[]) => {
    return [...books].sort((a, b) => {
      const getVal = (book: BookWithStatus) => {
        switch (filterType) {
          case 'Genre': return book.categories?.[0] ?? '';
          case 'Autor': return book.authors?.[0] ?? '';
          case 'Titel': return book.title;
          case 'Release Datum': return book.publishedDate ?? '';
          default: return book.title;
        }
      };
      return sortOrder === 'A-Z'
        ? getVal(a).localeCompare(getVal(b))
        : getVal(b).localeCompare(getVal(a));
    });
  };

  // 📁 DATENBERECHNUNG
  const allBooks = [...currentlyReading, ...readBooks, ...wantToReadBooks];
  const filteredCurrentlyReading = useMemo(() => sortBooks(filterBooks(currentlyReading)), [currentlyReading, filterType, filterValue, sortOrder]);
  const filteredReadBooks = useMemo(() => sortBooks(filterBooks(readBooks)), [readBooks, filterType, filterValue, sortOrder]);
  const filteredWantToReadBooks = useMemo(() => sortBooks(filterBooks(wantToReadBooks)), [wantToReadBooks, filterType, filterValue, sortOrder]);
  const filteredWishlistBooks = useMemo(() => sortBooks(filterBooks(wishlistBooks)), [wishlistBooks, filterType, filterValue, sortOrder]);

  const categories = [
    { title: 'Aktuell', books: filteredCurrentlyReading, color: '#007AFF' },
    { title: 'Möchte ich lesen', books: filteredWantToReadBooks, color: '#FFD60A' },
    { title: 'Wunschliste', books: filteredWishlistBooks, color: '#FF2D55' },
    { title: 'Gelesen', books: filteredReadBooks, color: '#34C759' },
  ];

  const renderBooks = (books: BookWithStatus[]) => (
    <View style={styles.bookGrid}>
      {books.map((book) => (
        <View key={book.id} style={styles.bookItem}>
          <BookCard
            book={book}
            onPress={() => {
              setSelectedBook(book);
              setDetailModalVisible(true);
            }}
            showRemoveButton
          />
        </View>
      ))}
    </View>
  );

  // 📦 UI
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.screenTitle, { color: theme.text }]}>Meine Bibliothek</Text>
        <View style={styles.filterContainer}>
          <TouchableOpacity style={[styles.filterButton, { backgroundColor: theme.card }]} onPress={() => setFilterModalVisible(true)}>
            <Text style={[styles.filterButtonText, { color: theme.text }]}>Filter: {filterType}{filterValue ? ` - ${filterValue}` : ''}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.filterButton, { backgroundColor: theme.card }]} onPress={() => setSortOrder(sortOrder === 'A-Z' ? 'Z-A' : 'A-Z')}>
            <Text style={[styles.filterButtonText, { color: theme.text }]}>Sort: {sortOrder}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollArea} showsVerticalScrollIndicator>
        <View style={styles.categoryRow}>
          {categories.map(({ title, books, color }) => (
            <View key={title} style={styles.categoryColumn}>
              <View style={styles.categoryHeader}>
                <View style={[styles.categoryStripe, { backgroundColor: color }]} />
                <Text style={[styles.categoryTitle, { color: theme.text }]}>{title}</Text>
              </View>
              {renderBooks(books)}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* 📦 Modale */}
      <BookDetailModal
        book={selectedBook}
        visible={detailModalVisible}
        onClose={() => setDetailModalVisible(false)}
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

      <Modal visible={filterModalVisible} transparent animationType="fade" onRequestClose={() => setFilterModalVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setFilterModalVisible(false)}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            {FILTER_OPTIONS.map(option => (
              <TouchableOpacity key={option} style={styles.modalOption} onPress={() => {
                setFilterType(option);
                setFilterValue(null);
                setFilterModalVisible(false);
                if (option !== 'Alle') setFilterValueModalVisible(true);
              }}>
                <Text style={[styles.modalOptionText, { color: theme.text }]}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal visible={filterValueModalVisible} transparent animationType="fade" onRequestClose={() => setFilterValueModalVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setFilterValueModalVisible(false)}>
          <View style={[styles.modalContent, { backgroundColor: theme.card, maxHeight: '70%' }]}>
            <FlatList
              data={getFilterValues()}
              renderItem={({ item }) => {
  const isActive = filterValue === item;
  return (
    <TouchableOpacity
      style={[
        styles.modalOption,
        { backgroundColor: isActive ? theme.primary : 'transparent' }
      ]}
      onPress={() => {
        setFilterValue(item);
        setFilterValueModalVisible(false);
      }}
    >
      <Text
        style={[
          styles.modalOptionText,
          {
            color: isActive ? theme.background : theme.text,
            fontWeight: isActive ? 'bold' : 'normal',
          },
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );
}}

            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

// 📦 STYLES wie gehabt – nicht verändert


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  screenTitle: {
    ...typography.h1,
    fontSize: 24,
    fontWeight: 'bold',
  },
  filterContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  filterButton: {
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  filterButtonText: {
    fontSize: 14,
  },
  scrollArea: {
    padding: spacing.md,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  categoryColumn: {
    flex: 1,
    padding: spacing.sm,
    borderRadius: 12,
    backgroundColor: '#1f1f1f',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  categoryTitle: {
    ...typography.h2,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  bookItem: {
  flexBasis: '25%',      // 4 Karten pro Zeile bei voller Breite
  maxWidth: 160,         // max. Card-Breite
  marginBottom: spacing.md,
  marginRight: spacing.sm,
},

  bookGrid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'flex-start',
  columnGap: spacing.md,  // horizontaler Abstand
  rowGap: spacing.lg,     // vertikaler Abstand
},


  bookRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  bookListContainer: {
    paddingTop: spacing.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 250,
    borderRadius: 8,
    paddingVertical: spacing.md,
  },
  modalOption: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  modalOptionText: {
    fontSize: 16,
  },
  categoryHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: spacing.sm,
},
categoryStripe: {
  width: 6,
  height: 24,
  borderRadius: 3,
  marginRight: spacing.sm,
},
});

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import BookScanner from '../../components/BookScanner';

type Book = {
  title: string;
  authors?: string[];
  description?: string;
  imageLinks?: {
    thumbnail: string;
  };
  publishedDate?: string;
  publisher?: string;
  pageCount?: number;
  categories?: string[];
  averageRating?: number;
};

export default function HomeScreen() {
  const { theme } = useTheme();
  const [isScannerVisible, setScannerVisible] = useState(false);
  const [currentlyReading, setCurrentlyReading] = useState<Book[]>([]);

  const handleBookScanned = (bookData: Book) => {
    setCurrentlyReading([bookData, ...currentlyReading]);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <TouchableOpacity
        style={[styles.scanButton, { backgroundColor: theme.card }]}
        onPress={() => setScannerVisible(true)}
      >
        <Text style={[styles.scanButtonText, { color: theme.text }]}>📚 Buch scannen</Text>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Aktuell gelesen</Text>
        {currentlyReading.length > 0 ? (
          currentlyReading.map((book, index) => (
            <View 
              key={index} 
              style={[styles.bookItem, { 
                backgroundColor: theme.card,
                borderColor: theme.border 
              }]}
            >
              <Text style={[styles.bookTitle, { color: theme.text }]}>{book.title}</Text>
              {book.authors && (
                <Text style={[styles.bookAuthor, { color: theme.textMuted }]}>
                  {book.authors.join(', ')}
                </Text>
              )}
            </View>
          ))
        ) : (
          <Text style={[styles.emptyText, { color: theme.textMuted }]}>
            Keine Bücher vorhanden
          </Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Wunschliste</Text>
        <Text style={[styles.emptyText, { color: theme.textMuted }]}>
          Keine Bücher in der Wunschliste
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Empfehlungen</Text>
        <Text style={[styles.emptyText, { color: theme.textMuted }]}>
          Keine Empfehlungen verfügbar
        </Text>
      </View>

      <BookScanner
        isVisible={isScannerVisible}
        onClose={() => setScannerVisible(false)}
        onBookScanned={handleBookScanned}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scanButton: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  scanButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  bookItem: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    padding: 20,
    fontSize: 16,
  },
});

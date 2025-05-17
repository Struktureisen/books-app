import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';

type BookData = {
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

interface BookCardProps {
  book: BookData;
  onPress?: () => void;
}

export default function BookCard({ book, onPress }: BookCardProps) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: theme.card }]}
      onPress={onPress}
    >
      {book.imageLinks?.thumbnail && (
        <Image
          source={{ uri: book.imageLinks.thumbnail }}
          style={styles.cover}
          resizeMode="cover"
        />
      )}
      <View style={styles.info}>
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
          {book.title}
        </Text>
        {book.authors && (
          <Text style={[styles.author, { color: theme.text }]} numberOfLines={1}>
            {book.authors.join(', ')}
          </Text>
        )}
        {book.publishedDate && (
          <Text style={[styles.details, { color: theme.textMuted }]}>
            {book.publishedDate}
          </Text>
        )}
        {book.publisher && (
          <Text style={[styles.details, { color: theme.textMuted }]}>
            {book.publisher}
          </Text>
        )}
        {book.description && (
          <Text style={[styles.description, { color: theme.text }]} numberOfLines={3}>
            {book.description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cover: {
    width: 100,
    height: 150,
    borderRadius: 4,
  },
  info: {
    flex: 1,
    marginLeft: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  author: {
    fontSize: 16,
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    marginTop: 8,
  },
});

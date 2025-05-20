import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import BookCard from '../components/BookCard';
import { useBooks } from '../context/BooksContext';
import { useTheme } from '../context/ThemeContext';

export default function WishlistScreen() {
  const { theme } = useTheme();
  const { wishlistBooks } = useBooks();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen 
        options={{
          title: 'Wunschliste',
          headerStyle: { backgroundColor: theme.card },
          headerTintColor: theme.text,
        }} 
      />
      
      {wishlistBooks.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: theme.textMuted }]}>
            Keine Bücher in der Wunschliste
          </Text>
        </View>
      ) : (
        <FlatList
          data={wishlistBooks}
          renderItem={({ item }) => (
            <BookCard
              book={item}
              onPress={() => router.push(`/book/${item.id}`)}
              showWishlistButton={true}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

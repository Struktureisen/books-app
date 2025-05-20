import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useBooks } from '../context/BooksContext';
import { mockRecommendations, testHorizontalScroll, testBookStatusChanges, testWishlistPersistence } from '../utils/testUtils';
import { BookData } from '../types';

export default function TestComponent() {
  const {
    updateBookStatus,
    toggleWishlist,
    isBookWishlisted,
    recommendations,
    currentlyReading
  } = useBooks();

  const [testResults, setTestResults] = useState<string[]>([]);
  const horizontalScrollViewRef = React.useRef<ScrollView>(null);

  useEffect(() => {
    const runTests = async () => {
      // Test 1: Google Books API Integration
      try {
        if (recommendations.length > 0) {
          setTestResults(prev => [...prev, '✅ Recommendations fetched successfully']);
        } else {
          setTestResults(prev => [...prev, '❌ No recommendations fetched']);
        }
      } catch (err) {
        const error = err as Error;
        setTestResults(prev => [...prev, `❌ Recommendations error: ${error.message}`]);
      }

      // Test 2: Horizontal Scroll
      try {
        if (horizontalScrollViewRef.current) {
          const scrollResult = await testHorizontalScroll(horizontalScrollViewRef.current);
          if (scrollResult) {
            setTestResults(prev => [...prev, '✅ Horizontal scroll working']);
          }
        }
      } catch (err) {
        const error = err as Error;
        setTestResults(prev => [...prev, `❌ Horizontal scroll error: ${error.message}`]);
      }

      // Test 3: Book Status Changes
      try {
        const testBook: BookData = mockRecommendations[0];
        const statusResults = await testBookStatusChanges(testBook, updateBookStatus);
        if (statusResults.length === 3) {
          setTestResults(prev => [...prev, '✅ Book status changes working']);
        }
      } catch (err) {
        const error = err as Error;
        setTestResults(prev => [...prev, `❌ Book status error: ${error.message}`]);
      }

      // Test 4: Wishlist Persistence
      try {
        const testBook: BookData = mockRecommendations[1];
        const wishlistResult = await testWishlistPersistence(
          toggleWishlist,
          toggleWishlist,
          isBookWishlisted,
          testBook
        );
        if (wishlistResult.addedSuccessfully && wishlistResult.removedSuccessfully) {
          setTestResults(prev => [...prev, '✅ Wishlist functionality working']);
        }
      } catch (err) {
        const error = err as Error;
        setTestResults(prev => [...prev, `❌ Wishlist error: ${error.message}`]);
      }
    };

    runTests();
  }, [recommendations, updateBookStatus, toggleWishlist, isBookWishlisted]);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Test Results:</Text>
      {testResults.map((result, index) => (
        <Text key={index} style={{ marginBottom: 5 }}>{result}</Text>
      ))}
      
      <ScrollView
        ref={horizontalScrollViewRef}
        horizontal
        style={{ height: 200, marginTop: 20 }}
      >
        {currentlyReading.map((book) => (
          <View key={book.id} style={{ width: 150, marginRight: 10 }}>
            <Text>{book.title}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Aktuell gelesen</Text>
        <View style={styles.bookList}>
          {/* Book items will go here */}
          <Text style={styles.emptyText}>Keine Bücher vorhanden</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Wunschliste</Text>
        <View style={styles.bookList}>
          {/* Wishlist items will go here */}
          <Text style={styles.emptyText}>Keine Bücher in der Wunschliste</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Empfehlungen</Text>
        <View style={styles.bookList}>
          {/* Recommendations will go here */}
          <Text style={styles.emptyText}>Keine Empfehlungen verfügbar</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
  },
  bookList: {
    marginTop: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 8,
    marginBottom: 8,
  },
});

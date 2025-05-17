import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Suche nach Büchern, Autoren..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      <ScrollView style={styles.resultsContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suchergebnisse</Text>
          {/* Search results will go here */}
          <Text style={styles.emptyText}>
            {searchQuery ? 'Keine Ergebnisse gefunden' : 'Geben Sie einen Suchbegriff ein'}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
  },
  resultsContainer: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
});

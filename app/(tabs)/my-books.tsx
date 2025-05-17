import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export default function MyBooksScreen() {
  const { theme } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.section, { borderBottomColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Aktuell gelesen</Text>
        <View style={styles.bookList}>
          {/* Currently reading books will go here */}
          <Text style={[styles.emptyText, { color: theme.textMuted }]}>Keine Bücher vorhanden</Text>
        </View>
      </View>

      <View style={[styles.section, { borderBottomColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Gelesen</Text>
        <View style={styles.bookList}>
          {/* Read books will go here */}
          <Text style={[styles.emptyText, { color: theme.textMuted }]}>Keine gelesenen Bücher</Text>
        </View>
      </View>

      <View style={[styles.section, { borderBottomColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Möchte ich lesen</Text>
        <View style={styles.bookList}>
          {/* Want to read books will go here */}
          <Text style={[styles.emptyText, { color: theme.textMuted }]}>Keine Bücher in der Wunschliste</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  bookList: {
    marginTop: 8,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
});

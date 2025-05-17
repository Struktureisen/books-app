import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

export default function CommunityScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Lesegruppen</Text>
        <View style={styles.groupList}>
          {/* Reading groups will go here */}
          <Text style={styles.emptyText}>Keine Lesegruppen verfügbar</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Buchempfehlungen</Text>
        <View style={styles.recommendationList}>
          {/* Book recommendations will go here */}
          <Text style={styles.emptyText}>Keine Empfehlungen verfügbar</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Diskussionen</Text>
        <View style={styles.discussionList}>
          {/* Discussions will go here */}
          <Text style={styles.emptyText}>Keine aktiven Diskussionen</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Leseherausforderungen</Text>
        <View style={styles.challengeList}>
          {/* Reading challenges will go here */}
          <Text style={styles.emptyText}>Keine aktiven Herausforderungen</Text>
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
  groupList: {
    marginTop: 8,
  },
  recommendationList: {
    marginTop: 8,
  },
  discussionList: {
    marginTop: 8,
  },
  challengeList: {
    marginTop: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 8,
    marginBottom: 8,
  },
});

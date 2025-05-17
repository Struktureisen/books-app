import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export default function CommunityScreen() {
  const { theme } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.section, { borderBottomColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Lesegruppen</Text>
        <View style={styles.groupList}>
          {/* Reading groups will go here */}
          <Text style={[styles.emptyText, { color: theme.textMuted }]}>Keine Lesegruppen verfügbar</Text>
        </View>
      </View>

      <View style={[styles.section, { borderBottomColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Buchempfehlungen</Text>
        <View style={styles.recommendationList}>
          {/* Book recommendations will go here */}
          <Text style={[styles.emptyText, { color: theme.textMuted }]}>Keine Empfehlungen verfügbar</Text>
        </View>
      </View>

      <View style={[styles.section, { borderBottomColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Diskussionen</Text>
        <View style={styles.discussionList}>
          {/* Discussions will go here */}
          <Text style={[styles.emptyText, { color: theme.textMuted }]}>Keine aktiven Diskussionen</Text>
        </View>
      </View>

      <View style={[styles.section, { borderBottomColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Leseherausforderungen</Text>
        <View style={styles.challengeList}>
          {/* Reading challenges will go here */}
          <Text style={[styles.emptyText, { color: theme.textMuted }]}>Keine aktiven Herausforderungen</Text>
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
    marginTop: 8,
    marginBottom: 8,
  },
});

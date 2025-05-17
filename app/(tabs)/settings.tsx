import React from 'react';
import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';

export default function SettingsScreen() {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [notifications, setNotifications] = React.useState(true);
  const [readingGoals, setReadingGoals] = React.useState(true);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Darstellung</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Dunkler Modus</Text>
          <Switch
            value={isDarkMode}
            onValueChange={setIsDarkMode}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Benachrichtigungen</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Push-Benachrichtigungen</Text>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Leseziele</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Leseziel-Erinnerungen</Text>
          <Switch
            value={readingGoals}
            onValueChange={setReadingGoals}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App-Information</Text>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Version</Text>
          <Text style={styles.infoValue}>1.0.0</Text>
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
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 16,
    color: '#333',
  },
  infoValue: {
    fontSize: 16,
    color: '#666',
  },
});

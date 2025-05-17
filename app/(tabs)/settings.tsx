import React from 'react';
import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export default function SettingsScreen() {
  const { isDarkMode, toggleDarkMode, theme } = useTheme();
  const [notifications, setNotifications] = React.useState(true);
  const [readingGoals, setReadingGoals] = React.useState(true);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.section, { borderBottomColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Darstellung</Text>
        <View style={styles.settingItem}>
          <Text style={[styles.settingLabel, { color: theme.text }]}>Dunkler Modus</Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleDarkMode}
          />
        </View>
      </View>

      <View style={[styles.section, { borderBottomColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Benachrichtigungen</Text>
        <View style={styles.settingItem}>
          <Text style={[styles.settingLabel, { color: theme.text }]}>Push-Benachrichtigungen</Text>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
          />
        </View>
      </View>

      <View style={[styles.section, { borderBottomColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Leseziele</Text>
        <View style={styles.settingItem}>
          <Text style={[styles.settingLabel, { color: theme.text }]}>Leseziel-Erinnerungen</Text>
          <Switch
            value={readingGoals}
            onValueChange={setReadingGoals}
          />
        </View>
      </View>

      <View style={[styles.section, { borderBottomColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>App-Information</Text>
        <View style={styles.infoItem}>
          <Text style={[styles.infoLabel, { color: theme.text }]}>Version</Text>
          <Text style={[styles.infoValue, { color: theme.text }]}>1.0.0</Text>
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
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingLabel: {
    fontSize: 16,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 16,
  },
  infoValue: {
    fontSize: 16,
  },
});

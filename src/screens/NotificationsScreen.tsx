import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function NotificationsScreen() {
  const { theme, isDark, toggleTheme } = useTheme();

  const [pushEnabled, setPushEnabled] = useState(true);
  const [dailyReminder, setDailyReminder] = useState(true);
  const [budgetAlerts, setBudgetAlerts] = useState(true);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: theme.text }]}>Notifications & Preferences</Text>

        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>App Appearance</Text>
          <View style={[styles.optionRow, { borderBottomColor: theme.border }]}>
            <View>
              <Text style={[styles.optionTitle, { color: theme.text }]}>Dark Mode</Text>
              <Text style={[styles.optionSub, { color: theme.subText }]}>
                {isDark ? 'Dark theme active' : 'Light theme active'}
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#CBD5E1', true: theme.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Alerts & Notifications</Text>

          <View style={[styles.optionRow, { borderBottomColor: theme.border }]}>
            <View>
              <Text style={[styles.optionTitle, { color: theme.text }]}>Push Notifications</Text>
              <Text style={[styles.optionSub, { color: theme.subText }]}>Receive instant app alerts</Text>
            </View>
            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              trackColor={{ false: '#CBD5E1', true: theme.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={[styles.optionRow, { borderBottomColor: theme.border }]}>
            <View>
              <Text style={[styles.optionTitle, { color: theme.text }]}>Daily Reminders</Text>
              <Text style={[styles.optionSub, { color: theme.subText }]}>Remind to log expenses at 8 PM</Text>
            </View>
            <Switch
              value={dailyReminder}
              onValueChange={setDailyReminder}
              trackColor={{ false: '#CBD5E1', true: theme.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.optionRowLast}>
            <View>
              <Text style={[styles.optionTitle, { color: theme.text }]}>Budget Alerts</Text>
              <Text style={[styles.optionSub, { color: theme.subText }]}>Notify when hitting 80% limit</Text>
            </View>
            <Switch
              value={budgetAlerts}
              onValueChange={setBudgetAlerts}
              trackColor={{ false: '#CBD5E1', true: theme.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20 },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 20 },
  card: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    marginBottom: 20,
  },
  sectionTitle: { fontSize: 16, fontWeight: '800', marginVertical: 12 },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  optionRowLast: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  optionTitle: { fontSize: 15, fontWeight: '600' },
  optionSub: { fontSize: 12, marginTop: 2 },
});
import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { Colors } from '../../constants/Colors';

export const NotificationScreen = () => {
  const notifications = [
    { id: '1', title: '🔥 Streak Maintained!', body: 'Great job logging your daily transactions today.', time: '2h ago' },
    { id: '2', title: '💡 Saving Tip', body: 'Set a daily saving target in Savings Tab to earn +50 XP.', time: '1d ago' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={Colors.background} barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.headerTitle}>Notifications</Text>

        {notifications.map((n) => (
          <View key={n.id} style={styles.notifCard}>
            <Text style={styles.title}>{n.title}</Text>
            <Text style={styles.body}>{n.body}</Text>
            <Text style={styles.time}>{n.time}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary, marginBottom: 20 },
  notifCard: { backgroundColor: Colors.cardBackground, padding: 16, borderRadius: 14, borderWidth: 1, borderColor: Colors.border, marginBottom: 12 },
  title: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  body: { fontSize: 13, color: Colors.textSecondary, marginBottom: 8 },
  time: { fontSize: 11, color: Colors.textMuted },
});
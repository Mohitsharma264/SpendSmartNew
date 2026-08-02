import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Switch, TouchableOpacity, StatusBar } from 'react-native';
import { Colors } from '../../constants/Colors';

export const SettingsScreen = ({ navigation }: any) => {
  const [notifications, setNotifications] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={Colors.background} barStyle="dark-content" />
      <View style={styles.content}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>App Settings</Text>

        <View style={styles.settingRow}>
          <Text style={styles.rowText}>Push Notifications</Text>
          <Switch value={notifications} onValueChange={setNotifications} trackColor={{ true: Colors.primary }} />
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.rowText}>Default Currency</Text>
          <Text style={styles.valText}>INR (₹)</Text>
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.rowText}>App Version</Text>
          <Text style={styles.valText}>1.0.0 Pro</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20 },
  backBtn: { fontSize: 14, fontWeight: '700', color: Colors.primary, marginBottom: 20 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary, marginBottom: 20 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.cardBackground, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, marginBottom: 12 },
  rowText: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  valText: { fontSize: 14, color: Colors.textMuted, fontWeight: '600' },
});
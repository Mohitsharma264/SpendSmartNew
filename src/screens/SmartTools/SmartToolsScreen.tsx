import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useTheme } from '../../context/ThemeContext';

type SmartToolsNavProp = NativeStackNavigationProp<RootStackParamList>;

export default function SmartToolsScreen() {
  const navigation = useNavigation<SmartToolsNavProp>();
  const { theme } = useTheme();

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Smart Tools 🛠️</Text>
      <Text style={[styles.subtitle, { color: theme.subText }]}>
        Automate and streamline your expense tracking.
      </Text>

      <TouchableOpacity
        style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
        onPress={() => navigation.navigate('ReceiptScan' as any)}
      >
        <Text style={styles.cardIcon}>📸</Text>
        <View style={styles.cardTextContainer}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Receipt Scanner</Text>
          <Text style={[styles.cardDescription, { color: theme.subText }]}>
            Extract and log transactions directly from receipt images.
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
        onPress={() => navigation.navigate('MessageScan' as any)}
      >
        <Text style={styles.cardIcon}>💬</Text>
        <View style={styles.cardTextContainer}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>SMS & Message Parser</Text>
          <Text style={[styles.cardDescription, { color: theme.subText }]}>
            Paste bank SMS to automatically extract transaction details.
          </Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 6 },
  subtitle: { fontSize: 14, marginBottom: 20 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    elevation: 2,
    marginBottom: 16,
  },
  cardIcon: { fontSize: 32, marginRight: 16 },
  cardTextContainer: { flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
  cardDescription: { fontSize: 13 },
});
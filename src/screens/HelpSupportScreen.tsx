import React, { useContext } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function HelpSupportScreen() {
  const { user } = useContext(AuthContext);
  const { theme } = useTheme();

  const supportEmail = 'support@spendsmart.com';

  const handleEmailSupport = () => {
    Linking.openURL(`mailto:${supportEmail}?subject=Support Request from ${user?.name || 'User'}`);
  };

  const handleFAQ = (question: string, answer: string) => {
    Alert.alert(question, answer);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: theme.text }]}>Help & Support</Text>

        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Account Details</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>👤</Text>
            <View>
              <Text style={[styles.infoLabel, { color: theme.subText }]}>Logged In As</Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>{user?.email || 'user@gmail.com'}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Contact Support</Text>
          <TouchableOpacity style={styles.infoRow} onPress={handleEmailSupport}>
            <Text style={styles.infoIcon}>✉️</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.infoLabel, { color: theme.subText }]}>Email Support</Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>{supportEmail}</Text>
            </View>
            <Text style={[styles.arrow, { color: theme.subText }]}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Frequently Asked Questions</Text>

          <TouchableOpacity
            style={[styles.faqItem, { borderBottomColor: theme.border }]}
            onPress={() =>
              handleFAQ(
                'How are expenses logged?',
                'Expenses can be logged automatically via SMS parser, smart receipt scanning, or manually through the + button on the Home screen.'
              )
            }
          >
            <Text style={[styles.question, { color: theme.text }]}>Q: How are expenses logged?</Text>
            <Text style={[styles.arrow, { color: theme.subText }]}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.faqItem, { borderBottomColor: theme.border }]}
            onPress={() =>
              handleFAQ(
                'Where is my financial data stored?',
                'All transaction records are safely stored on secure MongoDB servers linked to your account.'
              )
            }
          >
            <Text style={[styles.question, { color: theme.text }]}>Q: Where is my data saved?</Text>
            <Text style={[styles.arrow, { color: theme.subText }]}>›</Text>
          </TouchableOpacity>
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
    padding: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  sectionTitle: { fontSize: 16, fontWeight: '800', marginBottom: 14 },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoIcon: { fontSize: 22, marginRight: 14 },
  infoLabel: { fontSize: 12 },
  infoValue: { fontSize: 15, fontWeight: '700', marginTop: 2 },
  faqItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  question: { fontSize: 14, fontWeight: '600', flex: 1 },
  arrow: { fontSize: 20, fontWeight: '600' },
});
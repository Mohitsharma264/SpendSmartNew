import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  ScrollView,
} from 'react-native';
// @ts-ignore
import SmsAndroid from 'react-native-get-sms-android';
import { Colors } from '../../constants/Colors';

interface Transaction {
  id: string;
  merchant: string;
  amount: string;
  date: string;
  rawText: string;
}

export default function MessageScanScreen() {
  const [loading, setLoading] = useState(false);
  const [pastedText, setPastedText] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const parseSmsBody = (body: string, id: string): Transaction | null => {
    const isSpam = /win|won|congratulations|congrats|claim|lottery|reward|lucky|http|https|bit\.ly|tinyurl|click/i.test(body);
    if (isSpam) {
      return null;
    }

    const isTransaction = /debited|spent|paid|vpa|transferred/i.test(body);
    if (!isTransaction) {
      return null;
    }

    const amountMatch =
      body.match(/(?:RS|INR|₹)\s?([\d,]+(?:\.\d+)?)/i) ||
      body.match(/([\d,]+(?:\.\d+)?)\s?(?:RS|INR|₹)/i);

    if (!amountMatch) {
      return null;
    }

    const amount = `₹${amountMatch[1]}`;

    let merchant = 'General Expense';
    if (/swiggy/i.test(body)) merchant = 'Swiggy';
    else if (/zomato/i.test(body)) merchant = 'Zomato';
    else if (/amazon/i.test(body)) merchant = 'Amazon';
    else if (/uber/i.test(body)) merchant = 'Uber';
    else if (/flipkart/i.test(body)) merchant = 'Flipkart';
    else if (/paytm/i.test(body)) merchant = 'Paytm';
    else if (/phonepe/i.test(body)) merchant = 'PhonePe';

    return {
      id,
      merchant,
      amount,
      date: new Date().toLocaleDateString(),
      rawText: body,
    };
  };

  const handleParsePastedSMS = () => {
    if (!pastedText.trim()) {
      Alert.alert('Error', 'Please paste an SMS text first.');
      return;
    }

    const parsed = parseSmsBody(pastedText, Date.now().toString());

    if (!parsed) {
      Alert.alert('Invalid or Spam SMS', 'Could not detect a valid transaction or the message was flagged as spam.');
      return;
    }

    setTransactions((prev) => [parsed, ...prev]);
    setPastedText('');
    Alert.alert('Success', 'SMS parsed successfully!');
  };

  const handleScanSMS = async () => {
    setLoading(true);

    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_SMS,
          {
            title: 'SMS Permission Required',
            message: 'SpendSmart needs access to read your inbox to detect bank transactions.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          setLoading(false);
          Alert.alert('Permission Denied', 'Cannot scan SMS without permission.');
          return;
        }

        const filter = {
          box: 'inbox',
          maxCount: 30,
        };

        SmsAndroid.list(
          JSON.stringify(filter),
          (fail: string) => {
            setLoading(false);
            Alert.alert('Error', 'Failed to fetch SMS messages from inbox.');
          },
          (count: number, smsList: string) => {
            try {
              const parsedList = JSON.parse(smsList);
              const detected: Transaction[] = [];

              parsedList.forEach((item: any) => {
                const parsed = parseSmsBody(item.body, item._id ? item._id.toString() : Math.random().toString());
                if (parsed) {
                  detected.push(parsed);
                }
              });

              setTransactions(detected);
              setLoading(false);

              if (detected.length > 0) {
                Alert.alert('Scan Complete', `Found ${detected.length} valid transaction messages!`);
              } else {
                Alert.alert('Scan Complete', 'No financial transaction SMS found in inbox.');
              }
            } catch (err) {
              setLoading(false);
              Alert.alert('Error', 'Failed to parse device SMS data.');
            }
          }
        );
      } catch (err) {
        setLoading(false);
        console.warn(err);
      }
    } else {
      setLoading(false);
      Alert.alert('Not Supported', 'Inbox SMS reading is only supported on Android devices.');
    }
  };

  const handleSaveTransaction = (item: Transaction) => {
    Alert.alert('Saved', `Expense of ${item.amount} at ${item.merchant} logged successfully!`);
    setTransactions((prev) => prev.filter((t) => t.id !== item.id));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>SMS Parser 💬</Text>
      <Text style={styles.subtitle}>
        Paste an SMS manually or auto-scan your inbox to extract expenses safely.
      </Text>

      <View style={styles.pasteCard}>
        <Text style={styles.cardHeaderTitle}>Option 1: Paste Single SMS</Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={4}
          placeholder="Paste transaction SMS message here..."
          placeholderTextColor="#94A3B8"
          value={pastedText}
          onChangeText={setPastedText}
        />
        <TouchableOpacity style={styles.pasteBtn} onPress={handleParsePastedSMS}>
          <Text style={styles.pasteBtnText}>Parse Pasted Message</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.dividerLine} />
      </View>

      <View style={styles.autoScanCard}>
        <Text style={styles.cardHeaderTitle}>Option 2: Auto Scan Device Inbox</Text>
        <TouchableOpacity style={styles.scanBtn} onPress={handleScanSMS} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.scanBtnText}>🔍 Scan All Inbox SMS</Text>
          )}
        </TouchableOpacity>
      </View>

      {transactions.length > 0 && (
        <View style={styles.resultsContainer}>
          <Text style={styles.sectionHeader}>Detected Transactions ({transactions.length})</Text>
          {transactions.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.merchant}>{item.merchant}</Text>
                <Text style={styles.amount}>{item.amount}</Text>
              </View>
              <Text style={styles.rawText} numberOfLines={2}>
                {item.rawText}
              </Text>
              <View style={styles.cardFooter}>
                <Text style={styles.date}>{item.date}</Text>
                <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={() => handleSaveTransaction(item)}
                >
                  <Text style={styles.saveBtnText}>Save Expense</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: Colors.background || '#F8FAFC' },
  title: { fontSize: 24, fontWeight: '800', color: Colors.textPrimary || '#0F172A', marginBottom: 4 },
  subtitle: { fontSize: 14, color: Colors.textSecondary || '#64748B', marginBottom: 20, lineHeight: 20 },
  pasteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
  },
  cardHeaderTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A', marginBottom: 10 },
  textArea: {
    height: 90,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    padding: 10,
    fontSize: 13,
    textAlignVertical: 'top',
    backgroundColor: '#F8FAFC',
    color: '#0F172A',
    marginBottom: 12,
  },
  pasteBtn: {
    backgroundColor: Colors.primary || '#007AFF',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  pasteBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#CBD5E1' },
  dividerText: { marginHorizontal: 12, color: '#94A3B8', fontWeight: '700', fontSize: 12 },
  autoScanCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
  },
  scanBtn: {
    backgroundColor: '#0F172A',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  scanBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 15 },
  resultsContainer: { marginTop: 24 },
  sectionHeader: { fontSize: 16, fontWeight: '700', color: '#1E293B', marginBottom: 12 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  merchant: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  amount: { fontSize: 16, fontWeight: '800', color: '#EF4444' },
  rawText: { fontSize: 12, color: '#64748B', marginBottom: 12, lineHeight: 16 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  date: { fontSize: 12, color: '#94A3B8' },
  saveBtn: { backgroundColor: '#10B981', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  saveBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
});
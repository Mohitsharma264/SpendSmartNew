import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { useApp } from '../../context/AppContext';

export const AddExpenseScreen = ({ navigation }: any) => {
  const { addTransaction } = useApp();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [category, setCategory] = useState('General');
  const [paymentMode, setPaymentMode] = useState('UPI');

  const categories = ['General', 'Food', 'Shopping', 'Bills', 'Transport', 'Entertainment', 'Salary', 'Freelance'];
  const paymentModes = ['UPI', 'Card', 'Cash', 'Net Banking'];

  const handleSubmit = async () => {
    const parsedAmount = parseFloat(amount);

    if (!title.trim()) {
      Alert.alert('Validation Error', 'Please enter a transaction title');
      return;
    }

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid amount');
      return;
    }

    const todayDate = new Date().toISOString().split('T')[0];

    await addTransaction({
      title: title.trim(),
      amount: parsedAmount,
      type,
      category,
      paymentMode,
      date: todayDate,
    });

    Alert.alert('Success 🎉', `${type === 'income' ? 'Income' : 'Expense'} added successfully!`);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={Colors.background} barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Transaction</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[styles.typeBtn, type === 'expense' && styles.activeExpenseBtn]}
            onPress={() => setType('expense')}
          >
            <Text style={[styles.typeBtnText, type === 'expense' && styles.activeTypeBtnText]}>
              ↑ Expense
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.typeBtn, type === 'income' && styles.activeIncomeBtn]}
            onPress={() => setType('income')}
          >
            <Text style={[styles.typeBtnText, type === 'income' && styles.activeTypeBtnText]}>
              ↓ Income
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Title / Note</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Grocery Shopping, Salary"
            placeholderTextColor={Colors.textMuted}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Amount (₹)</Text>
          <TextInput
            style={styles.input}
            placeholder="0.00"
            placeholderTextColor={Colors.textMuted}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.chip, category === cat && styles.activeChip]}
                onPress={() => setCategory(cat)}
              >
                <Text style={[styles.chipText, category === cat && styles.activeChipText]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Payment Mode</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
            {paymentModes.map((mode) => (
              <TouchableOpacity
                key={mode}
                style={[styles.chip, paymentMode === mode && styles.activeChip]}
                onPress={() => setPaymentMode(mode)}
              >
                <Text style={[styles.chipText, paymentMode === mode && styles.activeChipText]}>
                  {mode}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.85}>
          <Text style={styles.submitBtnText}>Save Transaction</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddExpenseScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  backButton: { fontSize: 16, fontWeight: '700', color: Colors.primary },
  headerTitle: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary },
  typeSelector: { flexDirection: 'row', backgroundColor: Colors.cardBackground, borderRadius: 14, padding: 4, marginBottom: 20, borderWidth: 1, borderColor: Colors.border },
  typeBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 10 },
  activeExpenseBtn: { backgroundColor: Colors.expense },
  activeIncomeBtn: { backgroundColor: Colors.income },
  typeBtnText: { fontSize: 14, fontWeight: '700', color: Colors.textSecondary },
  activeTypeBtnText: { color: Colors.white },
  formGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, marginBottom: 8 },
  input: { backgroundColor: Colors.cardBackground, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: Colors.textPrimary },
  chipRow: { flexDirection: 'row', marginTop: 4 },
  chip: { backgroundColor: Colors.cardBackground, borderWidth: 1, borderColor: Colors.border, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, marginRight: 10 },
  activeChip: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  activeChipText: { color: Colors.white },
  submitBtn: { backgroundColor: Colors.primary, paddingVertical: 16, borderRadius: 14, alignItems: 'center', marginTop: 12, elevation: 2 },
  submitBtnText: { fontSize: 16, fontWeight: '700', color: Colors.white },
});
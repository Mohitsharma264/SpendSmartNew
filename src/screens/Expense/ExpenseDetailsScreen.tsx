import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Colors } from '../../constants/Colors';

export const ExpenseDetailsScreen = ({ route, navigation }: any) => {
  const transaction = route?.params?.transaction || {
    title: 'Sample Expense',
    amount: 0,
    type: 'expense',
    category: 'General',
    paymentMode: 'UPI',
    date: '2026-07-27',
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={Colors.background} barStyle="dark-content" />
      <View style={styles.content}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Transaction Details</Text>

        <View style={styles.detailsCard}>
          <Text style={styles.icon}>{transaction.type === 'income' ? '💵' : '🛒'}</Text>
          <Text style={styles.title}>{transaction.title}</Text>
          <Text style={transaction.type === 'income' ? styles.incomeAmount : styles.expenseAmount}>
            {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
          </Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Type</Text>
            <Text style={styles.infoValue}>{transaction.type.toUpperCase()}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Category</Text>
            <Text style={styles.infoValue}>{transaction.category}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Payment Mode</Text>
            <Text style={styles.infoValue}>{transaction.paymentMode}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date</Text>
            <Text style={styles.infoValue}>{transaction.date}</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ExpenseDetailsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20 },
  backBtn: { fontSize: 16, fontWeight: '700', color: Colors.primary, marginBottom: 20 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary, marginBottom: 20 },
  detailsCard: { backgroundColor: Colors.cardBackground, borderRadius: 16, padding: 24, borderWidth: 1, borderColor: Colors.border, alignItems: 'center' },
  icon: { fontSize: 48, marginBottom: 12 },
  title: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary, marginBottom: 8 },
  expenseAmount: { fontSize: 28, fontWeight: '800', color: Colors.expense, marginBottom: 24 },
  incomeAmount: { fontSize: 28, fontWeight: '800', color: Colors.income, marginBottom: 24 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  infoLabel: { fontSize: 14, color: Colors.textMuted, fontWeight: '600' },
  infoValue: { fontSize: 14, color: Colors.textPrimary, fontWeight: '700' },
});
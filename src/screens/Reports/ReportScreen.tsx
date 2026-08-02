import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useApp } from '../../context/AppContext';

export const ReportScreen = () => {
  const { totalIncome, totalExpense, transactions } = useApp();

  const categoryTotals: { [key: string]: number } = {};
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={Colors.background} barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.headerTitle}>Financial Reports</Text>

        <View style={styles.summaryCard}>
          <View style={styles.summaryBox}>
            <Text style={styles.sumLabel}>Income</Text>
            <Text style={styles.incomeVal}>+₹{totalIncome.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryBox}>
            <Text style={styles.sumLabel}>Expenses</Text>
            <Text style={styles.expenseVal}>-₹{totalExpense.toLocaleString('en-IN')}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Expense Category Breakdown</Text>

        {Object.keys(categoryTotals).length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No expense records found to generate breakdown.</Text>
          </View>
        ) : (
          Object.keys(categoryTotals).map((cat) => (
            <View key={cat} style={styles.categoryRow}>
              <Text style={styles.catName}>{cat}</Text>
              <Text style={styles.catAmount}>₹{categoryTotals[cat].toLocaleString('en-IN')}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReportScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { padding: 20 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary, marginBottom: 20 },
  summaryCard: { flexDirection: 'row', backgroundColor: Colors.cardBackground, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: Colors.border, marginBottom: 24 },
  summaryBox: { flex: 1, alignItems: 'center' },
  divider: { width: 1, height: '100%', backgroundColor: Colors.border },
  sumLabel: { fontSize: 12, color: Colors.textMuted, marginBottom: 4 },
  incomeVal: { fontSize: 18, fontWeight: '800', color: Colors.income },
  expenseVal: { fontSize: 18, fontWeight: '800', color: Colors.expense },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginBottom: 12 },
  emptyCard: { backgroundColor: Colors.cardBackground, padding: 20, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, alignItems: 'center' },
  emptyText: { fontSize: 13, color: Colors.textMuted },
  categoryRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: Colors.cardBackground, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, marginBottom: 10 },
  catName: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  catAmount: { fontSize: 14, fontWeight: '800', color: Colors.expense },
});
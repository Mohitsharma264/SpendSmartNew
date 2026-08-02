import React, { useState, useMemo } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';

export const AnalyticsScreen = () => {
  const { transactions } = useApp();
  const { theme } = useTheme();
  const [typeFilter, setTypeFilter] = useState<'expense' | 'income'>('expense');
  const [timeFilter, setTimeFilter] = useState<'WEEK' | 'MONTH' | 'YEAR'>('MONTH');

  const filteredTransactions = useMemo(() => {
    return (transactions || []).filter((t: any) => t.type === typeFilter);
  }, [transactions, typeFilter]);

  const categoryTotals = useMemo(() => {
    const map: { [key: string]: number } = {};
    filteredTransactions.forEach((t: any) => {
      const cat = t.category || 'Other';
      map[cat] = (map[cat] || 0) + Number(t.amount);
    });
    return map;
  }, [filteredTransactions]);

  const totalAmount = useMemo(() => {
    return Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);
  }, [categoryTotals]);

  const weeklyData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const totals = [0, 0, 0, 0, 0, 0, 0];

    (transactions || [])
      .filter((t: any) => t.type === typeFilter)
      .forEach((t: any) => {
        if (t.date) {
          const d = new Date(t.date);
          const dayIdx = (d.getDay() + 6) % 7;
          if (!isNaN(dayIdx)) {
            totals[dayIdx] += Number(t.amount);
          }
        }
      });

    const max = Math.max(...totals, 100);
    return days.map((day, idx) => ({
      day,
      amount: totals[idx],
      heightPercentage: totals[idx] > 0 ? Math.min((totals[idx] / max) * 100, 100) : 0,
    }));
  }, [transactions, typeFilter]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Analytics & Insights 📊</Text>
        <Text style={[styles.headerSubtitle, { color: theme.subText }]}>Visual breakdown of spending & income</Text>

        <View style={[styles.timeFilterContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
          {(['WEEK', 'MONTH', 'YEAR'] as const).map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.timeBtn,
                timeFilter === filter && { backgroundColor: theme.primary },
              ]}
              onPress={() => setTimeFilter(filter)}
            >
              <Text style={[styles.timeBtnText, { color: timeFilter === filter ? '#FFF' : theme.subText }]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>Category Breakdown</Text>
            <View style={[styles.toggleRow, { backgroundColor: theme.inputBg }]}>
              <TouchableOpacity
                style={[styles.toggleBtn, typeFilter === 'expense' && styles.toggleBtnExpense]}
                onPress={() => setTypeFilter('expense')}
              >
                <Text style={[styles.toggleText, typeFilter === 'expense' && styles.toggleTextActive]}>
                  Expense
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleBtn, typeFilter === 'income' && styles.toggleBtnIncome]}
                onPress={() => setTypeFilter('income')}
              >
                <Text style={[styles.toggleText, typeFilter === 'income' && styles.toggleTextActive]}>
                  Income
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.donutContainer, { borderColor: theme.primary }]}>
            <View style={styles.donutCenter}>
              <Text style={[styles.donutLabel, { color: theme.subText }]}>
                Total {typeFilter === 'expense' ? 'Spent' : 'Earned'}
              </Text>
              <Text style={[styles.donutValue, { color: theme.text }]}>₹{totalAmount.toLocaleString('en-IN')}</Text>
            </View>
          </View>

          <View style={styles.categoryList}>
            {Object.keys(categoryTotals).length === 0 ? (
              <Text style={[styles.emptyText, { color: theme.subText }]}>
                No {typeFilter} records found for this period.
              </Text>
            ) : (
              Object.entries(categoryTotals).map(([cat, amount]) => {
                const percentage = totalAmount > 0 ? ((amount / totalAmount) * 100).toFixed(1) : '0';
                return (
                  <View key={cat} style={[styles.categoryRow, { borderBottomColor: theme.border }]}>
                    <Text style={[styles.categoryName, { color: theme.text }]}>{cat}</Text>
                    <Text style={[styles.categoryAmount, { color: theme.subText }]}>
                      ₹{amount.toLocaleString('en-IN')} ({percentage}%)
                    </Text>
                  </View>
                );
              })
            )}
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            Weekly {typeFilter === 'expense' ? 'Expense' : 'Income'} Trend
          </Text>
          <View style={styles.barChartContainer}>
            {weeklyData.map((item) => (
              <View key={item.day} style={styles.barColumn}>
                <Text style={[styles.barAmountText, { color: theme.subText }]}>
                  {item.amount > 0 ? `₹${item.amount}` : ''}
                </Text>
                <View style={[styles.barTrack, { backgroundColor: theme.inputBg }]}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: `${Math.max(item.heightPercentage, item.amount > 0 ? 12 : 0)}%`,
                        backgroundColor: typeFilter === 'income' ? '#10B981' : theme.primary,
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.barLabel, { color: theme.subText }]}>{item.day}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AnalyticsScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 90 },
  headerTitle: { fontSize: 22, fontWeight: '800' },
  headerSubtitle: { fontSize: 13, marginBottom: 16 },
  timeFilterContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
  },
  timeBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  timeBtnText: { fontWeight: '700', fontSize: 12 },
  card: {
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: { fontSize: 16, fontWeight: '800' },
  toggleRow: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 2,
  },
  toggleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  toggleBtnExpense: { backgroundColor: '#EF4444' },
  toggleBtnIncome: { backgroundColor: '#10B981' },
  toggleText: { fontSize: 11, fontWeight: '700', color: '#6B7280' },
  toggleTextActive: { color: '#FFF' },
  donutContainer: {
    height: 140,
    width: 140,
    borderRadius: 70,
    borderWidth: 14,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
  },
  donutCenter: { alignItems: 'center' },
  donutLabel: { fontSize: 10, fontWeight: '600' },
  donutValue: { fontSize: 16, fontWeight: '800', marginTop: 2 },
  categoryList: { marginTop: 12 },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  categoryName: { fontSize: 14, fontWeight: '600' },
  categoryAmount: { fontSize: 14, fontWeight: '700' },
  emptyText: { textAlign: 'center', paddingVertical: 10, fontSize: 13 },
  barChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 170,
    marginTop: 10,
    paddingHorizontal: 5,
  },
  barColumn: { alignItems: 'center', flex: 1 },
  barAmountText: { fontSize: 9, fontWeight: '700', marginBottom: 4, height: 12 },
  barTrack: {
    height: 110,
    width: 18,
    borderRadius: 9,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: { width: '100%', borderRadius: 9 },
  barLabel: { fontSize: 11, fontWeight: '700', marginTop: 8 },
});
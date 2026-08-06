import React, { useState, useContext, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApp } from '../../context/AppContext';
import { AuthContext } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import AddTransactionModal from '../../components/AddTransactionModal';

const API_URL = 'https://spendsmart-app-test.loca.lt/api';

export const HomeScreen = ({ navigation }: any) => {
  const { userName, transactions, deleteTransaction, setTransactions } = useApp() as any;
  const { user, setUser } = useContext(AuthContext) as any;
  const { theme, isDark } = useTheme();
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;

        const response = await fetch(`${API_URL}/auth/initial-data`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok) {
          if (data.user && setUser) {
            setUser(data.user);
          }
          if (data.transactions && setTransactions) {
            setTransactions(data.transactions);
          }
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    fetchInitialData();
  }, []);

  const displayName = user?.name || userName || 'User';

  const totalIncome = (transactions || [])
    .filter((t: any) => t.type === 'income')
    .reduce((sum: number, t: any) => sum + Number(t.amount), 0);

  const totalExpense = (transactions || [])
    .filter((t: any) => t.type === 'expense')
    .reduce((sum: number, t: any) => sum + Number(t.amount), 0);

  const totalBalance = totalIncome - totalExpense;

  const safeBalance = totalBalance.toLocaleString('en-IN');
  const safeIncome = totalIncome.toLocaleString('en-IN');
  const safeExpense = totalExpense.toLocaleString('en-IN');

  const handleShowAlerts = () => {
    const count = transactions ? transactions.length : 0;
    Alert.alert(
      'Activity Summary 🔔',
      `You currently have ${count} recorded transaction(s).\nTotal Expense: ₹${safeExpense}\nTotal Income: ₹${safeIncome}`
    );
  };

  const renderTransactionItem = ({ item }: { item: any }) => (
    <View style={[styles.transactionCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={[styles.transactionIconContainer, { backgroundColor: theme.inputBg }]}>
        <Text style={styles.transactionIcon}>
          {item.type === 'income' ? '💰' : '💳'}
        </Text>
      </View>
      <View style={styles.transactionDetails}>
        <Text style={[styles.transactionTitle, { color: theme.text }]}>{item.title}</Text>
        <Text style={[styles.transactionCategory, { color: theme.subText }]}>
          {item.category} • {item.date ? new Date(item.date).toLocaleDateString('en-IN') : ''}
        </Text>
      </View>
      <View style={styles.transactionRight}>
        <Text
          style={[
            styles.transactionAmount,
            { color: item.type === 'income' ? '#10B981' : '#EF4444' },
          ]}
        >
          {item.type === 'income' ? '+' : '-'}₹{Number(item.amount).toLocaleString('en-IN')}
        </Text>
        <TouchableOpacity onPress={() => deleteTransaction(item.id || (item as any)._id)}>
          <Text style={styles.deleteText}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar backgroundColor={theme.background} barStyle={isDark ? 'light-content' : 'dark-content'} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.greetingText, { color: theme.subText }]}>Welcome back,</Text>
            <Text style={[styles.userName, { color: theme.text }]}>{displayName} 👋</Text>
          </View>
          <TouchableOpacity
            style={[styles.alertHeaderBtn, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={handleShowAlerts}
          >
            <Text style={[styles.alertHeaderBtnText, { color: theme.primary }]}>🔔 Summary</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.balanceCard, { backgroundColor: theme.primary }]}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceValue}>₹{safeBalance}</Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.incomeLabel}>↓ Income</Text>
              <Text style={styles.incomeValue}>₹{safeIncome}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text style={styles.expenseLabel}>↑ Expenses</Text>
              <Text style={styles.expenseValue}>₹{safeExpense}</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Transactions</Text>
        </View>

        <FlatList
          data={transactions || []}
          keyExtractor={(item: any) => item.id || item._id}
          renderItem={renderTransactionItem}
          scrollEnabled={false}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: theme.subText }]}>
              No transactions recorded yet. Tap + to add one!
            </Text>
          }
        />
      </ScrollView>

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.primary }]}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      <AddTransactionModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 90 },
  header: {
    flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 20,
  marginTop: 8,
  },
  greetingText: { fontSize: 13 },
  userName: { fontSize: 22, fontWeight: '800' },
  alertHeaderBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  alertHeaderBtnText: { fontWeight: '700', fontSize: 12 },
  balanceCard: { borderRadius: 20, padding: 20, marginBottom: 24 },
  balanceLabel: { color: 'rgba(255, 255, 255, 0.8)', fontSize: 13, fontWeight: '600' },
  balanceValue: { color: '#FFFFFF', fontSize: 32, fontWeight: '800', marginVertical: 8 },
  statsRow: {
    flexDirection: 'row',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  statItem: { flex: 1 },
  divider: { width: 1, backgroundColor: 'rgba(255, 255, 255, 0.2)', marginHorizontal: 16 },
  incomeLabel: { color: '#A7F3D0', fontSize: 12, fontWeight: '700' },
  incomeValue: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', marginTop: 2 },
  expenseLabel: { color: '#FECACA', fontSize: 12, fontWeight: '700' },
  expenseValue: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', marginTop: 2 },
  sectionHeader: { marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '800' },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
  },
  transactionIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionIcon: { fontSize: 18 },
  transactionDetails: { flex: 1 },
  transactionTitle: { fontSize: 15, fontWeight: '700' },
  transactionCategory: { fontSize: 12, marginTop: 2 },
  transactionRight: { alignItems: 'flex-end', flexDirection: 'row' },
  transactionAmount: { fontSize: 15, fontWeight: '700', marginRight: 10 },
  deleteText: { fontSize: 14, color: '#EF4444', fontWeight: '800', padding: 4 },
  emptyText: { textAlign: 'center', marginTop: 20 },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabIcon: { color: '#FFFFFF', fontSize: 28, fontWeight: '500', marginTop: -2 },
});
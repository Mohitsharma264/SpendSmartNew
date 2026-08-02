import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { useApp } from '../../context/AppContext';

export const HistoryScreen = ({ navigation }: any) => {
  const { transactions } = useApp();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={Colors.background} barStyle="dark-content" />
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Transaction History</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {transactions.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No Transactions Logged</Text>
              <Text style={styles.emptySub}>Your full transaction history will appear here.</Text>
            </View>
          ) : (
            transactions.map((tx) => (
              <TouchableOpacity
                key={tx.id}
                style={styles.txCard}
                onPress={() => navigation.navigate('ExpenseDetails', { transaction: tx })}
              >
                <View style={styles.txIconBox}>
                  <Text style={styles.txIcon}>{tx.type === 'income' ? '💵' : '🛒'}</Text>
                </View>
                <View style={styles.txDetails}>
                  <Text style={styles.txTitle}>{tx.title}</Text>
                  <Text style={styles.txSub}>{tx.date} • {tx.category}</Text>
                </View>
                <Text style={tx.type === 'income' ? styles.txIncome : styles.txExpense}>
                  {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  backBtn: { fontSize: 16, fontWeight: '700', color: Colors.primary },
  headerTitle: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary },
  emptyCard: { backgroundColor: Colors.cardBackground, padding: 24, borderRadius: 14, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', marginTop: 40 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  emptySub: { fontSize: 13, color: Colors.textMuted },
  txCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.cardBackground, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, marginBottom: 10 },
  txIconBox: { width: 40, height: 40, borderRadius: 10, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  txIcon: { fontSize: 18 },
  txDetails: { flex: 1 },
  txTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  txSub: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  txExpense: { fontSize: 14, fontWeight: '700', color: Colors.expense },
  txIncome: { fontSize: 14, fontWeight: '700', color: Colors.income },
});
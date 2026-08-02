import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TextInput, ScrollView, StatusBar } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useApp } from '../../context/AppContext';

export const SearchScreen = () => {
  const { transactions } = useApp();
  const [query, setQuery] = useState('');

  const filtered = transactions.filter(
    (t) =>
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={Colors.background} barStyle="dark-content" />
      <View style={styles.content}>
        <Text style={styles.headerTitle}>Search Transactions</Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Search by title or category..."
          placeholderTextColor={Colors.textMuted}
          value={query}
          onChangeText={setQuery}
        />

        <ScrollView showsVerticalScrollIndicator={false}>
          {filtered.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No matching transactions found.</Text>
            </View>
          ) : (
            filtered.map((tx) => (
              <View key={tx.id} style={styles.txCard}>
                <View style={styles.txDetails}>
                  <Text style={styles.txTitle}>{tx.title}</Text>
                  <Text style={styles.txSub}>{tx.date} • {tx.category}</Text>
                </View>
                <Text style={tx.type === 'income' ? styles.txIncome : styles.txExpense}>
                  {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                </Text>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, flex: 1 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary, marginBottom: 16 },
  searchInput: { backgroundColor: Colors.cardBackground, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 14, color: Colors.textPrimary, marginBottom: 16 },
  emptyCard: { padding: 20, alignItems: 'center' },
  emptyText: { color: Colors.textMuted, fontSize: 14 },
  txCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.cardBackground, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, marginBottom: 10 },
  txDetails: { flex: 1 },
  txTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  txSub: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  txExpense: { fontSize: 14, fontWeight: '700', color: Colors.expense },
  txIncome: { fontSize: 14, fontWeight: '700', color: Colors.income },
});
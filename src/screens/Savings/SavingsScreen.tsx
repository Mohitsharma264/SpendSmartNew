import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Modal,
  TextInput,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  icon: string;
  targetDate: string;
}

export const SavingsScreen = () => {
  const { theme, isDark } = useTheme();

  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Emergency Fund',
      targetAmount: 50000,
      currentAmount: 32000,
      icon: '🛡️',
      targetDate: '2026-12-31',
    },
    {
      id: '2',
      title: 'New Laptop',
      targetAmount: 80000,
      currentAmount: 45000,
      icon: '💻',
      targetDate: '2026-10-15',
    },
    {
      id: '3',
      title: 'Vacation Trip',
      targetAmount: 25000,
      currentAmount: 18000,
      icon: '✈️',
      targetDate: '2026-09-01',
    },
  ]);

  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleAddDeposit = () => {
    if (!selectedGoal || !depositAmount) return;
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) return;

    setGoals((prev) =>
      prev.map((g) =>
        g.id === selectedGoal.id
          ? { ...g, currentAmount: g.currentAmount + amount }
          : g
      )
    );

    setDepositAmount('');
    setModalVisible(false);
    setSelectedGoal(null);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar backgroundColor={theme.background} barStyle={isDark ? 'light-content' : 'dark-content'} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Savings Goals 🎯</Text>
          <Text style={[styles.headerSubtitle, { color: theme.subText }]}>Track and achieve your financial targets</Text>
        </View>

        {goals.map((goal) => {
          const progress = Math.min(
            Math.round((goal.currentAmount / goal.targetAmount) * 100),
            100
          );

          return (
            <View key={goal.id} style={[styles.goalCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={styles.cardHeader}>
                <View style={styles.titleRow}>
                  <Text style={styles.icon}>{goal.icon}</Text>
                  <View>
                    <Text style={[styles.goalTitle, { color: theme.text }]}>{goal.title}</Text>
                    <Text style={[styles.targetDate, { color: theme.subText }]}>Target: {goal.targetDate}</Text>
                  </View>
                </View>
                <Text style={[styles.progressPercent, { color: theme.primary }]}>{progress}%</Text>
              </View>

              <View style={styles.amountRow}>
                <Text style={[styles.currentAmount, { color: theme.text }]}>₹{goal.currentAmount.toLocaleString()}</Text>
                <Text style={[styles.targetAmount, { color: theme.subText }]}>of ₹{goal.targetAmount.toLocaleString()}</Text>
              </View>

              <View style={[styles.progressTrack, { backgroundColor: theme.inputBg }]}>
                <View style={[styles.progressBar, { width: `${progress}%`, backgroundColor: theme.primary }]} />
              </View>

              <TouchableOpacity
                style={[styles.depositBtn, { backgroundColor: theme.primary }]}
                onPress={() => {
                  setSelectedGoal(goal);
                  setModalVisible(true);
                }}
              >
                <Text style={styles.depositBtnText}>+ Add Money</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Deposit to {selectedGoal?.title}</Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border },
              ]}
              placeholder="Enter amount (₹)"
              placeholderTextColor={theme.subText}
              keyboardType="numeric"
              value={depositAmount}
              onChangeText={setDepositAmount}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelBtn, { backgroundColor: theme.inputBg }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={[styles.cancelBtnText, { color: theme.subText }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: theme.primary }]}
                onPress={handleAddDeposit}
              >
                <Text style={styles.confirmBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default SavingsScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20 },
  header: { marginBottom: 20 },
  headerTitle: { fontSize: 24, fontWeight: '800' },
  headerSubtitle: { fontSize: 13, marginTop: 4 },
  goalCard: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  icon: { fontSize: 28, marginRight: 12 },
  goalTitle: { fontSize: 16, fontWeight: '800' },
  targetDate: { fontSize: 11, marginTop: 2 },
  progressPercent: { fontSize: 16, fontWeight: '800' },
  amountRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 8 },
  currentAmount: { fontSize: 20, fontWeight: '800', marginRight: 6 },
  targetAmount: { fontSize: 13, fontWeight: '600' },
  progressTrack: { height: 10, borderRadius: 5, overflow: 'hidden', marginBottom: 16 },
  progressBar: { height: '100%', borderRadius: 5 },
  depositBtn: { paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  depositBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', borderRadius: 16, padding: 20, borderWidth: 1 },
  modalTitle: { fontSize: 18, fontWeight: '800', marginBottom: 16 },
  input: {
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    borderWidth: 1,
    marginBottom: 16,
  },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end' },
  modalBtn: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 8, marginLeft: 10 },
  cancelBtn: {},
  cancelBtnText: { fontWeight: '700' },
  confirmBtnText: { color: '#FFFFFF', fontWeight: '700' },
});
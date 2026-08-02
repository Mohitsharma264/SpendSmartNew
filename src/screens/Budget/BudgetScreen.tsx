import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Colors } from '../../constants/Colors';

interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
}

export const BudgetScreen = () => {
  const [goals, setGoals] = useState<Goal[]>([
    { id: '1', title: 'Emergency Fund', targetAmount: 50000, currentAmount: 32000, targetDate: '2026-12-31' },
    { id: '2', title: 'New Laptop', targetAmount: 80000, currentAmount: 45000, targetDate: '2026-10-15' },
    { id: '3', title: 'Vacation Trip', targetAmount: 25000, currentAmount: 18000, targetDate: '2026-09-01' },
  ]);

  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isMoneyModalOpen, setIsMoneyModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newDate, setNewDate] = useState('');
  const [contributionAmount, setContributionAmount] = useState('');

  const handleCreateGoal = () => {
    if (!newTitle || !newTarget) {
      Alert.alert('Error', 'Please enter title and target amount');
      return;
    }

    const newGoal: Goal = {
      id: Date.now().toString(),
      title: newTitle,
      targetAmount: Number(newTarget),
      currentAmount: 0,
      targetDate: newDate || '2026-12-31',
    };

    setGoals([...goals, newGoal]);
    setNewTitle('');
    setNewTarget('');
    setNewDate('');
    setIsGoalModalOpen(false);
    Alert.alert('Success', 'New savings goal created!');
  };

  const handleAddMoney = () => {
    if (!contributionAmount || !selectedGoal) {
      Alert.alert('Error', 'Please enter an amount');
      return;
    }

    const added = Number(contributionAmount);
    setGoals(
      goals.map((g) => {
        if (g.id === selectedGoal.id) {
          return { ...g, currentAmount: g.currentAmount + added };
        }
        return g;
      })
    );

    setContributionAmount('');
    setSelectedGoal(null);
    setIsMoneyModalOpen(false);
    Alert.alert('Success', `Added ₹${added.toLocaleString('en-IN')} to savings!`);
  };

  const handleDeleteGoal = (id: string) => {
    Alert.alert('Delete Goal', 'Are you sure you want to delete this goal?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => setGoals(goals.filter((g) => g.id !== id)),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Savings & Goals 🎯</Text>
            <Text style={styles.headerSubtitle}>Track and achieve your financial targets</Text>
          </View>
          <TouchableOpacity style={styles.addGoalBtn} onPress={() => setIsGoalModalOpen(true)}>
            <Text style={styles.addGoalBtnText}>+ New Goal</Text>
          </TouchableOpacity>
        </View>

        {goals.map((goal) => {
          const percentage = Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100);

          return (
            <View key={goal.id} style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <Text style={styles.goalTitle}>{goal.title}</Text>
                <View style={styles.percentageBadge}>
                  <Text style={styles.percentageText}>{percentage}%</Text>
                </View>
              </View>

              <Text style={styles.dateText}>Target Date: {goal.targetDate}</Text>

              <Text style={styles.amountText}>
                ₹{goal.currentAmount.toLocaleString('en-IN')}{' '}
                <Text style={styles.targetText}>of ₹{goal.targetAmount.toLocaleString('en-IN')}</Text>
              </Text>

              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${percentage}%` }]} />
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.addMoneyBtn}
                  onPress={() => {
                    setSelectedGoal(goal);
                    setIsMoneyModalOpen(true);
                  }}
                >
                  <Text style={styles.addMoneyText}>+ Add Money</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDeleteGoal(goal.id)}>
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <Modal visible={isGoalModalOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Create New Goal 🎯</Text>

            <Text style={styles.label}>Goal Title</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. New Laptop, Travel"
              value={newTitle}
              onChangeText={setNewTitle}
            />

            <Text style={styles.label}>Target Amount (₹)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 50000"
              keyboardType="numeric"
              value={newTarget}
              onChangeText={setNewTarget}
            />

            <Text style={styles.label}>Target Date</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              value={newDate}
              onChangeText={setNewDate}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsGoalModalOpen(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleCreateGoal}>
                <Text style={styles.saveText}>Save Goal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={isMoneyModalOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add Money to {selectedGoal?.title} 💰</Text>

            <Text style={styles.label}>Contribution Amount (₹)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 2000"
              keyboardType="numeric"
              value={contributionAmount}
              onChangeText={setContributionAmount}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsMoneyModalOpen(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleAddMoney}>
                <Text style={styles.saveText}>Deposit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default BudgetScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 90,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  addGoalBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addGoalBtnText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 12,
  },
  goalCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  percentageBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  percentageText: {
    color: Colors.primary,
    fontWeight: '800',
    fontSize: 12,
  },
  dateText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  amountText: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 12,
  },
  targetText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  progressTrack: {
    height: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 5,
    marginVertical: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 5,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  addMoneyBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  addMoneyText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 13,
  },
  deleteBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#FEE2E2',
  },
  deleteText: {
    color: '#DC2626',
    fontWeight: '700',
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: Colors.cardBackground,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 14,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    marginRight: 8,
  },
  cancelText: {
    color: Colors.textSecondary,
    fontWeight: '700',
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  saveText: {
    color: Colors.white,
    fontWeight: '800',
  },
});
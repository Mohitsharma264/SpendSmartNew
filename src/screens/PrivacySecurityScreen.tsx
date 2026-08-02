import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';

export default function PrivacySecurityScreen() {
  const { theme } = useTheme();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all password fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New password and confirm password do not match.');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      Alert.alert('Success', 'Password updated successfully!');
      setIsModalVisible(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      Alert.alert(
        'Update Failed',
        err?.response?.data?.message || err?.message || 'Could not update password.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: theme.text }]}>Privacy & Security</Text>

        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <TouchableOpacity
            style={[styles.option, { borderBottomColor: theme.border }]}
            onPress={() => setIsModalVisible(true)}
          >
            <View>
              <Text style={[styles.optionText, { color: theme.text }]}>Change Password</Text>
              <Text style={[styles.subText, { color: theme.subText }]}>Update your account password directly</Text>
            </View>
            <Text style={[styles.arrow, { color: theme.subText }]}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionLast}
            onPress={() =>
              Alert.alert(
                'Privacy Policy',
                'SpendSmart secures your transactions with standard end-to-end encryption.'
              )
            }
          >
            <View>
              <Text style={[styles.optionText, { color: theme.text }]}>Privacy Policy</Text>
              <Text style={[styles.subText, { color: theme.subText }]}>Read our data protection policy</Text>
            </View>
            <Text style={[styles.arrow, { color: theme.subText }]}>›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Change Password</Text>

            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]}
              placeholder="Current Password"
              placeholderTextColor={theme.subText}
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />

            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]}
              placeholder="New Password"
              placeholderTextColor={theme.subText}
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />

            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]}
              placeholder="Confirm New Password"
              placeholderTextColor={theme.subText}
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={[styles.cancelText, { color: theme.subText }]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.saveBtn, { backgroundColor: theme.primary }]}
                onPress={handleChangePassword}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.saveText}>Update</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20 },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 20 },
  card: {
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  optionLast: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  optionText: { fontSize: 16, fontWeight: '600' },
  subText: { fontSize: 12, marginTop: 2 },
  arrow: { fontSize: 20, fontWeight: '600' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
  },
  modalTitle: { fontSize: 18, fontWeight: '800', marginBottom: 16 },
  input: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 },
  cancelBtn: { paddingHorizontal: 16, paddingVertical: 12, marginRight: 8 },
  cancelText: { fontWeight: '700' },
  saveBtn: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10 },
  saveText: { color: '#FFFFFF', fontWeight: '800' },
});
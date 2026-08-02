import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';
import { AuthContext } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const ProfileScreen = ({ navigation }: any) => {
  const { userName, setUserName, transactions } = useApp();
  const { user, logout } = useContext(AuthContext);
  const { theme, isDark, toggleTheme } = useTheme();

  const displayName = user?.name || userName || 'User';
  const displayEmail = user?.email || (userName ? `${userName.toLowerCase().replace(/\s+/g, '')}@gmail.com` : 'user@gmail.com');

  const totalTransactions = transactions ? transactions.length : 0;

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          setUserName('');
          await logout();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar backgroundColor={theme.background} barStyle={isDark ? 'light-content' : 'dark-content'} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>My Profile 👤</Text>
        </View>

        <View style={[styles.profileCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={[styles.avatarContainer, { backgroundColor: theme.primary }]}>
            <Text style={styles.avatarText}>{displayName ? displayName.charAt(0).toUpperCase() : 'U'}</Text>
          </View>
          <Text style={[styles.userNameText, { color: theme.text }]}>{displayName}</Text>
          <Text style={[styles.userEmailText, { color: theme.subText }]}>{displayEmail}</Text>
        </View>

        <View style={[styles.statsContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: theme.primary }]}>{totalTransactions}</Text>
            <Text style={[styles.statLabel, { color: theme.subText }]}>Transactions</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: theme.primary }]}>Active</Text>
            <Text style={[styles.statLabel, { color: theme.subText }]}>Account Status</Text>
          </View>
        </View>

        <View style={[styles.menuContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={[styles.menuItem, { borderBottomColor: theme.border }]}>
            <Text style={styles.menuIcon}>🌙</Text>
            <Text style={[styles.menuText, { color: theme.text, flex: 1 }]}>Dark Mode</Text>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#CBD5E1', true: theme.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: theme.border }]}
            onPress={() => navigation.navigate('AccountSettings')}
          >
            <Text style={styles.menuIcon}>⚙️</Text>
            <Text style={[styles.menuText, { color: theme.text }]}>Account Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: theme.border }]}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Text style={styles.menuIcon}>🔔</Text>
            <Text style={[styles.menuText, { color: theme.text }]}>Notifications</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: theme.border }]}
            onPress={() => navigation.navigate('PrivacySecurity')}
          >
            <Text style={styles.menuIcon}>🔒</Text>
            <Text style={[styles.menuText, { color: theme.text }]}>Privacy & Security</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItemLast}
            onPress={() => navigation.navigate('HelpSupport')}
          >
            <Text style={styles.menuIcon}>❓</Text>
            <Text style={[styles.menuText, { color: theme.text }]}>Help & Support</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20 },
  header: { marginBottom: 20 },
  headerTitle: { fontSize: 24, fontWeight: '800' },
  profileCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 20,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: { fontSize: 32, fontWeight: '800', color: '#FFFFFF' },
  userNameText: { fontSize: 20, fontWeight: '800' },
  userEmailText: { fontSize: 13, marginTop: 4 },
  statsContainer: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  statBox: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1 },
  statValue: { fontSize: 18, fontWeight: '800' },
  statLabel: { fontSize: 12, marginTop: 2 },
  menuContainer: {
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  menuItemLast: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  menuIcon: { fontSize: 18, marginRight: 14 },
  menuText: { fontSize: 15, fontWeight: '600' },
  logoutBtn: {
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  logoutText: { color: '#DC2626', fontSize: 15, fontWeight: '800' },
});
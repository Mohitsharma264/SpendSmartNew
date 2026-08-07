import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

import LoginScreen from '../screens/Auth/LoginScreen';
import SignupScreen from '../screens/Auth/SignupScreen';
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';
import OtpVerificationScreen from '../screens/Auth/OtpVerificationScreen';
import BottomNavigator from './BottomNavigator';

import AccountSettingsScreen from '../screens/AccountSettingsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import PrivacySecurityScreen from '../screens/PrivacySecurityScreen';
import HelpSupportScreen from '../screens/HelpSupportScreen';
import ReceiptScanScreen from '../screens/SmartTools/ReceiptScanScreen';
import MessageScanScreen from '../screens/SmartTools/MessageScanScreen';

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  OtpVerification: { email: string };
  MainApp: undefined;
  AccountSettings: undefined;
  Notifications: undefined;
  PrivacySecurity: undefined;
  HelpSupport: undefined;
  ReceiptScan: undefined;
  MessageScan: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const { userToken, isLoading } = useAuth();
  const { theme, isDark } = useTheme();

  const customNavTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: theme.background,
      card: theme.card,
      text: theme.text,
      border: theme.border,
    },
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={customNavTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          headerStyle: { backgroundColor: theme.card },
          headerTintColor: theme.text,
          headerTitleStyle: { fontWeight: '700' },
        }}
      >
        {userToken ? (
          <>
            <Stack.Screen name="MainApp" component={BottomNavigator} />
            <Stack.Screen 
              name="AccountSettings" 
              component={AccountSettingsScreen} 
              options={{ headerShown: true, title: 'Account Settings' }} 
            />
            <Stack.Screen 
              name="Notifications" 
              component={NotificationsScreen} 
              options={{ headerShown: true, title: 'Notifications' }} 
            />
            <Stack.Screen 
              name="PrivacySecurity" 
              component={PrivacySecurityScreen} 
              options={{ headerShown: true, title: 'Privacy & Security' }} 
            />
            <Stack.Screen 
              name="HelpSupport" 
              component={HelpSupportScreen} 
              options={{ headerShown: true, title: 'Help & Support' }} 
            />
            <Stack.Screen 
              name="ReceiptScan" 
              component={ReceiptScanScreen} 
              options={{ headerShown: true, title: 'Receipt Scanner' }} 
            />
            <Stack.Screen 
              name="MessageScan" 
              component={MessageScanScreen} 
              options={{ headerShown: true, title: 'SMS Parser' }} 
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
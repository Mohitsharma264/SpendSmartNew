import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import { HomeScreen } from '../screens/Home/HomeScreen';
import { AnalyticsScreen } from '../screens/Analytics/AnalyticsScreen';
import SmartToolsScreen from '../screens/SmartTools/SmartToolsScreen';
import { BudgetScreen } from '../screens/Budget/BudgetScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import { Colors } from '../constants/Colors';

const Tab = createBottomTabNavigator();

export const BottomNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: Colors.cardBackground,
          borderTopColor: Colors.border,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>{focused ? '🏠' : '🛖'}</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{
          tabBarLabel: 'Analytics',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>{focused ? '📊' : '📈'}</Text>
          ),
        }}
      />
      <Tab.Screen
        name="SmartHub"
        component={SmartToolsScreen}
        options={{
          tabBarLabel: 'Smart Hub',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>{focused ? '⚡' : '🧾'}</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Savings"
        component={BudgetScreen}
        options={{
          tabBarLabel: 'Savings',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>{focused ? '🎯' : '🎯'}</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>{focused ? '👤' : '👤'}</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNavigator;
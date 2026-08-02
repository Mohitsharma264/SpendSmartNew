import React, { createContext, useState, useContext } from 'react';
import api, { API_ENDPOINTS } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  const login = async (email: string, password: string) => {
    const response = await api.post(API_ENDPOINTS.LOGIN, { email, password });
    const { token, user: userData } = response.data;
    await AsyncStorage.setItem('userToken', token);
    await AsyncStorage.setItem('userData', JSON.stringify(userData));
    setUserToken(token);
    setUser(userData);
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await api.post(API_ENDPOINTS.REGISTER, { name, email, password });
    const { token, user: userData } = response.data;
    await AsyncStorage.setItem('userToken', token);
    await AsyncStorage.setItem('userData', JSON.stringify(userData));
    setUserToken(token);
    setUser(userData);
  };

  const updateUser = async (updatedUser: any) => {
    setUser(updatedUser);
    await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
  };

  const logout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
    setUserToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, userToken, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
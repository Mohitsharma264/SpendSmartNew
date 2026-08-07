import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  paymentMode?: string;
  date: string;
}

interface AppContextType {
  userName: string;
  setUserName: (name: string) => void;
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  addTransaction: (transaction: Omit<Transaction, 'id'> | Transaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  fetchTransactions: () => Promise<void>;
  clearAppData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userName, setUserName] = useState<string>('User');
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    loadStoredData();
    fetchTransactions();
  }, []);

  const loadStoredData = async () => {
    try {
      const storedName = await AsyncStorage.getItem('@user_name');
      if (storedName) setUserName(storedName);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchTransactions = async () => {
    try {
      const token = (await AsyncStorage.getItem('token')) || (await AsyncStorage.getItem('userToken'));
      if (!token) return;

      const response = await api.get('/transactions');
      const formatted = response.data.map((item: any) => ({
        id: item._id || item.id,
        title: item.title,
        amount: item.amount,
        type: item.type,
        category: item.category,
        paymentMode: item.paymentMode || 'General',
        date: item.date,
      }));
      setTransactions(formatted);
    } catch (e: any) {
      if (e?.response?.status !== 401) {
        console.error(e);
      }
    }
  };

  const updateUserName = async (name: string) => {
    setUserName(name);
    await AsyncStorage.setItem('@user_name', name);
  };

  const clearAppData = () => {
    setTransactions([]);
    setUserName('User');
  };

  const addTransaction = async (transactionData: Omit<Transaction, 'id'> | Transaction) => {
    try {
      if ('id' in transactionData && transactionData.id) {
        setTransactions((prev) => [transactionData as Transaction, ...prev]);
        return;
      }

      const response = await api.post('/transactions', transactionData);
      const newTx: Transaction = {
        id: response.data._id || response.data.id || Date.now().toString(),
        title: response.data.title || (transactionData as any).title,
        amount: response.data.amount || (transactionData as any).amount,
        type: response.data.type || (transactionData as any).type,
        category: response.data.category || (transactionData as any).category,
        paymentMode: response.data.paymentMode || 'General',
        date: response.data.date || new Date().toISOString(),
      };
      setTransactions((prev) => [newTx, ...prev]);
    } catch (e) {
      console.error(e);
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await api.delete(`/transactions/${id}`);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AppContext.Provider
      value={{
        userName,
        setUserName: updateUserName,
        transactions,
        setTransactions,
        addTransaction,
        deleteTransaction,
        fetchTransactions,
        clearAppData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
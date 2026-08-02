import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  paymentMode: string;
  date: string;
}

interface AppContextType {
  userName: string;
  setUserName: (name: string) => void;
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  fetchTransactions: () => Promise<void>;
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
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      const response = await api.get('/transactions');
      const formatted = response.data.map((item: any) => ({
        id: item._id,
        title: item.title,
        amount: item.amount,
        type: item.type,
        category: item.category,
        paymentMode: item.paymentMode,
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

  const addTransaction = async (transactionData: Omit<Transaction, 'id'>) => {
    try {
      const response = await api.post('/transactions', transactionData);
      const newTx: Transaction = {
        id: response.data._id,
        title: response.data.title,
        amount: response.data.amount,
        type: response.data.type,
        category: response.data.category,
        paymentMode: response.data.paymentMode,
        date: response.data.date,
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
        addTransaction,
        deleteTransaction,
        fetchTransactions,
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
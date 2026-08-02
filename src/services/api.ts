import { Platform } from 'react-native';
import axios, { InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ENV_URL = process.env.EXPO_PUBLIC_API_URL;

const formattedEnvUrl = ENV_URL
  ? (ENV_URL.endsWith('/api') ? ENV_URL : `${ENV_URL}/api`)
  : null;

export const BASE_URL =
  formattedEnvUrl ||
  (Platform.OS === 'android'
    ? 'http://10.0.2.2:5000/api'
    : 'http://localhost:5000/api');

export const API_ENDPOINTS = {
  LOGIN: `${BASE_URL}/auth/login`,
  REGISTER: `${BASE_URL}/auth/register`,
  PROFILE: `${BASE_URL}/auth/profile`,
  CHANGE_PASSWORD: `${BASE_URL}/auth/change-password`,
  FORGOT_PASSWORD: `${BASE_URL}/auth/send-otp`,
  RESET_PASSWORD: `${BASE_URL}/auth/reset-password-otp`,
  TRANSACTIONS: `${BASE_URL}/transactions`,
};

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

export default api;
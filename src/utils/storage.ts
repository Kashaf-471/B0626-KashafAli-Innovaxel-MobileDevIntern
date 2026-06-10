import AsyncStorage from '@react-native-async-storage/async-storage';
import { Expense, ThemeMode } from '../types';

const EXPENSES_STORAGE_KEY = '@personal_expenses_v1';
const THEME_STORAGE_KEY = '@app_theme_mode';

export const storage = {
  /**
   * Save expenses array locally
   */
  saveExpenses: async (expenses: Expense[]): Promise<void> => {
    try {
      const jsonValue = JSON.stringify(expenses);
      await AsyncStorage.setItem(EXPENSES_STORAGE_KEY, jsonValue);
    } catch (e) {
      console.error('Error saving expenses to AsyncStorage:', e);
    }
  },

  /**
   * Load expenses array locally
   */
  loadExpenses: async (): Promise<Expense[]> => {
    try {
      const jsonValue = await AsyncStorage.getItem(EXPENSES_STORAGE_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error('Error loading expenses from AsyncStorage:', e);
      return [];
    }
  },

  /**
   * Save theme mode setting
   */
  saveTheme: async (theme: ThemeMode): Promise<void> => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (e) {
      console.error('Error saving theme mode to AsyncStorage:', e);
    }
  },

  /**
   * Load theme mode setting
   */
  loadTheme: async (): Promise<ThemeMode | null> => {
    try {
      const value = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      return (value as ThemeMode) || null;
    } catch (e) {
      console.error('Error loading theme mode from AsyncStorage:', e);
      return null;
    }
  },

  /**
   * Clear all local storage data
   */
  clearAll: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(EXPENSES_STORAGE_KEY);
      await AsyncStorage.removeItem(THEME_STORAGE_KEY);
    } catch (e) {
      console.error('Error clearing AsyncStorage:', e);
    }
  }
};

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { ref, onValue, set, push, remove, update } from 'firebase/database';
import { Expense, CategoryType, ExpenseFilters, ThemeMode } from '../types';
import { storage } from '../utils/storage';
import { database, isFirebaseInitialized } from '../utils/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ExpensesContextType {
  expenses: Expense[];
  filteredExpenses: Expense[];
  loading: boolean;
  themeMode: ThemeMode;
  toggleTheme: () => void;
  syncMode: 'Firebase' | 'Local';
  userId: string;
  addExpense: (expenseData: Omit<Expense, 'id' | 'createdAt'>) => Promise<boolean>;
  updateExpense: (id: string, expenseData: Partial<Omit<Expense, 'id' | 'createdAt'>>) => Promise<boolean>;
  deleteExpense: (id: string) => Promise<boolean>;
  filters: ExpenseFilters;
  updateFilters: (filters: Partial<ExpenseFilters>) => void;
  resetFilters: () => void;
  totalSpent: number;
  categoryTotals: Record<CategoryType, number>;
}

const ExpensesContext = createContext<ExpensesContextType | undefined>(undefined);

const USER_ID_KEY = '@expense_tracker_user_id';

export const ExpensesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [syncMode, setSyncMode] = useState<'Firebase' | 'Local'>('Local');
  const [userId, setUserId] = useState<string>('');
  
  // Filtering states
  const [filters, setFilters] = useState<ExpenseFilters>({
    category: 'All',
    startDate: '',
    endDate: '',
    searchQuery: '',
  });

  // 1. Initialize user ID, theme, and local cache
  useEffect(() => {
    const initApp = async () => {
      try {
        // Load theme mode
        const savedTheme = await storage.loadTheme();
        if (savedTheme) {
          setThemeMode(savedTheme);
        } else {
          setThemeMode(systemColorScheme === 'dark' ? 'dark' : 'light');
        }

        // Get or generate User ID
        let cachedUserId = await AsyncStorage.getItem(USER_ID_KEY);
        if (!cachedUserId) {
          cachedUserId = `user_${Math.random().toString(36).substring(2, 15)}`;
          await AsyncStorage.setItem(USER_ID_KEY, cachedUserId);
        }
        setUserId(cachedUserId);

        // Load local cache first so it's instant
        const cachedExpenses = await storage.loadExpenses();
        setExpenses(cachedExpenses);
        setLoading(false);
      } catch (error) {
        console.error('Error during app initialization:', error);
        setLoading(false);
      }
    };

    initApp();
  }, [systemColorScheme]);

  // 2. Set up Firebase database connection if initialized
  useEffect(() => {
    if (!userId) return;

    if (isFirebaseInitialized && database) {
      setSyncMode('Firebase');
      const expensesRef = ref(database, `users/${userId}/expenses`);
      
      setLoading(true);
      // Listen to database updates
      const unsubscribe = onValue(
        expensesRef,
        async (snapshot) => {
          const data = snapshot.val();
          if (data) {
            // Firebase Realtime DB returns object, map to array
            const expensesList: Expense[] = Object.keys(data).map((key) => ({
              id: key,
              ...data[key],
            }));
            
            // Sort expenses (most recent first)
            expensesList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            
            setExpenses(expensesList);
            await storage.saveExpenses(expensesList);
          } else {
            setExpenses([]);
            await storage.saveExpenses([]);
          }
          setLoading(false);
        },
        (error) => {
          console.error('Firebase read error, falling back to local storage:', error);
          setSyncMode('Local');
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } else {
      setSyncMode('Local');
    }
  }, [userId]);

  // 3. Theme controller
  const toggleTheme = () => {
    const nextTheme = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(nextTheme);
    storage.saveTheme(nextTheme);
  };

  // 4. Filter helpers
  const updateFilters = (newFilters: Partial<ExpenseFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      category: 'All',
      startDate: '',
      endDate: '',
      searchQuery: '',
    });
  };

  // 5. CRUD: Add Expense
  const addExpense = async (expenseData: Omit<Expense, 'id' | 'createdAt'>): Promise<boolean> => {
    const createdAt = Date.now();
    const newExpenseObj = {
      ...expenseData,
      createdAt,
    };

    if (syncMode === 'Firebase' && database && userId) {
      try {
        const expensesRef = ref(database, `users/${userId}/expenses`);
        // We push to create a new unique key
        const newRef = push(expensesRef);
        await set(newRef, newExpenseObj);
        return true;
      } catch (error) {
        console.error('Failed to add expense to Firebase:', error);
        // Fallback to local write
      }
    }

    // Local / Offline fallback write
    const localId = `local_${createdAt}_${Math.random().toString(36).substring(2, 6)}`;
    const newLocalExpense: Expense = {
      id: localId,
      ...newExpenseObj,
    };

    const updatedExpenses = [newLocalExpense, ...expenses];
    updatedExpenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setExpenses(updatedExpenses);
    await storage.saveExpenses(updatedExpenses);
    return true;
  };

  // 6. CRUD: Update Expense
  const updateExpense = async (id: string, expenseData: Partial<Omit<Expense, 'id' | 'createdAt'>>): Promise<boolean> => {
    if (syncMode === 'Firebase' && database && userId && !id.startsWith('local_')) {
      try {
        const expenseRef = ref(database, `users/${userId}/expenses/${id}`);
        await update(expenseRef, expenseData);
        return true;
      } catch (error) {
        console.error('Failed to update expense in Firebase:', error);
        // Fallback to local
      }
    }

    // Local update
    const updatedExpenses = expenses.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          ...expenseData,
        };
      }
      return item;
    });
    
    updatedExpenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setExpenses(updatedExpenses);
    await storage.saveExpenses(updatedExpenses);
    return true;
  };

  // 7. CRUD: Delete Expense
  const deleteExpense = async (id: string): Promise<boolean> => {
    if (syncMode === 'Firebase' && database && userId && !id.startsWith('local_')) {
      try {
        const expenseRef = ref(database, `users/${userId}/expenses/${id}`);
        await remove(expenseRef);
        return true;
      } catch (error) {
        console.error('Failed to delete expense in Firebase:', error);
        // Fallback to local
      }
    }

    // Local delete
    const updatedExpenses = expenses.filter((item) => item.id !== id);
    setExpenses(updatedExpenses);
    await storage.saveExpenses(updatedExpenses);
    return true;
  };

  // 8. Computed filtered expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter((item) => {
      // Category filter
      if (filters.category !== 'All' && item.category !== filters.category) {
        return false;
      }

      // Search query filter (title or notes)
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesNotes = item.notes?.toLowerCase().includes(query) ?? false;
        if (!matchesTitle && !matchesNotes) {
          return false;
        }
      }

      // Date range filter
      if (filters.startDate && item.date < filters.startDate) {
        return false;
      }
      if (filters.endDate && item.date > filters.endDate) {
        return false;
      }

      return true;
    });
  }, [expenses, filters]);

  // 9. Computed aggregates
  const totalSpent = useMemo(() => {
    return filteredExpenses.reduce((sum, item) => sum + item.amount, 0);
  }, [filteredExpenses]);

  const categoryTotals = useMemo(() => {
    const totals: Record<CategoryType, number> = {
      Food: 0,
      Transport: 0,
      Utilities: 0,
      Entertainment: 0,
      Shopping: 0,
      Other: 0,
    };
    
    filteredExpenses.forEach((item) => {
      if (totals[item.category] !== undefined) {
        totals[item.category] += item.amount;
      } else {
        totals.Other += item.amount;
      }
    });
    
    return totals;
  }, [filteredExpenses]);

  return (
    <ExpensesContext.Provider
      value={{
        expenses,
        filteredExpenses,
        loading,
        themeMode,
        toggleTheme,
        syncMode,
        userId,
        addExpense,
        updateExpense,
        deleteExpense,
        filters,
        updateFilters,
        resetFilters,
        totalSpent,
        categoryTotals,
      }}
    >
      {children}
    </ExpensesContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpensesContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpensesProvider');
  }
  return context;
};

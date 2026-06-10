export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: CategoryType;
  date: string; // YYYY-MM-DD
  notes?: string;
  createdAt: number; // timestamp
}

export type CategoryType = 'Food' | 'Transport' | 'Utilities' | 'Entertainment' | 'Shopping' | 'Other';

export interface CategoryInfo {
  name: CategoryType;
  icon: string; // name of Expo Symbol/Icon
  color: string; // color hex code
}

export interface ExpenseFilters {
  category: CategoryType | 'All';
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  searchQuery: string;
}

export type ThemeMode = 'light' | 'dark';

export interface FormErrors {
  title?: string;
  amount?: string;
  category?: string;
  date?: string;
}

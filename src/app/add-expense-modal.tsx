import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useExpenses } from '@/hooks/useExpenses';
import { Colors } from '@/constants/theme';
import { CustomInput } from '@/components/CustomInput';
import { CustomButton } from '@/components/CustomButton';
import { CategoryPicker } from '@/components/CategoryPicker';
import { Expense, CategoryType, FormErrors } from '@/types';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function AddExpenseModal() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { 
    expenses, 
    addExpense, 
    updateExpense, 
    themeMode 
  } = useExpenses();
  
  const colors = Colors[themeMode];
  const router = useRouter();

  // Form states
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<CategoryType | ''>('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]); // Default to today YYYY-MM-DD
  const [notes, setNotes] = useState('');
  
  // Validation error state
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

  const isEditMode = !!id;

  // Pre-populate if editing
  useEffect(() => {
    if (isEditMode && id) {
      const existingExpense = expenses.find((item: Expense) => item.id === id);
      if (existingExpense) {
        setTitle(existingExpense.title);
        setAmount(existingExpense.amount.toString());
        setCategory(existingExpense.category);
        setDate(existingExpense.date);
        setNotes(existingExpense.notes || '');
      } else {
        Alert.alert('Error', 'Expense not found');
        router.back();
      }
    }
  }, [id, isEditMode]);

  // Form validation
  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    const parsedAmount = parseFloat(amount);
    if (!amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(parsedAmount)) {
      newErrors.amount = 'Amount must be a number';
    } else if (parsedAmount <= 0) {
      newErrors.amount = 'Amount must be greater than zero';
    }

    if (!category) {
      newErrors.category = 'Please select a category';
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!date.trim()) {
      newErrors.date = 'Date is required';
    } else if (!dateRegex.test(date)) {
      newErrors.date = 'Use format YYYY-MM-DD';
    } else {
      // Validate logical date numbers
      const parts = date.split('-');
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const day = parseInt(parts[2], 10);
      if (month < 1 || month > 12 || day < 1 || day > 31 || year < 2000 || year > 2100) {
        newErrors.date = 'Please enter a valid date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    const parsedAmount = parseFloat(amount);
    const expenseData = {
      title: title.trim(),
      amount: parsedAmount,
      category: category as CategoryType,
      date: date.trim(),
      notes: notes.trim() || undefined,
    };

    try {
      let success = false;
      if (isEditMode && id) {
        success = await updateExpense(id, expenseData);
      } else {
        success = await addExpense(expenseData);
      }

      if (success) {
        router.back();
      } else {
        Alert.alert('Save Failed', 'Could not save expense data. Please try again.');
      }
    } catch (error) {
      console.error('Error saving expense:', error);
      Alert.alert('Error', 'An unexpected error occurred.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      <ScrollView 
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {isEditMode ? 'Modify Expense details' : 'Log a new Outflow'}
        </Text>
        
        {/* Title Input */}
        <CustomInput
          label="Title / Description"
          placeholder="e.g. Dinner with Friends"
          value={title}
          onChangeText={setTitle}
          error={errors.title}
        />

        {/* Amount Input */}
        <CustomInput
          label="Amount Spent (₨)"
          placeholder="e.g. 2500"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          error={errors.amount}
        />

        {/* Custom Category Picker grid */}
        <CategoryPicker
          selectedCategory={category}
          onSelect={(cat) => setCategory(cat)}
          error={errors.category}
        />

        {/* Date Input */}
        <CustomInput
          label="Date of Transaction"
          placeholder="YYYY-MM-DD (e.g. 2026-06-09)"
          value={date}
          onChangeText={setDate}
          error={errors.date}
        />

        {/* Optional Notes Input */}
        <CustomInput
          label="Notes (Optional)"
          placeholder="Add details like location, itemized receipt details..."
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
          style={styles.notesInput}
        />

        {/* Submit Buttons */}
        <View style={styles.buttonRow}>
          <CustomButton
            title="Cancel"
            onPress={() => router.back()}
            type="outline"
            style={{ flex: 1 }}
          />
          <CustomButton
            title={isEditMode ? 'Update Outflow' : 'Save Expense'}
            onPress={handleSave}
            type="primary"
            loading={saving}
            style={{ flex: 1 }}
          />
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 20,
    letterSpacing: 0.1,
  },
  notesInput: {
    height: 80,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
});

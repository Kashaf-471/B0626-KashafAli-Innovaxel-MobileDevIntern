import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ExpensesProvider, useExpenses } from '@/hooks/useExpenses';
import { Colors } from '../constants/theme';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function RootNavigation() {
  const { themeMode } = useExpenses();
  const colors = Colors[themeMode];

  return (
    <>
      <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        {/* Main tabs */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        
        {/* Add/Edit modal */}
        <Stack.Screen 
          name="add-expense-modal" 
          options={{ 
            presentation: 'modal',
            title: 'Expense Form',
            headerShown: true,
            headerStyle: {
              backgroundColor: colors.card,
            },
            headerTintColor: colors.text,
          }} 
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ExpensesProvider>
        <RootNavigation />
      </ExpensesProvider>
    </SafeAreaProvider>
  );
}

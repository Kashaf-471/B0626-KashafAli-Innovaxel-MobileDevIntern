import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AnalyticsChart } from '../../components/AnalyticsChart';
import { ExpenseCard } from '../../components/ExpenseCard';
import { Colors } from '../../constants/theme';
import { useExpenses } from '../../hooks/useExpenses';

export default function DashboardScreen() {
  const { 
    expenses, 
    totalSpent, 
    themeMode, 
    deleteExpense 
  } = useExpenses();
  const colors = Colors[themeMode];
  const router = useRouter();

  // Get only the 3 most recent expenses
  const recentExpenses = expenses.slice(0, 3);

  const handleEditExpense = (expense: any) => {
    router.push({
      pathname: '/add-expense-modal',
      params: { id: expense.id }
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Welcome & Sync Status Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>Hello! Welcome Back</Text>
            <Text style={[styles.title, { color: colors.text }]}>Expense Tracker</Text>
          </View>
        </View>

        {/* Hero Total Card */}
        <View style={[styles.totalCard, { backgroundColor: colors.primary, shadowColor: colors.primary }]}>
          <View style={styles.totalCardInner}>
            <Text style={styles.totalLabel}>TOTAL OUTFLOW</Text>
            <Text style={styles.totalAmount}>Rs {totalSpent.toLocaleString()}</Text>
            
            <View style={styles.cardFooter}>
              <Text style={styles.cardFooterText}>Active Transactions: {expenses.length}</Text>
              <View style={styles.cardBadge}>
                <Text style={styles.cardBadgeText}>PKR (₨)</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Analytics SVG Chart Section */}
        <AnalyticsChart />

        {/* Recent Transactions List */}
        <View style={[styles.recentSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Transactions</Text>
              <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>Latest activity at a glance</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/list')}>
              <Text style={[styles.viewAllText, { color: colors.primary }]}>View All</Text>
            </TouchableOpacity>
          </View>

          {recentExpenses.length === 0 ? (
            <View style={[styles.emptyRecent, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
              <Ionicons name="card-outline" size={34} color={colors.textSecondary} />
              <Text style={[styles.emptyRecentText, { color: colors.textSecondary }]}> 
                No expenses recorded yet.
              </Text>
            </View>
          ) : (
            recentExpenses.map((item) => (
              <ExpenseCard
                key={item.id}
                expense={item}
                onEdit={handleEditExpense}
                onDelete={deleteExpense}
              />
            ))
          )}
        </View>

      </ScrollView>

      {/* Floating Action Add Button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary, shadowColor: colors.primary }]}
        onPress={() => router.push('/add-expense-modal')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={30} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100, // extra spacing for floating action button
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.1,
    marginTop: 2,
  },
  totalCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 8,
  },
  totalCardInner: {
    gap: 8,
  },
  totalLabel: {
    color: '#FFE8EF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  totalAmount: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  cardFooterText: {
    color: '#FFE8EF',
    fontSize: 13,
    fontWeight: '500',
  },
  cardBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  cardBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  sectionSubtitle: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '500',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '700',
  },
  recentSection: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 16,
    marginTop: 10,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 14,
    elevation: 2,
  },
  emptyRecent: {
    borderRadius: 20,
    paddingVertical: 22,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    gap: 10,
  },
  emptyRecentText: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});

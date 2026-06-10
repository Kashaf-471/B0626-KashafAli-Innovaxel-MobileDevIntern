import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useExpenses } from '../../hooks/useExpenses';
import { Colors, Categories } from '../../constants/theme';
import { ExpenseCard } from '../../components/ExpenseCard';
import { CustomInput } from '../../components/CustomInput';
import { CategoryType } from '../../types';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ListScreen() {
  const { 
    filteredExpenses, 
    filters, 
    updateFilters, 
    resetFilters, 
    themeMode, 
    deleteExpense 
  } = useExpenses();
  
  const colors = Colors[themeMode];
  const router = useRouter();
  const [showAdvanceFilters, setShowAdvanceFilters] = useState(false);

  const handleEditExpense = (expense: any) => {
    router.push({
      pathname: '/add-expense-modal',
      params: { id: expense.id }
    });
  };

  // Date Range Quick Presets
  const applyDatePreset = (preset: 'all' | 'week' | 'month' | 'year') => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    if (preset === 'all') {
      updateFilters({ startDate: '', endDate: '' });
      return;
    }

    let start = new Date();
    if (preset === 'week') {
      start.setDate(today.getDate() - 7);
    } else if (preset === 'month') {
      start.setDate(1); // 1st of current month
    } else if (preset === 'year') {
      start.setMonth(0, 1); // Jan 1st
    }
    
    const startStr = start.toISOString().split('T')[0];
    updateFilters({ startDate: startStr, endDate: todayStr });
  };

  const isAnyFilterActive = 
    filters.category !== 'All' || 
    filters.searchQuery !== '' || 
    filters.startDate !== '' || 
    filters.endDate !== '';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      {/* Search Header Bar */}
      <View style={[styles.searchBarContainer, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={[styles.searchBox, { backgroundColor: themeMode === 'light' ? '#FFF5F7' : '#1D0F1B', borderColor: colors.border }]}>
          <Ionicons name="search" size={20} color={colors.primary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search expense titles, notes..."
            placeholderTextColor={themeMode === 'light' ? '#A0A4AE' : '#6A6670'}
            value={filters.searchQuery}
            onChangeText={(text) => updateFilters({ searchQuery: text })}
          />
          {filters.searchQuery ? (
            <TouchableOpacity onPress={() => updateFilters({ searchQuery: '' })}>
              <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          ) : null}
        </View>

        <TouchableOpacity 
          style={[
            styles.filterToggle, 
            { 
              backgroundColor: showAdvanceFilters || isAnyFilterActive ? colors.primary + '1F' : 'transparent',
              borderColor: showAdvanceFilters || isAnyFilterActive ? colors.primary : colors.border
            }
          ]}
          onPress={() => setShowAdvanceFilters(!showAdvanceFilters)}
        >
          <Ionicons name="funnel-outline" size={20} color={colors.primary} />
          <Text style={[styles.filterToggleText, { color: colors.primary }]}>Filters</Text>
        </TouchableOpacity>
      </View>

      {/* Advanced Filters Drawer */}
      {showAdvanceFilters && (
        <View style={[styles.advanceFiltersDrawer, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          
          {/* Quick Date Presets */}
          <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>Date Range Presets</Text>
          <View style={styles.presetsRow}>
            <TouchableOpacity 
              style={[styles.presetButton, { backgroundColor: themeMode === 'light' ? '#FFF0F3' : '#2D1627' }]}
              onPress={() => applyDatePreset('all')}
            >
              <Text style={[styles.presetButtonText, { color: colors.primary }]}>All Time</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.presetButton, { backgroundColor: themeMode === 'light' ? '#FFF0F3' : '#2D1627' }]}
              onPress={() => applyDatePreset('week')}
            >
              <Text style={[styles.presetButtonText, { color: colors.primary }]}>Last 7 Days</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.presetButton, { backgroundColor: themeMode === 'light' ? '#FFF0F3' : '#2D1627' }]}
              onPress={() => applyDatePreset('month')}
            >
              <Text style={[styles.presetButtonText, { color: colors.primary }]}>This Month</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.presetButton, { backgroundColor: themeMode === 'light' ? '#FFF0F3' : '#2D1627' }]}
              onPress={() => applyDatePreset('year')}
            >
              <Text style={[styles.presetButtonText, { color: colors.primary }]}>This Year</Text>
            </TouchableOpacity>
          </View>

          {/* Custom Date Ranges inputs */}
          <View style={styles.customDateRow}>
            <View style={{ flex: 1 }}>
              <CustomInput
                label="Start Date (YYYY-MM-DD)"
                placeholder="2026-06-01"
                value={filters.startDate}
                onChangeText={(text) => updateFilters({ startDate: text })}
                containerStyle={{ marginBottom: 0 }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <CustomInput
                label="End Date (YYYY-MM-DD)"
                placeholder="2026-06-30"
                value={filters.endDate}
                onChangeText={(text) => updateFilters({ endDate: text })}
                containerStyle={{ marginBottom: 0 }}
              />
            </View>
          </View>
        </View>
      )}

      {/* Categories Horizontal Selector Row */}
      <View style={styles.categoriesRowContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScrollContent}
        >
          {/* "All" Category trigger */}
          <TouchableOpacity
            style={[
              styles.categoryTab,
              {
                backgroundColor: filters.category === 'All' ? colors.primary : colors.card,
                borderColor: filters.category === 'All' ? colors.primary : colors.border,
              }
            ]}
            onPress={() => updateFilters({ category: 'All' })}
          >
            <Text style={[styles.categoryTabText, { color: filters.category === 'All' ? '#FFFFFF' : colors.text }]}>
              All Expenses
            </Text>
          </TouchableOpacity>

          {Object.keys(Categories).map((key) => {
            const cat = Categories[key];
            const isSelected = filters.category === cat.name;
            return (
              <TouchableOpacity
                key={cat.name}
                style={[
                  styles.categoryTab,
                  {
                    backgroundColor: isSelected ? cat.color : colors.card,
                    borderColor: isSelected ? cat.color : colors.border,
                  }
                ]}
                onPress={() => updateFilters({ category: cat.name })}
              >
                <View style={styles.tabIconWrapper}>
                  <Ionicons 
                    name={cat.icon as any} 
                    size={14} 
                    color={isSelected ? '#FFFFFF' : cat.color} 
                  />
                  <Text style={[styles.categoryTabText, { color: isSelected ? '#FFFFFF' : colors.text }]}>
                    {cat.name}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Filter Stats & Reset Info */}
      <View style={styles.statsRow}>
        <Text style={[styles.resultsCountText, { color: colors.textSecondary }]}>
          Showing {filteredExpenses.length} transactions
        </Text>
        {isAnyFilterActive && (
          <TouchableOpacity onPress={resetFilters} style={styles.resetLink}>
            <Ionicons name="refresh-circle-outline" size={16} color={colors.primary} />
            <Text style={[styles.resetLinkText, { color: colors.primary }]}>Reset Filters</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Main Expenses List */}
      <FlatList
        data={filteredExpenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ExpenseCard
            expense={item}
            onEdit={handleEditExpense}
            onDelete={deleteExpense}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyList}>
            <Ionicons name="alert-circle-outline" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyListTitle, { color: colors.text }]}>No matching expenses</Text>
            <Text style={[styles.emptyListSubtitle, { color: colors.textSecondary }]}>
              {isAnyFilterActive 
                ? 'Try adjusting your filters, search term, or date range to find matches.' 
                : 'Get started by clicking the "+" button below to add your first expense!'}
            </Text>
          </View>
        }
      />

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
  searchBarContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 48,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    height: '100%',
    padding: 0,
  },
  filterToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    gap: 6,
  },
  filterToggleText: {
    fontSize: 13,
    fontWeight: '700',
  },
  advanceFiltersDrawer: {
    padding: 20,
    borderBottomWidth: 1.5,
    gap: 12,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  presetsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  presetButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  customDateRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  categoriesRowContainer: {
    paddingVertical: 12,
  },
  categoriesScrollContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  tabIconWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryTabText: {
    fontSize: 13,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  resultsCountText: {
    fontSize: 12,
    fontWeight: '600',
  },
  resetLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  resetLinkText: {
    fontSize: 12,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  emptyList: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    gap: 12,
    paddingHorizontal: 20,
  },
  emptyListTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptyListSubtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 10,
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

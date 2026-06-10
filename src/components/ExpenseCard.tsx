import { Categories, Colors } from '@/constants/theme';
import { useExpenses } from '@/hooks/useExpenses';
import { Expense } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ExpenseCardProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export const ExpenseCard: React.FC<ExpenseCardProps> = ({
  expense,
  onEdit,
  onDelete,
}) => {
  const { themeMode } = useExpenses();
  const colors = Colors[themeMode];

  const categoryInfo = Categories[expense.category] || Categories.Other;

  // Format date nicely (e.g., Jun 9, 2026)
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const handleDeletePress = () => {
    // Show confirmation dialog before delete
    Alert.alert(
      'Delete Expense',
      `Are you sure you want to delete "${expense.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => onDelete(expense.id), style: 'destructive' },
      ]
    );
  };

  return (
    <View 
      style={[
        styles.card, 
        { 
          backgroundColor: colors.card, 
          borderColor: colors.border,
          shadowColor: colors.cardShadow,
        }
      ]}
    >
      <View style={styles.mainContent}>
        <View style={[styles.iconBadge, { backgroundColor: categoryInfo.color + '16' }]}>
          <Ionicons name={categoryInfo.icon as any} size={20} color={categoryInfo.color} />
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.titleRow}>
            <Text style={[styles.titleText, { color: colors.text }]} numberOfLines={1}>
              {expense.title}
            </Text>
            <View style={[styles.amountPill, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
              <Text style={[styles.amountText, { color: colors.text }]}> 
                Rs {expense.amount.toLocaleString()}
              </Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <View style={[styles.categoryPill, { backgroundColor: categoryInfo.color + '16' }]}>
              <Text style={[styles.categoryText, { color: categoryInfo.color }]}> 
                {expense.category}
              </Text>
            </View>
            <Text style={styles.dot}>•</Text>
            <Text style={[styles.dateText, { color: colors.textSecondary }]}> 
              {formatDate(expense.date)}
            </Text>
          </View>

          {expense.notes ? (
            <Text style={[styles.notesText, { color: colors.textSecondary }]} numberOfLines={2}>
              {expense.notes}
            </Text>
          ) : null}

          <View style={styles.actionsRow}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}
              onPress={() => onEdit(expense)}
              activeOpacity={0.7}
            >
              <Ionicons name="pencil-outline" size={15} color={colors.primary} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}
              onPress={handleDeletePress}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={15} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
  },
  mainContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconBadge: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  titleText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
    letterSpacing: 0.1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  categoryPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
  },
  dot: {
    color: '#A0A4AE',
    fontSize: 8,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '500',
  },
  notesText: {
    fontSize: 11,
    fontStyle: 'italic',
    lineHeight: 15,
  },
  amountPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
  },
  amountText: {
    fontSize: 13,
    fontWeight: '800',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});

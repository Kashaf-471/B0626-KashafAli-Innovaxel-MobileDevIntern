import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Categories, Colors } from '@/constants/theme';
import { CategoryType } from '@/types';
import { useExpenses } from '@/hooks/useExpenses';
import { Ionicons } from '@expo/vector-icons';

interface CategoryPickerProps {
  selectedCategory: CategoryType | '';
  onSelect: (category: CategoryType) => void;
  error?: string;
}

export const CategoryPicker: React.FC<CategoryPickerProps> = ({
  selectedCategory,
  onSelect,
  error,
}) => {
  const { themeMode } = useExpenses();
  const colors = Colors[themeMode];

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>Category</Text>
      
      <View style={styles.grid}>
        {Object.keys(Categories).map((key) => {
          const categoryObj = Categories[key];
          const isSelected = selectedCategory === categoryObj.name;
          
          return (
            <TouchableOpacity
              key={categoryObj.name}
              style={[
                styles.card,
                {
                  backgroundColor: isSelected 
                    ? categoryObj.color + '1A' // 10% opacity color background
                    : (themeMode === 'light' ? '#FFFFFF' : '#1D0F1B'),
                  borderColor: isSelected 
                    ? categoryObj.color 
                    : colors.border,
                }
              ]}
              onPress={() => onSelect(categoryObj.name)}
              activeOpacity={0.7}
            >
              <View 
                style={[
                  styles.iconContainer, 
                  { 
                    backgroundColor: isSelected ? categoryObj.color : (themeMode === 'light' ? '#FFF0F3' : '#231522') 
                  }
                ]}
              >
                <Ionicons 
                  name={categoryObj.icon as any} 
                  size={22} 
                  color={isSelected ? '#FFFFFF' : categoryObj.color} 
                />
              </View>
              <Text 
                style={[
                  styles.cardName, 
                  { 
                    color: colors.text,
                    fontWeight: isSelected ? '700' : '500',
                  }
                ]}
              >
                {categoryObj.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {error ? (
        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  card: {
    width: '31%', // grid of 3 columns
    aspectRatio: 1.1,
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardName: {
    fontSize: 12,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
    marginLeft: 4,
  },
});

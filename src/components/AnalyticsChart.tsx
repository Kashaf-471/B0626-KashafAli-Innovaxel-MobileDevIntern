import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';
import { useExpenses } from '@/hooks/useExpenses';
import { Colors, Categories } from '@/constants/theme';
import { CategoryType } from '@/types';
import { Ionicons } from '@expo/vector-icons';

export const AnalyticsChart: React.FC = () => {
  const { categoryTotals, totalSpent, themeMode } = useExpenses();
  const colors = Colors[themeMode];
  const { width } = useWindowDimensions();

  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);

  // Generate category items list
  const categoryData = Object.keys(Categories).map((key) => {
    const cat = Categories[key];
    const amount = categoryTotals[cat.name] || 0;
    const percentage = totalSpent > 0 ? (amount / totalSpent) * 100 : 0;
    return {
      ...cat,
      amount,
      percentage,
    };
  }).filter(item => item.amount > 0); // Only show categories with spending

  // Donut chart constants
  const size = 180;
  const radius = 65;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * radius;

  // Compute segments
  let accumulatedPercentage = 0;
  const segments = categoryData.map((item) => {
    const percentage = item.percentage;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    const rotation = (accumulatedPercentage / 100) * 360;
    accumulatedPercentage += percentage;
    return {
      ...item,
      strokeDashoffset,
      rotation,
    };
  });

  const displayTitle = selectedCategory 
    ? selectedCategory 
    : 'Total Spent';

  const displayAmount = selectedCategory
    ? categoryTotals[selectedCategory]
    : totalSpent;

  const displayPercentage = selectedCategory && totalSpent > 0
    ? ((categoryTotals[selectedCategory] / totalSpent) * 100).toFixed(1) + '%'
    : null;

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.title, { color: colors.text }]}>Spending Overview</Text>

      {categoryData.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="pie-chart-outline" size={64} color={colors.textSecondary} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No expenses to summarize yet. Add some items to view charts.
          </Text>
        </View>
      ) : (
        <View style={styles.content}>
          {/* Interactive Donut SVG */}
          <View style={styles.chartWrapper}>
            <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
              <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
                {/* Background Ring */}
                <Circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke={themeMode === 'light' ? '#FFF0F3' : '#231522'}
                  strokeWidth={strokeWidth}
                  fill="none"
                />
                
                {/* Colored Segments */}
                {segments.map((segment) => (
                  <Circle
                    key={segment.name}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={segment.color}
                    strokeWidth={strokeWidth + (selectedCategory === segment.name ? 3 : 0)} // thicken on select
                    strokeDasharray={circumference}
                    strokeDashoffset={segment.strokeDashoffset}
                    strokeLinecap="round"
                    fill="none"
                    transform={`rotate(${segment.rotation} ${size / 2} ${size / 2})`}
                    onPress={() => {
                      setSelectedCategory(selectedCategory === segment.name ? null : segment.name);
                    }}
                  />
                ))}
              </G>
            </Svg>

            {/* Central Text Panel */}
            <View style={styles.centerTextContainer}>
              <Text style={[styles.centerSubText, { color: colors.textSecondary }]}>
                {displayTitle}
              </Text>
              <Text style={[styles.centerAmountText, { color: colors.text }]}>
                Rs {displayAmount.toLocaleString()}
              </Text>
              {displayPercentage && (
                <Text style={[styles.centerPercentText, { color: colors.primary }]}>
                  {displayPercentage}
                </Text>
              )}
            </View>
          </View>

          {/* Interactive Category Details & Progress Bars */}
          <View style={styles.listContainer}>
            {categoryData.map((item) => {
              const isSelected = selectedCategory === item.name;
              return (
                <TouchableOpacity
                  key={item.name}
                  style={[
                    styles.categoryRow,
                    { 
                      backgroundColor: isSelected ? (themeMode === 'light' ? '#FFE8EF' : '#2D1627') : 'transparent',
                      borderRadius: 12,
                    }
                  ]}
                  onPress={() => setSelectedCategory(isSelected ? null : item.name)}
                >
                  <View style={styles.rowTop}>
                    <View style={styles.categoryInfo}>
                      <View style={[styles.iconBadge, { backgroundColor: item.color + '1A' }]}>
                        <Ionicons name={item.icon as any} size={18} color={item.color} />
                      </View>
                      <Text style={[styles.categoryName, { color: colors.text, fontWeight: isSelected ? '700' : '500' }]}>
                        {item.name}
                      </Text>
                    </View>
                    <View style={styles.amountInfo}>
                      <Text style={[styles.categoryAmount, { color: colors.text }]}>
                        Rs {item.amount.toLocaleString()}
                      </Text>
                      <Text style={[styles.categoryPercent, { color: colors.textSecondary }]}>
                        {item.percentage.toFixed(0)}%
                      </Text>
                    </View>
                  </View>

                  {/* Horizontal progress bar */}
                  <View style={[styles.progressBarBg, { backgroundColor: themeMode === 'light' ? '#FFE3E8' : '#2E1C29' }]}>
                    <View 
                      style={[
                        styles.progressBarFill, 
                        { 
                          backgroundColor: item.color,
                          width: `${item.percentage}%` 
                        }
                      ]} 
                    />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    shadowColor: '#FFD0DA',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  content: {
    alignItems: 'center',
  },
  chartWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  centerTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    height: 120,
  },
  centerSubText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  centerAmountText: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  centerPercentText: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  listContainer: {
    width: '100%',
    gap: 8,
  },
  categoryRow: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryName: {
    fontSize: 14,
  },
  amountInfo: {
    alignItems: 'flex-end',
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  categoryPercent: {
    fontSize: 11,
    marginTop: 1,
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    width: '100%',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
});

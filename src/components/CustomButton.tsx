import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '@/constants/theme';
import { useExpenses } from '@/hooks/useExpenses';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  type?: 'primary' | 'secondary' | 'outline' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  type = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const { themeMode } = useExpenses();
  const colors = Colors[themeMode];

  const getButtonStyles = () => {
    const base: ViewStyle = {};
    if (disabled) {
      base.backgroundColor = themeMode === 'light' ? '#F0F0F0' : '#2A2A2A';
      return base;
    }

    switch (type) {
      case 'primary':
        base.backgroundColor = colors.primary;
        break;
      case 'secondary':
        base.backgroundColor = themeMode === 'light' ? '#FFE8EF' : '#2D1627';
        break;
      case 'outline':
        base.backgroundColor = 'transparent';
        base.borderWidth = 1.5;
        base.borderColor = colors.primary;
        break;
      case 'danger':
        base.backgroundColor = colors.error;
        break;
    }
    return base;
  };

  const getTextStyle = () => {
    const base: TextStyle = {};
    if (disabled) {
      base.color = themeMode === 'light' ? '#B0B0B0' : '#606060';
      return base;
    }

    switch (type) {
      case 'primary':
      case 'danger':
        base.color = '#FFFFFF';
        break;
      case 'secondary':
        base.color = colors.primary;
        break;
      case 'outline':
        base.color = colors.primary;
        break;
    }
    return base;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[styles.button, getButtonStyles(), style]}
    >
      {loading ? (
        <ActivityIndicator color={type === 'primary' || type === 'danger' ? '#FFFFFF' : colors.primary} />
      ) : (
        <Text style={[styles.text, getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    flexDirection: 'row',
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

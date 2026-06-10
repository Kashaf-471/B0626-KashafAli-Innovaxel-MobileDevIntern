import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { Colors } from '@/constants/theme';
import { useExpenses } from '@/hooks/useExpenses';

interface CustomInputProps extends TextInputProps {
  label: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  label,
  error,
  containerStyle,
  onFocus,
  onBlur,
  style,
  ...rest
}) => {
  const { themeMode } = useExpenses();
  const colors = Colors[themeMode];
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      
      <TextInput
        style={[
          styles.input,
          {
            color: colors.text,
            backgroundColor: themeMode === 'light' ? '#FFFFFF' : '#1D0F1B',
            borderColor: error 
              ? colors.error 
              : isFocused 
                ? colors.primary 
                : colors.border,
          },
          style,
        ]}
        placeholderTextColor={themeMode === 'light' ? '#A0A4AE' : '#6A6670'}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...rest}
      />
      
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
  input: {
    height: 52,
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
    marginLeft: 4,
  },
});

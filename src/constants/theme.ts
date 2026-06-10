import { Platform } from 'react-native';
import { CategoryInfo } from '../types';

export const Colors = {
  light: {
    primary: '#FF4B81',          // Vibrant Pink
    secondary: '#FF8FA3',        // Soft Pastel Pink
    accent: '#D93B6B',           // Deep Rose
    background: '#FFF5F7',       // Delicate Blush Background
    card: '#FFFFFF',             // Card White
    text: '#3A101C',             // Dark Wine Text
    textSecondary: '#8A6670',    // Muted Rose-Gray
    border: '#FFE3E8',           // Delicate Pink Border
    tint: '#FF4B81',             // Primary Tint
    success: '#E85A8A',          // Pink accent success
    error: '#D32F2F',
    cardShadow: '#FFD0DA',
    backgroundElement: '#FFF0F3',  // Added back for template compatibility
    backgroundSelected: '#FFE3E8', // Added back for template compatibility
  },
  dark: {
    primary: '#FF5E97',          // Bright Neon Pink
    secondary: '#FF9FBE',        // Soft Coral Pink
    accent: '#E24A7F',           // Medium Hot Pink
    background: '#12090F',       // Dark Violet-Plum
    card: '#1D0F1B',             // Rich Aubergine Card
    text: '#FFE8EF',             // Light Blush Text
    textSecondary: '#B599A3',    // Muted Lavender-Rose
    border: '#2E1A29',           // Deep Dark Wine Border
    tint: '#FF5E97',             // Neon Pink Tint
    success: '#FF8FA3',
    error: '#EF5350',
    cardShadow: '#000000',
    backgroundElement: '#1D0F1B',  // Added back for template compatibility
    backgroundSelected: '#2D1627', // Added back for template compatibility
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  none: 0,
  half: 4,
  one: 8,
  two: 12,
  three: 16,
  four: 24,
  five: 32,
  six: 48,
} as const;

export const Categories: Record<string, CategoryInfo> = {
  Food: {
    name: 'Food',
    icon: 'fast-food',
    color: '#FF4B81',
  },
  Transport: {
    name: 'Transport',
    icon: 'car',
    color: '#FF7597',
  },
  Utilities: {
    name: 'Utilities',
    icon: 'flash',
    color: '#D93B6B',
  },
  Entertainment: {
    name: 'Entertainment',
    icon: 'game-controller',
    color: '#FF8FA3',
  },
  Shopping: {
    name: 'Shopping',
    icon: 'cart',
    color: '#C71585',
  },
  Other: {
    name: 'Other',
    icon: 'ellipsis-horizontal-circle',
    color: '#FFB7C5',
  },
};

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Alert, TouchableOpacity, Platform } from 'react-native';
import { useExpenses } from '../../hooks/useExpenses';
import { Colors } from '../../constants/theme';
import { CustomButton } from '../../components/CustomButton';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ref, remove } from 'firebase/database';
import { database } from '../../utils/firebase';

export default function SettingsScreen() {
  const { 
    expenses, 
    totalSpent, 
    themeMode, 
    toggleTheme, 
    syncMode, 
    userId 
  } = useExpenses();

  const colors = Colors[themeMode];

  const handleResetData = () => {
    Alert.alert(
      'Reset All Data',
      'This will permanently delete all local expenses and remote Firebase sync transactions. Are you sure you want to proceed?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset Everything', 
          style: 'destructive',
          onPress: async () => {
            try {
              // 1. Delete from Firebase if active
              if (syncMode === 'Firebase' && database && userId) {
                const userRef = ref(database, `users/${userId}`);
                await remove(userRef);
              }
              // 2. Clear Async storage
              await AsyncStorage.removeItem('@personal_expenses_v1');
              
              Alert.alert('Success', 'All database items have been cleared. Please restart or refresh the app.');
            } catch (error) {
              console.error('Reset error:', error);
              Alert.alert('Error', 'Failed to clear some elements.');
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Appearance Group */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Appearance</Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <View style={[styles.iconBadge, { backgroundColor: colors.primary + '1A' }]}>
                <Ionicons name="moon-outline" size={20} color={colors.primary} />
              </View>
              <View>
                <Text style={[styles.settingTitle, { color: colors.text }]}>Dark Mode</Text>
                <Text style={[styles.settingSub, { color: colors.textSecondary }]}>Toggle dark aesthetic theme</Text>
              </View>
            </View>
            <Switch
              value={themeMode === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: '#FFE3E8', true: colors.primary }}
              thumbColor={themeMode === 'dark' ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>
        </View>

        {/* Cloud Sync & Firebase Group */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Cloud Sync Status</Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          
          {/* Sync Mode */}
          <View style={styles.infoRow}>
            <View style={styles.settingInfo}>
              <View style={[styles.iconBadge, { backgroundColor: '#4CAF501A' }]}>
                <Ionicons 
                  name={syncMode === 'Firebase' ? 'cloud-done-outline' : 'cloud-offline-outline'} 
                  size={20} 
                  color={syncMode === 'Firebase' ? '#4CAF50' : colors.textSecondary} 
                />
              </View>
              <View>
                <Text style={[styles.settingTitle, { color: colors.text }]}>Database Connection</Text>
                <Text style={[styles.settingSub, { color: colors.textSecondary }]}>
                  {syncMode === 'Firebase' ? 'Realtime Database Active' : 'Offline Storage Fallback'}
                </Text>
              </View>
            </View>
            <View style={[styles.badge, { backgroundColor: syncMode === 'Firebase' ? '#E8F5E9' : '#FFF3E0' }]}>
              <Text style={[styles.badgeText, { color: syncMode === 'Firebase' ? '#2E7D32' : '#E65100' }]}>
                {syncMode}
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Sync User Node ID */}
          <View style={styles.infoCol}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Your Firebase Reference ID</Text>
            <View style={[styles.codeBox, { backgroundColor: themeMode === 'light' ? '#FFF5F7' : '#1D0F1B', borderColor: colors.border }]}>
              <Text style={[styles.codeText, { color: colors.primary }]}>{userId || 'N/A'}</Text>
            </View>
            <Text style={[styles.infoHint, { color: colors.textSecondary }]}>
              Your transactions are stored in Firebase Realtime Database at path: {'\n'}
              <Text style={{ fontWeight: '700' }}>users/{userId || '...'}/expenses</Text>
            </Text>
          </View>

        </View>

        {/* Analytics Stats Group */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Application Stats</Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.statsRow}>
            <View style={styles.statCell}>
              <Text style={[styles.statNum, { color: colors.primary }]}>{expenses.length}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Expenses</Text>
            </View>
            <View style={[styles.verticalDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statCell}>
              <Text style={[styles.statNum, { color: colors.primary }]}>Rs {totalSpent.toLocaleString()}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Outflow</Text>
            </View>
          </View>
        </View>

        {/* Maintenance Group */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Maintenance</Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.maintenanceInner}>
            <Text style={[styles.maintenanceDesc, { color: colors.textSecondary }]}>
              Delete all transaction items and reset the database to clean slate.
            </Text>
            <CustomButton
              title="Reset Database"
              onPress={handleResetData}
              type="danger"
            />
          </View>
        </View>

        {/* Developer Info Credit */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>Personal Expense Tracker</Text>
          <Text style={[styles.footerSubText, { color: colors.textSecondary }]}>Innovaxel Take-Home Assessment</Text>
          <Text style={[styles.footerVer, { color: colors.primary }]}>v1.0.0 (Expo SDK 56)</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
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
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 16,
    marginLeft: 4,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 10,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  settingSub: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 1,
  },
  divider: {
    height: 1.5,
    marginVertical: 14,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  infoCol: {
    gap: 8,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  codeBox: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  codeText: {
    fontSize: 14,
    fontFamily: Platform.select({ ios: 'Courier New', android: 'monospace', default: 'monospace' }),
    fontWeight: '700',
  },
  infoHint: {
    fontSize: 11,
    lineHeight: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statCell: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statNum: {
    fontSize: 20,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  verticalDivider: {
    width: 1.5,
    height: 40,
  },
  maintenanceInner: {
    gap: 12,
  },
  maintenanceDesc: {
    fontSize: 12,
    lineHeight: 18,
  },
  footer: {
    alignItems: 'center',
    marginTop: 30,
    gap: 4,
  },
  footerText: {
    fontSize: 13,
    fontWeight: '700',
  },
  footerSubText: {
    fontSize: 11,
  },
  footerVer: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
});
